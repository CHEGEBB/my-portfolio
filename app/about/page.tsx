"use client"

import { motion } from "framer-motion"
import { Code, Coffee, Gamepad2, Music, Brain, Zap, User, Calendar, MapPin, Award, Terminal, GitBranch, Database, Smartphone, Shield, Monitor, Globe, Server, BookOpen, Target, Cpu, Network, Lock, Layers, Eye, Settings } from "lucide-react"
import { useState, useEffect } from "react"

// Your Original Matrix Rain Component (keeping it exactly as you had it)
const MatrixRain = () => {
  const [drops, setDrops] = useState<{ id: number; x: number; y: number; char: string; speed: number; opacity: number; }[]>([])

  useEffect(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>?/.,;:!+-=_"
    const newDrops = []
    
    for (let i = 0; i < 100; i++) {
      newDrops.push({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
        char: characters[Math.floor(Math.random() * characters.length)],
        speed: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1
      })
    }
    setDrops(newDrops)

    const interval = setInterval(() => {
      setDrops(prev => prev.map(drop => ({
        ...drop,
        y: drop.y > (typeof window !== 'undefined' ? window.innerHeight : 800) ? -20 : drop.y + drop.speed,
        char: Math.random() > 0.95 ? characters[Math.floor(Math.random() * characters.length)] : drop.char
      })))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {drops.map(drop => (
        <div
          key={drop.id}
          className="absolute text-emerald-400 font-mono text-sm"
          style={{
            left: drop.x,
            top: drop.y,
            opacity: drop.opacity
          }}
        >
          {drop.char}
        </div>
      ))}
    </div>
  )
}

// Infinite Sliding Platforms
const InfinitePlatformSlider = () => {
  const platforms = [
    { name: "Frontend Mentor", icon: Monitor, path: "/assets/frontend-mentor-icon.png" },
    { name: "Dev Challenges", icon: Code, path: "/assets/dev-challenges-icon.png" },
    { name: "Frontend Pro", icon: Globe, path: "/assets/frontend-pro-icon.png" },
    { name: "W3Schools", icon: BookOpen, path: "/assets/w3schools-icon.png" },
    { name: "Codewars", icon: Target, path: "/assets/codewars-icon.png" },
    { name: "HackerRank", icon: Cpu, path: "/assets/hackerrank-icon.png" },
    { name: "LeetCode", icon: Network, path: "/assets/leetcode-icon.png" },
    { name: "CodePen", icon: Settings, path: "/assets/codepen-icon.png" },
  ]

  const duplicatedPlatforms = [...platforms, ...platforms]

  return (
    <div className="overflow-hidden py-8">
      <motion.div
        className="flex space-x-8"
        animate={{
          x: [0, -1920]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear"
          }
        }}
      >
        {duplicatedPlatforms.map((platform, index) => (
          <div
            key={index}
            className="flex-shrink-0 glass-dark p-6 rounded-lg border border-emerald-400/20 min-w-[200px] hacker-shape"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg p-2">
                <platform.icon className="w-full h-full text-black" />
              </div>
              <span className="text-emerald-400 font-mono text-sm font-bold">{platform.name}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// Enhanced Realistic Terminal Component (made smaller)
const TerminalComponent = () => {
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const commands = [
    { 
      cmd: "whoami", 
      output: "brian_chege\nUID: 1001 GID: 1001\nGroups: developers,hackers,creators\nShell: /bin/zsh" 
    },
    { 
      cmd: "cat /etc/bio.txt", 
      output: `Full Stack Developer & CS Student
Location: Nairobi, Kenya
University: Dedan Kimathi University
Specialization: Web & Mobile Development
Focus: React, Vue.js, React Native, TypeScript
Status: Building the future, one app at a time` 
    },
    { 
      cmd: "ls -la ~/skills/", 
      output: `drwxr-xr-x frontend/     [React, Vue, Angular, TypeScript]
drwxr-xr-x backend/      [Node.js, Express, Python]
drwxr-xr-x mobile/       [React Native, Flutter]
drwxr-xr-x databases/    [PostgreSQL, MongoDB]
drwxr-xr-x tools/        [Git, Docker, AWS]` 
    },
    { 
      cmd: "ps aux | grep passion", 
      output: `brian     1337  95.0  80.0 ∞ coding
brian     1338  90.0  75.0 ∞ learning
brian     1339  85.0  70.0 ∞ building
brian     1340  80.0  65.0 ∞ problem_solving`
    },
    { 
      cmd: "git log --oneline | head -5", 
      output: `f4a2b1c feat: mastered vue.js ecosystem 
8e7d9f3 feat: enhanced react native skills
c2b5a8e feat: added flutter/dart expertise  
9f1e4d7 feat: improved typescript proficiency
a3c6b9f feat: full-stack project completion`
    }
  ]

  useEffect(() => {
    let commandIndex = 0
    let charIndex = 0
    let currentCommand = ""

    const typeCommand = () => {
      if (commandIndex < commands.length) {
        const command = commands[commandIndex]
        
        if (charIndex === 0) {
          setIsTyping(true)
        }
        
        if (charIndex < command.cmd.length) {
          currentCommand += command.cmd[charIndex]
          setCurrentLine(`brian@portfolio:~$ ${currentCommand}`)
          charIndex++
          setTimeout(typeCommand, Math.random() * 100 + 50)
        } else {
          setIsTyping(false)
          setTerminalLines(prev => [
            ...prev,
            `brian@portfolio:~$ ${command.cmd}`,
            command.output
          ])
          setCurrentLine("")
          currentCommand = ""
          charIndex = 0
          commandIndex++
          setTimeout(typeCommand, 1500)
        }
      } else {
        setTimeout(() => {
          setTerminalLines([])
          commandIndex = 0
          typeCommand()
        }, 3000)
      }
    }

    const initialDelay = setTimeout(typeCommand, 1000)
    return () => clearTimeout(initialDelay)
  }, [])

  return (
    <div className="glass-dark p-1 rounded-lg border border-emerald-400/20 hacker-shape">
      <div className="bg-gray-900 border border-emerald-400/30 rounded-lg overflow-hidden">
        <div className="bg-gray-800 border-b border-emerald-400/30 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 cursor-pointer"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 cursor-pointer"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 cursor-pointer"></div>
          </div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-mono">brian@portfolio:~</span>
          </div>
          <div className="text-xs text-gray-500 font-mono">zsh</div>
        </div>
        <div className="p-4 font-mono text-sm h-72 overflow-y-auto bg-gray-900">
          <div className="text-emerald-400 mb-4 text-xs">
            Welcome to Brian's Terminal v2.1.0<br/>
            Last login: {new Date().toLocaleString()}<br/>
            ───────────────────────────────────
          </div>
          {terminalLines.map((line, index) => (
            <div key={index} className="mb-1">
              {line.startsWith('brian@portfolio') ? (
                <span className="text-emerald-400 text-xs">{line}</span>
              ) : (
                <pre className="text-gray-300 whitespace-pre-wrap text-xs leading-relaxed">{line}</pre>
              )}
            </div>
          ))}
          {currentLine && (
            <div className="text-emerald-400 flex items-center text-xs">
              {currentLine}
              <span className={`ml-1 ${isTyping ? 'animate-pulse' : 'animate-pulse'}`}>█</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Profile Image Component with Animations
const ProfileSection = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Rotating circles */}
        <div className="absolute inset-0 w-64 h-64">
          <div className="absolute inset-0 border-2 border-emerald-400/30 rounded-full animate-spin-slow"></div>
          <div className="absolute inset-4 border-2 border-cyan-400/30 rounded-full animate-spin-reverse"></div>
          <div className="absolute inset-8 border border-emerald-400/20 rounded-full animate-pulse"></div>
        </div>
        
        {/* Profile image container */}
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-48 h-48 rounded-full overflow-hidden border-4 border-emerald-400/40 glass-dark"
        >
          <div className="w-full h-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center">
            <User className="w-24 h-24 text-emerald-400" />
            {/* Profile image placeholder */}
            <img 
              src="/assets/profile.jpg" 
              alt="Brian Chege"
              className="absolute inset-0 w-full h-full object-cover opacity-0"
              onLoad={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.opacity = '1';
              }}
            />
          </div>
        </motion.div>
        
        {/* Status indicator */}
        <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900 animate-pulse"></div>
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-2xl font-bold text-emerald-400 font-mono mb-2">BRIAN CHEGE</h3>
        <p className="text-gray-300 mb-4">Full Stack Developer & CS Student</p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>Nairobi, Kenya</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>DeKUT CS</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Experience Timeline
const ExperienceTimeline = () => {
  const experiences = [
    {
      year: "2024-Present",
      title: "Full Stack Developer",
      company: "Freelance",
      description: "Building modern web and mobile applications using React, Vue.js, React Native, and TypeScript",
      tech: ["React", "Vue.js", "React Native", "TypeScript", "Node.js"]
    },
    {
      year: "2023-2024", 
      title: "Frontend Developer",
      company: "Various Projects",
      description: "Specialized in creating responsive, user-friendly interfaces with modern frameworks",
      tech: ["React", "Angular", "Tailwind CSS", "JavaScript"]
    },
    {
      year: "2022-2023",
      title: "Learning & Building",
      company: "Self-Directed",
      description: "Intensive learning period focused on mastering full-stack development fundamentals",
      tech: ["HTML/CSS", "JavaScript", "Node.js", "Databases"]
    }
  ]

  return (
    <div className="space-y-8">
      {experiences.map((exp, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
          viewport={{ once: true }}
          className="relative pl-8"
        >
          <div className="absolute left-0 top-2 w-4 h-4 bg-emerald-400 rounded-full border-4 border-gray-900"></div>
          <div className="absolute left-2 top-6 w-0.5 h-full bg-emerald-400/30"></div>
          
          <div className="glass-dark p-6 rounded-lg border border-emerald-400/20 hacker-shape">
            <div className="flex flex-wrap items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-emerald-400 font-mono">{exp.title}</h3>
              <span className="text-sm text-cyan-400 font-mono">{exp.year}</span>
            </div>
            <p className="text-gray-300 font-semibold mb-2">{exp.company}</p>
            <p className="text-gray-400 text-sm mb-4">{exp.description}</p>
            <div className="flex flex-wrap gap-2">
              {exp.tech.map((tech, techIndex) => (
                <span key={techIndex} className="px-2 py-1 bg-emerald-400/10 text-emerald-400 text-xs font-mono rounded border border-emerald-400/30">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Stats Section
const StatsSection = () => {
  const stats = [
    { label: "Projects Completed", value: "50+", icon: Award },
    { label: "Technologies Mastered", value: "20+", icon: Code },
    { label: "Years Experience", value: "5+", icon: Calendar },
    { label: "Client Satisfaction", value: "100%", icon: Target },
    { label: "Coffee Consumed", value: "1337+", icon: Coffee },
    { label: "Code Lines Written", value: "100K+", icon: Terminal }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="glass-dark p-6 rounded-lg border border-emerald-400/20 text-center hacker-shape"
        >
          <stat.icon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
          <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

// Philosophy Section
const PhilosophySection = () => {
  const philosophies = [
    {
      title: "Code is Poetry",
      description: "Every line of code should be crafted with intention, elegance, and purpose",
      icon: BookOpen
    },
    {
      title: "User-Centric Design",
      description: "Technology serves people, not the other way around",
      icon: Eye
    },
    {
      title: "Continuous Learning",
      description: "In tech, the moment you stop learning is the moment you start becoming obsolete",
      icon: Brain
    },
    {
      title: "Problem Solving",
      description: "Every challenge is an opportunity to create something better",
      icon: Zap
    }
  ]

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {philosophies.map((philosophy, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          className="glass-dark p-6 rounded-lg border border-emerald-400/20 hacker-shape"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg p-3 flex-shrink-0">
              <philosophy.icon className="w-full h-full text-black" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-400 font-mono mb-2">{philosophy.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{philosophy.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900">
      <MatrixRain />

      {/* Enhanced Background with parallax */}
      <div className="fixed inset-0 hero-bg z-0" />
      <div className="fixed inset-0 cyber-grid-subtle opacity-10 z-0" />
      <div 
        className="fixed inset-0 opacity-10 z-0"
        style={{
          backgroundImage: "url('/assets/code2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      />

      <div className="relative z-10 pt-32">
        {/* Hero Section with adequate spacing */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-32 px-4"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 font-mono text-gradient-emerald gentle-glow">
            ABOUT_ME.EXE
          </h1>
          <p className="text-xl text-emerald-300 max-w-3xl mx-auto font-mono">
            {">"} Decoding the human behind the code...
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Terminal and Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid lg:grid-cols-2 gap-12 mb-32 items-start"
          >
            <div>
              <TerminalComponent />
            </div>
            <div>
              <ProfileSection />
            </div>
          </motion.div>

          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">NEURAL_PROFILE</h2>
            <div className="glass-dark p-8 rounded-lg border border-emerald-400/20 hacker-shape">
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  I'm Brian Chege, a passionate Computer Science student at Dedan Kimathi University of Technology, 
                  specializing in full-stack development with a focus on modern web and mobile technologies. My journey 
                  transforms complex problems into elegant digital solutions that impact real users.
                </p>
                <p>
                  My expertise spans across React, Vue.js, Angular, React Native, and TypeScript, enabling me to build 
                  comprehensive applications from concept to deployment. I thrive on creating responsive frontends, 
                  robust APIs, and seamless mobile experiences that bridge the gap between cutting-edge innovation 
                  and practical business solutions.
                </p>
                <p>
                  When I'm not immersed in code, you'll find me exploring the latest frameworks, contributing to
                  open-source projects, practicing on platforms like Frontend Mentor and Dev Challenges, or sharing 
                  knowledge with the developer community through mentoring and technical discussions.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Practice Platforms Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">TRAINING_GROUNDS</h2>
            <p className="text-center text-gray-300 mb-8 font-mono">Platforms where I sharpen my skills daily</p>
            <InfinitePlatformSlider />
          </motion.div>

          {/* Experience Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">EXPERIENCE_LOG</h2>
            <ExperienceTimeline />
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">SYSTEM_METRICS</h2>
            <StatsSection />
          </motion.div>

          {/* Philosophy Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">CODE_PHILOSOPHY</h2>
            <PhilosophySection />
          </motion.div>

          {/* Personal Interests */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">PASSION_MODULES</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Code, title: "Clean Architecture", desc: "Building scalable, maintainable systems", color: "from-blue-500 to-cyan-600" },
                { icon: Coffee, title: "Coffee Culture", desc: "Fuel for innovation and late-night coding", color: "from-amber-500 to-orange-600" },
                { icon: Gamepad2, title: "Game Development", desc: "Exploring interactive experiences", color: "from-purple-500 to-pink-600" },
                { icon: Music, title: "Lo-Fi Coding", desc: "Perfect ambient soundtracks for focus", color: "from-green-500 to-teal-600" },
                { icon: Brain, title: "Tech Innovation", desc: "Following emerging technologies", color: "from-indigo-500 to-purple-600" },
                { icon: Globe, title: "Open Source", desc: "Contributing to the global community", color: "from-yellow-500 to-red-600" }
              ].map((interest, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateX: -30 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, rotateY: 5 }}
                  className="glass-dark p-6 rounded-lg border border-emerald-400/20 hacker-shape"
                >
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${interest.color} p-4 mb-4`}>
                    <interest.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-emerald-400 font-mono">{interest.title}</h3>
                  <p className="text-sm text-gray-300">{interest.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-32"
          >
            <div className="glass-dark p-12 rounded-lg border border-emerald-400/20 hacker-shape">
              <h2 className="text-4xl font-black mb-6 text-emerald-400 font-mono">READY_TO_COLLABORATE?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Let's build something amazing together. Whether it's a web application, mobile app, 
                or full-stack solution, I'm ready to turn your ideas into reality.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(16, 185, 129, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-emerald px-8 py-4 rounded-lg font-bold text-white hover:bg-emerald-500/20 transition-all duration-300 font-mono"
                >
                  VIEW PROJECTS
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(16, 185, 129, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-dark px-8 py-4 rounded-lg font-bold text-emerald-400 border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-300 font-mono"
                >
                  GET IN TOUCH
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-1/4 left-10 w-2 h-2 bg-emerald-400 rounded-full animate-pulse opacity-60"></div>
      <div className="fixed top-2/3 left-1/4 w-3 h-3 bg-emerald-400 rounded-full animate-bounce opacity-40"></div>
      <div className="fixed bottom-1/4 right-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping opacity-50"></div>
      <div className="fixed top-1/2 right-10 w-2 h-2 bg-emerald-400 rounded-full animate-pulse opacity-30"></div>
      
      {/* Custom Styles */}
      <style jsx global>{`
        .glass-dark {
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(16, 185, 129, 0.1);
        }
        
        .glass-emerald {
          background: rgba(16, 185, 129, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .text-gradient-emerald {
          background: linear-gradient(135deg, #10b981, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gentle-glow {
          text-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
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
        
        .hacker-shape {
          clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px));
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }
      `}</style>
    </div>
  )
}