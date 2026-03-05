"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"

const SERVICES = [
  {
    num: "01",
    title: "Full‑Stack",
    sub: "Web Development",
    desc: "Next.js to Node.js. Pixel-perfect UI to battle-tested backend. I architect and ship the whole thing — auth, APIs, DB, deployment. No handoffs.",
    tags: ["Next.js", "React", "Node.js", "PostgreSQL", "AWS"],
    metric: "20+ shipped",
    metricSub: "products",
  },
  {
    num: "02",
    title: "Mobile",
    sub: "iOS & Android",
    desc: "Cross-platform apps that feel native. Optimised for low-bandwidth African networks. DjAfro hit 1,000+ downloads on the Play Store.",
    tags: ["React Native", "Flutter", "Dart"],
    metric: "1k+",
    metricSub: "downloads",
  },
  {
    num: "03",
    title: "API Design",
    sub: "& Integration",
    desc: "RESTful and GraphQL APIs designed for scale from day one. Docs, rate limiting, auth, webhooks — production-hardened, not hacked together.",
    tags: ["REST", "GraphQL", "TypeScript", "Auth"],
    metric: "7+",
    metricSub: "integrations",
  },
  {
    num: "04",
    title: "Cloud",
    sub: "& DevOps",
    desc: "AWS, Docker, GitHub Actions. I write infrastructure that stays up under pressure. CI/CD that deploys in minutes, not days.",
    tags: ["AWS", "Docker", "GitHub Actions", "Linux"],
    metric: "99.9%",
    metricSub: "uptime",
  },
  {
    num: "05",
    title: "AI & ML",
    sub: "Integration",
    desc: "Real AI — health risk models, adaptive learning engines, predictive analytics. Python pipelines and LLM integrations that change what your product can do.",
    tags: ["Python", "TensorFlow", "OpenAI"],
    metric: "3",
    metricSub: "AI products",
  },
  {
    num: "06",
    title: "Technical",
    sub: "Co‑Founding",
    desc: "I've co-founded two companies. I can own your architecture, your first hire, and your MVP — as a technical partner with skin in the game.",
    tags: ["Architecture", "MVP", "Strategy"],
    metric: "2",
    metricSub: "startups",
  },
]

function useInView(threshold = 0.05) {
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

export function Services() {
  const { theme }               = useTheme()
  const { ref, inView }         = useInView()
  const [painted,  setPainted]  = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [active,   setActive]   = useState<number | null>(null)
  const [mouseX,   setMouseX]   = useState(0.5)
  const sectionRef              = useRef<HTMLDivElement>(null)
  const isDark = theme.mode === "dark"
  const accent = theme.colors.accent
  const radius = { none:"0px", sm:"4px", md:"10px", lg:"18px", full:"9999px" }[theme.radius]

  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setPainted(true),  60)
    const t2 = setTimeout(() => setRevealed(true), 680)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [inView])

  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current; if (!el) return
    const r  = el.getBoundingClientRect()
    setMouseX((e.clientX - r.left) / r.width)
  }, [])

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    el.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => el.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  const setRef = useCallback((el: HTMLDivElement | null) => {
    ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = el
    ;(sectionRef as React.MutableRefObject<HTMLDivElement | null>).current = el
  }, [ref])

  const paintBg = isDark ? "#07070F" : "#F6F6FC"
  const glowX = (mouseX * 100).toFixed(1)

  return (
    <section
      ref={setRef}
      style={{ position:"relative", background:"var(--color-bg)", overflow:"hidden" }}
    >
      {/* Moving ambient glow that follows mouse X */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
        background:`radial-gradient(ellipse 40% 100% at ${glowX}% 50%, ${accent}${isDark?"10":"07"} 0%, transparent 70%)`,
        transition:"background .15s ease",
      }}/>

      {/* Paint wipe — bottom reveal */}
      <div aria-hidden style={{
        position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
        background: paintBg,
        transform:  painted ? "translateY(-105%)" : "translateY(0%)",
        transition: painted ? "transform 0.9s cubic-bezier(0.86,0,0.07,1)" : "none",
        willChange:"transform",
      }}>
        <div style={{
          position:"absolute", bottom:-56, left:0, right:0, height:112,
          background: paintBg,
          clipPath:"polygon(0 100%,4% 40%,9% 0,18% 50%,26% 8%,35% 58%,44% 4%,52% 48%,60% 6%,68% 52%,76% 10%,84% 56%,92% 3%,97% 44%,100% 100%)",
        }}/>
      </div>

      <div style={{
        position:"relative", zIndex:5,
        opacity:   revealed ? 1 : 0,
        transition:"opacity .5s ease",
      }}>

        {/* ── Scrolling ticker ── */}
        <div style={{
          overflow:"hidden", whiteSpace:"nowrap",
          borderBottom:`1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
        }}>
          <div style={{ display:"inline-flex", animation:"svcTick 28s linear infinite" }}>
            {[...SERVICES,...SERVICES,...SERVICES].map((s,i) => (
              <span key={i} style={{
                display:"inline-flex", alignItems:"center", gap:".75rem",
                padding:".55rem clamp(1.5rem,2.5vw,2.5rem)",
                fontFamily:"var(--font-display)",
                fontSize:"clamp(.7rem,1vw,.8rem)",
                fontWeight:800, letterSpacing:"-.01em",
                color: i % 3 === 0 ? accent : "var(--color-text-muted)",
              }}>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:".55rem", opacity:.5 }}>{s.num}</span>
                {s.title} {s.sub}
                <span style={{ width:3, height:3, borderRadius:"50%", background:accent, opacity:.4, display:"inline-block", flexShrink:0 }}/>
              </span>
            ))}
          </div>
        </div>

        {/* ── Section label + heading ── */}
        <div style={{
          padding:"clamp(3.5rem,7vw,6rem) clamp(1.5rem,5vw,4rem) clamp(1.5rem,3vw,2.5rem)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:".875rem" }}>
            <span style={{ width:20, height:1, background:accent, display:"inline-block" }}/>
            <span style={{
              fontFamily:"var(--font-mono)", fontSize:"clamp(.55rem,.8vw,.68rem)",
              letterSpacing:".14em", textTransform:"uppercase", color:accent,
            }}>What I Do</span>
          </div>
          <h2 style={{
            fontFamily:"var(--font-display)",
            fontSize:"clamp(2.5rem,7.5vw,6.5rem)",
            fontWeight:800, letterSpacing:"-.04em", lineHeight:.88,
            color:"var(--color-text-primary)", margin:0,
          }}>
            Services I{" "}
            <em style={{ fontStyle:"italic", color:"transparent", WebkitTextStroke:`2px ${accent}` }}>Offer</em>
          </h2>
        </div>

        {/* ── Rows ── */}
        <div>
          {SERVICES.map((svc, i) => {
            const isActive = active === i
            const delay    = `${i * 0.055}s`
            const rowBg    = isDark
              ? isActive ? `color-mix(in srgb, ${accent} 7%, #07070F)` : "transparent"
              : isActive ? `color-mix(in srgb, ${accent} 5%, #F6F6FC)` : "transparent"

            return (
              <div
                key={svc.num}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                style={{
                  position:"relative",
                  borderTop:`1px solid ${isDark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.055)"}`,
                  background: rowBg,
                  transition:"background .35s ease",
                  cursor:"default",
                  opacity:  revealed ? 1 : 0,
                  transform:revealed ? "none" : "translateX(-16px)",
                  transition2:`opacity .55s ease ${delay}, transform .55s cubic-bezier(.16,1,.3,1) ${delay}`,
                } as any}
              >
                {/* Ink flood — expands from left on hover */}
                <div style={{
                  position:"absolute", inset:0, pointerEvents:"none",
                  background:`linear-gradient(90deg, ${accent}${isDark?"12":"0A"} 0%, transparent 60%)`,
                  transform: isActive ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin:"left",
                  transition:"transform .5s cubic-bezier(.16,1,.3,1)",
                }}/>

                {/* Left accent bar */}
                <div style={{
                  position:"absolute", top:0, left:0, bottom:0,
                  width: isActive ? "3px" : "0px",
                  background:accent,
                  transition:"width .2s ease",
                }}/>

                <div style={{
                  display:"grid",
                  gridTemplateColumns:"clamp(3rem,5vw,5rem) 1fr clamp(5rem,10vw,9rem)",
                  alignItems:"center",
                  gap:"clamp(.75rem,2vw,2rem)",
                  padding:`0 clamp(1.5rem,5vw,4rem)`,
                  minHeight: isActive
                    ? "clamp(8rem,14vw,12rem)"
                    : "clamp(5.5rem,9vw,8rem)",
                  transition:"min-height .4s cubic-bezier(.16,1,.3,1)",
                }}>

                  {/* Number — becomes huge watermark behind on hover */}
                  <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
                    <span style={{
                      fontFamily:"var(--font-mono)",
                      fontSize:"clamp(.55rem,.75vw,.65rem)",
                      letterSpacing:".08em",
                      color: isActive ? accent : "var(--color-text-muted)",
                      opacity: isActive ? 1 : 0.45,
                      transition:"all .2s ease",
                    }}>{svc.num}</span>

                    {/* Giant watermark */}
                    <span style={{
                      position:"absolute",
                      left:"50%", top:"50%",
                      transform:"translate(-50%,-50%)",
                      fontFamily:"var(--font-display)",
                      fontSize:"clamp(3rem,8vw,8rem)",
                      fontWeight:900,
                      color:"transparent",
                      WebkitTextStroke:`1px ${accent}${isActive ? "22" : "00"}`,
                      transition:"all .4s ease",
                      pointerEvents:"none",
                      userSelect:"none",
                      lineHeight:1, whiteSpace:"nowrap",
                    }}>{svc.num}</span>
                  </div>

                  {/* Title + expanding content */}
                  <div>
                    <div style={{ display:"flex", alignItems:"baseline", gap:".6rem", flexWrap:"wrap" }}>
                      <h3 style={{
                        fontFamily:"var(--font-display)",
                        fontSize: isActive
                          ? "clamp(2.2rem,6vw,5.5rem)"
                          : "clamp(1.6rem,4vw,3.5rem)",
                        fontWeight:800,
                        fontStyle: isActive ? "italic" : "normal",
                        letterSpacing:"-.035em", lineHeight:1,
                        color: isActive ? accent : "var(--color-text-primary)",
                        margin:0,
                        transition:"font-size .4s cubic-bezier(.16,1,.3,1), color .25s ease, font-style .2s ease",
                        whiteSpace:"nowrap",
                      }}>{svc.title}</h3>
                      <span style={{
                        fontFamily:"var(--font-display)",
                        fontSize: isActive
                          ? "clamp(1.1rem,3vw,2.5rem)"
                          : "clamp(1rem,2.5vw,2rem)",
                        fontWeight:800,
                        letterSpacing:"-.02em", lineHeight:1,
                        color:"var(--color-text-muted)",
                        transition:"font-size .4s cubic-bezier(.16,1,.3,1)",
                        whiteSpace:"nowrap",
                      }}>{svc.sub}</span>
                    </div>

                    {/* Desc + tags — slide open */}
                    <div style={{
                      maxHeight: isActive ? "10rem" : "0",
                      overflow:"hidden",
                      transition:"max-height .45s cubic-bezier(.16,1,.3,1)",
                    }}>
                      <p style={{
                        fontFamily:"var(--font-body)",
                        fontSize:"clamp(.78rem,1.1vw,.88rem)",
                        lineHeight:1.7,
                        color:"var(--color-text-secondary)",
                        margin:".625rem 0 .75rem",
                        maxWidth:580,
                      }}>{svc.desc}</p>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:".3rem" }}>
                        {svc.tags.map(t => (
                          <span key={t} style={{
                            fontFamily:"var(--font-mono)",
                            fontSize:"clamp(.46rem,.58vw,.56rem)",
                            letterSpacing:".06em",
                            color:accent,
                            border:`1px solid ${accent}40`,
                            padding:".14rem .48rem",
                            borderRadius:radius,
                          }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Metric + arrow */}
                  <div style={{
                    display:"flex", flexDirection:"column",
                    alignItems:"flex-end", gap:".3rem",
                    paddingRight:"clamp(.5rem,1vw,1rem)",
                  }}>
                    <span style={{
                      fontFamily:"var(--font-display)",
                      fontSize: isActive ? "clamp(1.5rem,3.5vw,2.75rem)" : "clamp(1.1rem,2.5vw,2rem)",
                      fontWeight:900, letterSpacing:"-.04em",
                      color: isActive ? accent : "var(--color-text-muted)",
                      transition:"all .35s cubic-bezier(.16,1,.3,1)",
                      lineHeight:1,
                    }}>{svc.metric}</span>
                    <span style={{
                      fontFamily:"var(--font-mono)",
                      fontSize:"clamp(.5rem,.65vw,.58rem)",
                      letterSpacing:".08em", textTransform:"uppercase",
                      color:"var(--color-text-muted)",
                      opacity: isActive ? 1 : 0.5,
                      transition:"opacity .25s ease",
                    }}>{svc.metricSub}</span>

                    {/* Arrow circle */}
                    <div style={{
                      marginTop:".5rem",
                      width:"clamp(28px,3vw,36px)", height:"clamp(28px,3vw,36px)",
                      borderRadius:"50%",
                      border:`1.5px solid ${isActive ? accent : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color: isActive ? accent : "var(--color-text-muted)",
                      transform: isActive ? "rotate(-45deg)" : "rotate(0deg)",
                      transition:"all .3s cubic-bezier(.16,1,.3,1)",
                    }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {/* Final border */}
          <div style={{ borderTop:`1px solid ${isDark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.055)"}` }}/>
        </div>

        <div style={{ height:"clamp(3rem,5vw,4rem)" }}/>
      </div>

      <style jsx global>{`
        @keyframes svcTick {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  )
}