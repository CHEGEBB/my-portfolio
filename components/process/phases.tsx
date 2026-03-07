"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/context/theme-context"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

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

export function ProcessPhases() {
  const { theme }  = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)
  const isDark     = theme.mode === "dark"
  const acc        = theme.colors.accent

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      // ── Main horizontal scroll — capture the ST instance directly ──
      const mainST = ScrollTrigger.create({
        id: "phases-scroll",
        trigger: section,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${track.scrollWidth - window.innerWidth + 200}`,
        invalidateOnRefresh: true,
        animation: gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
        }),
      })

      // ── Per-chapter reveal — use captured instance, not getById ──
      gsap.utils.toArray<HTMLElement>(".phase-chapter").forEach((ch) => {
        const inner = ch.querySelector<HTMLElement>(".phase-inner")
        if (!inner) return
        gsap.fromTo(
          inner,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ch,
              // containerAnimation: mainST,
              start: "left 80%",
              toggleActions: "play none none reverse",
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", height: "100svh", overflow: "hidden", background: "var(--color-bg)" }}
    >
      {/* Eyebrow */}
      <div style={{
        position: "absolute", top: "clamp(5rem,8vw,6rem)", left: "clamp(1.5rem,5vw,4rem)",
        zIndex: 10, display: "flex", alignItems: "center", gap: "0.6rem",
      }}>
        <div style={{ width: 20, height: "1px", background: acc }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: acc }}>
          The Process
        </span>
      </div>

      {/* Horizontal track */}
      <div ref={trackRef} style={{ display: "flex", height: "100%", willChange: "transform" }}>

        {/* ── Intro panel ── */}
        <div style={{
          width: "100vw", flexShrink: 0, height: "100%",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem)",
          borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
          position: "relative",
        }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.5rem,9vw,9rem)",
            fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 0.87,
            margin: "0 0 clamp(1.5rem,3vw,2.5rem)",
            color: "var(--color-text-primary)",
          }}>
            How the<br />
            <span style={{ color: "transparent", WebkitTextStroke: `2px ${acc}`, textShadow: `0 0 60px ${acc}44` }}>
              work runs.
            </span>
          </h2>

          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.85rem,1.2vw,1rem)",
            color: "var(--color-text-muted)", lineHeight: 1.72,
            maxWidth: 480, margin: "0 0 clamp(2rem,4vw,3rem)",
          }}>
            Every project I take runs the same disciplined system. Not because I'm rigid — because consistency is what separates great software from scrambled software.
          </p>

          <div style={{ display: "flex", gap: "clamp(1rem,2.5vw,2rem)", flexWrap: "wrap" }}>
            {PHASES.map((ph) => (
              <div key={ph.num} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 6, height: 6, background: ph.accent, borderRadius: "50%" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: ph.accent }}>{ph.label}</span>
              </div>
            ))}
          </div>

          <div style={{
            position: "absolute", bottom: "clamp(1.5rem,3vw,2.5rem)", right: "clamp(1.5rem,3vw,2.5rem)",
            display: "flex", alignItems: "center", gap: "0.5rem",
            fontFamily: "var(--font-mono)", fontSize: "0.48rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--color-text-muted)", opacity: 0.5,
          }}>
            <span>Scroll</span>
            <svg width="24" height="10" viewBox="0 0 24 10" fill="none">
              <path d="M0 5h21M16 1l5 4-5 4" stroke={acc} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* ── Phase chapters ── */}
        {PHASES.map((ph, i) => (
          <div
            key={ph.num}
            className="phase-chapter"
            style={{
              width: "clamp(340px,44vw,580px)", flexShrink: 0, height: "100%",
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              padding: "clamp(5rem,10vw,8rem) clamp(2rem,4.5vw,4rem)",
              borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
              position: "relative",
            }}
          >
            <div style={{
              position: "absolute", top: "clamp(5rem,10vw,8rem)", right: "clamp(1.5rem,3vw,2.5rem)",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(6rem,14vw,14rem)",
              fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: `1px ${ph.accent}${isDark ? "18" : "14"}`,
              userSelect: "none", pointerEvents: "none",
            }}>{ph.num}</div>

            <div className="phase-inner" style={{ opacity: 0, position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "clamp(1.5rem,3vw,2.5rem)" }}>
                <div style={{ width: 24, height: 1, background: ph.accent }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", letterSpacing: "0.16em", textTransform: "uppercase", color: ph.accent }}>{ph.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.44rem", letterSpacing: "0.1em", color: "var(--color-text-muted)", opacity: 0.4 }}>· {ph.period}</span>
              </div>

              <h3 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem,3.5vw,3rem)",
                fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.96,
                margin: "0 0 1.5rem",
                color: "var(--color-text-primary)", whiteSpace: "pre-line",
              }}>{ph.title}</h3>

              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.82rem,1.1vw,0.95rem)",
                color: "var(--color-text-muted)", lineHeight: 1.78,
                margin: "0 0 1.75rem", maxWidth: 440,
              }}>{ph.body}</p>

              <div style={{ borderLeft: `2px solid ${ph.accent}55`, paddingLeft: "1.1rem" }}>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.72rem,0.95vw,0.82rem)",
                  color: ph.accent, lineHeight: 1.65,
                  margin: 0, fontStyle: "italic", opacity: 0.85,
                }}>{ph.aside}</p>
              </div>
            </div>

            <div style={{
              position: "absolute", bottom: "clamp(1.5rem,3vw,2.5rem)", right: "clamp(1.5rem,3vw,2.5rem)",
              fontFamily: "var(--font-mono)", fontSize: "0.44rem",
              letterSpacing: "0.12em", color: ph.accent, opacity: 0.4,
            }}>{ph.num} / 05</div>
          </div>
        ))}

        <div style={{ width: "20vw", flexShrink: 0 }} />
      </div>
    </section>
  )
}