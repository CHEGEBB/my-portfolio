"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
function AnimCount({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const elRef = useRef<HTMLSpanElement>(null)
  const fired = useRef(false)
  useEffect(() => {
    const el = elRef.current; if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || fired.current) return
      fired.current = true
      const dur = 1200
      const start = performance.now()
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

// ─── LIVE CLOCK ──────────────────────────────────────────────────────────────
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

// ─── TYPEWRITER ──────────────────────────────────────────────────────────────
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
      <span style={{
        display: "inline-block", width: 2, height: "0.9em", background: acc,
        verticalAlign: "middle", animation: "heroBlinkCursor 1s step-end infinite",
      }} />
    </span>
  )
}

// ─── CANVAS BACKGROUND ───────────────────────────────────────────────────────
// Kept separate so it doesn't re-mount on every mouse move
function HeroCanvas({ acc, isDark }: { acc: string; isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Mouse stored in ref — no re-render needed
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    let animId: number
    let t = 0

    const rv = parseInt(acc.slice(1, 3), 16)
    const gv = parseInt(acc.slice(3, 5), 16)
    const bv = parseInt(acc.slice(5, 7), 16)
    const dim = isDark ? 1 : 0.45

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      t += 0.006
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const W = canvas.width, H = canvas.height
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Subtle perspective grid from vanishing point
      const vx = W * (0.2 + mx * 0.6)
      const vy = H * (0.2 + my * 0.5)

      // Radial lines from vanishing point
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2
        const ex = vx + Math.cos(angle) * W * 2.5
        const ey = vy + Math.sin(angle) * H * 2.5
        ctx.beginPath()
        ctx.moveTo(vx, vy)
        ctx.lineTo(ex, ey)
        ctx.strokeStyle = `rgba(${rv},${gv},${bv},${0.032 * dim})`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      // Horizontal scan lines — subtle
      const lineCount = 12
      for (let i = 0; i < lineCount; i++) {
        const y = (i / (lineCount - 1)) * H
        const dist = Math.abs(i / (lineCount - 1) - my)
        const alpha = (0.05 - dist * 0.04) * dim
        if (alpha <= 0) continue
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.strokeStyle = `rgba(${rv},${gv},${bv},${alpha})`
        ctx.lineWidth = 0.4
        ctx.stroke()
      }

      // Drifting particles
      for (let i = 0; i < 30; i++) {
        const px = (Math.sin(t * 0.25 + i * 0.85) * 0.5 + 0.5) * W
        const py = ((t * 0.04 + i * 0.033) % 1) * H
        const alpha = (0.08 + 0.06 * Math.sin(t + i * 0.7)) * dim
        const radius = 0.8 + Math.sin(i * 1.3) * 0.5
        ctx.beginPath()
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rv},${gv},${bv},${alpha})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [acc, isDark])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
    />
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
export function PortfolioHero() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [mouseGlow, setMouseGlow] = useState({ x: 50, y: 50 })
  const acc = theme.colors.accent
  const isDark = theme.mode === "dark"

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  // Mouse glow — throttled via RAF
  useEffect(() => {
    let id: number
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(id)
      id = requestAnimationFrame(() => {
        setMouseGlow({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        })
      })
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(id) }
  }, [])

  const fade = 1 - Math.min(scrollY / 600, 1) * 0.85

  return (
    <section style={{
      position: "relative",
      minHeight: "100svh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      background: "var(--color-bg)",
    }}>
      {/* Canvas — isolated, won't re-mount on mouse move */}
      <HeroCanvas acc={acc} isDark={isDark} />

      {/* Mouse-reactive radial glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
        background: `radial-gradient(ellipse 55% 55% at ${mouseGlow.x}% ${mouseGlow.y}%, ${acc}12 0%, transparent 65%)`,
        opacity: fade,
      }} />

      {/* ── HUD TOP BAR ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "clamp(1rem,1.8vw,1.5rem) clamp(1.25rem,4vw,3rem)",
        borderBottom: `1px solid ${acc}15`,
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.7s ease 0.2s",
      }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Portfolio</span>
          <span style={{ width: 1, height: 10, background: "var(--color-surface-border)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.1em", color: acc }}>2025</span>
        </div>
        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", color: "var(--color-text-muted)" }}>
            EAT <LiveClock />
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{
              width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
              background: "var(--color-success)", display: "inline-block",
              boxShadow: `0 0 6px var(--color-success)`,
              animation: "heroPulseGreen 2s ease-in-out infinite",
            }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", color: "var(--color-success)" }}>AVAILABLE</span>
          </div>
        </div>
      </div>

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
        padding: "clamp(6rem,10vw,8rem) clamp(1.25rem,4vw,3rem) clamp(2rem,4vw,3rem)",
        opacity: fade,
      }}>

        {/* ── HEADLINE BLOCK ── */}
        <div style={{ marginBottom: "clamp(2rem,4vw,3.5rem)" }}>

          {/* Eyebrow */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            marginBottom: "clamp(1rem,2vw,1.5rem)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "none" : "translateY(10px)",
            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
          }}>
            <span style={{ width: 20, height: 1, background: acc, display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: acc }}>
              Brian Chege · Eldoret, Kenya
            </span>
          </div>

          {/* Line 1 — solid */}
          <div style={{ overflow: "hidden" }}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.2rem,7vw,6.5rem)",
              fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em",
              color: "var(--color-text-primary)",
              margin: 0,
              opacity: mounted ? 1 : 0,
              animation: mounted ? "heroSlideUp 0.85s cubic-bezier(.16,1,.3,1) 0.15s both" : "none",
            }}>
              The Work
            </h1>
          </div>

          {/* Line 2 — outline accent */}
          <div style={{ overflow: "hidden" }}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.2rem,7vw,6.5rem)",
              fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: `clamp(1.5px,0.15vw,2px) ${acc}`,
              margin: 0,
              opacity: mounted ? 1 : 0,
              animation: mounted ? "heroSlideUp 0.85s cubic-bezier(.16,1,.3,1) 0.27s both" : "none",
            }}>
              Speaks<span style={{ color: acc, WebkitTextStroke: "0px" }}>.</span>
            </h1>
          </div>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "2rem",
          paddingTop: "clamp(1.5rem,3vw,2rem)",
          borderTop: "1px solid var(--color-surface-border)",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.8s ease 0.65s",
        }}>

          {/* Left — role + bio + CTAs */}
          <div style={{ flex: "1 1 320px", maxWidth: 480 }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(0.95rem,1.6vw,1.25rem)",
              fontWeight: 600, letterSpacing: "-0.02em",
              color: "var(--color-text-secondary)",
              marginBottom: "0.75rem",
              minHeight: "1.5em",
            }}>
              <Typewriter acc={acc} />
            </div>

            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.78rem,1vw,0.88rem)",
              lineHeight: 1.75,
              color: "var(--color-text-muted)",
              marginBottom: "1.5rem",
              maxWidth: 380,
            }}>
              3+ years shipping real products to real users.
              From Eldoret, Kenya — working globally.
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
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = `0 0 45px ${acc}60` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = `0 0 28px ${acc}40` }}
              >
                See Projects
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
              <a href="/cv.pdf" download style={{
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

          {/* Right — stats */}
          <div style={{
            display: "flex",
            gap: "clamp(1.5rem,3vw,2.5rem)",
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}>
            {[
              { to: 9,  suffix: "",  label: "Projects"   },
              { to: 30, suffix: "+", label: "Challenges" },
              { to: 7,  suffix: "+", label: "Companies"  },
              { to: 2,  suffix: "",  label: "Startups"   },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem,3.5vw,2.5rem)",
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
        overflow: "hidden", padding: "0.55rem 0",
        flexShrink: 0,
        opacity: fade,
      }}>
        <div style={{ display: "flex", width: "max-content", animation: "heroTicker 32s linear infinite" }}>
          {[...Array(3)].flatMap((_, ri) =>
            ["Next.js", "React", "TypeScript", "Node.js", "Python", "Flutter", "Docker", "PostgreSQL", "MongoDB", "AWS", "React Native", "TailwindCSS", "Vue.js", "Figma", "Linux"].map((item, i) => (
              <span key={`${ri}-${i}`} style={{
                fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--color-text-muted)",
                padding: "0 clamp(1rem,2vw,1.75rem)",
                display: "inline-flex", alignItems: "center", gap: "0.75rem",
                whiteSpace: "nowrap",
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
        opacity: mounted && scrollY < 60 ? 0.3 : 0,
        transition: "opacity 0.4s ease",
        zIndex: 10,
      }}>
        <span style={{ writingMode: "vertical-lr", fontFamily: "var(--font-mono)", fontSize: "0.46rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>scroll</span>
        <div style={{ width: 1, height: 36, background: `linear-gradient(to bottom, ${acc}, transparent)`, animation: "heroScrollPulse 1.8s ease-in-out infinite" }} />
      </div>

      <style jsx global>{`
        @keyframes heroSlideUp      { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes heroBlinkCursor  { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes heroPulseGreen   { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.7); opacity: 0.3; } }
        @keyframes heroTicker       { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
        @keyframes heroScrollPulse  { 0%, 100% { opacity: 0.5; transform: scaleY(1); } 50% { opacity: 0.15; transform: scaleY(0.6); } }
      `}</style>
    </section>
  )
}