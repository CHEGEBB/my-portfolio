# Brian Chege — Portfolio

> Personal portfolio built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.
> Fully theme-aware, responsive, and animated.

---

## 🗂 Project Structure

```
my-portfolio/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout — fonts, metadata, ThemeProvider
│   ├── globals.css               # CSS reset, variables, utilities
│   ├── page.tsx                  # Home / Landing page
│   ├── about/
│   │   └── page.tsx
│   ├── projects/
│   │   └── page.tsx
│   ├── skills/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
│
├── context/
│   └── theme-context.tsx         # ThemeProvider, useTheme hook, all theme logic
│
├── components/
│   ├── ui/                       # Reusable primitives
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   └── card.tsx
│   ├── layout/
│   │   ├── navbar.tsx            # Navigation bar
│   │   └── footer.tsx
│   ├── theme/
│   │   └── theme-switcher.tsx    # Theme panel UI (preset + accent + radius)
│   ├── sections/                 # Page sections
│   │   ├── hero.tsx
│   │   ├── about-preview.tsx
│   │   ├── projects-grid.tsx
│   │   ├── skills-cloud.tsx
│   │   └── contact-cta.tsx
│   └── animations/
│       ├── reveal.tsx            # Scroll-triggered reveal wrapper
│       └── magnetic.tsx          # Magnetic hover effect
│
├── lib/
│   ├── data/
│   │   ├── projects.ts           # All project data
│   │   └── skills.ts             # Tech stack / skills data
│   └── utils.ts                  # cn(), formatDate(), etc.
│
├── public/
│   ├── cv.pdf
│   └── og-image.png
│
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎨 Theme System

Located in `context/theme-context.tsx`.

### Presets
| Preset    | Mode  | Accent | Vibe             |
|-----------|-------|--------|------------------|
| Obsidian  | Dark  | Ember  | Dark & fiery     |
| Glacier   | Dark  | Arctic | Dark & icy       |
| Midnight  | Dark  | Violet | Dark & electric  |
| Matrix    | Dark  | Acid   | Dark & acidic    |
| Parchment | Light | Gold   | Light & warm     |
| Paper     | Light | Slate  | Light & minimal  |
| Blush     | Light | Bloom  | Light & soft     |

### Accent Colors
`ember` · `arctic` · `acid` · `bloom` · `gold` · `violet` · `slate`

### CSS Variables (available everywhere)
```css
var(--color-bg)
var(--color-bg-secondary)
var(--color-surface)
var(--color-text-primary)
var(--color-text-secondary)
var(--color-accent)
var(--color-accent-hover)
var(--color-accent-muted)
var(--shadow-glow)
var(--gradient-ambient)
var(--radius)
var(--font-display)    /* Syne */
var(--font-body)       /* DM Sans */
var(--font-mono)       /* JetBrains Mono */
```

### Using the theme in components
```tsx
import { useTheme } from "@/context/theme-context"

const { theme, setAccent, toggleMode, setPreset } = useTheme()
```

---

## 🚀 Getting Started

```bash
pnpm install
pnpm run dev
```

---

## 📦 Key Dependencies

| Package          | Purpose                    |
|------------------|----------------------------|
| next             | Framework                  |
| react            | UI                         |
| typescript       | Types                      |
| tailwindcss      | Utility CSS                |
| framer-motion    | Animations                 |
| @vercel/analytics| Analytics                  |

---

## 📱 Responsive Strategy

- Mobile-first layouts using Tailwind breakpoints (`sm`, `md`, `lg`, `xl`)
- Fluid typography via `clamp()` in `globals.css`
- Safe area padding for notched devices
- Touch-friendly tap targets (min 44×44px)
- No horizontal overflow

---

## 🎞 Animation Strategy

- **Page load**: staggered reveal with Framer Motion
- **Scroll**: `useInView` triggers for section reveals
- **Hover**: magnetic effects on CTAs, accent glow on cards
- **Theme switch**: smooth CSS variable transitions (300ms)
- **Respects**: `prefers-reduced-motion` at CSS and JS level

---

## 📄 Pages

| Route       | Description                        |
|-------------|------------------------------------|
| `/`         | Landing — hero, featured work, CTA |
| `/about`    | Bio, story, values                 |
| `/projects` | Full project grid with filters     |
| `/skills`   | Tech stack visual                  |
| `/contact`  | Contact form + socials             |