import type { Transition, Variants } from 'motion/react';

/** @description Default delay between staggered children (seconds). */
export const STAGGER_CHILDREN_DEFAULT = 0.08;

/** @description Default delay before the first child animates (seconds). */
export const STAGGER_DELAY_CHILDREN_DEFAULT = 0.05;

/** @description Shared item transition for fade-in stagger items. */
export const STAGGER_ITEM_TRANSITION: Transition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],
};

/**
 * @description Builds container variants for staggered children.
 * @param {number} staggerChildren - Seconds between each child.
 * @param {number} delayChildren - Seconds before the first child starts.
 * @returns {Variants} Framer Motion variants for the container.
 */
export function createStaggerContainerVariants(
  staggerChildren: number,
  delayChildren: number,
): Variants {
  return {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: { staggerChildren, delayChildren },
    },
  };
}

/** @description Default fade-up item variants for stagger groups. */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: STAGGER_ITEM_TRANSITION,
  },
};
