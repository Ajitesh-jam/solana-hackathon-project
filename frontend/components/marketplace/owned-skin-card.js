"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tag, Info, X } from "lucide-react"

export default function OwnedSkinCard({ skin, onSell }) {
  const [isHovered, setIsHovered] = useState(false)
  const [showSellModal, setShowSellModal] = useState(false)
  const [sellPrice, setSellPrice] = useState(Math.floor(skin.price * 0.9)) // Default to 10% less than original
  const [error, setError] = useState("")

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

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setSellPrice(value)

    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid price")
    } else if (value > skin.price * 2) {
      setError("Price is too high (max 2x original price)")
    } else {
      setError("")
    }
  }

  const handleSellSubmit = () => {
    if (error) return

    onSell(skin, sellPrice)
    setShowSellModal(false)
  }

  return (
    <>
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
              <span className="text-sm text-gray-400">Original Price:</span>
              <span className="ml-2 font-medium">{Number(skin.price).toFixed(3)} tokens</span>
            </div>
            <Button
              onClick={() => setShowSellModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Tag className="mr-2 h-4 w-4" />
              Sell
            </Button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSellModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={() => setShowSellModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Sell {skin.name}</h3>
                <button
                  onClick={() => setShowSellModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 relative rounded-md overflow-hidden mr-4">
                    <Image src={skin.image || "/cod.png"} alt={skin.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-medium">{skin.name}</h4>
                    <p className="text-sm text-gray-400">
                      {skin.rarity} {skin.type}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-300 mb-2">
                    When your skin sells, 10% of the sale will go to the game company and you'll receive 90%.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>Original Price:</span>
                    <span>{Number(skin.price).toFixed(3)} tokens</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Recommended Price:</span>
                    <span>{Number(skin.price * 0.9).toFixed(3)} tokens</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Your Selling Price</label>
                  <Input
                    type="number"
                    value={sellPrice}
                    onChange={handlePriceChange}
                    min="0.00001"
                    step="0.00001"
                    className={error ? "border-red-500" : ""}
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="flex justify-between text-sm mt-2">
                    <span>You'll receive:</span>
                    <span className="font-medium">{Number(sellPrice * 0.9).toFixed(3)} tokens (90%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Game company receives:</span>
                    <span>{Number(sellPrice * 0.1).toFixed(3)} tokens (10%)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 border-gray-700" onClick={() => setShowSellModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={handleSellSubmit}
                  disabled={!!error}
                >
                  List for Sale
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
