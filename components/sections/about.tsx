"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"

const FACTS = [
  { num: "3+",  label: "Years building" },
  { num: "7+",  label: "Companies" },
  { num: "20+", label: "Projects shipped" },
  { num: "2",   label: "Startups founded" },
]

const TRAITS = [
  "Full Stack",
  "Mobile Dev",
  "Cloud & DevOps",
  "AI Integration",
  "Team Leadership",
  "Open Source",
]

// Curated Unsplash images — professional, dark, tech/workspace vibes
const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
    alt: "Code on screen",
    caption: "Always shipping",
  },
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
    alt: "Collaborative work",
    caption: "Team leadership",
  },
  {
    src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&q=80",
    alt: "Tech setup",
    caption: "Deep in the build",
  },
]

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

export function About() {
  const { theme }                     = useTheme()
  const { ref, inView }               = useInView(0.04)
  const [revealed, setRevealed]       = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const [painted, setPainted]         = useState(false)
  const [mouse, setMouse]             = useState({ x: 0.5, y: 0.5 })
  const [activeImg, setActiveImg]     = useState(0)
  const canvasRef                     = useRef<HTMLCanvasElement>(null)
  const rafRef                        = useRef<number>(0)
  const sectionRef                    = useRef<HTMLDivElement>(null)

  // Mouse tracking — relative to section
  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setMouse({
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top)  / r.height,
    })
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    el.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => el.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  // Entrance sequence
  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setPainted(true),    60)
    const t2 = setTimeout(() => setRevealed(true),   900)
    const t3 = setTimeout(() => setTextVisible(true), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [inView])

  // Image carousel
  useEffect(() => {
    if (!textVisible) return
    const id = setInterval(() => setActiveImg(i => (i + 1) % IMAGES.length), 3800)
    return () => clearInterval(id)
  }, [textVisible])

  // Particles — same as Hero
  useEffect(() => {
    if (!revealed) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const container = sectionRef.current
    if (!container) return

    const resize = () => {
      canvas.width  = container.offsetWidth
      canvas.height = container.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const hex = theme.colors.accent
    const rv = parseInt(hex.slice(1,3),16)
    const gv = parseInt(hex.slice(3,5),16)
    const bv = parseInt(hex.slice(5,7),16)

    const pts = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .18,
      s: Math.random() * 1.4 + .3,
      p: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.p += .014
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rv},${gv},${bv},${.18 + .12 * Math.sin(p.p)})`
        ctx.fill()
      })
      pts.forEach((a, i) => {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(a.x - pts[j].x, a.y - pts[j].y)
          if (d < 85) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(${rv},${gv},${bv},${(1 - d/85) * .06})`
            ctx.lineWidth = .5; ctx.stroke()
          }
        }
      })
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [revealed, theme.colors.accent])

  const gx = 15 + mouse.x * 70
  const gy = 15 + mouse.y * 70

  // Paint brush color matches hero bg exactly — dark seam
  const isDark = theme.mode === "dark"
  const paintBg = isDark ? "#07070F" : "#F6F6FC"

  return (
    <div
      ref={(el) => {
        // Merge refs
        ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = el
        ;(sectionRef as React.MutableRefObject<HTMLDivElement | null>).current = el
      }}
      style={{
        position: "relative",
        zIndex: 20,
        borderRadius: "clamp(24px,3.5vw,48px) clamp(24px,3.5vw,48px) 0 0",
        overflow: "hidden",
        marginTop: "-clamp(24px,3.5vw,48px)",
        minHeight: "100svh",
        background: "var(--color-bg)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(50px)",
        transition: "opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1)",
        willChange: "transform",
      }}
    >
      {/* ── PARTICLES — same as hero ────────────────────── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── MOUSE-REACTIVE AMBIENT — same as hero ────────── */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        background: `radial-gradient(ellipse 55% 50% at ${gx}% ${gy}%, var(--color-accent-muted) 0%, transparent 65%)`,
        transition: "background 0.12s ease",
      }} />

      {/* ── GRADIENT MESH — same ambient as hero ─────────── */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        background: "var(--gradient-mesh)",
        opacity: 0.6,
      }} />

      {/* ── PAINT WIPE — sweeps UP, same bg as hero = invisible seam ── */}
      {/* Primary brush */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: paintBg,
        transform: painted ? "translateY(0%)" : "translateY(100%)",
        transition: painted ? "transform 0.95s cubic-bezier(0.86,0,0.07,1)" : "none",
        willChange: "transform",
      }}>
        {/* Jagged TOP edge — rough brush stroke */}
        <div style={{
          position: "absolute",
          top: -40, left: 0, right: 0, height: 80,
          background: paintBg,
          clipPath: "polygon(0 100%,3% 38%,8% 68%,15% 18%,23% 55%,31% 8%,40% 58%,49% 12%,57% 50%,65% 4%,73% 44%,82% 10%,90% 52%,97% 22%,100% 42%,100% 100%)",
        }} />
      </div>
      {/* Secondary thinner brush */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: paintBg,
        opacity: 0.5,
        transform: painted ? "translateY(0%)" : "translateY(100%)",
        transition: painted ? "transform 1.1s cubic-bezier(0.86,0,0.07,1) 0.06s" : "none",
        willChange: "transform",
      }}>
        <div style={{
          position: "absolute",
          top: -30, left: 0, right: 0, height: 60,
          background: paintBg,
          opacity: 0.5,
          clipPath: "polygon(0 100%,5% 28%,12% 62%,20% 8%,28% 48%,37% 4%,46% 46%,55% 16%,63% 52%,71% 6%,80% 40%,88% 15%,96% 48%,100% 28%,100% 100%)",
        }} />
      </div>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div style={{
        position: "relative",
        zIndex: 5,
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "clamp(5rem,10vw,8rem) clamp(1rem,4vw,3rem) clamp(4rem,8vw,7rem)",
        opacity: revealed ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>

        {/* ── EYEBROW ─────────────────────────────────── */}
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(.6rem,1vw,.72rem)",
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "var(--color-accent)",
          marginBottom: "clamp(2.5rem,5vw,4rem)",
          display: "flex",
          alignItems: "center",
          gap: ".5rem",
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? "translateY(0)" : "translateY(12px)",
          transition: "all .6s ease",
        }}>
          <span style={{ width: 20, height: "1px", background: "var(--color-accent)", display: "inline-block" }} />
          About Me
        </p>

        {/* ── MAIN GRID ───────────────────────────────── */}
        <div
          className="about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(3rem,6vw,8rem)",
            alignItems: "start",
          }}
        >

          {/* ── LEFT: TEXT ──────────────────────────────── */}
          <div>
            {/* Headline */}
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem,6.5vw,5.5rem)",
              fontWeight: 800,
              letterSpacing: "-.04em",
              lineHeight: .92,
              margin: "0 0 clamp(1.5rem,3vw,2.5rem)",
              color: "var(--color-text-primary)",
            }}>
              {[
                { text: "Building",       delay: "0s" },
                { text: "things that",    delay: "0.08s" },
                { text: <>matter <span style={{ color:"transparent", WebkitTextStroke:`2px ${theme.colors.accent}` }}>deeply.</span></>, delay: "0.16s" },
              ].map((line, i) => (
                <div key={i} style={{ overflow: "hidden", lineHeight: 1.05 }}>
                  <div style={{
                    opacity: textVisible ? 1 : 0,
                    transform: textVisible ? "translateY(0)" : "translateY(100%)",
                    transition: `opacity .7s ease ${line.delay}, transform .7s cubic-bezier(.16,1,.3,1) ${line.delay}`,
                    display: "block",
                    paddingBottom: ".06em",
                  }}>{line.text}</div>
                </div>
              ))}
            </h2>

            {/* Bio paragraphs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(.875rem,1.5vw,1.25rem)" }}>
              {[
                { text: "I'm Brian Chege — a Full Stack Developer and Co-Founder based in Eldoret, Kenya. I've spent 3+ years turning complex problems into clean, scalable software across web, mobile, and cloud.", delay: "0.2s" },
                { text: "From co-founding HealthMaster — a health-tech startup tackling medication adherence with AI — to leading engineering at Softrinx, I build products that genuinely move people.", delay: "0.3s" },
                { text: "I don't just write code. I think in systems, lead teams, talk to users, and ship. A Dedan Kimathi Computer Science graduate, Equity Leaders Programme scholar, and relentless builder.", delay: "0.4s" },
              ].map((p, i) => (
                <p key={i} style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(.875rem,1.5vw,1.0625rem)",
                  lineHeight: 1.75,
                  color: "var(--color-text-secondary)",
                  margin: 0,
                  opacity: textVisible ? 1 : 0,
                  transform: textVisible ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity .7s ease ${p.delay}, transform .7s cubic-bezier(.16,1,.3,1) ${p.delay}`,
                }}>{p.text}</p>
              ))}
            </div>

            {/* Accent line */}
            <div style={{
              width: textVisible ? "100%" : "0%",
              height: "1px",
              background: `linear-gradient(to right, var(--color-accent), transparent)`,
              margin: "clamp(1.5rem,3vw,2.5rem) 0",
              transition: "width 1s cubic-bezier(.16,1,.3,1) .5s",
            }} />

            {/* Trait pills */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: ".5rem",
              marginBottom: "clamp(2rem,4vw,3rem)",
            }}>
              {TRAITS.map((trait, i) => (
                <span key={trait} style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(.6rem,.9vw,.7rem)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  border: "1px solid var(--color-accent)",
                  padding: ".3rem .75rem",
                  opacity: textVisible ? 1 : 0,
                  transform: textVisible ? "translateY(0) scale(1)" : "translateY(8px) scale(.95)",
                  transition: `all .5s cubic-bezier(.16,1,.3,1) ${0.55 + i * 0.05}s`,
                }}>{trait}</span>
              ))}
            </div>

            {/* ── IMAGE STACK — editorial collage ─────────── */}
            <div
              style={{
                position: "relative",
                height: "clamp(200px,28vw,320px)",
                opacity: textVisible ? 1 : 0,
                transition: "opacity .8s ease .7s",
              }}
            >
              {IMAGES.map((img, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    // Staggered offsets — editorial collage feel
                    top:   i === 0 ? 0        : i === 1 ? "8%"  : "16%",
                    left:  i === 0 ? 0        : i === 1 ? "28%" : "55%",
                    width: i === 0 ? "46%"    : i === 1 ? "42%" : "38%",
                    aspectRatio: "4/3",
                    borderRadius: "clamp(8px,1vw,14px)",
                    overflow: "hidden",
                    boxShadow: i === activeImg
                      ? `0 20px 60px rgba(0,0,0,.5), 0 0 0 1.5px var(--color-accent), var(--shadow-glow)`
                      : "0 10px 30px rgba(0,0,0,.35)",
                    transform: i === activeImg
                      ? "scale(1.04) translateY(-4px)"
                      : i === (activeImg + 1) % IMAGES.length
                        ? "scale(.97) rotate(1.5deg)"
                        : "scale(.94) rotate(-1deg)",
                    zIndex: i === activeImg ? 3 : i === (activeImg + 1) % IMAGES.length ? 2 : 1,
                    transition: "all .6s cubic-bezier(.16,1,.3,1)",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveImg(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: i === activeImg
                        ? "saturate(1.1) brightness(0.95)"
                        : "saturate(0.6) brightness(0.7)",
                      transition: "filter .6s ease",
                    }}
                  />
                  {/* Caption overlay */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 50%)",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: ".625rem",
                    opacity: i === activeImg ? 1 : 0,
                    transition: "opacity .4s ease",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: ".55rem",
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "var(--color-accent)",
                    }}>{img.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: STATS + TIMELINE ─────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(2rem,4vw,3.5rem)" }}>

            {/* Stats */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(1.5rem,3vw,2.5rem) clamp(1rem,2vw,2rem)",
            }}>
              {FACTS.map((f, i) => (
                <div key={f.label} style={{
                  opacity: textVisible ? 1 : 0,
                  transform: textVisible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity .7s ease ${i * 0.08 + 0.25}s, transform .7s cubic-bezier(.16,1,.3,1) ${i * 0.08 + 0.25}s`,
                }}>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.5rem,6vw,5rem)",
                    fontWeight: 800,
                    letterSpacing: "-.04em",
                    lineHeight: 1,
                    color: "var(--color-accent)",
                    marginBottom: ".25rem",
                  }}>{f.num}</div>
                  <div style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(.7rem,1vw,.8125rem)",
                    color: "var(--color-text-muted)",
                    letterSpacing: ".04em",
                  }}>{f.label}</div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{
              width: textVisible ? "100%" : "0%",
              height: "1px",
              background: "var(--color-surface-border)",
              transition: "width 1s cubic-bezier(.16,1,.3,1) .4s",
            }} />

            {/* Timeline */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { year: "2025 →", event: "Co-Founder & CTO, Softrinx",        sub: "Leading product & engineering" },
                { year: "2025",   event: "Full Stack Dev, Teach2Give",          sub: "Angular · Docker · AWS" },
                { year: "2024",   event: "Co-Founder & CTO, HealthMaster",      sub: "AI health-tech startup" },
                { year: "2024",   event: "Intern — Prodigy InfoTech & Codsoft", sub: "MERN stack development" },
                { year: "2023",   event: "Software Engineer Intern, ALX Africa",sub: "Python · DevOps · Systems" },
                { year: "2022",   event: "Equity Leaders Programme Scholar",    sub: "Top KCSE student, Wareng HS" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "3.5rem 1fr",
                  gap: ".75rem",
                  padding: "clamp(.75rem,1.2vw,1rem) 0",
                  borderBottom: "1px solid var(--color-surface-border)",
                  opacity: textVisible ? 1 : 0,
                  transform: textVisible ? "translateX(0)" : "translateX(20px)",
                  transition: `opacity .6s ease ${i * 0.07 + 0.35}s, transform .6s cubic-bezier(.16,1,.3,1) ${i * 0.07 + 0.35}s`,
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(.55rem,.75vw,.65rem)",
                    color: "var(--color-accent)",
                    letterSpacing: ".04em",
                    paddingTop: ".15em",
                    opacity: .7,
                  }}>{item.year}</span>
                  <div>
                    <div style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(.8rem,1.2vw,.9rem)",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      marginBottom: ".15rem",
                    }}>{item.event}</div>
                    <div style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(.55rem,.8vw,.65rem)",
                      color: "var(--color-text-muted)",
                      letterSpacing: ".04em",
                    }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? "translateY(0)" : "translateY(10px)",
              transition: "all .6s ease .9s",
            }}>
              <a
                href="/cv.pdf"
                download
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(.75rem,1.1vw,.875rem)",
                  fontWeight: 600,
                  letterSpacing: ".04em",
                  color: "var(--color-accent-fg)",
                  background: "var(--color-accent)",
                  padding: ".75rem clamp(1.25rem,2vw,2rem)",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".5rem",
                  boxShadow: "var(--shadow-glow)",
                  transition: "transform .2s ease",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "" }}
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
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}