"use client"

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { FileText, MessageSquare, BarChart3, Sparkles } from "lucide-react"
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <FileText className="h-6 w-6" />
          <span className="text-xl font-bold">ResumeAI</span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/builder" className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary">
            <FileText className="h-4 w-4" />
            <span>Builder</span>
          </Link>
          <Link href="/optimizer" className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Optimizer</span>
          </Link>
          <Link href="/coach" className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary">
            <MessageSquare className="h-4 w-4" />
            <span>Coach</span>
          </Link>
          <Link href="/dashboard" className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary">
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          
          <ThemeToggle />

          <SignedOut>
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-primary hover:from-blue-600 hover:to-primary/90">
                  Sign Up
                </Button>
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}