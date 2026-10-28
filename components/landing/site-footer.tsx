import Link from "next/link"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { focusRing } from "@/components/landing/styles"

const COLUMNS = [
  {
    title: "Produto",
    links: [
      { href: "#recursos", label: "Recursos" },
      { href: "#precos", label: "Preços" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { href: "#como-funciona", label: "Como funciona" },
      { href: "#faq", label: "Perguntas frequentes" },
      { href: "/login", label: "Entrar" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
            Respostas inteligentes para as avaliações do Google, feitas para negócios locais brasileiros.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="text-sm font-medium text-zinc-200">{column.title}</p>
            <ul className="mt-4 space-y-3 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn("rounded text-zinc-500 transition-colors hover:text-white", focusRing)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-zinc-600 sm:flex-row sm:justify-between sm:px-6">
          <p>© 2026 Replyr. Todos os direitos reservados.</p>
          <p>Google e Google Business Profile são marcas da Google LLC.</p>
        </div>
      </div>
    </footer>
  )
}
