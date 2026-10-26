import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '../../../lib/cn';
import { heroSlides } from '../data/homeImages';
import './HeroInlineImageCarousel.css';

type HeroInlineImageCarouselProps = {
  activeIndex: number;
};

/**
 * @description Sharp inset image synced with the hero slider.
 * @param {HeroInlineImageCarouselProps} props - Active slide index.
 * @returns {JSX.Element} Inline image slot.
 */
function HeroInlineImageCarouselComponent({
  activeIndex,
}: HeroInlineImageCarouselProps) {
  const { t } = useTranslation();
  const activeSlide = heroSlides[activeIndex] ?? heroSlides[0];

  return (
    <span
      className="relative inline-block h-[3.5rem] w-[5.25rem] shrink-0 sm:h-[4.25rem] sm:w-[6.5rem] md:h-[4.75rem] md:w-[7.25rem] lg:h-[5.25rem] lg:w-[8rem]"
      role="img"
      aria-label={t(activeSlide.altKey)}
    >
      <span className="hero-inline-frame absolute inset-0 overflow-hidden rounded-2xl ring-1 ring-[#e9e0d0]/30">
        {heroSlides.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt=""
            className={cn(
              'hero-inline-slide absolute inset-0 size-full object-cover',
              index === activeIndex ? 'opacity-100' : 'opacity-0',
            )}
            decoding="async"
          />
        ))}
      </span>
    </span>
  );
}

export const HeroInlineImageCarousel = memo(HeroInlineImageCarouselComponent);
