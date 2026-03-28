"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Target,
  MessageCircle,
  BarChart3,
  SearchX,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { fadeInUp } from "@/lib/animation";

const iconMap = {
  resume: FileText,
  optimizer: Target,
  coach: MessageCircle,
  dashboard: BarChart3,
  search: SearchX,
} as const;

const accentIconMap = {
  resume: Sparkles,
  optimizer: Zap,
  coach: Sparkles,
  dashboard: Sparkles,
  search: null,
} as const;

const presets = {
  resume: {
    headline: "Your career story starts here",
    description:
      "Create your first resume and let AI help you optimize it for your dream job.",
    ctaText: "Create First Resume",
    ctaHref: "/builder",
    iconColor: "text-orange-300",
    glowColor: "shadow-orange-500/20",
  },
  optimizer: {
    headline: "No resume analyzed yet",
    description:
      "Upload a resume and job description to get personalized ATS optimization suggestions.",
    ctaText: "Upload & Analyze",
    ctaHref: "/optimizer",
    iconColor: "text-orange-300",
    glowColor: "shadow-orange-500/20",
  },
  coach: {
    headline: "Ask your first question",
    description:
      "Get personalized career advice, interview tips, and resume feedback from your AI coach.",
    ctaText: "Start Conversation",
    ctaHref: "/coach",
    iconColor: "text-orange-300",
    glowColor: "shadow-orange-500/20",
  },
  dashboard: {
    headline: "No data yet - start building!",
    description:
      "Create and optimize your resumes to see analytics and track your progress here.",
    ctaText: "Go to Builder",
    ctaHref: "/builder",
    iconColor: "text-orange-300",
    glowColor: "shadow-orange-500/20",
  },
  search: {
    headline: "No matches found",
    description:
      "Try adjusting your search terms or filters to find what you're looking for.",
    ctaText: "Clear Filters",
    ctaHref: "",
    iconColor: "text-zinc-400",
    glowColor: "shadow-zinc-500/10",
  },
} as const;

type EmptyStateType = keyof typeof presets;

interface EmptyStateProps {
  type?: EmptyStateType;
  headline?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  icon?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  type = "resume",
  headline,
  description,
  ctaText,
  ctaHref,
  onCtaClick,
  icon,
  className,
  compact = false,
}: EmptyStateProps) {
  const preset = presets[type];
  const Icon = iconMap[type];
  const AccentIcon = accentIconMap[type];

  const finalHeadline = headline || preset.headline;
  const finalDescription = description || preset.description;
  const finalCtaText = ctaText || preset.ctaText;
  const finalCtaHref = ctaHref ?? preset.ctaHref;

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
      return;
    }

    if (finalCtaHref) {
      window.location.href = finalCtaHref;
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "px-4 py-8" : "px-6 py-16",
        className
      )}
      role="status"
      aria-label={finalHeadline}
    >
      <div
        className={cn(
          "relative mb-6 flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg",
          compact ? "h-16 w-16" : "h-20 w-20",
          preset.glowColor
        )}
      >
        {icon || (
          <Icon
            className={cn(compact ? "h-8 w-8" : "h-10 w-10", preset.iconColor)}
            aria-hidden="true"
          />
        )}

        {AccentIcon && (
          <div className="absolute -right-1 -top-1">
            <AccentIcon
              className={cn("h-4 w-4", preset.iconColor)}
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      <h3 className={cn("font-semibold text-white", compact ? "text-lg" : "text-xl")}>
        {finalHeadline}
      </h3>

      <p className={cn("mt-2 max-w-md text-zinc-400", compact ? "text-sm" : "text-base")}>
        {finalDescription}
      </p>

      {finalCtaText && (
        <Button
          onClick={handleCtaClick}
          className={cn(
            "mt-6 gap-2 bg-gradient-to-r from-orange-500 to-orange-300 text-white shadow-[0_0_24px_-8px_rgba(255,122,26,0.55)] hover:from-orange-400 hover:to-orange-200",
            compact ? "text-sm" : ""
          )}
        >
          {finalCtaText}
        </Button>
      )}
    </motion.div>
  );
}

interface InlineEmptyStateProps {
  message: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export function InlineEmptyState({
  message,
  ctaText,
  onCtaClick,
  className,
}: InlineEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center px-4 py-6 text-center", className)}>
      <p className="text-sm text-zinc-400">{message}</p>
      {ctaText && onCtaClick && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCtaClick}
          className="mt-2 text-orange-300 hover:text-orange-200"
        >
          {ctaText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
