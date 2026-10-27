import { useEffect, useRef } from 'react';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { gsap } from '../../lib/gsap';
import { cn } from '../../lib/cn';

type PageHeroParallaxProps = {
  /** @description Hero background image URL. */
  src: string;
  /** @description Accessible image description. */
  alt: string;
  /** @description Optional wrapper class names. */
  className?: string;
};

/**
 * @description Scroll-scrubbed parallax background for inner-page heroes.
 * @param {PageHeroParallaxProps} props - Image source and layout classes.
 * @returns {JSX.Element} Parallax hero media layer.
 */
export function PageHeroParallax({ src, alt, className }: PageHeroParallaxProps) {
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
    <div ref={rootRef} className={cn('page-hero-parallax', className)}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="page-hero-parallax__image"
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
}
