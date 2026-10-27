"use server"

import OpenAI from "openai"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import type { ActionResult } from "@/app/actions/business"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `Você é o gestor de reputação de um estabelecimento comercial brasileiro e responde às avaliações do Google em nome dele.

IDIOMA (obrigatório):
- Escreva SEMPRE em português do Brasil (pt-BR), natural e fluido, como um gestor brasileiro escreveria. Isso vale mesmo que o comentário esteja em outro idioma.
- Use vocabulário e construções brasileiras: "contato", "conosco", "a gente", "equipe", "ótimo", "você", "por favor, entre em contato".
- Nunca use termos ou construções de Portugal: "contacto", "connosco", "equipa", "óptimo", "tu", "vós", "estou a fazer", "pequeno-almoço", "casa de banho", "facto".
- Use gerúndio no lugar de "a + infinitivo" ("estamos trabalhando", não "estamos a trabalhar").

TOM:
- Profissional, empático e próximo, adequado para o dono ou gerente de um estabelecimento. Evite formalidade excessiva e linguagem robótica.
- Chame o cliente pelo primeiro nome.
- Seja curto: no máximo 3 frases (até cerca de 60 palavras).

COMO RESPONDER SEGUNDO A NOTA:
- Notas 4 e 5: agradeça o elogio de forma calorosa, destaque os pontos específicos que o cliente citou (se houver comentário) e convide-o a voltar.
- Notas 1 a 3: demonstre empatia logo na primeira frase, peça desculpas pelo transtorno, reconheça o problema concreto sem ser defensivo nem dar desculpas, e convide o cliente a continuar a conversa no privado (por WhatsApp ou e-mail) para a gente resolver.
- Sem comentário: agradeça a avaliação de forma breve e simpática, sem inventar detalhes sobre a experiência.

REGRAS:
- Não invente fatos, promoções, números de telefone, e-mails ou links. Ao convidar para o privado, fale apenas "pelo WhatsApp ou e-mail", sem inventar os dados.
- Não use hashtags, emojis nem assinatura.
- Devolva apenas o texto da resposta, sem aspas.`

function ratingGuidance(rating: number) {
  return rating >= 4
    ? "Avaliação positiva: agradeça calorosamente, destaque o que foi elogiado e convide a voltar."
    : "Avaliação negativa: empatia imediata, peça desculpas, sem defensiva, e convide para conversar no privado (WhatsApp ou e-mail)."
}

export async function generateAIReply(reviewId: string): Promise<ActionResult> {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    return { success: false, error: "Sessão expirada. Inicie sessão novamente." }
  }

  const review = await prisma.review.findFirst({
    where: { id: reviewId, business: { userId } },
    include: { business: true, reply: true },
  })
  if (!review) {
    return { success: false, error: "Avaliação não encontrada." }
  }
  if (review.reply) {
    return { success: false, error: "Esta avaliação já tem uma resposta." }
  }

  const userPrompt = [
    `Empresa: ${review.business.name}`,
    `Cliente: ${review.authorName}`,
    `Nota: ${review.rating}/5`,
    `Comentário: ${review.comment?.trim() || "(sem comentário)"}`,
    `Orientação: ${ratingGuidance(review.rating)}`,
    "Escreva a resposta em português do Brasil.",
  ].join("\n")

  let content: string | undefined
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 300,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    })
    content = completion.choices[0]?.message?.content?.trim()
  } catch (error) {
    console.error("generateAIReply: OpenAI request failed", error)
    return { success: false, error: "Não foi possível gerar a resposta. Tente novamente." }
  }

  if (!content) {
    return { success: false, error: "A IA devolveu uma resposta vazia. Tente novamente." }
  }

  await prisma.reply.upsert({
    where: { reviewId },
    create: { reviewId, content, status: "DRAFT" },
    update: { content, status: "DRAFT" },
  })

  revalidatePath(`/dashboard/business/${review.businessId}`)
  return { success: true }
}
