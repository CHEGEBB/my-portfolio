"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { useTheme } from "@/context/theme-context"

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ROW_A = [
  { name:"Next.js",    logo:"/logos/nextjs.svg",      label:"App Router · SSR · Edge"     },
  { name:"React",      logo:"/logos/react.svg",        label:"Hooks · Context · Suspense"  },
  { name:"TypeScript", logo:"/logos/typescript.svg",   label:"Strict · Generics · DX"      },
  { name:"Tailwind",   logo:"/logos/tailwindcss.svg",  label:"Utility-first · Responsive"  },
  { name:"Vue.js",     logo:"/logos/vue.svg",          label:"Composition API · Nuxt"      },
  { name:"Angular",    logo:"/logos/angular.svg",      label:"Signals · Standalone"        },
  { name:"Node.js",    logo:"/logos/nodejs.svg",       label:"REST · Streams · Cluster"    },
  { name:"Python",     logo:"/logos/python.svg",       label:"FastAPI · ML · Scripting"    },
  { name:"Flutter",    logo:"/logos/flutter.svg",      label:"Cross-platform · Widgets"    },
  { name:"Figma",      logo:"/logos/figma.svg",        label:"Design · Prototype · Tokens" },
]

const ROW_B = [
  { name:"PostgreSQL",   logo:"/logos/postgresql.svg",  label:"Relations · JSONB · RLS"     },
  { name:"MongoDB",      logo:"/logos/mongodb.svg",     label:"Atlas · Aggregation · ODM"   },
  { name:"Docker",       logo:"/logos/docker.svg",      label:"Compose · Multi-stage build" },
  { name:"AWS",          logo:"/logos/aws.svg",         label:"EC2 · S3 · Lambda · RDS"     },
  { name:"Git",          logo:"/logos/git.svg",         label:"Branching · Rebase · CI"     },
  { name:"GitHub",       logo:"/logos/github.svg",      label:"Actions · PRs · Releases"    },
  { name:"React Native", logo:"/logos/reactnative.svg", label:"Expo · OTA · Navigation"     },
  { name:"Dart",         logo:"/logos/dart.svg",        label:"Null-safety · Isolates"      },
  { name:"Linux",        logo:"/logos/linux.svg",       label:"Shell · Cron · Systemd"      },
  { name:"Firebase",     logo:"/logos/firebase.svg",    label:"Auth · Firestore · Hosting"  },
]

// ─── PAINT SWIPE LINE (reusable) ──────────────────────────────────────────────
function PaintLine({
  text, outline, acc, delay, painted, revealed, size,
}: {
  text: string; outline?: boolean; acc: string
  delay: number; painted: boolean; revealed: boolean
  size?: string
}) {
  return (
    <div style={{ position:"relative", overflow:"hidden", display:"block", lineHeight:0.95 }}>
      <span style={{
        display:"block", paddingBottom:".05em",
        fontFamily:"var(--font-display)",
        fontSize: size ?? "clamp(4rem,10vw,9.5rem)",
        fontWeight:800, letterSpacing:"-0.055em",
        color: outline ? "transparent" : "var(--color-text-primary)",
        WebkitTextStroke: outline ? `2px ${acc}` : undefined,
        textShadow: outline ? `0 0 80px ${acc}22` : undefined,
        userSelect:"none",
      }}>{text}</span>

      {/* Block 1 — accent sweeps in then out */}
      <div style={{
        position:"absolute", inset:0, background:acc, zIndex:3,
        transform: !painted ? "translateX(-101%)" : revealed ? "translateX(101%)" : "translateX(0%)",
        transition: !painted ? "none"
          : revealed ? `transform 0.6s cubic-bezier(0.76,0,0.24,1) ${delay+0.07}s`
          : `transform 0.52s cubic-bezier(0.76,0,0.24,1) ${delay}s`,
      }}/>
      {/* Block 2 — ghost chases */}
      <div style={{
        position:"absolute", inset:0,
        background:"rgba(255,255,255,0.14)", zIndex:2,
        transform: !painted ? "translateX(-101%)" : revealed ? "translateX(101%)" : "translateX(0%)",
        transition: !painted ? "none"
          : revealed ? `transform 0.6s cubic-bezier(0.76,0,0.24,1) ${delay+0.15}s`
          : `transform 0.52s cubic-bezier(0.76,0,0.24,1) ${delay+0.09}s`,
      }}/>
    </div>
  )
}

// ─── LOGO ITEM — zero containers, full color, totally free ───────────────────
function LogoItem({
  item, acc, setPaused,
}: {
  item: typeof ROW_A[0]; acc: string
  setPaused: (v: boolean) => void
}) {
  const [hov, setHov] = useState(false)

  return (
    <div
      onMouseEnter={() => { setHov(true);  setPaused(true)  }}
      onMouseLeave={() => { setHov(false); setPaused(false) }}
      style={{
        display:"flex", flexDirection:"column",
        alignItems:"center",
        gap: hov ? "0.65rem" : "0",
        padding:"0 clamp(2rem,4vw,3.5rem)",
        flexShrink:0, cursor:"crosshair",
        transition:"gap 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {/* Raw logo — full color, no filter, no wrapper, no shadow */}
      <img
        src={item.logo}
        alt={item.name}
        style={{
          display:"block",
          width: hov ? "clamp(52px,6vw,72px)" : "clamp(36px,4vw,52px)",
          height: hov ? "clamp(52px,6vw,72px)" : "clamp(36px,4vw,52px)",
          objectFit:"contain",
          transition:"width 0.4s cubic-bezier(0.34,1.56,0.64,1), height 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          // Full natural color — no filter whatsoever
        }}
      />

      {/* Hover reveal — name + label, slides down */}
      <div style={{
        overflow:"hidden",
        maxHeight: hov ? "4rem" : "0",
        opacity: hov ? 1 : 0,
        transition:"max-height 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease 0.05s",
        textAlign:"center",
        pointerEvents:"none",
      }}>
        <span style={{
          display:"block",
          fontFamily:"var(--font-display)",
          fontSize:"clamp(0.7rem,1.3vw,0.95rem)",
          fontWeight:800, letterSpacing:"-0.03em",
          color:"var(--color-text-primary)",
          whiteSpace:"nowrap", lineHeight:1.2,
        }}>{item.name}</span>
        <span style={{
          display:"block",
          fontFamily:"var(--font-mono)",
          fontSize:"0.38rem", letterSpacing:"0.1em",
          textTransform:"uppercase",
          color:acc,
          whiteSpace:"nowrap", marginTop:"0.2rem",
          lineHeight:1,
        }}>{item.label}</span>
      </div>
    </div>
  )
}

// ─── CAROUSEL STRIP ───────────────────────────────────────────────────────────
function CarouselStrip({
  items, direction, speed, acc, revealed, delay,
}: {
  items: typeof ROW_A; direction:"left"|"right"; speed:number
  acc:string; revealed:boolean; delay:number
}) {
  const [paused, setPaused] = useState(false)
  const tripled = [...items, ...items, ...items]

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        overflow:"hidden", width:"100%",
        WebkitMaskImage:"linear-gradient(90deg,transparent 0%,black 10%,black 90%,transparent 100%)",
        maskImage:       "linear-gradient(90deg,transparent 0%,black 10%,black 90%,transparent 100%)",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "none" : `translateY(${direction==="right"?28:-28}px)`,
        transition:`opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        paddingBottom:"0.75rem",
        paddingTop:"0.5rem",
      }}
    >
      <div style={{
        display:"flex", alignItems:"flex-end",
        width:"max-content",
        animation:`scroll-${direction} ${speed}s linear infinite`,
        animationPlayState: paused ? "paused" : "running",
        willChange:"transform",
      }}>
        {tripled.map((item, i) => (
          <LogoItem
            key={`${item.name}-${i}`}
            item={item}
            acc={acc}
            setPaused={setPaused}
          />
        ))}
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function Skills() {
  const { theme } = useTheme()
  const acc    = theme.colors.accent
  const isDark = theme.mode === "dark"

  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView,   setInView]   = useState(false)
  const [painted,  setPainted]  = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [showRest, setShowRest] = useState(false)
  const [mouse,    setMouse]    = useState({ x:0.5, y:0.5 })

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold:0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setPainted(true),  80)
    const t2 = setTimeout(() => setRevealed(true), 1150)
    const t3 = setTimeout(() => setShowRest(true), 1200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [inView])

  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    setMouse({
      x: Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),
      y: Math.max(0,Math.min(1,(e.clientY-r.top)/r.height)),
    })
  }, [])

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    el.addEventListener("mousemove", onMouseMove, { passive:true })
    return () => el.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  return (
    <section
      ref={sectionRef}
      style={{
        position:"relative", background:"var(--color-bg)",
        overflow:"hidden",
        padding:"clamp(5rem,10vw,9rem) 0 clamp(4rem,8vw,7rem)",
      }}
    >
      {/* Mouse-reactive ambient */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
        background:`radial-gradient(ellipse 60% 55% at ${(mouse.x*100).toFixed(1)}% ${(mouse.y*100).toFixed(1)}%, ${acc}14 0%, transparent 65%)`,
        transition:"background 0.1s ease",
      }}/>

      {/* ── HEADER ── */}
      <div style={{
        padding:"0 clamp(1.5rem,5vw,5rem)",
        marginBottom:"clamp(3.5rem,7vw,6rem)",
        position:"relative", zIndex:2,
      }}>

        {/* Eyebrow */}
        <div style={{
          display:"flex", alignItems:"center", gap:"0.75rem",
          marginBottom:"clamp(1.25rem,2.5vw,2rem)",
          opacity: showRest?1:0,
          transform: showRest?"none":"translateY(14px)",
          transition:"all 0.6s ease 0.1s",
        }}>
          <div style={{ width:28, height:"1px", background:acc }}/>
          <span style={{
            fontFamily:"var(--font-mono)", fontSize:"0.6rem",
            letterSpacing:"0.15em", textTransform:"uppercase", color:acc,
          }}>Tech Stack</span>
          <div style={{
            fontFamily:"var(--font-mono)", fontSize:"0.52rem",
            color:"var(--color-text-muted)", letterSpacing:"0.08em",
            border:"1px solid var(--color-surface-border)",
            padding:"0.12rem 0.45rem",
          }}>{ROW_A.length + ROW_B.length} Tools</div>
        </div>

        {/* Two-line heading with paint reveal */}
        <PaintLine text="Tools I"  outline={false} acc={acc} delay={0}   painted={painted} revealed={revealed}/>
        <PaintLine text="Master."  outline={true}  acc={acc} delay={0.2} painted={painted} revealed={revealed}/>

        {/* Subtext */}
        <p style={{
          fontFamily:"var(--font-body)",
          fontSize:"clamp(0.8rem,1.2vw,0.95rem)",
          color:"var(--color-text-muted)", lineHeight:1.7,
          maxWidth:480, margin:"clamp(1rem,2vw,1.75rem) 0 0",
          opacity: showRest?1:0,
          transform: showRest?"none":"translateY(12px)",
          transition:"all 0.7s ease 0.25s",
        }}>
          Not just familiar — deeply fluent. Every tool here has been used in production,
          under real deadlines, for real users.
        </p>
      </div>

      {/* ── ROW A — scrolls right ── */}
      <div style={{ marginBottom:"clamp(3rem,6vw,5rem)", position:"relative", zIndex:2 }}>
        <CarouselStrip
          items={ROW_A} direction="right" speed={38}
          acc={acc} revealed={showRest} delay={0}
        />
      </div>

      {/* Simple accent line between rows */}
      <div style={{
        margin:"0 clamp(1.5rem,5vw,5rem)",
        height:1,
        background:`linear-gradient(90deg,transparent,${acc}55,transparent)`,
        opacity: showRest?1:0,
        transition:"opacity 0.6s ease 0.3s",
      }}/>

      {/* ── ROW B — scrolls left ── */}
      <div style={{ marginTop:"clamp(3rem,6vw,5rem)", position:"relative", zIndex:2 }}>
        <CarouselStrip
          items={ROW_B} direction="left" speed={44}
          acc={acc} revealed={showRest} delay={0.15}
        />
      </div>

      {/* ── BOTTOM STATS ── */}
      <div style={{
        display:"flex", justifyContent:"center", alignItems:"center",
        gap:"clamp(2.5rem,6vw,6rem)",
        marginTop:"clamp(4rem,8vw,7rem)",
        padding:"0 clamp(1.5rem,5vw,5rem)",
        opacity: showRest?1:0,
        transform: showRest?"none":"translateY(16px)",
        transition:"all 0.7s ease 0.5s",
        position:"relative", zIndex:2,
      }}>
        {[
          { n:"20+", l:"Projects shipped"    },
          { n:"7",   l:"Tech categories"     },
          { n:"3+",  l:"Years in production" },
        ].map(({ n, l }) => (
          <div key={l} style={{ textAlign:"center" }}>
            <div style={{
              fontFamily:"var(--font-display)",
              fontSize:"clamp(2rem,4.5vw,3.5rem)",
              fontWeight:800, letterSpacing:"-0.055em",
              color:acc, lineHeight:1,
            }}>{n}</div>
            <div style={{
              fontFamily:"var(--font-mono)",
              fontSize:"0.48rem", letterSpacing:"0.13em",
              textTransform:"uppercase", color:"var(--color-text-muted)",
              marginTop:"0.3rem",
            }}>{l}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll-right {
          from { transform:translateX(0); }
          to   { transform:translateX(-33.333%); }
        }
        @keyframes scroll-left {
          from { transform:translateX(-33.333%); }
          to   { transform:translateX(0); }
        }
      `}</style>
    </section>
  )
}