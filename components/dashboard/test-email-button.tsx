"use client"

import { useTransition } from "react"
import { Mail } from "lucide-react"
import { toast } from "sonner"
import { sendReviewAlertEmail } from "@/app/actions/emails"
import { Button } from "@/components/ui/button"

export function TestEmailButton({ businessId }: { businessId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await sendReviewAlertEmail(
            businessId,
            "Cliente Teste",
            2,
            "Este é um alerta de teste do Replyr. O atendimento demorou mais do que o esperado.",
          )
          if (result.success) toast.success("E-mail de alerta enviado.")
          else toast.error(result.error)
        })
      }
    >
      <Mail />
      {isPending ? "A enviar..." : "Testar Alerta de E-mail"}
    </Button>
  )
}
