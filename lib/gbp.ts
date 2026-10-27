import type { Auth } from "googleapis"
import { getGoogleAuthClient } from "@/lib/google"
import { prisma } from "@/lib/prisma"

// The Reviews API only exists in the legacy v4 surface, which googleapis does not ship a typed
// client for, so these calls go through the authorised OAuth2 client's request() helper.
const GBP_V4 = "https://mybusiness.googleapis.com/v4"
const ACCOUNT_MANAGEMENT_V1 = "https://mybusinessaccountmanagement.googleapis.com/v1"

const MAX_REVIEW_PAGES = 20

export type GoogleStarRating = "STAR_RATING_UNSPECIFIED" | "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE"

export type GoogleReview = {
  name: string
  reviewId: string
  reviewer?: { displayName?: string; profilePhotoUrl?: string; isAnonymous?: boolean }
  starRating?: GoogleStarRating
  comment?: string
  createTime: string
  updateTime?: string
  reviewReply?: { comment: string; updateTime?: string }
}

type ListReviewsResponse = {
  reviews?: GoogleReview[]
  nextPageToken?: string
  totalReviewCount?: number
  averageRating?: number
}

type ListAccountsResponse = {
  accounts?: { name: string; accountName?: string; type?: string }[]
  nextPageToken?: string
}

export class GbpApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message)
    this.name = "GbpApiError"
  }
}

const STAR_VALUES: Record<GoogleStarRating, number> = {
  STAR_RATING_UNSPECIFIED: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
}

export function starRatingToNumber(rating: GoogleStarRating | undefined) {
  return rating ? STAR_VALUES[rating] : 0
}

/** Strips the "(Translated by Google)" block Google appends to non-native-language comments. */
export function cleanReviewComment(comment: string | undefined) {
  if (!comment) return null
  const original = comment.split(/\n*\(Translated by Google\)/)[0].replace(/^\(Original\)\n?/, "")
  return original.trim() || null
}

/** Accepts "accounts/A/locations/L", "locations/L" or a bare "L". */
export function parseLocationId(value: string): { accountId: string | null; locationId: string } {
  const full = value.trim().match(/^accounts\/([^/]+)\/locations\/([^/]+)$/)
  if (full) return { accountId: full[1], locationId: full[2] }
  return { accountId: null, locationId: value.trim().replace(/^locations\//, "") }
}

function stripPrefix(id: string, prefix: string) {
  return id.startsWith(`${prefix}/`) ? id.slice(prefix.length + 1) : id
}

async function gbpRequest<T>(
  client: Auth.OAuth2Client,
  options: { url: string; method?: "GET" | "PUT"; params?: Record<string, string | number>; data?: unknown },
): Promise<T> {
  try {
    const response = await client.request<T>(options)
    return response.data
  } catch (error) {
    const err = error as { status?: number; response?: { status?: number; data?: unknown }; message?: string }
    const status = err.response?.status ?? err.status
    const details = err.response?.data ? JSON.stringify(err.response.data) : err.message
    throw new GbpApiError(`Google Business Profile API ${status ?? "error"}: ${details}`, status)
  }
}

/** Lists the GBP accounts (personal and location groups) the user can manage. */
export async function listGbpAccounts(userId: string) {
  const client = await getGoogleAuthClient(userId)
  const accounts: NonNullable<ListAccountsResponse["accounts"]> = []
  let pageToken: string | undefined
  do {
    const page = await gbpRequest<ListAccountsResponse>(client, {
      url: `${ACCOUNT_MANAGEMENT_V1}/accounts`,
      params: { pageSize: 20, ...(pageToken ? { pageToken } : {}) },
    })
    accounts.push(...(page.accounts ?? []))
    pageToken = page.nextPageToken
  } while (pageToken)
  return accounts.map((account) => ({ ...account, accountId: stripPrefix(account.name, "accounts") }))
}

/**
 * Finds which of the user's GBP accounts owns a location by probing its reviews endpoint.
 * Returns null when none of the accounts can access it.
 */
export async function findAccountForLocation(userId: string, locationId: string) {
  const client = await getGoogleAuthClient(userId)
  const accounts = await listGbpAccounts(userId)
  const location = stripPrefix(locationId, "locations")
  for (const account of accounts) {
    try {
      await gbpRequest(client, {
        url: `${GBP_V4}/accounts/${account.accountId}/locations/${location}/reviews`,
        params: { pageSize: 1 },
      })
      return account.accountId
    } catch (error) {
      if (error instanceof GbpApiError && (error.status === 403 || error.status === 404)) continue
      throw error
    }
  }
  return null
}

/** Fetches every review of a location (newest first), following pagination. */
export async function fetchRealReviews(
  userId: string,
  accountId: string,
  locationId: string,
): Promise<GoogleReview[]> {
  const client = await getGoogleAuthClient(userId)
  const account = stripPrefix(accountId, "accounts")
  const location = stripPrefix(locationId, "locations")

  const reviews: GoogleReview[] = []
  let pageToken: string | undefined
  let pages = 0
  do {
    const page = await gbpRequest<ListReviewsResponse>(client, {
      url: `${GBP_V4}/accounts/${account}/locations/${location}/reviews`,
      params: { pageSize: 50, orderBy: "updateTime desc", ...(pageToken ? { pageToken } : {}) },
    })
    reviews.push(...(page.reviews ?? []))
    pageToken = page.nextPageToken
    pages++
  } while (pageToken && pages < MAX_REVIEW_PAGES)

  return reviews
}

/** Reviews created by the dev seeder or the old sync simulation; they don't exist on Google. */
export function isSimulatedReview(googleReviewId: string) {
  return googleReviewId.startsWith("test-") || googleReviewId.startsWith("sim-")
}

/**
 * Resolves the GBP account and location IDs for a business. When the account isn't known yet it is
 * parsed from googleLocationId or discovered via the API, then stored on the business.
 */
export async function resolveBusinessLocation(business: {
  id: string
  userId: string
  googleLocationId: string
  googleAccountId: string | null
}): Promise<{ accountId: string; locationId: string }> {
  const parsed = parseLocationId(business.googleLocationId)
  if (business.googleAccountId) {
    return { accountId: business.googleAccountId, locationId: parsed.locationId }
  }

  const accountId = parsed.accountId ?? (await findAccountForLocation(business.userId, parsed.locationId))
  if (!accountId) {
    throw new GbpApiError(
      `Nenhuma conta do Perfil da Empresa do utilizador tem acesso ao local ${parsed.locationId}.`,
      404,
    )
  }

  await prisma.business.update({ where: { id: business.id }, data: { googleAccountId: accountId } })
  return { accountId, locationId: parsed.locationId }
}

/** Creates or updates the owner's reply to a review on Google. */
export async function replyToRealReview(
  userId: string,
  accountId: string,
  locationId: string,
  reviewId: string,
  replyText: string,
) {
  const client = await getGoogleAuthClient(userId)
  const account = stripPrefix(accountId, "accounts")
  const location = stripPrefix(locationId, "locations")
  return gbpRequest<{ comment: string; updateTime: string }>(client, {
    url: `${GBP_V4}/accounts/${account}/locations/${location}/reviews/${encodeURIComponent(reviewId)}/reply`,
    method: "PUT",
    data: { comment: replyText },
  })
}
