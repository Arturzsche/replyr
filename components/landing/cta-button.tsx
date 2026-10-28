import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { GoogleIcon } from "@/components/google-icon"
import { focusRing } from "@/components/landing/styles"

type CtaButtonProps = {
  href?: string
  children: React.ReactNode
  size?: "sm" | "lg"
  /** Show Google's "G" before the label (sign-in CTAs). */
  withGoogleIcon?: boolean
  className?: string
}

/** Primary conversion button: solid emerald pill, soft diffuse shadow, arrow that nudges on hover. */
export function CtaButton({ href = "/login", children, size = "lg", withGoogleIcon = false, className }: CtaButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 font-semibold whitespace-nowrap text-white shadow-lg shadow-emerald-500/25 transition-[background-color,box-shadow] duration-200 hover:bg-emerald-500 hover:shadow-emerald-500/40",
        size === "lg" ? "h-12 px-7 text-[0.9375rem]" : "h-9 px-4 text-sm",
        focusRing,
        className
      )}
    >
      {withGoogleIcon ? (
        <span className="grid size-6 place-items-center rounded-full bg-white">
          <GoogleIcon className="size-3.5" />
        </span>
      ) : null}
      <span>{children}</span>
      <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}
