"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Zap,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    color: "text-orange-300",
    activeColor: "text-white",
  },
  {
    href: "/builder",
    icon: FileText,
    label: "Builder",
    color: "text-orange-300",
    activeColor: "text-white",
  },
  {
    href: "/optimizer",
    icon: Zap,
    label: "Optimizer",
    color: "text-orange-300",
    activeColor: "text-white",
  },
  {
    href: "/coach",
    icon: MessageCircle,
    label: "Coach",
    color: "text-orange-300",
    activeColor: "text-white",
  },
];

/**
 * Mobile Bottom Navigation
 *
 * Fixed bottom navigation bar for mobile viewports (< 768px).
 * Shows only on mobile, hidden on tablet and desktop.
 *
 * Features:
 * - Active indicator dot above icon
 * - Haptic feedback on tap (if available)
 * - Smooth animations on selection change
 */
export function MobileNav() {
  const pathname = usePathname();

  const handleNavClick = () => {
    // Trigger haptic feedback if available
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <nav
      className="mobile-bottom-nav md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex h-full items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "relative flex flex-col items-center justify-center",
                "min-w-[64px] py-2 px-3 rounded-xl",
                "transition-all duration-200",
                isActive
                  ? "text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className={cn(
                    "absolute -top-1 h-1 w-6 rounded-full",
                    "bg-gradient-to-r from-orange-500 to-orange-300"
                  )}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                  }}
                />
              )}

              {/* Icon */}
              <div
                className={cn(
                  "relative transition-transform duration-200",
                  isActive && "scale-110"
                )}
              >
                <item.icon
                  className={cn(
                    "h-6 w-6",
                    isActive ? item.activeColor : item.color
                  )}
                  aria-hidden="true"
                />

                {/* Glow effect for active */}
                {isActive && (
                  <div
                    className={cn(
                      "absolute inset-0 blur-lg opacity-50",
                      item.color
                    )}
                    style={{
                      background: `radial-gradient(circle, currentColor 0%, transparent 70%)`,
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "mt-1 text-[10px] font-medium",
                  isActive ? "text-white" : "text-zinc-500"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Safe area spacing for iOS */}
      <div className="h-safe-area-inset-bottom bg-zinc-950/95" />
    </nav>
  );
}

/**
 * Mobile Nav Spacer
 *
 * Add this at the bottom of your page content to prevent
 * the mobile nav from covering content.
 */
export function MobileNavSpacer() {
  return <div className="h-20 md:hidden" aria-hidden="true" />;
}

export default MobileNav;
