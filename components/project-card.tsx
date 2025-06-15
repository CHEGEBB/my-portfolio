"use client"

import { motion } from "framer-motion"
import { Github, ExternalLink } from "lucide-react"
import Image from "next/image"

interface Project {
  title: string
  description: string
  image: string
  tech: string[]
  github: string
  live: string
}

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="glass rounded-lg overflow-hidden hover:glow transition-all duration-300 group"
    >
      <div className="relative overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          width={400}
          height={300}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors duration-200"
            data-cursor="pointer"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors duration-200"
            data-cursor="pointer"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-gray-300 mb-4 text-sm">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span key={tech} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
