"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, User, Briefcase, Gamepad2, Mail, Download, Zap, Code } from "lucide-react"
import { useAudio } from "./audio-provider"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { playHover, playClick } = useAudio()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: User },
    { href: "/skills", label: "Skills", icon: Code },
    { href: "/projects", label: "Projects", icon: Briefcase },
    { href: "/playground", label: "Playground", icon: Gamepad2 },
    { href: "/portal", label: "Portal", icon: Zap },
    { href: "/contact", label: "Contact", icon: Mail },
  ]

  const handleDownloadCV = () => {
    // Create a dummy CV download
    const link = document.createElement("a")
    link.href = "/placeholder.svg" // Replace with actual CV path
    link.download = "Brian_Chege_CV.pdf"
    link.click()
    playClick()
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? "glass-dark nav-border-flow" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3"
            onMouseEnter={playHover}
            onClick={playClick}
            data-cursor="pointer"
          >
            <div className="w-12 h-12 glass-emerald rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-400 font-mono">B.C</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-gradient-emerald font-mono">CHEGEBB</div>
              <div className="text-xs text-emerald-300 font-mono">Full Stack Developer</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                    pathname === item.href
                      ? "glass-emerald text-emerald-300"
                      : "text-slate-300 hover:text-emerald-400 hover:bg-slate-800/30"
                  }`}
                  onMouseEnter={playHover}
                  onClick={playClick}
                  data-cursor="pointer"
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Download CV Button */}
            <motion.button
              onClick={handleDownloadCV}
              onMouseEnter={playHover}
              className="ml-4 px-4 py-2 glass-emerald text-emerald-300 rounded-lg font-medium transition-all duration-300 hover:bg-emerald-500/20 flex items-center space-x-2"
              data-cursor="pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              <span>CV</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => {
              setIsOpen(!isOpen)
              playClick()
            }}
            onMouseEnter={playHover}
            className="lg:hidden p-3 rounded-lg glass-dark border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300"
            data-cursor="pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-emerald-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-emerald-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden glass-dark border-t border-emerald-400/20 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-3">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      setIsOpen(false)
                      playClick()
                    }}
                    onMouseEnter={playHover}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      pathname === item.href
                        ? "glass-emerald text-emerald-300"
                        : "hover:bg-slate-800/30 text-slate-300 hover:text-emerald-400"
                    }`}
                    data-cursor="pointer"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              ))}

              <motion.button
                onClick={() => {
                  handleDownloadCV()
                  setIsOpen(false)
                }}
                onMouseEnter={playHover}
                className="w-full flex items-center space-x-3 px-4 py-3 glass-emerald text-emerald-300 rounded-lg font-medium transition-all duration-300"
                data-cursor="pointer"
              >
                <Download className="w-5 h-5" />
                <span>Download CV</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
