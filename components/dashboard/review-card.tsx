"use client"

import { useState, useTransition } from "react"
import { CheckCircle2, Send, Sparkles, Star, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Prisma } from "@prisma/client"
import { generateAIReply } from "@/app/actions/ai"
import { discardReply, publishReply } from "@/app/actions/reviews"
import type { ActionResult } from "@/app/actions/business"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type ReviewWithReply = Prisma.ReviewGetPayload<{ include: { reply: true } }>

const dateFormatter = new Intl.DateTimeFormat("pt-PT", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted",
          )}
        />
      ))}
    </div>
  )
}

const statusBadge: Record<string, { label: string; variant: "secondary" | "outline" | "default" }> = {
  PENDING: { label: "Pendente", variant: "secondary" },
  REPLIED: { label: "Respondida", variant: "default" },
  IGNORED: { label: "Ignorada", variant: "outline" },
}

export function ReviewCard({ review }: { review: ReviewWithReply }) {
  const { reply } = review
  const [draft, setDraft] = useState(reply?.content ?? "")
  const [pendingAction, setPendingAction] = useState<"generate" | "publish" | "discard" | null>(
    null,
  )
  const [isPending, startTransition] = useTransition()

  function run(action: NonNullable<typeof pendingAction>, fn: () => Promise<ActionResult>, ok: string) {
    setPendingAction(action)
    startTransition(async () => {
      const result = await fn()
      if (result.success) toast.success(ok)
      else toast.error(result.error)
      setPendingAction(null)
    })
  }

  const badge = statusBadge[review.status] ?? statusBadge.PENDING
  const busy = (action: NonNullable<typeof pendingAction>) => isPending && pendingAction === action

  return (
    <Card>
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">{review.authorName}</CardTitle>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
        <div className="text-muted-foreground flex items-center gap-3 text-sm">
          <Stars rating={review.rating} />
          <span>{dateFormatter.format(new Date(review.reviewCreatedAt))}</span>
        </div>
      </CardHeader>

      <CardContent>
        {review.comment ? (
          <p className="text-sm leading-relaxed whitespace-pre-line">{review.comment}</p>
        ) : (
          <p className="text-muted-foreground text-sm italic">Avaliação sem comentário.</p>
        )}
      </CardContent>

      {!reply && review.status === "PENDING" && (
        <CardFooter>
          <Button
            onClick={() =>
              run("generate", () => generateAIReply(review.id), "Resposta gerada com sucesso.")
            }
            disabled={isPending}
          >
            <Sparkles />
            {busy("generate") ? "A gerar resposta..." : "Gerar Resposta com IA"}
          </Button>
        </CardFooter>
      )}

      {reply?.status === "DRAFT" && (
        <CardFooter className="flex-col items-stretch gap-3">
          <label htmlFor={`reply-${reply.id}`} className="text-sm font-medium">
            Sugestão de resposta
          </label>
          <Textarea
            id={`reply-${reply.id}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            disabled={isPending}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => run("discard", () => discardReply(reply.id), "Resposta descartada.")}
              disabled={isPending}
            >
              <Trash2 />
              {busy("discard") ? "A descartar..." : "Descartar"}
            </Button>
            <Button
              onClick={() =>
                run("publish", () => publishReply(reply.id, draft), "Resposta publicada.")
              }
              disabled={isPending || !draft.trim()}
            >
              <Send />
              {busy("publish") ? "A publicar..." : "Publicar"}
            </Button>
          </div>
        </CardFooter>
      )}

      {reply?.status === "PUBLISHED" && (
        <CardFooter className="flex-col items-stretch gap-2">
          <div className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
            <CheckCircle2 className="size-4 text-emerald-600" />
            Resposta publicada
          </div>
          <p className="bg-muted rounded-md p-3 text-sm leading-relaxed whitespace-pre-line">
            {reply.content}
          </p>
        </CardFooter>
      )}
    </Card>
  )
}
