"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"

// ─── ROTATING WORD ────────────────────────────────────────────────────────────
const ROTATING_WORDS = ["Ships.", "Scales.", "Matters.", "Lasts.", "Works."]

function RotatingWord({ color }: { color: string }) {
  const [idx,     setIdx]     = useState(0)
  const [exiting, setExiting] = useState(false)
  const [next,    setNext]    = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setExiting(true)
      const upcoming = (idx + 1) % ROTATING_WORDS.length
      setNext(upcoming)
      setTimeout(() => { setIdx(upcoming); setExiting(false) }, 380)
    }, 2400)
    return () => clearInterval(interval)
  }, [idx])

  return (
    <span style={{ position: "relative", display: "inline-block", overflow: "hidden" }}>
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
      {exiting && (
        <span style={{
          position: "absolute", left: 0, top: 0,
          display: "inline-block",
          color: "transparent",
          WebkitTextStroke: `2px ${color}`,
          textShadow: `0 0 60px ${color}55`,
          animation: "svcWordEnter 0.45s cubic-bezier(0.16,1,0.3,1) 0.18s both",
          whiteSpace: "nowrap",
        }}>{ROTATING_WORDS[next]}</span>
      )}
    </span>
  )
}

// ─── DIAGONAL DOT GRID ────────────────────────────────────────────────────────
// Different from PortfolioHero: dots are denser, arranged on a 45° rotated grid,
// and a slow diagonal "beam" sweeps across them continuously.
function DiagonalDotCanvas({ acc, isDark }: { acc: string; isDark: boolean }) {
  const ref    = useRef<HTMLCanvasElement>(null)
  const mouse  = useRef({ x: -9999, y: -9999 })
  const animId = useRef(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 } }
    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mouseleave", onLeave)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return

    const h = acc.replace("#", "")
    const cr = parseInt(h.slice(0, 2), 16)
    const cg = parseInt(h.slice(2, 4), 16)
    const cb = parseInt(h.slice(4, 6), 16)

    const SPACING = 28
    const BASE_R  = 1.2
    const MAX_R   = 5.5
    const REACH   = 140

    let W = 0, H = 0

    const resize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    resize()
    window.addEventListener("resize", resize, { passive: true })

    let t = 0
    const draw = () => {
      t += 0.009
      ctx.clearRect(0, 0, W, H)

      // Diagonal beam position: moves from top-left to bottom-right, then loops
      const beamPos = (t * 0.4) % 2  // 0→2 range
      const beamX = (beamPos - 0.5) * (W + H)
      // The beam is a diagonal line: x - y = beamX (45° angle)

      const cols = Math.ceil(W / SPACING) + 2
      const rows = Math.ceil(H / SPACING) + 2
      const mx = mouse.current.x
      const my = mouse.current.y

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Offset every other row for a staggered hex-ish feel
          const offsetX = (r % 2) * (SPACING / 2)
          const x = c * SPACING + offsetX - SPACING
          const y = r * SPACING - SPACING

          // Mouse proximity
          const dx   = x - mx
          const dy   = y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          const prox = Math.max(0, 1 - dist / REACH)

          // Diagonal beam proximity — how close is this dot to the beam line?
          const diagDist = Math.abs((x - y) - beamX)
          const beamProx = Math.max(0, 1 - diagDist / (SPACING * 4))

          // Phase wave — diagonal ripple based on (x+y)
          const phase = (x + y) * 0.012
          const wave  = Math.sin(t * 1.1 + phase) * 0.5 + 0.5

          const radius = BASE_R + prox * (MAX_R - BASE_R) + beamProx * 2.5
          const alpha  = isDark
            ? 0.05 + wave * 0.07 + prox * 0.75 + beamProx * 0.55
            : 0.08 + wave * 0.08 + prox * 0.65 + beamProx * 0.45

          ctx.beginPath()
          ctx.arc(x, y, Math.max(0.5, radius), 0, Math.PI * 2)

          if (prox > 0.01 || beamProx > 0.05) {
            ctx.fillStyle = `rgba(${cr},${cg},${cb},${Math.min(alpha, 0.95)})`
          } else {
            // Neutral dim colour, slightly tinted
            const neutral = isDark ? 55 : 185
            const rr = Math.round(neutral + cr * wave * 0.12)
            const gg = Math.round(neutral + cg * wave * 0.12)
            const bb = Math.round(neutral + cb * wave * 0.12)
            ctx.fillStyle = `rgba(${rr},${gg},${bb},${Math.min(alpha, 0.9)})`
          }
          ctx.fill()
        }
      }

      animId.current = requestAnimationFrame(draw)
    }
    animId.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId.current)
      window.removeEventListener("resize", resize)
    }
  }, [acc, isDark])

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    />
  )
}

// ─── SERVICE TAGS ─────────────────────────────────────────────────────────────
const SERVICES = [
  { label: "Full-Stack Web",  num: "01" },
  { label: "Mobile · Flutter",num: "02" },
  { label: "AI Integration",  num: "03" },
  { label: "Cloud & DevOps",  num: "04" },
  { label: "CTO Advisory",    num: "05" },
]

function ServiceTag({ label, num, acc, delay, revealed, isDark }: {
  label: string; num: string; acc: string; delay: number; revealed: boolean; isDark: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: "0.9rem",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateX(0)" : "translateX(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        cursor: "default",
        padding: "0.5rem 0",
      }}
    >
      {/* Number */}
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.5rem",
        letterSpacing: "0.1em",
        color: hovered ? acc : `${acc}55`,
        transition: "color 0.3s ease",
        flexShrink: 0,
        minWidth: "1.8ch",
      }}>{num}</span>

      {/* Expanding line */}
      <div style={{
        height: "1px",
        width: hovered ? "clamp(24px,3vw,40px)" : "clamp(12px,1.5vw,20px)",
        background: hovered ? acc : `${acc}44`,
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        flexShrink: 0,
      }} />

      {/* Label */}
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: "clamp(0.6rem, 0.9vw, 0.75rem)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: hovered ? "var(--color-text-primary)" : "var(--color-text-muted)",
        transition: "color 0.3s ease",
        whiteSpace: "nowrap",
      }}>{label}</span>

      {/* Active dot */}
      {hovered && (
        <div style={{
          width: 4, height: 4, borderRadius: "50%",
          background: acc,
          boxShadow: `0 0 8px ${acc}`,
          flexShrink: 0,
          animation: "svcDotPop 0.3s cubic-bezier(0.16,1,0.3,1) both",
        }} />
      )}
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function ServicesHero() {
  const { theme }  = useTheme()
  const ref        = useRef<HTMLDivElement>(null)
  const [mounted,  setMounted]  = useState(false)
  const [revealed, setRevealed] = useState(false)

  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setRevealed(true), 80)
    return () => clearTimeout(t)
  }, [])

  if (!mounted) return null

  const E = "cubic-bezier(0.16,1,0.3,1)"
  const slide = (delay = 0, axis: "Y" | "X" = "Y", dist = 28): React.CSSProperties => ({
    opacity:    revealed ? 1 : 0,
    transform:  revealed ? "none" : `translate${axis}(${dist}px)`,
    transition: `opacity .75s ease ${delay}s, transform .9s ${E} ${delay}s`,
  })

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
      }}
    >
      {/* ── DIAGONAL DOT GRID ── */}
      <DiagonalDotCanvas acc={acc} isDark={isDark} />

      {/* Centre vignette — keeps text legible */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: isDark
          ? `radial-gradient(ellipse 75% 85% at 38% 52%, #07070Fee 0%, #07070F99 45%, transparent 75%)`
          : `radial-gradient(ellipse 75% 85% at 38% 52%, #F6F6FCee 0%, #F6F6FC99 45%, transparent 75%)`,
      }} />

      {/* Bottom gradient */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
        zIndex: 1, pointerEvents: "none",
        background: `linear-gradient(to top, var(--color-bg) 0%, transparent 100%)`,
      }} />

      {/* ── SPLIT LAYOUT ── */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "grid",
        gridTemplateColumns: "1fr clamp(160px, 28vw, 360px)",
        gap: "clamp(2rem, 6vw, 6rem)",
        alignItems: "center",
        padding: "clamp(6rem,12vw,9rem) clamp(1.5rem,6vw,5rem) clamp(4rem,8vw,6rem)",
        maxWidth: "1400px",
        margin: "0 auto",
        width: "100%",
      }}>

        {/* ── LEFT: HEADLINE BLOCK ── */}
        <div>
          {/* Eyebrow */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            marginBottom: "clamp(1.25rem,3vw,2.25rem)",
            flexWrap: "wrap",
            ...slide(0.1),
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
            fontSize: "clamp(2.8rem,8vw,8.5rem)",
            fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9,
            margin: "0 0 clamp(1.5rem,4vw,3rem)",
            wordBreak: "keep-all",
          }}>
            <div style={{ overflow: "hidden", ...slide(0.2) }}>
              <span style={{ color: "var(--color-text-primary)", display: "block" }}>I Build</span>
            </div>
            <div style={{ overflow: "hidden", ...slide(0.3) }}>
              <span style={{ color: "var(--color-text-primary)", display: "block" }}>Software That</span>
            </div>
            <div style={{ overflow: "visible", ...slide(0.42) }}>
              {revealed && <RotatingWord color={acc} />}
            </div>
          </h1>

          {/* Body + stats */}
          <div style={{
            display: "flex",
            gap: "clamp(1.5rem,5vw,4rem)",
            flexWrap: "wrap",
            alignItems: "flex-start",
            ...slide(0.58),
          }}>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.85rem,1.3vw,1rem)",
              color: "var(--color-text-muted)", lineHeight: 1.72,
              margin: 0,
              maxWidth: "clamp(240px,32vw,380px)",
              flex: "1 1 240px",
            }}>
              3+ years shipping products across AI, mobile, web and cloud. Co-founder & CTO of two startups. Every line of code is intentional.
            </p>

            <div style={{ display: "flex", gap: "clamp(1.25rem,3vw,2.75rem)", flexWrap: "wrap", flex: "0 0 auto" }}>
              {[
                { n: "20+", label: "Projects" },
                { n: "7+",  label: "Companies" },
                { n: "3+",  label: "Years" },
                { n: "2×",  label: "CTO" },
              ].map(({ n, label }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.5rem,3vw,2.5rem)",
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

        {/* ── RIGHT: SERVICE TAGS HUD ── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.1rem, 0.5vw, 0.4rem)",
          borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          paddingLeft: "clamp(1.5rem,3vw,2.5rem)",
        }}>
          {/* HUD header */}
          <div style={{
            ...slide(0.5, "X", -20),
            marginBottom: "clamp(0.75rem,1.5vw,1.25rem)",
          }}>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.48rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: `${acc}66`,
            }}>Services</span>
          </div>

          {SERVICES.map((s, i) => (
            <ServiceTag
              key={s.num}
              label={s.label}
              num={s.num}
              acc={acc}
              delay={0.55 + i * 0.08}
              revealed={revealed}
              isDark={isDark}
            />
          ))}

          {/* Bottom rule + tag */}
          <div style={{
            marginTop: "clamp(1rem,2vw,1.5rem)",
            paddingTop: "clamp(0.75rem,1.5vw,1rem)",
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            ...slide(1.0, "X", -16),
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "var(--color-success)",
                boxShadow: "0 0 6px var(--color-success)",
                animation: "svcPulse 2s ease-in-out infinite",
              }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.48rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--color-success)",
              }}>Available for work</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "clamp(1.25rem,3vw,2rem)", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
        zIndex: 3,
        opacity: revealed ? 0.55 : 0,
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
          animation: "svcScrollPulse 1.8s ease-in-out infinite",
        }} />
      </div>

      {/* Vertical label — desktop only */}
      <div style={{
        position: "absolute", right: "clamp(1rem,2.5vw,2rem)", top: "50%",
        transform: "translateY(-50%)",
        zIndex: 3,
        opacity: revealed ? 0.3 : 0,
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
        @keyframes svcScrollPulse { 0%,100%{opacity:0.4;transform:scaleY(1)}    50%{opacity:1;transform:scaleY(1.2)} }
        @keyframes svcPulse       { 0%,100%{transform:scale(1);opacity:1}        50%{transform:scale(1.6);opacity:0.3} }
        @keyframes svcWordEnter   { from{transform:translateY(110%);opacity:0}   to{transform:translateY(0%);opacity:1} }
        @keyframes svcDotPop      { from{transform:scale(0);opacity:0}           to{transform:scale(1);opacity:1} }
        @media (max-width: 640px) {
          /* Collapse to single column on mobile */
          .svc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}