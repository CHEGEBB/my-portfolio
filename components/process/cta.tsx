"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"

// ─── Same sphere DNA as about hero ────────────────────────────────────────────
function SphereCanvas({ accent, isDark, mouse }: {
  accent:string; isDark:boolean
  mouse: React.MutableRefObject<{x:number;y:number}>
}) {
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

    const N=200, golden=Math.PI*(3-Math.sqrt(5))
    const pts=Array.from({length:N},(_,i)=>{
      const y=1-(i/(N-1))*2, r=Math.sqrt(1-y*y), t=golden*i
      return {x:Math.cos(t)*r,y,z:Math.sin(t)*r}
    })
    const rx={v:0},ry={v:0}

    const draw=(ts:number)=>{
      const t=ts*0.001
      ctx.clearRect(0,0,W,H)
      rx.v+=(t*0.06-mouse.current.y*0.2-rx.v)*0.04
      ry.v+=(t*0.14+mouse.current.x*0.35-ry.v)*0.04

      const cx_=Math.cos(rx.v),sx_=Math.sin(rx.v),cy_=Math.cos(ry.v),sy_=Math.sin(ry.v)
      const cx=W/2,cy=H/2,rad=Math.min(W,H)*0.32

      const proj=pts.map(p=>{
        const x1=p.x*cy_+p.z*sy_, z1=-p.x*sy_+p.z*cy_
        const y2=p.y*cx_-z1*sx_,  z2=p.y*sx_+z1*cx_
        const sc=2.2/(2.2+z2)
        return {sx:cx+x1*rad*sc, sy:cy-y2*rad*sc, z:z2, sc}
      })

      const D=rad*0.26
      for(let i=0;i<N;i++) for(let j=i+1;j<N;j++){
        const a=proj[i],b=proj[j]
        const d=Math.hypot(a.sx-b.sx,a.sy-b.sy)
        if(d>D) continue
        const depth=((a.z+b.z)/2+1)/2
        ctx.beginPath()
        ctx.strokeStyle=`rgba(${cr},${cg},${cb},${(1-d/D)*depth*(isDark?.14:.08)})`
        ctx.lineWidth=.5; ctx.moveTo(a.sx,a.sy); ctx.lineTo(b.sx,b.sy); ctx.stroke()
      }
      proj.forEach(p=>{
        ctx.beginPath(); ctx.arc(p.sx,p.sy,p.sc*1.6,0,Math.PI*2)
        ctx.fillStyle=`rgba(${cr},${cg},${cb},${((p.z+1)/2)*(isDark?.6:.4)})`; ctx.fill()
      })

      const g=ctx.createRadialGradient(cx,cy,rad*.5,cx,cy,rad*1.5)
      g.addColorStop(0,`rgba(${cr},${cg},${cb},${isDark?.08:.04})`)
      g.addColorStop(1,`rgba(${cr},${cg},${cb},0)`)
      ctx.beginPath(); ctx.arc(cx,cy,rad*1.5,0,Math.PI*2); ctx.fillStyle=g; ctx.fill()

      raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",resize) }
  },[accent,isDark])

  return <canvas ref={ref} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}/>
}

function ScrollCue({ accent, vis }: { accent:string; vis:boolean }) {
  const [bright,setBright]=useState(false)
  useEffect(()=>{ if(!vis) return; const id=setInterval(()=>setBright(b=>!b),1000); return ()=>clearInterval(id) },[vis])
  return (
    <div style={{ position:"absolute", bottom:"clamp(1.5rem,3vw,2.5rem)", left:"50%", transform:"translateX(-50%)", zIndex:5, opacity:vis?1:0, transition:"opacity .6s ease .9s" }}>
      <div style={{ width:1, height:44, background:`linear-gradient(to bottom,${accent},transparent)`, opacity:bright?1:.22, transform:bright?"scaleY(1.2)":"scaleY(1)", transition:"opacity 1s ease, transform 1s ease", transformOrigin:"top" }}/>
    </div>
  )
}

export function ProcessCTA() {
  const { theme }  = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const mouseRef   = useRef({x:0,y:0})
  const [vis,setVis] = useState(false)
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent
  const E      = "cubic-bezier(0.16,1,0.3,1)"

  useEffect(()=>{ const t=setTimeout(()=>setVis(true),80); return ()=>clearTimeout(t) },[])

  const onMM=useCallback((e:MouseEvent)=>{
    const el=sectionRef.current; if(!el) return
    const r=el.getBoundingClientRect()
    mouseRef.current={ x:((e.clientX-r.left)/r.width-.5)*2, y:-(((e.clientY-r.top)/r.height)-.5)*2 }
  },[])
  useEffect(()=>{ window.addEventListener("mousemove",onMM,{passive:true}); return ()=>window.removeEventListener("mousemove",onMM) },[onMM])

  const fade=(d=0):React.CSSProperties=>({
    opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(36px)",
    transition:`opacity .85s ${E} ${d}s, transform .85s ${E} ${d}s`,
  })

  return (
    <section ref={sectionRef} style={{
      position:"relative", minHeight:"100svh",
      display:"flex", flexDirection:"column", justifyContent:"flex-end",
      overflow:"hidden", background:isDark?"#07070F":"#F0F0FA",
      borderTop:`1px solid ${isDark?"rgba(255,255,255,.05)":"rgba(0,0,0,.05)"}`,
    }}>
      <SphereCanvas accent={acc} isDark={isDark} mouse={mouseRef}/>

      {/* Noise */}
      <div aria-hidden style={{
        position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize:"256px", mixBlendMode:isDark?"overlay":"multiply", opacity:.6,
      }}/>

      {/* Bottom fade */}
      <div aria-hidden style={{
        position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
        background:isDark
          ?"linear-gradient(to top,#07070F 0%,#07070Fcc 35%,transparent 65%)"
          :"linear-gradient(to top,#F0F0FA 0%,#F0F0FAcc 30%,transparent 60%)",
      }}/>

      {/* Text — bottom anchored */}
      <div style={{ position:"relative", zIndex:5, padding:"0 clamp(1.5rem,6vw,5rem) clamp(3rem,6vw,5rem)" }}>

        <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"clamp(1rem,2.5vw,2rem)", ...fade(0.1) }}>
          <div style={{ width:28, height:1, background:acc }}/>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(.52rem,1vw,.64rem)", letterSpacing:".18em", textTransform:"uppercase", color:acc }}>Start a project</span>
        </div>

        <div style={{ overflow:"hidden", marginBottom:".05em" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3rem,11vw,10.5rem)", fontWeight:800, letterSpacing:"-.05em", lineHeight:.9, margin:0, color:isDark?"#fff":"#0a0a14", ...fade(0.2) }}>Let's build</h2>
        </div>
        <div style={{ overflow:"hidden", marginBottom:"clamp(1.5rem,3vw,2.5rem)" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3rem,11vw,10.5rem)", fontWeight:800, letterSpacing:"-.05em", lineHeight:.9, margin:0, color:"transparent", WebkitTextStroke:`2px ${acc}`, textShadow:`0 0 80px ${acc}55`, ...fade(0.32) }}>something.</h2>
        </div>

        <p style={{ fontFamily:"var(--font-body)", fontSize:"clamp(.9rem,1.5vw,1.15rem)", color:"var(--color-text-muted)", lineHeight:1.72, maxWidth:520, margin:"0 0 clamp(2rem,4vw,3.5rem)", ...fade(0.42) }}>
          Tell me what you're building. I'll reply within 24 hours with a clear plan — no agencies, no middlemen. Just Brian.
        </p>

        {/* Contact actions — two clean links, nothing more */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:"clamp(.75rem,2vw,1.5rem)", alignItems:"center", ...fade(0.52) }}>
          <a href="mailto:chegephil24@gmail.com" style={{
            fontFamily:"var(--font-display)", fontSize:"clamp(1rem,1.8vw,1.4rem)",
            fontWeight:700, letterSpacing:"-.02em",
            color:acc, textDecoration:"none",
            borderBottom:`1px solid ${acc}66`,
            paddingBottom:".12em",
            transition:"border-color .2s ease, opacity .2s ease",
          }}
          onMouseEnter={e=>(e.currentTarget.style.borderColor=acc)}
          onMouseLeave={e=>(e.currentTarget.style.borderColor=`${acc}66`)}>
            chegephil24@gmail.com ↗
          </a>

          <span style={{ color:"var(--color-text-muted)", opacity:.3, fontFamily:"var(--font-mono)", fontSize:".6rem" }}>or</span>

          <a href="https://wa.me/254796562713" target="_blank" rel="noopener noreferrer" style={{
            fontFamily:"var(--font-display)", fontSize:"clamp(1rem,1.8vw,1.4rem)",
            fontWeight:700, letterSpacing:"-.02em",
            color:"#25D366", textDecoration:"none",
            borderBottom:"1px solid #25D36666", paddingBottom:".12em",
          }}>
            WhatsApp ↗
          </a>
        </div>

        {/* Small contact strip */}
        <div style={{ marginTop:"clamp(1.5rem,3vw,2.5rem)", display:"flex", gap:"2rem", flexWrap:"wrap", ...fade(0.6) }}>
          {[
            { label:"GitHub", href:"https://github.com/CHEGEBB" },
            { label:"+254 796 562 713", href:"tel:+254796562713" },
            { label:"Nairobi, Kenya → World", href:undefined },
          ].map(({label,href})=>(
            href
              ? <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(.46rem,.75vw,.58rem)", letterSpacing:".12em", textTransform:"uppercase", color:"var(--color-text-muted)", opacity:.45, textDecoration:"none" }}>{label}</a>
              : <span key={label} style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(.46rem,.75vw,.58rem)", letterSpacing:".12em", textTransform:"uppercase", color:"var(--color-text-muted)", opacity:.3 }}>{label}</span>
          ))}
        </div>
      </div>

      <ScrollCue accent={acc} vis={vis}/>
    </section>
  )
}