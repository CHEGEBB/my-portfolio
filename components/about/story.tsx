"use client"

import { useRef, useEffect } from "react"
import { useTheme } from "@/context/theme-context"
import { motion, useInView } from "framer-motion"

const CHAPTERS = [
  {
    year: "2022", label: "Origin",
    title: "Top of the\nconstituency.",
    body: "KCSE. Wareng High School. Best student in the entire constituency. Equity Leaders Programme scholarship. Not luck — obsession with getting things right.",
    accent: "#5567F7",
  },
  {
    year: "2023", label: "Ignition",
    title: "Python.\nShell.\nSystems.",
    body: "ALX Africa. Nights learning systems programming, DevOps, shell scripting. The foundation that made everything else possible. Every late night was an investment.",
    accent: "#45D2B0",
  },
  {
    year: "2024", label: "Velocity",
    title: "CTO at 21.\nTwo startups.",
    body: "Co-founded HealthMaster. Co-founded Softrinx. Wrote architecture, hired engineers, shipped products used by real people. The classroom moved to production.",
    accent: "#FF6B9D",
  },
  {
    year: "2025", label: "Now",
    title: "20+ shipped.\nStill building.",
    body: "Graduated. 20+ production applications. 7+ companies. Flutter intern. Teach2Give developer. Still writing code at midnight because the work is never finished.",
    accent: "#AAFF00",
  },
]

// Triplicate so the loop never shows a gap regardless of viewport width
const ITEMS = [...CHAPTERS, ...CHAPTERS, ...CHAPTERS]

function ChapterCard({ ch, origIdx, isDark }: {
  ch: typeof CHAPTERS[0]; origIdx: number; isDark: boolean
}) {
  return (
    <div style={{
      flexShrink: 0,
      width: "clamp(300px, 38vw, 500px)",
      height: "100%",
      display: "flex",
      alignItems: "center",
      padding: "clamp(3rem,6vw,5rem) clamp(2rem,4vw,3.5rem)",
      borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
      position: "relative",
    }}>
      <div style={{
        position: "absolute", bottom: 0, left: "-10%", right: "-10%", height: "45%",
        background: `radial-gradient(ellipse at bottom center, ${ch.accent}0c 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "clamp(1.5rem,3vw,2.5rem)" }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.6rem,4.5vw,4rem)",
            fontWeight: 800, letterSpacing: "-.06em", lineHeight: 1,
            color: "transparent", WebkitTextStroke: `1px ${ch.accent}66`,
          }}>{ch.year}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: ".2rem" }}>
            <div style={{ width: 24, height: 1, background: ch.accent }} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: ".52rem",
              letterSpacing: ".16em", textTransform: "uppercase", color: ch.accent,
            }}>{ch.label}</span>
          </div>
        </div>

        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.6rem,3vw,2.6rem)",
          fontWeight: 800, letterSpacing: "-.04em", lineHeight: 1.02,
          margin: "0 0 1.25rem",
          color: "var(--color-text-primary)", whiteSpace: "pre-line",
        }}>{ch.title}</h3>

        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(.8rem,1.1vw,.92rem)",
          color: "var(--color-text-muted)", lineHeight: 1.78,
          margin: 0, maxWidth: 390,
        }}>{ch.body}</p>

        <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{
            width: "clamp(40px,5vw,70px)", height: 2,
            background: `linear-gradient(90deg,${ch.accent},transparent)`,
          }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: ".44rem",
            letterSpacing: ".12em", color: ch.accent, opacity: .4,
          }}>{String(origIdx + 1).padStart(2, "0")} / 04</span>
        </div>
      </div>
    </div>
  )
}

export function AboutStory() {
  const { theme } = useTheme()
  const isDark = theme.mode === "dark"
  const acc = theme.colors.accent

  const headerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const posRef = useRef(0)
  const pausedRef = useRef(false)
  const inView = useInView(headerRef, { once: true, margin: "-10%" })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const SPEED = 0.55 // px per frame — slow enough to be ambient

    const tick = () => {
      if (!pausedRef.current) {
        posRef.current += SPEED
        // Loop: reset by exactly one-third of track (one full set of 4 chapters)
        const oneSet = track.scrollWidth / 3
        if (posRef.current >= oneSet) {
          posRef.current -= oneSet
        }
        track.style.transform = `translateX(${-posRef.current}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    // Cleanup — just cancel RAF, nothing touching DOM nodes
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <section style={{ position: "relative", background: "var(--color-bg)", overflow: "hidden" }}>

      {/* Eyebrow */}
      <div style={{
        padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,5rem) 0",
        display: "flex", alignItems: "center", gap: ".6rem",
      }}>
        <div style={{ width: 20, height: 1, background: acc }} />
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: ".58rem",
          letterSpacing: ".16em", textTransform: "uppercase", color: acc,
        }}>Origin Story</span>
      </div>

      {/* Header */}
      <div
        ref={headerRef}
        style={{
          padding: "clamp(2rem,4vw,3.5rem) clamp(1.5rem,6vw,5rem) clamp(3rem,6vw,5rem)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          flexWrap: "wrap", gap: "clamp(1rem,3vw,2rem)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: "clamp(.75rem,1.5vw,1rem)" }}>
            <div style={{ width: 24, height: 1, background: acc }} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "clamp(.52rem,1vw,.65rem)",
              letterSpacing: ".18em", textTransform: "uppercase", color: acc,
            }}>2022 → 2025</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem,8vw,8rem)",
            fontWeight: 800, letterSpacing: "-.055em", lineHeight: .87,
            margin: 0, color: "var(--color-text-primary)",
          }}>
            The<br />
            <span style={{
              color: "transparent",
              WebkitTextStroke: `2px ${acc}`,
              textShadow: `0 0 60px ${acc}44`,
            }}>Story.</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(.8rem,1.2vw,.92rem)",
            color: "var(--color-text-muted)", lineHeight: 1.72,
            maxWidth: 360, margin: 0,
          }}
        >
          From a constituency scholarship to shipping software for the world.
          Four chapters. Three years. One direction.
        </motion.p>
      </div>

      {/* Carousel */}
      <div
        style={{
          position: "relative",
          height: "clamp(420px,65vh,620px)",
          overflow: "hidden",
        }}
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false }}
      >
        {/* Edge fades */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "clamp(40px,6vw,80px)",
          background: `linear-gradient(to right, var(--color-bg), transparent)`,
          pointerEvents: "none", zIndex: 2,
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "clamp(40px,6vw,80px)",
          background: `linear-gradient(to left, var(--color-bg), transparent)`,
          pointerEvents: "none", zIndex: 2,
        }} />

        {/* Track */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            alignItems: "stretch",
            height: "100%",
            willChange: "transform",
          }}
        >
          {ITEMS.map((ch, i) => (
            <ChapterCard
              key={i}
              ch={ch}
              origIdx={i % CHAPTERS.length}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  )
}