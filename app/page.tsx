import { Navbar }       from "@/components/layout/navbar"
import { Hero }         from "@/components/sections/hero"
import { About }        from "@/components/sections/about"
import { Skills }       from "@/components/sections/skills"
import { FeaturedWork } from "@/components/sections/featured-work"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <FeaturedWork />
    </>
  )
}