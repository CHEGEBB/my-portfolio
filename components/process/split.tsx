"use client"

import { useRef, useState } from "react"
import { useTheme } from "@/context/theme-context"
import { motion, useInView } from "framer-motion"
import { CheckCircle2, XCircle } from "lucide-react"

const YOU_HANDLE = [
  "Business strategy & vision",
  "Domain expertise & industry knowledge",
  "Content, copy, and brand voice",
  "User research and customer feedback",
  "Final sign-off on design direction",
  "Budget and timeline decisions",
  "Marketing and go-to-market",
]

const I_HANDLE = [
  "Full technical architecture",
  "Frontend & backend development",
  "Database design and optimisation",
  "Cloud infrastructure & DevOps",
  "Security hardening",
  "Performance optimisation",
  "Testing, QA and deployment",
  "Post-launch technical support",
]

export function ProcessSplit() {
  const { theme }  = useTheme()
  const ref        = useRef<HTMLDivElement>(null)
  const inView     = useInView(ref, { once: true, margin: "-10%" })
  const [split,    setSplit]    = useState(50) // percentage
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  const onDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const pct = Math.max(25, Math.min(75, ((clientX - rect.left) / rect.width) * 100))
    setSplit(pct)
  }

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: isDark ? "#07070F" : "#F0F0FA",
        overflow: "hidden",
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      }}
    >
      {/* Ambient */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${acc}08 0%, transparent 65%)`,
      }} />

      {/* Header */}
      <div style={{
        padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem) clamp(2rem,4vw,3rem)",
        textAlign: "center", position: "relative", zIndex: 2,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.6rem",
            marginBottom: "0.875rem",
          }}>
            <div style={{ width: 20, height: "1px", background: acc }} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.58rem",
              letterSpacing: "0.16em", textTransform: "uppercase", color: acc,
            }}>Division of Responsibility</span>
            <div style={{ width: 20, height: "1px", background: acc }} />
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem,5.5vw,5rem)",
            fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9, margin: 0,
          }}>
            <span style={{ color: "var(--color-text-primary)" }}>You focus on </span>
            <span style={{ color: "transparent", WebkitTextStroke: `2px ${acc}` }}>the business.</span>
            <br />
            <span style={{ color: "var(--color-text-primary)" }}>I handle </span>
            <span style={{ color: acc }}>everything technical.</span>
          </h2>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "0.52rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "var(--color-text-muted)", marginTop: "1rem",
            opacity: 0.55,
          }}>↔ Drag the divider</p>
        </motion.div>
      </div>

      {/* Draggable split panel */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onMouseMove={dragging ? onDrag : undefined}
        onTouchMove={dragging ? onDrag : undefined}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchEnd={() => setDragging(false)}
        style={{
          position: "relative",
          margin: "0 clamp(1.5rem,6vw,5rem) clamp(4rem,8vw,7rem)",
          height: "clamp(400px,55vh,600px)",
          display: "flex",
          overflow: "hidden",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          cursor: dragging ? "col-resize" : "default",
          userSelect: "none",
        }}
      >
        {/* YOU panel */}
        <div style={{
          width: `${split}%`,
          flexShrink: 0,
          background: isDark ? "rgba(85,103,247,0.06)" : "rgba(85,103,247,0.04)",
          padding: "clamp(1.5rem,3vw,2.5rem)",
          overflow: "hidden",
          transition: dragging ? "none" : "width 0.05s",
          borderRight: "none",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, #5567F7, transparent)",
          }} />
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "0.5rem",
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "#5567F7", marginBottom: "1.25rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#5567F7" }} />
            You Handle
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {YOU_HANDLE.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.06 + 0.4 }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "0.5rem",
                }}
              >
                <CheckCircle2 size={13} strokeWidth={2}
                  color="#5567F7" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.72rem,1vw,0.85rem)",
                  color: "var(--color-text-muted)", lineHeight: 1.5,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* DRAG HANDLE */}
        <div
          onMouseDown={() => setDragging(true)}
          onTouchStart={() => setDragging(true)}
          style={{
            position: "absolute",
            left: `calc(${split}% - 16px)`,
            top: 0, bottom: 0,
            width: 32,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            cursor: "col-resize",
            zIndex: 10,
            transition: dragging ? "none" : "left 0.05s",
          }}
        >
          {/* The line */}
          <div style={{
            position: "absolute", top: 0, bottom: 0,
            left: "50%", transform: "translateX(-50%)",
            width: dragging ? 2 : 1,
            background: acc,
            boxShadow: dragging ? `0 0 12px ${acc}` : "none",
            transition: "all 0.2s ease",
          }} />
          {/* Pill grip */}
          <div style={{
            width: 32, height: 64,
            borderRadius: 16,
            background: acc,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 4,
            boxShadow: `0 0 24px ${acc}66`,
            transform: dragging ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.2s ease",
            zIndex: 1,
          }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 12, height: 1.5,
                background: "rgba(0,0,0,0.6)",
                borderRadius: 1,
              }} />
            ))}
          </div>
        </div>

        {/* I HANDLE panel */}
        <div style={{
          flex: 1,
          background: isDark ? `rgba(255,255,255,0.02)` : `rgba(0,0,0,0.02)`,
          padding: "clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,3vw,2.5rem) clamp(2rem,4vw,3rem)",
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, ${acc}, transparent)`,
          }} />
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "0.5rem",
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: acc, marginBottom: "1.25rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%", background: acc,
              animation: "splitDot 2s ease-in-out infinite",
            }} />
            Brian Handles
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {I_HANDLE.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.06 + 0.5 }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "0.5rem",
                }}
              >
                <div style={{
                  width: 13, height: 13, flexShrink: 0, marginTop: 2,
                  border: `1.5px solid ${acc}`,
                  background: `${acc}14`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ width: 5, height: 5, background: acc }} />
                </div>
                <span style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.72rem,1vw,0.85rem)",
                  color: "var(--color-text-muted)", lineHeight: 1.5,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes splitDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.5); }
        }
      `}</style>
    </section>
  )
}