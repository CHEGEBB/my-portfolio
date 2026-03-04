"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { useTheme } from "@/context/theme-context"

const CATEGORIES = [
  {
    name: "Frontend",
    color: "#5567F7",
    skills: [
      { name: "Next.js",   logo: "/logos/nextjs.svg"      },
      { name: "React",     logo: "/logos/react.svg"       },
      { name: "Vue.js",    logo: "/logos/vue.svg"         },
      { name: "Angular",   logo: "/logos/angular.svg"     },
      { name: "Tailwind",  logo: "/logos/tailwindcss.svg" },
    ],
  },
  {
    name: "Backend",
    color: "#45D2B0",
    skills: [
      { name: "Node.js",  logo: "/logos/nodejs.svg"  },
      { name: "Express",  logo: "/logos/express.svg" },
      { name: "Python",   logo: "/logos/python.svg"  },
    ],
  },
  {
    name: "Mobile",
    color: "#FF6B9D",
    skills: [
      { name: "Flutter",      logo: "/logos/flutter.svg"     },
      { name: "React Native", logo: "/logos/reactnative.svg" },
      { name: "Dart",         logo: "/logos/dart.svg"        },
    ],
  },
  {
    name: "Database",
    color: "#F5A623",
    skills: [
      { name: "PostgreSQL", logo: "/logos/postgresql.svg" },
      { name: "MongoDB",    logo: "/logos/mongodb.svg"    },
    ],
  },
  {
    name: "Cloud",
    color: "#00D4FF",
    skills: [
      { name: "AWS",    logo: "/logos/aws.svg"    },
      { name: "Docker", logo: "/logos/docker.svg" },
    ],
  },
  {
    name: "Language",
    color: "#AAFF00",
    skills: [
      { name: "TypeScript", logo: "/logos/typescript.svg" },
      { name: "Python",     logo: "/logos/python.svg"     },
      { name: "Dart",       logo: "/logos/dart.svg"       },
    ],
  },
  {
    name: "Tools",
    color: "#8B5CF6",
    skills: [
      { name: "Git",    logo: "/logos/git.svg"    },
      { name: "GitHub", logo: "/logos/github.svg" },
      { name: "Linux",  logo: "/logos/linux.svg"  },
      { name: "Figma",  logo: "/logos/figma.svg"  },
    ],
  },
]

function getBurstPositions(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle  = (i / count) * Math.PI * 2 - Math.PI / 2
    const radius = count <= 3 ? 130 : count <= 5 ? 150 : 170
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius }
  })
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

export function Skills() {
  const { theme }               = useTheme()
  const { ref, inView }         = useInView(0.08)
  const [revealed, setRevealed] = useState(false)
  const [active,   setActive]   = useState(0)
  const [painted,  setPainted]  = useState(false)
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null)
  const [mouse, setMouse]       = useState({ x: 0.72, y: 0.5 })
  const sectionRef              = useRef<HTMLDivElement>(null)
  const isDark = theme.mode === "dark"

  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setPainted(true),  80)
    const t2 = setTimeout(() => setRevealed(true), 200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [inView])

  // Mouse tracking for ambient glow
  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current; if (!el) return
    const r  = el.getBoundingClientRect()
    setMouse({
      x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(1, (e.clientY - r.top)  / r.height)),
    })
  }, [])

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    el.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => el.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  // Merge refs
  const setRef = useCallback((el: HTMLDivElement | null) => {
    ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = el
    ;(sectionRef as React.MutableRefObject<HTMLDivElement | null>).current = el
  }, [ref])

  const cat   = CATEGORIES[active]
  const burst = getBurstPositions(cat.skills.length)

  const paintBg        = isDark
    ? `color-mix(in srgb, ${cat.color} 16%, ${theme.colors.bgSecondary})`
    : `color-mix(in srgb, ${cat.color} 11%, ${theme.colors.bgSecondary})`
  const ambientOpacity = isDark ? "18" : "0D"
  const borderColor    = theme.colors.surfaceBorder
  const mutedColor     = theme.colors.textMuted
  const primaryColor   = theme.colors.textPrimary
  const bgColor        = theme.colors.bg

  // Mouse-driven glow position
  const gx = (mouse.x * 100).toFixed(1)
  const gy = (mouse.y * 100).toFixed(1)

  return (
    <section
      ref={setRef}
      style={{
        position: "relative",
        minHeight: "100svh",
        background: bgColor,
        overflow: "hidden",
        transition: "background .4s ease",
      }}
    >
      {/* Static ambient — shifts with category */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 70% 70% at 70% 50%, ${cat.color}${ambientOpacity} 0%, transparent 65%)`,
        transition: "background .5s ease",
      }}/>

      {/* Mouse-reactive ambient glow — same as Hero / About */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 55% 50% at ${gx}% ${gy}%, ${cat.color}${isDark ? "14" : "0A"} 0%, transparent 60%)`,
        transition: "background 0.1s ease",
      }}/>

      {isDark && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse 50% 80% at 0% 50%, ${theme.colors.accent}08 0%, transparent 60%)`,
        }}/>
      )}

      {/* ── PAINT WIPE — RIGHT to LEFT ── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: paintBg,
        transform:  painted ? "translateX(-105%)" : "translateX(100%)",
        transition: painted ? "transform 0.9s cubic-bezier(0.86,0,0.07,1)" : "none",
        willChange: "transform",
      }}>
        <div style={{
          position: "absolute",
          top: 0, right: -50, bottom: 0, width: 100,
          background: paintBg,
          clipPath: "polygon(0 0, 55% 4%, 100% 9%, 72% 19%, 100% 29%, 60% 39%, 98% 50%, 62% 60%, 100% 70%, 68% 80%, 100% 91%, 55% 96%, 0 100%)",
        }}/>
      </div>
      {/* Secondary brush */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: paintBg, opacity: 0.55,
        transform:  painted ? "translateX(-105%)" : "translateX(100%)",
        transition: painted ? "transform 1.05s cubic-bezier(0.86,0,0.07,1) 0.07s" : "none",
        willChange: "transform",
      }}>
        <div style={{
          position: "absolute",
          top: 0, right: -36, bottom: 0, width: 72,
          background: paintBg, opacity: 0.55,
          clipPath: "polygon(0 0, 60% 6%, 100% 12%, 75% 22%, 100% 34%, 65% 44%, 100% 56%, 63% 66%, 100% 76%, 70% 86%, 100% 94%, 58% 100%, 0 100%)",
        }}/>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div
        className="skills-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "100svh",
          opacity:    revealed ? 1 : 0,
          transition: "opacity .5s ease .1s",
        }}
      >

        {/* ── LEFT ── */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "clamp(5rem,10vw,8rem) clamp(1rem,4vw,3rem) clamp(3rem,6vw,5rem)",
          borderRight: `1px solid ${borderColor}`,
          position: "relative",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(.6rem,1vw,.72rem)",
            letterSpacing: ".14em", textTransform: "uppercase",
            color: theme.colors.accent,
            marginBottom: "clamp(2rem,4vw,3rem)",
            display: "flex", alignItems: "center", gap: ".5rem",
          }}>
            <span style={{ width: 20, height: "1px", background: theme.colors.accent, display: "inline-block" }}/>
            Tech Stack
          </p>

          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem,7vw,6rem)",
            fontWeight: 800, letterSpacing: "-.04em", lineHeight: .9,
            margin: "0 0 clamp(2.5rem,5vw,4rem)",
            color: primaryColor,
          }}>
            Tools I{" "}
            <span style={{
              color: "transparent",
              WebkitTextStroke: `2px ${cat.color}`,
              transition: "all .3s ease",
            }}>Master</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {CATEGORIES.map((c, i) => {
              const isActive = active === i
              return (
                <button
                  key={c.name}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  style={{
                    all: "unset", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "clamp(.75rem,1.5vw,1.1rem) 0",
                    borderBottom: `1px solid ${borderColor}`,
                    position: "relative", overflow: "hidden",
                  }}
                >
                  <div style={{
                    position: "absolute", inset: 0,
                    background: isDark
                      ? `linear-gradient(90deg, ${c.color}18 0%, transparent 60%)`
                      : `linear-gradient(90deg, ${c.color}12 0%, transparent 60%)`,
                    transform: isActive ? "translateX(0%)" : "translateX(-100%)",
                    transition: "transform .35s cubic-bezier(.16,1,.3,1)",
                    pointerEvents: "none",
                  }}/>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: isActive ? "3px" : "0px",
                    background: c.color,
                    transition: "width .25s ease",
                  }}/>
                  <div style={{
                    display: "flex", alignItems: "center",
                    gap: "clamp(.75rem,1.5vw,1.25rem)",
                    paddingLeft: "clamp(.5rem,1vw,.875rem)",
                    position: "relative", zIndex: 1,
                  }}>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(.55rem,.8vw,.65rem)",
                      color: isActive ? c.color : mutedColor,
                      letterSpacing: ".08em",
                      transition: "color .2s ease",
                      minWidth: "1.5rem",
                    }}>0{i + 1}</span>
                    <span style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.5rem,3.5vw,2.75rem)",
                      fontWeight: 800, letterSpacing: "-.03em",
                      color: isActive ? c.color : primaryColor,
                      transition: "color .25s ease, transform .25s ease",
                      transform: isActive ? "translateX(6px)" : "translateX(0)",
                    }}>{c.name}</span>
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: ".5rem",
                    position: "relative", zIndex: 1,
                    paddingRight: "clamp(.25rem,.5vw,.5rem)",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(.55rem,.75vw,.65rem)",
                      color: isActive ? c.color : mutedColor,
                      transition: "color .2s ease",
                    }}>{c.skills.length} tools</span>
                    <div style={{
                      width: "clamp(24px,3vw,32px)", height: "clamp(24px,3vw,32px)",
                      borderRadius: "50%",
                      border: `1px solid ${isActive ? c.color : borderColor}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transform: isActive ? "rotate(-45deg)" : "rotate(0)",
                      transition: "all .3s cubic-bezier(.16,1,.3,1)",
                      color: isActive ? c.color : mutedColor,
                      flexShrink: 0,
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── RIGHT: BURST ── */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "clamp(3rem,6vw,5rem)",
          position: "relative",
        }}>
          {/* Watermark */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none", overflow: "hidden",
          }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(5rem,18vw,16rem)",
              fontWeight: 800, letterSpacing: "-.05em",
              color: "transparent",
              WebkitTextStroke: isDark ? `1px ${cat.color}18` : `1px ${cat.color}22`,
              transition: "all .4s ease",
              userSelect: "none", lineHeight: 1, whiteSpace: "nowrap",
            }}>{cat.name}</span>
          </div>

          {/* Burst area */}
          <div style={{
            position: "relative",
            width: "clamp(300px,40vw,460px)", height: "clamp(300px,40vw,460px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Center pulse dot */}
            <div style={{
              position: "absolute",
              width: "clamp(10px,1.5vw,16px)", height: "clamp(10px,1.5vw,16px)",
              borderRadius: "50%",
              background: cat.color,
              boxShadow: isDark
                ? `0 0 20px ${cat.color}99, 0 0 40px ${cat.color}44`
                : `0 0 12px ${cat.color}66, 0 0 24px ${cat.color}22`,
              transition: "background .3s ease, box-shadow .3s ease",
              zIndex: 2,
              animation: "centerPulse 2s ease-in-out infinite",
            }}/>

            {/* SVG lines */}
            <svg style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              overflow: "visible", pointerEvents: "none", zIndex: 1,
            }}>
              {cat.skills.map((_, i) => {
                const pos = burst[i]
                return (
                  <line key={i}
                    x1="50%" y1="50%"
                    x2={`${50 + pos.x / 4.6}%`}
                    y2={`${50 + pos.y / 4.6}%`}
                    stroke={cat.color}
                    strokeWidth="1"
                    strokeOpacity={isDark ? "0.22" : "0.15"}
                    strokeDasharray="4 4"
                  />
                )
              })}
            </svg>

            {/* Logos */}
            {cat.skills.map((skill, i) => {
              const pos       = burst[i]
              const isHovered = hoveredSkill === i
              return (
                <div
                  key={`${cat.name}-${skill.name}-${active}`}
                  onMouseEnter={() => setHoveredSkill(i)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  style={{
                    position: "absolute",
                    left: "50%", top: "50%",
                    transform: revealed
                      ? `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${isHovered ? 1.18 : 1})`
                      : `translate(-50%,-50%) scale(0)`,
                    transition: `transform .6s cubic-bezier(.16,1,.3,1) ${i * 0.07}s, opacity .4s ease ${i * 0.07}s`,
                    opacity: revealed ? 1 : 0,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: ".4rem",
                    zIndex: isHovered ? 20 : 3,
                    cursor: "default",
                  }}
                >
                  {/* Hover tooltip */}
                  {isHovered && (
                    <div style={{
                      position: "absolute",
                      top: "-2rem",
                      background: cat.color,
                      color: isDark ? "#07070F" : "#fff",
                      fontFamily: "var(--font-mono)",
                      fontSize: ".52rem",
                      letterSpacing: ".08em",
                      padding: ".22rem .6rem",
                      borderRadius: "4px",
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                      zIndex: 30,
                      animation: "chipPop .18s cubic-bezier(.16,1,.3,1) both",
                    }}>
                      {skill.name}
                      <div style={{
                        position: "absolute",
                        bottom: -4, left: "50%",
                        transform: "translateX(-50%)",
                        width: 0, height: 0,
                        borderLeft: "4px solid transparent",
                        borderRight: "4px solid transparent",
                        borderTop: `4px solid ${cat.color}`,
                      }}/>
                    </div>
                  )}

                  <div style={{
                    width: "clamp(40px,5.5vw,64px)", height: "clamp(40px,5.5vw,64px)",
                    position: "relative",
                    filter: isHovered
                      ? `drop-shadow(0 0 16px ${cat.color}CC) brightness(1.1)`
                      : isDark
                        ? `drop-shadow(0 0 10px ${cat.color}77) brightness(1.05)`
                        : `drop-shadow(0 0 8px ${cat.color}55) brightness(0.95)`,
                    animation: `floatLogo${i % 3} ${3.5 + i * 0.4}s ease-in-out infinite`,
                    transition: "filter .22s ease",
                  }}>
                    <Image src={skill.logo} alt={skill.name} fill style={{ objectFit: "contain" }} sizes="64px"/>
                  </div>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(.5rem,.7vw,.65rem)",
                    letterSpacing: ".08em",
                    color: cat.color,
                    whiteSpace: "nowrap",
                    opacity: isHovered ? 1 : isDark ? .85 : .75,
                    transition: "opacity .2s ease",
                    textShadow: isDark ? "none" : `0 1px 3px ${theme.colors.bg}CC`,
                  }}>{skill.name}</span>
                </div>
              )
            })}
          </div>

          <p style={{
            position: "absolute",
            bottom: "clamp(2rem,4vw,3rem)",
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(.55rem,.75vw,.65rem)",
            letterSpacing: ".1em", textTransform: "uppercase",
            color: mutedColor,
            opacity: .4,
          }}>← Hover a category</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes centerPulse {
          0%,100% { transform: scale(1);   opacity: 1; }
          50%      { transform: scale(1.6); opacity: .6; }
        }
        @keyframes floatLogo0 {
          0%,100% { transform: translateY(0px);  } 50% { transform: translateY(-8px); }
        }
        @keyframes floatLogo1 {
          0%,100% { transform: translateY(0px);  } 50% { transform: translateY(8px);  }
        }
        @keyframes floatLogo2 {
          0%,100% { transform: translateY(-4px); } 50% { transform: translateY(4px);  }
        }
        @keyframes chipPop {
          from { opacity: 0; transform: translateX(-50%) translateY(4px) scale(.88); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)   scale(1);   }
        }
        @media (max-width: 768px) {
          .skills-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}