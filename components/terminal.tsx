"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function TerminalComponent() {
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [displayedText, setDisplayedText] = useState<string[]>([])

  const terminalLines = [
    "$ whoami",
    "alex-chen",
    "$ cat skills.txt",
    "Frontend: React, Vue.js, TypeScript, Tailwind CSS",
    "Backend: Node.js, Python, PostgreSQL, MongoDB",
    "Tools: Docker, AWS, Git, Figma",
    "$ cat passion.txt",
    "Building amazing digital experiences 🚀",
    "$ echo 'Let\\'s build something together!'",
    "Let's build something together!",
    "$ _",
  ]

  useEffect(() => {
    if (currentLine < terminalLines.length) {
      const line = terminalLines[currentLine]

      if (currentChar < line.length) {
        const timer = setTimeout(
          () => {
            setDisplayedText((prev) => {
              const newText = [...prev]
              if (!newText[currentLine]) newText[currentLine] = ""
              newText[currentLine] = line.slice(0, currentChar + 1)
              return newText
            })
            setCurrentChar((prev) => prev + 1)
          },
          Math.random() * 50 + 30,
        ) // Variable typing speed

        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setCurrentLine((prev) => prev + 1)
          setCurrentChar(0)
        }, 500)

        return () => clearTimeout(timer)
      }
    }
  }, [currentLine, currentChar, terminalLines])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="glass p-6 rounded-lg font-mono text-sm max-w-2xl mx-auto"
    >
      <div className="flex items-center mb-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="ml-4 text-gray-400">terminal</div>
      </div>

      <div className="space-y-1">
        {displayedText.map((line, index) => (
          <div key={index} className="flex">
            <span
              className={`${
                line.startsWith("$")
                  ? "text-green-400"
                  : line.includes(":") && !line.startsWith("Let")
                    ? "text-blue-400"
                    : "text-gray-300"
              }`}
            >
              {line}
            </span>
            {index === currentLine && currentChar === terminalLines[currentLine]?.length && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                className="ml-1 text-green-400"
              >
                ▋
              </motion.span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
