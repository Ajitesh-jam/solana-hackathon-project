"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Trophy, Coins, Check } from "lucide-react"

export default function RewardCard({ reward, onClaim }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`bg-gradient-to-br ${
        reward.claimed
          ? "from-gray-800/30 to-gray-800/30 border-gray-700"
          : "from-yellow-900/30 to-orange-900/30 border-yellow-800/50 animate-glow"
      } rounded-lg overflow-hidden border transition-colors`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-lg">{reward.gameName}</h3>
            <p className="text-sm text-gray-400">vs {reward.opponent}</p>
          </div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              reward.claimed ? "bg-gray-700" : "bg-yellow-500/20"
            }`}
          >
            <Trophy className={`h-5 w-5 ${reward.claimed ? "text-gray-400" : "text-yellow-400"}`} />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-gray-400">Reward</p>
            <p className="text-xl font-bold flex items-center">
              <Coins className={`h-4 w-4 mr-1 ${reward.claimed ? "text-gray-400" : "text-yellow-400"}`} />
              {reward.amount}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Date</p>
            <p className="font-medium">{formatDate(reward.date)}</p>
          </div>
        </div>

        {reward.claimed ? (
          <Button disabled className="w-full bg-gray-700 text-gray-300 cursor-not-allowed">
            <Check className="mr-2 h-4 w-4" /> Claimed
          </Button>
        ) : (
          <Button
            onClick={() => onClaim(reward.id)}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
          >
            Claim Reward
          </Button>
        )}
      </div>
    </motion.div>
  )
}
