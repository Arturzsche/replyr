"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { CtaButton } from "@/components/landing/cta-button"
import { focusRing } from "@/components/landing/styles"

const NAV = [
  { href: "#recursos", label: "Recursos" },
  { href: "#como-funciona", label: "Como Funciona" },
  { href: "#precos", label: "Preços" },
  { href: "#faq", label: "FAQ" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-4 z-50 mx-auto max-w-5xl px-4">
      <div className="rounded-full border border-white/10 bg-[#1A1C20]/75 py-2.5 pr-2 pl-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:pl-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="Replyr, página inicial" className={cn("flex items-center gap-2.5 rounded-full", focusRing)}>
            <Logo />
            <span className="hidden rounded-full border whitespace-nowrap sm:inline border-emerald-400/30 bg-emerald-400/10 px-1.5 py-0.5 text-[0.625rem] font-semibold tracking-wider text-emerald-300">
              BETA BR
            </span>
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white",
                  focusRing
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href="/login"
              className={cn(
                "hidden rounded-full px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:text-white sm:inline-flex",
                focusRing
              )}
            >
              Entrar
            </Link>
            <CtaButton size="sm">Começar grátis</CtaButton>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className={cn(
                "grid size-9 place-items-center rounded-full text-zinc-300 transition-colors hover:bg-white/5 hover:text-white lg:hidden",
                focusRing
              )}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Principal"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="mt-2 rounded-3xl border border-white/10 bg-[#1A1C20]/95 p-2 shadow-2xl backdrop-blur-xl lg:hidden"
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-2xl px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white",
                  focusRing
                )}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/login"
              className={cn(
                "block rounded-2xl px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white sm:hidden",
                focusRing
              )}
            >
              Entrar
            </Link>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
