"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Wallet, Coins, Trophy, History, Settings, Shield, Gamepad2 } from "lucide-react"

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: "CryptoGamer",
    image: "/placeholder.svg?height=200&width=200",
    wallet: "8xH4Zw9Y3mKn2TjP...",
    tokens: 750,
    joinDate: "January 2023",
    gamesPlayed: 42,
    wins: 28,
    losses: 14,
  }

  // Mock game history
  const gameHistory = [
    {
      id: 1,
      game: "Solana Battleground",
      opponent: "BlockchainNinja",
      result: "win",
      reward: 150,
      date: "Apr 28, 2023",
    },
    {
      id: 2,
      game: "Solana Ops",
      opponent: "CryptoWarrior",
      result: "loss",
      stake: 75,
      date: "Apr 25, 2023",
    },
    {
      id: 3,
      game: "Call of Duty",
      opponent: "SolanaKing",
      result: "win",
      reward: 200,
      date: "Apr 20, 2023",
    },
  ]

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          Your Profile
        </h1>
        <p className="text-gray-300">Manage your gaming profile and track your performance</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="w-24 h-24 mb-4 border-2 border-purple-500">
                  <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <Wallet className="w-4 h-4 mr-1" />
                  <span>{user.wallet}</span>
                </div>
                <div className="flex items-center justify-center bg-gray-700/50 rounded-full px-4 py-2 mb-4">
                  <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                  <span className="text-xl font-bold">{user.tokens} Tokens</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Edit Profile
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3 text-purple-400" />
                    <span>Member Since</span>
                  </div>
                  <span className="text-gray-300">{user.joinDate}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center">
                    <Gamepad2 className="w-5 h-5 mr-3 text-blue-400" />
                    <span>Games Played</span>
                  </div>
                  <span className="text-gray-300">{user.gamesPlayed}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center">
                    <Trophy className="w-5 h-5 mr-3 text-yellow-400" />
                    <span>Win Rate</span>
                  </div>
                  <span className="text-gray-300">{Math.round((user.wins / user.gamesPlayed) * 100)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="history" className="text-sm md:text-base">
                <History className="w-4 h-4 mr-2" /> Game History
              </TabsTrigger>
              <TabsTrigger value="stats" className="text-sm md:text-base">
                <Shield className="w-4 h-4 mr-2" /> Stats
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-sm md:text-base">
                <Settings className="w-4 h-4 mr-2" /> Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle>Recent Games</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {gameHistory.map((game) => (
                      <div
                        key={game.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-700/30 rounded-lg"
                      >
                        <div className="flex items-center mb-3 md:mb-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                              game.result === "win" ? "bg-green-500/20" : "bg-red-500/20"
                            }`}
                          >
                            {game.result === "win" ? (
                              <Trophy className="w-5 h-5 text-green-400" />
                            ) : (
                              <Shield className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{game.game}</h3>
                            <p className="text-sm text-gray-400">vs {game.opponent}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                          <div className="md:mr-8">
                            <p className="text-sm text-gray-400">Result</p>
                            <p className={`font-medium ${game.result === "win" ? "text-green-400" : "text-red-400"}`}>
                              {game.result === "win" ? "Victory" : "Defeat"}
                            </p>
                          </div>

                          <div className="md:mr-8">
                            <p className="text-sm text-gray-400">{game.result === "win" ? "Reward" : "Stake"}</p>
                            <p className="font-medium flex items-center">
                              <Coins className="w-4 h-4 mr-1 text-yellow-400" />
                              {game.result === "win" ? game.reward : game.stake}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-400">Date</p>
                            <p className="font-medium">{game.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle>Performance Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                      <h3 className="text-sm text-gray-400 mb-1">Total Games</h3>
                      <p className="text-3xl font-bold">{user.gamesPlayed}</p>
                    </div>

                    <div className="bg-green-900/30 rounded-lg p-4 text-center">
                      <h3 className="text-sm text-gray-400 mb-1">Wins</h3>
                      <p className="text-3xl font-bold text-green-400">{user.wins}</p>
                    </div>

                    <div className="bg-red-900/30 rounded-lg p-4 text-center">
                      <h3 className="text-sm text-gray-400 mb-1">Losses</h3>
                      <p className="text-3xl font-bold text-red-400">{user.losses}</p>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Win Rate</h3>
                    <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
                        style={{ width: `${Math.round((user.wins / user.gamesPlayed) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>0%</span>
                      <span className="font-medium">{Math.round((user.wins / user.gamesPlayed) * 100)}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">Manage your account settings and preferences</p>
                  <div className="space-y-4">
                    <Button className="w-full justify-start">
                      <User className="mr-2" /> Edit Profile
                    </Button>
                    <Button className="w-full justify-start">
                      <Wallet className="mr-2" /> Manage Wallet
                    </Button>
                    <Button className="w-full justify-start">
                      <Settings className="mr-2" /> Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
