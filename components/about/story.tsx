"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/context/theme-context"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const CHAPTERS = [
  {
    year: "2022", label: "Origin",
    title: "Top of the\nconstituency.",
    body: "KCSE. Wareng High School. Best student in the entire constituency. Equity Leaders Programme scholarship. Not luck — obsession with getting things right.",
    accent: "#5567F7",
  },
  {
    year: "2023", label: "Ignition",
    title: "Python.\nShell.\nSystems.",
    body: "ALX Africa. Nights learning systems programming, DevOps, shell scripting. The foundation that made everything else possible. Every late night was an investment.",
    accent: "#45D2B0",
  },
  {
    year: "2024", label: "Velocity",
    title: "CTO at 21.\nTwo startups.",
    body: "Co-founded HealthMaster. Co-founded Softrinx. Wrote architecture, hired engineers, shipped products used by real people. The classroom moved to production.",
    accent: "#FF6B9D",
  },
  {
    year: "2025", label: "Now",
    title: "20+ shipped.\nStill building.",
    body: "Graduated. 20+ production applications. 7+ companies. Flutter intern. Teach2Give developer. Still writing code at midnight because the work is never finished.",
    accent: "#AAFF00",
  },
]

export function AboutStory() {
  const { theme }  = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    const revealed = new Set<HTMLElement>()

    const ctx = gsap.context(() => {
      const getDistance = () => track.scrollWidth - window.innerWidth

      ScrollTrigger.create({
        id: "story-scroll",
        trigger: section,
        pin: true,
        scrub: 1.2,
        start: "top top",
        end: () => `+=${getDistance()}`,
        invalidateOnRefresh: true,
        animation: gsap.to(track, { x: () => -getDistance(), ease: "none" }),
        onUpdate(self) {
          const moved     = self.progress * getDistance()
          const threshold = moved + window.innerWidth * 0.72
          track.querySelectorAll<HTMLElement>(".story-chapter").forEach((ch) => {
            const inner = ch.querySelector<HTMLElement>(".story-inner")
            if (!inner || revealed.has(inner)) return
            if (ch.offsetLeft < threshold) {
              revealed.add(inner)
              gsap.fromTo(inner, { opacity: 0, y: 52 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
            }
          })
        },
      })

      const introBig   = section.querySelector<HTMLElement>(".intro-big")
      const introSubs  = section.querySelectorAll<HTMLElement>(".intro-sub")
      const introArrow = section.querySelector<HTMLElement>(".intro-arrow")

      if (introBig) {
        gsap.to(introBig, { opacity: 0, x: -55, ease: "power2.in",
          scrollTrigger: { trigger: section, start: "top top", end: "+=300", scrub: true } })
      }
      introSubs.forEach((el) => {
        gsap.to(el, { opacity: 0, x: -38, ease: "power2.in",
          scrollTrigger: { trigger: section, start: "top top", end: "+=210", scrub: true } })
      })
      if (introArrow) {
        gsap.to(introArrow, { opacity: 0, ease: "power1.in",
          scrollTrigger: { trigger: section, start: "top top", end: "+=155", scrub: true } })
      }
    }, sectionRef)

    return () => { ctx.revert(); revealed.clear() }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ position:"relative", height:"100svh", overflow:"hidden", background:"var(--color-bg)" }}
    >
      {/* Fixed eyebrow */}
      <div style={{
        position:"absolute", top:"clamp(5rem,8vw,6rem)", left:"clamp(1.5rem,5vw,4rem)",
        zIndex:10, display:"flex", alignItems:"center", gap:".6rem", pointerEvents:"none",
      }}>
        <div style={{ width:20, height:1, background:acc }}/>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:".58rem", letterSpacing:".16em", textTransform:"uppercase", color:acc }}>Origin Story</span>
      </div>

      {/* Track */}
      <div ref={trackRef} style={{ display:"flex", alignItems:"stretch", height:"100%", willChange:"transform" }}>

        {/* Intro panel */}
        <div style={{
          width:"100vw", flexShrink:0, height:"100%",
          display:"flex", flexDirection:"column", justifyContent:"center",
          padding:"clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem)",
          borderRight:`1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
          position:"relative", overflow:"hidden",
        }}>
          <div style={{
            position:"absolute", inset:0,
            backgroundImage:"url('https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=1400&q=80')",
            backgroundSize:"cover", backgroundPosition:"center",
            filter: isDark ? "brightness(0.18) saturate(0.4)" : "brightness(0.88) saturate(0.5)",
          }}/>
          <div style={{ position:"absolute", inset:0, background: isDark ? `linear-gradient(135deg,${acc}22 0%,transparent 60%)` : `linear-gradient(135deg,${acc}18 0%,transparent 60%)` }}/>
          <div style={{ position:"absolute", inset:0, background: isDark ? "linear-gradient(to top,rgba(7,7,15,0.92) 0%,rgba(7,7,15,0.5) 40%,transparent 70%)" : "linear-gradient(to top,rgba(240,240,250,0.9) 0%,rgba(240,240,250,0.4) 40%,transparent 70%)" }}/>

          <div style={{ position:"relative", zIndex:2 }}>
            <div className="intro-sub" style={{ display:"flex", alignItems:"center", gap:".6rem", marginBottom:"clamp(1rem,2.5vw,1.8rem)" }}>
              <div style={{ width:24, height:1, background:acc }}/>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(.52rem,1vw,.65rem)", letterSpacing:".18em", textTransform:"uppercase", color:acc }}>2022 → 2025</span>
            </div>

            <h2 className="intro-big" style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3.5rem,10vw,9.5rem)", fontWeight:800, letterSpacing:"-.055em", lineHeight:.87, margin:"0 0 clamp(1.5rem,3vw,2.5rem)", color:"var(--color-text-primary)" }}>
              The<br/>
              <span style={{ color:"transparent", WebkitTextStroke:`2px ${acc}`, textShadow:`0 0 60px ${acc}44` }}>Story.</span>
            </h2>

            <p className="intro-sub" style={{ fontFamily:"var(--font-body)", fontSize:"clamp(.85rem,1.3vw,1rem)", color:"var(--color-text-muted)", lineHeight:1.65, maxWidth:440, margin:"0 0 clamp(2rem,4vw,3rem)" }}>
              From a constituency scholarship to shipping software for the world. Four chapters. Three years. One direction.
            </p>

            <div className="intro-arrow" style={{ display:"inline-flex", alignItems:"center", gap:".6rem", fontFamily:"var(--font-mono)", fontSize:".52rem", letterSpacing:".14em", textTransform:"uppercase", color:"var(--color-text-muted)", opacity:.55 }}>
              <span>Scroll to read</span>
              {/* inline style tag — safe, no jsx global */}
              <style>{`@keyframes arrowBounce { 0%,100%{transform:translateX(0);opacity:.6} 50%{transform:translateX(7px);opacity:1} }`}</style>
              <svg width="28" height="14" viewBox="0 0 28 14" fill="none" style={{ animation:"arrowBounce 1.6s ease-in-out infinite" }}>
                <path d="M0 7h25M19 1l6 6-6 6" stroke={acc} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div style={{ position:"absolute", bottom:"clamp(2rem,4vw,3.5rem)", right:"clamp(2rem,4vw,3.5rem)", zIndex:2, fontFamily:"var(--font-mono)", fontSize:".48rem", letterSpacing:".12em", color:"var(--color-text-muted)", opacity:.35 }}>04 CHAPTERS</div>
        </div>

        {/* Chapter panels */}
        {CHAPTERS.map((ch, i) => (
          <div key={ch.year} className="story-chapter" style={{
            width:"clamp(380px,45vw,620px)", flexShrink:0, height:"100%",
            display:"flex", alignItems:"center",
            padding:"clamp(5rem,10vw,8rem) clamp(2rem,4vw,3.5rem)",
            borderRight:`1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
            position:"relative",
            background: i % 2 === 0 ? "transparent" : isDark ? "rgba(255,255,255,0.012)" : "rgba(0,0,0,0.012)",
          }}>
            <div className="story-inner" style={{ opacity:0, width:"100%" }}>
              <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"clamp(1.5rem,3vw,2.5rem)" }}>
                <span style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3rem,5vw,4.5rem)", fontWeight:800, letterSpacing:"-.06em", lineHeight:1, color:"transparent", WebkitTextStroke:`1px ${ch.accent}66` }}>{ch.year}</span>
                <div style={{ display:"flex", flexDirection:"column", gap:".2rem" }}>
                  <div style={{ width:24, height:1, background:ch.accent }}/>
                  <span style={{ fontFamily:"var(--font-mono)", fontSize:".52rem", letterSpacing:".16em", textTransform:"uppercase", color:ch.accent }}>{ch.label}</span>
                </div>
              </div>
              <h3 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.8rem,3.5vw,3rem)", fontWeight:800, letterSpacing:"-.04em", lineHeight:1.0, margin:"0 0 1.25rem", color:"var(--color-text-primary)", whiteSpace:"pre-line" }}>{ch.title}</h3>
              <p style={{ fontFamily:"var(--font-body)", fontSize:"clamp(.82rem,1.1vw,.95rem)", color:"var(--color-text-muted)", lineHeight:1.75, margin:0, maxWidth:400 }}>{ch.body}</p>
              <div style={{ position:"absolute", bottom:"clamp(2rem,4vw,3.5rem)", left:"clamp(2rem,4vw,3.5rem)", width:"clamp(40px,6vw,80px)", height:2, background:`linear-gradient(90deg,${ch.accent},transparent)` }}/>
              <div style={{ position:"absolute", bottom:"clamp(2rem,4vw,3.5rem)", right:"clamp(2rem,4vw,3.5rem)", fontFamily:"var(--font-mono)", fontSize:".44rem", letterSpacing:".12em", color:ch.accent, opacity:.4 }}>{String(i+1).padStart(2,"0")} / 04</div>
            </div>
          </div>
        ))}

        <div style={{ width:"25vw", flexShrink:0 }}/>
      </div>
    </section>
  )
}