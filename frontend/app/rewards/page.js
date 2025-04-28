"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Trophy, Coins, ArrowRight, Gift } from "lucide-react"
import RewardCard from "@/components/reward-card"

export default function RewardsPage() {
  const { toast } = useToast()

  // Mock rewards data
  const rewards = [
    {
      id: 1,
      gameId: "solana-battleground",
      gameName: "Solana Battleground",
      amount: 150,
      date: "2023-04-28",
      opponent: "CryptoWarrior",
      claimed: false,
    },
    {
      id: 2,
      gameId: "solana-ops",
      gameName: "Solana Ops",
      amount: 75,
      date: "2023-04-25",
      opponent: "BlockchainNinja",
      claimed: false,
    },
    {
      id: 3,
      gameId: "call-of-duty",
      gameName: "Call of Duty",
      amount: 200,
      date: "2023-04-20",
      opponent: "SolanaKing",
      claimed: true,
    },
  ]

  const handleClaimReward = (rewardId) => {
    // This is where you would implement the claim logic
    toast({
      title: "Reward Claimed!",
      description: "Your tokens have been transferred to your wallet",
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  const totalRewards = rewards.reduce((sum, reward) => sum + (reward.claimed ? 0 : reward.amount), 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          Your Rewards
        </h1>
        <p className="text-gray-300">Claim your hard-earned rewards from your victories</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-lg p-6 border border-yellow-800/50 col-span-1 lg:col-span-2"
        >
          <div className="flex items-center mb-4">
            <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
            <h2 className="text-2xl font-bold text-yellow-400">Champion's Rewards</h2>
          </div>
          <p className="text-gray-300 mb-6">
            Congratulations on your victories! You've earned rewards by defeating your opponents in various games. Claim
            your rewards now and continue your winning streak.
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Available to claim</p>
              <p className="text-3xl font-bold text-white flex items-center">
                <Coins className="w-6 h-6 mr-2 text-yellow-400" />
                {totalRewards} Tokens
              </p>
            </div>
            <Button
              disabled={totalRewards === 0}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
            >
              Claim All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-6 border border-purple-800/50"
        >
          <div className="flex items-center mb-4">
            <Gift className="w-8 h-8 mr-3 text-purple-400" />
            <h2 className="text-2xl font-bold text-purple-400">Bonus Rewards</h2>
          </div>
          <p className="text-gray-300 mb-6">Complete special challenges to earn bonus rewards and exclusive items.</p>
          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
            View Challenges
          </Button>
        </motion.div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Your Reward History</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <motion.div key={reward.id} variants={itemVariants}>
              <RewardCard reward={reward} onClaim={() => handleClaimReward(reward.id)} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
