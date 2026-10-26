import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../../components/animations/StaggerFade';
import { Container } from '../../../components/ui/Container';
import { homeSectionImages } from '../data/homeImages';

/**
 * @description Location banner with mountain backdrop (no phone booking block).
 * @returns {JSX.Element} Location section.
 */
export function LocationBannerSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[360px] md:min-h-[420px]">
      <img
        src={homeSectionImages.location}
        alt=""
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
        aria-hidden
      />
      <div className="absolute inset-0 bg-charcoal/50" aria-hidden />
      <Container className="relative z-10 flex min-h-[inherit] flex-col items-center justify-center py-16 text-center">
        <StaggerFade className="flex flex-col items-center">
          <StaggerFadeItem>
            <MapPin className="mx-auto size-6 text-ivory" aria-hidden />
          </StaggerFadeItem>
          <StaggerFadeItem>
            <h2 className="mt-4 max-w-3xl font-display text-[clamp(1.5rem,4vw,2.75rem)] font-semibold leading-tight text-ivory">
              {t('home.location.title')}
            </h2>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <p className="mt-4 max-w-xl text-ivory/90">{t('home.location.description')}</p>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <Link
              to="/contact"
              className="mt-8 inline-flex min-h-11 items-center rounded-md border border-ivory/70 px-6 py-2.5 text-sm font-medium text-ivory hover:bg-ivory/10"
            >
              {t('home.location.cta')}
            </Link>
          </StaggerFadeItem>
        </StaggerFade>
      </Container>
    </section>
  );
}
