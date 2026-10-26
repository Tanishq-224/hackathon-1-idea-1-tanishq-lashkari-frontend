import { memo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import RotatingText from '../../../components/animations/RotatingText';
import {
  StaggerFade,
  StaggerFadeItem,
} from '../../../components/animations/StaggerFade';
import { useHeroRotatingTexts } from '../hooks/useHeroRotatingTexts';
import { HeroInlineImageCarousel } from './HeroInlineImageCarousel';
import './HeroContent.css';

type HeroContentProps = {
  activeIndex: number;
};

/**
 * @description Static hero copy using Cider Cellar theme tokens (ivory, cider, charcoal).
 * @param {HeroContentProps} props - Active carousel index for the inset image only.
 * @returns {JSX.Element} Hero foreground content.
 */
function HeroContentComponent({ activeIndex }: HeroContentProps) {
  const { t } = useTranslation();
  const rotatingTexts = useHeroRotatingTexts();

  return (
    <StaggerFade
      trigger="mount"
      className="pointer-events-auto mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col items-center justify-center px-4 pb-16 pt-24 text-center sm:px-6 md:pt-28"
      delayChildren={0.12}
    >
      <StaggerFadeItem>
        <div className="flex max-w-3xl items-center justify-center gap-3 sm:gap-4">
          <span className="hidden h-px w-10 bg-olive/40 sm:block" aria-hidden />
          <p className="hero-trust text-[0.62rem] font-medium uppercase tracking-[0.28em] text-ivory/80 sm:text-[0.7rem]">
            {t('home.hero.trust')}
          </p>
          <span className="hidden h-px w-10 bg-olive/40 sm:block" aria-hidden />
        </div>
      </StaggerFadeItem>

      <StaggerFadeItem>
        <h1 className="hero-title mt-10 w-full text-[clamp(2.35rem,8vw,5.85rem)] font-semibold tracking-[-0.02em] text-ivory">
          <span className="block leading-[1.02]">{t('home.hero.titleLine1')}</span>
          <span className="mt-2 flex min-h-[3.75rem] flex-wrap items-center justify-center gap-2 sm:mt-3 sm:min-h-[4.5rem] sm:gap-3 md:min-h-[5rem] lg:min-h-[5.5rem]">
            {t('home.hero.titleLine2Lead').trim() ? (
              <span className="leading-none text-ivory">
                {t('home.hero.titleLine2Lead')}
              </span>
            ) : null}
            <HeroInlineImageCarousel activeIndex={activeIndex} />
            <RotatingText
              texts={rotatingTexts}
              effect="slide"
              direction="up"
              highlight
              highlightColor="#b86b38"
              staggerFrom="last"
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              rotationInterval={2800}
              pauseOnHover
              mainClassName="hero-rotating-text leading-none"
            />
          </span>
        </h1>
      </StaggerFadeItem>

      <StaggerFadeItem>
        <p className="hero-subheadline mt-8 max-w-xl text-base font-normal leading-relaxed text-ivory/85 md:text-lg">
          {t('home.hero.subheadline')}
        </p>
      </StaggerFadeItem>

      <StaggerFadeItem>
        <Link
          to="/reserve"
          className="hero-cta mt-10 inline-flex min-h-12 items-center gap-2 rounded-full bg-cider px-7 py-3 text-sm font-semibold text-surface transition-transform hover:scale-[1.03] hover:bg-cider/90"
        >
          {t('home.hero.primaryCta')}
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </StaggerFadeItem>
    </StaggerFade>
  );
}

export const HeroContent = memo(HeroContentComponent);
