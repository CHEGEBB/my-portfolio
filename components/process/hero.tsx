"use client"

import { useEffect, useRef, useState, useCallback, Suspense } from "react"
import { useTheme } from "@/context/theme-context"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MeshDistortMaterial, Icosahedron } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"
import SplitType from "split-type"

function FloatingMesh({ color, mouse, scale }: { color: string; mouse: React.MutableRefObject<{ x: number; y: number }>; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = t * 0.10
    meshRef.current.rotation.y = t * 0.07
    meshRef.current.rotation.z = t * 0.04
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.current.x * viewport.width * 0.10, 0.04)
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.current.y * viewport.height * 0.07, 0.04)
    meshRef.current.scale.setScalar(scale * (1 + Math.sin(t * 0.55) * 0.04))
  })
  return (
    <Icosahedron ref={meshRef} args={[1.7, 3]}>
      <MeshDistortMaterial color={new THREE.Color(color)} distort={0.32} speed={1.6} roughness={0.1} metalness={0.6} transparent opacity={0.20} />
    </Icosahedron>
  )
}

function WireframeMesh({ color, mouse, scale }: { color: string; mouse: React.MutableRefObject<{ x: number; y: number }>; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = -t * 0.06
    meshRef.current.rotation.y = t * 0.11
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.current.x * viewport.width * 0.07, 0.03)
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.current.y * viewport.height * 0.05, 0.03)
    meshRef.current.scale.setScalar(scale)
  })
  return (
    <Icosahedron ref={meshRef} args={[2.2, 3]}>
      <meshBasicMaterial color={new THREE.Color(color)} wireframe transparent opacity={0.065} />
    </Icosahedron>
  )
}

export function ProcessHero() {
  const { theme }  = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const mouseRef   = useRef({ x: 0, y: 0 })
  const scrollDot  = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check, { passive: true })
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (!mounted || !headingRef.current || !subRef.current) return
    const ctx = gsap.context(() => {
      const splitHead = new SplitType(headingRef.current!, { types: "chars,words" })
      const splitSub  = new SplitType(subRef.current!,     { types: "words" })
      const tl = gsap.timeline({ delay: 0.3 })
      tl.fromTo(eyebrowRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0)
      tl.fromTo(splitHead.chars,
        { opacity: 0, y: 80, rotateX: -90, transformOrigin: "50% 100%" },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: { amount: 0.7, from: "start" }, ease: "back.out(1.4)" },
        0.2
      )
      tl.fromTo(splitSub.words,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: "power3.out" },
        0.9
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [mounted])

  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    mouseRef.current = {
      x:  ((e.clientX - r.left) / r.width  - 0.5) * 2,
      y: -((e.clientY - r.top)  / r.height - 0.5) * 2,
    }
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  useEffect(() => {
    const dot = scrollDot.current; if (!dot) return
    const id = setInterval(() => {
      dot.style.filter = "brightness(1.8)"
      setTimeout(() => { dot.style.filter = "brightness(0.5)" }, 500)
    }, 1100)
    return () => clearInterval(id)
  }, [])

  const meshScale = isMobile ? 0.52 : 1
  const fov       = isMobile ? 36 : 45

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100svh",
        overflow: "hidden",
        background: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        // Mobile: anchor text ~55% down so globe peeks above it. Desktop: keep at bottom.
        justifyContent: isMobile ? "center" : "flex-end",
        paddingTop: isMobile ? "52%" : undefined,
        padding: isMobile
          ? "0 clamp(1.5rem,6vw,5rem)"
          : "clamp(2rem,5vw,4rem) clamp(1.5rem,6vw,5rem)",
      }}
    >
      {/* R3F canvas — full height, globe centre sits in upper half */}
      <div style={{
        position: "absolute",
        top: isMobile ? "-5%" : "5%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        height: isMobile ? "100%" : "90%",
        pointerEvents: "none",
        zIndex: 0,
      }}>
        <Canvas
          camera={{ position: [0, 0, 4.5], fov }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 3, 3]} intensity={0.7} />
          <Suspense fallback={null}>
            <FloatingMesh color={acc} mouse={mouseRef} scale={meshScale} />
            <WireframeMesh color={acc} mouse={mouseRef} scale={meshScale} />
          </Suspense>
        </Canvas>
      </div>

      {/* Noise */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, opacity: isDark ? 0.032 : 0.022,
        pointerEvents: "none", zIndex: 1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "160px",
      }}/>

      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse 55% 55% at 50% 48%, ${acc}${isDark ? "16" : "0e"} 0%, transparent 65%)`,
      }}/>

      {/* Bottom vignette */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: isMobile ? "60%" : "35%",
        background: `linear-gradient(to top, var(--color-bg) 40%, transparent 100%)`,
        pointerEvents: "none",
        zIndex: 2,
      }}/>

      {/* Text block — z3 so it sits above everything */}
      <div style={{ position: "relative", zIndex: 3 }}>
        {/* Eyebrow */}
        <div ref={eyebrowRef} style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
          marginBottom: "clamp(1rem,2vw,1.75rem)",
          opacity: 0,
        }}>
          <div style={{ width: 20, height: 1, background: acc, flexShrink: 0 }}/>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.48rem,0.85vw,0.62rem)",
            letterSpacing: "0.18em", textTransform: "uppercase", color: acc,
          }}>Systematic · Transparent · Delivered</span>
        </div>

        {/* H1 */}
        <h1
          ref={headingRef}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.8rem,10vw,9.5rem)",
            fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 0.88,
            margin: "0 0 clamp(1.25rem,2.5vw,2rem)",
            perspective: "800px",
          }}
        >
          <span style={{ display: "block", color: "var(--color-text-primary)" }}>Process.</span>
          <span style={{
            display: "block",
            color: "transparent",
            WebkitTextStroke: `2px ${acc}`,
            textShadow: `0 0 70px ${acc}55`,
          }}>Not magic.</span>
        </h1>

        {/* Sub */}
        <p
          ref={subRef}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.88rem,1.3vw,1.05rem)",
            color: "var(--color-text-muted)",
            lineHeight: 1.72,
            maxWidth: "min(520px, 100%)",
            margin: 0,
          }}
        >
          Great software isn't conjured — it's built step by step, with discipline,
          communication, and zero tolerance for chaos. Here's how I do it.
        </p>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: "absolute",
        bottom: "clamp(1.5rem,3vw,2.5rem)",
        right: "clamp(1.5rem,3vw,2.5rem)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
        zIndex: 3,
      }}>
        <div style={{ width: 1, height: "clamp(40px,5vh,60px)", background: `linear-gradient(to bottom, transparent, ${acc}88)` }}/>
        <div ref={scrollDot} style={{ width: 6, height: 6, borderRadius: "50%", background: acc, filter: "brightness(0.5)", transition: "filter 0.4s ease" }}/>
      </div>
    </section>
  )
}