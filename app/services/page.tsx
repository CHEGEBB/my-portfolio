import { Navbar }           from "@/components/layout/navbar"
import { ServicesHero }     from "@/components/services/hero"
import { ServicesGrid }     from "@/components/services/grid"
import { ServiceProcess }   from "@/components/services/process"
import { ServiceParallax }  from "@/components/services/parallax"
import { WhyHireMe }        from "@/components/services/why-hire-me"
import { ServiceCTA }       from "@/components/services/cta"
import { Footer }           from "@/components/layout/footer"

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <ServicesHero />
      <ServicesGrid />
      <ServiceProcess />
      <ServiceParallax />
      <WhyHireMe />
      <ServiceCTA />
      <Footer />
    </>
  )
}