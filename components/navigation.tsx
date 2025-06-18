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
  const [glitchActive, setGlitchActive] = useState(false)
  const pathname = usePathname()
  const { playHover, playClick } = useAudio()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 150)
      }
    }, 3000)
    return () => clearInterval(glitchInterval)
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
    const link = document.createElement("a")
    link.href = "/assets/brian.pdf"
    link.download = "brian.pdf"
    link.click()
    playClick()
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled 
          ? "backdrop-blur-xl bg-slate-900/80 border-b border-emerald-400/20 shadow-lg shadow-emerald-400/5" 
          : "bg-transparent"
      }`}
    >
      {/* Animated border effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <Link
            href="/"
            className="flex items-center space-x-4 group"
            onMouseEnter={playHover}
            onClick={playClick}
            data-cursor="pointer"
          >
            <motion.div 
              className="relative w-14 h-14"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Outer border with corners */}
              <div className="absolute inset-0 border-2 border-emerald-400/60 rounded-lg bg-slate-900/70 backdrop-blur-sm">
                {/* Corner accents */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400"></div>
              </div>
              
              {/* Inner glow effect */}
              <div className="absolute inset-1 bg-emerald-400/10 rounded-md flex items-center justify-center">
                <motion.span 
                  className={`text-2xl font-bold font-mono ${
                    glitchActive ? 'text-red-400' : 'text-emerald-400'
                  } transition-colors duration-75`}
                  animate={glitchActive ? { x: [0, -1, 1, 0], y: [0, 1, -1, 0] } : {}}
                  transition={{ duration: 0.1 }}
                >
                  B.C
                </motion.span>
              </div>
              
              {/* Scanning line effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent h-1"
                animate={{ y: [0, 56, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            
            <div className="hidden sm:block">
              <motion.div 
                className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent font-mono"
                animate={{ backgroundPosition: ["0%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                CHEGEBB
              </motion.div>
              <div className="text-xs text-emerald-300/80 font-mono tracking-wider">
                &gt; Full Stack Developer_
              </div>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`relative px-5 py-3 text-sm font-medium transition-all duration-300 rounded-lg group overflow-hidden ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 text-emerald-300 border border-emerald-400 shadow-lg shadow-emerald-400/30 backdrop-blur-sm"
                      : "text-slate-300 hover:text-emerald-400 hover:bg-slate-800/40 border border-transparent hover:border-emerald-400/30"
                  }`}
                  onMouseEnter={playHover}
                  onClick={playClick}
                  data-cursor="pointer"
                >
                  {/* Background scan effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  <div className="relative flex items-center space-x-2">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="w-4 h-4" />
                    </motion.div>
                    <span className="font-mono tracking-wide">{item.label}</span>
                  </div>
                  
                  {/* Active hacker-style indicators */}
                  {pathname === item.href && (
                    <>
                      {/* Matrix-style rain effect */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="absolute top-0 left-2 w-px h-full bg-gradient-to-b from-emerald-400 via-emerald-400/50 to-transparent animate-pulse"></div>
                        <div className="absolute top-0 right-2 w-px h-full bg-gradient-to-b from-cyan-400 via-cyan-400/50 to-transparent animate-pulse delay-300"></div>
                      </motion.div>
                      
                      {/* Terminal cursor effect */}
                      <motion.div
                        className="absolute top-1 right-1 w-2 h-2 bg-emerald-400"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      
                      {/* Corner brackets */}
                      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400"></div>
                      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400"></div>
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400"></div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400"></div>
                      
                      {/* Glitch bars */}
                      <motion.div
                        className="absolute top-0 left-0 w-full h-px bg-emerald-400"
                        animate={{ scaleX: [0, 1, 0.8, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 w-full h-px bg-cyan-400"
                        animate={{ scaleX: [1, 0.6, 1, 0.9] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                      />
                    </>
                  )}
                </Link>
              </motion.div>
            ))}

            {/* Enhanced Download CV Button */}
            <motion.button
              onClick={handleDownloadCV}
              onMouseEnter={playHover}
              className="ml-6 relative px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg font-medium font-mono transition-all duration-300 hover:shadow-lg hover:shadow-emerald-400/30 border border-emerald-400/50 overflow-hidden group"
              data-cursor="pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Glitch bars */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                <div className="absolute top-1 left-0 w-full h-px bg-emerald-300 animate-pulse"></div>
                <div className="absolute bottom-1 left-0 w-full h-px bg-cyan-300 animate-pulse delay-75"></div>
              </div>
              
              <div className="relative flex items-center space-x-2">
                <motion.div
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Download className="w-4 h-4" />
                </motion.div>
                <span className="tracking-wider">DOWNLOAD_CV</span>
              </div>
            </motion.button>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <motion.button
            onClick={() => {
              setIsOpen(!isOpen)
              playClick()
            }}
            onMouseEnter={playHover}
            className="lg:hidden relative p-4 rounded-lg bg-slate-900/70 border-2 border-emerald-400/50 hover:border-emerald-400 transition-all duration-300 backdrop-blur-sm overflow-hidden group"
            data-cursor="pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-emerald-400"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-emerald-400"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-emerald-400"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-emerald-400"></div>
            
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

      {/* Enhanced Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden backdrop-blur-xl bg-slate-900/90 border-t border-emerald-400/30 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-4">
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
                    className={`flex items-center space-x-4 px-5 py-4 rounded-lg transition-all duration-300 border font-mono ${
                      pathname === item.href
                        ? "bg-slate-800/80 text-emerald-300 border-emerald-400/50 shadow-lg shadow-emerald-400/20"
                        : "hover:bg-slate-800/40 text-slate-300 hover:text-emerald-400 border-slate-700/50 hover:border-emerald-400/30"
                    }`}
                    data-cursor="pointer"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium tracking-wide">{item.label}</span>
                  </Link>
                </motion.div>
              ))}

              <motion.button
                onClick={() => {
                  handleDownloadCV()
                  setIsOpen(false)
                }}
                onMouseEnter={playHover}
                className="w-full flex items-center justify-center space-x-3 px-5 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg font-medium font-mono transition-all duration-300 border border-emerald-400/50"
                data-cursor="pointer"
              >
                <Download className="w-5 h-5" />
                <span className="tracking-wider">DOWNLOAD_CV</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}