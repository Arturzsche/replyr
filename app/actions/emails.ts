"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { deliverReviewAlert } from "@/lib/review-alert"
import type { ActionResult } from "@/app/actions/business"

export async function sendReviewAlertEmail(
  businessId: string,
  authorName: string,
  rating: number,
  comment: string,
): Promise<ActionResult> {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return { success: false, error: "Sessão expirada. Inicie sessão novamente." }
  }

  const business = await prisma.business.findFirst({
    where: { id: businessId, userId },
    select: { id: true, name: true, alertEmail: true, user: { select: { email: true } } },
  })
  if (!business) {
    return { success: false, error: "Empresa não encontrada." }
  }

  const to = business.alertEmail ?? business.user.email
  if (!to) {
    return { success: false, error: "Nenhum e-mail de alerta configurado para esta empresa." }
  }

  try {
    await deliverReviewAlert({
      to,
      businessId: business.id,
      businessName: business.name,
      authorName,
      rating,
      comment,
    })
  } catch (error) {
    console.error("sendReviewAlertEmail failed", error)
    return { success: false, error: "Não foi possível enviar o e-mail de alerta." }
  }

  return { success: true }
}
