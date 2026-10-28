import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth, signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { GoogleIcon } from "@/components/google-icon"
import { Logo } from "@/components/logo"

export const metadata: Metadata = {
  title: "Entrar · Replyr",
}

export default async function LoginPage() {
  const session = await auth()
  if (session?.user) redirect("/dashboard")

  return (
    <main className="bg-muted/30 flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="bg-background w-full max-w-sm rounded-xl border p-8 shadow-sm">
        <Link href="/" className="inline-flex">
          <Logo className="text-slate-900" />
        </Link>
        <h1 className="mt-8 text-xl font-semibold tracking-tight">Entre na sua conta</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Use a conta Google que administra o Perfil da Empresa do seu negócio.
        </p>
        <form
          className="mt-6"
          action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/dashboard" })
          }}
        >
          <Button type="submit" variant="outline" size="lg" className="w-full">
            <GoogleIcon />
            Continuar com o Google
          </Button>
        </form>
        <p className="text-muted-foreground mt-6 text-xs leading-relaxed">
          O Replyr pede acesso de gestão ao Perfil da Empresa apenas para ler avaliações e publicar as
          respostas que você aprovar.
        </p>
      </div>
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground mt-6 text-sm transition-colors"
      >
        ← Voltar para o início
      </Link>
    </main>
  )
}
