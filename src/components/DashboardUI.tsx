"use client"

import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Loader2, Lock } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LandingPage } from "@/components/LandingPage"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/Button"

const navLinks = [
  { href: "/dashboard", label: "Dashboard", auth: true },
  { href: "/builder", label: "Builder", auth: true },
  { href: "/optimizer", label: "Optimizer", auth: true },
  { href: "/coach", label: "Coach", auth: true },
]

export function DashboardUI() {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base">
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-line bg-surface px-4 md:px-6">
        <Link href="/" className="text-lg font-bold text-ink-primary">
          Resumate
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.auth && !isSignedIn ? "/sign-in" : link.href}
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-body-sm text-ink-secondary transition-colors hover:bg-subtle hover:text-ink-primary"
            >
              {link.label}
              {link.auth && !isSignedIn && <Lock className="h-3 w-3" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isSignedIn ? (
            <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <LandingPage isSignedIn={!!isSignedIn} />
    </div>
  )
}
