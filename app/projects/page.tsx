"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Github, X, Calendar, Users, Star, Code, Zap, Eye, Play } from "lucide-react"
import { MatrixRain } from "@/components/matrix-rain"
import { useAudio } from "@/components/audio-provider"

export default function ProjectsPage() {
  const { playHover, playClick } = useAudio()
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const projects = [
    {
      id: 1,
      title: "AI-Powered Code Assistant",
      description:
        "Revolutionary AI assistant that helps developers write better code with real-time suggestions and automated refactoring",
      longDescription:
        "This cutting-edge AI-powered code assistant leverages advanced machine learning algorithms to provide real-time code suggestions, automated refactoring, and intelligent error detection. Built with OpenAI's GPT models and integrated with popular IDEs, it has helped over 10,000 developers increase their productivity by 40%.",
      image: "/placeholder.svg?height=400&width=600",
      tech: ["OpenAI", "TypeScript", "React", "Node.js", "WebSockets", "Python", "Docker"],
      category: "AI/ML",
      github: "https://github.com",
      live: "https://example.com",
      color: "from-emerald-500 to-teal-600",
      status: "Production",
      year: "2024",
      duration: "6 months",
      team: "4 developers",
      features: [
        "Real-time code suggestions",
        "Automated refactoring",
        "Error detection and fixes",
        "Multi-language support",
        "IDE integration",
        "Performance analytics",
      ],
      metrics: {
        users: "10,000+",
        productivity: "+40%",
        errors: "-60%",
        satisfaction: "4.8/5",
      },
    },
    {
      id: 2,
      title: "Blockchain Voting System",
      description: "Secure, transparent voting platform built on blockchain technology with end-to-end encryption",
      longDescription:
        "A revolutionary blockchain-based voting system that ensures complete transparency and security in democratic processes. Using Ethereum smart contracts and IPFS for decentralized storage, this platform has been tested in multiple pilot programs with government organizations.",
      image: "/placeholder.svg?height=400&width=600",
      tech: ["Solidity", "Web3.js", "React", "IPFS", "MetaMask", "Ethereum", "Node.js"],
      category: "Blockchain",
      github: "https://github.com",
      live: "https://example.com",
      color: "from-blue-500 to-indigo-600",
      status: "Beta",
      year: "2023",
      duration: "8 months",
      team: "6 developers",
      features: [
        "Blockchain-based security",
        "End-to-end encryption",
        "Real-time vote counting",
        "Voter verification",
        "Audit trail",
        "Mobile compatibility",
      ],
      metrics: {
        transactions: "50,000+",
        security: "100%",
        uptime: "99.9%",
        cost: "-80%",
      },
    },
    {
      id: 3,
      title: "Real-time Collaboration Platform",
      description: "Multi-user collaborative workspace with real-time editing, video calls, and project management",
      longDescription:
        "A comprehensive collaboration platform that combines real-time document editing, video conferencing, and project management tools. Built with WebRTC and Socket.io, it supports thousands of concurrent users and has been adopted by over 500 companies worldwide.",
      image: "/placeholder.svg?height=400&width=600",
      tech: ["Socket.io", "WebRTC", "React", "Express", "Redis", "MongoDB", "AWS"],
      category: "Full Stack",
      github: "https://github.com",
      live: "https://example.com",
      color: "from-purple-500 to-pink-600",
      status: "Production",
      year: "2023",
      duration: "10 months",
      team: "8 developers",
      features: [
        "Real-time collaboration",
        "Video conferencing",
        "Project management",
        "File sharing",
        "Team chat",
        "Analytics dashboard",
      ],
      metrics: {
        companies: "500+",
        users: "25,000+",
        uptime: "99.8%",
        satisfaction: "4.7/5",
      },
    },
    {
      id: 4,
      title: "Neural Network Visualizer",
      description:
        "Interactive 3D visualization tool for understanding neural network architectures and training processes",
      longDescription:
        "An advanced 3D visualization platform that helps researchers and students understand complex neural network architectures. Using Three.js and WebGL, it provides real-time visualization of training processes, weight updates, and network performance metrics.",
      image: "/placeholder.svg?height=400&width=600",
      tech: ["Three.js", "WebGL", "Python", "TensorFlow", "React", "D3.js", "WebAssembly"],
      category: "AI/ML",
      github: "https://github.com",
      live: "https://example.com",
      color: "from-cyan-500 to-blue-600",
      status: "Production",
      year: "2024",
      duration: "5 months",
      team: "3 developers",
      features: [
        "3D network visualization",
        "Real-time training display",
        "Interactive exploration",
        "Performance metrics",
        "Export capabilities",
        "Educational mode",
      ],
      metrics: {
        universities: "50+",
        students: "15,000+",
        models: "1,000+",
        accuracy: "+25%",
      },
    },
    {
      id: 5,
      title: "Quantum Computing Simulator",
      description: "Web-based quantum computing simulator with visual circuit builder and quantum algorithm library",
      longDescription:
        "A comprehensive quantum computing simulator that runs entirely in the browser. Features a drag-and-drop circuit builder, quantum algorithm library, and real-time state visualization. Used by quantum computing researchers and students worldwide.",
      image: "/placeholder.svg?height=400&width=600",
      tech: ["WebAssembly", "Rust", "React", "Three.js", "Web Workers", "TypeScript"],
      category: "Quantum",
      github: "https://github.com",
      live: "https://example.com",
      color: "from-indigo-500 to-purple-600",
      status: "Beta",
      year: "2024",
      duration: "7 months",
      team: "5 developers",
      features: [
        "Visual circuit builder",
        "Quantum algorithm library",
        "State visualization",
        "Performance simulation",
        "Educational resources",
        "Research tools",
      ],
      metrics: {
        researchers: "2,000+",
        circuits: "10,000+",
        algorithms: "50+",
        performance: "Native speed",
      },
    },
    {
      id: 6,
      title: "Cybersecurity Training Platform",
      description: "Gamified cybersecurity training platform with hands-on labs and real-world scenarios",
      longDescription:
        "An immersive cybersecurity training platform that combines gamification with hands-on learning. Features virtual labs, capture-the-flag challenges, and real-world attack simulations. Used by cybersecurity professionals and students for skill development.",
      image: "/placeholder.svg?height=400&width=600",
      tech: ["Docker", "Kubernetes", "React", "Node.js", "Python", "Linux", "AWS"],
      category: "Security",
      github: "https://github.com",
      live: "https://example.com",
      color: "from-red-500 to-orange-600",
      status: "Production",
      year: "2023",
      duration: "12 months",
      team: "10 developers",
      features: [
        "Virtual labs",
        "CTF challenges",
        "Attack simulations",
        "Progress tracking",
        "Certification paths",
        "Team competitions",
      ],
      metrics: {
        professionals: "5,000+",
        labs: "200+",
        completion: "85%",
        certification: "3,000+",
      },
    },
  ]

  const categories = [
    { name: "All", icon: Star, color: "from-emerald-500 to-teal-600" },
    { name: "AI/ML", icon: Eye, color: "from-purple-500 to-pink-600" },
    { name: "Blockchain", icon: Zap, color: "from-blue-500 to-indigo-600" },
    { name: "Full Stack", icon: Code, color: "from-green-500 to-emerald-600" },
    { name: "Quantum", icon: Zap, color: "from-indigo-500 to-purple-600" },
    { name: "Security", icon: Eye, color: "from-red-500 to-orange-600" },
  ]

  const filteredProjects = projects.filter((project) => {
    const matchesFilter = selectedFilter === "All" || project.category === selectedFilter
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tech.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

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
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 font-mono text-gradient-emerald gentle-glow">
            PROJECT_MATRIX
          </h1>
          <p className="text-xl text-emerald-300 max-w-3xl mx-auto font-mono">
            {">"} Exploring digital realities and innovative solutions...
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-80 pl-12 pr-4 py-4 glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 border border-emerald-400/20 font-mono"
                data-cursor="pointer"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedFilter(category.name)
                    playClick()
                  }}
                  onMouseEnter={playHover}
                  className={`group relative px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                    selectedFilter === category.name
                      ? "glass-emerald text-emerald-300 border-emerald-400/50"
                      : "glass-dark text-gray-300 hover:text-emerald-400 border-emerald-400/20"
                  } border font-mono`}
                  data-cursor="pointer"
                >
                  <div className="flex items-center space-x-2">
                    <category.icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </div>
                  {selectedFilter === category.name && (
                    <motion.div
                      layoutId="activeCategory"
                      className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-20 rounded-lg`}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFilter + searchTerm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50, rotateX: -30 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => {
                  setSelectedProject(project)
                  playClick()
                }}
                onMouseEnter={playHover}
                data-cursor="pointer"
              >
                <div className="glass-dark rounded-lg overflow-hidden border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500 h-full">
                  {/* Project Image */}
                  <div className="relative overflow-hidden h-48">
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20`} />
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 text-xs font-mono rounded-full border ${
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
                      <span className="px-3 py-1 text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-400/50 rounded-full">
                        {project.year}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        className="text-emerald-400 font-mono font-bold text-lg"
                      >
                        CLICK TO EXPLORE
                      </motion.div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">{project.description}</p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs font-mono glass-emerald text-emerald-300 rounded-full border border-emerald-400/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="px-3 py-1 text-xs font-mono bg-gray-500/20 text-gray-400 rounded-full">
                          +{project.tech.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{project.team}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{project.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="glass-dark p-12 rounded-lg border border-emerald-400/20">
              <h3 className="text-2xl font-bold text-emerald-400 mb-4 font-mono">NO_PROJECTS_FOUND</h3>
              <p className="text-gray-400 font-mono">Try adjusting your search criteria or filters.</p>
            </div>
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">PROJECT_METRICS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Projects Completed", value: "50+", icon: "🚀" },
              { label: "Technologies Used", value: "25+", icon: "⚡" },
              { label: "Years Experience", value: "5+", icon: "📅" },
              { label: "Happy Clients", value: "100+", icon: "⭐" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="glass-dark p-6 rounded-lg border border-emerald-400/20 text-center"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-emerald-400 mb-2 font-mono">{stat.value}</div>
                <div className="text-sm text-gray-300 font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateX: -30 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateX: 30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="glass-dark rounded-lg border border-emerald-400/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-8 border-b border-emerald-400/20">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 glass-dark rounded-lg border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300"
                  data-cursor="pointer"
                >
                  <X className="w-5 h-5 text-emerald-400" />
                </button>

                <div className="flex items-start space-x-6">
                  <div
                    className={`w-20 h-20 rounded-lg bg-gradient-to-br ${selectedProject.color} p-4 flex items-center justify-center`}
                  >
                    <Code className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-2 font-mono">{selectedProject.title}</h2>
                    <p className="text-emerald-400 font-mono mb-4">
                      {selectedProject.category} • {selectedProject.year}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 font-mono">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{selectedProject.team}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{selectedProject.duration}</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full border ${
                          selectedProject.status === "Production"
                            ? "bg-green-500/20 text-green-400 border-green-400/50"
                            : "bg-blue-500/20 text-blue-400 border-blue-400/50"
                        }`}
                      >
                        {selectedProject.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-4 font-mono">PROJECT_OVERVIEW</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedProject.longDescription}</p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-4 font-mono">KEY_FEATURES</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedProject.features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-3 glass-dark rounded-lg border border-emerald-400/20"
                      >
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-4 font-mono">TECH_STACK</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tech.map((tech, index) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="px-4 py-2 glass-emerald text-emerald-300 rounded-lg border border-emerald-400/30 font-mono text-sm"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-4 font-mono">PROJECT_METRICS</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(selectedProject.metrics).map(([key, value], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="glass-dark p-4 rounded-lg border border-emerald-400/20 text-center"
                      >
                        <div className="text-2xl font-bold text-emerald-400 mb-1 font-mono">{value}</div>
                        <div className="text-xs text-gray-400 font-mono uppercase">{key}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <motion.a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-3 glass-dark border border-emerald-400/30 rounded-lg font-mono text-emerald-300 hover:border-emerald-400/50 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                    onMouseEnter={playHover}
                    onClick={playClick}
                    data-cursor="pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Github className="w-5 h-5" />
                    <span>VIEW_CODE</span>
                  </motion.a>
                  <motion.a
                    href={selectedProject.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-mono text-white hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center space-x-2"
                    onMouseEnter={playHover}
                    onClick={playClick}
                    data-cursor="pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-5 h-5" />
                    <span>LIVE_DEMO</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
