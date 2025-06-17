"use client"

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  Database,
  Globe,
  Smartphone,
  Server,
  Zap,
  Star,
  Code,
  Brain,
  Cpu,
  Eye,
  Terminal,
  Layers,
  GitBranch,
  CpuIcon,
  ShieldCheck,
  BookOpen,
  Hexagon,
} from "lucide-react"
import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { MatrixRain } from "@/components/matrix-rain"
import { useAudio } from "@/components/audio-provider"
import Image from "next/image"

// Optimized counter with reduced re-renders
const AnimatedCounter = ({ end, duration = 1.5, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hasAnimated) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true)
          let startTime: number | null = null

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(easeOutQuart * end))

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "50px" },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return (
    <div ref={elementRef} className="text-4xl font-black gentle-glow font-mono">
      {count}
      {suffix}
    </div>
  )
}

// Reduced particle count for better performance
const OptimizedParticles = ({ count = 4 }: { count?: number }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      })),
    [count],
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-emerald-400/60 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Lightweight background component
const LightweightParallaxBg = ({ scrollYProgress }: { scrollYProgress: any }) => {
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -20])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.95, 0.9])

  return <motion.div className="fixed inset-0 hero-bg z-0" style={{ opacity, y: parallaxY }} />
}

export default function SkillsPage() {
  const { playHover, playClick } = useAudio()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [hoveredCert, setHoveredCert] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Optimize scroll calculations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Memoized tech stack data (keeping unchanged as requested)
  const techStack = useMemo(
    () => [
      {
        name: "React",
        icon: "/assets/react.svg",
        glowColor: "group-hover:shadow-blue-400/20",
        description: "Building interactive UIs with reusable components",
        experience: "2.5+ years",
        projects: "20+",
        level: 95,
      },
      {
        name: "Next.js",
        icon: "/assets/nextjs.svg",
        glowColor: "group-hover:shadow-white/20",
        description: "Server-side rendering and static site generation",
        experience: "2+ years",
        projects: "15+",
        level: 90,
      },
      {
        name: "TypeScript",
        icon: "/assets/typescript.svg",
        glowColor: "group-hover:shadow-blue-500/20",
        description: "Type-safe code with enhanced developer experience",
        experience: "2+ years",
        projects: "18+",
        level: 88,
      },
      {
        name: "Node.js",
        icon: "/assets/nodejs.svg",
        glowColor: "group-hover:shadow-green-500/20",
        description: "Building scalable server-side applications",
        experience: "2.5+ years",
        projects: "22+",
        level: 93,
      },
      {
        name: "Python",
        icon: "/assets/python.svg",
        glowColor: "group-hover:shadow-yellow-400/20",
        description: "Data processing, automation and scripting",
        experience: "2+ years",
        projects: "12+",
        level: 87,
      },
      {
        name: "MongoDB",
        icon: "/assets/mongodb.svg",
        glowColor: "group-hover:shadow-green-400/20",
        description: "Flexible document-based data storage",
        experience: "2+ years",
        projects: "14+",
        level: 90,
      },
      {
        name: "PostgreSQL",
        icon: "/assets/postgresql.svg",
        glowColor: "group-hover:shadow-blue-600/20",
        description: "Robust relational database implementation",
        experience: "2+ years",
        projects: "10+",
        level: 88,
      },
      {
        name: "Docker",
        icon: "/assets/docker.svg",
        glowColor: "group-hover:shadow-blue-400/20",
        description: "Containerization for consistent deployments",
        experience: "1.5+ years",
        projects: "8+",
        level: 85,
      },
      {
        name: "AWS",
        icon: "/assets/aws.svg",
        glowColor: "group-hover:shadow-orange-400/20",
        description: "Cloud infrastructure and serverless solutions",
        experience: "1.5+ years",
        projects: "7+",
        level: 80,
      },
      {
        name: "GraphQL",
        icon: "/assets/graphql.svg",
        glowColor: "group-hover:shadow-pink-400/20",
        description: "Efficient API queries with precise data fetching",
        experience: "1.5+ years",
        projects: "9+",
        level: 85,
      },
    ],
    [],
  )

  const skillCategories = useMemo(
    () => [
      { name: "All", icon: Star, color: "from-emerald-500 to-teal-600" },
      { name: "Frontend", icon: Globe, color: "from-blue-500 to-indigo-600" },
      { name: "Backend", icon: Server, color: "from-purple-500 to-pink-600" },
      { name: "Database", icon: Database, color: "from-green-500 to-emerald-600" },
      { name: "Mobile", icon: Smartphone, color: "from-orange-500 to-red-600" },
      { name: "DevOps", icon: Zap, color: "from-yellow-500 to-orange-600" },
    ],
    [],
  )

  // Reduced and optimized skills list
  const skills = useMemo(
    () => [
      // Frontend
      {
        name: "React",
        level: 95,
        category: "Frontend",
        icon: <Hexagon className="w-6 h-6 text-blue-400" />,
        color: "text-blue-400",
        description: "Building dynamic UIs with hooks and components",
        projects: 24,
        experience: "2.5+ years",
      },
      {
        name: "Next.js",
        level: 90,
        category: "Frontend",
        icon: <Hexagon className="w-6 h-6 text-white" />,
        color: "text-white",
        description: "Full-stack React framework with SSR",
        projects: 18,
        experience: "2+ years",
      },
      {
        name: "TypeScript",
        level: 88,
        category: "Frontend",
        icon: <Hexagon className="w-6 h-6 text-blue-500" />,
        color: "text-blue-500",
        description: "Type-safe JavaScript development",
        projects: 20,
        experience: "2+ years",
      },
      {
        name: "Angular",
        level: 82,
        category: "Frontend",
        icon: <Hexagon className="w-6 h-6 text-red-500" />,
        color: "text-red-500",
        description: "Enterprise-grade frontend framework",
        projects: 8,
        experience: "1.5+ years",
      },
      {
        name: "Vue.js",
        level: 78,
        category: "Frontend",
        icon: <Hexagon className="w-6 h-6 text-green-500" />,
        color: "text-green-500",
        description: "Progressive framework for UIs",
        projects: 6,
        experience: "1+ year",
      },

      // Backend
      {
        name: "Node.js",
        level: 93,
        category: "Backend",
        icon: <Server className="w-6 h-6 text-green-500" />,
        color: "text-green-500",
        description: "JavaScript runtime for servers",
        projects: 22,
        experience: "2.5+ years",
      },
      {
        name: "Express.js",
        level: 90,
        category: "Backend",
        icon: <Zap className="w-6 h-6 text-gray-400" />,
        color: "text-gray-400",
        description: "Fast web framework for Node.js",
        projects: 20,
        experience: "2.5+ years",
      },
      {
        name: "Python",
        level: 87,
        category: "Backend",
        icon: <Terminal className="w-6 h-6 text-yellow-400" />,
        color: "text-yellow-400",
        description: "Versatile programming language",
        projects: 15,
        experience: "2+ years",
      },
      {
        name: "REST APIs",
        level: 95,
        category: "Backend",
        icon: <GitBranch className="w-6 h-6 text-blue-400" />,
        color: "text-blue-400",
        description: "API architecture and design",
        projects: 25,
        experience: "2.5+ years",
      },

      // Database
      {
        name: "MongoDB",
        level: 90,
        category: "Database",
        icon: <Database className="w-6 h-6 text-green-400" />,
        color: "text-green-400",
        description: "NoSQL document database",
        projects: 18,
        experience: "2+ years",
      },
      {
        name: "PostgreSQL",
        level: 88,
        category: "Database",
        icon: <Database className="w-6 h-6 text-blue-600" />,
        color: "text-blue-600",
        description: "Advanced relational database",
        projects: 14,
        experience: "2+ years",
      },
      {
        name: "Firebase",
        level: 85,
        category: "Database",
        icon: <Database className="w-6 h-6 text-orange-400" />,
        color: "text-orange-400",
        description: "Backend-as-a-Service platform",
        projects: 12,
        experience: "1.5+ years",
      },

      // Mobile
      {
        name: "React Native",
        level: 87,
        category: "Mobile",
        icon: <Smartphone className="w-6 h-6 text-blue-400" />,
        color: "text-blue-400",
        description: "Cross-platform mobile development",
        projects: 10,
        experience: "2+ years",
      },
      {
        name: "Flutter",
        level: 75,
        category: "Mobile",
        icon: <Smartphone className="w-6 h-6 text-blue-500" />,
        color: "text-blue-500",
        description: "Google's mobile UI toolkit",
        projects: 6,
        experience: "1+ year",
      },
      {
        name: "Expo",
        level: 85,
        category: "Mobile",
        icon: <Smartphone className="w-6 h-6 text-purple-400" />,
        color: "text-purple-400",
        description: "React Native development platform",
        projects: 8,
        experience: "1.5+ years",
      },

      // DevOps
      {
        name: "Docker",
        level: 85,
        category: "DevOps",
        icon: <Layers className="w-6 h-6 text-blue-400" />,
        color: "text-blue-400",
        description: "Containerization technology",
        projects: 15,
        experience: "1.5+ years",
      },
      {
        name: "AWS",
        level: 80,
        category: "DevOps",
        icon: <Cpu className="w-6 h-6 text-orange-400" />,
        color: "text-orange-400",
        description: "Cloud services platform",
        projects: 12,
        experience: "1.5+ years",
      },
      {
        name: "CI/CD",
        level: 88,
        category: "DevOps",
        icon: <GitBranch className="w-6 h-6 text-green-500" />,
        color: "text-green-500",
        description: "Automated deployment pipelines",
        projects: 20,
        experience: "2+ years",
      },
    ],
    [],
  )

  // Filter skills based on selected category
  const filteredSkills = useMemo(
    () => (selectedCategory === "All" ? skills : skills.filter((skill) => skill.category === selectedCategory)),
    [selectedCategory, skills],
  )

  // Enhanced certifications with hover details
  const certifications = useMemo(
    () => [
      {
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        year: "2024",
        icon: <Cpu className="w-8 h-8 text-orange-400" />,
        image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop",
        description:
          "Demonstrates expertise in developing and maintaining applications on AWS platform with best practices for security, performance, and cost optimization.",
        skills: ["Lambda", "DynamoDB", "S3", "CloudFormation"],
      },
      {
        name: "React Professional",
        issuer: "Meta",
        year: "2024",
        icon: <Hexagon className="w-8 h-8 text-blue-400" />,
        image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=300&fit=crop",
        description:
          "Advanced certification covering React ecosystem, hooks, state management, performance optimization, and modern development patterns.",
        skills: ["Hooks", "Context API", "Performance", "Testing"],
      },
      {
        name: "Node.js Certified",
        issuer: "OpenJS Foundation",
        year: "2023",
        icon: <Server className="w-8 h-8 text-green-500" />,
        image: "https://images.unsplash.com/photo-1579403124614-197f69d8187b?w=400&h=300&fit=crop",
        description:
          "Comprehensive certification in Node.js application development, including async programming, streams, and production deployment strategies.",
        skills: ["Express", "Async/Await", "Streams", "Security"],
      },
      {
        name: "MongoDB Associate",
        issuer: "MongoDB Inc.",
        year: "2023",
        icon: <Database className="w-8 h-8 text-green-400" />,
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
        description:
          "Proficiency in MongoDB database design, operations, indexing strategies, and aggregation framework for scalable applications.",
        skills: ["Aggregation", "Indexing", "Sharding", "Replication"],
      },
    ],
    [],
  )

  // Terminal text with optimized typing effect
  const [terminalText, setTerminalText] = useState("")
  const fullText = "> Initializing skill matrix... Neural pathways optimized for peak performance."

  useEffect(() => {
    let index = 0
    const typingSpeed = 60

    const typeChar = () => {
      if (index <= fullText.length) {
        setTerminalText(fullText.substring(0, index))
        index++
        setTimeout(typeChar, typingSpeed)
      }
    }

    const timer = setTimeout(typeChar, 500)
    return () => clearTimeout(timer)
  }, [fullText])

  // Optimize category selection
  const handleCategoryClick = useCallback(
    (categoryName: string) => {
      if (categoryName !== selectedCategory) {
        setSelectedCategory(categoryName)
        playClick()
      }
    },
    [selectedCategory, playClick],
  )

  // Updated performance metrics
  const performanceMetrics = useMemo(
    () => [
      { icon: Brain, label: "Technologies Mastered", value: 18, suffix: "+", color: "text-emerald-400" },
      { icon: Code, label: "Years of Experience", value: 2.5, suffix: "", color: "text-blue-400" },
      { icon: CpuIcon, label: "Projects Completed", value: 50, suffix: "+", color: "text-purple-400" },
      { icon: Eye, label: "Lines of Code", value: 300, suffix: "K+", color: "text-cyan-400" },
    ],
    [],
  )

  return (
    <div className="min-h-screen pt-20 px-4 relative overflow-hidden bg-slate-900" ref={containerRef}>
      {/* Keep Matrix Rain unchanged */}
      <MatrixRain />

      {/* Optimized Background */}
      <LightweightParallaxBg scrollYProgress={scrollYProgress} />
      <div className="fixed inset-0 cyber-grid-subtle opacity-20 z-0" />

      {/* Reduced SVG Particles for better performance */}
      <div className="fixed inset-0 z-0 overflow-hidden opacity-10 pointer-events-none">
        <svg className="absolute w-full h-full">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 1.5 + 0.5}
              fill={["#00ffcc", "#00ff99"][Math.floor(Math.random() * 2)]}
              filter="url(#glow)"
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: Math.random() * 3,
              }}
            />
          ))}
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header - keeping unchanged */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 font-mono text-gradient-emerald gentle-glow">
            SKILL_MATRIX
          </h1>
          <motion.div
            className="glass-terminal p-4 rounded-lg border border-emerald-400/30 max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-xl text-emerald-300 font-mono">
              {terminalText}
              <span className="cursor inline-block h-5 w-2 bg-emerald-400 ml-1 animate-pulse"></span>
            </p>
          </motion.div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {skillCategories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => handleCategoryClick(category.name)}
                onMouseEnter={playHover}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative px-6 py-3 rounded-lg font-bold transition-all duration-200 ${
                  selectedCategory === category.name
                    ? "glass-emerald text-emerald-300 border-emerald-400/50"
                    : "glass-dark text-gray-300 hover:text-emerald-400 border-emerald-400/20"
                } border`}
              >
                <div className="relative z-10 flex items-center space-x-2">
                  <category.icon className="w-5 h-5" />
                  <span className="font-mono">{category.name}</span>
                </div>

                {selectedCategory === category.name && (
                  <motion.div
                    layoutId="activeCategory"
                    className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-20 rounded-lg`}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack - keeping unchanged as requested */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">TECH_STACK</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
                whileHover={{ y: -8, scale: 1.03, rotateY: 5 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group relative"
              >
                <div className="glass-card relative h-full rounded-xl border border-emerald-400/20 group-hover:border-emerald-400/40 transition-all duration-300">
                  <div className="p-6 h-full flex flex-col">
                    <div className="mx-auto mb-4 relative">
                      <div className="relative w-16 h-16 mx-auto">
                        <Image
                          src={tech.icon || "/placeholder.svg"}
                          alt={tech.name}
                          width={64}
                          height={64}
                          className="object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-center mb-2 text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                      {tech.name}
                    </h3>

                    <p className="text-sm text-gray-400 text-center mb-4 flex-grow">{tech.description}</p>

                    <div className="mt-auto grid grid-cols-2 gap-2 text-xs">
                      <div className="glass-dark-light p-2 rounded text-center">
                        <span className="block text-gray-400 mb-1">Experience</span>
                        <span className="text-emerald-400 font-bold font-mono">{tech.experience}</span>
                      </div>
                      <div className="glass-dark-light p-2 rounded text-center">
                        <span className="block text-gray-400 mb-1">Projects</span>
                        <span className="text-emerald-400 font-bold font-mono">{tech.projects}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Optimized Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          >
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
                whileHover={{ y: -8, scale: 1.02, rotateX: 5 }}
                className="group skill-item"
                onMouseEnter={playHover}
              >
                <div className="glass-dark p-6 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300 h-full relative overflow-hidden">
                  <OptimizedParticles count={3} />

                  <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-4">
                      <motion.div
                        className={`text-3xl ${skill.color} transition-transform duration-300`}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        {skill.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                          {skill.name}
                        </h3>
                        <p className="text-sm text-gray-400">{skill.description}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400 font-mono">Proficiency</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: Math.min(index * 0.05, 0.5) }}
                          viewport={{ once: true, margin: "-50px" }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="glass-dark-light p-2 rounded text-center">
                        <span className="block text-xs text-gray-400 mb-1">Projects</span>
                        <span className="text-emerald-400 font-bold font-mono">{skill.projects}</span>
                      </div>
                      <div className="glass-dark-light p-2 rounded text-center">
                        <span className="block text-xs text-gray-400 mb-1">Experience</span>
                        <span className="text-emerald-400 font-bold font-mono">{skill.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">PERFORMANCE_METRICS</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {performanceMetrics.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.05, y: -5, rotateY: 10 }}
                className="glass-dark p-6 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300 text-center"
              >
                <motion.div
                  className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full glass-dark-light"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className={`w-10 h-10 ${stat.color}`} />
                </motion.div>
                <div className={`mb-2 ${stat.color} gentle-glow font-mono`}>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-300 font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Certifications with hover effects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">CERTIFICATIONS</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.08, y: -10, rotateY: 5 }}
                className="group relative"
                onMouseEnter={() => setHoveredCert(index)}
                onMouseLeave={() => setHoveredCert(null)}
              >
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${cert.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-slate-900/70 group-hover:bg-slate-900/50 transition-colors duration-300"></div>
                  </div>

                  <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center">
                    <motion.div className="mb-4" whileHover={{ scale: 1.2, rotate: 10 }} transition={{ duration: 0.3 }}>
                      {cert.icon}
                    </motion.div>
                    <h3 className="text-lg font-bold text-white mb-2 font-mono group-hover:text-emerald-400 transition-colors duration-300">
                      {cert.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-1">{cert.issuer}</p>
                    <p className="text-xs text-emerald-400 font-mono">{cert.year}</p>
                  </div>
                </div>

                {/* Enhanced hover details */}
                <AnimatePresence>
                  {hoveredCert === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -bottom-4 left-0 right-0 z-10 glass-dark p-4 rounded-lg border border-emerald-400/40 mx-2"
                    >
                      <p className="text-sm text-gray-300 mb-3">{cert.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {cert.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-emerald-400/20 text-emerald-400 text-xs font-mono rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Logical Learning Path */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">LEARNING_PATH</h2>
          <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Currently Learning */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-emerald-400 mb-6 font-mono flex items-center justify-center">
                  <Terminal className="w-6 h-6 mr-2" />
                  CURRENTLY_LEARNING
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Dart & Flutter", icon: <Smartphone className="w-4 h-4" />, progress: 75 },
                    { name: "React Native", icon: <Code className="w-4 h-4" />, progress: 85 },
                    { name: "Angular", icon: <Layers className="w-4 h-4" />, progress: 80 },
                    { name: "Vue.js", icon: <Hexagon className="w-4 h-4" />, progress: 70 },
                  ].map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      whileHover={{ x: 5, scale: 1.02 }}
                      className="px-4 py-3 glass-emerald rounded-lg text-sm font-mono"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {tech.icon}
                          <span>{tech.name}</span>
                        </div>
                        <span className="text-xs">{tech.progress}%</span>
                      </div>
                      <div className="w-full bg-emerald-900/30 rounded-full h-1">
                        <motion.div
                          className="h-full bg-emerald-400 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${tech.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Next Targets */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-blue-400 mb-6 font-mono flex items-center justify-center">
                  <GitBranch className="w-6 h-6 mr-2" />
                  NEXT_TARGETS
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Flask (Python)", icon: <Terminal className="w-4 h-4" /> },
                    { name: "NestJS", icon: <Server className="w-4 h-4" /> },
                    { name: "Golang", icon: <Zap className="w-4 h-4" /> },
                    { name: "C# Desktop", icon: <Cpu className="w-4 h-4" /> },
                  ].map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      whileHover={{ y: -2, scale: 1.02 }}
                      className="px-4 py-3 bg-blue-500/20 border border-blue-400/30 rounded-lg text-sm font-mono flex items-center justify-center space-x-2"
                    >
                      {tech.icon}
                      <span>{tech.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Future Vision */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-purple-400 mb-6 font-mono flex items-center justify-center">
                  <BookOpen className="w-6 h-6 mr-2" />
                  FUTURE_VISION
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Rust", icon: <ShieldCheck className="w-4 h-4" /> },
                    { name: "WebAssembly", icon: <Cpu className="w-4 h-4" /> },
                    { name: "Machine Learning", icon: <Brain className="w-4 h-4" /> },
                    { name: "Blockchain", icon: <Layers className="w-4 h-4" /> },
                  ].map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      whileHover={{ x: -2, scale: 1.02 }}
                      className="px-4 py-3 bg-purple-500/20 border border-purple-400/30 rounded-lg text-sm font-mono flex items-center justify-center space-x-2"
                    >
                      {tech.icon}
                      <span>{tech.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center py-10"
        >
          <motion.p className="text-emerald-400 font-mono" whileHover={{ scale: 1.05 }}>
            <Terminal className="w-4 h-4 inline-block mr-2 mb-1" />
            SKILL_MATRIX_SCAN_COMPLETE
          </motion.p>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .glass-dark {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(16, 185, 129, 0.1);
        }
        
        .glass-emerald {
          background: rgba(16, 185, 129, 0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .glass-card {
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(10px);
        }
        
        .glass-dark-light {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
        }
        
        .glass-terminal {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(15px);
        }
        
        .text-gradient-emerald {
          background: linear-gradient(135deg, #10b981, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gentle-glow {
          text-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }
        
        .hero-bg {
          background: radial-gradient(ellipse at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%),
                      radial-gradient(ellipse at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
                      radial-gradient(ellipse at 20% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
        }
        
        .cyber-grid-subtle {
          background-image: 
            linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        .cursor {
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        /* Performance optimizations */
        * {
          box-sizing: border-box;
        }
        
        .skill-item {
          will-change: transform;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}
