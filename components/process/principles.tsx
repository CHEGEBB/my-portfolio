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
    stat: "100%", statLabel: "Deployments reach production",
    symbol: "↗",
  },
  {
    num: "02",
    title: "Architecture decisions\nare irreversible.",
    sub: "The choices you make in week one you live with for years.",
    body: "Before writing any code I document the decisions that are hard to reverse: database choice, service boundaries, auth strategy, API contracts. These get reviewed, challenged, and agreed on. Everything else is reversible — we move fast on those.",
    color: "#45D2B0",
    stat: "0", statLabel: "Rewrites from poor architecture",
    symbol: "◈",
  },
  {
    num: "03",
    title: "Code is written for\nthe next developer.",
    sub: "Including future me at 3am during an incident.",
    body: "I write code assuming the next person to read it knows nothing about what I was thinking. Clear naming, meaningful comments on the 'why' not the 'what', documented decisions, typed interfaces. Code that communicates is the only code worth shipping.",
    color: "#FF6B9D",
    stat: "<1hr", statLabel: "Avg onboarding for new contributors",
    symbol: "⬡",
  },
  {
    num: "04",
    title: "You can't improve what\nyou don't measure.",
    sub: "Monitoring before launch, always.",
    body: "Every system I ship has observability built in before users touch it — error tracking, performance baselines, usage analytics, uptime alerts. You should know your system is broken before your users do. Shipping blind is not shipping — it's gambling.",
    color: "#AAFF00",
    stat: "<5min", statLabel: "Mean time to detect production incidents",
    symbol: "⌬",
  },
]

export function ProcessPrinciples() {
  const { theme } = useTheme()
  const isDark = theme.mode === "dark"
  const acc = theme.colors.accent
  const headerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headerRef, { once: true, margin: "-10%" })

  return (
    <section style={{ position: "relative", background: "var(--color-bg)", overflow: "hidden" }}>

      {/* All responsive styles in ONE place — never inside a loop or child component */}
      <style jsx global>{`
        .pp-header {
          grid-template-columns: 1fr;
        }
        .pp-row {
          grid-template-columns: 1fr;
        }
        .pp-top {
          display: flex;
        }
        .pp-body {
          border-top: 1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"};
        }
        .pp-stat {
          flex: 1;
          border-left: 1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"};
          border-top: none;
        }
        @media (min-width: 768px) {
          .pp-header {
            grid-template-columns: 1fr 1fr;
          }
          .pp-row {
            grid-template-columns: clamp(100px,18vw,220px) 1fr clamp(80px,14vw,180px);
            min-height: clamp(180px,22vw,280px);
          }
          .pp-top {
            display: contents;
          }
          .pp-body {
            border-top: none;
          }
          .pp-stat {
            flex: unset;
            border-left: 1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"};
          }
        }
      `}</style>

      {/* ── Header ── */}
      <div ref={headerRef} className="pp-header" style={{
        padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem) clamp(3rem,5vw,4rem)",
        display: "grid",
        gap: "clamp(2rem,5vw,5rem)",
        alignItems: "flex-end",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: .85, ease: [.16,1,.3,1] }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 20, height: 1, background: acc }}/>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: ".56rem", letterSpacing: ".18em", textTransform: "uppercase", color: acc }}>Non-Negotiables</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.8rem,8vw,7rem)",
            fontWeight: 800, letterSpacing: "-.055em", lineHeight: .88, margin: 0,
          }}>
            <span style={{ display: "block", color: "var(--color-text-primary)" }}>The</span>
            <span style={{ display: "block", color: "transparent", WebkitTextStroke: `2px ${acc}`, textShadow: `0 0 60px ${acc}44` }}>Principles.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: .7, delay: .35 }}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(.85rem,1.2vw,1rem)", color: "var(--color-text-muted)", lineHeight: 1.72, margin: 0 }}>
            Four things I refuse to compromise on regardless of timeline, budget, or client pressure.
          </p>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
            {PRINCIPLES.map((p) => (
              <div key={p.num} style={{
                display: "flex", alignItems: "center", gap: ".4rem",
                padding: ".3rem .75rem",
                border: `1px solid ${p.color}33`,
                borderRadius: 2,
              }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: ".46rem", letterSpacing: ".12em", color: p.color }}>{p.num}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: ".44rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-text-muted)", opacity: .6 }}>{p.title.split("\n")[0].split(" ").slice(0, 2).join(" ")}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Principle rows ── */}
      {PRINCIPLES.map((p, i) => (
        <PrincipleRow key={p.num} p={p} i={i} isDark={isDark} />
      ))}
    </section>
  )
}

function PrincipleRow({ p, i, isDark }: { p: typeof PRINCIPLES[0]; i: number; isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12%" })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: .6, delay: i * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="pp-row"
      style={{
        display: "grid",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        cursor: "default",
        transition: "background .3s ease",
        background: hovered ? (isDark ? `${p.color}07` : `${p.color}05`) : "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Mobile: number + stat side by side. Desktop: display:contents splits them into grid cols */}
      <div className="pp-top">
        {/* Left accent column */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: .7, ease: [.16,1,.3,1], delay: i * 0.05 }}
          style={{
            background: hovered ? p.color : `${p.color}${isDark ? "16" : "0f"}`,
            display: "flex", flexDirection: "column",
            justifyContent: "space-between",
            padding: "clamp(1.25rem,3vw,2.5rem) clamp(1rem,2vw,1.75rem)",
            transformOrigin: "top",
            transition: "background .35s ease",
            borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
            minWidth: "clamp(72px,18vw,220px)",
            width: "clamp(72px,18vw,220px)",
            flexShrink: 0,
          }}
        >
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(1.5rem,4vw,3.5rem)",
            fontWeight: 900, letterSpacing: "-.04em",
            color: hovered ? (isDark ? "#000" : "#fff") : p.color,
            lineHeight: 1, transition: "color .3s ease",
          }}>{p.num}</span>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.25rem,3vw,2.5rem)",
            color: hovered ? (isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)") : `${p.color}55`,
            lineHeight: 1, transition: "color .3s ease",
          }}>{p.symbol}</span>
        </motion.div>

        {/* Stat panel */}
        <motion.div
          className="pp-stat"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: .6, delay: i * 0.05 + 0.25 }}
          style={{
            display: "flex", flexDirection: "column",
            justifyContent: "center", alignItems: "center",
            padding: "clamp(1.25rem,3vw,2rem) clamp(1rem,2vw,1.5rem)",
            textAlign: "center", gap: ".4rem",
          }}
        >
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem,6vw,3.2rem)",
            fontWeight: 900, letterSpacing: "-.05em", lineHeight: 1,
            color: p.color,
          }}>{p.stat}</div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(.38rem,.6vw,.52rem)",
            letterSpacing: ".1em", textTransform: "uppercase",
            color: "var(--color-text-muted)", opacity: .55, lineHeight: 1.5,
          }}>{p.statLabel}</div>
        </motion.div>
      </div>

      {/* Body — full width on mobile, middle col on desktop */}
      <motion.div
        className="pp-body"
        initial={{ opacity: 0, x: 24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: .75, ease: [.16,1,.3,1], delay: i * 0.05 + 0.12 }}
        style={{
          padding: "clamp(1.5rem,3.5vw,2.75rem) clamp(1.25rem,3vw,2.5rem)",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}
      >
        <div style={{
          width: hovered ? "100%" : "0%", height: 2,
          background: `linear-gradient(90deg, ${p.color}, transparent)`,
          marginBottom: "1.25rem",
          transition: "width .5s cubic-bezier(.16,1,.3,1)",
        }}/>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.25rem,2.8vw,2.5rem)",
          fontWeight: 800, letterSpacing: "-.04em", lineHeight: .97,
          color: "var(--color-text-primary)", margin: "0 0 .6rem",
          whiteSpace: "pre-line",
        }}>{p.title}</h3>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "clamp(.7rem,.9vw,.8rem)",
          color: p.color, lineHeight: 1.5, margin: "0 0 1rem",
          fontStyle: "italic", opacity: .8,
        }}>{p.sub}</p>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "clamp(.82rem,1.1vw,.94rem)",
          color: "var(--color-text-muted)", lineHeight: 1.76,
          margin: 0, maxWidth: 540,
        }}>{p.body}</p>
      </motion.div>
    </motion.div>
  )
}