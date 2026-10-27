import { PageHeroParallax } from '../../../components/layout/PageHeroParallax';
import { cn } from '../../../lib/cn';

type AboutHeroParallaxProps = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * @description About hero parallax wrapper (shared PageHeroParallax + legacy classes).
 * @param {AboutHeroParallaxProps} props - Hero image source.
 * @returns {JSX.Element} Parallax hero background.
 */
export function AboutHeroParallax({ src, alt, className }: AboutHeroParallaxProps) {
  return (
    <PageHeroParallax
      src={src}
      alt={alt}
      className={cn('about-hero-parallax', className)}
    />
  );
}
