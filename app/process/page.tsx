import { Navbar }            from "@/components/layout/navbar"
import { ProcessHero }       from "@/components/process/hero"
import { ProcessPhases }     from "@/components/process/phases"
import { ProcessPrinciples } from "@/components/process/principles"
import { ProcessNumbers }    from "@/components/process/numbers"
import { ProcessCTA }        from "@/components/process/cta"
import { Footer }            from "@/components/layout/footer"

export default function ProcessPage() {
  return (
    <>
      <Navbar />
      <ProcessHero />
      <ProcessPhases />
      <ProcessPrinciples />
      <ProcessNumbers />
      <ProcessCTA />
      <Footer />
    </>
  )
}