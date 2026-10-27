import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import {
  cleanReviewComment,
  fetchRealReviews,
  resolveBusinessLocation,
  starRatingToNumber,
  type GoogleReview,
} from "@/lib/gbp"
import { deliverReviewAlert } from "@/lib/review-alert"

export const dynamic = "force-dynamic"
export const maxDuration = 300

type SyncError = { businessId: string; step: "fetch" | "review" | "email"; message: string }

function isAuthorized(request: Request, secret: string) {
  const header = request.headers.get("authorization") ?? ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : header
  const expected = Buffer.from(secret)
  const received = Buffer.from(token)
  return expected.length === received.length && timingSafeEqual(expected, received)
}

function toReviewData(businessId: string, review: GoogleReview): Prisma.ReviewCreateInput {
  const replied = Boolean(review.reviewReply?.comment)
  return {
    business: { connect: { id: businessId } },
    googleReviewId: review.reviewId,
    authorName: review.reviewer?.isAnonymous
      ? "Anônimo"
      : review.reviewer?.displayName?.trim() || "Anônimo",
    authorPhotoUrl: review.reviewer?.profilePhotoUrl ?? null,
    rating: starRatingToNumber(review.starRating),
    comment: cleanReviewComment(review.comment),
    reviewCreatedAt: new Date(review.createTime),
    status: replied ? "REPLIED" : "PENDING",
    // Replies already posted on Google (e.g. by hand) are imported as published.
    ...(replied && review.reviewReply
      ? {
          reply: {
            create: {
              content: review.reviewReply.comment,
              status: "PUBLISHED",
              publishedAt: review.reviewReply.updateTime
                ? new Date(review.reviewReply.updateTime)
                : new Date(),
            },
          },
        }
      : {}),
  }
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    console.error("sync: CRON_SECRET is not configured")
    return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 })
  }
  if (!isAuthorized(request, secret)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const businesses = await prisma.business.findMany({
    select: {
      id: true,
      userId: true,
      name: true,
      googleLocationId: true,
      googleAccountId: true,
      alertEmail: true,
      user: { select: { email: true } },
    },
  })

  let reviewsFetched = 0
  let reviewsCreated = 0
  let emailsSent = 0
  const errors: SyncError[] = []

  // Sequential on purpose: keeps DB connections, Google quotas and Resend's rate limit under control.
  for (const business of businesses) {
    let googleReviews: GoogleReview[]
    try {
      const { accountId, locationId } = await resolveBusinessLocation(business)
      googleReviews = await fetchRealReviews(business.userId, accountId, locationId)
    } catch (error) {
      console.error(`sync: failed to fetch reviews for business ${business.id}`, error)
      errors.push({ businessId: business.id, step: "fetch", message: String(error) })
      continue
    }
    reviewsFetched += googleReviews.length
    if (googleReviews.length === 0) continue

    const existing = await prisma.review.findMany({
      where: { googleReviewId: { in: googleReviews.map((r) => r.reviewId) } },
      select: { googleReviewId: true },
    })
    const known = new Set(existing.map((r) => r.googleReviewId))
    const newReviews = googleReviews.filter((r) => !known.has(r.reviewId))
    if (newReviews.length === 0) continue

    // On a business's first real sync every historical review is "new"; import them silently
    // instead of flooding the owner's inbox.
    const syncedBefore = await prisma.review.count({
      where: {
        businessId: business.id,
        NOT: [{ googleReviewId: { startsWith: "test-" } }, { googleReviewId: { startsWith: "sim-" } }],
      },
    })
    const isInitialImport = syncedBefore === 0
    const alertTo = business.alertEmail ?? business.user.email

    for (const googleReview of newReviews) {
      let created
      try {
        created = await prisma.review.create({ data: toReviewData(business.id, googleReview) })
        reviewsCreated++
      } catch (error) {
        // A concurrent sync may have inserted it first.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") continue
        console.error(`sync: failed to store review ${googleReview.reviewId}`, error)
        errors.push({ businessId: business.id, step: "review", message: String(error) })
        continue
      }

      if (isInitialImport || created.status !== "PENDING" || !alertTo) continue
      try {
        await deliverReviewAlert({
          to: alertTo,
          businessId: business.id,
          businessName: business.name,
          authorName: created.authorName,
          rating: created.rating,
          comment: created.comment,
        })
        emailsSent++
      } catch (error) {
        console.error(`sync: failed to send alert for review ${created.id}`, error)
        errors.push({ businessId: business.id, step: "email", message: String(error) })
      }
    }
  }

  return NextResponse.json({
    ok: errors.length === 0,
    businessesProcessed: businesses.length,
    reviewsFetched,
    reviewsCreated,
    emailsSent,
    errors,
  })
}
