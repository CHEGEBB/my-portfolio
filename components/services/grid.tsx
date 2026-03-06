"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"
import { Globe, Smartphone, Brain, Cloud, Palette, Users, Shield } from "lucide-react"

const SERVICES = [
  {
    id: "SVC-01", title: "Full-Stack Web", icon: Globe, color: "#5567F7",
    fullTitle: "Full-Stack Web Development",
    tags: ["Next.js", "React", "Node.js", "PostgreSQL", "MongoDB"],
    desc: "End-to-end web applications from architecture to deployment. SPAs, SSR, APIs, databases — owned completely. You brief me once, I ship the product.",
    deliverables: ["Web Application", "REST API", "Database Design", "CI/CD Deployment"],
    stat: { label: "Avg delivery", value: "4–8 wks" },
  },
  {
    id: "SVC-02", title: "Mobile Apps", icon: Smartphone, color: "#FF6B9D",
    fullTitle: "Mobile App Development",
    tags: ["React Native", "Flutter", "Android", "iOS"],
    desc: "Cross-platform mobile apps built for real networks, real users. 1,000+ Play Store downloads already proven. Optimised for low-bandwidth African networks.",
    deliverables: ["Android App", "iOS App", "Play Store Deploy", "Push Notifications"],
    stat: { label: "Downloads", value: "1,000+" },
  },
  {
    id: "SVC-03", title: "AI & ML", icon: Brain, color: "#45D2B0",
    fullTitle: "AI & ML Integration",
    tags: ["Python", "OpenAI", "ML Models", "NLP", "Analytics"],
    desc: "AI-powered features that actually work in production. Risk assessment tools, intelligent grading systems, adaptive analytics — not demos, shipped products.",
    deliverables: ["AI Model Integration", "Analytics Dashboard", "Data Pipeline", "API Layer"],
    stat: { label: "AI projects", value: "3 shipped" },
  },
  {
    id: "SVC-04", title: "Cloud & DevOps", icon: Cloud, color: "#00D4FF",
    fullTitle: "Cloud & DevOps Engineering",
    tags: ["AWS", "Docker", "CI/CD", "Linux", "PostgreSQL"],
    desc: "Infrastructure that scales without drama. Containerised deployments, automated pipelines, zero-downtime releases. Your stack hardened and monitored.",
    deliverables: ["AWS Architecture", "Docker Setup", "CI/CD Pipeline", "Monitoring"],
    stat: { label: "Uptime target", value: "99.9%" },
  },
  {
    id: "SVC-05", title: "UI/UX & Frontend", icon: Palette, color: "#AAFF00",
    fullTitle: "UI/UX & Frontend Engineering",
    tags: ["Figma", "Tailwind", "Animations", "Vue", "Angular"],
    desc: "Interfaces that make people stop scrolling. Design system to pixel-perfect implementation. Performance, accessibility, and beauty — not a compromise.",
    deliverables: ["UI Design System", "Component Library", "Micro-animations", "Responsive Layout"],
    stat: { label: "Frameworks", value: "5 mastered" },
  },
  {
    id: "SVC-06", title: "CTO-as-a-Service", icon: Users, color: "#F5A623",
    fullTitle: "Tech Leadership & CTO-as-a-Service",
    tags: ["Architecture", "Team Lead", "Agile", "Roadmap", "Hiring"],
    desc: "Led two startups as CTO. I can own your technical direction, mentor your engineers, and translate business goals into systems that ship.",
    deliverables: ["Tech Roadmap", "Architecture Review", "Team Mentoring", "Agile Processes"],
    stat: { label: "CTO roles", value: "2 startups" },
  },
  {
    id: "SVC-07", title: "Cybersecurity", icon: Shield, color: "#8B5CF6",
    fullTitle: "Cybersecurity Consulting",
    tags: ["Pen Testing", "CTF", "TryHackMe", "Security Audits"],
    desc: "Active CTF competitor on TryHackMe. IBM Cybersecurity certified. Security audits, vulnerability assessments, and hardening your stack before it's too late.",
    deliverables: ["Security Audit", "Pen Test Report", "Hardening Guide", "Risk Assessment"],
    stat: { label: "Certifications", value: "IBM + Cisco" },
  },
]

// ── Letter-by-letter stagger reveal ──────────────────────────────────────────
function StaggerText({ text, color, trigger, className = "" }: {
  text: string; color: string; trigger: boolean; className?: string
}) {
  return (
    <span aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} aria-hidden style={{
          display: "inline-block",
          opacity: trigger ? 1 : 0,
          transform: trigger ? "translateY(0)" : "translateY(12px)",
          transition: trigger
            ? `opacity 0.35s ease ${i * 0.025}s, transform 0.35s cubic-bezier(0.16,1,0.3,1) ${i * 0.025}s`
            : "none",
          color: ch === " " ? "transparent" : undefined,
          whiteSpace: ch === " " ? "pre" : undefined,
        }}>{ch === " " ? "\u00a0" : ch}</span>
      ))}
    </span>
  )
}

// ── Scan line that sweeps across the panel ────────────────────────────────────
function ScanLine({ trigger, color }: { trigger: boolean; color: string }) {
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0,
      height: "2px", zIndex: 10, pointerEvents: "none", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: "60%", height: "100%",
        background: `linear-gradient(90deg, transparent, ${color}, ${color}cc, transparent)`,
        boxShadow: `0 0 12px ${color}`,
        transform: trigger ? "translateX(200%)" : "translateX(-100%)",
        transition: trigger ? "transform 0.8s cubic-bezier(0.16,1,0.3,1)" : "none",
      }} />
    </div>
  )
}

// ── Typewriter for description ────────────────────────────────────────────────
function TypewriterText({ text, trigger, delay = 0 }: {
  text: string; trigger: boolean; delay?: number
}) {
  const [displayed, setDisplayed] = useState("")
  const [started,   setStarted]   = useState(false)
  const prevTrigger = useRef(false)

  useEffect(() => {
    if (trigger && !prevTrigger.current) {
      setDisplayed("")
      setStarted(false)
      const t = setTimeout(() => setStarted(true), delay * 1000)
      prevTrigger.current = true
      return () => clearTimeout(t)
    }
    if (!trigger) {
      prevTrigger.current = false
      setDisplayed("")
      setStarted(false)
    }
  }, [trigger, delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, 14)
    return () => clearInterval(interval)
  }, [started, text])

  return (
    <span>
      {displayed}
      {started && displayed.length < text.length && (
        <span style={{ animation: "cursorBlink 0.7s ease-in-out infinite" }}>▊</span>
      )}
    </span>
  )
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export function ServicesGrid() {
  const { theme }    = useTheme()
  const ref          = useRef<HTMLDivElement>(null)
  const [inView,     setInView]     = useState(false)
  const [painted,    setPainted]    = useState(false)
  const [active,     setActive]     = useState(0)
  const [scanKey,    setScanKey]    = useState(0)   // re-mount ScanLine on change
  const [panelReady, setPanelReady] = useState(false)
  const [mouse,      setMouse]      = useState({ x: 0.5, y: 0.5 })
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent
  const svc    = SERVICES[active]

  // When section enters view
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.04 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setPainted(true), 60)
    return () => clearTimeout(t)
  }, [inView])

  // Activate service — trigger scan + panel swap
  const activate = useCallback((idx: number) => {
    if (idx === active) return
    setPanelReady(false)
    setActive(idx)
    setScanKey(k => k + 1)
    setTimeout(() => setPanelReady(true), 100)
  }, [active])

  // Panel ready on first load
  useEffect(() => {
    if (inView) {
      setScanKey(k => k + 1)
      setTimeout(() => setPanelReady(true), 400)
    }
  }, [inView])

  // Mouse ambient
  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
  }, [])

  useEffect(() => {
    const el = ref.current; if (!el) return
    el.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => el.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  const Icon = svc.icon

  return (
    <section ref={ref} style={{
      position: "relative", background: "var(--color-bg)", overflow: "hidden",
    }}>
      {/* Paint wipe */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: isDark ? "#07070F" : "#F6F6FC",
        clipPath: painted
          ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
          : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        transition: painted ? "clip-path 0.95s cubic-bezier(0.86,0,0.07,1)" : "none",
        willChange: "clip-path",
      }} />
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: isDark ? `color-mix(in srgb, ${svc.color} 8%, #07070F)` : `color-mix(in srgb, ${svc.color} 5%, #F6F6FC)`,
        clipPath: painted
          ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
          : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        transition: painted ? "clip-path 1.1s cubic-bezier(0.86,0,0.07,1) 0.07s" : "none",
        willChange: "clip-path",
      }} />

      {/* Mouse ambient */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse 60% 55% at ${(mouse.x*100).toFixed(1)}% ${(mouse.y*100).toFixed(1)}%, ${svc.color}${isDark?"14":"0a"} 0%, transparent 60%)`,
        transition: "background 0.2s ease",
      }} />

      <div style={{ position: "relative", zIndex: 5 }}>

        {/* ── Section header ── */}
        <div style={{
          padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,4rem) clamp(2rem,4vw,3rem)",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          flexWrap: "wrap", gap: "1.5rem",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
        }}>
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem",
              opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(14px)",
              transition: "all 0.6s ease 0.1s",
            }}>
              <div style={{ width: 24, height: "1px", background: acc }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                letterSpacing: "0.14em", textTransform: "uppercase", color: acc,
              }}>What I Do</span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem,7vw,6rem)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9, margin: 0,
              opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.18s",
            }}>
              <span style={{ display: "block", color: "var(--color-text-primary)" }}>Services</span>
              <span style={{
                display: "block", color: "transparent",
                WebkitTextStroke: `2px ${acc}`, textShadow: `0 0 60px ${acc}44`,
              }}>Offered</span>
            </h2>
          </div>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(0.8rem,1.1vw,0.9rem)",
            color: "var(--color-text-muted)", lineHeight: 1.7, maxWidth: 300, margin: 0,
            opacity: inView ? 1 : 0, transition: "opacity 0.6s ease 0.4s",
          }}>
            Seven disciplines. All shipped. Select one to inspect.
          </p>
        </div>

        {/* ── MISSION CONTROL LAYOUT ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "clamp(200px,28vw,340px) 1fr",
          minHeight: "clamp(520px,70vh,760px)",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.5s ease 0.5s",
        }}
        className="mc-layout"
        >

          {/* ════════ LEFT NAV PANEL ════════ */}
          <div style={{
            borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`,
            padding: "clamp(1.5rem,3vw,2.5rem) 0",
            display: "flex", flexDirection: "column",
            background: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.015)",
          }}>
            {/* Panel label */}
            <div style={{
              padding: "0 clamp(1rem,2vw,1.75rem)",
              marginBottom: "1rem",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: acc, animation: "statusPulse 2s ease-in-out infinite" }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--color-text-muted)", opacity: 0.5,
              }}>SERVICE INDEX</span>
            </div>

            {/* Service list */}
            {SERVICES.map((s, i) => {
              const NavIcon = s.icon
              const isActive = active === i
              return (
                <button key={s.id} onClick={() => activate(i)} style={{
                  all: "unset", cursor: "pointer",
                  display: "flex", alignItems: "center",
                  gap: "clamp(0.6rem,1.2vw,1rem)",
                  padding: "clamp(0.7rem,1.2vw,1rem) clamp(1rem,2vw,1.75rem)",
                  position: "relative",
                  background: isActive
                    ? isDark ? `${s.color}14` : `${s.color}0e`
                    : "transparent",
                  borderLeft: `2px solid ${isActive ? s.color : "transparent"}`,
                  transition: "all 0.25s ease",
                }}>
                  {/* Active: subtle bg glow */}
                  {isActive && (
                    <div style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      background: `linear-gradient(90deg, ${s.color}18, transparent)`,
                    }} />
                  )}

                  {/* Status dot */}
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                    background: isActive ? s.color : (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"),
                    boxShadow: isActive ? `0 0 8px ${s.color}` : "none",
                    transition: "all 0.3s ease",
                    animation: isActive ? "statusPulse 2s ease-in-out infinite" : "none",
                  }} />

                  {/* Icon */}
                  <div style={{
                    width: 28, height: 28, flexShrink: 0,
                    border: `1px solid ${isActive ? s.color + "66" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: isActive ? s.color : "var(--color-text-muted)",
                    background: isActive ? `${s.color}12` : "transparent",
                    transition: "all 0.25s ease",
                    flexShrink: 0,
                  }}>
                    <NavIcon size={13} strokeWidth={1.75} />
                  </div>

                  {/* Name */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(0.6rem,0.85vw,0.75rem)",
                      fontWeight: isActive ? 600 : 400,
                      letterSpacing: "0.04em",
                      color: isActive ? s.color : "var(--color-text-muted)",
                      transition: "color 0.25s ease",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{s.title}</div>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: "0.42rem",
                      letterSpacing: "0.08em", color: "var(--color-text-muted)",
                      opacity: 0.45, marginTop: "0.15rem",
                    }}>{s.id}</div>
                  </div>

                  {/* Active chevron */}
                  {isActive && (
                    <div style={{ color: s.color, flexShrink: 0 }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* ════════ RIGHT DETAIL PANEL ════════ */}
          <div style={{ position: "relative", overflow: "hidden" }}>
            {/* Scan line sweeps on activation */}
            <ScanLine key={scanKey} trigger={panelReady} color={svc.color} />

            {/* Corner HUD brackets */}
            {[
              { top: "1rem", left: "1rem",   borderTop: `1px solid ${svc.color}66`, borderLeft: `1px solid ${svc.color}66` },
              { top: "1rem", right: "1rem",  borderTop: `1px solid ${svc.color}66`, borderRight: `1px solid ${svc.color}66` },
              { bottom: "1rem", left: "1rem",  borderBottom: `1px solid ${svc.color}66`, borderLeft: `1px solid ${svc.color}66` },
              { bottom: "1rem", right: "1rem", borderBottom: `1px solid ${svc.color}66`, borderRight: `1px solid ${svc.color}66` },
            ].map((s, i) => (
              <div key={i} style={{
                position: "absolute", width: 20, height: 20,
                zIndex: 4, pointerEvents: "none",
                opacity: panelReady ? 0.7 : 0,
                transition: `opacity 0.4s ease ${i * 0.06 + 0.1}s`,
                ...s,
              }} />
            ))}

            {/* ID badge top-right */}
            <div style={{
              position: "absolute", top: "1.75rem", right: "2.5rem",
              fontFamily: "var(--font-mono)", fontSize: "0.48rem",
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: svc.color, opacity: 0.5,
              zIndex: 3,
            }}>{svc.id} ● ACTIVE</div>

            {/* Main content */}
            <div style={{
              padding: "clamp(2.5rem,5vw,4rem) clamp(1.5rem,4vw,3.5rem)",
              height: "100%",
              display: "flex", flexDirection: "column", justifyContent: "center",
              gap: "clamp(1.5rem,3vw,2.5rem)",
            }}>
              {/* Icon + title */}
              <div>
                <div style={{
                  width: "clamp(44px,5vw,64px)", height: "clamp(44px,5vw,64px)",
                  border: `1px solid ${svc.color}66`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: svc.color, background: `${svc.color}12`,
                  marginBottom: "1.25rem",
                  boxShadow: `0 0 20px ${svc.color}22`,
                  opacity: panelReady ? 1 : 0,
                  transform: panelReady ? "none" : "scale(0.8)",
                  transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.1s",
                }}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>

                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem,4vw,3.5rem)",
                  fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1,
                  margin: 0, color: "var(--color-text-primary)",
                }}>
                  <StaggerText text={svc.fullTitle} color={svc.color} trigger={panelReady} />
                </h3>
              </div>

              {/* Stat chip */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.75rem",
                opacity: panelReady ? 1 : 0,
                transition: "opacity 0.5s ease 0.4s",
                alignSelf: "flex-start",
              }}>
                <div style={{
                  border: `1px solid ${svc.color}44`,
                  background: `${svc.color}0d`,
                  padding: "0.3rem 0.875rem",
                  display: "flex", alignItems: "center", gap: "0.6rem",
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                  }}>{svc.stat.label}</span>
                  <span style={{
                    fontFamily: "var(--font-display)", fontSize: "1rem",
                    fontWeight: 800, letterSpacing: "-0.03em",
                    color: svc.color,
                  }}>{svc.stat.value}</span>
                </div>
              </div>

              {/* Description — typewriter */}
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.85rem,1.15vw,1rem)",
                color: "var(--color-text-muted)", lineHeight: 1.72,
                margin: 0, maxWidth: 560,
                minHeight: "4.5em",
              }}>
                <TypewriterText text={svc.desc} trigger={panelReady} delay={0.3} />
              </p>

              {/* Tags */}
              <div style={{
                display: "flex", flexWrap: "wrap", gap: "0.4rem",
                opacity: panelReady ? 1 : 0,
                transition: "opacity 0.5s ease 0.55s",
              }}>
                {svc.tags.map((t, i) => (
                  <span key={t} style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.48rem",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: svc.color,
                    border: `1px solid ${svc.color}44`,
                    background: `${svc.color}0d`,
                    padding: "0.22rem 0.6rem",
                    opacity: panelReady ? 1 : 0,
                    transform: panelReady ? "none" : "translateY(6px)",
                    transition: `opacity 0.35s ease ${i * 0.07 + 0.55}s, transform 0.35s ease ${i * 0.07 + 0.55}s`,
                  }}>{t}</span>
                ))}
              </div>

              {/* Deliverables — tick in */}
              <div>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: svc.color, marginBottom: "0.75rem",
                  opacity: panelReady ? 0.7 : 0,
                  transition: "opacity 0.4s ease 0.65s",
                }}>Deliverables</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                  {svc.deliverables.map((d, i) => (
                    <div key={d} style={{
                      display: "flex", alignItems: "center", gap: "0.45rem",
                      opacity: panelReady ? 1 : 0,
                      transform: panelReady ? "none" : "translateX(-8px)",
                      transition: `all 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.1 + 0.7}s`,
                    }}>
                      {/* Tick */}
                      <div style={{
                        width: 16, height: 16, flexShrink: 0,
                        border: `1px solid ${svc.color}66`,
                        background: `${svc.color}12`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: svc.color,
                      }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      </div>
                      <span style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(0.72rem,0.95vw,0.85rem)",
                        color: "var(--color-text-muted)",
                      }}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1);   }
          50%       { opacity: 0.4; transform: scale(1.4); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @media (max-width: 768px) {
          .mc-layout { grid-template-columns: 1fr !important; }
          .mc-layout > div:first-child {
            border-right: none !important;
            border-bottom: 1px solid var(--color-surface-border);
            min-height: auto !important;
          }
        }
      `}</style>
    </section>
  )
}