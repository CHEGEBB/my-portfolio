"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/context/theme-context"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const PHASES = [
  {
    num: "01", label: "Discover", duration: "Day 1–2",
    headline: ["One conversation", "changes everything."],
    body: "I listen before I speak. The first session is never about me — it's about understanding your business, your users, and the real problem beneath the stated one. Most developers skip this. I never do.",
    aside: "Bad requirements are the #1 cause of failed projects. Clarity here saves weeks later.",
    color: "#5567F7",
  },
  {
    num: "02", label: "Architect", duration: "Days 3–7",
    headline: ["Blueprint before", "a single line."],
    body: "I map the full technical solution — stack, schema, API contracts, component structure, deployment pipeline. You see and approve the plan before I write a single function.",
    aside: "Every hour spent in architecture saves ten hours in rework. This is where the project is actually built.",
    color: "#45D2B0",
  },
  {
    num: "03", label: "Build", duration: "Weeks 2–N",
    headline: ["Working software,", "not promises."],
    body: "Agile sprints. Every week you see something real — a working screen, a deployed endpoint, a tested flow. Feedback at every step. Changes are cheap early; I make them easy on purpose.",
    aside: "I write tests. I document as I go. The codebase I hand over is one your team can actually maintain.",
    color: "#FF6B9D",
  },
  {
    num: "04", label: "Ship", duration: "Final week",
    headline: ["Launched. Live.", "Zero drama."],
    body: "CI/CD pipeline. Containerised. Monitored from day one. The go-live is a non-event — infrastructure was ready weeks before launch day. No scrambling, no emergencies at 3am.",
    aside: "I've never missed a launch. The system is designed so missing is structurally impossible.",
    color: "#AAFF00",
  },
  {
    num: "05", label: "Evolve", duration: "Ongoing",
    headline: ["Good software", "never stops."],
    body: "Post-launch is where the real data arrives. I stay. I monitor the metrics, triage bugs, and plan the next iteration with you. Software that doesn't evolve dies. Yours won't.",
    aside: "The relationship doesn't end at handover. I'm reachable. I'm accountable. Always.",
    color: "#F5A623",
  },
]

// ─── Each phase has a unique generative canvas visual ─────────────────────────
function PhaseCanvas({ idx, color, isDark, progress }: {
  idx: number; color: string; isDark: boolean; progress: number
}) {
  const ref     = useRef<HTMLCanvasElement>(null)
  const progRef = useRef(progress)
  progRef.current = progress

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    const hex = color.replace("#","")
    const cr = parseInt(hex.slice(0,2),16), cg = parseInt(hex.slice(2,4),16), cb = parseInt(hex.slice(4,6),16)
    let W=0,H=0,raf:number
    const resize = () => {
      W=canvas.offsetWidth; H=canvas.offsetHeight
      canvas.width=W*(devicePixelRatio||1); canvas.height=H*(devicePixelRatio||1)
      ctx.setTransform(devicePixelRatio||1,0,0,devicePixelRatio||1,0,0)
    }
    resize(); window.addEventListener("resize",resize,{passive:true})

    const draw = (ts: number) => {
      const t = ts * 0.0004
      ctx.clearRect(0,0,W,H)
      const p = progRef.current
      const cx = W*0.62, cy = H*0.42

      // ── 01 DISCOVER — converging radial lines collapse to centre ──
      if (idx === 0) {
        const count = 64
        for (let i=0; i<count; i++) {
          const angle = (i/count)*Math.PI*2 + t*0.15
          const outerR = Math.min(W,H) * 0.52
          const innerR = Math.min(W,H) * (0.04 + (1-p)*0.28)
          const sx = cx + Math.cos(angle)*outerR, sy = cy + Math.sin(angle)*outerR*0.72
          const ex = cx + Math.cos(angle)*innerR, ey = cy + Math.sin(angle)*innerR*0.72
          const wave = Math.sin(angle*4 + t*3)*0.5+0.5
          ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(ex,ey)
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${wave*(isDark?.12:.07)*(p*.4+.6)})`
          ctx.lineWidth = .7; ctx.stroke()
        }
        // pulsing core
        const gCore = ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(W,H)*0.22)
        gCore.addColorStop(0,`rgba(${cr},${cg},${cb},${isDark?.18:.1})`)
        gCore.addColorStop(1,`rgba(${cr},${cg},${cb},0)`)
        ctx.beginPath(); ctx.arc(cx,cy,Math.min(W,H)*0.22,0,Math.PI*2)
        ctx.fillStyle=gCore; ctx.fill()
      }

      // ── 02 ARCHITECT — grid assembles itself ──
      if (idx === 1) {
        const STEP = Math.min(W,H)*0.065
        const ox = cx - Math.floor(cx/STEP)*STEP, oy = cy - Math.floor(cy/STEP)*STEP
        // vertical lines draw from centre out
        for (let x=ox; x<W; x+=STEP) {
          const dist = Math.abs(x-cx)/(W*0.5)
          const drawn = Math.max(0,Math.min(H, p*H*2*(1-dist*.4)))
          ctx.beginPath(); ctx.moveTo(x,cy-drawn/2); ctx.lineTo(x,cy+drawn/2)
          ctx.strokeStyle=`rgba(${cr},${cg},${cb},${(1-dist)*(isDark?.07:.04)})`
          ctx.lineWidth=.5; ctx.stroke()
        }
        for (let y=oy; y<H; y+=STEP) {
          const dist = Math.abs(y-cy)/(H*0.5)
          const drawn = Math.max(0,Math.min(W, p*W*2*(1-dist*.4)))
          ctx.beginPath(); ctx.moveTo(cx-drawn/2,y); ctx.lineTo(cx+drawn/2,y)
          ctx.strokeStyle=`rgba(${cr},${cg},${cb},${(1-dist)*(isDark?.07:.04)})`
          ctx.lineWidth=.5; ctx.stroke()
        }
        // nodes
        for (let x=ox; x<W; x+=STEP) for (let y=oy; y<H; y+=STEP) {
          const dist = Math.hypot(x-cx,y-cy)/Math.min(W,H)
          const fade = Math.max(0,(1-dist*1.8)*p)
          if (fade<.05) continue
          ctx.beginPath(); ctx.arc(x,y,2*(Math.sin(t*3+dist*12)*.3+.7),0,Math.PI*2)
          ctx.fillStyle=`rgba(${cr},${cg},${cb},${fade*(isDark?.4:.25)})`; ctx.fill()
        }
      }

      // ── 03 BUILD — matrix rain columns ──
      if (idx === 2) {
        const colW = 20, cols = Math.floor(W/colW)
        for (let c=0; c<cols; c++) {
          const x = c*colW + colW/2
          const offset = Math.sin(c*2.718)*0.5+0.5
          const speed = (1+offset)*0.6
          const head = ((t*speed*200 + offset*H*1.5) % (H+300)) - 150
          const trailLen = 8
          for (let k=0; k<trailLen; k++) {
            const yy = head - k*18
            const fade = (1-k/trailLen) * p * (isDark?.25:.16)
            if (yy<-20 || yy>H+20) continue
            ctx.fillStyle=`rgba(${cr},${cg},${cb},${fade})`
            ctx.font=`${11}px monospace`
            ctx.fillText(String.fromCharCode(48+Math.floor((Math.sin(c*k+t*10)*0.5+0.5)*62)), x, yy)
          }
        }
      }

      // ── 04 SHIP — sonar pulses expand outward ──
      if (idx === 3) {
        const rings = 6
        for (let i=0; i<rings; i++) {
          const phase_r = ((t*0.35 + i/rings) % 1)
          const r = phase_r * Math.min(W,H) * 0.52
          const alpha = (1-phase_r) * p * (isDark?.18:.1)
          ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2)
          ctx.strokeStyle=`rgba(${cr},${cg},${cb},${alpha})`
          ctx.lineWidth=1.5; ctx.stroke()
        }
        // Sweep line
        const sweep = (t*0.6) % (Math.PI*2)
        const sweepR = Math.min(W,H)*0.48
        ctx.beginPath()
        ctx.moveTo(cx,cy)
        for (let a=sweep-Math.PI*0.3; a<sweep; a+=0.04) {
          const fade = (a-(sweep-Math.PI*0.3))/(Math.PI*0.3)
          ctx.lineTo(cx+Math.cos(a)*sweepR*fade, cy+Math.sin(a)*sweepR*fade*0.72)
        }
        ctx.fillStyle=`rgba(${cr},${cg},${cb},${p*(isDark?.06:.035)})`
        ctx.fill()
        // glow core
        const gC=ctx.createRadialGradient(cx,cy,0,cx,cy,80)
        gC.addColorStop(0,`rgba(${cr},${cg},${cb},${p*(isDark?.2:.1)})`)
        gC.addColorStop(1,`rgba(${cr},${cg},${cb},0)`)
        ctx.beginPath(); ctx.arc(cx,cy,80,0,Math.PI*2); ctx.fillStyle=gC; ctx.fill()
      }

      // ── 05 EVOLVE — lemniscate (figure-8) orbit ──
      if (idx === 4) {
        const trail = 200
        for (let i=0; i<trail; i++) {
          const a = t*0.5 - (i/trail)*Math.PI*2
          const d = 1 + Math.sin(a)*Math.sin(a)
          const lx = cx + (Math.cos(a)/d)*W*0.28*(p*.6+.4)
          const ly = cy + (Math.sin(a)*Math.cos(a)/d)*H*0.22*(p*.6+.4)
          const fade = (1-i/trail)*p*(isDark?.6:.4)
          ctx.beginPath(); ctx.arc(lx,ly, 2*(1-i/trail)+.5,0,Math.PI*2)
          ctx.fillStyle=`rgba(${cr},${cg},${cb},${fade})`; ctx.fill()
        }
        // orbiting dot
        const a = t*0.5
        const d = 1+Math.sin(a)*Math.sin(a)
        const hx = cx+(Math.cos(a)/d)*W*0.28, hy = cy+(Math.sin(a)*Math.cos(a)/d)*H*0.22
        ctx.beginPath(); ctx.arc(hx,hy,5,0,Math.PI*2)
        ctx.fillStyle=`rgba(${cr},${cg},${cb},${p*(isDark?1:.8)})`; ctx.fill()
        const gH=ctx.createRadialGradient(hx,hy,0,hx,hy,30)
        gH.addColorStop(0,`rgba(${cr},${cg},${cb},${p*.3})`); gH.addColorStop(1,`rgba(${cr},${cg},${cb},0)`)
        ctx.beginPath(); ctx.arc(hx,hy,30,0,Math.PI*2); ctx.fillStyle=gH; ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize) }
  }, [idx, color, isDark])

  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />
}

// ─── Phases — GSAP scroll-pinned, each phase is a full viewport scene ─────────
export function ProcessPhases() {
  const { theme }  = useTheme()
  const wrapRef    = useRef<HTMLDivElement>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)
  const [active,   setActive]   = useState(0)
  const [progress, setProgress] = useState(0)
  const [vis,      setVis]      = useState(false)
  const isDark = theme.mode === "dark"

  const ph  = PHASES[active]
  const E   = "cubic-bezier(0.16,1,0.3,1)"

  useEffect(() => {
    const wrap = wrapRef.current; const sticky = stickyRef.current
    if (!wrap || !sticky) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: () => `+=${(PHASES.length - 1) * window.innerHeight * 1.3}`,
        pin: sticky,
        pinSpacing: true,
        scrub: 1,
        onUpdate(self) {
          const raw = self.progress * PHASES.length
          const idx = Math.min(PHASES.length - 1, Math.floor(raw))
          const within = raw % 1
          setActive(idx)
          setProgress(within)
        },
      })
    }, wrapRef)

    const t = setTimeout(() => setVis(true), 80)
    return () => { ctx.revert(); clearTimeout(t) }
  }, [])

  // Fade helpers — rebuilds on active change
  const fade = (delay = 0): React.CSSProperties => ({
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .75s ${E} ${delay}s, transform .75s ${E} ${delay}s`,
  })

  return (
    <div ref={wrapRef} style={{ height:`${PHASES.length * 130}vh`, background:"var(--color-bg)" }}>
      <div ref={stickyRef} style={{
        height:"100svh", overflow:"hidden", position:"relative",
        background: isDark ? "#07070F" : "#F0F0FA",
      }}>
        {/* Phase canvas — unique per phase */}
        <PhaseCanvas idx={active} color={ph.color} isDark={isDark} progress={progress} />

        {/* Noise */}
        <div aria-hidden style={{
          position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize:"256px", mixBlendMode: isDark?"overlay":"multiply", opacity:.55,
        }}/>

        {/* Bottom fade */}
        <div aria-hidden style={{
          position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
          background: isDark
            ? "linear-gradient(to top,#07070F 0%,#07070Fd0 32%,transparent 62%)"
            : "linear-gradient(to top,#F0F0FA 0%,#F0F0FAd0 28%,transparent 58%)",
        }}/>

        {/* Phase watermark number — large, right */}
        <div aria-hidden style={{
          position:"absolute", right:"-0.04em", top:"50%",
          transform:"translateY(-52%)",
          fontFamily:"var(--font-display)",
          fontSize:"clamp(14rem,32vw,28rem)",
          fontWeight:800, letterSpacing:"-.07em", lineHeight:1,
          color:"transparent",
          WebkitTextStroke:`1px ${ph.color}${isDark?"14":"0c"}`,
          userSelect:"none", pointerEvents:"none", zIndex:1,
          transition:`-webkit-text-stroke-color .6s ease, color .6s ease`,
        }}>{ph.num}</div>

        {/* Progress dots — top left */}
        <div style={{
          position:"absolute", top:"clamp(5rem,8vw,7rem)", left:"clamp(1.5rem,6vw,5rem)",
          zIndex:5, display:"flex", alignItems:"center", gap:".75rem",
        }}>
          {PHASES.map((_,i) => (
            <div key={i} style={{
              height:1,
              width: i===active ? 36 : 10,
              background: i<active ? ph.color : i===active ? ph.color : (isDark?"rgba(255,255,255,.16)":"rgba(0,0,0,.12)"),
              opacity: i<active ? .45 : 1,
              transition:`all .5s ${E}`,
            }}/>
          ))}
        </div>

        {/* Text — always bottom-anchored */}
        <div ref={textRef} style={{
          position:"absolute", bottom:0, left:0, right:0, zIndex:5,
          padding:"0 clamp(1.5rem,6vw,5rem) clamp(3rem,6vw,5rem)",
        }}>
          {/* Eyebrow */}
          <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"clamp(.75rem,2vw,1.5rem)", ...fade(0) }}>
            <div style={{ width:28, height:1, background:ph.color, transition:"background .5s ease" }}/>
            <span style={{
              fontFamily:"var(--font-mono)", fontSize:"clamp(.5rem,.9vw,.62rem)",
              letterSpacing:".2em", textTransform:"uppercase", color:ph.color,
              transition:"color .5s ease",
            }}>Phase {ph.num} · {ph.label} · {ph.duration}</span>
          </div>

          {/* Headline line 1 */}
          <div style={{ overflow:"hidden", marginBottom:".04em" }}>
            <h2 style={{
              fontFamily:"var(--font-display)",
              fontSize:"clamp(2.8rem,9.5vw,9.5rem)",
              fontWeight:800, letterSpacing:"-.05em", lineHeight:.9, margin:0,
              color: isDark?"#ffffff":"#0a0a14",
              ...fade(0.06),
            }}>{ph.headline[0]}</h2>
          </div>

          {/* Headline line 2 — outline */}
          <div style={{ overflow:"hidden", marginBottom:"clamp(1.25rem,2.5vw,2.5rem)" }}>
            <h2 style={{
              fontFamily:"var(--font-display)",
              fontSize:"clamp(2.8rem,9.5vw,9.5rem)",
              fontWeight:800, letterSpacing:"-.05em", lineHeight:.9, margin:0,
              color:"transparent",
              WebkitTextStroke:`2px ${ph.color}`,
              textShadow:`0 0 80px ${ph.color}55`,
              transition:"color .5s ease,-webkit-text-stroke-color .5s ease",
              ...fade(0.14),
            }}>{ph.headline[1]}</h2>
          </div>

          {/* Body + aside */}
          <div style={{
            display:"grid",
            gridTemplateColumns:"1fr clamp(180px,24vw,340px)",
            gap:"clamp(2rem,5vw,6rem)", alignItems:"end",
          }}>
            <p style={{
              fontFamily:"var(--font-body)", fontSize:"clamp(.85rem,1.25vw,1.05rem)",
              color:"var(--color-text-muted)", lineHeight:1.72, margin:0,
              ...fade(0.2),
            }}>{ph.body}</p>

            <p style={{
              fontFamily:"var(--font-body)", fontSize:"clamp(.75rem,.95vw,.875rem)",
              color:ph.color, lineHeight:1.65, margin:0,
              fontStyle:"italic", opacity:.8,
              transition:"color .5s ease",
              ...fade(0.28),
            }}>{ph.aside}</p>
          </div>
        </div>
      </div>
    </div>
  )
}