"use client"

import { SignUp } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Zap, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 overflow-hidden bg-background">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex relative items-center justify-center bg-zinc-900 border-r border-white/10 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 60, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-500/10 rounded-full blur-3xl"
          />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 bg-center" />
        </div>

        <div className="relative z-10 p-12 text-center max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-8 backdrop-blur-xl">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-6">Initialize Career Sequence.</h1>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Join elite professionals using AI to dominate the job market. Your optimized future starts now.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 bg-background relative">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center lg:hidden mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Resumate</h1>
            <p className="text-zinc-500 mt-2">Create your account</p>
          </div>

          <div className="glass-panel p-1 rounded-2xl md:p-8 md:bg-white/5 md:backdrop-blur-xl md:border md:border-white/10">
            <SignUp
              appearance={{
                elements: {
                  formButtonPrimary: "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20",
                  card: "bg-transparent shadow-none border-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-white/5 border-white/10 hover:bg-white/10 text-white",
                  formFieldLabel: "text-zinc-400",
                  formFieldInput: "bg-black/20 border-white/10 focus:border-primary/50 text-white",
                  footer: "hidden"
                }
              }}
            />

            {/* Custom Footer Links */}
            <div className="mt-6 text-center text-sm text-zinc-500">
              Already have an account?
              <Link href="/sign-in" className="ml-1 text-primary hover:text-primary/80 font-medium transition-colors">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
