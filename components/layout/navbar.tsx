"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "@/context/theme-context"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"

const NAV_LINKS = [
  { label: "Home",      href: "/",         num: "00" },
  { label: "Portfolio", href: "/portfolio", num: "01" },
  { label: "Services",  href: "/services",  num: "02" },
  { label: "About",     href: "/about",     num: "03" },
  { label: "Process",   href: "/process",   num: "04" },
  { label: "Contact",   href: "/contact",   num: "04" },
]

const CV_URL = "https://drive.google.com/uc?export=download&id=1pTAMt80W6VfTootlcr3LuECuNCG0qEf7"

const StaircaseMenu = ({ open, color }: { open: boolean; color: string }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", justifyContent:"center", gap:"4px", width:20, height:16, position:"relative" }}>
    {open ? (
      <>
        <span style={{ display:"block", width:"18px", height:"1.5px", background:color, borderRadius:"2px", transform:"translateY(5.75px) rotate(45deg)", transition:"all 0.35s cubic-bezier(0.16,1,0.3,1)" }}/>
        <span style={{ display:"block", width:"18px", height:"1.5px", background:color, borderRadius:"2px", opacity:0, transition:"all 0.35s cubic-bezier(0.16,1,0.3,1)" }}/>
        <span style={{ display:"block", width:"18px", height:"1.5px", background:color, borderRadius:"2px", transform:"translateY(-5.75px) rotate(-45deg)", transition:"all 0.35s cubic-bezier(0.16,1,0.3,1)" }}/>
      </>
    ) : (
      <>
        <span style={{ display:"block", width:"18px", height:"1.5px", background:color, borderRadius:"2px", transition:"all 0.35s cubic-bezier(0.16,1,0.3,1)" }}/>
        <span style={{ display:"block", width:"13px", height:"1.5px", background:color, borderRadius:"2px", transition:"all 0.35s cubic-bezier(0.16,1,0.3,1)" }}/>
        <span style={{ display:"block", width:"8px", height:"1.5px", background:color, borderRadius:"2px", transition:"all 0.35s cubic-bezier(0.16,1,0.3,1)" }}/>
      </>
    )}
  </div>
)

// Animated download icon — arrow bounces down on hover
function CvNavBtn({ scrolled, isDark, accent }: { scrolled: boolean; isDark: boolean; accent: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={CV_URL}
      download="Brian_Chege_CV.pdf"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Download CV"
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.4rem",
        fontFamily: "var(--font-mono)",
        fontSize: scrolled ? "0.6rem" : "0.65rem",
        fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
        textDecoration: "none",
        color: hovered ? accent : "var(--color-text-secondary)",
        border: `1px solid ${hovered ? accent : "var(--color-surface-border)"}`,
        background: hovered ? `${accent}14` : "transparent",
        padding: scrolled ? "0.3rem 0.65rem" : "0.4rem 0.875rem",
        borderRadius: "9999px",
        transition: "all 0.25s ease",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Subtle shimmer on hover */}
      <span style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(90deg, transparent 0%, ${accent}22 50%, transparent 100%)`,
        transform: hovered ? "translateX(100%)" : "translateX(-100%)",
        transition: "transform 0.55s ease",
        pointerEvents: "none",
      }} />
      <svg
        width="11" height="11" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        style={{
          transform: hovered ? "translateY(2px)" : "translateY(0)",
          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          flexShrink: 0,
        }}
      >
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
      </svg>
      CV
    </a>
  )
}

export function Navbar() {
  const { theme }  = useTheme()
  const pathname   = usePathname()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [hovered,   setHovered]   = useState<string | null>(null)
  const isDark = theme.mode === "dark"
  const acc    = theme.colors.accent

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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  const toggle = () => { setMenuOpen(v => !v); setThemeOpen(false) }

  const hamburgerColor = menuOpen ? "var(--color-accent)" : "var(--color-text-primary)"

  return (
    <>
      {/* DESKTOP NAV */}
      <header className="desktop-header" style={{ position:"fixed", top: scrolled ? "1rem" : "0", left: scrolled ? "50%" : "0", right: scrolled ? "auto" : "0", transform: scrolled ? "translateX(-50%)" : "none", width: scrolled ? "auto" : "100%", zIndex:200, transition:"all 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap: scrolled ? "0.375rem" : "0", padding: scrolled ? "0.5rem 0.75rem" : "1.5rem clamp(1rem,4vw,3rem)", background: scrolled ? (isDark ? "rgba(13,13,28,0.92)" : "rgba(237,237,248,0.92)") : "transparent", backdropFilter: scrolled ? "blur(24px) saturate(200%)" : "none", WebkitBackdropFilter: scrolled ? "blur(24px) saturate(200%)" : "none", borderRadius: scrolled ? "9999px" : "0", border: scrolled ? "1px solid var(--color-surface-border)" : "none", boxShadow: scrolled ? "var(--shadow-default)" : "none", transition:"all 0.6s cubic-bezier(0.16,1,0.3,1)" }}>

          <Link href="/" style={{ display:"flex", alignItems:"center", textDecoration:"none", flexShrink:0, opacity: menuOpen ? 0 : 1, pointerEvents: menuOpen ? "none" : "all", transition:"opacity 0.3s ease" }}>
            <Image src={isDark ? "/logo-dark.png" : "/logo-light.png"} alt="Brian Chege" width={110} height={32} priority style={{ height:"auto", width: scrolled ? "clamp(70px,8vw,90px)" : "clamp(90px,10vw,120px)", transition:"width 0.4s ease" }}/>
          </Link>

          <ul style={{ display:"flex", alignItems:"center", listStyle:"none", margin:"0 auto", padding:0, gap: scrolled ? "0.125rem" : "clamp(1.25rem,2.5vw,2.5rem)", opacity: menuOpen ? 0 : 1, pointerEvents: menuOpen ? "none" : "all", transition:"opacity 0.3s ease, gap 0.4s ease" }}>
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link href={link.href} onMouseEnter={() => setHovered(link.href)} onMouseLeave={() => setHovered(null)} style={{ fontFamily:"var(--font-body)", fontSize: scrolled ? "0.8125rem" : "0.875rem", fontWeight: isActive(link.href) ? 700 : 500, letterSpacing:"0.02em", color: isActive(link.href) || hovered === link.href ? "var(--color-accent)" : "var(--color-text-secondary)", textDecoration:"none", padding: scrolled ? "0.375rem 0.5rem" : "0.25rem 0", borderRadius: scrolled ? "9999px" : "0", background: scrolled && (hovered === link.href || isActive(link.href)) ? "var(--color-accent-muted)" : "transparent", display:"flex", alignItems:"center", gap:"0.2rem", position:"relative", transition:"all 0.2s ease" }}>
                  {!scrolled && (<span style={{ position:"absolute", bottom:-2, left:0, height:"1.5px", width: (hovered === link.href || isActive(link.href)) ? "100%" : "0%", background:"var(--color-accent)", transition:"width 0.3s cubic-bezier(0.16,1,0.3,1)", borderRadius:"2px" }}/>)}
                  {scrolled && (<span style={{ fontFamily:"var(--font-mono)", fontSize:"0.55rem", color:"var(--color-accent)", opacity:0.65 }}>{link.num}</span>)}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div style={{ display:"flex", alignItems:"center", gap: scrolled ? "0.375rem" : "0.625rem", flexShrink:0 }}>

            {/* CV download — hidden when menu open */}
            <div style={{ opacity: menuOpen ? 0 : 1, pointerEvents: menuOpen ? "none" : "all", transition:"opacity 0.3s ease" }}>
              <CvNavBtn scrolled={scrolled} isDark={isDark} accent={acc} />
            </div>

            <button onClick={() => { setThemeOpen(!themeOpen); setMenuOpen(false) }} aria-label="Customize theme" style={{ width: scrolled ? 32 : 38, height: scrolled ? 32 : 38, borderRadius: scrolled ? "9999px" : "var(--radius)", border: `1px solid ${themeOpen ? "var(--color-accent)" : "var(--color-surface-border)"}`, background: themeOpen ? "var(--color-accent-muted)" : "var(--color-bg-glass)", backdropFilter:"blur(8px)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s ease", color: themeOpen ? "var(--color-accent)" : "var(--color-text-secondary)", opacity: menuOpen ? 0 : 1, pointerEvents: menuOpen ? "none" : "all" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
            </button>

            <Link href="/contact" style={{ fontFamily:"var(--font-body)", fontSize: scrolled ? "0.75rem" : "0.8125rem", fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", color:"var(--color-accent-fg)", background:"var(--color-accent)", padding: scrolled ? "0.375rem 0.875rem" : "0.5rem 1.25rem", borderRadius:"9999px", textDecoration:"none", whiteSpace:"nowrap", boxShadow:"0 0 20px var(--color-accent-muted)", transition:"all 0.3s ease", opacity: menuOpen ? 0 : 1, pointerEvents: menuOpen ? "none" : "all" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)" }}>
              Hire Me
            </Link>

            <button onClick={toggle} aria-label={menuOpen ? "Close menu" : "Open menu"} style={{ width: scrolled ? 32 : 38, height: scrolled ? 32 : 38, borderRadius: scrolled ? "9999px" : "var(--radius)", border: `1px solid ${menuOpen ? "var(--color-accent)" : "var(--color-surface-border)"}`, background: menuOpen ? "var(--color-accent-muted)" : "var(--color-bg-glass)", backdropFilter:"blur(8px)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s ease", flexShrink:0, position:"relative", zIndex:210 }}>
              <StaircaseMenu open={menuOpen} color={hamburgerColor} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE HEADER */}
      <header className="mobile-header" style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, padding:"0.875rem clamp(1rem,5vw,1.5rem)", display:"flex", alignItems:"center", justifyContent:"space-between", background: menuOpen ? "transparent" : scrolled ? (isDark ? "rgba(7,7,15,0.90)" : "rgba(246,246,252,0.90)") : "transparent", backdropFilter: !menuOpen && scrolled ? "blur(20px)" : "none", WebkitBackdropFilter: !menuOpen && scrolled ? "blur(20px)" : "none", borderBottom: !menuOpen && scrolled ? "1px solid var(--color-surface-border)" : "none", transition:"all 0.4s ease" }}>
        <Link href="/" style={{ textDecoration:"none", zIndex:210 }}>
          <Image src={isDark ? "/logo-dark.png" : "/logo-light.png"} alt="Brian Chege" width={90} height={28} priority style={{ height:"auto", width:"clamp(80px,20vw,100px)" }}/>
        </Link>

        <div style={{ display:"flex", gap:"0.5rem", alignItems:"center", zIndex:210 }}>
          {/* Mobile CV download */}
          <a href={CV_URL} download="Brian_Chege_CV.pdf" title="Download CV" style={{ width:36, height:36, borderRadius:"var(--radius)", border:"1px solid var(--color-surface-border)", background:"var(--color-bg-glass)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--color-text-secondary)", textDecoration:"none", transition:"all 0.2s ease" }}
            onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=acc;el.style.color=acc}}
            onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="var(--color-surface-border)";el.style.color="var(--color-text-secondary)"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          </a>

          <button onClick={() => { setThemeOpen(!themeOpen); setMenuOpen(false) }} style={{ width:36, height:36, borderRadius:"var(--radius)", border:"1px solid var(--color-surface-border)", background:"var(--color-bg-glass)", backdropFilter:"blur(8px)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--color-text-secondary)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
          </button>

          <button onClick={toggle} aria-label={menuOpen ? "Close menu" : "Open menu"} style={{ width:36, height:36, borderRadius:"var(--radius)", border: `1px solid ${menuOpen ? "var(--color-accent)" : "var(--color-surface-border)"}`, background: menuOpen ? "var(--color-accent-muted)" : "var(--color-bg-glass)", backdropFilter:"blur(8px)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s ease", position:"relative", zIndex:210 }}>
            <StaircaseMenu open={menuOpen} color={menuOpen ? "var(--color-accent)" : "var(--color-text-primary)"} />
          </button>
        </div>
      </header>

      <ThemeSwitcher isOpen={themeOpen} onClose={() => setThemeOpen(false)} />

      {/* FULLSCREEN OVERLAY */}
      <div style={{ position:"fixed", inset:0, zIndex:150, background: isDark ? "rgba(7,7,15,0.97)" : "rgba(246,246,252,0.97)", backdropFilter:"blur(28px)", WebkitBackdropFilter:"blur(28px)", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"clamp(2rem,8vw,4rem)", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "all" : "none", transition:"opacity 0.4s cubic-bezier(0.16,1,0.3,1)", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:"80vw", height:"80vw", borderRadius:"50%", background:"var(--color-accent-muted)", filter:"blur(100px)", right:"-20vw", top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}/>

        <div style={{ fontFamily:"var(--font-mono)", fontSize:"0.6875rem", color:"var(--color-accent)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"clamp(1.5rem,5vw,2.5rem)", textAlign:"center", opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0)" : "translateY(20px)", transition:"all 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s" }}>
          Navigation
        </div>

        <nav style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.1rem", position:"relative", zIndex:1 }}>
          {NAV_LINKS.map((link, i) => {
            const active = isActive(link.href)
            return (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ display:"flex", alignItems:"baseline", gap:"clamp(0.5rem,1.5vw,0.875rem)", textDecoration:"none", lineHeight:1.0, padding:"0.15rem 0", opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)", transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 0.07 + 0.12}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 0.07 + 0.12}s` }}
                onMouseEnter={e => { const num = e.currentTarget.querySelector(".menu-num") as HTMLElement; const txt = e.currentTarget.querySelector(".menu-txt") as HTMLElement; if(num) num.style.color="var(--color-accent)"; if(txt){txt.style.color="var(--color-accent)";txt.style.webkitTextStroke="0px"} }}
                onMouseLeave={e => { const num = e.currentTarget.querySelector(".menu-num") as HTMLElement; const txt = e.currentTarget.querySelector(".menu-txt") as HTMLElement; if(num) num.style.color=active?"var(--color-accent)":"var(--color-text-muted)"; if(txt){txt.style.color=active?"var(--color-accent)":"transparent";txt.style.webkitTextStroke=active?"0px":`2px var(--color-text-primary)`} }}>
                <span className="menu-num" style={{ fontFamily:"var(--font-mono)", fontSize:"clamp(0.7rem,1.8vw,0.85rem)", color: active ? "var(--color-accent)" : "var(--color-text-muted)", transition:"color 0.2s ease", userSelect:"none" }}>{link.num}</span>
                <span className="menu-txt" style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.8rem,10vw,6.5rem)", fontWeight:800, letterSpacing:"-0.04em", color: active ? "var(--color-accent)" : "transparent", WebkitTextStroke: active ? "0px" : `2px var(--color-text-primary)`, transition:"all 0.2s ease" }}>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div style={{ position:"absolute", bottom:"clamp(1.5rem,5vw,2.5rem)", left:"clamp(2rem,8vw,4rem)", right:"clamp(2rem,8vw,4rem)", display:"flex", justifyContent:"space-between", alignItems:"center", opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0)" : "translateY(16px)", transition:"all 0.5s cubic-bezier(0.16,1,0.3,1) 0.55s" }}>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:"0.7rem", color:"var(--color-text-muted)", letterSpacing:"0.08em" }}>© 2025 Brian Chege</span>
          <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
            <a href={CV_URL} download="Brian_Chege_CV.pdf" style={{ fontFamily:"var(--font-mono)", fontSize:"0.65rem", fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color: acc, border:`1px solid ${acc}55`, padding:"0.5rem 1rem", borderRadius:"9999px", textDecoration:"none", display:"flex", alignItems:"center", gap:"0.4rem", transition:"all 0.2s ease" }}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background=`${acc}18`}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background="transparent"}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Download CV
            </a>
            <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ fontFamily:"var(--font-body)", fontSize:"0.8125rem", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:"var(--color-accent-fg)", background:"var(--color-accent)", padding:"0.625rem 1.5rem", borderRadius:"9999px", textDecoration:"none", boxShadow:"0 0 20px var(--color-accent-muted)" }}>
              Hire Me
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .desktop-header { display: block !important; }
        .mobile-header  { display: none  !important; }
        @media (max-width: 768px) {
          .desktop-header { display: none !important; }
          .mobile-header  { display: flex !important; }
        }
      `}</style>
    </>
  )
}