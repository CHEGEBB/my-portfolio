"use client"

import { useEffect, useRef, useState, useCallback, Suspense } from "react"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

// ─── SVG ICONS ───────────────────────────────────────────────────────────────
const GH = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
  </svg>
)
const LI = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)
const TW = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
  </svg>
)
const ML = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const SOCIALS = [
  { label: "GitHub",   href: "https://github.com/CHEGEBB",      Icon: GH },
  { label: "LinkedIn", href: "https://linkedin.com/in/chegebb", Icon: LI },
  { label: "Twitter",  href: "https://twitter.com/chegebb",     Icon: TW },
  { label: "Email",    href: "mailto:chegephil24@gmail.com",     Icon: ML },
]

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Home",      href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services",  href: "/services" },
  { label: "About",     href: "/about" },
  { label: "Process",   href: "/process" },
  { label: "Contact",   href: "/contact" },
]

const TICKER = [
  "Full-Stack Developer", "Nairobi · Kenya", "Available for hire",
  "React · Next.js · Node.js", "2+ Startups co-founded", "20+ Projects shipped",
  "chegephil24@gmail.com", "Open to collaboration", "TypeScript · Tailwind",
]

// ─── R3F PARTICLE FIELD ──────────────────────────────────────────────────────
function Particles({ color }: { color: string }) {
  const mesh = useRef<THREE.Points>(null)
  const COUNT = 160

  const [positions] = useState(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 22
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return arr
  })

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.elapsedTime
    mesh.current.rotation.y = t * 0.012
    mesh.current.rotation.x = Math.sin(t * 0.008) * 0.06
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={new THREE.Color(color)}
        size={0.045}
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  )
}

// ─── TRAVELLING DOT DIVIDER ───────────────────────────────────────────────────
function TravelDot({ acc, delay = 0 }: { acc: string; delay?: number }) {
  return (
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "100%", pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", left: 0, right: 0,
        height: "6px", top: "calc(50% - 3px)",
      }}>
        <div style={{
          position: "absolute",
          width: 6, height: 6, borderRadius: "50%",
          background: acc,
          boxShadow: `0 0 12px ${acc}, 0 0 24px ${acc}66`,
          animation: `ftDot 3.5s cubic-bezier(.4,0,.2,1) ${delay}s infinite`,
        }}/>
      </div>
    </div>
  )
}

// ─── MAIN FOOTER ─────────────────────────────────────────────────────────────
export function Footer() {
  const { theme }    = useTheme()
  const footerRef    = useRef<HTMLElement>(null)
  const [visible,    setVisible]    = useState(false)
  const [painted,    setPainted]    = useState(false)
  const [mouse,      setMouse]      = useState({ x: 0.5, y: 0.5 })
  const [time,       setTime]       = useState("")
  const [hovSocial,  setHovSocial]  = useState<string | null>(null)
  const [hovNav,     setHovNav]     = useState<string | null>(null)
  const [nameReady,  setNameReady]  = useState(false)

  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent
  const muted  = theme.colors.textMuted
  const prim   = theme.colors.textPrimary
  const border = theme.colors.surfaceBorder
  const bg     = theme.colors.bg
  const year   = new Date().getFullYear()

  // Intersection reveal
  useEffect(() => {
    const el = footerRef.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true)
        setTimeout(() => setPainted(true), 80)
        setTimeout(() => setNameReady(true), 400)
      }
    }, { threshold: 0.03 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // EAT clock
  useEffect(() => {
    const fmt = () => {
      const d  = new Date()
      const hh = (d.getUTCHours() + 3) % 24
      const mm = d.getUTCMinutes()
      const ss = d.getUTCSeconds()
      const ap = hh >= 12 ? "PM" : "AM"
      const h12 = hh % 12 || 12
      setTime(`${String(h12).padStart(2,"0")}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")} ${ap}`)
    }
    fmt()
    const id = setInterval(fmt, 1000)
    return () => clearInterval(id)
  }, [])

  // Mouse parallax
  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = footerRef.current; if (!el) return
    const r  = el.getBoundingClientRect()
    setMouse({
      x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(1, (e.clientY - r.top)  / r.height)),
    })
  }, [])

  useEffect(() => {
    const el = footerRef.current; if (!el) return
    el.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => el.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  const paintFill = isDark ? "#07070F" : "#F6F6FC"
  const gx = (mouse.x * 100).toFixed(1)
  const gy = (mouse.y * 100).toFixed(1)

  // Parallax shift for ghost name
  const nameX = ((mouse.x - 0.5) * -18).toFixed(2)
  const nameY = ((mouse.y - 0.5) * -8).toFixed(2)

  const reveal = (delay: number): React.CSSProperties => ({
    opacity:   visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .7s ease ${delay}s, transform .75s cubic-bezier(.16,1,.3,1) ${delay}s`,
  })

  return (
    <footer
      ref={footerRef}
      style={{
        position: "relative",
        background: bg,
        borderTop: `1px solid ${border}`,
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      {/* ── R3F PARTICLE LAYER ── */}
      <div style={{
        position: "absolute", inset: 0,
        zIndex: 0, pointerEvents: "none",
        opacity: visible ? 0.6 : 0,
        transition: "opacity 1.5s ease",
      }}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          gl={{ antialias: false, alpha: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <Suspense fallback={null}>
            <Particles color={acc} />
          </Suspense>
        </Canvas>
      </div>

      {/* ── GHOST NAME BACKGROUND ── */}
      {/* Massive outline text that sits behind everything like a watermark */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-8%",
          left: "50%",
          transform: `translate(calc(-50% + ${nameX}px), ${nameY}px)`,
          zIndex: 1,
          pointerEvents: "none",
          whiteSpace: "nowrap",
          userSelect: "none",
          transition: "transform .08s ease",
          opacity: nameReady ? 1 : 0,
          transitionProperty: "opacity, transform",
          transitionDuration: "1.2s, .08s",
          transitionTimingFunction: "ease, ease",
        }}
      >
        {/* BRIAN */}
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(8rem,18vw,22rem)",
          fontWeight: 900,
          letterSpacing: "-.06em",
          lineHeight: 0.82,
          color: "transparent",
          WebkitTextStroke: `1px ${isDark ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.045)"}`,
          display: "block",
        }}>BRIAN</div>
        {/* CHEGE — accent tinted but still ghostly */}
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(8rem,18vw,22rem)",
          fontWeight: 900,
          letterSpacing: "-.06em",
          lineHeight: 0.82,
          color: "transparent",
          WebkitTextStroke: `1px ${acc}${isDark ? "22" : "18"}`,
          display: "block",
          textShadow: `0 0 120px ${acc}${isDark ? "18" : "10"}`,
        }}>CHEGE</div>
      </div>

      {/* ── AMBIENT MOUSE GLOW ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: `radial-gradient(ellipse 55% 65% at ${gx}% ${gy}%, ${acc}${isDark ? "10" : "09"} 0%, transparent 65%)`,
        transition: "background .1s ease",
      }}/>

      {/* ── PAINT WIPE ── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 8, pointerEvents: "none",
        background: paintFill,
        transform: painted ? "translateY(105%)" : "translateY(0%)",
        transition: painted ? "transform .9s cubic-bezier(.86,0,.07,1)" : "none",
        willChange: "transform",
      }}>
        <div style={{
          position: "absolute", top: -52, left: 0, right: 0, height: 104,
          background: paintFill,
          clipPath: "polygon(0 0,4% 55%,10% 100%,18% 45%,26% 90%,34% 38%,42% 95%,50% 48%,58% 94%,66% 42%,74% 88%,82% 40%,90% 95%,96% 52%,100% 0)",
        }}/>
      </div>
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none",
        background: paintFill, opacity: .4,
        transform: painted ? "translateY(105%)" : "translateY(0%)",
        transition: painted ? "transform 1.1s cubic-bezier(.86,0,.07,1) .06s" : "none",
        willChange: "transform",
      }}/>

      {/* ── CONTENT LAYER ── */}
      <div style={{ position: "relative", zIndex: 9, opacity: visible ? 1 : 0, transition: "opacity .4s ease .2s" }}>

        {/* ── TOP STATUS BAR ── */}
        <div style={{
          ...reveal(.25),
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: ".55rem clamp(1.5rem,5vw,4rem)",
          borderBottom: `1px solid ${border}`,
          gap: "1rem", flexWrap: "wrap",
        }}>
          {/* Live clock */}
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
            <span style={{
              display: "inline-block", width: 7, height: 7, borderRadius: "50%",
              background: "#22c55e", boxShadow: "0 0 8px #22c55e", flexShrink: 0,
              animation: "ftPulse 2s ease-in-out infinite",
            }}/>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.48rem,.68vw,.58rem)", letterSpacing: ".12em", textTransform: "uppercase", color: muted }}>
              {time} EAT
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.48rem,.68vw,.58rem)", letterSpacing: ".12em", textTransform: "uppercase", color: muted }}>
            Nairobi, Kenya · UTC+3
          </span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              background: "transparent", border: `1px solid ${border}`,
              borderRadius: "9999px",
              padding: ".28rem .9rem",
              fontFamily: "var(--font-mono)", fontSize: "clamp(.46rem,.64vw,.56rem)",
              letterSpacing: ".1em", textTransform: "uppercase",
              color: muted, cursor: "pointer",
              display: "flex", alignItems: "center", gap: ".35rem",
              transition: "all .2s ease",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = acc; el.style.color = acc }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = border; el.style.color = muted }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
            Back to top
          </button>
        </div>

        {/* ── MASTHEAD AREA ── */}
        <div style={{
          ...reveal(.38),
          padding: "clamp(2.5rem,5vw,4.5rem) clamp(1.5rem,5vw,4rem) clamp(1.5rem,3vw,2.5rem)",
          borderBottom: `1px solid ${border}`,
        }}>
          {/* Kicker line */}
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "clamp(1rem,2vw,1.5rem)" }}>
            <div style={{ width: "clamp(20px,2.5vw,36px)", height: 1, background: acc, flexShrink: 0 }}/>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.5rem,.7vw,.62rem)", letterSpacing: ".18em", textTransform: "uppercase", color: acc }}>
              Est. 2022 · Full-Stack Developer & Co-Founder
            </span>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${border}, transparent)` }}/>
          </div>

          {/* CTA + social row */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem" }}>
            <div>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(.9rem,1.5vw,1.1rem)",
                color: muted, lineHeight: 1.72, margin: "0 0 1.5rem",
                maxWidth: 400, fontStyle: "italic",
              }}>
                "Building the future, one commit at a time."
              </p>
              <Link href="/contact" style={{
                display: "inline-flex", alignItems: "center", gap: ".5rem",
                fontFamily: "var(--font-body)", fontSize: "clamp(.8rem,1.1vw,.875rem)",
                fontWeight: 700, letterSpacing: ".04em",
                color: isDark ? "#000" : "#fff", background: acc,
                padding: ".65rem 1.75rem", borderRadius: "9999px",
                textDecoration: "none",
                boxShadow: `0 0 30px ${acc}44`,
                transition: "transform .2s ease, box-shadow .2s ease",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = `0 8px 32px ${acc}66` }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = `0 0 30px ${acc}44` }}
              >
                Start a project
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>

            {/* Social icons */}
            <div style={{ display: "flex", gap: ".625rem" }}>
              {SOCIALS.map(({ label, href, Icon }) => {
                const isH = hovSocial === label
                return (
                  <a key={label} href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={label}
                    onMouseEnter={() => setHovSocial(label)}
                    onMouseLeave={() => setHovSocial(null)}
                    style={{
                      width: "clamp(40px,4vw,48px)", height: "clamp(40px,4vw,48px)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "50%",
                      border: `1px solid ${isH ? acc : border}`,
                      color: isH ? acc : muted,
                      background: isH ? `${acc}14` : "transparent",
                      textDecoration: "none",
                      transform: isH ? "translateY(-5px) rotate(-8deg)" : "none",
                      boxShadow: isH ? `0 10px 28px ${acc}33` : "none",
                      transition: "all .3s cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    <Icon/>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── INFO GRID ── */}
        <div className="ft-grid" style={{
          display: "grid",
          borderBottom: `1px solid ${border}`,
          ...reveal(.5),
        }}>

          {/* Col A — Nav */}
          <div style={{ padding: "clamp(1.75rem,3.5vw,3rem) clamp(1.5rem,5vw,4rem)", borderRight: `1px solid ${border}` }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.5rem,.7vw,.6rem)", letterSpacing: ".16em", textTransform: "uppercase", color: acc, marginBottom: "1.5rem" }}>
              Navigate
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: ".05rem" }}>
              {NAV_LINKS.map(({ label, href }) => {
                const isH = hovNav === label
                return (
                  <Link key={label} href={href}
                    onMouseEnter={() => setHovNav(label)}
                    onMouseLeave={() => setHovNav(null)}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.15rem,2.4vw,1.9rem)",
                      fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.18,
                      color: isH ? acc : prim,
                      textDecoration: "none",
                      display: "flex", alignItems: "center", gap: ".5rem",
                      transform: isH ? "translateX(10px)" : "none",
                      transition: "color .2s ease, transform .28s cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    {isH && <span style={{ width: 4, height: 4, borderRadius: "50%", background: acc, display: "inline-block", flexShrink: 0 }}/>}
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Col B — Status + stats */}
          <div style={{
            padding: "clamp(1.75rem,3.5vw,3rem) clamp(1.5rem,4vw,3rem)",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            borderRight: `1px solid ${border}`,
          }}>
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.5rem,.7vw,.6rem)", letterSpacing: ".16em", textTransform: "uppercase", color: acc, marginBottom: "1.5rem" }}>
                Status
              </p>
              <div style={{ display: "flex", alignItems: "flex-start", gap: ".75rem", marginBottom: "2rem" }}>
                <span style={{
                  display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                  background: "#22c55e", boxShadow: "0 0 10px #22c55e",
                  flexShrink: 0, marginTop: ".4rem",
                  animation: "ftPulse 2s ease-in-out infinite",
                }}/>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem,2.2vw,1.75rem)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.1, color: prim }}>
                    Available for hire
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.5rem,.7vw,.6rem)", color: muted, marginTop: ".3rem", letterSpacing: ".06em" }}>
                    Freelance · Full-time · Co-founder
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: "clamp(1.25rem,2.5vw,2.5rem)", flexWrap: "wrap" }}>
                {[["20+", "Projects"], ["3+", "Years"], ["7+", "Clients"]].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem,3.5vw,2.8rem)", fontWeight: 900, letterSpacing: "-.04em", color: acc, lineHeight: 1 }}>{v}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.46rem,.62vw,.56rem)", letterSpacing: ".1em", textTransform: "uppercase", color: muted, marginTop: ".15rem" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Col C — Contact */}
          <div style={{ padding: "clamp(1.75rem,3.5vw,3rem) clamp(1.5rem,5vw,4rem)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.5rem,.7vw,.6rem)", letterSpacing: ".16em", textTransform: "uppercase", color: acc, marginBottom: "1.5rem" }}>
                Say hello
              </p>
              <a href="mailto:chegephil24@gmail.com" style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(.9rem,2vw,1.5rem)",
                fontWeight: 800, letterSpacing: "-.02em", color: prim,
                textDecoration: "none", display: "block", marginBottom: "1.25rem",
                wordBreak: "break-all", transition: "color .2s ease",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = acc}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = prim}
              >
                chegephil24<br/>@gmail.com
              </a>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(.78rem,1.1vw,.875rem)", color: muted, lineHeight: 1.72, margin: "0 0 1.75rem", maxWidth: 260 }}>
                Full-Stack Developer based in Nairobi. Building digital products that solve real problems.
              </p>
            </div>

            {/* Stack badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem" }}>
              {["Next.js", "TypeScript", "React", "Node.js", "Vercel", "Prisma"].map(t => (
                <span key={t} style={{
                  fontFamily: "var(--font-mono)", fontSize: "clamp(.44rem,.6vw,.54rem)",
                  letterSpacing: ".06em", color: muted,
                  border: `1px solid ${border}`,
                  padding: ".18rem .55rem", borderRadius: "9999px",
                  transition: "border-color .2s ease, color .2s ease",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = acc; el.style.color = acc }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = border; el.style.color = muted }}
                >{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── INFINITE TICKER ── */}
        <div style={{
          borderBottom: `1px solid ${border}`,
          overflow: "hidden", whiteSpace: "nowrap",
          background: isDark ? "rgba(255,255,255,0.016)" : "rgba(0,0,0,0.016)",
          position: "relative",
        }}>
          {/* Fade edges */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "6rem", background: `linear-gradient(to right, ${bg}, transparent)`, zIndex: 2, pointerEvents: "none" }}/>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "6rem", background: `linear-gradient(to left, ${bg}, transparent)`, zIndex: 2, pointerEvents: "none" }}/>

          <div style={{ display: "inline-flex", animation: "ftTicker 28s linear infinite" }}>
            {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((item, i) => (
              <span key={i} style={{
                display: "inline-flex", alignItems: "center", gap: "1rem",
                padding: ".6rem clamp(1.5rem,2.5vw,2.5rem)",
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(.5rem,.72vw,.62rem)",
                letterSpacing: ".12em", textTransform: "uppercase",
                color: i % 5 === 0 ? acc : muted,
              }}>
                {item}
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: acc, opacity: .45, flexShrink: 0 }}/>
              </span>
            ))}
          </div>

          {/* Second ticker reverse — subtle counter-flow */}
          <div style={{ display: "inline-flex", animation: "ftTickerRev 40s linear infinite", position: "absolute", bottom: 0, left: 0, opacity: .25 }}>
            {[...TICKER, ...TICKER, ...TICKER].map((item, i) => (
              <span key={i} style={{
                display: "inline-flex", alignItems: "center", gap: "1rem",
                padding: ".3rem clamp(1.5rem,2.5vw,2.5rem)",
                fontFamily: "var(--font-mono)", fontSize: "clamp(.42rem,.6vw,.52rem)",
                letterSpacing: ".14em", textTransform: "uppercase", color: acc,
              }}>
                {item}
                <span style={{ width: 2, height: 2, borderRadius: "50%", background: acc, flexShrink: 0 }}/>
              </span>
            ))}
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: ".65rem clamp(1.5rem,5vw,4rem)",
          flexWrap: "wrap", gap: ".5rem",
          opacity: visible ? 1 : 0, transition: "opacity .7s ease 1s",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.44rem,.62vw,.54rem)", letterSpacing: ".08em", color: muted }}>
            © {year} Brian Chege · All rights reserved.
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
            {NAV_LINKS.map(({ label, href }, i, arr) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <Link href={href} style={{
                  fontFamily: "var(--font-mono)", fontSize: "clamp(.44rem,.62vw,.54rem)",
                  letterSpacing: ".1em", textTransform: "uppercase",
                  color: muted, textDecoration: "none",
                  transition: "color .18s ease",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = prim}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = muted}
                >{label}</Link>
                {i < arr.length - 1 && <span style={{ width: 2, height: 2, borderRadius: "50%", background: border, display: "inline-block" }}/>}
              </div>
            ))}
          </div>

          <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.44rem,.62vw,.54rem)", letterSpacing: ".06em", color: muted }}>
            Crafted with <span style={{ color: acc }}>♥</span> in Nairobi
          </span>
        </div>
      </div>

      {/* ── ALL KEYFRAMES ── */}
      <style jsx global>{`
        .ft-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 820px) {
          .ft-grid {
            grid-template-columns: 1.1fr 1fr 1fr;
          }
        }

        @keyframes ftPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: .35; transform: scale(1.4); }
        }
        @keyframes ftTicker {
          from { transform: translateX(0); }
          to   { transform: translateX(-25%); }
        }
        @keyframes ftTickerRev {
          from { transform: translateX(-25%); }
          to   { transform: translateX(0); }
        }
        @keyframes ftDot {
          0%   { left: -1%; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: 101%; opacity: 0; }
        }
      `}</style>
    </footer>
  )
}