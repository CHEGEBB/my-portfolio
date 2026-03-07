"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/context/theme-context"
import ReactConfetti from "react-confetti"
import toast, { Toaster } from "react-hot-toast"
import { TypeAnimation } from "react-type-animation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

// ── Floating underline field ─────────────────────────────────────────────────
function Field({ label, name, type = "text", value, onChange, rows }: {
  label: string; name: string; type?: string
  value: string; onChange: (e: any) => void; rows?: number
}) {
  const { theme } = useTheme()
  const [focused, setFocused] = useState(false)
  const filled = value.length > 0
  const Tag = rows ? "textarea" : "input"

  return (
    <div style={{ position: "relative", paddingTop: "1.25rem" }}>
      <label style={{
        position: "absolute", left: 0,
        top: focused || filled ? 0 : rows ? "1.75rem" : "50%",
        transform: focused || filled ? "none" : rows ? "none" : "translateY(-50%)",
        fontFamily: "var(--font-mono)",
        fontSize: "clamp(.55rem,.8vw,.65rem)",
        letterSpacing: ".12em", textTransform: "uppercase",
        color: focused ? theme.colors.accent : theme.colors.textMuted,
        transition: "all .22s cubic-bezier(.16,1,.3,1)",
        pointerEvents: "none", zIndex: 2,
      }}>{label}</label>
      <Tag
        // @ts-ignore
        type={type} name={name} value={value} onChange={onChange}
        rows={rows} required
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", background: "transparent", border: "none",
          borderBottom: `1px solid ${focused ? theme.colors.accent : theme.colors.surfaceBorder}`,
          padding: ".625rem 0",
          fontFamily: "var(--font-body)", fontSize: "clamp(.875rem,1.4vw,1rem)",
          color: theme.colors.textPrimary, outline: "none",
          resize: rows ? "none" as const : undefined,
          minHeight: rows ? `${rows * 1.8}rem` : undefined,
          borderRadius: 0, display: "block",
          transition: "border-color .2s ease",
        }}
      />
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        height: 2, width: focused ? "100%" : "0%",
        background: theme.colors.accent,
        transition: "width .35s cubic-bezier(.16,1,.3,1)",
        pointerEvents: "none",
      }}/>
    </div>
  )
}

// ── Paint wipe entrance ──────────────────────────────────────────────────────
function PaintWipe({ gone, color }: { gone: boolean; color: string }) {
  return (
    <>
      <div aria-hidden style={{
        position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none",
        background: color,
        transform: gone ? "translateY(-105%)" : "translateY(0%)",
        transition: gone ? "transform 1s cubic-bezier(.86,0,.07,1)" : "none",
        willChange: "transform",
      }}>
        <div style={{
          position: "absolute", bottom: -40, left: 0, right: 0, height: 80,
          background: "inherit",
          clipPath: "polygon(0 100%,3% 40%,8% 0,16% 50%,24% 8%,33% 58%,42% 4%,50% 48%,58% 6%,66% 53%,74% 10%,82% 56%,90% 4%,96% 44%,100% 100%)",
        }}/>
      </div>
      <div aria-hidden style={{
        position: "fixed", inset: 0, zIndex: 49, pointerEvents: "none",
        background: color, opacity: .45,
        transform: gone ? "translateY(-105%)" : "translateY(0%)",
        transition: gone ? "transform 1.15s cubic-bezier(.86,0,.07,1) .06s" : "none",
        willChange: "transform",
      }}/>
    </>
  )
}

const toastStyle = (theme: any) => ({
  background: theme.colors.surface,
  border: `1px solid ${theme.colors.surfaceBorder}`,
  color: theme.colors.textPrimary,
  fontFamily: "var(--font-mono)",
  fontSize: ".75rem", borderRadius: 0,
})

// ── Contact detail row ───────────────────────────────────────────────────────
function ContactRow({ label, value, href, delay, acc, border, prim, revealed }: any) {
  return (
    <a href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      style={{
        display: "grid", gridTemplateColumns: "5rem 1fr",
        alignItems: "center", gap: "1rem",
        padding: "clamp(.875rem,1.5vw,1.25rem) 0",
        borderBottom: `1px solid ${border}`,
        textDecoration: "none",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateX(0)" : "translateX(20px)",
        transition: `opacity .6s ease ${delay}s, transform .6s cubic-bezier(.16,1,.3,1) ${delay}s`,
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = ".45"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
    >
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.5rem,.75vw,.65rem)", letterSpacing: ".1em", textTransform: "uppercase", color: acc }}>{label}</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "clamp(.82rem,1.3vw,1rem)", color: prim, wordBreak: "break-all" }}>{value}</span>
    </a>
  )
}

// ── Success overlay ──────────────────────────────────────────────────────────
function SuccessState({ acc, muted, prim, border, isDark, onReset }: {
  acc: string; muted: string; prim: string; border: string; isDark: boolean
  onReset: () => void
}) {
  const [show, setShow] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShow(true), 60); return () => clearTimeout(t) }, [])

  return (
    <div style={{
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0)" : "translateY(24px)",
      transition: "opacity .65s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)",
    }}>
      {/* Big tick */}
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        border: `2px solid ${acc}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "2rem",
        boxShadow: `0 0 40px ${acc}33`,
        animation: "tickPop .6s cubic-bezier(.34,1.56,.64,1) .15s both",
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={acc} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ animation: "drawCheck .5s ease .35s both", strokeDasharray: 30, strokeDashoffset: 30 }}>
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      {/* Heading */}
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(2.8rem,7vw,5.5rem)",
        fontWeight: 800, letterSpacing: "-.045em", lineHeight: .88,
        marginBottom: "1.25rem",
        animation: "slideUp .7s cubic-bezier(.16,1,.3,1) .1s both",
      }}>
        <span style={{ display: "block", color: prim }}>Message</span>
        <span style={{ display: "block", color: "transparent", WebkitTextStroke: `2px ${acc}`, textShadow: `0 0 60px ${acc}44` }}>received. ⚡</span>
      </div>

      {/* Sub */}
      <p style={{
        fontFamily: "var(--font-body)", fontSize: "clamp(.875rem,1.4vw,1rem)",
        color: muted, lineHeight: 1.72, marginBottom: "2rem",
        animation: "slideUp .7s cubic-bezier(.16,1,.3,1) .2s both",
        maxWidth: 380,
      }}>
        Thanks for reaching out! I&apos;ll personally get back to you within 24 hours.
        Looking forward to chatting.
      </p>

      {/* Animated accent bar */}
      <div style={{
        height: 2, marginBottom: "2.5rem",
        background: `linear-gradient(to right, ${acc}, ${acc}44, transparent)`,
        animation: "drawLine 1s cubic-bezier(.16,1,.3,1) .4s both",
      }}/>

      {/* What happens next */}
      <div style={{
        display: "flex", flexDirection: "column", gap: ".75rem",
        marginBottom: "2.5rem",
        animation: "slideUp .6s cubic-bezier(.16,1,.3,1) .35s both",
      }}>
        {[
          { num: "01", text: "You'll receive a confirmation email shortly" },
          { num: "02", text: "I'll review your message and prepare a thoughtful reply" },
          { num: "03", text: "Expect a response within 24 hours, usually much sooner" },
        ].map(step => (
          <div key={step.num} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: ".6rem",
              letterSpacing: ".1em", color: acc, flexShrink: 0, marginTop: ".15rem",
            }}>{step.num}</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "clamp(.82rem,1.2vw,.9rem)", color: muted, lineHeight: 1.6 }}>
              {step.text}
            </span>
          </div>
        ))}
      </div>

      {/* Send another button */}
      <button
        onClick={onReset}
        style={{
          fontFamily: "var(--font-mono)", fontSize: "clamp(.6rem,.85vw,.7rem)",
          letterSpacing: ".1em", textTransform: "uppercase",
          color: muted, background: "transparent",
          border: `1px solid ${border}`, padding: ".5rem 1.25rem",
          borderRadius: 9999, cursor: "pointer",
          transition: "color .2s ease, border-color .2s ease",
          animation: "slideUp .6s cubic-bezier(.16,1,.3,1) .45s both",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.color = acc; el.style.borderColor = acc
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.color = muted; el.style.borderColor = border
        }}
      >
        ← Send another message
      </button>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const { theme } = useTheme()
  const isDark    = theme.mode === "dark"

  const [painted,   setPainted]   = useState(false)
  const [revealed,  setRevealed]  = useState(false)
  const [confetti,  setConfetti]  = useState(false)
  const [winSize,   setWinSize]   = useState({ width: 0, height: 0 })
  const [formDone,  setFormDone]  = useState(false)
  const [sending,   setSending]   = useState(false)
  const [confettiDone, setConfettiDone] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })

  useEffect(() => {
    setWinSize({ width: window.innerWidth, height: window.innerHeight })
    const onResize = () => setWinSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener("resize", onResize, { passive: true })
    const t1 = setTimeout(() => setPainted(true),  80)
    const t2 = setTimeout(() => setRevealed(true), 900)
    return () => {
      window.removeEventListener("resize", onResize)
      clearTimeout(t1); clearTimeout(t2)
    }
  }, [])

  // Stop confetti after 6s but keep success state until user resets
  useEffect(() => {
    if (!confetti) return
    const t = setTimeout(() => setConfettiDone(true), 6000)
    return () => clearTimeout(t)
  }, [confetti])

  const onChange = (e: React.ChangeEvent<any>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const onReset = () => {
    setFormDone(false)
    setConfetti(false)
    setConfettiDone(false)
    setForm({ name: "", email: "", subject: "", message: "" })
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    const tid = toast.loading("Sending...", { style: toastStyle(theme) })
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      toast.dismiss(tid)
      if (res.ok) {
        setFormDone(true)
        setConfetti(true)
        setConfettiDone(false)
      } else {
        toast.error("Failed to send. Try again.", {
          style: { ...toastStyle(theme), border: "1px solid #f87171", color: "#f87171" },
        })
      }
    } catch {
      toast.dismiss(tid)
      toast.error("Connection error.", {
        style: { ...toastStyle(theme), border: "1px solid #f87171", color: "#f87171" },
      })
    } finally { setSending(false) }
  }

  const acc    = theme.colors.accent
  const muted  = theme.colors.textMuted
  const prim   = theme.colors.textPrimary
  const border = theme.colors.surfaceBorder
  const bg     = theme.colors.bg

  const paintColor = isDark
    ? `color-mix(in srgb, ${acc} 14%, #08080F)`
    : `color-mix(in srgb, ${acc} 11%, #EDEDF5)`

  const s = (i: number): React.CSSProperties => ({
    opacity: revealed ? 1 : 0,
    transform: revealed ? "translateY(0)" : "translateY(32px)",
    transition: `opacity .7s ease ${.08 + i * .1}s, transform .8s cubic-bezier(.16,1,.3,1) ${.08 + i * .1}s`,
  })

  const CONTACTS = [
    { label: "Email",    value: "chegephil24@gmail.com",  href: "mailto:chegephil24@gmail.com" },
    { label: "Location", value: "Eldoret, Kenya",          href: "#" },
    { label: "GitHub",   value: "github.com/CHEGEBB",      href: "https://github.com/CHEGEBB" },
    { label: "LinkedIn", value: "linkedin.com/in/chegebb", href: "https://linkedin.com/in/chegebb" },
    { label: "Twitter",  value: "twitter.com/chegebb",     href: "https://twitter.com/chegebb" },
  ]

  return (
    <div style={{ minHeight: "100svh", background: bg, color: prim }}>
      <Toaster position="top-right"/>

      {/* Confetti — only while active and window measured */}
      {confetti && !confettiDone && winSize.width > 0 && (
        <ReactConfetti
          width={winSize.width} height={winSize.height}
          colors={[acc, "#fff", "#a5b4fc", "#fcd34d", "#6ee7b7", "#f9a8d4"]}
          numberOfPieces={420}
          recycle={false}
          gravity={0.18}
          style={{ position: "fixed", zIndex: 9999, pointerEvents: "none" }}
        />
      )}

      <PaintWipe gone={painted} color={paintColor}/>
      <Navbar/>

      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse 70% 60% at 70% 5%, ${acc}0d 0%, transparent 65%)`,
      }}/>

      <main style={{
        position: "relative", zIndex: 1,
        maxWidth: 1280, margin: "0 auto",
        padding: "clamp(6rem,12vw,10rem) clamp(1.25rem,5vw,3rem) clamp(4rem,8vw,6rem)",
        opacity: revealed ? 1 : 0, transition: "opacity .45s ease",
      }}>

        {/* ── HERO ── */}
        <div style={{ marginBottom: "clamp(4rem,9vw,7rem)" }}>
          <p style={{
            ...s(0),
            fontFamily: "var(--font-mono)", fontSize: "clamp(.6rem,1vw,.72rem)",
            letterSpacing: ".14em", textTransform: "uppercase", color: acc,
            marginBottom: "clamp(1rem,2vw,1.5rem)",
            display: "flex", alignItems: "center", gap: ".5rem",
          }}>
            <span style={{ width: 20, height: 1, background: acc, display: "inline-block", flexShrink: 0 }}/>
            Get In Touch
          </p>

          <h1 style={{
            ...s(1),
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.8rem,10vw,9rem)",
            fontWeight: 800, letterSpacing: "-.045em", lineHeight: .86,
            margin: "0 0 clamp(1.5rem,3vw,2.5rem)",
          }}>
            <span style={{ display: "block", color: prim }}>Let&apos;s build</span>
            <span style={{ display: "block", color: "transparent", WebkitTextStroke: `2px ${acc}`, textShadow: `0 0 80px ${acc}44` }}>
              <TypeAnimation
                sequence={["something.", 2200, "the future.", 2200, "together.", 2200, "amazing.", 2200]}
                wrapper="span" repeat={Infinity} cursor
              />
            </span>
          </h1>

          <p style={{
            ...s(2),
            fontFamily: "var(--font-body)", fontSize: "clamp(.875rem,1.4vw,1rem)",
            color: muted, lineHeight: 1.75, maxWidth: "min(520px,100%)", margin: "0 0 1.5rem",
          }}>
            Open to freelance projects, full-time roles, and interesting collaborations.
            I reply within 24 hours — usually much faster.
          </p>

          <div style={{ ...s(2), display: "flex", alignItems: "center", gap: ".625rem" }}>
            <span style={{
              display: "inline-block", width: 8, height: 8, borderRadius: "50%",
              background: "#22c55e", flexShrink: 0,
              animation: "aPulse 2s ease-in-out infinite",
            }}/>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.58rem,.85vw,.68rem)", color: muted, letterSpacing: ".08em" }}>
              Available for new projects
            </span>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{
          ...s(3),
          height: 1,
          background: `linear-gradient(to right, ${acc}55, ${acc}11, transparent)`,
          marginBottom: "clamp(4rem,8vw,6rem)",
        }}/>

        {/* ── FORM + CONTACT INFO ── */}
        <div className="c-grid" style={{
          display: "grid",
          gap: "clamp(3.5rem,8vw,8rem)",
          marginBottom: "clamp(5rem,10vw,8rem)",
          alignItems: "start",
        }}>

          {/* Left: Form OR Success */}
          <div style={s(3)}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "clamp(.55rem,.8vw,.65rem)",
              letterSpacing: ".14em", textTransform: "uppercase", color: acc,
              marginBottom: "1.75rem", display: "flex", alignItems: "center", gap: ".5rem",
            }}>
              <span style={{ width: 14, height: 1, background: acc, display: "inline-block" }}/>
              {formDone ? "All done" : "Send a message"}
            </p>

            {formDone ? (
              <SuccessState
                acc={acc} muted={muted} prim={prim} border={border}
                isDark={isDark} onReset={onReset}
              />
            ) : (
              <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "clamp(1rem,2vw,1.75rem)" }}>
                <div className="c-row" style={{ display: "grid", gap: "clamp(1rem,2vw,2rem)" }}>
                  <Field label="Name"  name="name"  value={form.name}  onChange={onChange}/>
                  <Field label="Email" name="email" type="email" value={form.email} onChange={onChange}/>
                </div>
                <Field label="Subject" name="subject" value={form.subject} onChange={onChange}/>
                <Field label="Message" name="message" rows={5} value={form.message} onChange={onChange}/>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: ".5rem", flexWrap: "wrap", gap: "1rem" }}>
                  <button
                    type="submit" disabled={sending}
                    style={{
                      fontFamily: "var(--font-body)", fontSize: "clamp(.8rem,1.2vw,.9375rem)",
                      fontWeight: 600, letterSpacing: ".02em",
                      color: isDark ? "#000" : "#fff", background: acc, border: "none",
                      padding: ".8rem clamp(1.5rem,2.5vw,2.5rem)", borderRadius: 9999,
                      cursor: sending ? "not-allowed" : "pointer",
                      display: "inline-flex", alignItems: "center", gap: ".5rem",
                      boxShadow: `0 0 32px ${acc}44`,
                      transition: "transform .2s ease, opacity .2s ease",
                      opacity: sending ? .6 : 1,
                    }}
                    onMouseEnter={e => { if (!sending) (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.02)" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "" }}
                  >
                    {sending ? (
                      <span style={{
                        display: "inline-block", width: 16, height: 16,
                        borderRadius: "50%",
                        borderWidth: 2, borderStyle: "solid",
                        borderColor: "rgba(0,0,0,.25)",
                        borderTopColor: "currentColor",
                        animation: "spin .7s linear infinite",
                      }}/>
                    ) : (
                      <>
                        Send Message
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                      </>
                    )}
                  </button>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.55rem,.8vw,.65rem)", color: muted, letterSpacing: ".06em" }}>
                    Replies within 24h
                  </span>
                </div>
              </form>
            )}
          </div>

          {/* Right: Contact details */}
          <div>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "clamp(.55rem,.8vw,.65rem)",
              letterSpacing: ".14em", textTransform: "uppercase", color: acc,
              marginBottom: "1.75rem", display: "flex", alignItems: "center", gap: ".5rem",
            }}>
              <span style={{ width: 14, height: 1, background: acc, display: "inline-block" }}/>
              Contact details
            </p>

            {CONTACTS.map((item, idx) => (
              <ContactRow
                key={item.label}
                {...item}
                delay={.5 + idx * .07}
                acc={acc} border={border} prim={prim} revealed={revealed}
              />
            ))}

            <div style={{ display: "flex", gap: "2.5rem", marginTop: "clamp(2rem,4vw,3rem)" }}>
              {[
                { v: "24h",  l: "Response time" },
                { v: "100%", l: "Projects delivered" },
                { v: "3+",   l: "Years building" },
              ].map((st, i) => (
                <div key={st.l} style={{ ...s(5 + i) }}>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.8rem,4vw,3rem)",
                    fontWeight: 800, letterSpacing: "-.04em",
                    color: acc, lineHeight: 1,
                  }}>{st.v}</div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(.5rem,.7vw,.6rem)",
                    color: muted, marginTop: ".25rem", letterSpacing: ".06em",
                  }}>{st.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM STRIP ── */}
        <div style={{
          ...s(6),
          borderTop: `1px solid ${border}`,
          paddingTop: "clamp(2.5rem,5vw,4rem)",
          display: "flex", flexWrap: "wrap",
          justifyContent: "space-between", alignItems: "center",
          gap: "2rem",
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.55rem,.8vw,.65rem)", letterSpacing: ".14em", textTransform: "uppercase", color: acc, margin: "0 0 .75rem" }}>
              Current status
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "aPulse 2s ease-in-out infinite", flexShrink: 0 }}/>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "clamp(.875rem,1.3vw,1rem)", color: prim }}>
                Open to freelance &amp; full-time opportunities
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
            {[
              { label: "GitHub",   href: "https://github.com/CHEGEBB" },
              { label: "LinkedIn", href: "https://linkedin.com/in/chegebb" },
              { label: "Twitter",  href: "https://twitter.com/chegebb" },
              { label: "Email",    href: "mailto:chegephil24@gmail.com" },
            ].map(lnk => (
              <a key={lnk.label} href={lnk.href} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "var(--font-mono)", fontSize: "clamp(.6rem,.85vw,.7rem)",
                letterSpacing: ".08em", textTransform: "uppercase",
                color: muted, border: `1px solid ${border}`,
                padding: ".4rem .9rem", borderRadius: 9999,
                textDecoration: "none",
                transition: "color .2s ease, border-color .2s ease",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = acc; el.style.borderColor = acc }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = muted; el.style.borderColor = border }}
              >{lnk.label}</a>
            ))}
          </div>
        </div>
      </main>

      <Footer/>

      <style jsx global>{`
        .c-grid { grid-template-columns: 1fr; }
        .c-row  { grid-template-columns: 1fr; }

        @media (min-width: 768px) {
          .c-grid { grid-template-columns: 1fr 1fr; }
          .c-row  { grid-template-columns: 1fr 1fr; }
        }

        @keyframes spin      { to { transform: rotate(360deg); } }
        @keyframes fadeIn    { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp   { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes drawLine  { from { width: 0; } to { width: 100%; } }
        @keyframes aPulse    { 0%, 100% { box-shadow: 0 0 0 0 #22c55e55; } 70% { box-shadow: 0 0 0 8px transparent; } }
        @keyframes tickPop   { from { opacity: 0; transform: scale(.4); } to { opacity: 1; transform: scale(1); } }
        @keyframes drawCheck { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  )
}