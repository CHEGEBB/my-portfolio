"use client"

import { motion } from "framer-motion"
import { Code, Coffee, Gamepad2, Music, Brain, Zap, User, Calendar, MapPin, Award } from "lucide-react"
import { TerminalComponent } from "@/components/terminal"
import { Timeline } from "@/components/timeline"
import { MatrixRain } from "@/components/matrix-rain"
import { useAudio } from "@/components/audio-provider"

export default function AboutPage() {
  const { playHover } = useAudio()

  const interests = [
    {
      icon: Code,
      title: "Clean Code",
      description: "Writing maintainable and scalable code",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Coffee,
      title: "Coffee",
      description: "Fuel for late-night coding sessions",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Gamepad2,
      title: "Gaming",
      description: "Exploring virtual worlds and game mechanics",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: Music,
      title: "Music",
      description: "Creating ambient soundscapes while coding",
      color: "from-green-500 to-teal-600",
    },
    {
      icon: Brain,
      title: "AI/ML",
      description: "Exploring artificial intelligence frontiers",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Building tomorrow's technology today",
      color: "from-yellow-500 to-red-600",
    },
  ]

  const achievements = [
    { title: "50+ Projects", description: "Successfully delivered", icon: "🚀" },
    { title: "5+ Years", description: "Professional experience", icon: "⏰" },
    { title: "20+ Technologies", description: "Mastered and applied", icon: "🛠️" },
    { title: "100% Client", description: "Satisfaction rate", icon: "⭐" },
  ]

  const values = [
    { title: "Innovation", description: "Constantly pushing boundaries and exploring new possibilities", icon: "💡" },
    { title: "Quality", description: "Delivering excellence in every line of code", icon: "✨" },
    { title: "Collaboration", description: "Building amazing things together with great teams", icon: "🤝" },
    { title: "Growth", description: "Never stop learning and evolving", icon: "📈" },
  ]

  return (
    <div className="min-h-screen pt-20 px-4 relative overflow-hidden bg-slate-900">
      <MatrixRain />

      {/* Enhanced Background */}
      <div className="fixed inset-0 hero-bg z-0" />
      <div className="fixed inset-0 cyber-grid-subtle opacity-30 z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 font-mono text-gradient-emerald gentle-glow">
            ABOUT_ME.EXE
          </h1>
          <p className="text-xl text-emerald-300 max-w-3xl mx-auto font-mono">
            {">"} Decoding the human behind the code...
          </p>
        </motion.div>

        {/* Interactive Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <TerminalComponent />
        </motion.div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6 text-emerald-400 font-mono">NEURAL_PROFILE</h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  I'm a passionate full-stack developer who transforms complex problems into elegant digital solutions.
                  My journey began 5 years ago with a simple "Hello World" and has evolved into architecting scalable
                  applications that impact thousands of users.
                </p>
                <p>
                  Specializing in modern web technologies, I bridge the gap between cutting-edge innovation and
                  practical business solutions. Whether it's building responsive frontends, robust APIs, or optimizing
                  database performance, I approach each challenge with curiosity and precision.
                </p>
                <p>
                  When I'm not immersed in code, you'll find me exploring the latest in AI/ML, contributing to
                  open-source projects, or sharing knowledge with the developer community through mentoring and
                  technical writing.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
                <h3 className="text-2xl font-bold mb-6 text-emerald-400 font-mono">SYSTEM_INFO</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-300">Brian Chege (CHEGEBB)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-300">Nairobi, Kenya</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-300">5+ Years Experience</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-300">Full Stack Architect</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                    className="glass-dark p-4 rounded-lg border border-emerald-400/20 text-center"
                  >
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <div className="text-lg font-bold text-emerald-400 font-mono">{achievement.title}</div>
                    <div className="text-sm text-gray-400">{achievement.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Interests & Hobbies */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">PASSION_MODULES</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.title}
                initial={{ opacity: 0, y: 50, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, rotateY: 5 }}
                className="group"
                onMouseEnter={playHover}
                data-cursor="pointer"
              >
                <div className="glass-dark p-6 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500 h-full">
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br ${interest.color} p-4 mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <interest.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                    {interest.title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{interest.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">CORE_VALUES</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="glass-dark p-8 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{value.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-emerald-400 font-mono">{value.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">JOURNEY_LOG</h2>
          <Timeline />
        </motion.div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-black mb-12 text-center text-emerald-400 font-mono">FUN_FACTS</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { fact: "I debug with rubber ducks", icon: "🦆" },
              { fact: "Coffee-to-code ratio: 1:∞", icon: "☕" },
              { fact: "I dream in TypeScript", icon: "💭" },
              { fact: "Stack Overflow reputation: 9000+", icon: "📚" },
              { fact: "Favorite HTTP status: 418", icon: "🫖" },
              { fact: "I speak fluent binary", icon: "01" },
            ].map((item, index) => (
              <motion.div
                key={item.fact}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="glass-dark p-6 rounded-lg border border-emerald-400/20 text-center"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-gray-300 font-mono text-sm">{item.fact}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
