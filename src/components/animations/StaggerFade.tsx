import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

import { cn } from '../../lib/cn';
import {
  STAGGER_CHILDREN_DEFAULT,
  STAGGER_DELAY_CHILDREN_DEFAULT,
  createStaggerContainerVariants,
  staggerItemVariants,
} from './fadeInMotion';
import './StaggerFade.css';

type StaggerFadeProps = {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  /** @description Use mount for above-the-fold blocks (e.g. hero). */
  trigger?: 'inView' | 'mount';
};

type StaggerFadeItemProps = {
  children: ReactNode;
  className?: string;
};

/**
 * @description Viewport (or mount) triggered stagger container for child fade items.
 * @param {StaggerFadeProps} props - Stagger configuration.
 * @returns {JSX.Element} Motion container.
 */
export function StaggerFade({
  children,
  className,
  staggerChildren = STAGGER_CHILDREN_DEFAULT,
  delayChildren = STAGGER_DELAY_CHILDREN_DEFAULT,
  trigger = 'inView',
}: StaggerFadeProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = createStaggerContainerVariants(
    staggerChildren,
    delayChildren,
  );

  if (trigger === 'mount') {
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate="show"
        variants={variants}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-48px' }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/**
 * @description Single stagger child — must sit inside {@link StaggerFade}.
 * @param {StaggerFadeItemProps} props - Item wrapper props.
 * @returns {JSX.Element} Motion item.
 */
export function StaggerFadeItem({ children, className }: StaggerFadeItemProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn('stagger-fade-item', className)}
      variants={staggerItemVariants}
    >
      {children}
    </motion.div>
  );
}
