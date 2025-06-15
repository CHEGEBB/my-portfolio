"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Rocket,
  Star,
  Eye,
  Brain,
  Cpu,
  Play,
  Zap,
  Terminal,
  Gamepad2,
  Globe,
  Smartphone,
  Server,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import { MatrixRain } from "@/components/matrix-rain"
import { Portal3D } from "@/components/portal-3d"
import { useAudio } from "@/components/audio-provider"
import { useRef, useEffect, useState } from "react"
import { SkeletonLoader } from "@/components/skeleton-loader"

export default function HomePage() {
  const { playHover, playClick } = useAudio()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [isLoading, setIsLoading] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const y = useTransform(scrollYProgress, [0, 1], [0, -300])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const mouseX = (e.clientX - centerX) / rect.width
        const mouseY = (e.clientY - centerY) / rect.height
        setMousePosition({ x: mouseX, y: mouseY })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  if (isLoading) {
    return <SkeletonLoader />
  }

  const techStack = [
    { name: "React", icon: "⚛️", color: "text-blue-400" },
    { name: "Next.js", icon: "▲", color: "text-white" },
    { name: "TypeScript", icon: "TS", color: "text-blue-500" },
    { name: "Node.js", icon: "🟢", color: "text-green-500" },
    { name: "Python", icon: "🐍", color: "text-yellow-400" },
    { name: "MongoDB", icon: "🍃", color: "text-green-400" },
    { name: "PostgreSQL", icon: "🐘", color: "text-blue-600" },
    { name: "Docker", icon: "🐳", color: "text-blue-400" },
    { name: "AWS", icon: "☁️", color: "text-orange-400" },
    { name: "GraphQL", icon: "◈", color: "text-pink-400" },
  ]

  const featuredProjects = [
    {
      title: "AI-Powered Code Assistant",
      description:
        "Revolutionary AI assistant that helps developers write better code with real-time suggestions and automated refactoring",
      image: "/placeholder.svg?height=400&width=600",
      tech: ["OpenAI", "TypeScript", "React", "Node.js", "WebSockets"],
      github: "https://github.com",
      live: "https://example.com",
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Blockchain Voting System",
      description: "Secure, transparent voting platform built on blockchain technology with end-to-end encryption",
      image: "/placeholder.svg?height=400&width=600",
      tech: ["Solidity", "Web3.js", "React", "IPFS", "MetaMask"],
      github: "https://github.com",
      live: "https://example.com",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Real-time Collaboration Platform",
      description: "Multi-user collaborative workspace with real-time editing, video calls, and project management",
      image: "/placeholder.svg?height=400&width=600",
      tech: ["Socket.io", "WebRTC", "React", "Express", "Redis"],
      github: "https://github.com",
      live: "https://example.com",
      color: "from-purple-500 to-pink-600",
    },
  ]

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-slate-900">
      <MatrixRain />

      {/* Enhanced Background */}
      <div className="fixed inset-0 hero-bg z-0" />
      <div className="fixed inset-0 cyber-grid-subtle opacity-30 z-0" />

      {/* Floating Tech Icons */}
      <div className="fixed inset-0 pointer-events-none z-5">
        {techStack.map((tech, index) => (
          <motion.div
            key={tech.name}
            className={`absolute text-4xl ${tech.color} opacity-20`}
            style={{
              left: `${10 + ((index * 8) % 80)}%`,
              top: `${20 + ((index * 12) % 60)}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + index,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: index * 0.5,
            }}
          >
            {tech.icon}
          </motion.div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 z-10">
        <motion.div style={{ y, opacity, scale }} className="max-w-6xl mx-auto text-center">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-12"
          >
            <motion.h1
              className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-none font-mono"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`,
              }}
            >
              <span className="text-gradient-emerald gentle-glow">ENTER</span>
              <br />
              <span className="text-gradient-emerald gentle-glow">PORTAL</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-xl md:text-2xl text-emerald-300 font-mono tracking-wider mb-8"
            >
              <span className="inline-block">{">"}</span>
              <motion.span
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="inline-block ml-2"
              >
                Brian Chege - Full Stack Reality Architect
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                className="inline-block ml-1 text-emerald-400"
              >
                ▋
              </motion.span>
            </motion.div>
          </motion.div>

          {/* 3D Portal - Enhanced */}
          <motion.div
            initial={{ opacity: 0, scale: 0, rotateX: -90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
            className="w-96 h-96 mx-auto mb-16 relative float-animation"
          >
            {/* Portal Rings */}
            <div
              className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-spin"
              style={{ animationDuration: "20s" }}
            />
            <div
              className="absolute inset-8 rounded-full border border-emerald-300/40 animate-spin"
              style={{ animationDuration: "15s", animationDirection: "reverse" }}
            />
            <div
              className="absolute inset-16 rounded-full border border-emerald-200/50 animate-spin"
              style={{ animationDuration: "10s" }}
            />

            {/* 3D Portal Content */}
            <div className="absolute inset-20 rounded-full overflow-hidden">
              <Portal3D />
            </div>

            {/* Portal Glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  "0 0 50px rgba(16, 185, 129, 0.3), inset 0 0 50px rgba(16, 185, 129, 0.1)",
                  "0 0 80px rgba(16, 185, 129, 0.4), inset 0 0 80px rgba(16, 185, 129, 0.2)",
                  "0 0 50px rgba(16, 185, 129, 0.3), inset 0 0 50px rgba(16, 185, 129, 0.1)",
                ],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />

            {/* Enter Portal Button */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <Link
                href="/portal"
                className="glass-emerald px-6 py-3 rounded-full font-mono font-bold text-emerald-300 hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                onMouseEnter={playHover}
                onClick={playClick}
                data-cursor="pointer"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>ENTER PORTAL</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/projects"
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-bold text-lg overflow-hidden transition-all duration-300"
                onMouseEnter={playHover}
                onClick={playClick}
                data-cursor="pointer"
              >
                <span className="relative z-10 flex items-center space-x-2 text-white">
                  <Rocket className="w-5 h-5" />
                  <span>View Projects</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/skills"
                className="group relative px-8 py-4 glass-emerald border-2 border-emerald-400/50 rounded-lg font-bold text-lg hover:border-emerald-400 transition-all duration-300"
                onMouseEnter={playHover}
                onClick={playClick}
                data-cursor="pointer"
              >
                <span className="relative z-10 flex items-center space-x-2 text-emerald-300 group-hover:text-white">
                  <Code className="w-5 h-5" />
                  <span>View Skills</span>
                </span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="group relative px-8 py-4 glass-emerald border-2 border-emerald-400/50 rounded-lg font-bold text-lg hover:border-emerald-400 transition-all duration-300"
                onMouseEnter={playHover}
                onClick={playClick}
                data-cursor="pointer"
              >
                <span className="relative z-10 flex items-center space-x-2 text-emerald-300 group-hover:text-white">
                  <Zap className="w-5 h-5" />
                  <span>Get In Touch</span>
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="flex flex-col items-center space-y-2 text-emerald-400"
          >
            <span className="text-sm font-mono">Scroll to explore</span>
            <ArrowDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* Tech Stack Showcase */}
      <section className="relative py-32 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-gradient-emerald gentle-glow font-mono">
              TECH ARSENAL
            </h2>
            <p className="text-xl text-emerald-300/80 font-mono max-w-3xl mx-auto">
              Cutting-edge technologies I use to build the impossible
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 50, rotateY: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group skill-item"
                data-cursor="pointer"
              >
                <div className="glass-dark p-6 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500 text-center">
                  <div className={`text-4xl mb-4 ${tech.color} tech-float`}>{tech.icon}</div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                    {tech.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              href="/skills"
              className="inline-flex items-center space-x-3 px-8 py-4 glass-emerald border-2 border-emerald-400/50 rounded-lg font-bold text-lg hover:border-emerald-400 transition-all duration-300 group"
              onMouseEnter={playHover}
              onClick={playClick}
              data-cursor="pointer"
            >
              <span className="text-emerald-300 group-hover:text-white transition-colors duration-300">
                Explore All Skills
              </span>
              <Code className="w-5 h-5 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-32 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-gradient-emerald gentle-glow font-mono">
              SYSTEM METRICS
            </h2>
            <p className="text-xl text-emerald-300/80 font-mono max-w-3xl mx-auto">
              Real-time performance indicators from the CHEGEBB neural network
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                label: "Projects Completed",
                value: "50+",
                color: "text-emerald-400",
                desc: "Successful Deployments",
              },
              {
                icon: Code,
                label: "Lines of Code",
                value: "500K+",
                color: "text-teal-400",
                desc: "Written & Optimized",
              },
              { icon: Cpu, label: "System Uptime", value: "99.9%", color: "text-green-400", desc: "Reliability Score" },
              { icon: Eye, label: "Coffee Consumed", value: "∞", color: "text-cyan-400", desc: "Fuel for Innovation" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative group"
              >
                <div className="glass-dark p-8 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300 text-center">
                  <stat.icon className={`w-12 h-12 ${stat.color} mx-auto mb-4`} />
                  <div className={`text-4xl font-black mb-2 ${stat.color} gentle-glow font-mono`}>{stat.value}</div>
                  <div className="text-lg font-bold text-white mb-1">{stat.label}</div>
                  <div className="text-sm text-slate-400">{stat.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="relative py-32 px-4 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-gradient-emerald gentle-glow font-mono">
              FEATURED PROJECTS
            </h2>
            <p className="text-xl text-emerald-300/80 font-mono max-w-3xl mx-auto">
              Cutting-edge applications that push the boundaries of technology
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 100, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -20, scale: 1.02 }}
                className="group relative"
              >
                <div className="glass-dark rounded-lg overflow-hidden border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500">
                  {/* Project Image */}
                  <div className="relative overflow-hidden h-64">
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20`} />
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-4">
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 glass-emerald rounded-lg border border-emerald-400/50 hover:border-emerald-400 transition-all duration-300"
                        onMouseEnter={playHover}
                        onClick={playClick}
                        data-cursor="pointer"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Github className="w-6 h-6 text-emerald-400" />
                      </motion.a>
                      <motion.a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 glass-emerald rounded-lg border border-emerald-400/50 hover:border-emerald-400 transition-all duration-300"
                        onMouseEnter={playHover}
                        onClick={playClick}
                        data-cursor="pointer"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                      >
                        <ExternalLink className="w-6 h-6 text-emerald-400" />
                      </motion.a>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                      {project.title}
                    </h3>
                    <p className="text-slate-300 mb-4 text-sm leading-relaxed">{project.description}</p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: techIndex * 0.1 }}
                          className="px-3 py-1 text-xs font-mono glass-emerald text-emerald-300 rounded-full border border-emerald-400/30"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              href="/projects"
              className="inline-flex items-center space-x-3 px-8 py-4 glass-emerald border-2 border-emerald-400/50 rounded-lg font-bold text-lg hover:border-emerald-400 transition-all duration-300 group"
              onMouseEnter={playHover}
              onClick={playClick}
              data-cursor="pointer"
            >
              <span className="text-emerald-300 group-hover:text-white transition-colors duration-300">
                View All Projects
              </span>
              <Star className="w-5 h-5 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="relative py-32 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-gradient-emerald gentle-glow font-mono">
              QUICK ACCESS
            </h2>
            <p className="text-xl text-emerald-300/80 font-mono max-w-3xl mx-auto">
              Direct pathways to different dimensions of my digital universe
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                title: "Terminal Access",
                description: "Direct command-line interface to my development environment",
                icon: Terminal,
                href: "/playground",
                color: "from-green-500 to-emerald-600",
              },
              {
                title: "Gaming Zone",
                description: "Interactive games and entertainment experiences",
                icon: Gamepad2,
                href: "/playground",
                color: "from-blue-500 to-indigo-600",
              },
              {
                title: "Neural Network",
                description: "Explore my thought processes and development journey",
                icon: Brain,
                href: "/about",
                color: "from-purple-500 to-pink-600",
              },
              {
                title: "Portal Gateway",
                description: "Enter the immersive portal experience",
                icon: Zap,
                href: "/portal",
                color: "from-cyan-500 to-blue-600",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50, rotateY: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, rotateY: 5 }}
                className="group"
              >
                <Link
                  href={item.href}
                  className="block glass-dark p-8 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500 text-center"
                  onMouseEnter={playHover}
                  onClick={playClick}
                  data-cursor="pointer"
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-lg bg-gradient-to-br ${item.color} p-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-32 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-gradient-emerald gentle-glow font-mono">
              SERVICES
            </h2>
            <p className="text-xl text-emerald-300/80 font-mono max-w-3xl mx-auto">
              Comprehensive solutions for your digital transformation needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Full Stack Development",
                description: "End-to-end web application development with modern technologies and best practices",
                icon: Globe,
                features: ["React/Next.js", "Node.js/Express", "Database Design", "API Development"],
              },
              {
                title: "Mobile App Development",
                description: "Cross-platform mobile applications with native performance and user experience",
                icon: Smartphone,
                features: ["React Native", "Flutter", "iOS/Android", "App Store Deployment"],
              },
              {
                title: "Cloud & DevOps",
                description: "Scalable cloud infrastructure and automated deployment pipelines",
                icon: Server,
                features: ["AWS/Azure", "Docker/Kubernetes", "CI/CD Pipelines", "Monitoring"],
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="glass-dark p-8 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500 h-full">
                  <service.icon className="w-12 h-12 text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                    {service.title}
                  </h3>
                  <p className="text-slate-300 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={feature} className="flex items-center space-x-2 text-sm text-slate-400">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-4 z-10 border-t border-emerald-400/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 glass-emerald rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-400 font-mono">B.C</span>
                </div>
                <div>
                  <div className="text-xl font-bold text-gradient-emerald font-mono">CHEGEBB</div>
                  <div className="text-sm text-emerald-300/80 font-mono">Full Stack Developer</div>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                Crafting digital experiences that bridge the gap between imagination and reality. Specializing in
                full-stack development, AI integration, and immersive web technologies.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-emerald-400 mb-4 font-mono">Navigation</h4>
              <ul className="space-y-2">
                {[
                  { href: "/", label: "Home", icon: Star },
                  { href: "/about", label: "About", icon: Brain },
                  { href: "/skills", label: "Skills", icon: Code },
                  { href: "/projects", label: "Projects", icon: Briefcase },
                  { href: "/contact", label: "Contact", icon: Mail },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-slate-300 hover:text-emerald-400 transition-colors duration-300 text-sm flex items-center space-x-2"
                      onMouseEnter={playHover}
                      onClick={playClick}
                      data-cursor="pointer"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-lg font-bold text-emerald-400 mb-4 font-mono">Connect</h4>
              <div className="flex space-x-4">
                {[
                  { icon: Github, href: "https://github.com", label: "GitHub" },
                  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                  { icon: Mail, href: "mailto:brian@chegebb.com", label: "Email" },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 glass-emerald rounded-lg flex items-center justify-center text-emerald-400 hover:text-white transition-all duration-300"
                    onMouseEnter={playHover}
                    onClick={playClick}
                    data-cursor="pointer"
                    whileHover={{ scale: 1.1, y: -2 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-emerald-400/20 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm font-mono">© 2024 Brian Chege (CHEGEBB). All rights reserved.</div>
            <div className="text-slate-400 text-sm font-mono mt-4 md:mt-0">
              Built with Next.js, Three.js & lots of ☕
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
