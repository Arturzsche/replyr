import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { UserMenu } from "@/components/dashboard/user-menu"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  if (!session?.user) redirect("/")

  const { name, email, image } = session.user

  return (
    <div className="bg-muted/30 min-h-screen">
      <header className="bg-background sticky top-0 z-40 border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight">
            Replyr
          </Link>
          <UserMenu name={name} email={email} image={image} />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}
