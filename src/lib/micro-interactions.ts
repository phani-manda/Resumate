// Micro-interactions for buttons, inputs, and cards
// Follows the 7 button states and 8 input behaviors from the optimization spec

import { Variants } from 'framer-motion'

// Button micro-interaction variants
export const buttonVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: '0 0 0 0 rgba(124, 58, 237, 0)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 4px 20px -4px rgba(124, 58, 237, 0.4)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: {
    scale: 0.98,
    boxShadow: '0 2px 10px -2px rgba(124, 58, 237, 0.3)',
    transition: { duration: 0.1 },
  },
  focus: {
    boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.3)',
    transition: { duration: 0.15 },
  },
  disabled: {
    opacity: 0.5,
    scale: 1,
    cursor: 'not-allowed',
  },
  loading: {
    opacity: 0.8,
  },
  success: {
    scale: [1, 1.05, 1],
    boxShadow: [
      '0 0 0 0 rgba(34, 197, 94, 0)',
      '0 0 20px 4px rgba(34, 197, 94, 0.4)',
      '0 0 0 0 rgba(34, 197, 94, 0)',
    ],
    transition: { duration: 0.4 },
  },
  error: {
    x: [0, -4, 4, -4, 4, 0],
    boxShadow: '0 0 20px -4px rgba(239, 68, 68, 0.4)',
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
}

// Primary button with glow effect
export const primaryButtonVariants: Variants = {
  ...buttonVariants,
  hover: {
    ...buttonVariants.hover,
    boxShadow: '0 0 30px -4px rgba(124, 58, 237, 0.6)',
  },
}

// Ghost button variants
export const ghostButtonVariants: Variants = {
  initial: { backgroundColor: 'transparent' },
  hover: { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
  tap: { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
}

// Input field micro-interactions (8 behaviors)
export const inputVariants: Variants = {
  initial: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: 'none',
  },
  focus: {
    borderColor: 'rgba(124, 58, 237, 0.5)',
    boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)',
    transition: { duration: 0.15 },
  },
  hover: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    transition: { duration: 0.15 },
  },
  filled: {
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
  error: {
    borderColor: 'rgba(239, 68, 68, 0.5)',
    boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
    x: [0, -2, 2, -2, 2, 0],
    transition: { duration: 0.3 },
  },
  success: {
    borderColor: 'rgba(34, 197, 94, 0.5)',
    boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  loading: {
    opacity: 0.7,
  },
}

// Card hover effects
export const cardVariants: Variants = {
  initial: {
    y: 0,
    boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.3)',
  },
  hover: {
    y: -4,
    boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.4)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  tap: {
    y: -2,
    scale: 0.995,
    transition: { duration: 0.1 },
  },
}

// Glass card with border glow
export const glassCardVariants: Variants = {
  initial: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.3)',
  },
  hover: {
    borderColor: 'rgba(124, 58, 237, 0.3)',
    boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.5), 0 0 30px -5px rgba(124, 58, 237, 0.2)',
    transition: { duration: 0.3 },
  },
}

// Chip/tag variants
export const chipVariants: Variants = {
  initial: { scale: 1, opacity: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    transition: { duration: 0.15 } 
  },
  enter: {
    scale: [0.8, 1.1, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.3 },
  },
}

// Delete button with danger confirmation
export const deleteButtonVariants: Variants = {
  initial: { scale: 1, backgroundColor: 'transparent' },
  hover: { 
    scale: 1.1, 
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    transition: { duration: 0.15 },
  },
  tap: { 
    scale: 0.9,
    transition: { duration: 0.1 },
  },
}

// Icon button spin on hover
export const iconButtonVariants: Variants = {
  initial: { rotate: 0 },
  hover: { 
    rotate: 90,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  tap: { scale: 0.9 },
}

// Floating action button
export const fabVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: '0 4px 14px -2px rgba(124, 58, 237, 0.4)',
  },
  hover: {
    scale: 1.1,
    boxShadow: '0 6px 20px -2px rgba(124, 58, 237, 0.5)',
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.95 },
  pulse: {
    scale: [1, 1.05, 1],
    boxShadow: [
      '0 4px 14px -2px rgba(124, 58, 237, 0.4)',
      '0 8px 25px -2px rgba(124, 58, 237, 0.6)',
      '0 4px 14px -2px rgba(124, 58, 237, 0.4)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Switch toggle
export const switchVariants: Variants = {
  off: { 
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transition: { duration: 0.2 },
  },
  on: { 
    backgroundColor: 'rgba(124, 58, 237, 1)',
    transition: { duration: 0.2 },
  },
}

export const switchThumbVariants: Variants = {
  off: { x: 2 },
  on: { x: 22 },
}

// Checkbox bounce
export const checkboxVariants: Variants = {
  unchecked: { scale: 1 },
  checked: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.2 },
  },
}

// Tooltip appear
export const tooltipVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 10, 
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
}

// Dropdown menu
export const dropdownVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -10,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: { 
    opacity: 0, 
    y: -10,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
}

// Progress bar fill
export const progressVariants: Variants = {
  initial: { width: 0 },
  animate: (custom: number) => ({
    width: `${custom}%`,
    transition: { duration: 0.8, ease: 'easeOut' },
  }),
}

// Score counter animation
export const scoreVariants: Variants = {
  initial: { 
    scale: 0.5, 
    opacity: 0,
  },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 0.5, 
      ease: 'backOut',
    },
  },
  highlight: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.3 },
  },
}

// Badge pop-in
export const badgeVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: 'spring', 
      stiffness: 500, 
      damping: 25,
    },
  },
  exit: { 
    scale: 0, 
    opacity: 0,
    transition: { duration: 0.15 },
  },
}

// Pulse indicator (e.g., for live preview)
export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Ripple effect on click
export const rippleVariants: Variants = {
  initial: { 
    scale: 0, 
    opacity: 0.5,
  },
  animate: { 
    scale: 4, 
    opacity: 0,
    transition: { duration: 0.6 },
  },
}
