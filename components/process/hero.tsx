"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"

// ─── Particle flow field — pure 2D canvas ─────────────────────────────────────
function FlowCanvas({ accent, isDark, mouse }: {
  accent: string
  isDark: boolean
  mouse: React.MutableRefObject<{ x: number; y: number }>
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    const hex = accent.replace("#", "")
    const cr = parseInt(hex.slice(0,2),16), cg = parseInt(hex.slice(2,4),16), cb = parseInt(hex.slice(4,6),16)

    let W = 0, H = 0, raf: number
    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width  = W * (devicePixelRatio||1)
      canvas.height = H * (devicePixelRatio||1)
      ctx.setTransform(devicePixelRatio||1,0,0,devicePixelRatio||1,0,0)
    }
    resize()
    window.addEventListener("resize", resize, { passive:true })

    // Curl noise field particles
    const P = Array.from({ length: 90 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: 0, vy: 0,
      life: Math.random(),
      speed: 0.0004 + Math.random() * 0.0006,
      size: 1 + Math.random() * 1.4,
    }))

    const field = (x: number, y: number, t: number) => {
      // Two-octave curl
      const a1 = Math.sin(x * 3.1 + t) * Math.cos(y * 2.7 - t * 0.7)
      const a2 = Math.cos(x * 1.9 - t * 0.5) * Math.sin(y * 3.3 + t * 0.9)
      return (a1 + a2) * Math.PI
    }

    const draw = (ts: number) => {
      const t = ts * 0.0004
      ctx.clearRect(0,0,W,H)

      const mx = mouse.current.x, my = mouse.current.y

      P.forEach(p => {
        const angle = field(p.x * 2, p.y * 2, t) + mx * 0.5
        const speed = p.speed * (1 + Math.abs(mx) * 0.3)
        p.vx = p.vx * 0.88 + Math.cos(angle) * speed
        p.vy = p.vy * 0.88 + Math.sin(angle) * speed + my * 0.0001
        p.x += p.vx; p.y += p.vy
        p.life += 0.004
        if (p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1 || p.life > 1) {
          p.x = Math.random(); p.y = Math.random(); p.vx = 0; p.vy = 0; p.life = 0
        }
        const fade = Math.sin(p.life * Math.PI)
        ctx.beginPath()
        ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${fade * (isDark ? 0.55 : 0.38)})`
        ctx.fill()
      })

      // Faint flow lines — sparse grid of angle indicators
      for (let c = 0; c < 18; c++) {
        for (let r = 0; r < 11; r++) {
          const x = (c / 17), y = (r / 10)
          const angle = field(x * 2, y * 2, t)
          const len = 22, px = x * W, py = y * H
          ctx.beginPath()
          ctx.moveTo(px - Math.cos(angle) * len * 0.3, py - Math.sin(angle) * len * 0.3)
          ctx.lineTo(px + Math.cos(angle) * len * 0.7, py + Math.sin(angle) * len * 0.7)
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${isDark ? 0.05 : 0.035})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }

      // Soft centre glow that breathes
      const pulse = 0.55 + Math.sin(t * 2.5) * 0.08
      const gx = W * (0.58 + mx * 0.05), gy = H * (0.42 - my * 0.04)
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, W * pulse * 0.55)
      g.addColorStop(0, `rgba(${cr},${cg},${cb},${isDark ? 0.1 : 0.06})`)
      g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
      ctx.beginPath(); ctx.arc(gx, gy, W * pulse * 0.55, 0, Math.PI*2)
      ctx.fillStyle = g; ctx.fill()

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize) }
  }, [accent, isDark])

  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />
}

// ─── Scroll cue — zero keyframes ──────────────────────────────────────────────
function ScrollCue({ accent, vis }: { accent: string; vis: boolean }) {
  const [bright, setBright] = useState(false)
  useEffect(() => {
    if (!vis) return
    const id = setInterval(() => setBright(b => !b), 1000)
    return () => clearInterval(id)
  }, [vis])
  return (
    <div style={{
      position:"absolute", bottom:"clamp(1.5rem,3vw,2.5rem)", left:"50%",
      transform:"translateX(-50%)", zIndex:5,
      opacity: vis ? 1 : 0, transition:"opacity .6s ease .9s",
    }}>
      <div style={{
        width:1, height:44,
        background:`linear-gradient(to bottom,${accent},transparent)`,
        opacity: bright ? 1 : 0.22,
        transform: bright ? "scaleY(1.2)" : "scaleY(1)",
        transition:"opacity 1s ease, transform 1s ease", transformOrigin:"top",
      }}/>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export function ProcessHero() {
  const { theme }  = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const mouseRef   = useRef({ x:0, y:0 })
  const [vis, setVis] = useState(false)

  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent
  const E = "cubic-bezier(0.16,1,0.3,1)"

  useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t) }, [])

  const onMM = useCallback((e: MouseEvent) => {
    const el = sectionRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    mouseRef.current = {
      x:  ((e.clientX - r.left) / r.width  - 0.5) * 2,
      y: -(((e.clientY - r.top)  / r.height) - 0.5) * 2,
    }
  }, [])
  useEffect(() => {
    window.addEventListener("mousemove", onMM, { passive:true })
    return () => window.removeEventListener("mousemove", onMM)
  }, [onMM])

  const fade = (delay = 0): React.CSSProperties => ({
    opacity:   vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(36px)",
    transition: `opacity .85s ${E} ${delay}s, transform .85s ${E} ${delay}s`,
  })

  return (
    <section ref={sectionRef} style={{
      position:"relative", height:"100svh",
      display:"flex", flexDirection:"column", justifyContent:"flex-end",
      overflow:"hidden", background: isDark ? "#07070F" : "#F0F0FA",
    }}>
      <FlowCanvas accent={acc} isDark={isDark} mouse={mouseRef} />

      {/* Noise */}
      <div aria-hidden style={{
        position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize:"256px", mixBlendMode: isDark ? "overlay" : "multiply", opacity:.6,
      }}/>

      {/* Bottom fade */}
      <div aria-hidden style={{
        position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
        background: isDark
          ? "linear-gradient(to top,#07070F 0%,#07070Fcc 35%,transparent 65%)"
          : "linear-gradient(to top,#F0F0FA 0%,#F0F0FAcc 30%,transparent 60%)",
      }}/>

      {/* Text — anchored bottom */}
      <div style={{ position:"relative", zIndex:5, padding:"0 clamp(1.5rem,6vw,5rem) clamp(3rem,6vw,5rem)" }}>

        <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"clamp(1rem,2.5vw,2rem)", ...fade(0.12) }}>
          <div style={{ width:28, height:1, background:acc }}/>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(.52rem,1vw,.64rem)", letterSpacing:".18em", textTransform:"uppercase", color:acc }}>
            How I work
          </span>
        </div>

        <div style={{ overflow:"hidden", marginBottom:".05em" }}>
          <h1 style={{
            fontFamily:"var(--font-display)", fontSize:"clamp(3rem,11vw,10.5rem)",
            fontWeight:800, letterSpacing:"-.05em", lineHeight:.9, margin:0,
            color: isDark ? "#ffffff" : "#0a0a14", ...fade(0.22),
          }}>Process.</h1>
        </div>

        <div style={{ overflow:"hidden", marginBottom:"clamp(1.5rem,3vw,2.5rem)" }}>
          <h1 style={{
            fontFamily:"var(--font-display)", fontSize:"clamp(3rem,11vw,10.5rem)",
            fontWeight:800, letterSpacing:"-.05em", lineHeight:.9, margin:0,
            color:"transparent", WebkitTextStroke:`2px ${acc}`,
            textShadow:`0 0 80px ${acc}55`, ...fade(0.34),
          }}>Not magic.</h1>
        </div>

        <p style={{
          fontFamily:"var(--font-body)", fontSize:"clamp(.9rem,1.5vw,1.15rem)",
          color:"var(--color-text-muted)", lineHeight:1.72, maxWidth:540, margin:0,
          ...fade(0.46),
        }}>
          Five phases. Ruthless communication. Zero ambiguity. Every project I ship runs the same disciplined system — because consistency is what makes great software, not talent alone.
        </p>
      </div>

      <ScrollCue accent={acc} vis={vis} />
    </section>
  )
}