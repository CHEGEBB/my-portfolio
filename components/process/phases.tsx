"use client"

import { useRef, useEffect } from "react"
import { useTheme } from "@/context/theme-context"

const PHASES = [
  {
    num: "01", label: "Discover", period: "Day 1–2", accent: "#5567F7",
    title: "One conversation\nchanges everything.",
    body: "I listen before I speak. The first session is never about me — it's about understanding your business, your users, and the real problem beneath the stated one. Most developers skip this. I never do.",
    aside: "Bad requirements are the #1 cause of failed projects. Clarity here saves weeks later.",
  },
  {
    num: "02", label: "Architect", period: "Days 3–7", accent: "#45D2B0",
    title: "Blueprint before\na single line.",
    body: "I map the full technical solution — stack, schema, API contracts, component structure, deployment pipeline. You see and approve the plan before I write a single function.",
    aside: "Every hour in architecture saves ten in rework. This is where the project is actually built.",
  },
  {
    num: "03", label: "Build", period: "Weeks 2–N", accent: "#FF6B9D",
    title: "Working software,\nnot promises.",
    body: "Agile sprints. Every week you see something real — a working screen, a deployed endpoint, a tested flow. Feedback welcome at every step. Changes are cheap early; I make them easy on purpose.",
    aside: "I write tests. I document as I go. The codebase I hand over is one your team can maintain.",
  },
  {
    num: "04", label: "Ship", period: "Final week", accent: "#AAFF00",
    title: "Launched. Live.\nZero drama.",
    body: "CI/CD pipeline. Containerised. Monitored from day one. The go-live is a non-event — infrastructure was ready weeks before launch day. No scrambling, no 3am emergencies.",
    aside: "I've never missed a launch. The system is designed so missing is structurally impossible.",
  },
  {
    num: "05", label: "Evolve", period: "Ongoing", accent: "#F5A623",
    title: "Good software\nnever stops.",
    body: "Post-launch is where the real data arrives. I stay. Monitor the metrics, triage bugs, plan the next iteration. Software that doesn't evolve dies. Yours won't.",
    aside: "The relationship doesn't end at handover. I'm reachable. I'm accountable. Always.",
  },
]

const ITEMS = [...PHASES, ...PHASES, ...PHASES]

function PhaseCard({ ph, origIdx, isDark }: {
  ph: typeof PHASES[0]; origIdx: number; isDark: boolean
}) {
  return (
    <div style={{
      flexShrink: 0,
      width: "clamp(340px,44vw,580px)",
      height: "100%",
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
      padding: "clamp(5rem,10vw,8rem) clamp(2rem,4.5vw,4rem)",
      borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
      position: "relative",
    }}>
      {/* Ghost number */}
      <div style={{
        position: "absolute", top: "clamp(5rem,10vw,8rem)", right: "clamp(1.5rem,3vw,2.5rem)",
        fontFamily: "var(--font-display)", fontSize: "clamp(6rem,14vw,14rem)",
        fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 1,
        color: "transparent", WebkitTextStroke: `1px ${ph.accent}${isDark ? "18" : "14"}`,
        userSelect: "none", pointerEvents: "none",
      }}>{ph.num}</div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "clamp(1.5rem,3vw,2.5rem)" }}>
          <div style={{ width: 24, height: 1, background: ph.accent }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.16em", textTransform: "uppercase", color: ph.accent }}>{ph.label}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.44rem", letterSpacing: "0.1em", color: "var(--color-text-muted)", opacity: 0.4 }}>· {ph.period}</span>
        </div>
        <h3 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,3.5vw,3rem)",
          fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.96,
          margin: "0 0 1.5rem", color: "var(--color-text-primary)", whiteSpace: "pre-line",
        }}>{ph.title}</h3>
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "clamp(0.82rem,1.1vw,0.95rem)",
          color: "var(--color-text-muted)", lineHeight: 1.78, margin: "0 0 1.75rem", maxWidth: 440,
        }}>{ph.body}</p>
        <div style={{ borderLeft: `2px solid ${ph.accent}55`, paddingLeft: "1.1rem" }}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(0.72rem,0.95vw,0.82rem)",
            color: ph.accent, lineHeight: 1.65, margin: 0, fontStyle: "italic", opacity: 0.85,
          }}>{ph.aside}</p>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: "clamp(1.5rem,3vw,2.5rem)", right: "clamp(1.5rem,3vw,2.5rem)",
        fontFamily: "var(--font-mono)", fontSize: "0.44rem",
        letterSpacing: "0.12em", color: ph.accent, opacity: 0.4,
      }}>{String(origIdx + 1).padStart(2, "0")} / 05</div>
    </div>
  )
}

export function ProcessPhases() {
  const { theme } = useTheme()
  const isDark = theme.mode === "dark"
  const acc = theme.colors.accent

  const trackRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const posRef = useRef(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const SPEED = 0.55

    const tick = () => {
      if (!pausedRef.current) {
        posRef.current += SPEED
        const oneSet = track.scrollWidth / 3
        if (posRef.current >= oneSet) posRef.current -= oneSet
        track.style.transform = `translateX(${-posRef.current}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <section style={{ position: "relative", background: "var(--color-bg)", overflow: "hidden" }}>

      {/* Eyebrow */}
      <div style={{
        padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,5rem) 0",
        display: "flex", alignItems: "center", gap: "0.6rem",
      }}>
        <div style={{ width: 20, height: "1px", background: acc }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: acc }}>
          The Process
        </span>
      </div>

      {/* Intro — full width, static, sits above the carousel */}
      <div style={{
        padding: "clamp(2rem,4vw,3.5rem) clamp(1.5rem,6vw,5rem) clamp(3rem,6vw,5rem)",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
        position: "relative", overflow: "hidden",
      }}>
        {/* Background image */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&auto=format&fit=crop&q=80")`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: isDark ? "brightness(0.18) saturate(0.6)" : "brightness(0.55) saturate(0.5)",
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: isDark
            ? `linear-gradient(135deg, ${acc}08 0%, transparent 50%), linear-gradient(to top, #07070f 40%, transparent 80%)`
            : `linear-gradient(135deg, ${acc}0a 0%, transparent 50%), linear-gradient(to top, #f0f0f8 35%, transparent 75%)`,
        }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.5rem,9vw,9rem)",
            fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 0.87,
            margin: "0 0 clamp(1.5rem,3vw,2.5rem)",
            color: "#ffffff", textShadow: "0 2px 40px rgba(0,0,0,0.5)",
          }}>
            How the<br />
            <span style={{ color: "transparent", WebkitTextStroke: `2px ${acc}`, textShadow: `0 0 60px ${acc}66` }}>
              work runs.
            </span>
          </h2>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(0.85rem,1.2vw,1rem)",
            color: "rgba(255,255,255,0.65)", lineHeight: 1.72,
            maxWidth: 480, margin: "0 0 clamp(2rem,4vw,3rem)",
          }}>
            Every project I take runs the same disciplined system. Not because I'm rigid — because consistency is what separates great software from scrambled software.
          </p>
          <div style={{ display: "flex", gap: "clamp(1rem,2.5vw,2rem)", flexWrap: "wrap" }}>
            {PHASES.map((ph) => (
              <div key={ph.num} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 6, height: 6, background: ph.accent, borderRadius: "50%", boxShadow: `0 0 6px ${ph.accent}` }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: ph.accent }}>{ph.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div
        style={{ position: "relative", height: "clamp(420px,65vh,620px)", overflow: "hidden" }}
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

        <div
          ref={trackRef}
          style={{ display: "flex", alignItems: "stretch", height: "100%", willChange: "transform" }}
        >
          {ITEMS.map((ph, i) => (
            <PhaseCard key={i} ph={ph} origIdx={i % PHASES.length} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  )
}