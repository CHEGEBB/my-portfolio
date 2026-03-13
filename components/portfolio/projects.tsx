"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/context/theme-context"
import { ExternalLink, Smartphone } from "lucide-react"

// ─── DATA — imgH controls natural card height (Pinterest-style varying heights) ──
const PROJECTS = [
  {
    id: "00", title: "ModelsNest", sub: "Enterprise AI APIs",
    category: "AI Infrastructure · SaaS", type: "STARTUP", year: "2026",
    image: "/projects/modelsnest.png", imgH: 420,
    tags: ["AI", "APIs", "Next.js", "Enterprise"],
    accent: "#00D4FF",
    links: [{ label: "Live Site", href: "https://modelsnest.vercel.app/", icon: "web" }],
  },
  {
    id: "01", title: "IntelliMark", sub: "AI Assessment Platform",
    category: "EdTech · AI", type: "CLIENT", year: "2025",
    image: "/projects/intellimark.png", imgH: 330,
    tags: ["AI", "EdTech", "React"],
    accent: "#5567F7", links: [],
  },
  {
    id: "02", title: "TabooTalks", sub: "Connections Platform",
    category: "Social · Web App", type: "CLIENT", year: "2025",
    image: "/projects/tabootalks.png", imgH: 520,
    tags: ["React", "Node.js", "Real-time"],
    accent: "#FF6B9D", links: [],
  },
  {
    id: "03", title: "H-mex Health", sub: "AI NCDs Risk Tool",
    category: "HealthTech · AI", type: "CLIENT", year: "2026",
    image: "/projects/hmex.png", imgH: 460,
    tags: ["AI/ML", "HealthTech", "React"],
    accent: "#22C55E", links: [],
  },
  {
    id: "04", title: "WerEntOnline", sub: "Real Estate Platform",
    category: "PropTech · Web App", type: "CLIENT", year: "2025",
    image: "/projects/werentonline.png", imgH: 360,
    tags: ["Next.js", "Maps API", "Full-stack"],
    accent: "#F5A623", links: [],
  },
  {
    id: "05", title: "FarmSense", sub: "Smart Farming",
    category: "AgriTech · Web App", type: "CLIENT", year: "2024",
    image: "/projects/farmsense.png", imgH: 400,
    tags: ["React", "Analytics", "AgriTech"],
    accent: "#AAFF00", links: [],
  },
  {
    id: "06", title: "DjAfro StreamBox", sub: "Movies Streaming App",
    category: "Mobile · Streaming", type: "CLIENT", year: "2025",
    image: "/projects/djafro.png", imgH: 480,
    tags: ["Flutter", "Dart", "Appwrite", "Intasend"],
    accent: "#8B5CF6",
    links: [
      { label: "Play Store", href: "https://play.google.com/store/apps/details?id=com.djafrostreambox", icon: "android" },
      { label: "Web App", href: "https://djafrostreambox.vercel.app/", icon: "web" },
    ],
  },
  {
    id: "07", title: "Softrinx", sub: "SaaS Enterprise",
    category: "SaaS · Enterprise", type: "STARTUP", year: "2026",
    image: "/projects/softrinx.png", imgH: 350,
    tags: ["SaaS", "Enterprise", "Full-stack"],
    accent: "#45D2B0", links: [],
  },
  {
    id: "08", title: "Teach2Give", sub: "EdTech Platform",
    category: "EdTech · Web", type: "CLIENT", year: "2025",
    image: "/projects/teach2give.png", imgH: 410,
    tags: ["EdTech", "Web", "React"],
    accent: "#FF4D1C", links: [],
  },
]

const FALLBACKS = [
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=85",
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=85",
  "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=85",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=85",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=85",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=85",
  "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=85",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=85",
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=85",
]

// ─── CARD ─────────────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  idx,
}: {
  project: (typeof PROJECTS)[0]
  idx: number
}) {
  const [hovered, setHovered] = useState(false)
  const [imgSrc, setImgSrc] = useState(project.image)
  const [visible, setVisible] = useState(false)
  const [wash, setWash] = useState("")
  const [px, setPx] = useState(0)
  const [py, setPy] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const acc = project.accent

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    setPx((x - 0.5) * 12)
    setPy((y - 0.5) * 8)
    setWash(`radial-gradient(circle at ${x * 100}% ${y * 100}%, ${acc}22 0%, transparent 65%)`)
  }

  const onMouseLeave = () => {
    setHovered(false)
    setPx(0)
    setPy(0)
    setWash("")
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "crosshair",
        background: "var(--color-surface)",
        // Staggered entrance
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.75s cubic-bezier(.16,1,.3,1) ${idx * 0.07}s,
                     transform 0.75s cubic-bezier(.16,1,.3,1) ${idx * 0.07}s`,
        // break-inside prevents card splitting across columns
        breakInside: "avoid",
      }}
    >
      {/* IMAGE — full width, height drives the card's natural size */}
      <div style={{ overflow: "hidden", position: "relative" }}>
        <img
          src={imgSrc}
          alt={project.title}
          onError={() => setImgSrc(FALLBACKS[idx % FALLBACKS.length])}
          style={{
            display: "block",
            width: "100%",
            height: project.imgH,
            objectFit: "cover",
            transform: hovered
              ? `scale(1.12) translate(${px}px, ${py}px)`
              : "scale(1.06)",
            filter: hovered
              ? "brightness(0.5) saturate(0.65)"
              : "brightness(0.82) saturate(0.9)",
            transition: hovered
              ? "transform 0.18s ease, filter 0.5s ease"
              : "transform 1.1s cubic-bezier(.16,1,.3,1), filter 0.6s ease",
            willChange: "transform",
          }}
        />

        {/* Cursor-following color wash */}
        {wash && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: wash,
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        )}

        {/* Year ghost */}
        <div
          style={{
            position: "absolute",
            bottom: "-0.1em",
            right: "-0.05em",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem,7vw,7rem)",
            fontWeight: 900,
            color: "transparent",
            WebkitTextStroke: `1px rgba(255,255,255,${hovered ? 0.1 : 0.04})`,
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 3,
            transition: "-webkit-text-stroke 0.4s",
          }}
        >
          {project.year}
        </div>

        {/* Center arrow — pops in on hover */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: `1.5px solid ${acc}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: acc,
            transform: hovered
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, -50%) scale(0)",
            opacity: hovered ? 1 : 0,
            transition: "transform 0.4s cubic-bezier(.16,1,.3,1), opacity 0.3s ease",
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <ExternalLink size={18} strokeWidth={1.5} />
        </div>
      </div>

      {/* BODY — below image, always visible */}
      <div
        style={{
          padding: "0.9rem 1rem 1.1rem",
          background: "var(--color-bg)",
          position: "relative",
        }}
      >
        {/* Accent line draws across top on hover */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 2,
            width: hovered ? "100%" : "1.5rem",
            background: acc,
            transition: "width 0.55s cubic-bezier(.16,1,.3,1)",
          }}
        />

        {/* Index + type */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.45rem",
              letterSpacing: "0.15em",
              color: "var(--color-text-muted)",
              opacity: 0.4,
            }}
          >
            {project.id}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.4rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: acc,
              border: `1px solid ${acc}40`,
              padding: "2px 6px",
            }}
          >
            {project.type}
          </span>
        </div>

        {/* Title — outlined at rest, solid accent on hover, tracking opens */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: hovered ? "0.05em" : "0.01em",
            margin: "0 0 0.25rem",
            color: hovered ? acc : "transparent",
            WebkitTextStroke: hovered ? "0px" : `0.8px ${acc}`,
            transition:
              "color 0.3s ease, -webkit-text-stroke 0.3s ease, letter-spacing 0.5s cubic-bezier(.16,1,.3,1)",
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.7rem",
            letterSpacing: "0.04em",
            fontStyle: "italic",
            fontWeight: 300,
            color: hovered ? "var(--color-text-secondary)" : "var(--color-text-muted)",
            margin: 0,
            transition: "color 0.3s ease",
          }}
        >
          {project.sub}
        </p>

        {/* Tags + links — slide up on hover */}
        <div
          style={{
            overflow: "hidden",
            maxHeight: hovered ? "80px" : 0,
            opacity: hovered ? 1 : 0,
            marginTop: hovered ? "0.65rem" : 0,
            transition:
              "max-height 0.5s cubic-bezier(.16,1,.3,1), opacity 0.35s ease, margin-top 0.35s ease",
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
          }}
        >
          {project.tags.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.38rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: acc,
                border: `1px solid ${acc}40`,
                padding: "2px 6px",
              }}
            >
              {t}
            </span>
          ))}

          {project.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                fontFamily: "var(--font-mono)",
                fontSize: "0.38rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#000",
                background: acc,
                padding: "3px 8px",
                textDecoration: "none",
              }}
            >
              {l.icon === "android" ? <Smartphone size={8} /> : <ExternalLink size={8} />}
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function PortfolioProjects() {
  const { theme } = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const acc = theme.colors.accent

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.04 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Pinterest masonry: distribute cards across 3 columns manually
  // so shortest column always gets the next card (pure CSS columns trick)
  // We just let CSS `columns` do the work — it's exactly how Pinterest does it.

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{ position: "relative", background: "var(--color-bg)", overflow: "hidden" }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,4vw,3rem) clamp(1.5rem,3vw,2rem)",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "flex-end",
          gap: "2rem",
          borderBottom: "1px solid var(--color-surface-border)",
          overflow: "hidden",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.5rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
              marginBottom: "0.75rem",
              opacity: inView ? 0.5 : 0,
              transition: "opacity 0.6s ease 0.1s",
            }}
          >
            — Selected Work · Brian Ouko
          </div>

          <h2 style={{ margin: 0, lineHeight: 0.88 }}>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.5rem,10vw,9rem)",
                fontWeight: 800,
                letterSpacing: "0.01em",
                color: "var(--color-text-primary)",
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(60px)",
                transition: "all 0.8s cubic-bezier(.16,1,.3,1) 0.15s",
              }}
            >
              Things
            </span>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.5rem,10vw,9rem)",
                fontWeight: 800,
                letterSpacing: "0.01em",
                color: "transparent",
                WebkitTextStroke: `1.5px var(--color-text-primary)`,
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(60px)",
                transition: "all 0.8s cubic-bezier(.16,1,.3,1) 0.28s",
              }}
            >
              I&apos;ve Built
            </span>
          </h2>
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem,7vw,7rem)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "1px var(--color-surface-border)",
              lineHeight: 1,
              opacity: inView ? 1 : 0,
              transition: "opacity 0.8s ease 0.45s",
            }}
          >
            0{PROJECTS.length}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.45rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
              marginTop: "0.4rem",
              opacity: inView ? 0.4 : 0,
              transition: "opacity 0.6s ease 0.55s",
            }}
          >
            Projects · 2024–2026
          </div>
        </div>
      </div>

      {/* ── PINTEREST MASONRY ──
           CSS `columns` is the correct primitive here:
           each card goes into the shortest column automatically,
           exactly like Pinterest. No JS column-balancing needed.
           gap between columns + between rows both controlled by column-gap + margin-bottom.
      ── */}
      <div
        style={{
          padding: "10px",
          // 3 cols desktop, 2 tablet, 1 mobile
          columns: "3",
          columnGap: "10px",
        }}
      >
        {PROJECTS.map((p, i) => (
          <div
            key={p.id}
            style={{
              breakInside: "avoid",
              marginBottom: "10px",
              display: "block",
            }}
          >
            <ProjectCard project={p} idx={i} />
          </div>
        ))}
      </div>

      {/* ── RESPONSIVE ── */}
      <style>{`
        #projects .pp-grid { columns: 3; }
        @media (max-width: 900px) {
          #projects [style*="columns: 3"] { columns: 2 !important; }
        }
        @media (max-width: 500px) {
          #projects [style*="columns"] { columns: 1 !important; }
          #projects [style*="grid-template-columns: 1fr auto"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={{ height: "clamp(2rem,4vw,4rem)" }} />
    </section>
  )
}