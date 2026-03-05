"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/context/theme-context"
import { ArrowUpRight, ExternalLink } from "lucide-react"

// ─── 30 CHALLENGES — real images, real live URLs, real tech ──────────────────
const CHALLENGES = [
  {
    id: "01",
    title: "QR Code Component",
    difficulty: "Newbie",
    tech: ["HTML", "CSS"],
    preview: "Clean card layout, precise centering and spacing",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/tsdbovdbrkalcnrbtpyw.jpg",
    live: "https://chegebb.github.io/frontend-mentor-qr-code/",
  },
  {
    id: "02",
    title: "Blog Preview Card",
    difficulty: "Newbie",
    tech: ["HTML", "CSS"],
    preview: "Typography-first card with category badge and author row",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/tsdbovdbrkalcnrbtpyw.jpg",
    live: "https://chegebb.github.io/frontend-mentor-qr-code/",
  },
  {
    id: "03",
    title: "Social Links Profile",
    difficulty: "Newbie",
    tech: ["HTML", "CSS"],
    preview: "Centered profile card with animated social link buttons",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/mysqidzvozrijiuyzabx.jpg",
    live: "https://chegebb.github.io/social-links-profile-main/",
  },
  {
    id: "04",
    title: "Recipe Page",
    difficulty: "Newbie",
    tech: ["HTML", "CSS"],
    preview: "Semantic HTML document — ingredients, steps, nutrition table",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/tsdbovdbrkalcnrbtpyw.jpg",
    live: "https://chegebb.github.io/frontend-mentor-qr-code/",
  },
  {
    id: "05",
    title: "Product Preview Card",
    difficulty: "Newbie",
    tech: ["HTML", "CSS"],
    preview: "Responsive two-column product card with add-to-cart state",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/msca39sxxfp5utx2b7mw.jpg",
    live: "https://chegebb.github.io/product-preview-card-component-main/",
  },
  {
    id: "06",
    title: "3-Column Preview Card",
    difficulty: "Newbie",
    tech: ["HTML", "CSS"],
    preview: "CSS Grid layout, 3 vehicle feature cards with hover states",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/evhatpkpngisdcgfnpbn.jpg",
    live: "https://chegebb.github.io/3-column-preview-card-component/",
  },
  {
    id: "07",
    title: "Stats Preview Card",
    difficulty: "Newbie",
    tech: ["HTML", "CSS"],
    preview: "Stats card with purple image tint overlay and bold numbers",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/wtz3dnom3rx7ukrhlvlh.jpg",
    live: "https://chegebb.github.io/stats-preview-card-component-main/",
  },
  {
    id: "08",
    title: "Order Summary Component",
    difficulty: "Newbie",
    tech: ["HTML", "CSS"],
    preview: "Pricing card with plan detail row and hover interactions",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/t00b2i1y7qbcyvlwoawo.jpg",
    live: "https://chegebb.github.io/order-summary-component/",
  },
  {
    id: "09",
    title: "NFT Preview Card",
    difficulty: "Newbie",
    tech: ["HTML", "CSS"],
    preview: "NFT card with eye-icon overlay and price/time metadata",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/uagxjmavlr6ttcorwrxy.jpg",
    live: "https://chegebb.github.io/nft-preview-card-component/",
  },
  {
    id: "10",
    title: "Social Proof Section",
    difficulty: "Newbie",
    tech: ["HTML", "CSS"],
    preview: "Staggered testimonials grid with star ratings and offset layout",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/zwobhvqlomhos3jhijvd.jpg",
    live: "https://chegebb.github.io/social-proof-section-master/",
  },
  {
    id: "11",
    title: "FAQ Accordion",
    difficulty: "Newbie",
    tech: ["HTML", "CSS", "JS"],
    preview: "Accessible accordion with smooth height animations",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/j6pe1sufynz4nlvvikva.jpg",
    live: "https://teach2give-code-test-git-main-chegebbs-projects.vercel.app/",
  },
  {
    id: "12",
    title: "Newsletter Sign-up",
    difficulty: "Junior",
    tech: ["HTML", "CSS", "JS"],
    preview: "Inline form validation with animated success confirmation state",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/c6ysjtqaxbsd35z6lszf.jpg",
    live: "https://chegebb.github.io/newsletter-sign-up-with-success-message-main/",
  },
  {
    id: "13",
    title: "Interactive Card Form",
    difficulty: "Junior",
    tech: ["HTML", "CSS", "JS"],
    preview: "Live card preview updates as you type — pure DOM manipulation",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/lt4gtoe6oew5rxeylimm.jpg",
    live: "https://chegebb.github.io/interactive-card-details-form-main/",
  },
  {
    id: "14",
    title: "Intro + Dropdown Nav",
    difficulty: "Junior",
    tech: ["Svelte", "CSS"],
    preview: "Animated dropdown menus with responsive hamburger navigation",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/k7jxiqomeuyasctla7om.jpg",
    live: "https://chegebb.github.io/Svelte-Frontend-Challenges/",
  },
  {
    id: "15",
    title: "Tip Calculator App",
    difficulty: "Junior",
    tech: ["React", "CSS"],
    preview: "Real-time tip splitting — per-person bill calculated instantly",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/ivwtat0pwo4hq7rmvamx.jpg",
    live: "https://chegebb.github.io/tip-calculator-app-main/",
  },
  {
    id: "16",
    title: "Testimonials Slider",
    difficulty: "Junior",
    tech: ["HTML", "CSS", "JS"],
    preview: "Animated content slider with smooth cross-fade transitions",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/sb339yhgjcsxz3ntn5qe.jpg",
    live: "https://coding-bootcamp-testimonials-ten-pied.vercel.app",
  },
  {
    id: "17",
    title: "Crowdfunding Page",
    difficulty: "Junior",
    tech: ["Vue", "TailwindCSS"],
    preview: "Modal pledge selector, live progress bar and backer count",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/sewtogrjlkhtr7r3rpsq.jpg",
    live: "https://crowdfunding-page-rust.vercel.app/",
  },
  {
    id: "18",
    title: "Time Tracking Dashboard",
    difficulty: "Junior",
    tech: ["React", "TailwindCSS"],
    preview: "JSON-driven dashboard — toggle daily, weekly and monthly periods",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/aywzf0npobqzms0axfu6.jpg",
    live: "https://chegebb.github.io/time-tracking-dashboard-main/#",
  },
  {
    id: "19",
    title: "Conference Ticket Generator",
    difficulty: "Junior",
    tech: ["Vue", "TailwindCSS"],
    preview: "Multi-step form that generates a personalised conference ticket",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/dnom6z6q835kalqachia.jpg",
    live: "https://conference-ticket-generator-zeta.vercel.app/",
  },
  {
    id: "20",
    title: "Huddle Landing Page",
    difficulty: "Junior",
    tech: ["HTML", "CSS", "SASS"],
    preview: "Two-column responsive marketing page with wavy section dividers",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/rihajfzamclp6uzxvfkf.jpg",
    live: "https://chegebb.github.io/huddle-landing-page-with-single-introductory-section/",
  },
  {
    id: "21",
    title: "Chat App CSS Illustration",
    difficulty: "Intermediate",
    tech: ["HTML", "CSS", "SASS"],
    preview: "Pure CSS mobile UI — chat bubbles, gradients, no images used",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/ugj77s3zdv6rflgm231p.jpg",
    live: "https://chegebb.github.io/chat-app-css-illustration-master/",
  },
  {
    id: "22",
    title: "Job Listings Filter",
    difficulty: "Intermediate",
    tech: ["Vue", "Fetch", "TailwindCSS"],
    preview: "Dynamic tag-based filtering system with removable filter chips",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/grmw9eaehnotl7xpecnp.jpg",
    live: "https://job-listings-olive.vercel.app/",
  },
  {
    id: "23",
    title: "IP Address Tracker",
    difficulty: "Intermediate",
    tech: ["React", "TailwindCSS", "API"],
    preview: "Geolocation + Leaflet map — live IP/domain lookup with pin drop",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/rfvkm6pc02m38rz52wum.jpg",
    live: "https://chegebb.github.io/ip-address-tracker-master/",
  },
  {
    id: "24",
    title: "Launch Countdown Timer",
    difficulty: "Intermediate",
    tech: ["React", "Vite", "TailwindCSS"],
    preview: "Flip-card countdown animation with real date-based timer logic",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/xjnrm0y8a3kvlaiut7cn.jpg",
    live: "https://chegebb.github.io/launch-countdown-timer/",
  },
  {
    id: "25",
    title: "Room Homepage",
    difficulty: "Intermediate",
    tech: ["Vue", "TailwindCSS"],
    preview: "Full-bleed image slider with SSR-ready layout and mobile nav",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/lr61m6itzhfgl8vigahy.jpg",
    live: "https://room-homepage-master-iota.vercel.app/",
  },
  {
    id: "26",
    title: "Todo App",
    difficulty: "Intermediate",
    tech: ["Vue", "SASS", "TailwindCSS"],
    preview: "Drag-and-drop reordering, filter by status, dark/light toggle",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/zp9amjzjqzwglcknzgd8.jpg",
    live: "https://todo-app-olive-theta.vercel.app/",
  },
  {
    id: "27",
    title: "Space Tourism Site",
    difficulty: "Intermediate",
    tech: ["HTML", "CSS", "JS"],
    preview: "Multi-page site with tabbed destination content and image transitions",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/gnvv8vb9nzslkzn5lttm.jpg",
    live: "https://chegebb.github.io/space-tourism-website/",
  },
  {
    id: "28",
    title: "Rock Paper Scissors",
    difficulty: "Advanced",
    tech: ["React", "SASS"],
    preview: "Animated game with score tracking, RPSLS bonus mode included",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/ck9dtmelgtbjtxw8xivj.jpg",
    live: "https://chegebb.github.io/rock-paper-scissors-game/",
  },
  {
    id: "29",
    title: "Multi-step Form",
    difficulty: "Advanced",
    tech: ["React", "TailwindCSS"],
    preview: "Step-by-step form with field validation and order summary review",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/uugvybc3rvzwrfzkmaym.jpg",
    live: "https://chegebb.github.io/multi-step-form-main/",
  },
  {
    id: "30",
    title: "Fylo Dark Landing Page",
    difficulty: "Advanced",
    tech: ["HTML", "CSS", "SASS"],
    preview: "Dark-theme file storage landing with glowing CTA and wavy divider",
    image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/ngaklc62gbx4unoiyutu.jpg",
    live: "https://chegebb.github.io/fylo-dark-theme-landing-page-master/",
  },
]

const DIFF_META: Record<string, { color: string; ring: string; label: string }> = {
  Newbie:       { color: "#22C55E", ring: "#22C55E30", label: "Newbie"       },
  Junior:       { color: "#45D2B0", ring: "#45D2B030", label: "Junior"       },
  Intermediate: { color: "#5567F7", ring: "#5567F730", label: "Intermediate" },
  Advanced:     { color: "#FF4D1C", ring: "#FF4D1C30", label: "Advanced"     },
}

// ─── SINGLE CARD ─────────────────────────────────────────────────────────────
function ChallengeCard({
  c, idx, onEnter, onLeave,
}: {
  c: typeof CHALLENGES[0]
  idx: number
  onEnter: () => void
  onLeave: () => void
}) {
  const { theme } = useTheme()
  const [hovered, setHovered] = useState(false)
  const dMeta = DIFF_META[c.difficulty]

  return (
    <a
      href={c.live}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => { setHovered(true); onEnter() }}
      onMouseLeave={() => { setHovered(false); onLeave() }}
      style={{
        display: "block",
        position: "relative",
        width: "clamp(240px, 25vw, 340px)",
        flexShrink: 0,
        overflow: "hidden",
        textDecoration: "none",
        cursor: "none",
        background: hovered
          ? `linear-gradient(160deg, var(--color-surface) 0%, ${dMeta.ring} 100%)`
          : "var(--color-surface)",
        border: `1px solid ${hovered ? dMeta.color + "50" : "var(--color-surface-border)"}`,
        borderRadius: "2px",
        transform: hovered ? "translateY(-12px) scale(1.025)" : "translateY(0) scale(1)",
        transition:
          "transform 0.5s cubic-bezier(.16,1,.3,1), border-color 0.3s ease, box-shadow 0.45s ease, background 0.4s ease",
        boxShadow: hovered
          ? `0 32px 80px ${dMeta.color}22, 0 8px 24px ${dMeta.color}18, 0 0 0 1px ${dMeta.color}18`
          : "0 1px 4px rgba(0,0,0,0.12)",
        zIndex: hovered ? 20 : 1,
      }}
    >
      {/* ── Screenshot wrapper ── */}
      <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
        <img
          src={c.image}
          alt={c.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: hovered ? "scale(1.1)" : "scale(1)",
            filter: hovered ? "brightness(0.45) saturate(1.1)" : "brightness(0.88) saturate(0.9)",
            transition: "transform 0.7s cubic-bezier(.16,1,.3,1), filter 0.45s ease",
          }}
        />

        {/* Gradient overlay — always present, intensifies on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, transparent 30%, ${dMeta.color}30 100%)`,
            opacity: hovered ? 1 : 0.4,
            transition: "opacity 0.4s ease",
            zIndex: 1,
          }}
        />

        {/* Top-left color wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 0% 0%, ${dMeta.color}28 0%, transparent 65%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.5s ease",
            zIndex: 1,
          }}
        />

        {/* Difficulty badge */}
        <div
          style={{
            position: "absolute",
            top: "0.6rem",
            left: "0.6rem",
            zIndex: 3,
            fontFamily: "var(--font-mono)",
            fontSize: "0.42rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: dMeta.color,
            background: `${dMeta.color}18`,
            border: `1px solid ${dMeta.color}55`,
            padding: "0.18rem 0.5rem",
            backdropFilter: "blur(6px)",
          }}
        >
          {c.difficulty}
        </div>

        {/* Challenge number */}
        <div
          style={{
            position: "absolute",
            top: "0.6rem",
            right: "0.6rem",
            zIndex: 3,
            fontFamily: "var(--font-mono)",
            fontSize: "0.44rem",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.06em",
          }}
        >
          #{c.id}
        </div>

        {/* Hover: "View Live" label centred on image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#fff",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.35s ease 0.05s, transform 0.4s cubic-bezier(.16,1,.3,1) 0.05s",
          }}
        >
          <ExternalLink size={10} strokeWidth={2} />
          View Live
        </div>
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: "0.9rem 1rem 1rem" }}>
        {/* Title */}
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(0.8rem,1.15vw,0.92rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            color: hovered ? "var(--color-text-primary)" : "var(--color-text-secondary)",
            margin: "0 0 0.45rem",
            transition: "color 0.25s ease",
          }}
        >
          {c.title}
        </h4>

        {/* Preview — slides in on hover */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.68rem",
            lineHeight: 1.55,
            color: "var(--color-text-muted)",
            margin: "0 0 0.65rem",
            maxHeight: hovered ? "4rem" : "0",
            overflow: "hidden",
            opacity: hovered ? 1 : 0,
            transition: "max-height 0.4s cubic-bezier(.16,1,.3,1), opacity 0.3s ease",
          }}
        >
          {c.preview}
        </p>

        {/* Tech pills row */}
        <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap", alignItems: "center" }}>
          {c.tech.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.4rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: hovered ? dMeta.color : "var(--color-text-muted)",
                border: `1px solid ${hovered ? dMeta.color + "45" : "var(--color-surface-border)"}`,
                padding: "0.12rem 0.38rem",
                transition: "color 0.3s ease, border-color 0.3s ease, background 0.3s ease",
                background: hovered ? `${dMeta.color}0d` : "transparent",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom accent bar — scaleX on hover */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent 0%, ${dMeta.color} 50%, transparent 100%)`,
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "center",
          transition: "transform 0.55s cubic-bezier(.16,1,.3,1)",
          boxShadow: `0 0 14px ${dMeta.color}`,
        }}
      />

      {/* Arrow badge bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: "0.85rem",
          right: "0.85rem",
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: `1.5px solid ${dMeta.color}`,
          background: `${dMeta.color}14`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: dMeta.color,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "scale(1) rotate(0deg)" : "scale(0.4) rotate(-90deg)",
          transition: "all 0.45s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <ArrowUpRight size={10} strokeWidth={2.5} />
      </div>

      {/* Left accent rule — slides down on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "2px",
          height: hovered ? "100%" : "0%",
          background: `linear-gradient(180deg, ${dMeta.color} 0%, transparent 100%)`,
          transition: "height 0.5s cubic-bezier(.16,1,.3,1)",
        }}
      />
    </a>
  )
}

// ─── INFINITE STRIP ───────────────────────────────────────────────────────────
function Strip({
  items,
  dir,
  speed,
  inView,
  delay = "0s",
}: {
  items: typeof CHALLENGES
  dir: "left" | "right"
  speed: number
  inView: boolean
  delay?: string
}) {
  const [paused, setPaused] = useState(false)
  const triple = [...items, ...items, ...items]

  return (
    <div
      style={{
        overflow: "visible",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(32px)",
        transition: `opacity 0.9s ease ${delay}, transform 0.9s cubic-bezier(.16,1,.3,1) ${delay}`,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          display: "flex",
          gap: "clamp(0.7rem,1.2vw,1.1rem)",
          width: "max-content",
          padding: "0.9rem 0",
          animation: `ch-${dir} ${speed}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        {triple.map((c, i) => (
          <ChallengeCard
            key={`${c.id}-${i}`}
            c={c}
            idx={i}
            onEnter={() => setPaused(true)}
            onLeave={() => setPaused(false)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────
export function FrontendChallenges() {
  const { theme } = useTheme()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const acc = theme.colors.accent

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.04 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const rowA = CHALLENGES.slice(0, 15)
  const rowB = CHALLENGES.slice(15)

  return (
    <section
      id="challenges"
      ref={sectionRef}
      style={{
        position: "relative",
        background: "var(--color-bg-secondary)",
        overflow: "hidden",
        paddingBottom: "clamp(4rem,8vw,7rem)",
      }}
    >
      {/* Subtle noise grain texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.6,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── Header ── */}
        <div
          style={{
            padding:
              "clamp(5rem,9vw,8rem) clamp(1.5rem,5vw,4rem) clamp(2rem,4vw,3rem)",
            borderBottom: "1px solid var(--color-surface-border)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          {/* Left: label + heading */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(14px)",
                transition: "all 0.6s ease 0.1s",
              }}
            >
              <div style={{ width: 24, height: 1, background: acc }} />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: acc,
                }}
              >
                Frontend Mentor
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem,7vw,7rem)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 0.88,
                margin: 0,
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(24px)",
                transition: "all 0.8s cubic-bezier(.16,1,.3,1) 0.15s",
              }}
            >
              <span style={{ display: "block", color: "var(--color-text-primary)" }}>
                30 Challenges
              </span>
              <span
                style={{
                  display: "block",
                  color: "transparent",
                  WebkitTextStroke: `2px ${acc}`,
                }}
              >
                Completed.
              </span>
            </h2>
          </div>

          {/* Right: description + difficulty legend */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "flex-end",
              opacity: inView ? 1 : 0,
              transition: "opacity 0.8s ease 0.3s",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.78rem,1.1vw,0.88rem)",
                lineHeight: 1.7,
                color: "var(--color-text-secondary)",
                maxWidth: "300px",
                textAlign: "right",
                margin: 0,
              }}
            >
              Built with React, Vue, Svelte, Next.js, TypeScript, TailwindCSS,
              SASS and more. Hover any card to visit the live site.
            </p>

            {/* Difficulty legend */}
            <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
              {Object.entries(DIFF_META).map(([key, meta]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.42rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: meta.color,
                      boxShadow: `0 0 6px ${meta.color}`,
                    }}
                  />
                  {key}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Two scrolling rows ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(0.75rem,1.5vw,1.25rem)",
            paddingTop: "clamp(1.5rem,3vw,2.5rem)",
            overflow: "hidden",
          }}
        >
          <Strip items={rowA} dir="right" speed={65} inView={inView} delay="0.2s" />
          <Strip items={rowB} dir="left"  speed={55} inView={inView} delay="0.35s" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes ch-right {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes ch-left {
          from { transform: translateX(-33.333%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}