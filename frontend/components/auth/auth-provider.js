"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"


// Create auth context
const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for user in localStorage (you might want to use cookies instead)
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (playerName, password) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerName, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Save user to state and localStorage
      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast({
        title: "Login Successful",
        description: "Welcome back to the Solana Gaming Ecosystem!",
        variant: "gaming",
      })

      return data.user
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Signup function
  const signup = async (playerName, email, password) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerName, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Signup failed")
      }

      toast({
        title: "Account Created",
        description: "Welcome to the Solana Gaming Ecosystem!",
        variant: "gaming",
      })

      return data.user
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error.message || "Please try again with different credentials",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      // Clear user from state and localStorage
      setUser(null)
      localStorage.removeItem("user")

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      })

      router.push("/login")
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext)
