"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"

// ─── DATA ────────────────────────────────────────────────────────────────────

const FACTS = [
  { target: 3,  suffix: "+", label: "Years building"   },
  { target: 7,  suffix: "+", label: "Companies"        },
  { target: 20, suffix: "+", label: "Projects shipped" },
  { target: 2,  suffix: "",  label: "Startups founded" },
]

const TRAITS = [
  "Full Stack", "Mobile Dev", "Cloud & DevOps",
  "AI Integration", "Team Leadership", "Open Source",
]

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700&q=85",
    alt: "Code on screen", caption: "Always shipping",
  },
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=85",
    alt: "Team collaboration", caption: "Team leadership",
  },
  {
    src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=700&q=85",
    alt: "Tech workspace", caption: "Deep in the build",
  },
]

const TIMELINE = [
  { year: "2025 →", event: "Co-Founder & CTO, Softrinx",         sub: "Leading product & engineering" },
  { year: "2025",   event: "Full Stack Dev, Teach2Give",           sub: "Angular · Docker · AWS"        },
  { year: "2024",   event: "Co-Founder & CTO, HealthMaster",       sub: "AI health-tech startup"        },
  { year: "2024",   event: "Intern — Prodigy InfoTech & Codsoft",  sub: "MERN stack development"        },
  { year: "2023",   event: "Software Engineer Intern, ALX Africa", sub: "Python · DevOps · Systems"     },
  { year: "2022",   event: "Equity Leaders Programme Scholar",     sub: "Top KCSE student, Wareng HS"   },
]

// ─── COUNT-UP HOOK ────────────────────────────────────────────────────────────
function useCountUp(target: number, start: boolean, duration = 1700) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const elapsed  = ts - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(target)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

// ─── STAT ITEM ────────────────────────────────────────────────────────────────
function StatItem({
  target, suffix, label, visible, delayMs,
}: {
  target: number; suffix: string; label: string; visible: boolean; delayMs: number
}) {
  const [go, setGo] = useState(false)
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setGo(true), delayMs)
    return () => clearTimeout(t)
  }, [visible, delayMs])
  const count = useCountUp(target, go, 1700)

  return (
    <div style={{
      opacity:    visible ? 1 : 0,
      transform:  visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity .7s ease ${delayMs}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delayMs}ms`,
    }}>
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(2.8rem,6vw,5rem)",
        fontWeight: 800,
        letterSpacing: "-.04em",
        lineHeight: 1,
        color: "var(--color-accent)",
        marginBottom: ".25rem",
        fontVariantNumeric: "tabular-nums",
      }}>
        {count}{suffix}
      </div>
      <div style={{
        fontFamily: "var(--font-body)",
        fontSize: "clamp(.7rem,1vw,.8125rem)",
        color: "var(--color-text-muted)",
        letterSpacing: ".04em",
      }}>
        {label}
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function About() {
  const { theme } = useTheme()

  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rafRef     = useRef<number>(0)

  const [inView,      setInView]      = useState(false)
  const [painted,     setPainted]     = useState(false)
  const [revealed,    setRevealed]    = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const [mouse,       setMouse]       = useState({ x: 0.5, y: 0.5 })
  const [activeImg,   setActiveImg]   = useState(0)
  const [hoveredRow,  setHoveredRow]  = useState<number | null>(null)

  // ── IntersectionObserver ───────────────────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.04 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // ── Entrance sequence ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setPainted(true),    50)    // paint wipe fires
    const t2 = setTimeout(() => setRevealed(true),   1000)  // content fades in after wipe
    const t3 = setTimeout(() => setTextVisible(true), 1100) // staggered text/count-up
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [inView])

  // ── Image carousel ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!textVisible) return
    const id = setInterval(() => setActiveImg(i => (i + 1) % IMAGES.length), 3800)
    return () => clearInterval(id)
  }, [textVisible])

  // ── Mouse tracking relative to section ────────────────────────────────────
  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setMouse({
      x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(1, (e.clientY - r.top)  / r.height)),
    })
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    el.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => el.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  // ── Particle canvas ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!revealed) return
    const canvas  = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setSize = () => {
      canvas.width  = section.offsetWidth
      canvas.height = section.offsetHeight
    }
    setSize()
    const ro = new ResizeObserver(setSize)
    ro.observe(section)

    const hex = theme.colors.accent
    const rv  = parseInt(hex.slice(1,3), 16)
    const gv  = parseInt(hex.slice(3,5), 16)
    const bv  = parseInt(hex.slice(5,7), 16)

    const pts = Array.from({ length: 42 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - .5) * .2,
      vy: (Math.random() - .5) * .2,
      s:  Math.random() * 1.4 + .3,
      p:  Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.p += .014
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rv},${gv},${bv},${.18 + .12 * Math.sin(p.p)})`
        ctx.fill()
      })
      pts.forEach((a, i) => {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(a.x - pts[j].x, a.y - pts[j].y)
          if (d < 90) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(${rv},${gv},${bv},${(1 - d/90) * .065})`
            ctx.lineWidth = .5; ctx.stroke()
          }
        }
      })
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect() }
  }, [revealed, theme.colors.accent])

  // ── Derived ────────────────────────────────────────────────────────────────
  const gx = 10 + mouse.x * 80
  const gy = 10 + mouse.y * 80

  // CRITICAL: paint color = exact hero bg = zero visible seam
  const paintBg = theme.mode === "dark" ? "#07070F" : "#F6F6FC"

  return (
    <section
      ref={sectionRef}
      style={{
        position:   "relative",
        zIndex:     20,
        borderRadius: "clamp(24px,3.5vw,48px) clamp(24px,3.5vw,48px) 0 0",
        overflow:   "hidden",
        marginTop:  "-clamp(24px,3.5vw,48px)",
        minHeight:  "100svh",
        background: "var(--color-bg)",
        opacity:    inView ? 1 : 0,
        transform:  inView ? "translateY(0)" : "translateY(60px)",
        transition: "opacity 0.85s cubic-bezier(.16,1,.3,1), transform 0.85s cubic-bezier(.16,1,.3,1)",
        willChange: "transform, opacity",
      }}
    >

      {/* ── PARTICLES ──────────────────────────────────────────────────────── */}
      <canvas ref={canvasRef} style={{
        position: "absolute", inset: 0,
        opacity: 0.5, pointerEvents: "none", zIndex: 1,
      }} />

      {/* ── MOUSE AMBIENT GLOW ─────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0,
        pointerEvents: "none", zIndex: 1,
        background: `radial-gradient(ellipse 58% 52% at ${gx}% ${gy}%, var(--color-accent-muted) 0%, transparent 65%)`,
        transition: "background 0.1s ease",
      }} />

      {/* ── GRADIENT MESH ──────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0,
        pointerEvents: "none", zIndex: 1,
        background: "var(--gradient-mesh)",
        opacity: 0.55,
      }} />

      {/* ════════════════════════════════════════════════════════════════════
          PAINT WIPE
          Strategy: the curtain starts covering the section (translateY 0),
          then when `painted` fires it slides UP and out (-100%).
          The jagged edge is on the BOTTOM of the curtain div, so as it
          slides up the bristle teeth are the last thing you see disappearing.
          Color = paintBg = exact same as hero bg → seamless join.
      ════════════════════════════════════════════════════════════════════ */}

      {/* Primary brush */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        zIndex: 4, pointerEvents: "none",
        background: paintBg,
        transform:  painted ? "translateY(-105%)" : "translateY(0%)",
        transition: painted ? "transform 1.05s cubic-bezier(0.86,0,0.07,1)" : "none",
        willChange: "transform",
      }}>
        {/* Jagged bottom — bristle teeth, faces DOWN so they trail as curtain lifts */}
        <div style={{
          position: "absolute",
          bottom: -46, left: 0, right: 0, height: 92,
          background: paintBg,
          clipPath: "polygon(0 0, 3% 62%, 9% 30%, 16% 82%, 23% 44%, 31% 92%, 40% 42%, 47% 88%, 55% 48%, 63% 94%, 71% 52%, 79% 86%, 87% 36%, 94% 70%, 100% 28%, 100% 0)",
        }} />
      </div>

      {/* Secondary brush — slightly thinner, trails by 70ms */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        zIndex: 3, pointerEvents: "none",
        background: paintBg,
        opacity: 0.6,
        transform:  painted ? "translateY(-105%)" : "translateY(0%)",
        transition: painted ? "transform 1.18s cubic-bezier(0.86,0,0.07,1) 0.07s" : "none",
        willChange: "transform",
      }}>
        <div style={{
          position: "absolute",
          bottom: -34, left: 0, right: 0, height: 68,
          background: paintBg,
          opacity: 0.6,
          clipPath: "polygon(0 0, 5% 55%, 13% 20%, 21% 75%, 30% 38%, 38% 84%, 46% 34%, 54% 80%, 62% 40%, 70% 88%, 78% 46%, 86% 78%, 93% 22%, 100% 56%, 100% 0)",
        }} />
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div style={{
        position: "relative", zIndex: 5,
        maxWidth: "1280px", margin: "0 auto",
        padding: "clamp(5rem,10vw,8rem) clamp(1rem,4vw,3rem) clamp(4rem,8vw,7rem)",
        opacity:    revealed ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>

        {/* EYEBROW */}
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(.6rem,1vw,.72rem)",
          letterSpacing: ".14em", textTransform: "uppercase",
          color: "var(--color-accent)",
          marginBottom: "clamp(2.5rem,5vw,4rem)",
          display: "flex", alignItems: "center", gap: ".5rem",
          opacity:    textVisible ? 1 : 0,
          transform:  textVisible ? "translateY(0)" : "translateY(14px)",
          transition: "all .6s ease",
        }}>
          <span style={{ width: 20, height: "1px", background: "var(--color-accent)", display: "inline-block" }} />
          About Me
        </p>

        {/* TWO-COLUMN GRID */}
        <div className="about-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(3rem,6vw,8rem)",
          alignItems: "start",
        }}>

          {/* ═══ LEFT ═════════════════════════════════════════════════════ */}
          <div>
            {/* Headline */}
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.6rem,6.5vw,5.5rem)",
              fontWeight: 800, letterSpacing: "-.04em", lineHeight: .92,
              margin: "0 0 clamp(1.5rem,3vw,2.5rem)",
              color: "var(--color-text-primary)",
            }}>
              {[
                { text: "Building",    d: "0s"    },
                { text: "things that", d: "0.07s" },
                { text: <span>matter{" "}<span style={{ color: "transparent", WebkitTextStroke: `2px ${theme.colors.accent}` }}>deeply.</span></span>, d: "0.14s" },
              ].map((line, i) => (
                <div key={i} style={{ overflow: "hidden", lineHeight: 1.05 }}>
                  <div style={{
                    opacity:    textVisible ? 1 : 0,
                    transform:  textVisible ? "translateY(0)" : "translateY(100%)",
                    transition: `opacity .75s ease ${line.d}, transform .75s cubic-bezier(.16,1,.3,1) ${line.d}`,
                    display: "block", paddingBottom: ".06em",
                  }}>{line.text}</div>
                </div>
              ))}
            </h2>

            {/* Bio */}
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(.875rem,1.5vw,1.25rem)", marginBottom: "clamp(1.5rem,3vw,2.5rem)" }}>
              {[
                { text: "I'm Brian Chege — a Full Stack Developer and Co-Founder based in Eldoret, Kenya. I've spent 3+ years turning complex problems into clean, scalable software across web, mobile, and cloud.", d: "0.2s" },
                { text: "From co-founding HealthMaster — a health-tech startup tackling medication adherence with AI — to leading engineering at Softrinx, I build products that genuinely move people.", d: "0.3s" },
                { text: "I don't just write code. I think in systems, lead teams, talk to users, and ship. A Dedan Kimathi CS graduate, Equity Leaders Programme scholar, and relentless builder.", d: "0.4s" },
              ].map((p, i) => (
                <p key={i} style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(.875rem,1.5vw,1.0625rem)",
                  lineHeight: 1.75, color: "var(--color-text-secondary)", margin: 0,
                  opacity:    textVisible ? 1 : 0,
                  transform:  textVisible ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity .7s ease ${p.d}, transform .7s cubic-bezier(.16,1,.3,1) ${p.d}`,
                }}>{p.text}</p>
              ))}
            </div>

            {/* Accent line */}
            <div style={{
              width:      textVisible ? "100%" : "0%",
              height:     "1px",
              background: `linear-gradient(to right, var(--color-accent), transparent)`,
              marginBottom: "clamp(1.5rem,3vw,2.5rem)",
              transition: "width 1s cubic-bezier(.16,1,.3,1) .5s",
            }} />

            {/* Trait pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginBottom: "clamp(2rem,4vw,3rem)" }}>
              {TRAITS.map((trait, i) => (
                <span key={trait} style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(.6rem,.9vw,.7rem)",
                  letterSpacing: ".08em", textTransform: "uppercase",
                  color: "var(--color-accent)",
                  border: "1px solid var(--color-accent)",
                  padding: ".3rem .75rem",
                  opacity:    textVisible ? 1 : 0,
                  transform:  textVisible ? "translateY(0) scale(1)" : "translateY(8px) scale(.94)",
                  transition: `all .5s cubic-bezier(.16,1,.3,1) ${0.55 + i * 0.05}s`,
                }}>{trait}</span>
              ))}
            </div>

            {/* Image collage */}
            <div style={{
              position: "relative",
              height: "clamp(180px,26vw,300px)",
              opacity:    textVisible ? 1 : 0,
              transition: "opacity .9s ease .7s",
            }}>
              {IMAGES.map((img, i) => {
                const isActive = i === activeImg
                const isNext   = i === (activeImg + 1) % IMAGES.length
                const positions = [
                  { top: "0%", left: "0%",  width: "46%" },
                  { top: "8%", left: "29%", width: "41%" },
                  { top: "16%",left: "56%", width: "37%" },
                ]
                return (
                  <div key={i} onClick={() => setActiveImg(i)} style={{
                    position: "absolute", ...positions[i],
                    aspectRatio: "4/3",
                    borderRadius: "clamp(8px,1vw,12px)",
                    overflow: "hidden", cursor: "pointer",
                    zIndex: isActive ? 3 : isNext ? 2 : 1,
                    transform: isActive
                      ? "scale(1.05) translateY(-5px)"
                      : isNext ? "scale(.97) rotate(1.5deg)" : "scale(.93) rotate(-1.2deg)",
                    boxShadow: isActive
                      ? `0 24px 64px rgba(0,0,0,.55), 0 0 0 1.5px var(--color-accent), var(--shadow-glow)`
                      : "0 8px 28px rgba(0,0,0,.35)",
                    transition: "all .65s cubic-bezier(.16,1,.3,1)",
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={img.alt} style={{
                      width: "100%", height: "100%", objectFit: "cover", display: "block",
                      filter: isActive ? "saturate(1.05) brightness(.92)" : "saturate(.45) brightness(.6)",
                      transition: "filter .65s ease",
                    }} />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,.75) 0%, transparent 55%)",
                      display: "flex", alignItems: "flex-end", padding: ".625rem",
                      opacity: isActive ? 1 : 0, transition: "opacity .4s ease",
                    }}>
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: ".54rem",
                        letterSpacing: ".1em", textTransform: "uppercase",
                        color: "var(--color-accent)",
                      }}>{img.caption}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ═══ RIGHT ════════════════════════════════════════════════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(2rem,4vw,3.5rem)" }}>

            {/* Count-up stats */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: "clamp(1.5rem,3vw,2.5rem) clamp(1rem,2vw,2rem)",
            }}>
              {FACTS.map((f, i) => (
                <StatItem
                  key={f.label}
                  target={f.target}
                  suffix={f.suffix}
                  label={f.label}
                  visible={textVisible}
                  delayMs={i * 80 + 250}
                />
              ))}
            </div>

            {/* Divider */}
            <div style={{
              width:      textVisible ? "100%" : "0%",
              height:     "1px",
              background: "var(--color-surface-border)",
              transition: "width 1s cubic-bezier(.16,1,.3,1) .4s",
            }} />

            {/* Timeline */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {TIMELINE.map((item, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    display: "grid", gridTemplateColumns: "3.5rem 1fr",
                    gap: ".75rem",
                    padding: "clamp(.75rem,1.2vw,1rem) clamp(.5rem,.8vw,.75rem)",
                    borderBottom: "1px solid var(--color-surface-border)",
                    borderLeft: hoveredRow === i ? `2px solid var(--color-accent)` : "2px solid transparent",
                    background: hoveredRow === i ? "var(--color-bg-glass)" : "transparent",
                    cursor: "default",
                    opacity:    textVisible ? 1 : 0,
                    transform:  textVisible ? "translateX(0)" : "translateX(20px)",
                    transition: `opacity .6s ease ${i * 0.065 + 0.35}s, transform .6s cubic-bezier(.16,1,.3,1) ${i * 0.065 + 0.35}s, background .18s ease, border-left .18s ease`,
                  }}
                >
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(.55rem,.75vw,.65rem)",
                    color: hoveredRow === i ? "var(--color-accent)" : "var(--color-text-muted)",
                    letterSpacing: ".04em", paddingTop: ".15em",
                    transition: "color .18s ease",
                  }}>{item.year}</span>
                  <div>
                    <div style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(.8rem,1.2vw,.9rem)", fontWeight: 600,
                      color: hoveredRow === i ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                      marginBottom: ".15rem", transition: "color .18s ease",
                    }}>{item.event}</div>
                    <div style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(.55rem,.8vw,.65rem)",
                      color: "var(--color-text-muted)", letterSpacing: ".04em",
                    }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{
              opacity:    textVisible ? 1 : 0,
              transform:  textVisible ? "translateY(0)" : "translateY(10px)",
              transition: "all .6s ease .9s",
            }}>
              <a href="/cv.pdf" download style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(.75rem,1.1vw,.875rem)",
                fontWeight: 600, letterSpacing: ".04em",
                color: "var(--color-accent-fg)",
                background: "var(--color-accent)",
                padding: ".75rem clamp(1.25rem,2vw,2rem)",
                borderRadius: "9999px", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: ".5rem",
                boxShadow: "var(--shadow-glow)",
                transition: "transform .2s ease, box-shadow .2s ease",
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform  = "translateY(-2px)"
                  el.style.boxShadow  = `var(--shadow-glow), 0 8px 24px rgba(0,0,0,.3)`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform  = ""
                  el.style.boxShadow  = "var(--shadow-glow)"
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Download Full CV
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}