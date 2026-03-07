"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"
import { ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

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
      position: "fixed", left: x, top: y,
      transform: "translate(-50%, -50%)",
      pointerEvents: "none", zIndex: 9999,
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
        const step = () => { n += Math.ceil((to - n) / 8); setVal(Math.min(n, to)); if (n < to) requestAnimationFrame(step) }
        requestAnimationFrame(step)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to])
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:800, letterSpacing:"-0.05em", color:"var(--color-accent)", lineHeight:1 }}>{val}+</div>
      <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--color-text-muted)", marginTop:"0.35rem" }}>{label}</div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function FeaturedWork() {
  const { theme } = useTheme()
  const acc = theme.colors.accent
  const isDark = theme.mode === "dark"

  const sectionRef  = useRef(null)
  const [inView, setInView]       = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress]   = useState(0)
  const [imgSrcs, setImgSrcs]     = useState(PROJECTS.map(p => p.image))
  const [tooltip, setTooltip]     = useState({ visible: false, x: 0, y: 0 })

  const setFallback = (i) =>
    setImgSrcs(prev => { const n = [...prev]; n[i] = FALLBACKS[i % FALLBACKS.length]; return n })

  // ── GSAP pin + scrub — same pattern as AboutStory ─────────────────────────
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Total scroll distance = (n-1) "pages" × viewport height
    const totalScroll = (PROJECTS.length - 1) * window.innerHeight

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: "featured-work-scroll",
        trigger: section,
        pin: true,
        scrub: 1.2,
        start: "top top",
        end: () => `+=${totalScroll}`,
        invalidateOnRefresh: true,
        onUpdate(self) {
          setProgress(self.progress)
          const idx = Math.min(
            Math.round(self.progress * (PROJECTS.length - 1)),
            PROJECTS.length - 1
          )
          setActiveIdx(idx)
        },
        onEnter() { setInView(true) },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const onMouseMove = useCallback((e) => {
    setTooltip(t => ({ ...t, x: e.clientX, y: e.clientY }))
  }, [])

  const active = PROJECTS[activeIdx]

  return (
    <>
      <CursorTooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y} accent={acc} />

      <section
        ref={sectionRef}
        style={{ position: "relative", height: "100svh", overflow: "hidden", background: "var(--color-bg)" }}
      >
        {/* ── TOP PROGRESS BAR (same as AboutStory) ── */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px", zIndex: 50,
          background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
        }}>
          <div style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${acc}, ${acc}88)`,
            boxShadow: `0 0 10px ${acc}99`,
            transition: "width 0.08s linear",
          }} />
        </div>

        {/* Ambient glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: `radial-gradient(ellipse 60% 55% at 65% 55%, var(--color-accent-muted) 0%, transparent 70%)`,
        }} />

        {/* Fixed eyebrow */}
        <div style={{
          position: "absolute",
          top: "clamp(5rem,8vw,6rem)",
          left: "clamp(1.5rem,5vw,4rem)",
          zIndex: 10,
          display: "flex", alignItems: "center", gap: "0.6rem",
          pointerEvents: "none",
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(12px)",
          transition: "all 0.6s ease 0.1s",
        }}>
          <div style={{ width: 20, height: 1, background: acc }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.58rem",
            letterSpacing: "0.16em", textTransform: "uppercase", color: acc,
          }}>Selected Work</span>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "0.52rem",
            color: "var(--color-text-muted)", letterSpacing: "0.08em",
            border: "1px solid var(--color-surface-border)",
            padding: "0.12rem 0.45rem",
          }}>{PROJECTS.length} Projects</div>
        </div>

        {/* ── SCROLL INDICATOR PILL (bottom-right) — same as AboutStory ── */}
        <div style={{
          position: "absolute",
          bottom: "clamp(1.25rem,3vw,2rem)",
          right: "clamp(1rem,3vw,2rem)",
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
          {/* Project dots */}
          <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
            {PROJECTS.map((_, i) => (
              <div key={i} style={{
                height: 6, borderRadius: 0,
                width: activeIdx === i ? 14 : 6,
                background: activeIdx === i ? acc : `${acc}33`,
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <svg width="16" height="10" viewBox="0 0 20 12" fill="none"
              style={{ animation: progress < 0.015 ? "nudgeDown 1.1s ease-in-out infinite" : "none" }}>
              <path d="M10 0v17M5 11l5 6 5-6" stroke={acc} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.48rem",
              letterSpacing: "0.1em", textTransform: "uppercase", color: acc, minWidth: "2.5ch",
            }}>
              {progress < 0.015 ? "scroll" : `${Math.round(progress * 100)}%`}
            </span>
          </div>
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div style={{
          position: "relative", zIndex: 2,
          height: "100%",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          padding: "clamp(4rem,8vw,6rem) clamp(1.25rem,5vw,4rem) clamp(1.5rem,3vw,2.5rem)",
          gap: "clamp(1rem,2vw,1.75rem)",
        }}>

          {/* ── HEADER ROW ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "end",
            gap: "1.5rem",
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.18s",
          }}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem,7vw,6.5rem)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.88,
              margin: 0,
            }}>
              <span style={{ display: "block", color: "var(--color-text-primary)" }}>Featured</span>
              <span style={{
                display: "block", color: "transparent",
                WebkitTextStroke: `2px ${acc}`,
                textShadow: `0 0 60px ${acc}33`,
              }}>Work</span>
            </h2>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1.5rem" }}>
              <div style={{ display: "flex", gap: "2rem" }}>
                <Counter to={20} label="Projects" />
                <Counter to={7}  label="Companies" />
                <Counter to={3}  label="Years" />
              </div>
              <Link href="/portfolio" style={{
                display: "inline-flex", alignItems: "center", gap: "0.6rem",
                fontFamily: "var(--font-body)", fontSize: "0.875rem",
                fontWeight: 600, letterSpacing: "0.04em",
                color: "var(--color-accent-fg)", background: acc,
                padding: "0.6rem 1.4rem", borderRadius: "9999px",
                textDecoration: "none", boxShadow: `0 0 28px ${acc}44`,
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.05)";e.currentTarget.style.boxShadow=`0 0 40px ${acc}66`}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow=`0 0 28px ${acc}44`}}
              >View all work <ArrowUpRight size={14} strokeWidth={2.5} /></Link>
            </div>
          </div>

          {/* ── SHOWCASE ROW ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "clamp(72px,8vw,105px) 1fr",
            gap: "clamp(0.75rem,1.5vw,1.5rem)",
            minHeight: 0,
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(30px)",
            transition: "opacity 0.9s ease 0.35s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s",
          }}>

            {/* LEFT: thumbnail strip */}
            <div style={{
              display: "flex", flexDirection: "column",
              gap: "clamp(0.3rem,0.6vw,0.5rem)",
              overflowY: "hidden",
              WebkitMaskImage: "linear-gradient(180deg,transparent 0%,black 5%,black 95%,transparent 100%)",
              maskImage: "linear-gradient(180deg,transparent 0%,black 5%,black 95%,transparent 100%)",
            }}>
              {PROJECTS.map((p, i) => (
                <button key={p.id}
                  onClick={() => {
                    // Jump scroll position to match this index
                    const section = sectionRef.current
                    if (!section) return
                    const st = ScrollTrigger.getById("featured-work-scroll")
                    if (!st) return
                    const targetProgress = i / (PROJECTS.length - 1)
                    const scrollStart = st.start
                    const scrollEnd   = st.end
                    const target = scrollStart + targetProgress * (scrollEnd - scrollStart)
                    window.scrollTo({ top: target, behavior: "smooth" })
                  }}
                  style={{
                    all: "unset", cursor: "pointer", display: "block",
                    position: "relative", overflow: "hidden",
                    aspectRatio: "16/10", flexShrink: 0,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    transform: i === activeIdx ? "scale(1.04)" : "scale(1)",
                    // Active: glowing accent square outline
                    outline: i === activeIdx ? `2px solid ${acc}` : "2px solid transparent",
                    outlineOffset: "0px",
                    boxShadow: i === activeIdx ? `0 0 16px ${acc}66, inset 0 0 0 0px ${acc}` : "none",
                  }}
                >
                  {/* Raw image — no overlay */}
                  <img src={imgSrcs[i]} alt={p.title}
                    onError={() => setFallback(i)}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover", display: "block",
                      // Inactive: desaturate slightly. Active: full color.
                      filter: i === activeIdx
                        ? "brightness(1) saturate(1)"
                        : "brightness(0.38) saturate(0.25)",
                      transition: "filter 0.45s ease",
                    }}
                  />

                  {/* Active: corner accent marks (no overlay, just corner L-brackets) */}
                  {i === activeIdx && (
                    <>
                      <svg style={{ position:"absolute", top:0, left:0 }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M0 10 L0 0 L10 0" stroke={acc} strokeWidth="1.5"/>
                      </svg>
                      <svg style={{ position:"absolute", top:0, right:0 }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M14 10 L14 0 L4 0" stroke={acc} strokeWidth="1.5"/>
                      </svg>
                      <svg style={{ position:"absolute", bottom:0, left:0 }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M0 4 L0 14 L10 14" stroke={acc} strokeWidth="1.5"/>
                      </svg>
                      <svg style={{ position:"absolute", bottom:0, right:0 }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M14 4 L14 14 L4 14" stroke={acc} strokeWidth="1.5"/>
                      </svg>
                      {/* Index label bottom-right */}
                      <div style={{
                        position: "absolute", bottom: "0.2rem", right: "0.3rem",
                        fontFamily: "var(--font-mono)", fontSize: "0.38rem",
                        letterSpacing: "0.1em", color: acc,
                      }}>{p.id}</div>
                    </>
                  )}
                </button>
              ))}

              <Link href="/portfolio" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "0.25rem", marginTop: "0.35rem", padding: "0.45rem",
                border: "1px solid var(--color-surface-border)",
                fontFamily: "var(--font-mono)", fontSize: "0.4rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--color-text-muted)", textDecoration: "none",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.color=acc;e.currentTarget.style.borderColor=acc}}
              onMouseLeave={e=>{e.currentTarget.style.color="var(--color-text-muted)";e.currentTarget.style.borderColor="var(--color-surface-border)"}}
              >ALL <ArrowUpRight size={7} /></Link>
            </div>

            {/* RIGHT: large preview */}
            <Link href={active.href} style={{
              display: "block", position: "relative", overflow: "hidden",
              cursor: "none", textDecoration: "none",
              // Glowing animated border using box-shadow + outline
              outline: `1.5px solid ${acc}55`,
              boxShadow: `0 0 0 1px ${acc}22, 0 0 32px ${acc}33, 0 0 80px ${acc}18`,
              transition: "box-shadow 0.5s ease",
            }}
            onMouseEnter={() => setTooltip(t=>({...t,visible:true}))}
            onMouseLeave={() => setTooltip(t=>({...t,visible:false}))}
            onMouseMove={onMouseMove}
            >
              {/* Corner bracket decorations on the main image — like AboutStory */}
              <svg style={{ position:"absolute", top:-1, left:-1, zIndex:10 }} width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M0 24 L0 0 L24 0" stroke={acc} strokeWidth="1.8"/>
              </svg>
              <svg style={{ position:"absolute", top:-1, right:-1, zIndex:10 }} width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M32 24 L32 0 L8 0" stroke={acc} strokeWidth="1.8"/>
              </svg>
              <svg style={{ position:"absolute", bottom:-1, left:-1, zIndex:10 }} width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M0 8 L0 32 L24 32" stroke={acc} strokeWidth="1.8"/>
              </svg>
              <svg style={{ position:"absolute", bottom:-1, right:-1, zIndex:10 }} width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M32 8 L32 32 L8 32" stroke={acc} strokeWidth="1.8"/>
              </svg>

              {/* Crossfade images — NO overlay so images are seen fully */}
              {PROJECTS.map((p, i) => (
                <img key={p.id} src={imgSrcs[i]} alt={p.title}
                  onError={() => setFallback(i)}
                  style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    objectFit: "cover", display: "block",
                    opacity: i === activeIdx ? 1 : 0,
                    transition: "opacity 0.65s cubic-bezier(0.16,1,0.3,1)",
                    animation: i === activeIdx ? "featuredZoom 10s ease-in-out infinite alternate" : "none",
                    willChange: "transform,opacity",
                  }}
                />
              ))}

              {/* Minimal bottom info strip — dark gradient only at very bottom so image shows */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
                background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 50%, transparent 100%)",
                zIndex: 2,
              }} />

              {/* Info overlay */}
              <div style={{
                position: "absolute", inset: 0, zIndex: 3,
                display: "flex", flexDirection: "column",
                justifyContent: "space-between",
                padding: "clamp(0.9rem,2vw,1.75rem)",
              }}>
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.52rem",
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: acc, background: `${acc}18`,
                    border: `1px solid ${acc}44`, padding: "0.18rem 0.5rem",
                    backdropFilter: "blur(8px)",
                  }}>{active.type}</span>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.52rem",
                    color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em",
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
                    padding: "0.18rem 0.5rem",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}>
                    <span style={{ color: acc }}>{String(activeIdx+1).padStart(2,"0")}</span>
                    <span>/</span>
                    <span>{String(PROJECTS.length).padStart(2,"0")}</span>
                  </div>
                </div>

                {/* Bottom */}
                <div>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.48rem",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.5)", margin: "0 0 0.35rem",
                  }}>{active.category} · {active.year}</p>

                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.8rem,4.5vw,4rem)",
                    fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9,
                    margin: "0 0 0.65rem",
                    color: "transparent",
                    WebkitTextStroke: "2px rgba(255,255,255,0.9)",
                    textShadow: `0 0 60px ${acc}44`,
                  }}>{active.title}</h3>

                  <div style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    fontFamily: "var(--font-mono)", fontSize: "0.42rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.22)",
                  }}>
                    <div style={{ width: 14, height: 1, background: acc }} />
                    {activeIdx < PROJECTS.length - 1 ? "Scroll to advance" : "Scroll to continue"}
                  </div>
                </div>
              </div>

              {/* Progress dots bottom-right */}
              <div style={{
                position: "absolute",
                bottom: "clamp(0.7rem,1.5vw,1.2rem)",
                right: "clamp(0.7rem,1.5vw,1.2rem)",
                display: "flex", gap: 4, zIndex: 4,
              }}>
                {PROJECTS.map((_, i) => (
                  <div key={i} style={{
                    width: i === activeIdx ? 18 : 5, height: 5,
                    background: i === activeIdx ? acc : "rgba(255,255,255,0.18)",
                    transition: "width 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s ease",
                    boxShadow: i === activeIdx ? `0 0 8px ${acc}` : "none",
                  }} />
                ))}
              </div>

              {/* Bottom accent glow line */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 2, zIndex: 5,
                background: `linear-gradient(90deg,transparent,${acc},transparent)`,
                boxShadow: `0 0 12px ${acc}`,
                opacity: 0.7,
              }} />
            </Link>
          </div>

          {/* ── BOTTOM CTA ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem",
            opacity: inView ? 1 : 0,
            transition: "opacity 0.8s ease 0.7s",
          }}>
            <div style={{ flex:1, height:"1px", background:`linear-gradient(90deg,transparent,var(--color-surface-border))` }} />
            <Link href="/portfolio" style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(0.9rem,2vw,1.35rem)",
              fontWeight: 700, letterSpacing: "-0.02em",
              color: "var(--color-text-primary)", textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: "0.75rem",
              transition: "gap 0.3s ease, color 0.2s ease", cursor: "none",
            }}
            onMouseEnter={e=>{e.currentTarget.style.gap="1.5rem";e.currentTarget.style.color=acc}}
            onMouseLeave={e=>{e.currentTarget.style.gap="0.75rem";e.currentTarget.style.color="var(--color-text-primary)"}}
            >See everything I&apos;ve built <ArrowUpRight size={16} strokeWidth={2} /></Link>
            <div style={{ flex:1, height:"1px", background:`linear-gradient(90deg,var(--color-surface-border),transparent)` }} />
          </div>
        </div>

        <style>{`
          @keyframes featuredZoom {
            from { transform: scale(1); }
            to   { transform: scale(1.06); }
          }
          @keyframes nudgeDown {
            0%,100% { transform: translateY(0); }
            50%      { transform: translateY(4px); }
          }

          /* ── Mobile: stack layout ── */
          @media (max-width: 640px) {
            /* header single col */
          }
        `}</style>
      </section>
    </>
  )
}