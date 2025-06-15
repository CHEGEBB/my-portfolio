"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Database, Globe, Smartphone, Server, Zap, Star, Code, Brain, Cpu, Eye } from "lucide-react"
import { useState } from "react"
import { MatrixRain } from "@/components/matrix-rain"
import { useAudio } from "@/components/audio-provider"

export default function SkillsPage() {
  const { playHover, playClick } = useAudio()
  const [selectedCategory, setSelectedCategory] = useState("All")

  const skillCategories = [
    { name: "All", icon: Star, color: "from-emerald-500 to-teal-600" },
    { name: "Frontend", icon: Globe, color: "from-blue-500 to-indigo-600" },
    { name: "Backend", icon: Server, color: "from-purple-500 to-pink-600" },
    { name: "Database", icon: Database, color: "from-green-500 to-emerald-600" },
    { name: "Mobile", icon: Smartphone, color: "from-orange-500 to-red-600" },
    { name: "DevOps", icon: Zap, color: "from-yellow-500 to-orange-600" },
  ]

  const skills = [
    // Frontend
    {
      name: "React",
      level: 95,
      category: "Frontend",
      icon: "⚛️",
      color: "text-blue-400",
      description: "Building dynamic UIs",
    },
    {
      name: "Next.js",
      level: 90,
      category: "Frontend",
      icon: "▲",
      color: "text-white",
      description: "Full-stack React framework",
    },
    {
      name: "TypeScript",
      level: 88,
      category: "Frontend",
      icon: "TS",
      color: "text-blue-500",
      description: "Type-safe JavaScript",
    },
    {
      name: "Vue.js",
      level: 85,
      category: "Frontend",
      icon: "🟢",
      color: "text-green-500",
      description: "Progressive framework",
    },
    {
      name: "Tailwind CSS",
      level: 92,
      category: "Frontend",
      icon: "🎨",
      color: "text-cyan-400",
      description: "Utility-first CSS",
    },
    {
      name: "Three.js",
      level: 80,
      category: "Frontend",
      icon: "🎮",
      color: "text-purple-400",
      description: "3D graphics library",
    },

    // Backend
    {
      name: "Node.js",
      level: 93,
      category: "Backend",
      icon: "🟢",
      color: "text-green-500",
      description: "JavaScript runtime",
    },
    {
      name: "Python",
      level: 87,
      category: "Backend",
      icon: "🐍",
      color: "text-yellow-400",
      description: "Versatile programming",
    },
    {
      name: "Express.js",
      level: 90,
      category: "Backend",
      icon: "🚀",
      color: "text-gray-400",
      description: "Web framework",
    },
    {
      name: "GraphQL",
      level: 85,
      category: "Backend",
      icon: "◈",
      color: "text-pink-400",
      description: "Query language",
    },
    {
      name: "REST APIs",
      level: 95,
      category: "Backend",
      icon: "🔗",
      color: "text-blue-400",
      description: "API architecture",
    },

    // Database
    {
      name: "MongoDB",
      level: 90,
      category: "Database",
      icon: "🍃",
      color: "text-green-400",
      description: "NoSQL database",
    },
    {
      name: "PostgreSQL",
      level: 88,
      category: "Database",
      icon: "🐘",
      color: "text-blue-600",
      description: "Relational database",
    },
    {
      name: "Redis",
      level: 82,
      category: "Database",
      icon: "🔴",
      color: "text-red-500",
      description: "In-memory store",
    },
    {
      name: "Firebase",
      level: 85,
      category: "Database",
      icon: "🔥",
      color: "text-orange-400",
      description: "Backend-as-a-Service",
    },

    // Mobile
    {
      name: "React Native",
      level: 87,
      category: "Mobile",
      icon: "📱",
      color: "text-blue-400",
      description: "Cross-platform apps",
    },
    {
      name: "Flutter",
      level: 75,
      category: "Mobile",
      icon: "🦋",
      color: "text-blue-500",
      description: "Google's UI toolkit",
    },
    {
      name: "Expo",
      level: 85,
      category: "Mobile",
      icon: "⚡",
      color: "text-purple-400",
      description: "React Native platform",
    },

    // DevOps
    {
      name: "Docker",
      level: 85,
      category: "DevOps",
      icon: "🐳",
      color: "text-blue-400",
      description: "Containerization",
    },
    { name: "AWS", level: 80, category: "DevOps", icon: "☁️", color: "text-orange-400", description: "Cloud services" },
    {
      name: "Kubernetes",
      level: 75,
      category: "DevOps",
      icon: "⚙️",
      color: "text-blue-600",
      description: "Container orchestration",
    },
    {
      name: "CI/CD",
      level: 88,
      category: "DevOps",
      icon: "🔄",
      color: "text-green-500",
      description: "Automated deployment",
    },
  ]

  const filteredSkills =
    selectedCategory === "All" ? skills : skills.filter((skill) => skill.category === selectedCategory)

  const certifications = [
    { name: "AWS Certified Developer", issuer: "Amazon", year: "2023", icon: "☁️" },
    { name: "React Professional", issuer: "Meta", year: "2023", icon: "⚛️" },
    { name: "Node.js Certified", issuer: "OpenJS Foundation", year: "2022", icon: "🟢" },
    { name: "MongoDB Associate", issuer: "MongoDB Inc.", year: "2022", icon: "🍃" },
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
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 font-mono text-gradient-emerald gentle-glow">
            SKILL_MATRIX
          </h1>
          <p className="text-xl text-emerald-300 max-w-3xl mx-auto font-mono">
            {">"} Analyzing neural pathways and technical capabilities...
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {skillCategories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => {
                  setSelectedCategory(category.name)
                  playClick()
                }}
                onMouseEnter={playHover}
                className={`group relative px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "glass-emerald text-emerald-300 border-emerald-400/50"
                    : "glass-dark text-gray-300 hover:text-emerald-400 border-emerald-400/20"
                } border`}
                data-cursor="pointer"
              >
                <div className="flex items-center space-x-2">
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

        {/* Skills Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          >
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 50, rotateX: -30 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group skill-item"
                onMouseEnter={playHover}
                data-cursor="pointer"
              >
                <div className="glass-dark p-6 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500 h-full">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`text-3xl ${skill.color}`}>{skill.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                        {skill.name}
                      </h3>
                      <p className="text-sm text-gray-400">{skill.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400 font-mono">Proficiency</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Skill Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">PERFORMANCE_METRICS</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Brain, label: "Technologies Mastered", value: "20+", color: "text-emerald-400" },
              { icon: Code, label: "Years of Experience", value: "5+", color: "text-blue-400" },
              { icon: Cpu, label: "Projects Completed", value: "50+", color: "text-purple-400" },
              { icon: Eye, label: "Lines of Code", value: "500K+", color: "text-cyan-400" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-dark p-6 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300 text-center"
              >
                <stat.icon className={`w-12 h-12 ${stat.color} mx-auto mb-4`} />
                <div className={`text-3xl font-black mb-2 ${stat.color} gentle-glow font-mono`}>{stat.value}</div>
                <div className="text-sm text-gray-300 font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">CERTIFICATIONS</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 50, rotateY: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, rotateY: 5 }}
                className="glass-dark p-6 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500 text-center"
              >
                <div className="text-4xl mb-4">{cert.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2 font-mono">{cert.name}</h3>
                <p className="text-sm text-gray-400 mb-1">{cert.issuer}</p>
                <p className="text-xs text-emerald-400 font-mono">{cert.year}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Path */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">LEARNING_PATH</h2>
          <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-emerald-400 mb-4 font-mono">CURRENTLY_LEARNING</h3>
                <div className="space-y-3">
                  {["Rust", "WebAssembly", "Machine Learning", "Blockchain"].map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="px-4 py-2 glass-emerald rounded-lg text-sm font-mono"
                    >
                      {tech}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-blue-400 mb-4 font-mono">NEXT_TARGETS</h3>
                <div className="space-y-3">
                  {["Go", "Kubernetes", "GraphQL", "AR/VR"].map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-sm font-mono"
                    >
                      {tech}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-purple-400 mb-4 font-mono">FUTURE_VISION</h3>
                <div className="space-y-3">
                  {["Quantum Computing", "Neural Networks", "Space Tech", "Biotech"].map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-lg text-sm font-mono"
                    >
                      {tech}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
