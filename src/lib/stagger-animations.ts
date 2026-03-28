// Stagger animations for lists and grids
// Used for smooth entry/exit of multiple elements

import { Variants, Transition } from 'framer-motion'

// Default stagger configuration
export const defaultStagger = {
  delayChildren: 0.1,
  staggerChildren: 0.05,
}

// Slower stagger for larger lists
export const slowStagger = {
  delayChildren: 0.2,
  staggerChildren: 0.1,
}

// Fast stagger for quick animations
export const fastStagger = {
  delayChildren: 0.05,
  staggerChildren: 0.03,
}

// Container variants with stagger
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: defaultStagger,
  },
  exit: {
    opacity: 0,
    transition: { ...defaultStagger, staggerDirection: -1 },
  },
}

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: slowStagger,
  },
  exit: {
    opacity: 0,
    transition: { ...slowStagger, staggerDirection: -1 },
  },
}

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: fastStagger,
  },
  exit: {
    opacity: 0,
    transition: { ...fastStagger, staggerDirection: -1 },
  },
}

// Fade up items
export const fadeUpItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 },
  },
}

// Scale in items
export const scaleInItem: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
  },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.25,
      ease: 'backOut',
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.2 },
  },
}

// Slide in from left
export const slideInLeftItem: Variants = {
  hidden: { 
    opacity: 0, 
    x: -30,
  },
  show: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.2 },
  },
}

// Slide in from right
export const slideInRightItem: Variants = {
  hidden: { 
    opacity: 0, 
    x: 30,
  },
  show: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.2 },
  },
}

// Flip in items (for cards)
export const flipInItem: Variants = {
  hidden: { 
    opacity: 0, 
    rotateX: -15,
    y: 10,
  },
  show: { 
    opacity: 1, 
    rotateX: 0,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: { 
    opacity: 0, 
    rotateX: 10,
    y: -10,
    transition: { duration: 0.2 },
  },
}

// Blur in items
export const blurInItem: Variants = {
  hidden: { 
    opacity: 0, 
    filter: 'blur(10px)',
    scale: 0.95,
  },
  show: { 
    opacity: 1, 
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: { 
    opacity: 0, 
    filter: 'blur(5px)',
    transition: { duration: 0.2 },
  },
}

// Spring bounce items
export const springBounceItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9,
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 },
  },
}

// Grid layout stagger (2D stagger)
export const gridContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

export const gridItem: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 20,
  },
  show: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'backOut',
    },
  },
  hover: {
    y: -4,
    transition: { duration: 0.2 },
  },
}

// List with selection highlight
export const listContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

export const listItem: Variants = {
  hidden: { 
    opacity: 0, 
    x: -10,
  },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.2 },
  },
  selected: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderLeftColor: 'rgba(124, 58, 237, 1)',
    x: 4,
    transition: { duration: 0.15 },
  },
}

// Chips/tags stagger
export const chipContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
}

export const chipItem: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0,
  },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: { duration: 0.15 },
  },
}

// Dashboard cards cascade
export const dashboardContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const dashboardCard: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95,
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Message list (for chat)
export const messageContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const messageItem: Variants = {
  hidden: (isUser: boolean) => ({
    opacity: 0,
    x: isUser ? 20 : -20,
    y: 10,
  }),
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

// Table rows
export const tableRowContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
}

export const tableRowItem: Variants = {
  hidden: { 
    opacity: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  show: { 
    opacity: 1,
    backgroundColor: 'transparent',
    transition: { duration: 0.3 },
  },
  hover: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
}

// Section reveal (for page sections)
export const sectionReveal: Variants = {
  hidden: { 
    opacity: 0,
    y: 60,
  },
  show: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// Orchestrated entry (header, content, footer)
export const orchestratedContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

export const headerSection: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 },
  },
}

export const contentSection: Variants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { duration: 0.5, delay: 0.1 },
  },
}

export const footerSection: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 },
  },
}

// Helper function to create custom stagger
export function createStaggerVariants(
  itemVariants: Variants,
  options: {
    staggerChildren?: number
    delayChildren?: number
    staggerDirection?: 1 | -1
  } = {}
): { container: Variants; item: Variants } {
  const { 
    staggerChildren = 0.05, 
    delayChildren = 0.1,
    staggerDirection = 1,
  } = options

  return {
    container: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren,
          delayChildren,
          staggerDirection,
        },
      },
      exit: {
        opacity: 0,
        transition: {
          staggerChildren: staggerChildren / 2,
          staggerDirection: -staggerDirection,
        },
      },
    },
    item: itemVariants,
  }
}
