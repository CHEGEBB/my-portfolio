"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"
import { ArrowUpRight } from "lucide-react"

// ─── DATA ────────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id:"01", title:"IntelliMark",     category:"AI · EdTech",        type:"CLIENT",  year:"2024", image:"/projects/intellimark.png",   href:"/portfolio"   },
  { id:"02", title:"TabooTalks",      category:"Social · Web App",   type:"CLIENT",  year:"2024", image:"/projects/tabootalks.png",    href:"/portfolio"    },
  { id:"03", title:"H-mex Health",    category:"HealthTech · AI",    type:"CLIENT",  year:"2024", image:"/projects/hmex.png",          href:"/portfolio"  },
  { id:"04", title:"WerEntOnline",    category:"PropTech · Web",     type:"CLIENT",  year:"2024", image:"/projects/werentonline.png",  href:"/portfolio"  },
  { id:"05", title:"FarmSense",       category:"AgriTech · Web",     type:"CLIENT",  year:"2024", image:"/projects/farmsense.png",     href:"/portfolio"     },
  { id:"06", title:"DjAfro StreamBox",category:"Mobile · Streaming", type:"CLIENT",  year:"2024", image:"/projects/djafro.png",        href:"/portfolio"        },
  { id:"07", title:"Softrinx",        category:"SaaS · Enterprise",  type:"STARTUP", year:"2025", image:"/projects/softrinx.png",      href:"/portfolio"      },
  { id:"08", title:"Teach2Give",      category:"EdTech · Web",       type:"CLIENT",  year:"2025", image:"/projects/teach2give.png",    href:"/portfolio"    },
]

const FALLBACKS = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=80",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=900&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80",
  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=900&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80",
]

// ─── FILM SPROCKET HOLES ─────────────────────────────────────────────────────
function Sprockets({ side }: { side: "top" | "bottom" }) {
  const holes = Array.from({ length: 40 })
  return (
    <div style={{
      position: "absolute",
      [side]: 0,
      left: 0, right: 0,
      height: 18,
      background: "#000",
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "0 6px",
      zIndex: 10,
      overflow: "hidden",
    }}>
      {holes.map((_, i) => (
        <div key={i} style={{
          width: 10, height: 8, flexShrink: 0,
          borderRadius: 2,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
        }} />
      ))}
    </div>
  )
}

// ─── SINGLE CARD ─────────────────────────────────────────────────────────────
function FilmCard({ project, idx, trackPaused, onEnter, onLeave }: {
  project: typeof PROJECTS[0]
  idx: number
  trackPaused: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  const { theme } = useTheme()
  const [hovered, setHovered] = useState(false)
  const [src, setSrc] = useState(project.image)
  const acc = theme.colors.accent

  const enter = () => { setHovered(true);  onEnter() }
  const leave = () => { setHovered(false); onLeave() }

  return (
    <Link
      href={project.href}
      onMouseEnter={enter}
      onMouseLeave={leave}
      style={{
        display: "block",
        textDecoration: "none",
        position: "relative",
        width: "clamp(260px, 28vw, 420px)",
        height: "clamp(180px, 19vw, 280px)",
        flexShrink: 0,
        overflow: "hidden",
        cursor: "none",
        outline: "none",
      }}
    >
      {/* ── Image with zoom ── */}
      <img
        src={src}
        alt={project.title}
        onError={() => setSrc(FALLBACKS[idx % FALLBACKS.length])}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          // Infinite slow zoom in/out while on screen
          animation: "filmZoom 8s ease-in-out infinite alternate",
          filter: hovered ? "brightness(0.82)" : "brightness(0.92)",
          transition: "filter 0.5s ease",
          willChange: "transform, filter",
          animationPlayState: trackPaused ? "paused" : "running",
        }}
      />

      {/* Dark vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(150deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.75) 100%)",
        zIndex: 1,
        transition: "opacity 0.4s ease",
        opacity: hovered ? 0.7 : 1,
      }} />



      {/* Content */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "clamp(0.75rem,1.2vw,1rem)",
      }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.48rem", letterSpacing: "0.14em", textTransform: "uppercase",
            color: acc, background: `${acc}1a`,
            border: `1px solid ${acc}44`,
            padding: "0.18rem 0.48rem",
            backdropFilter: "blur(6px)",
          }}>{project.type}</span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.48rem",
            color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em",
          }}>{project.year}</span>
        </div>

        {/* Bottom */}
        <div>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.46rem", letterSpacing: "0.1em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)", margin: "0 0 0.2rem",
          }}>{project.category}</p>

          {/* Title — outline → solid on hover */}
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1rem,2vw,1.55rem)",
            fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1,
            margin: "0 0 0.5rem",
            color: hovered ? "#fff" : "transparent",
            WebkitTextStroke: hovered ? "0px" : "1.5px rgba(255,255,255,0.7)",
            transition: "color 0.35s ease, -webkit-text-stroke 0.35s ease",
          }}>{project.title}</h3>

          {/* Arrow circle */}
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            border: `1.5px solid ${acc}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: acc,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scale(1) rotate(0deg)" : "scale(0.4) rotate(-90deg)",
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <ArrowUpRight size={12} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Bottom accent bar draws in */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${acc}, transparent)`,
        zIndex: 4,
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "center",
        transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: `0 0 10px ${acc}`,
      }} />
    </Link>
  )
}

// ─── FILM STRIP TRACK ────────────────────────────────────────────────────────
function FilmStrip({ projects, direction, speed, inView }: {
  projects: typeof PROJECTS
  direction: "left" | "right"
  speed: number
  inView: boolean
}) {
  const [paused, setPaused] = useState(false)
  const items = [...projects, ...projects, ...projects] // triple for seamless

  return (
    <div
      style={{
        position: "relative",
        background: "#000",
        marginBottom: "1px",
        // Edge fade
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
        maskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translateY(0) skewX(0deg)"
          : direction === "right" ? "translateY(30px) skewX(1deg)" : "translateY(30px) skewX(-1deg)",
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${direction === "right" ? "0.3s" : "0.5s"}, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${direction === "right" ? "0.3s" : "0.5s"}`,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Sprockets side="top" />

      <div style={{
        display: "flex",
        gap: "clamp(0.75rem,1.5vw,1.25rem)",
        width: "max-content",
        padding: "18px 0",
        animation: `strip-${direction} ${speed}s linear infinite`,
        animationPlayState: paused ? "paused" : "running",
        willChange: "transform",
      }}>
        {items.map((p, i) => (
          <FilmCard
            key={`${p.id}-${i}`}
            project={p}
            idx={i}
            trackPaused={paused}
            onEnter={() => setPaused(true)}
            onLeave={() => setPaused(false)}
          />
        ))}
      </div>

      <Sprockets side="bottom" />
    </div>
  )
}

// ─── COUNTER — animated number ────────────────────────────────────────────────
function Counter({ to, label }: { to: number; label: string }) {
  const [val, setVal] = useState(0)
  const { theme } = useTheme()
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        let start = 0
        const step = () => {
          start += Math.ceil((to - start) / 8)
          setVal(Math.min(start, to))
          if (start < to) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to])

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(2rem,5vw,4rem)",
        fontWeight: 800, letterSpacing: "-0.05em",
        color: "var(--color-accent)",
        lineHeight: 1,
      }}>{val}+</div>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.55rem", letterSpacing: "0.14em", textTransform: "uppercase",
        color: "var(--color-text-muted)",
        marginTop: "0.4rem",
      }}>{label}</div>
    </div>
  )
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export function FeaturedWork() {
  const { theme } = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const acc = theme.colors.accent

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.04 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    setMouse({
      x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
    })
  }, [])

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    el.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => el.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  const trackA = PROJECTS.slice(0, 4)
  const trackB = PROJECTS.slice(4)

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", background: "var(--color-bg)", overflow: "hidden" }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse 55% 50% at ${(mouse.x * 100).toFixed(1)}% ${(mouse.y * 100).toFixed(1)}%, var(--color-accent-muted) 0%, transparent 65%)`,
        transition: "background 0.12s ease",
      }} />

      <div style={{ position: "relative", zIndex: 2 }}>

        {/* ── SECTION HEADER ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "end",
          gap: "2rem",
          padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,4rem) clamp(2.5rem,5vw,4rem)",
          flexWrap: "wrap",
        }}>
          {/* Left */}
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              marginBottom: "1.25rem",
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(16px)",
              transition: "all 0.6s ease 0.1s",
            }}>
              <div style={{ width: 28, height: "1px", background: acc }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                letterSpacing: "0.15em", textTransform: "uppercase", color: acc,
              }}>Selected Work</span>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                color: "var(--color-text-muted)", letterSpacing: "0.08em",
                border: "1px solid var(--color-surface-border)",
                padding: "0.15rem 0.5rem",
              }}>{PROJECTS.length} Projects</div>
            </div>

            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem,9vw,8rem)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.88,
              margin: 0,
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(24px)",
              transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.18s",
            }}>
              <span style={{ display: "block", color: "var(--color-text-primary)" }}>Things</span>
              <span style={{
                display: "block",
                color: "transparent",
                WebkitTextStroke: `2px ${acc}`,
                textShadow: `0 0 60px ${acc}33`,
              }}>I&apos;ve Built</span>
            </h2>
          </div>

          {/* Right: stats + CTA */}
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "flex-end", gap: "2rem",
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(20px)",
            transition: "all 0.8s ease 0.35s",
          }}>
            {/* Stats row */}
            <div style={{ display: "flex", gap: "2.5rem" }}>
              <Counter to={20} label="Projects" />
              <Counter to={7}  label="Companies" />
              <Counter to={3}  label="Years" />
            </div>

            <Link href="/portfolio" style={{
              display: "inline-flex", alignItems: "center", gap: "0.6rem",
              fontFamily: "var(--font-body)", fontSize: "0.875rem",
              fontWeight: 600, letterSpacing: "0.04em",
              color: "var(--color-accent-fg)",
              background: acc,
              padding: "0.65rem 1.5rem",
              borderRadius: "9999px",
              textDecoration: "none",
              boxShadow: `0 0 28px ${acc}44`,
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform="scale(1.05)";el.style.boxShadow=`0 0 40px ${acc}66`}}
            onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform="scale(1)";el.style.boxShadow=`0 0 28px ${acc}44`}}
            >
              View all work <ArrowUpRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* ── FILM STRIPS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {/* Track A → scrolls right */}
          <FilmStrip projects={trackA} direction="right" speed={38} inView={inView} />
          {/* Track B → scrolls left */}
          <FilmStrip projects={trackB} direction="left"  speed={42} inView={inView} />
        </div>

        {/* ── BOTTOM CTA ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: "2rem",
          padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.8s ease 0.7s",
        }}>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, transparent, var(--color-surface-border))` }} />
          <Link href="//portfolio" style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1rem,2.5vw,1.5rem)",
            fontWeight: 700, letterSpacing: "-0.02em",
            color: "var(--color-text-primary)",
            textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "0.75rem",
            transition: "gap 0.3s ease, color 0.2s ease",
          }}
          onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.gap="1.5rem";el.style.color=acc}}
          onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.gap="0.75rem";el.style.color="var(--color-text-primary)"}}
          >
            See everything I&apos;ve built <ArrowUpRight size={18} strokeWidth={2} />
          </Link>
          <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, var(--color-surface-border), transparent)` }} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes strip-right {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes strip-left {
          from { transform: translateX(-33.333%); }
          to   { transform: translateX(0); }
        }
        @keyframes filmZoom {
          from { transform: scale(1);    }
          to   { transform: scale(1.08); }
        }
      `}</style>
    </section>
  )
}