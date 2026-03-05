"use client"

import { useTheme, presetMeta, accentMeta, type ThemePreset, type AccentColor } from "@/context/theme-context"

// ── Icons (pure SVG, no emoji) ────────────────────────────────────────────────
const Icons = {
  moon: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  sun: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  reset: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  ),
  close: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  check: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  palette: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  ),
  corners: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9V6a3 3 0 0 1 3-3h3M3 15v3a3 3 0 0 0 3 3h3M15 3h3a3 3 0 0 1 3 3v3M15 21h3a3 3 0 0 0 3-3v-3"/>
    </svg>
  ),
  theme: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  ),
}

interface ThemeSwitcherProps {
  isOpen: boolean
  onClose: () => void
}

export function ThemeSwitcher({ isOpen, onClose }: ThemeSwitcherProps) {
  const { theme, setPreset, setAccent, setRadius, toggleMode, resetTheme } = useTheme()
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  const presets = Object.entries(presetMeta).filter(([k]) => k !== "custom") as [ThemePreset, typeof presetMeta[ThemePreset]][]
  const accents = Object.entries(accentMeta) as [AccentColor, typeof accentMeta[AccentColor]][]

  const radiusOptions = [
    { key: "none" as const, label: "Sharp",  px: "2px",    preview: "2px"    },
    { key: "sm"   as const, label: "Soft",   px: "4px",    preview: "4px"    },
    { key: "md"   as const, label: "Round",  px: "8px",    preview: "8px"    },
    { key: "lg"   as const, label: "Loose",  px: "14px",   preview: "14px"   },
    { key: "full" as const, label: "Pill",   px: "9999px", preview: "9999px" },
  ]

  // Preset icon map (using SVG icons instead of emojis)
  const presetIcons: Record<string, React.ReactNode> = {
    default: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    minimal: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    bold: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z"/>
      </svg>
    ),
    glass: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
      </svg>
    ),
    retro: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
  }

  return (
    <>
      {/* ── Panel: drops from top with bubbly spring ── */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 300,
          // Bubbly bounce via animation class
          pointerEvents: isOpen ? "all" : "none",
          transformOrigin: "top center",
          animation: isOpen ? "panelDropIn 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards" : "panelSnapOut 0.4s cubic-bezier(0.4,0,0.2,1) forwards",
        }}
      >
        <div style={{
          width: "100%",
          background: isDark
            ? `linear-gradient(160deg, rgba(7,7,15,0.98) 60%, ${acc}14 100%)`
            : `linear-gradient(160deg, rgba(246,246,252,0.98) 60%, ${acc}14 100%)`,
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          // Big noticeable border-radius on bottom corners
          borderRadius: "0 0 2.5rem 2.5rem",
          // Accent-coloured bottom border for that color effect
          borderBottom: `2px solid ${acc}`,
          borderLeft: `1px solid ${acc}22`,
          borderRight: `1px solid ${acc}22`,
          boxShadow: `0 24px 80px ${acc}22, 0 8px 32px rgba(0,0,0,0.25)`,
          padding: "clamp(5rem,8vw,6.5rem) clamp(1.5rem,6vw,5rem) clamp(2rem,4vw,3rem)",
          // Subtle accent tint strip at very bottom
          position: "relative",
          overflow: "hidden",
        }}>

          {/* Color wash glow blob top-right */}
          <div style={{
            position: "absolute",
            top: -80, right: -80,
            width: 320, height: 320,
            borderRadius: "50%",
            background: acc,
            opacity: 0.07,
            filter: "blur(60px)",
            pointerEvents: "none",
          }} />
          {/* Second blob bottom-left */}
          <div style={{
            position: "absolute",
            bottom: -60, left: -60,
            width: 240, height: 240,
            borderRadius: "50%",
            background: acc,
            opacity: 0.05,
            filter: "blur(50px)",
            pointerEvents: "none",
          }} />

          {/* ── Header row ── */}
          <div style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            marginBottom: "clamp(1.25rem,2.5vw,2rem)",
            position: "relative", zIndex: 1,
          }}>
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.375rem",
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: acc, marginBottom: "0.4rem",
              }}>
                {Icons.palette}
                Appearance
              </div>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem,4vw,3.25rem)",
                fontWeight: 800, letterSpacing: "-0.04em",
                color: "var(--color-text-primary)", lineHeight: 1.05, margin: 0,
              }}>
                Make it{" "}
                <span style={{
                  color: acc,
                  textShadow: `0 0 40px ${acc}66`,
                }}>yours.</span>
              </h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.2rem" }}>
              {/* Mode toggle */}
              <button
                onClick={toggleMode}
                style={{
                  display: "flex", alignItems: "center", gap: "0.45rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                  border: `1px solid ${acc}44`,
                  background: `${acc}11`,
                  color: acc,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 500,
                  transition: "all 0.25s ease", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${acc}22` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${acc}11` }}
              >
                {isDark ? Icons.moon : Icons.sun}
                {isDark ? "Dark" : "Light"}
              </button>

              {/* Reset */}
              <button onClick={resetTheme} title="Reset to default" style={{
                width: 34, height: 34, borderRadius: "9999px",
                border: "1px solid var(--color-surface-border)",
                background: "transparent", color: "var(--color-text-muted)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = acc; (e.currentTarget as HTMLElement).style.borderColor = acc }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--color-surface-border)" }}
              >{Icons.reset}</button>

              {/* Close */}
              <button onClick={onClose} style={{
                width: 34, height: 34, borderRadius: "9999px",
                border: "1px solid var(--color-surface-border)",
                background: "transparent", color: "var(--color-text-muted)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = acc; (e.currentTarget as HTMLElement).style.borderColor = acc }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--color-surface-border)" }}
              >{Icons.close}</button>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${acc}44, ${acc}88, ${acc}44, transparent)`,
            marginBottom: "clamp(1.25rem,2.5vw,2rem)",
            position: "relative", zIndex: 1,
          }} />

          {/* ── 3-col grid ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(1.5rem,4vw,4rem)",
            position: "relative", zIndex: 1,
          }}>

            {/* THEMES */}
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.375rem",
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--color-text-muted)", marginBottom: "0.875rem",
              }}>
                {Icons.theme}
                Theme
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {presets.map(([key, meta]) => {
                  const active = theme.preset === key
                  return (
                    <button key={key} onClick={() => setPreset(key)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "0.625rem 0.875rem",
                      borderRadius: "var(--radius)",
                      border: `1px solid ${active ? acc : "var(--color-surface-border)"}`,
                      background: active ? `${acc}18` : "transparent",
                      color: active ? acc : "var(--color-text-secondary)",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)", fontSize: "0.8125rem",
                      fontWeight: active ? 600 : 400,
                      width: "100%", textAlign: "left",
                      transition: "all 0.2s ease",
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ opacity: active ? 1 : 0.5 }}>{presetIcons[key] ?? Icons.theme}</span>
                        <span>{meta.label}</span>
                      </span>
                      {active && (
                        <span style={{ color: acc }}>{Icons.check}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ACCENT */}
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.375rem",
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--color-text-muted)", marginBottom: "0.875rem",
              }}>
                {Icons.palette}
                Accent Color
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
                gap: "0.6rem", marginBottom: "0.875rem",
              }}>
                {accents.map(([key, meta]) => {
                  const active = theme.accent === key
                  return (
                    <button key={key} onClick={() => setAccent(key)} title={meta.label} style={{
                      aspectRatio: "1",
                      borderRadius: "var(--radius)",
                      background: meta.hex,
                      border: active ? `3px solid var(--color-text-primary)` : "3px solid transparent",
                      outline: active ? `2px solid ${meta.hex}` : "none",
                      outlineOffset: "3px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      transform: active ? "scale(1.18)" : "scale(1)",
                      boxShadow: active ? `0 0 14px ${meta.hex}88` : "none",
                    }} />
                  )
                })}
              </div>
              {/* Active color name + swatch */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                fontFamily: "var(--font-mono)", fontSize: "0.625rem",
                letterSpacing: "0.1em", color: acc,
              }}>
                <span style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: acc, boxShadow: `0 0 8px ${acc}`,
                  flexShrink: 0,
                }} />
                {accentMeta[theme.accent]?.label ?? "—"}
              </div>
            </div>

            {/* RADIUS */}
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.375rem",
                fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--color-text-muted)", marginBottom: "0.875rem",
              }}>
                {Icons.corners}
                Corner Style
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {radiusOptions.map(r => {
                  const active = theme.radius === r.key
                  return (
                    <button key={r.key} onClick={() => setRadius(r.key)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "0.625rem 0.875rem",
                      border: `1px solid ${active ? acc : "var(--color-surface-border)"}`,
                      background: active ? `${acc}18` : "transparent",
                      color: active ? acc : "var(--color-text-secondary)",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)", fontSize: "0.8125rem",
                      fontWeight: active ? 600 : 400,
                      width: "100%",
                      borderRadius: r.preview,
                      transition: "all 0.2s ease",
                    }}>
                      <span>{r.label}</span>
                      <span style={{
                        width: 20, height: 20, flexShrink: 0,
                        borderRadius: r.preview,
                        border: `1.5px solid ${active ? acc : "var(--color-surface-border)"}`,
                        display: "inline-block",
                        background: active ? `${acc}22` : "transparent",
                      }} />
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 299, background: "transparent" }}
        />
      )}

      <style jsx global>{`
        @keyframes panelDropIn {
          0%   { transform: translateY(-102%); }
          60%  { transform: translateY(6px);   }
          78%  { transform: translateY(-3px);  }
          90%  { transform: translateY(2px);   }
          100% { transform: translateY(0);     }
        }
        @keyframes panelSnapOut {
          0%   { transform: translateY(0);      }
          100% { transform: translateY(-102%);  }
        }
      `}</style>
    </>
  )
}