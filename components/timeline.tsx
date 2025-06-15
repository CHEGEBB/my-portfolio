"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin } from "lucide-react"

export function Timeline() {
  const timelineData = [
    {
      year: "2024",
      title: "Senior Full Stack Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      description: "Leading development of scalable web applications using React, Node.js, and cloud technologies.",
      skills: ["React", "Node.js", "AWS", "TypeScript"],
    },
    {
      year: "2022",
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "Remote",
      description: "Built and maintained multiple client projects, focusing on performance and user experience.",
      skills: ["Vue.js", "Python", "PostgreSQL", "Docker"],
    },
    {
      year: "2020",
      title: "Frontend Developer",
      company: "WebAgency",
      location: "New York, NY",
      description: "Developed responsive websites and web applications for various clients.",
      skills: ["JavaScript", "CSS", "React", "Figma"],
    },
    {
      year: "2019",
      title: "Computer Science Graduate",
      company: "University of Technology",
      location: "Boston, MA",
      description: "Graduated with honors, specializing in software engineering and web development.",
      skills: ["Algorithms", "Data Structures", "Software Engineering"],
    },
  ]

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>

      <div className="space-y-12">
        {timelineData.map((item, index) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className={`relative flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
          >
            {/* Timeline dot */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-slate-950 z-10"></div>

            {/* Content */}
            <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass p-6 rounded-lg hover:glow transition-all duration-300"
              >
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-blue-400 font-semibold">{item.year}</span>
                </div>

                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <div className="flex items-center mb-3 text-gray-300">
                  <span className="font-medium">{item.company}</span>
                  <span className="mx-2">•</span>
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{item.location}</span>
                </div>

                <p className="text-gray-300 mb-4">{item.description}</p>

                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
