"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"

/* ─── SVG Social Icons ─────────────────────────────────────────────────────── */
const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const SOCIALS = [
  { label: "GitHub",   href: "https://github.com/CHEGEBB",        Icon: GithubIcon   },
  { label: "LinkedIn", href: "https://linkedin.com/in/chegebb",   Icon: LinkedinIcon },
  { label: "Twitter",  href: "https://twitter.com/chegebb",       Icon: TwitterIcon  },
  { label: "Email",    href: "mailto:chegephil24@gmail.com",       Icon: EmailIcon    },
]

const NAV = [
  { label: "Home",    href: "/"         },
  { label: "Work",    href: "/projects" },
  { label: "About",   href: "/#about"   },
  { label: "Skills",  href: "/#skills"  },
  { label: "Contact", href: "/contact"  },
]

// Marquee track — repeating identifiers
const TRACK = [
  "BRIAN CHEGE", "·", "FULL STACK DEVELOPER", "·",
  "NAIROBI, KE",  "·", "OPEN TO WORK",         "·",
]

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
function useInView(threshold = 0.04) {
  const ref = useRef<HTMLElement>(null)
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

/* ─── Footer ────────────────────────────────────────────────────────────────── */
export function Footer() {
  const { theme }                  = useTheme()
  const { ref: sectionRef, inView }= useInView()
  const footerRef = sectionRef as React.RefObject<HTMLElement>

  const [painted,    setPainted]   = useState(false)
  const [revealed,   setRevealed]  = useState(false)

  // Magnetic CTA state
  const [magOffset, setMagOffset]  = useState({ x: 0, y: 0 })
  const magTarget                  = useRef({ x: 0, y: 0 })
  const magCurrent                 = useRef({ x: 0, y: 0 })
  const ctaRef                     = useRef<HTMLAnchorElement>(null)
  const magRaf                     = useRef<number>()

  // Marquee velocity
  const [marqueeSpeed, setMarqueeSpeed] = useState(28)
  const lastScrollY                = useRef(0)
  const scrollVelTimer             = useRef<ReturnType<typeof setTimeout>>()

  // Live clock
  const [time, setTime]            = useState("")

  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent
  const muted  = theme.colors.textMuted
  const prim   = theme.colors.textPrimary
  const border = theme.colors.surfaceBorder
  const bg     = theme.colors.bg
  const radius = { none:"0px", sm:"4px", md:"10px", lg:"18px", full:"9999px" }[theme.radius]
  const year   = new Date().getFullYear()
  const paintBg = isDark ? "#07070F" : "#F6F6FC"

  /* reveal */
  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setPainted(true),  80)
    const t2 = setTimeout(() => setRevealed(true), 900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [inView])

  /* live clock */
  useEffect(() => {
    const fmt = () => {
      const d  = new Date()
      const hh = (d.getUTCHours() + 3) % 24
      const mm = d.getUTCMinutes()
      const ss = d.getUTCSeconds()
      setTime(`${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}:${String(ss).padStart(2,"0")}`)
    }
    fmt()
    const id = setInterval(fmt, 1000)
    return () => clearInterval(id)
  }, [])

  /* scroll-velocity marquee */
  useEffect(() => {
    const onScroll = () => {
      const dy  = Math.abs(window.scrollY - lastScrollY.current)
      lastScrollY.current = window.scrollY
      setMarqueeSpeed(Math.max(8, 28 - dy * 1.2))
      clearTimeout(scrollVelTimer.current)
      scrollVelTimer.current = setTimeout(() => setMarqueeSpeed(28), 300)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* magnetic CTA RAF lerp */
  useEffect(() => {
    const tick = () => {
      const cx = magCurrent.current.x + (magTarget.current.x - magCurrent.current.x) * 0.1
      const cy = magCurrent.current.y + (magTarget.current.y - magCurrent.current.y) * 0.1
      magCurrent.current = { x: cx, y: cy }
      if (Math.abs(cx) > 0.05 || Math.abs(cy) > 0.05) setMagOffset({ x: cx, y: cy })
      magRaf.current = requestAnimationFrame(tick)
    }
    magRaf.current = requestAnimationFrame(tick)
    return () => { if (magRaf.current) cancelAnimationFrame(magRaf.current) }
  }, [])

  const onCtaMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ctaRef.current; if (!el) return
    const r  = el.getBoundingClientRect()
    const cx = r.left + r.width  / 2
    const cy = r.top  + r.height / 2
    magTarget.current = {
      x: (e.clientX - cx) * 0.32,
      y: (e.clientY - cy) * 0.32,
    }
  }, [])

  const onCtaMouseLeave = useCallback(() => {
    magTarget.current = { x: 0, y: 0 }
  }, [])

  /* ── render ─────────────────────────────────────────────────────────────── */
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
      {/* ── Paint wipe ── sweeps upward */}
      <div aria-hidden style={{
        position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
        background: paintBg,
        transform:  painted ? "translateY(105%)" : "translateY(0%)",
        transition: painted ? "transform .95s cubic-bezier(.86,0,.07,1)" : "none",
        willChange:"transform",
      }}>
        <div style={{
          position:"absolute", top:-52, left:0, right:0, height:104,
          background: paintBg,
          clipPath:"polygon(0 0,4% 55%,10% 100%,18% 45%,26% 90%,34% 38%,42% 95%,50% 48%,58% 94%,66% 42%,74% 88%,82% 40%,90% 95%,96% 52%,100% 0)",
        }}/>
      </div>
      <div aria-hidden style={{
        position:"absolute", inset:0, zIndex:1, pointerEvents:"none",
        background: paintBg, opacity:.4,
        transform:  painted ? "translateY(105%)" : "translateY(0%)",
        transition: painted ? "transform 1.1s cubic-bezier(.86,0,.07,1) .06s" : "none",
      }}/>

      {/* ── All content ─────────────────────────────────────────────────── */}
      <div style={{
        position:"relative", zIndex:4,
        opacity:   revealed ? 1 : 0,
        transition:"opacity .5s ease .2s",
      }}>

        {/* ── TOP META STRIP ── */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexWrap:"wrap", gap:".5rem",
          padding:"clamp(1.25rem,2.5vw,1.75rem) clamp(1.5rem,5vw,4rem)",
          borderBottom:`1px solid ${border}`,
          opacity:   revealed ? 1 : 0,
          transform: revealed ? "none" : "translateY(-10px)",
          transition:"opacity .6s ease .4s, transform .6s cubic-bezier(.16,1,.3,1) .4s",
        }}>
          {/* Live clock + status */}
          <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:".45rem" }}>
              <span style={{
                width:7, height:7, borderRadius:"50%",
                background:"#22c55e", boxShadow:"0 0 8px #22c55e",
                display:"inline-block", flexShrink:0,
                animation:"ftPulse 2s ease-in-out infinite",
              }}/>
              <span style={{
                fontFamily:"var(--font-mono)",
                fontSize:"clamp(.48rem,.68vw,.58rem)",
                letterSpacing:".12em", textTransform:"uppercase", color:muted,
              }}>Available · Nairobi, KE</span>
            </div>
            <span style={{
              fontFamily:"var(--font-mono)",
              fontSize:"clamp(.48rem,.68vw,.58rem)",
              letterSpacing:".1em", color:acc, opacity:.8,
              fontVariantNumeric:"tabular-nums",
            }}>{time} EAT</span>
          </div>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
            style={{
              background:"transparent", border:`1px solid ${border}`,
              borderRadius:radius, padding:".3rem .85rem",
              fontFamily:"var(--font-mono)",
              fontSize:"clamp(.46rem,.65vw,.56rem)",
              letterSpacing:".1em", textTransform:"uppercase",
              color:muted, cursor:"pointer",
              display:"flex", alignItems:"center", gap:".4rem",
              transition:"all .18s ease",
            }}
            onMouseOver={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=acc;el.style.color=acc}}
            onMouseOut={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=border;el.style.color=muted}}
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
            Back to top
          </button>
        </div>

        {/* ── MAGNETIC CTA ── */}
        <div style={{
          padding:"clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem) clamp(3rem,6vw,5rem)",
          display:"flex", flexDirection:"column", alignItems:"center",
          textAlign:"center", gap:"clamp(2rem,4vw,3.5rem)",
          opacity:   revealed ? 1 : 0,
          transform: revealed ? "none" : "translateY(24px)",
          transition:"opacity .7s ease .5s, transform .7s cubic-bezier(.16,1,.3,1) .5s",
        }}>
          {/* Eyebrow */}
          <div style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
            <span style={{ width:20, height:1, background:acc, display:"inline-block" }}/>
            <span style={{
              fontFamily:"var(--font-mono)",
              fontSize:"clamp(.52rem,.75vw,.62rem)",
              letterSpacing:".16em", textTransform:"uppercase", color:acc,
            }}>Open to new projects</span>
            <span style={{ width:20, height:1, background:acc, display:"inline-block" }}/>
          </div>

          {/* Giant magnetic headline */}
          <Link
            ref={ctaRef}
            href="/contact"
            onMouseMove={onCtaMouseMove}
            onMouseLeave={onCtaMouseLeave}
            style={{
              display:"block",
              fontFamily:"var(--font-display)",
              fontSize:"clamp(2.5rem,9vw,8.5rem)",
              fontWeight:900, letterSpacing:"-.05em", lineHeight:.88,
              textDecoration:"none",
              color:prim,
              transform:`translate(${magOffset.x}px, ${magOffset.y}px)`,
              // no CSS transition here — RAF lerp handles smoothness
              userSelect:"none",
            }}
          >
            {/* Word 1 */}
            <span style={{ display:"block" }}>
              Let&apos;s{" "}
              <em style={{
                fontStyle:"italic",
                color:"transparent",
                WebkitTextStroke:`2px ${acc}`,
              }}>work</em>
            </span>
            {/* Word 2 */}
            <span style={{ display:"block" }}>
              together
              <span style={{
                display:"inline-block",
                width:"clamp(.5rem,1.5vw,1.2rem)", height:"clamp(.5rem,1.5vw,1.2rem)",
                borderRadius:"50%", background:acc,
                marginLeft:"clamp(.4rem,1vw,.85rem)",
                verticalAlign:"middle",
                marginBottom:"clamp(.25rem,.7vw,.6rem)",
                boxShadow:`0 0 clamp(12px,2vw,24px) ${acc}88`,
                animation:"ftDot 2.5s ease-in-out infinite",
              }}/>
            </span>
          </Link>

          {/* Email as secondary link */}
          <a
            href="mailto:chegephil24@gmail.com"
            style={{
              fontFamily:"var(--font-mono)",
              fontSize:"clamp(.7rem,1.2vw,.9rem)",
              letterSpacing:".06em", color:muted,
              textDecoration:"none", transition:"color .2s ease",
              display:"inline-flex", alignItems:"center", gap:".5rem",
            }}
            onMouseOver={e=>(e.currentTarget.style.color=acc)}
            onMouseOut={e=>(e.currentTarget.style.color=muted)}
          >
            <EmailIcon/>
            chegephil24@gmail.com
          </a>

          {/* Social icons row */}
          <div style={{ display:"flex", gap:"clamp(.5rem,1.5vw,1rem)", alignItems:"center" }}>
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={label !== "Email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  display:"flex", alignItems:"center", justifyContent:"center",
                  width:"clamp(38px,4vw,46px)", height:"clamp(38px,4vw,46px)",
                  borderRadius:radius,
                  border:`1px solid ${border}`,
                  color:muted,
                  textDecoration:"none",
                  transition:"all .22s cubic-bezier(.16,1,.3,1)",
                  background:"transparent",
                }}
                onMouseOver={e=>{
                  const el=e.currentTarget as HTMLElement
                  el.style.borderColor=acc
                  el.style.color=acc
                  el.style.background=`${acc}12`
                  el.style.transform="translateY(-4px)"
                }}
                onMouseOut={e=>{
                  const el=e.currentTarget as HTMLElement
                  el.style.borderColor=border
                  el.style.color=muted
                  el.style.background="transparent"
                  el.style.transform="none"
                }}
              >
                <Icon/>
              </a>
            ))}
          </div>
        </div>

        {/* ── VELOCITY MARQUEE ── */}
        <div style={{
          borderTop:`1px solid ${border}`,
          borderBottom:`1px solid ${border}`,
          overflow:"hidden",
          padding:".65rem 0",
        }}>
          <div style={{
            display:"inline-flex",
            animation:`ftMarquee ${marqueeSpeed}s linear infinite`,
            whiteSpace:"nowrap",
            transition:"animation-duration .4s ease",
          }}>
            {[...TRACK,...TRACK,...TRACK,...TRACK].map((item, i) => (
              <span key={i} style={{
                fontFamily:"var(--font-display)",
                fontSize:"clamp(.7rem,1.2vw,.9rem)",
                fontWeight: item === "·" ? 400 : 800,
                letterSpacing: item === "·" ? ".1em" : "-.01em",
                color: item === "·" ? acc : "var(--color-text-muted)",
                padding:"0 clamp(1rem,2vw,2rem)",
                opacity: item === "·" ? .6 : 1,
              }}>{item}</span>
            ))}
          </div>
        </div>

        {/* ── BOTTOM STRIP ── single row of cells */}
        <div style={{
          display:"flex", alignItems:"stretch", flexWrap:"wrap",
          opacity:   revealed ? 1 : 0,
          transition:"opacity .6s ease .9s",
        }}>

          {/* Copyright */}
          <div style={{
            padding:"clamp(.875rem,1.5vw,1.25rem) clamp(1.5rem,5vw,4rem)",
            borderRight:`1px solid ${border}`,
            display:"flex", alignItems:"center", flexShrink:0,
          }}>
            <span style={{
              fontFamily:"var(--font-mono)",
              fontSize:"clamp(.46rem,.65vw,.56rem)",
              letterSpacing:".08em", color:muted, whiteSpace:"nowrap",
            }}>© {year} Brian Chege</span>
          </div>

          {/* Nav links */}
          <div style={{
            padding:"clamp(.875rem,1.5vw,1.25rem) clamp(1rem,2vw,2rem)",
            display:"flex", alignItems:"center",
            gap:"clamp(.5rem,1.5vw,1.5rem)", flexWrap:"wrap",
            flexGrow:1, borderRight:`1px solid ${border}`,
          }}>
            {NAV.map((item, i) => (
              <span key={item.label} style={{ display:"flex", alignItems:"center", gap:"clamp(.5rem,1.5vw,1.5rem)" }}>
                <Link
                  href={item.href}
                  style={{
                    fontFamily:"var(--font-mono)",
                    fontSize:"clamp(.46rem,.65vw,.56rem)",
                    letterSpacing:".1em", textTransform:"uppercase",
                    color:muted, textDecoration:"none",
                    transition:"color .15s ease", whiteSpace:"nowrap",
                  }}
                  onMouseOver={e=>(e.currentTarget.style.color=prim)}
                  onMouseOut={e=>(e.currentTarget.style.color=muted)}
                >{item.label}</Link>
                {i < NAV.length - 1 && (
                  <span style={{ width:2, height:2, borderRadius:"50%", background:border, flexShrink:0, display:"inline-block" }}/>
                )}
              </span>
            ))}
          </div>

          {/* Stack — right-anchored */}
          <div style={{
            padding:"clamp(.875rem,1.5vw,1.25rem) clamp(1.5rem,5vw,4rem)",
            marginLeft:"auto",
            display:"flex", alignItems:"center",
          }}>
            <span style={{
              fontFamily:"var(--font-mono)",
              fontSize:"clamp(.46rem,.65vw,.56rem)",
              letterSpacing:".08em", color:muted, whiteSpace:"nowrap",
            }}>Next.js · TypeScript · Vercel</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ftPulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.3)} }
        @keyframes ftDot     { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes ftMarquee { from{transform:translateX(0)} to{transform:translateX(-25%)} }
      `}</style>
    </footer>
  )
}