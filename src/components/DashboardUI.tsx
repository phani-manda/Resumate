"use client";

import { useState } from "react";
import {
  Home,
  FileText,
  Sparkles,
  MessageSquare,
  Search,
  ArrowRight,
  Star,
  TrendingUp,
  BarChart3,
  Lock,
  Loader2,
} from "lucide-react";
import { StatsDashboard } from "@/components/StatsDashboard";
import { ResumeBuilder } from "@/components/ResumeBuilder";
import { AIOptimizer } from "@/components/AIOptimizer";
import { CareerCoachChat } from "@/components/CareerCoachChat";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type TabType = "home" | "dashboard" | "builder" | "optimizer" | "coach";

export function DashboardUI() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const tabs = [
    { id: "home" as TabType, label: "Home", icon: Home, requiresAuth: false },
    { id: "dashboard" as TabType, label: "Dashboard", icon: BarChart3, requiresAuth: true },
    { id: "builder" as TabType, label: "Builder", icon: FileText, requiresAuth: true },
    { id: "optimizer" as TabType, label: "Optimizer", icon: Sparkles, requiresAuth: true },
    { id: "coach" as TabType, label: "Coach", icon: MessageSquare, requiresAuth: true },
  ];

  const handleTabChange = (tabId: TabType) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.requiresAuth && !isSignedIn) {
      router.push('/sign-in');
      return;
    }
    setActiveTab(tabId);
  };

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-neutral-800/50">
          {/* Left: Pill Navigation Tabs */}
          <div className="flex gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`futuristic-pill ${
                  activeTab === tab.id ? "futuristic-pill-active" : ""
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2 inline-block" />
                {tab.label}
                {tab.requiresAuth && !isSignedIn && (
                  <Lock className="w-3 h-3 ml-2 inline-block" />
                )}
              </button>
            ))}
          </div>

          {/* Right: Search Bar or Auth Buttons */}
          <div className="flex items-center gap-4">
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-full text-white placeholder:text-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <div className="flex items-center gap-3">
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10 border-2 border-orange-500 rounded-full",
                          userButtonPopoverCard: "bg-black border border-neutral-800",
                          userButtonPopoverActionButton: "text-white hover:bg-neutral-800",
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/sign-in" className="px-6 py-2 rounded-full border border-orange-500 text-orange-500 hover:bg-orange-500/10 transition-colors">
                      Sign In
                    </Link>
                    <Link href="/sign-up" className="futuristic-cta whitespace-nowrap">
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </header>

        {/* Content Area - Changes based on active tab */}
        <div className="flex-1 overflow-auto">
          {activeTab === "home" && <HomeContent setActiveTab={handleTabChange} isSignedIn={isSignedIn} />}
          {activeTab === "dashboard" && (
            <div className="p-8">
              {isSignedIn ? <StatsDashboard /> : <AuthRequiredMessage />}
            </div>
          )}
          {activeTab === "builder" && (
            <div className="p-8">
              {isSignedIn ? <ResumeBuilder /> : <AuthRequiredMessage />}
            </div>
          )}
          {activeTab === "optimizer" && (
            <div className="p-8">
              {isSignedIn ? <AIOptimizer /> : <AuthRequiredMessage />}
            </div>
          )}
          {activeTab === "coach" && (
            <div className="p-8 h-full">
              {isSignedIn ? <CareerCoachChat /> : <AuthRequiredMessage />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function AuthRequiredMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <Lock className="w-16 h-16 text-orange-500 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
      <p className="text-neutral-400 mb-6 max-w-md">
        Please sign in to access this feature and unlock all premium capabilities.
      </p>
      <Link href="/sign-in" className="futuristic-cta">
        Sign In to Continue
      </Link>
    </div>
  );
}

function HomeContent({ setActiveTab, isSignedIn }: { setActiveTab: (tab: TabType) => void; isSignedIn: boolean | undefined }) {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Hero Card */}
        <div className="relative futuristic-card p-12 mb-6 overflow-hidden group">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image Placeholder */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent" />
              <FileText className="w-32 h-32 text-neutral-700 relative z-10" />
              <div className="absolute bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                AI-Powered
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
                  BUILD YOUR
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">
                    DREAM CAREER
                  </span>
                </h1>
                <p className="text-xl text-neutral-400 leading-relaxed">
                  EXPERIENCE INTELLIGENT RESUME OPTIMIZATION
                </p>
              </div>

              {/* Quick Stats/Features */}
              <div className="flex gap-4 flex-wrap">
                {[
                  { icon: Star, label: "ATS Optimized" },
                  { icon: TrendingUp, label: "98% Success" },
                  { icon: Sparkles, label: "AI Powered" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-neutral-900/50 px-4 py-2 rounded-full border border-neutral-800"
                  >
                    <item.icon className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-white font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 flex-wrap">
                {isSignedIn ? (
                  <>
                    <button
                      onClick={() => setActiveTab("builder")}
                      className="futuristic-cta group"
                    >
                      Start Building
                      <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className="px-8 py-3 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-black transition-all"
                    >
                      View Dashboard
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/sign-up" className="futuristic-cta group">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/sign-in"
                      className="px-8 py-3 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-black transition-all inline-block"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <button
            onClick={() => setActiveTab("dashboard")}
            className="futuristic-card p-6 hover:border-orange-500 transition-all group text-left relative"
          >
            {!isSignedIn && (
              <div className="absolute top-4 right-4">
                <Lock className="w-4 h-4 text-neutral-500" />
              </div>
            )}
            <BarChart3 className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Analytics</h3>
            <p className="text-neutral-400 text-sm">
              Track your resume performance
            </p>
          </button>

          <button
            onClick={() => setActiveTab("builder")}
            className="futuristic-card p-6 hover:border-orange-500 transition-all group text-left relative"
          >
            {!isSignedIn && (
              <div className="absolute top-4 right-4">
                <Lock className="w-4 h-4 text-neutral-500" />
              </div>
            )}
            <FileText className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Builder</h3>
            <p className="text-neutral-400 text-sm">
              Create professional resumes
            </p>
          </button>

          <button
            onClick={() => setActiveTab("optimizer")}
            className="futuristic-card p-6 hover:border-orange-500 transition-all group text-left relative"
          >
            {!isSignedIn && (
              <div className="absolute top-4 right-4">
                <Lock className="w-4 h-4 text-neutral-500" />
              </div>
            )}
            <Sparkles className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Optimizer</h3>
            <p className="text-neutral-400 text-sm">
              Boost your ATS score
            </p>
          </button>

          <button
            onClick={() => setActiveTab("coach")}
            className="futuristic-card p-6 hover:border-orange-500 transition-all group text-left relative"
          >
            {!isSignedIn && (
              <div className="absolute top-4 right-4">
                <Lock className="w-4 h-4 text-neutral-500" />
              </div>
            )}
            <MessageSquare className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">AI Coach</h3>
            <p className="text-neutral-400 text-sm">
              Get personalized career advice
            </p>
          </button>
        </div>

        {/* Promotional Card - Bottom */}
        <div className="futuristic-card p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="futuristic-badge inline-block">Limited Offer</div>
              <h2 className="text-4xl font-black text-white">
                40% OFF
                <br />
                <span className="text-2xl font-normal text-neutral-400">
                  ON ALL PREMIUM TEMPLATES
                </span>
              </h2>
              <button
                onClick={() => setActiveTab("builder")}
                className="futuristic-cta mt-4"
              >
                UPGRADE NOW
              </button>
            </div>
            <div className="relative h-48 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-2xl" />
              <Sparkles className="w-24 h-24 text-neutral-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
