"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, X } from "lucide-react"

export default function SuccessModal({ isOpen, onClose, modalType }) {
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
            className="bg-gray-900 border border-green-500/30 rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-green-400">Success!</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center mb-8">
              <div className="bg-green-500/20 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>

              <p className="text-gray-300 mb-4">
                {modalType === "host"
                  ? "Your game room has been successfully created!"
                  : "You have successfully joined the game!"}
              </p>

              <p className="text-sm text-gray-400">
                {modalType === "host"
                  ? "Wait for players to join your room. Good luck!"
                  : "Get ready to play. Good luck!"}
              </p>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 h-12"
              onClick={onClose}
            >
              Go to Game
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
