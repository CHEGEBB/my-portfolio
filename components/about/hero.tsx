"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"

// ─── Safe keyframe injection — never via <style jsx global> ──────────────────
const KF = `
  @keyframes charReveal {
    from { opacity:0; transform:translateY(60px) rotateX(-80deg); transform-origin:50% 100%; }
    to   { opacity:1; transform:translateY(0)    rotateX(0deg);   transform-origin:50% 100%; }
  }
  @keyframes wordReveal {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes eyebrowReveal {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes scrollPulse {
    0%,100% { opacity:.25; }
    50%     { opacity:1;   }
  }
`

function useKeyframes(id: string, css: string) {
  useEffect(() => {
    if (document.getElementById(id)) return
    const el = document.createElement("style")
    el.id = id; el.textContent = css
    document.head.appendChild(el)
    return () => { document.getElementById(id)?.remove() }
  }, [id, css])
}

// ─── Particle sphere — pure canvas2D, no Three.js / R3F ──────────────────────
function SphereCanvas({ accent, isDark, mouse }: {
  accent: string
  isDark: boolean
  mouse: React.MutableRefObject<{ x: number; y: number }>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx    = canvas.getContext("2d"); if (!ctx) return

    const hex = accent.replace("#", "")
    const cr  = parseInt(hex.slice(0,2), 16)
    const cg  = parseInt(hex.slice(2,4), 16)
    const cb  = parseInt(hex.slice(4,6), 16)

    let W = 0, H = 0
    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width  = W * (window.devicePixelRatio || 1)
      canvas.height = H * (window.devicePixelRatio || 1)
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
    }
    resize()
    window.addEventListener("resize", resize, { passive: true })

    // Fibonacci sphere distribution
    const N = 200
    const golden = Math.PI * (3 - Math.sqrt(5))
    const pts: { x: number; y: number; z: number }[] = []
    for (let i = 0; i < N; i++) {
      const y  = 1 - (i / (N - 1)) * 2
      const r  = Math.sqrt(1 - y * y)
      const th = golden * i
      pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r })
    }

    const currRX = { v: 0 }, currRY = { v: 0 }

    let raf: number
    const draw = (ts: number) => {
      const t = ts * 0.001
      ctx.clearRect(0, 0, W, H)

      const targRY = t * 0.18 + mouse.current.x * 0.4
      const targRX = t * 0.08 - mouse.current.y * 0.25
      currRX.v += (targRX - currRX.v) * 0.04
      currRY.v += (targRY - currRY.v) * 0.04

      const cosX = Math.cos(currRX.v), sinX = Math.sin(currRX.v)
      const cosY = Math.cos(currRY.v), sinY = Math.sin(currRY.v)

      const cx  = W / 2, cy = H / 2
      const rad = Math.min(W, H) * 0.28

      const proj = pts.map(p => {
        const x1 =  p.x * cosY + p.z * sinY
        const z1 = -p.x * sinY + p.z * cosY
        const y2 =  p.y * cosX - z1  * sinX
        const z2 =  p.y * sinX + z1  * cosX
        const sc = 2.2 / (2.2 + z2)
        return { sx: cx + x1 * rad * sc, sy: cy - y2 * rad * sc, z: z2, sc }
      })

      // Connections
      const CONN_DIST = rad * 0.28
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = proj[i], b = proj[j]
          const dx = a.sx - b.sx, dy = a.sy - b.sy
          const d  = Math.sqrt(dx*dx + dy*dy)
          if (d > CONN_DIST) continue
          const depth = ((a.z + b.z) / 2 + 1) / 2
          const alpha = (1 - d / CONN_DIST) * depth * (isDark ? 0.16 : 0.1)
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`
          ctx.lineWidth   = 0.5
          ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke()
        }
      }

      // Dots
      proj.forEach(p => {
        const depth = (p.z + 1) / 2
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, p.sc * 1.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${depth * (isDark ? 0.65 : 0.45)})`
        ctx.fill()
      })

      // Glow halo
      const grad = ctx.createRadialGradient(cx, cy, rad * 0.5, cx, cy, rad * 1.5)
      grad.addColorStop(0, `rgba(${cr},${cg},${cb},${isDark ? 0.07 : 0.04})`)
      grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
      ctx.beginPath()
      ctx.arc(cx, cy, rad * 1.5, 0, Math.PI * 2)
      ctx.fillStyle = grad; ctx.fill()

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [accent, isDark])

  return (
    <canvas
      ref={canvasRef}
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }}
    />
  )
}

// ─── AnimatedChar ─────────────────────────────────────────────────────────────
function AnimatedChar({ char, delay, outline, acc, isDark }: {
  char: string; delay: number; outline: boolean; acc: string; isDark: boolean
}) {
  return (
    <span style={{
      display: "inline-block",
      animation: `charReveal 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
      color:            outline ? "transparent" : isDark ? "#ffffff" : "#0a0a14",
      WebkitTextStroke: outline ? `2px ${acc}` : undefined,
    }}>
      {char === " " ? "\u00a0" : char}
    </span>
  )
}

// ─── AnimatedWord ─────────────────────────────────────────────────────────────
function AnimatedWord({ word, delay }: { word: string; delay: number }) {
  return (
    <span style={{
      display: "inline-block", marginRight: "0.3em",
      animation: `wordReveal 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
    }}>
      {word}
    </span>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function AboutHero() {
  const { theme }  = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const mouseRef   = useRef({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  useKeyframes("about-hero-kf", KF)
  useEffect(() => { setMounted(true) }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current; if (!el) return
    const r  = el.getBoundingClientRect()
    mouseRef.current = {
      x:  ((e.clientX - r.left) / r.width  - 0.5) * 2,
      y: -(((e.clientY - r.top)  / r.height) - 0.5) * 2,
    }
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  if (!mounted) return null

  const line1 = "Not just a"
  const line2 = "developer."
  const sub   = "A builder, a founder, a problem-solver who happens to write excellent code. Based in Kenya. Working for the world."

  const charBaseDelay = 0.35
  const charStagger   = 0.042
  const line1End      = charBaseDelay + line1.length * charStagger
  const wordBaseDelay = line1End + line2.length * charStagger * 0.6 + 0.1

  return (
    <section
      ref={sectionRef}
      style={{
        position:"relative", height:"100svh",
        display:"flex", flexDirection:"column", justifyContent:"flex-end",
        overflow:"hidden",
        background: isDark ? "#07070F" : "#F0F0FA",
      }}
    >
      {/* Sphere — pure canvas2D, zero R3F, zero reconciler conflict */}
      <SphereCanvas accent={acc} isDark={isDark} mouse={mouseRef} />

      {/* Noise */}
      <div aria-hidden style={{
        position:"absolute", inset:0, zIndex:1, pointerEvents:"none",
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize:"256px", mixBlendMode: isDark ? "overlay" : "multiply", opacity:0.6,
      }}/>

      {/* Bottom fade */}
      <div aria-hidden style={{
        position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
        background: isDark
          ? "linear-gradient(to top,#07070F 0%,#07070Fcc 35%,transparent 65%)"
          : "linear-gradient(to top,#F0F0FA 0%,#F0F0FAcc 30%,transparent 60%)",
      }}/>

      {/* Corner label */}
      <div style={{
        position:"absolute", top:"clamp(5rem,9vw,7rem)", right:"clamp(1.5rem,4vw,3rem)", zIndex:5,
        display:"flex", flexDirection:"column", alignItems:"flex-end", gap:".3rem",
        animation:"eyebrowReveal 0.8s ease 0.1s both",
      }}>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:".5rem", letterSpacing:".18em", textTransform:"uppercase", color:"var(--color-text-muted)", opacity:.4 }}>BRIAN_CHEGE.EXE</span>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:".5rem", letterSpacing:".12em", color:acc, opacity:.6 }}>v3.0 · RUNNING</span>
      </div>

      {/* Main text */}
      <div style={{ position:"relative", zIndex:5, padding:"0 clamp(1.5rem,6vw,5rem) clamp(3rem,6vw,5rem)" }}>

        <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"clamp(1rem,2.5vw,2rem)", animation:"eyebrowReveal 0.7s ease 0.2s both" }}>
          <div style={{ width:28, height:1, background:acc }}/>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(.52rem,1vw,.64rem)", letterSpacing:".18em", textTransform:"uppercase", color:acc }}>About the developer</span>
        </div>

        <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3rem,11vw,10.5rem)", fontWeight:800, letterSpacing:"-.05em", lineHeight:.9, margin:"0 0 clamp(1.5rem,3vw,2.5rem)" }}>
          <span style={{ display:"block" }}>
            {line1.split("").map((ch,i) => (
              <AnimatedChar key={i} char={ch} delay={charBaseDelay + i*charStagger} outline={false} acc={acc} isDark={isDark}/>
            ))}
          </span>
          <span style={{ display:"block" }}>
            {line2.split("").map((ch,i) => (
              <AnimatedChar key={i} char={ch} delay={line1End + i*charStagger} outline={true} acc={acc} isDark={isDark}/>
            ))}
          </span>
        </h1>

        <p style={{ fontFamily:"var(--font-body)", fontSize:"clamp(.9rem,1.5vw,1.15rem)", color:"var(--color-text-muted)", lineHeight:1.7, maxWidth:560, margin:0 }}>
          {sub.split(" ").map((word,i) => (
            <AnimatedWord key={i} word={word} delay={wordBaseDelay + i * 0.04}/>
          ))}
        </p>
      </div>

      {/* Scroll cue */}
      <div style={{ position:"absolute", bottom:"clamp(1.5rem,3vw,2.5rem)", left:"50%", transform:"translateX(-50%)", zIndex:5, animation:"scrollPulse 2.2s ease-in-out infinite" }}>
        <div style={{ width:1, height:44, background:`linear-gradient(to bottom,${acc},transparent)` }}/>
      </div>
    </section>
  )
}