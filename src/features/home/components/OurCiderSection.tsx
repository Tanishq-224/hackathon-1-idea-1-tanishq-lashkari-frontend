import { useTranslation } from 'react-i18next';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../../components/animations/StaggerFade';
import { Button } from '../../../components/ui/Button';
import { Container } from '../../../components/ui/Container';
import { homeSectionImages } from '../data/homeImages';
import { HomeSectionMedia } from './HomeSectionMedia';

/**
 * @description Dark feature block highlighting natural cider and orchard stats.
 * @returns {JSX.Element} Our cider section.
 */
export function OurCiderSection() {
  const { t } = useTranslation();
  const stats = ['stat1', 'stat2', 'stat3'] as const;

  return (
    <section className="bg-charcoal py-16 text-ivory md:py-24">
      <Container>
        <StaggerFade className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <StaggerFadeItem>
            <HomeSectionMedia
              src={homeSectionImages.ciderApple}
              alt={t('home.cider.imageAlt')}
              align="left"
            />
          </StaggerFadeItem>
          <StaggerFadeItem>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight">
              {t('home.cider.title')}
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-ivory/85">{t('home.cider.body')}</p>
            <StaggerFade className="mt-8 grid gap-4 sm:grid-cols-3" staggerChildren={0.06}>
              {stats.map((key) => (
                <StaggerFadeItem key={key}>
                  <div>
                    <p className="font-display text-2xl font-semibold text-cider">
                      {t(`home.cider.${key}.value`)}
                    </p>
                    <p className="mt-1 text-sm text-ivory/70">
                      {t(`home.cider.${key}.label`)}
                    </p>
                  </div>
                </StaggerFadeItem>
              ))}
            </StaggerFade>
            <div className="mt-8">
              <Button to="/menu">{t('home.cider.cta')}</Button>
            </div>
          </StaggerFadeItem>
        </StaggerFade>
      </Container>
    </section>
  );
}
