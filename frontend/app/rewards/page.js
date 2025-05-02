"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Trophy, Award, CheckCircle } from "lucide-react"

// Mock rewards data
const mockRewards = [
  { id: 1, game: "Solana Battlefield", amount: 150, date: "2023-05-15", claimed: false },
  { id: 2, game: "Solana Ops", amount: 75, date: "2023-05-10", claimed: true },
  { id: 3, game: "Call of Duty", amount: 200, date: "2023-05-05", claimed: false },
]

export default function RewardsPage() {
  const [rewards, setRewards] = useState(mockRewards)

  const handleClaim = (id) => {
    setRewards(rewards.map((reward) => (reward.id === id ? { ...reward, claimed: true } : reward)))
  }

  const totalUnclaimed = rewards.filter((reward) => !reward.claimed).reduce((sum, reward) => sum + reward.amount, 0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Your Rewards</h1>
          <p className="text-gray-400 text-lg">Claim your hard-earned rewards from your gaming victories!</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-8 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <Trophy className="h-12 w-12 text-yellow-400 mr-4" />
              <div>
                <h2 className="text-2xl font-bold">Total Unclaimed Rewards</h2>
                <p className="text-3xl font-bold text-yellow-400">{totalUnclaimed} SOL</p>
              </div>
            </div>

            <Button
              className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-lg py-6 px-8"
              disabled={totalUnclaimed === 0}
              onClick={() => {
                setRewards(rewards.map((reward) => ({ ...reward, claimed: true })))
              }}
            >
              Claim All Rewards
            </Button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6">Reward History</h2>

          <div className="space-y-4">
            {rewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between"
              >
                <div>
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-purple-400 mr-2" />
                    <h3 className="font-semibold text-lg">{reward.game}</h3>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-400">
                    <span>{new Date(reward.date).toLocaleDateString()}</span>
                    <span className="font-bold text-yellow-400">{reward.amount} SOL</span>
                  </div>
                </div>

                {reward.claimed ? (
                  <div className="flex items-center text-green-400 mt-4 sm:mt-0">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>Claimed</span>
                  </div>
                ) : (
                  <Button
                    className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 mt-4 sm:mt-0"
                    onClick={() => handleClaim(reward.id)}
                  >
                    Claim Reward
                  </Button>
                )}
              </motion.div>
            ))}

            {rewards.length === 0 && (
              <div className="text-center py-12 bg-gray-800/50 rounded-lg">
                <Trophy className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg">No rewards yet. Play games to earn rewards!</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 bg-gray-800/50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Win More?</h2>
          <p className="text-gray-400 mb-6">Jump back into the action and earn more rewards!</p>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6 px-8">
            Play Now
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
