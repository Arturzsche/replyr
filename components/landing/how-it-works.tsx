import { BrainCircuit, Link2, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/landing/reveal"
import { SectionHeading } from "@/components/landing/section-heading"
import { glassCard } from "@/components/landing/styles"

const STEPS = [
  {
    icon: Link2,
    title: "Conecte sua conta Google",
    description: "OAuth oficial e seguro em 2 cliques. Você nunca compartilha sua senha com a gente.",
  },
  {
    icon: BrainCircuit,
    title: "O Replyr monitora e redige",
    description: "A nossa IA lê cada avaliação nova e prepara a resposta ideal para aquele cliente.",
  },
  {
    icon: Send,
    title: "Aprove e publique",
    description: "Receba o alerta no e-mail, edite se quiser e publique direto no Google.",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative scroll-mt-28 border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <SectionHeading
          eyebrow="Como funciona"
          title="Do login à primeira resposta em menos de 5 minutos."
          description="Sem planilha, sem treinamento, sem instalar nada."
        />

        <div className="relative mt-16 grid gap-5 md:grid-cols-3">
          {/* Connector line: vertical on mobile, horizontal on desktop */}
          <div
            aria-hidden="true"
            className="absolute top-8 bottom-8 left-[2.75rem] w-px bg-gradient-to-b from-emerald-400/60 via-emerald-400/40 to-transparent md:top-[3.25rem] md:right-[16%] md:bottom-auto md:left-[16%] md:h-px md:w-auto md:bg-gradient-to-r"
          />
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 0.1}>
              <article className={cn("relative h-full p-6 sm:p-7", glassCard, "bg-[#26292E]")}>
                <div className="flex items-center gap-4 md:flex-col md:items-start">
                  <span className="relative grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-[#1A1C20] shadow-[0_0_24px_-6px_rgba(16,185,129,0.5)]">
                    <Icon className="size-5 text-emerald-400" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-sm text-zinc-500 tabular-nums md:mt-2">
                    {String(index + 1).padStart(2, "0")}.
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">{title}</h3>
                <p className="mt-2 leading-relaxed text-pretty text-zinc-400">{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
