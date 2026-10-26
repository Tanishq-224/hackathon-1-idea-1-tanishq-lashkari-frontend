import { useTranslation } from 'react-i18next';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../../components/animations/StaggerFade';
import { Button } from '../../../components/ui/Button';
import { Container } from '../../../components/ui/Container';
import { homeSectionImages } from '../data/homeImages';

/**
 * @description Full-width Txotx banner with reservation call to action.
 * @returns {JSX.Element} Banner section.
 */
export function TxotxBannerSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[420px] md:min-h-[480px]">
      <img
        src={homeSectionImages.txotxBanner}
        alt=""
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
        aria-hidden
      />
      <div className="absolute inset-0 bg-charcoal/60" aria-hidden />
      <Container className="relative z-10 flex min-h-[inherit] flex-col items-center justify-center py-20 text-center">
        <StaggerFade className="flex flex-col items-center">
          <StaggerFadeItem>
            <h2 className="font-display text-[clamp(2.5rem,8vw,5rem)] font-semibold text-ivory">
              {t('home.txotx.title')}
            </h2>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <p className="mt-4 max-w-lg text-ivory/90">{t('home.txotx.description')}</p>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <div className="mt-8">
              <Button to="/reserve">{t('home.txotx.cta')}</Button>
            </div>
          </StaggerFadeItem>
        </StaggerFade>
      </Container>
    </section>
  );
}
