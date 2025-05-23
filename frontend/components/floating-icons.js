"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function FloatingIcons() {
  const [icons, setIcons] = useState([])

  useEffect(() => {
    // Gaming icons to float around
    const iconTypes = ["🎮", "🎯", "🏆", "🎲", "🎪", "🎭", "🎨", "🎧", "🎬", "🎰"]

    // Create random positions for icons
    const newIcons = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      icon: iconTypes[Math.floor(Math.random() * iconTypes.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))

    setIcons(newIcons)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {icons.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute text-2xl opacity-20"
          initial={{
            x: `${icon.x}vw`,
            y: `${icon.y}vh`,
            scale: icon.size,
          }}
          animate={{
            x: [`${icon.x}vw`, `${(icon.x + 20) % 100}vw`, `${(icon.x - 10) % 100}vw`, `${icon.x}vw`],
            y: [`${icon.y}vh`, `${(icon.y - 20) % 100}vh`, `${(icon.y + 10) % 100}vh`, `${icon.y}vh`],
          }}
          transition={{
            duration: icon.duration,
            delay: icon.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {icon.icon}
        </motion.div>
      ))}
    </div>
  )
}