"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "@/context/theme-context"

const ROLES = [
  "Full Stack Developer",
  "Co-Founder & CTO",
  "React & Next.js Engineer",
  "Mobile App Developer",
  "UI Engineer",
  "DevOps Practitioner",
]

const TICKER_ITEMS = [
  "Next.js", "React", "TypeScript", "Node.js", "Python",
  "Flutter", "Docker", "PostgreSQL", "MongoDB", "AWS",
  "React Native", "Vue.js", "Angular", "TailwindCSS", "DevOps",
]

const CV_URL = "https://drive.google.com/uc?export=download&id=1pTAMt80W6VfTootlcr3LuECuNCG0qEf7"
const CV_PREVIEW_URL = "https://drive.google.com/file/d/1pTAMt80W6VfTootlcr3LuECuNCG0qEf7/preview"

export function Hero() {
  const { theme }                 = useTheme()
  const [mounted, setMounted]     = useState(false)
  const [roleIdx, setRoleIdx]     = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [deleting, setDeleting]   = useState(false)
  const [scrollY, setScrollY]     = useState(0)
  const [mouse, setMouse]         = useState({ x: 0.5, y: 0.5 })
  const [cvOpen, setCvOpen]       = useState(false)
  const canvasRef                 = useRef<HTMLCanvasElement>(null)
  const rafRef                    = useRef<number>(0)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const full = ROLES[roleIdx]
    const delay = deleting ? 32 : 80
    const timer = setTimeout(() => {
      if (!deleting) {
        const next = full.slice(0, displayed.length + 1)
        setDisplayed(next)
        if (next === full) setTimeout(() => setDeleting(true), 2000)
      } else {
        const next = full.slice(0, displayed.length - 1)
        setDisplayed(next)
        if (next === "") { setDeleting(false); setRoleIdx(i => (i + 1) % ROLES.length) }
      }
    }, delay)
    return () => clearTimeout(timer)
  }, [mounted, displayed, deleting, roleIdx])

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
  }, [])
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setCvOpen(false) }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    const hex = theme.colors.accent
    const rv = parseInt(hex.slice(1,3),16)
    const gv = parseInt(hex.slice(3,5),16)
    const bv = parseInt(hex.slice(5,7),16)
    const pts = Array.from({ length: 45 }, () => ({
      x: Math.random()*canvas.width, y: Math.random()*canvas.height,
      vx: (Math.random()-.5)*.2, vy: (Math.random()-.5)*.2,
      s: Math.random()*1.5+.3, p: Math.random()*Math.PI*2,
    }))
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height)
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.p+=.015
        if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0
        if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0
        ctx.beginPath(); ctx.arc(p.x,p.y,p.s,0,Math.PI*2)
        ctx.fillStyle=`rgba(${rv},${gv},${bv},${.2+.15*Math.sin(p.p)})`
        ctx.fill()
      })
      pts.forEach((a,i) => { for(let j=i+1;j<pts.length;j++){
        const d=Math.hypot(a.x-pts[j].x,a.y-pts[j].y)
        if(d<90){ ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(pts[j].x,pts[j].y)
          ctx.strokeStyle=`rgba(${rv},${gv},${bv},${(1-d/90)*.07})`
          ctx.lineWidth=.5; ctx.stroke() }
      }})
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize) }
  }, [theme.colors.accent])

  const vh       = typeof window !== "undefined" ? window.innerHeight : 800
  const progress = Math.min(scrollY / (vh * 0.6), 1)
  const splitTop = -progress * 90
  const splitBot =  progress * 90
  const fade     = 1 - progress * 0.9
  const gx       = 15 + mouse.x * 70
  const gy       = 20 + mouse.y * 60
  const isDark   = theme.mode === "dark"

  return (
    <>
      {/* CV PREVIEW MODAL */}
      {cvOpen && (
        <div
          onClick={() => setCvOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9000,
            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "clamp(1rem,4vw,2.5rem)",
            animation: "fadeInModal 0.3s ease",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 860,
              height: "min(90vh, 1100px)",
              borderRadius: "16px", overflow: "hidden",
              border: `1px solid ${theme.colors.accent}44`,
              boxShadow: `0 0 80px ${theme.colors.accent}22, 0 40px 120px rgba(0,0,0,0.6)`,
              display: "flex", flexDirection: "column",
              animation: "slideUpModal 0.35s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.875rem 1.25rem",
              background: isDark ? "rgba(7,7,15,0.97)" : "rgba(246,246,252,0.97)",
              borderBottom: `1px solid ${theme.colors.accent}22`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: theme.colors.accent, boxShadow: `0 0 8px ${theme.colors.accent}` }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: theme.colors.accent }}>
                  Brian Chege — CV Preview
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <a href={CV_URL} download="Brian_Chege_CV.pdf" style={{
                  fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 600,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  color: "var(--color-accent-fg)", background: theme.colors.accent,
                  padding: "0.35rem 0.875rem", borderRadius: "9999px",
                  textDecoration: "none", display: "flex", alignItems: "center", gap: "0.35rem",
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  Download
                </a>
                <button onClick={() => setCvOpen(false)} style={{
                  width: 30, height: 30, borderRadius: "9999px",
                  border: "1px solid var(--color-surface-border)", background: "transparent",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--color-text-muted)",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            <iframe src={CV_PREVIEW_URL} style={{ flex: 1, border: "none", width: "100%", background: "#fff" }} allow="autoplay" title="CV Preview" />
          </div>
        </div>
      )}

      <section style={{ position:"relative", height:"100svh", display:"flex", flexDirection:"column", overflow:"hidden", background:"var(--color-bg)" }}>
        <canvas ref={canvasRef} style={{ position:"absolute", inset:0, opacity: fade * 0.55, pointerEvents:"none", zIndex:1 }}/>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:1, background:`radial-gradient(ellipse 60% 55% at ${gx}% ${gy}%, var(--color-accent-muted) 0%, transparent 65%)`, opacity: fade, transition:"background 0.1s ease" }}/>

        <div className="hero-img-glow" style={{ position:"absolute", bottom:0, right:0, width:"42%", height:"55%", background:`radial-gradient(ellipse 80% 60% at 50% 100%, #45D2B0 0%, transparent 65%)`, opacity: mounted ? 0.18 : 0, filter:"blur(40px)", pointerEvents:"none", zIndex:2, transition:"opacity 1.2s ease .5s", animation:"glowBreathe 5s ease-in-out infinite" }}/>
        <div className="hero-img-glow" style={{ position:"absolute", top:"5%", right:"2%", width:"30%", height:"40%", background:`radial-gradient(ellipse at top right, #5567F7 0%, transparent 70%)`, opacity: mounted ? 0.15 : 0, filter:"blur(50px)", pointerEvents:"none", zIndex:2, transition:"opacity 1.2s ease .3s", animation:"glowBreathe 5s ease-in-out infinite .8s" }}/>

        <div className="hero-photo-container hero-photo-desktop" style={{ position:"absolute", bottom:50, right:0, width:"42%", height:"95%", zIndex:3, display:"flex", alignItems:"flex-end", justifyContent:"center", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(60px)", transition:"opacity 1.1s cubic-bezier(.16,1,.3,1) .35s, transform 1.1s cubic-bezier(.16,1,.3,1) .35s", animation: mounted ? "imageFloatOnce 1.1s cubic-bezier(.16,1,.3,1) .35s both, imageFloat 7s ease-in-out 1.5s infinite" : "none" }}>
          <Image src="/me4.png" alt="Brian Chege" width={520} height={680} priority style={{ width:"auto", height:"100%", maxWidth:"100%", objectFit:"contain", objectPosition:"bottom center", display:"block", filter:`drop-shadow(0 30px 80px color-mix(in srgb, ${theme.colors.accent} 25%, transparent)) drop-shadow(0 -10px 40px rgba(69,210,176,0.12))`, transition:"filter .4s ease" }}/>
        </div>

        <div style={{ position:"relative", zIndex:10, flex:1, display:"flex", flexDirection:"column", justifyContent:"center", maxWidth:"1280px", margin:"0 auto", width:"100%", padding:"clamp(4.5rem,8vw,7rem) clamp(1rem,4vw,3rem) clamp(1rem,2vw,2rem)", opacity: fade }}>
          <div style={{ maxWidth:"58%", minWidth:0 }} className="hero-text">

            <div style={{ display:"inline-flex", alignItems:"center", gap:".5rem", fontFamily:"var(--font-mono)", fontSize:"clamp(.6rem,1vw,.72rem)", letterSpacing:".13em", textTransform:"uppercase", color:"var(--color-accent)", marginBottom:"clamp(.75rem,1.5vw,1.25rem)", opacity: mounted?1:0, transform: mounted?"translateY(0)":"translateY(14px)", transition:"all .7s cubic-bezier(.16,1,.3,1) .1s" }}>
              <span style={{ width:"clamp(16px,2vw,28px)", height:"1px", background:"var(--color-accent)", display:"inline-block" }}/>
              Eldoret, Kenya
              <span style={{ width:5, height:5, borderRadius:"50%", background:"var(--color-success)", boxShadow:"0 0 8px var(--color-success)", animation:"pulseGreen 2s ease-in-out infinite", display:"inline-block" }}/>
              Open to work
            </div>

            <div className="hero-name-row">
              <div className="hero-name-block">
                <div style={{ overflow:"visible", marginBottom:"clamp(.1rem,.3vw,.3rem)" }}>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3.5rem,9vw,8rem)", fontWeight:800, lineHeight:.9, letterSpacing:"-.04em", color:"var(--color-text-primary)", transform:`translateY(${splitTop}px)`, willChange:"transform", userSelect:"none", opacity: mounted?1:0, animation: mounted?"revealUp .85s cubic-bezier(.16,1,.3,1) .2s both":"none", whiteSpace:"nowrap" }}>BRIAN</div>
                </div>
                <div style={{ overflow:"visible", marginBottom:"clamp(.875rem,1.5vw,1.5rem)" }}>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3.5rem,9vw,8rem)", fontWeight:800, lineHeight:.9, letterSpacing:"-.04em", color:"transparent", WebkitTextStroke:"clamp(1.5px,.2vw,2.5px) var(--color-accent)", transform:`translateY(${splitBot}px)`, willChange:"transform", userSelect:"none", opacity: mounted?1:0, animation: mounted?"revealUp .85s cubic-bezier(.16,1,.3,1) .32s both":"none", whiteSpace:"nowrap" }}>CHEGE</div>
                </div>
              </div>

              <div className="hero-photo-mobile" style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(40px)", transition:"opacity 1.1s cubic-bezier(.16,1,.3,1) .35s, transform 1.1s cubic-bezier(.16,1,.3,1) .35s", animation: mounted ? "imageFloat 7s ease-in-out 1.5s infinite" : "none" }}>
                <Image src="/me4.png" alt="Brian Chege" width={260} height={340} priority style={{ width:"100%", height:"100%", objectFit:"contain", objectPosition:"bottom center", display:"block", filter:`drop-shadow(0 16px 40px color-mix(in srgb, ${theme.colors.accent} 30%, transparent))` }}/>
                <div style={{ position:"absolute", bottom:"-8%", left:"50%", transform:"translateX(-50%)", width:"80%", height:"35%", background:`radial-gradient(ellipse 80% 60% at 50% 100%, #45D2B0 0%, transparent 65%)`, opacity:0.22, filter:"blur(18px)", pointerEvents:"none", animation:"glowBreathe 5s ease-in-out infinite" }}/>
              </div>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:".5rem", fontFamily:"var(--font-display)", fontSize:"clamp(.85rem,2vw,1.5rem)", fontWeight:600, letterSpacing:"-.02em", color:"var(--color-text-secondary)", marginBottom:"clamp(.75rem,1.5vw,1.25rem)", minHeight:"1.4em", opacity: mounted?1:0, transform: mounted?"translateY(0)":"translateY(16px)", transition:"all .8s cubic-bezier(.16,1,.3,1) .48s" }}>
              <span style={{ color:"var(--color-accent)", opacity:.45, fontWeight:400 }}>|=</span>
              <span>{displayed}</span>
              <span style={{ display:"inline-block", width:"2px", height:"1em", background:"var(--color-accent)", borderRadius:"1px", animation:"blink 1s step-end infinite" }}/>
            </div>

            <p style={{ fontFamily:"var(--font-body)", fontSize:"clamp(.8rem,1.3vw,.9375rem)", lineHeight:1.7, color:"var(--color-text-secondary)", maxWidth:"420px", marginBottom:"clamp(1.25rem,2.5vw,2rem)", opacity: mounted?1:0, transform: mounted?"translateY(0)":"translateY(12px)", transition:"all .8s cubic-bezier(.16,1,.3,1) .6s" }}>
              Co-Founder & CTO at Softrinx. 3+ years shipping scalable web & mobile products across 7 companies.
            </p>

            <div style={{ display:"flex", flexWrap:"wrap", gap:".625rem", marginBottom:"clamp(1.25rem,2.5vw,2rem)", opacity: mounted?1:0, transform: mounted?"translateY(0)":"translateY(10px)", transition:"all .8s cubic-bezier(.16,1,.3,1) .72s" }}>
              <Link href="/projects" style={{ fontFamily:"var(--font-body)", fontSize:"clamp(.75rem,1.1vw,.875rem)", fontWeight:600, letterSpacing:".04em", color:"var(--color-accent-fg)", background:"var(--color-accent)", padding:".625rem clamp(1rem,1.8vw,1.5rem)", borderRadius:"9999px", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:".4rem", boxShadow:"var(--shadow-glow)", transition:"transform .2s ease" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-2px)"}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform=""}}>
                View My Work
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>

              {/* Split CV button: View | Download */}
              <div style={{ display: "inline-flex", borderRadius: "9999px", overflow: "hidden", border: "1px solid var(--color-surface-border)" }}>
                <button onClick={() => setCvOpen(true)} style={{ fontFamily:"var(--font-body)", fontSize:"clamp(.75rem,1.1vw,.875rem)", fontWeight:500, letterSpacing:".04em", color:"var(--color-text-primary)", background:"transparent", border:"none", borderRight:"1px solid var(--color-surface-border)", padding:".625rem clamp(.875rem,1.5vw,1.25rem)", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:".4rem", transition:"all .2s ease" }}
                  onMouseEnter={e=>{const el=e.currentTarget;el.style.color="var(--color-accent)";el.style.background="var(--color-accent-muted)"}}
                  onMouseLeave={e=>{const el=e.currentTarget;el.style.color="var(--color-text-primary)";el.style.background="transparent"}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
                  </svg>
                  View CV
                </button>
                <a href={CV_URL} download="Brian_Chege_CV.pdf" title="Download CV" style={{ fontFamily:"var(--font-body)", fontSize:"clamp(.75rem,1.1vw,.875rem)", color:"var(--color-text-primary)", background:"transparent", padding:".625rem .875rem", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:".35rem", transition:"all .2s ease", textDecoration:"none" }}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.color="var(--color-accent)";el.style.background="var(--color-accent-muted)"}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.color="var(--color-text-primary)";el.style.background="transparent"}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  <span style={{ fontSize: "clamp(.65rem,.9vw,.75rem)", fontWeight: 500 }}>PDF</span>
                </a>
              </div>
            </div>

            <div style={{ display:"flex", flexWrap:"wrap", gap:"clamp(1rem,2.5vw,2rem)", paddingTop:"clamp(1rem,2vw,1.5rem)", borderTop:"1px solid var(--color-surface-border)", opacity: mounted?1:0, transform: mounted?"translateY(0)":"translateY(10px)", transition:"all .8s cubic-bezier(.16,1,.3,1) .86s" }}>
              {[{ v:"3+", l:"Years Exp." },{ v:"7+", l:"Companies" },{ v:"20+",l:"Projects" },{ v:"2", l:"Startups" }].map(s=>(
                <div key={s.l}>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:800, letterSpacing:"-.03em", color:"var(--color-accent)", lineHeight:1 }}>{s.v}</div>
                  <div style={{ fontFamily:"var(--font-body)", fontSize:"clamp(.6rem,.85vw,.7rem)", color:"var(--color-text-muted)", marginTop:".15rem", letterSpacing:".04em" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position:"relative", zIndex:10, overflow:"hidden", borderTop:"1px solid var(--color-surface-border)", padding:".5rem 0", opacity: Math.max(0, fade), flexShrink:0 }}>
          <div style={{ display:"flex", animation:"ticker 28s linear infinite", width:"max-content" }}>
            {[...TICKER_ITEMS,...TICKER_ITEMS,...TICKER_ITEMS].map((item,i)=>(
              <span key={i} style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(.55rem,.8vw,.68rem)", letterSpacing:".1em", textTransform:"uppercase", color:"var(--color-text-muted)", padding:"0 clamp(.75rem,1.5vw,1.5rem)", display:"flex", alignItems:"center", gap:"clamp(.5rem,1vw,1.25rem)", whiteSpace:"nowrap" }}>
                {item}
                <span style={{ width:"2px", height:"2px", borderRadius:"50%", background:"var(--color-accent)", opacity:.5, display:"inline-block" }}/>
              </span>
            ))}
          </div>
        </div>

        <div style={{ position:"absolute", bottom:"clamp(3rem,6vw,4rem)", right:"clamp(1rem,3vw,2.5rem)", display:"flex", flexDirection:"column", alignItems:"center", gap:".4rem", opacity: mounted && scrollY < 60 ? .45 : 0, transition:"opacity .4s ease", zIndex:10 }}>
          <div style={{ writingMode:"vertical-lr", fontFamily:"var(--font-mono)", fontSize:".55rem", letterSpacing:".15em", textTransform:"uppercase", color:"var(--color-text-muted)" }}>scroll</div>
          <div style={{ width:"1px", height:"36px", background:`linear-gradient(to bottom, var(--color-accent), transparent)`, animation:"scrollPulse 1.8s ease-in-out infinite" }}/>
        </div>

        <style jsx>{`
          @keyframes blink          { 0%,100%{opacity:1} 50%{opacity:0} }
          @keyframes pulseGreen     { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:.4} }
          @keyframes ticker         { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
          @keyframes scrollPulse    { 0%,100%{opacity:.5;transform:scaleY(1)} 50%{opacity:.15;transform:scaleY(.6)} }
          @keyframes revealUp       { from{opacity:0;transform:translateY(50px)} to{opacity:1;transform:translateY(0)} }
          @keyframes imageFloatOnce { from{opacity:0;transform:translateY(80px)} to{opacity:1;transform:translateY(0)} }
          @keyframes imageFloat     { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
          @keyframes glowBreathe    { 0%,100%{opacity:.18} 50%{opacity:.28} }
          @keyframes fadeInModal    { from{opacity:0} to{opacity:1} }
          @keyframes slideUpModal   { from{opacity:0;transform:translateY(32px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

          .hero-photo-mobile  { display: none; }
          .hero-photo-desktop { display: flex; }
          .hero-name-row      { display: block; }

          @media (max-width: 900px) {
            .hero-text { max-width: 100% !important; }
            .hero-photo-desktop { display: none !important; }
            .hero-img-glow      { display: none !important; }
            .hero-name-row { display: flex !important; flex-direction: row !important; align-items: stretch !important; gap: 0.75rem; width: 100%; }
            .hero-name-block { flex: 0 0 54%; min-width: 0; display: flex; flex-direction: column; justify-content: flex-end; }
            .hero-photo-mobile { display: flex !important; flex: 0 0 42%; position: relative; align-items: flex-end; justify-content: center; height: clamp(160px, 48vw, 260px); overflow: visible; }
            .hero-name-block > div > div { font-size: clamp(2rem, 10.5vw, 4rem) !important; white-space: nowrap !important; }
          }
          @media (max-width: 480px) {
            .hero-name-block > div > div { font-size: clamp(1.75rem, 10vw, 3rem) !important; }
            .hero-photo-mobile { height: clamp(140px, 44vw, 200px) !important; }
          }
        `}</style>
      </section>
    </>
  )
}