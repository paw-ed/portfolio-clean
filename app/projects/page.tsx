"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/glass-card"
import { ExternalLink, Gamepad2, Sparkles, Sword, CircleDot, Bot, Clock } from "lucide-react"

interface Project {
  id: number
  title: string
  description: string
  technologies: string[]
  icon: typeof Gamepad2
  iconBg: string
  liveUrl?: string
  isComingSoon?: boolean
  gridClass: string
}

const projects: Project[] = [
  {
    id: 1,
    title: "Düello Kılıcı: Savaş Oyunu",
    description: "Orta çağ temalı heyecan verici bir savaş oyunu. Kılıcınızı kuşanın ve düellolarda rakiplerinizi yenin. Stratejik dövüş mekanikleri ve etkileyici mobil oyun deneyimi sunar.",
    technologies: ["Unity", "C#", "Mobile Game Design"],
    icon: Sword,
    iconBg: "from-lavender/40 to-pink/40",
    liveUrl: "https://play.google.com/store/apps/details?id=com.seyma.duellokilici6",
    gridClass: "lg:col-span-1",
  },
  {
    id: 2,
    title: "BasketUp: Race Against Time",
    description: "Zamana karşı oynanan hızlı tempolu bir basketbol oyunu. Süre bitmeden en yüksek skoru yapmaya çalışın. Refleks, hız ve odak gerektiren eğlenceli bir mobil oyun deneyimi.",
    technologies: ["Unity", "C#", "Mobile"],
    icon: CircleDot,
    iconBg: "from-cyan/40 to-pale-blue/40",
    liveUrl: "https://play.google.com/store/apps/details?id=com.seyma.basketuppp",
    gridClass: "lg:col-span-1",
  },
  {
    id: 3,
    title: "AI Destekli Chatbot Projesi",
    description: "Python ve modern web teknolojileri kullanılarak geliştirilen, kullanıcıyla etkileşim kurabilen akıllı bir chatbot projesi. Mesaj akışı, kullanıcı deneyimi, arayüz yapısı ve yapay zeka entegrasyonu odaklı kişisel bir yazılım çalışması.",
    technologies: ["Python", "Flask", "HTML/CSS", "JavaScript", "OpenAI API"],
    icon: Bot,
    iconBg: "from-peach/40 to-pink/40",
    isComingSoon: true,
    gridClass: "lg:col-span-1",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 },
}

function ProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false)
  const isClickable = !project.isComingSoon && project.liveUrl

  return (
    <motion.div
      variants={item}
      className={project.gridClass}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <GlassCard 
        className={`h-full relative overflow-hidden group ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
        hoverGlow={!project.isComingSoon}
        glowColor={project.id === 1 ? "rgba(200, 180, 230, 0.25)" : project.id === 2 ? "rgba(180, 220, 240, 0.25)" : "rgba(255, 200, 180, 0.2)"}
      >
        {/* Coming Soon Badge */}
        {project.isComingSoon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 left-4 z-20"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-peach/30 backdrop-blur-sm border border-peach/20">
              <Clock size={12} className="text-foreground/70" />
              <span className="text-xs font-medium text-foreground/70">Yakında</span>
            </div>
          </motion.div>
        )}

        {/* Floating Icon Animation */}
        <AnimatePresence>
          {isHovered && !project.isComingSoon && (
            <motion.div
              initial={{ scale: 0, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute top-4 right-4 z-10"
            >
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${project.iconBg} backdrop-blur-sm`}>
                <project.icon size={24} className="text-foreground/80" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Default Icon (when not hovered) */}
        <motion.div
          animate={{ opacity: isHovered && !project.isComingSoon ? 0 : 1 }}
          className={`absolute top-4 right-4 ${project.isComingSoon ? 'opacity-50' : ''}`}
        >
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${project.iconBg} ${project.isComingSoon ? 'opacity-40' : 'opacity-60'}`}>
            <project.icon size={18} className="text-foreground/60" />
          </div>
        </motion.div>

        {/* Content */}
        <div className={`relative z-0 h-full flex flex-col ${project.isComingSoon ? 'pt-6' : ''}`}>
          <div className="flex-1">
            <h3 className={`font-serif text-xl sm:text-2xl font-semibold pr-14 mb-3 ${project.isComingSoon ? 'mt-4' : ''}`}>
              {project.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {project.description}
            </p>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className={`px-3 py-1 rounded-full bg-white/60 text-xs font-medium ${project.isComingSoon ? 'text-foreground/50' : 'text-foreground/70'}`}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {project.isComingSoon ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 text-muted-foreground text-sm font-medium cursor-not-allowed">
                <Clock size={14} />
                Detaylar Hazırlanıyor
              </div>
            ) : project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-white text-sm font-medium hover:shadow-lg transition-shadow"
              >
                <ExternalLink size={14} />
                Oyunu İncele
              </motion.a>
            )}
          </div>
        </div>

        {/* Decorative gradient on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered && !project.isComingSoon ? 0.5 : 0 }}
          className={`absolute inset-0 bg-gradient-to-br ${project.iconBg} pointer-events-none rounded-3xl`}
          style={{ mixBlendMode: "soft-light" }}
        />

        {/* Subtle overlay for coming soon card */}
        {project.isComingSoon && (
          <div className="absolute inset-0 bg-white/20 pointer-events-none rounded-3xl" />
        )}
      </GlassCard>
    </motion.div>
  )
}

export default function ProjectsPage() {
  return (
    <PageTransition>
      <section className="min-h-screen px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink/20 text-sm text-foreground/80 mb-6"
            >
              <Sparkles size={14} className="text-pink" />
              <span>Oyun Projeleri</span>
            </motion.div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-balance">
              Projelerim
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Geliştirdiğim mobil oyunlarla tanışın
            </p>
          </motion.div>

          {/* Project Cards Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>

          
        </div>
      </section>
    </PageTransition>
  )
}
