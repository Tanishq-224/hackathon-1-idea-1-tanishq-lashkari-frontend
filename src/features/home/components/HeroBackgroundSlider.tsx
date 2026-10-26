import { useTranslation } from 'react-i18next';

import { cn } from '../../../lib/cn';
import { heroSlides } from '../data/homeImages';
import './HeroBackgroundSlider.css';

type HeroBackgroundSliderProps = {
  className?: string;
  activeIndex: number;
};

/**
 * @description Blurred full-bleed backgrounds with smooth opacity crossfade.
 * @param {HeroBackgroundSliderProps} props - Active slide index.
 * @returns {JSX.Element} Animated background.
 */
export function HeroBackgroundSlider({
  className,
  activeIndex,
}: HeroBackgroundSliderProps) {
  const { t } = useTranslation();

  return (
    <div className={cn(className, 'isolate')} aria-hidden>
      {heroSlides.map((slide, index) => (
        <div
          key={slide.src}
          className={cn(
            'hero-bg-slide absolute inset-0',
            index === activeIndex ? 'opacity-100' : 'opacity-0',
          )}
        >
          <img
            src={slide.src}
            alt=""
            className="hero-bg-blur absolute inset-0 size-full object-cover"
            decoding="async"
          />
        </div>
      ))}
      <span className="sr-only">{t(heroSlides[activeIndex]?.altKey ?? '')}</span>
    </div>
  );
}
