"use client"

import { useTheme } from "@/context/theme-context"
import { useEffect, useRef, useState } from "react"

export function Cursor() {
  const { theme } = useTheme()
  const acc = theme.colors.accent

  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse   = useRef({ x: -200, y: -200 })
  const ring    = useRef({ x: -200, y: -200 })
  const raf     = useRef(0)
  const [hovered, setHovered] = useState(false)

  // RAF loop — dot instant, ring lerps
  useEffect(() => {
    const loop = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.15
      ring.current.y += (mouse.current.y - ring.current.y) * 0.15
      dotRef.current!.style.transform  = `translate(${mouse.current.x}px,${mouse.current.y}px) translate(-50%,-50%)`
      ringRef.current!.style.transform = `translate(${ring.current.x}px,${ring.current.y}px) translate(-50%,-50%)`
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  // Mouse move
  useEffect(() => {
    const mv = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener("mousemove", mv, { passive: true })
    return () => window.removeEventListener("mousemove", mv)
  }, [])

  // Hover detection
  useEffect(() => {
    const SEL = "a,button,input,select,textarea,[role='button'],.cursor-pointer,[tabindex]"
    const over = (e: MouseEvent) => setHovered(!!(e.target as Element).closest(SEL))
    window.addEventListener("mouseover", over, { passive: true })
    return () => window.removeEventListener("mouseover", over)
  }, [])

  // Hide native cursor
  useEffect(() => {
    document.documentElement.style.cursor = "none"
    return () => { document.documentElement.style.cursor = "" }
  }, [])

  // Hover ring colour — accent normally, bright white/contrasting on hover
  const ringColor = hovered ? "#ffffff" : acc
  const ringSize  = hovered ? 64 : 48

  return (
    <>
      {/* Dot — always accent, snaps instantly */}
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0, zIndex: 99999,
        width: 8, height: 8, borderRadius: "50%",
        background: acc,
        boxShadow: `0 0 10px ${acc}cc`,
        pointerEvents: "none",
        willChange: "transform",
        transition: "background 0.25s ease",
      }} />

      {/* Ring — lerps, changes colour + size on hover */}
      <div ref={ringRef} style={{
        position: "fixed", top: 0, left: 0, zIndex: 99998,
        width: ringSize, height: ringSize, borderRadius: "50%",
        border: `2px solid ${ringColor}`,
        boxShadow: hovered ? `0 0 18px ${ringColor}88` : `0 0 8px ${acc}44`,
        pointerEvents: "none",
        willChange: "transform",
        transition: "width .3s cubic-bezier(0.16,1,0.3,1), height .3s cubic-bezier(0.16,1,0.3,1), border-color .2s ease, box-shadow .2s ease",
      }} />

      <style jsx global>{`* { cursor: none !important; }`}</style>
    </>
  )
}