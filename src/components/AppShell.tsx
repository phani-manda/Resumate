"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    FileText,
    Sparkles,
    MessageSquare,
    Menu,
    X,
} from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

export function AppShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathname = usePathname()

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: Home },
        { href: "/builder", label: "Builder", icon: FileText },
        { href: "/optimizer", label: "Optimizer", icon: Sparkles },
        { href: "/coach", label: "Coach", icon: MessageSquare },
    ]

    return (
        <div className="flex flex-col h-screen bg-black overflow-hidden">
            {/* Top Navigation Bar */}
            <nav className="hidden lg:flex fixed top-0 left-0 right-0 h-20 items-center justify-between px-8 bg-neutral-950 border-b border-neutral-800 z-50">
                {/* Logo */}
                <Link href="/" className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 flex items-center justify-center hover:border-orange-500 transition-all group">
                    <span className="text-2xl font-black text-white group-hover:text-orange-500 transition-colors">R</span>
                </Link>

                {/* Horizontal Cylindrical Navigation Container */}
                <div className="flex-1 flex justify-center">
                    <div className="relative">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-white/10 blur-xl rounded-full" />
                        {/* Main container */}
                        <div className="relative bg-neutral-900 rounded-full border-2 border-white px-8 py-4 backdrop-blur-sm shadow-2xl shadow-white/20">
                            <div className="flex items-center gap-4">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-2 px-6 py-3 rounded-full transition-all font-medium",
                                            isActive
                                                ? "bg-orange-500 text-white shadow-[0_0_20px_-5px_rgba(255,102,0,0.5)]"
                                                : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                                        )}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                )
                            })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center overflow-hidden hover:border-orange-500 transition-colors">
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "h-10 w-10",
                                }
                            }}
                        />
                    </div>
                </div>
            </nav>

            {/* Main Content Wrapper */}
            <main className="pt-20 flex-1 overflow-auto lg:block hidden bg-black">
                {children}
            </main>

            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col h-screen w-full bg-black">
                {/* Top Mobile Bar */}
                <div className="h-16 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                            <span className="text-lg font-black text-white">R</span>
                        </div>
                        <span className="font-bold text-white">Resumate</span>
                    </div>
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-white"
                    >
                        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Content */}
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-neutral-950 border-r border-neutral-800 p-6 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-xl text-white">Menu</span>
                            <button onClick={() => setIsSidebarOpen(false)} className="text-neutral-400 hover:text-white">
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
                                            : "hover:bg-neutral-800 text-neutral-400 hover:text-white"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-auto pt-4 border-t border-neutral-800">
                            <UserButton showName />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
