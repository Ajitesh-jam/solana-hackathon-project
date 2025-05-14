"use client"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { History, Shield, Settings, Tag, Gamepad2 } from "lucide-react"

export default function ProfileTabs() {
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-2">
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="history" className="text-sm md:text-base">
            <History className="w-4 h-4 mr-2" /> Game History
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-sm md:text-base">
            <Shield className="w-4 h-4 mr-2" /> Stats
          </TabsTrigger>
          <TabsTrigger value="skins" className="text-sm md:text-base">
            <Tag className="w-4 h-4 mr-2" /> My Skins
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-sm md:text-base">
            <Settings className="w-4 h-4 mr-2" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Recent Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Game history content */}
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center mb-3 md:mb-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-green-500/20">
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Solana Battleground</h3>
                      <p className="text-sm text-gray-400">vs BlockchainNinja</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                    <div className="md:mr-8">
                      <p className="text-sm text-gray-400">Result</p>
                      <p className="font-medium text-green-400">Victory</p>
                    </div>

                    <div className="md:mr-8">
                      <p className="text-sm text-gray-400">Reward</p>
                      <p className="font-medium flex items-center">150</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-400">Date</p>
                      <p className="font-medium">Apr 28, 2023</p>
                    </div>
                  </div>
                </div>
                {/* More game history items */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Performance Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <h3 className="text-sm text-gray-400 mb-1">Total Games</h3>
                  <p className="text-3xl font-bold">42</p>
                </div>

                <div className="bg-green-900/30 rounded-lg p-4 text-center">
                  <h3 className="text-sm text-gray-400 mb-1">Wins</h3>
                  <p className="text-3xl font-bold text-green-400">28</p>
                </div>

                <div className="bg-red-900/30 rounded-lg p-4 text-center">
                  <h3 className="text-sm text-gray-400 mb-1">Losses</h3>
                  <p className="text-3xl font-bold text-red-400">14</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skins">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>My Skins</CardTitle>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <a href="/profile/sell-skins">
                  <Tag className="mr-2 h-4 w-4" />
                  Sell Skins
                </a>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-400">
                  You own 3 skins. Visit the Sell Skins page to list them on the marketplace.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Skin preview cards */}
                  <div className="bg-gray-700/30 rounded-lg p-3 flex items-center">
                    <div className="w-12 h-12 rounded-md bg-gray-600 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium">Dragon Slayer</h4>
                      <p className="text-xs text-gray-400">Legendary Armor</p>
                    </div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-3 flex items-center">
                    <div className="w-12 h-12 rounded-md bg-gray-600 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium">Cyber Commando</h4>
                      <p className="text-xs text-gray-400">Epic Outfit</p>
                    </div>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-3 flex items-center">
                    <div className="w-12 h-12 rounded-md bg-gray-600 mr-3 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-medium">Golden Arsenal</h4>
                      <p className="text-xs text-gray-400">Legendary Weapon Pack</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Manage your account settings and preferences</p>
              <div className="space-y-4">
                <Button className="w-full justify-start">
                  <Gamepad2 className="mr-2" /> Game Preferences
                </Button>
                <Button className="w-full justify-start">
                  <Settings className="mr-2" /> Profile Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
