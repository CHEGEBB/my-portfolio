"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ProfileShapeProps {
  imageUrl: string
  className?: string
}

export function ProfileShape({ imageUrl, className = "" }: ProfileShapeProps) {
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [textIndex, setTextIndex] = useState(0)

  const texts = [
    "Full Stack Developer",
    "AI/ML Enthusiast",
    "Blockchain Developer",
    "UI/UX Designer",
    "Problem Solver",
    "Innovation Driver",
  ]

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        const current = texts[textIndex]

        if (!isDeleting) {
          if (currentText.length < current.length) {
            setCurrentText(current.slice(0, currentText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(current.slice(0, currentText.length - 1))
          } else {
            setIsDeleting(false)
            setTextIndex((prev) => (prev + 1) % texts.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, textIndex, texts])

  return (
    <div className={`relative ${className}`}>
      {/* Hexagonal Shape */}
      <motion.div
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-80 h-80 mx-auto"
      >
        {/* Outer Glow Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        />

        {/* Middle Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute inset-4 rounded-full border border-emerald-300/40"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        />

        {/* Profile Image Container */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="absolute inset-8 overflow-hidden"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          <img src={imageUrl || "/placeholder.svg"} alt="Brian Chege" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent" />
        </motion.div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400 rounded-full"
            style={{
              top: `${20 + i * 10}%`,
              left: `${10 + i * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>

      {/* Animated Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-center mt-6"
      >
        <h3 className="text-2xl font-bold text-white mb-2 font-mono">Brian Chege</h3>
        <div className="h-8 flex items-center justify-center">
          <span className="text-emerald-400 font-mono text-lg">
            {currentText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
              className="ml-1"
            >
              |
            </motion.span>
          </span>
        </div>
      </motion.div>
    </div>
  )
}
