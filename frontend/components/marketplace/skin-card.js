"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Info } from "lucide-react"

export default function SkinCard({ skin, onBuy }) {
  const [isHovered, setIsHovered] = useState(false)

  // Determine badge color based on rarity
  const getBadgeColor = (rarity) => {
    switch (rarity.toLowerCase()) {
      case "legendary":
        return "bg-gradient-to-r from-yellow-500 to-amber-500"
      case "epic":
        return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "rare":
        return "bg-gradient-to-r from-blue-500 to-cyan-500"
      case "uncommon":
        return "bg-gradient-to-r from-green-500 to-emerald-500"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500"
    }
  }

  return (
    <motion.div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-colors group"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={skin.image || "/cod.png"}
          alt={skin.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute top-2 left-2 z-10">
          <Badge className={`${getBadgeColor(skin.rarity)} text-white`}>{skin.rarity}</Badge>
        </div>
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-gray-700 text-white">{skin.type}</Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold mb-1 text-white">{skin.name}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{skin.description}</p>

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="text-sm text-gray-400">Game:</span>
            <span className="ml-2 text-sm font-medium">
              {skin.gameId === "solana-battleground"
                ? "Solana Battleground"
                : skin.gameId === "solana-ops"
                  ? "Solana Ops"
                  : skin.gameId === "call-of-duty"
                    ? "Call of Duty"
                    : skin.gameId}
            </span>
          </div>
        </div>
        

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">{skin.price}</span>
            <span className="ml-1 text-gray-400">tokens</span>
          </div>
          <Button
            onClick={onBuy}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy
          </Button>
        </div>
      </div>

      {/* <motion.div
        className="absolute inset-0 bg-black/70 flex items-center justify-center p-6 opacity-0 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-center">
          <Info className="h-8 w-8 mx-auto mb-4 text-purple-400" />
          <h3 className="text-lg font-bold mb-2 text-white">{skin.name}</h3>
          <p className="text-gray-300 mb-4">{skin.description}</p>
          <Button
            onClick={onBuy}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy for {skin.price} tokens
          </Button>
        </div>
      </motion.div> */}
    </motion.div>
  )
}
