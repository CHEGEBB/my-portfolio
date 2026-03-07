"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/context/theme-context"

const PRINCIPLES = [
  { word: "Clarity",      statement: "over cleverness.",     body: "I write code that a junior can read six months from now. Clever code is a liability. Clear code is an asset that compounds.",    color: "#5567F7" },
  { word: "Communicate",  statement: "before it's a problem.", body: "Silent developers are dangerous. I send updates before you ask. Bad news travels to me first — and from me, fast.",            color: "#45D2B0" },
  { word: "Own",          statement: "the outcome entirely.", body: "I don't hand off broken things and call it done. If it's under my name, it works. If it doesn't, I stay until it does.",         color: "#FF6B9D" },
  { word: "Architecture", statement: "before aesthetics.",   body: "A beautiful UI on a broken foundation is a lie. I design the structure first — robust, scalable — then I make it beautiful.",    color: "#AAFF00" },
  { word: "Speed",        statement: "is a feature.",        body: "Performance isn't an afterthought. Every unnecessary kilobyte, every wasted render, is a tax quietly charged to your users.",      color: "#F5A623" },
]

// Sine-distortion canvas — sits behind each principle row
function DistortCanvas({ color, isDark, visible }: { color:string; isDark:boolean; visible:boolean }) {
  const ref    = useRef<HTMLCanvasElement>(null)
  const visRef = useRef(visible)
  visRef.current = visible

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    const hex = color.replace("#","")
    const cr=parseInt(hex.slice(0,2),16), cg=parseInt(hex.slice(2,4),16), cb=parseInt(hex.slice(4,6),16)
    let W=0, H=0, raf:number, target=0, current=0

    const resize = () => {
      W=canvas.offsetWidth; H=canvas.offsetHeight
      canvas.width=W*(devicePixelRatio||1); canvas.height=H*(devicePixelRatio||1)
      ctx.setTransform(devicePixelRatio||1,0,0,devicePixelRatio||1,0,0)
    }
    resize(); window.addEventListener("resize",resize,{passive:true})

    const draw = (ts:number) => {
      const t = ts*0.0004
      target = visRef.current ? 1 : 0
      current += (target - current) * 0.035
      ctx.clearRect(0,0,W,H)

      if (current < 0.01) { raf=requestAnimationFrame(draw); return }

      const amp = current * H * 0.38
      const freq = 0.012
      const lines = 7

      for (let k=0; k<lines; k++) {
        const phase_offset = k / lines
        const yBase = H * (0.1 + phase_offset * 0.8)
        const alpha = (1 - Math.abs(phase_offset - 0.5)*1.6) * current * (isDark?.1:.06)
        ctx.beginPath()
        for (let x=0; x<=W; x+=3) {
          const y = yBase + Math.sin(x*freq + t*2.5 + phase_offset*Math.PI*2) * amp * (0.3 + phase_offset*0.7)
          x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
        }
        ctx.strokeStyle=`rgba(${cr},${cg},${cb},${alpha})`
        ctx.lineWidth=1; ctx.stroke()
      }

      // Large diffuse glow left side (where the big word sits)
      const gx = W*0.18, gy = H*0.5
      const gr = ctx.createRadialGradient(gx,gy,0,gx,gy,W*0.45)
      gr.addColorStop(0,`rgba(${cr},${cg},${cb},${current*(isDark?.08:.04)})`)
      gr.addColorStop(1,`rgba(${cr},${cg},${cb},0)`)
      ctx.beginPath(); ctx.rect(0,0,W,H); ctx.fillStyle=gr; ctx.fill()

      raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize) }
  },[color,isDark])

  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}/>
}

function PrincipleRow({ p, i }: { p: typeof PRINCIPLES[0]; i: number }) {
  const { theme } = useTheme()
  const ref       = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  const isDark = theme.mode === "dark"
  const E = "cubic-bezier(0.16,1,0.3,1)"

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => setVis(e.isIntersecting),
      { threshold: 0.22 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const fade = (delay=0): React.CSSProperties => ({
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(32px)",
    transition: `opacity .8s ${E} ${delay}s, transform .8s ${E} ${delay}s`,
  })

  return (
    <div ref={ref} style={{
      position:"relative",
      padding:"clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,5rem)",
      borderTop:`1px solid ${isDark?"rgba(255,255,255,.05)":"rgba(0,0,0,.05)"}`,
      overflow:"hidden", minHeight:"clamp(260px,38vh,420px)",
      display:"flex", flexDirection:"column", justifyContent:"center",
    }}>
      <DistortCanvas color={p.color} isDark={isDark} visible={vis} />

      {/* Huge background word — watermark */}
      <div aria-hidden style={{
        position:"absolute", left:"clamp(1.5rem,6vw,5rem)", top:"50%",
        transform:"translateY(-50%)",
        fontFamily:"var(--font-display)",
        fontSize:"clamp(5rem,18vw,17rem)",
        fontWeight:800, letterSpacing:"-.06em", lineHeight:1,
        color:"transparent",
        WebkitTextStroke:`1px ${p.color}${isDark?"16":"0e"}`,
        userSelect:"none", pointerEvents:"none",
        opacity: vis ? 1 : 0,
        transition:`opacity 1s ${E} .05s`,
        zIndex:1,
      }}>{p.word}</div>

      {/* Foreground content — right side */}
      <div style={{
        position:"relative", zIndex:2,
        marginLeft:"auto",
        width:"clamp(260px,44vw,640px)",
        paddingLeft:"clamp(1rem,3vw,2rem)",
      }}>
        <div style={{ marginBottom:"clamp(.75rem,1.5vw,1.25rem)", ...fade(0.05) }}>
          <span style={{
            fontFamily:"var(--font-mono)", fontSize:"clamp(.48rem,.8vw,.58rem)",
            letterSpacing:".2em", textTransform:"uppercase", color:p.color,
          }}>{String(i+1).padStart(2,"0")}</span>
        </div>

        <div style={{ overflow:"hidden", marginBottom:".06em" }}>
          <h3 style={{
            fontFamily:"var(--font-display)",
            fontSize:"clamp(2.2rem,5.5vw,5.5rem)",
            fontWeight:800, letterSpacing:"-.05em", lineHeight:.9, margin:0,
            color: isDark?"#fff":"#0a0a14",
            ...fade(0.1),
          }}>{p.word}</h3>
        </div>

        <div style={{ overflow:"hidden", marginBottom:"clamp(1rem,2vw,1.75rem)" }}>
          <h3 style={{
            fontFamily:"var(--font-display)",
            fontSize:"clamp(2.2rem,5.5vw,5.5rem)",
            fontWeight:800, letterSpacing:"-.05em", lineHeight:.9, margin:0,
            color:"transparent",
            WebkitTextStroke:`2px ${p.color}`,
            textShadow:`0 0 60px ${p.color}44`,
            ...fade(0.18),
          }}>{p.statement}</h3>
        </div>

        <p style={{
          fontFamily:"var(--font-body)", fontSize:"clamp(.85rem,1.1vw,1rem)",
          color:"var(--color-text-muted)", lineHeight:1.72, margin:0, maxWidth:480,
          ...fade(0.26),
        }}>{p.body}</p>
      </div>
    </div>
  )
}

export function ProcessPrinciples() {
  const { theme } = useTheme()
  const ref       = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent
  const E      = "cubic-bezier(0.16,1,0.3,1)"

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold:.1 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  },[])

  const fade = (d=0): React.CSSProperties => ({
    opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(28px)",
    transition:`opacity .8s ${E} ${d}s, transform .8s ${E} ${d}s`,
  })

  return (
    <section style={{ background:"var(--color-bg)" }}>
      {/* Section intro */}
      <div ref={ref} style={{
        padding:"clamp(5rem,10vw,9rem) clamp(1.5rem,6vw,5rem) clamp(3rem,5vw,4rem)",
        borderTop:`1px solid ${isDark?"rgba(255,255,255,.05)":"rgba(0,0,0,.05)"}`,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"clamp(1.25rem,2.5vw,2rem)", ...fade(0) }}>
          <div style={{ width:28, height:1, background:acc }}/>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(.52rem,1vw,.64rem)", letterSpacing:".18em", textTransform:"uppercase", color:acc }}>The Principles</span>
        </div>
        <div style={{ overflow:"hidden", marginBottom:".05em" }}>
          <h2 style={{
            fontFamily:"var(--font-display)", fontSize:"clamp(3rem,11vw,10.5rem)",
            fontWeight:800, letterSpacing:"-.05em", lineHeight:.9, margin:0,
            color: isDark?"#fff":"#0a0a14", ...fade(0.1),
          }}>How I</h2>
        </div>
        <div style={{ overflow:"hidden" }}>
          <h2 style={{
            fontFamily:"var(--font-display)", fontSize:"clamp(3rem,11vw,10.5rem)",
            fontWeight:800, letterSpacing:"-.05em", lineHeight:.9, margin:0,
            color:"transparent", WebkitTextStroke:`2px ${acc}`,
            textShadow:`0 0 80px ${acc}55`, ...fade(0.18),
          }}>think.</h2>
        </div>
      </div>

      {/* Principle rows */}
      {PRINCIPLES.map((p,i) => <PrincipleRow key={p.word} p={p} i={i} />)}
    </section>
  )
}