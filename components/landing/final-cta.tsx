import { CtaButton } from "@/components/landing/cta-button"
import { Reveal } from "@/components/landing/reveal"
import { gradientText } from "@/components/landing/styles"
import { cn } from "@/lib/utils"

export function FinalCta() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:pb-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#26292E] px-6 py-20 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] sm:px-16 sm:py-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,rgba(16,185,129,0.16),transparent_60%),radial-gradient(ellipse_60%_60%_at_80%_100%,rgba(16,185,129,0.07),transparent_60%),radial-gradient(ellipse_50%_50%_at_10%_90%,rgba(16,185,129,0.05),transparent_60%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000,transparent)]"
            />
            <div className="relative">
              <h2
                className={cn(
                  "mx-auto max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl sm:leading-[1.08]",
                  gradientText
                )}
              >
                A próxima avaliação do seu negócio já pode chegar respondida.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pretty text-zinc-300">
                Conecte o seu Perfil da Empresa agora e veja as primeiras respostas sugeridas em minutos.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4">
                <CtaButton>Começar gratuitamente</CtaButton>
                <p className="text-sm text-zinc-400">Login com Google · Setup em 2 minutos</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
