"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { LockKeyhole, Globe, User, Coins } from "lucide-react"

export default function RoomCard({ room, onJoin }) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-colors"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-2">
              <User className="h-4 w-4 text-gray-300" />
            </div>
            <div>
              <h3 className="font-medium">{room.hostUserName}</h3>
              <p className="text-xs text-gray-400">Host</p>
            </div>
          </div>
          {room.isPrivate ? (
            <LockKeyhole className="h-4 w-4 text-purple-400" />
          ) : (
            <Globe className="h-4 w-4 text-blue-400" />
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-gray-400">Room Code</p>
            <p className="font-medium">{room.code}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Stake</p>
            <p className="font-medium flex items-center">
              <Coins className="h-3 w-3 mr-1 text-yellow-400" />
              {room.stake}
            </p>
          </div>
        </div>

        <Button
          onClick={() => onJoin(room)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Join Room
        </Button>
      </div>
    </motion.div>
  )
}
