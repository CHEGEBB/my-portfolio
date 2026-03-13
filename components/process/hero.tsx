"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"
import gsap from "gsap"

// ─── Pure 2D canvas sphere — same pattern as AboutHero, zero WebGL ────────────
function SphereCanvas({
  accent,
  isDark,
  mouse,
}: {
  accent: string
  isDark: boolean
  mouse: React.MutableRefObject<{ x: number; y: number }>
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Parse accent hex → rgb components
    const hex = accent.replace("#", "")
    const cr = parseInt(hex.slice(0, 2), 16)
    const cg = parseInt(hex.slice(2, 4), 16)
    const cb = parseInt(hex.slice(4, 6), 16)

    let W = 0, H = 0
    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      const dpr = window.devicePixelRatio || 1
      canvas.width  = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize, { passive: true })

    // Fibonacci sphere points
    const N = 200
    const golden = Math.PI * (3 - Math.sqrt(5))
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const t = golden * i
      return { x: Math.cos(t) * r, y, z: Math.sin(t) * r }
    })

    const rx = { v: 0 }
    const ry = { v: 0 }
    let raf: number

    const frame = (ts: number) => {
      const t = ts * 0.001
      ctx.clearRect(0, 0, W, H)

      // Smooth follow mouse + auto-rotate
      rx.v += (t * 0.07  - mouse.current.y * 0.22 - rx.v) * 0.04
      ry.v += (t * 0.16  + mouse.current.x * 0.36 - ry.v) * 0.04

      const cxr = Math.cos(rx.v), sxr = Math.sin(rx.v)
      const cyr = Math.cos(ry.v), syr = Math.sin(ry.v)
      const cx  = W / 2
      const cy  = H / 2
      const rad = Math.min(W, H) * 0.30

      // Project 3D → 2D with perspective
      const proj = pts.map(p => {
        const x1 =  p.x * cyr + p.z * syr
        const z1 = -p.x * syr + p.z * cyr
        const y2 =  p.y * cxr - z1  * sxr
        const z2 =  p.y * sxr + z1  * cxr
        const sc = 2.4 / (2.4 + z2)
        return { sx: cx + x1 * rad * sc, sy: cy - y2 * rad * sc, z: z2, sc }
      })

      // Draw connecting lines between nearby points
      const D = rad * 0.30
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = proj[i], b = proj[j]
          const d = Math.hypot(a.sx - b.sx, a.sy - b.sy)
          if (d > D) continue
          const depth = ((a.z + b.z) / 2 + 1) / 2
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(1 - d / D) * depth * (isDark ? 0.14 : 0.08)})`
          ctx.lineWidth = 0.5
          ctx.moveTo(a.sx, a.sy)
          ctx.lineTo(b.sx, b.sy)
          ctx.stroke()
        }
      }

      // Draw dots
      proj.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, p.sc * 1.9, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${((p.z + 1) / 2) * (isDark ? 0.7 : 0.5)})`
        ctx.fill()
      })

      // Soft radial glow
      const g = ctx.createRadialGradient(cx, cy, rad * 0.4, cx, cy, rad * 1.6)
      g.addColorStop(0, `rgba(${cr},${cg},${cb},${isDark ? 0.07 : 0.04})`)
      g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
      ctx.beginPath()
      ctx.arc(cx, cy, rad * 1.6, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [accent, isDark])

  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
      }}
    />
  )
}

// ─── ProcessHero ──────────────────────────────────────────────────────────────
export function ProcessHero() {
  const { theme }  = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const scrollDot  = useRef<HTMLDivElement>(null)
  const mouseRef   = useRef({ x: 0, y: 0 })
  const [mounted,  setMounted]  = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  // Mount + mobile check
  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check, { passive: true })
    return () => window.removeEventListener("resize", check)
  }, [])

  // GSAP entrance — safe, no DOM restructuring
  useEffect(() => {
    if (!mounted || !headingRef.current || !subRef.current || !eyebrowRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.25 })

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" },
        0
      )

      const lines = headingRef.current!.querySelectorAll<HTMLSpanElement>("span.hero-line")
      tl.fromTo(
        lines,
        { opacity: 0, y: 65, rotateX: -80, transformOrigin: "50% 100%" },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.88, stagger: 0.17,
          ease: "back.out(1.4)",
        },
        0.18
      )

      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        0.85
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [mounted])

  // Mouse parallax
  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current
    if (!el) return
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

  // Scroll dot pulse
  useEffect(() => {
    const dot = scrollDot.current
    if (!dot) return
    const id = setInterval(() => {
      dot.style.filter = "brightness(1.8)"
      setTimeout(() => { dot.style.filter = "brightness(0.5)" }, 500)
    }, 1100)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "100svh",
        overflow: "hidden",
        background: isDark ? "#07070F" : "#F0F0FA",
        display: "flex",
        flexDirection: "column",
        justifyContent: isMobile ? "center" : "flex-end",
        paddingTop: isMobile ? "52%" : undefined,
        padding: isMobile
          ? "0 clamp(1.5rem,6vw,5rem)"
          : "clamp(2rem,5vw,4rem) clamp(1.5rem,6vw,5rem)",
      }}
    >
      {/* ── Pure 2D sphere — no WebGL, navigation-safe ── */}
      <div style={{
        position: "absolute",
        top: isMobile ? "-5%" : "3%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        height: isMobile ? "100%" : "92%",
        pointerEvents: "none",
        zIndex: 0,
      }}>
        <SphereCanvas accent={acc} isDark={isDark} mouse={mouseRef} />
      </div>

      {/* Noise */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        opacity: isDark ? 0.032 : 0.022,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "160px",
      }} />

      {/* Bottom vignette */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: isMobile ? "60%" : "38%",
        background: isDark
          ? "linear-gradient(to top,#07070F 40%,transparent 100%)"
          : "linear-gradient(to top,#F0F0FA 40%,transparent 100%)",
        pointerEvents: "none",
        zIndex: 2,
      }} />

      {/* Text block */}
      <div style={{ position: "relative", zIndex: 3 }}>
        {/* Eyebrow */}
        <div ref={eyebrowRef} style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
          marginBottom: "clamp(1rem,2vw,1.75rem)",
          opacity: 0,
        }}>
          <div style={{ width: 20, height: 1, background: acc, flexShrink: 0 }} />
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.48rem,0.85vw,0.62rem)",
            letterSpacing: "0.18em", textTransform: "uppercase", color: acc,
          }}>
            Systematic · Transparent · Delivered
          </span>
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
          <span className="hero-line" style={{
            display: "block",
            color: isDark ? "#ffffff" : "#0a0a14",
            opacity: 0,
          }}>
            Process.
          </span>
          <span className="hero-line" style={{
            display: "block",
            color: "transparent",
            WebkitTextStroke: `2px ${acc}`,
            textShadow: `0 0 70px ${acc}55`,
            opacity: 0,
          }}>
            Not magic.
          </span>
        </h1>

        {/* Sub */}
        <p
          ref={subRef}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.88rem,1.3vw,1.05rem)",
            color: "var(--color-text-muted)",
            lineHeight: 1.72,
            maxWidth: "min(520px,100%)",
            margin: 0,
            opacity: 0,
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
        <div style={{
          width: 1, height: "clamp(40px,5vh,60px)",
          background: `linear-gradient(to bottom, transparent, ${acc}88)`,
        }} />
        <div
          ref={scrollDot}
          style={{
            width: 6, height: 6, borderRadius: "50%",
            background: acc, filter: "brightness(0.5)",
            transition: "filter 0.4s ease",
          }}
        />
      </div>
    </section>
  )
}