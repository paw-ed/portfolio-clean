"use client"

import { motion } from "framer-motion"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/glass-card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <PageTransition>
      <section className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="order-2 lg:order-1 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lavender/20 text-sm text-foreground/80 mb-6"
              >
                <Sparkles size={14} className="text-lavender" />
                <span>Hoş Geldiniz</span>
              </motion.div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight tracking-tight text-balance">
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="block"
                >
                  Şeyma Nur
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="block bg-gradient-to-r from-lavender via-pink to-cyan bg-clip-text text-transparent"
                >
                  YANIK
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-4 text-lg sm:text-xl text-muted-foreground font-medium"
              >
                Netkent University Student & Mobile Game Developer
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-6 text-base text-muted-foreground/80 leading-relaxed max-w-lg mx-auto lg:mx-0"
              >
                Mobil oyun geliştirme ve Python veri analizi alanlarında kendimi geliştiren bir yazılım mühendisliği öğrencisiyim.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/projects">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-foreground text-white font-medium text-sm transition-all hover:shadow-lg hover:shadow-foreground/20"
                  >
                    Projelerimi Keşfet
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </Link>
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass-card font-medium text-sm text-foreground hover:bg-white/80 transition-all"
                  >
                    Ben Kimim?
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Portrait/Profile Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="order-1 lg:order-2 flex justify-center"
            >
              <GlassCard className="relative p-8 sm:p-12">
                {/* Decorative elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-lavender/40 to-pink/40 blur-xl"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-gradient-to-br from-cyan/40 to-pale-blue/40 blur-xl"
                />
                
                {/* Profile Image */}
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-3xl overflow-hidden bg-gradient-to-br from-lavender/20 via-white to-cyan/20">
                  <Image
                    src="/images/profile1.jpeg"
                    alt="Şeyma Nur Yanık"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Stats */}
                <div className="mt-6 flex justify-center gap-6">
                  {[
                    { label: "Oyun", value: "2" },
                    { label: "Teknoloji", value: "6+" },
                    { label: "Sınıf", value: "3" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="text-center"
                    >
                      <p className="font-serif text-xl font-semibold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
