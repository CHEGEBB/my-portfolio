"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/context/theme-context"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const CHAPTERS = [
  {
    year: "2022",
    label: "Origin",
    title: "Top of the\nconstituency.",
    body: "KCSE. Wareng High School. Best student in the entire constituency. Equity Leaders Programme scholarship. Not luck — obsession with getting things right.",
    accent: "#5567F7",
    align: "left" as const,
  },
  {
    year: "2023",
    label: "Ignition",
    title: "Python.\nShell.\nSystems.",
    body: "ALX Africa. Nights learning systems programming, DevOps, shell scripting. The foundation that made everything else possible. Every late night was an investment.",
    accent: "#45D2B0",
    align: "right" as const,
  },
  {
    year: "2024",
    label: "Velocity",
    title: "CTO at 21.\nTwo startups.",
    body: "Co-founded HealthMaster. Co-founded Softrinx. Wrote architecture, hired engineers, shipped products used by real people. The classroom moved to production.",
    accent: "#FF6B9D",
    align: "left" as const,
  },
  {
    year: "2025",
    label: "Now",
    title: "20+ shipped.\nStill building.",
    body: "Graduated. 20+ production applications. 7+ companies. Flutter intern. Teach2Give developer. Still writing code at midnight because the work is never finished.",
    accent: "#AAFF00",
    align: "right" as const,
  },
]

export function AboutStory() {
  const { theme }   = useTheme()
  const sectionRef  = useRef<HTMLDivElement>(null)
  const trackRef    = useRef<HTMLDivElement>(null)
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      // Horizontal scroll pin
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth + 200}`,
          invalidateOnRefresh: true,
        },
      })

      // Each chapter fades + lifts in as it enters viewport
      gsap.utils.toArray<HTMLElement>(".story-chapter").forEach((ch, i) => {
        const inner = ch.querySelector(".story-inner")
        gsap.fromTo(inner,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ch,
              containerAnimation: ScrollTrigger.getById("story-scroll") as any,
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
      style={{
        position: "relative",
        height: "100svh",
        overflow: "hidden",
        background: "var(--color-bg)",
      }}
    >
      {/* Section label */}
      <div style={{
        position: "absolute", top: "clamp(5rem,8vw,6rem)", left: "clamp(1.5rem,5vw,4rem)",
        zIndex: 10,
        display: "flex", alignItems: "center", gap: "0.6rem",
      }}>
        <div style={{ width: 20, height: "1px", background: acc }} />
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.58rem",
          letterSpacing: "0.16em", textTransform: "uppercase", color: acc,
        }}>Origin Story</span>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          alignItems: "stretch",
          height: "100%",
          willChange: "transform",
        }}
      >
        {/* Opening panel — full viewport wide */}
        <div style={{
          width: "100vw", flexShrink: 0, height: "100%",
          display: "flex", alignItems: "center",
          padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem)",
          borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
          position: "relative",
        }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem,9vw,8.5rem)",
              fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 0.88,
              margin: "0 0 1.5rem",
              color: "var(--color-text-primary)",
            }}>
              The<br />
              <span style={{ color: "transparent", WebkitTextStroke: `2px ${acc}` }}>
                Story.
              </span>
            </h2>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "0.58rem",
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "var(--color-text-muted)", opacity: 0.5,
            }}>Scroll → to read</p>
          </div>

          {/* Animated arrow */}
          <div style={{
            position: "absolute", right: "3rem", top: "50%",
            transform: "translateY(-50%)",
            animation: "arrowBounce 1.5s ease-in-out infinite",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke={acc} strokeWidth="1.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        {/* Chapter panels */}
        {CHAPTERS.map((ch, i) => (
          <div
            key={ch.year}
            className="story-chapter"
            style={{
              width: "clamp(380px,45vw,620px)",
              flexShrink: 0, height: "100%",
              display: "flex", alignItems: "center",
              padding: "clamp(5rem,10vw,8rem) clamp(2rem,4vw,3.5rem)",
              borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
              position: "relative",
              background: i % 2 === 0
                ? "transparent"
                : isDark ? "rgba(255,255,255,0.012)" : "rgba(0,0,0,0.012)",
            }}
          >
            <div className="story-inner" style={{ opacity: 0 }}>
              {/* Year + label */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                marginBottom: "clamp(1.5rem,3vw,2.5rem)",
              }}>
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3rem,5vw,4.5rem)",
                  fontWeight: 800, letterSpacing: "-0.06em",
                  color: "transparent",
                  WebkitTextStroke: `1px ${ch.accent}66`,
                  lineHeight: 1,
                }}>{ch.year}</span>
                <div style={{
                  display: "flex", flexDirection: "column", gap: "0.2rem",
                }}>
                  <div style={{ width: 24, height: "1px", background: ch.accent }} />
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.52rem",
                    letterSpacing: "0.16em", textTransform: "uppercase",
                    color: ch.accent,
                  }}>{ch.label}</span>
                </div>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem,3.5vw,3rem)",
                fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0,
                margin: "0 0 1.25rem",
                color: "var(--color-text-primary)",
                whiteSpace: "pre-line",
              }}>{ch.title}</h3>

              {/* Body */}
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.82rem,1.1vw,0.95rem)",
                color: "var(--color-text-muted)", lineHeight: 1.75,
                margin: 0, maxWidth: 400,
              }}>{ch.body}</p>

              {/* Chapter accent line */}
              <div style={{
                position: "absolute", bottom: "clamp(2rem,4vw,3.5rem)", left: "clamp(2rem,4vw,3.5rem)",
                width: "clamp(40px,6vw,80px)", height: 2,
                background: `linear-gradient(90deg, ${ch.accent}, transparent)`,
              }} />
            </div>
          </div>
        ))}

        {/* End spacer */}
        <div style={{ width: "30vw", flexShrink: 0 }} />
      </div>

      <style jsx global>{`
        @keyframes arrowBounce {
          0%, 100% { transform: translateX(0) translateY(-50%); opacity: 0.5; }
          50%       { transform: translateX(8px) translateY(-50%); opacity: 1; }
        }
      `}</style>
    </section>
  )
}