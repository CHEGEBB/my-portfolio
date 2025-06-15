"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code2,
  Rocket,
  Star,
  Eye,
  Brain,
  Cpu,
  Zap,
  Terminal,
  Gamepad2,
  Globe,
  Smartphone,
  Server,
  Briefcase,
  Database,
  Layers,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { MatrixRain } from "@/components/matrix-rain"
import { ParallaxBackground } from "@/components/parallax-background"
import { ProfileShape } from "@/components/profile-shape"
import { useAudio } from "@/components/audio-provider"
import { useRef, useEffect, useState } from "react"

export default function HomePage() {
  const { playHover, playClick } = useAudio()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const y = useTransform(scrollYProgress, [0, 1], [0, -300])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9])

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

  const techStack = [
    { name: "React", icon: Code2, color: "text-blue-400" },
    { name: "Next.js", icon: Layers, color: "text-white" },
    { name: "TypeScript", icon: Code2, color: "text-blue-500" },
    { name: "Node.js", icon: Server, color: "text-green-500" },
    { name: "Python", icon: Brain, color: "text-yellow-400" },
    { name: "MongoDB", icon: Database, color: "text-green-400" },
    { name: "PostgreSQL", icon: Database, color: "text-blue-600" },
    { name: "Docker", icon: Layers, color: "text-blue-400" },
    { name: "AWS", icon: Globe, color: "text-orange-400" },
    { name: "GraphQL", icon: Zap, color: "text-pink-400" },
  ]

  const featuredProjects = [
    {
      title: "AI-Powered Code Assistant",
      description:
        "Revolutionary AI assistant that helps developers write better code with real-time suggestions and automated refactoring",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
      tech: ["OpenAI", "TypeScript", "React", "Node.js", "WebSockets"],
      github: "https://github.com",
      live: "https://example.com",
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Blockchain Voting System",
      description: "Secure, transparent voting platform built on blockchain technology with end-to-end encryption",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
      tech: ["Solidity", "Web3.js", "React", "IPFS", "MetaMask"],
      github: "https://github.com",
      live: "https://example.com",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Real-time Collaboration Platform",
      description: "Multi-user collaborative workspace with real-time editing, video calls, and project management",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      tech: ["Socket.io", "WebRTC", "React", "Express", "Redis"],
      github: "https://github.com",
      live: "https://example.com",
      color: "from-purple-500 to-pink-600",
    },
  ]

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-slate-900">
      <MatrixRain />

      {/* Hero Section with Parallax */}
      <ParallaxBackground imageUrl="/assets">
        <section className="relative min-h-screen flex items-center justify-center px-4 -z-10">
          <motion.div style={{ y, opacity, scale }} className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="space-y-8"
              >
                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight font-mono"
                  style={{
                    transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
                  }}
                >
                  <span className="text-gradient-emerald gentle-glow">DIGITAL</span>
                  <br />
                  <span className="text-gradient-emerald gentle-glow">ARCHITECT</span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-lg md:text-xl text-emerald-300 font-mono tracking-wider"
                >
                  <span className="inline-block">{">"}</span>
                  <motion.span
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="inline-block ml-2"
                  >
                    Crafting tomorrow's digital experiences
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    className="inline-block ml-1 text-emerald-400"
                  >
                    ▋
                  </motion.span>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/projects"
                      className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300"
                      onMouseEnter={playHover}
                      onClick={playClick}
                      data-cursor="pointer"
                    >
                      <span className="relative z-10 flex items-center space-x-2 text-white">
                        <Rocket className="w-5 h-5" />
                        <span>Explore Projects</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/contact"
                      className="group relative px-8 py-4 glass-emerald border-2 border-emerald-400/50 rounded-xl font-bold text-lg hover:border-emerald-400 transition-all duration-300"
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

              {/* Right Side - Profile Shape */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                className="flex justify-center lg:justify-end"
              >
                <ProfileShape
                  imageUrl="/assets/profile.jpg"
                  className="float-animation"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
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
      </ParallaxBackground>

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
              <h2 className="text-3xl md:text-5xl font-black mb-8 text-gradient-emerald gentle-glow font-mono">
                TECH ARSENAL
              </h2>
              <p className="text-lg text-emerald-300/80 font-mono max-w-3xl mx-auto">
                Cutting-edge technologies powering digital innovation
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
                  <div className="glass-dark p-6 rounded-xl border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500 text-center">
                    <tech.icon className={`w-12 h-12 mb-4 mx-auto ${tech.color} tech-float`} />
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                      {tech.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

    {/* Stats Section */}
<section className="relative py-32 px-4 z-10 overflow-hidden">
 {/* Background with gradient overlay */}
 <div 
   className="absolute inset-0 bg-cover bg-center bg-fixed"
   style={{
     backgroundImage: "url('/assets/code.jpg')"
   }}
 />
 <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/70 to-slate-900/90" />
 
 {/* Animated grid background */}
 <div className="absolute inset-0 opacity-10">
   <div className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          animation: 'pulse 4s ease-in-out infinite'
        }} />
 </div>

 {/* Floating data particles */}
 <div className="absolute inset-0 overflow-hidden">
   {[...Array(15)].map((_, i) => (
     <div
       key={i}
       className="absolute text-emerald-400/30 text-xs font-mono animate-bounce"
       style={{
         left: `${Math.random() * 100}%`,
         top: `${Math.random() * 100}%`,
         animationDelay: `${Math.random() * 3}s`,
         animationDuration: `${2 + Math.random() * 2}s`
       }}
     >
       {['1', '0', '>', '$', '#', '%', '&'][Math.floor(Math.random() * 7)]}
     </div>
   ))}
 </div>

 <div className="max-w-6xl mx-auto relative z-10">
   <motion.div
     initial={{ opacity: 0, y: 100 }}
     whileInView={{ opacity: 1, y: 0 }}
     transition={{ duration: 1 }}
     viewport={{ once: true }}
     className="text-center mb-20"
   >
     {/* Terminal-style header */}
     <div className="inline-block bg-slate-900/80 backdrop-blur border border-emerald-400/30 p-4 mb-8 font-mono"
          style={{clipPath: 'polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%)'}}>
       <div className="text-emerald-400 text-sm mb-2">$ system_metrics --status</div>
       <h2 className="text-3xl md:text-5xl font-black font-mono relative">
         <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-600 bg-clip-text text-transparent">
           SYSTEM_METRICS.LOG
         </span>
       </h2>
       <div className="text-emerald-400 text-sm mt-2">Loading performance data...</div>
     </div>
     
     <p className="text-lg text-emerald-300/80 font-mono max-w-3xl mx-auto">
       <span className="text-emerald-500">[INFO]</span> Real-time performance indicators from the digital realm
       <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse" />
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
         prefix: "PROJ_",
         suffix: ".exe"
       },
       {
         icon: Code2,
         label: "Lines of Code",
         value: "500K+",
         color: "text-teal-400",
         desc: "Written & Optimized",
         prefix: "LOC_",
         suffix: ".txt"
       },
       {
         icon: Cpu,
         label: "System Uptime",
         value: "99.9%",
         color: "text-green-400",
         desc: "Reliability Score",
         prefix: "SYS_",
         suffix: ".log"
       },
       {
         icon: Eye,
         label: "Coffee Consumed",
         value: "∞",
         color: "text-cyan-400",
         desc: "Fuel for Innovation",
         prefix: "FUEL_",
         suffix: ".json"
       },
     ].map((stat, index) => (
       <motion.div
         key={stat.label}
         initial={{ opacity: 0, y: 100, rotateX: -45, rotateY: -15 }}
         whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
         transition={{ duration: 1, delay: index * 0.15 }}
         viewport={{ once: true }}
         whileHover={{ 
           scale: 1.05, 
           y: -15,
           rotateX: -5,
           rotateY: 5
         }}
         className="relative group perspective-1000"
       >
         {/* Holographic glow effect */}
         <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/0 via-emerald-400/30 to-emerald-400/0 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
         
         {/* Main card with cyber styling */}
         <div className="relative bg-slate-900/90 backdrop-blur-md border border-emerald-400/20 group-hover:border-emerald-400/60 transition-all duration-500 overflow-hidden transform-gpu"
              style={{
                clipPath: 'polygon(0 15px, calc(100% - 15px) 0, 100% calc(100% - 15px), 15px 100%)'
              }}>
           
           {/* Scanning line effect */}
           <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
           
           {/* Corner accents */}
           <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400/40 group-hover:border-emerald-400 transition-colors" />
           <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400/40 group-hover:border-emerald-400 transition-colors" />
           
           <div className="p-8 text-center relative">
             {/* Terminal-style file header */}
             <div className="flex items-center justify-center space-x-2 mb-4 opacity-70">
               <div className="w-2 h-2 rounded-full bg-red-500"></div>
               <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <div className="text-xs text-slate-400 font-mono ml-2">
                 {stat.prefix}{index + 1}{stat.suffix}
               </div>
             </div>

             {/* Icon with glitch effect */}
             <div className="relative mb-6">
               <stat.icon className={`w-16 h-16 ${stat.color} mx-auto transition-all duration-300 group-hover:scale-110`} />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className={`w-16 h-16 ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                      style={{
                        filter: 'blur(8px)',
                        animation: 'pulse 2s ease-in-out infinite'
                      }} />
               </div>
             </div>

             {/* Value with terminal styling */}
             <div className="font-mono mb-4">
               <div className="text-xs text-emerald-400 mb-1">$ cat metric_value</div>
               <div className={`text-4xl font-black ${stat.color} mb-2 transition-all duration-300 group-hover:scale-110`}
                    style={{
                      textShadow: '0 0 20px currentColor',
                      filter: 'drop-shadow(0 0 10px currentColor)'
                    }}>
                 {stat.value}
               </div>
             </div>

             {/* Label and description */}
             <div className="space-y-2">
               <div className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                 {stat.label}
               </div>
               <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                 <span className="text-cyan-400">//</span> {stat.desc}
               </div>
             </div>

             {/* Progress bar effect */}
             <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
               <motion.div
                 className={`h-full bg-gradient-to-r from-${stat.color.split('-')[1]}-400 to-${stat.color.split('-')[1]}-600`}
                 initial={{ width: 0 }}
                 whileInView={{ width: '85%' }}
                 transition={{ duration: 1.5, delay: index * 0.2 }}
                 viewport={{ once: true }}
               />
             </div>

             {/* Status indicator */}
             <div className="flex items-center justify-center space-x-2 mt-4 pt-3 border-t border-emerald-400/20">
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
               <span className="text-xs text-emerald-300 font-mono">ONLINE</span>
             </div>
           </div>

           {/* Data stream effect */}
           <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
             <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-cyan-400 animate-pulse" />
           </div>
         </div>
       </motion.div>
     ))}
   </div>

   {/* System status footer */}
   <motion.div
     initial={{ opacity: 0, y: 50 }}
     whileInView={{ opacity: 1, y: 0 }}
     transition={{ duration: 1, delay: 0.8 }}
     viewport={{ once: true }}
     className="text-center mt-16"
   >
     <div className="inline-block bg-slate-900/80 backdrop-blur border border-emerald-400/30 px-6 py-3 font-mono text-sm"
          style={{clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)'}}>
       <span className="text-emerald-400">STATUS:</span>
       <span className="text-white ml-2">All systems operational</span>
       <span className="text-emerald-400 ml-4">|</span>
       <span className="text-cyan-400 ml-2">Last updated: {new Date().toLocaleTimeString()}</span>
       <div className="inline-block w-2 h-2 bg-emerald-400 rounded-full ml-2 animate-pulse"></div>
     </div>
   </motion.div>
 </div>
</section>

     {/* Featured Projects */}
<section className="relative py-32 px-4 z-10 overflow-hidden">
 {/* Background with gradient overlay */}
 <div 
   className="absolute inset-0 bg-cover bg-center bg-fixed"
   style={{
     backgroundImage: "url('/assets/code.jpg')"
   }}
 />
 <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/60 to-slate-900/95" />
 
 {/* Matrix rain effect */}
 <div className="absolute inset-0 overflow-hidden opacity-20">
   {[...Array(20)].map((_, i) => (
     <div
       key={i}
       className="absolute text-emerald-400 text-xs font-mono animate-pulse"
       style={{
         left: `${Math.random() * 100}%`,
         animationDelay: `${Math.random() * 5}s`,
         animationDuration: `${3 + Math.random() * 2}s`
       }}
     >
       {Math.random().toString(36).substring(7)}
     </div>
   ))}
 </div>

 <div className="max-w-7xl mx-auto relative z-10">
   <motion.div
     initial={{ opacity: 0, y: 100 }}
     whileInView={{ opacity: 1, y: 0 }}
     transition={{ duration: 1 }}
     viewport={{ once: true }}
     className="text-center mb-20"
   >
     <h2 className="text-3xl md:text-5xl font-black mb-8 font-mono relative">
       <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-600 bg-clip-text text-transparent filter drop-shadow-lg">
         FEATURED_PROJECTS.EXE
       </span>
       <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 animate-ping opacity-75" />
     </h2>
     <p className="text-lg text-emerald-300/80 font-mono max-w-3xl mx-auto relative">
       <span className="text-emerald-500">&gt;</span> Executing advanced digital solutions...
       <span className="inline-block w-2 h-5 bg-emerald-400 ml-1 animate-pulse" />
     </p>
   </motion.div>

   <div className="grid lg:grid-cols-3 gap-8">
     {featuredProjects.map((project, index) => (
       <motion.div
         key={project.title}
         initial={{ opacity: 0, y: 100, rotateX: -45 }}
         whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
         transition={{ duration: 1, delay: index * 0.2 }}
         viewport={{ once: true }}
         whileHover={{ 
           y: -20, 
           scale: 1.02,
           rotateY: 5,
           rotateX: -5
         }}
         className="group relative perspective-1000"
       >
         {/* Card container with parallelogram shape */}
         <div className="relative transform-gpu">
           {/* Glowing border effect */}
           <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/50 via-cyan-400/50 to-emerald-600/50 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
           
           {/* Main card with angled corners */}
           <div className="relative bg-slate-900/90 backdrop-blur-sm border border-emerald-400/30 group-hover:border-emerald-400/70 transition-all duration-500 overflow-hidden"
                style={{
                  clipPath: 'polygon(0 10px, calc(100% - 10px) 0, 100% calc(100% - 10px), 10px 100%)'
                }}>
             
             {/* Scan line effect */}
             <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
             
             {/* Project Image with hexagonal mask */}
             <div className="relative overflow-hidden h-64 bg-slate-800">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20" />
               <img
                 src={project.image || "/placeholder.svg"}
                 alt={project.title}
                 className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-125 filter saturate-150"
               />
               
               {/* Digital grid overlay */}
               <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                    style={{
                      backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }} />

               {/* Action buttons overlay */}
               <div className="absolute inset-0 bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-6">
                 <motion.a
                   href={project.github}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="relative p-4 bg-slate-800/80 backdrop-blur border border-emerald-400/50 hover:border-emerald-400 transition-all duration-300 group/btn"
                   style={{clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)'}}
                   whileHover={{ scale: 1.1, rotate: 2 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <Github className="w-6 h-6 text-emerald-400 group-hover/btn:text-white transition-colors" />
                   <div className="absolute inset-0 bg-emerald-400/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                 </motion.a>
                 
                 <motion.a
                   href={project.live}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="relative p-4 bg-slate-800/80 backdrop-blur border border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 group/btn"
                   style={{clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)'}}
                   whileHover={{ scale: 1.1, rotate: -2 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   <ExternalLink className="w-6 h-6 text-cyan-400 group-hover/btn:text-white transition-colors" />
                   <div className="absolute inset-0 bg-cyan-400/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                 </motion.a>
               </div>
             </div>

             {/* Project Info with terminal styling */}
             <div className="p-6 bg-slate-900/95 backdrop-blur-sm">
               {/* Terminal header */}
               <div className="flex items-center space-x-2 mb-4 opacity-60">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 <div className="text-xs text-slate-400 font-mono ml-2">project.exe</div>
               </div>
               
               <div className="font-mono">
                 <div className="text-emerald-400 text-xs mb-2">$ cat project_info.txt</div>
                 <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors duration-300">
                   {project.title}
                 </h3>
                 <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                   <span className="text-cyan-400">//</span> {project.description}
                 </p>
               </div>

               {/* Tech Stack as terminal output */}
               <div className="font-mono text-xs">
                 <div className="text-emerald-400 mb-2">$ ls technologies/</div>
                 <div className="flex flex-wrap gap-2">
                   {project.tech.map((tech, techIndex) => (
                     <motion.span
                       key={tech}
                       initial={{ opacity: 0, scale: 0 }}
                       whileInView={{ opacity: 1, scale: 1 }}
                       transition={{ duration: 0.3, delay: techIndex * 0.1 }}
                       className="px-3 py-1 bg-slate-800/80 text-emerald-300 border border-emerald-400/30 hover:border-emerald-400/70 transition-colors cursor-default"
                       style={{clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)'}}
                     >
                       {tech}
                     </motion.span>
                   ))}
                 </div>
               </div>

               {/* Status indicator */}
               <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-emerald-400/20">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                 <span className="text-xs text-emerald-300 font-mono">STATUS: ACTIVE</span>
               </div>
             </div>
           </div>
         </div>
       </motion.div>
     ))}
   </div>

   {/* Terminal-style CTA */}
   <motion.div
     initial={{ opacity: 0, y: 50 }}
     whileInView={{ opacity: 1, y: 0 }}
     transition={{ duration: 1, delay: 0.5 }}
     viewport={{ once: true }}
     className="text-center mt-16"
   >
     <div className="inline-block bg-slate-900/90 backdrop-blur border border-emerald-400/30 p-6 font-mono"
          style={{clipPath: 'polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)'}}>
       <div className="text-emerald-400 text-sm mb-2">$ ./view_all_projects.sh</div>
       <Link
         href="/projects"
         className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-400/50 hover:border-emerald-400 transition-all duration-300 group font-bold text-lg"
         style={{clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)'}}
       >
         <span className="text-emerald-300 group-hover:text-white transition-colors duration-300">
           EXECUTE_ALL_PROJECTS
         </span>
         <Star className="w-5 h-5 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
       </Link>
       <div className="text-emerald-400/60 text-xs mt-2">Press ENTER to continue...</div>
     </div>
   </motion.div>
 </div>
</section>

   {/* Quick Access Section */}
<section className="relative py-32 px-4 z-10 overflow-hidden">
  {/* Linear gradient background with matrix overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-800" />
  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
  
  {/* Animated matrix grid background */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute inset-0"
         style={{
           backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`,
           backgroundSize: '50px 50px',
           animation: 'pulse 3s ease-in-out infinite'
         }} />
  </div>

  {/* Floating code particles */}
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute text-emerald-400/20 text-xs font-mono animate-bounce"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      >
        {['</>','{}','[]','()','&&','||','!=','=='][Math.floor(Math.random() * 8)]}
      </div>
    ))}
  </div>

  <div className="max-w-6xl mx-auto relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      {/* Terminal-style header */}
      <div className="inline-block bg-slate-900/80 backdrop-blur border border-emerald-400/40 p-6 mb-8 font-mono relative"
           style={{clipPath: 'polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)'}}>
        {/* Terminal controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse delay-75"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse delay-150"></div>
          </div>
          <div className="text-xs text-emerald-400">quick_access.exe</div>
        </div>
        
        <div className="text-emerald-400 text-sm mb-2">$ ./initialize_quick_access --mode=hacker</div>
        <h2 className="text-3xl md:text-5xl font-black font-mono bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-600 bg-clip-text text-transparent filter drop-shadow-lg">
          QUICK_ACCESS.SYS
        </h2>
        <div className="text-emerald-400 text-sm mt-2">Loading access portals...</div>
        
        {/* Progress bar */}
        <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            transition={{ duration: 2, delay: 0.5 }}
          />
        </div>
      </div>
      
      <p className="text-lg text-emerald-300/80 font-mono max-w-3xl mx-auto">
        <span className="text-emerald-500">[SYSTEM]</span> Direct pathways to different dimensions of my digital universe
        <span className="inline-block w-2 h-5 bg-emerald-400 ml-1 animate-pulse" />
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
          code: "TERM_001"
        },
        {
          title: "Gaming Zone",
          description: "Interactive games and entertainment experiences",
          icon: Gamepad2,
          href: "/playground", 
          color: "from-blue-500 to-indigo-600",
          code: "GAME_002"
        },
        {
          title: "Neural Network",
          description: "Explore my thought processes and development journey",
          icon: Brain,
          href: "/about",
          color: "from-purple-500 to-pink-600",
          code: "MIND_003"
        },
        {
          title: "Portal Gateway",
          description: "Enter the immersive portal experience",
          icon: Zap,
          href: "/portal",
          color: "from-cyan-500 to-blue-600",
          code: "PORT_004"
        },
      ].map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 100, rotateX: -45, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: index * 0.15 }}
          viewport={{ once: true }}
          whileHover={{ 
            y: -15, 
            rotateY: 8,
            rotateX: -5,
            scale: 1.05
          }}
          className="group relative perspective-1000"
        >
          {/* Holographic glow effect */}
          <div className="absolute -inset-3 bg-gradient-to-r from-emerald-400/0 via-emerald-400/30 to-emerald-400/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          {/* Main card with hexagonal slant */}
          <div className="relative bg-slate-900/90 backdrop-blur-sm border border-emerald-400/30 group-hover:border-emerald-400/80 transition-all duration-500 overflow-hidden transform-gpu h-full"
               style={{
                 clipPath: 'polygon(0 20px, calc(100% - 20px) 0, 100% calc(100% - 20px), 20px 100%)'
               }}>
            
            {/* Scanning line effects */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100" />
            
            {/* Corner accent lines */}
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400/50 group-hover:border-emerald-400 transition-colors opacity-60" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400/50 group-hover:border-emerald-400 transition-colors opacity-60" />
            
            <Link
              href={item.href}
              className="block p-8 text-center h-full flex flex-col justify-between group/link"
            >
              {/* Terminal-style header */}
              <div className="flex items-center justify-between mb-6 opacity-70">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-emerald-400 font-mono">{item.code}.exe</div>
              </div>

              {/* Icon with gradient background */}
              <div className="relative mb-6 flex-shrink-0">
                <div
                  className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${item.color} p-5 group-hover/link:scale-110 group-hover/link:rotate-6 transition-all duration-500 relative overflow-hidden`}
                  style={{
                    clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)'
                  }}
                >
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  
                  <item.icon className="w-full h-full text-white relative z-10" />
                  
                  {/* Rotating border */}
                  <div className="absolute inset-0 border-2 border-white/30 rounded-2xl opacity-0 group-hover/link:opacity-100 group-hover/link:rotate-180 transition-all duration-700"
                       style={{
                         clipPath: 'polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)'
                       }} />
                </div>
                
                {/* Status indicator */}
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full animate-pulse border-2 border-slate-900" />
              </div>

              {/* Content */}
              <div className="flex-grow">
                {/* Terminal command simulation */}
                <div className="font-mono text-xs text-emerald-400 mb-3 opacity-70">
                  $ execute {item.code.toLowerCase()}
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-white group-hover/link:text-emerald-400 transition-colors duration-300 font-mono">
                  {item.title}
                </h3>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  <span className="text-cyan-400">//</span> {item.description}
                </p>
              </div>

              {/* Footer with system info */}
              <div className="mt-auto pt-4 border-t border-emerald-400/20 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-emerald-300">ONLINE</span>
                  </div>
                  <div className="text-slate-400">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
                
                {/* Access indicator */}
                <div className="mt-2 text-xs text-cyan-400 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">
                  → Press ENTER to access
                </div>
              </div>
            </Link>

            {/* Data stream effect */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 via-transparent to-cyan-400 opacity-0 group-hover:opacity-60 transition-opacity duration-500">
              <div className="w-full h-full bg-gradient-to-b from-emerald-400 to-cyan-400 animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* System status footer */}
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.8 }}
      viewport={{ once: true }}
      className="text-center mt-16"
    >
      <div className="inline-block bg-slate-900/90 backdrop-blur border border-emerald-400/40 px-8 py-4 font-mono"
           style={{clipPath: 'polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%)'}}>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400">ACCESS_GRANTED:</span>
          </div>
          <span className="text-white">All portals operational</span>
          <span className="text-emerald-400/60">|</span>
          <span className="text-cyan-400">Latency: 0.01ms</span>
        </div>
      </div>
    </motion.div>
  </div>
</section>

      {/* Services Section */}
      <ParallaxBackground imageUrl="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&h=1080&fit=crop">
        <section className="relative py-32 px-4 z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-black mb-8 text-gradient-emerald gentle-glow font-mono">
                SERVICES
              </h2>
              <p className="text-lg text-emerald-300/80 font-mono max-w-3xl mx-auto">
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
                  <div className="glass-dark p-8 rounded-xl border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500 h-full">
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
      </ParallaxBackground>

      {/* Footer */}
      <footer className="relative py-20 px-4 z-10 border-t border-emerald-400/20 bg-slate-900/90">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 glass-emerald rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gradient-emerald font-mono">CHEGEBB</div>
                  <div className="text-sm text-emerald-300/80 font-mono">Digital Architect</div>
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
                  { href: "/skills", label: "Skills", icon: Code2 },
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
                    className="w-10 h-10 glass-emerald rounded-xl flex items-center justify-center text-emerald-400 hover:text-white transition-all duration-300"
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
