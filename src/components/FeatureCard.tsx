import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  className?: string
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group rounded-xl border border-line bg-surface p-6 shadow-card transition-all duration-200 ease-spring hover:-translate-y-0.5 hover:border-line-strong hover:shadow-elevated",
        className
      )}
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-subtle p-2.5 transition-colors duration-200 group-hover:bg-accent">
        <Icon className="h-5 w-5 text-accent-text transition-colors duration-200 group-hover:text-white" />
      </div>
      <h3 className="mb-2 text-heading-md text-ink-primary">{title}</h3>
      <p className="text-body-sm leading-relaxed text-ink-secondary">{description}</p>
    </div>
  )
}
