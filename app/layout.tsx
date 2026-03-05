import type React from "react"
import type { Metadata, Viewport } from "next"
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/context/theme-context"
import "./globals.css"
import { Snow } from "@/components/snow"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Cursor } from "@/components/cursor"

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["300", "400", "500"],
})

export const metadata: Metadata = {
  title: {
    default: "Brian Chege — Full Stack Developer",
    template: "%s | Brian Chege",
  },
  description: "Full Stack Developer building fast, beautiful, and purposeful digital experiences.",
  keywords: ["Full Stack Developer", "React", "Next.js", "TypeScript", "Brian Chege"],
  authors: [{ name: "Brian Chege", url: "https://brianchege.me" }],
  creator: "Brian Chege",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brianchege.me",
    title: "Brian Chege — Full Stack Developer",
    description: "Full Stack Developer building fast, beautiful, and purposeful digital experiences.",
    siteName: "Brian Chege",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brian Chege — Full Stack Developer",
    description: "Full Stack Developer building fast, beautiful, and purposeful digital experiences.",
    creator: "@brianchege",
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#07070F" },
    { media: "(prefers-color-scheme: light)", color: "#F6F6FC" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased overflow-x-hidden">
        <ThemeProvider>
        <SmoothScroll>
        <Cursor />
        <Snow/>
    
          {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}