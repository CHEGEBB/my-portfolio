"use client"

import { motion, useInView } from "framer-motion"
import {
  Code,
  Coffee,
  Gamepad2,
  Music,
  Brain,
  Zap,
  User,
  Calendar,
  MapPin,
  Award,
  Terminal,
  Monitor,
  Globe,
  BookOpen,
  Target,
  Cpu,
  Network,
  Eye,
  Settings,
  GraduationCap,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

// Your Original Matrix Rain Component (only for hero section)
const MatrixRain = () => {
  const [drops, setDrops] = useState<
    { id: number; x: number; y: number; char: string; speed: number; opacity: number }[]
  >([])

  useEffect(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>?/.,;:!+-=_"
    const newDrops = []

    for (let i = 0; i < 100; i++) {
      newDrops.push({
        id: i,
        x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
        char: characters[Math.floor(Math.random() * characters.length)],
        speed: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }
    setDrops(newDrops)

    const interval = setInterval(() => {
      setDrops((prev) =>
        prev.map((drop) => ({
          ...drop,
          y: drop.y > (typeof window !== "undefined" ? window.innerHeight : 800) ? -20 : drop.y + drop.speed,
          char: Math.random() > 0.95 ? characters[Math.floor(Math.random() * characters.length)] : drop.char,
        })),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute text-emerald-400 font-mono text-sm"
          style={{
            left: drop.x,
            top: drop.y,
            opacity: drop.opacity,
          }}
        >
          {drop.char}
        </div>
      ))}
    </div>
  )
}

// Infinite Sliding Platforms (keeping your original)
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
          x: [0, -1920],
        }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
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

// Enhanced Terminal Component - Shows one command at a time, then deletes and shows next
const TerminalComponent = () => {
  const [currentCommand, setCurrentCommand] = useState("")
  const [currentOutput, setCurrentOutput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showOutput, setShowOutput] = useState(false)

  const commands = [
    {
      cmd: "whoami",
      output: "brian_chege\nUID: 1001 GID: 1001\nGroups: developers,hackers,creators\nShell: /bin/zsh",
    },
    {
      cmd: "cat education.txt",
      output: `EDUCATION:

• Dedan Kimathi University of Technology
  Computer Science, 2022 - Present

• ALX Software Engineering Program
  Graduate, 2023 - 2024

• PLP Africa - Feb 2025 - Present

• Teach2Give - Feb - May 2025`,
    },
    {
      cmd: "cat experience.log",
      output: `EXPERIENCE:

• Co-Founder & CTO - Health Master (2024-Present)
• Full-Stack Developer Intern - Teach2Give
• Full-Stack Development Intern - Prodigy Infotech
• Full-Stack Development Intern - CodSoft
• Account Opening Officer Intern - Equity Bank Kenya`,
    },
    {
      cmd: "cat journey.txt",
      output: `MY JOURNEY:

Since high school, I&apos;ve had a deep fascination with computers 
and technology. What started as curiosity evolved into passion 
when I wrote my first lines of code.

Today, I&apos;m building applications that solve real-world problems, 
constantly learning new technologies, and contributing to the 
tech community.`,
    },
    {
      cmd: "ls -la ~/skills/",
      output: `drwxr-xr-x frontend/     [React, Vue, Angular, TypeScript]
drwxr-xr-x backend/      [Node.js, Express, Python]
drwxr-xr-x mobile/       [React Native, Flutter]
drwxr-xr-x databases/    [PostgreSQL, MongoDB]
drwxr-xr-x tools/        [Git, Docker, AWS]`,
    },
  ]

  useEffect(() => {
    let commandIndex = 0
    let charIndex = 0
    let isDeleting = false

    const typeEffect = () => {
      const command = commands[commandIndex]

      if (!isDeleting) {
        // Typing command
        if (charIndex < command.cmd.length) {
          setIsTyping(true)
          setCurrentCommand(command.cmd.slice(0, charIndex + 1))
          charIndex++
          setTimeout(typeEffect, Math.random() * 100 + 50)
        } else {
          // Command finished, show output
          setIsTyping(false)
          setShowOutput(true)
          setCurrentOutput(command.output)
          setTimeout(() => {
            isDeleting = true
            typeEffect()
          }, 3000) // Show output for 3 seconds
        }
      } else {
        // Deleting
        if (showOutput) {
          setShowOutput(false)
          setCurrentOutput("")
        }

        if (charIndex > 0) {
          setCurrentCommand(command.cmd.slice(0, charIndex - 1))
          charIndex--
          setTimeout(typeEffect, 30)
        } else {
          // Move to next command
          isDeleting = false
          commandIndex = (commandIndex + 1) % commands.length
          setTimeout(typeEffect, 500)
        }
      }
    }

    const initialDelay = setTimeout(typeEffect, 1000)
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
        <div className="p-4 font-mono text-sm h-80 bg-gray-900">
          <div className="text-emerald-400 mb-4 text-xs">
            Welcome to Brian&apos;s Terminal v2.1.0
            <br />
            Last login: {new Date().toLocaleString()}
            <br />
            ───────────────────────────────────
          </div>

          {/* Current command line */}
          <div className="text-emerald-400 flex items-center text-xs mb-2">
            brian@portfolio:~$ {currentCommand}
            <span className={`ml-1 ${isTyping ? "animate-pulse" : "animate-pulse"}`}>█</span>
          </div>

          {/* Output */}
          {showOutput && (
            <pre className="text-gray-300 whitespace-pre-wrap text-xs leading-relaxed mb-4">{currentOutput}</pre>
          )}
        </div>
      </div>
    </div>
  )
}

// Simplified Profile Section (keeping closer to your original)
const ProfileSection = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Simple rotating circles like your original */}
        <div className="absolute inset-0 w-64 h-64">
          <div className="absolute inset-0 border-2 border-emerald-400/30 rounded-full animate-spin-slow"></div>
          <div className="absolute inset-4 border-2 border-cyan-400/30 rounded-full animate-spin-reverse"></div>
          <div className="absolute inset-8 border border-emerald-400/20 rounded-full animate-pulse"></div>
        </div>

        {/* Profile image container */}
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="relative z-10 w-48 h-48 rounded-full overflow-hidden border-4 border-emerald-400/40 glass-dark"
        >
          <div className="w-full h-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center">
            <User className="w-24 h-24 text-emerald-400" />
            <img
              src="/assets/profile.jpg"
              alt="Brian Chege"
              className="absolute inset-0 w-full h-full object-cover opacity-0"
              onLoad={(e) => {
                const target = e.target as HTMLImageElement
                target.style.opacity = "1"
              }}
            />
          </div>
        </motion.div>

        {/* Status indicator */}
        <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900 animate-pulse"></div>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono mb-2">
          BRIAN CHEGE
        </h3>
        <p className="text-gray-300 mb-4">Full Stack Developer & Software engineer</p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>Nairobi, Kenya</span>
          </div>
          <div className="flex items-center space-x-1">
            <GraduationCap className="w-4 h-4" />
            <span>Dedan Kimathi University</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Animated Counter Component
const CountUpNumber = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(countRef, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    let animationFrame: number

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)

      setCount(Math.floor(percentage * end))

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(updateCount)
      }
    }

    animationFrame = requestAnimationFrame(updateCount)

    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, isInView])

  return <div ref={countRef}>{count}</div>
}

// Education Section
const EducationSection = () => {
  const education = [
    {
      institution: "Dedan Kimathi University of Technology",
      degree: "Bachelor of Science in Computer Science",
      period: "2022 - Present",
      description: "Focusing on algorithms, data structures, software engineering, and system design.",
    },
    {
      institution: "ALX Software Engineering Program",
      degree: "Software Engineering Graduate",
      period: "2023 - 2024",
      description: "Intensive program focused on algorithms, system design, backend and frontend development.",
    },
    {
      institution: "PLP Africa",
      degree: "Professional Learning Program",
      period: "February 2025 - Present",
      description: "Advancing software development skills, leadership, and real-world problem solving.",
    },
    {
      institution: "Teach2Give",
      degree: "Technical Training Program",
      period: "February - May 2025",
      description: "Specialized training in modern web development technologies and practices.",
    },
  ]

  return (
    <div className="space-y-8">
      {education.map((edu, index) => (
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
              <h3 className="text-xl font-bold text-emerald-400 font-mono">{edu.institution}</h3>
              <span className="text-sm text-cyan-400 font-mono">{edu.period}</span>
            </div>
            <p className="text-gray-300 font-semibold mb-2">{edu.degree}</p>
            <p className="text-gray-400 text-sm">{edu.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Experience Timeline with your provided content
const ExperienceTimeline = () => {
  const experiences = [
    {
      year: "2024-Present",
      title: "Co-Founder & CTO",
      company: "Health Master",
      description:
        "Leading the technical development of Health Master, a medication adherence, drug interaction checker, and health tracker app powered by AI. The platform helps users manage medications, track health metrics, and identify potential drug interactions, improving health outcomes through innovative technology.",
      tech: ["React Native", "AI/ML", "Node.js", "MongoDB", "TypeScript"],
    },
    {
      year: "Feb-May 2025",
      title: "Full-Stack Developer Intern",
      company: "Teach2Give",
      description:
        "Developed and maintained education-focused platforms, applying full-stack skills in a team setting.",
      tech: ["React", "Node.js", "Express", "MongoDB"],
    },
    {
      year: "2024",
      title: "Full-Stack Development Intern",
      company: "Prodigy Infotech (Remote)",
      description:
        "Worked on end-to-end development projects using React, Node.js, Express, and MongoDB, strengthening practical coding and deployment experience.",
      tech: ["React", "Node.js", "Express", "MongoDB"],
    },
    {
      year: "2024",
      title: "Full-Stack Development Intern",
      company: "CodSoft (Remote)",
      description:
        "Contributed to building full-stack applications, enhancing skills in UI development, API integration, and remote team collaboration.",
      tech: ["React", "Node.js", "API Integration"],
    },
    {
      year: "2023-2024",
      title: "ALX Software Engineering Program",
      company: "Graduate",
      description:
        "Completed an intensive software engineering program focused on algorithms, system design, backend and frontend development. Gained hands-on experience building scalable applications with modern technologies and best practices.",
      tech: ["C", "Python", "JavaScript", "System Design"],
    },
    {
      year: "June-Sept 2022",
      title: "Account Opening Officer Intern",
      company: "Equity Bank Kenya",
      description:
        "Supported customer onboarding, account creation, and marketing initiatives. This role enhanced my communication skills and introduced me to real-world financial operations.",
      tech: ["Customer Service", "Banking Operations"],
    },
    {
      year: "Ongoing",
      title: "Member",
      company: "Cybersecurity Club, Dedan Kimathi University",
      description:
        "Actively engaged in cybersecurity activities, challenges, and knowledge sharing to deepen my expertise in network security, penetration testing, and cryptography.",
      tech: ["Cybersecurity", "Penetration Testing", "Cryptography"],
    },
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
                <span
                  key={techIndex}
                  className="px-2 py-1 bg-emerald-400/10 text-emerald-400 text-xs font-mono rounded border border-emerald-400/30"
                >
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

// Stats Section with Count Up Animation
const StatsSection = () => {
  const stats = [
    { label: "Projects Completed", value: 50, suffix: "+", icon: Award },
    { label: "Technologies Mastered", value: 20, suffix: "+", icon: Code },
    { label: "Years Experience", value: 5, suffix: "+", icon: Calendar },
    { label: "Client Satisfaction", value: 100, suffix: "%", icon: Target },
    { label: "Coffee Consumed", value: 1337, suffix: "+", icon: Coffee },
    { label: "Code Lines Written", value: 100, suffix: "K+", icon: Terminal },
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
          <div className="text-2xl font-bold text-white font-mono flex justify-center">
            <CountUpNumber end={stat.value} />
            <span>{stat.suffix}</span>
          </div>
          <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

// Philosophy Section (keeping your original)
const PhilosophySection = () => {
  const philosophies = [
    {
      title: "Code is Poetry",
      description: "Every line of code should be crafted with intention, elegance, and purpose",
      icon: BookOpen,
    },
    {
      title: "User-Centric Design",
      description: "Technology serves people, not the other way around",
      icon: Eye,
    },
    {
      title: "Continuous Learning",
      description: "In tech, the moment you stop learning is the moment you start becoming obsolete",
      icon: Brain,
    },
    {
      title: "Problem Solving",
      description: "Every challenge is an opportunity to create something better",
      icon: Zap,
    },
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
      {/* Fixed Unsplash Code Background for entire page */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&h=1080&fit=crop&crop=center')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="fixed inset-0 bg-slate-900/85 z-0" />

      <div className="relative z-10 pt-32">
        {/* Hero Section with Matrix Rain */}
        <section className="relative  flex items-center justify-center">
          {/* Matrix Rain only in hero */}
          <MatrixRain />

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-32 px-4 relative z-10"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-6 font-mono text-gradient-emerald gentle-glow">
              ABOUT_ME.EXE
            </h1>
            <p className="text-lg text-emerald-300 max-w-3xl mx-auto font-mono">
              {">"} Decoding the human behind the code...
            </p>
          </motion.div>
        </section>

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

          {/* Bio Section - Journey from high school */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-3xl font-black mb-12 text-center text-emerald-400 font-mono">MY_JOURNEY.LOG</h2>
            <div className="glass-dark p-8 rounded-lg border border-emerald-400/20 hacker-shape">
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  Since high school, I&apos;ve had a deep fascination with computers and technology. What started as
                  curiosity evolved into passion when I wrote my first lines of code. The ability to create something
                  from nothing, to solve problems with logic and creativity, captivated me.
                </p>
                <p>
                  This passion led me to pursue Computer Science at Dedan Kimathi University of Technology, where I&apos;ve
                  been expanding my knowledge and skills in software development, algorithms, and system design. I&apos;ve
                  supplemented my formal education with specialized programs like ALX Software Engineering, PLP Africa,
                  and Teach2Give.
                </p>
                <p>
                  Today, I&apos;m building applications that solve real-world problems, constantly learning new technologies,
                  and contributing to the tech community. As Co-Founder & CTO of Health Master, I&apos;m applying my skills
                  to improve health outcomes through innovative technology.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Education Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-3xl font-black mb-12 text-center text-emerald-400 font-mono">EDUCATION.DAT</h2>
            <EducationSection />
          </motion.div>

          {/* Experience Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-3xl font-black mb-12 text-center text-emerald-400 font-mono">EXPERIENCE_LOG</h2>
            <ExperienceTimeline />
          </motion.div>

          {/* Practice Platforms Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-3xl font-black mb-12 text-center text-emerald-400 font-mono">TRAINING_GROUNDS</h2>
            <p className="text-center text-gray-300 mb-8 font-mono">Platforms where I sharpen my skills daily</p>
            <InfinitePlatformSlider />
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-32"
          >
            <h2 className="text-3xl font-black mb-12 text-center text-emerald-400 font-mono">SYSTEM_METRICS</h2>
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
            <h2 className="text-3xl font-black mb-12 text-center text-emerald-400 font-mono">CODE_PHILOSOPHY</h2>
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
            <h2 className="text-3xl font-black mb-12 text-center text-emerald-400 font-mono">PASSION_MODULES</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Code,
                  title: "Clean Architecture",
                  desc: "Building scalable, maintainable systems",
                  color: "from-blue-500 to-cyan-600",
                },
                {
                  icon: Coffee,
                  title: "Coffee Culture",
                  desc: "Fuel for innovation and late-night coding",
                  color: "from-amber-500 to-orange-600",
                },
                {
                  icon: Gamepad2,
                  title: "Game Development",
                  desc: "Exploring interactive experiences",
                  color: "from-purple-500 to-pink-600",
                },
                {
                  icon: Music,
                  title: "Lo-Fi Coding",
                  desc: "Perfect ambient soundtracks for focus",
                  color: "from-green-500 to-teal-600",
                },
                {
                  icon: Brain,
                  title: "Tech Innovation",
                  desc: "Following emerging technologies",
                  color: "from-indigo-500 to-purple-600",
                },
                {
                  icon: Globe,
                  title: "Open Source",
                  desc: "Contributing to the global community",
                  color: "from-yellow-500 to-red-600",
                },
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
              <h2 className="text-3xl font-black mb-6 text-emerald-400 font-mono">READY_TO_COLLABORATE?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Let&apos;s build something amazing together. Whether it&apos;s a web application, mobile app, or full-stack
                solution, I&apos;m ready to turn your ideas into reality.
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

        {/* Scroll to top indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="fixed bottom-8 right-8 z-20"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-12 h-12 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        </motion.div>
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

        html {
          scroll-behavior: smooth;
        }

        /* Optimize performance */
        * {
          box-sizing: border-box;
        }

        /* Better scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }

        /* Loading animation for images */
        img {
          transition: opacity 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}
