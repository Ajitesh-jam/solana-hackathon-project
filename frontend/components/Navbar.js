"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Wallet, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [tokens, setTokens] = useState(0)

  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  }

  // Mock login function - replace with actual implementation
  const handleLogin = () => {
    setIsLoggedIn(true)
    setTokens(1000) // Mock token amount
  }

  return (
    <motion.nav
      className="bg-gray-900 border-b border-purple-900/30 backdrop-blur-sm sticky top-0 z-50"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <motion.div variants={itemVariants} className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                  SolanaGames
                </span>
              </Link>
            </motion.div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <motion.div variants={itemVariants} className="flex items-center bg-gray-800 rounded-full px-4 py-1">
                    <Wallet className="h-4 w-4 text-purple-400 mr-2" />
                    <span className="text-purple-400 font-bold">{tokens} SOL</span>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Button variant="ghost" className="text-gray-300 hover:text-white">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div variants={itemVariants}>
                    <Button variant="ghost" className="text-gray-300 hover:text-white" onClick={handleLogin}>
                      Login
                    </Button>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Sign Up
                    </Button>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 mb-2">
                  <Wallet className="h-4 w-4 text-purple-400 mr-2" />
                  <span className="text-purple-400 font-bold">{tokens} SOL</span>
                </div>
                <Button variant="ghost" className="w-full text-left text-gray-300 hover:text-white">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full text-left text-gray-300 hover:text-white"
                  onClick={handleLogin}
                >
                  Login
                </Button>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  )
}
