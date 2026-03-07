"use client"

import { useRef, useEffect, useState } from "react"
import { useTheme } from "@/context/theme-context"
import { motion, useInView, useScroll, useTransform } from "framer-motion"

const PRINCIPLES = [
  {
    num: "P.01",
    title: "Clarity over cleverness.",
    body: "I write code that a junior can read in six months. Clever code is a liability. Clear code is an asset.",
    color: "#5567F7",
  },
  {
    num: "P.02",
    title: "Communicate relentlessly.",
    body: "Silent developers are dangerous. I send updates before you ask. Bad news travels faster than good news — and that's right.",
    color: "#45D2B0",
  },
  {
    num: "P.03",
    title: "Own the outcome.",
    body: "I don't hand off broken things and call it done. If it's under my name, it works. If it doesn't, I fix it.",
    color: "#FF6B9D",
  },
  {
    num: "P.04",
    title: "Architecture before aesthetics.",
    body: "A beautiful UI on a broken backend is a lie. I design the foundation first, then make it beautiful.",
    color: "#AAFF00",
  },
  {
    num: "P.05",
    title: "Speed is a feature.",
    body: "Performance isn't an afterthought. Every unnecessary kilobyte, every extra render, is a tax on your users.",
    color: "#F5A623",
  },
]

// Oscilloscope wave canvas per principle
function WaveCanvas({ color, active, amplitude = 18 }: {
  color: string; active: boolean; amplitude?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let t = 0

    const draw = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      canvas.width  = W
      canvas.height = H
      ctx.clearRect(0, 0, W, H)

      const amp   = active ? amplitude : amplitude * 0.2
      const freq  = active ? 0.018    : 0.012
      const speed = active ? 0.06     : 0.02

      // Gradient stroke
      const grad = ctx.createLinearGradient(0, 0, W, 0)
      const hex  = color
      grad.addColorStop(0,   `${hex}00`)
      grad.addColorStop(0.2, `${hex}${active ? "cc" : "33"}`)
      grad.addColorStop(0.8, `${hex}${active ? "cc" : "33"}`)
      grad.addColorStop(1,   `${hex}00`)

      ctx.beginPath()
      ctx.strokeStyle = grad
      ctx.lineWidth   = active ? 1.5 : 0.75
      ctx.shadowColor = color
      ctx.shadowBlur  = active ? 8 : 0

      for (let x = 0; x <= W; x += 1) {
        const y = H / 2 + Math.sin(x * freq + t) * amp * Math.sin(x * 0.005)
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      t += speed
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => cancelAnimationFrame(rafRef.current)
  }, [color, active, amplitude])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        opacity: active ? 0.9 : 0.35,
        transition: "opacity 0.5s ease",
      }}
    />
  )
}

function PrincipleRow({ p, index }: { p: typeof PRINCIPLES[0]; index: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-20%", once: false })
  const { theme } = useTheme()
  const isDark = theme.mode === "dark"

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0.35 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "relative",
        padding: "clamp(2rem,4vw,3.5rem) clamp(1.5rem,6vw,5rem)",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        overflow: "hidden",
        minHeight: 120,
        display: "grid",
        gridTemplateColumns: "clamp(2.5rem,5vw,4rem) 1fr clamp(160px,25vw,340px)",
        gap: "clamp(1rem,3vw,3rem)",
        alignItems: "center",
      }}
    >
      {/* Oscilloscope wave behind */}
      <WaveCanvas color={p.color} active={inView} />

      {/* Subtle bg when active */}
      <motion.div
        animate={inView
          ? { opacity: 1, background: isDark ? `${p.color}09` : `${p.color}06` }
          : { opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />

      {/* Left accent bar */}
      <motion.div
        animate={{ height: inView ? "100%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute", left: 0, top: 0,
          width: 2, background: p.color,
          transformOrigin: "top",
        }}
      />

      {/* Number */}
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "0.5rem",
        letterSpacing: "0.14em", color: p.color, opacity: 0.7,
        position: "relative", zIndex: 2,
      }}>{p.num}</div>

      {/* Title */}
      <motion.h3
        initial={{ x: -30, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : { x: -30, opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.5rem,3.5vw,3.25rem)",
          fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1,
          margin: 0,
          color: inView ? p.color : "var(--color-text-primary)",
          transition: "color 0.5s ease",
          position: "relative", zIndex: 2,
        }}
      >{p.title}</motion.h3>

      {/* Body */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(0.78rem,1vw,0.9rem)",
          color: "var(--color-text-muted)", lineHeight: 1.7,
          margin: 0, position: "relative", zIndex: 2,
        }}
      >{p.body}</motion.p>
    </motion.div>
  )
}

export function ProcessPrinciples() {
  const { theme } = useTheme()
  const ref       = useRef<HTMLDivElement>(null)
  const inView    = useInView(ref, { once: true, margin: "-10%" })
  const acc       = theme.colors.accent
  const isDark    = theme.mode === "dark"

  return (
    <section style={{
      position: "relative",
      background: "var(--color-bg)",
      overflow: "hidden",
      borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
    }}>
      {/* Header */}
      <div
        ref={ref}
        style={{
          padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem) clamp(2rem,4vw,3rem)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: "2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: "0.6rem",
            marginBottom: "1rem",
          }}>
            <div style={{ width: 20, height: "1px", background: acc }} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.58rem",
              letterSpacing: "0.16em", textTransform: "uppercase", color: acc,
            }}>How I Think</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem,7vw,6rem)",
            fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9, margin: 0,
          }}>
            <span style={{ display: "block", color: "var(--color-text-primary)" }}>The</span>
            <span style={{
              display: "block", color: "transparent",
              WebkitTextStroke: `2px ${acc}`, textShadow: `0 0 60px ${acc}44`,
            }}>Principles.</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.82rem,1.1vw,0.95rem)",
            color: "var(--color-text-muted)", lineHeight: 1.7,
            maxWidth: 300, margin: 0,
          }}
        >
          Five non-negotiables. Scroll through — watch the signal go live as each one enters view.
        </motion.p>
      </div>

      {/* Principle rows */}
      {PRINCIPLES.map((p, i) => (
        <PrincipleRow key={p.num} p={p} index={i} />
      ))}
    </section>
  )
}