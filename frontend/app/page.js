"use client"
import { motion } from "framer-motion"
import GameCarousel from "@/components/game-carousel"
import GameCard from "@/components/game-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Trophy, Gamepad2, Coins } from "lucide-react"

export default function Home() {
  const games = [
    {
      id: 1,
      name: "Solana Battleground",
      description: "Engage in epic battles and earn rewards by defeating opponents",
      image: "/placeholder.svg?height=600&width=800",
      link: "/games/solana-battleground",
    },
    {
      id: 2,
      name: "Solana Ops",
      description: "Strategic operations in the Solana universe with high stakes rewards",
      image: "/placeholder.svg?height=600&width=800",
      link: "/games/solana-ops",
    },
    {
      id: 3,
      name: "Call of Duty",
      description: "The classic shooter reimagined with Solana staking and rewards",
      image: "/placeholder.svg?height=600&width=800",
      link: "/games/call-of-duty",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 z-20"></div>
          <div className="absolute w-full h-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center z-0"></div>
        </div>

        <div className="container mx-auto px-4 z-30 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Stake. Play. Win.
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Challenge opponents, stake your tokens, and earn rewards in our competitive Solana gaming ecosystem.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 rounded-full text-lg"
            >
              Start Gaming <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Floating Icons */}
        <motion.div
          variants={floatingIconVariants}
          animate="animate"
          className="absolute top-1/4 left-1/4 text-purple-500"
        >
          <Gamepad2 size={40} />
        </motion.div>

        <motion.div
          variants={floatingIconVariants}
          animate="animate"
          className="absolute bottom-1/4 right-1/4 text-blue-500"
        >
          <Trophy size={40} />
        </motion.div>

        <motion.div
          variants={floatingIconVariants}
          animate="animate"
          className="absolute top-1/3 right-1/3 text-yellow-500"
        >
          <Coins size={40} />
        </motion.div>
      </section>

      {/* Game Carousel Section */}
      <section className="py-16 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
          >
            Featured Games
          </motion.h2>

          <GameCarousel games={games} />
        </div>
      </section>

      {/* Game Cards Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
          >
            Explore Our Games
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {games.map((game) => (
              <motion.div key={game.id} variants={itemVariants}>
                <GameCard game={game} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Compete?</h2>
            <p className="text-lg mb-8">
              Join thousands of players already staking, competing, and earning rewards in our Solana gaming ecosystem.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-full text-lg"
            >
              Connect Wallet
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
