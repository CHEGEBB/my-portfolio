"use client"

import { useEffect, useRef, useState, useCallback, Suspense } from "react"
import { useTheme } from "@/context/theme-context"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { MeshDistortMaterial, Icosahedron } from "@react-three/drei"
import * as THREE from "three"

// ─── Types ────────────────────────────────────────────────────────────────────
interface MouseRef {
  x: number
  y: number
}

// ─── 3D: Solid distorted icosphere ───────────────────────────────────────────
function FloatingSphere({
  color,
  mouse,
}: {
  color: string
  mouse: React.MutableRefObject<MouseRef>
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.x = t * 0.12
    meshRef.current.rotation.y = t * 0.08
    meshRef.current.rotation.z = t * 0.05
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
    meshRef.current.scale.setScalar(1 + Math.sin(t * 0.6) * 0.04)
  })

  return (
    <Icosahedron ref={meshRef} args={[1.6, 3]}>
      <MeshDistortMaterial
        color={new THREE.Color(color)}
        distort={0.35}
        speed={1.8}
        roughness={0.1}
        metalness={0.6}
        transparent
        opacity={0.22}
      />
    </Icosahedron>
  )
}

// ─── 3D: Wireframe shell ──────────────────────────────────────────────────────
function WireframeSphere({
  color,
  mouse,
}: {
  color: string
  mouse: React.MutableRefObject<MouseRef>
}) {
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

  return (
    <Icosahedron ref={meshRef} args={[2.0, 3]}>
      <meshBasicMaterial
        color={new THREE.Color(color)}
        wireframe
        transparent
        opacity={0.07}
      />
    </Icosahedron>
  )
}

// ─── Char — single animated character, CSS-only, no DOM mutation ──────────────
function AnimatedChar({
  char,
  delay,
  outline,
  acc,
  isDark,
}: {
  char: string
  delay: number
  outline: boolean
  acc: string
  isDark: boolean
}) {
  return (
    <span
      style={{
        display: "inline-block",
        animation: `charReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
        color: outline ? "transparent" : isDark ? "#ffffff" : "#0a0a14",
        WebkitTextStroke: outline ? `2px ${acc}` : undefined,
      }}
    >
      {char === " " ? "\u00a0" : char}
    </span>
  )
}

// ─── Word — single animated word for subheading ───────────────────────────────
function AnimatedWord({ word, delay }: { word: string; delay: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        marginRight: "0.3em",
        animation: `wordReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
      }}
    >
      {word}
    </span>
  )
}

// ─── Main Hero ────────────────────────────────────────────────────────────────
export function AboutHero() {
  const { theme } = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef<MouseRef>({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  const isDark = theme.mode === "dark"
  const acc = theme.colors.accent

  useEffect(() => {
    setMounted(true)
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mouseRef.current = {
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: -(((e.clientY - r.top) / r.height) - 0.5) * 2,
    }
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  if (!mounted) return null

  // Build char arrays — done at render time, React owns every node
  const line1 = "Not just a"
  const line2 = "developer."
  const sub = "A builder, a founder, a problem-solver who happens to write excellent code. Based in Kenya. Working for the world."

  // Stagger math
  const charBaseDelay = 0.35      // when chars start
  const charStagger   = 0.042     // per char
  const line1End      = charBaseDelay + line1.length * charStagger
  const wordBaseDelay = line1End + line2.length * charStagger * 0.6 + 0.1

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
      {/* ── R3F canvas ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]}   intensity={1.2} color={acc} />
            <pointLight position={[-5, -3, 2]} intensity={0.6} color={acc} />
            <WireframeSphere color={acc} mouse={mouseRef} />
            <FloatingSphere  color={acc} mouse={mouseRef} />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Noise grain ── */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: "256px",
          mixBlendMode: isDark ? "overlay" : "multiply",
          opacity: 0.6,
        }}
      />

      {/* ── Bottom fade ── */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: isDark
            ? "linear-gradient(to top, #07070F 0%, #07070Fcc 35%, transparent 65%)"
            : "linear-gradient(to top, #F0F0FA 0%, #F0F0FAcc 30%, transparent 60%)",
        }}
      />

      {/* ── Corner label ── */}
      <div
        style={{
          position: "absolute",
          top: "clamp(5rem,9vw,7rem)", right: "clamp(1.5rem,4vw,3rem)",
          zIndex: 5,
          display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem",
          animation: "eyebrowReveal 0.8s ease 0.1s both",
        }}
      >
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.5rem",
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "var(--color-text-muted)", opacity: 0.4,
        }}>
          BRIAN_CHEGE.EXE
        </span>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.5rem",
          letterSpacing: "0.12em", color: acc, opacity: 0.6,
        }}>
          v3.0 · RUNNING
        </span>
      </div>

      {/* ── Main text ── */}
      <div style={{
        position: "relative", zIndex: 5,
        padding: "0 clamp(1.5rem,6vw,5rem) clamp(3rem,6vw,5rem)",
      }}>

        {/* Eyebrow */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          marginBottom: "clamp(1rem,2.5vw,2rem)",
          animation: "eyebrowReveal 0.7s ease 0.2s both",
        }}>
          <div style={{ width: 28, height: "1px", background: acc }} />
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.52rem,1vw,0.64rem)",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: acc,
          }}>
            About the developer
          </span>
        </div>

        {/* Heading — React renders every char as its own span.
            CSS @keyframes drives the animation, zero DOM mutations. */}
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(3rem,11vw,10.5rem)",
          fontWeight: 800,
          letterSpacing: "-0.05em",
          lineHeight: 0.9,
          margin: "0 0 clamp(1.5rem,3vw,2.5rem)",
        }}>
          {/* Line 1 */}
          <span style={{ display: "block" }}>
            {line1.split("").map((ch, i) => (
              <AnimatedChar
                key={i}
                char={ch}
                delay={charBaseDelay + i * charStagger}
                outline={false}
                acc={acc}
                isDark={isDark}
              />
            ))}
          </span>

          {/* Line 2 — outline */}
          <span style={{ display: "block" }}>
            {line2.split("").map((ch, i) => (
              <AnimatedChar
                key={i}
                char={ch}
                delay={line1End + i * charStagger}
                outline={true}
                acc={acc}
                isDark={isDark}
              />
            ))}
          </span>
        </h1>

        {/* Sub — word-by-word reveal */}
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(0.9rem,1.5vw,1.15rem)",
          color: "var(--color-text-muted)",
          lineHeight: 1.7,
          maxWidth: 560,
          margin: 0,
        }}>
          {sub.split(" ").map((word, i) => (
            <AnimatedWord
              key={i}
              word={word}
              delay={wordBaseDelay + i * 0.04}
            />
          ))}
        </p>
      </div>

      {/* ── Scroll cue ── */}
      <div style={{
        position: "absolute",
        bottom: "clamp(1.5rem,3vw,2.5rem)", left: "50%",
        transform: "translateX(-50%)",
        zIndex: 5,
      }}>
        <div style={{
          width: 1, height: 44,
          background: `linear-gradient(to bottom, ${acc}, transparent)`,
          animation: "scrollPulse 2.2s ease-in-out infinite",
        }} />
      </div>

      {/* ── All keyframes ── */}
      <style jsx global>{`
        @keyframes charReveal {
          from {
            opacity: 0;
            transform: translateY(60px) rotateX(-80deg);
            transform-origin: 50% 100%;
          }
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0deg);
            transform-origin: 50% 100%;
          }
        }

        @keyframes wordReveal {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes eyebrowReveal {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.25; transform: scaleY(1);   }
          50%       { opacity: 1;   transform: scaleY(1.25); }
        }
      `}</style>
    </section>
  )
}