"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function AnimCount({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const elRef = useRef<HTMLSpanElement>(null)
  const fired = useRef(false)
  useEffect(() => {
    const el = elRef.current; if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || fired.current) return
      fired.current = true
      const dur = 1200, start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        setVal(Math.round((1 - Math.pow(1 - p, 3)) * to))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      obs.disconnect()
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to])
  return <span ref={elRef}>{val}{suffix}</span>
}

// ─── LIVE CLOCK ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState("")
  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString("en-US", {
      hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
      timeZone: "Africa/Nairobi",
    })
    setTime(fmt())
    const id = setInterval(() => setTime(fmt()), 1000)
    return () => clearInterval(id)
  }, [])
  return <>{time || "00:00:00"}</>
}

// ─── TYPEWRITER ───────────────────────────────────────────────────────────────
const ROLES = ["Full Stack Developer", "Co-Founder & CTO", "React & Next.js Engineer", "Mobile App Developer"]
function Typewriter({ acc }: { acc: string }) {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState("")
  const [del, setDel] = useState(false)
  useEffect(() => {
    const full = ROLES[idx]
    const id = setTimeout(() => {
      if (!del) {
        const next = full.slice(0, text.length + 1)
        setText(next)
        if (next === full) setTimeout(() => setDel(true), 1800)
      } else {
        const next = full.slice(0, text.length - 1)
        setText(next)
        if (next === "") { setDel(false); setIdx(i => (i + 1) % ROLES.length) }
      }
    }, del ? 30 : 70)
    return () => clearTimeout(id)
  }, [text, del, idx])
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
      <span style={{ color: acc, fontFamily: "var(--font-mono)", fontWeight: 400, fontSize: "0.9em" }}>_</span>
      {text}
      <span style={{ display: "inline-block", width: 2, height: "0.9em", background: acc, verticalAlign: "middle", animation: "heroBlink 1s step-end infinite" }} />
    </span>
  )
}

// ─── SPHERE CANVAS (same as ProcessHero) ─────────────────────────────────────
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

      rx.v += (t * 0.07  - mouse.current.y * 0.22 - rx.v) * 0.04
      ry.v += (t * 0.16  + mouse.current.x * 0.36 - ry.v) * 0.04

      const cxr = Math.cos(rx.v), sxr = Math.sin(rx.v)
      const cyr = Math.cos(ry.v), syr = Math.sin(ry.v)
      const cx  = W / 2
      const cy  = H / 2
      const rad = Math.min(W, H) * 0.30

      const proj = pts.map(p => {
        const x1 =  p.x * cyr + p.z * syr
        const z1 = -p.x * syr + p.z * cyr
        const y2 =  p.y * cxr - z1  * sxr
        const z2 =  p.y * sxr + z1  * cxr
        const sc = 2.4 / (2.4 + z2)
        return { sx: cx + x1 * rad * sc, sy: cy - y2 * rad * sc, z: z2, sc }
      })

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

      proj.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, p.sc * 1.9, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${((p.z + 1) / 2) * (isDark ? 0.7 : 0.5)})`
        ctx.fill()
      })

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
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  )
}

// ─── PORTFOLIO HERO ───────────────────────────────────────────────────────────
export function PortfolioHero() {
  const { theme }  = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLDivElement>(null)

  const acc    = theme.colors.accent
  const isDark = theme.mode === "dark"

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t) }, [])

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  // Mouse for sphere parallax
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

  const contentFade = 1 - Math.min(scrollY / 500, 1) * 0.85
  const E = "cubic-bezier(0.16,1,0.3,1)"

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity:    mounted ? 1 : 0,
    transform:  mounted ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .8s ${E} ${delay}s, transform .9s ${E} ${delay}s`,
  })

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--color-bg)",
      }}
    >
      {/* ── SPHERE (same as ProcessHero) ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <SphereCanvas accent={acc} isDark={isDark} mouse={mouseRef} />
      </div>

      {/* Vignette — keeps centre readable */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: isDark
          ? `radial-gradient(ellipse 65% 70% at 50% 45%, rgba(7,7,15,0.82) 0%, transparent 75%)`
          : `radial-gradient(ellipse 65% 70% at 50% 45%, rgba(246,246,252,0.82) 0%, transparent 75%)`,
      }} />

      {/* Bottom gradient so content sits on clean bg */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
        zIndex: 1, pointerEvents: "none",
        background: `linear-gradient(to top, var(--color-bg) 0%, transparent 100%)`,
      }} />

      {/* Noise overlay */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: "256px",
        mixBlendMode: isDark ? "overlay" : "multiply",
        opacity: 0.5,
      }} />

      {/* ── MAIN CONTENT ── */}
      <div style={{
        position: "relative", zIndex: 10,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        maxWidth: "1280px",
        margin: "0 auto",
        width: "100%",
        padding: "clamp(5rem,8vw,7rem) clamp(1.25rem,4vw,3rem) clamp(2rem,4vw,3rem)",
        opacity: contentFade,
      }}>

        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "clamp(1rem,2vw,1.5rem)", ...reveal(0.1) }}>
          <span style={{ width: 20, height: 1, background: acc, display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: acc }}>
            Brian Chege · Eldoret, Kenya
          </span>
        </div>

        {/* Headline */}
        <div style={{ marginBottom: "clamp(1.5rem,3vw,2.5rem)" }}>
          <div style={{ overflow: "hidden" }}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem,7vw,6.5rem)",
              fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em",
              color: "var(--color-text-primary)", margin: 0,
              ...reveal(0.18),
            }}>The Work</h1>
          </div>
          <div style={{ overflow: "hidden" }}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem,7vw,6.5rem)",
              fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: `clamp(1.5px,0.15vw,2px) ${acc}`,
              margin: 0,
              ...reveal(0.3),
            }}>
              Speaks<span style={{ color: acc, WebkitTextStroke: "0px" }}>.</span>
            </h1>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1.5rem",
          paddingTop: "clamp(1.25rem,2.5vw,2rem)",
          borderTop: "1px solid var(--color-surface-border)",
          ...reveal(0.5),
        }}>
          {/* Left */}
          <div style={{ flex: "1 1 280px", maxWidth: 460 }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(0.9rem,1.5vw,1.2rem)",
              fontWeight: 600, letterSpacing: "-0.02em",
              color: "var(--color-text-secondary)",
              marginBottom: "0.65rem", minHeight: "1.5em",
            }}>
              <Typewriter acc={acc} />
            </div>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.78rem,1vw,0.88rem)",
              lineHeight: 1.75, color: "var(--color-text-muted)",
              marginBottom: "1.25rem", maxWidth: 360,
            }}>
              3+ years shipping real products to real users. From Eldoret, Kenya — working globally.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
              <a href="#projects" style={{
                fontFamily: "var(--font-body)", fontSize: "0.825rem", fontWeight: 600, letterSpacing: "0.04em",
                color: "var(--color-accent-fg)", background: acc,
                padding: "0.65rem 1.5rem", borderRadius: "9999px", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                boxShadow: `0 0 28px ${acc}40`,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.cssText += ";transform:translateY(-2px);box-shadow:0 0 45px " + acc + "60" }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 28px ${acc}40` }}
              >
                See Projects
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
              <a href="https://drive.google.com/uc?export=download&id=1pTAMt80W6VfTootlcr3LuECuNCG0qEf7" download="Brian_Chege_CV.pdf" style={{
                fontFamily: "var(--font-body)", fontSize: "0.825rem", fontWeight: 500,
                color: "var(--color-text-primary)", border: "1px solid var(--color-surface-border)",
                padding: "0.65rem 1.5rem", borderRadius: "9999px", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                transition: "all 0.2s ease",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = acc; el.style.color = acc }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--color-surface-border)"; el.style.color = "var(--color-text-primary)" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                Download CV
              </a>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "clamp(1.25rem,2.5vw,2.5rem)", flexWrap: "wrap", alignItems: "flex-start" }}>
            {[
              { to: 9,  suffix: "",  label: "Projects"   },
              { to: 30, suffix: "+", label: "Challenges" },
              { to: 7,  suffix: "+", label: "Companies"  },
              { to: 2,  suffix: "",  label: "Startups"   },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem,3vw,2.4rem)",
                  fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1,
                  color: acc,
                }}>
                  <AnimCount to={s.to} suffix={s.suffix} />
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--color-text-muted)", marginTop: "0.2rem",
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TECH TICKER ── */}
      <div style={{
        position: "relative", zIndex: 10,
        borderTop: "1px solid var(--color-surface-border)",
        overflow: "hidden", padding: "0.55rem 0", flexShrink: 0,
        opacity: contentFade,
      }}>
        <div style={{ display: "flex", width: "max-content", animation: "heroTicker 32s linear infinite" }}>
          {[...Array(3)].flatMap((_, ri) =>
            ["Next.js","React","TypeScript","Node.js","Python","Flutter","Docker","PostgreSQL","MongoDB","AWS","React Native","TailwindCSS","Vue.js","Figma","Linux"].map((item, i) => (
              <span key={`${ri}-${i}`} style={{
                fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--color-text-muted)",
                padding: "0 clamp(1rem,2vw,1.75rem)",
                display: "inline-flex", alignItems: "center", gap: "0.75rem", whiteSpace: "nowrap",
              }}>
                {item}
                <span style={{ width: 2, height: 2, borderRadius: "50%", background: acc, opacity: 0.5, display: "inline-block", flexShrink: 0 }} />
              </span>
            ))
          )}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: "absolute",
        bottom: "clamp(2.5rem,4vw,3.5rem)",
        right: "clamp(1.25rem,4vw,3rem)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
        opacity: mounted && scrollY < 60 ? 0.35 : 0,
        transition: "opacity 0.4s ease",
        zIndex: 10,
      }}>
        <span style={{ writingMode: "vertical-lr", fontFamily: "var(--font-mono)", fontSize: "0.46rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>scroll</span>
        <div style={{ width: 1, height: 36, background: `linear-gradient(to bottom, ${acc}, transparent)`, animation: "heroScrollPulse 1.8s ease-in-out infinite" }} />
      </div>

      <style jsx global>{`
        @keyframes heroBlink       { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes heroTicker      { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
        @keyframes heroScrollPulse { 0%,100%{opacity:0.5;transform:scaleY(1)} 50%{opacity:0.15;transform:scaleY(0.6)} }
      `}</style>
    </section>
  )
}