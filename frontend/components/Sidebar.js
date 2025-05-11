"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Coins, Award, User, ChevronRight, ChevronLeft, GamepadIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true)

  const sidebarVariants = {
    expanded: { width: "240px" },
    collapsed: { width: "70px" },
  }

  const menuItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Buy Tokens", icon: Coins, path: "/buy-tokens" },
    { name: "Rewards", icon: Award, path: "/rewards" },
    { name: "Profile", icon: User, path: "/profile" },
  ]

  return (
    <motion.div
      className="bg-gray-900 border-r border-purple-900/30 h-screen sticky top-0 z-40"
      initial="expanded"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-end">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400"
          >
            {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="flex-1 pt-4">
          <ul className="space-y-2 px-2">
            {menuItems.map((item, index) => (
              <motion.li key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors",
                    "group hover:bg-gradient-to-r hover:from-purple-900/50 hover:to-pink-900/50",
                  )}
                >
                  <item.icon className="h-5 w-5 text-purple-400 group-hover:text-purple-300" />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="ml-3"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className="p-4">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4 rounded-lg"
            >
              <p className="text-sm text-gray-400">Need help?</p>
              <p className="text-xs text-gray-500 mt-1">Contact support@solanagames.com</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
