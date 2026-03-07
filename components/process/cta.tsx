"use client"

import { useRef } from "react"
import { useTheme } from "@/context/theme-context"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, Mail, Github } from "lucide-react"

export function ProcessCTA() {
  const { theme }   = useTheme()
  const sectionRef  = useRef<HTMLDivElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const inView      = useInView(sectionRef, { once: true, margin: "-10%" })
  const isDark      = theme.mode === "dark"
  const acc         = theme.colors.accent

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", background: "var(--color-bg)", overflow: "hidden" }}
    >
      {/* ── Parallax banner ── */}
      <div style={{
        position: "relative",
        height: "clamp(480px,65vh,720px)",
        overflow: "hidden",
        display: "flex", alignItems: "flex-end",
      }}>
        {/* Parallax image */}
        <motion.div
          ref={parallaxRef}
          style={{
            position: "absolute", inset: "-15%",
            backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1800&q=80&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            y: bgY,
            willChange: "transform",
          }}
        />

        {/* Colour grade */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${acc}44 0%, rgba(0,0,0,0.8) 70%)`,
          mixBlendMode: "multiply",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.52)" }} />

        {/* Bottom fade to bg */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
          background: `linear-gradient(to bottom, transparent, ${isDark ? "#07070F" : "#F0F0FA"})`,
          pointerEvents: "none",
        }} />

        {/* Text */}
        <div style={{
          position: "relative", zIndex: 5,
          padding: "0 clamp(1.5rem,6vw,5rem) clamp(3rem,6vw,5rem)",
          width: "100%",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 20, height: 1, background: acc }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.56rem",
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
              }}>Ready to work</span>
            </div>

            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem,9vw,8rem)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.88,
              margin: "0 0 1.5rem", color: "#fff",
            }}>
              You've seen<br />
              <span style={{
                color: "transparent",
                WebkitTextStroke: `2px ${acc}`,
                textShadow: `0 0 60px ${acc}66`,
              }}>the process.</span>
            </h2>
          </motion.div>
        </div>
      </div>

      {/* ── Below banner ── */}
      <div style={{
        padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,5rem)",
        display: "grid",
        gridTemplateColumns: "1fr clamp(220px,30vw,380px)",
        gap: "clamp(2rem,4vw,4rem)",
        alignItems: "start",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        >
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.4rem,3vw,2.5rem)",
            fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1,
            margin: "0 0 1.25rem", color: "var(--color-text-primary)",
          }}>
            Now let's talk<br />about yours.
          </p>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.82rem,1.1vw,0.95rem)",
            color: "var(--color-text-muted)", lineHeight: 1.75,
            margin: 0, maxWidth: 480,
          }}>
            Every great project starts with one honest conversation. No pitch decks, no sales calls. Just two people figuring out if we're a fit.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Email */}
          <Link
            href="mailto:chegephil24@gmail.com"
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "1.1rem 1.25rem",
              border: `1px solid ${acc}44`,
              background: isDark ? `${acc}0d` : `${acc}08`,
              textDecoration: "none",
              transition: "all 0.25s ease",
              color: "inherit",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.background = isDark ? `${acc}18` : `${acc}12`
              el.style.borderColor = `${acc}88`
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.background = isDark ? `${acc}0d` : `${acc}08`
              el.style.borderColor = `${acc}44`
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Mail size={14} color={acc} strokeWidth={1.5} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.08em", color: acc }}>
                chegephil24@gmail.com
              </span>
            </div>
            <ArrowUpRight size={14} color={acc} strokeWidth={1.5} />
          </Link>

          {/* GitHub */}
          <Link
            href="https://github.com/CHEGEBB"
            target="_blank"
            rel="noopener"
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "1.1rem 1.25rem",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              textDecoration: "none",
              transition: "all 0.25s ease",
              color: "inherit",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = `${acc}55`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Github size={14} color="var(--color-text-muted)" strokeWidth={1.5} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.08em", color: "var(--color-text-muted)" }}>
                github.com/CHEGEBB
              </span>
            </div>
            <ArrowUpRight size={14} color="var(--color-text-muted)" strokeWidth={1.5} />
          </Link>

          {/* Quick links */}
          <div style={{
            display: "flex", gap: "1rem", paddingTop: "0.5rem",
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
          }}>
            {[
              { label: "View Work", href: "/portfolio" },
              { label: "Services", href: "/services" },
            ].map(lk => (
              <Link key={lk.href} href={lk.href} style={{
                fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--color-text-muted)",
                display: "flex", alignItems: "center", gap: "0.35rem",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = acc)}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-muted)")}
              >
                {lk.label}
                <ArrowUpRight size={10} strokeWidth={2} />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}