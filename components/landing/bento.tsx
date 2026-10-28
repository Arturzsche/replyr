import { AlertTriangle, Check, MapPin, RefreshCw, Sparkles, TrendingUp, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/landing/reveal"
import { SectionHeading } from "@/components/landing/section-heading"
import { Stars } from "@/components/landing/stars"
import { glassCard } from "@/components/landing/styles"

function BentoCard({
  className,
  visual,
  title,
  description,
  delay,
}: {
  className?: string
  visual: React.ReactNode
  title: string
  description: string
  delay?: number
}) {
  return (
    <Reveal delay={delay} className={className}>
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden transition-colors hover:border-white/[0.14]",
          glassCard
        )}
      >
        <div className="relative flex min-h-[230px] flex-1 items-center justify-center overflow-hidden border-b border-white/[0.06] bg-black/15 p-6">
          {visual}
        </div>
        <div className="p-6 sm:p-7">
          <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
          <p className="mt-2 leading-relaxed text-pretty text-zinc-400">{description}</p>
        </div>
      </article>
    </Reveal>
  )
}

const SYNC_LOG = [
  { time: "08:00", text: "2 novas avaliações capturadas", tone: "text-emerald-400" },
  { time: "07:00", text: "Nenhuma alteração", tone: "text-zinc-500" },
  { time: "06:00", text: "1 avaliação 1★ · alerta enviado", tone: "text-amber-400" },
  { time: "05:00", text: "Nenhuma alteração", tone: "text-zinc-500" },
]

function SyncVisual() {
  return (
    <div className="flex w-full max-w-xl items-center gap-8" aria-hidden="true">
      {/* Radar */}
      <div className="relative hidden size-40 shrink-0 sm:block">
        <div className="absolute inset-0 rounded-full border border-emerald-400/15" />
        <div className="absolute inset-5 rounded-full border border-emerald-400/15" />
        <div className="absolute inset-10 rounded-full border border-emerald-400/20" />
        <div className="animate-sweep absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_280deg,rgba(16,185,129,0.35)_360deg)]" />
        <span className="animate-blip absolute top-7 right-9 size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
        <span className="animate-blip absolute bottom-10 left-8 size-1.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] [animation-delay:1.6s]" />
        <span className="animate-blip absolute top-16 left-5 size-1.5 rounded-full bg-emerald-400 [animation-delay:2.8s]" />
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid size-9 place-items-center rounded-full border border-white/10 bg-[#2C3035]">
            <MapPin className="size-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Cron log */}
      <div className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-[#2C3035] p-4 font-mono text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between text-zinc-500">
          <span className="flex items-center gap-1.5">
            <RefreshCw className="size-3 animate-spin [animation-duration:3s]" />
            cron · /api/sync
          </span>
          <span className="text-emerald-400">ativo</span>
        </div>
        <ul className="mt-3 space-y-2">
          {SYNC_LOG.map((entry, i) => (
            <li key={entry.time} className={cn("flex gap-3", i > 1 && "opacity-50")}>
              <span className="text-zinc-600 tabular-nums">{entry.time}</span>
              <span className={cn("truncate", entry.tone)}>{entry.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function AlertVisual() {
  return (
    <div className="relative w-full max-w-xs" aria-hidden="true">
      <div className="absolute inset-x-6 -bottom-3 h-12 rounded-xl border border-white/[0.06] bg-[#2C3035]/60" />
      <div className="absolute inset-x-3 -bottom-1.5 h-12 rounded-xl border border-white/[0.06] bg-[#2C3035]" />
      <div className="relative rounded-xl border border-red-400/25 bg-[#2C3035] p-4 shadow-[0_0_40px_-12px_rgba(248,113,113,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between text-[0.6875rem] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-red-400" />
            </span>
            alertas@replyr · agora
          </span>
        </div>
        <p className="mt-2.5 flex gap-2 text-sm leading-snug font-medium text-white">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-400" />
          Nova avaliação de 1 estrela detectada
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
          Clique para responder antes que afete sua nota.
        </p>
        <div className="mt-3 inline-flex rounded-md bg-white px-2.5 py-1 text-[0.6875rem] font-semibold text-zinc-950">
          Responder agora
        </div>
      </div>
    </div>
  )
}

function DnaVisual() {
  return (
    <div className="w-full max-w-xs space-y-3 text-sm" aria-hidden="true">
      <div className="rounded-xl border border-red-400/20 bg-red-500/[0.04] p-3.5">
        <p className="flex items-center gap-1.5 text-[0.6875rem] font-medium text-red-400">
          <X className="size-3.5" /> Resposta genérica traduzida
        </p>
        <p className="mt-1.5 leading-relaxed text-zinc-500 line-through decoration-red-400/70">
          Prezado cliente, agradecemos o seu valioso feedback. A sua satisfação é a nossa prioridade.
        </p>
      </div>
      <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/[0.06] p-3.5 shadow-[0_0_32px_-12px_rgba(52,211,153,0.45)]">
        <p className="flex items-center gap-1.5 text-[0.6875rem] font-medium text-emerald-400">
          <Check className="size-3.5" /> Replyr
        </p>
        <p className="mt-1.5 leading-relaxed text-zinc-200">
          Valeu demais, Ana! Que bom que você curtiu o açaí da casa. Volta logo que a gente te espera!
        </p>
      </div>
    </div>
  )
}

const BARS = [42, 48, 46, 58, 64, 72, 80, 92]

const LOCAL_PACK = [
  { name: "Seu negócio", rating: "4,9", reviews: "312", highlight: true },
  { name: "Concorrente A", rating: "4,4", reviews: "198", highlight: false },
  { name: "Concorrente B", rating: "4,1", reviews: "87", highlight: false },
]

function SeoVisual() {
  return (
    <div className="grid w-full max-w-xl items-center gap-6 sm:grid-cols-2" aria-hidden="true">
      <div>
        <div className="flex items-baseline gap-2 tabular-nums">
          <span className="text-2xl font-semibold text-zinc-500">4,2★</span>
          <TrendingUp className="size-4 self-center text-emerald-400" />
          <span className="bg-gradient-to-b from-white to-amber-200 bg-clip-text text-4xl font-semibold tracking-tight text-transparent">
            4,9★
          </span>
        </div>
        <div className="mt-4 flex h-20 items-end gap-1.5">
          {BARS.map((height, i) => (
            <div
              key={i}
              style={{ height: `${height}%` }}
              className={cn(
                "flex-1 rounded-t-sm",
                i === BARS.length - 1
                  ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.6)]"
                  : "bg-gradient-to-t from-emerald-500/10 to-emerald-400/40"
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-[0.6875rem] text-zinc-500">Nota média · últimos 8 meses</p>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#2C3035] p-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <p className="px-2 pt-1 pb-2 text-[0.6875rem] text-zinc-500">Google Maps · “pizzaria perto de mim”</p>
        <ul className="space-y-1">
          {LOCAL_PACK.map((place, i) => (
            <li
              key={place.name}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2 py-2",
                place.highlight && "bg-emerald-400/10 ring-1 ring-emerald-400/30"
              )}
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full text-[0.625rem] font-semibold tabular-nums",
                  place.highlight ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400"
                )}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className={cn("truncate text-xs font-medium", place.highlight ? "text-white" : "text-zinc-400")}>
                  {place.name}
                </p>
                <p className="flex items-center gap-1 text-[0.625rem] text-zinc-500 tabular-nums">
                  {place.rating} <Stars rating={Math.round(Number(place.rating.replace(",", ".")))} className="[&_svg]:size-2.5" /> ({place.reviews})
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function Bento() {
  return (
    <section id="recursos" className="relative scroll-mt-28">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <SectionHeading
          eyebrow="Recursos"
          title="Tudo o que a sua reputação precisa, rodando sozinho."
          description="Do momento em que o cliente publica a avaliação até a resposta no ar, o Replyr cuida do trabalho repetitivo. Você só aprova."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          <BentoCard
            className="md:col-span-2"
            visual={<SyncVisual />}
            title="Sincronização automática em background"
            description="Um Cron Job consulta o Google em ciclos regulares e traz cada avaliação nova para o painel, sem você precisar abrir o Perfil da Empresa."
          />
          <BentoCard
            delay={0.08}
            visual={<AlertVisual />}
            title="Alertas anti-crise por e-mail"
            description="Avaliação nova entrou? Você recebe um e-mail na hora, com a nota, o comentário e um atalho para responder."
          />
          <BentoCard
            visual={<DnaVisual />}
            title="IA com DNA brasileiro"
            description="Nada de português de tradutor. Respostas curtas, calorosas e com as expressões que o seu cliente usa."
          />
          <BentoCard
            delay={0.08}
            className="md:col-span-2"
            visual={<SeoVisual />}
            title="Impulso no SEO local e no Google Maps"
            description="Perfis que respondem com frequência transmitem confiança a quem pesquisa, o que ajuda o seu negócio a disputar os primeiros lugares do pacote local."
          />
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-zinc-500">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Ilustrações meramente demonstrativas.
        </p>
      </div>
    </section>
  )
}
