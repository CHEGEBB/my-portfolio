"use client"

import { useRef, useState } from "react"
import { useTheme } from "@/context/theme-context"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Send, Zap, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"

const PROJECT_TYPES = [
  "Web Application",
  "Mobile App",
  "AI Integration",
  "Cloud / DevOps",
  "UI/UX Design",
  "CTO Engagement",
  "Security Audit",
  "Something else",
]

const BUDGET_RANGES = [
  "< $1,000",
  "$1,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000+",
  "Let's discuss",
]

export function ProcessFire() {
  const { theme }    = useTheme()
  const ref          = useRef<HTMLDivElement>(null)
  const inView       = useInView(ref, { once: true, margin: "-10%" })
  const [type,       setType]    = useState<string | null>(null)
  const [budget,     setBudget]  = useState<string | null>(null)
  const [name,       setName]    = useState("")
  const [email,      setEmail]   = useState("")
  const [desc,       setDesc]    = useState("")
  const [sent,       setSent]    = useState(false)
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  const canSubmit = type && budget && name && email

  const handleSubmit = () => {
    if (!canSubmit) return
    // Construct mailto
    const subject = encodeURIComponent(`Project Brief: ${type}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nProject Type: ${type}\nBudget: ${budget}\n\nDescription:\n${desc}`
    )
    window.open(`mailto:chegephil24@gmail.com?subject=${subject}&body=${body}`)
    setSent(true)
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
      {/* Large accent glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "70vw", height: "50vw",
        borderRadius: "50%",
        background: `radial-gradient(ellipse, ${acc}12 0%, transparent 65%)`,
        pointerEvents: "none",
        animation: "fireGlow 4s ease-in-out infinite",
      }} />

      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `repeating-linear-gradient(
          0deg, transparent, transparent 3px,
          ${isDark ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.02)"} 3px,
          ${isDark ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.02)"} 4px
        )`,
      }} />

      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 820,
        margin: "0 auto",
        padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,3rem)",
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "clamp(3rem,6vw,5rem)" }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: "0.6rem",
            marginBottom: "1rem",
          }}>
            <Zap size={14} strokeWidth={2} color={acc} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.58rem",
              letterSpacing: "0.18em", textTransform: "uppercase", color: acc,
            }}>Fire the Brief</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem,10vw,9rem)",
            fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 0.85,
            margin: "0 0 1.25rem",
          }}>
            <span style={{ display: "block", color: "var(--color-text-primary)" }}>Tell me</span>
            <span style={{
              display: "block", color: "transparent",
              WebkitTextStroke: `3px ${acc}`,
              textShadow: `0 0 80px ${acc}55`,
            }}>what you're</span>
            <span style={{ display: "block", color: "var(--color-text-primary)" }}>building.</span>
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.875rem,1.3vw,1.05rem)",
            color: "var(--color-text-muted)", lineHeight: 1.7,
            maxWidth: 480,
          }}>
            No lengthy forms. Tell me what you need and I'll reply within 24 hours with a plan.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: "flex", flexDirection: "column", gap: "clamp(1.5rem,3vw,2.5rem)" }}
            >
              {/* Step 1: Project type */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.52rem",
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: acc, marginBottom: "0.875rem",
                }}>01 — What are you building?</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {PROJECT_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => setType(type === t ? null : t)}
                      style={{
                        all: "unset", cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(0.75rem,1.1vw,0.875rem)",
                        fontWeight: type === t ? 600 : 400,
                        padding: "0.55rem 1.1rem",
                        border: `1.5px solid ${type === t ? acc : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)")}`,
                        background: type === t ? `${acc}18` : "transparent",
                        color: type === t ? acc : "var(--color-text-muted)",
                        transition: "all 0.2s ease",
                      }}
                    >{t}</button>
                  ))}
                </div>
              </motion.div>

              {/* Step 2: Budget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.52rem",
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: acc, marginBottom: "0.875rem",
                }}>02 — Budget range</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {BUDGET_RANGES.map(b => (
                    <button
                      key={b}
                      onClick={() => setBudget(budget === b ? null : b)}
                      style={{
                        all: "unset", cursor: "pointer",
                        fontFamily: "var(--font-mono)",
                        fontSize: "clamp(0.6rem,1vw,0.72rem)",
                        letterSpacing: "0.04em",
                        padding: "0.5rem 1rem",
                        border: `1.5px solid ${budget === b ? acc : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)")}`,
                        background: budget === b ? `${acc}18` : "transparent",
                        color: budget === b ? acc : "var(--color-text-muted)",
                        transition: "all 0.2s ease",
                      }}
                    >{b}</button>
                  ))}
                </div>
              </motion.div>

              {/* Step 3: Name + Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}
              >
                {[
                  { label: "03 — Your name", val: name, set: setName, ph: "e.g. Sarah Wanjiru" },
                  { label: "04 — Your email", val: email, set: setEmail, ph: "you@company.com" },
                ].map(({ label, val, set, ph }) => (
                  <div key={label}>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: "0.52rem",
                      letterSpacing: "0.14em", textTransform: "uppercase",
                      color: acc, marginBottom: "0.5rem",
                    }}>{label}</div>
                    <input
                      value={val}
                      onChange={e => set(e.target.value)}
                      placeholder={ph}
                      style={{
                        width: "100%", boxSizing: "border-box",
                        background: "transparent",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                        borderBottom: `1px solid ${val ? acc : (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)")}`,
                        outline: "none",
                        padding: "0.7rem 0.875rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(0.82rem,1.1vw,0.9rem)",
                        color: "var(--color-text-primary)",
                        transition: "border-color 0.2s ease",
                      }}
                    />
                  </div>
                ))}
              </motion.div>

              {/* Step 5: Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.52rem",
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: acc, marginBottom: "0.5rem",
                }}>05 — Tell me more (optional)</div>
                <textarea
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Brief description of the project, timeline, special requirements..."
                  rows={4}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "transparent",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    outline: "none", resize: "vertical",
                    padding: "0.7rem 0.875rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(0.82rem,1.1vw,0.9rem)",
                    color: "var(--color-text-primary)",
                    lineHeight: 1.65,
                    caretColor: acc,
                  }}
                />
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
                style={{
                  display: "flex", alignItems: "center",
                  gap: "1rem", flexWrap: "wrap",
                }}
              >
                <motion.button
                  onClick={handleSubmit}
                  whileHover={canSubmit ? { scale: 1.04 } : {}}
                  whileTap={canSubmit ? { scale: 0.97 } : {}}
                  style={{
                    all: "unset", cursor: canSubmit ? "pointer" : "not-allowed",
                    display: "inline-flex", alignItems: "center", gap: "0.6rem",
                    fontFamily: "var(--font-body)", fontSize: "0.95rem",
                    fontWeight: 700, letterSpacing: "0.01em",
                    color: canSubmit ? "var(--color-accent-fg)" : "var(--color-text-muted)",
                    background: canSubmit ? acc : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"),
                    padding: "0.875rem 2rem",
                    borderRadius: "9999px",
                    boxShadow: canSubmit ? `0 0 40px ${acc}55` : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Send size={15} strokeWidth={2} />
                  Fire the Brief
                </motion.button>

                <div style={{
                  display: "flex", gap: "0.75rem",
                }}>
                  <a href="mailto:chegephil24@gmail.com" style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    fontFamily: "var(--font-mono)", fontSize: "0.52rem",
                    letterSpacing: "0.08em", color: "var(--color-text-muted)",
                    textDecoration: "none",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                    padding: "0.5rem 0.875rem", borderRadius: "9999px",
                    transition: "all 0.2s ease",
                  }}>
                    <Mail size={11} strokeWidth={2} /> Email directly
                  </a>
                  <a href="https://wa.me/254796562713" target="_blank" rel="noopener noreferrer" style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    fontFamily: "var(--font-mono)", fontSize: "0.52rem",
                    letterSpacing: "0.08em", color: "#25D366",
                    textDecoration: "none",
                    border: "1px solid #25D36633",
                    background: "rgba(37,211,102,0.06)",
                    padding: "0.5rem 0.875rem", borderRadius: "9999px",
                  }}>
                    <MessageCircle size={11} strokeWidth={2} /> WhatsApp
                  </a>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                textAlign: "center",
                padding: "clamp(3rem,6vw,5rem)",
                border: `1px solid ${acc}44`,
                background: `${acc}08`,
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚡</div>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem,5vw,4rem)",
                fontWeight: 800, letterSpacing: "-0.04em",
                color: acc, margin: "0 0 1rem",
              }}>Brief fired.</h3>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.875rem,1.3vw,1.05rem)",
                color: "var(--color-text-muted)", lineHeight: 1.7,
                maxWidth: 400, margin: "0 auto",
              }}>
                Your brief just landed in my inbox. I'll respond within 24 hours with a clear plan.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes fireGlow {
          0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1);    }
          50%       { opacity: 1;   transform: translate(-50%, -50%) scale(1.08); }
        }
      `}</style>
    </section>
  )
}