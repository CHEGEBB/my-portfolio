"use client"

import { useState, useEffect } from "react"
import { useTheme, presetMeta, accentMeta, type ThemePreset, type AccentColor } from "@/context/theme-context"

const CogIcon = ({ spinning }: { spinning: boolean }) => (
  <svg
    width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
    style={{
      display: "block",
      transform: spinning ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.65s cubic-bezier(0.34,1.56,0.64,1)",
    }}
  >
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

export function ThemeToggle() {
  const { theme, setPreset, setAccent, setRadius, toggleMode, resetTheme } = useTheme()
  const [open,    setOpen]    = useState(false)
  const [hovered, setHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent
  const radius = { none: "0px", sm: "4px", md: "10px", lg: "18px", full: "9999px" }[theme.radius]

  const presets = Object.entries(presetMeta).filter(([k]) => k !== "custom") as [ThemePreset, typeof presetMeta[ThemePreset]][]
  const accents = Object.entries(accentMeta) as [AccentColor, typeof accentMeta[AccentColor]][]
  const radiusOptions = [
    { key: "none" as const, label: "Sharp",  shape: "2px"    },
    { key: "sm"   as const, label: "Soft",   shape: "4px"    },
    { key: "md"   as const, label: "Round",  shape: "8px"    },
    { key: "lg"   as const, label: "Loose",  shape: "14px"   },
    { key: "full" as const, label: "Pill",   shape: "9999px" },
  ]

  useEffect(() => { setMounted(true) }, [])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* ── Right-edge cog tab ── */}
      <div style={{
        position: "fixed",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 400,
      }}>
        <button
          onClick={() => setOpen(p => !p)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="Customize theme"
          style={{
            borderRadius: `${radius} 0 0 ${radius}`,
            width: "clamp(38px,4vw,46px)",
            height: "clamp(48px,6vw,58px)",
            background: isDark ? "rgba(13,13,28,0.95)" : "rgba(246,246,252,0.95)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${open ? acc : hovered ? acc + "88" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            borderRight: "none",
            color: open || hovered ? acc : isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.35)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: open
              ? `-10px 0 32px ${acc}44`
              : hovered ? `-5px 0 18px ${acc}28` : `-3px 0 14px rgba(0,0,0,0.2)`,
            transform: hovered || open ? "translateX(-4px) scale(1.07)" : "translateX(0) scale(1)",
            transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            outline: "none",
            position: "relative",
          }}
        >
          <CogIcon spinning={open || hovered} />
          {/* Accent dot */}
          <span style={{
            position: "absolute",
            bottom: 8, left: "50%", transform: "translateX(-50%)",
            width: 5, height: 5, borderRadius: "50%",
            background: acc,
            boxShadow: `0 0 7px ${acc}`,
            animation: "cogGlow 2s ease-in-out infinite",
          }} />
        </button>
      </div>

      {/* ── Right-side drawer panel ── */}
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 398,
          background: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.15)",
          backdropFilter: open ? "blur(2px)" : "none",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed",
        top: 0, right: 0, bottom: 0,
        width: "clamp(300px, 38vw, 460px)",
        zIndex: 399,
        background: isDark ? "rgba(7,7,15,0.98)" : "rgba(246,246,252,0.98)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        borderLeft: `1px solid ${open ? "var(--color-surface-border)" : "transparent"}`,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          padding: "2rem 1.75rem 1.25rem",
          borderBottom: "1px solid var(--color-surface-border)",
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "0.6rem",
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: "var(--color-accent)", marginBottom: "0.375rem",
          }}>✦ Appearance</div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem,3vw,2rem)",
              fontWeight: 800, letterSpacing: "-0.03em",
              color: "var(--color-text-primary)", margin: 0, lineHeight: 1.1,
            }}>
              Make it<br/><span style={{ color: "var(--color-accent)" }}>yours.</span>
            </h2>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button onClick={resetTheme} title="Reset" style={{
                width: 32, height: 32, borderRadius: "9999px",
                border: "1px solid var(--color-surface-border)",
                background: "transparent", color: "var(--color-text-muted)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.85rem", transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--color-accent)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--color-surface-border)" }}
              >↺</button>
              <button onClick={() => setOpen(false)} style={{
                width: 32, height: 32, borderRadius: "9999px",
                border: "1px solid var(--color-surface-border)",
                background: "transparent", color: "var(--color-text-muted)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--color-accent)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--color-surface-border)" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1.75rem", flex: 1 }}>

          {/* Mode */}
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>Mode</div>
            <button onClick={toggleMode} style={{
              width: "100%", padding: "0.75rem 1rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--color-surface-border)",
              background: "transparent",
              color: "var(--color-text-secondary)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
              fontFamily: "var(--font-body)", fontSize: "0.875rem",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent)"; (e.currentTarget as HTMLElement).style.color = "var(--color-accent)" }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-surface-border)"; (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>{isDark ? "🌙" : "☀️"}</span>
                <span>{isDark ? "Dark Mode" : "Light Mode"}</span>
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.1em", color: "var(--color-accent)", opacity: 0.7 }}>TOGGLE</span>
            </button>
          </div>

          {/* Themes */}
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>Theme</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {presets.map(([key, meta]) => (
                <button key={key} onClick={() => setPreset(key)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.7rem 1rem",
                  borderRadius: "var(--radius)",
                  border: `1px solid ${theme.preset === key ? "var(--color-accent)" : "var(--color-surface-border)"}`,
                  background: theme.preset === key ? "var(--color-accent-muted)" : "transparent",
                  color: theme.preset === key ? "var(--color-accent)" : "var(--color-text-secondary)",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)", fontSize: "0.875rem",
                  fontWeight: theme.preset === key ? 600 : 400,
                  width: "100%", textAlign: "left",
                  transition: "all 0.2s ease",
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>{meta.emoji}</span><span>{meta.label}</span>
                  </span>
                  {theme.preset === key && (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.1em", opacity: 0.6 }}>ACTIVE</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Accent */}
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>Accent Color</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(38px,1fr))", gap: "0.6rem" }}>
              {accents.map(([key, meta]) => (
                <button key={key} onClick={() => setAccent(key)} title={meta.label} style={{
                  aspectRatio: "1",
                  borderRadius: "var(--radius)",
                  background: meta.hex,
                  border: theme.accent === key ? "3px solid var(--color-text-primary)" : "3px solid transparent",
                  outline: theme.accent === key ? `2px solid ${meta.hex}` : "none",
                  outlineOffset: "3px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform: theme.accent === key ? "scale(1.12)" : "scale(1)",
                }} />
              ))}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--color-accent)", letterSpacing: "0.1em", marginTop: "0.625rem" }}>
              {accentMeta[theme.accent]?.label ?? "—"}
            </div>
          </div>

          {/* Radius */}
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>Corner Style</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {radiusOptions.map(r => (
                <button key={r.key} onClick={() => setRadius(r.key)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.7rem 1rem",
                  border: `1px solid ${theme.radius === r.key ? "var(--color-accent)" : "var(--color-surface-border)"}`,
                  background: theme.radius === r.key ? "var(--color-accent-muted)" : "transparent",
                  color: theme.radius === r.key ? "var(--color-accent)" : "var(--color-text-secondary)",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)", fontSize: "0.875rem",
                  fontWeight: theme.radius === r.key ? 600 : 400,
                  width: "100%",
                  borderRadius: r.shape,
                  transition: "all 0.2s ease",
                }}>
                  <span>{r.label}</span>
                  <span style={{
                    width: 20, height: 20, flexShrink: 0,
                    borderRadius: r.shape,
                    border: `1.5px solid ${theme.radius === r.key ? "var(--color-accent)" : "var(--color-surface-border)"}`,
                    display: "inline-block",
                  }} />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes cogGlow {
          0%, 100% { opacity: 1;  transform: translateX(-50%) scale(1);   }
          50%       { opacity: 0.4; transform: translateX(-50%) scale(1.6); }
        }
      `}</style>
    </>
  )
}