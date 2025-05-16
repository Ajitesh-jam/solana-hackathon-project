"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/auth-provider";
import SkinCard from "@/components/marketplace/skin-card";
import MarketplaceSkinCard from "@/components/marketplace/marketplace-skin-card";
import {
  Search,
  Filter,
  Gamepad2,
  ShoppingCart,
  Store,
  Users,
  Info,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import useUsers from "@/hooks/users.zustand";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, PublicKey, Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";

// Mock data for games
const games = [
  {
    id: "solanabattlefield",
    name: "Solana Battleground",
    icon: "/cod.png?height=50&width=50",
  },
  {
    id: "solanabattlefield",
    name: "Solana Ops",
    icon: "/cod.png?height=50&width=50",
  },
  {
    id: "solanabattlefield",
    name: "Call of Duty",
    icon: "/cod.png?height=50&width=50",
  },
];

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



export default function BuySkins() {
  const [selectedGame, setSelectedGame] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [skins, setSkins] = useState([]);
  const [marketplaceListings, setMarketplaceListings] = useState([]);
  const { toast } = useToast();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fetch skins and marketplace listings
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch from your API
        const response = await fetch("/api/getAllSkins");
        const data = await response.json();
        console.log("Fetched data:", data);
        //setSkins(data.listings);
        setMarketplaceListings(data.listings);
        console.log("Fetched marketplace listings:", data.listings);

        setIsLoading(false);
        // // Using mock data for now
        // setTimeout(() => {
        //   setSkins(mockSkins)
        //   setMarketplaceListings(mockMarketplaceListings)
        // }, 1000)
      } catch (error) {
        console.error("Error fetching marketplace data:", error);
        toast({
          title: "Error",
          description: "Failed to load marketplace data. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    setSkins(mockSkins);

    fetchData();
  }, [toast]);

  // Filter skins based on selected game, search query, rarity, and type
  const filteredSkins = skins.filter((skin) => {
    const gameMatch = selectedGame === "all" || skin.gameId === selectedGame;
    const searchMatch =
      searchQuery === "" ||
      skin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skin.description.toLowerCase().includes(searchQuery.toLowerCase());
    const rarityMatch =
      selectedRarity === "all" || skin.rarity === selectedRarity;
    const typeMatch = selectedType === "all" || skin.type === selectedType;

    return gameMatch && searchMatch && rarityMatch && typeMatch;
  });

  // Get marketplace listings for the filtered skins
  const filteredMarketplaceListings = marketplaceListings.filter((listing) => {
    const skin = skins.find((s) => s.skinId === listing.skinId);
    if (!skin) return false;

    const gameMatch = selectedGame === "all" || skin.gameId === selectedGame;
    const searchMatch =
      searchQuery === "" ||
      skin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skin.description.toLowerCase().includes(searchQuery.toLowerCase());
    const rarityMatch =
      selectedRarity === "all" || skin.rarity === selectedRarity;
    const typeMatch = selectedType === "all" || skin.type === selectedType;

    return gameMatch && searchMatch && rarityMatch && typeMatch;
  });

  // Get unique rarities and types from skins
  const rarities = ["all", ...new Set(skins.map((skin) => skin.rarity))];
  const types = ["all", ...new Set(skins.map((skin) => skin.type))];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const user = useUsers((state) => state.selectedUser);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // Function to transfer tokens using Solfare wallet
  async function transferTokens(skin) {
    if (!publicKey) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const mint = new PublicKey(
        "7nMwDDpFEc7PcAnnAmw8njf7o3dWNKvp8FHBabMW455q"
      );
      const destination = new PublicKey(skin.gameCompanyWalletAddress); //Game company wallet address

      const sourceAta = await getAssociatedTokenAddress(mint, publicKey);
      const destinationAta = await getAssociatedTokenAddress(mint, destination);

      const destinationAccount = await connection.getAccountInfo(
        destinationAta
      );
      const instructions = [];

      if (!destinationAccount) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            destinationAta, // ata
            destination, // owner
            mint // mint
          )
        );
      }

      // Add transfer instruction
      instructions.push(
        createTransferInstruction(
          sourceAta, // source
          destinationAta, // destination
          publicKey, // owner (authority)
          skin.price * 10 ** 9 // amount with decimals (assuming 9 decimals)
        )
      );

      // Create transaction
      const transaction = new Transaction().add(...instructions);

      // Get latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(
        signature,
        "confirmed"
      );

      console.log("Transaction confirmed:", signature);
      alert(`Transfer successful! Transaction signature: ${signature}`);

      return 1;
    } catch (error) {
      console.error("Error transferring tokens:", error);
      alert(`Error: ${error.message}`);
      return 0;
    }
  }
  async function transferTokensToSeller(listing, skin) {
    console.log("transferTokensToSeller called ", listing, skin);
    if (!publicKey) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const mint = new PublicKey(
        "7nMwDDpFEc7PcAnnAmw8njf7o3dWNKvp8FHBabMW455q"
      );
      console.log(" skin:", skin.gameCompanyWalletAddress, "listing:", listing.sellerWalletAddress);
      const gameCompany = new PublicKey(skin.gameCompanyWalletAddress); // Game company wallet address
      const seller = new PublicKey(listing.sellerWalletAddress); // Seller wallet address
      console.log("gameCompany", gameCompany);

      const sourceAta = await getAssociatedTokenAddress(mint, publicKey);
      const gameCompanyAta = await getAssociatedTokenAddress(mint, gameCompany);
      // This was incorrect - was pointing to gameCompany instead of seller
      const sellerAta = await getAssociatedTokenAddress(mint, seller);

      const gameCompanyAccount = await connection.getAccountInfo(
        gameCompanyAta
      );
      const sellerAccount = await connection.getAccountInfo(sellerAta);
      const instructions = [];

      if (!gameCompanyAccount) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            gameCompanyAta, // ata
            gameCompany, // owner
            mint // mint
          )
        );
      }

      if (!sellerAccount) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            sellerAta, // ata
            seller, // owner
            mint // mint
          )
        );
      }

      // Calculate exact token amounts (using BigInt to avoid floating point issues)
      const baseAmount = BigInt(Math.floor(listing.price * 10 ** 9));
      const gameCompanyAmount = baseAmount * BigInt(10) / BigInt(100); // 10% to game company
      const sellerAmount = baseAmount - gameCompanyAmount; // 90% to seller

      // Add transfer instruction for game company (10%)
      instructions.push(
        createTransferInstruction(
          sourceAta, // source
          gameCompanyAta, // destination (game company)
          publicKey, // owner (authority)
          gameCompanyAmount // amount with decimals (10% of price)
        )
      );
      
      // Add transfer instruction for seller (90%)
      instructions.push(
        createTransferInstruction(
          sourceAta, // source
          sellerAta, // destination (seller)
          publicKey, // owner (authority)
          sellerAmount // amount with decimals (90% of price)
        )
      );

      // Create transaction
      const transaction = new Transaction().add(...instructions);

      // Get latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(
        signature,
        "confirmed"
      );

      console.log("Transaction confirmed:", signature);
      alert(`Transfer successful! Transaction signature: ${signature}`);

      return 1;
    } catch (error) {
      console.error("Error transferring tokens:", error);
      alert(`Error: ${error.message}`);
      return 0;
    }
  }

  const handleBuySkin = async (skin) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to purchase skins",
        variant: "destructive",
      });
      return;
    }

    const transaction = await transferTokens(skin);
    if (transaction === 0) {
      toast({
        title: "Purchase Failed",
        description: `Failed to transfer tokens to ${skin.gameCompanyWalletAddress}`,
        variant: "destructive",
      });
      return;
    }

    //on success full transfer --->
    //call api to add Skin to user account

    const response = await fetch("/api/addSkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerName: user.playerName,
        skinId: skin.skinId,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log("Skin added to user account:", data);
      toast({
        title: "Purchase Successful",
        description: `You have purchased ${skin.name} for ${skin.price} tokens`,
        variant: "success",
      });
    }
    if (!response.ok) {
      console.log("Error adding skin to user account:", data);
      toast({
        title: "Purchase Failed",
        description: `Failed to add ${skin.name} to your account`,
        variant: "destructive",
      });
    }

    toast({
      title: "Purchase Initiated",
      description: `Purchasing ${skin.name} for ${skin.price} tokens`,
      variant: "gaming",
    });
    // In a real app, you would call your API to handle the purchase
  };

  const handleBuyMarketplaceSkin = async (listing, skin) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to purchase skins",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Marketplace Purchase Initiated",
      description: `Purchasing ${skin.name} from ${listing.sellerName} for ${listing.price} tokens`,
      variant: "gaming",
    });
    // In a real app, you would call your API to handle the marketplace purchase

    //this buyer will pay

    //10% to the game company and 90% to the seller
    //transfer tokens to the game company and seller
    const transactionStatus= await transferTokensToSeller(listing, skin);
    if(transactionStatus===0){
      toast({
        title: "Marketplace Purchase Failed",
        description: `Failed to transfer tokens to ${listing.sellerName}`,
        variant: "destructive",
      });
      return;
    }
    console.log("transfwered tokems:", listing, skin);

    //then delete the skin to the from marketplace

    const deleteResponse = await fetch("/api/deleteSeller", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listingId: listing.listingId
      }),
    });
    const status = await deleteResponse.json();
    if (deleteResponse.ok) {
      console.log("Skin removed from marketplace:", status);
      toast({
        title: "Marketplace Purchase Successful",
        description: `You have purchased ${skin.name} from ${listing.sellerName} for ${listing.price} tokens`,
        variant: "success",
      });
    }
    else{
      console.log("Error removing skin from marketplace:", status);
      toast({
        title: "Marketplace Purchase Failed",
        description: `Failed to remove ${skin.name} from marketplace`,
        variant: "destructive",
      });
    }



    //call api to add Skin to user account
    const response = await fetch("/api/addSkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerName: user.playerName,
        skinId: skin.skinId,
      }),
    });
    const data = await response.json();

    if (response.ok) {
      console.log("Skin added to user account:", data);
    }
    else{
      console.log("Error adding skin to user account:", data);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          Skin Marketplace
        </h1>
        <p className="text-gray-300">
          Browse and purchase exclusive skins for your favorite games
        </p>
      </motion.div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <WalletMultiButton />
          <br></br>
          <br></br>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search skins..."
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
            {showFilters ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
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
                  <label className="block text-sm font-medium mb-2">
                    Rarity
                  </label>
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
              selectedGame === "all"
                ? "bg-purple-600 hover:bg-purple-700"
                : "border-gray-700"
            }`}
            onClick={() => setSelectedGame("all")}
          >
            <Gamepad2 className="mr-2 h-4 w-4" />
            All Games
          </Button>
          {games.map((game,index) => (
            <Button
              key={index}
              variant={selectedGame === game.id ? "default" : "outline"}
              className={`flex items-center whitespace-nowrap ${
                selectedGame === game.id
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "border-gray-700"
              }`}
              onClick={() => setSelectedGame(game.id)}
            >
              <img
                src={game.icon || "/cod.png"}
                alt={game.name}
                className="w-4 h-4 mr-2 rounded-full"
              />
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
        <Tabs defaultValue="official" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="official" className="text-lg py-3">
              <Store className="mr-2 h-5 w-5" /> Official Store
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="text-lg py-3">
              <Users className="mr-2 h-5 w-5" /> Player Marketplace
            </TabsTrigger>
          </TabsList>

          <TabsContent value="official">
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="mb-8"
            >
              <motion.div
                variants={itemVariants}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 mb-6 flex items-start"
              >
                <Info className="text-blue-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-400">Official Store</h3>
                  <p className="text-sm text-gray-300">
                    Purchase skins directly from game companies. These are brand
                    new skins that have never been owned before.
                  </p>
                </div>
              </motion.div>

              {filteredSkins.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-10 bg-gray-800/30 rounded-lg border border-gray-700"
                >
                  <ShoppingCart className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No skins found</h3>
                  <p className="text-gray-400">
                    Try adjusting your filters or search query
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredSkins.map((skin) => (
                    <motion.div key={skin.skinId} variants={itemVariants}>
                      <SkinCard skin={skin} onBuy={() => handleBuySkin(skin)} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="marketplace">
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="mb-8"
            >
              <motion.div
                variants={itemVariants}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 mb-6 flex items-start"
              >
                <Info className="text-purple-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-purple-400">
                    Player Marketplace
                  </h3>
                  <p className="text-sm text-gray-300">
                    Buy skins from other players, often at discounted prices.
                    When you purchase from the marketplace, 10% of the sale goes
                    to the game company and 90% to the seller.
                  </p>
                </div>
              </motion.div>

              {filteredMarketplaceListings.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-10 bg-gray-800/30 rounded-lg border border-gray-700"
                >
                  <ShoppingCart className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    No marketplace listings found
                  </h3>
                  <p className="text-gray-400">
                    Try adjusting your filters or search query
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMarketplaceListings.map((listing) => {
                    const skin = skins.find((s) => s.skinId === listing.skinId);
                    if (!skin) return null;
                    return (
                      <motion.div
                        key={listing.listingId}
                        variants={itemVariants}
                      >
                        <MarketplaceSkinCard
                          listing={listing}
                          skin={skin}
                          onBuy={() => handleBuyMarketplaceSkin(listing, skin)}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
