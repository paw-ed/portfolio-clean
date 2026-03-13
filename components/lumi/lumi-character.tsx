"use client"

import { motion, AnimatePresence } from "framer-motion"

interface LumiCharacterProps {
  state: "floating" | "sitting" | "talking" | "waving"
  size?: number
}

export function LumiCharacter({ state, size = 80 }: LumiCharacterProps) {
  const isFloating = state === "floating" || state === "waving"
  const isTalking = state === "talking"
  const isSitting = state === "sitting"

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={isFloating ? {
        y: [0, -8, 0],
      } : isSitting ? {
        y: 0,
        rotate: [-2, 2, -2],
      } : {
        y: 0,
      }}
      transition={{
        duration: isFloating ? 3 : 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Cape */}
        <motion.path
          d="M30 45 C25 50, 20 70, 25 85 L50 80 L75 85 C80 70, 75 50, 70 45 L50 50 Z"
          fill="url(#capeGradient)"
          animate={{
            d: isFloating 
              ? [
                  "M30 45 C25 50, 20 70, 25 85 L50 80 L75 85 C80 70, 75 50, 70 45 L50 50 Z",
                  "M28 45 C23 55, 18 72, 23 87 L50 82 L77 87 C82 72, 77 55, 72 45 L50 50 Z",
                  "M30 45 C25 50, 20 70, 25 85 L50 80 L75 85 C80 70, 75 50, 70 45 L50 50 Z",
                ]
              : undefined
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Body - Robot torso */}
        <ellipse cx="50" cy="55" rx="22" ry="25" fill="url(#bodyGradient)" />
        
        {/* Glass effect overlay on body */}
        <ellipse cx="50" cy="55" rx="20" ry="23" fill="url(#glassOverlay)" opacity="0.5" />

        {/* Chest detail */}
        <ellipse cx="50" cy="52" rx="8" ry="6" fill="url(#chestGlow)" opacity="0.7" />

        {/* Head */}
        <circle cx="50" cy="30" r="20" fill="url(#headGradient)" />
        
        {/* Glass effect on head */}
        <circle cx="50" cy="30" r="18" fill="url(#glassOverlay)" opacity="0.4" />

        {/* Hair/Antenna tuft */}
        <motion.path
          d="M45 12 Q50 5 55 12"
          stroke="url(#hairGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              "M45 12 Q50 5 55 12",
              "M44 11 Q50 3 56 11",
              "M45 12 Q50 5 55 12",
            ]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Blush circles */}
        <circle cx="35" cy="33" r="4" fill="#FFD1DC" opacity="0.6" />
        <circle cx="65" cy="33" r="4" fill="#FFD1DC" opacity="0.6" />

        {/* Eyes */}
        <AnimatePresence mode="wait">
          {isTalking || state === "waving" ? (
            <>
              {/* Happy/talking eyes */}
              <motion.ellipse
                key="leftEyeHappy"
                cx="42"
                cy="28"
                rx="5"
                ry="6"
                fill="#2D2D2D"
                initial={{ scaleY: 0.3 }}
                animate={{ scaleY: 1 }}
              />
              <motion.ellipse
                key="rightEyeHappy"
                cx="58"
                cy="28"
                rx="5"
                ry="6"
                fill="#2D2D2D"
                initial={{ scaleY: 0.3 }}
                animate={{ scaleY: 1 }}
              />
              {/* Eye sparkles */}
              <circle cx="44" cy="26" r="2" fill="white" />
              <circle cx="60" cy="26" r="2" fill="white" />
              <circle cx="41" cy="29" r="1" fill="white" opacity="0.6" />
              <circle cx="57" cy="29" r="1" fill="white" opacity="0.6" />
            </>
          ) : (
            <>
              {/* Normal eyes with blink */}
              <motion.ellipse
                key="leftEyeNormal"
                cx="42"
                cy="28"
                rx="5"
                ry="6"
                fill="#2D2D2D"
                animate={{
                  scaleY: [1, 1, 0.1, 1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  times: [0, 0.45, 0.5, 0.55, 1],
                }}
              />
              <motion.ellipse
                key="rightEyeNormal"
                cx="58"
                cy="28"
                rx="5"
                ry="6"
                fill="#2D2D2D"
                animate={{
                  scaleY: [1, 1, 0.1, 1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  times: [0, 0.45, 0.5, 0.55, 1],
                }}
              />
              {/* Eye sparkles */}
              <circle cx="44" cy="26" r="2" fill="white" />
              <circle cx="60" cy="26" r="2" fill="white" />
            </>
          )}
        </AnimatePresence>

        {/* Mouth */}
        <motion.path
          d={isTalking 
            ? "M44 37 Q50 42 56 37" 
            : "M45 36 Q50 40 55 36"
          }
          stroke="#2D2D2D"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          animate={isTalking ? {
            d: [
              "M44 37 Q50 42 56 37",
              "M44 37 Q50 44 56 37",
              "M44 37 Q50 42 56 37",
            ]
          } : undefined}
          transition={{ duration: 0.3, repeat: Infinity }}
        />

        {/* Arms */}
        {state === "waving" ? (
          <>
            <motion.ellipse
              cx="25"
              cy="55"
              rx="6"
              ry="8"
              fill="url(#bodyGradient)"
            />
            <motion.ellipse
              cx="78"
              cy="45"
              rx="6"
              ry="8"
              fill="url(#bodyGradient)"
              animate={{ rotate: [0, 15, 0, -15, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ originX: "75px", originY: "55px" }}
            />
          </>
        ) : (
          <>
            <ellipse cx="25" cy="55" rx="6" ry="8" fill="url(#bodyGradient)" />
            <ellipse cx="75" cy="55" rx="6" ry="8" fill="url(#bodyGradient)" />
          </>
        )}

        {/* Legs (when sitting) */}
        {isSitting && (
          <>
            <ellipse cx="40" cy="78" rx="6" ry="4" fill="url(#bodyGradient)" />
            <ellipse cx="60" cy="78" rx="6" ry="4" fill="url(#bodyGradient)" />
          </>
        )}

        {/* Gradients */}
        <defs>
          <linearGradient id="capeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8D5F2" />
            <stop offset="50%" stopColor="#D4E5F7" />
            <stop offset="100%" stopColor="#FFE5EC" />
          </linearGradient>
          
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8F9FA" />
            <stop offset="100%" stopColor="#E9ECEF" />
          </linearGradient>
          
          <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F1F3F4" />
          </linearGradient>
          
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4B5E5" />
            <stop offset="100%" stopColor="#B8D4E8" />
          </linearGradient>
          
          <radialGradient id="glassOverlay" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          
          <radialGradient id="chestGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B8E0F7" />
            <stop offset="100%" stopColor="#D4E5F7" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  )
}
