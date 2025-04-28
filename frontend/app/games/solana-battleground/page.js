"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import RoomCard from "@/components/room-card"
import { Wallet, LockKeyhole, Globe, Users, Coins } from "lucide-react"
import ConnectWalletModal from "@/components/connect-wallet-modal"

export default function GamePage({ params }) {
  const { slug } = "solana-battleground"
  const { toast } = useToast()
  const [lobbyCode, setLobbyCode] = useState("")
  const [stakeAmount, setStakeAmount] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)

  // Mock data for rooms
  const rooms = [
    {
      id: 1,
      code: "GAME123",
      stake: 50,
      link: "/games/solana-battleground/play",
      hostWallet: "8xH4...",
      isActive: true,
      hostUserName: "CryptoWarrior",
      isPrivate: false,
    },
    {
      id: 2,
      code: "BATTLE456",
      stake: 100,
      link: "/games/solana-battleground/play",
      hostWallet: "9zT5...",
      isActive: true,
      hostUserName: "SolanaKing",
      isPrivate: false,
    },
    {
      id: 3,
      code: "ARENA789",
      stake: 75,
      link: "/games/solana-battleground/play",
      hostWallet: "3xR7...",
      isActive: true,
      hostUserName: "BlockchainNinja",
      isPrivate: false,
    },
  ]

  const handleHostGame = () => {
    if (!walletConnected) {
      setShowConnectModal(true)
      return
    }

    if (!lobbyCode || !stakeAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // This is where you would call your staking logic
    const newRoom = {
      id: Math.floor(Math.random() * 1000),
      code: lobbyCode,
      stake: stakeAmount,
      link: `/games/${slug}/play`,
      hostWallet: "8xH4...", // Mock wallet address
      isActive: true,
      hostUserName: "Player1", // Mock username
      isPrivate: isPrivate,
    }

    toast({
      title: "Success!",
      description: "Game room created successfully",
    })

    // Reset form
    setLobbyCode("")
    setStakeAmount("")
    setIsPrivate(false)
  }

  const handleJoinRoom = (room) => {
    setSelectedRoom(room)
    if (!walletConnected) {
      setShowConnectModal(true)
    } else {
      // This is where you would call your payment logic
      toast({
        title: "Success!",
        description: `Joined room ${room.code}`,
      })

      // Navigate to game
      window.location.href = room.link
    }
  }

  const handleConnectWallet = () => {
    // Mock wallet connection
    setWalletConnected(true)
    setShowConnectModal(false)

    toast({
      title: "Wallet Connected",
      description: "Your Solana wallet has been connected successfully",
    })

    if (selectedRoom) {
      // If joining a room, proceed with payment
      handleJoinRoom(selectedRoom)
    }
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

  // Format the game name from slug
  const formatGameName = (slug) => {
    // return slug
    //   .split("-")
    //   .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    //   .join(" ")
    return `Solana Battleground`;
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
          {formatGameName(slug)}
        </h1>
        <p className="text-gray-300">Stake tokens, challenge opponents, and win rewards in this competitive game.</p>
      </motion.div>

      <Tabs defaultValue="host" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="host" className="text-lg py-3">
            Host a Game
          </TabsTrigger>
          <TabsTrigger value="join" className="text-lg py-3">
            Join Room
          </TabsTrigger>
        </TabsList>

        <TabsContent value="host">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Instructions</h2>
              <p className="text-gray-300 mb-4">
                Choose any lobby code and stake some amount to play. Then you will be redirected to the game. Wait for
                someone to join the room and play the game. If you win, you can claim your reward from the rewards page,
                else you will lose all stake.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="lobby-code" className="text-lg">
                    Room Code
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="lobby-code"
                      placeholder="Enter a unique room code"
                      className="pl-10 bg-gray-700 border-gray-600 h-12"
                      value={lobbyCode}
                      onChange={(e) => setLobbyCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="stake-amount" className="text-lg">
                    Stake Amount
                  </Label>
                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="stake-amount"
                      type="number"
                      placeholder="Amount to stake"
                      className="pl-10 bg-gray-700 border-gray-600 h-12"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="private-game" checked={isPrivate} onCheckedChange={setIsPrivate} />
                <Label htmlFor="private-game" className="text-lg flex items-center">
                  {isPrivate ? (
                    <>
                      <LockKeyhole className="mr-2 text-purple-400" />
                      Private Game
                    </>
                  ) : (
                    <>
                      <Globe className="mr-2 text-blue-400" />
                      Public Game
                    </>
                  )}
                </Label>
              </div>

              <Button
                onClick={handleHostGame}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 text-lg"
              >
                <Wallet className="mr-2" /> Host Game
              </Button>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="join">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
            >
              <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center">
                <Users className="mr-2" /> Available Rooms
              </h2>
              <p className="text-gray-300 mb-6">
                Join an existing room to challenge the host. You'll need to stake the same amount as the host to join
                the game.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} onJoin={() => handleJoinRoom(room)} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>

      <ConnectWalletModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnect={handleConnectWallet}
      />
    </div>
  )
}
