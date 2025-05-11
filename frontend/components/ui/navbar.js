"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Menu, X, LogIn, UserPlus, User, LogOut, Settings, Wallet, Coins } from "lucide-react"
import { useSidebar } from "./sidebar"
import { useAuth } from "@/components/auth/auth-provider"
import useUsers  from "@/hooks/users.zustand"


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const { toggleSidebar } = useSidebar()
  //const { user, logout } = useAuth()
  const user = useUsers((state) => state.selectedUser)
  console.log("user", user)


  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 text-gray-300 hover:text-white">
              <Menu className="h-6 w-6" />
            </Button>
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                SolanaGaming
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user.name!=="Dummy User" ? (
              <>
                <div className="flex items-center bg-gray-800/50 rounded-full px-3 py-1.5 mr-2">
                  <Coins className="h-4 w-4 text-yellow-400 mr-1.5" />
                  <span className="text-sm font-medium"> {user.playerName} </span>
                </div>
              
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-gray-300 hover:text-white">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <Link href="/signup">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-gray-900 border-b border-gray-800"
        >
          <div className="px-4 py-4 space-y-3">
            {user.name!=="Dummy User" ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3 border border-gray-700">
                     
                      
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.playerName}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <Coins className="h-3 w-3 text-yellow-400 mr-1" />
                        <span>{user.name} </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-2 space-y-2">
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/profile">
                      <User className="mr-2 h-5 w-5" />
                      Profile
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/rewards">
                      <Coins className="mr-2 h-5 w-5" />
                      Rewards
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/buy-tokens">
                      <Wallet className="mr-2 h-5 w-5" />
                      Buy Tokens
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/settings">
                      <Settings className="mr-2 h-5 w-5" />
                      Settings
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
                    <LogOut className="mr-2 h-5 w-5" />
                    Log out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button asChild className="w-full bg-gray-800">
                  <Link href="/login">
                    <LogIn className="mr-2 h-5 w-5" />
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  <Link href="/signup">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
