"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * useCountUp Hook
 *
 * Animates a number from 0 to target value with easing.
 * Perfect for ATS scores, statistics, and metrics.
 *
 * @param target - The target number to count up to
 * @param duration - Animation duration in milliseconds (default: 1200ms)
 * @param startOnMount - Whether to start immediately (default: true)
 *
 * @example
 * const score = useCountUp(85, 1200);
 * return <span>{score}</span>;
 */
export function useCountUp(
  target: number,
  duration: number = 1200,
  startOnMount: boolean = true
) {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCount(0);

    const startTime = performance.now();
    const step = 16; // ~60fps

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out quad for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 2);
      const current = Math.round(eased * target);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration, isAnimating]);

  useEffect(() => {
    if (startOnMount && target > 0) {
      // Small delay for better visual effect
      const timer = setTimeout(startAnimation, 100);
      return () => clearTimeout(timer);
    }
  }, [target, startOnMount, startAnimation]);

  return {
    count,
    isAnimating,
    startAnimation,
    reset: () => setCount(0),
  };
}

/**
 * Simple version that just returns the count value
 */
export function useCountUpSimple(target: number, duration: number = 1200) {
  const { count } = useCountUp(target, duration);
  return count;
}

export default useCountUp;
