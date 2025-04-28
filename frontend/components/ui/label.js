"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <motion.label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-200",
      className
    )}
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
