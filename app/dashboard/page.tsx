import Link from "next/link"
import { redirect } from "next/navigation"
import { Building2, MapPin, MessageSquareText } from "lucide-react"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { AddBusinessDialog } from "@/components/dashboard/add-business-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) redirect("/")

  const businesses = await prisma.business.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  if (businesses.length === 0) {
    return (
      <div className="bg-background flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-20 text-center">
        <div className="bg-muted mb-4 flex size-12 items-center justify-center rounded-full">
          <Building2 className="text-muted-foreground size-6" />
        </div>
        <h2 className="text-xl font-semibold">Ainda não tem empresas</h2>
        <p className="text-muted-foreground mt-2 mb-6 max-w-sm text-sm">
          Adicione a sua primeira empresa para começar a acompanhar e responder às avaliações dos
          seus clientes no Google.
        </p>
        <AddBusinessDialog />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">As suas empresas</h1>
          <p className="text-muted-foreground text-sm">
            Selecione uma empresa para gerir as respetivas avaliações.
          </p>
        </div>
        <AddBusinessDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {businesses.map((business) => (
          <Card key={business.id} className="justify-between">
            <CardHeader>
              <CardTitle>{business.name}</CardTitle>
              <CardDescription className="flex items-start gap-1.5">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                <span>{business.address ?? "Morada não indicada"}</span>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/dashboard/business/${business.id}`}>
                  <MessageSquareText />
                  Gerir Avaliações
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
