import { useEffect, useRef } from 'react';

import { gsap } from '../../../lib/gsap';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { cn } from '../../../lib/cn';

type AboutParallaxMediaProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  /** @description Vertical travel strength (higher = more parallax). */
  speed?: number;
  /** @description Initial scale to avoid edges showing while parallaxing. */
  scale?: number;
  /** @description Framed portrait block or full-bleed cover layer. */
  variant?: 'frame' | 'cover';
};

/**
 * @description Scroll-scrubbed parallax image wrapper for About page sections.
 * @param {AboutParallaxMediaProps} props - Image source and parallax tuning.
 * @returns {JSX.Element} Clipped media frame.
 */
export function AboutParallaxMedia({
  src,
  alt,
  className,
  imageClassName,
  speed = 14,
  scale = 1.14,
  variant = 'frame',
}: AboutParallaxMediaProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const frame = frameRef.current;
    const image = imageRef.current;
    if (reducedMotion || !frame || !image) {
      return;
    }

    const travel = speed;
    const context = gsap.context(() => {
      gsap.fromTo(
        image,
        { yPercent: -travel * 0.45, scale },
        {
          yPercent: travel * 0.55,
          scale,
          ease: 'none',
          scrollTrigger: {
            trigger: frame,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      );
    }, frame);

    return () => {
      context.revert();
    };
  }, [reducedMotion, scale, speed, src]);

  return (
    <div
      ref={frameRef}
      className={cn(
        variant === 'cover' ? 'about-parallax-cover' : 'about-parallax-frame',
        className,
      )}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={cn('about-parallax-image', imageClassName)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
