"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Wallet, Lock, Unlock, AlertCircle } from "lucide-react"
import RoomCard from "@/components/RoomCard"
import ConnectWalletModal from "@/components/ConnectWalletModal"
import SuccessModal from "@/components/SuccessModal"

// Mock data for rooms
const mockRooms = [
  { id: 1, code: "GAME123", stake: 50, hostWallet: "Wallet123", hostUserName: "Player1", isPrivate: false },
  { id: 2, code: "BATTLE456", stake: 100, hostWallet: "Wallet456", hostUserName: "CryptoGamer", isPrivate: false },
  { id: 3, code: "SOLANA789", stake: 75, hostWallet: "Wallet789", hostUserName: "BlockchainWarrior", isPrivate: true },
  { id: 4, code: "WAR2022", stake: 200, hostWallet: "Wallet101", hostUserName: "TokenMaster", isPrivate: false },
]

// Game data
const games = {
  solanabattlefield: {
    name: "Solana Battlefield",
    description: "Intense multiplayer battles with strategic gameplay and high stakes rewards.",
    link: "https://example.com/solanabattlefield",
  },
  solanaops: {
    name: "Solana Ops",
    description: "Tactical team-based missions with real-time combat and blockchain rewards.",
    link: "https://example.com/solanaops",
  },
  callofduty: {
    name: "Call of Duty",
    description: "The legendary FPS now with Solana integration. Stake, play, and earn.",
    link: "https://example.com/callofduty",
  },
}

export default function GamePage() {
  const params = useParams()
  const gameId = params.game
  const game = games[gameId] || { name: "Game Not Found", description: "", link: "#" }

  const [lobbyCode, setLobbyCode] = useState("")
  const [stakeAmount, setStakeAmount] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [modalType, setModalType] = useState("host") // 'host' or 'join'
  const [selectedRoom, setSelectedRoom] = useState(null)

  const handleHostGame = () => {
    setModalType("host")
    setShowWalletModal(true)
  }

  const handleJoinRoom = (room) => {
    setModalType("join")
    setSelectedRoom(room)
    setShowWalletModal(true)
  }

  const handleWalletConnect = () => {
    setShowWalletModal(false)

    // Mock wallet connection and transaction
    setTimeout(() => {
      setShowSuccessModal(true)
    }, 500)
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)

    // If it was a host game, redirect to game link
    if (modalType === "host") {
      window.open(game.link, "_blank")
    } else if (modalType === "join" && selectedRoom) {
      window.open(game.link, "_blank")
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        className="text-4xl font-bold mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {game.name}
      </motion.h1>
      <motion.p
        className="text-gray-400 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {game.description}
      </motion.p>

      <Tabs defaultValue="host" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="host" className="text-lg py-3">
            Host a Game
          </TabsTrigger>
          <TabsTrigger value="join" className="text-lg py-3">
            Join Room
          </TabsTrigger>
        </TabsList>

        <TabsContent value="host" className="space-y-8">
          <motion.div
            className="bg-gray-800/50 border border-purple-900/30 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <p className="text-gray-300 mb-6">
              Choose any lobby code and stake some amount to play. You will be redirected to the game. Wait for someone
              to join the room and play the game. If you win, you can claim your reward from the rewards page, else you
              will lose all stake.
            </p>

            <div className="space-y-6">
              <div>
                <Label htmlFor="lobby-code">Room Code</Label>
                <Input
                  id="lobby-code"
                  placeholder="Enter a unique room code"
                  className="mt-2 bg-gray-900 border-gray-700"
                  value={lobbyCode}
                  onChange={(e) => setLobbyCode(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="stake-amount">Stake Amount (SOL)</Label>
                <div className="relative mt-2">
                  <Input
                    id="stake-amount"
                    type="number"
                    placeholder="Enter stake amount"
                    className="bg-gray-900 border-gray-700 pl-10"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                  />
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="private-game" checked={isPrivate} onCheckedChange={setIsPrivate} />
                <Label htmlFor="private-game" className="flex items-center cursor-pointer">
                  {isPrivate ? (
                    <Lock className="h-4 w-4 mr-2 text-purple-400" />
                  ) : (
                    <Unlock className="h-4 w-4 mr-2 text-gray-400" />
                  )}
                  {isPrivate ? "Private Game" : "Public Game"}
                </Label>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={handleHostGame}
                disabled={!lobbyCode || !stakeAmount}
              >
                Host Room
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="join" className="space-y-8">
          <motion.div
            className="bg-gray-800/50 border border-purple-900/30 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>

            <div className="space-y-4">
              {mockRooms.map((room) => (
                <RoomCard key={room.id} room={room} onJoin={() => handleJoinRoom(room)} />
              ))}

              {mockRooms.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-400">No rooms available. Try hosting a game instead!</p>
                </div>
              )}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      <ConnectWalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
        modalType={modalType}
        stakeAmount={modalType === "host" ? stakeAmount : selectedRoom?.stake}
      />

      <SuccessModal isOpen={showSuccessModal} onClose={handleSuccessClose} modalType={modalType} />
    </div>
  )
}
