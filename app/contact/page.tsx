"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/glass-card"
import { Send, Check, AlertCircle, Mail, MapPin, Sparkles, Github, Linkedin } from "lucide-react"

type FormStatus = "idle" | "submitting" | "success" | "error"

interface FormData {
  ad: string
  soyad: string
  email: string
  mesaj: string
}

// Telegram icon component
function TelegramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" fill="currentColor"/>
    </svg>
  )
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    ad: "",
    soyad: "",
    email: "",
    mesaj: "",
  })
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    setIsTyping(true)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setFormData({ ad: "", soyad: "", email: "", mesaj: "" })
      } else {
        setStatus("error")
        setErrorMessage(data.error || "Bir hata oluştu. Lütfen tekrar deneyin.")
      }
    } catch {
      setStatus("error")
      setErrorMessage("Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.")
    }
  }

  const socialLinks = [
    { 
      name: "GitHub", 
      icon: Github, 
      url: "https://github.com/paw-ed", 
      color: "bg-foreground/10",
      description: "Kod repolarım ve geliştirme projelerim"
    },
    { 
      name: "LinkedIn", 
      icon: Linkedin, 
      url: "https://www.linkedin.com/in/%C5%9Feyma-y-7878b42a9/", 
      color: "bg-cyan/20",
      description: "Profesyonel profilim ve kariyer geçmişim"
    },
    { 
      name: "Telegram", 
      icon: TelegramIcon, 
      url: "https://t.me/seyma_portfolio_notify_bot", 
      color: "bg-lavender/20",
      description: "Hızlı iletişim ve mesajlaşma"
    },
  ]

  return (
    <PageTransition>
      <section className="min-h-screen px-4 pt-32 pb-20 relative">
        {/* Rainbow background animation when typing */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 rainbow-bg -z-10"
            />
          )}
        </AnimatePresence>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-peach/20 text-sm text-foreground/80 mb-6"
            >
              <Mail size={14} className="text-peach" />
              <span>Bana Ulaşın</span>
            </motion.div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-balance">
              İletişim
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Projeleriniz veya sorularınız için benimle iletişime geçebilirsiniz
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-1 space-y-6"
            >
              <GlassCard>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-lavender/20">
                    <Mail size={18} className="text-foreground/70" />
                  </div>
                  <h3 className="font-medium">E-posta</h3>
                </div>
                <p className="text-sm text-muted-foreground">seymanur@email.com</p>
              </GlassCard>

              <GlassCard>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-cyan/20">
                    <MapPin size={18} className="text-foreground/70" />
                  </div>
                  <h3 className="font-medium">Konum</h3>
                </div>
                <p className="text-sm text-muted-foreground">Türkiye</p>
              </GlassCard>

              {/* Social Links */}
              <GlassCard>
                <h3 className="font-medium mb-4">Sosyal Profiller</h3>
                <div className="flex flex-col gap-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-xl ${social.color} hover:shadow-md transition-all`}
                    >
                      <div className="p-2 rounded-lg bg-white/50 group-hover:bg-white/70 transition-colors">
                        <social.icon size={18} className="text-foreground/80" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-sm font-medium text-foreground/90">{social.name}</span>
                        <span className="block text-xs text-muted-foreground truncate">{social.description}</span>
                      </div>
                      <svg 
                        className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground/70 group-hover:translate-x-0.5 transition-all" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </motion.a>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="text-center py-8">
                <Sparkles size={24} className="mx-auto text-pink mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sanat galerimiz her zaman ziyaretçilere açık. Fikirlerinizi benimle paylaşın!
                </p>
              </GlassCard>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <GlassCard className="glass-card-strong">
                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-lavender/40 to-cyan/40 flex items-center justify-center mb-6"
                      >
                        <Check size={32} className="text-foreground" />
                      </motion.div>
                      <h3 className="font-serif text-2xl font-semibold mb-2">
                        Mesajınız Sanat Galerimize Ulaştı!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        En kısa sürede size dönüş yapacağım.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStatus("idle")}
                        className="px-6 py-3 rounded-2xl glass-card font-medium text-sm text-foreground hover:bg-white/80 transition-all"
                      >
                        Yeni Mesaj Gönder
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="ad" className="block text-sm font-medium mb-2">
                            Ad
                          </label>
                          <input
                            type="text"
                            id="ad"
                            name="ad"
                            value={formData.ad}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-white/50 focus:border-lavender/50 focus:ring-2 focus:ring-lavender/20 outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
                            placeholder="Adınız"
                          />
                        </div>
                        <div>
                          <label htmlFor="soyad" className="block text-sm font-medium mb-2">
                            Soyad
                          </label>
                          <input
                            type="text"
                            id="soyad"
                            name="soyad"
                            value={formData.soyad}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-white/50 focus:border-lavender/50 focus:ring-2 focus:ring-lavender/20 outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
                            placeholder="Soyadınız"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          E-posta
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-white/50 focus:border-lavender/50 focus:ring-2 focus:ring-lavender/20 outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
                          placeholder="ornek@email.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="mesaj" className="block text-sm font-medium mb-2">
                          Mesaj
                        </label>
                        <textarea
                          id="mesaj"
                          name="mesaj"
                          value={formData.mesaj}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-white/50 focus:border-lavender/50 focus:ring-2 focus:ring-lavender/20 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground/50"
                          placeholder="Mesajınızı buraya yazın..."
                        />
                      </div>

                      {status === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 text-destructive text-sm"
                        >
                          <AlertCircle size={16} />
                          <span>{errorMessage}</span>
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={status === "submitting"}
                        whileHover={{ scale: status === "submitting" ? 1 : 1.02 }}
                        whileTap={{ scale: status === "submitting" ? 1 : 0.98 }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-foreground text-white font-medium text-sm hover:shadow-lg hover:shadow-foreground/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {status === "submitting" ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Gönderiliyor...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Mesaj Gönder
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
