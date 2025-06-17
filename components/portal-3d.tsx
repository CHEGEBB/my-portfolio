"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Portal3DProps {
  isActive: boolean
}

export function Portal3D({ isActive }: Portal3DProps) {
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const createParticle = () => {
      if (!particlesRef.current) return

      const particle = document.createElement("div")
      particle.className = `absolute w-1 h-1 rounded-full pointer-events-none ${
        isActive ? "bg-purple-400 shadow-purple-400/50" : "bg-emerald-400 shadow-emerald-400/50"
      }`

      particle.style.left = Math.random() * 100 + "%"
      particle.style.top = Math.random() * 100 + "%"

      const duration = Math.random() * 3 + 2
      particle.style.animation = `portalFloat ${duration}s ease-in-out infinite`

      particlesRef.current.appendChild(particle)

      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove()
        }
      }, duration * 1000)
    }

    for (let i = 0; i < 20; i++) {
      setTimeout(() => createParticle(), i * 100)
    }

    const interval = setInterval(createParticle, 500)
    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div className="w-80 h-80 relative overflow-hidden rounded-full bg-gradient-radial from-black via-emerald-950 to-black flex items-center justify-center border-4 border-emerald-500/30">
      <div className="absolute inset-0 bg-gradient-radial from-emerald-900/20 via-transparent to-transparent animate-pulse rounded-full"></div>

      {/* Rotating rings */}
      <motion.div
        className={`absolute inset-8 rounded-full border-2 ${isActive ? "border-purple-500/60" : "border-emerald-500/60"}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className={`absolute inset-16 rounded-full border ${isActive ? "border-pink-400/50" : "border-cyan-400/50"}`}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className={`absolute inset-24 rounded-full border ${isActive ? "border-purple-400/40" : "border-emerald-400/40"}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Center glow */}
      <motion.div
        className={`absolute inset-32 rounded-full ${
          isActive
            ? "bg-gradient-radial from-purple-500/30 via-pink-500/15 to-transparent"
            : "bg-gradient-radial from-emerald-500/20 via-cyan-500/10 to-transparent"
        } backdrop-blur-sm`}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div ref={particlesRef} className="absolute inset-0 pointer-events-none rounded-full"></div>

      <style jsx>{`
        @keyframes portalFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
          25% { transform: translateY(-15px) rotate(90deg); opacity: 0.8; }
          50% { transform: translateY(-8px) rotate(180deg); opacity: 0.6; }
          75% { transform: translateY(-20px) rotate(270deg); opacity: 0.9; }
        }
      `}</style>
    </div>
  )
}
