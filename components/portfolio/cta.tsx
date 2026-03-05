"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"
import { ArrowUpRight, Github, Linkedin, Twitter } from "lucide-react"

const SOCIALS = [
  { icon: Github,   label: "GitHub",   href: "https://github.com/brianchege2k"    },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/brianchege" },
  { icon: Twitter,  label: "Twitter",  href: "https://twitter.com/brianchege"     },
]

// ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────
function MagneticBtn({ acc }: { acc: string }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hov, setHov] = useState(false)

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    setPos({
      x: (e.clientX - r.left - r.width / 2) * 0.38,
      y: (e.clientY - r.top - r.height / 2) * 0.38,
    })
  }

  const fg = ["#AAFF00","#45D2B0","#00D4FF","#F5A623","#22C55E"].includes(acc) ? "#000" : "#fff"

  return (
    <a
      ref={ref} href="mailto:brianchege2k@gmail.com"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPos({ x: 0, y: 0 }) }}
      onMouseMove={onMove}
      style={{
        display:"inline-flex", alignItems:"center", gap:"1rem",
        fontFamily:"var(--font-display)",
        fontSize:"clamp(0.95rem,1.4vw,1.15rem)",
        fontWeight:700, letterSpacing:"-0.02em",
        color: fg, background:acc,
        padding:"clamp(1rem,2vw,1.4rem) clamp(2rem,4vw,3.2rem)",
        borderRadius:"9999px", textDecoration:"none",
        transform:`translate(${pos.x}px,${pos.y}px) scale(${hov ? 1.07 : 1})`,
        transition: hov
          ? "transform 0.12s ease, box-shadow 0.3s ease"
          : "transform 0.5s cubic-bezier(.16,1,.3,1), box-shadow 0.3s ease",
        boxShadow: hov
          ? `0 0 90px ${acc}55, 0 30px 80px rgba(0,0,0,0.5)`
          : `0 0 40px ${acc}30, 0 20px 50px rgba(0,0,0,0.35)`,
        cursor:"none", willChange:"transform",
      }}
    >
      Let&apos;s Build Something
      <div style={{
        width:36, height:36, borderRadius:"50%", background:acc, flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center",
        transform: hov ? "rotate(-45deg)" : "rotate(0deg)",
        transition:"transform 0.3s ease",
      }}>
        <ArrowUpRight size={16} strokeWidth={2.5} color={fg} />
      </div>
    </a>
  )
}

// ─── MARQUEE LINE ─────────────────────────────────────────────────────────────
function Marquee({ acc }: { acc: string }) {
  const words = ["COLLABORATE","BUILD","CREATE","SHIP","INNOVATE","DESIGN","CODE"]
  const triple = [...words,...words,...words]
  return (
    <div style={{ overflow:"hidden", borderTop:"1px solid rgba(255,255,255,0.08)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"1rem 0" }}>
      <div style={{ display:"flex", width:"max-content", animation:"marquee 18s linear infinite" }}>
        {triple.map((w,i) => (
          <span key={i} style={{
            fontFamily:"var(--font-display)",
            fontSize:"clamp(1rem,2vw,1.4rem)",
            fontWeight:800, letterSpacing:"0.12em",
            color: i % 7 === 0 ? acc : "rgba(255,255,255,0.12)",
            padding:"0 clamp(1.5rem,3vw,3rem)",
            whiteSpace:"nowrap",
          }}>{w}</span>
        ))}
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function PortfolioCTA() {
  const { theme } = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const acc = theme.colors.accent

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
  }, [])
  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    el.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => el.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  return (
    <section
      id="cta"
      ref={sectionRef}
      style={{
        position:"relative", background:"#04040A",
        overflow:"hidden",
      }}
    >
      {/* Roaming accent orb */}
      <div style={{
        position:"absolute",
        left:`${mouse.x * 100}%`, top:`${mouse.y * 100}%`,
        transform:"translate(-50%,-50%)",
        width:"clamp(350px,55vw,750px)", height:"clamp(350px,55vw,750px)",
        borderRadius:"50%",
        background:`radial-gradient(circle, ${acc}1A 0%, transparent 70%)`,
        filter:"blur(50px)",
        pointerEvents:"none", zIndex:0,
        transition:"left 0.35s ease, top 0.35s ease",
      }}/>

      {/* Top accent line */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg, transparent, ${acc}55, transparent)` }}/>

      <Marquee acc={acc} />

      <div style={{
        position:"relative", zIndex:1,
        maxWidth:"1280px", margin:"0 auto",
        padding:"clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,4rem)",
        display:"flex", flexDirection:"column", alignItems:"center",
        textAlign:"center", gap:"clamp(1.75rem,3.5vw,3rem)",
      }}>

        {/* Eyebrow */}
        <div style={{
          display:"flex", alignItems:"center", gap:"0.75rem",
          opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(14px)",
          transition:"all 0.6s ease 0.1s",
        }}>
          <div style={{ width:28, height:1, background:acc }}/>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.58rem", letterSpacing:"0.15em", textTransform:"uppercase", color:acc }}>What&apos;s Next</span>
          <div style={{ width:28, height:1, background:acc }}/>
        </div>

        {/* Big kinetic headline */}
        <h2 style={{
          fontFamily:"var(--font-display)",
          fontSize:"clamp(3.5rem,11vw,11rem)",
          fontWeight:800, letterSpacing:"-0.05em", lineHeight:0.84, margin:0,
          opacity: inView ? 1 : 0,
          animation: inView ? "ctaIn 1s cubic-bezier(.16,1,.3,1) .2s both" : "none",
        }}>
          <span style={{ display:"block", color:"rgba(255,255,255,0.88)" }}>Got a</span>
          <span style={{
            display:"block", color:"transparent",
            WebkitTextStroke:`clamp(1.5px,0.2vw,3px) ${acc}`,
            textShadow:`0 0 120px ${acc}25`,
          }}>Project?</span>
        </h2>

        <p style={{
          fontFamily:"var(--font-body)", fontSize:"clamp(0.88rem,1.3vw,1rem)",
          lineHeight:1.75, color:"rgba(255,255,255,0.4)", maxWidth:"480px",
          opacity: inView ? 1 : 0, transition:"opacity 0.8s ease 0.4s",
        }}>
          Open to freelance, full-time, and co-founding. 
          Eldoret, Kenya — working globally.
        </p>

        {/* Magnetic CTA */}
        <div style={{ opacity: inView ? 1 : 0, transition:"opacity 0.8s ease 0.5s" }}>
          <MagneticBtn acc={acc} />
        </div>

        {/* Divider */}
        <div style={{ width:"100%", height:1, background:"rgba(255,255,255,0.06)", opacity: inView ? 1 : 0, transition:"opacity 0.8s ease 0.6s" }}/>

        {/* Socials + email */}
        <div style={{
          display:"flex", alignItems:"center", gap:"clamp(1.5rem,4vw,3rem)",
          flexWrap:"wrap", justifyContent:"center",
          opacity: inView ? 1 : 0, transition:"opacity 0.8s ease 0.7s",
        }}>
          {SOCIALS.map(({ icon: Icon, label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              style={{
                display:"flex", alignItems:"center", gap:"0.45rem",
                fontFamily:"var(--font-mono)", fontSize:"0.52rem",
                letterSpacing:"0.1em", textTransform:"uppercase",
                color:"rgba(255,255,255,0.3)", textDecoration:"none",
                transition:"color 0.25s ease, transform 0.25s ease",
              }}
              onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.color=acc; el.style.transform="translateY(-3px)" }}
              onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.color="rgba(255,255,255,0.3)"; el.style.transform="" }}
            >
              <Icon size={14} strokeWidth={1.5}/>{label}
            </a>
          ))}
          <span style={{ width:1, height:16, background:"rgba(255,255,255,0.12)", display:"inline-block" }}/>
          <a href="mailto:brianchege2k@gmail.com"
            style={{
              fontFamily:"var(--font-mono)", fontSize:"0.52rem",
              letterSpacing:"0.1em", color:"rgba(255,255,255,0.3)", textDecoration:"none",
              transition:"color 0.25s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = acc }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)" }}
          >
            brianchege2k@gmail.com
          </a>
        </div>

        {/* Footer line */}
        <div style={{
          opacity: inView ? 0.25 : 0, transition:"opacity 0.8s ease 0.9s",
          fontFamily:"var(--font-mono)", fontSize:"0.46rem",
          letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)",
        }}>
          Designed & built by Brian Chege · {new Date().getFullYear()}
        </div>
      </div>

      <Marquee acc={acc} />

      <style jsx global>{`
        @keyframes ctaIn   { from{opacity:0;transform:translateY(50px)} to{opacity:1;transform:translateY(0)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
      `}</style>
    </section>
  )
}