"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    let raf: number
    const animate = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      // Stop the RAF loop FIRST — no more lenis.raf() calls after this
      cancelAnimationFrame(raf)
      // Then destroy — this is now safe because RAF is already stopped
      // and we are NOT calling ScrollTrigger.refresh() anywhere
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}