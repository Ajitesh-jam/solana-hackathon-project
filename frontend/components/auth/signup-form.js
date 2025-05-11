"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, Loader2, Eye, EyeOff, Check, X } from "lucide-react"

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    playerName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Player name validation
    if (!formData.playerName.trim()) {
      newErrors.playerName = "Player name is required"
    } else if (formData.playerName.length < 3) {
      newErrors.playerName = "Player name must be at least 3 characters"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName: formData.playerName,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if(response.status === 409)
            {alert("Player name already taken");
            return}
        


        throw new Error(data.message || "Signup failed")
      }

      toast({
        title: "Account Created",
        description: "Welcome to the Solana Gaming Ecosystem!",
        variant: "gaming",
      })

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.message || "Please try again with different credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength indicators
  const passwordStrength = {
    length: formData.password.length >= 6,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  }

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 md:p-8 shadow-xl">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Create Account
            </h1>
            <p className="text-gray-400 mt-2">Join the Solana Gaming Ecosystem</p>
          </motion.div>

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="playerName">Player Name</Label>
              <Input
                id="playerName"
                name="playerName"
                placeholder="Choose a unique player name"
                value={formData.playerName}
                onChange={handleChange}
                className={errors.playerName ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.playerName && <p className="text-red-500 text-sm mt-1">{errors.playerName}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

              {formData.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-400 mb-1">Password strength:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      {passwordStrength.length ? (
                        <Check size={14} className="text-green-500 mr-1" />
                      ) : (
                        <X size={14} className="text-red-500 mr-1" />
                      )}
                      <span className={passwordStrength.length ? "text-green-500" : "text-red-500"}>
                        At least 6 characters
                      </span>
                    </div>
                    <div className="flex items-center">
                      {passwordStrength.hasUppercase ? (
                        <Check size={14} className="text-green-500 mr-1" />
                      ) : (
                        <X size={14} className="text-red-500 mr-1" />
                      )}
                      <span className={passwordStrength.hasUppercase ? "text-green-500" : "text-red-500"}>
                        Uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center">
                      {passwordStrength.hasNumber ? (
                        <Check size={14} className="text-green-500 mr-1" />
                      ) : (
                        <X size={14} className="text-red-500 mr-1" />
                      )}
                      <span className={passwordStrength.hasNumber ? "text-green-500" : "text-red-500"}>Number</span>
                    </div>
                    <div className="flex items-center">
                      {passwordStrength.hasSpecialChar ? (
                        <Check size={14} className="text-green-500 mr-1" />
                      ) : (
                        <X size={14} className="text-red-500 mr-1" />
                      )}
                      <span className={passwordStrength.hasSpecialChar ? "text-green-500" : "text-red-500"}>
                        Special character
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Login
              </Link>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 pt-6 border-t border-gray-700"
          >
            <p className="text-center text-sm text-gray-500">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
