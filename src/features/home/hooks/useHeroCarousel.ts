import { useEffect, useState } from 'react';

import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { heroSlides, type HeroSlide } from '../data/homeImages';

const SLIDE_INTERVAL_MS = 5500;

type UseHeroCarouselResult = {
  index: number;
  slide: HeroSlide;
};

/**
 * @description Preloads hero images and drives carousel index.
 * @returns {UseHeroCarouselResult} Active slide and index.
 */
export function useHeroCarousel(): UseHeroCarouselResult {
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });
  }, []);

  useEffect(() => {
    if (reducedMotion || heroSlides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return {
    index,
    slide: heroSlides[index] ?? heroSlides[0],
  };
}
