import { AboutHero }      from "@/components/about/hero"
import { AboutStory }     from "@/components/about/story"
import { AboutManifesto } from "@/components/about/manifesto"
import { AboutTimeline }  from "@/components/about/timeline"
import { AboutIdentity }  from "@/components/about/identity"
import { Navbar }         from "@/components/layout/navbar"
import { Footer }         from "@/components/layout/footer"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutHero />
      <AboutStory />
      <AboutManifesto />
      <AboutTimeline />
      <AboutIdentity />
      <Footer />
    </>
  )
}