import { CountUp } from "@/components/landing/count-up"
import { Reveal } from "@/components/landing/reveal"

const STATS = [
  {
    value: (
      <>
        +<CountUp value={88} />%
      </>
    ),
    label: "dos consumidores preferem empresas que respondem às avaliações",
  },
  {
    value: (
      <>
        &lt;&nbsp;<CountUp value={30} />s
      </>
    ),
    label: "tempo médio para aprovar e publicar uma resposta",
  },
  { value: "24/7", label: "monitoramento automático em segundo plano (Cron Sync)" },
  {
    value: (
      <>
        <CountUp value={100} />%
      </>
    ),
    label: "calibrado para as expressões e regionalismos do Brasil",
  },
]

export function StatsStrip() {
  return (
    <section aria-label="Métricas" className="border-y border-white/[0.06] bg-white/[0.02]">
      <Reveal className="mx-auto grid max-w-6xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4">
        {STATS.map((stat, index) => (
          <div
            key={stat.label}
            className={[
              "px-2 py-10 sm:px-6 lg:py-12",
              index % 2 === 1 ? "border-l border-white/[0.06]" : "",
              index >= 2 ? "border-t border-white/[0.06] lg:border-t-0" : "",
              index === 2 ? "lg:border-l" : "",
            ].join(" ")}
          >
            <p className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-3xl font-semibold tracking-[-0.03em] text-transparent tabular-nums sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-pretty text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
