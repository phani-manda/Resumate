"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  MessageSquare,
  Menu,
  X,
  User,
} from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ThemeToggle"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/builder", label: "Builder", icon: FileText },
  { href: "/optimizer", label: "Optimizer", icon: Sparkles },
  { href: "/coach", label: "Coach", icon: MessageSquare },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  // Close the mobile drawer on browser back/forward navigation.
  // Link clicks close it via their own onClick handlers.
  useEffect(() => {
    const handlePopState = () => setMobileOpen(false)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navLinks = (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex h-10 items-center gap-3 rounded-md px-3 text-body-md transition-all duration-base",
              isActive
                ? "border-l-2 border-accent bg-accent-subtle pl-[10px] font-medium text-accent-text"
                : "border-l-2 border-transparent text-ink-secondary hover:bg-subtle hover:text-ink-primary"
            )}
          >
            <item.icon className="h-6 w-6 shrink-0" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="flex h-screen flex-col bg-base">
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-line bg-surface px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-md p-2 text-ink-secondary hover:bg-subtle lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="text-lg font-bold tracking-tight text-ink-primary">
            Resumate
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-accent-subtle px-2.5 py-0.5 text-label uppercase text-accent-text sm:inline-flex">
            Pro
          </span>
          <ThemeToggle />
          <div className="flex h-9 w-9 items-center justify-center">
            {mounted ? (
              <UserButton
                appearance={{
                  elements: { avatarBox: "h-8 w-8" },
                }}
              />
            ) : (
              <User className="h-4 w-4 text-ink-muted" />
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden pt-14">
        <aside className="hidden h-full w-[220px] shrink-0 flex-col border-r border-line bg-surface lg:flex">
          {navLinks}
        </aside>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 top-0 flex w-[min(280px,85vw)] flex-col bg-surface shadow-modal">
            <div className="flex h-14 items-center justify-between border-b border-line px-4">
              <span className="font-bold text-ink-primary">Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-md p-2 text-ink-secondary hover:bg-subtle"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{navLinks}</div>
          </div>
        </div>
      )}
    </div>
  )
}
