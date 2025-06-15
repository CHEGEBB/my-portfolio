"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useAudio } from "./audio-provider"
import { useEffect } from "react"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { playTransition } = useAudio()

  useEffect(() => {
    playTransition()
  }, [pathname, playTransition])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
          scale: 0.8,
          rotateX: -90,
          filter: "blur(10px)",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          rotateX: 0,
          filter: "blur(0px)",
        }}
        exit={{
          opacity: 0,
          scale: 1.2,
          rotateX: 90,
          filter: "blur(10px)",
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
