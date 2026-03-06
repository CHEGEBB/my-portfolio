"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/context/theme-context"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const TIMELINE = [
  {
    period: "Sep 2025 – Present",
    role: "Co-Founder & CTO",
    org: "Softrinx",
    type: "work",
    color: "#5567F7",
    bullets: [
      "Lead all technical operations, architecture and deployment",
      "Client-facing technical solutions end-to-end",
      "Managing and mentoring a growing engineering team",
    ],
  },
  {
    period: "Feb 2025 – May 2025",
    role: "Full-Stack Developer",
    org: "Teach2Give",
    type: "work",
    color: "#45D2B0",
    bullets: [
      "Angular, TypeScript, Docker, PostgreSQL, AWS",
      "API integration and backend workflow management",
      "Reusable frontend and backend component systems",
    ],
  },
  {
    period: "Feb 2025 – Jul 2025",
    role: "Software Development Intern",
    org: "Power Learn Project",
    type: "work",
    color: "#00D4FF",
    bullets: [
      "16-week mobile app specialisation — Flutter & Dart",
      "Agile practices from concept through deployment",
      "Entrepreneurial skills alongside technical expertise",
    ],
  },
  {
    period: "May 2024 – Jan 2026",
    role: "Co-Founder & CTO",
    org: "HealthMaster",
    type: "work",
    color: "#FF6B9D",
    bullets: [
      "Health-tech startup — medication adherence + AI",
      "Architected core mobile app and web tool",
      "AI-driven analytics for NCD risk assessment",
    ],
  },
  {
    period: "Jul 2024 – Sep 2024",
    role: "Software Development Intern",
    org: "Prodigy InfoTech",
    type: "work",
    color: "#F5A623",
    bullets: [
      "RESTful APIs with Node.js and MongoDB",
      "Responsive MERN stack systems",
    ],
  },
  {
    period: "Jun 2023 – Aug 2024",
    role: "Software Engineer Intern",
    org: "ALX Africa",
    type: "work",
    color: "#8B5CF6",
    bullets: [
      "Multi-module systems in Python and shell scripting",
      "DevOps practices and scalable architecture",
    ],
  },
  {
    period: "2022 – 2025",
    role: "BSc Computer Science",
    org: "Dedan Kimathi University of Technology",
    type: "edu",
    color: "#AAFF00",
    bullets: [
      "Second Class Upper Honours",
      "Nyeri, Kenya",
    ],
  },
]

export function AboutTimeline() {
  const { theme }  = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const lineRef    = useRef<HTMLDivElement>(null)
  const isDark     = theme.mode === "dark"
  const acc        = theme.colors.accent

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Draw the vertical line as user scrolls
      gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 60%",
            scrub: 0.5,
          },
        }
      )

      // Each node pops in
      gsap.utils.toArray<HTMLElement>(".tl-node").forEach((node, i) => {
        gsap.fromTo(node,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration: 0.5,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: node,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        )
      })

      // Each card slides in from alternating sides
      gsap.utils.toArray<HTMLElement>(".tl-card").forEach((card, i) => {
        const isLeft = i % 2 === 0
        gsap.fromTo(card,
          { opacity: 0, x: isLeft ? -50 : 50 },
          {
            opacity: 1, x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 78%",
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
        background: isDark ? "#07070F" : "#F0F0FA",
        padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,4rem)",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "60vw", height: "60vw",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${acc}0a 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "clamp(3rem,7vw,6rem)",
        position: "relative", zIndex: 2,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.6rem",
          marginBottom: "1rem",
        }}>
          <div style={{ width: 20, height: "1px", background: acc }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.58rem",
            letterSpacing: "0.16em", textTransform: "uppercase", color: acc,
          }}>Experience & Education</span>
          <div style={{ width: 20, height: "1px", background: acc }} />
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem,7vw,6rem)",
          fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9, margin: 0,
        }}>
          <span style={{ color: "var(--color-text-primary)" }}>The </span>
          <span style={{ color: "transparent", WebkitTextStroke: `2px ${acc}` }}>Record.</span>
        </h2>
      </div>

      {/* Timeline */}
      <div style={{
        position: "relative",
        maxWidth: 900,
        margin: "0 auto",
        zIndex: 2,
      }}>
        {/* Vertical line track */}
        <div style={{
          position: "absolute",
          left: "50%", transform: "translateX(-50%)",
          top: 0, bottom: 0,
          width: 1,
          background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
        }} />

        {/* Animated fill line */}
        <div
          ref={lineRef}
          style={{
            position: "absolute",
            left: "50%", transform: "translateX(-50%)",
            top: 0, bottom: 0,
            width: 1,
            background: `linear-gradient(to bottom, ${acc}, ${acc}44)`,
            transformOrigin: "top",
            zIndex: 1,
          }}
        />

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(2rem,4vw,3.5rem)" }}>
          {TIMELINE.map((item, i) => {
            const isLeft = i % 2 === 0
            return (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "1fr clamp(32px,4vw,48px) 1fr",
                alignItems: "center",
                gap: "clamp(1rem,2vw,2rem)",
              }}>
                {/* Left content or spacer */}
                <div className="tl-card" style={{ opacity: 0 }}>
                  {isLeft ? (
                    <TimelineCard item={item} align="right" isDark={isDark} />
                  ) : (
                    <div />
                  )}
                </div>

                {/* Center node */}
                <div style={{
                  display: "flex", justifyContent: "center", alignItems: "center",
                  position: "relative", zIndex: 2,
                }}>
                  <div
                    className="tl-node"
                    style={{
                      width: "clamp(12px,2vw,16px)",
                      height: "clamp(12px,2vw,16px)",
                      borderRadius: "50%",
                      background: item.color,
                      border: `2px solid ${isDark ? "#07070F" : "#F0F0FA"}`,
                      boxShadow: `0 0 0 4px ${item.color}33, 0 0 16px ${item.color}55`,
                      opacity: 0,
                    }}
                  />
                </div>

                {/* Right content or spacer */}
                <div className="tl-card" style={{ opacity: 0 }}>
                  {!isLeft ? (
                    <TimelineCard item={item} align="left" isDark={isDark} />
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile: single column override */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .tl-mobile-override {
            grid-template-columns: 24px 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

function TimelineCard({ item, align, isDark }: {
  item: typeof TIMELINE[0]
  align: "left" | "right"
  isDark: boolean
}) {
  return (
    <div style={{
      padding: "clamp(1.25rem,2vw,1.75rem)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
      background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
      position: "relative",
      overflow: "hidden",
      textAlign: align,
    }}>
      {/* Top colour bar */}
      <div style={{
        position: "absolute", top: 0,
        left: align === "left" ? 0 : "auto",
        right: align === "right" ? 0 : "auto",
        width: "40%", height: 2,
        background: `linear-gradient(${align === "left" ? "90deg" : "270deg"}, ${item.color}, transparent)`,
      }} />

      {/* Type badge */}
      <div style={{
        display: "inline-flex", alignItems: "center",
        marginBottom: "0.6rem",
      }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.44rem",
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: item.color,
          border: `1px solid ${item.color}44`,
          background: `${item.color}0d`,
          padding: "0.15rem 0.45rem",
        }}>{item.type === "work" ? "Work" : "Education"}</span>
      </div>

      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "0.5rem",
        letterSpacing: "0.08em", color: "var(--color-text-muted)",
        opacity: 0.55, marginBottom: "0.4rem",
      }}>{item.period}</div>

      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(1rem,1.8vw,1.35rem)",
        fontWeight: 800, letterSpacing: "-0.03em",
        color: "var(--color-text-primary)",
        marginBottom: "0.2rem",
      }}>{item.role}</div>

      <div style={{
        fontFamily: "var(--font-body)",
        fontSize: "clamp(0.72rem,1vw,0.825rem)",
        color: item.color, marginBottom: "0.875rem",
        fontWeight: 600,
      }}>{item.org}</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {item.bullets.map((b, bi) => (
          <div key={bi} style={{
            display: "flex", alignItems: "flex-start", gap: "0.5rem",
            justifyContent: align === "right" ? "flex-end" : "flex-start",
            flexDirection: align === "right" ? "row-reverse" : "row",
          }}>
            <div style={{
              width: 4, height: 4, borderRadius: "50%",
              background: item.color, flexShrink: 0,
              marginTop: "0.35rem",
            }} />
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.7rem,0.9vw,0.8rem)",
              color: "var(--color-text-muted)", lineHeight: 1.55,
            }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  )
}