'use client'

import { Navbar } from "@/components/navbar"
import { StatsDashboard } from "@/components/stats-dashboard"
import { motion } from "framer-motion"

export function DashboardShell() {
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
          <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your resume performance and optimization metrics
          </p>
        </motion.div>
        <StatsDashboard />
      </main>
    </div>
  )
}
