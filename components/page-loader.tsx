"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/context/theme-context"
import Image from "next/image"

// ─── CONFETTI PARTICLE ────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number; vx: number; vy: number
  color: string; size: number; rotation: number; rotationSpeed: number
  opacity: number; shape: "rect" | "circle" | "line"
  decay: number
}

// ─── MAIN LOADER ─────────────────────────────────────────────────────────────
export function PageLoader({ onComplete }: { onComplete: () => void }) {
  const { theme }         = useTheme()
  const acc               = theme.colors.accent
  const isDark            = theme.mode === "dark"

  const canvasRef         = useRef<HTMLCanvasElement>(null)
  const confettiRef       = useRef<HTMLCanvasElement>(null)
  const rafRef            = useRef<number>(0)
  const confettiRaf       = useRef<number>(0)

  const [progress, setProgress]       = useState(0)
  const [phase, setPhase]             = useState<
    "idle" | "loading" | "logoReveal" | "confetti" | "exit"
  >("idle")

  // paint swipe states for logo
  const [logoPainted, setLogoPainted]   = useState(false)
  const [logoRevealed, setLogoRevealed] = useState(false)

  const bg    = isDark ? "#07070F" : "#F6F6FC"
  const fg    = isDark ? "#EEEEFF" : "#0D0D20"

  // ── Noise canvas background ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const hex = acc
    const rv = parseInt(hex.slice(1,3),16)
    const gv = parseInt(hex.slice(3,5),16)
    const bv = parseInt(hex.slice(5,7),16)

    const pts = Array.from({ length: 60 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - .5) * .3,
      vy: (Math.random() - .5) * .3,
      s:  Math.random() * 1.8 + .4,
      p:  Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.p += .016
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width)  p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rv},${gv},${bv},${.15 + .1 * Math.sin(p.p)})`
        ctx.fill()
      })
      pts.forEach((a, i) => {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(a.x - pts[j].x, a.y - pts[j].y)
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(${rv},${gv},${bv},${(1-d/100)*.05})`
            ctx.lineWidth = .6; ctx.stroke()
          }
        }
      })
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [acc])

  // ── Simulated progress ────────────────────────────────────────────────────
  useEffect(() => {
    setPhase("loading")
    let current = 0
    const target = 100

    // Fast at start, slow in middle, fast at end
    const tick = () => {
      const remaining = target - current
      const speed = current < 30 ? 1.8 : current < 75 ? 0.7 : current < 95 ? 0.4 : 2.5
      current = Math.min(current + speed * (Math.random() * 0.8 + 0.6), target)
      setProgress(Math.floor(current))

      if (current < target) {
        setTimeout(tick, current < 30 ? 18 : current < 75 ? 35 : 55)
      } else {
        // Progress done — start logo reveal sequence
        setTimeout(() => {
          setPhase("logoReveal")
          setLogoPainted(true)
          setTimeout(() => setLogoRevealed(true), 520)
          setTimeout(() => setPhase("confetti"), 900)
          setTimeout(() => setPhase("exit"), 2400)
          setTimeout(() => onComplete(), 3100)
        }, 200)
      }
    }
    setTimeout(tick, 100)
  }, [])

  // ── Confetti burst ────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "confetti") return
    const canvas = confettiRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const colors = [acc, "#ffffff", fg, acc + "88", "#AAFF00", "#FF6B9D", "#45D2B0"]
    const cx = canvas.width  / 2
    const cy = canvas.height / 2

    const particles: Particle[] = Array.from({ length: 180 }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 14 + 4
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - .5) * 8,
        opacity: 1,
        shape: (["rect","circle","line"] as const)[Math.floor(Math.random() * 3)],
        decay: Math.random() * 0.012 + 0.008,
      }
    })

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      particles.forEach(p => {
        if (p.opacity <= 0) return
        alive = true
        p.x  += p.vx
        p.y  += p.vy
        p.vy += 0.35 // gravity
        p.vx *= 0.99
        p.rotation += p.rotationSpeed
        p.opacity  -= p.decay

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle   = p.color
        ctx.strokeStyle = p.color

        if (p.shape === "rect") {
          ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2)
        } else if (p.shape === "circle") {
          ctx.beginPath(); ctx.arc(0, 0, p.size/2, 0, Math.PI*2); ctx.fill()
        } else {
          ctx.lineWidth = 2
          ctx.beginPath(); ctx.moveTo(-p.size/2, 0); ctx.lineTo(p.size/2, 0); ctx.stroke()
        }
        ctx.restore()
      })
      if (alive) confettiRaf.current = requestAnimationFrame(draw)
      else ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    draw()
    return () => cancelAnimationFrame(confettiRaf.current)
  }, [phase, acc, fg])

  const isExiting = phase === "exit"

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      // Exit: whole loader wipes up off screen
      transform: isExiting ? "translateY(-100%)" : "translateY(0%)",
      transition: isExiting ? "transform 0.75s cubic-bezier(0.76,0,0.24,1)" : "none",
      overflow: "hidden",
    }}>

      {/* Noise/particle bg */}
      <canvas ref={canvasRef} style={{
        position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
      }}/>

      {/* Confetti canvas */}
      <canvas ref={confettiRef} style={{
        position:"absolute", inset:0, pointerEvents:"none", zIndex:10,
      }}/>

      {/* Ambient glow */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
        background:`radial-gradient(ellipse 60% 60% at 50% 50%, ${acc}18 0%, transparent 70%)`,
      }}/>

      {/* ── LOGO with paint swipe reveal ── */}
      <div style={{
        position:"relative", zIndex:5,
        display:"flex", flexDirection:"column",
        alignItems:"center", gap:"clamp(2rem,4vw,3rem)",
      }}>

        {/* Logo container */}
        <div style={{
          position:"relative",
          width: "clamp(140px,20vw,220px)",
          overflow:"hidden",
        }}>
          {/* Actual logo */}
          <Image
            src={isDark ? "/logo-dark.png" : "/logo-light.png"}
            alt="Brian Chege"
            width={220} height={80}
            style={{
              width:"100%", height:"auto", display:"block",
              objectFit:"contain",
            }}
            priority
          />

          {/* Paint swipe block 1 — leads */}
          <div style={{
            position:"absolute", inset:0,
            background: acc,
            transform: !logoPainted
              ? "translateX(-101%)"
              : logoRevealed
                ? "translateX(101%)"
                : "translateX(0%)",
            transition: !logoPainted
              ? "none"
              : logoRevealed
                ? "transform 0.5s cubic-bezier(0.76,0,0.24,1) 0s"
                : "transform 0.45s cubic-bezier(0.76,0,0.24,1) 0s",
            zIndex:3,
          }}/>
          {/* Paint swipe block 2 — chases */}
          <div style={{
            position:"absolute", inset:0,
            background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
            transform: !logoPainted
              ? "translateX(-101%)"
              : logoRevealed
                ? "translateX(101%)"
                : "translateX(0%)",
            transition: !logoPainted
              ? "none"
              : logoRevealed
                ? "transform 0.5s cubic-bezier(0.76,0,0.24,1) 0.07s"
                : "transform 0.45s cubic-bezier(0.76,0,0.24,1) 0.07s",
            zIndex:2,
          }}/>
        </div>

        {/* Name + title text — also paint revealed */}
        <div style={{ textAlign:"center", position:"relative" }}>
          {[
            { text:"Brian Chege", large:true,  delay:0.05 },
            { text:"Full Stack Developer", large:false, delay:0.15 },
          ].map((line, i) => (
            <div key={i} style={{ position:"relative", overflow:"hidden", marginBottom: i===0 ? "0.3rem" : 0 }}>
              <div style={{
                fontFamily: i===0 ? "var(--font-display)" : "var(--font-mono)",
                fontSize: i===0 ? "clamp(1.4rem,3vw,2.2rem)" : "clamp(0.55rem,1vw,0.7rem)",
                fontWeight: i===0 ? 800 : 400,
                letterSpacing: i===0 ? "-0.045em" : "0.2em",
                textTransform: i===1 ? "uppercase" : undefined,
                color: i===0 ? fg : acc,
                lineHeight: 1.1,
                padding: "0.05em 0",
              }}>{line.text}</div>

              {/* Paint block 1 */}
              <div style={{
                position:"absolute", inset:0,
                background: acc,
                transform: !logoPainted
                  ? "translateX(-101%)"
                  : logoRevealed
                    ? "translateX(101%)"
                    : "translateX(0%)",
                transition: !logoPainted
                  ? "none"
                  : logoRevealed
                    ? `transform 0.5s cubic-bezier(0.76,0,0.24,1) ${line.delay}s`
                    : `transform 0.45s cubic-bezier(0.76,0,0.24,1) ${line.delay}s`,
                zIndex:3,
              }}/>
              {/* Paint block 2 */}
              <div style={{
                position:"absolute", inset:0,
                background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
                transform: !logoPainted
                  ? "translateX(-101%)"
                  : logoRevealed
                    ? "translateX(101%)"
                    : "translateX(0%)",
                transition: !logoPainted
                  ? "none"
                  : logoRevealed
                    ? `transform 0.5s cubic-bezier(0.76,0,0.24,1) ${line.delay + 0.08}s`
                    : `transform 0.45s cubic-bezier(0.76,0,0.24,1) ${line.delay + 0.08}s`,
                zIndex:2,
              }}/>
            </div>
          ))}
        </div>

        {/* ── PROGRESS BAR ── */}
        <div style={{
          width:"clamp(200px,30vw,320px)",
          opacity: phase === "confetti" || phase === "exit" ? 0 : 1,
          transition:"opacity 0.4s ease",
        }}>
          {/* Track */}
          <div style={{
            height:2,
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            position:"relative", overflow:"hidden",
          }}>
            {/* Fill */}
            <div style={{
              position:"absolute", top:0, left:0,
              height:"100%",
              width:`${progress}%`,
              background:`linear-gradient(90deg, ${acc}88, ${acc})`,
              boxShadow:`0 0 12px ${acc}`,
              transition:"width 0.1s linear",
            }}/>
          </div>

          {/* Counter row */}
          <div style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            marginTop:"0.6rem",
          }}>
            <span style={{
              fontFamily:"var(--font-mono)", fontSize:"0.48rem",
              letterSpacing:"0.14em", textTransform:"uppercase",
              color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
            }}>Loading</span>
            <span style={{
              fontFamily:"var(--font-display)",
              fontSize:"clamp(1rem,2vw,1.4rem)",
              fontWeight:800, letterSpacing:"-0.04em",
              color:acc, lineHeight:1,
            }}>{progress}<span style={{ fontSize:"0.5em", opacity:0.6 }}>%</span></span>
          </div>
        </div>

        {/* ── READY label — fades in after confetti ── */}
        {(phase === "confetti" || phase === "exit") && (
          <div style={{
            fontFamily:"var(--font-mono)", fontSize:"0.55rem",
            letterSpacing:"0.2em", textTransform:"uppercase",
            color:acc,
            animation:"pulseReady 0.6s ease forwards",
            display:"flex", alignItems:"center", gap:"0.5rem",
          }}>
            <div style={{ width:18, height:"1px", background:acc }}/>
            Ready
            <div style={{ width:18, height:"1px", background:acc }}/>
          </div>
        )}
      </div>

      {/* Bottom: version tag */}
      <div style={{
        position:"absolute", bottom:"clamp(1.5rem,3vw,2.5rem)",
        left:"50%", transform:"translateX(-50%)",
        fontFamily:"var(--font-mono)", fontSize:"0.42rem",
        letterSpacing:"0.14em", textTransform:"uppercase",
        color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
        zIndex:5,
        display:"flex", alignItems:"center", gap:"0.75rem",
      }}>
        <div style={{ width:12, height:"1px", background:"currentColor" }}/>
        brianchege.me
        <div style={{ width:12, height:"1px", background:"currentColor" }}/>
      </div>

      <style>{`
        @keyframes pulseReady {
          0%   { opacity:0; transform:translateY(6px); }
          100% { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  )
}