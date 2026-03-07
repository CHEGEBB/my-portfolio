"use client"

import { useRef, useState, useEffect } from "react"
import { useTheme } from "@/context/theme-context"

const PHASES = [
  {
    num: "01", label: "Discovery",
    title: "Understand\nbefore I build.",
    body: "I start by interrogating the problem, not the solution. Client interviews, competitive teardowns, user flow mapping. I refuse to write a single line of code until I understand what winning looks like.",
    tags: ["Stakeholder interviews","Problem framing","Scope definition","Risk mapping"],
    duration: "1–2 days",
  },
  {
    num: "02", label: "Architecture",
    title: "Design the\nsystem first.",
    body: "Tech stack selection, database schema, API contracts, deployment strategy — all decided before the first component. Bad architecture costs 10× more to fix later. I don't cut corners here.",
    tags: ["System design","Stack selection","API contracts","DB schema"],
    duration: "1–3 days",
  },
  {
    num: "03", label: "Build",
    title: "Ship fast.\nShip right.",
    body: "Feature-by-feature development against the spec. Clean commits, typed code, tested logic. I move fast because the architecture is already solid. Each feature ships complete — no half-measures.",
    tags: ["Feature sprints","Type safety","Code review","Daily progress"],
    duration: "Bulk of timeline",
  },
  {
    num: "04", label: "Review",
    title: "Break it\nbefore users do.",
    body: "Manual testing, edge case hunting, performance profiling, security checks. I've found more bugs in one focused review session than most teams find in weeks. Paranoia is a feature.",
    tags: ["QA testing","Performance audit","Security review","Bug triage"],
    duration: "2–4 days",
  },
  {
    num: "05", label: "Deploy",
    title: "Launch with\nconfidence.",
    body: "CI/CD pipelines, environment configs, rollback strategies — all in place before go-live. Launches are boring when you've prepared correctly. Boring launches are good launches.",
    tags: ["CI/CD setup","Docker","AWS/Vercel","Monitoring"],
    duration: "1–2 days",
  },
  {
    num: "06", label: "Iterate",
    title: "The work\nnever stops.",
    body: "Post-launch analytics, user feedback, performance monitoring. Every shipped product enters a continuous improvement loop. The version users see today is never the final version.",
    tags: ["Analytics","User feedback","Performance","Feature roadmap"],
    duration: "Ongoing",
  },
]

function PhaseRow({ phase, index, acc, isDark }: {
  phase: typeof PHASES[0]
  index: number
  acc: string
  isDark: boolean
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const [vis,  setVis]  = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.15 })
    obs.observe(el); return () => obs.disconnect()
  }, [])

  const E = "cubic-bezier(0.16,1,0.3,1)"

  return (
    <div
      ref={ref}
      onClick={() => setOpen(o => !o)}
      style={{
        borderBottom: `1px solid ${isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.07)"}`,
        cursor: "pointer", position:"relative", overflow:"hidden",
        opacity:   vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(28px)",
        transition: `opacity .7s ${E} ${index*0.07}s, transform .7s ${E} ${index*0.07}s`,
      }}
      onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.background = isDark?`${acc}09`:`${acc}06` }}
      onMouseOut={e =>  { (e.currentTarget as HTMLDivElement).style.background = "transparent" }}
    >
      {/* Accent line on hover/open */}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:open?3:0, background:acc, transition:"width .3s ease" }}/>

      {/* Main row */}
      <div style={{ display:"grid", gridTemplateColumns:"clamp(2.5rem,5vw,4rem) 1fr 1fr auto", alignItems:"center", gap:"clamp(.75rem,2vw,2rem)", padding:"clamp(1.25rem,2.5vw,2rem) clamp(1.5rem,4vw,3rem)" }}>

        {/* Number */}
        <span style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(.52rem,.8vw,.64rem)", letterSpacing:".14em", color:acc, opacity:.65 }}>{phase.num}</span>

        {/* Title */}
        <div>
          <div style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(.44rem,.65vw,.56rem)", letterSpacing:".14em", textTransform:"uppercase", color:"var(--color-text-muted)", opacity:.5, marginBottom:".25rem" }}>{phase.label}</div>
          <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.1rem,2.5vw,2rem)", fontWeight:800, letterSpacing:"-.03em", lineHeight:1.05, color:"var(--color-text-primary)", whiteSpace:"pre-line" }}>{phase.title}</div>
        </div>

        {/* Tags */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:".35rem" }}>
          {phase.tags.map(t => (
            <span key={t} style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(.4rem,.58vw,.52rem)", letterSpacing:".08em", color: open?acc:"var(--color-text-muted)", border:`1px solid ${open?acc+"55":"rgba(128,128,128,0.2)"}`, padding:".2rem .6rem", borderRadius:"var(--radius)", transition:"all .25s ease", opacity: open?1:.6 }}>{t}</span>
          ))}
        </div>

        {/* Duration + arrow */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:".3rem" }}>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(.42rem,.6vw,.54rem)", letterSpacing:".08em", color:acc, opacity:.7 }}>{phase.duration}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={acc} strokeWidth="2" strokeLinecap="round"
            style={{ transform: open?"rotate(180deg)":"rotate(0deg)", transition:"transform .35s ease", opacity:.7 }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* Expanded body */}
      <div style={{ maxHeight: open?"200px":"0", overflow:"hidden", transition:`max-height .5s ${E}` }}>
        <p style={{ fontFamily:"var(--font-body)", fontSize:"clamp(.82rem,1.1vw,.95rem)", color:"var(--color-text-muted)", lineHeight:1.75, margin:0, padding:"0 clamp(1.5rem,4vw,3rem) clamp(1.25rem,2vw,1.75rem) calc(clamp(2.5rem,5vw,4rem) + clamp(.75rem,2vw,2rem) + clamp(1.5rem,4vw,3rem))" }}>
          {phase.body}
        </p>
      </div>
    </div>
  )
}

export function ProcessPhases() {
  const { theme } = useTheme()
  const acc    = theme.colors.accent
  const isDark = theme.mode === "dark"
  const ref    = useRef<HTMLDivElement>(null)
  const [vis,  setVis]  = useState(false)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.1 })
    obs.observe(el); return () => obs.disconnect()
  }, [])

  const E = "cubic-bezier(0.16,1,0.3,1)"

  return (
    <section style={{ position:"relative", background:"var(--color-bg)", overflow:"hidden" }}>
      {/* Header */}
      <div ref={ref} style={{ padding:"clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem) clamp(2rem,4vw,3rem)", borderBottom:`1px solid ${isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.07)"}`, display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:"2rem" }}>
        <div style={{ opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(24px)", transition:`opacity .8s ${E}, transform .8s ${E}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:".6rem", marginBottom:"1rem" }}>
            <div style={{ width:20, height:1, background:acc }}/>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:".56rem", letterSpacing:".18em", textTransform:"uppercase", color:acc }}>Six Phases</span>
          </div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.5rem,8vw,7rem)", fontWeight:900, letterSpacing:"-.055em", lineHeight:.88, margin:0 }}>
            <span style={{ display:"block", color:"var(--color-text-primary)" }}>The</span>
            <span style={{ display:"block", color:"transparent", WebkitTextStroke:`2px ${acc}` }}>Sequence.</span>
          </h2>
        </div>
        <p style={{ fontFamily:"var(--font-body)", fontSize:"clamp(.82rem,1.1vw,.95rem)", color:"var(--color-text-muted)", lineHeight:1.7, maxWidth:320, margin:0, opacity:vis?1:0, transition:`opacity .7s ${E} .3s` }}>
          Click any phase to expand. Each step is non-negotiable — the order exists for a reason.
        </p>
      </div>

      {/* Phase rows */}
      {PHASES.map((p, i) => <PhaseRow key={p.num} phase={p} index={i} acc={acc} isDark={isDark}/>)}
    </section>
  )
}