"use client"

import { useTheme, presetMeta, accentMeta, type ThemePreset, type AccentColor } from "@/context/theme-context"

interface ThemeSwitcherProps {
  onClose?: () => void
}

export function ThemeSwitcher({ onClose }: ThemeSwitcherProps) {
  const { theme, setPreset, setAccent, setRadius, toggleMode, resetTheme } = useTheme()

  const presets = Object.entries(presetMeta) as [ThemePreset, typeof presetMeta[ThemePreset]][]
  const accents = Object.entries(accentMeta) as [AccentColor, typeof accentMeta[AccentColor]][]

  return (
    <div style={{
      width: "clamp(280px, 90vw, 340px)",
      background: "var(--color-surface)",
      border: "1px solid var(--color-surface-border)",
      borderRadius: "var(--radius)",
      boxShadow: "var(--shadow-default), var(--shadow-glow)",
      overflow: "hidden",
      fontFamily: "var(--font-body)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 1.25rem",
        borderBottom: "1px solid var(--color-surface-border)",
      }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-text-primary)" }}>
            Customize
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "1px" }}>
            Make it yours
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={resetTheme}
            title="Reset to default"
            style={{
              width: 30, height: 30, borderRadius: "6px",
              border: "1px solid var(--color-surface-border)",
              background: "transparent",
              color: "var(--color-text-muted)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem",
            }}
          >↺</button>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: "6px",
                border: "1px solid var(--color-surface-border)",
                background: "transparent",
                color: "var(--color-text-muted)",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Mode toggle */}
        <div>
          <div style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.625rem" }}>
            Mode
          </div>
          <button
            onClick={toggleMode}
            style={{
              width: "100%",
              padding: "0.625rem 1rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--color-surface-border)",
              background: "var(--color-bg-glass)",
              color: "var(--color-text-primary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.875rem",
              fontFamily: "var(--font-body)",
              transition: "all 0.2s ease",
            }}
          >
            <span>{theme.mode === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Toggle</span>
          </button>
        </div>

        {/* Presets */}
        <div>
          <div style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.625rem" }}>
            Themes
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {presets.filter(([k]) => k !== "custom").map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setPreset(key)}
                style={{
                  padding: "0.625rem 0.75rem",
                  borderRadius: "var(--radius)",
                  border: `1px solid ${theme.preset === key ? "var(--color-accent)" : "var(--color-surface-border)"}`,
                  background: theme.preset === key ? "var(--color-accent-muted)" : "var(--color-bg-glass)",
                  color: theme.preset === key ? "var(--color-accent)" : "var(--color-text-secondary)",
                  cursor: "pointer",
                  fontSize: "0.8125rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: theme.preset === key ? 600 : 400,
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
              >
                <span>{meta.emoji}</span>
                <span>{meta.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accent colors */}
        <div>
          <div style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.625rem" }}>
            Accent Color
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {accents.map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setAccent(key)}
                title={meta.label}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: meta.hex,
                  border: theme.accent === key ? `3px solid var(--color-text-primary)` : "3px solid transparent",
                  outline: theme.accent === key ? `2px solid ${meta.hex}` : "none",
                  outlineOffset: "2px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform: theme.accent === key ? "scale(1.15)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Border radius */}
        <div>
          <div style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.625rem" }}>
            Corner Radius
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {(["none", "sm", "md", "lg", "full"] as const).map(r => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                style={{
                  flex: 1,
                  padding: "0.5rem 0",
                  border: `1px solid ${theme.radius === r ? "var(--color-accent)" : "var(--color-surface-border)"}`,
                  background: theme.radius === r ? "var(--color-accent-muted)" : "var(--color-bg-glass)",
                  color: theme.radius === r ? "var(--color-accent)" : "var(--color-text-muted)",
                  cursor: "pointer",
                  fontSize: "0.6875rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: theme.radius === r ? 600 : 400,
                  borderRadius: { none: "2px", sm: "4px", md: "6px", lg: "8px", full: "9999px" }[r],
                  transition: "all 0.2s ease",
                  textTransform: "capitalize",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}