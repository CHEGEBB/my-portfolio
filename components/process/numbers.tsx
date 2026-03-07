"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/context/theme-context"
import { motion, useInView } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: "20+",  label: "Projects shipped to production",  color: "#5567F7", sub: "Across 7+ organisations" },
  { value: "3+",   label: "Years of full-stack experience",   color: "#45D2B0", sub: "Frontend · Backend · Mobile" },
  { value: "0",    label: "Missed launch deadlines",          color: "#FF6B9D", sub: "Ever. Not once." },
  { value: "100%", label: "Client satisfaction rate",         color: "#AAFF00", sub: "Based on direct feedback" },
  { value: "5",    label: "Full-stack specialisations",       color: "#F5A623", sub: "Web · Mobile · Cloud · DB · DevOps" },
  { value: "∞",    label: "Curiosity for what's next",        color: "#00D4FF", sub: "The only stat that truly matters" },
]

function StatBand({ stat, i }: { stat: typeof STATS[0]; i: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12%" })
  const { theme } = useTheme()
  const isDark = theme.mode === "dark"

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "clamp(3rem,5vw,5rem) 1fr clamp(120px,20vw,280px) clamp(80px,12vw,160px)",
        alignItems: "center",
        gap: "clamp(1rem,2.5vw,2.5rem)",
        padding: "clamp(1.75rem,3.5vw,3rem) clamp(1.5rem,6vw,5rem)",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
        overflow: "hidden",
      }}
    >
      {/* Sweep fill on entry */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 + 0.1 }}
        style={{
          position: "absolute", inset: 0,
          background: isDark ? `${stat.color}09` : `${stat.color}06`,
          transformOrigin: "left",
          pointerEvents: "none",
        }}
      />

      {/* Ghost index */}
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "0.48rem",
        letterSpacing: "0.12em", color: stat.color, opacity: 0.5,
        position: "relative", zIndex: 1,
      }}>
        {String(i + 1).padStart(2, "0")}
      </div>

      {/* Big value */}
      <motion.div
        initial={{ opacity: 0, x: -32 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 + 0.12 }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(3rem,7vw,6.5rem)",
          fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 0.9,
          color: stat.color,
          display: "block",
        }}>{stat.value}</span>
      </motion.div>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.06 + 0.22 }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <p style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(0.9rem,1.5vw,1.3rem)",
          fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2,
          margin: "0 0 0.35rem", color: "var(--color-text-primary)",
        }}>{stat.label}</p>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase",
          color: "var(--color-text-muted)", margin: 0, opacity: 0.55,
        }}>{stat.sub}</p>
      </motion.div>

      {/* Right accent bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 + 0.35 }}
        style={{
          height: 2,
          background: `linear-gradient(90deg, ${stat.color}, transparent)`,
          transformOrigin: "left",
          position: "relative", zIndex: 1,
        }}
      />
    </div>
  )
}

export function ProcessNumbers() {
  const { theme } = useTheme()
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10%" })
  const acc    = theme.colors.accent
  const isDark = theme.mode === "dark"

  return (
    <section style={{ position: "relative", background: "var(--color-bg)", overflow: "hidden" }}>

      {/* Header */}
      <div
        ref={ref}
        style={{
          padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem) clamp(2rem,4vw,3rem)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          flexWrap: "wrap", gap: "2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <div style={{ width: 20, height: "1px", background: acc }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: acc }}>
              By the numbers
            </span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem,7vw,6rem)",
            fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9,
            margin: 0, color: "var(--color-text-primary)",
          }}>
            The track record<br />
            <span style={{ color: "transparent", WebkitTextStroke: `2px ${acc}` }}>speaks for itself.</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.82rem,1.1vw,0.95rem)",
            color: "var(--color-text-muted)", lineHeight: 1.7,
            maxWidth: 320, margin: 0,
          }}
        >
          Numbers don't tell the whole story. But they do confirm it.
        </motion.p>
      </div>

      {/* Stat bands */}
      {STATS.map((stat, i) => (
        <StatBand key={stat.label} stat={stat} i={i} />
      ))}
    </section>
  )
}