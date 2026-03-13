"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/context/theme-context"
import { ArrowUpRight, ExternalLink, Smartphone } from "lucide-react"

// ─── DATA ─────────────────────────────────────────────────────────────────────
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
    tags: ["Flutter", "Dart", "Appwrite", "Intasend"],
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

// ─── CHAR SPLIT TITLE — letters slam in one by one ────────────────────────────
function SplitTitle({
  text,
  baseDelay = 0,
  outlined = false,
  accent,
  fontSize = "clamp(2rem,4.5vw,4.5rem)",
  inView,
}: {
  text: string
  baseDelay?: number
  outlined?: boolean
  accent?: string
  fontSize?: string
  inView: boolean
}) {
  return (
    <span
      aria-label={text}
      style={{
        display: "inline-flex",
        overflow: "hidden",
        lineHeight: 0.92,
        letterSpacing: "-0.04em",
      }}
    >
      {text.split("").map((ch, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            fontFamily: "var(--font-display)",
            fontSize,
            fontWeight: 800,
            lineHeight: 0.92,
            color: outlined ? "transparent" : accent ?? "var(--color-text-primary)",
            WebkitTextStroke: outlined
              ? `1.5px ${accent ?? "var(--color-text-primary)"}`
              : "0px",
            transform: inView ? "translateY(0) rotate(0) skewX(0)" : "translateY(110%) rotate(6deg) skewX(-4deg)",
            opacity: inView ? 1 : 0,
            transition: inView
              ? `transform 0.65s cubic-bezier(0.22,1,0.36,1) ${baseDelay + i * 0.04}s,
                 opacity 0.4s ease ${baseDelay + i * 0.04}s`
              : "none",
            whiteSpace: ch === " " ? "pre" : "normal",
          }}
        >
          {ch === " " ? "\u00a0" : ch}
        </span>
      ))}
    </span>
  )
}

// ─── PROJECT ROW ──────────────────────────────────────────────────────────────
function ProjectRow({
  project,
  idx,
  inView,
}: {
  project: (typeof PROJECTS)[0]
  idx: number
  inView: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [imgSrc, setImgSrc] = useState(project.image)
  const [rowInView, setRowInView] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const acc = project.accent
  const even = idx % 2 === 0
  const rowDelay = idx * 0.07

  // Each row has its own IntersectionObserver so chars animate as they scroll into view
  useEffect(() => {
    const el = rowRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRowInView(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = rowRef.current?.getBoundingClientRect()
    if (!r) return
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    setMouse({ x, y })

    // 3D tilt on image panel
    const ir = imgRef.current?.getBoundingClientRect()
    if (ir) {
      const cx = (e.clientX - ir.left) / ir.width - 0.5
      const cy = (e.clientY - ir.top) / ir.height - 0.5
      setTilt({ x: cy * -6, y: cx * 8 })
    }
  }

  const onMouseLeave = () => {
    setHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      ref={rowRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: even ? "1fr 1.1fr" : "1.1fr 1fr",
        minHeight: "clamp(320px, 38vw, 560px)",
        borderBottom: "1px solid var(--color-surface-border)",
        cursor: "none",
        overflow: "hidden",
        // Row slides up when scrolled into view
        opacity: rowInView ? 1 : 0,
        transform: rowInView ? "none" : "translateY(50px)",
        transition: `opacity 0.8s ease ${rowDelay}s, transform 0.8s cubic-bezier(.16,1,.3,1) ${rowDelay}s`,
      }}
    >
      {/* ── MAGNETIC CURSOR BLOB ── */}
      <div
        style={{
          position: "absolute",
          left: mouse.x - 50,
          top: mouse.y - 50,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: acc,
          opacity: hovered ? 0.15 : 0,
          filter: "blur(28px)",
          pointerEvents: "none",
          zIndex: 20,
          transition: "opacity 0.3s ease",
          willChange: "left, top",
        }}
      />

      {/* ── ACCENT SWEEP — full-row color wash on hover ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${even ? "90deg" : "270deg"}, ${acc}06 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.6s ease",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── IMAGE PANEL ── */}
      <div
        ref={imgRef}
        style={{
          order: even ? 1 : 2,
          position: "relative",
          overflow: "hidden",
          perspective: "800px",
        }}
      >
        {/* 3D tilt wrapper */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: hovered
              ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
              : "perspective(800px) rotateX(0) rotateY(0) scale(1)",
            transition: hovered
              ? "transform 0.15s ease"
              : "transform 0.8s cubic-bezier(.16,1,.3,1)",
            willChange: "transform",
          }}
        >
          <img
            src={imgSrc}
            alt={project.title}
            onError={() => setImgSrc(FALLBACKS[idx % FALLBACKS.length])}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              // Image breathes: zooms in on hover, zooms OUT (pulls back) for drama
              transform: hovered ? "scale(1.12)" : "scale(1.0)",
              filter: hovered
                ? "brightness(0.35) saturate(0.6)"
                : "brightness(0.7) saturate(0.85)",
              transition: "transform 1s cubic-bezier(.16,1,.3,1), filter 0.6s ease",
            }}
          />
        </div>

        {/* Gradient edge bleed into text side */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: even
              ? "linear-gradient(to right, transparent 55%, var(--color-bg) 100%)"
              : "linear-gradient(to left, transparent 55%, var(--color-bg) 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Accent color flood on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            background: `linear-gradient(135deg, ${acc}25 0%, transparent 65%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
          }}
        />

        {/* YEAR watermark — slides and fades */}
        <div
          style={{
            position: "absolute",
            bottom: "0.5rem",
            [even ? "right" : "left"]: "-0.1em",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(5rem,12vw,12rem)",
            fontWeight: 900,
            color: "transparent",
            WebkitTextStroke: `1px rgba(255,255,255,${hovered ? 0.14 : 0.04})`,
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 4,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
          }}
        >
          {project.year}
        </div>

        {/* INDEX number — top corner of image */}
        <div
          style={{
            position: "absolute",
            top: "1.25rem",
            [even ? "left" : "right"]: "1.25rem",
            zIndex: 5,
            fontFamily: "var(--font-mono)",
            fontSize: "0.5rem",
            letterSpacing: "0.15em",
            color: acc,
            opacity: hovered ? 1 : 0.4,
            transition: "opacity 0.3s ease",
          }}
        >
          /{project.id}
        </div>

        {/* REVEAL overlay — project name appears on image on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem,3.5vw,3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "transparent",
              WebkitTextStroke: `1px ${acc}`,
              opacity: hovered ? 0.25 : 0,
              transform: hovered ? "scale(1)" : "scale(0.85)",
              transition: "opacity 0.5s ease, transform 0.6s cubic-bezier(.16,1,.3,1)",
              textAlign: "center",
              padding: "0 1rem",
            }}
          >
            {project.title}
          </div>
        </div>
      </div>

      {/* ── TEXT PANEL ── */}
      <div
        style={{
          order: even ? 2 : 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(2rem,4vw,4rem) clamp(2rem,5vw,5rem)",
          background: "var(--color-bg)",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Index + type badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "clamp(1rem,2vw,1.75rem)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.52rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: acc,
              transform: rowInView ? "none" : "translateX(-10px)",
              opacity: rowInView ? 1 : 0,
              transition: `all 0.5s ease ${rowDelay + 0.1}s`,
            }}
          >
            /{project.id}
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: `${acc}30`,
              transform: rowInView ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
              transition: `transform 0.8s cubic-bezier(.16,1,.3,1) ${rowDelay + 0.15}s`,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.5rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
              border: "1px solid var(--color-surface-border)",
              padding: "0.15rem 0.55rem",
              transform: rowInView ? "none" : "translateX(10px)",
              opacity: rowInView ? 1 : 0,
              transition: `all 0.5s ease ${rowDelay + 0.2}s`,
            }}
          >
            {project.type}
          </span>
        </div>

        {/* Category */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.52rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: acc,
            margin: "0 0 0.5rem",
            opacity: rowInView ? 0.8 : 0,
            transform: rowInView ? "none" : "translateY(8px)",
            transition: `all 0.5s ease ${rowDelay + 0.15}s`,
          }}
        >
          {project.category}
        </p>

        {/* TITLE — char-by-char slam animation */}
        <h3 style={{ margin: "0 0 clamp(0.75rem,1.5vw,1.25rem)", lineHeight: 0.92 }}>
          <SplitTitle
            text={project.title}
            baseDelay={rowDelay + 0.2}
            outlined={!hovered}
            accent={acc}
            fontSize="clamp(2rem,4.5vw,4.5rem)"
            inView={rowInView}
          />
        </h3>

        {/* Sub */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(0.9rem,1.5vw,1.2rem)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--color-text-secondary)",
            margin: "0 0 1rem",
            fontStyle: "italic",
            opacity: rowInView ? 1 : 0,
            transform: rowInView ? "none" : "translateY(10px)",
            transition: `all 0.6s ease ${rowDelay + 0.35}s`,
          }}
        >
          {project.sub}
        </p>

        {/* Description — reveals on hover */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.78rem,1vw,0.88rem)",
            lineHeight: 1.75,
            color: "var(--color-text-muted)",
            maxWidth: "400px",
            margin: "0 0 clamp(1.25rem,2.5vw,2rem)",
            maxHeight: hovered ? "8rem" : "0",
            overflow: "hidden",
            opacity: hovered ? 1 : 0,
            transition: "max-height 0.5s cubic-bezier(.16,1,.3,1), opacity 0.4s ease",
          }}
        >
          {project.desc}
        </p>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.35rem",
            marginBottom: "clamp(1rem,2vw,1.75rem)",
            opacity: rowInView ? 1 : 0,
            transform: rowInView ? "none" : "translateY(8px)",
            transition: `all 0.6s ease ${rowDelay + 0.4}s`,
          }}
        >
          {project.tags.map((t, ti) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.46rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: acc,
                border: `1px solid ${acc}40`,
                padding: "0.18rem 0.55rem",
                // Tags stagger-pop in
                transform: rowInView ? "none" : "scale(0.85)",
                opacity: rowInView ? 1 : 0,
                transition: `all 0.4s cubic-bezier(.16,1,.3,1) ${rowDelay + 0.45 + ti * 0.04}s`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* CTA row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            opacity: rowInView ? 1 : 0,
            transform: rowInView ? "none" : "translateY(10px)",
            transition: `all 0.6s ease ${rowDelay + 0.5}s`,
          }}
        >
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.52rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: acc,
                textDecoration: "none",
                border: `1px solid ${acc}50`,
                padding: "0.4rem 0.9rem",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = `${acc}18`
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = ""
              }}
            >
              {link.icon === "android" ? (
                <Smartphone size={9} />
              ) : (
                <ExternalLink size={9} />
              )}
              {link.label}
            </a>
          ))}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              color: hovered ? acc : "var(--color-text-muted)",
              transition: "color 0.3s ease",
              fontFamily: "var(--font-mono)",
              fontSize: "0.52rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.gap = "1rem"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.gap = "0.6rem"
            }}
          >
            View project
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: `1.5px solid ${hovered ? acc : "var(--color-surface-border)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: hovered ? "rotate(-45deg)" : "rotate(0deg)",
                transition: "all 0.35s cubic-bezier(.16,1,.3,1)",
                color: hovered ? acc : "var(--color-text-muted)",
              }}
            >
              <ArrowUpRight size={13} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Accent side bar — draws in on hover */}
        <div
          style={{
            position: "absolute",
            [even ? "right" : "left"]: 0,
            top: 0,
            bottom: 0,
            width: hovered ? 3 : 0,
            background: acc,
            transition: "width 0.35s ease",
          }}
        />

        {/* Bottom progress line — draws in on scroll-into-view */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 1,
            width: rowInView ? "100%" : "0%",
            background: `linear-gradient(to right, ${acc}60, transparent)`,
            transition: `width 1.2s cubic-bezier(.16,1,.3,1) ${rowDelay + 0.3}s`,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  )
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHeader({ inView, acc }: { inView: boolean; acc: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "2rem",
        padding:
          "clamp(5rem,9vw,8rem) clamp(1.5rem,5vw,4rem) clamp(2rem,4vw,3rem)",
        borderBottom: "1px solid var(--color-surface-border)",
        overflow: "hidden",
      }}
    >
      <div>
        {/* Label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(14px)",
            transition: "all 0.6s ease 0.1s",
          }}
        >
          <div style={{ width: 24, height: 1, background: acc }} />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: acc,
            }}
          >
            Selected Work
          </span>
        </div>

        {/* "Things" — chars slam in */}
        <h2 style={{ margin: 0, lineHeight: 0.88 }}>
          <span style={{ display: "block", overflow: "hidden" }}>
            <SplitTitle
              text="Things"
              baseDelay={0.2}
              outlined={false}
              accent="var(--color-text-primary)"
              fontSize="clamp(3rem,9vw,8rem)"
              inView={inView}
            />
          </span>
          <span style={{ display: "block", overflow: "hidden" }}>
            <SplitTitle
              text="I've Built"
              baseDelay={0.4}
              outlined={true}
              accent={acc}
              fontSize="clamp(3rem,9vw,8rem)"
              inView={inView}
            />
          </span>
        </h2>
      </div>

      {/* Count watermark */}
      <div
        style={{
          opacity: inView ? 1 : 0,
          transition: "opacity 0.8s ease 0.6s",
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(3rem,7vw,6rem)",
          fontWeight: 900,
          letterSpacing: "-0.05em",
          color: "transparent",
          WebkitTextStroke: "1px var(--color-surface-border)",
          lineHeight: 1,
        }}
      >
        0{PROJECTS.length}
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
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.04 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        position: "relative",
        background: "var(--color-bg)",
        overflow: "hidden",
      }}
    >
      <SectionHeader inView={inView} acc={acc} />

      <div>
        {PROJECTS.map((p, i) => (
          <ProjectRow key={p.id} project={p} idx={i} inView={inView} />
        ))}
      </div>

      <div style={{ height: "clamp(3rem,5vw,5rem)" }} />
    </section>
  )
}