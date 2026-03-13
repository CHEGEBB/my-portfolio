"use client"

import { useRef, useState, useEffect } from "react"
import { useTheme } from "@/context/theme-context"
import { motion, useInView } from "framer-motion"

const PRINCIPLES = [
  {
    num: "01",
    title: "Ship working software,\nnot demos.",
    sub: "A perfect prototype no one uses is worthless.",
    body: "Every engagement I take ends with deployed, production-ready software — not Figma screens, not slide decks, not 'almost ready' staging environments. I optimise for delivered, not polished. Polish comes through iteration once real users are touching the product.",
    color: "#5567F7",
    stat: "100",
    statSuffix: "%",
    statLabel: "Deployments reach production",
    tag: "Delivery",
  },
  {
    num: "02",
    title: "Architecture decisions\nare irreversible.",
    sub: "The choices you make in week one you live with for years.",
    body: "Before writing any code I document the decisions that are hard to reverse: database choice, service boundaries, auth strategy, API contracts. These get reviewed, challenged, and agreed on. Everything else is reversible — we move fast on those.",
    color: "#45D2B0",
    stat: "0",
    statSuffix: "",
    statLabel: "Rewrites from poor architecture",
    tag: "Architecture",
  },
  {
    num: "03",
    title: "Code is written for\nthe next developer.",
    sub: "Including future me at 3am during an incident.",
    body: "I write code assuming the next person to read it knows nothing about what I was thinking. Clear naming, meaningful comments on the 'why' not the 'what', documented decisions, typed interfaces. Code that communicates is the only code worth shipping.",
    color: "#FF6B9D",
    stat: "1",
    statSuffix: "hr",
    statLabel: "Avg onboarding for new contributors",
    tag: "Code Quality",
  },
  {
    num: "04",
    title: "You can't improve what\nyou don't measure.",
    sub: "Monitoring before launch, always.",
    body: "Every system I ship has observability built in before users touch it — error tracking, performance baselines, usage analytics, uptime alerts. You should know your system is broken before your users do. Shipping blind is not shipping — it's gambling.",
    color: "#AAFF00",
    stat: "5",
    statSuffix: "min",
    statLabel: "Mean time to detect production incidents",
    tag: "Observability",
  },
]

// Animated count-up number
function CountUp({ target, suffix, color, inView }: {
  target: number; suffix: string; color: string; inView: boolean
}) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const duration = 1400

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplay(Math.round(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [inView, target])

  return (
    <span style={{ color, fontVariantNumeric: "tabular-nums" }}>
      {display}{suffix}
    </span>
  )
}

function PrincipleCard({ p, i }: { p: typeof PRINCIPLES[0]; i: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-8%" })
  const [hovered, setHovered] = useState(false)
  const { theme } = useTheme()
  const isDark = theme.mode === "dark"
  const isEven = i % 2 === 0

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        overflow: "hidden",
        minHeight: "clamp(420px, 60vh, 680px)",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
      }}
    >
      {/* Full-bleed hover wash */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "absolute", inset: 0,
          background: isDark
            ? `radial-gradient(ellipse 100% 100% at ${isEven ? "30%" : "70%"} 50%, ${p.color}12 0%, transparent 60%)`
            : `radial-gradient(ellipse 100% 100% at ${isEven ? "30%" : "70%"} 50%, ${p.color}0c 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* Animated top border */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${p.color}, ${p.color}44, transparent)`,
          transformOrigin: isEven ? "left" : "right",
        }}
      />

      {/* Giant ghost number — always visible, dramatic */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.85 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 + 0.1 }}
        style={{
          position: "absolute",
          right: isEven ? "-2vw" : undefined,
          left: isEven ? undefined : "-2vw",
          top: "50%", transform: "translateY(-50%)",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(14rem,38vw,32rem)",
          fontWeight: 800, letterSpacing: "-0.07em", lineHeight: 0.8,
          color: "transparent",
          WebkitTextStroke: `1.5px ${p.color}${isDark ? "22" : "18"}`,
          userSelect: "none", pointerEvents: "none",
          transition: "opacity 0.4s ease",
          opacity: hovered ? 1 : 0.6,
        }}
      >
        {p.num}
      </motion.div>

      {/* Stat — huge, anchored top */}
      <div style={{
        position: "absolute",
        top: "clamp(3rem,6vw,5rem)",
        left: isEven ? "clamp(1.5rem,6vw,5rem)" : undefined,
        right: isEven ? undefined : "clamp(1.5rem,6vw,5rem)",
        zIndex: 2,
      }}>
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 + 0.2 }}
        >
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(4rem,12vw,10rem)",
            fontWeight: 900, letterSpacing: "-0.06em", lineHeight: 0.85,
            color: p.color,
            textShadow: `0 0 80px ${p.color}55`,
          }}>
            <CountUp
              target={parseInt(p.stat)}
              suffix={p.statSuffix}
              color={p.color}
              inView={inView}
            />
          </div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "clamp(0.44rem,0.75vw,0.58rem)",
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: "var(--color-text-muted)", opacity: 0.55,
            marginTop: "0.5rem",
          }}>
            {p.statLabel}
          </div>
        </motion.div>
      </div>

      {/* Bottom content block */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: "clamp(2.5rem,5vw,4rem) clamp(1.5rem,6vw,5rem)",
        display: "grid",
        gridTemplateColumns: isEven ? "1fr clamp(200px,28vw,380px)" : "clamp(200px,28vw,380px) 1fr",
        gap: "clamp(2rem,4vw,4rem)",
        alignItems: "end",
      }}>

        {/* Identity col */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 + 0.15 }}
          style={{ order: isEven ? 0 : 1 }}
        >
          {/* Tag */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.6rem",
            padding: "0.3rem 0.8rem",
            border: `1px solid ${p.color}44`,
            background: `${p.color}${isDark ? "14" : "0e"}`,
            marginBottom: "1.25rem",
          }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.48rem", letterSpacing: "0.14em", textTransform: "uppercase", color: p.color }}>{p.num}</span>
            <div style={{ width: 1, height: 10, background: `${p.color}44` }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.44rem", letterSpacing: "0.12em", textTransform: "uppercase", color: p.color, opacity: 0.8 }}>{p.tag}</span>
          </div>

          {/* Heading */}
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem,4vw,3.5rem)",
            fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.93,
            color: "var(--color-text-primary)", margin: "0 0 1rem",
            whiteSpace: "pre-line",
          }}>{p.title}</h3>

          {/* Italic sub */}
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.8rem,1.1vw,0.95rem)",
            color: p.color, lineHeight: 1.55,
            margin: 0, fontStyle: "italic", opacity: 0.85,
          }}>{p.sub}</p>
        </motion.div>

        {/* Body col */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 + 0.28 }}
          style={{ order: isEven ? 1 : 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.84rem,1.15vw,0.97rem)",
            color: "var(--color-text-muted)", lineHeight: 1.8, margin: 0,
          }}>{p.body}</p>

          {/* Hover-reveal line */}
          <div style={{
            height: 1,
            background: `linear-gradient(${isEven ? "90deg" : "270deg"}, ${p.color}, transparent)`,
            width: hovered ? "100%" : "30%",
            transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)",
          }} />
        </motion.div>
      </div>
    </motion.div>
  )
}

export function ProcessPrinciples() {
  const { theme } = useTheme()
  const isDark    = theme.mode === "dark"
  const acc       = theme.colors.accent
  const headerRef = useRef<HTMLDivElement>(null)
  const inView    = useInView(headerRef, { once: true, margin: "-10%" })

  return (
    <section style={{ position: "relative", background: "var(--color-bg)", overflow: "hidden" }}>

      {/* Header */}
      <div
        ref={headerRef}
        style={{
          padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem) clamp(3rem,5vw,4rem)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          flexWrap: "wrap", gap: "clamp(2rem,4vw,3.5rem)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 20, height: 1, background: acc }} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.56rem",
              letterSpacing: "0.18em", textTransform: "uppercase", color: acc,
            }}>Non-Negotiables</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.8rem,8vw,7rem)",
            fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 0.88, margin: 0,
          }}>
            <span style={{ display: "block", color: "var(--color-text-primary)" }}>The</span>
            <span style={{
              display: "block", color: "transparent",
              WebkitTextStroke: `2px ${acc}`,
              textShadow: `0 0 60px ${acc}44`,
            }}>Principles.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ maxWidth: "clamp(200px,30vw,380px)" }}
        >
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.85rem,1.2vw,1rem)",
            color: "var(--color-text-muted)", lineHeight: 1.72, margin: "0 0 1.5rem",
          }}>
            Four things I refuse to compromise on regardless of timeline, budget, or client pressure.
          </p>
          {/* Colour chips */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {PRINCIPLES.map((p) => (
              <div key={p.num} style={{
                display: "flex", alignItems: "center", gap: "0.45rem",
                padding: "0.3rem 0.7rem",
                border: `1px solid ${p.color}33`,
                background: `${p.color}0a`,
              }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: p.color }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.44rem", letterSpacing: "0.12em", textTransform: "uppercase", color: p.color }}>{p.tag}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Cards */}
      <div>
        {PRINCIPLES.map((p, i) => (
          <PrincipleCard key={p.num} p={p} i={i} />
        ))}
      </div>
    </section>
  )
}