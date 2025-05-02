"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Wallet, X } from "lucide-react"

export default function ConnectWalletModal({ isOpen, onClose, onConnect, modalType, stakeAmount }) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)

    // Mock wallet connection
    setTimeout(() => {
      setIsConnecting(false)
      onConnect()
    }, 1500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 border border-purple-900/30 rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Connect Wallet</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center mb-8">
              <div className="bg-gray-800 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-10 w-10 text-purple-400" />
              </div>

              <p className="text-gray-300 mb-2">
                {modalType === "host"
                  ? "Connect your wallet to host this game"
                  : "Connect your wallet to join this game"}
              </p>

              {stakeAmount && <p className="text-lg font-bold text-purple-400">Stake Amount: {stakeAmount} SOL</p>}
            </div>

            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <div className="flex items-center">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Connecting...
                </div>
              ) : (
                "Connect Wallet"
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
