"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import OwnedSkinCard from "@/components/marketplace/owned-skin-card"
import {
  Search,
  Filter,
  Gamepad2,
  Tag,
  Info,
  Loader2,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react"

// Mock data for games
const games = [
  {
    id: "solana-battleground",
    name: "Solana Battleground",
    icon: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "solana-ops",
    name: "Solana Ops",
    icon: "/placeholder.svg?height=50&width=50",
  },
  {
    id: "call-of-duty",
    name: "Call of Duty",
    icon: "/placeholder.svg?height=50&width=50",
  },
]

// Mock data for skins (same as in buy-skins.js)
const mockSkins = [
  {
    skinId: "skin-001",
    gameId: "solana-battleground",
    name: "Dragon Slayer",
    description: "Epic armor with dragon scales that glow in battle",
    image: "/placeholder.svg?height=300&width=300",
    price: 250,
    rarity: "Legendary",
    gameCompanyWalletAddress: "8xH4Zw9Y3mKn2TjP...",
    type: "Armor",
  },
  {
    skinId: "skin-002",
    gameId: "solana-battleground",
    name: "Shadow Assassin",
    description: "Stealthy outfit that provides camouflage in dark environments",
    image: "/placeholder.svg?height=300&width=300",
    price: 180,
    rarity: "Epic",
    gameCompanyWalletAddress: "8xH4Zw9Y3mKn2TjP...",
    type: "Outfit",
  },
  {
    skinId: "skin-003",
    gameId: "solana-ops",
    name: "Cyber Commando",
    description: "Futuristic combat suit with integrated HUD",
    image: "/placeholder.svg?height=300&width=300",
    price: 220,
    rarity: "Epic",
    gameCompanyWalletAddress: "9zT5Hw8B4kL7RpM...",
    type: "Outfit",
  },
  {
    skinId: "skin-004",
    gameId: "solana-ops",
    name: "Plasma Rifle",
    description: "Energy weapon with custom particle effects",
    image: "/placeholder.svg?height=300&width=300",
    price: 150,
    rarity: "Rare",
    gameCompanyWalletAddress: "9zT5Hw8B4kL7RpM...",
    type: "Weapon",
  },
  {
    skinId: "skin-005",
    gameId: "call-of-duty",
    name: "Golden Arsenal",
    description: "Complete set of gold-plated weapons",
    image: "/placeholder.svg?height=300&width=300",
    price: 300,
    rarity: "Legendary",
    gameCompanyWalletAddress: "3xR7Kp2L9sB6Vj8...",
    type: "Weapon Pack",
  },
  {
    skinId: "skin-006",
    gameId: "call-of-duty",
    name: "Tactical Operator",
    description: "Special forces outfit with multiple attachment points",
    image: "/placeholder.svg?height=300&width=300",
    price: 200,
    rarity: "Epic",
    gameCompanyWalletAddress: "3xR7Kp2L9sB6Vj8...",
    type: "Outfit",
  },
]

// Mock data for user's owned skins
const mockUserSkinIds = ["skin-001", "skin-003", "skin-005"]

export default function SellSkins() {
  const [selectedGame, setSelectedGame] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRarity, setSelectedRarity] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [userSkins, setUserSkins] = useState([])
  const [allSkins, setAllSkins] = useState([])
  const { toast } = useToast()
  const { user } = useAuth()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Fetch user's skins
  useEffect(() => {
    const fetchUserSkins = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/user/skins')
        // const data = await response.json()
        // const userSkinIds = data.skinIds
        // setAllSkins(data.allSkins)

        // Using mock data for now
        setTimeout(() => {
          setAllSkins(mockSkins)
          // Filter skins to only include those owned by the user
          const ownedSkins = mockSkins.filter((skin) => mockUserSkinIds.includes(skin.skinId))
          setUserSkins(ownedSkins)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching user skins:", error)
        toast({
          title: "Error",
          description: "Failed to load your skins. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchUserSkins()
  }, [toast])

  // Filter skins based on selected game, search query, rarity, and type
  const filteredSkins = userSkins.filter((skin) => {
    const gameMatch = selectedGame === "all" || skin.gameId === selectedGame
    const searchMatch =
      searchQuery === "" ||
      skin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skin.description.toLowerCase().includes(searchQuery.toLowerCase())
    const rarityMatch = selectedRarity === "all" || skin.rarity === selectedRarity
    const typeMatch = selectedType === "all" || skin.type === selectedType

    return gameMatch && searchMatch && rarityMatch && typeMatch
  })

  // Get unique rarities and types from skins
  const rarities = ["all", ...new Set(userSkins.map((skin) => skin.rarity))]
  const types = ["all", ...new Set(userSkins.map((skin) => skin.type))]

  // Animation variants
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

  const handleSellSkin = (skin, price) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to sell skins",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Listing Created",
      description: `${skin.name} has been listed for ${price} tokens`,
      variant: "gaming",
    })
    // In a real app, you would call your API to handle the listing
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          Sell Your Skins
        </h1>
        <p className="text-gray-300">List your skins for sale in the marketplace</p>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-8">
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 mb-6 flex items-start"
        >
          <Info className="text-purple-400 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-purple-400">Marketplace Instructions</h3>
            <p className="text-sm text-gray-300 mb-2">
              When you sell a skin in the marketplace, 10% of the sale will be transferred to the game company and 90%
              will go to you as the seller.
            </p>
            <div className="flex items-center text-sm text-yellow-400">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span>You can set your own price, but remember that lower prices sell faster!</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search your skins..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="md:w-auto border-gray-700 flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {showFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Game</label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                  >
                    <option value="all">All Games</option>
                    {games.map((game) => (
                      <option key={game.id} value={game.id}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rarity</label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                    value={selectedRarity}
                    onChange={(e) => setSelectedRarity(e.target.value)}
                  >
                    <option value="all">All Rarities</option>
                    {rarities
                      .filter((r) => r !== "all")
                      .map((rarity) => (
                        <option key={rarity} value={rarity}>
                          {rarity}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    {types
                      .filter((t) => t !== "all")
                      .map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex overflow-x-auto pb-2 mb-4 gap-2 scrollbar-hide">
          <Button
            variant={selectedGame === "all" ? "default" : "outline"}
            className={`flex items-center whitespace-nowrap ${
              selectedGame === "all" ? "bg-purple-600 hover:bg-purple-700" : "border-gray-700"
            }`}
            onClick={() => setSelectedGame("all")}
          >
            <Gamepad2 className="mr-2 h-4 w-4" />
            All Games
          </Button>
          {games.map((game) => (
            <Button
              key={game.id}
              variant={selectedGame === game.id ? "default" : "outline"}
              className={`flex items-center whitespace-nowrap ${
                selectedGame === game.id ? "bg-purple-600 hover:bg-purple-700" : "border-gray-700"
              }`}
              onClick={() => setSelectedGame(game.id)}
            >
              <img src={game.icon || "/placeholder.svg"} alt={game.name} className="w-4 h-4 mr-2 rounded-full" />
              {game.name}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
        </div>
      ) : (
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-8"
        >
          {filteredSkins.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="text-center py-10 bg-gray-800/30 rounded-lg border border-gray-700"
            >
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">No skins found</h3>
              <p className="text-gray-400 mb-4">You don't own any skins that match your filters</p>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <a href="/marketplace/buy-skins">
                  <Tag className="mr-2 h-4 w-4" />
                  Browse Marketplace
                </a>
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSkins.map((skin) => (
                <motion.div key={skin.skinId} variants={itemVariants}>
                  <OwnedSkinCard skin={skin} onSell={handleSellSkin} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
