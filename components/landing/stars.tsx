import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

type StarsProps = {
  rating: number
  className?: string
  /** Empty stars need a lighter grey on white cards than on the dark page. */
  surface?: "dark" | "light"
}

export function Stars({ rating, className, surface = "dark" }: StarsProps) {
  const empty = surface === "light" ? "fill-zinc-200 text-zinc-200" : "fill-zinc-700 text-zinc-700"

  return (
    <span className={cn("inline-flex gap-0.5", className)} role="img" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn("size-3.5", i < rating ? "fill-amber-400 text-amber-400" : empty)}
        />
      ))}
    </span>
  )
}
