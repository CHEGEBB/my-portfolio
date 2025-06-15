"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const mouseLeave = () => setIsVisible(false)
    const mouseEnter = () => setIsVisible(true)

    window.addEventListener("mousemove", mouseMove)
    document.addEventListener("mouseleave", mouseLeave)
    document.addEventListener("mouseenter", mouseEnter)

    // Add hover effects for interactive elements
    const addEventListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, [data-cursor="pointer"]')
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setCursorVariant("hover"))
        el.addEventListener("mouseleave", () => setCursorVariant("default"))
      })

      const codeElements = document.querySelectorAll("code, pre, .terminal")
      codeElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setCursorVariant("code"))
        el.addEventListener("mouseleave", () => setCursorVariant("default"))
      })

      const skillElements = document.querySelectorAll(".skill-item")
      skillElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setCursorVariant("skill"))
        el.addEventListener("mouseleave", () => setCursorVariant("default"))
      })
    }

    addEventListeners()

    return () => {
      window.removeEventListener("mousemove", mouseMove)
      document.removeEventListener("mouseleave", mouseLeave)
      document.removeEventListener("mouseenter", mouseEnter)
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      scale: 1,
      backgroundColor: "rgba(16, 185, 129, 0.8)",
      border: "2px solid rgba(16, 185, 129, 1)",
    },
    hover: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 2,
      backgroundColor: "rgba(52, 211, 153, 0.6)",
      border: "2px solid rgba(52, 211, 153, 1)",
    },
    code: {
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
      scale: 1.5,
      backgroundColor: "rgba(34, 197, 94, 0.8)",
      border: "2px solid rgba(34, 197, 94, 1)",
    },
    skill: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      scale: 2.5,
      backgroundColor: "rgba(59, 130, 246, 0.6)",
      border: "2px solid rgba(59, 130, 246, 1)",
    },
  }

  if (!isVisible) return null

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-50 mix-blend-screen"
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
      />

      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-49 border-2 border-emerald-400/50"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: cursorVariant === "hover" ? 2 : cursorVariant === "skill" ? 3 : 1,
          rotate: cursorVariant === "skill" ? 180 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
        style={{
          boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
        }}
      />
    </>
  )
}
