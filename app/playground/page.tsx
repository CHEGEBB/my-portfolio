"use client"

import { motion } from "framer-motion"
import { Cpu, Brain, Eye, Play, Lock } from "lucide-react"
import { useState } from "react"
import { MatrixRain } from "@/components/matrix-rain"
import { useAudio } from "@/components/audio-provider"

export default function PlaygroundPage() {
  const { playHover, playClick } = useAudio()
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Welcome to CHEGEBB Terminal v2.1.0",
    "Type 'help' for available commands",
    "$ ",
  ])
  const [gameScore, setGameScore] = useState(0)
  const [isHacking, setIsHacking] = useState(false)

  const hackingCommands = [
    "nmap -sS target.com",
    "sqlmap -u 'http://target.com/login' --dbs",
    "hydra -l admin -P passwords.txt ssh://target.com",
    "metasploit > use exploit/windows/smb/ms17_010_eternalblue",
    "john --wordlist=rockyou.txt hash.txt",
    "aircrack-ng -w wordlist.txt capture.cap",
    "nikto -h http://target.com",
    "gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt",
  ]

  const handleTerminalCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()
    let response = ""

    switch (cmd) {
      case "help":
        response = `Available commands:
- help: Show this help message
- hack: Start ethical hacking simulation
- scan: Perform network scan
- exploit: Run exploit framework
- crack: Password cracking simulation
- clear: Clear terminal
- whoami: Display user info
- ls: List files
- pwd: Show current directory`
        break
      case "hack":
        setIsHacking(true)
        response = "Initializing ethical hacking simulation..."
        setTimeout(() => {
          const randomCommand = hackingCommands[Math.floor(Math.random() * hackingCommands.length)]
          setTerminalHistory((prev) => [
            ...prev,
            `$ ${randomCommand}`,
            "Executing...",
            "✓ Command completed successfully",
          ])
        }, 2000)
        break
      case "scan":
        response = `Scanning network...
Host: 192.168.1.1 - OPEN
Port 22/tcp - SSH
Port 80/tcp - HTTP
Port 443/tcp - HTTPS
Scan completed.`
        break
      case "exploit":
        response = `Metasploit Framework initialized
msf6 > search type:exploit platform:linux
[+] Found 1337 exploits
[+] Use 'use exploit/path' to select`
        break
      case "crack":
        response = `John the Ripper v1.9.0
Loaded 1000 password hashes
Proceeding with wordlist attack...
[+] Password found: admin123`
        break
      case "clear":
        setTerminalHistory(["$ "])
        return
      case "whoami":
        response = "chegebb - Ethical Hacker & Full Stack Developer"
        break
      case "ls":
        response = `exploits/  tools/  wordlists/  scripts/  logs/`
        break
      case "pwd":
        response = "/home/chegebb/hacking-lab"
        break
      default:
        response = `Command not found: ${command}`
    }

    setTerminalHistory((prev) => [...prev, `$ ${command}`, response, "$ "])
  }

  const games = [
    {
      title: "Code Breaker",
      description: "Crack the encryption algorithm",
      icon: Lock,
      difficulty: "Hard",
      color: "from-red-500 to-pink-600",
      status: "ACTIVE",
    },
    {
      title: "Network Infiltrator",
      description: "Navigate through secure networks",
      icon: Cpu,
      difficulty: "Expert",
      color: "from-purple-500 to-indigo-600",
      status: "BETA",
    },
    {
      title: "SQL Injection Master",
      description: "Master database exploitation",
      icon: Brain,
      difficulty: "Medium",
      color: "from-blue-500 to-cyan-600",
      status: "ACTIVE",
    },
    {
      title: "Social Engineer",
      description: "Human psychology exploitation",
      icon: Eye,
      difficulty: "Hard",
      color: "from-green-500 to-teal-600",
      status: "COMING_SOON",
    },
  ]

  return (
    <div className="min-h-screen pt-20 px-4 relative overflow-hidden bg-slate-900">
      <MatrixRain />

      {/* Enhanced Background */}
      <div className="fixed inset-0 hero-bg z-0" />
      <div className="fixed inset-0 cyber-grid-subtle opacity-30 z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-black mb-8 text-gradient-emerald gentle-glow font-mono">THE_LAB</h1>
          <p className="text-xl text-cyan-300 font-mono max-w-3xl mx-auto">
            {">"} Where impossible ideas become interactive reality
          </p>
        </motion.div>

        {/* Interactive Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-gradient-emerald font-mono">HACKING_TERMINAL</h2>

          <div className="glass-dark p-6 rounded-lg border border-emerald-400/30 max-w-4xl mx-auto font-mono text-sm">
            {/* Terminal Header */}
            <div className="flex items-center mb-4 pb-4 border-b border-emerald-400/20">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div
                  className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-green-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <div className="ml-4 text-emerald-400">ethical-hacking-terminal v2.1.0</div>
            </div>

            {/* Terminal Content */}
            <div className="h-64 overflow-y-auto mb-4 space-y-1">
              {terminalHistory.map((line, index) => (
                <div
                  key={index}
                  className={`${
                    line.startsWith("$")
                      ? "text-emerald-400"
                      : line.includes("✓")
                        ? "text-green-400"
                        : line.includes("ERROR")
                          ? "text-red-400"
                          : "text-gray-300"
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>

            {/* Terminal Input */}
            <div className="flex items-center">
              <span className="text-emerald-400 mr-2">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleTerminalCommand(terminalInput)
                    setTerminalInput("")
                  }
                }}
                className="flex-1 bg-transparent text-white outline-none font-mono"
                placeholder="Enter command..."
                data-cursor="pointer"
              />
            </div>
          </div>
        </motion.div>

        {/* Hacking Games */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center text-gradient-emerald font-mono">HACKING_GAMES</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {games.map((game, index) => (
              <motion.div
                key={game.title}
                initial={{ opacity: 0, y: 50, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
                onMouseEnter={playHover}
                data-cursor="pointer"
              >
                <div className="glass-dark p-8 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <span
                      className={`px-3 py-1 text-xs font-mono rounded-full border ${
                        game.status === "ACTIVE"
                          ? "bg-green-500/20 text-green-400 border-green-400/50"
                          : game.status === "BETA"
                            ? "bg-blue-500/20 text-blue-400 border-blue-400/50"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-400/50"
                      }`}
                    >
                      {game.status}
                    </span>
                    <span className="px-3 py-1 text-xs font-mono bg-red-500/20 text-red-400 border border-red-400/50 rounded-full">
                      {game.difficulty}
                    </span>
                  </div>

                  {/* Game Icon */}
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br ${game.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <game.icon className="w-full h-full text-white" />
                  </div>

                  {/* Game Info */}
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                    {game.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">{game.description}</p>

                  {/* Play Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={playClick}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-lg font-mono text-emerald-300 hover:border-emerald-400/50 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                    data-cursor="pointer"
                    disabled={game.status === "COMING_SOON"}
                  >
                    <Play className="w-5 h-5" />
                    <span>{game.status === "COMING_SOON" ? "COMING SOON" : "LAUNCH GAME"}</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Code Playground */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-gradient-emerald font-mono">LIVE_CODE_MATRIX</h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Code Editor */}
            <div className="glass-dark rounded-lg border border-emerald-400/30 overflow-hidden">
              <div className="bg-gray-900/50 px-4 py-2 border-b border-emerald-400/20 flex items-center justify-between">
                <span className="text-emerald-400 font-mono text-sm">exploit.py</span>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="space-y-1">
                  <div>
                    <span className="text-purple-400">import</span> <span className="text-cyan-400">socket</span>
                  </div>
                  <div>
                    <span className="text-purple-400">import</span> <span className="text-cyan-400">sys</span>
                  </div>
                  <div className="text-gray-500"># Ethical hacking demonstration</div>
                  <div>
                    <span className="text-purple-400">def</span> <span className="text-yellow-400">port_scanner</span>
                    <span className="text-white">(target, port):</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-purple-400">try</span>
                    <span className="text-white">:</span>
                  </div>
                  <div className="ml-8">
                    <span className="text-cyan-400">sock</span> <span className="text-white">=</span>{" "}
                    <span className="text-cyan-400">socket</span>
                    <span className="text-white">.socket()</span>
                  </div>
                  <div className="ml-8">
                    <span className="text-cyan-400">result</span> <span className="text-white">=</span>{" "}
                    <span className="text-cyan-400">sock</span>
                    <span className="text-white">.connect_ex((target, port))</span>
                  </div>
                  <div className="ml-8">
                    <span className="text-purple-400">return</span> <span className="text-cyan-400">result</span>{" "}
                    <span className="text-white">==</span> <span className="text-green-400">0</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-purple-400">except</span>
                    <span className="text-white">:</span>
                  </div>
                  <div className="ml-8">
                    <span className="text-purple-400">return</span> <span className="text-red-400">False</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Terminal */}
            <div className="glass-dark rounded-lg border border-purple-400/30 overflow-hidden">
              <div className="bg-gray-900/50 px-4 py-2 border-b border-purple-400/20">
                <span className="text-purple-400 font-mono text-sm">output.terminal</span>
              </div>
              <div className="p-6 h-64 font-mono text-sm">
                <div className="space-y-2">
                  <div className="text-green-400">$ python exploit.py</div>
                  <div className="text-gray-300">Scanning target: 192.168.1.1</div>
                  <div className="text-green-400">Port 22: OPEN (SSH)</div>
                  <div className="text-green-400">Port 80: OPEN (HTTP)</div>
                  <div className="text-green-400">Port 443: OPEN (HTTPS)</div>
                  <div className="text-red-400">Port 21: CLOSED</div>
                  <div className="text-cyan-400">Scan completed successfully!</div>
                  <div className="text-yellow-400">⚠️ Remember: Only use on systems you own!</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ethical Hacking Resources */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center text-gradient-emerald font-mono">ETHICAL_RESOURCES</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Learning Path",
                items: ["Network Security", "Web App Security", "Cryptography", "Social Engineering"],
                color: "border-blue-400/30",
              },
              {
                title: "Tools & Frameworks",
                items: ["Metasploit", "Burp Suite", "Nmap", "Wireshark"],
                color: "border-purple-400/30",
              },
              {
                title: "Certifications",
                items: ["CEH", "OSCP", "CISSP", "Security+"],
                color: "border-emerald-400/30",
              },
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`glass-dark p-6 rounded-lg border ${section.color}`}
              >
                <h3 className="text-xl font-bold mb-4 text-emerald-400 font-mono">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={item} className="flex items-center space-x-2 text-gray-300">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
