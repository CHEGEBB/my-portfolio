"use client";

import { memo, useRef, useEffect, useState, lazy, Suspense } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, ExternalLink, Code2, Rocket, Star, Eye, Brain, Cpu, Zap, Terminal, Gamepad2, Globe, Smartphone, Server, Briefcase, Database, Layers, Sparkles, Trophy, Users } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";
import { useAudio } from "@/components/audio-provider";

// Lazy-loaded components to improve initial load time
const MatrixRain = lazy(() => import("@/components/matrix-rain").then(mod => ({ default: mod.MatrixRain })));

// Enhanced Typing Animation Component
const TypingAnimation = memo(() => {
  const phrases = [
    "Fullstack Developer",
    "Mobile App Developer", 
    "Cybersecurity Enthusiast",
    "React | Next.js | Angular | Vue Lover",
    "Tailwind CSS & SASS Wizard",
    "Node.js | Express | MongoDB | PostgreSQL",
    "React Native | Flutter | Expo Dev",
    "Python & TypeScript Fan",
    "Backend with Appwrite & REST APIs",
    "Tech Is My Passion",
    "Forever Building & Learning",
    "Clean UI Addict",
    "Open Source Contributor",
    "Creative Thinker",
    "Terminal UI Aesthetic"
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentPhraseIndex, phrases]);

  return (
    <div className="text-lg md:text-xl text-emerald-300 font-mono h-8 flex items-center">
      <span className="text-emerald-500 mr-2">{">"}</span>
      <span>{currentText}</span>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="inline-block ml-1 text-emerald-400 text-xl"
      >
        ▋
      </motion.span>
    </div>
  );
});

TypingAnimation.displayName = "TypingAnimation";

// Enhanced Profile Shape Component with Name
const ProfileShape = memo(({ imageUrl }: { imageUrl: string }) => {
  return (
    <div className="relative">
      {/* Animated background rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 w-80 h-80 border-2 border-emerald-400/30 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 w-72 h-72 border border-cyan-400/20 rounded-full"
      />
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-emerald-400/60 rounded-full"
          style={{
            top: `${20 + Math.sin(i * 0.8) * 30}%`,
            left: `${20 + Math.cos(i * 0.8) * 30}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Main profile container */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative w-64 h-64 mx-auto"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-xl" />
        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-emerald-400/50 shadow-2xl shadow-emerald-400/20">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt="Profile"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent" />
        </div>
        
        {/* Status indicator */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-400/50">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs text-emerald-300 font-mono">ONLINE</span>
        </div>
      </motion.div>

      {/* Stylish Name Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-center mt-6"
      >
        <h3 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono tracking-wider">
          Brian Chege
        </h3>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-16"></div>
          <Terminal className="w-4 h-4 text-emerald-400" />
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent w-16"></div>
        </div>
      </motion.div>
    </div>
  );
});

ProfileShape.displayName = "ProfileShape";

// Memoized tech stack component to prevent unnecessary re-renders
const TechStackItem = memo(({ tech, index }: { tech: any; index: number }) => {
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
            src={tech.icon || "/placeholder.svg"}
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

// Enhanced Project Card Component
const ProjectCard = memo(({ project, index }: { project: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className="bg-slate-900/90 backdrop-blur-sm border border-emerald-400/20 group-hover:border-emerald-400/60 transition-all duration-500 rounded-2xl overflow-hidden"
        animate={{
          height: isHovered ? "auto" : "auto"
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Project Image Container */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Featured Badge */}
          <div className="absolute top-4 left-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full text-white text-xs font-mono font-bold">
              <Trophy className="w-3 h-3" />
              <span>FEATURED</span>
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        </div>

        {/* Project Info - Always Visible */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-3 font-mono group-hover:text-emerald-400 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-gray-300 text-sm mb-4">{project.description}</p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.slice(0, 3).map((tech: string) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-mono bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-400/30"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="px-3 py-1 text-xs font-mono bg-gray-500/20 text-gray-400 rounded-full">
                +{project.tech.length - 3}
              </span>
            )}
          </div>

          {/* Action Buttons - Show on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="flex space-x-4"
              >
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 p-3 bg-slate-800/80 backdrop-blur rounded-lg border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-200 text-emerald-400 font-mono text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Github className="w-4 h-4" />
                  <span>Code</span>
                </motion.a>
                <motion.a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 p-3 bg-emerald-500/20 backdrop-blur rounded-lg border border-emerald-400/50 hover:border-emerald-400/80 transition-all duration-200 text-emerald-400 font-mono text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live</span>
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
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
      title: "Healthmaster mobile app",
      description: "A medication adherence, drugs interaction checker, and health tracker app that helps users manage their medications, check for drug interactions, and track their health metrics. Powered by AI allows users to know their medications , track their health metrics, and check for drug interactions.",
      image: "/assets/graphic.png",
      tech: ["React Native", "Expo", "Appwrite", "Typescript", "Kotlin"],
      github: "https://github.com/CHEGEBB/health-master-mobile-app",
      live: "https://apkpure.com/p/com.health_master.healthmaster",
    },
    {
      title: "Werentonline real-estate",
      description: "A real estate web app that allows users to search for properties, view listings, and connect with agents. Features include property search, listing management, and user profiles.",
      image: "/assets/wrent.png",
      tech: ["Html", "Javascript", "Node.js", "css", "Sendgrid"],
      github: "https://github.com/muthonijulie/estates",
      live: "https://www.werentonline.com",
    },
    {
      title: "Jobplex",
      description: "JobPlex matches candidates with opportunities that are based on real skills and potential.. Our AI-powered platform revolutionizes how talent connects with employers.",
      image: "/assets/job.png",
      tech: ["Angular", "Node.js", "AWS","Tailwind css", "Sass","Docker"],
      github: "https://github.com/CHEGEBB/jobplex",
      live: "http://jobplex-frontend.s3-website-us-east-1.amazonaws.com/",
    },
  ];

  // Services data with Unsplash backgrounds
  const services = [
    {
      title: "Full Stack Development",
      description: "End-to-end web application development with modern technologies and best practices",
      icon: Globe,
      features: ["React/Next.js", "Node.js/Express", "Database Design", "API Development"],
      iconColor: "text-blue-400",
      bgImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=center",
    },
    {
      title: "Mobile App Development",
      description: "Cross-platform mobile applications with native performance and user experience",
      icon: Smartphone,
      features: ["React Native", "Flutter", "iOS/Android", "App Store Deployment"],
      iconColor: "text-emerald-400",
      bgImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center",
    },
    {
      title: "Cloud & DevOps",
      description: "Scalable cloud infrastructure and automated deployment pipelines",
      icon: Server,
      features: ["AWS/Azure", "Docker/Kubernetes", "CI/CD Pipelines", "Monitoring"],
      iconColor: "text-cyan-400",
      bgImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center",
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
      {/* Matrix Rain Effect - Only in Hero */}
      <Suspense fallback={null}>
        <div className="fixed inset-0 z-0 opacity-30">
          <MatrixRain />
        </div>
      </Suspense>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 z-10">
        <motion.div
          style={{ y, opacity, scale }}
          className="max-w-7xl mx-auto w-full"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Profile Shape */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex justify-center lg:justify-start"
            >
              <ProfileShape imageUrl="/assets/profile.jpg" />
            </motion.div>

            {/* Right Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
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

              <TypingAnimation />

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

      {/* Tech Stack Showcase with Unsplash Background */}
      <section className="relative py-24 px-4 z-10">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-50">
          <Image
            src="/assets/1.jpg"
            alt="Tech Background"
            fill
            className="object-cover"
          />
        </div>
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

      {/* Stats Section with Unsplash Background */}
      <section className="relative py-24 px-4 z-10">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-25">
          <Image
            src="/assets/1.jpg"
            alt="Analytics Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-slate-900/85" />

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
                <div className="bg-slate-900/90 backdrop-blur-sm border border-emerald-400/20 group-hover:border-emerald-400/60 transition-all duration-300 rounded-lg overflow-hidden">
                  <div className="p-6 text-center">
                    <div className="mb-4">
                      <stat.icon className={`w-12 h-12 ${stat.color} mx-auto`} />
                    </div>
                    
                    <div className={`text-3xl font-black ${stat.color} mb-2`}>
                      {stat.value}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 font-mono">
                        {stat.label}
                      </div>
                      <div className="text-sm text-slate-400 group-hover:text-slate-300">
                        <span className="text-cyan-400">//</span> {stat.desc}
                      </div>
                    </div>
                    
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

      {/* Featured Projects with MP4 Background */}
      <section className="relative py-24 px-4 z-10">
        {/* MP4 Video Background */}
        <div className="absolute inset-0 z-0 opacity-30">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/vid.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-slate-900/80" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
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
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border border-emerald-400/50 hover:border-emerald-400 rounded-lg transition-all duration-300 group backdrop-blur-sm"
            >
              <span className="text-emerald-300 group-hover:text-white transition-colors duration-300 font-mono">
                VIEW_ALL_PROJECTS
              </span>
              <Star className="w-5 h-5 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section with Blurred Unsplash Background */}
      <section className="relative py-24 px-4 z-10">
        {/* Blurred Background Image */}
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/assets/1.jpg"
            alt="Services Background"
            fill
            className="object-cover"

          />
        </div>
        <div className="absolute inset-0 bg-slate-900/70" />

        <div className="max-w-6xl mx-auto relative z-10">
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
                <div className="relative bg-black/20 backdrop-blur-md p-8 rounded-xl border border-emerald-400/20 group-hover:border-emerald-400/60 transition-all duration-300 h-full overflow-hidden">
                  {/* Background Image */}
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                    <Image
                      src={service.bgImage || "/placeholder.svg"}
                      alt={service.title}
                      fill
                      className="object-cover blur-sm"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
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