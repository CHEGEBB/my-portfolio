"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"
import { ArrowUpRight, ExternalLink, Smartphone } from "lucide-react"

const PROJECTS = [
  {
    id: "00", title: "ModelsNest", sub: "Enterprise AI APIs",
    category: "AI Infrastructure · SaaS", type: "STARTUP", year: "2026",
    image: "/projects/modelsnest.png",
    tags: ["AI", "APIs", "Next.js", "Enterprise"],
    desc: "One API. 50+ models. Production-ready infrastructure with sub-200ms latency and 99.99% uptime. Ship AI features in minutes, not months.",
    accent: "#00D4FF",
    links: [{ label: "Live Site", href: "https://modelsnest.vercel.app/", icon: "web" }],
  },
  {
    id: "01", title: "IntelliMark", sub: "AI Assessment Platform",
    category: "EdTech · AI", type: "CLIENT", year: "2025",
    image: "/projects/intellimark.png",
    tags: ["AI", "EdTech", "React"],
    desc: "AI-powered university assessment that transforms how institutions evaluate students — adaptive, intelligent, beautifully designed.",
    accent: "#5567F7", links: [],
  },
  {
    id: "02", title: "TabooTalks", sub: "Connections Platform",
    category: "Social · Web App", type: "CLIENT", year: "2025",
    image: "/projects/tabootalks.png",
    tags: ["React", "Node.js", "Real-time"],
    desc: "Authentic connections platform breaking social taboos — real conversations, real-time, built for honesty over performative socializing.",
    accent: "#FF6B9D", links: [],
  },
  {
    id: "03", title: "H-mex Health", sub: "AI NCDs Risk Tool",
    category: "HealthTech · AI", type: "CLIENT", year: "2026",
    image: "/projects/hmex.png",
    tags: ["AI/ML", "HealthTech", "React"],
    desc: "AI-powered non-communicable disease risk assessment. Helping clinicians in underserved African healthcare make better decisions faster.",
    accent: "#22C55E", links: [],
  },
  {
    id: "04", title: "WerEntOnline", sub: "Real Estate Platform",
    category: "PropTech · Web App", type: "CLIENT", year: "2025",
    image: "/projects/werentonline.png",
    tags: ["Next.js", "Maps API", "Full-stack"],
    desc: "End-to-end real estate rental & leasing — listing to lease signing, all digital, all connected via Maps API.",
    accent: "#F5A623", links: [],
  },
  {
    id: "05", title: "FarmSense", sub: "Smart Farming",
    category: "AgriTech · Web App", type: "CLIENT", year: "2024",
    image: "/projects/farmsense.png",
    tags: ["React", "Analytics", "AgriTech"],
    desc: "Smart farming analytics without hardware. Kenyan farmers making data-driven decisions via satellite imagery and predictive analytics.",
    accent: "#AAFF00", links: [],
  },
  {
    id: "06", title: "DjAfro StreamBox", sub: "Movies Streaming App",
    category: "Mobile · Streaming", type: "CLIENT", year: "2025",
    image: "/projects/djafro.png",
    tags: ["Flutter", "Dart", "Appwrite","Intasend"],
    desc: "Full streaming app — video player, offline mode, subscriptions — built from scratch and shipped to Google Play. 1,000+ downloads.",
    accent: "#8B5CF6",
    links: [
      { label: "Play Store", href: "https://play.google.com/store/apps/details?id=com.djafrostreambox", icon: "android" },
      { label: "Web App", href: "https://djafrostreambox.vercel.app/", icon: "web" },
    ],
  },
  {
    id: "07", title: "Softrinx", sub: "SaaS Enterprise",
    category: "SaaS · Enterprise", type: "STARTUP", year: "2026",
    image: "/projects/softrinx.png",
    tags: ["SaaS", "Enterprise", "Full-stack"],
    desc: "Co-founded and built the technical core of Softrinx — an enterprise SaaS platform serving companies across East Africa.",
    accent: "#45D2B0", links: [],
  },
  {
    id: "08", title: "Teach2Give", sub: "EdTech Platform",
    category: "EdTech · Web", type: "CLIENT", year: "2025",
    image: "/projects/teach2give.png",
    tags: ["EdTech", "Web", "React"],
    desc: "A learning platform connecting mentors with learners across Africa — beautifully designed, fast, and accessible.",
    accent: "#FF4D1C", links: [],
  },
]

const FALLBACKS = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
  "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=1200&q=80",
]

// ─── ROW — full-width editorial project row ───────────────────────────────────
function ProjectRow({ project, idx, inView }: {
  project: typeof PROJECTS[0]; idx: number; inView: boolean
}) {
  const { theme } = useTheme()
  const [hovered, setHovered] = useState(false)
  const [src, setSrc] = useState(project.image)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const rowRef = useRef<HTMLDivElement>(null)
  const acc = project.accent
  const even = idx % 2 === 0

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = rowRef.current?.getBoundingClientRect()
    if (!r) return
    setCursorPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  const delay = `${idx * 0.09}s`

  return (
    <div
      ref={rowRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMouseMove}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: even ? "1fr 1.1fr" : "1.1fr 1fr",
        minHeight: "clamp(320px, 38vw, 560px)",
        borderBottom: "1px solid var(--color-surface-border)",
        cursor: "none",
        overflow: "hidden",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}`,
      }}
    >
      {/* Custom cursor blob */}
      <div style={{
        position: "absolute",
        left: cursorPos.x - 40,
        top: cursorPos.y - 40,
        width: 80, height: 80,
        borderRadius: "50%",
        background: acc,
        opacity: hovered ? 0.12 : 0,
        filter: "blur(20px)",
        pointerEvents: "none",
        zIndex: 10,
        transition: "opacity 0.3s ease",
        transform: "translate(0,0)",
        willChange: "left, top",
      }} />

      {/* IMAGE SIDE */}
      <div style={{
        order: even ? 1 : 2,
        position: "relative",
        overflow: "hidden",
      }}>
        <img
          src={src}
          alt={project.title}
          onError={() => setSrc(FALLBACKS[idx % FALLBACKS.length])}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.07)" : "scale(1.0)",
            filter: hovered ? "brightness(0.6) saturate(1.1)" : "brightness(0.75) saturate(0.9)",
            transition: "transform 0.8s cubic-bezier(.16,1,.3,1), filter 0.5s ease",
          }}
        />
        {/* Diagonal accent slice */}
        <div style={{
          position: "absolute", inset: 0,
          background: even
            ? `linear-gradient(to right, transparent 60%, var(--color-bg) 100%)`
            : `linear-gradient(to left, transparent 60%, var(--color-bg) 100%)`,
          zIndex: 2,
        }} />
        {/* Accent color flood */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 3,
          background: `linear-gradient(135deg, ${acc}20 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.5s ease",
        }} />
        {/* Year watermark */}
        <div style={{
          position: "absolute",
          bottom: "1rem", [even ? "right" : "left"]: "1rem",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(4rem,10vw,10rem)",
          fontWeight: 900, color: "transparent",
          WebkitTextStroke: `1px rgba(255,255,255,${hovered ? "0.12" : "0.06"})`,
          lineHeight: 1, userSelect: "none", pointerEvents: "none", zIndex: 4,
          transition: "all 0.4s ease",
        }}>{project.year}</div>
      </div>

      {/* TEXT SIDE */}
      <div style={{
        order: even ? 2 : 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(2rem,4vw,4rem) clamp(2rem,5vw,5rem)",
        background: "var(--color-bg)",
        position: "relative",
        zIndex: 5,
      }}>
        {/* Index + type row */}
        <div style={{
          display: "flex", alignItems: "center", gap: "1rem",
          marginBottom: "clamp(1rem,2vw,1.75rem)",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.52rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: acc,
          }}>/{project.id}</span>
          <div style={{ flex: 1, height: 1, background: `${acc}30` }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.5rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--color-text-muted)",
            border: "1px solid var(--color-surface-border)",
            padding: "0.15rem 0.55rem",
          }}>{project.type}</span>
        </div>

        {/* Category */}
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: "0.52rem",
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: acc, margin: "0 0 0.5rem",
          opacity: 0.8,
        }}>{project.category}</p>

        {/* Title */}
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem,4.5vw,4.5rem)",
          fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.92,
          margin: "0 0 clamp(0.75rem,1.5vw,1.25rem)",
          color: hovered ? "var(--color-text-primary)" : "transparent",
          WebkitTextStroke: hovered ? "0px" : `1.5px var(--color-text-primary)`,
          transition: "color 0.4s ease, -webkit-text-stroke 0.4s ease",
        }}>
          {project.title}
        </h3>

        {/* Sub */}
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(0.9rem,1.5vw,1.2rem)",
          fontWeight: 600, letterSpacing: "-0.02em",
          color: "var(--color-text-secondary)",
          margin: "0 0 1rem",
          fontStyle: "italic",
        }}>{project.sub}</p>

        {/* Desc */}
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(0.78rem,1vw,0.88rem)",
          lineHeight: 1.75, color: "var(--color-text-muted)",
          maxWidth: "400px",
          margin: "0 0 clamp(1.25rem,2.5vw,2rem)",
          maxHeight: hovered ? "8rem" : "0",
          overflow: "hidden",
          opacity: hovered ? 1 : 0,
          transition: "max-height 0.45s ease, opacity 0.35s ease",
        }}>{project.desc}</p>

        {/* Tags */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "0.35rem",
          marginBottom: "clamp(1rem,2vw,1.75rem)",
        }}>
          {project.tags.map(t => (
            <span key={t} style={{
              fontFamily: "var(--font-mono)", fontSize: "0.46rem",
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: acc, border: `1px solid ${acc}40`,
              padding: "0.18rem 0.55rem",
            }}>{t}</span>
          ))}
        </div>

        {/* CTA row */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          {project.links.map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.35rem",
                fontFamily: "var(--font-mono)", fontSize: "0.52rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: acc, textDecoration: "none",
                border: `1px solid ${acc}50`, padding: "0.4rem 0.9rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${acc}15` }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "" }}
            >
              {link.icon === "android" ? <Smartphone size={9} /> : <ExternalLink size={9} />}
              {link.label}
            </a>
          ))}

          <div style={{
            display: "flex", alignItems: "center", gap: "0.6rem",
            color: hovered ? acc : "var(--color-text-muted)",
            transition: "color 0.3s ease, gap 0.3s ease",
            fontFamily: "var(--font-mono)", fontSize: "0.52rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.gap = "1rem" }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.gap = "0.6rem" }}
          >
            View project
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              border: `1.5px solid ${hovered ? acc : "var(--color-surface-border)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transform: hovered ? "rotate(-45deg)" : "rotate(0deg)",
              transition: "all 0.35s cubic-bezier(.16,1,.3,1)",
              color: hovered ? acc : "var(--color-text-muted)",
            }}>
              <ArrowUpRight size={13} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Accent bar — draws in from left/right */}
        <div style={{
          position: "absolute",
          [even ? "right" : "left"]: 0, top: 0, bottom: 0,
          width: hovered ? 3 : 0,
          background: acc,
          transition: "width 0.3s ease",
        }} />
      </div>
    </div>
  )
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export function PortfolioProjects() {
  const { theme } = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
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

  return (
    <section id="projects" ref={sectionRef} style={{ position: "relative", background: "var(--color-bg)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "flex-end",
        justifyContent: "space-between", gap: "2rem",
        padding: "clamp(5rem,9vw,8rem) clamp(1.5rem,5vw,4rem) clamp(2rem,4vw,3rem)",
        borderBottom: "1px solid var(--color-surface-border)",
      }}>
        <div>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem",
            opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(14px)",
            transition: "all 0.6s ease 0.1s",
          }}>
            <div style={{ width: 24, height: 1, background: acc }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: acc }}>Selected Work</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem,9vw,8rem)",
            fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.88, margin: 0,
            opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)",
            transition: "all 0.8s cubic-bezier(.16,1,.3,1) 0.15s",
          }}>
            <span style={{ display: "block", color: "var(--color-text-primary)" }}>Things</span>
            <span style={{ display: "block", color: "transparent", WebkitTextStroke: `2px ${acc}`, textShadow: `0 0 60px ${acc}30` }}>I&apos;ve Built</span>
          </h2>
        </div>
        <div style={{
          opacity: inView ? 1 : 0, transition: "opacity 0.8s ease 0.3s",
          fontFamily: "var(--font-mono)", fontSize: "clamp(3rem,7vw,6rem)",
          fontWeight: 900, letterSpacing: "-0.05em",
          color: "transparent", WebkitTextStroke: "1px var(--color-surface-border)",
          lineHeight: 1,
        }}>0{PROJECTS.length}</div>
      </div>

      {/* Rows */}
      <div>
        {PROJECTS.map((p, i) => (
          <ProjectRow key={p.id} project={p} idx={i} inView={inView} />
        ))}
      </div>

      <div style={{ height: "clamp(3rem,5vw,5rem)" }} />
    </section>
  )
}