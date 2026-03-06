"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"
import { MessageSquare, Lightbulb, Code2, Rocket, HeartHandshake } from "lucide-react"

const STEPS = [
  {
    num: "01", icon: MessageSquare,
    title: "Discovery Call",
    sub: "We talk. I listen.",
    desc: "30 minutes. You explain what you're building, what's broken, or what you need. No templates. No scripts. Real conversation.",
    duration: "Day 1",
    color: "#5567F7",
  },
  {
    num: "02", icon: Lightbulb,
    title: "Architecture &\nProposal",
    sub: "Blueprint before bricks.",
    desc: "I map the technical solution — stack, timeline, milestones, costs. You see the plan before a single line of code is written.",
    duration: "Days 2–4",
    color: "#45D2B0",
  },
  {
    num: "03", icon: Code2,
    title: "Build &\nIterate",
    sub: "Heads down. Ship fast.",
    desc: "Agile sprints. You get working previews, not vague updates. Feedback loops are tight. Direction changes are welcome early.",
    duration: "Weeks 1–N",
    color: "#FF6B9D",
  },
  {
    num: "04", icon: Rocket,
    title: "Deploy &\nLaunch",
    sub: "Zero drama go-live.",
    desc: "CI/CD pipelines, containerised deployments, monitored releases. Your product lands in production without the usual chaos.",
    duration: "Final Week",
    color: "#AAFF00",
  },
  {
    num: "05", icon: HeartHandshake,
    title: "Support &\nHandover",
    sub: "You're not left hanging.",
    desc: "Documentation, training, and post-launch support. If something breaks, I'm reachable. Clean handover if you take it in-house.",
    duration: "Ongoing",
    color: "#F5A623",
  },
]

export function ServiceProcess() {
  const { theme }   = useTheme()
  const sectionRef  = useRef<HTMLDivElement>(null)
  const trackRef    = useRef<HTMLDivElement>(null)
  const [inView,    setInView]    = useState(false)
  const [painted,   setPainted]   = useState(false)
  const [progress,  setProgress]  = useState(0)  // 0–1 scroll progress through section
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.04 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setPainted(true), 60)
    return () => clearTimeout(t)
  }, [inView])

  // Horizontal scroll driven by vertical page scroll
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current; const track = trackRef.current
      if (!el || !track) return
      const rect = el.getBoundingClientRect()
      const winH = window.innerHeight
      // Section is "active" from when top hits viewport center to when bottom leaves
      const sectionH = el.offsetHeight
      const scrollable = sectionH - winH
      const rawProgress = -rect.top / scrollable
      const p = Math.max(0, Math.min(1, rawProgress))
      setProgress(p)
      // Drive horizontal track
      const maxScroll = track.scrollWidth - track.offsetWidth
      track.scrollLeft = p * maxScroll
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    // Tall section so vertical scroll drives horizontal
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: "400vh",   // tall = more scroll range for horizontal drive
        background: "var(--color-bg)",
      }}
    >
      {/* Sticky container */}
      <div style={{
        position: "sticky",
        top: 0,
        height: "100svh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
        {/* Paint wipe */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
          background: isDark ? "#07070F" : "#F6F6FC",
          clipPath: painted
            ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
            : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          transition: painted ? "clip-path 1s cubic-bezier(0.86,0,0.07,1)" : "none",
        }} />

        {/* Ambient */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse 60% 60% at ${20 + progress * 60}% 50%, ${acc}${isDark ? "14" : "0a"} 0%, transparent 65%)`,
          transition: "background 0.05s linear",
        }} />

        {/* Header */}
        <div style={{
          padding: "0 clamp(1.5rem,5vw,4rem)",
          marginBottom: "clamp(2rem,4vw,3rem)",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          flexWrap: "wrap", gap: "1rem",
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(20px)",
          transition: "all 0.7s ease 0.1s",
          position: "relative", zIndex: 5,
          flexShrink: 0,
        }}>
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem",
            }}>
              <div style={{ width: 24, height: "1px", background: acc }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                letterSpacing: "0.14em", textTransform: "uppercase", color: acc,
              }}>How It Works</span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem,5vw,4.5rem)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9,
              margin: 0, color: "var(--color-text-primary)",
            }}>The Process</h2>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "clamp(80px,12vw,160px)", height: 2,
              background: "var(--color-surface-border)", position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: acc,
                transform: `scaleX(${progress})`,
                transformOrigin: "left",
                transition: "transform 0.05s linear",
              }} />
            </div>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.55rem",
              color: acc, letterSpacing: "0.1em",
            }}>{Math.round(progress * 100)}%</span>
          </div>
        </div>

        {/* Horizontal scrolling track */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: "1px",
            overflowX: "hidden",  // programmatically scrolled, no user scroll
            scrollBehavior: "auto",
            padding: "0 clamp(1.5rem,5vw,4rem)",
            position: "relative", zIndex: 5,
            flexShrink: 0,
          }}
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon
            // Each step lights up progressively
            const stepProgress = (progress - i * 0.18) / 0.25
            const lit = Math.max(0, Math.min(1, stepProgress))

            return (
              <div key={step.num} style={{
                flexShrink: 0,
                width: "clamp(260px,30vw,400px)",
                padding: "clamp(1.5rem,2.5vw,2.5rem)",
                border: `1px solid ${lit > 0.5 ? step.color + "88" : "var(--color-surface-border)"}`,
                background: lit > 0.5
                  ? isDark ? `${step.color}10` : `${step.color}08`
                  : "transparent",
                position: "relative",
                overflow: "hidden",
                opacity: 0.25 + lit * 0.75,
                transform: `translateY(${(1 - lit) * 20}px)`,
                transition: "border-color 0.3s ease, background 0.3s ease",
              }}>
                {/* Step number watermark */}
                <div style={{
                  position: "absolute", bottom: -10, right: 10,
                  fontFamily: "var(--font-display)",
                  fontSize: "6rem", fontWeight: 800, letterSpacing: "-0.06em",
                  color: "transparent",
                  WebkitTextStroke: `1px ${step.color}${lit > 0.5 ? "22" : "0a"}`,
                  pointerEvents: "none", userSelect: "none", lineHeight: 1,
                  transition: "all 0.3s ease",
                }}>{step.num}</div>

                {/* Duration badge */}
                <div style={{
                  display: "inline-flex", alignItems: "center",
                  border: `1px solid ${step.color}44`,
                  background: `${step.color}0d`,
                  padding: "0.2rem 0.6rem",
                  marginBottom: "1.25rem",
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                    letterSpacing: "0.12em", color: step.color,
                  }}>{step.duration}</span>
                </div>

                {/* Icon */}
                <div style={{
                  width: 40, height: 40,
                  border: `1px solid ${step.color}${lit > 0.5 ? "88" : "33"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: step.color, marginBottom: "1rem",
                  background: lit > 0.5 ? `${step.color}12` : "transparent",
                  transition: "all 0.3s ease",
                }}>
                  <Icon size={18} strokeWidth={1.75} />
                </div>

                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.2rem,2.5vw,1.85rem)",
                  fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05,
                  margin: "0 0 0.3rem",
                  color: lit > 0.5 ? step.color : "var(--color-text-primary)",
                  whiteSpace: "pre-line",
                  transition: "color 0.3s ease",
                }}>{step.title}</h3>

                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: step.color, opacity: 0.7,
                  margin: "0 0 0.875rem",
                }}>{step.sub}</p>

                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.75rem,1vw,0.875rem)",
                  color: "var(--color-text-muted)", lineHeight: 1.65,
                  margin: 0,
                }}>{step.desc}</p>

                {/* Connector arrow (not last) */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: "absolute",
                    right: -1, top: "50%",
                    transform: "translateY(-50%)",
                    width: 24, height: 24,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: step.color, opacity: lit > 0.5 ? 0.6 : 0.2,
                    zIndex: 2,
                    transition: "opacity 0.3s ease",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Scroll hint */}
        <div style={{
          padding: "clamp(1rem,2vw,1.5rem) clamp(1.5rem,5vw,4rem) 0",
          position: "relative", zIndex: 5, flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.5rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--color-text-muted)", opacity: 0.35,
          }}>↓ Keep scrolling to walk through the process</span>
        </div>
      </div>
    </section>
  )
}