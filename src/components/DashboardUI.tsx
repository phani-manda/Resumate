"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
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
  ShieldCheck,
  ScanSearch,
  Blocks,
  Quote,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, useReducedMotion } from "framer-motion";
import {
  buttonHover,
  buttonTap,
  cardHoverSoft,
  iconHover,
  sectionReveal,
  springItem,
  springList,
} from "@/lib/animation";

const StatsDashboard = dynamic(
  () => import("@/components/StatsDashboard").then((module) => module.StatsDashboard),
  {
    loading: () => (
      <FeaturePanelSkeleton
        title="Loading dashboard"
        description="Preparing your analytics workspace."
      />
    ),
  }
);

const ResumeBuilder = dynamic(
  () => import("@/components/ResumeBuilder").then((module) => module.ResumeBuilder),
  {
    loading: () => (
      <FeaturePanelSkeleton
        title="Loading builder"
        description="Setting up your resume editor."
      />
    ),
  }
);

const AIOptimizer = dynamic(
  () => import("@/components/AIOptimizer").then((module) => module.AIOptimizer),
  {
    loading: () => (
      <FeaturePanelSkeleton
        title="Loading optimizer"
        description="Preparing ATS analysis tools."
      />
    ),
  }
);

const CareerCoachChat = dynamic(
  () => import("@/components/CareerCoachChat").then((module) => module.CareerCoachChat),
  {
    loading: () => (
      <FeaturePanelSkeleton
        title="Loading coach"
        description="Connecting your AI coaching workspace."
      />
    ),
  }
);

const featureShowcase = [
  {
    title: "Smart Builder",
    description: "Write, preview, and export in one flow.",
    icon: FileText,
    stat: "Fast drafting",
  },
  {
    title: "ATS Match",
    description: "Spot missing keywords and tighten fit.",
    icon: ScanSearch,
    stat: "Sharper targeting",
  },
  {
    title: "AI Coach",
    description: "Get quick direction when you are stuck.",
    icon: MessageSquare,
    stat: "Instant guidance",
  },
];

const workflowSteps = [
  {
    title: "Build",
    description: "Create a clean base resume.",
  },
  {
    title: "Optimize",
    description: "Tailor for the role in seconds.",
  },
  {
    title: "Refine",
    description: "Polish copy with guided feedback.",
  },
];

const landingProof = [
  {
    eyebrow: "Precision",
    title: "Made to stay clear",
    body: "Readable, calm, and easy to scan.",
    icon: ShieldCheck,
  },
  {
    eyebrow: "Structure",
    title: "One system",
    body: "Builder, optimizer, analytics, and coaching stay aligned.",
    icon: Blocks,
  },
  {
    eyebrow: "Momentum",
    title: "Fast feedback",
    body: "You always know what to do next.",
    icon: Zap,
  },
];

const testimonials = [
  {
    quote: "Cleaner than a typical resume tool.",
    name: "Product-minded applicant",
  },
  {
    quote: "Tailoring applications feels lighter here.",
    name: "Early-career engineer",
  },
];

type TabType = "home" | "dashboard" | "builder" | "optimizer" | "coach";

function UserButtonWrapper() {
  return (
    <UserButton 
      appearance={{
        elements: {
          avatarBox: "w-10 h-10 rounded-full",
          userButtonPopoverCard: "bg-[hsl(var(--card))] text-[hsl(var(--foreground))]",
          userButtonPopoverActionButton: "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]",
        },
      }}
    />
  );
}

export function DashboardUI() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const reduceMotion = useReducedMotion() ?? false;

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

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="flex-shrink-0 bg-background/90">
          <div className="page-frame flex items-center justify-between gap-4 py-4 md:py-5 xl:py-6">
          {/* Left: Navigation Tabs */}
          <div className="flex gap-2.5 md:gap-3.5 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`futuristic-pill whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id ? "futuristic-pill-active" : ""
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2 inline-block" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.requiresAuth && !isSignedIn && (
                  <Lock className="w-3 h-3 ml-2 inline-block" />
                )}
              </button>
            ))}
          </div>

          {/* Right: Search & Auth */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <ThemeToggle />
            <div className="relative hidden w-56 md:block md:w-80 xl:w-[30rem]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-card/80 py-2.5 pl-10 pr-4 text-sm text-foreground shadow-[var(--shadow-sm)] backdrop-blur-xl transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/40 md:py-3 md:pl-12"
              />
            </div>
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <Suspense fallback={<div className="w-10 h-10 rounded-full bg-neutral-800 animate-pulse" />}>
                    <UserButtonWrapper />
                  </Suspense>
                ) : (
                  <div className="flex items-center gap-2 md:gap-3">
                    <Link href="/sign-in" className="rounded-full bg-card/82 px-4 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-sm)] transition-colors hover:text-orange-500 md:px-6">
                      Sign In
                    </Link>
                    <Link href="/sign-up" className="futuristic-cta whitespace-nowrap text-sm py-2 px-4 md:px-6">
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto min-h-0">
          {activeTab === "home" && (
            <HomeContent
              setActiveTab={handleTabChange}
              isSignedIn={isSignedIn}
              reduceMotion={reduceMotion}
            />
          )}
          {activeTab === "dashboard" && (
            <div className="workspace-shell">
              {isSignedIn ? <StatsDashboard /> : <AuthRequiredMessage />}
            </div>
          )}
          {activeTab === "builder" && (
            <div className="workspace-shell min-h-0 overflow-hidden">
              {isSignedIn ? <ResumeBuilder /> : <AuthRequiredMessage />}
            </div>
          )}
          {activeTab === "optimizer" && (
            <div className="workspace-shell min-h-0 overflow-hidden">
              {isSignedIn ? <AIOptimizer /> : <AuthRequiredMessage />}
            </div>
          )}
          {activeTab === "coach" && (
            <div className="workspace-shell min-h-0 overflow-hidden">
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
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/12 shadow-[var(--shadow-sm)]">
        <Lock className="w-10 h-10 text-orange-500" />
      </div>
      <h2 className="mb-3 text-2xl font-bold text-foreground">Authentication Required</h2>
      <p className="mb-8 max-w-md leading-relaxed text-muted-foreground">
        Please sign in to access this feature and unlock all premium capabilities.
      </p>
      <Link href="/sign-in" className="futuristic-cta">
        Sign In to Continue
      </Link>
    </div>
  );
}

function FeaturePanelSkeleton({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="glass-panel flex h-full min-h-[520px] flex-col justify-between rounded-[30px] p-8">
      <div className="space-y-4">
        <div className="h-4 w-28 rounded-full shimmer" />
        <div className="h-10 w-56 max-w-full rounded-2xl shimmer" />
        <div className="h-4 w-80 max-w-full rounded-full shimmer" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-40 rounded-[26px] shimmer" />
        <div className="h-40 rounded-[26px] shimmer" />
      </div>
      <div>
        <p className="text-lg font-semibold text-foreground">{title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function HomeContent({
  setActiveTab,
  isSignedIn,
  reduceMotion,
}: {
  setActiveTab: (tab: TabType) => void;
  isSignedIn: boolean | undefined;
  reduceMotion: boolean;
}) {
  const cardHoverMotion = reduceMotion ? undefined : cardHoverSoft;
  const iconHoverMotion = reduceMotion ? undefined : iconHover;
  const buttonHoverMotion = reduceMotion ? undefined : buttonHover;
  const buttonTapMotion = reduceMotion ? undefined : buttonTap;

  return (
    <div className="page-frame py-8 md:py-10 xl:py-12">
      <div className="page-stack">
        {/* Main Hero Card */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionReveal}
          className="relative overflow-hidden futuristic-card group px-6 py-8 sm:px-8 sm:py-9 lg:px-10 lg:py-12 xl:px-14 xl:py-16"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 xl:gap-14">
            {/* Left: Image Placeholder */}
            <motion.div
              whileHover={cardHoverMotion}
              className="gpu-lite relative flex min-h-[340px] aspect-[5/4] items-center justify-center overflow-hidden rounded-[32px] bg-gradient-to-br from-card to-accent md:aspect-[4/3]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent" />
              <motion.div
                initial={{ opacity: 0.8, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.22 }}
                className="relative z-10 flex h-40 w-40 items-center justify-center rounded-[2rem] bg-card/70 shadow-[var(--shadow-md)]"
              >
                <FileText className="h-20 w-20 text-orange-500/55" />
              </motion.div>
              <motion.div
                whileHover={buttonHoverMotion}
                className="absolute bottom-5 right-5 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-sm)]"
              >
                AI-Powered
              </motion.div>
            </motion.div>

            {/* Right: Content */}
            <div className="space-y-8 xl:space-y-10">
              <div className="space-y-5 xl:space-y-6">
                <span className="section-kicker">Resume studio for focused work</span>
                <h1 className="display-title leading-[0.92]">
                  BUILD YOUR
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">
                    DREAM CAREER
                  </span>
                </h1>
                <p className="body-lg max-w-xl">
                  Build, optimize, and refine applications in one calm workspace.
                </p>
              </div>

              {/* Quick Stats/Features */}
              <motion.div
                variants={springList}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-4"
              >
                {[
                  { icon: Star, label: "ATS Optimized" },
                  { icon: TrendingUp, label: "98% Success" },
                  { icon: Sparkles, label: "AI Powered" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={springItem}
                    whileHover={cardHoverMotion}
                    className="gpu-lite flex items-center gap-2.5 rounded-full bg-card/80 px-4 py-2.5 shadow-[var(--shadow-sm)]"
                  >
                    <motion.div whileHover={iconHoverMotion}>
                      <item.icon className="w-4 h-4 text-orange-500" />
                    </motion.div>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <div className="flex gap-4 flex-wrap">
                {isSignedIn ? (
                  <>
                    <motion.button
                      onClick={() => setActiveTab("builder")}
                      whileHover={buttonHoverMotion}
                      whileTap={buttonTapMotion}
                      className="futuristic-cta group"
                    >
                      Start Building
                      <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                    <motion.button
                      onClick={() => setActiveTab("dashboard")}
                      whileHover={buttonHoverMotion}
                      whileTap={buttonTapMotion}
                      className="inline-flex items-center justify-center rounded-full bg-card/82 px-8 py-3 font-semibold text-foreground shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:text-orange-500"
                    >
                      View Dashboard
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.div whileHover={buttonHoverMotion} whileTap={buttonTapMotion}>
                      <Link href="/sign-up" className="futuristic-cta group">
                        Get Started Free
                        <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={buttonHoverMotion} whileTap={buttonTapMotion}>
                      <Link
                        href="/sign-in"
                        className="inline-block rounded-full bg-card/82 px-8 py-3 font-semibold text-foreground shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:text-orange-500"
                      >
                        Sign In
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick Access Cards */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={springList}
          className="content-auto grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 xl:gap-6"
        >
          <motion.button
            onClick={() => setActiveTab("dashboard")}
            variants={springItem}
            whileHover={cardHoverMotion}
            whileTap={buttonTapMotion}
            className="gpu-lite relative min-h-[220px] p-7 text-left transition-all futuristic-card group xl:p-8"
          >
            {!isSignedIn && (
              <div className="absolute top-4 right-4">
                <Lock className="w-4 h-4 text-neutral-500" />
              </div>
            )}
            <BarChart3 className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="mb-2 text-xl font-bold text-foreground">Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Track your resume performance
            </p>
          </motion.button>

          <motion.button
            onClick={() => setActiveTab("builder")}
            variants={springItem}
            whileHover={cardHoverMotion}
            whileTap={buttonTapMotion}
            className="gpu-lite relative min-h-[220px] p-7 text-left transition-all futuristic-card group xl:p-8"
          >
            {!isSignedIn && (
              <div className="absolute top-4 right-4">
                <Lock className="w-4 h-4 text-neutral-500" />
              </div>
            )}
            <FileText className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="mb-2 text-xl font-bold text-foreground">Builder</h3>
            <p className="text-sm text-muted-foreground">
              Create professional resumes
            </p>
          </motion.button>

          <motion.button
            onClick={() => setActiveTab("optimizer")}
            variants={springItem}
            whileHover={cardHoverMotion}
            whileTap={buttonTapMotion}
            className="gpu-lite relative min-h-[220px] p-7 text-left transition-all futuristic-card group xl:p-8"
          >
            {!isSignedIn && (
              <div className="absolute top-4 right-4">
                <Lock className="w-4 h-4 text-neutral-500" />
              </div>
            )}
            <Sparkles className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="mb-2 text-xl font-bold text-foreground">Optimizer</h3>
            <p className="text-sm text-muted-foreground">
              Boost your ATS score
            </p>
          </motion.button>

          <motion.button
            onClick={() => setActiveTab("coach")}
            variants={springItem}
            whileHover={cardHoverMotion}
            whileTap={buttonTapMotion}
            className="gpu-lite relative min-h-[220px] p-7 text-left transition-all futuristic-card group xl:p-8"
          >
            {!isSignedIn && (
              <div className="absolute top-4 right-4">
                <Lock className="w-4 h-4 text-neutral-500" />
              </div>
            )}
            <MessageSquare className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="mb-2 text-xl font-bold text-foreground">AI Coach</h3>
            <p className="text-sm text-muted-foreground">
              Get personalized career advice
            </p>
          </motion.button>
        </motion.section>

        {/* Promotional Card - Bottom */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionReveal}
          className="content-auto relative overflow-hidden futuristic-card p-7 md:p-8 xl:p-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent" />
          <div className="relative z-10 grid grid-cols-1 items-center gap-8 md:grid-cols-2 xl:gap-12">
              <div className="space-y-3">
                <div className="futuristic-badge inline-block">Limited Offer</div>
                <h2 className="text-4xl font-black text-foreground">
                  40% OFF
                  <br />
                  <span className="text-2xl font-normal text-muted-foreground">
                    PREMIUM TEMPLATES
                  </span>
                </h2>
              <motion.button
                onClick={() => setActiveTab("builder")}
                whileHover={buttonHoverMotion}
                whileTap={buttonTapMotion}
                className="futuristic-cta mt-4"
              >
                UPGRADE NOW
              </motion.button>
            </div>
            <div className="relative flex h-56 items-center justify-center rounded-2xl bg-gradient-to-br from-card to-accent xl:h-64">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-2xl" />
              <Sparkles className="w-24 h-24 text-neutral-700" />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionReveal}
          className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] xl:gap-10"
        >
          <div className="space-y-5">
            <span className="section-kicker">What makes it feel faster</span>
            <h2 className="section-title">A focused application workflow, not just another builder.</h2>
            <p className="body-lg max-w-lg">
              Clear sections, quicker feedback, and less friction between drafting and tailoring.
            </p>
          </div>
          <motion.div
            variants={springList}
            className="grid gap-4 md:grid-cols-3"
          >
            {featureShowcase.map((item) => (
              <motion.div
                key={item.title}
                variants={springItem}
                whileHover={cardHoverMotion}
                className="gpu-lite futuristic-card interactive-lift p-6"
              >
                <motion.div whileHover={iconHoverMotion} className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/12 text-orange-500">
                  <item.icon className="h-5 w-5" />
                </motion.div>
                <h3 className="mb-3 text-xl font-semibold tracking-[-0.03em] text-foreground">{item.title}</h3>
                <p className="mb-6 text-sm leading-7 text-muted-foreground">{item.description}</p>
                <span className="text-sm font-medium text-orange-500">{item.stat}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={springList}
          className="content-auto grid gap-5 lg:grid-cols-3 xl:gap-6"
        >
          {workflowSteps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={springItem}
              whileHover={cardHoverMotion}
              className="gpu-lite futuristic-card p-7 xl:p-8"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="section-kicker">Step {index + 1}</span>
                <motion.div whileHover={iconHoverMotion}>
                  <ArrowUpRight className="h-5 w-5 text-orange-500" />
                </motion.div>
              </div>
              <h3 className="mb-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">{step.title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="content-auto grid gap-5 lg:grid-cols-[1.15fr_0.85fr] xl:gap-6"
        >
          <motion.div variants={sectionReveal} className="futuristic-card p-8 xl:p-10">
            <span className="section-kicker">Built for clarity</span>
            <h2 className="section-title mt-4 max-w-2xl">Everything important stays visible and easy to scan.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {landingProof.map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={cardHoverMotion}
                  className="gpu-lite surface-soft rounded-[24px] p-5"
                >
                    <motion.div whileHover={iconHoverMotion} className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/12 text-orange-500">
                      <item.icon className="h-5 w-5" />
                    </motion.div>
                  <p className="section-kicker">{item.eyebrow}</p>
                  <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={sectionReveal} className="futuristic-card p-8 xl:p-10">
            <span className="section-kicker">What users notice</span>
            <div className="mt-6 space-y-4">
              {testimonials.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={cardHoverMotion}
                  className="gpu-lite surface-soft rounded-[24px] p-6"
                >
                  <Quote className="mb-4 h-5 w-5 text-orange-500" />
                  <p className="text-base leading-8 text-foreground/88">"{item.quote}"</p>
                  <p className="mt-5 text-sm font-medium text-muted-foreground">{item.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionReveal}
          className="content-auto futuristic-card px-7 py-10 md:px-10 md:py-12 xl:px-14 xl:py-16"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="space-y-5">
              <span className="section-kicker">Ready when you are</span>
              <h2 className="section-title max-w-3xl">Turn resume editing, optimization, and coaching into one polished routine.</h2>
              <p className="body-lg max-w-xl">
                Less clutter, more momentum, and faster decisions.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 lg:justify-end">
              <motion.button
                onClick={() => setActiveTab(isSignedIn ? "builder" : "home")}
                whileHover={buttonHoverMotion}
                whileTap={buttonTapMotion}
                className="futuristic-cta"
              >
                {isSignedIn ? "Open Builder" : "Explore Resumate"}
              </motion.button>
              <motion.div whileHover={buttonHoverMotion} whileTap={buttonTapMotion}>
                <Link
                  href={isSignedIn ? "/dashboard" : "/sign-up"}
                  className="inline-flex items-center justify-center rounded-full bg-card/82 px-8 py-3 font-semibold text-foreground shadow-[var(--shadow-sm)]"
                >
                  {isSignedIn ? "See Dashboard" : "Create Account"}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
