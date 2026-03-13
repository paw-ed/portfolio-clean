"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: React.ReactNode
  className?: string
  hoverGlow?: boolean
  glowColor?: string
}

export function GlassCard({
  children,
  className,
  hoverGlow = false,
  glowColor = "rgba(200, 180, 230, 0.3)",
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "glass-card rounded-3xl p-6 transition-all duration-300",
        hoverGlow && "hover:shadow-[0_8px_40px_var(--glow-color)]",
        className
      )}
      style={{ "--glow-color": glowColor } as React.CSSProperties}
      whileHover={hoverGlow ? { scale: 1.02, y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
