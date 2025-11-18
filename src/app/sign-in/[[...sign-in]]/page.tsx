"use client"

import { SignIn } from '@clerk/nextjs'
import { motion } from 'framer-motion'

export default function SignInPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-500/10 via-green-500/10 to-red-500/10"
    >
      <SignIn />
    </motion.div>
  )
}
