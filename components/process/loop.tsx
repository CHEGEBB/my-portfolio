"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/context/theme-context"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { MessageSquare, Compass, Code2, Rocket, RefreshCw } from "lucide-react"

const PHASES = [
  {
    id: 0, label: "Discover",    icon: MessageSquare,
    color: "#5567F7", duration: "Day 1",
    desc: "One call. I listen more than I talk. I understand the problem, not just the spec.",
    angle: 270, // top
  },
  {
    id: 1, label: "Architect",   icon: Compass,
    color: "#45D2B0", duration: "Days 2–4",
    desc: "Blueprint before bricks. Stack, structure, timeline, costs. You see the plan before code.",
    angle: 342, // top-right
  },
  {
    id: 2, label: "Build",       icon: Code2,
    color: "#FF6B9D", duration: "Weeks 1–N",
    desc: "Agile sprints. Working previews weekly. Feedback loops tight. Changes welcome early.",
    angle: 54,  // right
  },
  {
    id: 3, label: "Ship",        icon: Rocket,
    color: "#AAFF00", duration: "Final week",
    desc: "CI/CD pipeline, containers, zero-downtime. Your product lands without drama.",
    angle: 126, // bottom-right
  },
  {
    id: 4, label: "Improve",     icon: RefreshCw,
    color: "#F5A623", duration: "Ongoing",
    desc: "Post-launch support, monitoring, iteration. Software is never done — it evolves.",
    angle: 198, // bottom-left
  },
]

const R = 130 // orbit radius

function toXY(angle: number, r: number = R) {
  const rad = (angle * Math.PI) / 180
  return { x: Math.cos(rad) * r, y: Math.sin(rad) * r }
}

export function ProcessLoop() {
  const { theme }   = useTheme()
  const ref         = useRef<HTMLDivElement>(null)
  const inView      = useInView(ref, { once: false, margin: "-15%" })
  const [active, setActive] = useState(0)
  const [auto,   setAuto]   = useState(true)
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  // Auto-cycle
  useEffect(() => {
    if (!auto || !inView) return
    const t = setInterval(() => {
      setActive(a => (a + 1) % PHASES.length)
    }, 2800)
    return () => clearInterval(t)
  }, [auto, inView])

  const activePhase = PHASES[active]
  const cx = 160, cy = 160 // SVG centre

  return (
    <section ref={ref} style={{
      position: "relative",
      background: "var(--color-bg)",
      padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,4rem)",
      overflow: "hidden",
      borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
    }}>
      {/* Ambient */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${activePhase.color}0e 0%, transparent 65%)`,
        transition: "background 0.8s ease",
      }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "clamp(3rem,6vw,5rem)",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.6rem",
              marginBottom: "0.875rem",
            }}>
              <div style={{ width: 20, height: "1px", background: acc }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.58rem",
                letterSpacing: "0.16em", textTransform: "uppercase", color: acc,
              }}>The Build Loop</span>
              <div style={{ width: 20, height: "1px", background: acc }} />
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem,5.5vw,5rem)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9, margin: 0,
            }}>
              <span style={{ color: "var(--color-text-primary)" }}>Not steps.</span>{" "}
              <span style={{ color: "transparent", WebkitTextStroke: `2px ${acc}` }}>A cycle.</span>
            </h2>
          </motion.div>
        </div>

        {/* Main interactive loop */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr clamp(260px,40vw,420px) 1fr",
          alignItems: "center",
          gap: "clamp(1rem,3vw,3rem)",
        }}>
          {/* Left detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ textAlign: "right" }}
            >
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: activePhase.color, marginBottom: "0.5rem",
              }}>Phase {activePhase.id + 1} of {PHASES.length}</div>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem,3vw,2.5rem)",
                fontWeight: 800, letterSpacing: "-0.04em",
                color: activePhase.color, lineHeight: 1,
                marginBottom: "0.75rem",
              }}>{activePhase.label}</div>
              <div style={{
                display: "inline-block",
                fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                letterSpacing: "0.1em",
                color: activePhase.color,
                border: `1px solid ${activePhase.color}44`,
                background: `${activePhase.color}0d`,
                padding: "0.2rem 0.6rem",
                marginBottom: "1rem",
              }}>{activePhase.duration}</div>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.78rem,1vw,0.9rem)",
                color: "var(--color-text-muted)", lineHeight: 1.7,
                margin: 0,
              }}>{activePhase.desc}</p>
            </motion.div>
          </AnimatePresence>

          {/* Central SVG orbit */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg
              viewBox="0 0 320 320"
              width="100%"
              style={{ maxWidth: 420, overflow: "visible" }}
            >
              {/* Orbit ring */}
              <circle
                cx={cx} cy={cy} r={R}
                fill="none"
                stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
                strokeWidth="1"
              />

              {/* Animated ring sweep */}
              {inView && (
                <circle
                  cx={cx} cy={cy} r={R}
                  fill="none"
                  stroke={activePhase.color}
                  strokeWidth="1.5"
                  strokeDasharray={`${2 * Math.PI * R}`}
                  strokeDashoffset={`${2 * Math.PI * R * (1 - (active + 1) / PHASES.length)}`}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${cx} ${cy})`}
                  style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.5s ease" }}
                />
              )}

              {/* Connector lines */}
              {PHASES.map((phase, i) => {
                const next = PHASES[(i + 1) % PHASES.length]
                const from = toXY(phase.angle)
                const to   = toXY(next.angle)
                const isActive = i === active || (i + 1) % PHASES.length === active
                return (
                  <line
                    key={i}
                    x1={cx + from.x} y1={cy + from.y}
                    x2={cx + to.x}   y2={cy + to.y}
                    stroke={isActive ? activePhase.color : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)")}
                    strokeWidth={isActive ? 1 : 0.5}
                    strokeDasharray={isActive ? "none" : "4 4"}
                    style={{ transition: "all 0.5s ease" }}
                  />
                )
              })}

              {/* Phase nodes */}
              {PHASES.map((phase) => {
                const pos  = toXY(phase.angle)
                const Icon = phase.icon
                const isActive = phase.id === active
                return (
                  <g
                    key={phase.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => { setActive(phase.id); setAuto(false) }}
                  >
                    {/* Outer glow ring */}
                    <circle
                      cx={cx + pos.x} cy={cy + pos.y}
                      r={isActive ? 28 : 20}
                      fill={`${phase.color}${isActive ? "22" : "0a"}`}
                      stroke={phase.color}
                      strokeWidth={isActive ? 1.5 : 0.75}
                      style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
                    />
                    {/* Inner fill */}
                    <circle
                      cx={cx + pos.x} cy={cy + pos.y}
                      r={isActive ? 16 : 11}
                      fill={isActive ? phase.color : `${phase.color}22`}
                      style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
                    />
                    {/* Pulse ring when active */}
                    {isActive && (
                      <circle
                        cx={cx + pos.x} cy={cy + pos.y}
                        r="36"
                        fill="none"
                        stroke={phase.color}
                        strokeWidth="0.75"
                        opacity="0.4"
                        style={{ animation: "nodeRing 1.8s ease-out infinite" }}
                      />
                    )}
                    {/* Label */}
                    <text
                      x={cx + pos.x}
                      y={cy + pos.y + (pos.y > 0 ? 46 : -36)}
                      textAnchor="middle"
                      fill={isActive ? phase.color : (isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)")}
                      fontSize="9"
                      fontFamily="var(--font-mono)"
                      letterSpacing="1"
                      style={{ transition: "fill 0.3s ease", textTransform: "uppercase" }}
                    >{phase.label.toUpperCase()}</text>
                  </g>
                )
              })}

              {/* Centre label */}
              <text x={cx} y={cy - 8} textAnchor="middle"
                fill={activePhase.color} fontSize="11"
                fontFamily="var(--font-mono)" letterSpacing="1"
                style={{ transition: "fill 0.4s ease" }}
              >BUILD</text>
              <text x={cx} y={cy + 8} textAnchor="middle"
                fill={activePhase.color} fontSize="11"
                fontFamily="var(--font-mono)" letterSpacing="1"
                style={{ transition: "fill 0.4s ease" }}
              >LOOP</text>
            </svg>
          </div>

          {/* Right: phase list */}
          <div style={{
            display: "flex", flexDirection: "column", gap: "0.6rem",
          }}>
            {PHASES.map((phase) => {
              const Icon = phase.icon
              const isActive = phase.id === active
              return (
                <motion.button
                  key={phase.id}
                  onClick={() => { setActive(phase.id); setAuto(false) }}
                  whileHover={{ x: 4 }}
                  style={{
                    all: "unset", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.6rem 0.875rem",
                    border: `1px solid ${isActive ? phase.color + "66" : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)")}`,
                    background: isActive ? `${phase.color}0e` : "transparent",
                    transition: "all 0.25s ease",
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {/* Left accent bar */}
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: isActive ? 3 : 0,
                    background: phase.color,
                    transition: "width 0.25s ease",
                  }} />
                  <Icon
                    size={14} strokeWidth={1.75}
                    color={isActive ? phase.color : (isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)")}
                    style={{ transition: "color 0.25s ease", flexShrink: 0 }}
                  />
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.58rem",
                    letterSpacing: "0.06em", fontWeight: isActive ? 600 : 400,
                    color: isActive ? phase.color : "var(--color-text-muted)",
                    transition: "color 0.25s ease",
                  }}>{phase.label}</span>
                  <span style={{
                    marginLeft: "auto",
                    fontFamily: "var(--font-mono)", fontSize: "0.44rem",
                    letterSpacing: "0.08em", color: "var(--color-text-muted)", opacity: 0.5,
                  }}>{phase.duration}</span>
                </motion.button>
              )
            })}

            {/* Resume auto */}
            {!auto && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setAuto(true)}
                style={{
                  all: "unset", cursor: "pointer", marginTop: "0.25rem",
                  fontFamily: "var(--font-mono)", fontSize: "0.46rem",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: acc, opacity: 0.6,
                  display: "flex", alignItems: "center", gap: "0.35rem",
                }}
              >
                <RefreshCw size={10} strokeWidth={2} /> resume auto-cycle
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes nodeRing {
          0%   { r: 28; opacity: 0.5; }
          100% { r: 52; opacity: 0; }
        }
        @media (max-width: 768px) {
          .loop-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}