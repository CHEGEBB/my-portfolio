"use client"

import { useRef, useState } from "react"
import { useTheme } from "@/context/theme-context"
import { motion, useInView } from "framer-motion"

const PRINCIPLES = [
  {
    num: "01",
    title: "Ship working software,\nnot demos.",
    sub: "A perfect prototype no one uses is worthless.",
    body: "Every engagement I take ends with deployed, production-ready software — not Figma screens, not slide decks, not 'almost ready' staging environments. I optimise for delivered, not polished. Polish comes through iteration once real users are touching the product.",
    color: "#5567F7",
    stat: "100%",
    statLabel: "Deployments reach production",
    symbol: "↗",
    tag: "Delivery",
  },
  {
    num: "02",
    title: "Architecture decisions\nare irreversible.",
    sub: "The choices you make in week one you live with for years.",
    body: "Before writing any code I document the decisions that are hard to reverse: database choice, service boundaries, auth strategy, API contracts. These get reviewed, challenged, and agreed on. Everything else is reversible — we move fast on those.",
    color: "#45D2B0",
    stat: "0",
    statLabel: "Rewrites from poor architecture",
    symbol: "◈",
    tag: "Architecture",
  },
  {
    num: "03",
    title: "Code is written for\nthe next developer.",
    sub: "Including future me at 3am during an incident.",
    body: "I write code assuming the next person to read it knows nothing about what I was thinking. Clear naming, meaningful comments on the 'why' not the 'what', documented decisions, typed interfaces. Code that communicates is the only code worth shipping.",
    color: "#FF6B9D",
    stat: "<1hr",
    statLabel: "Avg onboarding for new contributors",
    symbol: "⬡",
    tag: "Code Quality",
  },
  {
    num: "04",
    title: "You can't improve what\nyou don't measure.",
    sub: "Monitoring before launch, always.",
    body: "Every system I ship has observability built in before users touch it — error tracking, performance baselines, usage analytics, uptime alerts. You should know your system is broken before your users do. Shipping blind is not shipping — it's gambling.",
    color: "#AAFF00",
    stat: "<5min",
    statLabel: "Mean time to detect production incidents",
    symbol: "⌬",
    tag: "Observability",
  },
]

export function ProcessPrinciples() {
  const { theme } = useTheme()
  const isDark = theme.mode === "dark"
  const acc = theme.colors.accent
  const headerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headerRef, { once: true, margin: "-10%" })

  return (
    <section style={{
      position: "relative",
      background: "var(--color-bg)",
      overflow: "hidden",
    }}>

      {/* ── Section header ── */}
      <div
        ref={headerRef}
        style={{
          padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem) clamp(3rem,5vw,4rem)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "clamp(2rem,4vw,3.5rem)",
        }}
      >
        {/* Left: heading */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: "0.6rem",
            marginBottom: "1.25rem",
          }}>
            <div style={{ width: 20, height: 1, background: acc }} />
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.56rem", letterSpacing: "0.18em",
              textTransform: "uppercase", color: acc,
            }}>Non-Negotiables</span>
          </div>

          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.8rem,8vw,7rem)",
            fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 0.88,
            margin: 0,
          }}>
            <span style={{ display: "block", color: "var(--color-text-primary)" }}>The</span>
            <span style={{
              display: "block",
              color: "transparent",
              WebkitTextStroke: `2px ${acc}`,
              textShadow: `0 0 60px ${acc}44`,
            }}>Principles.</span>
          </h2>
        </motion.div>

        {/* Right: description + index chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}
        >
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.85rem,1.2vw,1rem)",
            color: "var(--color-text-muted)", lineHeight: 1.72, margin: 0,
          }}>
            Four things I refuse to compromise on regardless of timeline, budget, or client pressure.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "0.75rem",
          }}>
            {PRINCIPLES.map((p) => (
              <div key={p.num} style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                padding: "0.5rem 0.85rem",
                border: `1px solid ${p.color}33`,
                borderLeft: `3px solid ${p.color}`,
                borderRadius: "2px",
                background: `${p.color}08`,
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.48rem",
                  letterSpacing: "0.12em", color: p.color, flexShrink: 0,
                }}>{p.num}</span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.44rem",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--color-text-muted)", opacity: 0.7,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{p.tag}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Principle cards ── */}
      <div>
        {PRINCIPLES.map((p, i) => (
          <PrincipleCard key={p.num} p={p} i={i} isDark={isDark} />
        ))}
      </div>
    </section>
  )
}

function PrincipleCard({
  p, i, isDark,
}: {
  p: typeof PRINCIPLES[0]
  i: number
  isDark: boolean
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-8%" })
  const [hovered, setHovered] = useState(false)

  const isEven = i % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        transition: "background 0.35s ease",
        background: hovered
          ? isDark ? `${p.color}09` : `${p.color}06`
          : "transparent",
        overflow: "hidden",
      }}
    >
      {/* Large ghost number — decorative background */}
      <div aria-hidden style={{
        position: "absolute",
        top: "50%",
        right: isEven ? "clamp(1rem,4vw,3rem)" : undefined,
        left: isEven ? undefined : "clamp(1rem,4vw,3rem)",
        transform: "translateY(-50%)",
        fontFamily: "var(--font-display)",
        fontSize: "clamp(8rem,22vw,20rem)",
        fontWeight: 800,
        letterSpacing: "-0.06em",
        lineHeight: 1,
        color: "transparent",
        WebkitTextStroke: `1px ${p.color}${isDark ? "1a" : "12"}`,
        userSelect: "none",
        pointerEvents: "none",
        transition: "opacity 0.3s ease",
        opacity: hovered ? 1 : 0.7,
      }}>
        {p.num}
      </div>

      {/* Content grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        padding: "clamp(2.5rem,5vw,4rem) clamp(1.5rem,6vw,5rem)",
        gap: "clamp(2rem,4vw,3rem)",
        position: "relative",
        zIndex: 1,
      }}>

        {/* ── Left / Top: identity block ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Tag + number row */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 + 0.1 }}
              style={{
                width: 40, height: 40,
                background: hovered ? p.color : `${p.color}${isDark ? "20" : "18"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.35s ease",
                transformOrigin: "left",
              }}
            >
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em",
                color: hovered ? (isDark ? "#000" : "#fff") : p.color,
                transition: "color 0.3s ease",
              }}>{p.num}</span>
            </motion.div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 16, height: 1, background: p.color, opacity: 0.5 }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: p.color, opacity: 0.8,
              }}>{p.tag}</span>
            </div>
          </div>

          {/* Heading */}
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem,3.5vw,3rem)",
            fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.95,
            color: "var(--color-text-primary)",
            margin: 0,
            whiteSpace: "pre-line",
          }}>
            {p.title}
          </h3>

          {/* Italic sub */}
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.78rem,1vw,0.9rem)",
            color: p.color, lineHeight: 1.55,
            margin: 0, fontStyle: "italic", opacity: 0.85,
          }}>
            {p.sub}
          </p>
        </div>

        {/* ── Right / Bottom: body + stat ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* Body text */}
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 + 0.18 }}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.84rem,1.15vw,0.97rem)",
              color: "var(--color-text-muted)", lineHeight: 1.8,
              margin: 0,
            }}
          >
            {p.body}
          </motion.p>

          {/* Stat card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: "easeOut", delay: i * 0.07 + 0.28 }}
            style={{
              display: "inline-flex",
              flexDirection: "column",
              gap: "0.35rem",
              padding: "1.25rem 1.5rem",
              border: `1px solid ${p.color}${isDark ? "28" : "22"}`,
              borderLeft: `3px solid ${p.color}`,
              background: `${p.color}${isDark ? "0d" : "08"}`,
              maxWidth: "fit-content",
              alignSelf: "flex-start",
            }}
          >
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem,5vw,3.5rem)",
              fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 0.9,
              color: p.color,
            }}>
              {p.stat}
            </span>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.48rem", letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)", opacity: 0.6,
              lineHeight: 1.5,
            }}>
              {p.statLabel}
            </span>
          </motion.div>

          {/* Hover-reveal bottom line */}
          <div style={{
            height: 1,
            background: `linear-gradient(90deg, ${p.color}, transparent)`,
            width: hovered ? "100%" : "0%",
            transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
          }} />
        </div>
      </div>
    </motion.div>
  )
}