"use client"

import { SignIn } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'

function SignInContent() {
  const searchParams = useSearchParams()
  
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 overflow-hidden bg-background">
      <div className="fixed right-5 top-5 z-30">
        <ThemeToggle />
      </div>
      {/* Left Side - Visual */}
      <div className="relative hidden items-center justify-center overflow-hidden bg-card/65 lg:flex">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-orange-500/12 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -60, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-300/10 rounded-full blur-3xl"
          />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 bg-center" />
        </div>

        <div className="relative z-10 p-12 text-center max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-card/82 shadow-[var(--shadow-sm)] backdrop-blur-xl">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-6 text-4xl font-bold text-foreground">Welcome Back, Pilot.</h1>
            <p className="text-xl leading-relaxed text-muted-foreground">
              Your command center is ready. Resume your optimization journey and unlock new career trajectories.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 bg-background relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 to-transparent pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          {searchParams.get('timeout') === 'true' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 rounded-2xl bg-orange-500/12 p-4 text-sm text-orange-500 shadow-[var(--shadow-sm)]"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Session expired due to inactivity.
            </motion.div>
          )}

          <div className="text-center lg:hidden mb-8">
            <h1 className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-3xl font-bold text-transparent">Resumate</h1>
            <p className="mt-2 text-muted-foreground">Sign in to continue</p>
          </div>

          <div className="glass-panel rounded-[32px] p-2 md:p-8">
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary: "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20",
                  card: "bg-transparent shadow-none border-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-[hsl(var(--card))]/80 text-[hsl(var(--foreground))] shadow-[var(--shadow-sm)] hover:bg-[hsl(var(--card))]",
                  socialButtonsBlockButtonText: "text-[hsl(var(--foreground))]",
                  dividerLine: "bg-[hsl(var(--border))]",
                  dividerText: "text-[hsl(var(--muted-foreground))]",
                  formFieldLabel: "text-[hsl(var(--foreground))] font-medium",
                  formFieldInput: "bg-[hsl(var(--card))]/78 border-transparent text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] shadow-[var(--shadow-sm)]",
                  formFieldInputPlaceholder: "text-[hsl(var(--muted-foreground))]",
                  identifierPreviewText: "text-[hsl(var(--foreground))]",
                  identifierPreviewEditButton: "text-primary hover:text-primary/80",
                  formFieldAction: "text-primary hover:text-primary/80",
                  footerActionLink: "text-primary hover:text-primary/80",
                  footer: "hidden",
                  otpCodeFieldInput: "bg-[hsl(var(--card))]/78 border-transparent text-[hsl(var(--foreground))] shadow-[var(--shadow-sm)]",
                  formResendCodeLink: "text-primary hover:text-primary/80",
                  alternativeMethodsBlockButton: "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] bg-[hsl(var(--card))]/75 shadow-[var(--shadow-sm)]",
                  badge: "bg-[hsl(var(--card))]/75 text-[hsl(var(--muted-foreground))]"
                }
              }}
            />

            {/* Custom Footer Links because we hid Clerk's */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?
              <Link href="/sign-up" className="ml-1 text-primary hover:text-primary/80 font-medium transition-colors">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SignInFallback() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-card/78 shadow-[var(--shadow-sm)]" />
        <div className="h-4 w-32 rounded bg-card/72" />
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInContent />
    </Suspense>
  )
}
