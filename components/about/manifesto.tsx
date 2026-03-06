"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { useTheme } from "@/context/theme-context"
import { useInView } from "framer-motion"

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATEMENTS = [
  {
    num: "01",
    headline: "Code is communication.",
    sub: "Every function name, every comment, every architecture decision is a message to the next person. I write for humans first.",
    color: "#5567F7",
  },
  {
    num: "02",
    headline: "Ship it or it doesn't exist.",
    sub: "A perfect system no one uses is worthless. I optimise for delivered, not polished. Polish comes through iteration.",
    color: "#45D2B0",
  },
  {
    num: "03",
    headline: "The best tool is the right tool.",
    sub: "Not the newest. Not the trendiest. The one that solves the problem fastest for the user who has it.",
    color: "#FF6B9D",
  },
  {
    num: "04",
    headline: "Leadership is technical work.",
    sub: "The best CTOs write code. The best architects understand people. I refuse to choose between them.",
    color: "#AAFF00",
  },
]

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&"
const rand = (arr: string) => arr[Math.floor(Math.random() * arr.length)]

// ─── Hook: typewriter with scramble per character ─────────────────────────────
function useTypewriter(
  text: string,
  active: boolean,
  speed = 38,       // ms per char revealed
  scramblePasses = 4 // how many random chars flash before the real one locks
) {
  const [display, setDisplay] = useState<string[]>([])
  const [done, setDone]       = useState(false)
  const raf = useRef<number>(0)
  const tick = useRef(0)

  useEffect(() => {
    if (!active) { setDisplay([]); setDone(false); return }
    tick.current = 0
    setDisplay([])
    setDone(false)

    let lockedCount = 0          // chars that have settled
    let scrambleStep = 0         // scramble pass for the "next" char
    let frame = 0

    const step = () => {
      frame++
      // Each N frames we advance
      if (frame % Math.round(speed / 16) === 0) {
        if (lockedCount >= text.length) { setDone(true); return }

        if (scrambleStep < scramblePasses) {
          // Show scramble for the next char
          setDisplay(prev => {
            const next = [...prev]
            next[lockedCount] = rand(GLYPHS)
            return next
          })
          scrambleStep++
        } else {
          // Lock it
          setDisplay(prev => {
            const next = [...prev]
            next[lockedCount] = text[lockedCount]
            return next
          })
          lockedCount++
          scrambleStep = 0
        }
      }
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [active, text])

  return { display: display.join(""), done }
}

// ─── Hook: number scramble (01 → final value) ─────────────────────────────────
function useScrambleNum(target: string, active: boolean) {
  const [val, setVal] = useState("--")
  useEffect(() => {
    if (!active) { setVal("--"); return }
    let i = 0
    const iv = setInterval(() => {
      if (i >= 12) { setVal(target); clearInterval(iv); return }
      setVal(
        String(Math.floor(Math.random() * 99)).padStart(2, "0")
      )
      i++
    }, 55)
    return () => clearInterval(iv)
  }, [active, target])
  return val
}

// ─── Scan-line component ──────────────────────────────────────────────────────
function ScanLine({ active, color }: { active: boolean; color: string }) {
  return (
    <div style={{
      position: "absolute", left: 0, right: 0,
      top: 0, height: "2px",
      background: `linear-gradient(90deg, transparent 0%, ${color} 40%, ${color} 60%, transparent 100%)`,
      boxShadow: `0 0 18px 4px ${color}88`,
      opacity: active ? 1 : 0,
      transform: active ? "translateY(100%)" : "translateY(0)",
      transition: active
        ? "transform 0.9s cubic-bezier(0.4,0,0.2,1), opacity 0.1s"
        : "opacity 0.3s",
      pointerEvents: "none",
      zIndex: 10,
      // Animate down the heading height when active
      animation: active ? "scanDown 0.9s cubic-bezier(0.4,0,0.2,1) forwards" : "none",
    }} />
  )
}

// ─── Glitch flash overlay ─────────────────────────────────────────────────────
function GlitchFlash({ trigger, color }: { trigger: number; color: string }) {
  const [frames, setFrames] = useState<number[]>([])

  useEffect(() => {
    if (trigger === 0) return
    // Fire 4 flash frames with tiny delays
    const timeouts: ReturnType<typeof setTimeout>[] = []
    ;[0, 60, 120, 200].forEach((delay, i) => {
      timeouts.push(setTimeout(() => {
        setFrames(f => [...f, i])
        setTimeout(() => setFrames(f => f.filter(x => x !== i)), 40)
      }, delay))
    })
    return () => timeouts.forEach(clearTimeout)
  }, [trigger])

  if (frames.length === 0) return null

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100, pointerEvents: "none",
      mixBlendMode: "screen",
    }}>
      {/* R channel */}
      <div style={{
        position: "absolute", inset: 0,
        background: `${color}33`,
        transform: "translate(4px, -2px)",
      }} />
      {/* B channel offset */}
      <div style={{
        position: "absolute", inset: 0,
        background: "#00ffff22",
        transform: "translate(-4px, 2px)",
      }} />
      {/* Horizontal tear lines */}
      {[22, 47, 68, 83].map(pct => (
        <div key={pct} style={{
          position: "absolute",
          left: 0, right: 0,
          top: `${pct}%`,
          height: `${Math.random() * 3 + 1}px`,
          background: `${color}66`,
          transform: `translateX(${(Math.random() - 0.5) * 40}px)`,
        }} />
      ))}
    </div>
  )
}

// ─── Single panel ─────────────────────────────────────────────────────────────
function Panel({
  stmt,
  index,
  isDark,
  globalAcc,
}: {
  stmt: typeof STATEMENTS[0]
  index: number
  isDark: boolean
  globalAcc: string
}) {
  const panelRef  = useRef<HTMLDivElement>(null)
  const inView    = useInView(panelRef, { once: false, margin: "-30%" })

  // Phases: idle → scrambling num → typing headline → scanline → typing sub → done
  const [phase, setPhase]         = useState<"idle"|"num"|"head"|"scan"|"sub"|"done">("idle")
  const [scanActive, setScan]     = useState(false)
  const [glitchTick, setGlitch]   = useState(0)

  const scrambledNum               = useScrambleNum(stmt.num, phase !== "idle")
  const { display: headText, done: headDone } = useTypewriter(stmt.headline, phase === "head" || phase === "scan" || phase === "sub" || phase === "done")
  const { display: subText }                  = useTypewriter(stmt.sub, phase === "sub" || phase === "done", 22, 2)

  // Advance phases on inView
  useEffect(() => {
    if (!inView) { setPhase("idle"); setScan(false); return }

    // Small entry delay then cascade
    const t1 = setTimeout(() => setPhase("num"),  120)
    const t2 = setTimeout(() => setPhase("head"), 900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [inView])

  // When headline done → scanline → sub
  useEffect(() => {
    if (phase !== "head" || !headDone) return
    setPhase("scan")
    setScan(true)
    const t1 = setTimeout(() => { setScan(false); setPhase("sub") }, 950)
    return () => clearTimeout(t1)
  }, [phase, headDone])

  // Glitch flash when panel enters view
  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setGlitch(g => g + 1), 60)
    return () => clearTimeout(t)
  }, [inView])

  const isActive = phase !== "idle"

  return (
    <div
      ref={panelRef}
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(6rem,10vw,9rem) clamp(1.5rem,7vw,6rem) clamp(4rem,7vw,6rem)",
        overflow: "hidden",
        background: isDark ? "#07070f" : "#f0f0f8",
        // Left border ticks on when active
        borderLeft: `3px solid ${isActive ? stmt.color : "transparent"}`,
        transition: "border-color 0.4s ease 0.3s",
      }}
    >
      <GlitchFlash trigger={glitchTick} color={stmt.color} />

      {/* ── CRT scanline across the heading ── */}
      <ScanLine active={scanActive} color={stmt.color} />

      {/* ── Giant ghost number ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "-0.04em",
          bottom: "-0.15em",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(16rem,38vw,50rem)",
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.08em",
          color: "transparent",
          WebkitTextStroke: `1px ${stmt.color}${isDark ? "14" : "10"}`,
          userSelect: "none",
          pointerEvents: "none",
          transition: "opacity 0.6s ease",
          opacity: isActive ? 1 : 0,
        }}
      >
        {stmt.num}
      </div>

      {/* ── Top row: label + counter ── */}
      <div style={{
        position: "absolute",
        top: "clamp(4rem,6vw,5rem)",
        left: "clamp(1.5rem,7vw,6rem)",
        right: "clamp(1.5rem,7vw,6rem)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 3,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          opacity: isActive ? 1 : 0,
          transform: isActive ? "none" : "translateX(-10px)",
          transition: "all 0.5s ease 0.2s",
        }}>
          <div style={{ width: 16, height: "1px", background: globalAcc }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.5rem",
            letterSpacing: "0.18em", textTransform: "uppercase", color: globalAcc,
          }}>
            The Manifesto
          </span>
        </div>

        {/* Live scrambling counter */}
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(0.9rem,1.5vw,1.2rem)",
          letterSpacing: "0.04em",
          color: stmt.color,
          opacity: isActive ? 0.9 : 0,
          transition: "opacity 0.3s",
          fontVariantNumeric: "tabular-nums",
        }}>
          {scrambledNum} / 04
        </span>
      </div>

      {/* ── Headline — typewriter at display scale ── */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.8rem,8.5vw,8.5rem)",
          fontWeight: 800,
          letterSpacing: "-0.05em",
          lineHeight: 0.92,
          margin: "0 0 clamp(2rem,4vw,3.5rem)",
          color: "var(--color-text-primary)",
          // Subtle colour glow when scan passes
          textShadow: scanActive ? `0 0 40px ${stmt.color}55` : "none",
          transition: "text-shadow 0.4s ease",
          whiteSpace: "pre-line",
          // Cursor blink at end while typing
          position: "relative",
        }}>
          {headText}
          {/* Blinking cursor while headline typing */}
          {(phase === "head") && (
            <span style={{
              display: "inline-block",
              width: "0.55em", height: "0.85em",
              background: stmt.color,
              marginLeft: "0.06em",
              verticalAlign: "text-bottom",
              animation: "cursorBlink 0.6s step-end infinite",
            }} />
          )}
        </h3>

        {/* ── Sub text ── */}
        <div style={{
          maxWidth: "min(520px, 55vw)",
          opacity: (phase === "sub" || phase === "done") ? 1 : 0,
          transition: "opacity 0.2s",
        }}>
          {/* Colour rule */}
          <div style={{
            width: 28, height: 2,
            background: stmt.color,
            marginBottom: "0.75rem",
            boxShadow: `0 0 8px ${stmt.color}88`,
          }} />
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.72rem,1vw,0.88rem)",
            color: "var(--color-text-muted)",
            lineHeight: 1.75,
            margin: 0,
            letterSpacing: "0.01em",
          }}>
            {subText}
            {phase === "sub" && (
              <span style={{
                display: "inline-block",
                width: "0.45em", height: "0.8em",
                background: stmt.color,
                marginLeft: "0.05em",
                verticalAlign: "text-bottom",
                opacity: 0.7,
                animation: "cursorBlink 0.5s step-end infinite",
              }} />
            )}
          </p>
        </div>
      </div>

      {/* ── Bottom: index mark ── */}
      <div style={{
        position: "absolute",
        bottom: "clamp(1.5rem,3vw,2.5rem)",
        right: "clamp(1.5rem,7vw,6rem)",
        fontFamily: "var(--font-mono)", fontSize: "0.42rem",
        letterSpacing: "0.16em", textTransform: "uppercase",
        color: stmt.color, opacity: isActive ? 0.35 : 0,
        transition: "opacity 0.5s ease 1s",
        zIndex: 3,
      }}>
        {`>${" "}STATEMENT_{${index + 1}}_LOADED`}
      </div>

      {/* ── Horizontal divider ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "1px",
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)",
      }} />
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
export function AboutManifesto() {
  const { theme } = useTheme()
  const isDark    = theme.mode === "dark"
  const acc       = theme.colors.accent

  return (
    <section style={{ position: "relative", background: isDark ? "#07070f" : "#f0f0f8" }}>
      {STATEMENTS.map((stmt, i) => (
        <Panel
          key={stmt.num}
          stmt={stmt}
          index={i}
          isDark={isDark}
          globalAcc={acc}
        />
      ))}

      <style jsx global>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes scanDown {
          from { top: 0;    opacity: 1; }
          to   { top: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  )
}