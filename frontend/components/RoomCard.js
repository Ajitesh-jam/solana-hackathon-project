"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Wallet, User, Lock } from "lucide-react"

export default function RoomCard({ room, onJoin }) {
  return (
    <motion.div
      className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-lg">{room.roomCode}</h3>
          {room.isPrivateRoom && <Lock className="h-4 w-4 text-purple-400" />}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-400">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{room.hostPlayerName}</span>
          </div>
          <div className="flex items-center">
            <Wallet className="h-4 w-4 mr-1" />
            <span>{room.stakeAmount} CGS_COINS</span>
          </div>
        </div>
      </div>

      <Button
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        onClick={onJoin}
      >
        Join Room
      </Button>
    </motion.div>
  )
}
