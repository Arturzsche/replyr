"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export type ActionResult = { success: true } | { success: false; error: string }

function field(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

export async function createBusiness(formData: FormData): Promise<ActionResult> {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return { success: false, error: "Sessão expirada. Inicie sessão novamente." }
  }

  const name = field(formData, "name")
  const googleLocationId = field(formData, "googleLocationId")
  const address = field(formData, "address")

  if (!name || !googleLocationId) {
    return { success: false, error: "O nome e o ID do Local Google são obrigatórios." }
  }

  try {
    await prisma.business.create({
      data: {
        userId,
        name,
        googleLocationId,
        address: address || null,
      },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: "Já existe uma empresa registada com este ID do Local Google." }
    }
    console.error("createBusiness failed", error)
    return { success: false, error: "Não foi possível guardar a empresa. Tente novamente." }
  }

  revalidatePath("/dashboard")
  return { success: true }
}
