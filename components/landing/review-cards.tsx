"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { GoogleIcon } from "@/components/google-icon"
import { Stars } from "@/components/landing/stars"

type ReviewExample = {
  business: string
  author: string
  initials: string
  rating: number
  time: string
  review: string
  reply: string
}

const EXAMPLES: ReviewExample[] = [
  {
    business: "Forno di Nonna · Pizzaria",
    author: "Rafael Martins",
    initials: "RM",
    rating: 5,
    time: "há 12 min",
    review:
      "Melhor pizza de calabresa que já comi em SP! Massa fininha, chegou quentinha e o entregador foi super educado.",
    reply:
      "Rafael, muito obrigado pela avaliação! Ficamos felizes em saber que a calabresa e o atendimento do nosso entregador agradaram tanto. Será um prazer receber o seu próximo pedido.",
  },
  {
    business: "Sorriso Pleno · Odontologia",
    author: "Patrícia Almeida",
    initials: "PA",
    rating: 1,
    time: "há 4 min",
    review:
      "Marquei às 14h e só fui atendida às 15h20. Ninguém na recepção deu satisfação. Saí me sentindo desrespeitada.",
    reply:
      "Patrícia, pedimos sinceras desculpas pela espera e pela falta de comunicação da recepção. O seu tempo merece respeito. Já estamos revisando a nossa agenda e gostaríamos de conversar com você pelo WhatsApp ou e-mail.",
  },
]

function ReviewCard({ example }: { example: ReviewExample }) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.1)] sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-xs text-zinc-500">
          <GoogleIcon className="size-3.5" />
          {example.business}
        </p>
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
          <Check className="size-3.5" aria-hidden="true" />
          Respondida
        </span>
      </header>

      <div className="mt-4 flex gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600 ring-1 ring-zinc-200">
          {example.initials}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-semibold text-zinc-900">{example.author}</p>
            <Stars rating={example.rating} surface="light" />
            <span className="text-xs text-zinc-500">{example.time}</span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-pretty text-zinc-600">{example.review}</p>
        </div>
      </div>

      <div className="mt-5 rounded-r-lg border-l-2 border-emerald-500 bg-zinc-50 py-3 pr-3 pl-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Resposta do proprietário · gerada pelo Replyr
        </p>
        <p className="mt-2 text-sm leading-relaxed text-pretty text-zinc-800">{example.reply}</p>
      </div>
    </article>
  )
}

/** Hero visual: a praise and a complaint, each with the reply Replyr drafted for it. */
export function ReviewCards() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="relative space-y-5">
        {EXAMPLES.map((example, index) => (
          <motion.div
            key={example.author}
            className={cn(index === 0 ? "lg:mr-10" : "lg:ml-10")}
            animate={reduceMotion ? undefined : { y: [0, index === 0 ? -6 : 6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.8 }}
          >
            <ReviewCard example={example} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
