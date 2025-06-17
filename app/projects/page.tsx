"use client" 
 
import type React from "react" 
 
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion" 
import { useState, useEffect, useRef, useMemo, useCallback } from "react" 
import { Github, ExternalLink, Star, GitFork, Zap, Brain, Shield, Globe, Smartphone, Search, TrendingUp, Award, Users, Code, Trophy } from 'lucide-react' 
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
            repeat: Infinity, 
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
            repeat: Infinity, 
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
  const [repos, setRepos] = useState<any[]>([]) 
  const [loading, setLoading] = useState(true) 
  const [error, setError] = useState<string | null>(null) 
 
  useEffect(() => { 
    const fetchRepos = async () => { 
      try { 
        const response = await fetch(`https://api.github.com/users/CHEGEBB/repos?sort=updated&per_page=100`) 
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
        title: "Healthmaster mobile app",
        description:
          "A medication adherence, drugs interaction checker, and health tracker app that helps users manage their medications, check for drug interactions, and track their health metrics. Powered by AI allows users to know their medications , track their health metrics, and check for drug interactions.",
        image: "/assets/graphic.png",
        category: "Mobile app",
        tech: ["React Native", "Expo", "Appwrite", "Typescript", "Kotlin"],
        github: "https://github.com/CHEGEBB/health-master-mobile-app",
        live: "https://apkpure.com/p/com.health_master.healthmaster",
        stats: { users: "100+", stars: 2, forks: 2 },
        year: 2024,
        status: "Production",
      },
      {
        id: 2,
        title: "Health master",
        description: "Oficial website for Healthmaster mobile app, a medication adherence, drugs interaction checker, and health tracker app that helps users manage their medications, check for drug interactions, and track their health metrics.",
        image: "/assets/hm.png",
        category: "web app",
        tech: ["Next js", "Tailwind css", "Framer motion", "Typescript", "Node.js"],
        github: "https://github.com/CHEGEBB/hm-official",
        live: "https://www.healthmasterco.com",
        stats: { users: "5K+", stars: 3, forks: 2 },
        year: 2024,
        status: "Production",
      },
      {
        id: 3,
        title: "Werentonline real-estate",
        description: "A real estate web app that allows users to search for properties, view listings, and connect with agents. Features include property search, listing management, and user profiles.",
        image: "/assets/wrent.png",
        category: "AI/ML",
        tech: ["Html", "Javascript", "Node.js", "css", "Sendgrid"],
        github: "https://github.com/CHEGEBB/wrent",
        live: "https://www.werentonline.com",
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
        title: "FarmSense",
        description:
          "FarmSense helps you maximize yields, optimize irrigation, and monitor crop health without investing in expensive IoT devices.",
        image: "/assets/farm.png",
        category: "Fullstack web app",
        tech: ["Next js", "TypeScript", "Node.js", "Tailwind css", "Framer-motion"],
        github: "https://github.com/CHEGEBB/FarmSense",
        live: "https://farm-sense-mu.vercel.app/",
        featured: true,
        stats: { users: "10K+", stars: 2, forks: 1 },
        year: 2025,
        status: "Production",
      },
      {
        id: 2,
        title: "Jobplex",
        description: "JobPlex matches candidates with opportunities that are based on real skills and potential.. Our AI-powered platform revolutionizes how talent connects with employers.",
        image: "/assets/job.png",
        category: "Fullstack web app",
        tech: ["Angular", "Node.js", "AWS","Tailwind css", "Sass","Docker"],
        github: "https://github.com/CHEGEBB/jobplex",
        live: "http://jobplex-frontend.s3-website-us-east-1.amazonaws.com/",
        featured: true,
        stats: { users: "5K+", stars: 3, forks: 0},
        year: 2025,
        status: "Production",
      },
      {
        id: 3,
        title: "Mental health web app",
        description: "A mental health web app that provides resources, support, and community for mental wellness. Features include guided meditations, mood tracking, and professional counseling connections.",
        image: "/assets/mental.png",
        category: "Web Apps",
        tech: ["Next js", "Tailwind css","Mongodb", "Sass", "Express", "Node.js"],
        github: "https://github.com/CHEGEBB/mental-health-web-app",
        live: "https://mindharmony.vercel.app/",
        featured: false,
        stats: { users: "100+", stars: 2, forks: 1 },
        year: 2023,
        status: "Production",
      },
      {
        id: 4,
        title: "rehab-outcome-therapies",
        description: "An occupational therapy web app that showcases all services offered by the clinic, including patient management, therapy tracking, and progress visualization.OCD , ADHD ,PTSD, Gross motor skills, Fine motor skills, Sensory processing, Social skills, Cognitive skills, Visual perception.",
        image: "/assets/therapies.png",
        category: "Fullstack web app",
        tech: ["Next js", "Framer motion", "Tailwind css", "Sass", "Typescript"],
        github: "https://github.com/CHEGEBB/rehab-outcome-therapies",
        live: "https://rehab-outcome-therapies.vercel.app/",
        featured: false,
        stats: { users: "150+", stars: 2, forks: 0 },
        year: 2024,
        status: "Production",
      },
      {
        id: 5,
        title: "Smart-timetable-generator",
        description: "AI-powered timetable generator that optimizes schedules based on user preferences and constraints",
        image: "/assets/time.png",
        category: "web app",
        tech: ["Typescript", "Mongodb", "Node.js", "Sass", "Python"],
        github: "https://github.com/CHEGEBB/smart-timetable-generator",
        live: "https://smart-timetable-generator-chegebbs-projects.vercel.app/",
        featured: false,
        stats: { users: "10+", stars: 156, forks: 43 },
        year: 2023,
        status: "Production",
      },
      {
        id: 6,
        title: "Gamezone",
        description: "A gaming website that provides a platform for users to discover, review, and discuss their favorite games. Features include game reviews, user ratings, and community discussions.",
        image: "/assets/game.png",
        category: "Web app",
        tech: ["Html", "Javascript", "Node js", "Mongodb"],
        github: "https://github.com/CHEGEBB/game-zone",
        live: "https://game-glitz.vercel.app/Home.html",
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
        title: "conference-ticket-generator-main",
        difficulty: "Junior",
        image: "/assets/conference.jpg",
        tech: ["Vue", "Tailwind css", "JavaScript"],
        github: "https://github.com/CHEGEBB/Mastering-Vue-Journey/tree/main/conference-ticket-generator-main",
        live: "https://conference-ticket-generator-zeta.vercel.app/",
        completed: true,
      },
      {
        id: 2,
        title: "coding-bootcamp-testimonials-master",
        difficulty: "Junior",
        image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/sb339yhgjcsxz3ntn5qe.jpg",
        tech: ["Vue", "Tailwind css", "JavaScript"],
        github: "https://github.com/CHEGEBB/Mastering-Vue-Journey/tree/main/coding-bootcamp-testimonials-slider-master",
        live: "https://coding-bootcamp-testimonials-ten-pied.vercel.app/",
        completed: true,
      },
      {
        id: 3,
        title: "room-homepage-master",
        difficulty: "Intermediate",
        image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/lr61m6itzhfgl8vigahy.jpg",
        tech: ["Tailwind css", "Vue", "Flexbox"],
        github: "https://github.com/CHEGEBB/Mastering-Vue-Journey/tree/main/room-homepage-master",
        live: "https://room-homepage-master-iota.vercel.app/",
        completed: true,
      },
      {
        id: 4,
        title: "Intro section with dropdown navigation",
        difficulty: "Junior",
        image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/k7jxiqomeuyasctla7om.jpg",
        tech: ["Svelte", "Typescript", "CSS"],
        github: "https://github.com/CHEGEBB/Svelte-Frontend-Challenges",
        live: "https://chegebb.github.io/Svelte-Frontend-Challenges/",
        completed: true,
      },
      {
        id: 5,
        title: "Todo App",
        difficulty: "Intermediate",
        image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/zp9amjzjqzwglcknzgd8.jpg",
        tech: ["Vue", "Tailwind css","Local storage"],
        github: "https://github.com/CHEGEBB/Mastering-Vue-Journey/tree/main/todo-app",
        live: "https://todo-app-olive-theta.vercel.app/",
        completed: true,
      },
      {
        id: 6,
        title: "launch-countdown-timer",
        difficulty: "Intermediate",
        image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/xjnrm0y8a3kvlaiut7cn.jpg",
        tech: ["React", "Sass", "Vite", "Tailwind css"],
        github: "https://github.com/CHEGEBB/launch-countdown-timer",
        live: "https://chegebb.github.io/launch-countdown-timer/",
        completed: true,
      },
      {
        id: 7,
        title: "job-listings-page",
        difficulty: "Intermediate",
        image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/grmw9eaehnotl7xpecnp.jpg",
        tech: ["Vue", "Sass", "Fetch", "Tailwind css"],
        github: "https://github.com/CHEGEBB/launch-countdown-timer",
        live: "https://job-listings-olive.vercel.app/",
        completed: true,
      },
      {
        id: 8,
        title: "crowdfunding-product-page-main",
        difficulty: "Junior",
        image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/sewtogrjlkhtr7r3rpsq.jpg",
        tech: ["Vue", "Vuex", "Tailwind css"],
        github: "https://github.com/CHEGEBB/Mastering-Vue-Journey/tree/main/crowdfunding-product-page-main",
        live: "https://crowdfunding-page-rust.vercel.app/",
        completed: true,
      },
      {
        id: 9,
        title: "rock-paper-scissors-game",
        difficulty: "Advanced",
        image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/ck9dtmelgtbjtxw8xivj.jpg",
        tech: ["React", "Sass", "Html"],
        github: "https://github.com/CHEGEBB/rock-paper-scissors-game",
        live: "https://chegebb.github.io/rock-paper-scissors-game/",
        completed: true,
      },
      {
        id: 10,
        title: "time-tracking-dashboard-main",
        difficulty: "Intermediate",
        image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/aywzf0npobqzms0axfu6.jpg",
        tech: ["React", "Sass", "Fetch", "Webpack"],
        github: "https://github.com/CHEGEBB/time-tracking-dashboard-main",
        live: "https://chegebb.github.io/time-tracking-dashboard-main/",
        completed: true,
      },
      {
        id: 11,
        title: "interactive-card-details-form-main",
        difficulty: "Intermediate",
        image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/lt4gtoe6oew5rxeylimm.jpg",
        tech: ["React", "Sass", "Vite", "Tailwind css"],
        github: "https://github.com/CHEGEBB/interactive-card-details-form-main",
        live: "https://chegebb.github.io/interactive-card-details-form-main/",
        completed: true,
      },
      {
        id: 12,
        title: "fylo-dark-theme-landing-page",
        difficulty: "Newbie",
        image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/ngaklc62gbx4unoiyutu.jpg",
        tech: ["HTML", "CSS", "Github pages","Javascript"],
        github: "https://github.com/CHEGEBB/fylo-dark-theme-landing-page-master",
        live: "https://chegebb.github.io/fylo-dark-theme-landing-page-master/",
        completed: true,
      },
      {
        id: 13,
        title: "chat-app-css-illustration",
        difficulty: "Newbie",
        image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/ugj77s3zdv6rflgm231p.jpg",
        tech: ["Html", "Css"],
        github: "https://github.com/CHEGEBB/chat-app-css-illustration-master",
        live: "https://chegebb.github.io/chat-app-css-illustration-master/",
        completed: true,
      },
      {
        id: 14,
        title: "tip-calculator-app-main",
        difficulty: "Junior",
        image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/ivwtat0pwo4hq7rmvamx.jpg",
        tech: ["Html", "Sass", "Css"],
        github: "https://github.com/CHEGEBB/tip-calculator-app-main",
        live: "https://chegebb.github.io/tip-calculator-app-main/",
        completed: true,
      },
      {
        id: 15,
        title: "multi-step-form-main",
        difficulty: "Junior",
        image: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_500/Screenshots/uugvybc3rvzwrfzkmaym.jpg",
        tech: ["Less", "Javascript", "Html", "Css"],
        github: "https://github.com/CHEGEBB/multi-step-form-main",
        live: "https://chegebb.github.io/multi-step-form-main/",
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

      {/* Hero Parallax Background - Updated with object-contain */}
      <motion.div
        style={{ y: heroParallaxY }}
        className="fixed top-0 left-0 right-0 h-[100vh] z-0 opacity-30"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20, ease: "linear" }}
      >
        <Image
          src="/assets/code2.jpg"
          alt="Tech Background"
          fill
          className="object-cover"
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
                <motion.div 
                  className="glass-dark border-2 border-emerald-400/30 group-hover:border-emerald-400/70 transition-all duration-500 rounded-2xl overflow-hidden"
                  animate={{
                    height: hoveredFeaturedProject === project.id ? "auto" : "auto"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-[4/3]">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  </div>

                  {/* Project Info - Always Visible */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 font-mono group-hover:text-emerald-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">{project.description}</p>

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
                    <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-4">
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

                    {/* Action Buttons - Always Visible on Hover */}
                    <AnimatePresence>
                      {hoveredFeaturedProject === project.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3 }}
                          className="flex space-x-4"
                        >
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center space-x-2 p-3 glass-dark rounded-lg border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-200 text-emerald-400 font-mono text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Github className="w-4 h-4" />
                            <span>Code</span>
                          </motion.a>
                          <motion.a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center space-x-2 p-3 glass-emerald rounded-lg border border-emerald-400/50 hover:border-emerald-400/80 transition-all duration-200 text-emerald-400 font-mono text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Live</span>
                          </motion.a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
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
              className="grid md:grid-cols-2 lg:grid-cols-2 gap-8"
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
                  <motion.div 
                    className="glass-dark border border-emerald-400/20 group-hover:border-emerald-400/60 transition-all duration-500 rounded-2xl overflow-hidden"
                    animate={{
                      height: hoveredProject === project.id ? "auto" : "auto"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Project Image Container */}
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />

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

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                    </div>

                    {/* Project Info - Always Visible */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 font-mono group-hover:text-emerald-400 transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">{project.description}</p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-xs font-mono glass-emerald text-emerald-300 rounded-full border border-emerald-400/30"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 4 && (
                          <span className="px-2 py-1 text-xs font-mono bg-gray-500/20 text-gray-400 rounded-full">
                            +{project.tech.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Project Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-4">
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

                      {/* Action Buttons - Show on Hover */}
                      <AnimatePresence>
                        {hoveredProject === project.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className="flex space-x-4"
                          >
                            <motion.a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center space-x-2 p-3 glass-dark rounded-lg border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-200 text-emerald-400 font-mono text-sm"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Github className="w-4 h-4" />
                              <span>Code</span>
                            </motion.a>
                            <motion.a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center space-x-2 p-3 glass-emerald rounded-lg border border-emerald-400/50 hover:border-emerald-400/80 transition-all duration-200 text-emerald-400 font-mono text-sm"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Live</span>
                            </motion.a>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
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

        {/* Frontend Mentor Projects Section */}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frontendMentorProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredFrontendProject(project.id)}
                onMouseLeave={() => setHoveredFrontendProject(null)}
              >
                <motion.div 
                  className="glass-dark border border-emerald-400/20 group-hover:border-emerald-400/50 transition-all duration-300 rounded-xl overflow-hidden"
                  animate={{
                    height: hoveredFrontendProject === project.id ? "auto" : "auto"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-[3/2]">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

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

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  </div>

                  {/* Project Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-white mb-2 font-mono group-hover:text-emerald-400 transition-colors duration-300">
                      {project.title}
                    </h3>

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

                    {/* Action Buttons - Show on Hover */}
                    <AnimatePresence>
                      {hoveredFrontendProject === project.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3 }}
                          className="flex space-x-3"
                        >
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center space-x-2 p-2 glass-dark rounded-lg border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-200 text-emerald-400 font-mono text-xs"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Github className="w-3 h-3" />
                            <span>Code</span>
                          </motion.a>
                          <motion.a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center space-x-2 p-2 glass-emerald rounded-lg border border-emerald-400/50 hover:border-emerald-400/80 transition-all duration-200 text-emerald-400 font-mono text-xs"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Live</span>
                          </motion.a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}