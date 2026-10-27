import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../../components/animations/StaggerFade';
import { Container } from '../../../components/ui/Container';
import { homeSectionImages } from '../data/homeImages';
import { HomeSectionMedia } from './HomeSectionMedia';

const stepKeys = ['step1', 'step2', 'step3', 'step4'] as const;

/**
 * @description Cider production process overview with orchard imagery.
 * @returns {JSX.Element} Production section.
 */
export function ProductionSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-surface py-16 md:py-24">
      <Container>
        <StaggerFade className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <StaggerFadeItem>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight">
              {t('home.production.title')}
            </h2>
            <p className="mt-4 max-w-xl text-charcoal/85">{t('home.production.intro')}</p>
            <StaggerFade className="mt-8 space-y-4" staggerChildren={0.07}>
              {stepKeys.map((key, index) => (
                <StaggerFadeItem key={key}>
                  <div className="flex gap-4">
                    <span className="font-display text-lg font-semibold text-cider">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="font-medium">
                        {t(`home.production.${key}.title`)}
                      </p>
                      <p className="mt-1 text-sm text-charcoal/75">
                        {t(`home.production.${key}.body`)}
                      </p>
                    </div>
                  </div>
                </StaggerFadeItem>
              ))}
            </StaggerFade>
            <Link
              to="/about"
              className="mt-8 inline-block text-sm font-medium text-cider hover:underline"
            >
              {t('home.production.link')}
            </Link>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <HomeSectionMedia
              src={homeSectionImages.production}
              alt={t('home.production.imageAlt')}
              align="right"
            />
          </StaggerFadeItem>
        </StaggerFade>
      </Container>
    </section>
  );
}
