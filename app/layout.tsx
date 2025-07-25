import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { CustomCursor } from "@/components/custom-cursor"
import { PageTransition } from "@/components/page-transition"
import { AudioProvider } from "@/components/audio-provider"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

export const metadata: Metadata = {
  title: "BrianChege - Enter My Mind",
  description: "A next-level interactive portfolio that pushes the boundaries of web experience",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-black text-white overflow-x-hidden`}
        style={{ cursor: "none" }}
      >
        <AudioProvider>
          <CustomCursor />
          <Navigation />
          <PageTransition>
            <main className="relative">{children}</main>
            <Analytics />
          </PageTransition>
        </AudioProvider>
      </body>
    </html>
  )
}
