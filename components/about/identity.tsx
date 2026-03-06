"use client"

import { useRef } from "react"
import { useTheme } from "@/context/theme-context"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, Award, MapPin, Github, Mail } from "lucide-react"

const CERTS = [
  { name: "ALX Software Engineering",    year: "2024", color: "#5567F7" },
  { name: "IBM Cybersecurity Fundamentals", year: "2024", color: "#45D2B0" },
  { name: "Cisco Intro to Cybersecurity",   year: "2024", color: "#00D4FF" },
  { name: "Codsoft Full-Stack Dev",         year: "2024", color: "#FF6B9D" },
  { name: "PLP Software Development",       year: "2025", color: "#AAFF00" },
  { name: "Prodigy InfoTech MERN Stack",    year: "2024", color: "#F5A623" },
]

const INTERESTS = [
  "Capture The Flag (CTF)",
  "Penetration Testing",
  "Open-Source Development",
  "React Native",
  "DevOps Automation",
  "Tech Entrepreneurship",
  "Low-bandwidth UX",
  "AI Integration",
]

export function AboutIdentity() {
  const { theme }   = useTheme()
  const sectionRef  = useRef<HTMLDivElement>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const inView      = useInView(sectionRef, { once: true, margin: "-10%" })
  const isDark      = theme.mode === "dark"
  const acc         = theme.colors.accent

  // Parallax on the image behind
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "var(--color-bg)",
        overflow: "hidden",
      }}
    >
      {/* ── PARALLAX IDENTITY BANNER ── */}
      <div style={{
        position: "relative",
        height: "clamp(480px,65vh,720px)",
        overflow: "hidden",
        display: "flex", alignItems: "center",
      }}>
        {/* Parallax image */}
        <motion.div
          ref={parallaxRef}
          style={{
            position: "absolute", inset: "-15%",
            backgroundImage: "url('https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1800&q=80&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            y: bgY,
            willChange: "transform",
          }}
        />

        {/* Colour grade */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${acc}44 0%, rgba(0,0,0,0.75) 60%)`,
          mixBlendMode: "multiply",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.5)",
        }} />

        {/* Text content */}
        <div style={{
          position: "relative", zIndex: 5,
          padding: "0 clamp(1.5rem,6vw,5rem)",
          width: "100%",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              marginBottom: "1.25rem",
            }}>
              <MapPin size={12} strokeWidth={2} color={acc} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.56rem",
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
              }}>Eldoret / Nyeri, Kenya · Available Worldwide</span>
            </div>

            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem,9vw,8rem)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.88,
              margin: "0 0 1.5rem", color: "#fff",
            }}>
              Built in Kenya.<br />
              <span style={{
                color: "transparent",
                WebkitTextStroke: `2px ${acc}`,
                textShadow: `0 0 60px ${acc}66`,
              }}>Built for everyone.</span>
            </h2>

            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.875rem,1.3vw,1.05rem)",
              color: "rgba(255,255,255,0.65)", lineHeight: 1.7,
              maxWidth: 500, margin: "0 0 2rem",
            }}>
              I build for low-bandwidth networks, budget Android devices, and users who
              need reliability over flashiness. That constraint makes everything I build
              leaner, faster, and better for everyone.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/contact" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                fontFamily: "var(--font-body)", fontSize: "0.9rem",
                fontWeight: 700, letterSpacing: "0.02em",
                color: "#07070F", background: acc,
                padding: "0.75rem 1.75rem", borderRadius: "9999px",
                textDecoration: "none",
                boxShadow: `0 0 32px ${acc}66`,
                transition: "all 0.3s ease",
              }}>
                Work With Me <ArrowUpRight size={15} strokeWidth={2.5} />
              </Link>
              <a href="https://github.com/CHEGEBB" target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                fontFamily: "var(--font-body)", fontSize: "0.9rem",
                fontWeight: 600, letterSpacing: "0.02em",
                color: "rgba(255,255,255,0.8)",
                border: "1.5px solid rgba(255,255,255,0.25)",
                padding: "0.75rem 1.75rem", borderRadius: "9999px",
                textDecoration: "none",
                background: "rgba(255,255,255,0.07)",
                transition: "all 0.3s ease",
              }}>
                <Github size={15} strokeWidth={2} />
                GitHub
              </a>
            </div>
          </motion.div>
        </div>

        {/* Corner brackets */}
        {[
          { top: "1.5rem", left: "1.5rem",  borderTop: `1.5px solid ${acc}`, borderLeft: `1.5px solid ${acc}` },
          { top: "1.5rem", right: "1.5rem", borderTop: `1.5px solid ${acc}`, borderRight: `1.5px solid ${acc}` },
          { bottom: "1.5rem", left: "1.5rem",  borderBottom: `1.5px solid ${acc}`, borderLeft: `1.5px solid ${acc}` },
          { bottom: "1.5rem", right: "1.5rem", borderBottom: `1.5px solid ${acc}`, borderRight: `1.5px solid ${acc}` },
        ].map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 0.6 } : {}}
            transition={{ delay: 0.6 + i * 0.1 }}
            style={{ position: "absolute", width: 24, height: 24, zIndex: 6, ...s }}
          />
        ))}
      </div>

      {/* ── CERTIFICATIONS GRID ── */}
      <div style={{
        padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,5rem)",
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            display: "flex", alignItems: "center", gap: "0.6rem",
            marginBottom: "clamp(2rem,4vw,3.5rem)",
          }}
        >
          <Award size={14} strokeWidth={1.75} color={acc} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.58rem",
            letterSpacing: "0.16em", textTransform: "uppercase", color: acc,
          }}>Certifications</span>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(200px,26vw,320px), 1fr))",
          gap: "1px",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
          overflow: "hidden",
        }}>
          {CERTS.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 + 0.2 }}
              whileHover={{ background: isDark ? `${cert.color}0e` : `${cert.color}09` }}
              style={{
                padding: "clamp(1.25rem,2vw,1.75rem)",
                borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                background: "var(--color-bg)",
                position: "relative", overflow: "hidden",
                transition: "background 0.3s ease",
              }}
            >
              {/* Top accent */}
              <div style={{
                position: "absolute", top: 0, left: 0,
                width: "60%", height: 1,
                background: `linear-gradient(90deg, ${cert.color}, transparent)`,
              }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(0.85rem,1.3vw,1rem)",
                    fontWeight: 700, letterSpacing: "-0.02em",
                    color: "var(--color-text-primary)",
                    marginBottom: "0.35rem",
                    lineHeight: 1.3,
                  }}>{cert.name}</div>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.48rem",
                    letterSpacing: "0.1em", color: cert.color,
                  }}>{cert.year}</div>
                </div>
                <div style={{
                  width: 28, height: 28, flexShrink: 0,
                  border: `1px solid ${cert.color}44`,
                  background: `${cert.color}0d`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: cert.color,
                }}>
                  <Award size={13} strokeWidth={1.75} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── INTERESTS MARQUEE ── */}
      <div style={{
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
        padding: "clamp(1.5rem,3vw,2.5rem) 0",
        overflow: "hidden",
      }}>
        <div style={{
          display: "flex",
          animation: "interestScroll 18s linear infinite",
          whiteSpace: "nowrap",
          width: "max-content",
        }}>
          {[...INTERESTS, ...INTERESTS, ...INTERESTS].map((item, i) => (
            <div key={i} style={{
              display: "inline-flex", alignItems: "center",
              gap: "clamp(1rem,3vw,2.5rem)",
              padding: "0 clamp(1rem,3vw,2.5rem)",
            }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(0.9rem,2vw,1.5rem)",
                fontWeight: 800, letterSpacing: "-0.03em",
                color: i % 2 === 0 ? "var(--color-text-primary)" : "transparent",
                WebkitTextStroke: i % 2 === 0 ? "none" : `1px ${acc}`,
              }}>{item}</span>
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: acc, opacity: 0.4, flexShrink: 0,
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── FINAL CTA STRIP ── */}
      <div style={{
        padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,5rem)",
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap", gap: "1.5rem",
      }}>
        <div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem,4vw,3rem)",
            fontWeight: 800, letterSpacing: "-0.04em",
            color: "var(--color-text-primary)", lineHeight: 1,
          }}>Ready to build something?</div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "0.56rem",
            letterSpacing: "0.12em", color: acc, marginTop: "0.5rem",
          }}>chegephil24@gmail.com · +254 796 562 713</div>
        </div>
        <Link href="/contact" style={{
          display: "inline-flex", alignItems: "center", gap: "0.6rem",
          fontFamily: "var(--font-body)", fontSize: "0.95rem",
          fontWeight: 700, letterSpacing: "0.01em",
          color: "var(--color-accent-fg)",
          background: acc,
          padding: "0.875rem 2rem", borderRadius: "9999px",
          textDecoration: "none",
          boxShadow: `0 0 40px ${acc}55`,
          transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
          Start a Project <ArrowUpRight size={16} strokeWidth={2.5} />
        </Link>
      </div>

      <style jsx global>{`
        @keyframes interestScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  )
}