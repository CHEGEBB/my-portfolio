"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"
import { Rocket, GitMerge, Users, Zap, Globe, ShieldCheck } from "lucide-react"

const REASONS = [
  {
    num: "01",
    icon: Rocket,
    headline: "I've actually shipped.",
    color: "#5567F7",
    body: "Not side projects. Not tutorials. Real products — on the Play Store, in hospitals, running at universities. 20+ shipped applications across 7 companies. Proof over promises.",
    proof: "1,000+ Play Store downloads · 2 CTO roles · 7 companies",
  },
  {
    num: "02",
    icon: GitMerge,
    headline: "Full ownership,\nzero hand-holding.",
    color: "#45D2B0",
    body: "You brief me once. I architect, design, build, test, deploy, and document. You don't manage me — I run the technical side so you can focus on the business.",
    proof: "End-to-end · Architecture → Production · Solo or Team",
  },
  {
    num: "03",
    icon: Users,
    headline: "I've led teams,\nnot just joined them.",
    color: "#FF6B9D",
    body: "As CTO of two startups I hired, mentored, and set technical direction for engineering teams. I know what good process looks like from the top and from inside the code.",
    proof: "Co-Founder & CTO × 2 · Agile · Technical mentoring",
  },
  {
    num: "04",
    icon: Zap,
    headline: "Seven disciplines.\nOne person.",
    color: "#AAFF00",
    body: "Web. Mobile. AI. Cloud. DevOps. Design. Security. You don't need five freelancers and a PM. I cover the full stack — and I know where the edges of each domain connect.",
    proof: "Next.js · Flutter · Python · AWS · Docker · Figma · Pen Testing",
  },
  {
    num: "05",
    icon: Globe,
    headline: "Built for Africa,\nready for the world.",
    color: "#F5A623",
    body: "I build for low-bandwidth networks, budget Android devices, and users who need reliability over flashiness. That constraint makes everything I build leaner and faster for everyone.",
    proof: "Kenya-based · Global-ready · Low-bandwidth optimised",
  },
  {
    num: "06",
    icon: ShieldCheck,
    headline: "Security is\nnever an afterthought.",
    color: "#8B5CF6",
    body: "IBM Cybersecurity certified. Active CTF competitor on TryHackMe. I think about attack surfaces, data exposure, and auth flows during architecture — not during the post-mortem.",
    proof: "IBM Certified · TryHackMe · Penetration Testing · Cisco",
  },
]

function ReasonCard({ reason, idx, inView }: {
  reason: typeof REASONS[0]
  idx: number
  inView: boolean
}) {
  const { theme } = useTheme()
  const [hovered, setHovered] = useState(false)
  const isDark = theme.mode === "dark"
  const Icon = reason.icon

  // Alternate layout: even = text left / odd = text right (creates zigzag)
  const isEven = idx % 2 === 0

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "clamp(60px,8vw,100px) 1fr clamp(160px,20vw,240px)",
        alignItems: "start",
        gap: 0,
        borderBottom: "1px solid var(--color-surface-border)",
        position: "relative",
        overflow: "hidden",
        // Reveal stagger
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : `translateX(${isEven ? -40 : 40}px)`,
        transition: `opacity 0.75s ease ${idx * 0.1 + 0.15}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${idx * 0.1 + 0.15}s`,
        cursor: "default",
      }}
    >
      {/* Hover bg sweep */}
      <div style={{
        position: "absolute", inset: 0,
        background: isDark ? `${reason.color}09` : `${reason.color}06`,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.35s ease",
        pointerEvents: "none",
      }} />

      {/* Animated left accent bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: hovered ? 3 : 0,
        background: reason.color,
        transition: "width 0.3s ease",
      }} />

      {/* ── Col 1: number + icon ── */}
      <div style={{
        padding: "clamp(1.5rem,2.5vw,2.25rem) clamp(1rem,2vw,1.75rem)",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: "0.75rem",
        borderRight: "1px solid var(--color-surface-border)",
        alignSelf: "stretch",
        position: "relative", zIndex: 1,
      }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.5rem",
          letterSpacing: "0.14em", color: reason.color, opacity: 0.7,
        }}>{reason.num}</span>
        <div style={{
          width: "clamp(34px,4vw,48px)", height: "clamp(34px,4vw,48px)",
          border: `1px solid ${hovered ? reason.color : "var(--color-surface-border)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: hovered ? reason.color : "var(--color-text-muted)",
          background: hovered ? `${reason.color}14` : "transparent",
          transition: "all 0.3s ease",
          flexShrink: 0,
        }}>
          <Icon size={16} strokeWidth={1.75} />
        </div>
      </div>

      {/* ── Col 2: headline + body ── */}
      <div style={{
        padding: "clamp(1.5rem,2.5vw,2.25rem) clamp(1.25rem,3vw,2.5rem)",
        position: "relative", zIndex: 1,
      }}>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.4rem,3vw,2.5rem)",
          fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0,
          margin: "0 0 clamp(0.75rem,1.5vw,1.1rem)",
          whiteSpace: "pre-line",
          // Outline → solid on hover
          color: hovered ? reason.color : "var(--color-text-primary)",
          transition: "color 0.3s ease",
        }}>{reason.headline}</h3>

        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(0.8rem,1.1vw,0.925rem)",
          color: "var(--color-text-muted)", lineHeight: 1.7,
          margin: 0, maxWidth: 560,
        }}>{reason.body}</p>
      </div>

      {/* ── Col 3: proof tag ── */}
      <div style={{
        padding: "clamp(1.5rem,2.5vw,2.25rem) clamp(1rem,2vw,1.5rem)",
        borderLeft: "1px solid var(--color-surface-border)",
        alignSelf: "stretch",
        display: "flex", alignItems: "center",
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.5rem", letterSpacing: "0.08em",
          color: hovered ? reason.color : "var(--color-text-muted)",
          lineHeight: 1.9,
          opacity: hovered ? 1 : 0.5,
          transition: "all 0.3s ease",
          // Each bullet on its own line
          whiteSpace: "pre-line",
        }}>
          {reason.proof.split(" · ").map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              marginBottom: "0.3rem",
              transform: hovered ? "translateX(0)" : "translateX(6px)",
              transition: `transform 0.3s ease ${i * 0.06}s`,
            }}>
              <div style={{
                width: 4, height: 4, borderRadius: "50%",
                background: reason.color, flexShrink: 0,
                opacity: hovered ? 1 : 0.4,
              }} />
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function WhyHireMe() {
  const { theme }  = useTheme()
  const ref        = useRef<HTMLDivElement>(null)
  const [inView,   setInView]   = useState(false)
  const [painted,  setPainted]  = useState(false)
  const [mouse,    setMouse]    = useState({ x: 0.5, y: 0.5 })
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

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

  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    setMouse({
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    })
  }, [])

  useEffect(() => {
    const el = ref.current; if (!el) return
    el.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => el.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  return (
    <section ref={ref} style={{
      position: "relative",
      background: "var(--color-bg)",
      overflow: "hidden",
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
        background: isDark
          ? `color-mix(in srgb, ${acc} 8%, #07070F)`
          : `color-mix(in srgb, ${acc} 5%, #F6F6FC)`,
        clipPath: painted
          ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
          : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        transition: painted ? "clip-path 1.15s cubic-bezier(0.86,0,0.07,1) 0.07s" : "none",
        willChange: "clip-path",
      }} />

      {/* Mouse ambient */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse 55% 50% at ${(mouse.x*100).toFixed(1)}% ${(mouse.y*100).toFixed(1)}%, ${acc}${isDark?"12":"0a"} 0%, transparent 60%)`,
        transition: "background 0.1s ease",
      }} />

      <div style={{ position: "relative", zIndex: 5 }}>

        {/* ── Header ── */}
        <div style={{
          padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,4rem) clamp(2rem,4vw,3rem)",
          borderBottom: "1px solid var(--color-surface-border)",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "end",
          gap: "2rem",
          flexWrap: "wrap",
        }}>
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              marginBottom: "1rem",
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(14px)",
              transition: "all 0.6s ease 0.1s",
            }}>
              <div style={{ width: 24, height: "1px", background: acc }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                letterSpacing: "0.14em", textTransform: "uppercase", color: acc,
              }}>The Case For Me</span>
            </div>

            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem,7vw,6.5rem)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.88,
              margin: 0,
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(24px)",
              transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.18s",
            }}>
              <span style={{ display: "block", color: "var(--color-text-primary)" }}>Why</span>
              <span style={{ display: "block", color: "var(--color-text-primary)" }}>Hire</span>
              <span style={{
                display: "block", color: "transparent",
                WebkitTextStroke: `2px ${acc}`,
                textShadow: `0 0 60px ${acc}44`,
              }}>Me?</span>
            </h2>
          </div>

          {/* Right: short punchy statement */}
          <div style={{
            maxWidth: 320,
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(16px)",
            transition: "all 0.7s ease 0.35s",
          }}>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.875rem,1.2vw,1rem)",
              color: "var(--color-text-muted)", lineHeight: 1.7,
              margin: "0 0 1.25rem",
            }}>
              Six honest reasons — backed by real work, real roles, and real shipped products.
            </p>
            {/* Animated count */}
            <div style={{
              display: "flex", alignItems: "baseline", gap: "0.5rem",
            }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem,5vw,4rem)",
                fontWeight: 800, letterSpacing: "-0.06em",
                color: acc, lineHeight: 1,
              }}>6</span>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--color-text-muted)",
              }}>Reasons to choose Brian</span>
            </div>
          </div>
        </div>

        {/* ── Reason rows ── */}
        {REASONS.map((r, i) => (
          <ReasonCard key={r.num} reason={r} idx={i} inView={inView} />
        ))}

        {/* ── Bottom strip ── */}
        <div style={{
          padding: "clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4rem)",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: "1.5rem",
          borderTop: "1px solid var(--color-surface-border)",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.7s ease 0.85s",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "0.6rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--color-text-muted)", margin: 0,
          }}>
            Still not convinced? Check the work below.
          </p>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            fontFamily: "var(--font-mono)", fontSize: "0.6rem",
            letterSpacing: "0.1em", textTransform: "uppercase", color: acc,
          }}>
            <div style={{ width: 20, height: "1px", background: acc }} />
            Scroll to see portfolio
          </div>
        </div>
      </div>
    </section>
  )
}