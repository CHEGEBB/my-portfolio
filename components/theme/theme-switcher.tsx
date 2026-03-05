"use client"

import { useTheme, presetMeta, accentMeta, type ThemePreset, type AccentColor } from "@/context/theme-context"

interface ThemeSwitcherProps {
  isOpen: boolean
  onClose: () => void
}

export function ThemeSwitcher({ isOpen, onClose }: ThemeSwitcherProps) {
  const { theme, setPreset, setAccent, setRadius, toggleMode, resetTheme } = useTheme()
  const isDark = theme.mode === "dark"

  const presets = Object.entries(presetMeta).filter(([k]) => k !== "custom") as [ThemePreset, typeof presetMeta[ThemePreset]][]
  const accents = Object.entries(accentMeta) as [AccentColor, typeof accentMeta[AccentColor]][]

  const radiusOptions = [
    { key: "none" as const, label: "Sharp",  shape: "2px"    },
    { key: "sm"   as const, label: "Soft",   shape: "4px"    },
    { key: "md"   as const, label: "Round",  shape: "8px"    },
    { key: "lg"   as const, label: "Loose",  shape: "14px"   },
    { key: "full" as const, label: "Pill",   shape: "9999px" },
  ]

  return (
    <>
      {/* ── Panel: full width, drops from top ── */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 300,
          // Clip height to animate in/out
          maxHeight: isOpen ? "600px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.6s cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: isOpen ? "all" : "none",
        }}
      >
        <div style={{
          width: "100%",
          background: isDark ? "rgba(7,7,15,0.98)" : "rgba(246,246,252,0.98)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderBottom: "1px solid var(--color-surface-border)",
          padding: "clamp(5rem,8vw,6.5rem) clamp(1.5rem,6vw,5rem) clamp(2rem,4vw,3rem)",
          transform: isOpen ? "translateY(0)" : "translateY(-20px)",
          transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}>

          {/* Top row: headline + actions */}
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "clamp(1.5rem,3vw,2.5rem)",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0)" : "translateY(-8px)",
            transition: "all 0.5s ease 0.12s",
          }}>
            <div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.625rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                marginBottom: "0.375rem",
              }}>✦ Appearance</div>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem,5vw,4rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "var(--color-text-primary)",
                lineHeight: 1,
                margin: 0,
              }}>
                Make it <span style={{ color: "var(--color-accent)" }}>yours.</span>
              </h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", paddingBottom: "0.25rem" }}>
              {/* Mode toggle */}
              <button
                onClick={toggleMode}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                  border: "1px solid var(--color-surface-border)",
                  background: "transparent",
                  color: "var(--color-text-secondary)",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent)"
                  ;(e.currentTarget as HTMLElement).style.color = "var(--color-accent)"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-surface-border)"
                  ;(e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)"
                }}
              >
                <span>{isDark ? "🌙" : "☀️"}</span>
                <span>{isDark ? "Dark" : "Light"}</span>
              </button>

              {/* Reset */}
              <button
                onClick={resetTheme}
                title="Reset to default"
                style={{
                  width: 36, height: 36,
                  borderRadius: "9999px",
                  border: "1px solid var(--color-surface-border)",
                  background: "transparent",
                  color: "var(--color-text-muted)",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent)"
                  ;(e.currentTarget as HTMLElement).style.color = "var(--color-accent)"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-surface-border)"
                  ;(e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"
                }}
              >↺</button>

              {/* Close */}
              <button
                onClick={onClose}
                style={{
                  width: 36, height: 36,
                  borderRadius: "9999px",
                  border: "1px solid var(--color-surface-border)",
                  background: "transparent",
                  color: "var(--color-text-muted)",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-accent)"
                  ;(e.currentTarget as HTMLElement).style.color = "var(--color-accent)"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-surface-border)"
                  ;(e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: "1px",
            background: "var(--color-surface-border)",
            marginBottom: "clamp(1.5rem,3vw,2.5rem)",
            opacity: isOpen ? 1 : 0,
            transition: "opacity 0.4s ease 0.18s",
          }} />

          {/* 3-col grid: Themes | Accents | Radius */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(1.5rem,4vw,4rem)",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.5s ease 0.22s",
          }}>

            {/* ── Themes ── */}
            <div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.625rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--color-text-muted)", marginBottom: "0.875rem",
              }}>Theme</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {presets.map(([key, meta]) => (
                  <button key={key} onClick={() => setPreset(key)} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0.625rem 0.875rem",
                    borderRadius: "var(--radius)",
                    border: `1px solid ${theme.preset === key ? "var(--color-accent)" : "var(--color-surface-border)"}`,
                    background: theme.preset === key ? "var(--color-accent-muted)" : "transparent",
                    color: theme.preset === key ? "var(--color-accent)" : "var(--color-text-secondary)",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)", fontSize: "0.8125rem",
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

            {/* ── Accents ── */}
            <div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.625rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--color-text-muted)", marginBottom: "0.875rem",
              }}>Accent</div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
                gap: "0.625rem",
              }}>
                {accents.map(([key, meta]) => (
                  <button key={key} onClick={() => setAccent(key)} title={meta.label} style={{
                    aspectRatio: "1",
                    borderRadius: "var(--radius)",
                    background: meta.hex,
                    border: theme.accent === key ? `3px solid var(--color-text-primary)` : "3px solid transparent",
                    outline: theme.accent === key ? `2px solid ${meta.hex}` : "none",
                    outlineOffset: "3px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    transform: theme.accent === key ? "scale(1.15)" : "scale(1)",
                  }} />
                ))}
              </div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.625rem",
                color: "var(--color-accent)", letterSpacing: "0.1em",
                marginTop: "0.75rem",
              }}>
                {accentMeta[theme.accent]?.label ?? "—"}
              </div>
            </div>

            {/* ── Radius ── */}
            <div>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "0.625rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--color-text-muted)", marginBottom: "0.875rem",
              }}>Corner Style</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {radiusOptions.map(r => (
                  <button key={r.key} onClick={() => setRadius(r.key)} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0.625rem 0.875rem",
                    border: `1px solid ${theme.radius === r.key ? "var(--color-accent)" : "var(--color-surface-border)"}`,
                    background: theme.radius === r.key ? "var(--color-accent-muted)" : "transparent",
                    color: theme.radius === r.key ? "var(--color-accent)" : "var(--color-text-secondary)",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)", fontSize: "0.8125rem",
                    fontWeight: theme.radius === r.key ? 600 : 400,
                    width: "100%",
                    borderRadius: r.shape,
                    transition: "all 0.2s ease",
                  }}>
                    <span>{r.label}</span>
                    <span style={{
                      width: 22, height: 22, flexShrink: 0,
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
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 299, background: "transparent" }}
        />
      )}
    </>
  )
}