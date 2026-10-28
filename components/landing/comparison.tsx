import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/landing/reveal"
import { SectionHeading } from "@/components/landing/section-heading"
import { glassCard } from "@/components/landing/styles"

const WITHOUT = [
  "Esquecer de responder por semanas e deixar o cliente falando sozinho",
  "Perder a cabeça com uma avaliação injusta e responder no calor do momento",
  "Copiar e colar a mesma resposta em tudo e queimar o filme da empresa",
  "Ver a nota cair e o negócio sumir do topo do Google Maps",
]

const WITH = [
  "Monitoramento automático: nenhuma avaliação passa batido",
  "Respostas sob medida para cada detalhe que o cliente citou",
  "Contenção imediata de avaliações negativas com alerta no e-mail",
  "Aprovação em 1 clique, direto do painel",
]

export function Comparison() {
  return (
    <section className="relative border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <SectionHeading
          eyebrow="Antes e depois"
          title="O caos manual vs. o padrão Replyr."
          description="Responder avaliações é simples. Fazer isso bem, todo dia, sem esquecer nenhuma, é que é difícil."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className={cn("h-full bg-white/[0.02] p-7 sm:p-8", glassCard)}>
              <p className="text-sm font-medium text-red-400/90">Sem Replyr</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-300">Reputação no improviso</h3>
              <ul className="mt-7 space-y-4">
                {WITHOUT.map((item) => (
                  <li key={item} className="flex gap-3 text-zinc-500">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-red-500/10 ring-1 ring-red-400/20">
                      <X className="size-3 text-red-400" aria-hidden="true" />
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative h-full rounded-2xl p-px">
              {/* Glowing emerald border */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl bg-gradient-to-b from-emerald-500/70 via-emerald-400/15 to-white/[0.06]"
              />
              <div className="relative h-full rounded-[calc(1rem-1px)] bg-[#26292E] p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] sm:p-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-40 rounded-t-2xl bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15),transparent_70%)]"
                />
                <p className="relative text-sm font-medium text-emerald-400">Com Replyr</p>
                <h3 className="relative mt-2 text-xl font-semibold tracking-tight text-white">Reputação no piloto automático</h3>
                <ul className="relative mt-7 space-y-4">
                  {WITH.map((item) => (
                    <li key={item} className="flex gap-3 text-zinc-200">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-400/15 ring-1 ring-emerald-400/40">
                        <Check className="size-3 text-emerald-400" aria-hidden="true" />
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
