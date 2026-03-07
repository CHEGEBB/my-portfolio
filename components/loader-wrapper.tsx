"use client"

import { useState } from "react"
import { PageLoader } from "@/components/page-loader"

export function LoaderWrapper({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false)

  return (
    <>
      {!done && <PageLoader onComplete={() => setDone(true)} />}
      <div style={{
        opacity: done ? 1 : 0,
        transition: "opacity 0.5s ease 0.2s",
        pointerEvents: done ? "auto" : "none",
      }}>
        {children}
      </div>
    </>
  )
}