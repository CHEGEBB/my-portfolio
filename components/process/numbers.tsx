"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/context/theme-context"

const STATS = [
  { value:20,   suffix:"+",  label:"Projects shipped",       sub:"Across 7+ organisations",  color:"#5567F7" },
  { value:3,    suffix:"+",  label:"Years of craft",         sub:"Building, leading, shipping", color:"#45D2B0" },
  { value:2,    suffix:"×",  label:"CTO by 25",              sub:"Softrinx & HealthMaster",   color:"#FF6B9D" },
  { value:1000, suffix:"+",  label:"Downloads",              sub:"Play Store, live users",    color:"#AAFF00" },
  { value:7,    suffix:"+",  label:"Disciplines mastered",   sub:"Full-stack to cybersecurity", color:"#F5A623" },
  { value:24,   suffix:"h",  label:"Response guarantee",     sub:"Every message, always",     color:"#8B5CF6" },
]

// Wiring canvas — thin animated lines connect the numbers
function WiringCanvas({ accent, isDark }: { accent:string; isDark:boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(()=>{
    const canvas=ref.current; if(!canvas) return
    const ctx=canvas.getContext("2d"); if(!ctx) return
    const hex=accent.replace("#","")
    const cr=parseInt(hex.slice(0,2),16),cg=parseInt(hex.slice(2,4),16),cb=parseInt(hex.slice(4,6),16)
    let W=0,H=0,raf:number
    const resize=()=>{
      W=canvas.offsetWidth; H=canvas.offsetHeight
      canvas.width=W*(devicePixelRatio||1); canvas.height=H*(devicePixelRatio||1)
      ctx.setTransform(devicePixelRatio||1,0,0,devicePixelRatio||1,0,0)
    }
    resize(); window.addEventListener("resize",resize,{passive:true})

    // random nodes that "wire" together
    const nodes = Array.from({length:18},()=>({ x:Math.random(), y:Math.random(), vx:(Math.random()-.5)*0.0003, vy:(Math.random()-.5)*0.0003 }))

    const draw=(ts:number)=>{
      const t=ts*0.0004
      ctx.clearRect(0,0,W,H)
      nodes.forEach(n=>{ n.x+=n.vx; n.y+=n.vy; if(n.x<0||n.x>1)n.vx*=-1; if(n.y<0||n.y>1)n.vy*=-1 })

      for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i],b=nodes[j]
        const d=Math.hypot(a.x-b.x,a.y-b.y)
        if(d>.38) continue
        ctx.beginPath()
        ctx.moveTo(a.x*W,a.y*H); ctx.lineTo(b.x*W,b.y*H)
        ctx.strokeStyle=`rgba(${cr},${cg},${cb},${(1-d/.38)*(isDark?.07:.04)})`
        ctx.lineWidth=.5; ctx.stroke()
      }

      nodes.forEach(n=>{
        ctx.beginPath(); ctx.arc(n.x*W,n.y*H,1.5,0,Math.PI*2)
        ctx.fillStyle=`rgba(${cr},${cg},${cb},${isDark?.18:.1})`; ctx.fill()
      })

      raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",resize) }
  },[accent,isDark])

  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}/>
}

function Counter({ value, suffix, color, delay, trigger }: {
  value:number; suffix:string; color:string; delay:number; trigger:boolean
}) {
  const [count, setCount] = useState(0)

  useEffect(()=>{
    if(!trigger) return
    const start = performance.now()
    const dur = 1600 + delay*200
    const isLarge = value >= 100

    const tick=(now:number)=>{
      const p = Math.min((now-start)/dur,1)
      const eased = 1-Math.pow(1-p,3)
      const v = isLarge
        ? Math.round(value*eased/10)*10
        : value%1 !== 0 ? Math.round(value*eased*10)/10 : Math.round(value*eased)
      setCount(v)
      if(p<1) requestAnimationFrame(tick)
      else setCount(value)
    }
    const id = setTimeout(()=>requestAnimationFrame(tick), delay*120)
    return ()=>clearTimeout(id)
  },[trigger,value,delay])

  return (
    <span style={{ color, fontVariantNumeric:"tabular-nums" }}>
      {count}{suffix}
    </span>
  )
}

function StatRow({ s, i, vis }: { s:typeof STATS[0]; i:number; vis:boolean }) {
  const { theme } = useTheme()
  const isDark = theme.mode === "dark"
  const E = "cubic-bezier(0.16,1,0.3,1)"
  const fade = (d=0): React.CSSProperties => ({
    opacity:vis?1:0, transform:vis?"translateX(0)":"translateX(-20px)",
    transition:`opacity .75s ${E} ${d}s, transform .75s ${E} ${d}s`,
  })

  return (
    <div style={{
      display:"grid",
      gridTemplateColumns:"1fr auto",
      alignItems:"baseline",
      padding:"clamp(1.25rem,2.5vw,2.25rem) 0",
      borderTop:`1px solid ${isDark?"rgba(255,255,255,.05)":"rgba(0,0,0,.05)"}`,
      gap:"2rem",
    }}>
      <div>
        <div style={{
          fontFamily:"var(--font-mono)", fontSize:"clamp(.46rem,.75vw,.56rem)",
          letterSpacing:".16em", textTransform:"uppercase",
          color:s.color, marginBottom:".35rem", ...fade(i*.06),
        }}>{s.sub}</div>
        <div style={{
          fontFamily:"var(--font-display)", fontSize:"clamp(1.1rem,2vw,1.6rem)",
          fontWeight:700, letterSpacing:"-.03em",
          color: isDark?"rgba(255,255,255,.85)":"rgba(0,0,0,.8)",
          ...fade(i*.06+.06),
        }}>{s.label}</div>
      </div>

      <div style={{
        fontFamily:"var(--font-display)",
        fontSize:"clamp(3rem,7vw,6.5rem)",
        fontWeight:800, letterSpacing:"-.05em", lineHeight:1,
        ...fade(i*.06+.02),
      }}>
        <Counter value={s.value} suffix={s.suffix} color={s.color} delay={i} trigger={vis}/>
      </div>
    </div>
  )
}

export function ProcessNumbers() {
  const { theme } = useTheme()
  const ref       = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState(false)
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent
  const E      = "cubic-bezier(0.16,1,0.3,1)"

  useEffect(()=>{
    if(!ref.current) return
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting) setVis(true) },{threshold:.08})
    obs.observe(ref.current)
    return ()=>obs.disconnect()
  },[])

  const fade=(d=0):React.CSSProperties=>({
    opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(28px)",
    transition:`opacity .8s ${E} ${d}s, transform .8s ${E} ${d}s`,
  })

  return (
    <section ref={ref} style={{
      position:"relative", overflow:"hidden",
      background: isDark?"#07070F":"#F0F0FA",
      borderTop:`1px solid ${isDark?"rgba(255,255,255,.05)":"rgba(0,0,0,.05)"}`,
    }}>
      <WiringCanvas accent={acc} isDark={isDark}/>

      <div aria-hidden style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize:"256px", mixBlendMode:isDark?"overlay":"multiply", opacity:.5,
      }}/>

      <div style={{ position:"relative", zIndex:2, padding:"clamp(5rem,10vw,9rem) clamp(1.5rem,6vw,5rem)" }}>
        {/* Section header */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", alignItems:"end", marginBottom:"clamp(3rem,6vw,5rem)", gap:"3rem", flexWrap:"wrap" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"clamp(1rem,2.5vw,2rem)", ...fade(0) }}>
              <div style={{ width:28, height:1, background:acc }}/>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(.52rem,1vw,.64rem)", letterSpacing:".18em", textTransform:"uppercase", color:acc }}>By the numbers</span>
            </div>
            <div style={{ overflow:"hidden", marginBottom:".04em" }}>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3rem,11vw,10.5rem)", fontWeight:800, letterSpacing:"-.05em", lineHeight:.9, margin:0, color:isDark?"#fff":"#0a0a14", ...fade(0.1) }}>What I've</h2>
            </div>
            <div style={{ overflow:"hidden" }}>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3rem,11vw,10.5rem)", fontWeight:800, letterSpacing:"-.05em", lineHeight:.9, margin:0, color:"transparent", WebkitTextStroke:`2px ${acc}`, textShadow:`0 0 80px ${acc}55`, ...fade(0.18) }}>built.</h2>
            </div>
          </div>

          {/* Large accent glyph */}
          <div aria-hidden style={{
            fontFamily:"var(--font-display)", fontSize:"clamp(5rem,12vw,10rem)",
            fontWeight:800, letterSpacing:"-.05em", lineHeight:1,
            color:"transparent", WebkitTextStroke:`1px ${acc}22`,
            userSelect:"none",
            ...fade(0.05),
          }}>∑</div>
        </div>

        {/* Stat rows */}
        {STATS.map((s,i) => <StatRow key={s.label} s={s} i={i} vis={vis}/>)}
      </div>
    </section>
  )
}