"use client"

import { useRef, useEffect, useState } from "react"
import { useTheme } from "@/context/theme-context"
import { motion, useInView } from "framer-motion"

const METRICS = [
  { label: "Projects Shipped",     value: 20,   suffix: "+",  color: "#5567F7", unit: "total"    },
  { label: "Companies Served",     value: 7,    suffix: "+",  color: "#45D2B0", unit: "orgs"     },
  { label: "Years Experience",     value: 3,    suffix: "+",  color: "#FF6B9D", unit: "yrs"      },
  { label: "Play Store Downloads", value: 1000, suffix: "+",  color: "#00D4FF", unit: "users"    },
  { label: "CTO Roles Held",       value: 2,    suffix: "×",  color: "#AAFF00", unit: "startups" },
  { label: "Certifications",       value: 6,    suffix: "",   color: "#F5A623", unit: "issued"   },
  { label: "Avg Sprint Cycle",     value: 7,    suffix: "d",  color: "#8B5CF6", unit: "agile"    },
  { label: "Code Uptime Target",   value: 99.9, suffix: "%",  color: "#EC4899", unit: "SLA"      },
]

const COMPANIES = [
  { name: "Softrinx",         role: "Co-Founder & CTO",     period: "2025–",    color: "#5567F7" },
  { name: "Teach2Give",       role: "Full-Stack Developer",  period: "2025",     color: "#45D2B0" },
  { name: "HealthMaster",     role: "Co-Founder & CTO",     period: "2024–26",  color: "#FF6B9D" },
  { name: "Power Learn",      role: "Mobile Intern",         period: "2025",     color: "#00D4FF" },
  { name: "Prodigy InfoTech", role: "MERN Developer",        period: "2024",     color: "#AAFF00" },
  { name: "Codsoft",          role: "Full-Stack Intern",     period: "2024",     color: "#F5A623" },
  { name: "ALX Africa",       role: "Software Engineer",     period: "2023–24",  color: "#8B5CF6" },
]

// Animated counter hook
function useCounter(target: number, trigger: boolean, duration = 1400) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!trigger) return
    const startTime = performance.now()
    const isDecimal = target % 1 !== 0

    const tick = (now: number) => {
      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = isDecimal
        ? Math.round(target * eased * 10) / 10
        : Math.round(target * eased)
      setValue(current)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [trigger, target, duration])

  return value
}

// Sparkline — tiny live-looking chart bar
function Sparkline({ color, active }: { color: string; active: boolean }) {
  const bars = [0.3, 0.6, 0.4, 0.8, 0.5, 0.9, 0.7, 1.0, 0.75, 0.85, 0.6, 0.95]
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 24 }}>
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={active ? { height: `${h * 100}%` } : { height: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4, ease: "backOut" }}
          style={{
            width: 3, background: color,
            opacity: 0.6 + h * 0.4,
            borderRadius: 1,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  )
}

function MetricCard({ m, index, inView }: {
  m: typeof METRICS[0]; index: number; inView: boolean
}) {
  const triggered = inView
  const count = useCounter(m.value, triggered, 1200 + index * 100)
  const { theme } = useTheme()
  const isDark = theme.mode === "dark"
  const [hover, setHover] = useState(false)

  return (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: "clamp(1.25rem,2vw,1.75rem)",
        border: `1px solid ${hover ? m.color + "55" : (isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)")}`,
        background: hover ? `${m.color}0a` : "var(--color-bg)",
        position: "relative", overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      {/* Top accent line */}
      <motion.div
        animate={{ width: inView ? "50%" : 0 }}
        transition={{ delay: index * 0.07 + 0.3, duration: 0.6 }}
        style={{
          position: "absolute", top: 0, left: 0, height: 1,
          background: `linear-gradient(90deg, ${m.color}, transparent)`,
        }}
      />

      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "0.46rem",
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: m.color, marginBottom: "0.75rem", opacity: 0.75,
      }}>{m.label}</div>

      <div style={{
        display: "flex", alignItems: "baseline", gap: "0.35rem",
        marginBottom: "0.75rem",
      }}>
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem,4vw,3rem)",
          fontWeight: 800, letterSpacing: "-0.05em",
          color: m.color, lineHeight: 1,
        }}>{count}{m.suffix}</span>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.44rem",
          letterSpacing: "0.1em", color: "var(--color-text-muted)", opacity: 0.5,
        }}>{m.unit}</span>
      </div>

      <Sparkline color={m.color} active={inView} />
    </motion.div>
  )
}

export function ProcessSignals() {
  const { theme }  = useTheme()
  const ref        = useRef<HTMLDivElement>(null)
  const inView     = useInView(ref, { once: true, margin: "-8%" })
  const isDark     = theme.mode === "dark"
  const acc        = theme.colors.accent

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "var(--color-bg)",
        padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,4rem)",
        overflow: "hidden",
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      }}
    >
      {/* Grid dot background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"} 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: "2rem",
          marginBottom: "clamp(3rem,6vw,5rem)",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              marginBottom: "0.875rem",
            }}>
              <div style={{ width: 20, height: "1px", background: acc }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.58rem",
                letterSpacing: "0.16em", textTransform: "uppercase", color: acc,
              }}>Live Metrics</span>
              <div style={{
                width: 6, height: 6, borderRadius: "50%", background: "#22c55e",
                animation: "liveGreen 2s ease-in-out infinite",
              }} />
            </div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem,7vw,6rem)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9, margin: 0,
            }}>
              <span style={{ color: "var(--color-text-primary)" }}>The</span>{" "}
              <span style={{ color: "transparent", WebkitTextStroke: `2px ${acc}` }}>Numbers.</span>
            </h2>
          </motion.div>
        </div>

        {/* Metrics grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(160px,20vw,240px), 1fr))",
          gap: "1px",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
          marginBottom: "clamp(3rem,6vw,5rem)",
          overflow: "hidden",
        }}>
          {METRICS.map((m, i) => (
            <MetricCard key={m.label} m={m} index={i} inView={inView} />
          ))}
        </div>

        {/* Company log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "0.52rem",
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: acc, marginBottom: "1.25rem", opacity: 0.75,
          }}>Organisation Log</div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {COMPANIES.map((co, i) => (
              <motion.div
                key={co.name}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.07 + 0.6 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  alignItems: "center",
                  gap: "clamp(0.75rem,2vw,2rem)",
                  padding: "0.75rem 0",
                  borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%", background: co.color,
                    boxShadow: `0 0 6px ${co.color}88`, flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(0.85rem,1.3vw,1.05rem)",
                    fontWeight: 700, letterSpacing: "-0.02em",
                    color: "var(--color-text-primary)",
                  }}>{co.name}</span>
                </div>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                  letterSpacing: "0.06em", color: "var(--color-text-muted)",
                  whiteSpace: "nowrap",
                }}>{co.role}</span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.48rem",
                  letterSpacing: "0.08em", color: co.color, opacity: 0.7,
                  whiteSpace: "nowrap",
                }}>{co.period}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes liveGreen {
          0%, 100% { opacity: 1; transform: scale(1);   }
          50%       { opacity: 0.4; transform: scale(1.5); }
        }
      `}</style>
    </section>
  )
}