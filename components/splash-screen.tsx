"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SplashScreen() {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 500)
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#1a1625] to-[#2a2635] cursor-pointer"
      onClick={handleClick}
    >
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={isAnimating ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <Image
            src="/logo.gif"
            alt="QCAP Logo"
            width={120}
            height={120}
            className="mb-6"
          />
          <h1 className="text-6xl font-bold text-white mb-4 glow-text">QCAP</h1>
          <p className="text-xl text-gray-300">Analytics Dashboard</p>
        </motion.div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-400"
        >
          Click anywhere to continue
        </motion.p>
      </motion.div>
    </div>
  )
} 