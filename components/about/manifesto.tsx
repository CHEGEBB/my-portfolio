"use client"

import { useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"
import { motion, useInView, useScroll, useTransform } from "framer-motion"

const STATEMENTS = [
  {
    num: "01",
    words: ["Code", "is", "communication."],
    sub: "Every function name, every comment, every architecture decision is a message to the next person. I write for humans first.",
    color: "#5567F7",
    tag: "Philosophy",
  },
  {
    num: "02",
    words: ["Ship", "it", "or", "it", "doesn't", "exist."],
    sub: "A perfect system no one uses is worthless. I optimise for delivered, not polished. Polish comes through iteration.",
    color: "#45D2B0",
    tag: "Execution",
  },
  {
    num: "03",
    words: ["The", "best", "tool", "is", "the", "right", "tool."],
    sub: "Not the newest. Not the trendiest. The one that solves the problem fastest for the user who has it.",
    color: "#FF6B9D",
    tag: "Craft",
  },
  {
    num: "04",
    words: ["Leadership", "is", "technical", "work."],
    sub: "The best CTOs write code. The best architects understand people. I refuse to choose between them.",
    color: "#AAFF00",
    tag: "Leadership",
  },
]

// Scramble hook — randomises chars then resolves to real text on hover
function useScramble(text: string) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef<number | null>(null)
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%"

  const scramble = useCallback(() => {
    let iteration = 0
    const total = text.length * 3
    if (frameRef.current) cancelAnimationFrame(frameRef.current)

    const tick = () => {
      setDisplay(
        text
          .split("")
          .map((char, idx) => {
            if (char === " ") return " "
            if (idx < iteration / 3) return text[idx]
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join("")
      )
      if (iteration < total) {
        iteration++
        frameRef.current = requestAnimationFrame(tick)
      } else {
        setDisplay(text)
      }
    }
    tick()
  }, [text])

  const reset = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    setDisplay(text)
  }, [text])

  return { display, scramble, reset }
}

function ManifestoRow({ stmt, index }: { stmt: typeof STATEMENTS[0]; index: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12%" })
  const { theme } = useTheme()
  const isDark = theme.mode === "dark"
  const [hovered, setHovered] = useState(false)

  // Scroll-driven parallax for the ghost number
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const numY        = useTransform(scrollYProgress, [0, 1], ["14%", "-14%"])
  const numOpacity  = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 0.7, 1, 0.7, 0])
  // Headline letter-spacing tightens as it enters view via scroll
  const headlineX   = useTransform(scrollYProgress, [0.05, 0.35], ["6%", "0%"])

  // Tag scramble on hover
  const { display: tagDisplay, scramble, reset } = useScramble(stmt.tag.toUpperCase())

  return (
    <div
      ref={ref}
      onMouseEnter={() => { setHovered(true); scramble() }}
      onMouseLeave={() => { setHovered(false); reset() }}
      style={{
        position: "relative",
        padding: "clamp(4rem,9vw,7.5rem) 0",
        borderTop: index === 0 ? "none" : `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Hover fill — wide ambient wash, no card shape */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 90% 120% at 55% 50%, ${stmt.color}0d 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* Scroll-driven giant ghost number */}
      <motion.div
        style={{
          y: numY,
          opacity: numOpacity,
          position: "absolute",
          top: "50%",
          right: "clamp(-2rem, -3vw, -4rem)",
          translateY: "-50%",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(12rem, 35vw, 28rem)",
          fontWeight: 800,
          letterSpacing: "-0.07em",
          lineHeight: 0.75,
          color: "transparent",
          WebkitTextStroke: `1px ${stmt.color}1c`,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        {stmt.num}
      </motion.div>

      {/* On hover: full-width accent underline sweeps in */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "1px",
          background: `linear-gradient(90deg, ${stmt.color}70, transparent 60%)`,
          transformOrigin: "left",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 1,
        display: "grid",
        gridTemplateColumns: "clamp(55px,7vw,100px) 1fr",
        gridTemplateRows: "auto auto",
        columnGap: "clamp(1.25rem,3vw,3rem)",
        rowGap: "clamp(1.5rem,2.5vw,2.5rem)",
        alignItems: "start",
      }}>

        {/* Left col: number + rule + scrambling tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: index * 0.05 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            paddingTop: "0.4em",
          }}
        >
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.58rem, 0.8vw, 0.72rem)",
            letterSpacing: "0.1em",
            color: stmt.color,
            fontWeight: 700,
          }}>{stmt.num}</span>
          <motion.div
            animate={{ width: inView ? "100%" : "0%" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 + 0.3 }}
            style={{
              height: "1.5px",
              background: `linear-gradient(90deg, ${stmt.color}80, transparent)`,
            }}
          />
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.46rem, 0.62vw, 0.56rem)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: hovered ? stmt.color : `${stmt.color}80`,
            transition: "color 0.3s ease",
          }}>{tagDisplay}</span>
        </motion.div>

        {/* Right col: headline — slides in from right via scroll */}
        <div style={{ overflow: "hidden" }}>
          <motion.h3
            style={{ x: headlineX }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
            animate={inView ? {} : {}}
            aria-label={stmt.words.join(" ")}
            tabIndex={0}
            role="heading"
            aria-level={3}
          >
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.3rem, 6vw, 5.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 0.91,
              margin: 0,
              color: "var(--color-text-primary)",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.22em",
              alignItems: "baseline",
            }}>
              {stmt.words.map((word, wi) => (
                <span key={wi} style={{ overflow: "hidden", display: "inline-block" }}>
                  <motion.span
                    style={{ display: "inline-block" }}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={inView ? { y: "0%", opacity: 1 } : {}}
                    transition={{
                      duration: 0.78,
                      ease: [0.16, 1, 0.3, 1],
                      delay: index * 0.04 + wi * 0.075 + 0.1,
                    }}
                  >
                    {wi === stmt.words.length - 1
                      ? (
                        // Last word: color + scales up on hover
                        <motion.span
                          animate={{ scale: hovered ? 1.04 : 1 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          style={{ display: "inline-block", color: stmt.color, transformOrigin: "left center" }}
                        >
                          {word}
                        </motion.span>
                      )
                      : word}
                  </motion.span>
                </span>
              ))}
            </span>
          </motion.h3>
        </div>

        {/* Spacer */}
        <div />

        {/* Sub copy — fades + rises in */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: "easeOut", delay: index * 0.04 + stmt.words.length * 0.075 + 0.25 }}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "clamp(0.75rem,2vw,1.5rem)",
            maxWidth: "50ch",
          }}
        >
          {/* Pulsing dot */}
          <motion.div
            animate={{
              scale: hovered ? [1, 1.8, 1] : [1, 1.4, 1],
              opacity: hovered ? [0.8, 1, 0.8] : [0.5, 0.9, 0.5],
            }}
            transition={{ duration: hovered ? 0.6 : 2.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
            style={{
              flexShrink: 0,
              width: 6, height: 6,
              borderRadius: "50%",
              background: stmt.color,
              marginTop: "0.52em",
              boxShadow: `0 0 ${hovered ? "14px" : "8px"} ${stmt.color}`,
              transition: "box-shadow 0.3s ease",
            }}
          />
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.82rem, 1.05vw, 0.95rem)",
            color: "var(--color-text-muted)",
            lineHeight: 1.78,
            margin: 0,
          }}>{stmt.sub}</p>
        </motion.div>
      </div>
    </div>
  )
}

export function AboutManifesto() {
  const { theme }  = useTheme()
  const headerRef  = useRef<HTMLDivElement>(null)
  const inView     = useInView(headerRef, { once: true, margin: "-10%" })
  const acc        = theme.colors.accent
  const isDark     = theme.mode === "dark"

  return (
    <section style={{
      position: "relative",
      background: "var(--color-bg)",
      overflow: "hidden",
      padding: "0 clamp(1.5rem,6vw,5rem)",
    }}>

      {/* ── HEADER ── */}
      <div
        ref={headerRef}
        style={{
          paddingTop: "clamp(4rem,10vw,8rem)",
          paddingBottom: "clamp(2rem,4vw,3rem)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "clamp(1rem,3vw,2rem)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "clamp(0.5rem,1.2vw,0.9rem)" }}>
            <div style={{ width: 24, height: "1.5px", background: acc }} />
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: acc,
            }}>How I Think</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 10vw, 8rem)",
            fontWeight: 800,
            letterSpacing: "-0.055em",
            lineHeight: 0.87,
            margin: 0,
          }}>
            <span style={{ display: "block", color: "var(--color-text-primary)" }}>The</span>
            <motion.span
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              style={{
                display: "block",
                color: "transparent",
                WebkitTextStroke: `2px ${acc}`,
                textShadow: `0 0 80px ${acc}40`,
              }}
            >Manifesto.</motion.span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ maxWidth: "clamp(180px, 26vw, 280px)" }}
        >
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.8rem, 1vw, 0.92rem)",
            color: "var(--color-text-muted)",
            lineHeight: 1.75,
            margin: "0 0 1.2rem",
          }}>
            Four things I believe about software, leadership, and craft. Non-negotiable.
          </p>
          {/* Animated dots — each pops in with spring */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {STATEMENTS.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 0.65 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.55 + i * 0.09 }}
                style={{
                  width: 8, height: 8,
                  borderRadius: "50%",
                  background: s.color,
                  boxShadow: `0 0 8px ${s.color}80`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── STATEMENTS ── */}
      {STATEMENTS.map((s, i) => (
        <ManifestoRow key={s.num} stmt={s} index={i} />
      ))}

      <div style={{
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
        paddingBottom: "clamp(3rem,6vw,5rem)",
      }} />
    </section>
  )
}