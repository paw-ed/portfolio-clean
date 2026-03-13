"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { LumiCharacter } from "./lumi-character"
import { X, Minimize2 } from "lucide-react"

type LumiState = "floating" | "sitting" | "talking" | "waving"

interface PageDialogue {
  greeting: string
  explanation: string
  quickActions: { label: string; action: string }[]
}

// Personal info about Şeyma Nur Yanık
const personalInfo = {
  name: "Şeyma Nur Yanık",
  birthDate: "04.01.1998",
  education: {
    current: "Netkent Akdeniz Araştırma ve Bilim Üniversitesi - Yazılım Mühendisliği 3. sınıf",
    graduated: "Aydın Adnan Menderes Üniversitesi - Mimari Restorasyon"
  },
  games: [
    { name: "BasketUp: Race Against Time", description: "Zamana karşı oynanan bir basket oyunu" },
    { name: "Düello Kılıcı: Savaş Oyunu", description: "Orta çağ savaş oyunu" }
  ],
  skills: ["Flutter", "Dart", "Unity", "C#", "Python", "Veri Analizi", "SQL", "UI/UX", "Git"],
  interests: "Oyun yapmayı seviyor, Python veri analizi alanında kendini geliştiriyor"
}

const pageDialogues: Record<string, PageDialogue> = {
  "/": {
    greeting: `Merhaba! Ben Lumi, ${personalInfo.name}'ın dijital asistanıyım. Sana onu tanıtmamı ister misin?`,
    explanation: `${personalInfo.name}, ${personalInfo.education.current} öğrencisi. ${personalInfo.games.length} mobil oyun geliştirdi: "${personalInfo.games[0].name}" ve "${personalInfo.games[1].name}". Aynı zamanda Python ile veri analizi öğreniyor!`,
    quickActions: [
      { label: "Evet, anlat", action: "explain" },
      { label: "Projeleri göster", action: "/projects" },
      { label: "Becerileri gör", action: "/skills" },
    ],
  },
  "/about": {
    greeting: "Burada Şeyma Nur hakkında daha fazla bilgi edinebilirsin. Eğitim geçmişi oldukça ilginç!",
    explanation: `Şeyma Nur önce ${personalInfo.education.graduated} mezunu oldu, sonra yazılım tutkusunu keşfedip ${personalInfo.education.current} öğrencisi oldu. Her gün yeni şeyler öğrenmeye devam ediyor!`,
    quickActions: [
      { label: "Tamam, anlat", action: "explain" },
      { label: "Oyunları gör", action: "/projects" },
      { label: "İletişime geç", action: "/contact" },
    ],
  },
  "/projects": {
    greeting: `Şeyma Nur'un ${personalInfo.games.length} harika oyunu var! Sana bunları anlatayım mı?`,
    explanation: `"${personalInfo.games[0].name}" - ${personalInfo.games[0].description}. "${personalInfo.games[1].name}" - ${personalInfo.games[1].description}. Tüm oyunlar Unity ve C# ile geliştirildi!`,
    quickActions: [
      { label: "Tamam, anlat", action: "explain" },
      { label: "Becerileri gör", action: "/skills" },
      { label: "Hakkında", action: "/about" },
    ],
  },
  "/skills": {
    greeting: "Beceri eşleştirme oyununu oynamayı denedin mi? Aynı becerileri sürükleyip eşleştir!",
    explanation: `Şeyma Nur'un ana becerileri: Oyun geliştirmede Unity ve C#, mobil geliştirmede Flutter ve Dart, veri analizinde Python kullanıyor. Baloncukları sürükleyerek eşleştirmeyi dene!`,
    quickActions: [
      { label: "Tamam, anlat", action: "explain" },
      { label: "Projelere bak", action: "/projects" },
      { label: "İletişime geç", action: "/contact" },
    ],
  },
  "/contact": {
    greeting: "Şeyma Nur ile iletişime geçmek ister misin? Formu doldurabilir veya sosyal medyadan ulaşabilirsin.",
    explanation: "GitHub, LinkedIn ve Telegram üzerinden de Şeyma Nur'a ulaşabilirsin. Proje fikirleri, iş birliği teklifleri veya sadece merhaba demek için yazabilirsin!",
    quickActions: [
      { label: "Tamam, anlat", action: "explain" },
      { label: "Projelere dön", action: "/projects" },
      { label: "Ana sayfa", action: "/" },
    ],
  },
}

// Q&A for personal questions
const qaResponses: Record<string, string> = {
  "kim": `Ben ${personalInfo.name}'ın portfolyo sitesindeki dijital asistanıyım. Şeyma Nur, ${personalInfo.education.current} öğrencisi ve mobil oyun geliştiricisi!`,
  "yaş": `Şeyma Nur ${personalInfo.birthDate} doğumlu.`,
  "eğitim": `Şeyma Nur şu an ${personalInfo.education.current}. Daha önce ${personalInfo.education.graduated} mezunu olmuş.`,
  "oyun": `Şeyma Nur'un 2 oyunu var: 1) "${personalInfo.games[0].name}" - ${personalInfo.games[0].description}. 2) "${personalInfo.games[1].name}" - ${personalInfo.games[1].description}.`,
  "beceri": `Şeyma Nur'un becerileri: ${personalInfo.skills.join(", ")}. Özellikle oyun geliştirme ve veri analizi alanlarına odaklanıyor.`,
}

export function LumiAssistant() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [lumiState, setLumiState] = useState<LumiState>("floating")
  const [showBubble, setShowBubble] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [isExplaining, setIsExplaining] = useState(false)

  const currentDialogue = pageDialogues[pathname] || pageDialogues["/"]

  useEffect(() => {
    if (isMinimized) return
    
    const timer = setTimeout(() => {
      setShowBubble(true)
      setCurrentMessage(currentDialogue.greeting)
      setIsExplaining(false)
      setLumiState("waving")
      
      setTimeout(() => {
        setLumiState("floating")
      }, 2000)
    }, 1500)

    return () => clearTimeout(timer)
  }, [pathname, isMinimized, currentDialogue.greeting])

  const handleAction = useCallback((action: string) => {
    if (action === "explain") {
      setLumiState("sitting")
      setIsExplaining(true)
      
      setTimeout(() => {
        setLumiState("talking")
        setCurrentMessage(currentDialogue.explanation)
        
        setTimeout(() => {
          setLumiState("floating")
        }, 5000)
      }, 500)
    } else if (action.startsWith("/")) {
      window.location.href = action
    }
  }, [currentDialogue.explanation])

  const handleMinimize = () => {
    setIsMinimized(true)
    setShowBubble(false)
  }

  const handleRestore = () => {
    setIsMinimized(false)
    setTimeout(() => {
      setShowBubble(true)
      setCurrentMessage(currentDialogue.greeting)
    }, 500)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showBubble && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="max-w-xs sm:max-w-sm"
          >
            <div className="glass-card-strong rounded-2xl p-4 shadow-lg relative">
              <button
                onClick={() => setShowBubble(false)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/50 transition-colors"
                aria-label="Mesajı kapat"
              >
                <X size={14} className="text-muted-foreground" />
              </button>

              <p className="text-sm text-foreground/90 pr-6 leading-relaxed mb-3">
                {currentMessage}
              </p>

              {!isExplaining && (
                <div className="flex flex-wrap gap-2">
                  {currentDialogue.quickActions.map((qa) => (
                    <motion.button
                      key={qa.label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAction(qa.action)}
                      className="px-3 py-1.5 rounded-full bg-white/60 text-xs font-medium text-foreground/80 hover:bg-white/80 transition-colors border border-white/40"
                    >
                      {qa.label}
                    </motion.button>
                  ))}
                </div>
              )}

              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white/85 rotate-45 border-r border-b border-white/50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMinimized ? (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRestore}
            className="w-14 h-14 rounded-full glass-card-strong shadow-lg flex items-center justify-center cursor-pointer"
            aria-label="Lumi'yi göster"
          >
            <LumiCharacter state="floating" size={40} />
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative group"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleMinimize}
              className="absolute -top-2 -right-2 p-1.5 rounded-full glass-card opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
              aria-label="Lumi'yi küçült"
            >
              <Minimize2 size={12} className="text-muted-foreground" />
            </motion.button>

            <motion.div
              className="relative cursor-pointer"
              onClick={() => setShowBubble(!showBubble)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-lavender/30 to-cyan/30 blur-xl scale-150 opacity-50" />
              
              <div className="relative">
                <LumiCharacter state={lumiState} size={80} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm border border-white/50 text-[10px] font-medium text-foreground/60"
            >
              Lumi
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
