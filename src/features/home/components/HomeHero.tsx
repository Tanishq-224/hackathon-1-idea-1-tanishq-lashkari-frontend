import { useHeroCarousel } from '../hooks/useHeroCarousel';
import { HeroBackgroundSlider } from './HeroBackgroundSlider';
import { HeroContent } from './HeroContent';
import './HomeHero.css';

/**
 * @description Hero with Cider Cellar theme overlays and isolated background transitions.
 * @returns {JSX.Element} Hero section.
 */
export function HomeHero() {
  const { index } = useHeroCarousel();

  return (
    <section className="hero-section relative min-h-dvh overflow-hidden">
      <div className="absolute inset-0 z-0" aria-hidden>
        <HeroBackgroundSlider className="size-full" activeIndex={index} />
        <div className="hero-overlay-theme absolute inset-0" />
        <div className="hero-overlay-vignette absolute inset-0" />
        <div className="hero-accent-glow absolute inset-0" />
      </div>

      <div className="relative z-10 isolate">
        <HeroContent activeIndex={index} />
      </div>
    </section>
  );
}
