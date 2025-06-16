"use client";

import { memo, useRef, useEffect, useState, lazy, Suspense } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code2,
  Rocket,
  Star,
  Eye,
  Brain,
  Cpu,
  Zap,
  Terminal,
  Gamepad2,
  Globe,
  Smartphone,
  Server,
  Briefcase,
  Database,
  Layers,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAudio } from "@/components/audio-provider";

// Lazy-loaded components to improve initial load time
const MatrixRain = lazy(() => import("@/components/matrix-rain").then(mod => ({ default: mod.MatrixRain })));
const ParallaxBackground = lazy(() => import("@/components/parallax-background").then(mod => ({ default: mod.ParallaxBackground })));
const ProfileShape = lazy(() => import("@/components/profile-shape").then(mod => ({ default: mod.ProfileShape })));

// Memoized tech stack component to prevent unnecessary re-renders
const TechStackItem = memo(({ tech, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, scale: 1.03 }}
      className="group relative cursor-pointer"
    >
      <div className={`
        relative bg-black/40 backdrop-blur-sm p-6 rounded-xl 
        border border-emerald-400/20 hover:border-emerald-400/60
        transition-all duration-300 text-center
        hover:bg-emerald-900/10 hover:shadow-lg ${tech.glowColor}
      `}>
        <div className="mb-4 relative">
          <Image
            src={tech.icon}
            alt={`${tech.name} icon`}
            width={48}
            height={48}
            className="mx-auto drop-shadow-md transition-all duration-300"
          />
        </div>
        <h3 className="text-sm md:text-base font-bold text-emerald-100 group-hover:text-emerald-400 transition-colors duration-300 font-mono tracking-wider">
          {tech.name.toUpperCase()}
        </h3>
      </div>
    </motion.div>
  );
});

TechStackItem.displayName = "TechStackItem";

// Memoized project card component
const ProjectCard = memo(({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ y: -10, scale: 1.01 }}
      className="group relative"
    >
      <div className="relative bg-slate-900/90 border border-emerald-400/30 group-hover:border-emerald-400/70 transition-all duration-300 overflow-hidden rounded-lg">
        {/* Project Image */}
        <div className="relative overflow-hidden h-64 bg-slate-800">
          <Image 
            src={project.image} 
            alt={project.title}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
          />
          
          {/* Action buttons overlay */}
          <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-6">
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-slate-800/80 backdrop-blur border border-emerald-400/50 hover:border-emerald-400 transition-all duration-300 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-6 h-6 text-emerald-400" />
            </motion.a>

            <motion.a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-slate-800/80 backdrop-blur border border-cyan-400/50 hover:border-cyan-400 transition-all duration-300 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-6 h-6 text-cyan-400" />
            </motion.a>
          </div>
        </div>

        {/* Project Info */}
        <div className="p-6 bg-slate-900/95">
          <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-slate-300 mb-4 text-sm leading-relaxed">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tech.map((tech, techIndex) => (
              <span
                key={tech}
                className="px-3 py-1 bg-slate-800/80 text-emerald-300 border border-emerald-400/30 text-xs rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ProjectCard.displayName = "ProjectCard";

// Main HomePage component
export default function HomePage() {
  const { playHover, playClick } = useAudio();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Optimize animations with useTransform
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  // Tech stack data
  const techStack = [
    { name: "React", icon: "/assets/react.svg", glowColor: "group-hover:shadow-blue-400/20" },
    { name: "Next.js", icon: "/assets/nextjs.svg", glowColor: "group-hover:shadow-white/20" },
    { name: "TypeScript", icon: "/assets/typescript.svg", glowColor: "group-hover:shadow-blue-500/20" },
    { name: "Node.js", icon: "/assets/nodejs.svg", glowColor: "group-hover:shadow-green-500/20" },
    { name: "Python", icon: "/assets/python.svg", glowColor: "group-hover:shadow-yellow-400/20" },
    { name: "MongoDB", icon: "/assets/mongodb.svg", glowColor: "group-hover:shadow-green-400/20" },
    { name: "PostgreSQL", icon: "/assets/postgresql.svg", glowColor: "group-hover:shadow-blue-600/20" },
    { name: "Docker", icon: "/assets/docker.svg", glowColor: "group-hover:shadow-blue-400/20" },
    { name: "AWS", icon: "/assets/aws.svg", glowColor: "group-hover:shadow-orange-400/20" },
    { name: "GraphQL", icon: "/assets/graphql.svg", glowColor: "group-hover:shadow-pink-400/20" },
  ];

  // Featured projects data
  const featuredProjects = [
    {
      title: "AI-Powered Code Assistant",
      description: "Revolutionary AI assistant that helps developers write better code with real-time suggestions and automated refactoring",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
      tech: ["OpenAI", "TypeScript", "React", "Node.js"],
      github: "https://github.com",
      live: "https://example.com",
    },
    {
      title: "Blockchain Voting System",
      description: "Secure, transparent voting platform built on blockchain technology with end-to-end encryption",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
      tech: ["Solidity", "Web3.js", "React", "IPFS"],
      github: "https://github.com",
      live: "https://example.com",
    },
    {
      title: "Real-time Collaboration Platform",
      description: "Multi-user collaborative workspace with real-time editing, video calls, and project management",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      tech: ["Socket.io", "WebRTC", "React", "Express"],
      github: "https://github.com",
      live: "https://example.com",
    },
  ];

  // Services data
  const services = [
    {
      title: "Full Stack Development",
      description: "End-to-end web application development with modern technologies and best practices",
      icon: Globe,
      features: ["React/Next.js", "Node.js/Express", "Database Design", "API Development"],
      iconColor: "text-blue-400",
    },
    {
      title: "Mobile App Development",
      description: "Cross-platform mobile applications with native performance and user experience",
      icon: Smartphone,
      features: ["React Native", "Flutter", "iOS/Android", "App Store Deployment"],
      iconColor: "text-slate-400",
    },
    {
      title: "Cloud & DevOps",
      description: "Scalable cloud infrastructure and automated deployment pipelines",
      icon: Server,
      features: ["AWS/Azure", "Docker/Kubernetes", "CI/CD Pipelines", "Monitoring"],
      iconColor: "text-emerald-400",
    },
  ];

  // Simulate loading with a setTimeout to improve perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900">
        <div className="text-emerald-400 font-mono text-lg animate-pulse">
          SYSTEM INITIALIZING...
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-slate-900"
    >
      {/* Background Video - using HTML5 video for better performance */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain "
        >
          <source src="/assets/vid.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-900/70" />
      </div>

      {/* Matrix Rain Effect - lazy loaded */}
      <Suspense fallback={null}>
        <div className="fixed inset-0 z-0 opacity-30">
          <MatrixRain />
        </div>
      </Suspense>

      {/* Hero Section with Parallax */}
      <Suspense fallback={<div className="min-h-screen" />}>
        <section className="relative min-h-screen flex items-center justify-center px-4 z-10">
          <motion.div
            style={{ y, opacity, scale }}
            className="max-w-7xl mx-auto w-full"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8"
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight font-mono">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                    DIGITAL
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                    ARCHITECT
                  </span>
                </h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-lg md:text-xl text-emerald-300 font-mono tracking-wider"
                >
                  <span className="inline-block">{">"}</span>
                  <motion.span
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block ml-2"
                  >
                    Crafting tomorrow's digital experiences
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="inline-block ml-1 text-emerald-400"
                  >
                    ▋
                  </motion.span>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link
                    href="/projects"
                    className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300"
                    onMouseEnter={playHover}
                    onClick={playClick}
                  >
                    <span className="relative z-10 flex items-center space-x-2 text-white">
                      <Rocket className="w-5 h-5" />
                      <span>Explore Projects</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>

                  <Link
                    href="/contact"
                    className="group relative px-8 py-4 bg-transparent border-2 border-emerald-400/50 rounded-xl font-bold text-lg hover:border-emerald-400 transition-all duration-300"
                    onMouseEnter={playHover}
                    onClick={playClick}
                  >
                    <span className="relative z-10 flex items-center space-x-2 text-emerald-300 group-hover:text-white">
                      <Zap className="w-5 h-5" />
                      <span>Get In Touch</span>
                    </span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right Side - Profile Shape */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="flex justify-center lg:justify-end"
              >
                <ProfileShape imageUrl="/assets/profile.jpg" />
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center space-y-2 text-emerald-400"
            >
              <span className="text-sm font-mono">Scroll to explore</span>
              <ArrowDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </section>
      </Suspense>

      {/* Tech Stack Showcase */}
      <section className="relative py-24 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono">
              TECH ARSENAL
            </h2>
            <p className="text-lg text-emerald-300/80 font-mono max-w-3xl mx-auto">
              Cutting-edge technologies powering digital innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {techStack.map((tech, index) => (
              <TechStackItem key={tech.name} tech={tech} index={index} />
            ))}
          </div>

          {/* Hacker-style status indicators */}
          <div className="mt-12 flex justify-center space-x-8 opacity-50">
            <div className="text-emerald-400 font-mono text-xs animate-pulse">
              [ SYSTEM READY ]
            </div>
            <div className="text-cyan-400 font-mono text-xs animate-pulse delay-300">
              [ STACK LOADED ]
            </div>
            <div className="text-emerald-300 font-mono text-xs animate-pulse delay-500">
              [ INNOVATION MODE ]
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-4 z-10">
        <div className="absolute inset-0 bg-slate-900/80" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono">
              SYSTEM_METRICS.LOG
            </h2>
            <p className="text-lg text-emerald-300/80 font-mono max-w-3xl mx-auto">
              <span className="text-emerald-500">[INFO]</span> Real-time performance indicators
              <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse" />
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                label: "Projects Completed",
                value: "50+",
                color: "text-emerald-400",
                desc: "Successful Deployments",
              },
              {
                icon: Code2,
                label: "Lines of Code",
                value: "500K+",
                color: "text-teal-400",
                desc: "Written & Optimized",
              },
              {
                icon: Cpu,
                label: "System Uptime",
                value: "99.9%",
                color: "text-green-400",
                desc: "Reliability Score",
              },
              {
                icon: Eye,
                label: "Coffee Consumed",
                value: "∞",
                color: "text-cyan-400",
                desc: "Fuel for Innovation",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="group"
              >
                <div className="bg-slate-900/90 border border-emerald-400/20 group-hover:border-emerald-400/60 transition-all duration-300 rounded-lg overflow-hidden">
                  <div className="p-6 text-center">
                    {/* Icon */}
                    <div className="mb-4">
                      <stat.icon className={`w-12 h-12 ${stat.color} mx-auto`} />
                    </div>
                    
                    {/* Value */}
                    <div className={`text-3xl font-black ${stat.color} mb-2`}>
                      {stat.value}
                    </div>
                    
                    {/* Label and description */}
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                        {stat.label}
                      </div>
                      <div className="text-sm text-slate-400 group-hover:text-slate-300">
                        <span className="text-cyan-400">//</span> {stat.desc}
                      </div>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="flex items-center justify-center space-x-2 mt-4 pt-3 border-t border-emerald-400/20">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-emerald-300 font-mono">
                        ONLINE
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="relative py-24 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono">
              FEATURED_PROJECTS.EXE
            </h2>
            <p className="text-lg text-emerald-300/80 font-mono max-w-3xl mx-auto">
              <span className="text-emerald-500">&gt;</span> Executing advanced digital solutions...
              <span className="inline-block w-2 h-5 bg-emerald-400 ml-1 animate-pulse" />
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>

          {/* View all projects button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/projects"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-400/50 hover:border-emerald-400 rounded-lg transition-all duration-300 group"
            >
              <span className="text-emerald-300 group-hover:text-white transition-colors duration-300 font-mono">
                VIEW_ALL_PROJECTS
              </span>
              <Star className="w-5 h-5 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-24 px-4 z-10 bg-gradient-to-br from-slate-900 via-slate-800/60 to-emerald-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-slate-300 font-mono">
              SERVICES
            </h2>
            <p className="text-lg text-slate-300/80 max-w-3xl mx-auto">
              Comprehensive solutions for your digital transformation needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-emerald-400/20 group-hover:border-emerald-400/60 transition-all duration-300 h-full">
                  <service.icon className={`w-12 h-12 ${service.iconColor} mb-6 group-hover:scale-110 transition-all duration-300`} />

                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-slate-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-3 text-sm text-slate-400 group-hover:text-slate-300">
                        <div className={`w-2 h-2 ${service.iconColor.replace("text-", "bg-")} rounded-full`}></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Footer Section */}
      <section className="relative py-24 px-4 z-10 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono">
              ESTABLISH_CONNECTION
            </h2>
            <p className="text-lg text-emerald-300/80 font-mono max-w-3xl mx-auto">
              Ready to collaborate? Let's build something extraordinary together.
            </p>
          </motion.div>

          <div className="flex justify-center space-x-6 mb-12">
            {[
              { icon: Github, href: "https://github.com", label: "GitHub" },
              { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              { icon: Mail, href: "mailto:contact@example.com", label: "Email" },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-slate-800 rounded-xl border border-emerald-400/30 hover:border-emerald-400/80 transition-all duration-300"
              >
                <social.icon className="w-6 h-6 text-emerald-400" />
              </motion.a>
            ))}
          </div>

          <div className="text-center text-slate-400 font-mono text-sm">
            <p>© 2025 Digital Architect. All systems operational.</p>
            <div className="flex items-center justify-center mt-4 space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>SECURE_CONNECTION_ESTABLISHED</span>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS for additional effects */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        .text-gradient-emerald {
          background: linear-gradient(to right, #10b981, #14b8a6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        /* Optimize paint performance with transform and opacity */
        .translate-z-0 {
          transform: translateZ(0);
        }
        
        /* Optimize scroll performance */
        html {
          scroll-behavior: smooth;
        }
        
        /* Hardware acceleration for animations */
        .animate-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}