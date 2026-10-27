import { Music2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../../components/animations/StaggerFade';
import { Container } from '../../../components/ui/Container';
import { homeSectionImages } from '../data/homeImages';
import { HomeSectionMedia } from './HomeSectionMedia';

/**
 * @description Live music at the cider house — schedule placeholder content.
 * @returns {JSX.Element} Live music section.
 */
export function LiveMusicSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-ivory py-16 md:py-24">
      <Container>
        <StaggerFade className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <StaggerFadeItem>
            <div className="flex items-center gap-2 text-olive">
              <Music2 className="size-5" aria-hidden />
              <p className="text-sm font-medium uppercase tracking-wide">
                {t('home.music.eyebrow')}
              </p>
            </div>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight">
              {t('home.music.title')}
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-charcoal/85">
              {t('home.music.body')}
            </p>
            <StaggerFade className="mt-6 space-y-2" staggerChildren={0.06}>
              <StaggerFadeItem>
                <p className="text-sm text-charcoal/80">{t('home.music.schedule1')}</p>
              </StaggerFadeItem>
              <StaggerFadeItem>
                <p className="text-sm text-charcoal/80">{t('home.music.schedule2')}</p>
              </StaggerFadeItem>
            </StaggerFade>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <HomeSectionMedia
              src={homeSectionImages.liveMusic}
              alt={t('home.music.imageAlt')}
              align="right"
            />
          </StaggerFadeItem>
        </StaggerFade>
      </Container>
    </section>
  );
}
