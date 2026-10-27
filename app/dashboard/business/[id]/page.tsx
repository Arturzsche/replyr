import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, MapPin, MessageSquareDashed } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ReviewCard } from "@/components/dashboard/review-card"
import { SeedReviewsButton } from "@/components/dashboard/seed-reviews-button"
import { TestEmailButton } from "@/components/dashboard/test-email-button"
import { Button } from "@/components/ui/button"

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) redirect("/")

  const business = await prisma.business.findFirst({
    where: { id, userId },
    include: {
      reviews: {
        include: { reply: true },
        orderBy: { reviewCreatedAt: "desc" },
      },
    },
  })
  if (!business) redirect("/dashboard")

  const isDev = process.env.NODE_ENV !== "production"
  const { reviews } = business

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/dashboard">
            <ArrowLeft />
            Voltar ao Dashboard
          </Link>
        </Button>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{business.name}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
              <MapPin className="size-3.5" />
              {business.address ?? "Morada não indicada"}
            </p>
          </div>
          {reviews.length > 0 && (
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground text-sm">
                {reviews.length} {reviews.length === 1 ? "avaliação" : "avaliações"}
              </p>
              {isDev && <TestEmailButton businessId={business.id} />}
            </div>
          )}
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-background flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-20 text-center">
          <div className="bg-muted mb-4 flex size-12 items-center justify-center rounded-full">
            <MessageSquareDashed className="text-muted-foreground size-6" />
          </div>
          <h2 className="text-xl font-semibold">Ainda não há avaliações</h2>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm">
            As avaliações do Google desta empresa vão aparecer aqui assim que a sincronização
            estiver ativa.
          </p>
          {isDev && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <SeedReviewsButton businessId={business.id} />
              <TestEmailButton businessId={business.id} />
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {reviews.map((review) => (
            // Keyed on the reply too, so the draft textarea re-initialises when a reply is generated.
            <ReviewCard key={`${review.id}:${review.reply?.id ?? "none"}`} review={review} />
          ))}
        </div>
      )}
    </div>
  )
}
