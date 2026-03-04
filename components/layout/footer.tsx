"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"

const NAV = [
  { label: "Home",    href: "/"         },
  { label: "Work",    href: "/projects" },
  { label: "About",   href: "/#about"   },
  { label: "Skills",  href: "/#skills"  },
  { label: "Contact", href: "/contact"  },
]

const SOCIALS = [
  {
    label: "GitHub", href: "https://github.com/CHEGEBB",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>,
  },
  {
    label: "LinkedIn", href: "https://linkedin.com/in/chegebb",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  },
  {
    label: "Twitter", href: "https://twitter.com/chegebb",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>,
  },
]

export function Footer() {
  const { theme }             = useTheme()
  const ref                   = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [painted, setPainted] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const isDark                = theme.mode === "dark"

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true)
        setTimeout(() => setPainted(true), 150)
      }
    }, { threshold: 0.05 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const acc    = theme.colors.accent
  const muted  = theme.colors.textMuted
  const prim   = theme.colors.textPrimary
  const border = theme.colors.surfaceBorder
  const bg     = theme.colors.bg
  const year   = new Date().getFullYear()

  const paintFill = isDark
    ? `color-mix(in srgb, ${acc} 20%, #0C0C18)`
    : `color-mix(in srgb, ${acc} 13%, #EAEAF4)`

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity .7s ease ${delay}s, transform .75s cubic-bezier(.16,1,.3,1) ${delay}s`,
  })

  return (
    <footer
      ref={ref}
      style={{ position: "relative", background: bg, borderTop: `1px solid ${border}`, overflow: "hidden" }}
    >
      {/* ── Paint wipe — sweeps UP from bottom ── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: paintFill,
        transform: painted ? "translateY(105%)" : "translateY(0%)",
        transition: painted ? "transform 1s cubic-bezier(.86,0,.07,1)" : "none",
        willChange: "transform",
      }}>
        <div style={{
          position: "absolute", top: -38, left: 0, right: 0, height: 76,
          background: paintFill,
          clipPath: "polygon(0 0,4% 55%,10% 100%,18% 45%,26% 90%,34% 38%,42% 95%,50% 48%,58% 94%,66% 42%,74% 88%,82% 40%,90% 95%,96% 52%,100% 0)",
        }}/>
      </div>
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: paintFill, opacity: .4,
        transform: painted ? "translateY(105%)" : "translateY(0%)",
        transition: painted ? "transform 1.15s cubic-bezier(.86,0,.07,1) .07s" : "none",
        willChange: "transform",
      }}/>

      {/* ── Ghost watermark — slow infinite float ── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 2,
        pointerEvents: "none", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(9rem,24vw,24rem)",
          fontWeight: 900, letterSpacing: "-.06em",
          color: "transparent",
          WebkitTextStroke: `1px ${acc}`,
          opacity: isDark ? .05 : .065,
          whiteSpace: "nowrap",
          userSelect: "none",
          animation: "ghostFloat 9s ease-in-out infinite",
          willChange: "transform",
        }}>
          CHEGEBB
        </div>
      </div>

      {/* ── Infinite flowing accent line at top ── */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "2px", zIndex: 3, pointerEvents: "none",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: "-100%",
          width: "200%", height: "100%",
          background: `linear-gradient(to right, transparent 0%, ${acc}00 20%, ${acc} 40%, ${acc}EE 50%, ${acc} 60%, ${acc}00 80%, transparent 100%)`,
          animation: "lineFlow 4s linear infinite",
        }}/>
      </div>

      {/* ── Main content ── */}
      <div style={{
        position: "relative", zIndex: 4,
        maxWidth: 1280, margin: "0 auto",
        padding: "clamp(4rem,7vw,5.5rem) clamp(1rem,4vw,3rem) clamp(2rem,3.5vw,2.5rem)",
        opacity: visible ? 1 : 0,
        transition: "opacity .4s ease .35s",
      }}>

        {/* Big tagline */}
        <div style={{ ...fadeUp(.4), marginBottom: "clamp(3rem,5vw,4.5rem)" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.75rem,4.5vw,3.5rem)",
            fontWeight: 800, letterSpacing: "-.04em", lineHeight: 1.05,
            color: prim, margin: 0,
          }}>
            Building the future,{" "}
            <span style={{ color: acc }}>one commit</span> at a time.
          </h2>
        </div>

        {/* 3-col grid */}
        <div className="ft-grid" style={{
          display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr",
          gap: "clamp(2rem,5vw,6rem)",
          paddingBottom: "clamp(3rem,5vw,4rem)",
          borderBottom: `1px solid ${border}`,
        }}>

          {/* About blurb + availability */}
          <div style={fadeUp(.5)}>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(.8rem,1.25vw,.9375rem)",
              color: muted, lineHeight: 1.75, maxWidth: 320, marginBottom: "2rem",
            }}>
              Full Stack Developer & Co-Founder based in Eldoret, Kenya. Open to freelance,
              full-time roles, and interesting collaborations.
            </p>

            {/* Availability badge — subtle pulse */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: ".5rem",
              border: `1px solid ${border}`,
              padding: ".5rem 1rem",
              background: isDark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.03)",
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%", background: "#22c55e",
                display: "inline-block", flexShrink: 0,
                animation: "avail 2.2s ease-in-out infinite",
              }}/>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.58rem,.8vw,.68rem)", color: muted, letterSpacing: ".06em" }}>
                Available for new projects
              </span>
            </div>
          </div>

          {/* Nav */}
          <div style={fadeUp(.6)}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.52rem,.78vw,.62rem)", letterSpacing: ".14em", textTransform: "uppercase", color: acc, marginBottom: "1.25rem" }}>Pages</p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {NAV.map(item => (
                <Link key={item.label} href={item.href} style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(.875rem,1.3vw,.9375rem)",
                  color: muted, textDecoration: "none",
                  padding: ".35rem 0", display: "block",
                  transition: "color .18s ease, transform .2s ease",
                  letterSpacing: "-.01em",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = prim; el.style.transform = "translateX(6px)" }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = muted; el.style.transform = "" }}
                >{item.label}</Link>
              ))}
            </div>
          </div>

          {/* Socials with icons */}
          <div style={fadeUp(.7)}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.52rem,.78vw,.62rem)", letterSpacing: ".14em", textTransform: "uppercase", color: acc, marginBottom: "1.25rem" }}>Connect</p>
            <div style={{ display: "flex", flexDirection: "column", gap: ".2rem" }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: ".625rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(.875rem,1.3vw,.9375rem)",
                    color: hovered === s.label ? prim : muted,
                    textDecoration: "none", padding: ".35rem 0",
                    transition: "color .18s ease",
                    letterSpacing: "-.01em",
                  }}
                  onMouseEnter={() => setHovered(s.label)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span style={{
                    color: hovered === s.label ? acc : muted,
                    display: "flex", flexShrink: 0,
                    transition: "color .18s ease, transform .22s cubic-bezier(.16,1,.3,1)",
                    transform: hovered === s.label ? "translateY(-3px) rotate(-5deg)" : "none",
                  }}>{s.icon}</span>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: "clamp(1.25rem,2vw,1.75rem)",
          flexWrap: "wrap", gap: ".75rem",
          opacity: visible ? 1 : 0, transition: "opacity .6s ease .85s",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.5rem,.72vw,.62rem)", color: muted, letterSpacing: ".05em" }}>
            © {year} Brian Chege · All rights reserved.
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.5rem,.72vw,.62rem)", color: muted, letterSpacing: ".05em" }}>
            Next.js · TypeScript · Vercel
          </span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{
            background: "transparent", border: `1px solid ${border}`,
            padding: ".375rem .875rem",
            fontFamily: "var(--font-mono)", fontSize: "clamp(.5rem,.72vw,.62rem)",
            letterSpacing: ".08em", textTransform: "uppercase",
            color: muted, cursor: "pointer",
            display: "flex", alignItems: "center", gap: ".4rem",
            transition: "all .18s ease",
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = acc; el.style.color = acc }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = border; el.style.color = muted }}
          >
            Back to top
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ghostFloat { 0%,100%{transform:translateY(0) translateX(0)} 40%{transform:translateY(-6%) translateX(.8%)} 70%{transform:translateY(4%) translateX(-.5%)} }
        @keyframes lineFlow   { from{transform:translateX(0)} to{transform:translateX(50%)} }
        @keyframes avail      { 0%,100%{box-shadow:0 0 0 0 #22c55e55} 60%{box-shadow:0 0 0 7px transparent} }
        @media(max-width:780px){ .ft-grid{ grid-template-columns:1fr 1fr !important; } }
        @media(max-width:500px){ .ft-grid{ grid-template-columns:1fr !important; } }
      `}</style>
    </footer>
  )
}