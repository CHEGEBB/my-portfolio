"use client"

import type React from "react"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import {
  Github,
  ExternalLink,
  Star,
  GitFork,
  Zap,
  Rocket,
  Brain,
  Shield,
  Globe,
  Database,
  Smartphone,
  Cloud,
  Search,
  TrendingUp,
  Award,
  Users,
  Code,
  Menu,
  X,
  ChevronRight,
  Home,
  User,
  Briefcase,
  Mail,
  Trophy,
} from "lucide-react"
import Image from "next/image"

// Optimized Particle System
const FloatingParticles = ({ count = 6 }: { count?: number }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
      })),
    [count],
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-emerald-400/60 rounded-full"
          style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Infinite Scrolling Strip Component
const InfiniteScrollingStrip = () => {
  const platforms = [
    "Frontend Mentor",
    "Dev Challenges",
    "Frontend Pro",
    "Codewars",
    "HackerRank",
    "LeetCode",
    "Codeforces",
    "AtCoder",
    "TopCoder",
    "Kaggle",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "Vercel",
    "Netlify",
    "Heroku",
  ]

  // Duplicate the array to create seamless loop
  const duplicatedPlatforms = [...platforms, ...platforms]

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-emerald-900/20 via-emerald-800/30 to-emerald-900/20 border-y border-emerald-400/20 py-4 my-16">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -50 * platforms.length + "%"],
        }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {duplicatedPlatforms.map((platform, index) => (
          <div
            key={`${platform}-${index}`}
            className="flex items-center mx-8 text-emerald-300 font-mono text-lg font-bold"
          >
            <Code className="w-5 h-5 mr-2 text-emerald-400" />
            <span className="gentle-glow">{platform}</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full mx-8 opacity-60" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// GitHub API Hook
const useGitHubRepos = (username: string) => {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
        if (!response.ok) throw new Error("Failed to fetch repositories")
        const data = await response.json()
        const sortedRepos = data.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
        setRepos(sortedRepos.slice(0, 5))
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [username])

  return { repos, loading, error }
}

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hasAnimated) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true)
          let startTime: number
          let animationFrame: number

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(easeOutQuart * end))

            if (progress < 1) {
              animationFrame = requestAnimationFrame(animate)
            }
          }

          animationFrame = requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return (
    <div ref={elementRef} className="text-3xl font-black gentle-glow font-mono">
      {count}
      {suffix}
    </div>
  )
}

// Animated Navigation Component
const AnimatedNavigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("home")

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "contact", label: "Contact", icon: Mail },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="glass-dark px-6 py-3 rounded-full border border-emerald-400/30 backdrop-blur-lg">
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center"
          >
            <Code className="w-4 h-4 text-white" />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`relative px-4 py-2 rounded-full font-mono text-sm transition-all duration-300 ${
                  activeItem === item.id ? "text-emerald-400" : "text-gray-300 hover:text-emerald-400"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {activeItem === item.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-emerald-400/20 rounded-full border border-emerald-400/50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-emerald-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pt-4 border-t border-emerald-400/20"
            >
              <div className="flex flex-col space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      setActiveItem(item.id)
                      setIsOpen(false)
                    }}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
                      activeItem === item.id
                        ? "text-emerald-400 bg-emerald-400/10"
                        : "text-gray-300 hover:text-emerald-400 hover:bg-emerald-400/5"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    <ChevronRight className="w-3 h-3 ml-auto" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default function ProjectsPage() {
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [hoveredFrontendProject, setHoveredFrontendProject] = useState<number | null>(null)
  const [hoveredFeaturedProject, setHoveredFeaturedProject] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const heroParallaxY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const videoParallaxY = useTransform(scrollYProgress, [0, 1], [0, -200])

  // GitHub repos data
  const { repos, loading: reposLoading } = useGitHubRepos("CHEGEBB")

  // Project categories with icons
  const categories = useMemo(
    () => [
      { name: "All", icon: Star, color: "from-emerald-500 to-teal-600", count: 0 },
      { name: "AI/ML", icon: Brain, color: "from-purple-500 to-pink-600", count: 0 },
      { name: "Web Apps", icon: Globe, color: "from-blue-500 to-indigo-600", count: 0 },
      { name: "Mobile", icon: Smartphone, color: "from-orange-500 to-red-600", count: 0 },
      { name: "Blockchain", icon: Zap, color: "from-yellow-500 to-orange-600", count: 0 },
      { name: "Security", icon: Shield, color: "from-red-500 to-pink-600", count: 0 },
    ],
    [],
  )

  // Featured Projects Data
  const featuredProjects = useMemo(
    () => [
      {
        id: 1,
        title: "AI Code Assistant",
        description:
          "Revolutionary AI-powered development companion with real-time suggestions and automated refactoring",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop&q=80",
        category: "AI/ML",
        tech: ["OpenAI", "TypeScript", "React", "Node.js", "Python"],
        github: "https://github.com/CHEGEBB/ai-code-assistant",
        live: "https://ai-code-assistant.vercel.app",
        stats: { users: "10K+", stars: 245, forks: 89 },
        year: 2024,
        status: "Production",
      },
      {
        id: 2,
        title: "Blockchain Voting Platform",
        description: "Secure, transparent voting system built on Ethereum with end-to-end encryption",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop&q=80",
        category: "Blockchain",
        tech: ["Solidity", "Web3.js", "React", "IPFS", "Ethereum"],
        github: "https://github.com/CHEGEBB/blockchain-voting",
        live: "https://blockchain-voting.vercel.app",
        stats: { users: "5K+", stars: 189, forks: 67 },
        year: 2024,
        status: "Beta",
      },
      {
        id: 3,
        title: "Neural Network Visualizer",
        description: "Interactive 3D visualization tool for understanding deep learning architectures",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop&q=80",
        category: "AI/ML",
        tech: ["Three.js", "WebGL", "Python", "TensorFlow", "React"],
        github: "https://github.com/CHEGEBB/neural-viz",
        live: "https://neural-viz.vercel.app",
        stats: { users: "15K+", stars: 278, forks: 94 },
        year: 2024,
        status: "Production",
      },
    ],
    [],
  )

  // Enhanced projects data
  const projects = useMemo(
    () => [
      {
        id: 1,
        title: "AI Code Assistant",
        description:
          "Revolutionary AI-powered development companion with real-time suggestions and automated refactoring",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop&q=80",
        category: "AI/ML",
        tech: ["OpenAI", "TypeScript", "React", "Node.js", "Python"],
        github: "https://github.com/CHEGEBB/ai-code-assistant",
        live: "https://ai-code-assistant.vercel.app",
        featured: true,
        stats: { users: "10K+", stars: 245, forks: 89 },
        year: 2024,
        status: "Production",
      },
      {
        id: 2,
        title: "Blockchain Voting Platform",
        description: "Secure, transparent voting system built on Ethereum with end-to-end encryption",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop&q=80",
        category: "Blockchain",
        tech: ["Solidity", "Web3.js", "React", "IPFS", "Ethereum"],
        github: "https://github.com/CHEGEBB/blockchain-voting",
        live: "https://blockchain-voting.vercel.app",
        featured: true,
        stats: { users: "5K+", stars: 189, forks: 67 },
        year: 2024,
        status: "Beta",
      },
      {
        id: 3,
        title: "Real-time Collaboration Hub",
        description: "Multi-user workspace with live editing, video calls, and project management",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&q=80",
        category: "Web Apps",
        tech: ["Socket.io", "WebRTC", "React", "Express", "MongoDB"],
        github: "https://github.com/CHEGEBB/collab-hub",
        live: "https://collab-hub.vercel.app",
        featured: false,
        stats: { users: "25K+", stars: 312, forks: 156 },
        year: 2023,
        status: "Production",
      },
      {
        id: 4,
        title: "Neural Network Visualizer",
        description: "Interactive 3D visualization tool for understanding deep learning architectures",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop&q=80",
        category: "AI/ML",
        tech: ["Three.js", "WebGL", "Python", "TensorFlow", "React"],
        github: "https://github.com/CHEGEBB/neural-viz",
        live: "https://neural-viz.vercel.app",
        featured: false,
        stats: { users: "15K+", stars: 278, forks: 94 },
        year: 2024,
        status: "Production",
      },
      {
        id: 5,
        title: "Cybersecurity Training Platform",
        description: "Gamified security training with hands-on labs and real-world scenarios",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop&q=80",
        category: "Security",
        tech: ["Docker", "Kubernetes", "React", "Node.js", "Python"],
        github: "https://github.com/CHEGEBB/cyber-training",
        live: "https://cyber-training.vercel.app",
        featured: false,
        stats: { users: "8K+", stars: 156, forks: 43 },
        year: 2023,
        status: "Production",
      },
      {
        id: 6,
        title: "Mobile Fitness Tracker",
        description: "Cross-platform fitness app with AI-powered workout recommendations",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80",
        category: "Mobile",
        tech: ["React Native", "Expo", "Firebase", "TensorFlow Lite"],
        github: "https://github.com/CHEGEBB/fitness-tracker",
        live: "https://fitness-tracker-app.vercel.app",
        featured: false,
        stats: { users: "12K+", stars: 203, forks: 78 },
        year: 2023,
        status: "Production",
      },
    ],
    [],
  )

  // Frontend Mentor Projects Data
  const frontendMentorProjects = useMemo(
    () => [
      {
        id: 1,
        title: "E-commerce Product Page",
        difficulty: "Junior",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&q=80",
        tech: ["HTML", "CSS", "JavaScript"],
        github: "https://github.com/CHEGEBB/ecommerce-product-page",
        live: "https://ecommerce-product-page-demo.vercel.app",
        completed: true,
      },
      {
        id: 2,
        title: "Interactive Rating Component",
        difficulty: "Newbie",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop&q=80",
        tech: ["React", "CSS", "JavaScript"],
        github: "https://github.com/CHEGEBB/interactive-rating",
        live: "https://interactive-rating-demo.vercel.app",
        completed: true,
      },
      {
        id: 3,
        title: "NFT Preview Card",
        difficulty: "Newbie",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop&q=80",
        tech: ["HTML", "CSS", "Flexbox"],
        github: "https://github.com/CHEGEBB/nft-preview-card",
        live: "https://nft-preview-card-demo.vercel.app",
        completed: true,
      },
      {
        id: 4,
        title: "Advice Generator App",
        difficulty: "Junior",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&q=80",
        tech: ["JavaScript", "API", "CSS"],
        github: "https://github.com/CHEGEBB/advice-generator",
        live: "https://advice-generator-demo.vercel.app",
        completed: true,
      },
      {
        id: 5,
        title: "Todo App",
        difficulty: "Intermediate",
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop&q=80",
        tech: ["React", "Local Storage", "CSS Grid"],
        github: "https://github.com/CHEGEBB/todo-app",
        live: "https://todo-app-demo.vercel.app",
        completed: true,
      },
      {
        id: 6,
        title: "REST Countries API",
        difficulty: "Intermediate",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop&q=80",
        tech: ["React", "API", "Search", "Filter"],
        github: "https://github.com/CHEGEBB/rest-countries",
        live: "https://rest-countries-demo.vercel.app",
        completed: true,
      },
    ],
    [],
  )

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesFilter = selectedFilter === "All" || project.category === selectedFilter
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tech.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesFilter && matchesSearch
    })
  }, [projects, selectedFilter, searchTerm])

  // Optimized handlers
  const handleFilterChange = useCallback((filter: string) => {
    setSelectedFilter(filter)
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen pt-20 px-4 relative overflow-hidden bg-slate-900">
      {/* Animated Navigation */}
      <AnimatedNavigation />

      {/* Hero Parallax Background - Updated with object-contain */}
      <motion.div
        style={{ y: heroParallaxY }}
        className="fixed inset-0 z-0 opacity-30"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20, ease: "linear" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop&q=80"
          alt="Tech Background"
          fill
          className="object-contain"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-900/80" />
      </motion.div>

      {/* Video Parallax Background for Other Sections */}
      <motion.div style={{ y: videoParallaxY }} className="fixed inset-0 z-0 opacity-20">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover" style={{ filter: "blur(1px)" }}>
          <source
            src="https://cdn.pixabay.com/vimeo/639030/code-139030.mp4?width=1280&hash=b0d4b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-slate-900/60" />
      </motion.div>

      {/* Floating Code Particles */}
      <div className="fixed inset-0 z-0 overflow-hidden opacity-10">
        <FloatingParticles count={15} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-black mb-8 font-mono text-gradient-emerald gentle-glow"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, type: "spring" }}
          >
            PROJECT_NEXUS
          </motion.h1>
          <motion.p
            className="text-xl text-emerald-300 max-w-4xl mx-auto font-mono mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {">"} Exploring digital frontiers and innovative solutions...
          </motion.p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {[
              { label: "Projects", value: 50, suffix: "+" },
              { label: "Technologies", value: 25, suffix: "+" },
              { label: "Years", value: 5, suffix: "+" },
              { label: "Stars", value: 1200, suffix: "+" },
            ].map((stat, index) => (
              <div key={stat.label} className="glass-dark p-4 rounded-lg border border-emerald-400/20">
                <div className="text-emerald-400 mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-400 font-mono">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Infinite Scrolling Strip */}
        <InfiniteScrollingStrip />

        {/* GitHub Featured Repositories */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-emerald-400 font-mono mb-4">FEATURED_REPOSITORIES</h2>
            <p className="text-gray-400 font-mono">Most starred projects from GitHub</p>
          </div>

          {reposLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-dark p-6 rounded-lg border border-emerald-400/20 animate-pulse">
                  <div className="h-4 bg-emerald-400/20 rounded mb-4"></div>
                  <div className="h-3 bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repos.slice(0, 6).map((repo: any, index) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="glass-dark p-6 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors font-mono">
                      {repo.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Star className="w-4 h-4" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{repo.description || "No description"}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {repo.language && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span>{repo.language}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <GitFork className="w-3 h-3" />
                        <span>{repo.forks_count}</span>
                      </div>
                    </div>

                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 glass-emerald rounded-lg border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-200"
                    >
                      <Github className="w-4 h-4 text-emerald-400" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Featured Projects Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-emerald-400 font-mono mb-4">FEATURED_PROJECTS</h2>
            <p className="text-gray-400 font-mono">Handpicked showcase • Premium quality builds</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredFeaturedProject(project.id)}
                onMouseLeave={() => setHoveredFeaturedProject(null)}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] glass-dark border-2 border-emerald-400/30 group-hover:border-emerald-400/70 transition-all duration-500">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full text-white text-xs font-mono font-bold">
                      <Trophy className="w-3 h-3" />
                      <span>FEATURED</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 text-xs font-mono rounded-full border backdrop-blur-sm ${
                        project.status === "Production"
                          ? "bg-green-500/20 text-green-400 border-green-400/50"
                          : "bg-blue-500/20 text-blue-400 border-blue-400/50"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/20 to-transparent" />

                  {/* Hover Actions */}
                  <AnimatePresence>
                    {hoveredFeaturedProject === project.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4"
                      >
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 glass-dark rounded-full border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Github className="w-6 h-6 text-emerald-400" />
                        </motion.a>
                        <motion.a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 glass-emerald rounded-full border border-emerald-400/50 hover:border-emerald-400/80 transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ExternalLink className="w-6 h-6 text-emerald-400" />
                        </motion.a>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Project Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-3 font-mono group-hover:text-emerald-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs font-mono glass-emerald text-emerald-300 rounded-full border border-emerald-400/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="px-3 py-1 text-xs font-mono bg-gray-500/20 text-gray-400 rounded-full">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{project.stats.users}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>{project.stats.stars}</span>
                        </div>
                      </div>
                      <span className="text-emerald-400">{project.year}</span>
                    </div>
                  </div>

                  {/* Floating Particles on Hover */}
                  <AnimatePresence>
                    {hoveredFeaturedProject === project.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                      >
                        <FloatingParticles count={12} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full lg:w-80 pl-12 pr-4 py-3 glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 border border-emerald-400/20 font-mono"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => handleFilterChange(category.name)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                    selectedFilter === category.name
                      ? "glass-emerald text-emerald-300 border-emerald-400/50"
                      : "glass-dark text-gray-300 hover:text-emerald-400 border-emerald-400/20"
                  } border font-mono`}
                >
                  <div className="flex items-center space-x-2">
                    <category.icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </div>
                  {selectedFilter === category.name && (
                    <motion.div
                      layoutId="activeFilter"
                      className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-20 rounded-lg`}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Revolutionary Cardless Projects Grid */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-emerald-400 font-mono mb-4">PROJECT_SHOWCASE</h2>
            <p className="text-gray-400 font-mono">Hover to explore • Click to experience</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFilter + searchTerm}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative cursor-pointer"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  {/* Project Image Container */}
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] glass-dark border border-emerald-400/20 group-hover:border-emerald-400/60 transition-all duration-500">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 text-xs font-mono rounded-full border backdrop-blur-sm ${
                          project.status === "Production"
                            ? "bg-green-500/20 text-green-400 border-green-400/50"
                            : "bg-blue-500/20 text-blue-400 border-blue-400/50"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    {/* Year Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-400/50 rounded-full backdrop-blur-sm">
                        {project.year}
                      </span>
                    </div>

                    {/* Hover Actions */}
                    <AnimatePresence>
                      {hoveredProject === project.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4"
                        >
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 glass-dark rounded-full border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Github className="w-6 h-6 text-emerald-400" />
                          </motion.a>
                          <motion.a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 glass-emerald rounded-full border border-emerald-400/50 hover:border-emerald-400/80 transition-all duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ExternalLink className="w-6 h-6 text-emerald-400" />
                          </motion.a>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Project Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-2 font-mono group-hover:text-emerald-400 transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-xs font-mono glass-emerald text-emerald-300 rounded-full border border-emerald-400/30"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 3 && (
                          <span className="px-2 py-1 text-xs font-mono bg-gray-500/20 text-gray-400 rounded-full">
                            +{project.tech.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Project Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{project.stats.users}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>{project.stats.stars}</span>
                          </div>
                        </div>
                        <span className="text-emerald-400">{project.category}</span>
                      </div>
                    </div>

                    {/* Floating Particles on Hover */}
                    <AnimatePresence>
                      {hoveredProject === project.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0"
                        >
                          <FloatingParticles count={8} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="glass-dark p-12 rounded-lg border border-emerald-400/20">
                <Search className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-emerald-400 mb-4 font-mono">NO_PROJECTS_FOUND</h3>
                <p className="text-gray-400 font-mono">Try adjusting your search criteria or filters.</p>
              </div>
            </motion.div>
          )}
        </motion.section>

        {/* Project Analytics Dashboard */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-emerald-400 font-mono mb-4">PROJECT_ANALYTICS</h2>
            <p className="text-gray-400 font-mono">Real-time performance metrics</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                label: "Total Projects",
                value: 50,
                suffix: "+",
                color: "text-emerald-400",
                gradient: "from-emerald-500 to-teal-600",
              },
              {
                icon: Users,
                label: "Active Users",
                value: 75,
                suffix: "K+",
                color: "text-blue-400",
                gradient: "from-blue-500 to-indigo-600",
              },
              {
                icon: Star,
                label: "GitHub Stars",
                value: 1200,
                suffix: "+",
                color: "text-yellow-400",
                gradient: "from-yellow-500 to-orange-600",
              },
              {
                icon: Award,
                label: "Success Rate",
                value: 98,
                suffix: "%",
                color: "text-purple-400",
                gradient: "from-purple-500 to-pink-600",
              },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-dark p-6 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300 text-center relative overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <metric.icon className={`w-12 h-12 ${metric.color} mx-auto mb-4`} />
                <div className={`${metric.color} mb-2`}>
                  <AnimatedCounter end={metric.value} suffix={metric.suffix} />
                </div>
                <div className="text-sm text-gray-300 font-mono">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Frontend Mentor Projects Section - Moved here after Project Analytics */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-emerald-400 font-mono mb-4">FRONTEND_MENTOR_CHALLENGES</h2>
            <p className="text-gray-400 font-mono">Completed challenges • Pixel-perfect implementations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {frontendMentorProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredFrontendProject(project.id)}
                onMouseLeave={() => setHoveredFrontendProject(null)}
              >
                <div className="relative overflow-hidden rounded-xl aspect-[3/2] glass-dark border border-emerald-400/20 group-hover:border-emerald-400/50 transition-all duration-300">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/20 to-transparent" />

                  {/* Difficulty Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2 py-1 text-xs font-mono rounded-full border backdrop-blur-sm ${
                        project.difficulty === "Newbie"
                          ? "bg-green-500/20 text-green-400 border-green-400/50"
                          : project.difficulty === "Junior"
                            ? "bg-blue-500/20 text-blue-400 border-blue-400/50"
                            : "bg-purple-500/20 text-purple-400 border-purple-400/50"
                      }`}
                    >
                      {project.difficulty}
                    </span>
                  </div>

                  {/* Completion Badge */}
                  {project.completed && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                          className="w-3 h-3 bg-white rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Hover Actions */}
                  <AnimatePresence>
                    {hoveredFrontendProject === project.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-3"
                      >
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 glass-dark rounded-full border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Github className="w-4 h-4 text-emerald-400" />
                        </motion.a>
                        <motion.a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 glass-emerald rounded-full border border-emerald-400/50 hover:border-emerald-400/80 transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ExternalLink className="w-4 h-4 text-emerald-400" />
                        </motion.a>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Project Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm font-bold text-white mb-2 font-mono group-hover:text-emerald-400 transition-colors duration-300">
                      {project.title}
                    </h3>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.tech.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-xs font-mono glass-emerald text-emerald-300 rounded border border-emerald-400/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 2 && (
                        <span className="px-2 py-0.5 text-xs font-mono bg-gray-500/20 text-gray-400 rounded">
                          +{project.tech.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Technology Stack Showcase */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-emerald-400 font-mono mb-4">TECH_ARSENAL</h2>
            <p className="text-gray-400 font-mono">Technologies powering innovation</p>
          </div>

          <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  category: "Frontend",
                  icon: Globe,
                  color: "text-blue-400",
                  techs: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Three.js"],
                },
                {
                  category: "Backend",
                  icon: Database,
                  color: "text-green-400",
                  techs: ["Node.js", "Python", "Express", "GraphQL", "MongoDB"],
                },
                {
                  category: "DevOps",
                  icon: Cloud,
                  color: "text-purple-400",
                  techs: ["Docker", "Kubernetes", "AWS", "Vercel", "GitHub Actions"],
                },
              ].map((stack, index) => (
                <motion.div
                  key={stack.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-6">
                    <stack.icon className={`w-8 h-8 ${stack.color} mr-3`} />
                    <h3 className={`text-xl font-bold ${stack.color} font-mono`}>{stack.category}</h3>
                  </div>
                  <div className="space-y-3">
                    {stack.techs.map((tech, techIndex) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                        viewport={{ once: true }}
                        whileHover={{ x: 5, scale: 1.02 }}
                        className="px-4 py-2 glass-emerald rounded-lg border border-emerald-400/30 font-mono text-sm"
                      >
                        {tech}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="glass-dark p-12 rounded-2xl border border-emerald-400/20 relative overflow-hidden">
            <FloatingParticles count={10} />
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-emerald-400 mb-6 font-mono">READY_TO_COLLABORATE?</h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Let's build something extraordinary together. Your vision, my expertise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="https://github.com/CHEGEBB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 glass-dark border border-emerald-400/30 rounded-lg font-mono text-emerald-300 hover:border-emerald-400/60 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Github className="w-5 h-5" />
                  <span>VIEW_GITHUB</span>
                </motion.a>
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-mono text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Rocket className="w-5 h-5" />
                  <span>START_PROJECT</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
