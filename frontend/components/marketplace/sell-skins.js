"use client"

import { useState, useEffect, use } from "react"
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
// Mock data for skins
const mockSkins = [
  {
    skinId: 1,
    gameId: "solanabattlefield",
    name: "Dragon Slayer",
    description: "Epic armor with dragon scales that glow in battle",
    image: "/images/solanabattleground/0.jpeg?height=300&width=300",
    price: 1,
    rarity: "Legendary",
    gameCompanyWalletAddress: "4L8ryesGMUPwbUstN9ZMKUBvtWsBCAsZjJHpD8Bma76i",
    type: "Armor",
  },
  {
    skinId: 2,
    gameId: "solanabattlefield",
    name: "Shadow Assassin",
    description:
      "Stealthy outfit that provides camouflage in dark environments",
    image: "/images/solanabattleground/1.jpeg",
    price: 1.8,
    rarity: "Epic",
    gameCompanyWalletAddress: "4L8ryesGMUPwbUstN9ZMKUBvtWsBCAsZjJHpD8Bma76i",
    type: "Outfit",
  },
  {
    skinId: 3,
    gameId: "solanabattlefield",
    name: "Cyber Commando",
    description: "Futuristic combat suit with integrated HUD",
    image: "/images/solanabattleground/2.jpeg",
    price: 2.3,
    rarity: "Epic",
    gameCompanyWalletAddress: "4L8ryesGMUPwbUstN9ZMKUBvtWsBCAsZjJHpD8Bma76i",
    type: "Outfit",
  },
  {
    skinId: 4,
    gameId: "solanabattlefield",
    name: "Plasma Rifle",
    description: "Energy weapon with custom particle effects",
    image: "/images/solanabattleground/3.jpeg",
    price: 1.5,
    rarity: "Rare",
    gameCompanyWalletAddress: "4L8ryesGMUPwbUstN9ZMKUBvtWsBCAsZjJHpD8Bma76i",
    type: "Weapon",
  },
  {
    skinId: 5,
    gameId: "solanabattlefield",
    name: "Golden Arsenal",
    description: "Complete set of gold-plated weapons",
    image: "/images/solanabattleground/4.jpeg",
    price: 0.3,
    rarity: "Legendary",
    gameCompanyWalletAddress: "4L8ryesGMUPwbUstN9ZMKUBvtWsBCAsZjJHpD8Bma76i",
    type: "Weapon Pack",
  },
  {
    skinId: 6,
    gameId: "solanabattlefield",
    name: "Tactical Operator",
    description: "Special forces outfit with multiple attachment points",
    image: "/images/solanabattleground/5.jpeg",
    price: 2,
    rarity: "Epic",
    gameCompanyWalletAddress: "4L8ryesGMUPwbUstN9ZMKUBvtWsBCAsZjJHpD8Bma76i",
    type: "Outfit",
  },
  {
    skinId: 7,
    gameId: "solanabattlefield",
    name: "Tactical Operator",
    description: "Special forces outfit with multiple attachment points",
    image: "/images/solanabattleground/6.jpeg",
    price: 2,
    rarity: "Epic",
    gameCompanyWalletAddress: "4L8ryesGMUPwbUstN9ZMKUBvtWsBCAsZjJHpD8Bma76i",
    type: "Outfit",
  },
  {
    skinId: 8,
    gameId: "solanabattlefield",
    name: "Tactical Operator",
    description: "Special forces outfit with multiple attachment points",
    image: "/images/solanabattleground/5.jpeg",
    price: 2,
    rarity: "Epic",
    gameCompanyWalletAddress: "4L8ryesGMUPwbUstN9ZMKUBvtWsBCAsZjJHpD8Bma76i",
    type: "Outfit",
  },
  {
    skinId: 9,
    gameId: "solanaops",
    name: "Tactical Operator",
    description: "Special forces outfit with multiple attachment points",
    image: "/images/callofduty/1.jpeg",
    price: 2,
    rarity: "Epic",
    gameCompanyWalletAddress: "4L8ryesGMUPwbUstN9ZMKUBvtWsBCAsZjJHpD8Bma76i",
    type: "Outfit",
  },
  {
    skinId: 10,
    gameId: "solanaops",
    name: "Tactical Operator",
    description: "Special forces outfit with multiple attachment points",
    image: "/images/callofduty/2.jpeg",
    price: 2,
    rarity: "Epic",
    gameCompanyWalletAddress: "4L8ryesGMUPwbUstN9ZMKUBvtWsBCAsZjJHpD8Bma76i",
    type: "Outfit",
  },
  {
    skinId: 11,
    gameId: "solanaops",
    name: "Tactical Operator",
    description: "Special forces outfit with multiple attachment points",
    image: "/images/callofduty/3.jpeg",
    price: 2,
    rarity: "Epic",
    gameCompanyWalletAddress: "4L8ryesGMUPwbUstN9ZMKUBvtWsBCAsZjJHpD8Bma76i",
    type: "Outfit",
  },
];



 
import useUsers from "@/hooks/users.zustand"

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
  const user = useUsers((state) => state.selectedUser)

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Fetch user's skins
  useEffect(() => {
    if(user.playerName === "Dummy User") {
      setUserSkins(mockSkins)
      setIsLoading(false)
      return
    }
    const fetchUserSkins = async () => {
      setIsLoading(true)
      try {
        console.log("Fetching user skins for:", user?.playerName)
        // In a real app, you would fetch from your API
        const response = await fetch(`/api/getUserSkins?playerName=${user?.playerName}`)
        if (!response.ok) {
          throw new Error("Failed to fetch user skins")
        }

        const data = await response.json()
       
        const userSkinIds = data.skins;
        console.log("User Skin IDs:", userSkinIds)
        const ownedSkins = mockSkins.filter((skin) => userSkinIds.includes(skin.skinId))
        console.log("Owned Skins:", ownedSkins)
        setUserSkins(ownedSkins)
        setIsLoading(false)
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
    setAllSkins(mockSkins);

    fetchUserSkins()
  }, [user])

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

    console.log("Skin sold:", skin)
    console.log("Price:", price)
    console.log("Seller:", user)
    // In a real app, you would call your API to handle the listing

    //call api to fetch new listing id;

    //call api to add seller
    fetch("/api/addSeller", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listingId: skin.skinId + "-" + user.walletAddress + "-" + price +"-"+ Date.now(),       //unique listing id  
        skinId: skin.skinId,
        sellerName: user.playerName,
        sellerWalletAddress: user.walletAddress,
        price:price,
        listedDate: new Date().toISOString(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create listing")
        }
        return response.json()
      })
      .then((data) => {
        console.log("Listing created:", data)
      })
      .catch((error) => {
        console.error("Error creating listing:", error)
      })


      //refresh window
      window.location.reload()



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
