/**
 * Animation System - Resumate Design System
 * Production Optimization Report v1.0
 *
 * Consistent motion values for all animations throughout the app.
 * Use these values with Framer Motion and CSS transitions.
 */

// Duration constants in milliseconds
export const duration = {
  instant: 50, // Tooltips appear
  fast: 100, // Checkbox ticks, toggle flips
  micro: 150, // Hover color shifts
  base: 200, // Most transitions
  enter: 300, // Modals, sheets opening
  emphasize: 450, // Score number countup
  slow: 600, // Page transitions
} as const;

// Easing curves for Framer Motion
export const ease = {
  out: [0.16, 1, 0.3, 1] as const, // Snappy decelerate (spring-like)
  in: [0.7, 0, 1, 0.6] as const, // Aggressive accelerate (exits)
  inOut: [0.4, 0, 0.2, 1] as const, // Smooth both ways
  spring: { type: "spring" as const, stiffness: 240, damping: 28 },
  bounce: { type: "spring" as const, stiffness: 300, damping: 18 },
  softSpring: { type: "spring" as const, stiffness: 180, damping: 28, mass: 0.95 },
  hoverSpring: { type: "spring" as const, stiffness: 240, damping: 24, mass: 0.82 },
} as const;

// Page transition variants
export const pageVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -8, filter: "blur(2px)" },
} as const;

// Stagger container for lists
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
} as const;

// Stagger item animation
export const staggerItem = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.enter / 1000,
      ease: ease.out,
    },
  },
} as const;

// Fade in from bottom
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.enter / 1000,
      ease: ease.out,
    },
  },
} as const;

// Scale in animation (for modals, cards)
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.enter / 1000,
      ease: ease.out,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: duration.fast / 1000,
      ease: ease.in,
    },
  },
} as const;

// Slide in from right
export const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.base / 1000,
      ease: ease.out,
    },
  },
} as const;

// Button micro-interaction preset
export const buttonHover = {
  scale: 1.01,
  y: -1,
  transition: ease.hoverSpring,
} as const;

export const buttonTap = {
  scale: 0.98,
  y: 1,
  transition: { duration: duration.fast / 1000 },
} as const;

// Card hover animation
export const cardHover = {
  y: -2,
  scale: 1.005,
  transition: ease.softSpring,
} as const;

export const cardHoverSoft = {
  y: -2,
  scale: 1.008,
  transition: ease.softSpring,
} as const;

export const iconHover = {
  scale: 1.04,
  rotate: -2,
  transition: ease.hoverSpring,
} as const;

export const sectionReveal = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: duration.enter / 1000,
      ease: ease.out,
    },
  },
} as const;

export const springList = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
} as const;

export const springItem = {
  hidden: { opacity: 0, y: 12, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: ease.softSpring,
  },
} as const;

// Chip/tag animations
export const chipAnimation = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: duration.fast / 1000 },
} as const;

// Skeleton shimmer keyframes (for CSS)
export const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`;

// Loading spinner rotation
export const spinAnimation = {
  animate: { rotate: 360 },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear",
  },
} as const;

// Toast notification animation
export const toastAnimation = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.9 },
  transition: { duration: duration.enter / 1000, ease: ease.out },
} as const;

// Accordion expand/collapse
export const accordionAnimation = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: duration.base / 1000, ease: ease.out },
} as const;

// Progress bar fill animation
export const progressFill = (value: number) => ({
  initial: { width: 0 },
  animate: { width: `${value}%` },
  transition: {
    duration: duration.emphasize / 1000,
    ease: ease.out,
  },
});

// Typing indicator dots
export const typingDot = (delay: number) => ({
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      delay,
    },
  },
});
