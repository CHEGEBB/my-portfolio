"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"

const PROJECTS = [
  {
    id: "01",
    title: "HealthMaster",
    category: "Health Tech · AI",
    description: "AI-driven platform for medication adherence and NCD risk assessment. Built the core mobile app and web tool with ML-powered health analytics.",
    stack: ["React Native", "Next.js", "Python", "PostgreSQL"],
    year: "2024",
    role: "Co-Founder & CTO",
    href: "/projects/healthmaster",
  },
  {
    id: "02",
    title: "Softrinx",
    category: "SaaS · Enterprise",
    description: "End-to-end software platform serving startups and enterprises. Full system architecture from frontend to cloud.",
    stack: ["Next.js", "TypeScript", "Node.js", "AWS"],
    year: "2025",
    role: "Co-Founder & CTO",
    href: "/projects/softrinx",
  },
  {
    id: "03",
    title: "Teach2Give",
    category: "EdTech · Web",
    description: "Developer learning portal with course management, progress tracking, real-time collaboration and CI/CD on AWS.",
    stack: ["Angular", "TypeScript", "PostgreSQL", "Docker"],
    year: "2025",
    role: "Full Stack Developer",
    href: "/projects/teach2give",
  },
  {
    id: "04",
    title: "MERN Platform",
    category: "Backend · API",
    description: "Production-grade RESTful APIs and responsive MERN systems. Scalable, documented, deployed.",
    stack: ["MongoDB", "Express", "React", "Node.js"],
    year: "2024",
    role: "Full Stack Intern",
    href: "/projects/mern-api",
  },
]

function useInView(threshold = 0.15) {
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

export function FeaturedWork() {
  const { theme }               = useTheme()
  const { ref, inView }         = useInView(0.08)
  const [painted, setPainted]   = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [activeRow, setActiveRow] = useState<number | null>(null)
  const isDark = theme.mode === "dark"

  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setPainted(true), 80)
    const t2 = setTimeout(() => setRevealed(true), 1050)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [inView])

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100svh",
        background: "var(--color-bg)",
        overflow: "hidden",
      }}
    >
      {/* ── THE PAINT ─────────────────────────────────────────
          Full-section color block that sweeps in left→right.
          translateX = compositor only = buttery smooth.
          The jagged clip on the leading edge = brush feel.
      ──────────────────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          // Paint color: accent-tinted version of the surface
          background: isDark
            ? `color-mix(in srgb, ${theme.colors.accent} 18%, #0B0B18)`
            : `color-mix(in srgb, ${theme.colors.accent} 14%, #EBEBF7)`,
          // Slide in from left, stop at full width
          transform: painted ? "translateX(0%)" : "translateX(-100%)",
          transition: painted
            ? "transform 0.95s cubic-bezier(0.86, 0, 0.07, 1)"
            : "none",
          willChange: "transform",
        }}
      >
        {/* Jagged leading edge — CSS only, no SVG */}
        <div style={{
          position: "absolute",
          top: 0, right: -32, bottom: 0,
          width: 64,
          background: "inherit",
          clipPath: "polygon(0 0, 55% 2%, 100% 7%, 72% 16%, 100% 27%, 60% 36%, 98% 48%, 62% 59%, 100% 70%, 68% 80%, 100% 91%, 55% 97%, 0 100%)",
        }} />
      </div>

      {/* Second brush layer — thinner, trails behind for depth */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: isDark
            ? `color-mix(in srgb, ${theme.colors.accent} 8%, #0B0B18)`
            : `color-mix(in srgb, ${theme.colors.accent} 6%, #EBEBF7)`,
          transform: painted ? "translateX(0%)" : "translateX(-100%)",
          transition: painted
            ? "transform 1.15s cubic-bezier(0.86, 0, 0.07, 1) 0.06s"
            : "none",
          willChange: "transform",
        }}
      >
        <div style={{
          position: "absolute",
          top: 0, right: -24, bottom: 0,
          width: 48,
          background: "inherit",
          clipPath: "polygon(0 4%, 70% 0, 100% 10%, 65% 22%, 100% 35%, 55% 48%, 90% 60%, 60% 72%, 95% 85%, 50% 95%, 0 100%)",
        }} />
      </div>

      {/* ── CONTENT ─────────────────────────────────────────── */}
      <div style={{
        position: "relative",
        zIndex: 5,
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "clamp(5rem,10vw,8rem) clamp(1rem,4vw,3rem) clamp(4rem,8vw,6rem)",
        opacity: revealed ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>

        {/* ── HEADER ──────────────────────────────────────── */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "clamp(3rem,7vw,6rem)",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(.6rem,1vw,.72rem)",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: ".75rem",
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}>
              <span style={{ width: 20, height: "1px", background: "var(--color-accent)", display: "inline-block" }} />
              Selected Work
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.75rem,8vw,7rem)",
              fontWeight: 800,
              letterSpacing: "-.04em",
              lineHeight: .9,
              margin: 0,
              color: "var(--color-text-primary)",
            }}>
              Things I&apos;ve{" "}
              <span style={{
                color: "transparent",
                WebkitTextStroke: "2px var(--color-accent)",
              }}>Built</span>
            </h2>
          </div>

          <Link href="/projects" style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(.75rem,1.1vw,.875rem)",
            fontWeight: 500,
            color: "var(--color-text-muted)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: ".4rem",
            transition: "color .2s ease, gap .2s ease",
            alignSelf: "flex-start",
          }}
          onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.color="var(--color-accent)";el.style.gap=".75rem"}}
          onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.color="var(--color-text-muted)";el.style.gap=".4rem"}}
          >
            All projects
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* ── PROJECT ROWS — pure typography, no cards ──────── */}
        <div style={{ position: "relative" }}>
          {PROJECTS.map((project, i) => (
            <Link
              key={project.id}
              href={project.href}
              onMouseEnter={() => setActiveRow(i)}
              onMouseLeave={() => setActiveRow(null)}
              style={{
                display: "grid",
                gridTemplateColumns: "3.5rem 1fr auto",
                alignItems: "start",
                gap: "clamp(1rem,3vw,2.5rem)",
                padding: "clamp(1.5rem,3vw,2.5rem) 0",
                borderTop: "1px solid var(--color-surface-border)",
                textDecoration: "none",
                position: "relative",
                overflow: "hidden",
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateX(0)" : "translateX(-30px)",
                transition: [
                  `opacity .6s ease ${i * 0.09 + 0.05}s`,
                  `transform .6s cubic-bezier(.16,1,.3,1) ${i * 0.09 + 0.05}s`,
                ].join(", "),
              }}
              className="project-row"
            >
              {/* Hover fill — sweeps from left */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(90deg, ${theme.colors.accent}10 0%, transparent 70%)`,
                transform: activeRow === i ? "translateX(0%)" : "translateX(-100%)",
                transition: "transform 0.4s cubic-bezier(.16,1,.3,1)",
                pointerEvents: "none",
              }} />

              {/* Number */}
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(.65rem,1vw,.75rem)",
                color: activeRow === i ? "var(--color-accent)" : "var(--color-text-muted)",
                letterSpacing: ".08em",
                paddingTop: ".2em",
                transition: "color .2s ease",
                position: "relative",
                zIndex: 1,
              }}>{project.id}</span>

              {/* Main content */}
              <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
                {/* Category + year */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "clamp(.35rem,.6vw,.5rem)",
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(.6rem,.85vw,.7rem)",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                  }}>{project.category}</span>
                  <span style={{
                    width: 3, height: 3, borderRadius: "50%",
                    background: "var(--color-text-muted)",
                    opacity: .4,
                    display: "inline-block",
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(.6rem,.85vw,.7rem)",
                    color: "var(--color-text-muted)",
                  }}>{project.year}</span>
                </div>

                {/* Title — the big thing */}
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem,5vw,4rem)",
                  fontWeight: 800,
                  letterSpacing: "-.03em",
                  lineHeight: .95,
                  color: activeRow === i ? "var(--color-accent)" : "var(--color-text-primary)",
                  margin: "0 0 clamp(.625rem,1.2vw,1rem)",
                  transition: "color .25s ease",
                }}>{project.title}</h3>

                {/* Description — only shows on active */}
                <div style={{
                  maxHeight: activeRow === i ? "6rem" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s cubic-bezier(.16,1,.3,1)",
                }}>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(.8rem,1.2vw,.875rem)",
                    lineHeight: 1.65,
                    color: "var(--color-text-secondary)",
                    maxWidth: "560px",
                    margin: "0 0 .75rem",
                  }}>{project.description}</p>
                </div>

                {/* Stack — always visible */}
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: ".35rem",
                  marginTop: ".4rem",
                }}>
                  {project.stack.map(s => (
                    <span key={s} style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(.55rem,.75vw,.65rem)",
                      letterSpacing: ".06em",
                      color: activeRow === i ? "var(--color-accent)" : "var(--color-text-muted)",
                      transition: "color .2s ease",
                    }}>{s}{" "}</span>
                  ))}
                </div>
              </div>

              {/* Right: role + arrow */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "1rem",
                paddingTop: ".2em",
                position: "relative",
                zIndex: 1,
                flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(.55rem,.8vw,.65rem)",
                  letterSpacing: ".08em",
                  color: "var(--color-text-muted)",
                  textAlign: "right",
                  display: "none",
                }}
                className="role-label"
                >{project.role}</span>

                {/* Arrow circle */}
                <div style={{
                  width: "clamp(36px,4vw,48px)",
                  height: "clamp(36px,4vw,48px)",
                  borderRadius: "50%",
                  border: `1.5px solid ${activeRow === i ? "var(--color-accent)" : "var(--color-surface-border)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: activeRow === i ? "rotate(-45deg)" : "rotate(0deg)",
                  transition: "all .35s cubic-bezier(.16,1,.3,1)",
                  color: activeRow === i ? "var(--color-accent)" : "var(--color-text-muted)",
                  flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}

          {/* Last border */}
          <div style={{ borderBottom: "1px solid var(--color-surface-border)" }} />
        </div>

        {/* ── BOTTOM CTA ─────────────────────────────────── */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "clamp(3rem,6vw,5rem)",
          opacity: revealed ? 1 : 0,
          transition: "opacity .6s ease .5s",
        }}>
          <Link href="/projects" style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1rem,2.5vw,1.5rem)",
            fontWeight: 700,
            letterSpacing: "-.01em",
            color: "var(--color-text-primary)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "1rem",
            transition: "gap .3s ease, color .2s ease",
          }}
          onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.gap="1.75rem";el.style.color="var(--color-accent)"}}
          onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.gap="1rem";el.style.color="var(--color-text-primary)"}}
          >
            See everything I&apos;ve built
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @media (min-width: 768px) {
          .role-label { display: block !important; }
        }
        @media (max-width: 640px) {
          .project-row {
            grid-template-columns: 2.5rem 1fr auto !important;
          }
        }
      `}</style>
    </section>
  )
}