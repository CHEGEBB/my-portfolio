"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")
  const [isVisible, setIsVisible] = useState(false)
  const [trailPositions, setTrailPositions] = useState<Array<{ x: number; y: number; id: number }>>([])
  const [colorMode, setColorMode] = useState(0)
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const lastPositionRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()
  const trailIdRef = useRef(0)

  // Color themes that cycle through
  const colorThemes = [
    {
      primary: "rgba(16, 185, 129, 0.9)",
      border: "rgba(16, 185, 129, 1)",
      ring: "rgba(16, 185, 129, 0.4)",
      glow: "0 0 30px rgba(16, 185, 129, 0.6)"
    },
    {
      primary: "rgba(236, 72, 153, 0.9)",
      border: "rgba(236, 72, 153, 1)",
      ring: "rgba(236, 72, 153, 0.4)",
      glow: "0 0 30px rgba(236, 72, 153, 0.6)"
    },
    {
      primary: "rgba(59, 130, 246, 0.9)",
      border: "rgba(59, 130, 246, 1)",
      ring: "rgba(59, 130, 246, 0.4)",
      glow: "0 0 30px rgba(59, 130, 246, 0.6)"
    },
    {
      primary: "rgba(245, 101, 101, 0.9)",
      border: "rgba(245, 101, 101, 1)",
      ring: "rgba(245, 101, 101, 0.4)",
      glow: "0 0 30px rgba(245, 101, 101, 0.6)"
    },
    {
      primary: "rgba(168, 85, 247, 0.9)",
      border: "rgba(168, 85, 247, 1)",
      ring: "rgba(168, 85, 247, 0.4)",
      glow: "0 0 30px rgba(168, 85, 247, 0.6)"
    }
  ]

  const currentTheme = colorThemes[colorMode]

  // Optimized mouse tracking with RAF
  const updateMousePosition = useCallback((e: MouseEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const newX = e.clientX
      const newY = e.clientY
      
      // Calculate velocity for dynamic effects
      const velX = newX - lastPositionRef.current.x
      const velY = newY - lastPositionRef.current.y
      setVelocity({ x: velX, y: velY })
      
      setMousePosition({ x: newX, y: newY })
      setIsVisible(true)
      
      // Add trail effect
      setTrailPositions(prev => {
        const newTrail = { x: newX, y: newY, id: trailIdRef.current++ }
        const updated = [newTrail, ...prev.slice(0, 8)] // Keep 8 trail points
        return updated
      })
      
      lastPositionRef.current = { x: newX, y: newY }
    })
  }, [])

  useEffect(() => {
    const mouseLeave = () => setIsVisible(false)
    const mouseEnter = () => setIsVisible(true)

    // Optimized event listeners with passive option
    window.addEventListener("mousemove", updateMousePosition, { passive: true })
    document.addEventListener("mouseleave", mouseLeave)
    document.addEventListener("mouseenter", mouseEnter)

    // Enhanced hover effects for more elements
    const addEventListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, [data-cursor="pointer"], input, textarea, select')
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setCursorVariant("hover"), { passive: true })
        el.addEventListener("mouseleave", () => setCursorVariant("default"), { passive: true })
      })

      const codeElements = document.querySelectorAll("code, pre, .terminal, .code-block")
      codeElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setCursorVariant("code"), { passive: true })
        el.addEventListener("mouseleave", () => setCursorVariant("default"), { passive: true })
      })

      const skillElements = document.querySelectorAll(".skill-item, .card, .project-card")
      skillElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setCursorVariant("skill"), { passive: true })
        el.addEventListener("mouseleave", () => setCursorVariant("default"), { passive: true })
      })

      const headingElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      headingElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setCursorVariant("text"), { passive: true })
        el.addEventListener("mouseleave", () => setCursorVariant("default"), { passive: true })
      })
    }

    // Color cycling on click
    const handleClick = () => {
      setColorMode(prev => (prev + 1) % colorThemes.length)
    }

    // Keyboard shortcut to change colors
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault()
        setColorMode(prev => (prev + 1) % colorThemes.length)
      }
    }

    document.addEventListener("click", handleClick)
    document.addEventListener("keydown", handleKeyPress)
    
    addEventListeners()

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      document.removeEventListener("mouseleave", mouseLeave)
      document.removeEventListener("mouseenter", mouseEnter)
      document.removeEventListener("click", handleClick)
      document.removeEventListener("keydown", handleKeyPress)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [updateMousePosition, colorThemes.length])

  // Dynamic size based on velocity
  const getVelocityScale = () => {
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y)
    return Math.min(1 + speed * 0.01, 2) // Scale up based on speed, max 2x
  }

  const variants = {
    default: {
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
      scale: 1.5 * getVelocityScale(),
      backgroundColor: currentTheme.primary,
      border: `3px solid ${currentTheme.border}`,
      rotate: 0,
    },
    hover: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      scale: 2.5 * getVelocityScale(),
      backgroundColor: currentTheme.primary,
      border: `3px solid ${currentTheme.border}`,
      rotate: 45,
    },
    code: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 2 * getVelocityScale(),
      backgroundColor: currentTheme.primary,
      border: `3px solid ${currentTheme.border}`,
      rotate: 90,
    },
    skill: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      scale: 3 * getVelocityScale(),
      backgroundColor: currentTheme.primary,
      border: `3px solid ${currentTheme.border}`,
      rotate: 180,
    },
    text: {
      x: mousePosition.x - 2,
      y: mousePosition.y - 16,
      scale: 0.3,
      backgroundColor: currentTheme.primary,
      border: `2px solid ${currentTheme.border}`,
      rotate: 0,
      width: "2px",
      height: "20px",
      borderRadius: "1px",
    },
  }

  if (!isVisible) return null

  return (
    <>
      {/* Trail Effect */}
      {trailPositions.map((pos, index) => (
        <motion.div
          key={pos.id}
          className="fixed pointer-events-none z-40"
          style={{
            width: `${Math.max(4, 12 - index)}px`,
            height: `${Math.max(4, 12 - index)}px`,
            backgroundColor: currentTheme.primary,
            borderRadius: "50%",
            opacity: Math.max(0.1, 0.8 - index * 0.1),
            x: pos.x - Math.max(2, 6 - index * 0.5),
            y: pos.y - Math.max(2, 6 - index * 0.5),
          }}
          animate={{
            scale: [1, 0.8, 0.6],
            opacity: [0.8 - index * 0.1, 0.4 - index * 0.05, 0],
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Main Cursor */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50 mix-blend-screen"
        style={{
          width: cursorVariant === "text" ? "2px" : "24px",
          height: cursorVariant === "text" ? "20px" : "24px",
          boxShadow: currentTheme.glow,
        }}
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 35,
          mass: 0.5,
        }}
      />

      {/* Outer Ring with Pulsing Effect */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-49"
        style={{
          width: "40px",
          height: "40px",
          border: `2px solid ${currentTheme.ring}`,
          boxShadow: currentTheme.glow,
        }}
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: cursorVariant === "hover" ? 2.5 : cursorVariant === "skill" ? 3.5 : cursorVariant === "text" ? 0.5 : 1.5,
          rotate: cursorVariant === "skill" ? 360 : cursorVariant === "code" ? 180 : 90,
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          opacity: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 2,
            ease: "linear",
          },
        }}
      />

      {/* Color Mode Indicator */}
      <motion.div
        className="fixed bottom-4 right-4 px-3 py-1 rounded-full text-xs font-mono pointer-events-none z-50"
        style={{
          backgroundColor: currentTheme.primary,
          color: "white",
          border: `1px solid ${currentTheme.border}`,
          boxShadow: currentTheme.glow,
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Color {colorMode + 1}/5 • Click or Ctrl+C to change
      </motion.div>
    </>
  )
}