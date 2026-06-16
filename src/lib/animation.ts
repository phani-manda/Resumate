export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.35 },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.07 },
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
};

export const slideInRight = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
};

export const duration = {
  instant: 50,
  fast: 100,
  micro: 150,
  base: 200,
  enter: 300,
  emphasize: 450,
  slow: 600,
} as const;

export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  in: [0.7, 0, 1, 0.6] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
  spring: { type: "spring" as const, stiffness: 240, damping: 28 },
  bounce: { type: "spring" as const, stiffness: 300, damping: 18 },
  softSpring: { type: "spring" as const, stiffness: 180, damping: 28, mass: 0.95 },
  hoverSpring: { type: "spring" as const, stiffness: 240, damping: 24, mass: 0.82 },
} as const;

export const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
} as const;

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: ease.out },
  },
} as const;

export const fadeInUp = fadeUp;

export const buttonHover = {
  scale: 1.01,
  y: -1,
  transition: ease.hoverSpring,
} as const;

export const buttonTap = {
  scale: 0.97,
  transition: { duration: duration.fast / 1000 },
} as const;

export const cardHoverSoft = {
  y: -2,
  transition: ease.softSpring,
} as const;

export const iconHover = {
  scale: 1.04,
  transition: ease.hoverSpring,
} as const;

export const sectionReveal = fadeUp;

export const springList = staggerContainer;

export const springItem = staggerItem;

export const chipAnimation = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
} as const;

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
