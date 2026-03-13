"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/context/theme-context"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

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

export function AboutStory() {
  const { theme }    = useTheme()
  const sectionRef   = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [mounted,  setMounted]  = useState(false)

  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    const revealed = new Set<HTMLElement>()

    const ctx = gsap.context(() => {
      const getDistance = () => track.scrollWidth - window.innerWidth

      ScrollTrigger.create({
        id: "story-scroll",
        trigger: section,
        pin: true,
        anticipatePin: 1,
        scrub: 1.2,
        start: "top top",
        end: () => `+=${getDistance()}`,
        invalidateOnRefresh: true,
        animation: gsap.to(track, { x: () => -getDistance(), ease: "none" }),
        onUpdate(self) {
          setProgress(self.progress)
          const moved     = self.progress * getDistance()
          const threshold = moved + window.innerWidth * 0.72
          track.querySelectorAll<HTMLElement>(".story-chapter").forEach((ch) => {
            const inner = ch.querySelector<HTMLElement>(".story-inner")
            if (!inner || revealed.has(inner)) return
            if (ch.offsetLeft < threshold) {
              revealed.add(inner)
              gsap.fromTo(inner,
                { opacity: 0, y: 52 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
              )
            }
          })
        },
      })
    }, sectionRef)

    return () => {
      // CRITICAL: kill all ST instances BEFORE ctx.revert() so the pin CSS
      // is removed while the DOM nodes still exist — prevents removeChild crash
      ScrollTrigger.getAll().forEach(st => st.kill(true))
      ctx.revert()
      ScrollTrigger.refresh()
      revealed.clear()
    }
  }, [])

  const activeIdx = progress < 0.04
    ? -1
    : Math.min(Math.floor((progress - 0.04) / (0.96 / CHAPTERS.length)), CHAPTERS.length - 1)

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", height: "100svh", overflow: "hidden", background: "var(--color-bg)" }}
    >
      {/* Progress bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px", zIndex: 50,
        background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
      }}>
        <div style={{
          height: "100%", width: `${progress * 100}%`,
          background: `linear-gradient(90deg, ${acc}, ${acc}88)`,
          boxShadow: `0 0 10px ${acc}99`,
          transition: "width 0.08s linear",
        }} />
      </div>

      {/* Scroll indicator pill */}
      <div style={{
        position: "absolute",
        bottom: "clamp(1.25rem,3vw,2rem)", right: "clamp(1rem,3vw,2rem)",
        zIndex: 50,
        display: "flex", alignItems: "center", gap: "0.55rem",
        padding: "0.4rem 0.8rem 0.4rem 0.6rem",
        borderRadius: "9999px",
        border: `1px solid ${acc}44`,
        background: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.75)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        opacity: progress > 0.97 ? 0 : 1,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }}>
        <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
          <div style={{
            height: 6, borderRadius: 3,
            width: activeIdx === -1 ? 14 : 6,
            background: activeIdx === -1 ? acc : `${acc}33`,
            transition: "all 0.3s ease",
          }} />
          {CHAPTERS.map((ch, i) => (
            <div key={i} style={{
              height: 6, borderRadius: 3,
              width: activeIdx === i ? 14 : 6,
              background: activeIdx === i ? ch.accent : `${ch.accent}33`,
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <svg width="16" height="10" viewBox="0 0 20 12" fill="none"
            style={{ animation: progress < 0.015 ? "nudgeRight 1.1s ease-in-out infinite" : "none" }}>
            <path d="M0 6h17M11 1l6 5-6 5" stroke={acc} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: ".48rem",
            letterSpacing: ".1em", textTransform: "uppercase", color: acc, minWidth: "2.5ch",
          }}>
            {progress < 0.015 ? "scroll" : `${Math.round(progress * 100)}%`}
          </span>
        </div>
      </div>

      {/* Eyebrow */}
      <div style={{
        position: "absolute", top: "clamp(5rem,8vw,6rem)", left: "clamp(1.5rem,5vw,4rem)",
        zIndex: 10, display: "flex", alignItems: "center", gap: ".6rem", pointerEvents: "none",
      }}>
        <div style={{ width: 20, height: 1, background: acc }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".16em", textTransform: "uppercase", color: acc }}>Origin Story</span>
      </div>

      {/* Horizontal track */}
      <div ref={trackRef} style={{ display: "flex", alignItems: "stretch", height: "100%", willChange: "transform" }}>

        {/* Intro panel */}
        <div className="story-intro-panel" style={{
          width: "100vw", flexShrink: 0, height: "100%",
          display: "flex", alignItems: "center",
          padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem)",
          borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
          position: "relative", overflow: "visible",
          gap: "clamp(2rem,5vw,5rem)",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "var(--color-bg)", zIndex: 0 }} />
          <div style={{
            position: "absolute", bottom: "-15%", left: "-5%", width: "45%", height: "65%",
            background: `radial-gradient(ellipse at bottom left, ${acc}18 0%, transparent 65%)`,
            filter: "blur(50px)", pointerEvents: "none", zIndex: 0,
          }} />
          <div style={{
            position: "absolute", top: "5%", right: "30%", width: "35%", height: "50%",
            background: "radial-gradient(ellipse at top, #5567F71a 0%, transparent 65%)",
            filter: "blur(55px)", pointerEvents: "none", zIndex: 0,
          }} />
          <div style={{
            position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", zIndex: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat", backgroundSize: "160px",
          }} />

          {/* Left text */}
          <div className="story-intro-text" style={{ position: "relative", zIndex: 2, flex: "0 0 auto", maxWidth: "clamp(260px,38vw,480px)" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: ".6rem",
              marginBottom: "clamp(1rem,2.5vw,1.75rem)",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "none" : "translateY(18px)",
              transition: "all 0.7s cubic-bezier(.16,1,.3,1) 0.1s",
            }}>
              <div style={{ width: 24, height: 1, background: acc }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.52rem,1vw,.65rem)", letterSpacing: ".18em", textTransform: "uppercase", color: acc }}>2022 → 2025</span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem,8vw,8rem)",
              fontWeight: 800, letterSpacing: "-.055em", lineHeight: .87,
              margin: "0 0 clamp(1.25rem,2.5vw,2rem)",
              color: "var(--color-text-primary)",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "none" : "translateY(40px)",
              transition: "all 0.9s cubic-bezier(.16,1,.3,1) 0.22s",
            }}>
              The<br />
              <span style={{ color: "transparent", WebkitTextStroke: `2px ${acc}`, textShadow: `0 0 60px ${acc}44` }}>Story.</span>
            </h2>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(.8rem,1.2vw,.92rem)",
              color: "var(--color-text-muted)", lineHeight: 1.72,
              maxWidth: 390, margin: "0 0 clamp(1.75rem,3.5vw,2.5rem)",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "none" : "translateY(18px)",
              transition: "all 0.8s cubic-bezier(.16,1,.3,1) 0.4s",
            }}>
              From a constituency scholarship to shipping software for the world. Four chapters. Three years. One direction.
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: ".7rem",
              fontFamily: "var(--font-mono)", fontSize: ".5rem",
              letterSpacing: ".13em", textTransform: "uppercase",
              color: "var(--color-text-muted)",
              opacity: mounted ? 0.6 : 0,
              transition: "opacity 0.8s ease 0.62s",
            }}>
              <span>Scroll to read</span>
              <svg width="28" height="14" viewBox="0 0 28 14" fill="none"
                style={{ animation: "arrowBounce 1.6s ease-in-out infinite" }}>
                <path d="M0 7h25M19 1l6 6-6 6" stroke={acc} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Right: image */}
          <div className="intro-img-wrap" style={{
            position: "relative", zIndex: 2,
            flex: "1 1 auto",
            minWidth: "clamp(140px, 35vw, 300px)",
            height: "clamp(280px,62vh,580px)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "none" : "translateY(48px) scale(0.95)",
            transition: "all 1.1s cubic-bezier(.16,1,.3,1) 0.32s",
          }}>
            <div style={{
              width: "100%", height: "100%",
              clipPath: "polygon(6% 0%, 100% 0%, 94% 100%, 0% 100%)",
              position: "relative", overflow: "hidden",
            }}>
              <img
                src="https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=1200&q=85"
                alt="coding at night"
                style={{
                  width: "100%", height: "100%",
                  objectFit: "cover", objectPosition: "center 30%",
                  filter: isDark
                    ? "brightness(0.5) saturate(0.45) contrast(1.15)"
                    : "brightness(0.78) saturate(0.5) contrast(1.05)",
                  animation: "slowZoom 14s ease-in-out infinite alternate",
                }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(135deg, ${acc}2e 0%, #5567F71a 45%, transparent 70%)`,
                mixBlendMode: "screen",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(5,5,18,0.75) 0%, transparent 45%)",
              }} />
            </div>
            <svg style={{ position: "absolute", top: -10, right: -10, opacity: 0.55 }} width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M8 0 L64 0 L64 56" stroke={acc} strokeWidth="1.2" opacity="0.7" />
              <path d="M20 0 L64 0 L64 44" stroke={acc} strokeWidth="0.5" opacity="0.35" />
            </svg>
            <svg style={{ position: "absolute", bottom: -10, left: -10, opacity: 0.55 }} width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M56 64 L0 64 L0 8" stroke={acc} strokeWidth="1.2" opacity="0.7" />
              <path d="M44 64 L0 64 L0 20" stroke={acc} strokeWidth="0.5" opacity="0.35" />
            </svg>
            <div style={{ position: "absolute", bottom: "1.5rem", left: "2rem", pointerEvents: "none" }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem,4.5vw,3.5rem)",
                fontWeight: 800, letterSpacing: "-.05em", lineHeight: 1,
                color: "transparent", WebkitTextStroke: `1.5px ${acc}`,
                textShadow: `0 0 40px ${acc}66`, opacity: 0.65,
              }}>2022–25</div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: ".44rem",
                letterSpacing: ".16em", textTransform: "uppercase",
                color: acc, opacity: 0.5, marginTop: "0.15rem",
              }}>Four chapters</div>
            </div>
          </div>

          <div style={{
            position: "absolute", bottom: "clamp(2rem,4vw,3.5rem)", right: "clamp(2rem,4vw,3.5rem)",
            zIndex: 2, fontFamily: "var(--font-mono)", fontSize: ".46rem",
            letterSpacing: ".12em", color: "var(--color-text-muted)", opacity: .3,
          }}>04 CHAPTERS</div>
        </div>

        {/* Chapter panels */}
        {CHAPTERS.map((ch, i) => (
          <div key={ch.year} className="story-chapter" style={{
            width: "clamp(320px,44vw,580px)", flexShrink: 0, height: "100%",
            display: "flex", alignItems: "center",
            padding: "clamp(5rem,10vw,8rem) clamp(2rem,4vw,3.5rem)",
            borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
            position: "relative",
            background: i % 2 === 0 ? "transparent" : isDark ? "rgba(255,255,255,0.012)" : "rgba(0,0,0,0.012)",
          }}>
            <div style={{
              position: "absolute", bottom: 0, left: "-10%", right: "-10%", height: "45%",
              background: `radial-gradient(ellipse at bottom center, ${ch.accent}0c 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />
            <div className="story-inner" style={{ opacity: 0, width: "100%", position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "clamp(1.5rem,3vw,2.5rem)" }}>
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.6rem,4.5vw,4rem)",
                  fontWeight: 800, letterSpacing: "-.06em", lineHeight: 1,
                  color: "transparent", WebkitTextStroke: `1px ${ch.accent}66`,
                }}>{ch.year}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: ".2rem" }}>
                  <div style={{ width: 24, height: 1, background: ch.accent }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".16em", textTransform: "uppercase", color: ch.accent }}>{ch.label}</span>
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
              <div style={{
                position: "absolute", bottom: "-3.5rem", left: 0,
                width: "clamp(40px,5vw,70px)", height: 2,
                background: `linear-gradient(90deg,${ch.accent},transparent)`,
              }} />
              <div style={{
                position: "absolute", bottom: "-3.5rem", right: 0,
                fontFamily: "var(--font-mono)", fontSize: ".44rem",
                letterSpacing: ".12em", color: ch.accent, opacity: .4,
              }}>{String(i + 1).padStart(2, "0")} / 04</div>
            </div>
          </div>
        ))}

        <div style={{ width: "25vw", flexShrink: 0 }} />
      </div>

      <style>{`
        @keyframes arrowBounce { 0%,100%{transform:translateX(0)} 50%{transform:translateX(7px)} }
        @keyframes nudgeRight  { 0%,100%{transform:translateX(0)} 50%{transform:translateX(4px)} }
        @keyframes slowZoom    { from{transform:scale(1.0)} to{transform:scale(1.07)} }
        @media (max-width: 700px) {
          .story-intro-panel { flex-direction: column !important; justify-content: center !important; padding-top: 5rem !important; padding-bottom: 1.5rem !important; gap: 1.5rem !important; }
          .story-intro-text  { max-width: 100% !important; flex: 0 0 auto !important; }
          .intro-img-wrap    { flex: 0 0 auto !important; width: 100% !important; min-width: unset !important; height: clamp(180px, 40vw, 260px) !important; }
        }
      `}</style>
    </section>
  )
}