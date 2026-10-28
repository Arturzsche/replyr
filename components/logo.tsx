import { cn } from "@/lib/utils"

type LogoProps = {
  /** The wordmark colour comes from here; override `text-white` on light surfaces. */
  className?: string
}

/** Wordmark only: "Replyr" in heavy, tight type, closed by an emerald full stop. */
export function Logo({ className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-baseline text-xl leading-none font-extrabold tracking-tighter text-white", className)}>
      Replyr
      <span aria-hidden="true" className="text-emerald-500">
        .
      </span>
    </span>
  )
}
