"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxBackgroundProps {
  imageUrl: string
  children?: React.ReactNode
  overlay?: boolean
}

export function ParallaxBackground({ imageUrl, children, overlay = true }: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.8, 0.3])

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt="Background"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>

      {overlay && (
        <motion.div
          style={{ opacity }}
          className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-emerald-900/80"
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  )
}
