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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fadeInUp } from "@/lib/animation";

// Icon mapping for different empty state types
const iconMap = {
  resume: FileText,
  optimizer: Target,
  coach: MessageCircle,
  dashboard: BarChart3,
  search: SearchX,
} as const;

// Accent icon mapping
const accentIconMap = {
  resume: Sparkles,
  optimizer: Zap,
  coach: Sparkles,
  dashboard: Sparkles,
  search: null,
} as const;

// Preset configurations for common empty states
const presets: Record<
  string,
  {
    headline: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    iconColor: string;
    glowColor: string;
  }
> = {
  resume: {
    headline: "Your career story starts here",
    description:
      "Create your first resume and let AI help you optimize it for your dream job.",
    ctaText: "Create First Resume",
    ctaHref: "/builder",
    iconColor: "text-purple-400",
    glowColor: "shadow-purple-500/20",
  },
  optimizer: {
    headline: "No resume analyzed yet",
    description:
      "Upload a resume and job description to get personalized ATS optimization suggestions.",
    ctaText: "Upload & Analyze",
    ctaHref: "/optimizer",
    iconColor: "text-blue-400",
    glowColor: "shadow-blue-500/20",
  },
  coach: {
    headline: "Ask your first question",
    description:
      "Get personalized career advice, interview tips, and resume feedback from your AI coach.",
    ctaText: "Start Conversation",
    ctaHref: "/coach",
    iconColor: "text-emerald-400",
    glowColor: "shadow-emerald-500/20",
  },
  dashboard: {
    headline: "No data yet — start building!",
    description:
      "Create and optimize your resumes to see analytics and track your progress here.",
    ctaText: "Go to Builder",
    ctaHref: "/builder",
    iconColor: "text-amber-400",
    glowColor: "shadow-amber-500/20",
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
};

interface EmptyStateProps {
  /** Preset type for common empty states */
  type?: keyof typeof presets;
  /** Custom headline (overrides preset) */
  headline?: string;
  /** Custom description (overrides preset) */
  description?: string;
  /** Custom CTA button text (overrides preset) */
  ctaText?: string;
  /** Custom CTA button href (overrides preset) */
  ctaHref?: string;
  /** Custom CTA click handler (for actions like clearing filters) */
  onCtaClick?: () => void;
  /** Custom icon component (overrides preset) */
  icon?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Compact mode for smaller containers */
  compact?: boolean;
}

/**
 * EmptyState Component
 *
 * Displays a friendly empty state with icon, headline, description, and CTA.
 * Use presets for common cases or customize fully.
 *
 * @example
 * // Using preset
 * <EmptyState type="resume" />
 *
 * @example
 * // Custom empty state
 * <EmptyState
 *   headline="No results"
 *   description="Try a different search term"
 *   ctaText="Clear Search"
 *   onCtaClick={() => setSearch('')}
 * />
 */
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
  const preset = presets[type] || presets.resume;

  const Icon = iconMap[type] || FileText;
  const AccentIcon = accentIconMap[type];

  const finalHeadline = headline || preset.headline;
  const finalDescription = description || preset.description;
  const finalCtaText = ctaText || preset.ctaText;
  const finalCtaHref = ctaHref ?? preset.ctaHref;

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (finalCtaHref) {
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
        compact ? "py-8 px-4" : "py-16 px-6",
        className
      )}
      role="status"
      aria-label={finalHeadline}
    >
      {/* Icon Container */}
      <div
        className={cn(
          "relative mb-6 flex items-center justify-center rounded-2xl",
          compact ? "h-16 w-16" : "h-20 w-20",
          "bg-white/5 border border-white/10",
          preset.glowColor,
          "shadow-lg"
        )}
      >
        {icon || (
          <Icon
            className={cn(
              compact ? "h-8 w-8" : "h-10 w-10",
              preset.iconColor
            )}
            aria-hidden="true"
          />
        )}

        {/* Accent icon */}
        {AccentIcon && (
          <div className="absolute -right-1 -top-1">
            <AccentIcon
              className={cn("h-4 w-4", preset.iconColor)}
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* Headline */}
      <h3
        className={cn(
          "font-semibold text-white",
          compact ? "text-lg" : "text-xl"
        )}
      >
        {finalHeadline}
      </h3>

      {/* Description */}
      <p
        className={cn(
          "mt-2 max-w-md text-zinc-400",
          compact ? "text-sm" : "text-base"
        )}
      >
        {finalDescription}
      </p>

      {/* CTA Button */}
      {finalCtaText && (
        <Button
          onClick={handleCtaClick}
          className={cn(
            "mt-6 gap-2",
            "bg-gradient-to-r from-purple-600 to-blue-600",
            "hover:from-purple-500 hover:to-blue-500",
            "shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]",
            compact ? "text-sm" : ""
          )}
        >
          {finalCtaText}
        </Button>
      )}
    </motion.div>
  );
}

/**
 * Inline Empty State
 *
 * A smaller version for inline use (e.g., in sidebars, dropdowns)
 */
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
    <div
      className={cn(
        "flex flex-col items-center py-6 px-4 text-center",
        className
      )}
    >
      <p className="text-sm text-zinc-400">{message}</p>
      {ctaText && onCtaClick && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCtaClick}
          className="mt-2 text-purple-400 hover:text-purple-300"
        >
          {ctaText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
