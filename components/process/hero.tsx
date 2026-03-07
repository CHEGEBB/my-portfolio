"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/context/theme-context"

const BOOT_SEQUENCE = [
  { delay: 0,    text: "BRIAN_CHEGE OS v3.0 — booting...", color: "muted" },
  { delay: 600,  text: "✓ Full-Stack engine          [loaded]", color: "green" },
  { delay: 900,  text: "✓ Mobile runtime             [loaded]", color: "green" },
  { delay: 1200, text: "✓ AI/ML modules              [loaded]", color: "green" },
  { delay: 1500, text: "✓ DevOps daemon              [loaded]", color: "green" },
  { delay: 1800, text: "✓ CTO mode                   [active]", color: "accent" },
  { delay: 2200, text: "─────────────────────────────────────", color: "border" },
  { delay: 2500, text: 'Type  help  to see what this system can do.', color: "muted" },
]

const COMMANDS: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  process    → How I work, step by step",
    "  stack      → Technologies I use",
    "  timeline   → How long projects take",
    "  cost       → How I charge",
    "  start      → How to begin working together",
    "  clear      → Clear the terminal",
  ],
  process: [
    "My build process runs in 5 phases:",
    "  [1] DISCOVER   — 1 call. I understand the problem.",
    "  [2] ARCHITECT  — Blueprint before bricks. You see the plan.",
    "  [3] BUILD      — Agile sprints. Working previews, not vague updates.",
    "  [4] SHIP       — Zero drama. CI/CD. Monitored releases.",
    "  [5] IMPROVE    — Post-launch support. Never abandoned.",
    "",
    "→ Scroll down to see this in detail.",
  ],
  stack: [
    "Core stack:",
    "  Frontend   → Next.js, React, Vue, Angular, Svelte",
    "  Mobile     → Flutter, React Native (iOS + Android)",
    "  Backend    → Node.js, Express, Python, FastAPI",
    "  Data       → PostgreSQL, MongoDB",
    "  Cloud      → AWS, Docker, CI/CD pipelines",
    "  Security   → Pen testing, audits, IBM certified",
  ],
  timeline: [
    "Project timelines:",
    "  Landing page / simple site  →  1–2 weeks",
    "  Full web application         →  4–8 weeks",
    "  Mobile app (cross-platform)  →  6–10 weeks",
    "  AI integration               →  2–4 weeks on top",
    "  CTO engagement (ongoing)     →  Monthly retainer",
    "",
    "Rush delivery available. Ask me.",
  ],
  cost: [
    "Engagement models:",
    "  Project-based   → Fixed scope, fixed price",
    "  Retainer        → Monthly, priority access",
    "  CTO-as-service  → Technical leadership by the month",
    "  Hourly          → Available for consulting",
    "",
    "→ Contact: chegephil24@gmail.com",
  ],
  start: [
    "How to start working with me:",
    "",
    "  Step 1 → Email: chegephil24@gmail.com",
    "          OR WhatsApp: +254 796 562 713",
    "",
    "  Step 2 → Tell me what you're building",
    "  Step 3 → I'll reply within 24 hours",
    "  Step 4 → Free 30-min discovery call",
    "  Step 5 → Proposal within 3 days",
    "",
    "That's it. No forms. No agencies. Just Brian.",
  ],
  clear: ["__CLEAR__"],
  whoami: [
    "brian_chege",
    "Role: Full-Stack Developer, Co-Founder, CTO",
    "Location: Kenya → World",
    "Status: Available for new projects",
  ],
  ls: [
    "services/   process/   work/   contact/",
    "skills/     about/     cv.pdf",
  ],
  pwd: ["/portfolio/process"],
  date: [new Date().toUTCString()],
}

interface Line {
  type: "output" | "input" | "boot"
  text: string
  color?: "muted" | "green" | "accent" | "border" | "error" | "default"
}

export function ProcessHero() {
  const { theme }    = useTheme()
  const terminalRef  = useRef<HTMLDivElement>(null)
  const inputRef     = useRef<HTMLInputElement>(null)
  const [lines,      setLines]      = useState<Line[]>([])
  const [inputVal,   setInputVal]   = useState("")
  const [booted,     setBooted]     = useState(false)
  const [mounted,    setMounted]    = useState(false)
  const [blinkOn,    setBlinkOn]    = useState(true)
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  useEffect(() => { setMounted(true) }, [])

  // Cursor blink
  useEffect(() => {
    const t = setInterval(() => setBlinkOn(b => !b), 530)
    return () => clearInterval(t)
  }, [])

  // Boot sequence
  useEffect(() => {
    if (!mounted) return
    BOOT_SEQUENCE.forEach(({ delay, text, color }) => {
      setTimeout(() => {
        setLines(prev => [...prev, { type: "boot", text, color: color as Line["color"] }])
      }, delay)
    })
    setTimeout(() => setBooted(true), 2800)
  }, [mounted])

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const runCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return

    setLines(prev => [...prev, { type: "input", text: `$ ${raw}` }])

    if (cmd === "clear") {
      setTimeout(() => setLines([]), 80)
      return
    }

    const output = COMMANDS[cmd]
    if (output) {
      output.forEach((line, i) => {
        setTimeout(() => {
          setLines(prev => [...prev, {
            type: "output",
            text: line,
            color: line.startsWith("  ") ? "muted" : "default",
          }])
        }, i * 40)
      })
    } else {
      setLines(prev => [...prev, {
        type: "output",
        text: `Command not found: ${cmd}. Type 'help' for available commands.`,
        color: "error",
      }])
    }
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      runCommand(inputVal)
      setInputVal("")
    }
  }

  const getColor = (color?: Line["color"]) => {
    switch (color) {
      case "green":  return "#22c55e"
      case "accent": return acc
      case "muted":  return isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"
      case "border": return isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"
      case "error":  return "#ef4444"
      default:       return isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)"
    }
  }

  if (!mounted) return null

  return (
    <section style={{
      position: "relative",
      minHeight: "100svh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: isDark ? "#07070F" : "#F0F0FA",
      overflow: "hidden",
      padding: "clamp(5rem,10vw,8rem) clamp(1rem,4vw,3rem) clamp(3rem,6vw,5rem)",
    }}>
      {/* Scanline effect */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          ${isDark ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.03)"} 2px,
          ${isDark ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.03)"} 4px
        )`,
      }} />

      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50vw", height: "50vw", borderRadius: "50%",
        background: `radial-gradient(circle, ${acc}14 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{
        width: "100%", maxWidth: 820,
        marginBottom: "clamp(1.5rem,3vw,2.5rem)",
        display: "flex", flexDirection: "column", gap: "0.75rem",
        position: "relative", zIndex: 2,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
        }}>
          <div style={{ width: 20, height: "1px", background: acc }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.58rem",
            letterSpacing: "0.18em", textTransform: "uppercase", color: acc,
          }}>Interactive Terminal</span>
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem,7vw,6rem)",
          fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9,
          margin: 0,
        }}>
          <span style={{ color: "var(--color-text-primary)" }}>How I </span>
          <span style={{
            color: "transparent",
            WebkitTextStroke: `2px ${acc}`,
            textShadow: `0 0 60px ${acc}44`,
          }}>Work.</span>
        </h1>
      </div>

      {/* Terminal window */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          width: "100%", maxWidth: 820,
          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
          background: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative", zIndex: 2,
          boxShadow: `0 0 60px ${acc}18, 0 24px 80px rgba(0,0,0,0.3)`,
          cursor: "text",
        }}
      >
        {/* Title bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.75rem 1rem",
          background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
        }}>
          {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: "50%", background: c,
            }} />
          ))}
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.52rem",
            letterSpacing: "0.1em", color: "var(--color-text-muted)",
            opacity: 0.5, marginLeft: "auto", marginRight: "auto",
          }}>brian@process ~ zsh</span>
        </div>

        {/* Output area */}
        <div
          ref={terminalRef}
          style={{
            padding: "1.25rem 1.25rem 0",
            height: "clamp(260px,38vh,440px)",
            overflowY: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.62rem,1.1vw,0.78rem)",
            lineHeight: 1.85,
            scrollbarWidth: "thin",
            scrollbarColor: `${acc}44 transparent`,
          }}
        >
          {lines.map((line, i) => (
            <div key={i} style={{
              color: line.type === "input"
                ? acc
                : getColor(line.color),
              letterSpacing: line.type === "input" ? "0.02em" : "0.01em",
              opacity: line.type === "boot" ? 0.9 : 1,
              animation: "termLine 0.12s ease both",
            }}>{line.text}</div>
          ))}
        </div>

        {/* Input row */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
          padding: "0.875rem 1.25rem 1.25rem",
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
          marginTop: "0.5rem",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "clamp(0.62rem,1.1vw,0.78rem)",
            color: acc, flexShrink: 0, letterSpacing: "0.02em",
          }}>
            {booted ? "$ " : ""}
          </span>
          <input
            ref={inputRef}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={!booted}
            placeholder={booted ? "type a command..." : "booting..."}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(0.62rem,1.1vw,0.78rem)",
              color: isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)",
              letterSpacing: "0.02em",
              caretColor: acc,
            }}
          />
          <div style={{
            width: 8, height: "1em",
            background: acc,
            opacity: blinkOn && booted ? 1 : 0,
            transition: "opacity 0.1s",
            flexShrink: 0,
          }} />
        </div>
      </div>

      {/* Hint chips */}
      <div style={{
        marginTop: "1.25rem",
        display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center",
        position: "relative", zIndex: 2,
        opacity: booted ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>
        {["help", "process", "stack", "start"].map(cmd => (
          <button
            key={cmd}
            onClick={() => { runCommand(cmd); inputRef.current?.focus() }}
            style={{
              all: "unset", cursor: "pointer",
              fontFamily: "var(--font-mono)", fontSize: "0.5rem",
              letterSpacing: "0.1em",
              color: acc,
              border: `1px solid ${acc}44`,
              background: `${acc}0d`,
              padding: "0.25rem 0.65rem",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.background = `${acc}20`
              el.style.borderColor = acc
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.background = `${acc}0d`
              el.style.borderColor = `${acc}44`
            }}
          >
            {cmd}
          </button>
        ))}
      </div>

      <style jsx global>{`
        @keyframes termLine {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}