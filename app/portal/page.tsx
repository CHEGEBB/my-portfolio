"use client"

import { motion } from "framer-motion"
import { Zap, Eye, Brain, Cpu, Play, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { MatrixRain } from "@/components/matrix-rain"
import { Portal3D } from "@/components/portal-3d"
import { useAudio } from "@/components/audio-provider"

export default function PortalPage() {
  const { playHover, playClick } = useAudio()
  const [portalActive, setPortalActive] = useState(false)
  const [currentDimension, setCurrentDimension] = useState(0)

  const dimensions = [
    {
      name: "Reality Alpha",
      description: "The dimension of infinite possibilities",
      color: "from-emerald-500 to-teal-600",
      particles: 1000,
      effect: "Matrix Rain",
    },
    {
      name: "Cyber Nexus",
      description: "Where code becomes consciousness",
      color: "from-blue-500 to-purple-600",
      particles: 1500,
      effect: "Neural Networks",
    },
    {
      name: "Quantum Realm",
      description: "Beyond the laws of physics",
      color: "from-purple-500 to-pink-600",
      particles: 2000,
      effect: "Quantum Entanglement",
    },
    {
      name: "Digital Void",
      description: "The space between spaces",
      color: "from-gray-500 to-black",
      particles: 500,
      effect: "Void Distortion",
    },
  ]

  const portalFeatures = [
    {
      title: "Dimensional Travel",
      description: "Navigate between parallel realities",
      icon: Zap,
      color: "text-yellow-400",
    },
    {
      title: "Reality Manipulation",
      description: "Bend the laws of digital physics",
      icon: Brain,
      color: "text-purple-400",
    },
    {
      title: "Consciousness Upload",
      description: "Merge with the digital realm",
      icon: Cpu,
      color: "text-blue-400",
    },
    {
      title: "Infinite Exploration",
      description: "Discover endless possibilities",
      icon: Eye,
      color: "text-emerald-400",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      if (portalActive) {
        setCurrentDimension((prev) => (prev + 1) % dimensions.length)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [portalActive, dimensions.length])

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
          <h1 className="text-6xl md:text-8xl font-black mb-8 text-gradient-emerald gentle-glow font-mono">
            PORTAL_GATEWAY
          </h1>
          <p className="text-xl text-cyan-300 font-mono max-w-3xl mx-auto">
            {">"} Enter the immersive dimension where reality meets imagination
          </p>
        </motion.div>

        {/* Main Portal */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="mb-20 flex justify-center"
        >
          <div className="relative">
            {/* Portal Container */}
            <div className="w-96 h-96 relative">
              {/* Outer Rings */}
              <div
                className={`absolute inset-0 rounded-full border-2 ${
                  portalActive ? "border-emerald-400/60" : "border-emerald-400/30"
                } animate-spin`}
                style={{ animationDuration: "20s" }}
              />
              <div
                className={`absolute inset-8 rounded-full border ${
                  portalActive ? "border-emerald-300/50" : "border-emerald-300/20"
                } animate-spin`}
                style={{ animationDuration: "15s", animationDirection: "reverse" }}
              />
              <div
                className={`absolute inset-16 rounded-full border ${
                  portalActive ? "border-emerald-200/40" : "border-emerald-200/10"
                } animate-spin`}
                style={{ animationDuration: "10s" }}
              />

              {/* 3D Portal Core */}
              <div className="absolute inset-20 rounded-full overflow-hidden">
                <Portal3D />
              </div>

              {/* Portal Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: portalActive
                    ? [
                        "0 0 50px rgba(16, 185, 129, 0.5), inset 0 0 50px rgba(16, 185, 129, 0.2)",
                        "0 0 100px rgba(16, 185, 129, 0.7), inset 0 0 100px rgba(16, 185, 129, 0.3)",
                        "0 0 50px rgba(16, 185, 129, 0.5), inset 0 0 50px rgba(16, 185, 129, 0.2)",
                      ]
                    : [
                        "0 0 30px rgba(16, 185, 129, 0.3), inset 0 0 30px rgba(16, 185, 129, 0.1)",
                        "0 0 50px rgba(16, 185, 129, 0.4), inset 0 0 50px rgba(16, 185, 129, 0.2)",
                        "0 0 30px rgba(16, 185, 129, 0.3), inset 0 0 30px rgba(16, 185, 129, 0.1)",
                      ],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />

              {/* Activation Button */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <motion.button
                  onClick={() => {
                    setPortalActive(!portalActive)
                    playClick()
                  }}
                  onMouseEnter={playHover}
                  className={`px-8 py-4 rounded-full font-mono font-bold transition-all duration-300 flex items-center space-x-2 group ${
                    portalActive
                      ? "bg-red-600/80 text-white border-2 border-red-400"
                      : "glass-emerald text-emerald-300 hover:text-white border-2 border-emerald-400/50 hover:border-emerald-400"
                  }`}
                  data-cursor="pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>{portalActive ? "DEACTIVATE PORTAL" : "ACTIVATE PORTAL"}</span>
                </motion.button>
              </motion.div>
            </div>

            {/* Dimension Indicator */}
            {portalActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
              >
                <div className="glass-dark px-6 py-3 rounded-lg border border-emerald-400/30">
                  <div className="text-emerald-400 font-mono text-sm">Current Dimension:</div>
                  <div className="text-white font-bold font-mono">{dimensions[currentDimension].name}</div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Portal Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center text-gradient-emerald font-mono">PORTAL_CAPABILITIES</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group"
                onMouseEnter={playHover}
                data-cursor="pointer"
              >
                <div className="glass-dark p-6 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500 text-center h-full">
                  <feature.icon
                    className={`w-12 h-12 ${feature.color} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  />
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dimension Explorer */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center text-gradient-emerald font-mono">DIMENSION_EXPLORER</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {dimensions.map((dimension, index) => (
              <motion.div
                key={dimension.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`group cursor-pointer ${
                  currentDimension === index && portalActive ? "ring-2 ring-emerald-400" : ""
                }`}
                onClick={() => {
                  setCurrentDimension(index)
                  playClick()
                }}
                onMouseEnter={playHover}
                data-cursor="pointer"
              >
                <div className="glass-dark p-8 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                      {dimension.name}
                    </h3>
                    {currentDimension === index && portalActive && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="w-4 h-4 bg-emerald-400 rounded-full"
                      />
                    )}
                  </div>

                  <p className="text-gray-300 mb-6 leading-relaxed">{dimension.description}</p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400 font-mono">Particles:</span>
                      <span className="text-emerald-400 font-mono">{dimension.particles.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400 font-mono">Effect:</span>
                      <span className="text-emerald-400 font-mono">{dimension.effect}</span>
                    </div>
                  </div>

                  <div className={`mt-6 h-2 rounded-full bg-gradient-to-r ${dimension.color} opacity-60`} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Portal Access Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-gradient-emerald font-mono">ACCESS_TERMINAL</h2>

          <div className="glass-dark p-8 rounded-lg border border-emerald-400/30 max-w-4xl mx-auto">
            <div className="flex items-center mb-6 pb-4 border-b border-emerald-400/20">
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
              <div className="ml-4 text-emerald-400 font-mono">portal-access-terminal v3.0.0</div>
            </div>

            <div className="font-mono text-sm space-y-2">
              <div className="text-emerald-400">$ portal --status</div>
              <div className="text-gray-300">Portal Status: {portalActive ? "ACTIVE" : "STANDBY"}</div>
              <div className="text-gray-300">Current Dimension: {dimensions[currentDimension].name}</div>
              <div className="text-gray-300">
                Particle Count: {dimensions[currentDimension].particles.toLocaleString()}
              </div>
              <div className="text-gray-300">Reality Stability: 98.7%</div>
              <div className="text-emerald-400">$ portal --dimensions</div>
              <div className="text-gray-300">Available Dimensions:</div>
              {dimensions.map((dim, index) => (
                <div
                  key={dim.name}
                  className={`text-gray-300 ml-4 ${currentDimension === index ? "text-emerald-400" : ""}`}
                >
                  [{index + 1}] {dim.name} - {dim.description}
                </div>
              ))}
              <div className="text-emerald-400">$ portal --help</div>
              <div className="text-gray-300">Available Commands:</div>
              <div className="text-gray-300 ml-4">activate - Activate portal gateway</div>
              <div className="text-gray-300 ml-4">travel [dimension] - Travel to specified dimension</div>
              <div className="text-gray-300 ml-4">status - Show portal status</div>
              <div className="text-gray-300 ml-4">emergency-exit - Emergency portal shutdown</div>
              <div className="text-emerald-400 flex items-center">
                ${" "}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  className="ml-2 text-cyan-400"
                >
                  ▋
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Portal Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center text-gradient-emerald font-mono">PORTAL_NAVIGATION</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Playground Access",
                description: "Enter the interactive gaming dimension",
                icon: "🎮",
                href: "/playground",
                color: "from-blue-500 to-purple-600",
              },
              {
                title: "Skills Matrix",
                description: "Explore the technical knowledge realm",
                icon: "🧠",
                href: "/skills",
                color: "from-green-500 to-teal-600",
              },
              {
                title: "Project Universe",
                description: "Navigate through created realities",
                icon: "🚀",
                href: "/projects",
                color: "from-purple-500 to-pink-600",
              },
            ].map((portal, index) => (
              <motion.div
                key={portal.title}
                initial={{ opacity: 0, y: 50, rotateY: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, rotateY: 5 }}
                className="group"
              >
                <a
                  href={portal.href}
                  className="block glass-dark p-8 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500 text-center"
                  onMouseEnter={playHover}
                  onClick={playClick}
                  data-cursor="pointer"
                >
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-lg bg-gradient-to-br ${portal.color} flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    {portal.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                    {portal.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">{portal.description}</p>
                  <div className="flex items-center justify-center space-x-2 text-emerald-400 group-hover:text-white transition-colors duration-300">
                    <span className="font-mono">ENTER PORTAL</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Warning Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="glass-dark p-8 rounded-lg border border-red-400/30 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-400 font-mono">PORTAL_WARNING</h3>
                <p className="text-gray-400 font-mono">Dimensional travel safety protocols</p>
              </div>
            </div>

            <div className="space-y-4 text-gray-300 font-mono text-sm">
              <p>• Portal travel may cause temporary reality displacement</p>
              <p>• Always maintain connection to base dimension</p>
              <p>• Emergency exit protocols are available at all times</p>
              <p>
                • Side effects may include: enhanced creativity, expanded consciousness, and improved coding abilities
              </p>
              <p>• Not recommended for users with fear of infinite possibilities</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
