import { Navbar }           from "@/components/layout/navbar"
import { ProcessHero }      from "@/components/process/hero"
import { ProcessLoop }      from "@/components/process/loop"
import { ProcessPrinciples} from "@/components/process/principles"
import { ProcessSplit }     from "@/components/process/split"
import { ProcessSignals }   from "@/components/process/signals"
import { ProcessFire }      from "@/components/process/fire"
import { Footer }           from "@/components/layout/footer"

export default function ProcessPage() {
  return (
    <>
      <Navbar />
      <ProcessHero />
      <ProcessLoop />
      <ProcessPrinciples />
      <ProcessSplit />
      <ProcessSignals />
      <ProcessFire />
      <Footer />
    </>
  )
}