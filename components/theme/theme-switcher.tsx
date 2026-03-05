"use client"

import { useState, useEffect } from "react"
import {
  Moon, Sun, RotateCcw, X, Check,
  Palette, Maximize2, Monitor,
  Flame, Feather, Dumbbell, Gem, Gamepad2,
  PaletteIcon,
} from "lucide-react"
import { useTheme, presetMeta, accentMeta, type ThemePreset, type AccentColor } from "@/context/theme-context"

// ── One distinct Lucide icon per preset ──────────────────────────────────────
// These are intentionally very different from each other
const PRESET_ICONS: Record<string, React.FC<{ size: number; strokeWidth: number }>> = {
  default: (props: { size: number; strokeWidth: number }) => <PaletteIcon {...props} />
}

interface ThemeSwitcherProps {
  isOpen: boolean
  onClose: () => void
}

export function ThemeSwitcher({ isOpen, onClose }: ThemeSwitcherProps) {
  const { theme, setPreset, setAccent, setRadius, toggleMode, resetTheme } = useTheme()
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  // ── KEY FIX: hidden via CSS transform, not animation ────────────────────────
  // We NEVER use a CSS animation on mount (that's what caused the load-time flicker).
  // Instead we use transform + transition, which is stable and zero-cost at rest.
  // The panel starts translateY(-100%) and transitions to translateY(0) when open.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const presets = Object.entries(presetMeta).filter(([k]) => k !== "custom") as [ThemePreset, typeof presetMeta[ThemePreset]][]
  const accents = Object.entries(accentMeta) as [AccentColor, typeof accentMeta[AccentColor]][]

  const radiusOptions = [
    { key: "none" as const, label: "Sharp", preview: "2px"    },
    { key: "sm"   as const, label: "Soft",  preview: "4px"    },
    { key: "md"   as const, label: "Round", preview: "8px"    },
    { key: "lg"   as const, label: "Loose", preview: "14px"   },
    { key: "full" as const, label: "Pill",  preview: "9999px" },
  ]

  // Don't render at all until client mounted — prevents SSR mismatch
  if (!mounted) return null

  return (
    <>
      {/* ── Panel ── */}
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 300,
          // TRANSFORM-based open/close — no CSS animations, no flicker on load
          transform: isOpen ? "translateY(0)" : "translateY(-100%)",
          transition: isOpen
            ? "transform 0.55s cubic-bezier(0.34,1.4,0.64,1)"   // spring drop
            : "transform 0.35s cubic-bezier(0.4,0,0.2,1)",      // snap back
          pointerEvents: isOpen ? "all" : "none",
          willChange: "transform",
        }}
      >
        <div style={{
          width: "100%",
          background: isDark
            ? `linear-gradient(150deg, rgba(7,7,15,0.98) 55%, ${acc}12 100%)`
            : `linear-gradient(150deg, rgba(246,246,252,0.98) 55%, ${acc}12 100%)`,
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderRadius: "0 0 2rem 2rem",
          borderBottom: `2px solid ${acc}`,
          borderLeft:   `1px solid ${acc}22`,
          borderRight:  `1px solid ${acc}22`,
          boxShadow: `0 20px 60px ${acc}1a, 0 8px 32px rgba(0,0,0,0.2)`,
          padding: "clamp(5rem,8vw,6.5rem) clamp(1.5rem,6vw,5rem) clamp(1.75rem,3vw,2.5rem)",
          position: "relative",
          overflow: "hidden",
        }}>

          {/* Accent glow blobs */}
          <div style={{ position:"absolute", top:-80, right:-80, width:280, height:280, borderRadius:"50%", background:acc, opacity:0.06, filter:"blur(60px)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:-60, left:-60, width:200, height:200, borderRadius:"50%", background:acc, opacity:0.04, filter:"blur(50px)", pointerEvents:"none" }} />

          {/* ── Header ── */}
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"clamp(1rem,2vw,1.75rem)", position:"relative", zIndex:1 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.35rem", fontFamily:"var(--font-mono)", fontSize:"0.6rem", letterSpacing:"0.16em", textTransform:"uppercase", color:acc, marginBottom:"0.375rem" }}>
                <Palette size={12} strokeWidth={2} />
                Appearance
              </div>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.75rem,4vw,3rem)", fontWeight:800, letterSpacing:"-0.04em", color:"var(--color-text-primary)", lineHeight:1.05, margin:0 }}>
                Make it <span style={{ color:acc, textShadow:`0 0 30px ${acc}55` }}>yours.</span>
              </h2>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", paddingBottom:"0.2rem" }}>
              {/* Mode */}
              <button onClick={toggleMode} style={{ display:"flex", alignItems:"center", gap:"0.4rem", padding:"0.45rem 0.9rem", borderRadius:"9999px", border:`1px solid ${acc}44`, background:`${acc}11`, color:acc, cursor:"pointer", fontFamily:"var(--font-body)", fontSize:"0.8rem", fontWeight:500, transition:"all 0.2s ease", whiteSpace:"nowrap" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=`${acc}22`}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=`${acc}11`}}
              >
                {isDark ? <Moon size={13} strokeWidth={2}/> : <Sun size={13} strokeWidth={2}/>}
                {isDark ? "Dark" : "Light"}
              </button>

              {/* Reset */}
              <button onClick={resetTheme} title="Reset" style={{ width:34, height:34, borderRadius:"9999px", border:"1px solid var(--color-surface-border)", background:"transparent", color:"var(--color-text-muted)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s ease" }}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.color=acc;el.style.borderColor=acc}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.color="var(--color-text-muted)";el.style.borderColor="var(--color-surface-border)"}}
              >
                <RotateCcw size={13} strokeWidth={2.2}/>
              </button>

              {/* Close */}
              <button onClick={onClose} style={{ width:34, height:34, borderRadius:"9999px", border:"1px solid var(--color-surface-border)", background:"transparent", color:"var(--color-text-muted)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s ease" }}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.color=acc;el.style.borderColor=acc}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.color="var(--color-text-muted)";el.style.borderColor="var(--color-surface-border)"}}
              >
                <X size={13} strokeWidth={2.5}/>
              </button>
            </div>
          </div>

          {/* Gradient divider */}
          <div style={{ height:"1px", background:`linear-gradient(90deg,transparent,${acc}55,${acc}99,${acc}55,transparent)`, marginBottom:"clamp(1rem,2vw,1.75rem)", position:"relative", zIndex:1 }} />

          {/* ── 3 cols ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"clamp(1.5rem,4vw,4rem)", position:"relative", zIndex:1 }}>

            {/* THEMES */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.35rem", fontFamily:"var(--font-mono)", fontSize:"0.6rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--color-text-muted)", marginBottom:"0.75rem" }}>
                <Monitor size={13} strokeWidth={2}/>
                Theme
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.3rem" }}>
                {presets.map(([key, meta]) => {
                  const active = theme.preset === key
                  // Each preset gets its own distinct icon component
                  const IconComp = PRESET_ICONS[key] ?? PaletteIcon
                  return (
                    <button key={key} onClick={() => setPreset(key)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.6rem 0.875rem", borderRadius:"var(--radius)", border:`1px solid ${active ? acc : "var(--color-surface-border)"}`, background: active ? `${acc}18` : "transparent", color: active ? acc : "var(--color-text-secondary)", cursor:"pointer", fontFamily:"var(--font-body)", fontSize:"0.8125rem", fontWeight: active ? 600 : 400, width:"100%", textAlign:"left", transition:"all 0.2s ease" }}>
                      <span style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                        <IconComp size={13} strokeWidth={active ? 2.5 : 1.75} />
                        {meta.label}
                      </span>
                      {active && <Check size={11} strokeWidth={3}/>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ACCENT */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.35rem", fontFamily:"var(--font-mono)", fontSize:"0.6rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--color-text-muted)", marginBottom:"0.75rem" }}>
                <Palette size={13} strokeWidth={2}/>
                Accent Color
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(36px,1fr))", gap:"0.6rem", marginBottom:"0.75rem" }}>
                {accents.map(([key, meta]) => {
                  const active = theme.accent === key
                  return (
                    <button key={key} onClick={() => setAccent(key)} title={meta.label} style={{ aspectRatio:"1", borderRadius:"var(--radius)", background:meta.hex, border: active ? "3px solid var(--color-text-primary)" : "3px solid transparent", outline: active ? `2px solid ${meta.hex}` : "none", outlineOffset:"3px", cursor:"pointer", transition:"all 0.2s ease", transform: active ? "scale(1.18)" : "scale(1)", boxShadow: active ? `0 0 14px ${meta.hex}88` : "none" }} />
                  )
                })}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", fontFamily:"var(--font-mono)", fontSize:"0.6rem", color:acc, letterSpacing:"0.1em" }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:acc, boxShadow:`0 0 6px ${acc}`, flexShrink:0 }}/>
                {accentMeta[theme.accent]?.label ?? "—"}
              </div>
            </div>

            {/* RADIUS */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"0.35rem", fontFamily:"var(--font-mono)", fontSize:"0.6rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--color-text-muted)", marginBottom:"0.75rem" }}>
                <Maximize2 size={13} strokeWidth={2}/>
                Corner Style
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.3rem" }}>
                {radiusOptions.map(r => {
                  const active = theme.radius === r.key
                  return (
                    <button key={r.key} onClick={() => setRadius(r.key)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.6rem 0.875rem", border:`1px solid ${active ? acc : "var(--color-surface-border)"}`, background: active ? `${acc}18` : "transparent", color: active ? acc : "var(--color-text-secondary)", cursor:"pointer", fontFamily:"var(--font-body)", fontSize:"0.8125rem", fontWeight: active ? 600 : 400, width:"100%", borderRadius:r.preview, transition:"all 0.2s ease" }}>
                      <span>{r.label}</span>
                      <span style={{ width:20, height:20, borderRadius:r.preview, border:`1.5px solid ${active ? acc : "var(--color-surface-border)"}`, background: active ? `${acc}22` : "transparent", display:"inline-block", flexShrink:0 }}/>
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Backdrop — click outside to close */}
      {isOpen && (
        <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:299, background:"transparent" }} />
      )}
    </>
  )
}