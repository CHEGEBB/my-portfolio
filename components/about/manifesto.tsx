"use client"

import { useRef } from "react"
import { useTheme } from "@/context/theme-context"
import { motion, useInView } from "framer-motion"

const STATEMENTS = [
  {
    num: "01",
    text: "Code is\ncommunication.",
    sub: "Every function name, every comment, every architecture decision is a message to the next person. I write for humans first.",
    color: "#5567F7",
    tag: "Philosophy",
  },
  {
    num: "02",
    text: "Ship it or\nit doesn't exist.",
    sub: "A perfect system no one uses is worthless. I optimise for delivered, not polished. Polish comes through iteration.",
    color: "#45D2B0",
    tag: "Execution",
  },
  {
    num: "03",
    text: "The best tool\nis the right tool.",
    sub: "Not the newest. Not the trendiest. The one that solves the problem fastest for the user who has it.",
    color: "#FF6B9D",
    tag: "Craft",
  },
  {
    num: "04",
    text: "Leadership is\ntechnical work.",
    sub: "The best CTOs write code. The best architects understand people. I refuse to choose between them.",
    color: "#AAFF00",
    tag: "Leadership",
  },
]

function Statement({ stmt, index }: { stmt: typeof STATEMENTS[0]; index: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10%" })
  const { theme } = useTheme()
  const isDark = theme.mode === "dark"
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4 }}
      className="manifesto-statement"
      style={{
        position: "relative",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
        overflow: "hidden",
        minHeight: "clamp(220px, 30vw, 360px)",
      }}
    >
      {/* Giant ghost number — background art */}
      <div style={{
        position: "absolute",
        top: "50%",
        right: isEven ? "-0.05em" : "auto",
        left: isEven ? "auto" : "-0.05em",
        transform: "translateY(-50%)",
        fontFamily: "var(--font-display)",
        fontSize: "clamp(10rem, 28vw, 22rem)",
        fontWeight: 800,
        letterSpacing: "-0.06em",
        lineHeight: 1,
        color: "transparent",
        WebkitTextStroke: `1px ${stmt.color}18`,
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 0,
      }}>{stmt.num}</div>

      {/* Accent bar — left edge */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
        style={{
          position: "absolute",
          top: 0, bottom: 0, left: 0,
          width: 3,
          background: `linear-gradient(to bottom, ${stmt.color}, ${stmt.color}33)`,
          transformOrigin: "top",
          zIndex: 2,
        }}
      />

      {/* Hover fill */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at ${isEven ? "right" : "left"} center, ${stmt.color}0d 0%, transparent 65%)`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Content grid */}
      <div
        className="manifesto-inner"
        style={{
          position: "relative", zIndex: 2,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gridTemplateRows: "auto auto",
          gap: "0",
          padding: "clamp(2.5rem,6vw,5rem) clamp(1.75rem,5vw,4.5rem)",
          height: "100%",
          alignItems: "start",
        }}
      >
        {/* Top-left: tag + number */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "clamp(1rem,2.5vw,2rem)" }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.5rem",
            letterSpacing: "0.14em",
            color: stmt.color,
            opacity: 0.7,
          }}>{stmt.num}</span>
          <div style={{ width: 1, height: 12, background: `${stmt.color}44` }} />
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.5rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: stmt.color,
            padding: "0.2rem 0.55rem",
            border: `1px solid ${stmt.color}44`,
            borderRadius: "2px",
          }}>{stmt.tag}</span>
        </div>

        {/* Top-right: decorative line */}
        <div style={{
          width: "clamp(30px,5vw,60px)", height: 1,
          background: `linear-gradient(90deg, ${stmt.color}66, transparent)`,
          marginTop: "0.75rem",
          justifySelf: "end",
        }} />

        {/* Big statement */}
        <motion.h3
          initial={{ y: 50, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 + 0.1 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem,5.5vw,5rem)",
            fontWeight: 800,
            letterSpacing: "-0.05em",
            lineHeight: 0.92,
            margin: "0 0 clamp(1.25rem,2.5vw,2rem)",
            color: "var(--color-text-primary)",
            whiteSpace: "pre-line",
            gridColumn: "1 / -1",
          }}
        >{stmt.text}</motion.h3>

        {/* Sub text + accent */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: "easeOut", delay: index * 0.06 + 0.3 }}
          style={{ gridColumn: "1 / -1", maxWidth: "clamp(260px, 50%, 520px)" }}
        >
          <div style={{ width: 20, height: 2, background: stmt.color, marginBottom: "0.7rem" }} />
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.78rem,1vw,0.92rem)",
            color: "var(--color-text-muted)",
            lineHeight: 1.72,
            margin: 0,
          }}>{stmt.sub}</p>
        </motion.div>
      </div>
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
      {/* ── HEADER ── */}
      <div
        ref={ref}
        style={{
          padding: "clamp(4rem,9vw,7rem) clamp(1.75rem,6vw,5rem) clamp(2rem,4vw,3rem)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header background glow */}
        <div style={{
          position: "absolute", top: "-30%", right: "10%",
          width: "40%", height: "160%",
          background: `radial-gradient(ellipse at top right, ${acc}12 0%, transparent 65%)`,
          filter: "blur(40px)", pointerEvents: "none",
        }} />

        <div style={{
          position: "relative", zIndex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "clamp(1.5rem,3vw,2.5rem)",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "clamp(0.75rem,1.5vw,1.25rem)" }}>
              <div style={{ width: 20, height: "1px", background: acc }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.58rem",
                letterSpacing: "0.16em", textTransform: "uppercase", color: acc,
              }}>How I Think</span>
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
              }}>Manifesto.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            style={{ maxWidth: "clamp(220px, 30vw, 320px)" }}
          >
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.78rem,1vw,0.92rem)",
              color: "var(--color-text-muted)", lineHeight: 1.72,
              margin: "0 0 1.5rem",
            }}>
              Four things I believe about software, leadership, and craft. Non-negotiable.
            </p>
            {/* Statement count row */}
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {STATEMENTS.map(s => (
                <div key={s.num} style={{
                  width: 28, height: 3, borderRadius: 2,
                  background: s.color, opacity: 0.5,
                }} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── STATEMENTS ── */}
      {STATEMENTS.map((s, i) => (
        <Statement key={s.num} stmt={s} index={i} />
      ))}

      <style>{`
        /* Mobile: ensure nothing overflows */
        @media (max-width: 600px) {
          .manifesto-inner {
            grid-template-columns: 1fr !important;
            padding: 2rem 1.25rem !important;
          }
          .manifesto-statement {
            min-height: unset !important;
          }
        }
      `}</style>
    </section>
  )
}