"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"

// ─── FULL SVG SOCIAL ICONS ────────────────────────────────────────────────────
const GH = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
  </svg>
)
const LI = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)
const TW = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
  </svg>
)
const ML = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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

const NAV_LEFT  = ["Home", "Work", "About"]
const NAV_RIGHT = ["Skills", "Contact"]
const NAV_HREFS: Record<string,string> = {
  Home: "/", Work: "/projects", About: "/#about",
  Skills: "/#skills", Contact: "/contact",
}

// Ticker items
const TICKER_ITEMS = [
  "Full-Stack Developer",
  "Nairobi, Kenya",
  "Available for hire",
  "React · Next.js · Node.js",
  "2+ Startups co-founded",
  "20+ Projects shipped",
  "chegephil24@gmail.com",
  "Open to collaboration",
]

export function Footer() {
  const { theme }              = useTheme()
  const footerRef              = useRef<HTMLElement>(null)
  const [visible,  setVisible] = useState(false)
  const [painted,  setPainted] = useState(false)
  const [mouse,    setMouse]   = useState({ x: 0.5, y: 0.5 })
  const [time,     setTime]    = useState("")
  const [hovSocial,setHovSocial] = useState<string|null>(null)
  const [hovNav,   setHovNav]  = useState<string|null>(null)
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent
  const muted  = theme.colors.textMuted
  const prim   = theme.colors.textPrimary
  const border = theme.colors.surfaceBorder
  const bg     = theme.colors.bg
  const radius = { none:"0px", sm:"4px", md:"10px", lg:"18px", full:"9999px" }[theme.radius]
  const year   = new Date().getFullYear()

  // Reveal
  useEffect(() => {
    const el = footerRef.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true)
        setTimeout(() => setPainted(true), 100)
      }
    }, { threshold: 0.04 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Live EAT clock
  useEffect(() => {
    const fmt = () => {
      const d  = new Date()
      const hh = (d.getUTCHours() + 3) % 24
      const mm = d.getUTCMinutes()
      const ss = d.getUTCSeconds()
      const ap = hh >= 12 ? "PM" : "AM"
      const h12= hh % 12 || 12
      setTime(`${String(h12).padStart(2,"0")}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")} ${ap} EAT`)
    }
    fmt(); const id = setInterval(fmt, 1000); return () => clearInterval(id)
  }, [])

  // Mouse tracking
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

  // Staggered reveal helper
  const reveal = (delay: number): React.CSSProperties => ({
    opacity:   visible ? 1 : 0,
    transform: visible ? "none" : "translateY(22px)",
    transition:`opacity .65s ease ${delay}s, transform .65s cubic-bezier(.16,1,.3,1) ${delay}s`,
  })

  return (
    <footer
      ref={footerRef}
      style={{
        position: "relative",
        background: bg,
        borderTop: `1px solid ${border}`,
        overflow: "hidden",
      }}
    >
      {/* Ambient mouse glow */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
        background:`radial-gradient(ellipse 60% 70% at ${gx}% ${gy}%, ${acc}${isDark?"0D":"08"} 0%, transparent 65%)`,
        transition:"background .12s ease",
      }}/>

      {/* Paint wipe — sweeps upward */}
      <div aria-hidden style={{
        position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
        background:paintFill,
        transform: painted ? "translateY(105%)" : "translateY(0%)",
        transition: painted ? "transform .9s cubic-bezier(.86,0,.07,1)" : "none",
        willChange:"transform",
      }}>
        <div style={{
          position:"absolute", top:-52, left:0, right:0, height:104,
          background:paintFill,
          clipPath:"polygon(0 0,4% 55%,10% 100%,18% 45%,26% 90%,34% 38%,42% 95%,50% 48%,58% 94%,66% 42%,74% 88%,82% 40%,90% 95%,96% 52%,100% 0)",
        }}/>
      </div>
      <div aria-hidden style={{
        position:"absolute", inset:0, zIndex:1, pointerEvents:"none",
        background:paintFill, opacity:.4,
        transform: painted ? "translateY(105%)" : "translateY(0%)",
        transition: painted ? "transform 1.1s cubic-bezier(.86,0,.07,1) .06s" : "none",
        willChange:"transform",
      }}/>

      {/* ─── CONTENT ─────────────────────────────────────────── */}
      <div style={{ position:"relative", zIndex:4, opacity:visible?1:0, transition:"opacity .4s ease .25s" }}>

        {/* ── DATELINE STRIP ── */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:".6rem clamp(1.5rem,5vw,4rem)",
          borderBottom:`1px solid ${border}`,
          gap:"1rem", flexWrap:"wrap",
          ...reveal(.35),
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:".625rem" }}>
            <div style={{
              width:7, height:7, borderRadius:"50%", background:"#22c55e",
              boxShadow:"0 0 8px #22c55e", flexShrink:0,
              animation:"ftPulse 2s ease-in-out infinite",
            }}/>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(.48rem,.68vw,.58rem)", letterSpacing:".12em", textTransform:"uppercase", color:muted }}>
              {time}
            </span>
          </div>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(.48rem,.68vw,.58rem)", letterSpacing:".12em", textTransform:"uppercase", color:muted }}>
            Nairobi, Kenya · EAT (UTC+3)
          </span>
          <button
            onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
            style={{
              background:"transparent", border:`1px solid ${border}`, borderRadius:radius,
              padding:".28rem .75rem", fontFamily:"var(--font-mono)",
              fontSize:"clamp(.46rem,.64vw,.56rem)", letterSpacing:".1em", textTransform:"uppercase",
              color:muted, cursor:"pointer", display:"flex", alignItems:"center", gap:".3rem",
              transition:"all .18s ease",
            }}
            onMouseOver={e=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor=acc; el.style.color=acc }}
            onMouseOut={e=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor=border; el.style.color=muted }}
          >
            ↑ Top
          </button>
        </div>

        {/* ── NEWSPAPER MASTHEAD ── */}
        <div style={{
          padding:"clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4rem) 0",
          borderBottom:`1px solid ${border}`,
          ...reveal(.42),
        }}>
          {/* Kicker */}
          <div style={{
            display:"flex", alignItems:"center", gap:".75rem",
            marginBottom:".625rem",
          }}>
            <div style={{ height:1, width:"clamp(24px,3vw,40px)", background:acc }}/>
            <span style={{
              fontFamily:"var(--font-mono)", fontSize:"clamp(.52rem,.72vw,.62rem)",
              letterSpacing:".18em", textTransform:"uppercase", color:acc,
            }}>Est. 2022 · Full-Stack Developer</span>
            <div style={{ height:1, flex:1, background:`linear-gradient(90deg,${border},transparent)` }}/>
          </div>

          {/* BRIAN CHEGE — full bleed masthead */}
          <div style={{ overflow:"hidden", lineHeight:.85 }}>
            <h2 style={{
              fontFamily:"var(--font-display)",
              fontSize:"clamp(3rem,8vw,13rem)",
              fontWeight:900, letterSpacing:"-.05em",
              color:"transparent",
              WebkitTextStroke:`1.5px ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
              margin:0, lineHeight:.85,
              whiteSpace:"nowrap",
              transform:visible?"translateY(0)":"translateY(100%)",
              transition:"transform .85s cubic-bezier(.16,1,.3,1) .55s",
              willChange:"transform",
              userSelect:"none",
            }}>
              BRIAN
              <span style={{
                color:acc,
                WebkitTextStroke:"0px",
                marginLeft:".25em",
              }}>CHEGE</span>
            </h2>
          </div>

          {/* Tagline sits just below and overlaps */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"clamp(.875rem,1.5vw,1.25rem) 0 clamp(1.25rem,2vw,2rem)",
            flexWrap:"wrap", gap:".75rem",
          }}>
            <p style={{
              fontFamily:"var(--font-body)",
              fontSize:"clamp(.85rem,1.4vw,1rem)",
              color:muted, margin:0, lineHeight:1.6, maxWidth:420,
              fontStyle:"italic",
            }}>
              "Building the future, one commit at a time."
            </p>

            {/* Social icons — full SVG, theme-aware */}
            <div style={{ display:"flex", gap:"clamp(.5rem,1vw,1rem)", alignItems:"center" }}>
              {SOCIALS.map(({ label, href, Icon }) => {
                const isHov = hovSocial === label
                return (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={label}
                    onMouseEnter={() => setHovSocial(label)}
                    onMouseLeave={() => setHovSocial(null)}
                    style={{
                      width:"clamp(38px,4vw,46px)", height:"clamp(38px,4vw,46px)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      borderRadius:radius,
                      border:`1px solid ${isHov ? acc : border}`,
                      color: isHov ? acc : muted,
                      background: isHov ? `${acc}12` : "transparent",
                      textDecoration:"none",
                      transform: isHov ? "translateY(-4px) rotate(-6deg)" : "none",
                      boxShadow: isHov ? `0 8px 24px ${acc}30` : "none",
                      transition:"all .28s cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    <Icon/>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── THREE-COLUMN INFO BAND ── */}
        {/*
          Column A: nav links stacked
          Column B: accent divider line + "available" statement
          Column C: contact blurb + copyright
        */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"1fr 2px 1fr 2px 1fr",
          borderBottom:`1px solid ${border}`,
          ...reveal(.6),
        }}
        className="ft-info-grid"
        >
          {/* Col A — Navigation */}
          <div style={{ padding:"clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,5vw,4rem)" }}>
            <p style={{
              fontFamily:"var(--font-mono)", fontSize:"clamp(.5rem,.7vw,.6rem)",
              letterSpacing:".16em", textTransform:"uppercase",
              color:acc, marginBottom:"1.25rem",
            }}>Pages</p>
            <div style={{ display:"flex", flexDirection:"column", gap:".1rem" }}>
              {[...NAV_LEFT, ...NAV_RIGHT].map(label => {
                const isH = hovNav === label
                return (
                  <Link key={label} href={NAV_HREFS[label]}
                    onMouseEnter={()=>setHovNav(label)}
                    onMouseLeave={()=>setHovNav(null)}
                    style={{
                      fontFamily:"var(--font-display)",
                      fontSize:"clamp(1.1rem,2.2vw,1.75rem)",
                      fontWeight:800, letterSpacing:"-.02em", lineHeight:1.15,
                      color: isH ? acc : prim,
                      textDecoration:"none",
                      display:"flex", alignItems:"center", gap:".4rem",
                      transform: isH ? "translateX(8px)" : "none",
                      transition:"color .18s ease, transform .25s cubic-bezier(.16,1,.3,1)",
                    }}
                  >
                    {isH && (
                      <span style={{ width:5, height:5, borderRadius:"50%", background:acc, flexShrink:0, display:"inline-block" }}/>
                    )}
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Divider A */}
          <div style={{ background:border, position:"relative" }}>
            {/* Animated accent dot that travels down the divider */}
            {visible && (
              <div style={{
                position:"absolute", left:"50%", transform:"translateX(-50%)",
                width:6, height:6, borderRadius:"50%", background:acc,
                boxShadow:`0 0 10px ${acc}`,
                animation:"ftDotTravel 4s ease-in-out infinite",
              }}/>
            )}
          </div>

          {/* Col B — Availability statement */}
          <div style={{
            padding:"clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,4vw,3rem)",
            display:"flex", flexDirection:"column", justifyContent:"space-between",
          }}>
            <div>
              <p style={{
                fontFamily:"var(--font-mono)", fontSize:"clamp(.5rem,.7vw,.6rem)",
                letterSpacing:".16em", textTransform:"uppercase",
                color:acc, marginBottom:"1.25rem",
              }}>Status</p>

              <div style={{ display:"flex", alignItems:"flex-start", gap:".625rem", marginBottom:"1.5rem" }}>
                <div style={{
                  width:8, height:8, borderRadius:"50%", background:"#22c55e",
                  boxShadow:"0 0 10px #22c55e", flexShrink:0, marginTop:".35rem",
                  animation:"ftPulse 2s ease-in-out infinite",
                }}/>
                <div>
                  <div style={{
                    fontFamily:"var(--font-display)",
                    fontSize:"clamp(1.1rem,2.2vw,1.75rem)",
                    fontWeight:800, letterSpacing:"-.02em", lineHeight:1.1,
                    color:prim,
                  }}>Available for hire</div>
                  <div style={{
                    fontFamily:"var(--font-mono)",
                    fontSize:"clamp(.52rem,.7vw,.62rem)",
                    color:muted, marginTop:".3rem", letterSpacing:".06em",
                  }}>Open to freelance, full-time & co-founder roles</div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display:"flex", gap:"clamp(1rem,2.5vw,2.5rem)", flexWrap:"wrap" }}>
                {[["20+","Projects"],["3+","Years"],["7+","Clients"]].map(([v,l]) => (
                  <div key={l}>
                    <div style={{
                      fontFamily:"var(--font-display)",
                      fontSize:"clamp(1.4rem,3vw,2.5rem)",
                      fontWeight:900, letterSpacing:"-.04em",
                      color:acc, lineHeight:1,
                    }}>{v}</div>
                    <div style={{
                      fontFamily:"var(--font-mono)",
                      fontSize:"clamp(.48rem,.62vw,.56rem)",
                      letterSpacing:".1em", textTransform:"uppercase",
                      color:muted, marginTop:".15rem",
                    }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider B */}
          <div style={{ background:border, position:"relative" }}>
            {visible && (
              <div style={{
                position:"absolute", left:"50%", transform:"translateX(-50%)",
                width:6, height:6, borderRadius:"50%", background:acc,
                boxShadow:`0 0 10px ${acc}`,
                animation:"ftDotTravel 4s ease-in-out infinite 2s",
              }}/>
            )}
          </div>

          {/* Col C — Contact + stack */}
          <div style={{
            padding:"clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,5vw,4rem) clamp(1.5rem,3vw,2.5rem)",
            display:"flex", flexDirection:"column", justifyContent:"space-between",
          }}>
            <div>
              <p style={{
                fontFamily:"var(--font-mono)", fontSize:"clamp(.5rem,.7vw,.6rem)",
                letterSpacing:".16em", textTransform:"uppercase",
                color:acc, marginBottom:"1.25rem",
              }}>Say hello</p>

              <a href="mailto:chegephil24@gmail.com" style={{
                fontFamily:"var(--font-display)",
                fontSize:"clamp(.9rem,1.8vw,1.4rem)",
                fontWeight:800, letterSpacing:"-.02em",
                color:prim, textDecoration:"none",
                display:"block", marginBottom:"1.5rem",
                transition:"color .18s ease",
                wordBreak:"break-all",
              }}
              onMouseOver={e=>(e.currentTarget.style.color=acc)}
              onMouseOut={e=>(e.currentTarget.style.color=prim)}
              >
                chegephil24@gmail.com
              </a>

              <p style={{
                fontFamily:"var(--font-body)",
                fontSize:"clamp(.75rem,1.1vw,.85rem)",
                color:muted, lineHeight:1.7, marginBottom:0,
                maxWidth:280,
              }}>
                Full-Stack Developer & Co-Founder based in Nairobi. Building digital products that solve real problems.
              </p>
            </div>

            {/* Stack badges */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:".35rem", marginTop:"1.5rem" }}>
              {["Next.js","TypeScript","React","Node.js","Vercel"].map(t => (
                <span key={t} style={{
                  fontFamily:"var(--font-mono)",
                  fontSize:"clamp(.46rem,.6vw,.56rem)",
                  letterSpacing:".06em",
                  color:muted,
                  border:`1px solid ${border}`,
                  padding:".15rem .5rem", borderRadius:radius,
                  transition:"border-color .18s ease, color .18s ease",
                }}
                onMouseOver={e=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor=acc; el.style.color=acc }}
                onMouseOut={e=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor=border; el.style.color=muted }}
                >{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── SCROLLING TICKER ── stock-tape aesthetic ── */}
        <div style={{
          borderBottom:`1px solid ${border}`,
          overflow:"hidden", whiteSpace:"nowrap",
          background: isDark ? "rgba(255,255,255,0.018)" : "rgba(0,0,0,0.018)",
        }}>
          <div style={{
            display:"inline-flex",
            animation:"ftTicker 30s linear infinite",
          }}>
            {[...TICKER_ITEMS,...TICKER_ITEMS,...TICKER_ITEMS].map((item,i) => (
              <span key={i} style={{
                display:"inline-flex", alignItems:"center", gap:"1.25rem",
                padding:".55rem clamp(1.5rem,2.5vw,2.5rem)",
                fontFamily:"var(--font-mono)",
                fontSize:"clamp(.52rem,.72vw,.62rem)",
                letterSpacing:".1em", textTransform:"uppercase",
                color: i % 4 === 0 ? acc : muted,
              }}>
                {item}
                <span style={{ width:3, height:3, borderRadius:"50%", background:acc, opacity:.4, display:"inline-block", flexShrink:0 }}/>
              </span>
            ))}
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:".625rem clamp(1.5rem,5vw,4rem)",
          flexWrap:"wrap", gap:".5rem",
          opacity:visible?1:0, transition:"opacity .6s ease .95s",
        }}>
          <span style={{
            fontFamily:"var(--font-mono)",
            fontSize:"clamp(.46rem,.64vw,.56rem)",
            letterSpacing:".08em", color:muted,
          }}>© {year} Brian Chege · All rights reserved.</span>

          {/* Inline dot-separated nav */}
          <div style={{ display:"flex", alignItems:"center", gap:".625rem", flexWrap:"wrap" }}>
            {Object.entries(NAV_HREFS).map(([label, href], i, arr) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:".625rem" }}>
                <Link href={href} style={{
                  fontFamily:"var(--font-mono)",
                  fontSize:"clamp(.46rem,.64vw,.56rem)",
                  letterSpacing:".1em", textTransform:"uppercase",
                  color:muted, textDecoration:"none",
                  transition:"color .18s ease",
                }}
                onMouseOver={e=>(e.currentTarget.style.color=prim)}
                onMouseOut={e=>(e.currentTarget.style.color=muted)}
                >{label}</Link>
                {i < arr.length - 1 && (
                  <span style={{ width:2, height:2, borderRadius:"50%", background:border, display:"inline-block", flexShrink:0 }}/>
                )}
              </div>
            ))}
          </div>

          {/* Designed with love */}
          <span style={{
            fontFamily:"var(--font-mono)",
            fontSize:"clamp(.46rem,.64vw,.56rem)",
            letterSpacing:".06em", color:muted,
          }}>
            Crafted with{" "}
            <span style={{ color:acc }}>♥</span>
            {" "}in Nairobi
          </span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ftPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(1.35); }
        }
        @keyframes ftTicker {
          from { transform:translateX(0); }
          to   { transform:translateX(-33.333%); }
        }
        @keyframes ftDotTravel {
          0%   { top:0%;   opacity:0; }
          10%  { opacity:1; }
          90%  { opacity:1; }
          100% { top:100%; opacity:0; }
        }
        @media (max-width: 820px) {
          .ft-info-grid {
            grid-template-columns: 1fr !important;
          }
          .ft-info-grid > div:nth-child(even) {
            display: none !important;
          }
        }
      `}</style>
    </footer>
  )
}