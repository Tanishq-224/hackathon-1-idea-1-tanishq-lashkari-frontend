import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

import { cn } from '../../lib/cn';
import { STAGGER_ITEM_TRANSITION } from './fadeInMotion';
import './StaggerFade.css';

type FadeInProps = {
  children: ReactNode;
  className?: string;
  /** @description Extra delay in seconds (legacy prop). */
  delay?: number;
};

/**
 * @description Standalone fade-in block (use {@link StaggerFade} groups when possible).
 * @param {FadeInProps} props - Animation props.
 * @returns {JSX.Element} Animated or static wrapper.
 */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn('stagger-fade-item', className)}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{ ...STAGGER_ITEM_TRANSITION, delay }}
    >
      {children}
    </motion.div>
  );
}
