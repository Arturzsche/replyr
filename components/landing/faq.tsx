"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/landing/reveal"
import { SectionHeading } from "@/components/landing/section-heading"
import { focusRing, glassCard } from "@/components/landing/styles"

const QUESTIONS = [
  {
    question: "A integração com o Google é segura?",
    answer:
      "Sim. A conexão usa o login oficial do Google (OAuth) e a API oficial do Perfil da Empresa. O Replyr nunca vê a sua senha, e você pode revogar o acesso a qualquer momento nas configurações da sua Conta Google.",
  },
  {
    question: "A IA publica as respostas sozinha ou pede minha aprovação?",
    answer:
      "Ela pede aprovação. Toda resposta gerada fica como rascunho no painel. Você pode editar, descartar ou publicar, e nada vai para o Google sem o seu clique.",
  },
  {
    question: "Funciona para mais de um endereço ou unidade?",
    answer:
      "Funciona. Cada unidade aparece separada no painel, com as suas próprias avaliações e o e-mail de alerta que você escolher. O número de perfis depende do plano.",
  },
  {
    question: "Vou receber alertas de todas as avaliações antigas?",
    answer:
      "Não. Na primeira sincronização, o Replyr importa o histórico em silêncio para não lotar a sua caixa de entrada. Os alertas começam a partir das avaliações novas.",
  },
  {
    question: "As respostas soam naturais para o cliente brasileiro?",
    answer:
      "Sim. A IA escreve em português do Brasil, chama o cliente pelo nome, cita o que ele comentou e evita frases de tradutor. Em críticas, ela demonstra empatia e convida a continuar a conversa no privado.",
  },
]

function FaqItem({ question, answer, defaultOpen = false }: { question: string; answer: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()

  return (
    <div className="border-b border-white/[0.06] last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "flex w-full items-center justify-between gap-6 rounded-xl px-6 py-5 text-left font-medium text-zinc-100 transition-colors hover:text-white",
            focusRing
          )}
        >
          {question}
          <span
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-full border border-white/10 transition-all duration-300",
              open && "rotate-45 border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
            )}
          >
            <Plus className="size-3.5" aria-hidden="true" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 leading-relaxed text-pretty text-zinc-400">{answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:py-32">
        <SectionHeading eyebrow="FAQ" title="Perguntas frequentes." />
        <Reveal className={cn("mt-12", glassCard)}>
          {QUESTIONS.map((item, index) => (
            <FaqItem key={item.question} {...item} defaultOpen={index === 0} />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
