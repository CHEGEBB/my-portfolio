"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/context/theme-context"
import { useInView } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// Unique ID — never touches other components' triggers
const ST_ID = "about-timeline-rail"

const TIMELINE = [
  {
    period: "Sep 2025 – Present", role: "Co-Founder & CTO", org: "Softrinx", type: "work", duration: 95,
    bullets: ["Lead all technical operations, architecture and deployment", "Client-facing technical solutions end-to-end", "Managing and mentoring a growing engineering team"],
  },
  {
    period: "Feb 2025 – May 2025", role: "Full-Stack Developer", org: "Teach2Give", type: "work", duration: 42,
    bullets: ["Angular, TypeScript, Docker, PostgreSQL, AWS", "API integration and backend workflow management", "Reusable frontend and backend component systems"],
  },
  {
    period: "Feb 2025 – Jul 2025", role: "Software Dev Intern", org: "Power Learn Project", type: "work", duration: 55,
    bullets: ["16-week mobile app specialisation — Flutter & Dart", "Agile practices from concept through deployment"],
  },
  {
    period: "May 2024 – Jan 2026", role: "Co-Founder & CTO", org: "HealthMaster", type: "work", duration: 88,
    bullets: ["Health-tech startup — medication adherence + AI", "Architected core mobile app and web platform", "AI-driven analytics for NCD risk assessment"],
  },
  {
    period: "Jul 2024 – Sep 2024", role: "Software Dev Intern", org: "Prodigy InfoTech", type: "work", duration: 28,
    bullets: ["RESTful APIs with Node.js and MongoDB", "Responsive MERN stack systems"],
  },
  {
    period: "Jun 2023 – Aug 2024", role: "Software Engineer Intern", org: "ALX Africa", type: "work", duration: 72,
    bullets: ["Multi-module systems in Python and shell scripting", "DevOps practices and scalable architecture"],
  },
  {
    period: "2022 – 2025", role: "BSc Computer Science", org: "Dedan Kimathi University of Technology", type: "edu", duration: 100,
    bullets: ["Second Class Upper Honours · Nyeri, Kenya"],
  },
]

function TimelineBand({ item, index, acc, isDark }: {
  item: typeof TIMELINE[0]; index: number; acc: string; isDark: boolean
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12%" })
  const delay  = index * 0.06
  const isEdu  = item.type === "edu"

  return (
    <div ref={ref} style={{
      position: "relative",
      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.06)"}`,
      overflow: "hidden",
      minHeight: isEdu ? "clamp(120px,14vw,160px)" : "clamp(140px,17vw,200px)",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: isDark ? `${acc}09` : `${acc}07`,
        transform: inView ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left",
        transition: `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        pointerEvents: "none",
      }} />
      <div aria-hidden style={{
        position: "absolute", right: "clamp(4rem,8vw,7rem)", top: "50%", transform: "translateY(-50%)",
        fontFamily: "var(--font-display)", fontSize: "clamp(6rem,14vw,18rem)",
        fontWeight: 800, lineHeight: 1, letterSpacing: "-0.08em",
        color: "transparent", WebkitTextStroke: `1px ${acc}${isDark ? "12" : "0e"}`,
        userSelect: "none", pointerEvents: "none",
        opacity: inView ? 1 : 0, transition: `opacity 0.6s ease ${delay + 0.2}s`,
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>

      <div style={{
        position: "relative", zIndex: 2,
        display: "grid", gridTemplateColumns: "clamp(3rem,6vw,5rem) 1fr auto",
        alignItems: "center", height: "100%", gap: 0,
        padding: "clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,4vw,3rem)",
      }}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
          opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(12px)",
          transition: `all 0.5s ease ${delay}s`,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.38rem",
            letterSpacing: "0.18em", textTransform: "uppercase", color: acc,
            writingMode: "vertical-rl", textOrientation: "mixed",
            transform: "rotate(180deg)", opacity: 0.7,
          }}>{isEdu ? "EDU" : "WORK"}</span>
          <div style={{ width: 1, height: "clamp(20px,3vw,32px)", background: `linear-gradient(to bottom, ${acc}88, transparent)` }} />
        </div>

        <div style={{
          paddingLeft: "clamp(1rem,2vw,2rem)",
          opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)",
          transition: `all 0.65s cubic-bezier(0.16,1,0.3,1) ${delay + 0.05}s`,
        }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(0.44rem,0.7vw,0.56rem)", letterSpacing: "0.12em", color: "var(--color-text-muted)", opacity: 0.45, marginBottom: "0.3rem" }}>{item.period}</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.2rem,2.8vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, color: "var(--color-text-primary)", marginBottom: "0.2rem" }}>{item.role}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(0.58rem,1vw,0.75rem)", color: acc, letterSpacing: "0.04em", fontWeight: 600, marginBottom: isEdu ? 0 : "clamp(0.5rem,1vw,0.8rem)" }}>{item.org}</div>
          {!isEdu && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem 1.5rem", marginTop: "0.35rem" }}>
              {item.bullets.map((b, bi) => (
                <span key={bi} style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.65rem,0.9vw,0.78rem)", color: "var(--color-text-muted)", lineHeight: 1.5, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span style={{ color: acc, opacity: 0.5, fontSize: "0.6em" }}>◆</span>{b}
                </span>
              ))}
            </div>
          )}
          {isEdu && item.bullets.map((b, bi) => (
            <div key={bi} style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.65rem,0.9vw,0.78rem)", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>{b}</div>
          ))}
        </div>

        <div style={{
          display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem",
          minWidth: "clamp(60px,8vw,100px)",
          opacity: inView ? 1 : 0, transition: `opacity 0.5s ease ${delay + 0.3}s`,
        }}>
          <div style={{ width: 2, height: "clamp(40px,6vw,72px)", background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)", position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: inView ? `${item.duration}%` : "0%",
              background: acc, boxShadow: `0 0 8px ${acc}`,
              transition: `height 1.1s cubic-bezier(0.16,1,0.3,1) ${delay + 0.4}s`,
            }} />
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.42rem", letterSpacing: "0.1em", color: acc, opacity: 0.55 }}>{item.duration}%</span>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 0, left: 0, height: 1,
        width: inView ? `${item.duration}%` : "0%",
        background: `linear-gradient(90deg, ${acc}, transparent)`,
        transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${delay + 0.15}s`,
      }} />
    </div>
  )
}

export function AboutTimeline() {
  const { theme }  = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const railRef    = useRef<HTMLDivElement>(null)
  const ctxRef     = useRef<gsap.Context | null>(null)
  const isDark     = theme.mode === "dark"
  const acc        = theme.colors.accent

  useEffect(() => {
    if (!sectionRef.current || !railRef.current) return

    // Kill any leftover from previous mount before creating new
    ScrollTrigger.getById(ST_ID)?.kill(true)
    ctxRef.current?.revert()

    ctxRef.current = gsap.context(() => {
      gsap.fromTo(railRef.current,
        { scaleY: 0 },
        {
          scaleY: 1, ease: "none",
          scrollTrigger: {
            id: ST_ID,
            trigger: sectionRef.current,
            start: "top 50%", end: "bottom 60%", scrub: 0.8,
          },
        }
      )
    }, sectionRef) // ← scoped to sectionRef, not global

    return () => {
      // ✅ CORRECT ORDER:
      // 1. Kill OUR trigger by ID first (removes ScrollTrigger state while DOM exists)
      // 2. Revert our scoped context (cleans up tweens)
      // ❌ NEVER: ScrollTrigger.getAll().forEach(kill) — kills other components' triggers
      // ❌ NEVER: ScrollTrigger.refresh() after killing — unnecessary and dangerous
      ScrollTrigger.getById(ST_ID)?.kill(true)
      ctxRef.current?.revert()
      ctxRef.current = null
    }
  }, [])

  return (
    <section ref={sectionRef} style={{ position: "relative", background: isDark ? "#07070f" : "#f0f0f8", overflow: "hidden" }}>
      <div aria-hidden style={{
        position: "absolute", top: 0, right: 0, width: "40vw", height: "40vw",
        background: `radial-gradient(ellipse at 100% 0%, ${acc}0b 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute", right: "clamp(1rem,2vw,1.75rem)",
        top: "clamp(5rem,10vw,8rem)", bottom: "clamp(5rem,10vw,8rem)",
        width: 1, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
      }}>
        <div ref={railRef} style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "100%",
          background: `linear-gradient(to bottom, ${acc}, ${acc}44)`, transformOrigin: "top",
        }} />
        {TIMELINE.map((_, i) => (
          <div key={i} style={{
            position: "absolute", left: "50%",
            top: `${(i / (TIMELINE.length - 1)) * 100}%`,
            transform: "translateX(-50%)",
            width: 5, height: 5, borderRadius: "50%", background: acc, opacity: 0.5,
          }} />
        ))}
      </div>

      <div style={{
        padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem) clamp(2.5rem,5vw,4rem)",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.06)"}`,
        position: "relative", zIndex: 2,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.1rem" }}>
          <div style={{ width: 20, height: "1px", background: acc }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: acc }}>Experience & Education</span>
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem,9vw,8rem)", fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 0.87, margin: "0 0 clamp(1rem,2vw,1.5rem)" }}>
          <span style={{ display: "block", color: "var(--color-text-primary)" }}>The</span>
          <span style={{ display: "block", color: "transparent", WebkitTextStroke: `2px ${acc}`, textShadow: `0 0 60px ${acc}44` }}>Record.</span>
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", color: "var(--color-text-muted)", opacity: 0.4 }}>{TIMELINE.filter(t => t.type === "work").length} ROLES</span>
          <div style={{ width: 1, height: 10, background: "var(--color-text-muted)", opacity: 0.15 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", color: "var(--color-text-muted)", opacity: 0.4 }}>{TIMELINE.filter(t => t.type === "edu").length} DEGREE</span>
          <div style={{ width: 1, height: 10, background: "var(--color-text-muted)", opacity: 0.15 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", color: acc, opacity: 0.6 }}>2022 → PRESENT</span>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        {TIMELINE.map((item, i) => (
          <TimelineBand key={i} item={item} index={i} acc={acc} isDark={isDark} />
        ))}
      </div>
    </section>
  )
}