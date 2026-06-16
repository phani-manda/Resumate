"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { Brain, FileCheck, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { FeatureCard } from "@/components/FeatureCard"
import { StarSpark } from "@/components/StarSpark"
import { fadeUp, fadeIn, staggerContainer, scaleIn } from "@/lib/animation"

const steps = [
  {
    title: "Upload & Import",
    description:
      "Paste a link or upload PDF/DOCX. AI structures your resume automatically.",
  },
  {
    title: "AI Optimization",
    description:
      "Match against any job description with ATS scoring and gap analysis.",
  },
  {
    title: "Export & Apply",
    description:
      "Download as PDF, DOCX, or JSON — formatted, ATS-safe, and ready.",
  },
]

const features = [
  {
    title: "AI Resume Analysis",
    description: "AI-driven section scoring and keyword density",
    icon: Brain,
  },
  {
    title: "ATS-Ready Exports",
    description: "PDF, DOCX, TXT, JSON optimized for applicant tracking",
    icon: FileCheck,
  },
  {
    title: "Career Coach Chat",
    description: "Streaming AI coach for interview prep and career questions",
    icon: MessageSquare,
  },
]

const empowering = [
  {
    title: "ATS Score Dashboard",
    description:
      "Comprehensive analytics on keyword match, skill gaps, and formatting score",
  },
  {
    title: "Beginner-Friendly AI Prompts",
    description:
      "One-click prompts to improve resume bullet points and tailor for roles",
  },
]

function StepCard({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-6 shadow-card">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent-subtle text-heading-md font-bold text-accent-text">
        {number}
      </div>
      <h3 className="mb-2 text-heading-lg text-ink-primary">{title}</h3>
      <p className="text-body-sm text-ink-secondary">{description}</p>
    </div>
  )
}

export function LandingPage({ isSignedIn }: { isSignedIn: boolean }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="bg-base">
      <section className="dot-grid-bg relative flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
        <motion.div {...(reduceMotion ? {} : scaleIn)}>
          <StarSpark className="absolute left-[10%] top-16 hidden md:block" size={40} />
          <StarSpark className="absolute right-[8%] top-24 hidden md:block" size={32} />
        </motion.div>

        <motion.div
          className="relative z-10 max-w-4xl"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1
            variants={fadeUp}
            className="text-display-lg font-bold text-ink-primary md:text-display-2xl"
          >
            Build Resumes That
            <br />
            <span className="text-action">Land Interviews. Fast.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-xl text-body-lg text-ink-secondary"
          >
            AI-powered resume builder and ATS optimizer. Upload your resume, paste a job
            description, and get tailored insights in seconds.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            <Button variant="action" size="lg" asChild>
              <Link href={isSignedIn ? "/builder" : "/sign-up"}>
                Start Building Free →
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={isSignedIn ? "/optimizer" : "/sign-in"}>Watch Demo</Link>
            </Button>
          </motion.div>

          <motion.p variants={fadeIn} className="mt-8 text-caption text-ink-muted">
            Trusted by 10,000+ job seekers · No credit card required
          </motion.p>
        </motion.div>
      </section>

      <hr className="mx-auto max-w-6xl border-line" />

      <motion.section
        className="px-6 py-24"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-center text-display-sm font-bold text-ink-primary">
          Your Journey in Three Simple Steps
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-body-md text-ink-secondary">
          From raw resume to interview-ready in minutes.
        </p>
        <motion.div
          className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {steps.map((step, i) => (
            <motion.div key={step.title} variants={fadeUp}>
              <StepCard number={i + 1} title={step.title} description={step.description} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <hr className="mx-auto max-w-6xl border-line" />

      <motion.section
        className="px-6 py-24"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-center text-display-sm font-bold text-ink-primary">
          Powerful Insights
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-body-md text-ink-secondary">
          Everything you need to stand out in a competitive job market.
        </p>
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </motion.section>

      <hr className="mx-auto max-w-6xl border-line" />

      <motion.section
        className="px-6 py-24"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-center text-display-sm font-bold text-ink-primary">
          Empowering Your Career
        </h2>
        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {empowering.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-line bg-surface p-8 shadow-card transition-all duration-200 hover:border-line-strong hover:shadow-elevated"
            >
              <h3 className="mb-3 text-heading-xl text-ink-primary">{item.title}</h3>
              <p className="text-body-md text-ink-secondary">{item.description}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <section className="border-t border-line bg-surface px-6 py-16 text-center">
        <h2 className="text-display-sm font-bold text-ink-primary">Ready to get started?</h2>
        <p className="mx-auto mt-3 max-w-md text-body-md text-ink-secondary">
          Join thousands of job seekers building better resumes with AI.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="action" size="lg" asChild>
            <Link href={isSignedIn ? "/builder" : "/sign-up"}>Start Building Free →</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
