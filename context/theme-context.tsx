"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

export type ThemeMode = "dark" | "light"

export type AccentColor =
  | "indigo"  // Brian's #5567F7
  | "teal"    // Brian's #45D2B0
  | "ember"
  | "arctic"
  | "acid"
  | "bloom"
  | "gold"
  | "violet"

export type ThemePreset =
  | "signature"  // dark + indigo (DEFAULT)
  | "mint"       // dark + teal
  | "obsidian"   // dark + ember
  | "glacier"    // dark + arctic
  | "midnight"   // dark + violet
  | "matrix"     // dark + acid
  | "parchment"  // light + gold
  | "paper"      // light + indigo
  | "blush"      // light + bloom
  | "custom"

export interface ThemeColors {
  bg: string; bgSecondary: string; bgTertiary: string; bgGlass: string
  surface: string; surfaceHover: string; surfaceBorder: string
  textPrimary: string; textSecondary: string; textMuted: string; textInverse: string
  accent: string; accentHover: string; accentMuted: string; accentForeground: string
  success: string; warning: string; error: string
  glow: string; shadow: string; gradient: string; gradientMesh: string
}

export interface Theme {
  preset: ThemePreset; mode: ThemeMode; accent: AccentColor
  colors: ThemeColors
  fonts: { display: string; body: string; mono: string }
  radius: "none" | "sm" | "md" | "lg" | "full"
  motion: "full" | "reduced" | "none"
}

const accents: Record<AccentColor, { base: string; hover: string; muted: string; glow: string; fg: string }> = {
  indigo: { base: "#5567F7", hover: "#6B7BF9", muted: "#5567F720", glow: "0 0 80px #5567F750", fg: "#ffffff" },
  teal:   { base: "#45D2B0", hover: "#5DDBC0", muted: "#45D2B020", glow: "0 0 80px #45D2B050", fg: "#0a0a12" },
  ember:  { base: "#FF4D1C", hover: "#FF6A40", muted: "#FF4D1C20", glow: "0 0 80px #FF4D1C50", fg: "#ffffff" },
  arctic: { base: "#00D4FF", hover: "#33DDFF", muted: "#00D4FF20", glow: "0 0 80px #00D4FF50", fg: "#0a0a12" },
  acid:   { base: "#AAFF00", hover: "#BBFF33", muted: "#AAFF0020", glow: "0 0 80px #AAFF0050", fg: "#0a0a12" },
  bloom:  { base: "#FF6B9D", hover: "#FF85AD", muted: "#FF6B9D20", glow: "0 0 80px #FF6B9D50", fg: "#ffffff" },
  gold:   { base: "#F5A623", hover: "#F7B84B", muted: "#F5A62320", glow: "0 0 80px #F5A62350", fg: "#0a0a12" },
  violet: { base: "#8B5CF6", hover: "#A078F8", muted: "#8B5CF620", glow: "0 0 80px #8B5CF650", fg: "#ffffff" },
}

function buildColors(mode: ThemeMode, accent: AccentColor): ThemeColors {
  const a = accents[accent]
  const a2 = accents[accent === "indigo" ? "teal" : "indigo"]
  const dark = mode === "dark"
  return {
    bg:               dark ? "#07070F" : "#F6F6FC",
    bgSecondary:      dark ? "#0D0D1C" : "#EDEDF8",
    bgTertiary:       dark ? "#141425" : "#E4E4F0",
    bgGlass:          dark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.035)",
    surface:          dark ? "#111120" : "#FFFFFF",
    surfaceHover:     dark ? "#1A1A2E" : "#EDEDFB",
    surfaceBorder:    dark ? "rgba(255,255,255,0.07)" : "rgba(85,103,247,0.12)",
    textPrimary:      dark ? "#EEEEFF" : "#0D0D20",
    textSecondary:    dark ? "#8888BB" : "#55556E",
    textMuted:        dark ? "#44445A" : "#9898B8",
    textInverse:      dark ? "#0D0D20" : "#EEEEFF",
    accent:           a.base,
    accentHover:      a.hover,
    accentMuted:      a.muted,
    accentForeground: a.fg,
    success: "#22C55E", warning: "#F59E0B", error: "#EF4444",
    glow:    a.glow,
    shadow:  dark ? "0 32px 80px rgba(0,0,0,0.8)" : "0 32px 80px rgba(85,103,247,0.12)",
    gradient: `linear-gradient(135deg, ${a.muted} 0%, transparent 60%)`,
    gradientMesh: dark
      ? `radial-gradient(ellipse 70% 60% at 15% 40%, ${a.base}22 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 85% 65%, ${a2.base}14 0%, transparent 50%)`
      : `radial-gradient(ellipse 70% 60% at 15% 40%, ${a.base}14 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 85% 65%, ${a2.base}10 0%, transparent 50%)`,
  }
}

const presets: Record<ThemePreset, { mode: ThemeMode; accent: AccentColor }> = {
  signature: { mode: "dark",  accent: "indigo"  },
  mint:      { mode: "dark",  accent: "teal"    },
  obsidian:  { mode: "dark",  accent: "ember"   },
  glacier:   { mode: "dark",  accent: "arctic"  },
  midnight:  { mode: "dark",  accent: "violet"  },
  matrix:    { mode: "dark",  accent: "acid"    },
  parchment: { mode: "light", accent: "gold"    },
  paper:     { mode: "light", accent: "indigo"  },
  blush:     { mode: "light", accent: "bloom"   },
  custom:    { mode: "dark",  accent: "indigo"  },
}

export const presetMeta: Record<ThemePreset, { label: string; description: string; emoji: string }> = {
  signature: { label: "Signature", description: "Dark & indigo",   emoji: "✦"  },
  mint:      { label: "Mint",      description: "Dark & teal",     emoji: "🌊" },
  obsidian:  { label: "Obsidian",  description: "Dark & fiery",    emoji: "🔥" },
  glacier:   { label: "Glacier",   description: "Dark & icy",      emoji: "🧊" },
  midnight:  { label: "Midnight",  description: "Dark & electric", emoji: "⚡" },
  matrix:    { label: "Matrix",    description: "Dark & acid",     emoji: "💚" },
  parchment: { label: "Parchment", description: "Light & warm",    emoji: "📜" },
  paper:     { label: "Paper",     description: "Light & clean",   emoji: "🤍" },
  blush:     { label: "Blush",     description: "Light & soft",    emoji: "🌸" },
  custom:    { label: "Custom",    description: "Your own mix",    emoji: "🎨" },
}

export const accentMeta: Record<AccentColor, { label: string; hex: string }> = {
  indigo: { label: "Indigo", hex: "#5567F7" },
  teal:   { label: "Teal",   hex: "#45D2B0" },
  ember:  { label: "Ember",  hex: "#FF4D1C" },
  arctic: { label: "Arctic", hex: "#00D4FF" },
  acid:   { label: "Acid",   hex: "#AAFF00" },
  bloom:  { label: "Bloom",  hex: "#FF6B9D" },
  gold:   { label: "Gold",   hex: "#F5A623" },
  violet: { label: "Violet", hex: "#8B5CF6" },
}

interface ThemeContextValue {
  theme: Theme
  setPreset: (preset: ThemePreset) => void
  setMode: (mode: ThemeMode) => void
  setAccent: (accent: AccentColor) => void
  setRadius: (radius: Theme["radius"]) => void
  setMotion: (motion: Theme["motion"]) => void
  toggleMode: () => void
  resetTheme: () => void
  cssVars: React.CSSProperties
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function buildTheme(p: ThemePreset, mode?: ThemeMode, accent?: AccentColor, radius?: Theme["radius"], motion?: Theme["motion"]): Theme {
  const base = presets[p]
  const m = mode ?? base.mode
  const a = accent ?? base.accent
  return {
    preset: p, mode: m, accent: a,
    colors: buildColors(m, a),
    fonts: { display: "'Syne', sans-serif", body: "'DM Sans', sans-serif", mono: "'JetBrains Mono', monospace" },
    radius: radius ?? "md",
    motion: motion ?? "full",
  }
}

function toCssVars(t: Theme): React.CSSProperties {
  const c = t.colors
  const r = { none: "0px", sm: "4px", md: "10px", lg: "18px", full: "9999px" }[t.radius]
  return {
    "--color-bg": c.bg, "--color-bg-secondary": c.bgSecondary, "--color-bg-tertiary": c.bgTertiary,
    "--color-bg-glass": c.bgGlass, "--color-surface": c.surface, "--color-surface-hover": c.surfaceHover,
    "--color-surface-border": c.surfaceBorder, "--color-text-primary": c.textPrimary,
    "--color-text-secondary": c.textSecondary, "--color-text-muted": c.textMuted,
    "--color-text-inverse": c.textInverse, "--color-accent": c.accent,
    "--color-accent-hover": c.accentHover, "--color-accent-muted": c.accentMuted,
    "--color-accent-fg": c.accentForeground, "--color-success": c.success,
    "--color-warning": c.warning, "--color-error": c.error,
    "--shadow-glow": c.glow, "--shadow-default": c.shadow,
    "--gradient-ambient": c.gradient, "--gradient-mesh": c.gradientMesh,
    "--radius": r, "--font-display": t.fonts.display, "--font-body": t.fonts.body, "--font-mono": t.fonts.mono,
  } as React.CSSProperties
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => buildTheme("signature"))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const s = localStorage.getItem("bc-theme")
      if (s) { const p = JSON.parse(s); setTheme(buildTheme(p.preset, p.mode, p.accent, p.radius, p.motion)) }
    } catch {}
  }, [])

  useEffect(() => {
    if (!mounted) return
    try { localStorage.setItem("bc-theme", JSON.stringify({ preset: theme.preset, mode: theme.mode, accent: theme.accent, radius: theme.radius, motion: theme.motion })) }
    catch {}
  }, [theme, mounted])

  const setPreset  = useCallback((p: ThemePreset) => setTheme(prev => buildTheme(p, undefined, undefined, prev.radius, prev.motion)), [])
  const setMode    = useCallback((m: ThemeMode) => setTheme(prev => buildTheme("custom", m, prev.accent, prev.radius, prev.motion)), [])
  const setAccent  = useCallback((a: AccentColor) => setTheme(prev => buildTheme("custom", prev.mode, a, prev.radius, prev.motion)), [])
  const setRadius  = useCallback((r: Theme["radius"]) => setTheme(prev => ({ ...prev, radius: r, colors: buildColors(prev.mode, prev.accent) })), [])
  const setMotion  = useCallback((m: Theme["motion"]) => setTheme(prev => ({ ...prev, motion: m })), [])
  const toggleMode = useCallback(() => setTheme(prev => buildTheme("custom", prev.mode === "dark" ? "light" : "dark", prev.accent, prev.radius, prev.motion)), [])
  const resetTheme = useCallback(() => setTheme(buildTheme("signature")), [])
  const cssVars = toCssVars(theme)

  return (
    <ThemeContext.Provider value={{ theme, setPreset, setMode, setAccent, setRadius, setMotion, toggleMode, resetTheme, cssVars }}>
      <div data-theme={theme.preset} data-mode={theme.mode}
        style={{ ...cssVars, minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text-primary)", fontFamily: "var(--font-body)", transition: "background 0.4s ease, color 0.4s ease" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>")
  return ctx
}