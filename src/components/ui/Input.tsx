import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-md border border-line bg-surface px-3 py-2 text-body-md text-ink-primary shadow-none transition-all duration-base outline-none",
        "placeholder:text-ink-muted",
        "focus:border-[var(--border-focus)] focus:ring-1 focus:ring-[var(--border-focus)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-danger aria-invalid:ring-danger/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
