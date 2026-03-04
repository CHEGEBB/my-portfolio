"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "@/context/theme-context"
import ReactConfetti from "react-confetti"
import toast, { Toaster } from "react-hot-toast"
import { TypeAnimation } from "react-type-animation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

const API_URL        = "https://portfolio-api-2-c57s.onrender.com/api/contact"
const GITHUB_USER    = "CHEGEBB"

interface GHUser  { followers: number; public_repos: number }
interface GHRepo  { id: number; name: string; description: string; html_url: string; stargazers_count: number; language: string; pushed_at: string }
interface GHEvent { id: string; type: string; created_at: string; repo: { name: string } }

// ── Floating underline field ───────────────────────────────
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

// ── Paint wipe ─────────────────────────────────────────────
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

// ── Toast style helper ─────────────────────────────────────
const ts = (theme: any) => ({
  background: theme.colors.surface,
  border: `1px solid ${theme.colors.surfaceBorder}`,
  color: theme.colors.textPrimary,
  fontFamily: "var(--font-mono)",
  fontSize: ".75rem", borderRadius: 0,
})

export default function ContactPage() {
  const { theme } = useTheme()
  const isDark    = theme.mode === "dark"

  const [painted,  setPainted]  = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [winSize,  setWinSize]  = useState({ width: 0, height: 0 })
  const [formDone, setFormDone] = useState(false)
  const [sending,  setSending]  = useState(false)
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })

  const [ghUser,    setGhUser]    = useState<GHUser | null>(null)
  const [repos,     setRepos]     = useState<GHRepo[]>([])
  const [events,    setEvents]    = useState<GHEvent[]>([])
  const [ghLoading, setGhLoading] = useState(true)

  useEffect(() => {
    setWinSize({ width: window.innerWidth, height: window.innerHeight })
    const t1 = setTimeout(() => setPainted(true),  80)
    const t2 = setTimeout(() => setRevealed(true), 980)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const [uR, rR, eR] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USER}`),
          fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`),
          fetch(`https://api.github.com/users/${GITHUB_USER}/events?per_page=8`),
        ])
        if (uR.ok) setGhUser(await uR.json())
        if (rR.ok) {
          const all: GHRepo[] = await rR.json()
          setRepos([...all].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 4))
        }
        if (eR.ok) setEvents(await eR.json())
      } catch {} finally { setGhLoading(false) }
    })()
  }, [])

  const onChange = (e: React.ChangeEvent<any>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSending(true)
    const tid = toast.loading("Sending...", { style: ts(theme) })
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      toast.dismiss(tid)
      if (res.ok) {
        setFormDone(true)
        setForm({ name: "", email: "", subject: "", message: "" })
        setConfetti(true)
        toast.success("Message sent! Replying within 24h ⚡", {
          duration: 5000,
          style: { ...ts(theme), border: `1px solid ${theme.colors.accent}`, color: theme.colors.accent },
        })
        setTimeout(() => { setFormDone(false); setConfetti(false) }, 7500)
      } else {
        toast.error("Failed to send. Try again.", { style: { ...ts(theme), border: "1px solid #f87171", color: "#f87171" } })
      }
    } catch {
      toast.dismiss(tid)
      toast.error("Connection error.", { style: { ...ts(theme), border: "1px solid #f87171", color: "#f87171" } })
    } finally { setSending(false) }
  }

  const repoAge = (r: GHRepo) => {
    const d = Math.floor((Date.now() - new Date(r.pushed_at).getTime()) / 86400000)
    return d <= 7 ? "Active" : d <= 30 ? "Recent" : "Archived"
  }
  const fmtEv = (e: GHEvent) => ({
    PushEvent: "Pushed code", CreateEvent: "Created repo",
    WatchEvent: "Starred repo", ForkEvent: "Forked repo",
    IssuesEvent: "Worked on issue", PullRequestEvent: "Pull request",
  }[e.type] ?? e.type.replace("Event", ""))

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
    transform: revealed ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .7s ease ${.1 + i * .1}s, transform .75s cubic-bezier(.16,1,.3,1) ${.1 + i * .1}s`,
  })

  return (
    <div style={{ minHeight: "100svh", background: bg, color: prim }}>
      <Toaster position="top-right"/>

      {confetti && (
        <ReactConfetti
          width={winSize.width} height={winSize.height}
          colors={[acc, "#fff", "#a5b4fc", "#fcd34d", "#6ee7b7"]}
          numberOfPieces={360} recycle={false}
          style={{ position: "fixed", zIndex: 9999, pointerEvents: "none" }}
        />
      )}

      <PaintWipe gone={painted} color={paintColor}/>

      <Navbar/>

      {/* Ambient glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: `radial-gradient(ellipse 65% 55% at 65% 10%, ${acc}0B 0%, transparent 65%)` }}/>

      <main style={{
        position: "relative", zIndex: 1,
        maxWidth: 1280, margin: "0 auto",
        padding: "clamp(6rem,12vw,10rem) clamp(1rem,4vw,3rem) clamp(4rem,8vw,6rem)",
        opacity: revealed ? 1 : 0, transition: "opacity .45s ease",
      }}>

        {/* ── HERO ─────────────────────────────────────────── */}
        <div className="c-hero" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "clamp(3rem,6vw,8rem)", alignItems: "end",
          marginBottom: "clamp(5rem,10vw,8rem)",
        }}>
          <div>
            <p style={{ ...s(0), fontFamily: "var(--font-mono)", fontSize: "clamp(.6rem,1vw,.72rem)", letterSpacing: ".14em", textTransform: "uppercase", color: acc, marginBottom: "clamp(1rem,2vw,1.75rem)", display: "flex", alignItems: "center", gap: ".5rem" }}>
              <span style={{ width: 20, height: 1, background: acc, display: "inline-block" }}/>
              Get In Touch
            </p>
            <h1 style={{ ...s(1), fontFamily: "var(--font-display)", fontSize: "clamp(3rem,9vw,8rem)", fontWeight: 800, letterSpacing: "-.04em", lineHeight: .88, margin: 0 }}>
              Let&apos;s build{" "}
              <span style={{ color: "transparent", WebkitTextStroke: `2px ${acc}`, display: "inline-block" }}>
                <TypeAnimation
                  sequence={["something.", 2000, "the future.", 2000, "together.", 2000, "amazing.", 2000]}
                  wrapper="span" repeat={Infinity} cursor
                />
              </span>
            </h1>
          </div>

          <div style={s(2)}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(.875rem,1.5vw,1.0625rem)", lineHeight: 1.75, color: muted, marginBottom: "2rem" }}>
              Open to freelance projects, full-time roles, and interesting collaborations.
              I reply within 24 hours — usually much faster.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: ".625rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "aPulse 2s ease-in-out infinite", flexShrink: 0 }}/>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.6rem,.85vw,.7rem)", color: muted, letterSpacing: ".08em" }}>Available for new projects</span>
            </div>
          </div>
        </div>

        {/* ── FORM + CONTACT INFO ───────────────────────────── */}
        <div className="c-main" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "clamp(4rem,8vw,10rem)",
          marginBottom: "clamp(5rem,10vw,8rem)",
        }}>
          {/* Form */}
          <div style={{ ...s(3) }}>
            {formDone ? (
              <div style={{ animation: "fadeIn .5s ease" }}>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3rem,7vw,5.5rem)",
                  fontWeight: 800, letterSpacing: "-.04em", lineHeight: .9,
                  color: acc, marginBottom: "1.5rem",
                  animation: "slideUp .75s cubic-bezier(.16,1,.3,1)",
                }}>
                  Message<br/>received. ⚡
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(.875rem,1.4vw,1rem)", color: muted, lineHeight: 1.7 }}>
                  I'll get back to you within 24 hours.
                </p>
                <div style={{ height: 2, background: `linear-gradient(to right, ${acc}, transparent)`, marginTop: "2rem", animation: "drawLine 1s cubic-bezier(.16,1,.3,1) .3s both" }}/>
              </div>
            ) : (
              <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "clamp(1rem,2vw,1.75rem)" }}>
                <div className="c-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(1rem,2vw,2rem)" }}>
                  <Field label="Name"  name="name"  value={form.name}  onChange={onChange}/>
                  <Field label="Email" name="email" type="email" value={form.email} onChange={onChange}/>
                </div>
                <Field label="Subject" name="subject" value={form.subject} onChange={onChange}/>
                <Field label="Message" name="message" rows={5} value={form.message} onChange={onChange}/>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: ".5rem", flexWrap: "wrap", gap: "1rem" }}>
                  <button type="submit" disabled={sending} style={{
                    fontFamily: "var(--font-body)", fontSize: "clamp(.8rem,1.2vw,.9375rem)", fontWeight: 600,
                    color: isDark ? "#000" : "#fff", background: acc, border: "none",
                    padding: ".75rem clamp(1.5rem,2.5vw,2.5rem)", borderRadius: 9999,
                    cursor: sending ? "not-allowed" : "pointer",
                    display: "inline-flex", alignItems: "center", gap: ".5rem",
                    boxShadow: `0 0 32px ${acc}44`,
                    transition: "transform .2s ease, opacity .2s ease",
                    opacity: sending ? .6 : 1,
                  }}
                  onMouseEnter={e => { if (!sending) (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "" }}
                  >
                    {sending
                      ? <div style={{ width: 16, height: 16, border: "2px solid rgba(0,0,0,.25)", borderTop: "2px solid currentColor", borderRadius: "50%", animation: "spin .7s linear infinite" }}/>
                      : <>Send Message <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></>
                    }
                  </button>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.55rem,.8vw,.65rem)", color: muted, letterSpacing: ".06em" }}>Replies within 24h</span>
                </div>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div style={s(4)}>
            {[
              { label: "Email",    value: "chegephil24@gmail.com",  href: "mailto:chegephil24@gmail.com" },
              { label: "Location", value: "Eldoret, Kenya",          href: "#" },
              { label: "GitHub",   value: "github.com/CHEGEBB",      href: "https://github.com/CHEGEBB" },
              { label: "LinkedIn", value: "linkedin.com/in/chegebb", href: "https://linkedin.com/in/chegebb" },
              { label: "Twitter",  value: "twitter.com/chegebb",     href: "https://twitter.com/chegebb" },
            ].map(item => (
              <a key={item.label} href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{
                  display: "grid", gridTemplateColumns: "5rem 1fr",
                  alignItems: "center", gap: "1rem",
                  padding: "clamp(.875rem,1.5vw,1.25rem) 0",
                  borderBottom: `1px solid ${border}`,
                  textDecoration: "none", transition: "opacity .2s ease",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = ".5"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.55rem,.75vw,.65rem)", letterSpacing: ".1em", textTransform: "uppercase", color: acc }}>{item.label}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "clamp(.875rem,1.3vw,1rem)", color: prim }}>{item.value}</span>
              </a>
            ))}

            <div style={{ display: "flex", gap: "3rem", paddingTop: "clamp(1.5rem,3vw,2.5rem)" }}>
              {[{ v: ghUser?.followers ?? "—", l: "Followers" }, { v: ghUser?.public_repos ?? "—", l: "Repos" }].map(stat => (
                <div key={stat.l}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4.5vw,3.5rem)", fontWeight: 800, letterSpacing: "-.04em", color: acc, lineHeight: 1 }}>{stat.v}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.55rem,.75vw,.65rem)", color: muted, marginTop: ".2rem", letterSpacing: ".06em" }}>{stat.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── GITHUB ───────────────────────────────────────── */}
        <div style={{ ...s(5), borderTop: `1px solid ${border}`, paddingTop: "clamp(3rem,6vw,5rem)" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.6rem,1vw,.72rem)", letterSpacing: ".14em", textTransform: "uppercase", color: acc, marginBottom: "clamp(2rem,4vw,3rem)", display: "flex", alignItems: "center", gap: ".5rem" }}>
            <span style={{ width: 20, height: 1, background: acc, display: "inline-block" }}/>
            Latest on GitHub
            {ghLoading && <div style={{ width: 12, height: 12, border: `1.5px solid ${acc}`, borderTop: "1.5px solid transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }}/>}
          </p>

          <div className="c-gh" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,4vw,5rem)" }}>
            {/* Repos */}
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.55rem,.8vw,.65rem)", color: muted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "1.25rem" }}>Top Repos</p>
              {ghLoading
                ? [1,2,3].map(i => <div key={i} style={{ height: 56, background: border, marginBottom: ".75rem", animation: "shimmer 1.5s ease-in-out infinite" }}/>)
                : repos.map((r, i) => {
                    const st = repoAge(r)
                    const sc = st === "Active" ? "#22c55e" : st === "Recent" ? acc : muted
                    return (
                      <a key={r.id} href={r.html_url} target="_blank" rel="noopener noreferrer" style={{
                        display: "block", padding: "clamp(.875rem,1.5vw,1.25rem) 0",
                        borderBottom: `1px solid ${border}`, textDecoration: "none",
                        transition: "opacity .2s ease",
                        animation: `repoIn .5s cubic-bezier(.16,1,.3,1) ${.6 + i * .08}s both`,
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = ".55"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".35rem" }}>
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "clamp(.875rem,1.3vw,1rem)", fontWeight: 600, color: prim }}>{r.name}</span>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.5rem,.7vw,.6rem)", color: sc, border: `1px solid ${sc}44`, padding: ".15rem .45rem" }}>{st}</span>
                        </div>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(.75rem,1.1vw,.8125rem)", color: muted, lineHeight: 1.5, marginBottom: ".4rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" as const }}>
                          {r.description || "No description"}
                        </p>
                        <div style={{ display: "flex", gap: "1rem", fontFamily: "var(--font-mono)", fontSize: "clamp(.5rem,.7vw,.6rem)", color: muted }}>
                          {r.language && <span>◉ {r.language}</span>}
                          <span>★ {r.stargazers_count}</span>
                        </div>
                      </a>
                    )
                  })
              }
            </div>

            {/* Events */}
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.55rem,.8vw,.65rem)", color: muted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "1.25rem" }}>Recent Activity</p>
              {ghLoading
                ? [1,2,3,4].map(i => <div key={i} style={{ height: 44, background: border, marginBottom: ".5rem", animation: "shimmer 1.5s ease-in-out infinite" }}/>)
                : events.slice(0, 6).map((ev, i) => (
                    <div key={ev.id} style={{
                      padding: "clamp(.75rem,1.2vw,1rem) 0", borderBottom: `1px solid ${border}`,
                      animation: `repoIn .5s cubic-bezier(.16,1,.3,1) ${.65 + i * .07}s both`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: ".5rem", fontFamily: "var(--font-body)", fontSize: "clamp(.8rem,1.2vw,.875rem)", color: prim }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: acc, flexShrink: 0 }}/>
                        {fmtEv(ev)}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(.5rem,.7vw,.6rem)", color: muted, marginTop: ".2rem", paddingLeft: "1rem" }}>
                        {ev.repo.name} · {new Date(ev.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        </div>
      </main>

      <Footer/>

      <style jsx global>{`
        @keyframes spin     { to { transform:rotate(360deg); } }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes drawLine { from{width:0} to{width:100%} }
        @keyframes aPulse   { 0%,100%{box-shadow:0 0 0 0 #22c55e55} 70%{box-shadow:0 0 0 8px transparent} }
        @keyframes repoIn   { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes shimmer  { 0%,100%{opacity:.25} 50%{opacity:.5} }

        @media(max-width:768px){
          .c-hero,.c-main,.c-gh{ grid-template-columns:1fr !important; gap:3rem !important; }
          .c-row{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  )
}