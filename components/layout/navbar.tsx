"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "@/context/theme-context"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"

const NAV_LINKS = [
  { label: "Work",    href: "/projects", num: "01" },
  { label: "About",   href: "/about",    num: "02" },
  { label: "Skills",  href: "/skills",   num: "03" },
  { label: "Contact", href: "/contact",  num: "04" },
]

export function Navbar() {
  const { theme } = useTheme()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [hovered, setHovered]     = useState<string | null>(null)
  const isDark = theme.mode === "dark"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMenuOpen(false); setThemeOpen(false) }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  return (
    <>
      {/* ── DESKTOP NAVBAR: morphing pill ───────────────── */}
      <header
        className="desktop-header"
        style={{
          position: "fixed",
          top: scrolled ? "1rem" : "0",
          left: scrolled ? "50%" : "0",
          right: scrolled ? "auto" : "0",
          transform: scrolled ? "translateX(-50%)" : "none",
          width: scrolled ? "auto" : "100%",
          zIndex: 100,
          transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: scrolled ? "0.25rem" : "0",
          padding: scrolled ? "0.5rem 0.75rem" : "1.5rem clamp(1rem,4vw,3rem)",
          background: scrolled
            ? isDark ? "rgba(13,13,28,0.92)" : "rgba(237,237,248,0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(200%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(200%)" : "none",
          borderRadius: scrolled ? "9999px" : "0",
          border: scrolled ? `1px solid var(--color-surface-border)` : "none",
          boxShadow: scrolled ? "var(--shadow-default)" : "none",
          transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
          justifyContent: "space-between",
          maxWidth: scrolled ? "none" : "none",
        }}>
          {/* Logo */}
          <Link href="/" style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            flexShrink: 0,
            marginRight: scrolled ? "0.5rem" : "0",
            transition: "all 0.4s ease",
          }}>
            <Image
              src={isDark ? "/logo-dark.png" : "/logo-light.png"}
              alt="Brian Chege"
              width={110}
              height={32}
              priority
              style={{
                height: "auto",
                width: scrolled ? "clamp(70px,8vw,90px)" : "clamp(90px,10vw,120px)",
                transition: "width 0.4s ease",
              }}
            />
          </Link>

          {/* Nav links */}
          <ul style={{
            display: "flex",
            alignItems: "center",
            gap: scrolled ? "0.125rem" : "clamp(1.5rem,3vw,3rem)",
            listStyle: "none",
            margin: 0,
            padding: 0,
            transition: "gap 0.4s ease",
          }}>
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onMouseEnter={() => setHovered(link.href)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: scrolled ? "0.8125rem" : "0.875rem",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    color: hovered === link.href ? "var(--color-accent)" : "var(--color-text-secondary)",
                    textDecoration: "none",
                    padding: scrolled ? "0.375rem 0.625rem" : "0.25rem 0",
                    borderRadius: scrolled ? "9999px" : "0",
                    background: scrolled && hovered === link.href ? "var(--color-accent-muted)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                >
                  {/* Underline for non-pill state */}
                  {!scrolled && (
                    <span style={{
                      position: "absolute",
                      bottom: -2,
                      left: 0,
                      height: "1.5px",
                      width: hovered === link.href ? "100%" : "0%",
                      background: "var(--color-accent)",
                      transition: "width 0.3s cubic-bezier(0.16,1,0.3,1)",
                      borderRadius: "2px",
                    }} />
                  )}
                  {scrolled && (
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      color: "var(--color-accent)",
                      opacity: 0.7,
                    }}>{link.num}</span>
                  )}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: scrolled ? "0.5rem" : "0" }}>
            {/* Theme btn */}
            <button
              onClick={() => { setThemeOpen(!themeOpen); setMenuOpen(false) }}
              aria-label="Customize theme"
              style={{
                width: scrolled ? 32 : 38,
                height: scrolled ? 32 : 38,
                borderRadius: scrolled ? "9999px" : "var(--radius)",
                border: `1px solid ${themeOpen ? "var(--color-accent)" : "var(--color-surface-border)"}`,
                background: themeOpen ? "var(--color-accent-muted)" : "var(--color-bg-glass)",
                backdropFilter: "blur(8px)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                color: themeOpen ? "var(--color-accent)" : "var(--color-text-secondary)",
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
            </button>

            {/* CTA */}
            <Link
              href="/contact"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: scrolled ? "0.75rem" : "0.8125rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "var(--color-accent-fg)",
                background: "var(--color-accent)",
                padding: scrolled ? "0.375rem 0.875rem" : "0.5rem 1.25rem",
                borderRadius: "9999px",
                textDecoration: "none",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
                boxShadow: "0 0 20px var(--color-accent-muted)",
                flexShrink: 0,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)" }}
            >
              Hire Me
            </Link>
          </div>
        </div>
      </header>

      {/* ── MOBILE HEADER ────────────────────────────────── */}
      <header
        className="mobile-header"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          padding: "0.875rem clamp(1rem,5vw,1.5rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled
            ? isDark ? "rgba(7,7,15,0.90)" : "rgba(246,246,252,0.90)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid var(--color-surface-border)" : "none",
          transition: "all 0.4s ease",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <Image
            src={isDark ? "/logo-dark.svg" : "/logo-light.svg"}
            alt="Brian Chege"
            width={90}
            height={28}
            priority
            style={{ height: "auto", width: "clamp(80px,20vw,100px)" }}
          />
        </Link>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            onClick={() => { setThemeOpen(!themeOpen); setMenuOpen(false) }}
            style={{
              width: 36, height: 36,
              borderRadius: "var(--radius)",
              border: `1px solid var(--color-surface-border)`,
              background: "var(--color-bg-glass)",
              backdropFilter: "blur(8px)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--color-text-secondary)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
          </button>

          {/* Hamburger */}
          <button
            onClick={() => { setMenuOpen(!menuOpen); setThemeOpen(false) }}
            aria-label={menuOpen ? "Close" : "Menu"}
            style={{
              width: 36, height: 36,
              borderRadius: "var(--radius)",
              border: `1px solid var(--color-surface-border)`,
              background: menuOpen ? "var(--color-accent-muted)" : "var(--color-bg-glass)",
              backdropFilter: "blur(8px)",
              cursor: "pointer",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 0, padding: "10px",
            }}
          >
            <span style={{
              display: "block", width: "16px", height: "1.5px",
              background: menuOpen ? "var(--color-accent)" : "var(--color-text-primary)",
              transform: menuOpen ? "translateY(1.5px) rotate(45deg)" : "none",
              transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
              borderRadius: "2px", marginBottom: menuOpen ? 0 : "4px",
            }}/>
            <span style={{
              display: "block", width: "16px", height: "1.5px",
              background: menuOpen ? "var(--color-accent)" : "var(--color-text-primary)",
              transform: menuOpen ? "translateY(-1.5px) rotate(-45deg)" : "none",
              transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
              borderRadius: "2px",
            }}/>
          </button>
        </div>
      </header>

      {/* ── THEME PANEL ─────────────────────────────────── */}
      {themeOpen && (
        <>
          <div style={{
            position: "fixed",
            top: "clamp(60px,10vw,80px)",
            right: "clamp(1rem,4vw,3rem)",
            zIndex: 200,
            animation: "slideDown 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
          }}>
            <ThemeSwitcher onClose={() => setThemeOpen(false)} />
          </div>
          <div onClick={() => setThemeOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 199 }} />
        </>
      )}

      {/* ── MOBILE FULLSCREEN MENU ───────────────────────── */}
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 150,
        background: isDark ? "rgba(7,7,15,0.97)" : "rgba(246,246,252,0.97)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "clamp(2rem,8vw,4rem)",
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? "all" : "none",
        transition: "opacity 0.4s ease",
        overflow: "hidden",
      }}>
        {/* Big ambient blob */}
        <div style={{
          position: "absolute",
          width: "80vw", height: "80vw",
          borderRadius: "50%",
          background: "var(--color-accent-muted)",
          filter: "blur(100px)",
          right: "-20vw", top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}/>

        {/* Index label */}
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6875rem",
          color: "var(--color-accent)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "clamp(1.5rem,5vw,2.5rem)",
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.5s ease 0.05s",
        }}>
          Navigation
        </div>

        {/* Links */}
        {NAV_LINKS.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "clamp(0.75rem,2vw,1.25rem)",
              textDecoration: "none",
              lineHeight: 1.0,
              marginBottom: "clamp(0.25rem,1vw,0.5rem)",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateX(0)" : "translateX(-40px)",
              transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.08 + 0.1}s`,
              position: "relative",
              zIndex: 1,
            }}
            onMouseEnter={e => {
              const num = e.currentTarget.querySelector(".menu-num") as HTMLElement
              const txt = e.currentTarget.querySelector(".menu-txt") as HTMLElement
              if (num) num.style.color = "var(--color-accent)"
              if (txt) { txt.style.color = "var(--color-accent)"; txt.style.WebkitTextStroke = "0px" }
            }}
            onMouseLeave={e => {
              const num = e.currentTarget.querySelector(".menu-num") as HTMLElement
              const txt = e.currentTarget.querySelector(".menu-txt") as HTMLElement
              if (num) num.style.color = "var(--color-text-muted)"
              if (txt) { txt.style.color = "transparent"; txt.style.WebkitTextStroke = `2px var(--color-text-primary)` }
            }}
          >
            <span
              className="menu-num"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(0.75rem,2vw,0.9rem)",
                color: "var(--color-text-muted)",
                transition: "color 0.2s ease",
                userSelect: "none",
              }}
            >
              {link.num}
            </span>
            <span
              className="menu-txt"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.5rem,14vw,7rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "transparent",
                WebkitTextStroke: `2px var(--color-text-primary)`,
                transition: "all 0.2s ease",
              }}
            >
              {link.label}
            </span>
          </Link>
        ))}

        {/* Bottom bar */}
        <div style={{
          position: "absolute",
          bottom: "clamp(1.5rem,5vw,2.5rem)",
          left: "clamp(2rem,8vw,4rem)",
          right: "clamp(2rem,8vw,4rem)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.5s ease 0.45s",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--color-text-muted)", letterSpacing: "0.08em" }}>
            © 2025 Brian Chege
          </span>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-accent-fg)",
              background: "var(--color-accent)",
              padding: "0.625rem 1.5rem",
              borderRadius: "9999px",
              textDecoration: "none",
              boxShadow: "0 0 20px var(--color-accent-muted)",
            }}
          >
            Hire Me
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .desktop-header { display: block !important; }
        .mobile-header  { display: none !important; }

        @media (max-width: 768px) {
          .desktop-header { display: none !important; }
          .mobile-header  { display: flex !important; }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}