"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Wallet, Coins, Trophy } from "lucide-react"
import ProfileTabs from "@/components/profile/profile-tabs"
import useUsers from "@/hooks/users.zustand"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function ProfilePage() {
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

  // Mock user data
  const userData = {
    name: user?.playerName || "CryptoGamer",
    image: "/placeholder.svg?height=200&width=200",
    wallet: "8xH4Zw9Y3mKn2TjP...",
    tokens: 750,
    joinDate: "January 2023",
    gamesPlayed: 42,
    wins: 28,
    losses: 14,
  }

    const userfetched = useUsers((state) => state.selectedUser)
  console.log("userfetched", userfetched)
  useEffect(() => {
    //just change player name to userfetched.playeName else keep same 
    if (userfetched) {
      setUser((prev) => ({
        ...prev,
        playerName: userfetched.playerName,
        walletAddress: userfetched.walletAddress
          ? `${userfetched.walletAddress.slice(0, 7)}...${userfetched.walletAddress.slice(-7)}`
          : "",
        email: userfetched.email,
        skins: userfetched.skins,
      }))
    }
  }, [userfetched])

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
        initial={{ opacity: 0, y: -20 }}
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
                {/* <Avatar className="w-24 h-24 mb-4 border-2 border-purple-500">
                  <AvatarImage src={"/placeholder.svg"} alt={user.playerName} />
                 
                  
                </Avatar> */}
                <Image src={ "/avatar.png"} alt={user.playerName} width={100} height={100} className="rounded-full mb-4" />

                <h2 className="text-2xl font-bold mb-1">{user.playerName}</h2>
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <Wallet className="w-4 h-4 mr-1" />
                  <span>{user.walletAddress}</span>
                </div>
                <div className="flex items-center justify-center bg-gray-700/50 rounded-full px-4 py-2 mb-4">
                  <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                  
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  {user.email}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3 text-purple-400" />
                    <span>Member Since</span>
                  </div>
                  <span className="text-gray-300">{2025}</span>
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

        <ProfileTabs />
      </div>
    </div>
  )
}
