"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/context/theme-context"
import { ArrowUpRight } from "lucide-react"

// ─── 30 CHALLENGES with real tech ────────────────────────────────────────────
const CHALLENGES = [
  { id:"01", title:"QR Code Component",             difficulty:"Newbie",       tech:["HTML","CSS"],                   preview:"Clean card layout, perfect alignment"               },
  { id:"02", title:"Blog Preview Card",             difficulty:"Newbie",       tech:["HTML","CSS"],                   preview:"Typography-first card component"                    },
  { id:"03", title:"Social Links Profile",          difficulty:"Newbie",       tech:["HTML","CSS"],                   preview:"Centered profile with social links"                 },
  { id:"04", title:"Recipe Page",                   difficulty:"Newbie",       tech:["HTML","CSS"],                   preview:"Semantic HTML document structure"                   },
  { id:"05", title:"Product Preview Card",          difficulty:"Newbie",       tech:["HTML","CSS"],                   preview:"Responsive two-column product card"                 },
  { id:"06", title:"Four Card Feature Section",     difficulty:"Newbie",       tech:["HTML","CSS","SASS"],            preview:"CSS Grid layout, 4 feature cards"                  },
  { id:"07", title:"Stats Preview Card",            difficulty:"Newbie",       tech:["HTML","CSS"],                   preview:"Stats card with image tint overlay"                 },
  { id:"08", title:"Order Summary Component",       difficulty:"Newbie",       tech:["HTML","CSS"],                   preview:"Pricing card with hover states"                    },
  { id:"09", title:"NFT Preview Card",              difficulty:"Newbie",       tech:["HTML","CSS"],                   preview:"NFT card with overlay interactions"                 },
  { id:"10", title:"Social Proof Section",          difficulty:"Newbie",       tech:["HTML","CSS","SASS"],            preview:"Testimonials grid with star ratings"                },
  { id:"11", title:"FAQ Accordion",                 difficulty:"Newbie",       tech:["HTML","CSS","JS"],              preview:"Accessible accordion with animations"               },
  { id:"12", title:"Newsletter Sign-up",            difficulty:"Junior",       tech:["HTML","CSS","JS"],              preview:"Form validation + success state"                   },
  { id:"13", title:"Interactive Card Form",         difficulty:"Junior",       tech:["HTML","CSS","JS"],              preview:"Real-time card preview, DOM manipulation"           },
  { id:"14", title:"Intro + Dropdown Nav",          difficulty:"Junior",       tech:["HTML","CSS","JS"],              preview:"Dropdown menus, responsive hamburger"               },
  { id:"15", title:"Tip Calculator App",            difficulty:"Junior",       tech:["HTML","CSS","JS"],              preview:"Real-time tip splitting calculator"                 },
  { id:"16", title:"Testimonials Slider",           difficulty:"Junior",       tech:["HTML","CSS","JS"],              preview:"Animated content slider with transitions"           },
  { id:"17", title:"Crowdfunding Page",             difficulty:"Junior",       tech:["React","TailwindCSS"],          preview:"Modal pledges, state tracking, progress bars"       },
  { id:"18", title:"Time Tracking Dashboard",       difficulty:"Junior",       tech:["React","TailwindCSS"],          preview:"JSON data, toggle periods, hover stats"             },
  { id:"19", title:"Conference Ticket Generator",   difficulty:"Junior",       tech:["React","CSS"],                  preview:"Form → dynamic ticket generation"                   },
  { id:"20", title:"Huddle Landing Page",           difficulty:"Junior",       tech:["HTML","CSS","SASS"],            preview:"Two-column responsive marketing page"               },
  { id:"21", title:"Chat App CSS Illustration",     difficulty:"Intermediate", tech:["HTML","CSS","SASS"],            preview:"Pure CSS mobile UI illustration"                    },
  { id:"22", title:"Job Listings Filter",           difficulty:"Intermediate", tech:["React","TailwindCSS"],          preview:"Tag-based filtering, dynamic state"                 },
  { id:"23", title:"IP Address Tracker",            difficulty:"Intermediate", tech:["React","TailwindCSS","API"],    preview:"Two APIs: geo + map, live lookup"                   },
  { id:"24", title:"Launch Countdown Timer",        difficulty:"Intermediate", tech:["Vue.js","CSS"],                 preview:"Animated flip timer, real countdown"                },
  { id:"25", title:"Room Homepage",                 difficulty:"Intermediate", tech:["Next.js","TailwindCSS"],        preview:"Image slider, SSR layout, clean nav"                },
  { id:"26", title:"Todo App",                      difficulty:"Intermediate", tech:["React","CSS","TypeScript"],     preview:"Drag-drop, filter, dark/light toggle"               },
  { id:"27", title:"Space Tourism Site",            difficulty:"Intermediate", tech:["Next.js","TailwindCSS"],        preview:"Multi-page, tabbed content, image transitions"      },
  { id:"28", title:"Rock Paper Scissors",           difficulty:"Advanced",     tech:["React","CSS","TypeScript"],     preview:"Game logic, animated moves, RPSLS bonus"            },
  { id:"29", title:"Multi-step Form",               difficulty:"Advanced",     tech:["React","TailwindCSS","TypeScript"], preview:"Step validation, summary, complex state"        },
  { id:"30", title:"Interactive Pricing",           difficulty:"Advanced",     tech:["React","TailwindCSS"],          preview:"Custom range slider, toggle billing, animations"    },
]

const DIFF_META: Record<string, { color: string; label: string }> = {
  Newbie:       { color: "#22C55E", label: "NB" },
  Junior:       { color: "#45D2B0", label: "JR" },
  Intermediate: { color: "#5567F7", label: "IN" },
  Advanced:     { color: "#FF4D1C", label: "AD" },
}

const FALLBACK = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700&q=70",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=700&q=70",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=700&q=70",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=70",
  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=700&q=70",
]

// ─── SINGLE CARD ─────────────────────────────────────────────────────────────
function ChallengeCard({ c, idx, paused, onEnter, onLeave }: {
  c: typeof CHALLENGES[0]; idx: number
  paused: boolean; onEnter: () => void; onLeave: () => void
}) {
  const { theme } = useTheme()
  const [hovered, setHovered] = useState(false)
  const [imgSrc, setImgSrc] = useState(`/challenges/challenge-${c.id}.png`)
  const dMeta = DIFF_META[c.difficulty]
  const acc = theme.colors.accent

  return (
    <a
      href="https://github.com/brianchege2k/frontend-mentor-challenges"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => { setHovered(true); onEnter() }}
      onMouseLeave={() => { setHovered(false); onLeave() }}
      style={{
        display: "block",
        position: "relative",
        width: "clamp(240px,25vw,360px)",
        flexShrink: 0,
        overflow: "hidden",
        textDecoration: "none",
        cursor: "none",
        background: "var(--color-surface)",
        border: `1px solid ${hovered ? dMeta.color + "55" : "var(--color-surface-border)"}`,
        transform: hovered ? "translateY(-10px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "transform 0.45s cubic-bezier(.16,1,.3,1), border-color 0.3s ease, box-shadow 0.4s ease",
        boxShadow: hovered ? `0 28px 80px ${dMeta.color}25, 0 0 0 1px ${dMeta.color}20` : "none",
        zIndex: hovered ? 20 : 1,
      }}
    >
      {/* Screenshot */}
      <div style={{ position:"relative", aspectRatio:"16/9", overflow:"hidden" }}>
        <img
          src={imgSrc}
          alt={c.title}
          onError={() => setImgSrc(FALLBACK[idx % FALLBACK.length])}
          style={{
            width:"100%", height:"100%", objectFit:"cover", display:"block",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            filter: hovered ? "brightness(0.55)" : "brightness(0.85)",
            transition: "transform 0.6s cubic-bezier(.16,1,.3,1), filter 0.4s ease",
            animationPlayState: paused ? "paused" : "running",
          }}
        />
        {/* Color wash */}
        <div style={{
          position:"absolute", inset:0,
          background:`linear-gradient(135deg, ${dMeta.color}18 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0, transition:"opacity 0.4s ease",
          zIndex:1,
        }}/>
        {/* Diff badge */}
        <div style={{
          position:"absolute", top:"0.6rem", left:"0.6rem", zIndex:2,
          fontFamily:"var(--font-mono)", fontSize:"0.44rem",
          letterSpacing:"0.1em",
          color: dMeta.color,
          background:`${dMeta.color}18`,
          border:`1px solid ${dMeta.color}50`,
          padding:"0.15rem 0.45rem",
        }}>{c.difficulty}</div>
        {/* Number */}
        <div style={{
          position:"absolute", top:"0.6rem", right:"0.6rem", zIndex:2,
          fontFamily:"var(--font-mono)", fontSize:"0.44rem",
          color:"rgba(255,255,255,0.3)", letterSpacing:"0.06em",
        }}>#{c.id}</div>
      </div>

      {/* Content */}
      <div style={{ padding:"0.85rem 0.9rem" }}>
        <h4 style={{
          fontFamily:"var(--font-display)",
          fontSize:"clamp(0.82rem,1.2vw,0.95rem)",
          fontWeight:800, letterSpacing:"-0.025em", lineHeight:1.2,
          color: hovered ? "var(--color-text-primary)" : "var(--color-text-secondary)",
          margin:"0 0 0.4rem",
          transition:"color 0.25s ease",
        }}>{c.title}</h4>

        {/* Preview text */}
        <p style={{
          fontFamily:"var(--font-body)", fontSize:"0.7rem",
          lineHeight:1.5, color:"var(--color-text-muted)",
          margin:"0 0 0.6rem",
          maxHeight: hovered ? "3rem" : "0",
          overflow:"hidden", opacity: hovered ? 1 : 0,
          transition:"max-height 0.35s ease, opacity 0.3s ease",
        }}>{c.preview}</p>

        {/* Tech pills */}
        <div style={{ display:"flex", gap:"0.22rem", flexWrap:"wrap" }}>
          {c.tech.map(t => (
            <span key={t} style={{
              fontFamily:"var(--font-mono)", fontSize:"0.4rem",
              letterSpacing:"0.06em", textTransform:"uppercase",
              color: hovered ? dMeta.color : "var(--color-text-muted)",
              border:`1px solid ${hovered ? dMeta.color + "40" : "var(--color-surface-border)"}`,
              padding:"0.1rem 0.35rem",
              transition:"color 0.25s ease, border-color 0.25s ease",
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Bottom flash */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:2,
        background:`linear-gradient(90deg, transparent, ${dMeta.color}, transparent)`,
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transformOrigin:"center",
        transition:"transform 0.5s cubic-bezier(.16,1,.3,1)",
        boxShadow:`0 0 12px ${dMeta.color}`,
      }}/>

      {/* Arrow */}
      <div style={{
        position:"absolute", bottom:"0.8rem", right:"0.8rem",
        width:22, height:22, borderRadius:"50%",
        border:`1.5px solid ${dMeta.color}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        color:dMeta.color,
        opacity: hovered ? 1 : 0,
        transform: hovered ? "scale(1) rotate(0deg)" : "scale(0) rotate(-90deg)",
        transition:"all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <ArrowUpRight size={10} strokeWidth={2.5}/>
      </div>
    </a>
  )
}

// ─── INFINITE STRIP ───────────────────────────────────────────────────────────
function Strip({ items, dir, speed, inView, delay = "0s" }: {
  items: typeof CHALLENGES
  dir: "left" | "right"
  speed: number
  inView: boolean
  delay?: string
}) {
  const [paused, setPaused] = useState(false)
  const triple = [...items, ...items, ...items]

  return (
    <div
      style={{
        overflow:"visible",
        WebkitMaskImage:"linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
        maskImage:"linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(28px)",
        transition:`opacity 0.8s ease ${delay}, transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}`,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{
        display:"flex",
        gap:"clamp(0.65rem,1.2vw,1rem)",
        width:"max-content",
        padding:"0.75rem 0",
        animation:`ch-${dir} ${speed}s linear infinite`,
        animationPlayState: paused ? "paused" : "running",
        willChange:"transform",
      }}>
        {triple.map((c, i) => (
          <ChallengeCard
            key={`${c.id}-${i}`}
            c={c} idx={i}
            paused={paused}
            onEnter={() => setPaused(true)}
            onLeave={() => setPaused(false)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function FrontendChallenges() {
  const { theme } = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const acc = theme.colors.accent

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.04 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const rowA = CHALLENGES.slice(0, 15)   // first 15 → right
  const rowB = CHALLENGES.slice(15)       // last 15  → left

  return (
    <section id="challenges" ref={sectionRef} style={{ position:"relative", background:"var(--color-bg-secondary)", overflow:"hidden", paddingBottom:"clamp(4rem,8vw,7rem)" }}>
      <div style={{ position:"relative", zIndex:1 }}>

        {/* Header */}
        <div style={{
          padding:"clamp(5rem,9vw,8rem) clamp(1.5rem,5vw,4rem) clamp(2rem,4vw,3rem)",
          borderBottom:"1px solid var(--color-surface-border)",
          display:"flex", flexWrap:"wrap", alignItems:"flex-end",
          justifyContent:"space-between", gap:"2rem",
        }}>
          <div>
            <div style={{
              display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1rem",
              opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(14px)",
              transition:"all 0.6s ease 0.1s",
            }}>
              <div style={{ width:24, height:1, background:acc }}/>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.6rem", letterSpacing:"0.15em", textTransform:"uppercase", color:acc }}>Frontend Mentor</span>
            </div>
            <h2 style={{
              fontFamily:"var(--font-display)",
              fontSize:"clamp(2.5rem,7vw,7rem)",
              fontWeight:800, letterSpacing:"-0.05em", lineHeight:0.88, margin:0,
              opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)",
              transition:"all 0.8s cubic-bezier(.16,1,.3,1) 0.15s",
            }}>
              <span style={{ display:"block", color:"var(--color-text-primary)" }}>30 Challenges</span>
              <span style={{ display:"block", color:"transparent", WebkitTextStroke:`2px ${acc}` }}>Completed.</span>
            </h2>
          </div>

          <div style={{
            display:"flex", flexDirection:"column", gap:"0.75rem", alignItems:"flex-end",
            opacity: inView ? 1 : 0, transition:"opacity 0.8s ease 0.3s",
          }}>
            <p style={{
              fontFamily:"var(--font-body)", fontSize:"clamp(0.78rem,1.1vw,0.88rem)",
              lineHeight:1.7, color:"var(--color-text-secondary)", maxWidth:"300px", textAlign:"right",
            }}>
              Built with React, Vue, Next.js, TypeScript, TailwindCSS, SASS and more. 
              Hover any card to explore.
            </p>
            <a href="https://github.com/brianchege2k/frontend-mentor-challenges" target="_blank" rel="noopener noreferrer"
              style={{
                display:"inline-flex", alignItems:"center", gap:"0.4rem",
                fontFamily:"var(--font-mono)", fontSize:"0.55rem",
                letterSpacing:"0.1em", textTransform:"uppercase",
                color:acc, textDecoration:"none", transition:"gap 0.2s ease",
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.gap="0.7rem"}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.gap="0.4rem"}}
            >
              View on GitHub <ArrowUpRight size={11} strokeWidth={2.5}/>
            </a>
          </div>
        </div>

        {/* Two rows */}
        <div style={{ display:"flex", flexDirection:"column", gap:"clamp(0.75rem,1.5vw,1.25rem)", paddingTop:"clamp(1.5rem,3vw,2.5rem)", overflow:"hidden" }}>
          <Strip items={rowA} dir="right" speed={60} inView={inView} delay="0.2s" />
          <Strip items={rowB} dir="left"  speed={52} inView={inView} delay="0.35s" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes ch-right { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
        @keyframes ch-left  { from{transform:translateX(-33.333%)} to{transform:translateX(0)} }
      `}</style>
    </section>
  )
}