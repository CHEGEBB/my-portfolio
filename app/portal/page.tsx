"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Portal3D } from "@/components/portal-3d"
import {
  Terminal,
  Github,
  Target,
  MapPin,
  Clock,
  Play,
  Plus,
  Check,
  X,
  RotateCcw,
  Pause,
  Star,
  GitFork,
  Calendar,
  Award,
  GitCommit,
  Activity,
  Cpu,
  HardDrive,
  Network,
  Music,
  Code2,
  Zap,
  Globe,
  Rocket,
  BookOpen,
} from "lucide-react"

export default function FuturisticPortal() {
  // Minimal Matrix Rain - Much Less Intrusive
  const MatrixRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const resizeCanvas = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }

      resizeCanvas()
      window.addEventListener("resize", resizeCanvas)

      const chars = "01"
      const fontSize = 12
      const columns = Math.floor(canvas.width / fontSize)
      const drops: number[] = new Array(Math.floor(columns / 4)).fill(1) // Much fewer columns

      const draw = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = "rgba(16, 185, 129, 0.3)" // Much more transparent
        ctx.font = `${fontSize}px monospace`

        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)]
          ctx.fillText(text, i * fontSize * 4, drops[i] * fontSize) // More spacing

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.99) {
            drops[i] = 0
          }
          drops[i]++
        }
      }

      const interval = setInterval(draw, 100) // Slower animation

      return () => {
        clearInterval(interval)
        window.removeEventListener("resize", resizeCanvas)
      }
    }, [])

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-20" style={{ pointerEvents: "none" }} />
  }

  // State
  const [portalActive, setPortalActive] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [githubUser, setGithubUser] = useState<any>(null)
  const [githubRepos, setGithubRepos] = useState<any[]>([])
  const [githubEvents, setGithubEvents] = useState<any[]>([])
  const [weatherData, setWeatherData] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState<string>("")
  const [mounted, setMounted] = useState(false)
  const [todos, setTodos] = useState<Array<{ id: number; text: string; completed: boolean }>>([])
  const [newTodo, setNewTodo] = useState("")
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
  const [pomodoroActive, setPomodoroActive] = useState(false)
  const [quotes, setQuotes] = useState<string[]>([])
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [systemStats, setSystemStats] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
    processes: 0,
  })

  // Terminal commands
  const commands = {
    help: "Available commands: help, clear, github, spotify, weather, hack, matrix, status, whoami, ls, pwd, date, portal, stats",
    clear: "",
    github: "🔗 Fetching real GitHub data from CHEGEBB...",
    spotify: "🎵 Connecting to Spotify...",
    weather: "🌤️ Getting weather data...",
    hack: "🔓 Initiating hack sequence... Access granted to mainframe",
    matrix: "💊 Wake up, Neo... The Matrix has you",
    status: "✅ All systems operational | Uptime: 99.9%",
    whoami: "👨‍💻 CHEGEBB - Digital Architect & Code Wizard",
    ls: "📁 projects/ docs/ scripts/ .secrets/ quantum_algorithms/",
    pwd: "📍 /home/chegebb/nexus-portal",
    date: new Date().toLocaleString(),
    portal: "🌀 Portal status: " + (portalActive ? "QUANTUM ACTIVE" : "STANDBY MODE"),
    stats: "📊 Fetching real-time system statistics...",
  }

  // Auto-typing function
  const typeText = async (text: string) => {
    setIsTyping(true)
    setTerminalOutput((prev) => [...prev, ""])

    for (let i = 0; i <= text.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 25))
      setTerminalOutput((prev) => [...prev.slice(0, -1), text.slice(0, i)])
    }
    setIsTyping(false)
  }

  // Effects
  useEffect(() => {
    setMounted(true)

    // Auto-typing intro
    const intro = [
      "🌟 NEXUS PORTAL SYSTEM v4.2.0 INITIALIZED",
      "🔄 Quantum interface loading...",
      "🔗 Secure connection established to mainframe",
      "🧬 Digital DNA sequencing complete",
      "💡 Type 'help' for available commands",
      "🚀 Welcome to the digital dimension, CHEGEBB",
      "",
    ]

    let delay = 0
    intro.forEach((line) => {
      setTimeout(() => {
        typeText(line)
      }, delay)
      delay += 800
    })

    // Fetch REAL GitHub data
    const fetchRealGitHubData = async () => {
      try {
        console.log("Fetching real GitHub data for CHEGEBB...")

        // User Info
        const userResponse = await fetch("https://api.github.com/users/CHEGEBB")
        if (!userResponse.ok) throw new Error("User fetch failed")
        const userData = await userResponse.json()
        console.log("GitHub User:", userData)
        setGithubUser(userData)

        // All Repos
        const reposResponse = await fetch("https://api.github.com/users/CHEGEBB/repos?per_page=100&sort=updated")
        if (!reposResponse.ok) throw new Error("Repos fetch failed")
        const reposData = await reposResponse.json()
        console.log("GitHub Repos:", reposData.length)

        // Sort by stars (most starred first)
        const sortedRepos = reposData
          .filter((repo: any) => !repo.fork) // Exclude forks
          .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
        setGithubRepos(sortedRepos)

        // Recent Activity
        const eventsResponse = await fetch("https://api.github.com/users/CHEGEBB/events?per_page=100")
        if (!eventsResponse.ok) throw new Error("Events fetch failed")
        const eventsData = await eventsResponse.json()
        console.log("GitHub Events:", eventsData.length)
        setGithubEvents(eventsData)

        console.log("All GitHub data fetched successfully!")
      } catch (error) {
        console.error("GitHub API error:", error)
        typeText("❌ GitHub API rate limit or network error. Using demo data...")
      }
    }

    fetchRealGitHubData()

    // Auto-load quotes from API
    const fetchQuotes = async () => {
      try {
        const quotePromises = Array.from({ length: 10 }, () =>
          fetch("https://api.quotable.io/random?tags=technology,inspirational,motivational,success").then((res) =>
            res.json(),
          ),
        )
        const quotesData = await Promise.all(quotePromises)
        const formattedQuotes = quotesData.map((q) => `"${q.content}" - ${q.author}`)
        setQuotes(formattedQuotes)
      } catch (error) {
        console.error("Quotes API error:", error)
        setQuotes([
          '"The best way to predict the future is to invent it." - Alan Kay',
          '"Code is poetry written in logic." - Anonymous',
          '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler',
          '"First, solve the problem. Then, write the code." - John Johnson',
          '"Experience is the name everyone gives to their mistakes." - Oscar Wilde',
        ])
      }
    }

    fetchQuotes()

    // Get weather
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=aaf06191d54d5d7adcf736c7380775ce`,
        )
          .then((res) => res.json())
          .then((data) => setWeatherData(data))
          .catch((err) => console.error("Weather API error:", err))
      })
    }

    // Clock and system stats
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString("en-US", { hour12: false }))
    }

    updateTime()
    const timer = setInterval(() => {
      updateTime()
      setSystemStats({
        cpu: Math.floor(Math.random() * 30) + 70,
        memory: Math.floor(Math.random() * 20) + 60,
        network: Math.floor(Math.random() * 40) + 50,
        processes: Math.floor(Math.random() * 50) + 120,
      })
    }, 1000)

    // Auto-rotate quotes
    const quoteTimer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 8000)

    // Pomodoro timer
    let pomodoroInterval: NodeJS.Timeout | null = null
    if (pomodoroActive && pomodoroTime > 0) {
      pomodoroInterval = setInterval(() => {
        setPomodoroTime((time) => time - 1)
      }, 1000)
    } else if (pomodoroTime === 0) {
      setPomodoroActive(false)
      setPomodoroTime(25 * 60)
    }

    return () => {
      clearInterval(timer)
      clearInterval(quoteTimer)
      if (pomodoroInterval) clearInterval(pomodoroInterval)
    }
  }, [pomodoroActive, pomodoroTime, quotes.length])

  // Terminal functions
  const executeCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim()

    if (command === "clear") {
      setTerminalOutput([])
      return
    }

    setTerminalOutput((prev) => [...prev, `$ ${cmd}`])

    if (commands[command as keyof typeof commands]) {
      const response = commands[command as keyof typeof commands]
      if (response) {
        typeText(response)
      }
    } else {
      typeText(`❌ Command not found: ${cmd}. Type 'help' for available commands.`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isTyping) {
      executeCommand(currentInput)
      setCurrentInput("")
    }
  }

  // Utility functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const activatePortal = () => {
    setPortalActive(!portalActive)
    if (!portalActive) {
      typeText("🌀 PORTAL ACTIVATED! Quantum dimensions unlocked... Reality matrix altered...")
    } else {
      typeText("🔒 Portal deactivated. Returning to base reality... Quantum field stabilized.")
    }
  }

  // Calculate REAL GitHub stats
  const calculateRealGitHubStats = () => {
    if (!githubUser || !githubRepos.length || !githubEvents.length) return null

    const totalStars = githubRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const totalForks = githubRepos.reduce((sum, repo) => sum + repo.forks_count, 0)
    const totalWatchers = githubRepos.reduce((sum, repo) => sum + repo.watchers_count, 0)
    const pushEvents = githubEvents.filter((event) => event.type === "PushEvent")
    const totalCommits = pushEvents.reduce((sum, event) => sum + (event.payload?.commits?.length || 0), 0)
    const languages = [...new Set(githubRepos.map((repo) => repo.language).filter(Boolean))]

    // Real grade calculation based on actual metrics
    let grade = "D"
    const score = totalStars * 3 + totalCommits * 0.5 + githubUser.followers * 2 + githubUser.public_repos * 0.8
    if (score >= 1000) grade = "A+"
    else if (score >= 500) grade = "A"
    else if (score >= 250) grade = "B+"
    else if (score >= 100) grade = "B"
    else if (score >= 50) grade = "C"

    return {
      totalStars,
      totalForks,
      totalWatchers,
      totalCommits,
      pushEvents: pushEvents.length,
      grade,
      totalRepos: githubUser.public_repos,
      followers: githubUser.followers,
      following: githubUser.following,
      languages: languages.length,
      score: Math.round(score),
    }
  }

  const realStats = calculateRealGitHubStats()

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen relative">
      {/* FIXED BACKGROUND IMAGE */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "url('/assets/code2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Gradient Overlay - Doesnt destroy the background */}
      <div
        className={`fixed inset-0 z-10 transition-all duration-1000 ${
          portalActive
            ? "bg-gradient-to-br from-emerald-900/60 via-cyan-950/40 to-teal-900/60"
            : "bg-gradient-to-br from-black/50 via-emerald-950/30 to-black/50"
        }`}
      />

      {/* Minimal Matrix Rain */}
      <MatrixRain />

      {/* Subtle Cyber Grid */}
      <div
        className="fixed inset-0 opacity-5 z-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content that scrolls over the fixed background */}
      <div className="relative z-30 min-h-screen">
        {/* Navigation Space */}
        <div className="h-20"></div>

        {/* Hero Section - Content moves over fixed background */}
        <div className="relative py-20 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center px-6"
          >
            <h1
              className="text-5xl md:text-7xl font-black mb-8 font-mono bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent"
              style={{
                textShadow: "0 0 30px rgba(16, 185, 129, 0.5)",
              }}
            >
              NEXUS_PORTAL
            </h1>
            <motion.p
              className="text-xl font-mono max-w-3xl mx-auto text-emerald-300 mb-10"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              {">"} Digital architect&apos;s command center where code becomes reality and data flows like poetry...
            </motion.p>

            {/* Auto-rotating quotes */}
            {quotes.length > 0 && (
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-black/30 backdrop-blur-md border border-emerald-500/30 rounded-lg p-8 max-w-3xl mx-auto mb-12"
              >
                <div className="text-emerald-400 font-mono text-xl italic">{quotes[currentQuoteIndex]}</div>
              </motion.div>
            )}

            {/* Portal */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative">
                <Portal3D isActive={portalActive} />

                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  <motion.button
                    onClick={activatePortal}
                    className={`px-8 py-4 rounded-full font-mono font-bold transition-all duration-300 flex items-center space-x-3 group ${
                      portalActive
                        ? "bg-gradient-to-r from-cyan-600/80 to-teal-600/80 text-white border-2 border-cyan-400 shadow-lg shadow-cyan-400/50"
                        : "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-md text-emerald-300 hover:text-white border-2 border-emerald-400/50 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-400/30"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="text-lg">{portalActive ? "DEACTIVATE PORTAL" : "ACTIVATE PORTAL"}</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Main Content - Scrolls over fixed background */}
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Terminal Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/30 backdrop-blur-md border border-emerald-400/30 rounded-lg p-8"
          >
            <div className="flex items-center mb-6">
              <Terminal className="w-8 h-8 mr-4 text-emerald-400" />
              <h2 className="text-2xl font-bold font-mono text-emerald-400">QUANTUM_TERMINAL</h2>
            </div>

            <div className="h-80 bg-black/60 rounded border border-emerald-500/30 p-6 font-mono text-sm overflow-y-auto">
              <div className="flex items-center mb-4 pb-2 border-b border-emerald-500/20">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="ml-4 text-emerald-400">chegebb@nexus-portal:~$</div>
              </div>

              <div className="space-y-1 mb-4">
                {terminalOutput.map((line, index) => (
                  <div
                    key={index}
                    className={`${
                      line.startsWith("$")
                        ? "text-cyan-400"
                        : line.startsWith("🔗") ||
                            line.startsWith("🎵") ||
                            line.startsWith("🌤️") ||
                            line.startsWith("📊")
                          ? "text-yellow-400"
                          : line.startsWith("❌")
                            ? "text-red-400"
                            : "text-emerald-400"
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>

              <div className="flex items-center text-cyan-400">
                <span>$ </span>
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                  className="bg-transparent outline-none flex-1 ml-2 text-emerald-400"
                  placeholder="Enter command..."
                  autoFocus
                />
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  className="text-emerald-400"
                >
                  ▋
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* GitHub Section - REAL DATA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/30 backdrop-blur-md border border-emerald-400/30 rounded-lg p-8"
          >
            <div className="flex items-center mb-6">
              <Github className="w-8 h-8 mr-4 text-emerald-400" />
              <h2 className="text-2xl font-bold font-mono text-emerald-400">GITHUB_MATRIX</h2>
              {realStats && (
                <div className="ml-auto text-sm text-emerald-400 font-mono">
                  SCORE: {realStats.score} | GRADE: {realStats.grade}
                </div>
              )}
            </div>

            {githubUser && realStats ? (
              <div className="space-y-8">
                {/* User Profile */}
                <div className="flex items-center space-x-6">
                  <img
                    src={githubUser.avatar_url || "/placeholder.svg"}
                    alt={githubUser.name}
                    className="w-20 h-20 rounded-full border-4 border-emerald-400 shadow-lg shadow-emerald-400/30"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-white">{githubUser.name}</h3>
                    <p className="text-emerald-300 text-lg">@{githubUser.login}</p>
                    <p className="text-gray-400">{githubUser.bio}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="text-cyan-400">📍 {githubUser.location || "Digital Realm"}</span>
                      <span className="text-emerald-400">🔗 {githubUser.public_repos} repos</span>
                      <span className="text-teal-400">👥 {githubUser.followers} followers</span>
                    </div>
                  </div>
                </div>

                {/* Real Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-black/50 border border-emerald-600/30 rounded-lg p-6 text-center">
                    <Award className="w-8 h-8 mx-auto mb-3 text-emerald-400" />
                    <div className="text-3xl font-bold text-emerald-400">{realStats.grade}</div>
                    <div className="text-sm text-gray-400">Developer Grade</div>
                    <div className="text-xs text-gray-500 mt-1">Score: {realStats.score}</div>
                  </div>

                  <div className="bg-black/50 border border-cyan-600/30 rounded-lg p-6 text-center">
                    <Star className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                    <div className="text-3xl font-bold text-cyan-400">{realStats.totalStars}</div>
                    <div className="text-sm text-gray-400">Total Stars</div>
                    <div className="text-xs text-gray-500 mt-1">{realStats.totalWatchers} watchers</div>
                  </div>

                  <div className="bg-black/50 border border-teal-600/30 rounded-lg p-6 text-center">
                    <GitCommit className="w-8 h-8 mx-auto mb-3 text-teal-400" />
                    <div className="text-3xl font-bold text-teal-400">{realStats.totalCommits}</div>
                    <div className="text-sm text-gray-400">Total Commits</div>
                    <div className="text-xs text-gray-500 mt-1">{realStats.pushEvents} push events</div>
                  </div>

                  <div className="bg-black/50 border border-emerald-600/30 rounded-lg p-6 text-center">
                    <Code2 className="w-8 h-8 mx-auto mb-3 text-emerald-300" />
                    <div className="text-3xl font-bold text-emerald-300">{realStats.languages}</div>
                    <div className="text-sm text-gray-400">Languages</div>
                    <div className="text-xs text-gray-500 mt-1">{realStats.totalForks} forks</div>
                  </div>
                </div>

                {/* Most Starred Repositories */}
                <div>
                  <h3 className="text-xl font-mono mb-6 text-emerald-400">🌟 MOST STARRED REPOSITORIES</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {githubRepos.slice(0, 6).map((repo) => (
                      <motion.a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="bg-black/50 border border-emerald-600/30 hover:border-emerald-400 rounded-lg p-6 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-white font-mono font-bold group-hover:text-emerald-300 transition-colors">
                            {repo.name}
                          </h4>
                          <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">
                            {repo.language || "Text"}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{repo.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3" />
                              <span>{repo.stargazers_count}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <GitFork className="w-3 h-3" />
                              <span>{repo.forks_count}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                  <div className="text-emerald-400 font-mono">Fetching real GitHub data...</div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Multi-Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* System Monitor */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black/30 backdrop-blur-md border border-emerald-400/30 rounded-lg p-6"
            >
              <div className="flex items-center mb-4">
                <Activity className="w-6 h-6 mr-3 text-emerald-400" />
                <h3 className="text-xl font-bold font-mono text-emerald-400">SYSTEM_MONITOR</h3>
              </div>

              <div className="space-y-4">
                {[
                  { label: "CPU", value: systemStats.cpu, icon: Cpu, color: "emerald" },
                  { label: "Memory", value: systemStats.memory, icon: HardDrive, color: "cyan" },
                  { label: "Network", value: systemStats.network, icon: Network, color: "teal" },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                        <span className="text-gray-400 font-mono">{stat.label}</span>
                      </div>
                      <span className={`text-${stat.color}-400 font-mono font-bold`}>{stat.value}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <motion.div
                        className={`bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-400 h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-black/50 border border-emerald-600/30 rounded">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-400 font-mono">PROCESSES</span>
                    <span className="text-emerald-400 font-mono font-bold">{systemStats.processes}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Productivity Zone */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-black/30 backdrop-blur-md border border-emerald-400/30 rounded-lg p-6"
            >
              <div className="flex items-center mb-4">
                <Target className="w-6 h-6 mr-3 text-emerald-400" />
                <h3 className="text-xl font-bold font-mono text-emerald-400">PRODUCTIVITY</h3>
              </div>

              <div className="space-y-6">
                {/* Pomodoro Timer */}
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold mb-4 text-emerald-400">{formatTime(pomodoroTime)}</div>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => setPomodoroActive(!pomodoroActive)}
                      className="p-3 rounded border bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/50 text-emerald-400 transition-colors"
                    >
                      {pomodoroActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => {
                        setPomodoroActive(false)
                        setPomodoroTime(25 * 60)
                      }}
                      className="p-3 rounded border bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/50 text-emerald-400 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Quick Todo */}
                <div>
                  <h4 className="text-sm font-mono mb-3 text-emerald-400">TASK_QUEUE</h4>
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        newTodo.trim() &&
                        (setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]), setNewTodo(""))
                      }
                      placeholder="Add task..."
                      className="flex-1 bg-black/50 border border-emerald-600 focus:border-emerald-400 rounded px-3 py-2 text-white text-sm placeholder-gray-400 outline-none"
                    />
                    <button
                      onClick={() =>
                        newTodo.trim() &&
                        (setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]), setNewTodo(""))
                      }
                      className="p-2 rounded border bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/50 text-emerald-400"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {todos.slice(-5).map((todo) => (
                      <div key={todo.id} className="flex items-center space-x-2 text-sm">
                        <button
                          onClick={() =>
                            setTodos(todos.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t)))
                          }
                          className={`p-1 rounded ${
                            todo.completed ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <span className={`flex-1 ${todo.completed ? "line-through text-gray-500" : "text-white"}`}>
                          {todo.text}
                        </span>
                        <button
                          onClick={() => setTodos(todos.filter((t) => t.id !== todo.id))}
                          className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Weather & Time */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              {/* Weather */}
              <div className="bg-black/30 backdrop-blur-md border border-emerald-400/30 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 mr-3 text-emerald-400" />
                  <h3 className="text-xl font-bold font-mono text-emerald-400">WEATHER</h3>
                </div>

                {weatherData ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-400">{Math.round(weatherData.main.temp)}°C</div>
                      <div className="capitalize text-emerald-300">{weatherData.weather[0].description}</div>
                      <div className="font-mono text-cyan-400">{weatherData.name}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-cyan-400">{weatherData.main.humidity}%</div>
                        <div className="text-gray-300">Humidity</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-teal-400">{Math.round(weatherData.wind.speed)} m/s</div>
                        <div className="text-gray-300">Wind</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-2"></div>
                    <div className="text-sm text-emerald-400">Getting location...</div>
                  </div>
                )}
              </div>

              {/* Time */}
              <div className="bg-black/30 backdrop-blur-md border border-emerald-400/30 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 mr-3 text-emerald-400" />
                  <h3 className="text-xl font-bold font-mono text-emerald-400">TIME</h3>
                </div>

                <div className="text-center space-y-4">
                  <div className="text-3xl font-mono font-bold text-emerald-400" suppressHydrationWarning>
                    {currentTime}
                  </div>

                  <div className="text-cyan-300">
                    {mounted &&
                      new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/50 border border-emerald-600/30 rounded p-2">
                      <div className="font-mono text-emerald-400">UTC</div>
                      <div className="text-white font-mono">
                        {mounted && new Date().toLocaleTimeString("en-US", { timeZone: "UTC", hour12: false })}
                      </div>
                    </div>
                    <div className="bg-black/50 border border-emerald-600/30 rounded p-2">
                      <div className="font-mono text-cyan-400">TOKYO</div>
                      <div className="text-white font-mono">
                        {mounted && new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Tokyo", hour12: false })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-emerald-400">
                    <div className="w-2 h-2 rounded-full animate-pulse bg-emerald-500"></div>
                    <span className="text-xs font-mono">QUANTUM_SYNC_ACTIVE</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Spotify - SMALLER */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-black/30 backdrop-blur-md border border-emerald-400/30 rounded-lg p-4" // Reduced padding
            >
              <div className="flex items-center mb-3"> {/* Reduced margin */}
                <Music className="w-5 h-5 mr-2 text-emerald-400" /> {/* Smaller icon */}
                <h3 className="text-lg font-bold font-mono text-emerald-400">AUDIO_STREAM</h3> {/* Smaller text */}
              </div>

              <div className="text-center max-w-xs mx-auto"> {/* Added max-width and centered */}
                <a
                  href="https://spotify-github-profile.kittinanx.com/api/view?uid=31rgt7qptsff3ktwr52mccl5fpby&redirect=true"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://spotify-github-profile.kittinanx.com/api/view?uid=31rgt7qptsff3ktwr52mccl5fpby&cover_image=true&theme=default&show_offline=false&background_color=121212&interchange=false&bar_color_cover=true"
                    alt="Spotify Now Playing"
                    className="w-full rounded border border-emerald-400/20 hover:border-emerald-400 transition-all duration-300"
                  />
                </a>
              </div>
            </motion.div>

            {/* Quick Links - SMALLER */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-black/30 backdrop-blur-md border border-emerald-400/30 rounded-lg p-4" // Reduced padding
            >
              <div className="flex items-center mb-3"> {/* Reduced margin */}
                <Zap className="w-5 h-5 mr-2 text-emerald-400" /> {/* Smaller icon */}
                <h3 className="text-lg font-bold font-mono text-emerald-400">QUICK_LINKS</h3> {/* Smaller text */}
              </div>

              <div className="grid grid-cols-2 gap-3"> {/* Reduced gap */}
                {[
                  { name: "GitHub", icon: Github, url: "https://github.com/CHEGEBB", color: "emerald" },
                  { name: "Portfolio", icon: Globe, url: "#", color: "cyan" },
                  { name: "Deploy", icon: Rocket, url: "https://vercel.com", color: "teal" },
                  { name: "Docs", icon: BookOpen, url: "https://docs.github.com", color: "emerald" },
                ].map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -3 }}
                    className={`p-3 rounded border transition-all text-center group bg-${link.color}-500/10 border-${link.color}-400/30 hover:border-${link.color}-400 text-${link.color}-400`} // Reduced padding
                  >
                    <link.icon className="w-5 h-5 mx-auto mb-1 group-hover:scale-110 transition-transform" /> {/* Smaller icon and margin */}
                    <div className="text-xs font-mono">{link.name}</div> {/* Smaller text */}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Space */}
        <div className="h-20"></div>
      </div>
    </div>
  )
}