"use client"

import { SignIn } from '@clerk/nextjs'
import { motion } from 'framer-motion'

export default function SignInPage({
  searchParams,
}: {
  searchParams: { timeout?: string }
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500/10 via-green-500/10 to-red-500/10"
    >
      {searchParams.timeout === 'true' && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
          You were logged out due to 30 minutes of inactivity
        </div>
      )}
      <SignIn />
    </motion.div>
  )
}
