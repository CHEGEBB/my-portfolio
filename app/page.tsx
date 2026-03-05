import { Navbar }      from "@/components/layout/navbar"
import { Hero }        from "@/components/sections/hero"
import { About }       from "@/components/sections/about"
import { Skills }      from "@/components/sections/skills"
import { FeaturedWork} from "@/components/sections/featured-work"
import { Services }    from "@/components/sections/service"
import { ContactCTA }  from "@/components/sections/contact-cta"
import { Footer }      from "@/components/layout/footer"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <FeaturedWork />
      <Services />
      <ContactCTA />
      <Footer />
    </>
  )
}