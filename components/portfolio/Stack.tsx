"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"

// ─── TECH DATA ────────────────────────────────────────────────────────────────
// Uses actual logos from /public/logos/
const TECHS = [
  // Core — CENTER ring (most used)
  { name:"React",        logo:"/logos/react.svg",           ring:0, level:100 },
  { name:"Next.js",      logo:"/logos/nextjs.svg",          ring:0, level:100 },
  { name:"TypeScript",   logo:"/logos/typescript.svg",      ring:0, level:95  },
  { name:"Node.js",      logo:"/logos/nodejs.svg",          ring:0, level:95  },
  { name:"TailwindCSS",  logo:"/logos/tailwindcss.svg",     ring:0, level:100 },
  // Mid ring
  { name:"Python",       logo:"/logos/python.svg",          ring:1, level:82  },
  { name:"PostgreSQL",   logo:"/logos/postgresql.svg",      ring:1, level:80  },
  { name:"MongoDB",      logo:"/logos/mongodb.svg",         ring:1, level:78  },
  { name:"Docker",       logo:"/logos/docker.svg",          ring:1, level:78  },
  { name:"AWS",          logo:"/logos/aws.svg",             ring:1, level:72  },
  { name:"React Native", logo:"/logos/reactnative.svg",     ring:1, level:88  },
  { name:"Vue.js",       logo:"/logos/vue.svg",             ring:1, level:68  },
  // Outer ring
  { name:"Flutter",      logo:"/logos/flutter.svg",         ring:2, level:72  },
  { name:"Dart",         logo:"/logos/dart.svg",            ring:2, level:68  },
  { name:"Express",      logo:"/logos/express.svg",         ring:2, level:85  },
  { name:"Git",          logo:"/logos/git.svg",             ring:2, level:90  },
  { name:"GitHub",       logo:"/logos/github.svg",          ring:2, level:92  },
  { name:"Linux",        logo:"/logos/linux.svg",           ring:2, level:78  },
  { name:"Figma",        logo:"/logos/figma.svg",           ring:2, level:70  },
  { name:"Angular",      logo:"/logos/angular.svg",         ring:2, level:55  },
]

const RING_CONFIG = [
  { radius: 140, size: 52, speed: 28  },   // inner
  { radius: 240, size: 44, speed: 45  },   // mid
  { radius: 340, size: 38, speed: 62  },   // outer
]

// ─── CONSTELLATION ────────────────────────────────────────────────────────────
function Constellation({ inView, acc }: { inView: boolean; acc: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [angles, setAngles] = useState<number[]>([])
  const rafRef = useRef<number>(0)
  const [hovered, setHovered] = useState<string | null>(null)
  const startAngles = useRef<number[]>([])
  const startTime = useRef<number>(0)

  // Init angles per ring — evenly spaced
  useEffect(() => {
    const byRing: number[][] = [[], [], []]
    TECHS.forEach((t) => { byRing[t.ring].push(0) })

    // Assign evenly
    const init: number[] = []
    const ringCounts = [0, 0, 0]
    TECHS.forEach((t) => {
      const ringTechs = TECHS.filter(x => x.ring === t.ring)
      const posInRing = ringCounts[t.ring]
      init.push((posInRing / ringTechs.length) * Math.PI * 2)
      ringCounts[t.ring]++
    })
    startAngles.current = init
    setAngles(init)
    startTime.current = performance.now()
  }, [])

  // Animate
  useEffect(() => {
    if (!inView || angles.length === 0) return
    let id: number
    const loop = () => {
      const elapsed = (performance.now() - startTime.current) / 1000
      setAngles(startAngles.current.map((base, i) => {
        const ringSpeed = RING_CONFIG[TECHS[i].ring].speed
        const dir = TECHS[i].ring % 2 === 0 ? 1 : -1
        return base + (elapsed * dir * Math.PI * 2) / ringSpeed
      }))
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [inView, angles.length])

  const centerSize = 160

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "clamp(600px,65vw,780px)",
        height: "clamp(600px,65vw,780px)",
        flexShrink: 0,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "scale(0.92)",
        transition: "opacity 1s ease 0.3s, transform 1s cubic-bezier(.16,1,.3,1) 0.3s",
      }}
    >
      {/* Ring circles */}
      {RING_CONFIG.map((ring, ri) => (
        <div key={ri} style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: ring.radius * 2,
          height: ring.radius * 2,
          borderRadius: "50%",
          border: `1px dashed ${acc}${ri === 0 ? "35" : ri === 1 ? "22" : "15"}`,
          pointerEvents: "none",
          transition: "border-color 0.4s ease",
        }} />
      ))}

      {/* Center node */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: centerSize, height: centerSize,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${acc}20 0%, transparent 70%)`,
        border: `1px solid ${acc}40`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 5,
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: acc, lineHeight: 1 }}>Tech</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text-muted)", marginTop: "0.2rem" }}>Stack</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", color: acc, marginTop: "0.4rem" }}>{TECHS.length} tools</div>
      </div>

      {/* Tech nodes */}
      {TECHS.map((tech, i) => {
        if (angles.length === 0) return null
        const ring = RING_CONFIG[tech.ring]
        const angle = angles[i]
        const x = Math.cos(angle) * ring.radius
        const y = Math.sin(angle) * ring.radius
        const isHov = hovered === tech.name
        const sz = ring.size

        return (
          <div
            key={tech.name}
            onMouseEnter={() => setHovered(tech.name)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${isHov ? 1.25 : 1})`,
              width: sz, height: sz,
              borderRadius: "50%",
              background: isHov
                ? `radial-gradient(circle, ${acc}25 0%, var(--color-surface) 60%)`
                : "var(--color-surface)",
              border: `1px solid ${isHov ? acc : "var(--color-surface-border)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column",
              zIndex: isHov ? 20 : 2,
              cursor: "default",
              transition: "transform 0.3s ease, border-color 0.2s ease, box-shadow 0.3s ease, background 0.3s ease",
              boxShadow: isHov ? `0 0 30px ${acc}40, 0 8px 30px rgba(0,0,0,0.3)` : "0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            <img
              src={tech.logo}
              alt={tech.name}
              style={{
                width: sz * 0.48, height: sz * 0.48,
                objectFit: "contain",
                filter: isHov ? "none" : "grayscale(0.4) opacity(0.8)",
                transition: "filter 0.3s ease",
                flexShrink: 0,
              }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
            />
            {/* Name tooltip on hover */}
            {isHov && (
              <div style={{
                position: "absolute",
                top: "110%",
                left: "50%",
                transform: "translateX(-50%)",
                background: "var(--color-surface)",
                border: `1px solid ${acc}50`,
                padding: "0.2rem 0.5rem",
                whiteSpace: "nowrap",
                zIndex: 30,
                pointerEvents: "none",
              }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.46rem", letterSpacing: "0.08em", color: acc }}>{tech.name}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.44rem", color: "var(--color-text-muted)", marginLeft: "0.3rem" }}>{tech.level}%</span>
              </div>
            )}
          </div>
        )
      })}

      {/* Glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: RING_CONFIG[0].radius * 2.5,
        height: RING_CONFIG[0].radius * 2.5,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${acc}08 0%, transparent 70%)`,
        pointerEvents: "none",
        animation: "orbPulse 5s ease-in-out infinite",
      }}/>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function TechStack() {
  const { theme } = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const acc = theme.colors.accent

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="stack" ref={sectionRef} style={{ position:"relative", background:"var(--color-bg)", overflow:"hidden" }}>
      {/* Ambient bg */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:`radial-gradient(ellipse 60% 70% at 70% 50%, ${acc}08 0%, transparent 65%)`,
      }}/>

      <div style={{
        position:"relative", zIndex:1,
        maxWidth:"1400px", margin:"0 auto",
        display:"flex", flexWrap:"wrap",
        alignItems:"center", gap:"clamp(2rem,4vw,5rem)",
        padding:"clamp(5rem,9vw,8rem) clamp(1.5rem,5vw,4rem)",
      }}>

        {/* LEFT — text */}
        <div style={{
          flex:"1 1 clamp(260px,30%,400px)",
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateX(-30px)",
          transition:"opacity 0.8s ease 0.1s, transform 0.8s cubic-bezier(.16,1,.3,1) 0.1s",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1rem" }}>
            <div style={{ width:24, height:1, background:acc }}/>
            <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.6rem", letterSpacing:"0.15em", textTransform:"uppercase", color:acc }}>Arsenal</span>
          </div>
          <h2 style={{
            fontFamily:"var(--font-display)",
            fontSize:"clamp(2.5rem,6vw,6rem)",
            fontWeight:800, letterSpacing:"-0.05em", lineHeight:0.88, margin:"0 0 1.5rem",
          }}>
            <span style={{ display:"block", color:"var(--color-text-primary)" }}>Tech</span>
            <span style={{ display:"block", color:"transparent", WebkitTextStroke:`2px ${acc}` }}>Stack</span>
          </h2>

          <p style={{
            fontFamily:"var(--font-body)", fontSize:"clamp(0.8rem,1.1vw,0.9rem)",
            lineHeight:1.75, color:"var(--color-text-secondary)", marginBottom:"2rem",
          }}>
            Tools I reach for daily. Three rings of depth — inner is mastered, 
            outer is actively used. Hover any logo to see proficiency.
          </p>

          {/* Ring legend */}
          {[
            { label:"Core — mastered",    desc:"Used on every project",    color:acc, opacity:1      },
            { label:"Mid — proficient",   desc:"Regular production use",   color:acc, opacity:0.65   },
            { label:"Outer — competent",  desc:"Project-specific use",     color:acc, opacity:0.4    },
          ].map((r, i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", gap:"0.75rem",
              marginBottom:"0.65rem",
            }}>
              <div style={{
                width:24, height:24, borderRadius:"50%", flexShrink:0,
                border:`1px dashed ${r.color}`,
                opacity: r.opacity,
              }}/>
              <div>
                <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.5rem", letterSpacing:"0.08em", color:"var(--color-text-primary)" }}>{r.label}</div>
                <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.45rem", letterSpacing:"0.06em", color:"var(--color-text-muted)" }}>{r.desc}</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop:"2rem", fontFamily:"var(--font-display)", fontSize:"clamp(1.25rem,3vw,2rem)", fontWeight:800, letterSpacing:"-0.04em", color:"transparent", WebkitTextStroke:`1px ${acc}40` }}>
            Always learning.
          </div>
        </div>

        {/* RIGHT — constellation */}
        <div style={{ flex:"1 1 clamp(400px,50%,780px)", display:"flex", justifyContent:"center", overflow:"visible" }}>
          <Constellation inView={inView} acc={acc} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes orbPulse { 0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.05)} }
      `}</style>
    </section>
  )
}