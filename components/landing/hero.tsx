import { BellRing, MessageSquareHeart, Timer } from "lucide-react"
import { cn } from "@/lib/utils"
import { CtaButton } from "@/components/landing/cta-button"
import { Reveal } from "@/components/landing/reveal"
import { ReviewCards } from "@/components/landing/review-cards"
import { focusRing } from "@/components/landing/styles"

const TRUST = [
  { icon: Timer, label: "Setup em 2 minutos" },
  { icon: MessageSquareHeart, label: "Zero respostas robóticas" },
  { icon: BellRing, label: "Alertas imediatos via e-mail" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient: grid fading from the top + emerald spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-emerald-900/20 blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-4 pt-36 pb-24 sm:px-6 lg:grid-cols-[1fr_1.02fr] lg:gap-12 lg:pt-44 lg:pb-32">
        <Reveal>
          <p className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-zinc-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Integração Oficial Google Business Profile • IA em PT-BR
          </p>

          <h1 className="mt-7 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-6xl lg:text-[4rem]">
            <span className="bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent">
              Transforme cada avaliação do{" "}
            </span>
            <span
              className="font-medium tracking-normal whitespace-nowrap"
              style={{ fontFamily: "'Product Sans', Futura, 'Trebuchet MS', sans-serif" }}
            >
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </span>{" "}
            <span className="bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent">
              em{" "}
            </span>
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              faturamento recorrente.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-zinc-400">
            O Replyr monitora o seu perfil 24/7, avisa no seu e-mail assim que entra uma avaliação crítica
            e escreve respostas educadas, empáticas e adequadas a cada avaliação. Você revisa e publica em 1
            clique.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CtaButton withGoogleIcon>Conectar meu Google grátis</CtaButton>
            <a
              href="#como-funciona"
              className={cn(
                "inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-6 text-[0.9375rem] font-medium text-zinc-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white",
                focusRing
              )}
            >
              Ver como funciona
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-400">
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="size-4 text-emerald-400" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <ReviewCards />
        </Reveal>
      </div>
    </section>
  )
}
