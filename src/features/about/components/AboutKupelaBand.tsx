import { useTranslation } from 'react-i18next';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../../components/animations/StaggerFade';
import { Container } from '../../../components/ui/Container';
import { aboutImages } from '../data/aboutImages';
import { AboutParallaxMedia } from './AboutParallaxMedia';
import '../AboutPage.css';

/**
 * @description Full-width fermenting cider band with parallax background.
 * @returns {JSX.Element} Kupela band section.
 */
export function AboutKupelaBand() {
  const { t } = useTranslation();

  return (
    <section className="about-kupela">
      <AboutParallaxMedia
        variant="cover"
        src={aboutImages.ferment}
        alt=""
        speed={20}
        scale={1.2}
        className="absolute inset-0"
        imageClassName="object-center"
      />
      <div className="about-kupela__scrim" aria-hidden />
      <Container className="relative z-10 flex min-h-[inherit] flex-col items-center justify-center py-24 text-center md:py-28">
        <StaggerFade>
          <StaggerFadeItem>
            <span className="about-eyebrow about-eyebrow--center about-eyebrow--light">
              {t('aboutPage.kupela.eyebrow')}
            </span>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <p className="about-kupela__quote mt-6">{t('aboutPage.kupela.text')}</p>
          </StaggerFadeItem>
        </StaggerFade>
      </Container>
    </section>
  );
}
