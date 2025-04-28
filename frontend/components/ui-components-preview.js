"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, User, LogOut, ChevronDown, Bell, Check, Wallet, Gamepad2 } from "lucide-react"

export default function UIComponentsPreview() {
  const [isChecked, setIsChecked] = useState(false)
  const [sliderValue, setSliderValue] = useState([50])
  const { toast } = useToast()

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

  const showToast = (variant) => {
    toast({
      title: "Action Completed",
      description: `This is a ${variant} toast notification`,
      variant,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          UI Components Preview
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Interactive preview of all UI components for your Solana gaming platform
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
      >
        {/* Switch Component */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Switch Component</CardTitle>
              <CardDescription>Toggle between two states</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="private-mode">Private Mode</Label>
                <Switch id="private-mode" checked={isChecked} onCheckedChange={setIsChecked} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Notifications</Label>
                <Switch id="notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="gaming-mode" className="flex items-center">
                  <Gamepad2 className="mr-2 h-4 w-4 text-purple-400" /> Gaming Mode
                </Label>
                <Switch id="gaming-mode" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Avatar Component */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Avatar Component</CardTitle>
              <CardDescription>User profile pictures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback>CG</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">CryptoGamer</p>
                  <p className="text-sm text-gray-400">Pro Player</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border-2 border-purple-500">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" alt="User" />
                  <AvatarFallback>SN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">SolanaKing</p>
                  <p className="text-sm text-gray-400">Tournament Winner</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-blue-500">
                  <AvatarFallback>BN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">BlockchainNinja</p>
                  <p className="text-sm text-gray-400">New Player</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dropdown Menu Component */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Dropdown Menu</CardTitle>
              <CardDescription>Contextual menus for actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Profile Options <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Wallet className="mr-2 h-4 w-4" />
                      <span>Wallet</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700">
                      <Bell className="mr-2 h-4 w-4" /> Notifications
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Check className="mr-2 h-4 w-4 text-green-400" />
                      <span>New reward available</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Check className="mr-2 h-4 w-4 text-blue-400" />
                      <span>Game invitation</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Label and Input Component */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Label & Input</CardTitle>
              <CardDescription>Form controls for user input</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Enter your username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet">Wallet Address</Label>
                <Input id="wallet" placeholder="Enter your Solana wallet address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stake">Stake Amount</Label>
                <Input id="stake" type="number" placeholder="0" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Slider Component */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Slider Component</CardTitle>
              <CardDescription>Select a value from a range</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Token Amount</Label>
                  <span className="font-medium">{sliderValue[0]}</span>
                </div>
                <Slider value={sliderValue} min={10} max={1000} step={10} onValueChange={setSliderValue} />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>10</span>
                  <span>500</span>
                  <span>1000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Toast Component */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Toast Notifications</CardTitle>
              <CardDescription>Feedback notifications for users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={() => showToast("gaming")}
              >
                Show Gaming Toast
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                onClick={() => showToast("success")}
              >
                Show Success Toast
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                onClick={() => showToast("destructive")}
              >
                Show Error Toast
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
