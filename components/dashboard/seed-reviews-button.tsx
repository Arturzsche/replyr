"use client"

import { useTransition } from "react"
import { FlaskConical } from "lucide-react"
import { toast } from "sonner"
import { seedTestReviews } from "@/app/actions/reviews"
import { Button } from "@/components/ui/button"

export function SeedReviewsButton({ businessId }: { businessId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await seedTestReviews(businessId)
          if (result.success) toast.success("Avaliações de teste adicionadas.")
          else toast.error(result.error)
        })
      }
    >
      <FlaskConical />
      {isPending ? "A injetar..." : "Injetar Avaliações de Teste"}
    </Button>
  )
}
