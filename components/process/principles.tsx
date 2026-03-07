"use client"

import { useRef } from "react"
import { useTheme } from "@/context/theme-context"
import { motion, useInView } from "framer-motion"

const PRINCIPLES = [
  {
    num: "01",
    text: "Clarity over\ncleverness.",
    sub: "The smartest solution is the one the next developer can read at 2am without documentation. I write code that explains itself.",
    color: "#5567F7",
  },
  {
    num: "02",
    text: "Boring is\nbeautiful.",
    sub: "I reach for proven tools before shiny ones. Your project is not a playground for frameworks. Postgres, Docker, and Node have earned their place.",
    color: "#45D2B0",
  },
  {
    num: "03",
    text: "Deadlines are\nnon-negotiable.",
    sub: "I've never slipped a launch. When scope threatens timelines, I communicate early and cut features — never quality, never the launch date.",
    color: "#FF6B9D",
  },
  {
    num: "04",
    text: "Tests are\nnot optional.",
    sub: "Every function I ship has coverage. Not because a process demands it — because untested code is a liability I refuse to hand to a client.",
    color: "#AAFF00",
  },
  {
    num: "05",
    text: "The user is\nalways right.",
    sub: "Your users don't care about your architecture. They care that it works, fast, on their phone, first try. That's what I build toward.",
    color: "#F5A623",
  },
]

function PrincipleRow({ p, index }: { p: typeof PRINCIPLES[0]; index: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15%" })
  const { theme } = useTheme()
  const isDark = theme.mode === "dark"

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.05 }}
      style={{
        position: "relative",
        padding: "clamp(2.5rem,6vw,5rem) clamp(1.5rem,6vw,5rem)",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "clamp(2rem,4vw,3.5rem) 1fr clamp(200px,28vw,380px)",
        gap: "clamp(1rem,3vw,3rem)",
        alignItems: "start",
        cursor: "default",
      }}
    >
      {/* Hover sweep fill */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute", inset: 0,
          background: isDark ? `${p.color}09` : `${p.color}06`,
          transformOrigin: "left",
          pointerEvents: "none",
        }}
      />

      {/* Number */}
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "0.52rem",
        letterSpacing: "0.14em", color: p.color, opacity: 0.65,
        paddingTop: "0.7rem",
      }}>{p.num}</div>

      {/* Main text */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <motion.h3
          initial={{ y: 60, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 + 0.1 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem,6vw,5.5rem)",
            fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.92,
            margin: 0,
            color: "var(--color-text-primary)",
            whiteSpace: "pre-line",
          }}
        >{p.text}</motion.h3>
      </div>

      {/* Sub text */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.07 + 0.32 }}
        style={{ paddingTop: "0.75rem", position: "relative", zIndex: 1 }}
      >
        <div style={{ width: 24, height: 2, background: p.color, marginBottom: "0.75rem" }} />
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(0.82rem,1.1vw,0.95rem)",
          color: "var(--color-text-muted)", lineHeight: 1.72,
          margin: 0,
        }}>{p.sub}</p>
      </motion.div>
    </motion.div>
  )
}

export function ProcessPrinciples() {
  const { theme } = useTheme()
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10%" })
  const acc    = theme.colors.accent
  const isDark = theme.mode === "dark"

  return (
    <section style={{ position: "relative", background: "var(--color-bg)", overflow: "hidden" }}>

      {/* Header row */}
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
              How I Work
            </span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem,7vw,6rem)",
            fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9,
            margin: 0, color: "var(--color-text-primary)",
          }}>
            The principles<br />
            <span style={{ color: "transparent", WebkitTextStroke: `2px ${acc}` }}>I don't break.</span>
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
            maxWidth: 340, margin: 0,
          }}
        >
          These aren't aspirational. They're the non-negotiables that show up in every line I write, every commit I push, every decision I make.
        </motion.p>
      </div>

      {/* Principle rows */}
      {PRINCIPLES.map((p, i) => (
        <PrincipleRow key={p.num} p={p} index={i} />
      ))}
    </section>
  )
}