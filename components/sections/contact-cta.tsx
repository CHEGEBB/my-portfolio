"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"

const LETTERS = ["A","V","A","I","L","A","B","L","E"]

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
  const { theme }               = useTheme()
  const { ref, inView }         = useInView()
  const [painted,  setPainted]  = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [mouse,    setMouse]    = useState({ x: 0.5, y: 0.5 })
  const [letterY,  setLetterY]  = useState<number[]>(LETTERS.map(() => 0))
  const [emailHov, setEmailHov] = useState(false)
  const [ctaHov,   setCtaHov]   = useState(false)
  const sectionRef              = useRef<HTMLDivElement>(null)
  const rafRef                  = useRef<number>()
  const targetY                 = useRef<number[]>(LETTERS.map(() => 0))
  const currentY                = useRef<number[]>(LETTERS.map(() => 0))
  const isDark = theme.mode === "dark"
  const accent = theme.colors.accent
  const radius = { none:"0px", sm:"4px", md:"10px", lg:"18px", full:"9999px" }[theme.radius]

  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setPainted(true),  60)
    const t2 = setTimeout(() => setRevealed(true), 760)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [inView])

  // Smooth letter animation loop
  useEffect(() => {
    const tick = () => {
      let changed = false
      const next = currentY.current.map((cy, i) => {
        const ty = targetY.current[i]
        const ny = cy + (ty - cy) * 0.09
        if (Math.abs(ny - cy) > 0.01) changed = true
        return ny
      })
      currentY.current = next
      if (changed) setLetterY([...next])
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current; if (!el) return
    const r  = el.getBoundingClientRect()
    const mx = (e.clientX - r.left) / r.width   // 0..1
    const my = (e.clientY - r.top)  / r.height  // 0..1
    setMouse({ x: mx, y: my })

    // Each letter lifts based on proximity to mouse X
    const cols = LETTERS.length
    targetY.current = LETTERS.map((_, i) => {
      const center = (i + 0.5) / cols // letter center 0..1
      const dist   = Math.abs(mx - center)
      const lift   = Math.max(0, 1 - dist * cols * 0.85)
      // lift range: -60px (up) to +12px (down on edges)
      return -(lift * lift) * 72 + (dist < 0.05 ? 0 : dist * 8)
    })
  }, [])

  const onMouseLeave = useCallback(() => {
    targetY.current = LETTERS.map(() => 0)
  }, [])

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    el.addEventListener("mousemove", onMouseMove,  { passive: true })
    el.addEventListener("mouseleave", onMouseLeave)
    return () => {
      el.removeEventListener("mousemove", onMouseMove)
      el.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [onMouseMove, onMouseLeave])

  const setRef = useCallback((el: HTMLDivElement | null) => {
    ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = el
    ;(sectionRef as React.MutableRefObject<HTMLDivElement | null>).current = el
  }, [ref])

  const paintBg = isDark ? "#07070F" : "#F6F6FC"
  const gx = (mouse.x * 100).toFixed(1)
  const gy = (mouse.y * 100).toFixed(1)

  return (
    <section
      ref={setRef}
      style={{
        position:"relative",
        minHeight:"100svh",
        background:"var(--color-bg)",
        overflow:"hidden",
        display:"flex", flexDirection:"column",
        justifyContent:"center",
      }}
    >
      {/* Mouse ambient glow */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
        background:`radial-gradient(ellipse 65% 55% at ${gx}% ${gy}%, ${accent}${isDark?"12":"09"} 0%, transparent 65%)`,
        transition:"background .1s ease",
      }}/>

      {/* Large static orb bottom right */}
      <div style={{
        position:"absolute", bottom:"-25%", right:"-10%",
        width:"70vw", height:"70vw", maxWidth:900, maxHeight:900,
        borderRadius:"50%",
        background:`radial-gradient(circle, ${accent}${isDark?"08":"05"} 0%, transparent 65%)`,
        pointerEvents:"none", zIndex:1,
      }}/>

      {/* Paint wipe — left to right wipe out */}
      <div aria-hidden style={{
        position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
        background:paintBg,
        transform:  painted ? "translateX(105%)" : "translateX(0%)",
        transition: painted ? "transform 0.95s cubic-bezier(0.86,0,0.07,1)" : "none",
        willChange:"transform",
      }}>
        <div style={{
          position:"absolute", top:0, left:-56, bottom:0, width:112,
          background:paintBg,
          clipPath:"polygon(100% 0,55% 3%,0 9%,30% 20%,0 31%,42% 42%,0 53%,38% 63%,0 74%,35% 84%,0 93%,55% 98%,100% 100%)",
        }}/>
      </div>

      <div style={{
        position:"relative", zIndex:5,
        opacity:   revealed ? 1 : 0,
        transition:"opacity .5s ease",
        padding:"clamp(4rem,8vw,7rem) 0",
      }}>

        {/* ── EYEBROW ── */}
        <div style={{
          padding:"0 clamp(1.5rem,5vw,4rem)",
          marginBottom:"clamp(1.5rem,3vw,2.5rem)",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexWrap:"wrap", gap:".75rem",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
            <span style={{ width:20, height:1, background:accent, display:"inline-block" }}/>
            <span style={{
              fontFamily:"var(--font-mono)",
              fontSize:"clamp(.55rem,.8vw,.68rem)",
              letterSpacing:".14em", textTransform:"uppercase", color:accent,
            }}>Open to work</span>
          </div>

          {/* Pulsing status */}
          <div style={{ display:"flex", alignItems:"center", gap:".5rem" }}>
            <div style={{
              width:8, height:8, borderRadius:"50%", background:"#22c55e",
              boxShadow:"0 0 10px #22c55e",
              animation:"ctaDot 2s ease-in-out infinite",
            }}/>
            <span style={{
              fontFamily:"var(--font-mono)",
              fontSize:"clamp(.52rem,.72vw,.62rem)",
              letterSpacing:".1em", textTransform:"uppercase",
              color:"var(--color-text-muted)",
            }}>Nairobi, Kenya · EAT (UTC+3)</span>
          </div>
        </div>

        {/* ── PIANO LETTERS ── each column warps independently */}
        <div
          style={{
            display:"grid",
            gridTemplateColumns:`repeat(${LETTERS.length}, 1fr)`,
            padding:"0 clamp(1rem,3vw,3rem)",
            userSelect:"none",
            marginBottom:"clamp(1.5rem,3vw,2.5rem)",
          }}
        >
          {LETTERS.map((letter, i) => (
            <div
              key={i}
              style={{
                display:"flex", justifyContent:"center", alignItems:"flex-end",
                height:"clamp(5rem,12vw,10rem)",
                transform:`translateY(${letterY[i]}px)`,
                // no CSS transition — handled by RAF lerp for silky smooth
              }}
            >
              <span style={{
                fontFamily:"var(--font-display)",
                fontSize:"clamp(2.5rem,8vw,7.5rem)",
                fontWeight:900,
                letterSpacing:"-.04em",
                lineHeight:1,
                color: Math.abs(letterY[i]) > 8
                  ? accent
                  : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
                WebkitTextStroke: Math.abs(letterY[i]) > 4
                  ? `0px ${accent}`
                  : `1px ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
                transition:"color .15s ease, -webkit-text-stroke .15s ease",
                display:"block",
              }}>{letter}</span>
            </div>
          ))}
        </div>

        {/* ── THIN DIVIDER ── */}
        <div style={{
          height:1,
          background:`linear-gradient(90deg, transparent, ${accent}30, transparent)`,
          margin:"0 clamp(1.5rem,5vw,4rem) clamp(2.5rem,5vw,4rem)",
        }}/>

        {/* ── EMAIL AS HEADLINE ── */}
        <div style={{ padding:"0 clamp(1.5rem,5vw,4rem)", marginBottom:"clamp(2.5rem,5vw,4rem)" }}>
          <p style={{
            fontFamily:"var(--font-mono)",
            fontSize:"clamp(.55rem,.78vw,.66rem)",
            letterSpacing:".12em", textTransform:"uppercase",
            color:"var(--color-text-muted)",
            marginBottom:"clamp(.75rem,1.5vw,1.25rem)",
          }}>Say hello</p>

          <a
            href="mailto:chegephil24@gmail.com"
            onMouseEnter={() => setEmailHov(true)}
            onMouseLeave={() => setEmailHov(false)}
            style={{
              display:"block",
              fontFamily:"var(--font-display)",
              fontSize:"clamp(1.6rem,5vw,4.5rem)",
              fontWeight:800, letterSpacing:"-.04em", lineHeight:1,
              textDecoration:"none",
              color: emailHov ? accent : "var(--color-text-primary)",
              transition:"color .2s ease",
              wordBreak:"break-all",
            }}
          >
            chegephil24@gmail.com
            {/* Underline that floods in */}
            <div style={{
              height:2, marginTop:".4rem",
              background:accent,
              transform: emailHov ? "scaleX(1)" : "scaleX(0)",
              transformOrigin:"left",
              transition:"transform .4s cubic-bezier(.16,1,.3,1)",
            }}/>
          </a>
        </div>

        {/* ── BOTTOM ROW — CTA + socials + stats ── */}
        <div style={{
          padding:"0 clamp(1.5rem,5vw,4rem)",
          display:"grid",
          gridTemplateColumns:"auto 1fr auto",
          alignItems:"center",
          gap:"clamp(1.5rem,3vw,3rem)",
          flexWrap:"wrap",
        }}
        className="cta-bottom-row"
        >
          {/* CTA button — magnetic feel */}
          <Link
            href="/contact"
            onMouseEnter={() => setCtaHov(true)}
            onMouseLeave={() => setCtaHov(false)}
            style={{
              display:"inline-flex", alignItems:"center", gap:".6rem",
              fontFamily:"var(--font-display)",
              fontSize:"clamp(.85rem,1.3vw,1rem)",
              fontWeight:700, letterSpacing:"-.01em",
              color: isDark ? "#07070F" : "#F6F6FC",
              background:accent,
              padding:"clamp(.875rem,1.5vw,1.1rem) clamp(1.75rem,3vw,2.5rem)",
              borderRadius:radius, textDecoration:"none",
              boxShadow: ctaHov ? `0 20px 50px ${accent}55, 0 0 0 6px ${accent}22` : `0 4px 20px ${accent}33`,
              transform: ctaHov ? "translateY(-4px) scale(1.03)" : "none",
              transition:"all .3s cubic-bezier(.16,1,.3,1)",
              whiteSpace:"nowrap",
            }}
          >
            Start a project
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

          {/* Stats row */}
          <div style={{
            display:"flex", gap:"clamp(1.5rem,4vw,4rem)",
            justifyContent:"center", flexWrap:"wrap",
          }}>
            {[
              { v:"20+", l:"Projects" },
              { v:"3+",  l:"Years"    },
              { v:"7+",  l:"Clients"  },
              { v:"2",   l:"Startups" },
            ].map(s => (
              <div key={s.l} style={{ textAlign:"center" }}>
                <div style={{
                  fontFamily:"var(--font-display)",
                  fontSize:"clamp(1.4rem,3vw,2.5rem)",
                  fontWeight:900, letterSpacing:"-.04em",
                  color:accent, lineHeight:1,
                }}>{s.v}</div>
                <div style={{
                  fontFamily:"var(--font-mono)",
                  fontSize:"clamp(.5rem,.65vw,.6rem)",
                  letterSpacing:".1em", textTransform:"uppercase",
                  color:"var(--color-text-muted)",
                  marginTop:".2rem",
                }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div style={{ display:"flex", gap:".75rem" }}>
            {[
              { label:"GH", href:"https://github.com/CHEGEBB" },
              { label:"LI", href:"https://linkedin.com/in/chegebb" },
              { label:"TW", href:"https://twitter.com/chegebb" },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank" rel="noopener noreferrer"
                style={{
                  width:"clamp(36px,4vw,44px)", height:"clamp(36px,4vw,44px)",
                  borderRadius:radius,
                  border:`1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"var(--font-mono)",
                  fontSize:"clamp(.52rem,.68vw,.62rem)",
                  fontWeight:700, letterSpacing:".04em",
                  color:"var(--color-text-muted)",
                  textDecoration:"none",
                  transition:"all .2s ease",
                }}
                onMouseOver={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = accent
                  el.style.color = accent
                  el.style.background = `${accent}12`
                }}
                onMouseOut={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
                  el.style.color = "var(--color-text-muted)"
                  el.style.background = "transparent"
                }}
              >{s.label}</a>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ctaDot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.45; transform:scale(1.35); }
        }
        @media (max-width: 680px) {
          .cta-bottom-row {
            grid-template-columns: 1fr !important;
            justify-items: start;
          }
        }
      `}</style>
    </section>
  )
}