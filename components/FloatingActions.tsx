"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"

// Infinitely rotating cog
const CogIcon = () => (
  <svg
    width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "block", animation: "cogSpin 8s linear infinite" }}
  >
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

const ArrowUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5M5 12l7-7 7 7"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)

export function FloatingActions() {
  const { theme } = useTheme()
  const [themeOpen,   setThemeOpen]   = useState(false)
  const [showScrollUp, setShowScrollUp] = useState(false)
  const [mounted,      setMounted]      = useState(false)
  const [hoveredBtn,   setHoveredBtn]   = useState<string | null>(null)
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onScroll = () => setShowScrollUp(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setThemeOpen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  if (!mounted) return null

  const btnBase = (id: string, extraStyle: React.CSSProperties = {}): React.CSSProperties => ({
    width: 46, height: 46,
    borderRadius: "9999px",
    border: `1px solid ${hoveredBtn === id ? acc : "var(--color-surface-border)"}`,
    background: hoveredBtn === id
      ? `${acc}18`
      : isDark ? "rgba(13,13,28,0.88)" : "rgba(246,246,252,0.88)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    color: hoveredBtn === id ? acc : "var(--color-text-secondary)",
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: hoveredBtn === id
      ? `0 0 20px ${acc}44, 0 4px 20px rgba(0,0,0,0.2)`
      : "0 2px 16px rgba(0,0,0,0.15)",
    transform: hoveredBtn === id ? "scale(1.1) translateY(-2px)" : "scale(1) translateY(0)",
    transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
    outline: "none",
    ...extraStyle,
  })

  return (
    <>
      {/* ThemeSwitcher panel — drops from top */}
      <ThemeSwitcher isOpen={themeOpen} onClose={() => setThemeOpen(false)} />

      {/* ── Bottom-right cluster ── */}
      <div style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 350,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.625rem",
      }}>

        {/* Scroll to top — only when scrolled */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          onMouseEnter={() => setHoveredBtn("top")}
          onMouseLeave={() => setHoveredBtn(null)}
          aria-label="Scroll to top"
          style={{
            ...btnBase("top"),
            opacity: showScrollUp ? 1 : 0,
            transform: showScrollUp
              ? (hoveredBtn === "top" ? "scale(1.1) translateY(-2px)" : "scale(1) translateY(0)")
              : "scale(0.7) translateY(12px)",
            pointerEvents: showScrollUp ? "all" : "none",
            transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <ArrowUpIcon />
        </button>

        {/* WhatsApp */}
        <a
          href="https://wa.me/254796562713"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredBtn("wa")}
          onMouseLeave={() => setHoveredBtn(null)}
          aria-label="Chat on WhatsApp"
          style={{
            ...btnBase("wa", {
              // WhatsApp green on hover
              border: `1px solid ${hoveredBtn === "wa" ? "#25D366" : "var(--color-surface-border)"}`,
              color: hoveredBtn === "wa" ? "#25D366" : "var(--color-text-secondary)",
              background: hoveredBtn === "wa"
                ? "rgba(37,211,102,0.12)"
                : isDark ? "rgba(13,13,28,0.88)" : "rgba(246,246,252,0.88)",
              boxShadow: hoveredBtn === "wa"
                ? "0 0 20px rgba(37,211,102,0.35), 0 4px 20px rgba(0,0,0,0.2)"
                : "0 2px 16px rgba(0,0,0,0.15)",
            }),
            textDecoration: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <WhatsAppIcon />
        </a>

        {/* Cog — toggles ThemeSwitcher, infinite rotation */}
        <button
          onClick={() => setThemeOpen(v => !v)}
          onMouseEnter={() => setHoveredBtn("cog")}
          onMouseLeave={() => setHoveredBtn(null)}
          aria-label="Customize theme"
          style={{
            ...btnBase("cog", {
              border: `1px solid ${themeOpen ? acc : hoveredBtn === "cog" ? acc : "var(--color-surface-border)"}`,
              background: themeOpen
                ? `${acc}22`
                : hoveredBtn === "cog"
                  ? `${acc}18`
                  : isDark ? "rgba(13,13,28,0.88)" : "rgba(246,246,252,0.88)",
              color: themeOpen || hoveredBtn === "cog" ? acc : "var(--color-text-secondary)",
              boxShadow: themeOpen
                ? `0 0 28px ${acc}55, 0 4px 20px rgba(0,0,0,0.2)`
                : hoveredBtn === "cog"
                  ? `0 0 20px ${acc}44, 0 4px 20px rgba(0,0,0,0.2)`
                  : "0 2px 16px rgba(0,0,0,0.15)",
              // Pulse ring when themeOpen
              outline: themeOpen ? `2px solid ${acc}44` : "none",
              outlineOffset: "3px",
            }),
          }}
        >
          <CogIcon />
        </button>
      </div>

      <style jsx global>{`
        @keyframes cogSpin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}