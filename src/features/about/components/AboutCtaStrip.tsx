import { useTranslation } from 'react-i18next';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../../components/animations/StaggerFade';
import { Button } from '../../../components/ui/Button';
import { Container } from '../../../components/ui/Container';
import '../AboutPage.css';

/**
 * @description Full-width card CTA with eyebrow, headline, and primary action.
 * @returns {JSX.Element} CTA section.
 */
export function AboutCtaStrip() {
  const { t } = useTranslation();

  return (
    <section className="about-cta" aria-labelledby="about-cta-heading">
      <Container>
        <div className="about-cta__card">
          <StaggerFade className="about-cta__content">
            <StaggerFadeItem>
              <p className="about-cta__eyebrow">{t('aboutPage.cta.eyebrow')}</p>
            </StaggerFadeItem>
            <StaggerFadeItem>
              <h2
                id="about-cta-heading"
                className="about-cta__title"
              >
                {t('aboutPage.cta.title')}
              </h2>
            </StaggerFadeItem>
            <StaggerFadeItem>
              <p className="about-cta__lead">{t('aboutPage.cta.body')}</p>
            </StaggerFadeItem>
            <StaggerFadeItem>
              <div className="about-cta__actions">
                <Button to="/reserve" className="about-cta__btn about-cta__btn--primary">
                  {t('aboutPage.cta.button')}
                </Button>
              </div>
            </StaggerFadeItem>
          </StaggerFade>
        </div>
      </Container>
    </section>
  );
}
