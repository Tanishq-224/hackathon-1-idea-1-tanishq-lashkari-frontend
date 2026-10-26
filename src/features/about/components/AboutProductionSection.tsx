import { useTranslation } from 'react-i18next';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../../components/animations/StaggerFade';
import { Button } from '../../../components/ui/Button';
import { Container } from '../../../components/ui/Container';
import '../AboutPage.css';

/**
 * @description Organic production copy and animated list (section 04, no gallery images).
 * @returns {JSX.Element} Production section.
 */
export function AboutProductionSection() {
  const { t } = useTranslation();
  const rows = ['row1', 'row2', 'row3'] as const;

  return (
    <section className="about-production" id="produccion">
      <Container>
        <StaggerFade className="mx-auto max-w-3xl text-center">
          <StaggerFadeItem>
            <p className="about-section-index" aria-hidden>
              04
            </p>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <span className="about-eyebrow about-eyebrow--center">
              {t('aboutPage.production.eyebrow')}
            </span>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <h2 className="about-split__title mt-4">
              {t('aboutPage.production.title')}
            </h2>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <p className="about-split__copy mx-auto mt-5">{t('aboutPage.production.lead')}</p>
          </StaggerFadeItem>
        </StaggerFade>

        <StaggerFade className="mt-14 border-b border-charcoal/10">
          {rows.map((rowKey) => (
            <StaggerFadeItem key={rowKey}>
              <div className="about-trow">
                <h3 className="font-display text-xl font-semibold text-charcoal">
                  {t(`aboutPage.production.${rowKey}.title`)}
                </h3>
                <p className="text-base leading-relaxed text-charcoal/85">
                  {t(`aboutPage.production.${rowKey}.body`)}
                </p>
              </div>
            </StaggerFadeItem>
          ))}
        </StaggerFade>

        <StaggerFade className="mt-8 flex justify-center">
          <StaggerFadeItem>
            <Button to="/menu" variant="secondary">
              {t('aboutPage.production.link')}
            </Button>
          </StaggerFadeItem>
        </StaggerFade>
      </Container>
    </section>
  );
}
