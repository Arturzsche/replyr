"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/landing/reveal"
import { SectionHeading } from "@/components/landing/section-heading"
import { focusRing, glassCard } from "@/components/landing/styles"

type Billing = "monthly" | "yearly"

const PLANS = [
  {
    name: "Essencial",
    description: "Para o negócio de uma unidade que quer parar de esquecer avaliações.",
    price: { monthly: 59, yearly: 49 },
    features: ["1 Perfil do Google", "Sincronização automática", "Sugestões de resposta com IA", "Alertas por e-mail"],
    featured: false,
  },
  {
    name: "Pro",
    description: "Para quem tem mais de uma loja e quer cada uma sob controle.",
    price: { monthly: 119, yearly: 97 },
    features: [
      "Até 3 Perfis do Google",
      "E-mail de alerta próprio para cada loja",
      "Prioridade na sincronização",
      "Relatórios de reputação",
      "Tudo do Essencial",
    ],
    featured: true,
  },
  {
    name: "Agência / Redes",
    description: "Para agências e redes que cuidam da reputação de várias unidades.",
    price: { monthly: 297, yearly: 247 },
    features: [
      "Até 15 Perfis do Google",
      "Gestão centralizada multi-loja",
      "Suporte prioritário via WhatsApp",
      "Tudo do Pro",
    ],
    featured: false,
  },
]

function BillingToggle({ billing, onChange }: { billing: Billing; onChange: (value: Billing) => void }) {
  const options: { id: Billing; label: React.ReactNode }[] = [
    { id: "monthly", label: "Mensal" },
    {
      id: "yearly",
      label: (
        <>
          Anual{" "}
          <span className="ml-1 rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[0.6875rem] font-semibold text-emerald-300 tabular-nums">
            20% OFF
          </span>
        </>
      ),
    },
  ]

  return (
    <div
      role="radiogroup"
      aria-label="Período de cobrança"
      className="inline-flex rounded-full border border-white/10 bg-[#26292E] p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
    >
      {options.map((option) => {
        const active = option.id === billing
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active ? "text-white" : "text-zinc-400 hover:text-zinc-200",
              focusRing
            )}
          >
            {active ? (
              <motion.span
                layoutId="billing-pill"
                className="absolute inset-0 rounded-full bg-zinc-700/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            ) : null}
            <span className="relative inline-flex items-center">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("yearly")
  const reduceMotion = useReducedMotion()

  return (
    <section id="precos" className="relative scroll-mt-28 border-t border-white/[0.06]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-900/20 blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <SectionHeading
          eyebrow="Preços"
          title="Um plano para cada tamanho de operação."
          description="Comece grátis e só escolha um plano quando o Replyr já estiver respondendo por você."
        />

        <div className="mt-10 flex justify-center">
          <BillingToggle billing={billing} onChange={setBilling} />
        </div>

        <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
          {PLANS.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 0.08} className="h-full">
              <div className={cn("relative h-full rounded-2xl", plan.featured && "p-px")}>
                {plan.featured ? (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-b from-emerald-500/80 via-emerald-500/25 to-white/[0.06]"
                  />
                ) : null}
                <div
                  className={cn(
                    "relative flex h-full flex-col p-7 sm:p-8",
                    plan.featured
                      ? "rounded-[calc(1rem-1px)] bg-[#26292E] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                      : glassCard
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight text-white">{plan.name}</h3>
                    {plan.featured ? (
                      <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                        Mais popular
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 min-h-[3rem] text-sm leading-relaxed text-pretty text-zinc-400">
                    {plan.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-lg text-zinc-400">R$</span>
                    <span className="relative inline-flex h-12 min-w-[3.5ch] overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={plan.price[billing]}
                          initial={reduceMotion ? false : { y: 24, opacity: 0, filter: "blur(4px)" }}
                          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                          exit={{ y: -24, opacity: 0, filter: "blur(4px)" }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="text-5xl leading-none font-semibold tracking-[-0.03em] text-white tabular-nums"
                        >
                          {plan.price[billing]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span className="text-sm text-zinc-500">/mês</span>
                  </div>
                  <p className="mt-1 h-5 text-xs text-zinc-500 tabular-nums">
                    {billing === "yearly"
                      ? `R$ ${(plan.price.yearly * 12).toLocaleString("pt-BR")} cobrados anualmente`
                      : "Cobrança mensal"}
                  </p>

                  <Link
                    href="/login"
                    className={cn(
                      "mt-7 inline-flex h-11 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                      plan.featured
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-500"
                        : "border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.08]",
                      focusRing
                    )}
                  >
                    Começar grátis
                  </Link>

                  <ul className="mt-8 space-y-3 border-t border-white/[0.06] pt-7 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-zinc-300">
                        <Check
                          className={cn("mt-0.5 size-4 shrink-0", plan.featured ? "text-emerald-400" : "text-zinc-500")}
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
