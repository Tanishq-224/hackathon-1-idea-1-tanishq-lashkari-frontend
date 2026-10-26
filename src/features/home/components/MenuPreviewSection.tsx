import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../../components/animations/StaggerFade';
import { Container } from '../../../components/ui/Container';

const menuItemKeys = ['item1', 'item2', 'item3', 'item4', 'item5'] as const;

/**
 * @description Cider-house menu preview with seasonal price call-out.
 * @returns {JSX.Element} Menu section.
 */
export function MenuPreviewSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#f0e8dc] py-16 md:py-24">
      <Container>
        <StaggerFade className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <StaggerFadeItem>
            <p className="text-sm font-medium uppercase tracking-wide text-olive">
              {t('home.menu.eyebrow')}
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight">
              {t('home.menu.title')}
            </h2>
            <p className="mt-6 font-display text-4xl font-semibold text-cider md:text-5xl">
              {t('home.menu.price')}
            </p>
            <p className="mt-2 text-sm text-charcoal/70">{t('home.menu.priceNote')}</p>
          </StaggerFadeItem>
          <StaggerFadeItem>
            <StaggerFade
              className="divide-y divide-charcoal/10 border-t border-charcoal/10"
              staggerChildren={0.06}
            >
              {menuItemKeys.map((key) => (
                <StaggerFadeItem key={key}>
                  <div className="py-5">
                    <h3 className="font-medium text-charcoal">
                      {t(`home.menu.${key}.name`)}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-charcoal/75">
                      {t(`home.menu.${key}.description`)}
                    </p>
                  </div>
                </StaggerFadeItem>
              ))}
            </StaggerFade>
            <Link
              to="/menu"
              className="mt-8 inline-block text-sm font-medium text-cider hover:underline"
            >
              {t('home.menu.link')}
            </Link>
          </StaggerFadeItem>
        </StaggerFade>
      </Container>
    </section>
  );
}
