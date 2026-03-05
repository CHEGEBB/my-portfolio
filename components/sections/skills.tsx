"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { useTheme } from "@/context/theme-context"

// ─── DATA ────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "FE", name: "Frontend", color: "#5567F7", num: "01",
    skills: [
      { sym: "Nx",  name: "Next.js",   logo: "/logos/nextjs.svg",      n: 1  },
      { sym: "Re",  name: "React",     logo: "/logos/react.svg",       n: 2  },
      { sym: "Vu",  name: "Vue.js",    logo: "/logos/vue.svg",         n: 3  },
      { sym: "Ng",  name: "Angular",   logo: "/logos/angular.svg",     n: 4  },
      { sym: "Tw",  name: "Tailwind",  logo: "/logos/tailwindcss.svg", n: 5  },
    ],
  },
  {
    id: "BE", name: "Backend", color: "#45D2B0", num: "02",
    skills: [
      { sym: "No",  name: "Node.js",   logo: "/logos/nodejs.svg",      n: 6  },
      { sym: "Ex",  name: "Express",   logo: "/logos/express.svg",     n: 7  },
      { sym: "Py",  name: "Python",    logo: "/logos/python.svg",      n: 8  },
    ],
  },
  {
    id: "MB", name: "Mobile", color: "#FF6B9D", num: "03",
    skills: [
      { sym: "Fl",  name: "Flutter",      logo: "/logos/flutter.svg",     n: 9  },
      { sym: "Rn",  name: "React Native", logo: "/logos/reactnative.svg", n: 10 },
      { sym: "Da",  name: "Dart",         logo: "/logos/dart.svg",        n: 11 },
    ],
  },
  {
    id: "DB", name: "Database", color: "#F5A623", num: "04",
    skills: [
      { sym: "Pg",  name: "PostgreSQL", logo: "/logos/postgresql.svg",  n: 12 },
      { sym: "Mg",  name: "MongoDB",    logo: "/logos/mongodb.svg",     n: 13 },
    ],
  },
  {
    id: "CL", name: "Cloud", color: "#00D4FF", num: "05",
    skills: [
      { sym: "Aw",  name: "AWS",    logo: "/logos/aws.svg",    n: 14 },
      { sym: "Dk",  name: "Docker", logo: "/logos/docker.svg", n: 15 },
    ],
  },
  {
    id: "LG", name: "Language", color: "#AAFF00", num: "06",
    skills: [
      { sym: "Ts",  name: "TypeScript", logo: "/logos/typescript.svg", n: 16 },
      { sym: "Py",  name: "Python",     logo: "/logos/python.svg",     n: 17 },
      { sym: "Da",  name: "Dart",       logo: "/logos/dart.svg",       n: 18 },
    ],
  },
  {
    id: "TL", name: "Tools", color: "#8B5CF6", num: "07",
    skills: [
      { sym: "Gt",  name: "Git",    logo: "/logos/git.svg",    n: 19 },
      { sym: "Gh",  name: "GitHub", logo: "/logos/github.svg", n: 20 },
      { sym: "Lx",  name: "Linux",  logo: "/logos/linux.svg",  n: 21 },
      { sym: "Fg",  name: "Figma",  logo: "/logos/figma.svg",  n: 22 },
    ],
  },
]

// ─── ELEMENT CARD ─────────────────────────────────────────────────────────────
function ElementCard({
  skill, color, active, idx, revealed,
}: {
  skill: (typeof CATEGORIES[0]["skills"])[0]
  color: string
  active: boolean
  idx: number
  revealed: boolean
}) {
  const { theme } = useTheme()
  const [hovered, setHovered] = useState(false)
  const isDark = theme.mode === "dark"

  const glowing = active || hovered

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: "clamp(68px, 8vw, 96px)",
        height: "clamp(68px, 8vw, 96px)",
        border: `1px solid ${glowing ? color : "var(--color-surface-border)"}`,
        background: glowing
          ? isDark ? `${color}18` : `${color}12`
          : isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "0.25rem",
        cursor: "default",
        // Staggered reveal
        opacity: revealed ? (active ? 1 : 0.35) : 0,
        transform: revealed
          ? `scale(${glowing ? 1.08 : 1})`
          : "scale(0.5)",
        transition: `
          opacity 0.5s ease ${idx * 0.04}s,
          transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${idx * 0.04}s,
          border-color 0.25s ease,
          background 0.25s ease
        `,
        boxShadow: glowing
          ? isDark
            ? `0 0 24px ${color}44, inset 0 0 12px ${color}11`
            : `0 0 16px ${color}33, inset 0 0 8px ${color}0a`
          : "none",
        willChange: "transform, opacity",
      }}
    >
      {/* Atomic number */}
      <span style={{
        position: "absolute", top: "0.3rem", left: "0.4rem",
        fontFamily: "var(--font-mono)",
        fontSize: "0.42rem", color: glowing ? color : "var(--color-text-muted)",
        letterSpacing: "0.04em",
        transition: "color 0.2s ease",
        lineHeight: 1,
      }}>{skill.n}</span>

      {/* Logo */}
      <div style={{
        position: "relative",
        width: "clamp(22px,3vw,32px)", height: "clamp(22px,3vw,32px)",
        filter: glowing
          ? `drop-shadow(0 0 8px ${color}99)`
          : isDark ? "brightness(0.5) saturate(0)" : "brightness(0.4) saturate(0)",
        transition: "filter 0.3s ease",
        flexShrink: 0,
      }}>
        <Image src={skill.logo} alt={skill.name} fill style={{ objectFit: "contain" }} sizes="32px" />
      </div>

      {/* Symbol */}
      <span style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(0.85rem,1.4vw,1.2rem)",
        fontWeight: 800, letterSpacing: "-0.04em",
        color: glowing ? color : "var(--color-text-muted)",
        lineHeight: 1,
        transition: "color 0.2s ease",
      }}>{skill.sym}</span>

      {/* Full name */}
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.38rem", letterSpacing: "0.04em",
        color: glowing ? color : "var(--color-text-muted)",
        opacity: glowing ? 0.9 : 0.5,
        whiteSpace: "nowrap",
        transition: "all 0.2s ease",
        lineHeight: 1,
      }}>{skill.name}</span>

      {/* Active glow corner accent */}
      {glowing && (
        <div style={{
          position: "absolute", bottom: 0, right: 0,
          width: 6, height: 6,
          background: color,
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
        }} />
      )}
    </div>
  )
}

// ─── CATEGORY ROW ─────────────────────────────────────────────────────────────
function CategoryRow({
  cat, isActive, onActivate, revealed, rowIdx,
}: {
  cat: typeof CATEGORIES[0]
  isActive: boolean
  onActivate: () => void
  revealed: boolean
  rowIdx: number
}) {
  const { theme } = useTheme()
  const isDark = theme.mode === "dark"

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(0.5rem, 1vw, 1rem)",
        padding: "clamp(0.75rem,1.5vw,1.25rem) 0",
        borderBottom: "1px solid var(--color-surface-border)",
        cursor: "pointer",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : "translateX(-32px)",
        transition: `opacity 0.6s ease ${rowIdx * 0.08 + 0.1}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${rowIdx * 0.08 + 0.1}s`,
      }}
      onMouseEnter={onActivate}
      onClick={onActivate}
    >
      {/* Category ID badge */}
      <div style={{
        width: "clamp(36px,4vw,48px)", height: "clamp(36px,4vw,48px)",
        border: `1px solid ${isActive ? cat.color : "var(--color-surface-border)"}`,
        background: isActive ? `${cat.color}18` : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.25s ease",
      }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(0.55rem,0.8vw,0.7rem)",
          fontWeight: 700, letterSpacing: "0.06em",
          color: isActive ? cat.color : "var(--color-text-muted)",
          transition: "color 0.2s ease",
        }}>{cat.id}</span>
      </div>

      {/* Name */}
      <span style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(1.4rem,3vw,2.5rem)",
        fontWeight: 800, letterSpacing: "-0.04em",
        color: isActive ? cat.color : "var(--color-text-primary)",
        transform: isActive ? "translateX(8px)" : "none",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        flex: 1,
      }}>{cat.name}</span>

      {/* Skill count */}
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: "clamp(0.5rem,0.7vw,0.6rem)",
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: isActive ? cat.color : "var(--color-text-muted)",
        transition: "color 0.2s ease",
      }}>{cat.skills.length} tools</span>

      {/* Active bar */}
      <div style={{
        width: isActive ? "clamp(24px,3vw,36px)" : "8px",
        height: "2px",
        background: isActive ? cat.color : "var(--color-surface-border)",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        flexShrink: 0,
      }} />
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function Skills() {
  const { theme }               = useTheme()
  const sectionRef              = useRef<HTMLDivElement>(null)
  const [inView, setInView]     = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [active,   setActive]   = useState(0)
  const [mouse, setMouse]       = useState({ x: 0.5, y: 0.5 })
  const isDark = theme.mode === "dark"
  const cat    = CATEGORIES[active]

  // IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setRevealed(true), 120)
    return () => clearTimeout(t)
  }, [inView])

  // Mouse tracking
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

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100svh",
        background: "var(--color-bg)",
        overflow: "hidden",
      }}
    >
      {/* ── Ambient glow — shifts colour with active category ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 65% 60% at ${(mouse.x * 100).toFixed(1)}% ${(mouse.y * 100).toFixed(1)}%, ${cat.color}${isDark ? "1a" : "0e"} 0%, transparent 65%)`,
        transition: "background 0.15s ease",
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 80% 70% at 75% 50%, ${cat.color}${isDark ? "12" : "08"} 0%, transparent 60%)`,
        transition: "background 0.5s ease",
      }} />

      {/* ── PAINT WIPE — clip-path based, works on all screen sizes ── */}
      <div
        aria-hidden
        className="paint-wipe-primary"
        style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: isDark
            ? `color-mix(in srgb, ${cat.color} 15%, #0D0D1E)`
            : `color-mix(in srgb, ${cat.color} 10%, #EFEFFA)`,
          clipPath: inView
            ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"   // wiped off to right
            : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",       // covers everything
          transition: inView ? "clip-path 0.9s cubic-bezier(0.86,0,0.07,1) 0s" : "none",
          willChange: "clip-path",
        }}
      />
      <div
        aria-hidden
        className="paint-wipe-secondary"
        style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: isDark ? "#07070F" : "#F6F6FC",
          clipPath: inView
            ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
            : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          transition: inView ? "clip-path 1.1s cubic-bezier(0.86,0,0.07,1) 0.06s" : "none",
          willChange: "clip-path",
        }}
      />

      {/* ── MAIN LAYOUT ── */}
      <div
        className="skills-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "100svh",
        }}
      >

        {/* ════════════════════════════════
            LEFT — category list
        ════════════════════════════════ */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) clamp(3rem,6vw,5rem)",
          borderRight: "1px solid var(--color-surface-border)",
          position: "relative",
        }}>
          {/* Section label */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.6rem",
            marginBottom: "clamp(2rem,4vw,3.5rem)",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "none" : "translateY(14px)",
            transition: "all 0.6s ease 0.05s",
          }}>
            <div style={{ width: 20, height: "1px", background: "var(--color-accent)" }} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.6rem",
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "var(--color-accent)",
            }}>Tech Stack</span>
          </div>

          {/* Headline */}
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem,7vw,6rem)",
            fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.9,
            margin: "0 0 clamp(2rem,4vw,3.5rem)",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "none" : "translateY(20px)",
            transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.08s",
          }}>
            <span style={{ display: "block", color: "var(--color-text-primary)" }}>Tools I</span>
            <span style={{
              display: "block",
              color: "transparent",
              WebkitTextStroke: `2px ${cat.color}`,
              transition: "all 0.3s ease",
              textShadow: `0 0 50px ${cat.color}33`,
            }}>Master</span>
          </h2>

          {/* Category list */}
          <div>
            {CATEGORIES.map((c, i) => (
              <CategoryRow
                key={c.id}
                cat={c}
                isActive={active === i}
                onActivate={() => setActive(i)}
                revealed={revealed}
                rowIdx={i}
              />
            ))}
          </div>
        </div>

        {/* ════════════════════════════════
            RIGHT — periodic table grid
        ════════════════════════════════ */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3rem)",
          position: "relative",
          gap: "clamp(2rem,4vw,3rem)",
        }}>

          {/* Giant watermark category name */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none", overflow: "hidden",
          }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(5rem,20vw,18rem)",
              fontWeight: 800, letterSpacing: "-0.06em",
              color: "transparent",
              WebkitTextStroke: isDark ? `1px ${cat.color}15` : `1px ${cat.color}20`,
              userSelect: "none", lineHeight: 1, whiteSpace: "nowrap",
              transition: "all 0.4s ease",
            }}>{cat.name}</span>
          </div>

          {/* Header */}
          <div style={{
            position: "relative", zIndex: 2,
            textAlign: "center",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "none" : "translateY(16px)",
            transition: "all 0.6s ease 0.4s",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.75rem",
              border: `1px solid ${cat.color}44`,
              background: `${cat.color}0d`,
              padding: "0.4rem 1rem",
              marginBottom: "0.75rem",
            }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: cat.color,
              }}>{cat.num} / {cat.id}</span>
              <div style={{ width: 1, height: 10, background: `${cat.color}44` }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                letterSpacing: "0.1em", color: cat.color, opacity: 0.7,
              }}>{cat.skills.length} elements</span>
            </div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.4rem,3vw,2.25rem)",
              fontWeight: 800, letterSpacing: "-0.04em",
              color: cat.color,
              textShadow: isDark ? `0 0 30px ${cat.color}55` : "none",
              transition: "color 0.3s ease",
            }}>{cat.name}</div>
          </div>

          {/* ── THE PERIODIC TABLE GRID ── */}
          <div style={{
            position: "relative", zIndex: 2,
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(4px,0.8vw,8px)",
            justifyContent: "center",
            maxWidth: "clamp(300px,45vw,520px)",
          }}>
            {/* All skill cards from ALL categories, dimmed unless active */}
            {CATEGORIES.map((c) =>
              c.skills.map((skill, i) => (
                <ElementCard
                  key={`${c.id}-${skill.name}`}
                  skill={skill}
                  color={c.color}
                  active={c.id === cat.id}
                  idx={i}
                  revealed={revealed}
                />
              ))
            )}
          </div>

          {/* Hint */}
          <p style={{
            position: "relative", zIndex: 2,
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase",
            color: "var(--color-text-muted)", opacity: 0.45,
            opacity: revealed ? 0.45 : 0,
            transition: "opacity 0.6s ease 0.8s",
          }}>← Hover a category to illuminate</p>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .skills-layout {
            grid-template-columns: 1fr !important;
          }
          .skills-layout > div:first-child {
            border-right: none !important;
            border-bottom: 1px solid var(--color-surface-border);
            min-height: auto !important;
          }
          .skills-layout > div:last-child {
            min-height: 60svh;
          }
        }
      `}</style>
    </section>
  )
}