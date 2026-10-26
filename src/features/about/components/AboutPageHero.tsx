import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../../components/animations/StaggerFade';
import { Container } from '../../../components/ui/Container';
import { aboutImages } from '../data/aboutImages';
import { AboutHeroParallax } from './AboutHeroParallax';
import '../AboutPage.css';

/**
 * @description About hero with parallax kitchen photography and staggered headline.
 * @returns {JSX.Element} Page hero.
 */
export function AboutPageHero() {
  const { t } = useTranslation();

  return (
    <header className="relative flex min-h-[min(78vh,720px)] items-end overflow-hidden pb-14 pt-28 md:pb-20 md:pt-32">
      <AboutHeroParallax
        src={aboutImages.hero}
        alt={t('aboutPage.hero.imageAlt')}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-charcoal/94 via-charcoal/58 to-charcoal/40"
        aria-hidden
      />
      <Container className="relative z-10">
        <StaggerFade trigger="mount" staggerChildren={0.1} delayChildren={0.12}>
          <StaggerFadeItem>
            <span className="about-eyebrow about-eyebrow--light">
              {t('aboutPage.hero.eyebrow')}
            </span>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <h1 className="mt-5 font-display text-[clamp(2.75rem,7.5vw,4.75rem)] font-semibold leading-[1.02] text-ivory">
              {t('aboutPage.hero.title')}
            </h1>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/88 md:text-lg">
              {t('aboutPage.hero.lead')}
            </p>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <nav
              aria-label={t('aboutPage.hero.breadcrumbLabel')}
              className="mt-8 text-sm text-ivory/70"
            >
              <Link to="/" className="transition-colors hover:text-ivory">
                {t('aboutPage.hero.breadcrumbHome')}
              </Link>
              <span aria-hidden className="mx-2">
                /
              </span>
              <span className="text-ivory">{t('aboutPage.hero.breadcrumbCurrent')}</span>
            </nav>
          </StaggerFadeItem>
        </StaggerFade>
      </Container>
    </header>
  );
}
