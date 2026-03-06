"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react"

export function ServiceCTA() {
  const { theme } = useTheme()
  const ref       = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const [inView,  setInView]  = useState(false)
  const [painted, setPainted] = useState(false)
  const [mouse,   setMouse]   = useState({ x: 0.5, y: 0.5 })
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.1 }
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
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
  }, [])

  useEffect(() => {
    const el = ref.current; if (!el) return
    el.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => el.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const particles: { x:number; y:number; vx:number; vy:number; r:number; a:number }[] = []
    let W = 0, H = 0

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * 1000,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random(),
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = acc + Math.round(p.a * 60).toString(16).padStart(2, "0")
        ctx.fill()
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(rafRef.current) }
  }, [acc])

  return (
    <section ref={ref} style={{
      position: "relative",
      minHeight: "80svh",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      background: isDark ? "#07070F" : "#F0F0FA",
    }}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Paint wipe */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none",
        background: isDark ? "#07070F" : "#F0F0FA",
        clipPath: painted
          ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
          : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        transition: painted ? "clip-path 1.1s cubic-bezier(0.86,0,0.07,1)" : "none",
      }} />

      {/* Mouse ambient */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: `radial-gradient(ellipse 65% 60% at ${(mouse.x*100).toFixed(1)}% ${(mouse.y*100).toFixed(1)}%, ${acc}${isDark?"22":"14"} 0%, transparent 65%)`,
        transition: "background 0.1s ease",
      }} />

      {/* Large accent ring */}
      <div style={{
        position: "absolute",
        width: "clamp(300px,60vw,700px)", height: "clamp(300px,60vw,700px)",
        borderRadius: "50%",
        border: `1px solid ${acc}18`,
        pointerEvents: "none", zIndex: 1,
        animation: "ctaRingPulse 4s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        width: "clamp(200px,40vw,500px)", height: "clamp(200px,40vw,500px)",
        borderRadius: "50%",
        border: `1px solid ${acc}28`,
        pointerEvents: "none", zIndex: 1,
        animation: "ctaRingPulse 4s ease-in-out infinite 0.7s",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 6,
        textAlign: "center",
        padding: "clamp(4rem,8vw,6rem) clamp(1.5rem,5vw,4rem)",
        maxWidth: 780,
      }}>
        {/* Tag */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.6rem",
          marginBottom: "clamp(1.5rem,3vw,2.5rem)",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 0.15s",
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: acc, animation: "ctaDot 2s ease-in-out infinite" }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.6rem",
            letterSpacing: "0.18em", textTransform: "uppercase", color: acc,
          }}>Available for New Projects</span>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: acc, animation: "ctaDot 2s ease-in-out infinite 1s" }} />
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(3rem,10vw,9rem)",
          fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.88,
          margin: "0 0 clamp(1.5rem,3vw,2.5rem)",
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(32px)",
          transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s",
        }}>
          <span style={{ display: "block", color: "var(--color-text-primary)" }}>Let&apos;s</span>
          <span style={{
            display: "block",
            color: "transparent",
            WebkitTextStroke: `3px ${acc}`,
            textShadow: `0 0 80px ${acc}44`,
          }}>Build</span>
          <span style={{ display: "block", color: "var(--color-text-primary)" }}>Together.</span>
        </h2>

        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(0.875rem,1.3vw,1.05rem)",
          color: "var(--color-text-muted)", lineHeight: 1.7,
          margin: "0 auto clamp(2.5rem,5vw,4rem)",
          maxWidth: 520,
          opacity: inView ? 1 : 0,
          transition: "opacity 0.7s ease 0.45s",
        }}>
          Whether you need a full product built, a team led, or a broken system fixed — I&rsquo;m ready. Let&rsquo;s talk about what you&rsquo;re working on.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: "flex", gap: "1rem", justifyContent: "center",
          flexWrap: "wrap",
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(20px)",
          transition: "all 0.7s ease 0.55s",
        }}>
          <Link href="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: "0.6rem",
            fontFamily: "var(--font-body)", fontSize: "0.9375rem",
            fontWeight: 700, letterSpacing: "0.02em",
            color: "var(--color-accent-fg)", background: acc,
            padding: "0.875rem 2rem",
            borderRadius: "9999px",
            textDecoration: "none",
            boxShadow: `0 0 40px ${acc}55, 0 8px 32px rgba(0,0,0,0.2)`,
            transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform="scale(1.06)";el.style.boxShadow=`0 0 60px ${acc}77, 0 12px 40px rgba(0,0,0,0.3)`}}
          onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform="scale(1)";el.style.boxShadow=`0 0 40px ${acc}55, 0 8px 32px rgba(0,0,0,0.2)`}}
          >
            <Mail size={16} strokeWidth={2} />
            Start a Project
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </Link>

          <a href="https://wa.me/254796562713" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: "0.6rem",
            fontFamily: "var(--font-body)", fontSize: "0.9375rem",
            fontWeight: 600, letterSpacing: "0.02em",
            color: "#25D366",
            padding: "0.875rem 2rem",
            borderRadius: "9999px",
            border: "1.5px solid #25D36644",
            background: "rgba(37,211,102,0.08)",
            textDecoration: "none",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background="rgba(37,211,102,0.15)";el.style.borderColor="#25D36688";el.style.transform="scale(1.04)"}}
          onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background="rgba(37,211,102,0.08)";el.style.borderColor="#25D36644";el.style.transform="scale(1)"}}
          >
            <MessageCircle size={16} strokeWidth={2} />
            WhatsApp Me
          </a>
        </div>

        {/* Contact info strip */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "clamp(1.5rem,3vw,3rem)",
          marginTop: "clamp(2rem,4vw,3.5rem)",
          flexWrap: "wrap",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 0.7s",
        }}>
          {[
            { label: "Email", value: "chegephil24@gmail.com", href: "mailto:chegephil24@gmail.com" },
            { label: "Phone", value: "+254 796 562 713",      href: "tel:+254796562713"            },
            { label: "GitHub", value: "CHEGEBB",              href: "https://github.com/CHEGEBB"  },
          ].map(({ label, value, href }) => (
            <a key={label} href={href} style={{
              textDecoration: "none",
              display: "flex", flexDirection: "column", gap: "0.2rem",
              textAlign: "center",
            }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.48rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--color-text-muted)",
              }}>{label}</span>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.62rem",
                letterSpacing: "0.04em", color: acc,
                transition: "opacity 0.2s ease",
              }}>{value}</span>
            </a>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes ctaRingPulse {
          0%, 100% { transform: scale(1);    opacity: 1; }
          50%       { transform: scale(1.05); opacity: 0.5; }
        }
        @keyframes ctaDot {
          0%, 100% { opacity: 1; transform: scale(1);   }
          50%       { opacity: 0.4; transform: scale(1.5); }
        }
      `}</style>
    </section>
  )
}