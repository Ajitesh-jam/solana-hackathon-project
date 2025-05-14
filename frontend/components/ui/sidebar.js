"use client"

import { useState, useEffect, createContext, useContext } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { Home, Coins, Trophy, User, ChevronRight, X, Gamepad2, Sword } from "lucide-react"

const SidebarContext = createContext()

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children, defaultOpen = true }) {
  const isMobile = useMobile()
  const [open, setOpen] = useState(defaultOpen)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    // Close sidebar on mobile by default
    if (isMobile) {
      setOpen(false)
    } else {
      setOpen(defaultOpen)
    }
  }, [isMobile, defaultOpen])

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setOpen(!open)
    }
  }

  return (
    <SidebarContext.Provider value={{ open, setOpen, mobileOpen, setMobileOpen, toggleSidebar, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export default function Sidebar() {
  const { open, setOpen, mobileOpen, setMobileOpen, isMobile } = useSidebar()
  const { toast } = useToast()

  const sidebarItems = [
    {
      title: "Home",
      icon: Home,
      href: "/",
      active: true,
    },
    {
      title: "Buy Tokens",
      icon: Coins,
      href: "/buy-tokens",
      active: false,
    },
    {
      title: "Rewards",
      icon: Trophy,
      href: "/rewards",
      active: false,
    },
    {
      title: "Profile",
      icon: User,
      href: "/profile",
      active: false,
    },
    {
      title: "marketplace",
      icon: User,
      href: "/marketplace/buy-skins",
      active: false,
    },
  ]

  const games = [
    {
      title: "Solana Battleground",
      icon: Sword,
      href: "/games/solanabattlefield",
      active: false,
    },
    {
      title: "Solana Ops",
      icon: Gamepad2,
      href: "/games/solanaops",
      active: false,
    },
    {
      title: "Call of Duty",
      icon: Gamepad2,
      href: "/games/callofduty",
      active: false,
    },
  ]

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        {/* Mobile Sidebar Overlay */}
        {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />}

        {/* Mobile Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: mobileOpen ? 0 : -300 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 bottom-0 w-[280px] bg-gray-900 border-r border-gray-800 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                SolanaGaming
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 px-3">Navigation</h3>
              <ul className="space-y-1">
                {sidebarItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        item.active ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800",
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 px-3">Games</h3>
              <ul className="space-y-1">
                {games.map((game) => (
                  <li key={game.title}>
                    <Link
                      href={game.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        game.active ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800",
                      )}
                    >
                      <game.icon className="h-5 w-5 mr-3" />
                      {game.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </>
    )
  }

  // Desktop sidebar
  return (
    <motion.div
      initial={{ width: open ? 240 : 70 }}
      animate={{ width: open ? 240 : 70 }}
      transition={{ duration: 0.3 }}
      className="hidden md:block h-screen bg-gray-900 border-r border-gray-800 sticky top-0 overflow-y-auto overflow-x-hidden"
    >
      <div className="p-4">
        <div className="mb-8">
          {open ? (
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                SolanaGaming
              </span>
            </Link>
          ) : (
            <div className="flex justify-center">
              <Link href="/">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
              </Link>
            </div>
          )}
        </div>

        <div className="mb-6">
          {open && <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 px-3">Navigation</h3>}
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md transition-colors",
                    open ? "px-3 py-2" : "p-2 justify-center",
                    item.active ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800",
                  )}
                >
                  <item.icon className={cn("h-5 w-5", open && "mr-3")} />
                  {open && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          {open && <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 px-3">Games</h3>}
          <ul className="space-y-1">
            {games.map((game) => (
              <li key={game.title}>
                <Link
                  href={game.href}
                  className={cn(
                    "flex items-center rounded-md transition-colors",
                    open ? "px-3 py-2" : "p-2 justify-center",
                    game.active ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800",
                  )}
                >
                  <game.icon className={cn("h-5 w-5", open && "mr-3")} />
                  {open && <span>{game.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="absolute top-1/2 -right-3 w-6 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white"
      >
        <ChevronRight className={cn("h-4 w-4", !open && "rotate-180")} />
      </Button>
    </motion.div>
  )
}
