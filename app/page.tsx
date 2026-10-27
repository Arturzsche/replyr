import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-4xl font-bold tracking-tight">Replyr</h1>
      <form
        action={async () => {
          "use server"
          await signIn("google", { redirectTo: "/dashboard" })
        }}
      >
        <Button type="submit" size="lg">
          Entrar com o Google
        </Button>
      </form>
    </main>
  )
}
