"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Wallet, User, Trophy, Clock, Edit } from "lucide-react"

export default function ProfilePage() {
  // Mock user data
  const [user, setUser] = useState({
    name: "CryptoGamer",
    image: "/placeholder.svg?height=200&width=200",
    wallet: "0x1a2b...3c4d",
    tokens: 1250,
    joinedDate: "2023-01-15",
    gamesPlayed: 42,
    wins: 28,
    losses: 14,
  })

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
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-8 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="rounded-full overflow-hidden h-32 w-32 border-4 border-purple-500">
                <Image
                  src={user.image || "/placeholder.svg"}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 hover:bg-purple-700">
                <Edit className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <div className="flex flex-col md:flex-row gap-4 text-gray-400">
                <div className="flex items-center justify-center md:justify-start">
                  <Wallet className="h-4 w-4 mr-2 text-purple-400" />
                  <span>{user.wallet}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Clock className="h-4 w-4 mr-2 text-purple-400" />
                  <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 flex items-center">
              <Wallet className="h-6 w-6 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Balance</p>
                <p className="text-xl font-bold">{user.tokens} SOL</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants} className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
              Stats
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Games Played</span>
                <span className="font-bold">{user.gamesPlayed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Wins</span>
                <span className="font-bold text-green-400">{user.wins}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Losses</span>
                <span className="font-bold text-red-400">{user.losses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Win Rate</span>
                <span className="font-bold">{Math.round((user.wins / user.gamesPlayed) * 100)}%</span>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-400 bg-green-900/30">
                        Win Rate
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-green-400">
                        {Math.round((user.wins / user.gamesPlayed) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                    <div
                      style={{ width: `${Math.round((user.wins / user.gamesPlayed) * 100)}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-500 to-teal-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <User className="h-5 w-5 text-purple-400 mr-2" />
              Account Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Notifications</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-games"
                      className="rounded text-purple-500 focus:ring-purple-500 bg-gray-900 border-gray-700"
                      defaultChecked
                    />
                    <label htmlFor="notify-games" className="ml-2 text-sm text-gray-300">
                      Game invitations
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-rewards"
                      className="rounded text-purple-500 focus:ring-purple-500 bg-gray-900 border-gray-700"
                      defaultChecked
                    />
                    <label htmlFor="notify-rewards" className="ml-2 text-sm text-gray-300">
                      Reward notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notify-news"
                      className="rounded text-purple-500 focus:ring-purple-500 bg-gray-900 border-gray-700"
                    />
                    <label htmlFor="notify-news" className="ml-2 text-sm text-gray-300">
                      News and updates
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-12 bg-gray-800/50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-gray-400 mb-6">Jump back into the action and earn more rewards!</p>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6 px-8">
            Play Now
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
