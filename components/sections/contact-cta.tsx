"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"

// Sequential — each falls after the previous one lands
const LETTERS = [
  { char: "L", restTilt:  -5 },
  { char: "E", restTilt:   4 },
  { char: "T", restTilt:  -3 },
  { char: "'", restTilt:   9 },
  { char: "S", restTilt:  -4 },
  { char: " ", restTilt:   0 },
  { char: "T", restTilt:   7 },
  { char: "A", restTilt:  -8 },
  { char: "L", restTilt:   4 },
  { char: "K", restTilt:  -3 },
]

// Each letter waits for the previous one — staggered by 350ms each
const STAGGER = 350

function useInView(threshold = 0.04) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

export function ContactCTA() {
  const { theme }                 = useTheme()
  const { ref, inView }           = useInView()
  const [landedCount, setLandedCount] = useState(0)
  const [triggered, setTriggered] = useState(false)
  const [emailHov, setEmailHov]   = useState(false)
  const [ctaHov,   setCtaHov]     = useState(false)
  const sectionRef                = useRef<HTMLDivElement>(null)

  const isDark = theme.mode === "dark"
  const accent = theme.colors.accent
  const radius = { none:"0px", sm:"4px", md:"10px", lg:"18px", full:"9999px" }[theme.radius]

  useEffect(() => {
    if (!inView || triggered) return
    setTriggered(true)

    // Drop one letter at a time, each STAGGER ms after the last
    LETTERS.forEach((_, i) => {
      setTimeout(() => {
        setLandedCount(prev => prev + 1)
      }, i * STAGGER + 300) // 300ms initial pause, then sequential
    })
  }, [inView, triggered])

  const setRef = useCallback((el: HTMLDivElement | null) => {
    ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = el
    ;(sectionRef as React.MutableRefObject<HTMLDivElement | null>).current = el
  }, [ref])

  return (
    <section
      ref={setRef}
      style={{
        position: "relative",
        overflow: "hidden",
        background: isDark ? "#07070F" : "#F0F0FA",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Subtle accent glow */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "70%", height: "40%",
        background: `radial-gradient(ellipse at 50% 0%, ${accent}${isDark ? "16" : "0d"} 0%, transparent 70%)`,
        pointerEvents: "none", zIndex: 0,
      }}/>

      {/* ── TOP INFO ── */}
      <div style={{
        position: "relative", zIndex: 5,
        padding: "clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4.5rem)",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "start",
        gap: "clamp(1.5rem,4vw,4rem)",
      }}>
        {/* Left — label + location */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
            <span style={{ width: 16, height: 1, background: accent, display: "inline-block" }}/>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(.5rem,.7vw,.6rem)",
              letterSpacing: ".16em", textTransform: "uppercase", color: accent,
            }}>Contact</span>
          </div>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(.44rem,.62vw,.54rem)",
            letterSpacing: ".1em", textTransform: "uppercase",
            color: "var(--color-text-muted)", opacity: .45, lineHeight: 1.7,
          }}>Nairobi, Kenya<br/>EAT — UTC+3</div>
        </div>

        {/* Centre — email */}
        <div style={{ paddingTop: ".1rem" }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(.46rem,.66vw,.56rem)",
            letterSpacing: ".12em", textTransform: "uppercase",
            color: "var(--color-text-muted)", opacity: .45, marginBottom: ".55rem",
          }}>Say hello</p>
          <a
            href="mailto:chegephil24@gmail.com"
            onMouseEnter={() => setEmailHov(true)}
            onMouseLeave={() => setEmailHov(false)}
            style={{
              display: "inline-block",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1rem,2.6vw,2.2rem)",
              fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1,
              textDecoration: "none",
              color: emailHov ? accent : "var(--color-text-primary)",
              transition: "color .2s ease",
              wordBreak: "break-all",
            }}
          >chegephil24@gmail.com</a>
        </div>

        {/* Right — CTA + socials */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1.1rem" }}>
          <Link
            href="/contact"
            onMouseEnter={() => setCtaHov(true)}
            onMouseLeave={() => setCtaHov(false)}
            style={{
              display: "inline-flex", alignItems: "center", gap: ".55rem",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(.82rem,1.2vw,.96rem)",
              fontWeight: 700, letterSpacing: "-.01em",
              color: isDark ? "#07070F" : "#F0F0FA",
              background: accent,
              padding: "clamp(.8rem,1.3vw,1rem) clamp(1.5rem,2.5vw,2.25rem)",
              borderRadius: radius, textDecoration: "none",
              boxShadow: ctaHov ? `0 16px 44px ${accent}55` : `0 4px 18px ${accent}33`,
              transform: ctaHov ? "translateY(-3px) scale(1.03)" : "none",
              transition: "all .3s cubic-bezier(.16,1,.3,1)",
              whiteSpace: "nowrap",
            }}
          >
            Start a project
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

          <div style={{ display: "flex", gap: ".5rem" }}>
            {[
              { label: "GH", href: "https://github.com/CHEGEBB" },
              { label: "LI", href: "https://linkedin.com/in/chegebb" },
              { label: "TW", href: "https://twitter.com/chegebb" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{
                  width: "clamp(30px,3vw,36px)", height: "clamp(30px,3vw,36px)",
                  borderRadius: radius,
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-mono)", fontSize: "clamp(.44rem,.58vw,.54rem)",
                  fontWeight: 700, color: "var(--color-text-muted)",
                  textDecoration: "none", transition: "all .2s ease",
                }}
                onMouseOver={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = accent; el.style.color = accent }}
                onMouseOut={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"; el.style.color = "var(--color-text-muted)" }}
              >{s.label}</a>
            ))}
          </div>
        </div>
      </div>

      {/* ── FALLING LETTERS — full height visible, bottom of section ── */}
      <div style={{
        position: "relative",
        zIndex: 4,
        // tall enough to show full letters + give them room to fall into
        height: "clamp(180px, 36vw, 340px)",
        overflow: "hidden",   // letters clip as they enter from top of this box
        marginTop: "auto",
        alignSelf: "stretch",
        display: "flex",
        alignItems: "flex-end",
        paddingLeft: "clamp(.5rem,2vw,2rem)",
        paddingBottom: "clamp(1rem,2.5vw,2.5rem)",
      }}>
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "clamp(.05rem,.3vw,.5rem)",
        }}>
          {LETTERS.map((l, i) => {
            if (l.char === " ") return (
              <div key={i} style={{ width: "clamp(.6rem,2vw,2rem)", flexShrink: 0 }} />
            )

            const isLanded = i < landedCount
            const airTilt = l.restTilt > 0 ? l.restTilt + 34 : l.restTilt - 34

            return (
              <span
                key={i}
                aria-hidden
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "clamp(4.5rem,13vw,12rem)",
                  letterSpacing: "-.04em",
                  lineHeight: .9,
                  color: accent,
                  flexShrink: 0,
                  // Not landed: letter is way above, mid-rotation
                  // Landed: settles at restTilt with spring overshoot
                  transform: isLanded
                    ? `translateY(0px) rotate(${l.restTilt}deg)`
                    : `translateY(-500px) rotate(${airTilt}deg)`,
                  // Slow fall: 0.7s with spring overshoot at landing
                  transition: isLanded
                    ? "transform 0.7s cubic-bezier(0.22, 1.5, 0.36, 1)"
                    : "none",
                  willChange: "transform",
                  userSelect: "none",
                  transformOrigin: "bottom center",
                  filter: isLanded ? `drop-shadow(1px 6px 16px ${accent}40)` : "none",
                }}
              >{l.char}</span>
            )
          })}
        </div>
      </div>

    </section>
  )
}