"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
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

export function AppShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
    }, [])

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: Home },
        { href: "/builder", label: "Builder", icon: FileText },
        { href: "/optimizer", label: "Optimizer", icon: Sparkles },
        { href: "/coach", label: "Coach", icon: MessageSquare },
    ]

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background">
            {/* Top Navigation Bar with Slant */}
            <nav className="fixed left-0 right-0 top-0 z-50 hidden lg:flex">
                <div className="relative w-full">
                    {/* Slanted background layer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-background/95 to-background/98 backdrop-blur-xl"
                         style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }} />

                    <div className="page-frame relative flex h-24 items-center justify-between gap-6">
                        <Link href="/" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card/78 shadow-[var(--shadow-sm)] backdrop-blur-xl transition-all group hover:-translate-y-0.5 xl:h-16 xl:w-16">
                            <span className="text-2xl font-black text-foreground transition-colors group-hover:text-orange-500">R</span>
                        </Link>

                        <div className="flex flex-1 justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-2xl" />
                                <div className="relative rounded-[2rem] bg-card/84 px-4 py-3 shadow-[var(--shadow-sm)]">
                                    <div className="flex items-center gap-3">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-medium transition-all xl:px-6",
                                                    isActive
                                                        ? "bg-orange-500 text-white shadow-[0_0_20px_-5px_rgba(255,102,0,0.5)]"
                                                        : "text-muted-foreground hover:bg-background/80 hover:text-foreground"
                                                )}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.label}</span>
                                            </Link>
                                        )
                                    })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-card/82 shadow-[var(--shadow-sm)]">
                                {mounted ? (
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                avatarBox: "h-10 w-10",
                                            }
                                        }}
                                    />
                                ) : (
                                    <User className="h-5 w-5 text-neutral-500" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Slanted accent line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"
                         style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0 100%)' }} />
                </div>
            </nav>

            {/* Main Content Wrapper with Slant */}
            <main className="hidden flex-1 min-h-0 overflow-hidden pt-24 lg:flex lg:flex-col">
                <div className="relative h-full w-full">
                    {/* Slanted top edge that complements the nav */}
                    <div className="absolute left-0 right-0 top-0 h-8 bg-gradient-to-b from-orange-500/5 to-transparent"
                         style={{ clipPath: 'polygon(0 0, 100% 15%, 100% 100%, 0 100%)' }} />

                    <div className="flex-1 h-full min-h-0 overflow-hidden relative z-10">
                        {children}
                    </div>
                </div>
            </main>

            {/* Mobile Layout */}
            <div className="lg:hidden flex h-screen w-full flex-col bg-background">
                {/* Top Mobile Bar */}
                <div className="flex h-[72px] flex-shrink-0 items-center justify-between bg-background/92 px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card/80 shadow-[var(--shadow-sm)]">
                            <span className="text-lg font-black text-foreground">R</span>
                        </div>
                        <span className="font-bold text-foreground">Resumate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                            className="rounded-xl p-2 text-foreground transition-colors hover:bg-card"
                        >
                            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Content */}
                <div className="flex-1 min-h-0 overflow-auto">
                    {children}
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/35" onClick={() => setIsSidebarOpen(false)} />
                    <div className="absolute bottom-0 left-0 top-0 flex w-3/4 max-w-xs flex-col gap-6 bg-card/94 p-6 shadow-[var(--shadow-lg)]">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-xl text-foreground">Menu</span>
                            <button onClick={() => setIsSidebarOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-2xl transition-colors",
                                        pathname === item.href 
                                            ? "bg-orange-500 text-white" 
                                            : "bg-transparent text-muted-foreground hover:bg-background/90 hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-auto pt-4">
                            {mounted && <UserButton showName />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
