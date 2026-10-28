import { Bento } from "@/components/landing/bento"
import { Comparison } from "@/components/landing/comparison"
import { Faq } from "@/components/landing/faq"
import { FinalCta } from "@/components/landing/final-cta"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Navbar } from "@/components/landing/navbar"
import { Pricing } from "@/components/landing/pricing"
import { SiteFooter } from "@/components/landing/site-footer"
import { StatsStrip } from "@/components/landing/stats-strip"

export default function Home() {
  // `dark` flips the shadcn tokens for everything inside the landing page.
  return (
    <div className="dark min-h-screen overflow-x-clip bg-[#1F2226] text-zinc-50 antialiased selection:bg-emerald-500/30">
      <Navbar />
      <main>
        <Hero />
        <StatsStrip />
        <Bento />
        <Comparison />
        <HowItWorks />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
