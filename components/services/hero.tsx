"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"

// Words that cycle in the headline
const ROTATING_WORDS = ["Ships.", "Scales.", "Matters.", "Lasts.", "Works."]

// Animated word swap — slides out up, new one slides in from bottom
function RotatingWord({ color }: { color: string }) {
  const [idx,     setIdx]     = useState(0)
  const [exiting, setExiting] = useState(false)
  const [next,    setNext]    = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setExiting(true)
      const upcoming = (idx + 1) % ROTATING_WORDS.length
      setNext(upcoming)
      setTimeout(() => {
        setIdx(upcoming)
        setExiting(false)
      }, 380)
    }, 2400)
    return () => clearInterval(interval)
  }, [idx])

  return (
    <span style={{ position: "relative", display: "inline-block", overflow: "hidden" }}>
      {/* Current word exits upward */}
      <span style={{
        display: "inline-block",
        color: "transparent",
        WebkitTextStroke: `2px ${color}`,
        textShadow: `0 0 60px ${color}55`,
        transform: exiting ? "translateY(-110%)" : "translateY(0%)",
        opacity: exiting ? 0 : 1,
        transition: exiting
          ? "transform 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease"
          : "transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease",
      }}>{ROTATING_WORDS[idx]}</span>

      {/* Next word enters from below */}
      {exiting && (
        <span style={{
          position: "absolute", left: 0, top: 0,
          display: "inline-block",
          color: "transparent",
          WebkitTextStroke: `2px ${color}`,
          textShadow: `0 0 60px ${color}55`,
          animation: "wordEnter 0.45s cubic-bezier(0.16,1,0.3,1) 0.18s both",
          whiteSpace: "nowrap",
        }}>{ROTATING_WORDS[next]}</span>
      )}
    </span>
  )
}

export function ServicesHero() {
  const { theme }  = useTheme()
  const ref        = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const rafRef     = useRef<number>(0)
  const [mounted,  setMounted]  = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [mouse,    setMouse]    = useState({ x: 0.5, y: 0.5 })
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setRevealed(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Mouse tracking — desktop only
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

  // Grain canvas — throttled, skips on low-end
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let frame = 0
    let running = true

    const resize = () => {
      // Cap resolution on mobile for performance
      const scale = Math.min(window.devicePixelRatio, 1.5)
      canvas.width  = canvas.offsetWidth  * scale
      canvas.height = canvas.offsetHeight * scale
      ctx.scale(scale, scale)
    }
    resize()
    window.addEventListener("resize", resize, { passive: true })

    const draw = () => {
      if (!running) return
      frame++
      // Only redraw every 4th frame on mobile
      const skip = window.innerWidth < 768 ? 5 : 3
      if (frame % skip !== 0) { rafRef.current = requestAnimationFrame(draw); return }
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      const imageData = ctx.createImageData(w, h)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255
        data[i] = data[i+1] = data[i+2] = v
        data[i+3] = isDark ? 14 : 7
      }
      ctx.putImageData(imageData, 0, 0)
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      running = false
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isDark])

  if (!mounted) return null

  const gx = (mouse.x * 100).toFixed(1)
  const gy = (mouse.y * 100).toFixed(1)

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        background: "var(--color-bg)",
        // Safe padding — no decorative elements stealing space on mobile
        padding: "clamp(6rem,12vw,9rem) clamp(1.5rem,6vw,5rem) clamp(4rem,8vw,6rem)",
      }}
    >
      {/* Grain */}
      <canvas ref={canvasRef} style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 1,
        mixBlendMode: "overlay",
      }} />

      {/* Mouse ambient — desktop only via media */}
      <div className="hero-ambient" style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse 60% 55% at ${gx}% ${gy}%, ${acc}${isDark ? "1e" : "12"} 0%, transparent 65%)`,
        transition: "background 0.08s ease",
      }} />

      {/* Bottom-left accent blob */}
      <div style={{
        position: "absolute", bottom: "-15%", left: "-10%",
        width: "clamp(200px,45vw,500px)", height: "clamp(200px,45vw,500px)",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${acc}${isDark ? "14" : "0a"} 0%, transparent 70%)`,
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ── CONTENT ── */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: "100%" }}>

        {/* Eyebrow */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          marginBottom: "clamp(1.25rem,3vw,2.25rem)",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "none" : "translateY(16px)",
          transition: "all 0.7s ease 0.15s",
          flexWrap: "wrap",
        }}>
          <div style={{ width: 24, height: "1px", background: acc, flexShrink: 0 }} />
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.52rem,1.5vw,0.65rem)",
            letterSpacing: "0.16em", textTransform: "uppercase", color: acc,
          }}>Brian Chege · Developer & CTO</span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.8rem,9vw,9rem)",
          fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9,
          margin: "0 0 clamp(1.5rem,4vw,3rem)",
          userSelect: "none",
          // Prevent mobile overflow
          wordBreak: "keep-all",
          overflowWrap: "normal",
        }}>
          <div style={{
            overflow: "hidden",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "none" : "translateY(40px)",
            transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s",
          }}>
            <span style={{ color: "var(--color-text-primary)" }}>I Build</span>
          </div>
          <div style={{
            overflow: "hidden",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "none" : "translateY(40px)",
            transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.32s",
          }}>
            <span style={{ color: "var(--color-text-primary)" }}>Software That</span>
          </div>
          {/* Rotating word line */}
          <div style={{
            overflow: "visible",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "none" : "translateY(40px)",
            transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.44s",
          }}>
            {revealed && <RotatingWord color={acc} />}
          </div>
        </h1>

        {/* Bottom content — stacks on mobile, side by side on desktop */}
        <div style={{
          display: "flex",
          gap: "clamp(1.5rem,5vw,4rem)",
          flexWrap: "wrap",
          alignItems: "flex-start",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "none" : "translateY(20px)",
          transition: "all 0.8s ease 0.6s",
        }}>
          {/* Description */}
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.85rem,1.3vw,1rem)",
            color: "var(--color-text-muted)", lineHeight: 1.7,
            margin: 0,
            maxWidth: "clamp(260px,35vw,400px)",
            flex: "1 1 260px",
          }}>
            3+ years shipping products across AI, mobile, web and cloud. Co-founder & CTO of two startups. Every line of code is intentional.
          </p>

          {/* Stats — wrap gracefully on mobile */}
          <div style={{
            display: "flex",
            gap: "clamp(1.25rem,3vw,2.75rem)",
            flexWrap: "wrap",
            flex: "0 0 auto",
          }}>
            {[
              { n: "20+", label: "Projects" },
              { n: "7+",  label: "Companies" },
              { n: "3+",  label: "Years" },
              { n: "2×",  label: "CTO" },
            ].map(({ n, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem,3.5vw,2.75rem)",
                  fontWeight: 800, letterSpacing: "-0.05em",
                  color: acc, lineHeight: 1,
                }}>{n}</div>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "var(--color-text-muted)", marginTop: "0.25rem",
                }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator — hidden on very short screens */}
      <div style={{
        position: "absolute", bottom: "clamp(1.25rem,3vw,2rem)", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
        zIndex: 3,
        opacity: revealed ? 0.6 : 0,
        transition: "opacity 0.8s ease 1.2s",
      }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.46rem",
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--color-text-muted)",
        }}>Scroll</span>
        <div style={{
          width: 1, height: 32,
          background: `linear-gradient(to bottom, ${acc}, transparent)`,
          animation: "scrollPulse 1.8s ease-in-out infinite",
        }} />
      </div>

      {/* Vertical label — desktop only, positioned safely */}
      <div className="hero-side-label" style={{
        position: "absolute", right: "clamp(1rem,2.5vw,2rem)", top: "50%",
        transform: "translateY(-50%)",
        zIndex: 3,
        opacity: revealed ? 0.35 : 0,
        transition: "opacity 0.8s ease 1s",
      }}>
        <div style={{
          writingMode: "vertical-rl",
          fontFamily: "var(--font-mono)",
          fontSize: "0.48rem", letterSpacing: "0.18em", textTransform: "uppercase",
          color: "var(--color-text-muted)",
        }}>Full-Stack · Mobile · AI · Cloud · DevOps</div>
      </div>

      <style jsx global>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1);    }
          50%       { opacity: 1;   transform: scaleY(1.2); }
        }
        @keyframes liveDot {
          0%, 100% { opacity: 1; transform: scale(1);   }
          50%       { opacity: 0.4; transform: scale(1.5); }
        }
        @keyframes wordEnter {
          from { transform: translateY(110%); opacity: 0; }
          to   { transform: translateY(0%);   opacity: 1; }
        }
        /* Hide side decorations on mobile — they eat content space */
        @media (max-width: 640px) {
          .hero-side-label { display: none !important; }
          .hero-ambient    { display: none !important; }
        }
      `}</style>
    </section>
  )
}