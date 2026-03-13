"use client"

import { motion } from "framer-motion"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/glass-card"
import { Brain, BookOpen, Lightbulb, Puzzle, GraduationCap, Target, Heart } from "lucide-react"

const qualities = [
  {
    icon: Brain,
    title: "Analitik Düşünme",
    description: "Karmaşık problemleri parçalara ayırıp sistematik çözümler üretiyorum.",
    color: "from-lavender/30 to-lavender/10",
  },
  {
    icon: BookOpen,
    title: "Sürekli Öğrenme",
    description: "Yeni teknolojiler ve yaklaşımlar keşfetmeye her zaman açığım.",
    color: "from-cyan/30 to-cyan/10",
  },
  {
    icon: Lightbulb,
    title: "Yaratıcılık",
    description: "Özgün fikirler ve yenilikçi tasarımlar oluşturmayı seviyorum.",
    color: "from-pink/30 to-pink/10",
  },
  {
    icon: Puzzle,
    title: "Problem Çözme",
    description: "Zorlukları fırsata çeviren çözümler geliştiriyorum.",
    color: "from-peach/30 to-peach/10",
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function AboutPage() {
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
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-balance">
              Hakkımda
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Kim olduğumu, hedeflerimi ve tutkularımı keşfedin
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Biography - Larger section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <GlassCard className="h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-lavender/20">
                    <Heart size={20} className="text-foreground/70" />
                  </div>
                  <h2 className="font-serif text-2xl font-semibold">Biyografi</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Merhaba! Ben Şeyma Nur Yanık. Netkent Akdeniz Araştırma ve Bilim 
                    Üniversitesi&apos;nde Yazılım Mühendisliği 3. sınıf öğrencisiyim.
                  </p>
                  <p>
                    Mobil oyun geliştirme dünyasında aktif olarak projeler üretiyorum ve 
                    şu ana kadar iki oyun geliştirdim. Aynı zamanda Python ile veri analizi 
                    alanında kendimi geliştirmeye devam ediyorum.
                  </p>
                  <p>
                    Kod yazmak benim için sadece bir meslek değil, aynı zamanda bir tutku. 
                    Her yeni proje, benim için yeni bir öğrenme ve keşif fırsatı.
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Education & Goals */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              <GlassCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-cyan/20">
                    <GraduationCap size={20} className="text-foreground/70" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold">Eğitim</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/50">
                    <p className="font-medium text-foreground">Netkent Akdeniz Araştırma ve Bilim Üniversitesi</p>
                    <p className="text-sm text-muted-foreground">Yazılım Mühendisliği - 3. Sınıf</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Devam Ediyor</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/50">
                    <p className="font-medium text-foreground">Aydın Adnan Menderes Üniversitesi</p>
                    <p className="text-sm text-muted-foreground">Mimari Restorasyon</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Mezun</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-pink/20">
                    <Target size={20} className="text-foreground/70" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold">Hedeflerim</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lavender mt-2 shrink-0" />
                    Profesyonel mobil oyun geliştirici olmak
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan mt-2 shrink-0" />
                    Veri analizi alanında uzmanlaşmak
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink mt-2 shrink-0" />
                    Kendi oyun stüdyomu kurmak
                  </li>
                </ul>
              </GlassCard>
            </motion.div>
          </div>

          {/* Qualities Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          >
            {qualities.map((quality, index) => (
              <motion.div key={quality.title} variants={item}>
                <GlassCard 
                  hoverGlow 
                  glowColor={index === 0 ? "rgba(200, 180, 230, 0.3)" : 
                            index === 1 ? "rgba(180, 220, 240, 0.3)" :
                            index === 2 ? "rgba(255, 200, 210, 0.3)" :
                            "rgba(255, 220, 200, 0.3)"}
                  className="text-center h-full"
                >
                  <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${quality.color} flex items-center justify-center mb-4`}>
                    <quality.icon size={24} className="text-foreground/70" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">{quality.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{quality.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
