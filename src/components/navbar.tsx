"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { FileText, MessageSquare, BarChart3, LogOut, User, Sparkles } from "lucide-react"
import { authClient, useSession } from "@/lib/auth-client"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { data: session, isPending, refetch } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await authClient.signOut()
    if (error?.code) {
      toast.error("Failed to sign out")
    } else {
      localStorage.removeItem("bearer_token")
      refetch()
      router.push("/")
      toast.success("Signed out successfully")
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText className="h-6 w-6" />
          </motion.div>
          <span className="text-xl font-bold">ResumeAI</span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/builder">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <FileText className="h-4 w-4" />
              <span>Builder</span>
            </motion.div>
          </Link>
          <Link href="/optimizer">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <Sparkles className="h-4 w-4" />
              <span>Optimizer</span>
            </motion.div>
          </Link>
          <Link href="/coach">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Coach</span>
            </motion.div>
          </Link>
          <Link href="/dashboard">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </motion.div>
          </Link>
          
          <ThemeToggle />

          {!isPending && !session?.user ? (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-primary hover:from-blue-600 hover:to-primary/90">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : !isPending ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{session?.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </motion.nav>
  )
}