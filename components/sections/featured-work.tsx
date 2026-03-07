"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"
import { ArrowUpRight } from "lucide-react"

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id:"01", title:"IntelliMark",      category:"AI · EdTech",        type:"CLIENT",  year:"2024", image:"/projects/intellimark.png",   href:"/portfolio" },
  { id:"02", title:"TabooTalks",       category:"Social · Web App",   type:"CLIENT",  year:"2024", image:"/projects/tabootalks.png",    href:"/portfolio" },
  { id:"03", title:"H-mex Health",     category:"HealthTech · AI",    type:"CLIENT",  year:"2024", image:"/projects/hmex.png",          href:"/portfolio" },
  { id:"04", title:"WerEntOnline",     category:"PropTech · Web",     type:"CLIENT",  year:"2024", image:"/projects/werentonline.png",  href:"/portfolio" },
  { id:"05", title:"FarmSense",        category:"AgriTech · Web",     type:"CLIENT",  year:"2024", image:"/projects/farmsense.png",     href:"/portfolio" },
  { id:"06", title:"DjAfro StreamBox", category:"Mobile · Streaming", type:"CLIENT",  year:"2024", image:"/projects/djafro.png",        href:"/portfolio" },
  { id:"07", title:"Softrinx",         category:"SaaS · Enterprise",  type:"STARTUP", year:"2025", image:"/projects/softrinx.png",      href:"/portfolio" },
  { id:"08", title:"Teach2Give",       category:"EdTech · Web",       type:"CLIENT",  year:"2025", image:"/projects/teach2give.png",    href:"/portfolio" },
]

const FALLBACKS = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=80",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=900&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80",
  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=900&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80",
]

// ─── CURSOR TOOLTIP ───────────────────────────────────────────────────────────
function CursorTooltip({ visible, x, y, accent }) {
  return (
    <div style={{
      position: "fixed",
      left: x, top: y,
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
      zIndex: 9999,
      opacity: visible ? 1 : 0,
      scale: visible ? "1" : "0.5",
      transition: "opacity 0.2s ease, scale 0.3s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <div style={{
        background: accent, color: "#000",
        fontFamily: "var(--font-mono)", fontSize: "0.55rem",
        fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
        padding: "0.55rem 1rem", borderRadius: "9999px",
        whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "0.4rem",
        boxShadow: `0 0 24px ${accent}66`,
      }}>
        View Project <ArrowUpRight size={10} strokeWidth={3} />
      </div>
    </div>
  )
}

// ─── COUNTER ─────────────────────────────────────────────────────────────────
function Counter({ to, label }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        let n = 0
        const step = () => {
          n += Math.ceil((to - n) / 8)
          setVal(Math.min(n, to))
          if (n < to) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to])

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,3rem)",
        fontWeight: 800, letterSpacing: "-0.05em", color: "var(--color-accent)", lineHeight: 1,
      }}>{val}+</div>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "0.5rem",
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "var(--color-text-muted)", marginTop: "0.35rem",
      }}>{label}</div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function FeaturedWork() {
  const { theme } = useTheme()
  const acc = theme.colors.accent

  const sectionRef  = useRef(null)
  const [inView, setInView]       = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [imgSrcs, setImgSrcs]     = useState(PROJECTS.map(p => p.image))
  const [tooltip, setTooltip]     = useState({ visible: false, x: 0, y: 0 })

  // scroll-jack state
  const locked      = useRef(false)   // true while we own the scroll
  const wheelAccum  = useRef(0)
  const touchStartY = useRef(null)
  const activeRef   = useRef(0)       // mirror of activeIdx for use inside event handlers
  const advancing   = useRef(false)   // debounce

  // keep activeRef in sync
  useEffect(() => { activeRef.current = activeIdx }, [activeIdx])

  // ── Intersection: engage/disengage lock ─────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true)
        locked.current = true
      } else {
        locked.current = false
      }
    }, { threshold: 0.5 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  // ── Advance helper ───────────────────────────────────────────────────────
  const advance = useCallback((dir) => {
    if (advancing.current) return
    advancing.current = true
    setTimeout(() => { advancing.current = false }, 600)

    const cur = activeRef.current
    const next = cur + dir

    if (next < 0) {
      // Already at first — release upward
      locked.current = false
      window.scrollBy({ top: -120, behavior: "smooth" })
      return
    }
    if (next >= PROJECTS.length) {
      // Past last — release downward
      locked.current = false
      window.scrollBy({ top: 160, behavior: "smooth" })
      return
    }

    setActiveIdx(next)
  }, [])

  // ── Wheel ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const THRESH = 60
    const onWheel = (e) => {
      if (!locked.current) return
      e.preventDefault()
      wheelAccum.current += e.deltaY
      if (Math.abs(wheelAccum.current) >= THRESH) {
        advance(wheelAccum.current > 0 ? 1 : -1)
        wheelAccum.current = 0
      }
    }
    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [advance])

  // ── Touch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onStart = (e) => { touchStartY.current = e.touches[0].clientY }
    const onEnd   = (e) => {
      if (!locked.current || touchStartY.current === null) return
      const diff = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(diff) > 40) advance(diff > 0 ? 1 : -1)
      touchStartY.current = null
    }
    window.addEventListener("touchstart", onStart, { passive: true })
    window.addEventListener("touchend",   onEnd,   { passive: true })
    return () => {
      window.removeEventListener("touchstart", onStart)
      window.removeEventListener("touchend",   onEnd)
    }
  }, [advance])

  // ── Re-lock on scroll back into section ────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      const r = sectionRef.current.getBoundingClientRect()
      const centred = r.top <= window.innerHeight * 0.5 && r.bottom >= window.innerHeight * 0.5
      if (centred) locked.current = true
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const onMouseMove = useCallback((e) => {
    setTooltip(t => ({ ...t, x: e.clientX, y: e.clientY }))
  }, [])

  const setFallback = (i) =>
    setImgSrcs(prev => { const n=[...prev]; n[i]=FALLBACKS[i%FALLBACKS.length]; return n })

  const active = PROJECTS[activeIdx]

  return (
    <>
      <CursorTooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y} accent={acc} />

      <section ref={sectionRef} style={{ position:"relative", background:"var(--color-bg)", overflow:"hidden" }}>

        {/* Ambient glow */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
          background:`radial-gradient(ellipse 60% 55% at 65% 55%, var(--color-accent-muted) 0%, transparent 70%)`,
        }} />

        <div style={{ position:"relative", zIndex:2 }}>

          {/* ── HEADER ─────────────────────────────────────────────────── */}
          <div style={{
            padding:"clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4rem) clamp(1.5rem,3vw,2.5rem)",
            display:"grid",
            gridTemplateColumns:"1fr auto",
            alignItems:"end",
            gap:"1.5rem",
          }}>
            <div>
              <div style={{
                display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.25rem",
                opacity: inView?1:0, transform: inView?"none":"translateY(16px)",
                transition:"all 0.6s ease 0.1s",
              }}>
                <div style={{ width:28, height:"1px", background:acc }} />
                <span style={{
                  fontFamily:"var(--font-mono)", fontSize:"0.6rem",
                  letterSpacing:"0.15em", textTransform:"uppercase", color:acc,
                }}>Selected Work</span>
                <div style={{
                  fontFamily:"var(--font-mono)", fontSize:"0.55rem",
                  color:"var(--color-text-muted)", letterSpacing:"0.08em",
                  border:"1px solid var(--color-surface-border)", padding:"0.15rem 0.5rem",
                }}>{PROJECTS.length} Projects</div>
              </div>

              <h2 style={{
                fontFamily:"var(--font-display)",
                fontSize:"clamp(2.8rem,8vw,7.5rem)",
                fontWeight:800, letterSpacing:"-0.05em", lineHeight:0.88, margin:0,
                opacity: inView?1:0, transform: inView?"none":"translateY(24px)",
                transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 0.18s",
              }}>
                <span style={{ display:"block", color:"var(--color-text-primary)" }}>Featured</span>
                <span style={{
                  display:"block", color:"transparent",
                  WebkitTextStroke:`2px ${acc}`, textShadow:`0 0 60px ${acc}33`,
                }}>Work</span>
              </h2>
            </div>

            <div style={{
              display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"2rem",
              opacity: inView?1:0, transform: inView?"none":"translateY(20px)",
              transition:"all 0.8s ease 0.35s",
            }}>
              <div style={{ display:"flex", gap:"2rem" }}>
                <Counter to={20} label="Projects" />
                <Counter to={7}  label="Companies" />
                <Counter to={3}  label="Years" />
              </div>
              <Link href="/portfolio" style={{
                display:"inline-flex", alignItems:"center", gap:"0.6rem",
                fontFamily:"var(--font-body)", fontSize:"0.875rem",
                fontWeight:600, letterSpacing:"0.04em",
                color:"var(--color-accent-fg)", background:acc,
                padding:"0.65rem 1.5rem", borderRadius:"9999px",
                textDecoration:"none", boxShadow:`0 0 28px ${acc}44`,
                transition:"transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.05)";e.currentTarget.style.boxShadow=`0 0 40px ${acc}66`}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow=`0 0 28px ${acc}44`}}
              >View all work <ArrowUpRight size={14} strokeWidth={2.5} /></Link>
            </div>
          </div>

          {/* ── SHOWCASE ───────────────────────────────────────────────── */}
          <div style={{
            display:"grid",
            gridTemplateColumns:"clamp(80px,9vw,115px) 1fr",
            gap:"clamp(0.75rem,1.5vw,1.5rem)",
            padding:"0 clamp(1.25rem,5vw,4rem) clamp(2.5rem,5vw,4rem)",
            alignItems:"stretch",
            opacity: inView?1:0, transform: inView?"none":"translateY(30px)",
            transition:"opacity 0.9s ease 0.4s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s",
          }}>

            {/* LEFT thumbnails */}
            <div style={{
              display:"flex", flexDirection:"column", gap:"clamp(0.35rem,0.7vw,0.55rem)",
              WebkitMaskImage:"linear-gradient(180deg,transparent 0%,black 5%,black 95%,transparent 100%)",
              maskImage:"linear-gradient(180deg,transparent 0%,black 5%,black 95%,transparent 100%)",
            }}>
              {PROJECTS.map((p, i) => (
                <button key={p.id}
                  onClick={() => { setActiveIdx(i); locked.current = true }}
                  style={{
                    all:"unset", cursor:"none", display:"block",
                    position:"relative", overflow:"hidden",
                    aspectRatio:"16/10", flexShrink:0,
                    outline: i===activeIdx ? `2px solid ${acc}` : "2px solid transparent",
                    outlineOffset:"-2px",
                    transition:"outline-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
                    transform: i===activeIdx ? "scale(1.03)" : "scale(1)",
                    boxShadow: i===activeIdx ? `0 0 14px ${acc}55` : "none",
                  }}
                >
                  <img src={imgSrcs[i]} alt={p.title}
                    onError={() => setFallback(i)}
                    style={{
                      width:"100%", height:"100%", objectFit:"cover", display:"block",
                      filter: i===activeIdx ? "brightness(1)" : "brightness(0.35) saturate(0.3)",
                      transition:"filter 0.4s ease",
                    }}
                  />
                  {i === activeIdx && (
                    <div style={{
                      position:"absolute", top:"50%", right:-11,
                      transform:"translateY(-50%)",
                      width:5, height:5, borderRadius:"50%",
                      background:acc, boxShadow:`0 0 8px ${acc}`,
                    }} />
                  )}
                </button>
              ))}

              <Link href="/portfolio" style={{
                display:"flex", alignItems:"center", justifyContent:"center",
                gap:"0.3rem", marginTop:"0.4rem", padding:"0.5rem",
                border:"1px solid var(--color-surface-border)",
                fontFamily:"var(--font-mono)", fontSize:"0.42rem",
                letterSpacing:"0.1em", textTransform:"uppercase",
                color:"var(--color-text-muted)", textDecoration:"none",
                transition:"color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.color=acc;e.currentTarget.style.borderColor=acc}}
              onMouseLeave={e=>{e.currentTarget.style.color="var(--color-text-muted)";e.currentTarget.style.borderColor="var(--color-surface-border)"}}
              >ALL <ArrowUpRight size={7} /></Link>
            </div>

            {/* RIGHT large preview */}
            <Link href={active.href} style={{
              display:"block", position:"relative", overflow:"hidden",
              cursor:"none", textDecoration:"none", aspectRatio:"16/9",
            }}
            onMouseEnter={() => setTooltip(t=>({...t,visible:true}))}
            onMouseLeave={() => setTooltip(t=>({...t,visible:false}))}
            onMouseMove={onMouseMove}
            >
              {/* Crossfade images */}
              {PROJECTS.map((p, i) => (
                <img key={p.id} src={imgSrcs[i]} alt={p.title}
                  onError={() => setFallback(i)}
                  style={{
                    position:"absolute", inset:0, width:"100%", height:"100%",
                    objectFit:"cover", display:"block",
                    opacity: i===activeIdx ? 1 : 0,
                    transition:"opacity 0.7s cubic-bezier(0.16,1,0.3,1)",
                    animation: i===activeIdx ? "featuredZoom 10s ease-in-out infinite alternate" : "none",
                    willChange:"transform,opacity",
                  }}
                />
              ))}

              {/* Gradient */}
              <div style={{
                position:"absolute", inset:0,
                background:"linear-gradient(135deg,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.04) 50%,rgba(0,0,0,0.72) 100%)",
                zIndex:1,
              }} />

              {/* Info overlay */}
              <div style={{
                position:"absolute", inset:0, zIndex:2,
                display:"flex", flexDirection:"column", justifyContent:"space-between",
                padding:"clamp(1rem,2.5vw,2rem)",
              }}>
                {/* Top row */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <span style={{
                    fontFamily:"var(--font-mono)", fontSize:"0.55rem",
                    letterSpacing:"0.14em", textTransform:"uppercase",
                    color:acc, background:`${acc}1a`,
                    border:`1px solid ${acc}44`, padding:"0.2rem 0.55rem",
                    backdropFilter:"blur(6px)",
                  }}>{active.type}</span>
                  <div style={{
                    fontFamily:"var(--font-mono)", fontSize:"0.55rem",
                    color:"rgba(255,255,255,0.35)", letterSpacing:"0.1em",
                    display:"flex", alignItems:"center", gap:"0.4rem",
                  }}>
                    <span style={{ color:acc }}>{String(activeIdx+1).padStart(2,"0")}</span>
                    <span>/</span>
                    <span>{String(PROJECTS.length).padStart(2,"0")}</span>
                  </div>
                </div>

                {/* Bottom */}
                <div>
                  <p style={{
                    fontFamily:"var(--font-mono)", fontSize:"0.5rem",
                    letterSpacing:"0.1em", textTransform:"uppercase",
                    color:"rgba(255,255,255,0.4)", margin:"0 0 0.4rem",
                  }}>{active.category} · {active.year}</p>

                  <h3 style={{
                    fontFamily:"var(--font-display)",
                    fontSize:"clamp(1.8rem,5vw,4.5rem)",
                    fontWeight:800, letterSpacing:"-0.04em", lineHeight:0.9,
                    margin:"0 0 0.75rem", color:"transparent",
                    WebkitTextStroke:"2px rgba(255,255,255,0.85)",
                    textShadow:`0 0 60px ${acc}44`,
                  }}>{active.title}</h3>

                  <div style={{
                    display:"flex", alignItems:"center", gap:"0.5rem",
                    fontFamily:"var(--font-mono)", fontSize:"0.43rem",
                    letterSpacing:"0.12em", textTransform:"uppercase",
                    color:"rgba(255,255,255,0.22)",
                  }}>
                    <div style={{ width:14, height:1, background:acc }} />
                    {activeIdx < PROJECTS.length-1 ? "Scroll to advance" : "Scroll to continue"}
                  </div>
                </div>
              </div>

              {/* Progress dots */}
              <div style={{
                position:"absolute",
                bottom:"clamp(0.75rem,1.5vw,1.25rem)",
                right:"clamp(0.75rem,1.5vw,1.25rem)",
                display:"flex", gap:5, zIndex:3,
              }}>
                {PROJECTS.map((_,i) => (
                  <div key={i} style={{
                    width: i===activeIdx ? 18 : 5, height:5,
                    background: i===activeIdx ? acc : "rgba(255,255,255,0.18)",
                    transition:"width 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s ease",
                    boxShadow: i===activeIdx ? `0 0 8px ${acc}` : "none",
                  }} />
                ))}
              </div>

              {/* Bottom accent line */}
              <div style={{
                position:"absolute", bottom:0, left:0, right:0, height:3, zIndex:4,
                background:`linear-gradient(90deg,transparent,${acc},transparent)`,
                opacity: tooltip.visible ? 1 : 0.45,
                transition:"opacity 0.3s ease",
                boxShadow:`0 0 10px ${acc}`,
              }} />
            </Link>
          </div>

          {/* ── BOTTOM CTA ─────────────────────────────────────────────── */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"center", gap:"2rem",
            padding:"0 clamp(1.25rem,5vw,4rem) clamp(3rem,6vw,5rem)",
            opacity: inView?1:0, transition:"opacity 0.8s ease 0.7s",
          }}>
            <div style={{ flex:1, height:"1px", background:`linear-gradient(90deg,transparent,var(--color-surface-border))` }} />
            <Link href="/portfolio" style={{
              fontFamily:"var(--font-display)", fontSize:"clamp(1rem,2.5vw,1.5rem)",
              fontWeight:700, letterSpacing:"-0.02em",
              color:"var(--color-text-primary)", textDecoration:"none",
              display:"inline-flex", alignItems:"center", gap:"0.75rem",
              transition:"gap 0.3s ease, color 0.2s ease", cursor:"none",
            }}
            onMouseEnter={e=>{e.currentTarget.style.gap="1.5rem";e.currentTarget.style.color=acc}}
            onMouseLeave={e=>{e.currentTarget.style.gap="0.75rem";e.currentTarget.style.color="var(--color-text-primary)"}}
            >See everything I&apos;ve built <ArrowUpRight size={18} strokeWidth={2} /></Link>
            <div style={{ flex:1, height:"1px", background:`linear-gradient(90deg,var(--color-surface-border),transparent)` }} />
          </div>

          {/* Mobile tap nav */}
          <div style={{
            display:"none", justifyContent:"center", gap:"1rem",
            padding:"0 clamp(1.25rem,5vw,4rem) 2rem",
          }} className="fw-mobile-nav">
            <button onClick={() => advance(-1)} disabled={activeIdx===0} style={{
              all:"unset", cursor:"pointer",
              width:44, height:44,
              border:`1px solid ${activeIdx===0 ? "rgba(255,255,255,0.1)" : acc}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              color: activeIdx===0 ? "rgba(255,255,255,0.15)" : acc,
              fontFamily:"var(--font-display)", fontSize:"1.1rem",
              transition:"all 0.2s ease",
            }}>←</button>
            <button onClick={() => advance(1)} style={{
              all:"unset", cursor:"pointer",
              width:44, height:44,
              border:`1px solid ${acc}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              color:acc, fontFamily:"var(--font-display)", fontSize:"1.1rem",
              boxShadow:`0 0 12px ${acc}44`,
            }}>→</button>
          </div>
        </div>

        <style jsx global>{`
          @keyframes featuredZoom {
            from { transform: scale(1); }
            to   { transform: scale(1.06); }
          }
          @media (max-width: 640px) {
            .fw-mobile-nav { display: flex !important; }
          }
          @media (max-width: 500px) {
            /* On very small screens, collapse header to single column */
            section > div > div:first-of-type {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>
    </>
  )
}