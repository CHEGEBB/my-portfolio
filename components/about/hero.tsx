"use client"

import { useEffect, useRef, useState, useCallback, Suspense } from "react"
import { useTheme } from "@/context/theme-context"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MeshDistortMaterial, Icosahedron } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"
import SplitType from "split-type"

// ── 3D Floating Geometry ──────────────────────────────────────────────────────
function FloatingSphere({ color, mouse }: { color: string; mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    // Slow organic float
    meshRef.current.rotation.x = t * 0.12
    meshRef.current.rotation.y = t * 0.08
    meshRef.current.rotation.z = t * 0.05
    // Mouse parallax
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      mouse.current.x * viewport.width * 0.12,
      0.04
    )
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      mouse.current.y * viewport.height * 0.08,
      0.04
    )
    // Breathe
    const scale = 1 + Math.sin(t * 0.6) * 0.04
    meshRef.current.scale.setScalar(scale)
  })

  const c = new THREE.Color(color)

  return (
    <Icosahedron ref={meshRef} args={[1.6, 3]}>
      <MeshDistortMaterial
        color={c}
        distort={0.35}
        speed={1.8}
        roughness={0.1}
        metalness={0.6}
        wireframe={false}
        transparent
        opacity={0.22}
      />
    </Icosahedron>
  )
}

function WireframeSphere({ color, mouse }: { color: string; mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = -t * 0.07
    meshRef.current.rotation.y = t * 0.13
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      mouse.current.x * viewport.width * 0.08,
      0.03
    )
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      mouse.current.y * viewport.height * 0.06,
      0.03
    )
  })

  const c = new THREE.Color(color)

  return (
    <Icosahedron ref={meshRef} args={[2.0, 3]}>
      <meshBasicMaterial color={c} wireframe transparent opacity={0.07} />
    </Icosahedron>
  )
}

// ── Main Hero ─────────────────────────────────────────────────────────────────
export function AboutHero() {
  const { theme }    = useTheme()
  const sectionRef   = useRef<HTMLDivElement>(null)
  const headingRef   = useRef<HTMLHeadingElement>(null)
  const subRef       = useRef<HTMLParagraphElement>(null)
  const eyebrowRef   = useRef<HTMLDivElement>(null)
  const mouseRef     = useRef({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  useEffect(() => { setMounted(true) }, [])

  // GSAP SplitType reveal
  useEffect(() => {
    if (!mounted || !headingRef.current || !subRef.current) return

    const ctx = gsap.context(() => {
      // Split heading into chars
      const splitHead = new SplitType(headingRef.current!, { types: "chars,words" })
      const splitSub  = new SplitType(subRef.current!,     { types: "words" })

      const tl = gsap.timeline({ delay: 0.3 })

      // Eyebrow
      tl.fromTo(eyebrowRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        0
      )

      // Each char materialises from below with stagger
      tl.fromTo(splitHead.chars,
        { opacity: 0, y: 80, rotateX: -90, transformOrigin: "50% 100%" },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.9,
          stagger: { amount: 0.7, from: "start" },
          ease: "back.out(1.4)",
        },
        0.2
      )

      // Sub words slide up
      tl.fromTo(splitSub.words,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.04,
          ease: "power3.out",
        },
        0.9
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [mounted])

  // Mouse tracking
  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    mouseRef.current = {
      x: ((e.clientX - r.left) / r.width  - 0.5) * 2,
      y: -((e.clientY - r.top)  / r.height - 0.5) * 2,
    }
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  if (!mounted) return null

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
        background: isDark ? "#07070F" : "#F0F0FA",
      }}
    >
      {/* R3F Canvas — full bleed background */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        opacity: 0.9,
      }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={1.2} color={acc} />
            <pointLight position={[-5, -3, 2]} intensity={0.6} color={acc} />
            <WireframeSphere color={acc} mouse={mouseRef} />
            <FloatingSphere   color={acc} mouse={mouseRef} />
          </Suspense>
        </Canvas>
      </div>

      {/* Noise grain overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: "256px",
        mixBlendMode: isDark ? "overlay" : "multiply",
        opacity: 0.6,
      }} />

      {/* Gradient — bottom fade so text reads clean */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: isDark
          ? `linear-gradient(to top, #07070F 0%, #07070F88 40%, transparent 70%)`
          : `linear-gradient(to top, #F0F0FA 0%, #F0F0FA88 35%, transparent 65%)`,
      }} />

      {/* Top-right corner label */}
      <div style={{
        position: "absolute", top: "clamp(5rem,9vw,7rem)", right: "clamp(1.5rem,4vw,3rem)",
        zIndex: 5,
        display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem",
      }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.5rem",
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "var(--color-text-muted)", opacity: 0.4,
        }}>BRIAN_CHEGE.EXE</span>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.5rem",
          letterSpacing: "0.12em", color: acc, opacity: 0.6,
        }}>v3.0 · RUNNING</span>
      </div>

      {/* Main text — anchored to bottom */}
      <div style={{
        position: "relative", zIndex: 5,
        padding: "0 clamp(1.5rem,6vw,5rem) clamp(3rem,6vw,5rem)",
      }}>
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            marginBottom: "clamp(1rem,2.5vw,2rem)",
            opacity: 0,
          }}
        >
          <div style={{ width: 28, height: "1px", background: acc }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "clamp(0.52rem,1vw,0.64rem)",
            letterSpacing: "0.18em", textTransform: "uppercase", color: acc,
          }}>About the developer</span>
        </div>

        {/* Massive heading */}
        <h1
          ref={headingRef}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem,11vw,10.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.05em",
            lineHeight: 0.88,
            margin: "0 0 clamp(1.5rem,3vw,2.5rem)",
            color: isDark ? "#fff" : "#0a0a14",
            perspective: "800px",
            overflow: "hidden",
          }}
        >
          Not just a<br />
          <span style={{
            color: "transparent",
            WebkitTextStroke: `2px ${acc}`,
            textShadow: `0 0 80px ${acc}55`,
          }}>developer.</span>
        </h1>

        {/* Sub */}
        <p
          ref={subRef}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.9rem,1.5vw,1.15rem)",
            color: "var(--color-text-muted)",
            lineHeight: 1.7,
            maxWidth: 560,
            margin: 0,
            opacity: 0,
          }}
        >
          A builder, a founder, a problem-solver who happens to write excellent code. Based in Kenya. Working for the world.
        </p>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: "absolute", bottom: "clamp(1.5rem,3vw,2.5rem)", left: "50%",
        transform: "translateX(-50%)",
        zIndex: 5,
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
      }}>
        <div style={{
          width: 1, height: 40,
          background: `linear-gradient(to bottom, ${acc}, transparent)`,
          animation: "heroPulse 2s ease-in-out infinite",
        }} />
      </div>

      <style jsx global>{`
        @keyframes heroPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1);    }
          50%       { opacity: 1;   transform: scaleY(1.2); }
        }
        .split-char { display: inline-block; }
      `}</style>
    </section>
  )
}