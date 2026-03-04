"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useTheme } from "@/context/theme-context"

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "01", title: "IntelliMark",
    category: "AI · EdTech", type: "CLIENT",
    description: "AI University Assessment Platform. What if every lecturer had an AI that graded, tracked, and adapted to their students?",
    stack: ["AI", "EdTech", "React"], year: "2024",
    image: "/projects/intellimark.png", href: "/projects/intellimark",
    col: "span 1",
  },
  {
    id: "02", title: "TabooTalks",
    category: "Social · Web App", type: "CLIENT",
    description: "Authentic Connections Platform. Real-time conversations that matter.",
    stack: ["React", "Node.js", "Real-time"], year: "2024",
    image: "/projects/tabootalks.png", href: "/projects/tabootalks",
    col: "span 1",
  },
  {
    id: "03", title: "H-mex Health Tech",
    category: "HealthTech · AI", type: "CLIENT",
    description: "AI NCDs Risk Assessment Tool. Helping clinicians detect risk before it's too late.",
    stack: ["AI/ML", "HealthTech", "React"], year: "2024",
    image: "/projects/hmex.png", href: "/projects/healthmaster",
    col: "span 1",
  },
  {
    id: "04", title: "WerEntOnline",
    category: "PropTech · Web App", type: "CLIENT",
    description: "Real Estate Rental & Leasing. Find, list, and manage properties seamlessly.",
    stack: ["Next.js", "Maps API", "Full-stack"], year: "2024",
    image: "/projects/werentonline.png", href: "/projects/werentonline",
    col: "span 1",
  },
  {
    id: "05", title: "FarmSense",
    category: "AgriTech · Web App", type: "CLIENT",
    description: "Smart Farming Without Hardware. Data-driven crop insights for every farmer.",
    stack: ["React", "Analytics", "AgriTech"], year: "2024",
    image: "/projects/farmsense.png", href: "/projects/farmsense",
    col: "span 2",
  },
  {
    id: "06", title: "DjAfro StreamBox",
    category: "Mobile · Streaming", type: "CLIENT",
    description: "Movies Streaming App — 1,000+ downloads on Play Store. Built for low-bandwidth African networks.",
    stack: ["React Native", "Android", "Streaming"], year: "2024",
    image: "/projects/djafro.png", href: "/projects/djafro",
    col: "span 2",
  },
  {
    id: "07", title: "Softrinx",
    category: "SaaS · Enterprise", type: "STARTUP",
    description: "End-to-end software platform serving startups and enterprises.",
    stack: ["Next.js", "TypeScript", "AWS"], year: "2025",
    image: "/projects/softrinx.png", href: "/projects/softrinx",
    col: "span 1",
  },
  {
    id: "08", title: "Teach2Give",
    category: "EdTech · Web", type: "CLIENT",
    description: "Developer learning portal with course management, real-time collaboration and CI/CD on AWS.",
    stack: ["Angular", "Docker", "PostgreSQL"], year: "2025",
    image: "/projects/teach2give.png", href: "/projects/teach2give",
    col: "span 1",
  },
]

const FALLBACKS = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=900&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80",
  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=900&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
]

// Shaders
const VS = `
  precision mediump float;
  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
  uniform mat4 uTextureMatrix0;
  uniform float uHover;
  uniform float uTime;
  varying vec2 vTextureCoord;
  void main(){
    vec3 pos = aVertexPosition;
    float wave = sin(pos.x * 3.14159 * 2.0 + uTime * 0.05) * 0.02 * uHover;
    pos.y += wave;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos,1.0);
    vTextureCoord = (uTextureMatrix0 * vec4(aTextureCoord,0.0,1.0)).xy;
  }
`
const FS = `
  precision mediump float;
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler0;
  uniform float uHover;
  uniform float uTime;
  void main(){
    vec2 uv = vTextureCoord;
    float ripple = sin(uv.x * 8.0 + uTime * 0.07) * 0.007 * uHover;
    uv.y += ripple;
    vec2 center = vec2(0.5);
    uv = center + (uv - center) * (1.0 - 0.04 * uHover);
    vec4 c = texture2D(uSampler0, uv);
    float lum = dot(c.rgb, vec3(0.299,0.587,0.114));
    c.rgb = mix(vec3(lum)*0.6, c.rgb, 0.3 + 0.7*uHover);
    gl_FragColor = c;
  }
`

function useInView(threshold = 0.06) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function Card({ project, idx }: { project: typeof PROJECTS[0]; idx: number }) {
  const { theme }   = useTheme()
  const [hovered, setHovered] = useState(false)
  const [src, setSrc] = useState(project.image)
  const wrapRef  = useRef<HTMLDivElement>(null)
  const hoverVal = useRef(0)
  const planeRef = useRef<any>(null)
  const curtRef  = useRef<any>(null)
  const accent   = theme.colors.accent

  // Init curtains AFTER component mounts (DOM is ready)
  useEffect(() => {
    let disposed = false;

    (async () => {
      try {
        await new Promise(r => setTimeout(r, 100)) // let DOM settle
        if (disposed || !wrapRef.current) return

        const { Curtains, Plane } = await import("curtainsjs")

        const curtains = new Curtains({
          container: wrapRef.current,
          watchScroll: false,
          pixelRatio: Math.min(1.5, window.devicePixelRatio),
        })
        curtRef.current = curtains

        curtains.onError(() => { /* WebGL unavailable — CSS handles it */ })

        const plane = new Plane(curtains, wrapRef.current, {
          vertexShader: VS,
          fragmentShader: FS,
          widthSegments: 20,
          heightSegments: 20,
          uniforms: {
            uHover: { name: "uHover", type: "1f", value: 0 },
            uTime:  { name: "uTime",  type: "1f", value: 0 },
          },
        })
        planeRef.current = plane

        plane.onRender(() => {
          plane.uniforms.uTime.value += 1
          const target  = hoverVal.current
          const current = plane.uniforms.uHover.value
          plane.uniforms.uHover.value += (target - current) * 0.075
        })

        plane.onError(() => { /* plane failed — CSS handles it */ })

      } catch { /* curtainsjs failed — CSS handles it */ }
    })()

    return () => {
      disposed = true
      try { curtRef.current?.dispose() } catch {}
    }
  }, [src]) // re-init if image src changes (fallback)

  const enter = useCallback(() => { setHovered(true);  hoverVal.current = 1 }, [])
  const leave = useCallback(() => { setHovered(false); hoverVal.current = 0 }, [])

  const isWide = project.col === "span 2"

  return (
    <Link
      href={project.href}
      onMouseEnter={enter}
      onMouseLeave={leave}
      style={{
        display:    "block",
        textDecoration: "none",
        position:   "relative",
        gridColumn: project.col,
        height:     "clamp(220px,25vw,340px)",
        overflow:   "hidden",
        borderRadius: 0,
        cursor:     "pointer",
      }}
    >
      {/* Curtains container — must NOT have overflow:hidden for WebGL to work */}
      <div
        ref={wrapRef}
        style={{
          position: "absolute",
          inset: 0,
          // overflow visible so curtains canvas can render
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={project.title}
          crossOrigin="anonymous"
          onError={() => setSrc(FALLBACKS[idx % FALLBACKS.length])}
          data-sampler="uSampler0"
          style={{
            width:      "100%",
            height:     "100%",
            objectFit:  "cover",
            display:    "block",
            // CSS fallback when WebGL not active
            filter: hovered
              ? "saturate(1.05) brightness(.88)"
              : "saturate(.35) brightness(.55)",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "filter .55s ease, transform .65s cubic-bezier(.16,1,.3,1)",
          }}
        />
      </div>

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: hovered
          ? "linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.1) 55%, transparent 100%)"
          : "linear-gradient(to top, rgba(0,0,0,.95) 0%, rgba(0,0,0,.5) 65%, rgba(0,0,0,.08) 100%)",
        transition: "background .4s ease",
      }}/>

      {/* Accent line bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "2px", background: accent, zIndex: 4,
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: "transform .45s cubic-bezier(.16,1,.3,1)",
      }}/>

      {/* Card content */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "clamp(.875rem,1.5vw,1.25rem)",
      }}>
        {/* Top */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(.44rem,.55vw,.56rem)",
            letterSpacing: ".14em", textTransform: "uppercase",
            color: accent,
            background: `${accent}22`,
            border: `1px solid ${accent}44`,
            padding: ".18rem .5rem",
            backdropFilter: "blur(6px)",
          }}>{project.type}</span>

          <div style={{
            width: "clamp(26px,2.8vw,32px)", height: "clamp(26px,2.8vw,32px)",
            borderRadius: "50%",
            border: `1.5px solid ${accent}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: accent,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "rotate(-45deg) scale(1)" : "rotate(0) scale(.6)",
            transition: "all .35s cubic-bezier(.16,1,.3,1)",
            background: `${accent}1A`,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        {/* Bottom */}
        <div>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(.46rem,.6vw,.56rem)",
            letterSpacing: ".1em", textTransform: "uppercase",
            color: "rgba(255,255,255,.4)", margin: "0 0 .25rem",
          }}>{project.category}</p>

          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: isWide ? "clamp(1.4rem,2.8vw,2.2rem)" : "clamp(1.1rem,2vw,1.65rem)",
            fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1,
            color: "#fff", margin: "0 0 .4rem",
          }}>{project.title}</h3>

          {/* Description on hover */}
          <div style={{
            maxHeight: hovered ? "4rem" : "0",
            overflow: "hidden",
            transition: "max-height .38s cubic-bezier(.16,1,.3,1)",
          }}>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(.68rem,.88vw,.78rem)",
              lineHeight: 1.5, color: "rgba(255,255,255,.65)",
              margin: "0 0 .5rem", maxWidth: "460px",
            }}>{project.description}</p>
          </div>

          {/* Stack */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".28rem" }}>
            {project.stack.map(s => (
              <span key={s} style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(.44rem,.54vw,.54rem)",
                letterSpacing: ".06em",
                color: hovered ? accent : "rgba(255,255,255,.38)",
                border: `1px solid ${hovered ? accent + "55" : "rgba(255,255,255,.14)"}`,
                padding: ".14rem .44rem",
                transition: "all .28s ease",
              }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function FeaturedWork() {
  const { theme }              = useTheme()
  const { ref, inView }        = useInView(0.06)
  const [painted,  setPainted] = useState(false)
  const [revealed, setRevealed]= useState(false)
  const [mouse, setMouse]      = useState({ x: 0.5, y: 0.5 })
  const sectionRef             = useRef<HTMLDivElement>(null)
  const isDark = theme.mode === "dark"

  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setPainted(true),  60)
    const t2 = setTimeout(() => setRevealed(true), 720)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [inView])

  // Mouse glow — same as every other section
  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current; if (!el) return
    const r  = el.getBoundingClientRect()
    setMouse({
      x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(1, (e.clientY - r.top)  / r.height)),
    })
  }, [])

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    el.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => el.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  const setRef = useCallback((el: HTMLDivElement | null) => {
    ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = el
    ;(sectionRef as React.MutableRefObject<HTMLDivElement | null>).current = el
  }, [ref])

  // Paint color = exact same bg as hero/about/skills — zero color bleed
  const paintBg = isDark ? "#07070F" : "#F6F6FC"

  const gx = (mouse.x * 100).toFixed(1)
  const gy = (mouse.y * 100).toFixed(1)

  return (
    <section
      ref={setRef}
      style={{
        position:   "relative",
        background: "var(--color-bg)",  // ← matches every other section
        overflow:   "hidden",
      }}
    >
      {/* Mouse ambient glow — same as Hero / About / Skills */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: `radial-gradient(ellipse 58% 52% at ${gx}% ${gy}%, var(--color-accent-muted) 0%, transparent 65%)`,
        transition: "background 0.1s ease",
      }}/>
      {/* Gradient mesh */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "var(--gradient-mesh)", opacity: 0.5,
      }}/>

      {/* ── PAINT WIPE — exact same as original ──────────── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: paintBg,
        transform:  painted ? "translateX(0%)" : "translateX(-100%)",
        transition: painted ? "transform 0.95s cubic-bezier(0.86,0,0.07,1)" : "none",
        willChange: "transform",
      }}>
        <div style={{
          position: "absolute", top: 0, right: -32, bottom: 0, width: 64,
          background: paintBg,
          clipPath: "polygon(0 0,55% 2%,100% 7%,72% 16%,100% 27%,60% 36%,98% 48%,62% 59%,100% 70%,68% 80%,100% 91%,55% 97%,0 100%)",
        }}/>
      </div>
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: isDark ? "#07070F" : "#F6F6FC",
        transform:  painted ? "translateX(0%)" : "translateX(-100%)",
        transition: painted ? "transform 1.15s cubic-bezier(0.86,0,0.07,1) 0.06s" : "none",
        willChange: "transform",
      }}>
        <div style={{
          position: "absolute", top: 0, right: -24, bottom: 0, width: 48,
          background: isDark ? "#07070F" : "#F6F6FC",
          clipPath: "polygon(0 4%,70% 0,100% 10%,65% 22%,100% 35%,55% 48%,90% 60%,60% 72%,95% 85%,50% 95%,0 100%)",
        }}/>
      </div>

      {/* ── CONTENT ──────────────────────────────────────── */}
      <div style={{
        position: "relative", zIndex: 5,
        opacity:    revealed ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
          padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,5vw,4rem) clamp(2rem,4vw,3rem)",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(.6rem,1vw,.72rem)",
              letterSpacing: ".14em", textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: ".75rem",
              display: "flex", alignItems: "center", gap: ".5rem",
            }}>
              <span style={{ width: 20, height: "1px", background: "var(--color-accent)", display: "inline-block" }}/>
              Selected Work
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.75rem,8vw,7rem)",
              fontWeight: 800, letterSpacing: "-.04em", lineHeight: .9,
              margin: 0, color: "var(--color-text-primary)",
            }}>
              Things I&apos;ve{" "}
              <span style={{ color: "transparent", WebkitTextStroke: "2px var(--color-accent)" }}>Built</span>
            </h2>
          </div>
          <Link href="/projects" style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(.75rem,1.1vw,.875rem)",
            fontWeight: 500, color: "var(--color-text-muted)",
            textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: ".4rem",
            transition: "color .2s ease, gap .2s ease", alignSelf: "flex-start",
          }}
          onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.color="var(--color-accent)";el.style.gap=".75rem"}}
          onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.color="var(--color-text-muted)";el.style.gap=".4rem"}}
          >
            All projects
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* ── GRID — contained, good heights, zero gap, zero radius ────────
            3-col grid, rows auto-height from card height.
            Row 1: 01 | 02 | 03  (3 × span1)
            Row 2: 04 | 05──────  (span1 + span2)
            Row 3: 06──── | 07   (span2 + span1)
            Row 4: 08 (span1, placed naturally)
        ─────────────────────────────────────────────────────────────────── */}
        <div
          className="fw-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
            margin: "0 clamp(1.5rem,5vw,4rem)",  // same horizontal padding as header
          }}
        >
          {PROJECTS.map((p, i) => (
            <Card key={p.id} project={p} idx={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          display: "flex", justifyContent: "center",
          padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)",
          opacity: revealed ? 1 : 0,
          transition: "opacity .6s ease .5s",
        }}>
          <Link href="/projects" style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1rem,2.5vw,1.5rem)",
            fontWeight: 700, letterSpacing: "-.01em",
            color: "var(--color-text-primary)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "1rem",
            transition: "gap .3s ease, color .2s ease",
          }}
          onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.gap="1.75rem";el.style.color="var(--color-accent)"}}
          onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.gap="1rem";el.style.color="var(--color-text-primary)"}}
          >
            See everything I&apos;ve built
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .fw-grid { grid-template-columns: repeat(2,1fr) !important; margin: 0 clamp(1rem,3vw,2rem) !important; }
        }
        @media (max-width: 560px) {
          .fw-grid { grid-template-columns: 1fr !important; }
          .fw-grid a { grid-column: span 1 !important; }
        }
      `}</style>
    </section>
  )
}