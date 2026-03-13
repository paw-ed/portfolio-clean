"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback, useRef } from "react"
import { PageTransition } from "@/components/page-transition"
import { GlassCard } from "@/components/glass-card"
import { Sparkles, Trophy, RotateCcw, Play, Volume2, VolumeX, Star, Zap, Clock, ChevronRight, X } from "lucide-react"

// Types
interface Bubble {
  id: number
  skill: string
  color: string
  x: number
  y: number
  size: number
  matched: boolean
  isFake?: boolean
  velocityX?: number
  velocityY?: number
}

interface LevelConfig {
  level: number
  name: string
  pairs: number
  hasFakes: boolean
  fakeCount: number
  hasTimer: boolean
  timeLimit: number
  hasMovement: boolean
  description: string
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  scale: number
  rotation: number
}

// Level configurations
const LEVELS: LevelConfig[] = [
  {
    level: 1,
    name: "Baslangic",
    pairs: 4,
    hasFakes: false,
    fakeCount: 0,
    hasTimer: false,
    timeLimit: 0,
    hasMovement: false,
    description: "Ayni renkteki baloncuklari eslestirin"
  },
  {
    level: 2,
    name: "Isiniyor",
    pairs: 6,
    hasFakes: false,
    fakeCount: 0,
    hasTimer: false,
    timeLimit: 0,
    hasMovement: false,
    description: "Daha fazla balon, daha fazla eglence!"
  },
  {
    level: 3,
    name: "Dikkat!",
    pairs: 6,
    hasFakes: true,
    fakeCount: 4,
    hasTimer: false,
    timeLimit: 0,
    hasMovement: false,
    description: "Sahte balonlara dikkat edin!"
  },
  {
    level: 4,
    name: "Zamana Karsi",
    pairs: 6,
    hasFakes: true,
    fakeCount: 3,
    hasTimer: true,
    timeLimit: 45,
    hasMovement: false,
    description: "Zamana karsi yarisin!"
  },
  {
    level: 5,
    name: "Final",
    pairs: 8,
    hasFakes: true,
    fakeCount: 4,
    hasTimer: true,
    timeLimit: 60,
    hasMovement: true,
    description: "Hareketli balonlar! Ustalasinizi gosterin!"
  }
]

// Skill colors with pairs
const skillColors = [
  { skill: "Flutter", color: "from-cyan-400/70 to-cyan-300/50", hue: 180 },
  { skill: "Dart", color: "from-sky-400/70 to-sky-300/50", hue: 200 },
  { skill: "Unity", color: "from-pink-400/70 to-pink-300/50", hue: 330 },
  { skill: "C#", color: "from-violet-400/70 to-violet-300/50", hue: 270 },
  { skill: "Python", color: "from-amber-400/70 to-amber-300/50", hue: 40 },
  { skill: "SQL", color: "from-rose-400/70 to-rose-300/50", hue: 350 },
  { skill: "UI/UX", color: "from-fuchsia-400/70 to-fuchsia-300/50", hue: 290 },
  { skill: "Git", color: "from-orange-400/70 to-orange-300/50", hue: 25 },
]

const fakeSkills = [
  { skill: "???", color: "from-gray-400/70 to-gray-300/50" },
  { skill: "?!", color: "from-slate-400/70 to-slate-300/50" },
  { skill: "...", color: "from-zinc-400/70 to-zinc-300/50" },
  { skill: "X", color: "from-neutral-400/70 to-neutral-300/50" },
]

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

function generateBubbles(levelConfig: LevelConfig): Bubble[] {
  const selectedSkills = shuffleArray(skillColors).slice(0, levelConfig.pairs)
  const pairs: Array<{skill: string, color: string, isFake: boolean}> = []
  
  // Add pairs
  selectedSkills.forEach(item => {
    pairs.push({ skill: item.skill, color: item.color, isFake: false })
    pairs.push({ skill: item.skill, color: item.color, isFake: false })
  })
  
  // Add fake bubbles
  if (levelConfig.hasFakes) {
    const fakes = shuffleArray(fakeSkills).slice(0, levelConfig.fakeCount)
    fakes.forEach(fake => {
      pairs.push({ skill: fake.skill, color: fake.color, isFake: true })
    })
  }
  
  const shuffled = shuffleArray(pairs)
  const cols = Math.ceil(Math.sqrt(shuffled.length * 1.5))
  
  return shuffled.map((item, index) => {
    const row = Math.floor(index / cols)
    const col = index % cols
    const baseX = 12 + col * (76 / cols)
    const baseY = 12 + row * 22
    
    return {
      id: index,
      skill: item.skill,
      color: item.color,
      x: baseX + (Math.random() - 0.5) * 8,
      y: baseY + (Math.random() - 0.5) * 6,
      size: 58 + Math.random() * 16,
      matched: false,
      isFake: item.isFake,
      velocityX: levelConfig.hasMovement ? (Math.random() - 0.5) * 0.3 : 0,
      velocityY: levelConfig.hasMovement ? (Math.random() - 0.5) * 0.3 : 0,
    }
  })
}

// Sound effects using Web Audio API
class SoundManager {
  private audioContext: AudioContext | null = null
  private enabled: boolean = true
  
  init() {
    if (typeof window !== 'undefined' && !this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)()
    }
  }
  
  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }
  
  isEnabled() {
    return this.enabled
  }
  
  playPop() {
    if (!this.enabled || !this.audioContext) return
    
    const ctx = this.audioContext
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15)
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
    
    oscillator.type = 'sine'
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.15)
  }
  
  playMatch() {
    if (!this.enabled || !this.audioContext) return
    
    const ctx = this.audioContext
    
    // Play two pleasant tones
    const frequencies = [523.25, 659.25] // C5, E5
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08)
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.3)
      
      oscillator.type = 'sine'
      oscillator.start(ctx.currentTime + i * 0.08)
      oscillator.stop(ctx.currentTime + i * 0.08 + 0.3)
    })
  }
  
  playCombo() {
    if (!this.enabled || !this.audioContext) return
    
    const ctx = this.audioContext
    const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06)
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.06)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.06 + 0.25)
      
      oscillator.type = 'triangle'
      oscillator.start(ctx.currentTime + i * 0.06)
      oscillator.stop(ctx.currentTime + i * 0.06 + 0.25)
    })
  }
  
  playError() {
    if (!this.enabled || !this.audioContext) return
    
    const ctx = this.audioContext
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.setValueAtTime(200, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1)
    
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
    
    oscillator.type = 'sawtooth'
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  }
  
  playLevelComplete() {
    if (!this.enabled || !this.audioContext) return
    
    const ctx = this.audioContext
    const frequencies = [523.25, 587.33, 659.25, 783.99, 1046.5] // C5, D5, E5, G5, C6
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.4)
      
      oscillator.type = 'sine'
      oscillator.start(ctx.currentTime + i * 0.1)
      oscillator.stop(ctx.currentTime + i * 0.1 + 0.4)
    })
  }
}

const soundManager = new SoundManager()

export default function SkillsPage() {
  // Game state
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'levelComplete' | 'gameOver' | 'gameWon'>('idle')
  const [currentLevel, setCurrentLevel] = useState(0)
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [selectedBubble, setSelectedBubble] = useState<Bubble | null>(null)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [particles, setParticles] = useState<Particle[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [shakeWrong, setShakeWrong] = useState<number | null>(null)
  const [showComboPopup, setShowComboPopup] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: number; startX: number; startY: number } | null>(null)
  const animationRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const levelConfig = LEVELS[currentLevel]

  // Initialize
  useEffect(() => {
    setMounted(true)
    soundManager.init()
    
    // Load high score from localStorage
    const saved = localStorage.getItem('bubbleGameHighScore')
    if (saved) setHighScore(parseInt(saved, 10))
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Sound toggle
  useEffect(() => {
    soundManager.setEnabled(soundEnabled)
  }, [soundEnabled])

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && levelConfig.hasTimer) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            setGameState('gameOver')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameState, levelConfig.hasTimer])

  // Moving bubbles animation
  useEffect(() => {
    if (gameState !== 'playing' || !levelConfig.hasMovement) return
    
    const animate = () => {
      setBubbles(prev => prev.map(bubble => {
        if (bubble.matched) return bubble
        
        let newX = bubble.x + (bubble.velocityX || 0)
        let newY = bubble.y + (bubble.velocityY || 0)
        let newVelX = bubble.velocityX || 0
        let newVelY = bubble.velocityY || 0
        
        // Bounce off walls
        if (newX < 8 || newX > 88) {
          newVelX = -newVelX
          newX = Math.max(8, Math.min(88, newX))
        }
        if (newY < 8 || newY > 85) {
          newVelY = -newVelY
          newY = Math.max(8, Math.min(85, newY))
        }
        
        return {
          ...bubble,
          x: newX,
          y: newY,
          velocityX: newVelX,
          velocityY: newVelY,
        }
      }))
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [gameState, levelConfig.hasMovement])

  // Create particles
  const createParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 60,
        color,
        scale: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * 360,
      })
    }
    setParticles(prev => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
    }, 600)
  }, [])

  // Start game
  const startGame = useCallback(() => {
    soundManager.init()
    setCurrentLevel(0)
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setBubbles(generateBubbles(LEVELS[0]))
    setTimeLeft(LEVELS[0].timeLimit)
    setGameState('playing')
    setSelectedBubble(null)
  }, [])

  // Next level
  const nextLevel = useCallback(() => {
    const nextLevelIndex = currentLevel + 1
    if (nextLevelIndex >= LEVELS.length) {
      // Game won
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem('bubbleGameHighScore', score.toString())
      }
      setGameState('gameWon')
    } else {
      setCurrentLevel(nextLevelIndex)
      setBubbles(generateBubbles(LEVELS[nextLevelIndex]))
      setTimeLeft(LEVELS[nextLevelIndex].timeLimit)
      setGameState('playing')
      setSelectedBubble(null)
    }
  }, [currentLevel, score, highScore])

  // Handle bubble click/match
  const handleBubbleClick = useCallback((bubble: Bubble) => {
    if (bubble.matched || gameState !== 'playing') return

    // Click on fake bubble
    if (bubble.isFake) {
      soundManager.playError()
      setCombo(0)
      setScore(prev => Math.max(0, prev - 5))
      setShakeWrong(bubble.id)
      setTimeout(() => setShakeWrong(null), 500)
      return
    }

    if (!selectedBubble) {
      soundManager.playPop()
      setSelectedBubble(bubble)
    } else if (selectedBubble.id === bubble.id) {
      setSelectedBubble(null)
    } else if (selectedBubble.skill === bubble.skill && !selectedBubble.isFake) {
      // Match found!
      const newCombo = combo + 1
      setCombo(newCombo)
      setMaxCombo(prev => Math.max(prev, newCombo))
      
      // Calculate points with combo multiplier
      const comboMultiplier = Math.min(newCombo, 5)
      const points = 10 * comboMultiplier
      setScore(prev => prev + points)
      
      if (newCombo >= 3) {
        soundManager.playCombo()
        setShowComboPopup(true)
        setTimeout(() => setShowComboPopup(false), 800)
      } else {
        soundManager.playMatch()
      }
      
      // Get bubble position for particles
      const container = containerRef.current
      if (container) {
        const rect = container.getBoundingClientRect()
        createParticles(
          (bubble.x / 100) * rect.width,
          (bubble.y / 100) * rect.height,
          bubble.color.includes('cyan') ? '#22d3ee' :
          bubble.color.includes('pink') ? '#f472b6' :
          bubble.color.includes('violet') ? '#a78bfa' :
          bubble.color.includes('amber') ? '#fbbf24' :
          bubble.color.includes('rose') ? '#fb7185' :
          bubble.color.includes('fuchsia') ? '#e879f9' :
          bubble.color.includes('orange') ? '#fb923c' : '#38bdf8'
        )
      }
      
      setBubbles(prev => prev.map(b => 
        b.id === bubble.id || b.id === selectedBubble.id 
          ? { ...b, matched: true } 
          : b
      ))
      setSelectedBubble(null)
      
      // Check if level is complete
      const remainingPairs = bubbles.filter(b => !b.matched && !b.isFake && b.id !== bubble.id && b.id !== selectedBubble.id)
      if (remainingPairs.length === 0) {
        if (timerRef.current) clearInterval(timerRef.current)
        soundManager.playLevelComplete()
        
        // Level complete bonus
        const levelBonus = 20 + (currentLevel * 10)
        const timeBonus = levelConfig.hasTimer ? Math.floor(timeLeft * 2) : 0
        setScore(prev => prev + levelBonus + timeBonus)
        
        setTimeout(() => setGameState('levelComplete'), 600)
      }
    } else {
      // No match
      soundManager.playError()
      setCombo(0)
      setSelectedBubble(null)
    }
  }, [selectedBubble, bubbles, gameState, combo, createParticles, currentLevel, levelConfig.hasTimer, timeLeft])

  // Drag handlers
  const handleDragStart = useCallback((e: React.PointerEvent, bubble: Bubble) => {
    if (bubble.matched || gameState !== 'playing') return
    e.preventDefault()
    dragRef.current = { id: bubble.id, startX: e.clientX, startY: e.clientY }
    soundManager.playPop()
  }, [gameState])

  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current || !containerRef.current) return
    
    const container = containerRef.current.getBoundingClientRect()
    const deltaX = ((e.clientX - dragRef.current.startX) / container.width) * 100
    const deltaY = ((e.clientY - dragRef.current.startY) / container.height) * 100
    
    setBubbles(prev => prev.map(b => {
      if (b.id === dragRef.current?.id) {
        return {
          ...b,
          x: Math.max(8, Math.min(88, b.x + deltaX)),
          y: Math.max(8, Math.min(85, b.y + deltaY)),
        }
      }
      return b
    }))
    
    dragRef.current.startX = e.clientX
    dragRef.current.startY = e.clientY
  }, [])

  const handleDragEnd = useCallback(() => {
    if (!dragRef.current) return
    
    const draggedBubble = bubbles.find(b => b.id === dragRef.current?.id)
    if (!draggedBubble || draggedBubble.matched || draggedBubble.isFake) {
      if (draggedBubble?.isFake) {
        soundManager.playError()
        setCombo(0)
        setScore(prev => Math.max(0, prev - 5))
      }
      dragRef.current = null
      return
    }
    
    // Check for collision with matching bubble
    const matchingBubble = bubbles.find(b => 
      b.id !== draggedBubble.id && 
      !b.matched && 
      !b.isFake &&
      b.skill === draggedBubble.skill &&
      Math.abs(b.x - draggedBubble.x) < 15 &&
      Math.abs(b.y - draggedBubble.y) < 15
    )
    
    if (matchingBubble) {
      const newCombo = combo + 1
      setCombo(newCombo)
      setMaxCombo(prev => Math.max(prev, newCombo))
      
      const comboMultiplier = Math.min(newCombo, 5)
      const points = 10 * comboMultiplier
      setScore(prev => prev + points)
      
      if (newCombo >= 3) {
        soundManager.playCombo()
        setShowComboPopup(true)
        setTimeout(() => setShowComboPopup(false), 800)
      } else {
        soundManager.playMatch()
      }
      
      const container = containerRef.current
      if (container) {
        const rect = container.getBoundingClientRect()
        createParticles(
          (draggedBubble.x / 100) * rect.width,
          (draggedBubble.y / 100) * rect.height,
          draggedBubble.color.includes('cyan') ? '#22d3ee' : '#f472b6'
        )
      }
      
      setBubbles(prev => prev.map(b => 
        b.id === draggedBubble.id || b.id === matchingBubble.id 
          ? { ...b, matched: true } 
          : b
      ))
      
      const remainingPairs = bubbles.filter(b => 
        !b.matched && !b.isFake && b.id !== draggedBubble.id && b.id !== matchingBubble.id
      )
      if (remainingPairs.length === 0) {
        if (timerRef.current) clearInterval(timerRef.current)
        soundManager.playLevelComplete()
        
        const levelBonus = 20 + (currentLevel * 10)
        const timeBonus = levelConfig.hasTimer ? Math.floor(timeLeft * 2) : 0
        setScore(prev => prev + levelBonus + timeBonus)
        
        setTimeout(() => setGameState('levelComplete'), 600)
      }
    }
    
    dragRef.current = null
  }, [bubbles, combo, createParticles, currentLevel, levelConfig.hasTimer, timeLeft])

  // Restart game
  const restartGame = useCallback(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('bubbleGameHighScore', score.toString())
    }
    startGame()
  }, [score, highScore, startGame])

  return (
    <PageTransition>
      <section className="min-h-screen px-4 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100/60 text-sm text-foreground/80 mb-6"
            >
              <Sparkles size={14} className="text-cyan-500" />
              <span>Beceri Eslestirme Oyunu</span>
            </motion.div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-balance">
              Becerilerim
            </h1>
          </motion.div>

          {/* Game Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard className="relative overflow-hidden p-0" style={{ minHeight: '560px' }}>
              {/* Background decorations */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-violet-200/30 to-pink-200/30 blur-3xl" />
                <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-200/30 to-sky-200/30 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-3xl" />
              </div>

              {/* HUD - Only show during gameplay */}
              {gameState === 'playing' && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-4 border-b border-white/20 bg-white/30 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/50">
                      <Star size={16} className="text-amber-500" />
                      <span className="font-semibold text-sm">Seviye {levelConfig.level}</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/50">
                      <Trophy size={16} className="text-amber-500" />
                      <span className="font-semibold text-sm">{score}</span>
                    </div>
                    {combo > 1 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-400/80 to-rose-400/80 text-white"
                      >
                        <Zap size={14} />
                        <span className="font-bold text-sm">x{Math.min(combo, 5)}</span>
                      </motion.div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {levelConfig.hasTimer && (
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${timeLeft <= 10 ? 'bg-rose-100 text-rose-600' : 'bg-white/50'}`}>
                        <Clock size={16} className={timeLeft <= 10 ? 'text-rose-500' : 'text-gray-500'} />
                        <span className="font-semibold text-sm">{timeLeft}s</span>
                      </div>
                    )}
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="p-2 rounded-xl bg-white/50 hover:bg-white/70 transition-colors"
                    >
                      {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Start Screen */}
              <AnimatePresence>
                {gameState === 'idle' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-md"
                  >
                    <div className="text-center px-6 max-w-md">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-400 to-violet-400 flex items-center justify-center mb-6 shadow-lg"
                      >
                        <Sparkles size={48} className="text-white" />
                      </motion.div>
                      <h2 className="font-serif text-3xl font-semibold mb-3">Beceri Eslestirme</h2>
                      <p className="text-muted-foreground mb-2">
                        Ayni renkteki baloncuklari surukleyerek veya tiklayarak eslestirin!
                      </p>
                      <p className="text-sm text-muted-foreground/70 mb-6">
                        5 seviye, artan zorluk, combo sistemi ve daha fazlasi...
                      </p>
                      {highScore > 0 && (
                        <p className="text-sm text-amber-600 font-medium mb-4">
                          En Yuksek Skor: {highScore}
                        </p>
                      )}
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={startGame}
                          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
                        >
                          <Play size={20} />
                          Oyunu Baslat
                        </motion.button>
                        <button
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/60 hover:bg-white/80 transition-colors"
                        >
                          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                          <span className="text-sm">{soundEnabled ? 'Ses Acik' : 'Ses Kapali'}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Level Complete Screen */}
              <AnimatePresence>
                {gameState === 'levelComplete' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-30 flex items-center justify-center bg-white/70 backdrop-blur-md"
                  >
                    <div className="text-center px-6">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center mb-4 shadow-lg"
                      >
                        <Trophy size={40} className="text-white" />
                      </motion.div>
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="font-serif text-3xl font-semibold mb-2"
                      >
                        Seviye Tamamlandi!
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-muted-foreground mb-4"
                      >
                        {levelConfig.name} seviyesini basariyla tamamladiniz!
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-center gap-6 mb-6"
                      >
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{score}</p>
                          <p className="text-xs text-muted-foreground">Toplam Skor</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-500">x{maxCombo}</p>
                          <p className="text-xs text-muted-foreground">Maks Combo</p>
                        </div>
                      </motion.div>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextLevel}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold shadow-lg"
                      >
                        Sonraki Seviye
                        <ChevronRight size={20} />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Game Over Screen */}
              <AnimatePresence>
                {gameState === 'gameOver' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-30 flex items-center justify-center bg-white/70 backdrop-blur-md"
                  >
                    <div className="text-center px-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center mb-4 shadow-lg"
                      >
                        <X size={40} className="text-white" />
                      </motion.div>
                      <h2 className="font-serif text-3xl font-semibold mb-2">Sure Doldu!</h2>
                      <p className="text-muted-foreground mb-4">Seviye {levelConfig.level} - {levelConfig.name}</p>
                      <div className="flex justify-center gap-6 mb-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-foreground">{score}</p>
                          <p className="text-xs text-muted-foreground">Skor</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-amber-500">{highScore}</p>
                          <p className="text-xs text-muted-foreground">En Yuksek</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={restartGame}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold shadow-lg"
                      >
                        <RotateCcw size={18} />
                        Tekrar Dene
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Game Won Screen */}
              <AnimatePresence>
                {gameState === 'gameWon' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-30 flex items-center justify-center bg-gradient-to-br from-amber-50/90 via-white/90 to-cyan-50/90 backdrop-blur-md"
                  >
                    <div className="text-center px-6">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                        className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-xl"
                      >
                        <Trophy size={48} className="text-white" />
                      </motion.div>
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="font-serif text-4xl font-semibold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
                      >
                        Tebrikler!
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground mb-6"
                      >
                        Tum seviyeleri basariyla tamamladiniz!
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex justify-center gap-8 mb-8"
                      >
                        <div className="text-center">
                          <p className="text-3xl font-bold text-foreground">{score}</p>
                          <p className="text-sm text-muted-foreground">Final Skor</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-orange-500">x{maxCombo}</p>
                          <p className="text-sm text-muted-foreground">Maks Combo</p>
                        </div>
                      </motion.div>
                      {score >= highScore && score > 0 && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-amber-600 font-semibold mb-4"
                        >
                          Yeni Rekor!
                        </motion.p>
                      )}
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={restartGame}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg"
                      >
                        <RotateCcw size={18} />
                        Tekrar Oyna
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Combo Popup */}
              <AnimatePresence>
                {showComboPopup && combo >= 3 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-none"
                  >
                    <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-2xl shadow-xl">
                      COMBO x{Math.min(combo, 5)}!
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Particles */}
              <AnimatePresence>
                {particles.map(particle => (
                  <motion.div
                    key={particle.id}
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 0, opacity: 0, y: particle.y - 50 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute pointer-events-none z-15"
                    style={{
                      left: particle.x,
                      top: particle.y,
                      width: 12 * particle.scale,
                      height: 12 * particle.scale,
                      borderRadius: '50%',
                      backgroundColor: particle.color,
                      transform: `rotate(${particle.rotation}deg)`,
                    }}
                  />
                ))}
              </AnimatePresence>

              {/* Bubbles Container */}
              <div 
                ref={containerRef}
                className="relative w-full touch-none p-4"
                style={{ height: gameState === 'playing' ? '480px' : '500px' }}
                onPointerMove={handleDragMove}
                onPointerUp={handleDragEnd}
                onPointerLeave={handleDragEnd}
              >
                {mounted && gameState === 'playing' && bubbles.map((bubble) => (
                  <motion.div
                    key={bubble.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: bubble.matched ? [1, 1.3, 0] : 1, 
                      opacity: bubble.matched ? [1, 1, 0] : 1,
                      y: selectedBubble?.id === bubble.id ? -8 : 0,
                      x: shakeWrong === bubble.id ? [0, -5, 5, -5, 5, 0] : 0,
                    }}
                    transition={{
                      scale: bubble.matched 
                        ? { duration: 0.4, times: [0, 0.5, 1] }
                        : { duration: 0.4, delay: bubble.id * 0.03 },
                      opacity: { duration: 0.3 },
                      x: { duration: 0.4 },
                    }}
                    className={`absolute cursor-grab active:cursor-grabbing select-none ${bubble.isFake ? 'opacity-70' : ''}`}
                    style={{
                      left: `${bubble.x}%`,
                      top: `${bubble.y}%`,
                      width: bubble.size,
                      height: bubble.size,
                      marginLeft: -bubble.size / 2,
                      marginTop: -bubble.size / 2,
                      zIndex: selectedBubble?.id === bubble.id ? 20 : 10,
                    }}
                    onPointerDown={(e) => handleDragStart(e, bubble)}
                    onClick={() => handleBubbleClick(bubble)}
                  >
                    <div
                      className={`w-full h-full rounded-full bg-gradient-to-br ${bubble.color} backdrop-blur-md border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedBubble?.id === bubble.id 
                          ? 'border-foreground/60 shadow-2xl scale-115' 
                          : bubble.isFake
                            ? 'border-gray-300/50 shadow-md hover:scale-102'
                            : 'border-white/50 shadow-lg hover:scale-105 hover:shadow-xl'
                      }`}
                      style={{
                        boxShadow: selectedBubble?.id === bubble.id
                          ? '0 20px 50px rgba(0,0,0,0.2), inset 0 -5px 20px rgba(255,255,255,0.4), inset 0 5px 10px rgba(255,255,255,0.6)' 
                          : '0 8px 32px rgba(0,0,0,0.1), inset 0 -3px 15px rgba(255,255,255,0.3), inset 0 3px 8px rgba(255,255,255,0.5)',
                      }}
                    >
                      {/* Shine effect */}
                      <div 
                        className="absolute top-2 left-3 w-4 h-4 rounded-full bg-white/50 blur-sm"
                        style={{ width: bubble.size * 0.15, height: bubble.size * 0.15 }}
                      />
                      <span className={`font-semibold text-center text-xs sm:text-sm px-1 ${bubble.isFake ? 'text-gray-500' : 'text-foreground/90'}`}>
                        {bubble.skill}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Level indicator during game */}
              {gameState === 'playing' && (
                <div className="absolute bottom-4 left-4 z-20">
                  <p className="text-xs text-muted-foreground/70">{levelConfig.description}</p>
                </div>
              )}

              {/* Mobile score display */}
              {gameState === 'playing' && (
                <div className="sm:hidden absolute bottom-4 right-4 z-20">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/50 backdrop-blur-sm">
                    <Trophy size={14} className="text-amber-500" />
                    <span className="font-semibold text-sm">{score}</span>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Skill Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid sm:grid-cols-3 gap-6 mt-12"
          >
            {[
              { title: "Oyun Gelistirme", skills: ["Unity", "C#", "Game Design"], color: "bg-violet-400" },
              { title: "Mobil Gelistirme", skills: ["Flutter", "Dart", "UI/UX"], color: "bg-cyan-400" },
              { title: "Veri & Backend", skills: ["Python", "SQL", "Git"], color: "bg-rose-400" },
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <GlassCard className="text-center">
                  <div className={`w-3 h-3 rounded-full ${category.color} mx-auto mb-3`} />
                  <h3 className="font-serif text-lg font-semibold mb-3">{category.title}</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-white/60 text-xs font-medium text-foreground/70"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
