"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface Sphere {
  id: number
  x: number
  y: number
  size: number
  color: string
  delay: number
}

const PASTEL_COLORS = [
  "rgba(200, 180, 230, 0.4)", // lavender
  "rgba(180, 220, 240, 0.4)", // cyan
  "rgba(255, 200, 210, 0.35)", // pink
  "rgba(255, 220, 200, 0.35)", // peach
  "rgba(200, 210, 240, 0.4)", // pale blue
]

export function FloatingBackground() {
  const [spheres, setSpheres] = useState<Sphere[]>([])
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 })

  useEffect(() => {
    const generatedSpheres: Sphere[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 100 + Math.random() * 200,
      color: PASTEL_COLORS[i % PASTEL_COLORS.length],
      delay: i * 0.5,
    }))
    setSpheres(generatedSpheres)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 30)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 30)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {spheres.map((sphere) => (
        <motion.div
          key={sphere.id}
          className="absolute rounded-full"
          style={{
            left: `${sphere.x}%`,
            top: `${sphere.y}%`,
            width: sphere.size,
            height: sphere.size,
            background: `radial-gradient(circle at 30% 30%, ${sphere.color}, transparent 70%)`,
            filter: "blur(40px)",
            x: springX,
            y: springY,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -20, 0],
          }}
          transition={{
            opacity: { duration: 1, delay: sphere.delay * 0.2 },
            scale: { duration: 1.5, delay: sphere.delay * 0.2 },
            y: {
              duration: 6 + sphere.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      ))}
    </div>
  )
}
