"use client"

import { useEffect, useRef } from "react"

export function Portal3D() {
  const particlesRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const createParticle = () => {
      if (!particlesRef.current) return

      const particle = document.createElement('div')
      particle.className = 'absolute w-1 h-1 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 pointer-events-none'
      
      // Random position
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = Math.random() * 100 + '%'
      
      // Random animation duration
      const duration = Math.random() * 4 + 2
      particle.style.animation = `float ${duration}s ease-in-out infinite`
      
      // Random color
      if (Math.random() > 0.5) {
        particle.className = 'absolute w-1 h-1 bg-fuchsia-400 rounded-full shadow-lg shadow-fuchsia-400/50 pointer-events-none'
      }
      
      particlesRef.current.appendChild(particle)
      
      // Remove after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove()
        }
      }, duration * 1000)
    }

    // Create initial particles
    for (let i = 0; i < 100; i++) {
      setTimeout(() => createParticle(), i * 50)
    }

    // Keep creating particles
    const interval = setInterval(createParticle, 200)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 via-transparent to-transparent animate-pulse"></div>
      
      {/* Main portal ring */}
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-4 border-gradient-to-r from-fuchsia-500 via-cyan-500 to-fuchsia-500 animate-spin-slow shadow-2xl shadow-fuchsia-500/20"></div>
        
        {/* Middle ring */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-2 border-cyan-400/60 animate-reverse-spin shadow-xl shadow-cyan-400/30"></div>
        
        {/* Inner ring */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-fuchsia-400/40 animate-spin-slow"></div>
        
        {/* Portal center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-radial from-fuchsia-500/20 via-cyan-500/10 to-transparent animate-pulse-slow backdrop-blur-sm"></div>
        
        {/* Inner glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-radial from-white/10 to-transparent animate-ping"></div>
      </div>

      {/* Energy waves */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-96 h-96 rounded-full border border-cyan-400/30 animate-wave-1"></div>
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full border border-fuchsia-400/20 animate-wave-2"></div>
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full border border-cyan-300/15 animate-wave-3"></div>
      </div>

      {/* Floating particles container */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none"></div>

      {/* Corner accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400/50"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-fuchsia-400/50"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-fuchsia-400/50"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400/50"></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
          25% { transform: translateY(-20px) rotate(90deg); opacity: 0.8; }
          50% { transform: translateY(-10px) rotate(180deg); opacity: 0.6; }
          75% { transform: translateY(-30px) rotate(270deg); opacity: 0.9; }
        }
        
        @keyframes wave-1 {
          0% { transform: scale(0.8); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 0.3; }
          100% { transform: scale(0.8); opacity: 0.8; }
        }
        
        @keyframes wave-2 {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.4); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.6; }
        }
        
        @keyframes wave-3 {
          0% { transform: scale(1.2); opacity: 0.4; }
          50% { transform: scale(1.6); opacity: 0.1; }
          100% { transform: scale(1.2); opacity: 0.4; }
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        
        .animate-reverse-spin {
          animation: spin 12s linear infinite reverse;
        }
        
        .animate-pulse-slow {
          animation: pulse 4s ease-in-out infinite;
        }
        
        .animate-wave-1 {
          animation: wave-1 3s ease-in-out infinite;
        }
        
        .animate-wave-2 {
          animation: wave-2 4s ease-in-out infinite 1s;
        }
        
        .animate-wave-3 {
          animation: wave-3 5s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  )
}