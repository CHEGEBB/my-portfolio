"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"

// ─── ICONS ───────────────────────────────────────────────────────────────────
const IconGitHub = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
  </svg>
)
const IconLinkedIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)
const IconTwitter = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
  </svg>
)
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const IconArrow = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

const SOCIALS = [
  { label: "GitHub",   href: "https://github.com/CHEGEBB",      Icon: IconGitHub },
  { label: "LinkedIn", href: "https://linkedin.com/in/chegebb", Icon: IconLinkedIn },
  { label: "Twitter",  href: "https://twitter.com/chegebb",     Icon: IconTwitter },
  { label: "Email",    href: "mailto:chegephil24@gmail.com",     Icon: IconMail },
]

const NAV = [
  { label: "Home",      href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services",  href: "/services" },
  // { label: "Process",   href: "/process" },
  { label: "About",     href: "/about" },
  { label: "Contact",   href: "/contact" },
]

// ─── WAVY SVG DIVIDER ────────────────────────────────────────────────────────
function WaveDivider({ fill, accent }: { fill: string; accent: string }) {
  return (
    <div style={{ position: "relative", lineHeight: 0, overflow: "hidden" }}>
      <svg
        viewBox="0 0 1440 90"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "clamp(48px,6vw,90px)", display: "block" }}
      >
        {/* Second wave layer for depth — same fill, slightly offset path */}
        <path
          d="M0,55 C200,30 400,75 600,50 C800,25 1000,65 1200,42 C1320,30 1390,52 1440,44 L1440,90 L0,90 Z"
          fill={fill}
          opacity="0.45"
        />
        {/* Main fill wave */}
        <path
          d="M0,32 C180,65 360,5 540,38 C720,70 900,10 1080,42 C1260,74 1360,22 1440,48 L1440,90 L0,90 Z"
          fill={fill}
        />
      </svg>
    </div>
  )
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
export function Footer() {
  const { theme }  = useTheme()
  const footerRef  = useRef<HTMLElement>(null)
  const [visible,  setVisible]  = useState(false)
  const [time,     setTime]     = useState("")
  const [hovSoc,   setHovSoc]   = useState<string | null>(null)
  const [hovNav,   setHovNav]   = useState<string | null>(null)

  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent
  const bg     = theme.colors.bg

  // Determine footer background — slightly offset from page bg for depth
  const footerBg = isDark
    ? "rgba(255,255,255,0.025)"   // very faint lighter surface in dark mode
    : "rgba(0,0,0,0.028)"         // very faint darker surface in light mode

  // For wave, we need the actual rendered bg color
  const pageBg = isDark ? "#07070F" : "#F0F0FA"
  const ftBg   = isDark ? "#0e0e18" : "#e9e9f5"

  const year = new Date().getFullYear()

  // Intersection reveal
  useEffect(() => {
    const el = footerRef.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.04 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Live EAT clock
  useEffect(() => {
    const fmt = () => {
      const d   = new Date()
      const hh  = (d.getUTCHours() + 3) % 24
      const mm  = d.getUTCMinutes()
      const ss  = d.getUTCSeconds()
      const ap  = hh >= 12 ? "PM" : "AM"
      const h12 = hh % 12 || 12
      setTime(
        `${String(h12).padStart(2,"0")}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")} ${ap}`
      )
    }
    fmt()
    const id = setInterval(fmt, 1000)
    return () => clearInterval(id)
  }, [])

  // Reveal helper
  const reveal = (delay: number): React.CSSProperties => ({
    opacity:   visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(22px)",
    transition: `opacity .7s ease ${delay}s, transform .75s cubic-bezier(.16,1,.3,1) ${delay}s`,
  })

  return (
    <>
      {/* ── WAVE TRANSITION ── sits above footer, fills from page bg → footer bg */}
      <WaveDivider fill={ftBg} accent={acc} />

      <footer
        ref={footerRef}
        style={{
          position: "relative",
          background: ftBg,
          overflow: "hidden",
        }}
      >
        {/* Faint noise texture overlay */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, opacity: isDark ? 0.025 : 0.018,
          pointerEvents: "none", zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "140px",
        }}/>

        {/* Accent hairline — top center, just a 1px line, no glow blob */}
        <div aria-hidden style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "40%", height: "1px",
          background: `linear-gradient(90deg, transparent, ${acc}44, transparent)`,
          zIndex: 1,
        }}/>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2 }}>

          {/* ── TOP STATUS STRIP ── */}
          <div style={{
            ...reveal(0.15),
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "0.7rem clamp(1.5rem,5vw,4.5rem)",
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
            flexWrap: "wrap", gap: "0.5rem",
          }}>
           

           

            {/* Back to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{
                background: "transparent",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                borderRadius: "9999px",
                padding: "0.28rem 0.9rem",
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(0.46rem,0.64vw,0.56rem)",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--color-text-muted)", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "0.35rem",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.borderColor = acc
                el.style.color = acc
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.borderColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"
                el.style.color = "var(--color-text-muted)"
              }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              Back to top
            </button>
          </div>

          {/* ── MAIN GRID ── */}
          <div className="bc-footer-grid" style={{
            ...reveal(0.28),
            display: "grid",
            padding: "clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4.5rem)",
            gap: "clamp(2.5rem,5vw,3.5rem)",
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
          }}>

            {/* ── COL 1: Identity ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Name / wordmark */}
              <div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem,3.5vw,2.4rem)",
                  fontWeight: 900, letterSpacing: "-0.055em", lineHeight: 0.9,
                  marginBottom: "0.2rem",
                }}>
                  {/* Brian — ghostly outline, theme-aware shadow */}
                  <span style={{
                    color: "transparent",
                    WebkitTextStroke: `1.5px ${isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.22)"}`,
                    textShadow: isDark
                      ? "0 0 28px rgba(255,255,255,0.14), 0 2px 14px rgba(0,0,0,0.7)"
                      : "0 0 24px rgba(0,0,0,0.1), 0 2px 10px rgba(0,0,0,0.18)",
                  }}>Brian</span>
                  {" "}
                  {/* Chege — accent outlined, crisp */}
                  <span style={{
                    color: "transparent",
                    WebkitTextStroke: `1.5px ${acc}`,
                    textShadow: `0 0 18px ${acc}44`,
                  }}>Chege</span>
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(0.48rem,0.72vw,0.6rem)",
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  color: acc, opacity: 0.8,
                }}>
                  Full-Stack Developer · Est. 2022
                </div>
              </div>

              {/* Tagline */}
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.8rem,1.1vw,0.9rem)",
                color: "var(--color-text-muted)", lineHeight: 1.72,
                margin: 0, maxWidth: 260,
              }}>
                Building digital products that solve real problems — from Nairobi, for the world.
              </p>

              {/* Social icons */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {SOCIALS.map(({ label, href, Icon }) => {
                  const isH = hovSoc === label
                  return (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      aria-label={label}
                      onMouseEnter={() => setHovSoc(label)}
                      onMouseLeave={() => setHovSoc(null)}
                      style={{
                        width: 38, height: 38,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: "50%",
                        border: `1px solid ${isH ? acc : isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                        color: isH ? acc : "var(--color-text-muted)",
                        background: isH ? `${acc}14` : "transparent",
                        textDecoration: "none",
                        transform: isH ? "translateY(-4px)" : "none",
                        transition: "all 0.28s cubic-bezier(.16,1,.3,1)",
                        flexShrink: 0,
                      }}
                    >
                      <Icon />
                    </a>
                  )
                })}
              </div>

              {/* CTA button */}
              <Link
                href="/contact"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.78rem,1vw,0.85rem)",
                  fontWeight: 700, letterSpacing: "0.02em",
                  color: isDark ? "#000" : "#fff",
                  background: acc,
                  padding: "0.6rem 1.4rem",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  alignSelf: "flex-start",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  boxShadow: `0 0 24px ${acc}33`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = "translateY(-2px)"
                  el.style.boxShadow = `0 8px 28px ${acc}55`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = ""
                  el.style.boxShadow = `0 0 24px ${acc}33`
                }}
              >
                Start a project
                <IconArrow />
              </Link>
            </div>

            {/* ── COL 2: Navigation ── */}
            <div>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(0.5rem,0.7vw,0.6rem)",
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: acc, marginBottom: "1.25rem", marginTop: 0,
              }}>
                Navigate
              </p>
              <nav style={{ display: "flex", flexDirection: "column", gap: "0.08rem" }}>
                {NAV.map(({ label, href }) => {
                  const isH = hovNav === label
                  return (
                    <Link
                      key={label}
                      href={href}
                      onMouseEnter={() => setHovNav(label)}
                      onMouseLeave={() => setHovNav(null)}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.1rem,2.2vw,1.7rem)",
                        fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.22,
                        color: isH ? acc : "var(--color-text-primary)",
                        textDecoration: "none",
                        display: "flex", alignItems: "center", gap: "0.45rem",
                        paddingLeft: isH ? "0.5rem" : "0",
                        transition: "color 0.2s ease, padding-left 0.28s cubic-bezier(.16,1,.3,1)",
                      }}
                    >
                      {isH && (
                        <span style={{
                          width: 4, height: 4, borderRadius: "50%",
                          background: acc, flexShrink: 0,
                          display: "inline-block",
                        }}/>
                      )}
                      {label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* ── COL 3: Contact + Stack ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Contact block */}
              <div>
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(0.5rem,0.7vw,0.6rem)",
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  color: acc, marginBottom: "1.25rem", marginTop: 0,
                }}>
                  Say hello
                </p>
                <a
                  href="mailto:chegephil24@gmail.com"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(0.9rem,1.8vw,1.35rem)",
                    fontWeight: 800, letterSpacing: "-0.025em",
                    color: "var(--color-text-primary)",
                    textDecoration: "none",
                    display: "block", marginBottom: "1rem",
                    wordBreak: "break-all",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = acc}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)"}
                >
                  chegephil24<br/>@gmail.com
                </a>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.76rem,1vw,0.85rem)",
                  color: "var(--color-text-muted)", lineHeight: 1.72,
                  margin: 0, maxWidth: 240,
                }}>
                  Response within 24 hours. No agency nonsense, just a direct conversation.
                </p>
              </div>

              {/* Stack pills */}
              <div>
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(0.5rem,0.7vw,0.6rem)",
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  color: "var(--color-text-muted)", opacity: 0.6,
                  marginBottom: "0.75rem", marginTop: 0,
                }}>
                  Stack
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                  {["Next.js", "TypeScript", "React", "Node.js", "Flutter", "Prisma"].map(t => (
                    <span
                      key={t}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(0.44rem,0.62vw,0.54rem)",
                        letterSpacing: "0.06em",
                        color: "var(--color-text-muted)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                        padding: "0.18rem 0.55rem",
                        borderRadius: "9999px",
                        transition: "border-color 0.2s ease, color 0.2s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = acc
                        el.style.color = acc
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                        el.style.color = "var(--color-text-muted)"
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM BAR ── */}
          <div style={{
            ...reveal(0.45),
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "0.7rem clamp(1.5rem,5vw,4.5rem)",
            flexWrap: "wrap", gap: "0.5rem",
          }}>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(0.44rem,0.62vw,0.54rem)",
              letterSpacing: "0.08em",
              color: "var(--color-text-muted)", opacity: 0.6,
            }}>
              © {year} Brian Chege · All rights reserved.
            </span>

            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(0.44rem,0.62vw,0.54rem)",
              letterSpacing: "0.08em",
              color: "var(--color-text-muted)", opacity: 0.6,
            }}>
              Crafted with <span style={{ color: acc }}>♥</span> in Nairobi
            </span>
          </div>
        </div>

        {/* ── KEYFRAMES ── */}
        <style jsx global>{`
          .bc-footer-grid {
            grid-template-columns: 1fr;
          }
          @media (min-width: 768px) {
            .bc-footer-grid {
              grid-template-columns: 1.1fr 0.9fr 1fr;
            }
          }
          @keyframes bcPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%       { opacity: 0.35; transform: scale(1.45); }
          }
        `}</style>
      </footer>
    </>
  )
}