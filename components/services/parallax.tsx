"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/context/theme-context"

export function ServiceParallax() {
  const { theme }   = useTheme()
  const ref         = useRef<HTMLDivElement>(null)
  const imgRef      = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const [inView,  setInView]  = useState(false)
  const [painted, setPainted] = useState(false)
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

  // Parallax scroll
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current; if (!el) return
      const rect = el.getBoundingClientRect()
      const winH  = window.innerHeight
      // How far into view: -1 (above) to 1 (below)
      const rel = (winH / 2 - rect.top - rect.height / 2) / (winH + rect.height)
      setOffset(rel * 120) // parallax depth
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        height: "clamp(480px,70vh,800px)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Paint wipe */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
        background: isDark ? "#07070F" : "#F6F6FC",
        clipPath: painted
          ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"  // wipes left to reveal
          : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        transition: painted ? "clip-path 1.1s cubic-bezier(0.86,0,0.07,1)" : "none",
        willChange: "clip-path",
      }} />

      {/* Parallax image */}
      <div
        ref={imgRef}
        style={{
          position: "absolute",
          inset: "-15%",  // oversize for parallax travel
          backgroundImage: "url('https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1800&q=85&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${offset}px)`,
          transition: "transform 0.05s linear",
          willChange: "transform",
        }}
      />

      {/* Colour wash — tints image with current accent */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(135deg, ${acc}55 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.85) 100%)`,
        mixBlendMode: "multiply",
      }} />

      {/* Dark overlay for text legibility */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.52)",
      }} />

      {/* Grain */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        backgroundSize: "256px 256px",
        pointerEvents: "none", opacity: 0.5,
        mixBlendMode: "overlay",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 5,
        textAlign: "center",
        padding: "0 clamp(1.5rem,5vw,4rem)",
        maxWidth: 900,
      }}>
        {/* Accent line */}
        <div style={{
          width: 40, height: 2, background: acc,
          margin: "0 auto clamp(1.5rem,3vw,2.5rem)",
          opacity: inView ? 1 : 0,
          transform: inView ? "scaleX(1)" : "scaleX(0)",
          transition: "all 0.6s ease 0.3s",
        }} />

        <blockquote style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.8rem,5vw,4.5rem)",
          fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05,
          color: "#fff", margin: "0 0 clamp(1.5rem,3vw,2.5rem)",
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(24px)",
          transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s",
        }}>
          &ldquo;Good software is invisible. You only notice it when it&rsquo;s{" "}
          <span style={{
            color: acc,
            textShadow: `0 0 40px ${acc}88`,
          }}>missing.</span>&rdquo;
        </blockquote>

        <p style={{
          fontFamily: "var(--font-mono)", fontSize: "0.62rem",
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
          margin: "0 0 clamp(2rem,4vw,3rem)",
          opacity: inView ? 1 : 0,
          transition: "opacity 0.6s ease 0.5s",
        }}>— Brian Chege, Full-Stack Developer & CTO</p>

        {/* Stat strip */}
        <div style={{
          display: "flex", justifyContent: "center",
          gap: "clamp(2rem,5vw,5rem)",
          flexWrap: "wrap",
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(16px)",
          transition: "all 0.7s ease 0.6s",
        }}>
          {[
            { n: "3+",  l: "Years" },
            { n: "20+", l: "Projects" },
            { n: "2×",  l: "CTO" },
            { n: "7+",  l: "Companies" },
          ].map(({ n, l }) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem,3vw,2.5rem)",
                fontWeight: 800, letterSpacing: "-0.05em",
                color: acc, lineHeight: 1,
                textShadow: `0 0 24px ${acc}66`,
              }}>{n}</div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)", marginTop: "0.3rem",
              }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Corner accent brackets */}
      {[
        { top: "1.5rem", left: "1.5rem",   borderTop: `2px solid ${acc}`, borderLeft: `2px solid ${acc}` },
        { top: "1.5rem", right: "1.5rem",  borderTop: `2px solid ${acc}`, borderRight: `2px solid ${acc}` },
        { bottom: "1.5rem", left: "1.5rem",  borderBottom: `2px solid ${acc}`, borderLeft: `2px solid ${acc}` },
        { bottom: "1.5rem", right: "1.5rem", borderBottom: `2px solid ${acc}`, borderRight: `2px solid ${acc}` },
      ].map((style, i) => (
        <div key={i} style={{
          position: "absolute", width: 24, height: 24,
          zIndex: 6, pointerEvents: "none",
          opacity: inView ? 0.6 : 0,
          transition: `opacity 0.6s ease ${0.8 + i * 0.1}s`,
          ...style,
        }} />
      ))}
    </section>
  )
}