import { Navbar }              from "@/components/layout/navbar"
import { PortfolioHero }       from "@/components/portfolio/hero"
import { PortfolioProjects }   from "@/components/portfolio/projects"
import { FrontendChallenges }  from "@/components/portfolio/challenges"
import { FeaturedWork }        from "@/components/sections/featured-work"
import { Footer }              from "@/components/layout/footer"
import { TechStack } from "@/components/portfolio/Stack"
import { PortfolioCTA } from "@/components/portfolio/cta"

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <PortfolioHero />
      <PortfolioProjects />
      <FrontendChallenges />
      <TechStack />
      <PortfolioCTA />
      {/* Optionally include the existing featured-work film strip below */}
      {/* <FeaturedWork /> */}
      <Footer />
    </>
  )
}