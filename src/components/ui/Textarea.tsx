import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border border-line bg-surface px-3 py-2 text-body-md text-ink-primary transition-all duration-[var(--duration)] outline-none",
        "placeholder:text-ink-muted",
        "focus:border-[var(--border-focus)] focus:ring-1 focus:ring-[var(--border-focus)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-danger aria-invalid:ring-danger/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
