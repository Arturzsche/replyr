import { cn } from "@/lib/utils"
import { gradientText } from "@/components/landing/styles"
import { Reveal } from "@/components/landing/reveal"

type SectionHeadingProps = {
  eyebrow: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: "left" | "center"
}

export function SectionHeading({ eyebrow, title, description, align = "center" }: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className="text-sm font-medium text-emerald-400">{eyebrow}</p>
      <h2
        className={cn(
          "mt-3 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-[2.75rem] sm:leading-[1.1]",
          gradientText
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-lg leading-relaxed text-pretty text-zinc-400">{description}</p>
      ) : null}
    </Reveal>
  )
}
