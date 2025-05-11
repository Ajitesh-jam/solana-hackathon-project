"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import GameCarousel from "@/components/GameCarousel"
import GameCard from "@/components/GameCard"
import { Gamepad2, Trophy, Coins, Users } from "lucide-react"

// Game data
const games = [
  {
    id: "solanabattlefield",
    name: "Solana Battlefield",
    description: "Intense multiplayer battles with strategic gameplay and high stakes rewards.",
    image: "/placeholder.svg?height=600&width=800",
    link: "/games/solanabattlefield",
    downloadLink:"/multi.zip"
  },
  {
    id: "solanaops",
    name: "Solana Ops",
    description: "Tactical team-based missions with real-time combat and blockchain rewards.",
    image: "/placeholder.svg?height=600&width=800",
    link: "/games/solanaops",
    downloadLink:"/multi.zip"
  },
  {
    id: "callofduty",
    name: "Call of Duty",
    description: "The legendary FPS now with Solana integration. Stake, play, and earn.",
    image: "/placeholder.svg?height=600&width=800",
    link: "/games/callofduty",
    downloadLink:"/multi.zip"
  },
]

export default function Home() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const floatingIconVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
              variants={itemVariants}
            >
              Compete. Stake. Win.
            </motion.h1>
            <motion.p className="text-xl text-gray-300 mb-8" variants={itemVariants}>
              Join the ultimate blockchain gaming ecosystem where your skills earn you real rewards.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6 px-8">
                Start Playing Now
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-1/4 left-1/4" variants={floatingIconVariants} animate="animate">
            <Gamepad2 className="h-12 w-12 text-purple-500 opacity-30" />
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-1/4"
            variants={floatingIconVariants}
            animate="animate"
            transition={{ delay: 0.5 }}
          >
            <Trophy className="h-10 w-10 text-yellow-500 opacity-30" />
          </motion.div>
          <motion.div
            className="absolute bottom-1/4 left-1/3"
            variants={floatingIconVariants}
            animate="animate"
            transition={{ delay: 1 }}
          >
            <Coins className="h-14 w-14 text-green-500 opacity-30" />
          </motion.div>
          <motion.div
            className="absolute bottom-1/3 right-1/3"
            variants={floatingIconVariants}
            animate="animate"
            transition={{ delay: 1.5 }}
          >
            <Users className="h-8 w-8 text-blue-500 opacity-30" />
          </motion.div>
        </div>
      </section>

      {/* Game Carousel */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Featured Games
          </motion.h2>
          <GameCarousel games={games} />
        </div>
      </section>

      {/* Game Cards */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Explore Our Games
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to Join the Competition?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Create an account, connect your Solana wallet, and start earning rewards today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6 px-8">
              Sign Up Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
