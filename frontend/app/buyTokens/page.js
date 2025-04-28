"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Wallet, Coins, CreditCard, Sparkles, Trophy, Gamepad2 } from "lucide-react"
import ConnectWalletModal from "@/components/connect-wallet-modal"

export default function BuyTokensPage() {
  const { toast } = useToast()
  const [tokenAmount, setTokenAmount] = useState(100)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)

  const handleConnectWallet = () => {
    // Mock wallet connection
    setWalletConnected(true)
    setShowConnectModal(false)

    toast({
      title: "Wallet Connected",
      description: "Your Solana wallet has been connected successfully",
    })
  }

  const handleBuyTokens = () => {
    if (!walletConnected) {
      setShowConnectModal(true)
      return
    }

    // This is where you would implement the buy tokens logic
    toast({
      title: "Purchase Successful!",
      description: `You've purchased ${tokenAmount} tokens`,
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

  const calculatePrice = (amount) => {
    // Mock price calculation (1 token = 0.01 SOL)
    return (amount * 0.01).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Power Up Your Gaming
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Purchase gaming tokens to stake in challenges and unlock your path to greater rewards
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-8 border border-blue-800/50"
        >
          <motion.div variants={itemVariants} className="flex items-center mb-6">
            <Sparkles className="w-8 h-8 mr-3 text-blue-400" />
            <h2 className="text-2xl font-bold text-blue-400">Buy Gaming Tokens</h2>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <p className="text-gray-300 mb-6">
              Gaming tokens are your gateway to competitive play. Use them to stake in games, challenge opponents, and
              multiply your earnings through victories.
            </p>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-medium mb-4">Token Benefits:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-blue-500/20 p-1 rounded-full mr-3 mt-0.5">
                    <Coins className="w-4 h-4 text-blue-400" />
                  </div>
                  <span>Stake in competitive games</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-500/20 p-1 rounded-full mr-3 mt-0.5">
                    <Trophy className="w-4 h-4 text-purple-400" />
                  </div>
                  <span>Win bigger rewards</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-500/20 p-1 rounded-full mr-3 mt-0.5">
                    <Gamepad2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <span>Access exclusive game modes</span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              onClick={() => setShowConnectModal(true)}
              disabled={walletConnected}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mb-4 h-12 text-lg"
            >
              <Wallet className="mr-2" />
              {walletConnected ? "Wallet Connected" : "Connect Wallet"}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-8 border border-purple-800/50"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h3 className="text-xl font-bold mb-6 text-center">Select Token Amount</h3>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Amount</span>
                <span className="text-sm text-gray-400">Price</span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Coins className="w-6 h-6 mr-2 text-yellow-400" />
                  <span className="text-3xl font-bold">{tokenAmount}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">{calculatePrice(tokenAmount)} SOL</span>
                </div>
              </div>

              <Slider
                value={[tokenAmount]}
                min={10}
                max={1000}
                step={10}
                onValueChange={(value) => setTokenAmount(value[0])}
                className="mb-6"
              />

              <div className="flex justify-between text-sm text-gray-400">
                <span>10</span>
                <span>500</span>
                <span>1000</span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-8">
              <div className="flex justify-between items-center">
                <span>Total Cost</span>
                <span className="text-xl font-bold">{calculatePrice(tokenAmount)} SOL</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              onClick={handleBuyTokens}
              disabled={!walletConnected}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12 text-lg"
            >
              <CreditCard className="mr-2" /> Buy Tokens
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <ConnectWalletModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnect={handleConnectWallet}
      />
    </div>
  )
}
