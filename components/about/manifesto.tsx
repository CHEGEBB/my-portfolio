"use client"

import { useRef } from "react"
import { useTheme } from "@/context/theme-context"
import { motion, useInView, useScroll, useTransform } from "framer-motion"

const STATEMENTS = [
  {
    num: "01",
    text: "Code is\ncommunication.",
    sub: "Every function name, every comment, every architecture decision is a message to the next person. I write for humans first.",
    color: "#5567F7",
  },
  {
    num: "02",
    text: "Ship it or\nit doesn't exist.",
    sub: "A perfect system no one uses is worthless. I optimise for delivered, not polished. Polish comes through iteration.",
    color: "#45D2B0",
  },
  {
    num: "03",
    text: "The best tool\nis the right tool.",
    sub: "Not the newest. Not the trendiest. The one that solves the problem fastest for the user who has it.",
    color: "#FF6B9D",
  },
  {
    num: "04",
    text: "Leadership is\ntechnical work.",
    sub: "The best CTOs write code. The best architects understand people. I refuse to choose between them.",
    color: "#AAFF00",
  },
]

function Statement({ stmt, index }: { stmt: typeof STATEMENTS[0]; index: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15%" })
  const { theme } = useTheme()
  const isDark = theme.mode === "dark"

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{
        position: "relative",
        padding: "clamp(3rem,7vw,6rem) clamp(1.5rem,6vw,5rem)",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "clamp(2rem,4vw,3.5rem) 1fr clamp(200px,28vw,380px)",
        gap: "clamp(1rem,3vw,3rem)",
        alignItems: "start",
      }}
    >
      {/* Hover fill */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute", inset: 0,
          background: isDark ? `${stmt.color}08` : `${stmt.color}05`,
          transformOrigin: "left",
          pointerEvents: "none",
        }}
      />

      {/* Number */}
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "0.52rem",
        letterSpacing: "0.14em", color: stmt.color, opacity: 0.65,
        paddingTop: "0.6rem",
      }}>{stmt.num}</div>

      {/* Massive statement text */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <motion.h3
          initial={{ y: 60, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 + 0.1 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem,6vw,5.5rem)",
            fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.92,
            margin: 0,
            color: "var(--color-text-primary)",
            whiteSpace: "pre-line",
          }}
        >{stmt.text}</motion.h3>
      </div>

      {/* Sub statement */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.08 + 0.35 }}
        style={{
          paddingTop: "0.75rem",
          position: "relative", zIndex: 1,
        }}
      >
        {/* Colour accent */}
        <div style={{
          width: 24, height: 2,
          background: stmt.color,
          marginBottom: "0.75rem",
        }} />
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(0.82rem,1.1vw,0.95rem)",
          color: "var(--color-text-muted)", lineHeight: 1.7,
          margin: 0,
        }}>{stmt.sub}</p>
      </motion.div>
    </motion.div>
  )
}

export function AboutManifesto() {
  const { theme } = useTheme()
  const ref       = useRef<HTMLDivElement>(null)
  const inView    = useInView(ref, { once: true, margin: "-10%" })
  const acc       = theme.colors.accent
  const isDark    = theme.mode === "dark"

  return (
    <section style={{
      position: "relative",
      background: "var(--color-bg)",
      overflow: "hidden",
    }}>
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
          <div style={{
            display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem",
          }}>
            <div style={{ width: 20, height: "1px", background: acc }} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.58rem",
              letterSpacing: "0.16em", textTransform: "uppercase", color: acc,
            }}>How I Think</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem,7vw,6rem)",
            fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9, margin: 0,
          }}>
            <span style={{ display: "block", color: "var(--color-text-primary)" }}>The</span>
            <span style={{
              display: "block", color: "transparent",
              WebkitTextStroke: `2px ${acc}`,
            }}>Manifesto.</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.82rem,1.1vw,0.95rem)",
            color: "var(--color-text-muted)", lineHeight: 1.7,
            maxWidth: 320, margin: 0,
          }}
        >
          Four things I believe about software, leadership, and craft. Non-negotiable.
        </motion.p>
      </div>

      {/* Statements */}
      {STATEMENTS.map((s, i) => (
        <Statement key={s.num} stmt={s} index={i} />
      ))}
    </section>
  )
}