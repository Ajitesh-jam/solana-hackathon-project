"use client"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(
        "rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm text-white shadow-md overflow-hidden",
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        boxShadow: "0 0 15px rgba(138, 43, 226, 0.3)",
        borderColor: "rgba(138, 43, 226, 0.5)",
        transition: { duration: 0.2 },
      }}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = forwardRef(({ className, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef(({ className, ...props }, ref) => {
  return (
    <motion.h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400",
        className,
      )}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef(({ className, ...props }, ref) => {
  return (
    <motion.p
      ref={ref}
      className={cn("text-sm text-gray-400", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = forwardRef(({ className, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      {...props}
    />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = forwardRef(({ className, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
