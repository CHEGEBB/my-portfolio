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
  Award,
  Layers,
  GitBranch,
  BarChart,
  CpuIcon,
  ShieldCheck,
  Coffee,
  BookOpen,
  Hexagon,
} from "lucide-react"
import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { MatrixRain } from "@/components/matrix-rain"
import { useAudio } from "@/components/audio-provider"
import Image from "next/image"

// Virtualized and optimized counter - reduces expensive DOM updates
const AnimatedCounter = ({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

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
              animationRef.current = requestAnimationFrame(animate)
            }
          }

          animationRef.current = requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      observer.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [end, duration, hasAnimated])

  return (
    <div ref={elementRef} className="text-4xl font-black gentle-glow font-mono">
      {count}
      {suffix}
    </div>
  )
}

// Reduced particle count with optimized rendering
const OptimizedParticles = ({ count = 6 }: { count?: number }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      })),
    [count]
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-emerald-400/60 rounded-full will-change-transform"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3,
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
  // Optimize transform calculations
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -30])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 0.9, 0.9, 0.8])

  return (
    <motion.div 
      className="fixed inset-0 hero-bg z-0 will-change-transform" 
      style={{ opacity, y: parallaxY }} 
    />
  )
}

export default function SkillsPage() {
  const { playHover, playClick } = useAudio()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const containerRef = useRef<HTMLDivElement>(null)
  const hasRenderedMatrixRef = useRef(false)

  // Optimize scroll calculations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Memoized data structures to prevent re-renders
  const techStack = useMemo(
    () => [
      {
        name: "React",
        icon: "/assets/react.svg",
        glowColor: "group-hover:shadow-blue-400/20",
        description: "Building interactive UIs with reusable components",
        experience: "4+ years",
        projects: "20+",
        level: 95,
      },
      {
        name: "Next.js",
        icon: "/assets/nextjs.svg",
        glowColor: "group-hover:shadow-white/20",
        description: "Server-side rendering and static site generation",
        experience: "3+ years",
        projects: "15+",
        level: 90,
      },
      {
        name: "TypeScript",
        icon: "/assets/typescript.svg",
        glowColor: "group-hover:shadow-blue-500/20",
        description: "Type-safe code with enhanced developer experience",
        experience: "3+ years",
        projects: "18+",
        level: 88,
      },
      {
        name: "Node.js",
        icon: "/assets/nodejs.svg",
        glowColor: "group-hover:shadow-green-500/20",
        description: "Building scalable server-side applications",
        experience: "4+ years",
        projects: "22+",
        level: 93,
      },
      {
        name: "Python",
        icon: "/assets/python.svg",
        glowColor: "group-hover:shadow-yellow-400/20",
        description: "Data processing, automation and scripting",
        experience: "3+ years",
        projects: "12+",
        level: 87,
      },
      {
        name: "MongoDB",
        icon: "/assets/mongodb.svg",
        glowColor: "group-hover:shadow-green-400/20",
        description: "Flexible document-based data storage",
        experience: "3+ years",
        projects: "14+",
        level: 90,
      },
      {
        name: "PostgreSQL",
        icon: "/assets/postgresql.svg",
        glowColor: "group-hover:shadow-blue-600/20",
        description: "Robust relational database implementation",
        experience: "3+ years",
        projects: "10+",
        level: 88,
      },
      {
        name: "Docker",
        icon: "/assets/docker.svg",
        glowColor: "group-hover:shadow-blue-400/20",
        description: "Containerization for consistent deployments",
        experience: "2+ years",
        projects: "8+",
        level: 85,
      },
      {
        name: "AWS",
        icon: "/assets/aws.svg",
        glowColor: "group-hover:shadow-orange-400/20",
        description: "Cloud infrastructure and serverless solutions",
        experience: "2+ years",
        projects: "7+",
        level: 80,
      },
      {
        name: "GraphQL",
        icon: "/assets/graphql.svg",
        glowColor: "group-hover:shadow-pink-400/20",
        description: "Efficient API queries with precise data fetching",
        experience: "2+ years",
        projects: "9+",
        level: 85,
      },
    ],
    []
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
    []
  )

  const skills = useMemo(
    () => [
      // Frontend
      {
        name: "React",
        level: 95,
        category: "Frontend",
        icon: <Hexagon className="w-6 h-6 text-blue-400" />,
        color: "text-blue-400",
        description: "Building dynamic UIs with reusable components and hooks",
        projects: 24,
        experience: "4+ years",
      },
      {
        name: "Next.js",
        level: 90,
        category: "Frontend",
        icon: <Hexagon className="w-6 h-6 text-white" />,
        color: "text-white",
        description: "Full-stack React framework with SSR and static generation",
        projects: 18,
        experience: "3+ years",
      },
      {
        name: "TypeScript",
        level: 88,
        category: "Frontend",
        icon: <Hexagon className="w-6 h-6 text-blue-500" />,
        color: "text-blue-500",
        description: "Type-safe JavaScript for reliable application development",
        projects: 20,
        experience: "3+ years",
      },
      {
        name: "Vue.js",
        level: 85,
        category: "Frontend",
        icon: <Hexagon className="w-6 h-6 text-green-500" />,
        color: "text-green-500",
        description: "Progressive framework for building interactive interfaces",
        projects: 12,
        experience: "2+ years",
      },
      {
        name: "Tailwind CSS",
        level: 92,
        category: "Frontend",
        icon: <Layers className="w-6 h-6 text-cyan-400" />,
        color: "text-cyan-400",
        description: "Utility-first CSS framework for rapid UI development",
        projects: 28,
        experience: "3+ years",
      },
      {
        name: "Three.js",
        level: 80,
        category: "Frontend",
        icon: <Cpu className="w-6 h-6 text-purple-400" />,
        color: "text-purple-400",
        description: "3D graphics library for immersive web experiences",
        projects: 8,
        experience: "1+ year",
      },

      // Backend
      {
        name: "Node.js",
        level: 93,
        category: "Backend",
        icon: <Server className="w-6 h-6 text-green-500" />,
        color: "text-green-500",
        description: "JavaScript runtime for scalable server applications",
        projects: 22,
        experience: "4+ years",
      },
      {
        name: "Python",
        level: 87,
        category: "Backend",
        icon: <Terminal className="w-6 h-6 text-yellow-400" />,
        color: "text-yellow-400",
        description: "Versatile programming for automation and data processing",
        projects: 15,
        experience: "3+ years",
      },
      {
        name: "Express.js",
        level: 90,
        category: "Backend",
        icon: <Zap className="w-6 h-6 text-gray-400" />,
        color: "text-gray-400",
        description: "Fast, unopinionated web framework for Node.js",
        projects: 20,
        experience: "4+ years",
      },
      {
        name: "GraphQL",
        level: 85,
        category: "Backend",
        icon: <Hexagon className="w-6 h-6 text-pink-400" />,
        color: "text-pink-400",
        description: "Query language and runtime for efficient API development",
        projects: 12,
        experience: "2+ years",
      },
      {
        name: "REST APIs",
        level: 95,
        category: "Backend",
        icon: <GitBranch className="w-6 h-6 text-blue-400" />,
        color: "text-blue-400",
        description: "API architecture for scalable and maintainable services",
        projects: 25,
        experience: "4+ years",
      },

      // Database
      {
        name: "MongoDB",
        level: 90,
        category: "Database",
        icon: <Database className="w-6 h-6 text-green-400" />,
        color: "text-green-400",
        description: "NoSQL database for flexible document storage",
        projects: 18,
        experience: "3+ years",
      },
      {
        name: "PostgreSQL",
        level: 88,
        category: "Database",
        icon: <Database className="w-6 h-6 text-blue-600" />,
        color: "text-blue-600",
        description: "Advanced open source relational database",
        projects: 14,
        experience: "3+ years",
      },
      {
        name: "Redis",
        level: 82,
        category: "Database",
        icon: <Database className="w-6 h-6 text-red-500" />,
        color: "text-red-500",
        description: "In-memory data structure store for caching",
        projects: 10,
        experience: "2+ years",
      },
      {
        name: "Firebase",
        level: 85,
        category: "Database",
        icon: <Database className="w-6 h-6 text-orange-400" />,
        color: "text-orange-400",
        description: "Backend-as-a-Service with real-time database",
        projects: 12,
        experience: "2+ years",
      },

      // Mobile
      {
        name: "React Native",
        level: 87,
        category: "Mobile",
        icon: <Smartphone className="w-6 h-6 text-blue-400" />,
        color: "text-blue-400",
        description: "Cross-platform mobile app development with React",
        projects: 10,
        experience: "3+ years",
      },
      {
        name: "Flutter",
        level: 75,
        category: "Mobile",
        icon: <Smartphone className="w-6 h-6 text-blue-500" />,
        color: "text-blue-500",
        description: "Google's UI toolkit for native mobile experiences",
        projects: 6,
        experience: "1+ year",
      },
      {
        name: "Expo",
        level: 85,
        category: "Mobile",
        icon: <Smartphone className="w-6 h-6 text-purple-400" />,
        color: "text-purple-400",
        description: "React Native platform for rapid development",
        projects: 8,
        experience: "2+ years",
      },

      // DevOps
      {
        name: "Docker",
        level: 85,
        category: "DevOps",
        icon: <Layers className="w-6 h-6 text-blue-400" />,
        color: "text-blue-400",
        description: "Containerization for consistent deployments",
        projects: 15,
        experience: "2+ years",
      },
      {
        name: "AWS",
        level: 80,
        category: "DevOps",
        icon: <Cpu className="w-6 h-6 text-orange-400" />,
        color: "text-orange-400",
        description: "Cloud services and infrastructure",
        projects: 12,
        experience: "2+ years",
      },
      {
        name: "Kubernetes",
        level: 75,
        category: "DevOps",
        icon: <Layers className="w-6 h-6 text-blue-600" />,
        color: "text-blue-600",
        description: "Container orchestration for large-scale deployments",
        projects: 8,
        experience: "1+ year",
      },
      {
        name: "CI/CD",
        level: 88,
        category: "DevOps",
        icon: <GitBranch className="w-6 h-6 text-green-500" />,
        color: "text-green-500",
        description: "Automated testing and deployment pipelines",
        projects: 20,
        experience: "3+ years",
      },
    ],
    []
  )

  // Filter skills based on selected category - memoized to prevent re-calculation
  const filteredSkills = useMemo(
    () => (selectedCategory === "All" ? skills : skills.filter((skill) => skill.category === selectedCategory)),
    [selectedCategory, skills]
  )

  // Memoize certification data
  const certifications = useMemo(
    () => [
      {
        name: "AWS Certified Developer",
        issuer: "Amazon",
        year: "2023",
        icon: <Cpu className="w-8 h-8 text-orange-400" />,
        image:
          "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300&q=80",
        description: "Demonstrates knowledge of AWS services for developing cloud applications",
      },
      {
        name: "React Professional",
        issuer: "Meta",
        year: "2023",
        icon: <Hexagon className="w-8 h-8 text-blue-400" />,
        image:
          "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300&q=80",
        description: "Advanced certification in React development and best practices",
      },
      {
        name: "Node.js Certified",
        issuer: "OpenJS Foundation",
        year: "2022",
        icon: <Server className="w-8 h-8 text-green-500" />,
        image:
          "https://images.unsplash.com/photo-1579403124614-197f69d8187b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300&q=80",
        description: "Verified expertise in building server-side applications with Node.js",
      },
      {
        name: "MongoDB Associate",
        issuer: "MongoDB Inc.",
        year: "2022",
        icon: <Database className="w-8 h-8 text-green-400" />,
        image:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300&q=80",
        description: "Proficiency in MongoDB database design and operations",
      },
    ],
    []
  )

  // Terminal text with debounced updates and batched state changes
  const [terminalText, setTerminalText] = useState("")
  const fullText = "> Scanning neural pathways and quantum processors... System optimized for maximum performance."
  
  useEffect(() => {
    let index = 0;
    let isMounted = true;
    const typingSpeed = 50; // ms per character
    
    // Using setTimeout instead of setInterval for better performance control
    function typeNextChar() {
      if (!isMounted) return;
      
      if (index <= fullText.length) {
        setTerminalText(fullText.substring(0, index));
        index++;
        setTimeout(typeNextChar, typingSpeed);
      }
    }
    
    // Start typing after a short delay
    const initialDelay = setTimeout(typeNextChar, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(initialDelay);
    };
  }, [fullText]);

  // Optimize category selection - prevents unnecessary re-renders
  const handleCategoryClick = useCallback(
    (categoryName: string) => {
      if (categoryName !== selectedCategory) {
        setSelectedCategory(categoryName);
        playClick();
      }
    },
    [selectedCategory, playClick]
  );

  // Memoize performance metrics to prevent re-renders
  const performanceMetrics = useMemo(() => [
    { icon: Brain, label: "Technologies Mastered", value: 20, suffix: "+", color: "text-emerald-400" },
    { icon: Code, label: "Years of Experience", value: 5, suffix: "+", color: "text-blue-400" },
    { icon: CpuIcon, label: "Projects Completed", value: 50, suffix: "+", color: "text-purple-400" },
    { icon: Eye, label: "Lines of Code", value: 500, suffix: "K+", color: "text-cyan-400" },
  ], []);

  // Lazy load MatrixRain component
  const [showMatrix, setShowMatrix] = useState(false);
  useEffect(() => {
    if (!hasRenderedMatrixRef.current) {
      const timer = setTimeout(() => {
        setShowMatrix(true);
        hasRenderedMatrixRef.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen pt-20 px-4 relative overflow-hidden bg-slate-900" ref={containerRef}>
      {/* Conditionally render MatrixRain for better initial load performance */}
      {showMatrix && <MatrixRain density={0.7} />}

      {/* Optimized Background */}
      <LightweightParallaxBg scrollYProgress={scrollYProgress} />
      <div className="fixed inset-0 cyber-grid-subtle opacity-20 z-0" />

      {/* Reduced SVG Particles */}
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
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 1.5 + 0.5}
              fill={["#00ffcc", "#00ff99"][Math.floor(Math.random() * 2)]}
              filter="url(#glow)"
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: Math.random() * 3,
              }}
              className="will-change-transform"
            />
          ))}
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with optimized animations */}
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

        {/* Category Filters with windowing for better performance */}
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative px-6 py-3 rounded-lg font-bold transition-all duration-200 ${
                  selectedCategory === category.name
                    ? "glass-emerald text-emerald-300 border-emerald-400/50"
                    : "glass-dark text-gray-300 hover:text-emerald-400 border-emerald-400/20"
                } border`}
                data-cursor="pointer"
              >
                <div className="relative z-10 flex items-center space-x-2">
                  <category.icon className="w-5 h-5" />
                  <span className="font-mono">{category.name}</span>
                </div>

                {selectedCategory === category.name && (
                  <motion.div
                    layoutId="activeCategory"
                    className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-20 rounded-lg will-change-transform`}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack with virtualization and deferred loading */}
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
                whileHover={{ y: -5, scale: 1.02 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group relative"
              >
                <div className="glass-card relative h-full rounded-xl border border-emerald-400/20 group-hover:border-emerald-400/40 transition-all duration-200">
                  <div className="p-6 h-full flex flex-col">
                    {/* Tech logo - optimized image loading */}
                    <div className="mx-auto mb-4 relative">
                      <div className="relative w-16 h-16 mx-auto">
                        <Image
                          src={tech.icon || "/placeholder.svg"}
                          alt={tech.name}
                          width={64}
                          height={64}
                          className="object-contain transition-transform duration-200 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Tech name */}
                    <h3 className="text-xl font-bold text-center mb-2 text-white group-hover:text-emerald-400 transition-colors duration-200 font-mono">
                      {tech.name}
                    </h3>

                    {/* Tech description */}
                    <p className="text-sm text-gray-400 text-center mb-4 flex-grow">{tech.description}</p>

                    {/* Stats */}
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

        {/* Skills Grid with optimized animations */}
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
                whileHover={{ y: -5, scale: 1.01 }}
                className="group skill-item"
                onMouseEnter={playHover}
                data-cursor="pointer"
              >
                <div className="glass-dark p-6 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-200 h-full relative">
                  {/* Reduced particle count for better performance */}
                  <OptimizedParticles count={3} />

                  <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className={`text-3xl ${skill.color} transition-transform duration-200 group-hover:scale-110`}
                      >
                        {skill.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-200 font-mono">
                          {skill.name}
                        </h3>
                        <p className="text-sm text-gray-400">{skill.description}</p>
                      </div>
                    </div>

                    {/* Progress Bar - optimized animation */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400 font-mono">Proficiency</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full will-change-transform"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.8, delay: Math.min(index * 0.03, 0.3) }}
                          viewport={{ once: true, margin: "-50px" }}
                        />
                      </div>
                    </div>

                    {/* Additional stats */}
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

        {/* Performance Metrics with optimized counters */}
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
                whileHover={{ scale: 1.02, y: -2 }}
                className="glass-dark p-6 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-200 text-center"
              >
                <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full glass-dark-light">
                  <stat.icon className={`w-10 h-10 ${stat.color}`} />
                </div>
                <div className={`mb-2 ${stat.color} gentle-glow font-mono`}>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-300 font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications with deferred loading */}
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
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2) }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group h-56 relative"
              >
                <div
                  className="absolute inset-0 w-full h-full rounded-lg overflow-hidden"
                  style={{
                    backgroundImage: `url(${cert.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-slate-900/70"></div>

                  <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center">
                    <div className="mb-4">{cert.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2 font-mono">{cert.name}</h3>
                    <p className="text-sm text-gray-400 mb-1">{cert.issuer}</p>
                    <p className="text-xs text-emerald-400 font-mono">{cert.year}</p>
                  </div>

                  <div className="absolute bottom-2 right-2 text-xs text-emerald-400 opacity-70 font-mono">
                    Hover for details
                  </div>
                </div>

                {/* Optimized hover effect */}
                <div className="absolute inset-0 w-full h-full glass-card border border-emerald-400/30 rounded-lg p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center">
                  <div className="mb-4">{cert.icon}</div>
                  <h3 className="text-lg font-bold text-emerald-400 mb-2 font-mono">{cert.name}</h3>
                  <p className="text-sm text-gray-300 mb-4 text-center">{cert.description}</p>
                  <div className="mt-auto">
                    <p className="text-sm text-gray-400 mb-1">{cert.issuer}</p>
                    <p className="text-xs text-emerald-400 font-mono">{cert.year}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Path with optimized animations */}
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
              {/* Current learning section - with optimized animations */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-emerald-400 mb-6 font-mono flex items-center justify-center">
                  <Terminal className="w-6 h-6 mr-2" />
                  CURRENTLY_LEARNING
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Rust", icon: <Code className="w-4 h-4" /> },
                    { name: "WebAssembly", icon: <Cpu className="w-4 h-4" /> },
                    { name: "Machine Learning", icon: <Brain className="w-4 h-4" /> },
                    { name: "Blockchain", icon: <Layers className="w-4 h-4" /> },
                  ].map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
                      viewport={{ once: true, margin: "-50px" }}
                      whileHover={{ x: 5, scale: 1.02 }}
                      className="px-4 py-3 glass-emerald rounded-lg text-sm font-mono flex items-center justify-center space-x-2"
                    >
                      {tech.icon}
                      <span>{tech.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Next targets section - with optimized animations */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-blue-400 mb-6 font-mono flex items-center justify-center">
                  <GitBranch className="w-6 h-6 mr-2" />
                  NEXT_TARGETS
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Go", icon: <Zap className="w-4 h-4" /> },
                    { name: "Kubernetes", icon: <Layers className="w-4 h-4" /> },
                    { name: "GraphQL", icon: <Database className="w-4 h-4" /> },
                    { name: "AR/VR", icon: <Eye className="w-4 h-4" /> },
                  ].map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
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

              {/* Future vision section - with optimized animations */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-purple-400 mb-6 font-mono flex items-center justify-center">
                  <BookOpen className="w-6 h-6 mr-2" />
                  FUTURE_VISION
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Quantum Computing", icon: <Cpu className="w-4 h-4" /> },
                    { name: "Neural Networks", icon: <Brain className="w-4 h-4" /> },
                    { name: "Space Tech", icon: <Zap className="w-4 h-4" /> },
                    { name: "Biotech", icon: <ShieldCheck className="w-4 h-4" /> },
                  ].map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
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

        {/* Proficiency Map - optimized rendering */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">PROFICIENCY_MAP</h2>
          <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xl font-bold text-blue-400 mb-6 font-mono flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  DEVELOPMENT_DOMAINS
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Full-Stack Development", score: 95, color: "from-emerald-500 to-teal-400" },
                    { name: "Frontend Architecture", score: 92, color: "from-blue-500 to-indigo-400" },
                    { name: "Backend Systems", score: 90, color: "from-purple-500 to-pink-400" },
                    { name: "API Development", score: 94, color: "from-cyan-500 to-blue-400" },
                    { name: "Mobile Development", score: 85, color: "from-orange-500 to-red-400" },
                  ].map((domain, index) => (
                    <motion.div
                      key={domain.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300 font-mono">{domain.name}</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">{domain.score}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${domain.color} rounded-full will-change-transform`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${domain.score}%` }}
                          transition={{ duration: 0.8, delay: Math.min(index * 0.1, 0.3) }}
                          viewport={{ once: true, margin: "-50px" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-emerald-400 mb-6 font-mono flex items-center">
                  <BarChart className="w-5 h-5 mr-2" />
                  CORE_COMPETENCIES
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Clean Code", value: 95, icon: <Code className="w-4 h-4 text-emerald-400" /> },
                    { name: "Architecture", value: 92, icon: <Layers className="w-4 h-4 text-blue-400" /> },
                    { name: "Performance", value: 90, icon: <Zap className="w-4 h-4 text-yellow-400" /> },
                    { name: "Testing", value: 88, icon: <ShieldCheck className="w-4 h-4 text-green-400" /> },
                    { name: "CI/CD", value: 85, icon: <GitBranch className="w-4 h-4 text-purple-400" /> },
                    { name: "Optimization", value: 93, icon: <CpuIcon className="w-4 h-4 text-red-400" /> },
                  ].map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
                      viewport={{ once: true, margin: "-50px" }}
                      whileHover={{ scale: 1.02 }}
                      className="glass-dark-light p-4 rounded-lg border border-emerald-400/20 flex flex-col items-center text-center"
                    >
                      <div className="mb-2">{skill.icon}</div>
                      <span className="text-sm text-gray-300 mb-1 font-mono">{skill.name}</span>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 border-2 border-emerald-400/30">
                        <span className="text-xs font-bold text-emerald-400">{skill.value}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievements with optimized animations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">ACHIEVEMENTS</h2>
          <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Award className="w-10 h-10 text-yellow-400" />,
                  title: "Hackathon Winner",
                  subtitle: "React Innovation Challenge",
                  year: "2023",
                  description: "First place in AI-powered web application category",
                },
                {
                  icon: <Coffee className="w-10 h-10 text-orange-400" />,
                  title: "Open Source Contributor",
                  subtitle: "Top 100 React Contributors",
                  year: "2022-2023",
                  description: "Regular contributions to major web development libraries",
                },
                {
                  icon: <Globe className="w-10 h-10 text-blue-400" />,
                  title: "Conference Speaker",
                  subtitle: "WebDev Summit",
                  year: "2022",
                  description: "Presented on modern frontend architecture patterns",
                },
              ].map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="glass-dark-light p-6 rounded-lg border border-emerald-400/20 group"
                >
                  <div className="mb-4">{achievement.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-1 font-mono group-hover:text-emerald-400 transition-colors duration-200">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-emerald-400 mb-3">{achievement.subtitle}</p>
                  <p className="text-xs text-gray-400 mb-2 font-mono">{achievement.year}</p>
                  <p className="text-sm text-gray-300">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Optimized Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center py-10"
        >
          <p className="text-emerald-400 font-mono">
            <Terminal className="w-4 h-4 inline-block mr-2 mb-1" />
            SYSTEM_CAPABILITIES_SCAN_COMPLETE
          </p>
        </motion.div>
      </div>
    </div>
  )
}