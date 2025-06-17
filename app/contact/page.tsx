"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, number } from "framer-motion"
import { 
  Mail, Phone, MapPin, Github, Linkedin, Twitter, Send, MessageSquare, 
  Clock, Globe, Terminal, Code, Shield, Zap, Cpu, Database, Braces,
  AlertTriangle, Star, Coffee, BatteryCharging, PenTool, Bot, Feather,
  Cloud, Box, Flame, GitBranch, Users, Eye, Calendar, Activity, ExternalLink
} from "lucide-react"
import { MatrixRain } from "@/components/matrix-rain"
import { useAudio } from "@/components/audio-provider"

// GitHub API interfaces
interface GitHubUser {
  login: string
  name: string
  bio: string
  avatar_url: string
  location: string
  email: string
  followers: number
  following: number
  public_repos: number
  created_at: string
}

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string
  created_at: string
  updated_at: string
  pushed_at: string
  topics: string[]
}

interface GitHubEvent {
  id: string
  type: string
  created_at: string
  repo: {
    name: string
    url: string
  }
  payload: any
}

export default function ContactPage() {
  const { playHover, playClick } = useAudio()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [terminalText, setTerminalText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const [skillLevel, setSkillLevel] = useState(0)
  
  // GitHub data states
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null)
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [recentActivity, setRecentActivity] = useState<GitHubEvent[]>([])
  const [mostStarredRepos, setMostStarredRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)

  const GITHUB_USERNAME = 'CHEGEBB'
  const GITHUB_API_BASE = 'https://api.github.com'

  // Fetch GitHub data
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true)
        
        // Fetch user info
        const userResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`)
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setGithubUser(userData)
        }

        // Fetch repositories
        const reposResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`)
        if (reposResponse.ok) {
          const reposData = await reposResponse.json()
          setGithubRepos(reposData)
          
          // Get most starred repos
          const sortedByStars = [...reposData]
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6)
          setMostStarredRepos(sortedByStars)
        }

        // Fetch recent activity
        const eventsResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events?per_page=10`)
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json()
          setRecentActivity(eventsData)
        }

      } catch (error) {
        console.error('Error fetching GitHub data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [])

  // Typewriter effect for terminal
  useEffect(() => {
    const messages = [
      "> Initializing secure comm channel...",
      "> Establishing encrypted connection...",
      "> Security protocols activated...",
      "> Fetching GitHub data stream...",
      "> Ready to receive transmission...",
    ]
    let currentCharIndex = 0
    let currentMessageIndex = 0
    let timer: ReturnType<typeof setInterval> | undefined

    const typeNextCharacter = () => {
      if (currentMessageIndex < messages.length) {
        const currentMessage = messages[currentMessageIndex]
        if (currentCharIndex < currentMessage.length) {
          setTerminalText(prev => prev + currentMessage[currentCharIndex])
          currentCharIndex++
        } else {
          if (currentMessageIndex < messages.length - 1) {
            setTerminalText(prev => prev + "\n")
            currentMessageIndex++
            currentCharIndex = 0
          } else {
            clearInterval(timer)
          }
        }
      }
    }

    timer = setInterval(typeNextCharacter, 50)
    
    const cursorTimer = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 500)

    return () => {
      clearInterval(timer)
      clearInterval(cursorTimer)
    }
  }, [])

  // Automatic skill level animation
  useEffect(() => {
    const timer = setInterval(() => {
      setSkillLevel(prev => (prev < 100 ? prev + 1 : 0))
    }, 30)
    
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    playClick()

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setFormSubmitted(true)
    
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" })
      setFormSubmitted(false)
    }, 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "chegephil24@gmail.com",
      href: "mailto:chegephil24@gmail.com",
      color: "text-emerald-400",
    },
    { icon: Phone, label: "Phone", value: "+254 712 345 678", href: "tel:+254712345678", color: "text-blue-400" },
    { icon: MapPin, label: "Location", value: githubUser?.location || "Kenya", href: "#", color: "text-purple-400" },
    { icon: Globe, label: "Timezone", value: "EAT (UTC+3)", href: "#", color: "text-cyan-400" },
  ]

  const socialLinks = [
    { 
      icon: Github, 
      label: "GitHub", 
      href: "https://github.com/CHEGEBB", 
      color: "hover:text-gray-400", 
      bg: "bg-gray-600" 
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/chegebb",
      color: "hover:text-blue-400",
      bg: "bg-blue-600",
    },
    { 
      icon: Twitter, 
      label: "Twitter", 
      href: "https://twitter.com/chegebb", 
      color: "hover:text-blue-400", 
      bg: "bg-blue-500" 
    },
  ]

  const responseTime = [
    { time: "< 2 hours", type: "Urgent Projects", icon: <AlertTriangle className="w-5 h-5 text-red-400" /> },
    { time: "< 24 hours", type: "General Inquiries", icon: <MessageSquare className="w-5 h-5 text-blue-400" /> },
    { time: "< 48 hours", type: "Collaboration", icon: <Feather className="w-5 h-5 text-purple-400" /> },
  ]

  const skills = [
    { name: "Full-Stack Dev", icon: <Code className="w-5 h-5" />, level: 95 },
    { name: "Cybersecurity", icon: <Shield className="w-5 h-5" />, level: 85 },
    { name: "API Design", icon: <Braces className="w-5 h-5" />, level: 90 },
    { name: "Cloud Services", icon: <Database className="w-5 h-5" />, level: 88 },
  ]

  const getProjectStatus = (repo: GitHubRepo): string => {
    const lastUpdate = new Date(repo.pushed_at)
    const now = new Date()
    const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceUpdate <= 7) return 'Active'
    if (daysSinceUpdate <= 30) return 'Recent'
    return 'Archived'
  }

  const formatActivityType = (event: GitHubEvent): string => {
    switch (event.type) {
      case 'PushEvent':
        return 'Pushed code'
      case 'CreateEvent':
        return 'Created repository'
      case 'WatchEvent':
        return 'Starred repository'
      case 'ForkEvent':
        return 'Forked repository'
      case 'IssuesEvent':
        return 'Worked on issues'
      case 'PullRequestEvent':
        return 'Pull request activity'
      default:
        return event.type.replace('Event', '')
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4 relative overflow-hidden bg-slate-900">
      <MatrixRain />

      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 hero-bg z-0" />
      <div className="fixed inset-0 cyber-grid-subtle opacity-30 z-0" />
      
      {/* Animated Circuit Lines */}
      <div className="fixed inset-0 z-0">
        <svg width="100%" height="100%" className="opacity-10">
          <motion.path
            d="M0,100 Q50,50 100,100 T200,100"
            stroke="rgba(52, 211, 153, 0.5)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path
            d="M0,200 Q150,150 300,200 T600,200"
            stroke="rgba(52, 211, 153, 0.3)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with Glitching Effect */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-black mb-6 font-mono text-gradient-emerald gentle-glow">
              CONTACT_INTERFACE
            </h1>
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-5xl md:text-7xl font-black font-mono text-red-500 opacity-0"
              animate={{ 
                opacity: [0, 0.8, 0], 
                x: [-2, 2, -1, 0],
                y: [1, -1, 0]
              }}
              transition={{ 
                duration: 0.2, 
                repeat: Infinity, 
                repeatDelay: 5 
              }}
            >
              CONTACT_INTERFACE
            </motion.div>
          </div>
          <div className="terminal-window w-full max-w-xl mx-auto bg-black/70 p-4 rounded-md border border-emerald-500/30">
            <p className="font-mono text-sm text-emerald-400">
              {terminalText}
              {cursorVisible && <span className="text-emerald-400">▋</span>}
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass-dark p-8 rounded-lg border border-emerald-400/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-20 h-20">
                <motion.div 
                  className="absolute top-0 left-0 w-10 h-1 bg-emerald-500"
                  animate={{ width: [10, 20, 10] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute top-0 left-0 w-1 h-10 bg-emerald-500"
                  animate={{ height: [10, 20, 10] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </div>
              
              <h2 className="text-3xl font-bold mb-6 text-emerald-400 font-mono flex items-center">
                <Terminal className="mr-2 h-6 w-6" />
                SEND_MESSAGE
              </h2>

              <AnimatePresence>
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="success-message p-8 rounded-md bg-emerald-500/20 border border-emerald-500 text-center"
                  >
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ duration: 0.5 }}
                      className="inline-block mb-4"
                    >
                      <Shield className="h-16 w-16 text-emerald-400 mx-auto" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-emerald-400 mb-2 font-mono">TRANSMISSION_RECEIVED</h3>
                    <p className="text-gray-300 font-mono">
                      Your message has been encrypted and securely transmitted. 
                      <br/>Expect a response shortly.
                    </p>
                    <div className="mt-4 p-2 bg-black/30 rounded-md font-mono text-xs text-emerald-300">
                      <p>STATUS: SUCCESS</p>
                      <p>ENCRYPTION: AES-256</p>
                      <p>TIMESTAMP: {new Date().toISOString()}</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2 text-emerald-400 font-mono">
                          NAME
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 border border-emerald-400/20 font-mono text-white"
                          placeholder="> Enter your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2 text-emerald-400 font-mono">
                          EMAIL
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 border border-emerald-400/20 font-mono text-white"
                          placeholder="> your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2 text-emerald-400 font-mono">
                        SUBJECT
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 border border-emerald-400/20 font-mono text-white"
                        placeholder="> Project discussion"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2 text-emerald-400 font-mono">
                        MESSAGE
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 resize-none border border-emerald-400/20 font-mono text-white"
                        placeholder="> Tell me about your project..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      onMouseEnter={playHover}
                      className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-emerald-800 disabled:to-teal-800 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 font-mono"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>TRANSMIT_MESSAGE</span>
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
            
            {/* System Status */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 glass-dark p-6 rounded-lg border border-emerald-400/20"
            >
              <h2 className="text-2xl font-bold mb-4 text-emerald-400 font-mono flex items-center">
                <Cpu className="mr-2 h-5 w-5" />
                SYSTEM_STATUS
              </h2>
              
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={skill.name} className="relative">
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        {skill.icon}
                        <span className="text-sm font-mono text-gray-300">{skill.name}</span>
                      </div>
                      <span className="text-sm font-mono text-emerald-400">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                      />
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <BatteryCharging className="h-5 w-5 text-green-400" />
                      <span className="text-sm font-mono text-gray-300">System Load</span>
                    </div>
                    <span className="text-sm font-mono text-emerald-400">{skillLevel}%</span>
                  </div>
                  <div className="h-2 mt-1 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{ width: `${skillLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Info & Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div className="glass-dark p-8 rounded-lg border border-emerald-400/20 relative">
              <div className="absolute top-0 right-0 w-20 h-20">
                <motion.div 
                  className="absolute top-0 right-0 w-10 h-1 bg-emerald-500"
                  animate={{ width: [10, 20, 10] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute top-0 right-0 w-1 h-10 bg-emerald-500"
                  animate={{ height: [10, 20, 10] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </div>
            
              <h2 className="text-3xl font-bold mb-6 text-emerald-400 font-mono flex items-center">
                <Database className="mr-2 h-6 w-6" />
                CONTACT_DATA
              </h2>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-white/5 transition-all duration-200 group"
                    onMouseEnter={playHover}
                  >
                    <div className={`p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-400/30`}>
                      <info.icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 font-mono">{info.label}</div>
                      <div className="font-medium text-white group-hover:text-emerald-400 transition-colors duration-200 font-mono">
                        {info.value}
                      </div>
                    </div>
                  </motion.a>
                ))}
                
                {/* Bio Information */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 p-4 rounded-lg bg-black/30 border border-emerald-400/10"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Bot className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-emerald-400 font-mono">IDENTITY</h3>
                  </div>
                  <p className="text-gray-300 font-mono">
                    <span className="text-emerald-400">Name:</span> {githubUser?.name || "Brian Chege"}
                  </p>
                  <p className="text-gray-300 font-mono">
                    <span className="text-emerald-400">Alias:</span> {githubUser?.login || "CHEGEBB"}
                  </p>
                  {githubUser?.bio && (
                    <p className="text-gray-300 font-mono mt-2">
                      <span className="text-emerald-400">Bio:</span> {githubUser.bio}
                    </p>
                  )}
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{githubUser?.followers || 0} followers</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitBranch className="w-3 h-3" />
                      <span>{githubUser?.public_repos || 0} repos</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Response Time */}
            <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
              <h2 className="text-2xl font-bold mb-6 text-emerald-400 font-mono flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                RESPONSE_TIME
              </h2>
              <div className="space-y-4">
                {responseTime.map((item, index) => (
                  <motion.div
                    key={item.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
                  >
                    <div>{item.icon}</div>
                    <div>
                      <div className="font-bold text-emerald-400 font-mono">{item.time}</div>
                      <div className="text-sm text-gray-400">{item.type}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* GitHub Projects and Social Networks Row */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {/* Active Projects from GitHub */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
              <h2 className="text-2xl font-bold mb-6 text-emerald-400 font-mono flex items-center">
                <Code className="mr-2 h-5 w-5" />
                ACTIVE_PROJECTS
                {loading && <div className="ml-2 w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />}
              </h2>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  mostStarredRepos.slice(0, 6).map((repo, index) => {
                    const status = getProjectStatus(repo)
                    return (
                      <motion.div
                        key={repo.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="p-4 rounded-lg bg-gradient-to-r from-black/40 to-emerald-900/10 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-200 group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-white font-mono group-hover:text-emerald-400 transition-colors">
                                {repo.name}
                              </h3>
                              <a 
                                href={repo.html_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={playClick}
                              >
                                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-emerald-400" />
                              </a>
                            </div>
                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                              {repo.description || "No description available"}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full font-mono ml-2 ${
                            status === 'Active' ? 'bg-green-900/50 text-green-400' :
                            status === 'Recent' ? 'bg-blue-900/50 text-blue-400' :
                            'bg-gray-900/50 text-gray-400'
                          }`}>
                            {status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {repo.language && (
                            <span className="flex items-center space-x-1">
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                              <span>{repo.language}</span>
                            </span>
                          )}
                          <span className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>{repo.stargazers_count}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <GitBranch className="w-3 h-3" />
                            <span>{repo.forks_count}</span>
                          </span>
                        </div>
                        
                        {status === 'Active' && (
                          <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-green-500"
                              initial={{ width: 0 }}
                              animate={{ width: ['30%', '60%', '45%'] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                          </div>
                        )}
                      </motion.div>
                    )
                  })
                )}
              </div>
            </div>
          </motion.div>

          {/* Social Networks + Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Social Networks */}
            <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
              <h2 className="text-2xl font-bold mb-6 text-emerald-400 font-mono flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                SOCIAL_NETWORKS
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`p-6 glass-dark rounded-lg transition-all duration-200 ${social.color} border border-emerald-400/20 hover:border-emerald-400/40 flex flex-col items-center space-y-2`}
                    onMouseEnter={playHover}
                  >
                    <social.icon className="w-8 h-8" />
                    <span className="text-xs font-mono">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
              <h2 className="text-2xl font-bold mb-6 text-emerald-400 font-mono flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                RECENT_ACTIVITY
                {loading && <div className="ml-2 w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />}
              </h2>
              <div className="space-y-3">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-3 bg-gray-700 rounded w-3/4 mb-1"></div>
                        <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  recentActivity.slice(0, 5).map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-sm font-mono text-gray-300">
                          {formatActivityType(event)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-mono">
                        {event.repo.name} • {new Date(event.created_at).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Availability Status */}
            <div className="glass-dark p-6 rounded-lg border border-emerald-400/20">
              <h2 className="text-xl font-bold mb-4 text-emerald-400 font-mono flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                STATUS
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-3 h-3 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-white font-mono text-sm">Available for new projects</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span className="text-gray-400 text-xs font-mono">Usually responds within 24h</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-3 h-3 text-blue-400" />
                  <span className="text-gray-400 text-xs font-mono">Open to collaboration</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Technology Stack Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
            <h2 className="text-3xl font-bold mb-8 text-emerald-400 font-mono text-center flex items-center justify-center">
              <Terminal className="mr-3 h-6 w-6" />
              TECH_STACK
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: "React", icon: <Braces className="h-6 w-6" />, color: "text-blue-400" },
                { name: "Next.js", icon: <Zap className="h-6 w-6" />, color: "text-white" },
                { name: "TypeScript", icon: <Code className="h-6 w-6" />, color: "text-blue-500" },
                { name: "Node.js", icon: <Terminal className="h-6 w-6" />, color: "text-green-400" },
                { name: "GraphQL", icon: <Database className="h-6 w-6" />, color: "text-pink-400" },
                { name: "AWS", icon: <Cloud className="h-6 w-6" />, color: "text-orange-400" },
                { name: "MongoDB", icon: <Database className="h-6 w-6" />, color: "text-green-500" },
                { name: "Docker", icon: <Box className="h-6 w-6" />, color: "text-blue-400" },
                { name: "Python", icon: <Code className="h-6 w-6" />, color: "text-yellow-400" },
                { name: "Tailwind", icon: <PenTool className="h-6 w-6" />, color: "text-teal-400" },
                { name: "Firebase", icon: <Flame className="h-6 w-6" />, color: "text-orange-500" },
                { name: "Redux", icon: <Cpu className="h-6 w-6" />, color: "text-purple-400" },
              ].map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center p-4 rounded-lg bg-black/40 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-200"
                >
                  <div className={`mb-2 ${tech.color}`}>{tech.icon}</div>
                  <span className="text-sm font-mono text-gray-300">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
            <h2 className="text-3xl font-bold mb-8 text-emerald-400 font-mono text-center flex items-center justify-center">
              <Star className="mr-3 h-6 w-6" />
              CLIENT_FEEDBACK
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  quote: "CHEGEBB delivered our project with incredible attention to detail and security. Highly recommended for any cybersecurity needs.",
                  author: "REDACTED",
                  position: "CTO, Security Firm",
                  rating: 5
                },
                {
                  quote: "Working with Brian was a game-changer for our startup. His technical expertise is matched only by his reliability.",
                  author: "ENCRYPTED",
                  position: "Founder, Tech Startup",
                  rating: 5
                },
                {
                  quote: "Exceptional problem-solving skills and delivers ahead of schedule. A true asset to any development team.",
                  author: "ANONYMOUS",
                  position: "Project Manager",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-lg bg-gradient-to-br from-black/80 to-emerald-900/10 border border-emerald-500/10 relative"
                >
                  <div className="absolute -top-3 -right-3">
                    <motion.div 
                      className="w-6 h-6 rounded-full bg-emerald-500"
                      animate={{ 
                        boxShadow: ['0 0 0px rgba(16, 185, 129, 0.5)', '0 0 20px rgba(16, 185, 129, 0.5)', '0 0 0px rgba(16, 185, 129, 0.5)']
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  <div className="mb-4 flex">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300 mb-4 font-mono text-sm">"{testimonial.quote}"</p>
                  
                  <div>
                    <div className="font-bold text-emerald-400 font-mono">{testimonial.author}</div>
                    <div className="text-xs text-gray-500">{testimonial.position}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="glass-dark p-12 rounded-lg border border-emerald-400/20 max-w-4xl mx-auto relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 opacity-10"
              animate={{ 
                background: [
                  'radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
                  'radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.3) 0%, transparent 70%)'
                ]
              }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
            />
            
            <h2 className="text-4xl font-bold mb-6 text-gradient-emerald font-mono relative">
              READY_TO_BUILD_SOMETHING_AMAZING?
              <motion.span 
                className="absolute -inset-x-10 h-px bg-emerald-500/50"
                animate={{ y: [0, 40, 0], opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-mono">
              Let&apos;s turn your ideas into reality. Whether it&apos;s a web application, mobile app, or something completely
              innovative.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:chegephil24@gmail.com"
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-bold text-lg transition-all duration-300 font-mono hover:from-emerald-700 hover:to-teal-700"
                onMouseEnter={playHover}
                onClick={playClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                START_PROJECT
              </motion.a>
              <motion.a
                href="https://github.com/CHEGEBB"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 glass-emerald border-2 border-emerald-400/50 rounded-lg font-bold text-lg hover:border-emerald-400 transition-all duration-300 font-mono"
                onMouseEnter={playHover}
                onClick={playClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                VIEW_PORTFOLIO
              </motion.a>
            </div>
            
            <motion.div 
              className="mt-10 inline-flex items-center space-x-2 text-sm text-gray-500 cursor-pointer hover:text-emerald-400 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              onClick={playClick}
            >
              <Coffee className="h-4 w-4" />
              <span className="font-mono">Activate neural interface...</span>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-20 pb-10 text-center text-gray-500 font-mono text-sm"
        >
          <p>CHEGEBB © {new Date().getFullYear()} | All systems operational</p>
          <div className="mt-2 flex justify-center space-x-4">
            <motion.div 
              animate={{ 
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.05, 1]
              }} 
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-green-500"
            />
            <motion.div 
              animate={{ 
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.05, 1]
              }} 
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              className="h-2 w-2 rounded-full bg-blue-500"
            />
            <motion.div 
              animate={{ 
                opacity: [0.4, 1, 0.4],
                scale: [1, 1.05, 1]
              }} 
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              className="h-2 w-2 rounded-full bg-purple-500"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}