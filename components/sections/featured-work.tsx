"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"
import { ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  { id:"01", title:"IntelliMark",      category:"AI · EdTech",        type:"WEB APP", tags:["AI","EDTECH"],         year:"2024", image:"/projects/intellimark.png",   href:"/portfolio" },
  { id:"02", title:"TabooTalks",       category:"Social · Web App",   type:"WEB APP", tags:["SOCIAL","APP"],        year:"2024", image:"/projects/tabootalks.png",    href:"/portfolio" },
  { id:"03", title:"H-mex Health",     category:"HealthTech · AI",    type:"WEB APP", tags:["HEALTHTECH","AI"],     year:"2024", image:"/projects/hmex.png",          href:"/portfolio" },
  { id:"04", title:"WerEntOnline",     category:"PropTech · Web",     type:"WEB APP", tags:["PROPTECH","PLATFORM"], year:"2024", image:"/projects/werentonline.png",  href:"/portfolio" },
  { id:"05", title:"FarmSense",        category:"AgriTech · Web",     type:"WEB APP", tags:["AGRITECH","IOT"],      year:"2024", image:"/projects/farmsense.png",     href:"/portfolio" },
  { id:"06", title:"DjAfro StreamBox", category:"Mobile · Streaming", type:"MOBILE",  tags:["MOBILE","STREAMING"], year:"2024", image:"/projects/djafro.png",        href:"/portfolio" },
  { id:"07", title:"Softrinx",         category:"SaaS · Enterprise",  type:"SAAS",    tags:["SAAS","ENTERPRISE"],  year:"2025", image:"/projects/softrinx.png",      href:"/portfolio" },
  { id:"08", title:"Teach2Give",       category:"EdTech · Web",       type:"WEB APP", tags:["EDTECH","WEB"],       year:"2025", image:"/projects/teach2give.png",    href:"/portfolio" },
]

const FALLBACKS = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=85",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=85",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&q=85",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=85",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85",
  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&q=85",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=85",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=85",
]

const IMAGE_VH = 78
const GAP_VH   = 100 - IMAGE_VH

function CursorTooltip({ visible, x, y, accent }: { visible: boolean; x: number; y: number; accent: string }) {
  return (
    <div style={{
      position:"fixed", left:x, top:y,
      transform:"translate(-50%,-50%)",
      pointerEvents:"none", zIndex:9999,
      opacity: visible ? 1 : 0,
      scale: visible ? "1" : "0.4",
      transition:"opacity 0.18s ease, scale 0.28s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      <div style={{
        background:accent, color:"#000",
        fontFamily:"var(--font-mono)", fontSize:"0.52rem",
        fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase",
        padding:"0.5rem 1rem", borderRadius:"9999px",
        whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:"0.4rem",
        boxShadow:`0 0 24px ${accent}77`,
      }}>
        View Project <ArrowUpRight size={10} strokeWidth={3}/>
      </div>
    </div>
  )
}

function PaintLine({ text, outline, acc, delay, painted, revealed, fontSize }: {
  text: string; outline: boolean; acc: string; delay: number
  painted: boolean; revealed: boolean; fontSize?: string
}) {
  return (
    <div style={{ position:"relative", overflow:"hidden", display:"block" }}>
      <span style={{
        display:"block",
        fontFamily:"var(--font-display)",
        fontSize: fontSize ?? "clamp(1.9rem,3.8vw,3.2rem)",
        fontWeight:800, letterSpacing:"-0.045em", lineHeight:0.9,
        color: outline ? "transparent" : "var(--color-text-primary)",
        WebkitTextStroke: outline ? `1.5px ${acc}` : undefined,
        textShadow: outline ? `0 0 50px ${acc}33` : undefined,
      }}>{text}</span>
      <div style={{
        position:"absolute", inset:0, background:acc, zIndex:3,
        transform: !painted ? "translateX(-101%)" : revealed ? "translateX(101%)" : "translateX(0%)",
        transition: !painted ? "none"
          : revealed ? `transform 0.55s cubic-bezier(0.76,0,0.24,1) ${delay+0.06}s`
          : `transform 0.55s cubic-bezier(0.76,0,0.24,1) ${delay}s`,
      }}/>
      <div style={{
        position:"absolute", inset:0, background:"rgba(255,255,255,0.13)", zIndex:2,
        transform: !painted ? "translateX(-101%)" : revealed ? "translateX(101%)" : "translateX(0%)",
        transition: !painted ? "none"
          : revealed ? `transform 0.55s cubic-bezier(0.76,0,0.24,1) ${delay+0.13}s`
          : `transform 0.55s cubic-bezier(0.76,0,0.24,1) ${delay+0.08}s`,
      }}/>
    </div>
  )
}

export function FeaturedWork() {
  const { theme } = useTheme()
  const acc    = theme.colors.accent
  const isDark = theme.mode === "dark"

  const wrapRef   = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const trackRef  = useRef<HTMLDivElement>(null)

  const [activeIdx, setActiveIdx] = useState(0)
  const [fallbacks, setFallbacks] = useState<Record<number, string>>({})
  const [tooltip,   setTooltip]   = useState({ visible:false, x:0, y:0 })
  const [mounted,   setMounted]   = useState(false)
  const [painted,   setPainted]   = useState(false)
  const [revealed,  setRevealed]  = useState(false)

  const getSrc = (i: number) => fallbacks[i] ?? PROJECTS[i].image
  const setFb  = (i: number) => setFallbacks(f => ({ ...f, [i]: FALLBACKS[i % FALLBACKS.length] }))

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const t1 = setTimeout(() => setPainted(true),   80)
    const t2 = setTimeout(() => setRevealed(true), 1050)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const wrap   = wrapRef.current
    const sticky = stickyRef.current
    const track  = trackRef.current
    if (!wrap || !sticky || !track) return

    const n = PROJECTS.length
    const getTrackDistance = () => (n - 1) * window.innerHeight

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true })
      tl.to(track, { y: () => -getTrackDistance(), ease: "none" })
      ScrollTrigger.create({
        id:        "fw-pin",
        trigger:   wrap,
        start:     "top top",
        end:       () => `+=${getTrackDistance()}`,
        pin:       sticky,
        anticipatePin: 1,
        scrub:     1.0,
        animation: tl,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const idx = Math.min(Math.round(self.progress * (n - 1)), n - 1)
          setActiveIdx(idx)
        },
      })
    }, wrapRef)

    // ── NUCLEAR KILL — must kill(true) BEFORE ctx.revert() ──────────────────
    // kill(true) removes pin CSS while DOM nodes still exist.
    // ctx.revert() alone crashes with removeChild on navigation.
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill(true))
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [mounted])

  const active = PROJECTS[activeIdx]

  return (
    <>
      <style jsx global>{`
        @media (max-width: 768px) {
          .fw-desktop { display: none !important; }
          .fw-mobile  { display: flex !important; }
        }
        @media (min-width: 769px) {
          .fw-mobile { display: none !important; }
        }
      `}</style>

      {/* ── DESKTOP ── */}
      <div className="fw-desktop">
        <CursorTooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y} accent={acc} />

        <div ref={wrapRef}>
          <div ref={stickyRef} style={{
            position:"sticky", top:0,
            height:"100svh", overflow:"hidden",
            background:"var(--color-bg)",
            display:"grid",
            gridTemplateColumns:"clamp(200px,26vw,360px) 1fr",
          }}>

            {/* LEFT */}
            <div style={{
              display:"flex", flexDirection:"column",
              justifyContent:"space-between",
              padding:"clamp(4.5rem,8vw,6.5rem) clamp(1.25rem,3vw,2.25rem) clamp(2rem,3.5vw,2.75rem)",
              borderRight:`1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
              position:"relative", zIndex:2,
              overflowY:"auto",
            }}>
              <div>
                <div style={{
                  display:"flex", alignItems:"center", gap:"0.55rem", marginBottom:"0.9rem",
                  opacity:mounted?1:0, transform:mounted?"none":"translateY(14px)",
                  transition:"all 0.6s ease 0.1s",
                }}>
                  <div style={{ width:18, height:"1px", background:acc }}/>
                  <span style={{
                    fontFamily:"var(--font-mono)", fontSize:"0.52rem",
                    letterSpacing:"0.16em", textTransform:"uppercase", color:acc,
                  }}>Selected Work</span>
                </div>

                <div style={{
                  marginBottom:"clamp(0.9rem,1.8vw,1.4rem)",
                  opacity:mounted?1:0, transform:mounted?"none":"translateY(22px)",
                  transition:"all 0.8s cubic-bezier(0.16,1,0.3,1) 0.18s",
                }}>
                  <PaintLine text="Featured" outline={false} acc={acc} delay={0}    painted={painted} revealed={revealed}/>
                  <PaintLine text="Work."    outline={true}  acc={acc} delay={0.18} painted={painted} revealed={revealed}/>
                </div>

                <p style={{
                  fontFamily:"var(--font-body)",
                  fontSize:"clamp(0.72rem,0.95vw,0.83rem)",
                  color:"var(--color-text-muted)", lineHeight:1.7,
                  margin:"0 0 clamp(1.25rem,2.5vw,2rem)", maxWidth:260,
                  opacity:mounted?1:0, transform:mounted?"none":"translateY(12px)",
                  transition:"all 0.7s ease 0.32s",
                }}>
                  Every project ships with intention. The details most teams skip are the ones I care about most.
                </p>

                <div style={{ transition:"all 0.3s ease" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.45rem", marginBottom:"0.45rem" }}>
                    <span style={{
                      fontFamily:"var(--font-mono)", fontSize:"0.46rem",
                      letterSpacing:"0.14em", textTransform:"uppercase",
                      color:acc, border:`1px solid ${acc}55`, padding:"0.14rem 0.42rem",
                    }}>{active.type}</span>
                    <span style={{
                      fontFamily:"var(--font-mono)", fontSize:"0.46rem",
                      letterSpacing:"0.1em", color:"var(--color-text-muted)",
                    }}>{active.year}</span>
                  </div>
                  <h3 style={{
                    fontFamily:"var(--font-display)",
                    fontSize:"clamp(1.2rem,2.4vw,2rem)",
                    fontWeight:800, letterSpacing:"-0.04em", lineHeight:1,
                    color:"var(--color-text-primary)", margin:"0 0 0.35rem",
                  }}>{active.title}</h3>
                  <p style={{
                    fontFamily:"var(--font-mono)", fontSize:"0.46rem",
                    letterSpacing:"0.1em", textTransform:"uppercase",
                    color:"var(--color-text-muted)", margin:"0 0 0.55rem",
                  }}>{active.category}</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"0.25rem" }}>
                    {active.tags.map((tag, ti) => (
                      <span key={ti} style={{
                        fontFamily:"var(--font-mono)", fontSize:"0.42rem",
                        letterSpacing:"0.11em", color:"var(--color-text-muted)",
                      }}>[{tag}]{ti < active.tags.length-1 ? " —" : ""}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              <div style={{
                display:"flex", flexDirection:"column", gap:"0.38rem",
                opacity:mounted?1:0, transition:"opacity 0.7s ease 0.5s",
              }}>
                {PROJECTS.map((p, i) => (
                  <div key={p.id}
                    style={{ display:"flex", alignItems:"center", gap:"0.45rem", cursor:"pointer" }}
                    onClick={() => {
                      const st = ScrollTrigger.getById("fw-pin")
                      if (!st) return
                      const t = st.start + (i / (PROJECTS.length - 1)) * (st.end - st.start)
                      window.scrollTo({ top: t, behavior:"smooth" })
                    }}
                  >
                    <div style={{
                      width:52, height:33, flexShrink:0, overflow:"hidden",
                      outline: i === activeIdx ? `1.5px solid ${acc}` : "1.5px solid transparent",
                      transition:"outline-color 0.3s, transform 0.3s",
                      transform: i === activeIdx ? "scale(1.05)" : "scale(1)",
                    }}>
                      <img src={getSrc(i)} alt={p.title} onError={()=>setFb(i)}
                        style={{
                          width:"100%", height:"100%", objectFit:"cover", display:"block",
                          filter: i === activeIdx ? "none" : "brightness(0.28) saturate(0.15)",
                          transition:"filter 0.4s ease",
                        }}
                      />
                    </div>
                    <div style={{
                      width:5, height:5, flexShrink:0,
                      background: i === activeIdx ? acc : "transparent",
                      border:`1px solid ${i === activeIdx ? acc : "rgba(255,255,255,0.15)"}`,
                      transition:"all 0.3s ease",
                      boxShadow: i === activeIdx ? `0 0 8px ${acc}` : "none",
                    }}/>
                  </div>
                ))}
              </div>

              {/* Stats + CTA */}
              <div style={{ opacity:mounted?1:0, transition:"opacity 0.7s ease 0.6s" }}>
                <div style={{ display:"flex", gap:"1.5rem", marginBottom:"1.1rem" }}>
                  {[{n:20,l:"Projects"},{n:7,l:"Companies"},{n:3,l:"Years"}].map(({n,l}) => (
                    <div key={l}>
                      <div style={{
                        fontFamily:"var(--font-display)", fontSize:"clamp(1.2rem,2.2vw,1.8rem)",
                        fontWeight:800, letterSpacing:"-0.05em", color:acc, lineHeight:1,
                      }}>{n}+</div>
                      <div style={{
                        fontFamily:"var(--font-mono)", fontSize:"0.42rem",
                        letterSpacing:"0.13em", textTransform:"uppercase",
                        color:"var(--color-text-muted)", marginTop:"0.18rem",
                      }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:"0.55rem" }}>
                  <Link href="/portfolio" style={{
                    display:"inline-flex", alignItems:"center", gap:"0.4rem",
                    fontFamily:"var(--font-mono)", fontSize:"0.5rem",
                    fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
                    color:"#000", background:acc, padding:"0.55rem 1rem",
                    textDecoration:"none", transition:"opacity 0.2s",
                  }}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.opacity="0.85"}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.opacity="1"}
                  >VIEW ALL <ArrowUpRight size={11} strokeWidth={2.5}/></Link>
                  <Link href="/contact" style={{
                    display:"inline-flex", alignItems:"center", justifyContent:"center",
                    fontFamily:"var(--font-mono)", fontSize:"0.7rem", fontWeight:700,
                    color:acc, border:`1px solid ${acc}55`,
                    width:36, textDecoration:"none", transition:"border-color 0.2s",
                  }}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor=acc}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor=`${acc}55`}
                  >+</Link>
                </div>
              </div>
            </div>

            {/* RIGHT — image track */}
            <div
              style={{ position:"relative", overflow:"hidden" }}
              onMouseEnter={() => setTooltip(t=>({...t,visible:true}))}
              onMouseLeave={() => setTooltip(t=>({...t,visible:false}))}
              onMouseMove={e => setTooltip(t=>({...t, x:e.clientX, y:e.clientY}))}
            >
              <div ref={trackRef} style={{ position:"absolute", top:0, left:0, right:0, willChange:"transform" }}>
                {PROJECTS.map((p, i) => (
                  <div key={p.id}>
                    <Link href={p.href} style={{
                      display:"block", height:`${IMAGE_VH}vh`,
                      position:"relative", overflow:"hidden",
                      textDecoration:"none", cursor:"none",
                    }}>
                      <img src={getSrc(i)} alt={p.title} onError={() => setFb(i)}
                        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                      />
                      <div style={{
                        position:"absolute", bottom:0, left:0, right:0,
                        padding:"clamp(0.9rem,1.8vw,1.5rem)",
                        background:"linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
                        display:"flex", justifyContent:"space-between", alignItems:"flex-end",
                        zIndex:2,
                      }}>
                        <span style={{
                          fontFamily:"var(--font-display)",
                          fontSize:"clamp(1rem,2.2vw,1.85rem)",
                          fontWeight:800, letterSpacing:"-0.03em",
                          color:"rgba(255,255,255,0.92)", textTransform:"uppercase",
                        }}>{p.title}</span>
                        <div style={{
                          fontFamily:"var(--font-mono)", fontSize:"0.48rem",
                          letterSpacing:"0.12em", color:"rgba(255,255,255,0.5)",
                          display:"flex", gap:"0.3rem", alignItems:"center",
                        }}>
                          {p.tags.map((tag, ti) => (
                            <span key={ti}>[{tag}]{ti < p.tags.length-1 ? " — " : ""}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{
                        position:"absolute", top:"clamp(0.7rem,1.2vw,1rem)", right:"clamp(0.7rem,1.2vw,1rem)",
                        fontFamily:"var(--font-mono)", fontSize:"0.48rem",
                        letterSpacing:"0.12em", color:"rgba(255,255,255,0.4)",
                        background:"rgba(0,0,0,0.45)", backdropFilter:"blur(8px)",
                        padding:"0.18rem 0.45rem",
                        border:"1px solid rgba(255,255,255,0.1)",
                        zIndex:2,
                      }}>
                        <span style={{ color:acc }}>{p.id}</span> / {String(PROJECTS.length).padStart(2,"0")}
                      </div>
                    </Link>
                    {i < PROJECTS.length - 1 && (
                      <div style={{
                        height:`${GAP_VH}vh`,
                        background:"var(--color-bg)",
                        display:"flex", alignItems:"center",
                        padding:"0 clamp(0.9rem,2vw,1.75rem)",
                        position:"relative",
                      }}>
                        <div style={{
                          width:"100%",
                          display:"flex", justifyContent:"space-between", alignItems:"center",
                          borderTop:`1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
                          paddingTop:"0.6rem",
                        }}>
                          <span style={{
                            fontFamily:"var(--font-mono)", fontSize:"0.42rem",
                            letterSpacing:"0.14em", textTransform:"uppercase",
                            color:"var(--color-text-muted)", opacity:0.4,
                          }}>Next</span>
                          <span style={{
                            fontFamily:"var(--font-mono)", fontSize:"0.42rem",
                            letterSpacing:"0.14em", textTransform:"uppercase",
                            color:acc, opacity:0.5,
                          }}>{PROJECTS[i+1]?.title}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <MobileLayout
        acc={acc} isDark={isDark}
        getSrc={getSrc} setFb={setFb}
        painted={painted} revealed={revealed} mounted={mounted}
      />
    </>
  )
}

function MobileLayout({ acc, isDark, getSrc, setFb, painted, revealed, mounted }: {
  acc: string; isDark: boolean
  getSrc: (i: number) => string; setFb: (i: number) => void
  painted: boolean; revealed: boolean; mounted: boolean
}) {
  const [activeIdx, setActiveIdx] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const advance = (dir: number) =>
    setActiveIdx(prev => Math.max(0, Math.min(PROJECTS.length - 1, prev + dir)))

  const active = PROJECTS[activeIdx]

  return (
    <div className="fw-mobile" style={{
      flexDirection:"column",
      background:"var(--color-bg)",
      padding:"clamp(3rem,8vw,5rem) clamp(1.25rem,5vw,2rem) clamp(2rem,5vw,3rem)",
    }}>
      <div style={{ marginBottom:"clamp(1.5rem,5vw,2.5rem)" }}>
        <div style={{
          display:"flex", alignItems:"center", gap:"0.55rem", marginBottom:"0.9rem",
          opacity:mounted?1:0, transition:"opacity 0.6s ease 0.1s",
        }}>
          <div style={{ width:18, height:"1px", background:acc }}/>
          <span style={{
            fontFamily:"var(--font-mono)", fontSize:"0.52rem",
            letterSpacing:"0.16em", textTransform:"uppercase", color:acc,
          }}>Selected Work</span>
        </div>
        <PaintLine text="Featured" outline={false} acc={acc} delay={0}    painted={painted} revealed={revealed} fontSize="clamp(2.4rem,10vw,4rem)"/>
        <PaintLine text="Work."    outline={true}  acc={acc} delay={0.18} painted={painted} revealed={revealed} fontSize="clamp(2.4rem,10vw,4rem)"/>
      </div>

      <Link href={active.href} style={{
        display:"block", position:"relative", overflow:"hidden",
        aspectRatio:"4/3", textDecoration:"none", marginBottom:"0.75rem",
      }}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchStartX.current === null) return
        const diff = touchStartX.current - e.changedTouches[0].clientX
        if (Math.abs(diff) > 40) advance(diff > 0 ? 1 : -1)
        touchStartX.current = null
      }}
      >
        {PROJECTS.map((p, i) => (
          <img key={p.id} src={getSrc(i)} alt={p.title}
            onError={() => setFb(i)}
            style={{
              position:"absolute", inset:0,
              width:"100%", height:"100%",
              objectFit:"cover", display:"block",
              opacity: i===activeIdx ? 1 : 0,
              transition:"opacity 0.6s ease",
            }}
          />
        ))}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          padding:"1rem clamp(0.75rem,3vw,1.25rem)",
          background:"linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
          zIndex:2,
        }}>
          <span style={{
            fontFamily:"var(--font-display)",
            fontSize:"clamp(1.2rem,5vw,1.8rem)",
            fontWeight:800, letterSpacing:"-0.03em",
            color:"rgba(255,255,255,0.92)", textTransform:"uppercase",
            display:"block",
          }}>{active.title}</span>
          <span style={{
            fontFamily:"var(--font-mono)", fontSize:"0.45rem",
            letterSpacing:"0.1em", textTransform:"uppercase",
            color:acc, display:"block", marginTop:"0.2rem",
          }}>{active.category} · {active.year}</span>
        </div>
        <div style={{
          position:"absolute", top:"0.75rem", right:"0.75rem",
          fontFamily:"var(--font-mono)", fontSize:"0.45rem",
          letterSpacing:"0.1em", color:"rgba(255,255,255,0.4)",
          background:"rgba(0,0,0,0.5)", backdropFilter:"blur(6px)",
          padding:"0.15rem 0.4rem",
          border:"1px solid rgba(255,255,255,0.1)",
          zIndex:2,
        }}>
          <span style={{ color:acc }}>{active.id}</span> / {String(PROJECTS.length).padStart(2,"0")}
        </div>
      </Link>

      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:"1.25rem",
      }}>
        <button onClick={() => advance(-1)} disabled={activeIdx===0} style={{
          all:"unset", cursor:"pointer",
          width:44, height:44,
          border:`1px solid ${activeIdx===0 ? "rgba(255,255,255,0.1)" : acc}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          color: activeIdx===0 ? "rgba(255,255,255,0.15)" : acc,
          fontSize:"1.1rem", transition:"all 0.2s ease",
        }}>←</button>

        <div style={{ display:"flex", gap:6 }}>
          {PROJECTS.map((_,i) => (
            <div key={i} onClick={() => setActiveIdx(i)} style={{
              width: i===activeIdx ? 18 : 5, height:5,
              background: i===activeIdx ? acc : isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)",
              transition:"width 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s ease",
              boxShadow: i===activeIdx ? `0 0 8px ${acc}` : "none",
              cursor:"pointer",
            }}/>
          ))}
        </div>

        <button onClick={() => advance(1)} disabled={activeIdx===PROJECTS.length-1} style={{
          all:"unset", cursor:"pointer",
          width:44, height:44,
          border:`1px solid ${activeIdx===PROJECTS.length-1 ? "rgba(255,255,255,0.1)" : acc}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          color: activeIdx===PROJECTS.length-1 ? "rgba(255,255,255,0.15)" : acc,
          fontSize:"1.1rem",
          boxShadow: activeIdx===PROJECTS.length-1 ? "none" : `0 0 12px ${acc}44`,
        }}>→</button>
      </div>

      <div style={{
        display:"flex", gap:"0.4rem",
        overflowX:"auto", paddingBottom:"0.5rem",
        WebkitMaskImage:"linear-gradient(90deg,transparent 0%,black 6%,black 94%,transparent 100%)",
        maskImage:"linear-gradient(90deg,transparent 0%,black 6%,black 94%,transparent 100%)",
        scrollbarWidth:"none",
      }}>
        {PROJECTS.map((p, i) => (
          <div key={p.id} onClick={() => setActiveIdx(i)} style={{
            width:64, height:42, flexShrink:0, overflow:"hidden", cursor:"pointer",
            outline: i===activeIdx ? `1.5px solid ${acc}` : "1.5px solid transparent",
            transition:"outline-color 0.3s, transform 0.3s",
            transform: i===activeIdx ? "scale(1.05)" : "scale(1)",
          }}>
            <img src={getSrc(i)} alt={p.title} onError={() => setFb(i)}
              style={{
                width:"100%", height:"100%", objectFit:"cover", display:"block",
                filter: i===activeIdx ? "none" : "brightness(0.28) saturate(0.15)",
                transition:"filter 0.4s ease",
              }}
            />
          </div>
        ))}
      </div>

      <div style={{
        display:"flex", gap:"clamp(1rem,5vw,2rem)", alignItems:"center",
        marginTop:"clamp(1.5rem,5vw,2rem)",
        paddingTop:"clamp(1rem,3vw,1.5rem)",
        borderTop:`1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
        flexWrap:"wrap",
      }}>
        {[{n:20,l:"Projects"},{n:7,l:"Companies"},{n:3,l:"Years"}].map(({n,l}) => (
          <div key={l}>
            <div style={{
              fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,6vw,2rem)",
              fontWeight:800, letterSpacing:"-0.05em", color:acc, lineHeight:1,
            }}>{n}+</div>
            <div style={{
              fontFamily:"var(--font-mono)", fontSize:"0.42rem",
              letterSpacing:"0.13em", textTransform:"uppercase",
              color:"var(--color-text-muted)", marginTop:"0.18rem",
            }}>{l}</div>
          </div>
        ))}
        <Link href="/portfolio" style={{
          marginLeft:"auto",
          display:"inline-flex", alignItems:"center", gap:"0.4rem",
          fontFamily:"var(--font-mono)", fontSize:"0.5rem",
          fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
          color:"#000", background:acc, padding:"0.55rem 1rem",
          textDecoration:"none",
        }}>VIEW ALL <ArrowUpRight size={11} strokeWidth={2.5}/></Link>
      </div>
    </div>
  )
}