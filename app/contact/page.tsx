"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send, MessageSquare, Clock, Globe } from "lucide-react"
import { MatrixRain } from "@/components/matrix-rain"
import { useAudio } from "@/components/audio-provider"

export default function ContactPage() {
  const { playHover, playClick } = useAudio()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    playClick()

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setFormData({ name: "", email: "", subject: "", message: "" })
    alert("Message sent successfully!")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "brian@chegebb.com",
      href: "mailto:brian@chegebb.com",
      color: "text-emerald-400",
    },
    { icon: Phone, label: "Phone", value: "+254 712 345 678", href: "tel:+254712345678", color: "text-blue-400" },
    { icon: MapPin, label: "Location", value: "Nairobi, Kenya", href: "#", color: "text-purple-400" },
    { icon: Globe, label: "Timezone", value: "EAT (UTC+3)", href: "#", color: "text-cyan-400" },
  ]

  const socialLinks = [
    { icon: Github, label: "GitHub", href: "https://github.com", color: "hover:text-gray-400", bg: "bg-gray-600" },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com",
      color: "hover:text-blue-400",
      bg: "bg-blue-600",
    },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com", color: "hover:text-blue-400", bg: "bg-blue-500" },
  ]

  const responseTime = [
    { time: "< 2 hours", type: "Urgent Projects", icon: "🚨" },
    { time: "< 24 hours", type: "General Inquiries", icon: "📧" },
    { time: "< 48 hours", type: "Collaboration", icon: "🤝" },
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
            CONTACT_INTERFACE
          </h1>
          <p className="text-xl text-emerald-300 max-w-3xl mx-auto font-mono">
            {">"} Establishing secure communication channel...
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
              <h2 className="text-3xl font-bold mb-6 text-emerald-400 font-mono">SEND_MESSAGE</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-emerald-400 font-mono">
                      NAME
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 border border-emerald-400/20 font-mono"
                      placeholder="Your name"
                      data-cursor="pointer"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-emerald-400 font-mono">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 border border-emerald-400/20 font-mono"
                      placeholder="your@email.com"
                      data-cursor="pointer"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 text-emerald-400 font-mono">
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 border border-emerald-400/20 font-mono"
                    placeholder="Project discussion"
                    data-cursor="pointer"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-emerald-400 font-mono">
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 glass-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 resize-none border border-emerald-400/20 font-mono"
                    placeholder="Tell me about your project..."
                    data-cursor="pointer"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  onMouseEnter={playHover}
                  className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-emerald-800 disabled:to-teal-800 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 font-mono"
                  data-cursor="pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>TRANSMIT_MESSAGE</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info & Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
              <h2 className="text-3xl font-bold mb-6 text-emerald-400 font-mono">CONTACT_DATA</h2>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-white/5 transition-all duration-200 group"
                    onMouseEnter={playHover}
                    data-cursor="pointer"
                  >
                    <div
                      className={`p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-400/30`}
                    >
                      <info.icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 font-mono">{info.label}</div>
                      <div className="font-medium text-white group-hover:text-emerald-400 transition-colors duration-200 font-mono">
                        {info.value}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
              <h2 className="text-2xl font-bold mb-6 text-emerald-400 font-mono">RESPONSE_TIME</h2>
              <div className="space-y-4">
                {responseTime.map((item, index) => (
                  <motion.div
                    key={item.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-3 rounded-lg bg-white/5"
                  >
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <div className="font-bold text-emerald-400 font-mono">{item.time}</div>
                      <div className="text-sm text-gray-400">{item.type}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
              <h2 className="text-2xl font-bold mb-6 text-emerald-400 font-mono">SOCIAL_NETWORKS</h2>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className={`p-4 glass-dark rounded-lg transition-all duration-200 ${social.color} border border-emerald-400/20 hover:border-emerald-400/40`}
                    onMouseEnter={playHover}
                    data-cursor="pointer"
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability Status */}
            <div className="glass-dark p-8 rounded-lg border border-emerald-400/20">
              <h2 className="text-2xl font-bold mb-4 text-emerald-400 font-mono">STATUS</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-4 h-4 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <span className="text-white font-mono">Available for new projects</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-400 text-sm font-mono">Usually responds within 24 hours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-400 text-sm font-mono">Open to collaboration opportunities</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="glass-dark p-12 rounded-lg border border-emerald-400/20 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-gradient-emerald font-mono">
              READY_TO_BUILD_SOMETHING_AMAZING?
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-mono">
              Let's turn your ideas into reality. Whether it's a web application, mobile app, or something completely
              innovative.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:brian@chegebb.com"
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-bold text-lg transition-all duration-300 font-mono"
                onMouseEnter={playHover}
                onClick={playClick}
                data-cursor="pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                START_PROJECT
              </motion.a>
              <motion.a
                href="/projects"
                className="px-8 py-4 glass-emerald border-2 border-emerald-400/50 rounded-lg font-bold text-lg hover:border-emerald-400 transition-all duration-300 font-mono"
                onMouseEnter={playHover}
                onClick={playClick}
                data-cursor="pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                VIEW_PORTFOLIO
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
