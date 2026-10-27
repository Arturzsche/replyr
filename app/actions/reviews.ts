"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { GbpApiError, isSimulatedReview, replyToRealReview, resolveBusinessLocation } from "@/lib/gbp"
import { GoogleAuthError } from "@/lib/google"
import type { ActionResult } from "@/app/actions/business"

async function getUserId() {
  const session = await auth()
  return session?.user?.id ?? null
}

async function findOwnedReply(replyId: string, userId: string) {
  return prisma.reply.findFirst({
    where: { id: replyId, review: { business: { userId } } },
    include: {
      review: {
        select: {
          id: true,
          businessId: true,
          googleReviewId: true,
          business: {
            select: { id: true, userId: true, googleLocationId: true, googleAccountId: true },
          },
        },
      },
    },
  })
}

function googleErrorMessage(error: unknown) {
  if (error instanceof GoogleAuthError) return error.message
  if (error instanceof GbpApiError) {
    if (error.status === 401 || error.status === 403) {
      return "O Google recusou o pedido. Verifique se a sua conta gere este local e entre novamente com o Google."
    }
    if (error.status === 404) return "A avaliação ou o local não foram encontrados no Google."
  }
  return "Não foi possível publicar a resposta no Google. Tente novamente."
}

export async function publishReply(replyId: string, content: string): Promise<ActionResult> {
  const userId = await getUserId()
  if (!userId) {
    return { success: false, error: "Sessão expirada. Inicie sessão novamente." }
  }

  const text = content.trim()
  if (!text) {
    return { success: false, error: "A resposta não pode estar vazia." }
  }

  const reply = await findOwnedReply(replyId, userId)
  if (!reply) {
    return { success: false, error: "Resposta não encontrada." }
  }

  const { review } = reply
  // Seeded/simulated reviews don't exist on Google, so there is nothing to publish remotely.
  if (!isSimulatedReview(review.googleReviewId)) {
    try {
      const { accountId, locationId } = await resolveBusinessLocation(review.business)
      await replyToRealReview(userId, accountId, locationId, review.googleReviewId, text)
    } catch (error) {
      console.error("publishReply: Google publish failed", error)
      return { success: false, error: googleErrorMessage(error) }
    }
  }

  await prisma.$transaction([
    prisma.reply.update({
      where: { id: reply.id },
      data: { content: text, status: "PUBLISHED", publishedAt: new Date() },
    }),
    prisma.review.update({
      where: { id: reply.review.id },
      data: { status: "REPLIED" },
    }),
  ])

  revalidatePath(`/dashboard/business/${reply.review.businessId}`)
  return { success: true }
}

export async function discardReply(replyId: string): Promise<ActionResult> {
  const userId = await getUserId()
  if (!userId) {
    return { success: false, error: "Sessão expirada. Inicie sessão novamente." }
  }

  const reply = await findOwnedReply(replyId, userId)
  if (!reply) {
    return { success: false, error: "Resposta não encontrada." }
  }
  if (reply.status === "PUBLISHED") {
    return { success: false, error: "Não é possível descartar uma resposta já publicada." }
  }

  await prisma.reply.delete({ where: { id: reply.id } })

  revalidatePath(`/dashboard/business/${reply.review.businessId}`)
  return { success: true }
}

// Temporary helper until the Google Business Profile sync exists. Disabled in production.
export async function seedTestReviews(businessId: string): Promise<ActionResult> {
  if (process.env.NODE_ENV === "production") {
    return { success: false, error: "Indisponível em produção." }
  }

  const userId = await getUserId()
  if (!userId) {
    return { success: false, error: "Sessão expirada. Inicie sessão novamente." }
  }

  const business = await prisma.business.findFirst({
    where: { id: businessId, userId },
    include: { _count: { select: { reviews: true } } },
  })
  if (!business) {
    return { success: false, error: "Empresa não encontrada." }
  }
  if (business._count.reviews > 0) {
    return { success: false, error: "Esta empresa já tem avaliações." }
  }

  const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  await prisma.review.createMany({
    data: [
      {
        businessId,
        googleReviewId: `test-${businessId}-1`,
        authorName: "Mariana Costa",
        rating: 5,
        comment: null,
        reviewCreatedAt: daysAgo(1),
      },
      {
        businessId,
        googleReviewId: `test-${businessId}-2`,
        authorName: "João Ferreira",
        rating: 4,
        comment:
          "Atendimento muito simpático e rápido. O espaço é acolhedor e a qualidade excelente. Só não dou 5 estrelas porque o estacionamento é difícil.",
        reviewCreatedAt: daysAgo(3),
      },
      {
        businessId,
        googleReviewId: `test-${businessId}-3`,
        authorName: "Ricardo Almeida",
        rating: 1,
        comment:
          "Esperei mais de 40 minutos e ninguém me deu qualquer explicação. Quando finalmente fui atendido, o pedido veio errado. Muito dececionante.",
        reviewCreatedAt: daysAgo(6),
      },
    ],
  })

  revalidatePath(`/dashboard/business/${businessId}`)
  return { success: true }
}
