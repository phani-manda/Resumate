"use client"

import { Navbar } from "@/components/navbar"
import { AIOptimizer } from "@/components/ai-optimizer"
import { motion } from "framer-motion"

export default function OptimizerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 via-primary to-success bg-clip-text text-transparent">
            AI Resume Optimizer
          </h1>
          <p className="text-muted-foreground">
            Optimize your resume for ATS and get personalized recommendations
          </p>
        </motion.div>
        <AIOptimizer />
      </main>
    </div>
  )
}
