import { useEffect, useRef } from 'react';

import { gsap } from '../../../lib/gsap';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { cn } from '../../../lib/cn';

type AboutHeroParallaxProps = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * @description Hero background with subtle scale and vertical parallax on scroll.
 * @param {AboutHeroParallaxProps} props - Hero image source.
 * @returns {JSX.Element} Parallax hero background.
 */
export function AboutHeroParallax({ src, alt, className }: AboutHeroParallaxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const image = imageRef.current;
    if (reducedMotion || !root || !image) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        image,
        { yPercent: -8, scale: 1.12 },
        {
          yPercent: 12,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    }, root);

    return () => {
      context.revert();
    };
  }, [reducedMotion, src]);

  return (
    <div ref={rootRef} className={cn('about-hero-parallax', className)} aria-hidden>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="about-hero-parallax__image"
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
}
