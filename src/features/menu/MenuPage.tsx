import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../components/animations/StaggerFade';
import { PublicPageHero } from '../../components/layout/PublicPageHero';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/ui/Container';

const menuItemKeys = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'] as const;
const visitKeys = ['farmhouse', 'orchard', 'cellar'] as const;

/**
 * @description Cider house menu, experiences, visits, and shop overview.
 * @returns {JSX.Element} Menu & experiences page.
 */
export function MenuPage() {
  const { t } = useTranslation();

  return (
    <article className="public-page">
      <PublicPageHero
        imageSrc="/images/banner-txotx-dining-hall.jpg"
        imageAlt={t('menuPage.hero.imageAlt')}
        eyebrow={t('menuPage.hero.eyebrow')}
        title={t('menuPage.hero.title')}
        lead={t('menuPage.hero.lead')}
        breadcrumbLabel={t('menuPage.hero.breadcrumbLabel')}
        breadcrumbHome={t('nav.home')}
        breadcrumbCurrent={t('menuPage.hero.breadcrumbCurrent')}
      />

      <section className="public-section">
        <Container>
          <StaggerFade className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <StaggerFadeItem>
              <h2 className="public-section__title">{t('menuPage.menu.title')}</h2>
              <p className="public-section__lead">{t('menuPage.menu.subtitle')}</p>
              <p className="mt-6 font-display text-4xl font-semibold text-cider md:text-5xl">
                {t('menuPage.menu.price')}
              </p>
              <p className="mt-2 text-sm text-charcoal/70">{t('menuPage.menu.priceNote')}</p>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
                {t('menuPage.menu.children')}
              </p>
            </StaggerFadeItem>
            <StaggerFadeItem>
              <ul className="public-menu-list">
                {menuItemKeys.map((key) => (
                  <li key={key}>
                    <span className="public-menu-list__name">
                      {t(`menuPage.menu.${key}.name`)}
                    </span>
                    <span className="public-menu-list__desc">
                      {t(`menuPage.menu.${key}.description`)}
                    </span>
                  </li>
                ))}
              </ul>
            </StaggerFadeItem>
          </StaggerFade>
        </Container>
      </section>

      <section className="public-section public-section--surface">
        <Container className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="public-section__title">{t('menuPage.txotx.title')}</h2>
            <p className="public-section__lead">{t('menuPage.txotx.body')}</p>
            <p className="mt-3 text-sm font-medium text-olive">{t('menuPage.txotx.season')}</p>
          </div>
          <div className="public-info-card">
            <p className="public-info-card__label">{t('menuPage.txotx.label')}</p>
            <p className="public-info-card__value">{t('menuPage.txotx.detail')}</p>
          </div>
        </Container>
      </section>

      <section className="public-section">
        <Container>
          <h2 className="public-section__title">{t('menuPage.visits.title')}</h2>
          <p className="public-section__lead">{t('menuPage.visits.lead')}</p>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {visitKeys.map((key) => (
              <li key={key} className="public-info-card">
                <p className="public-info-card__label">{t(`menuPage.visits.${key}.title`)}</p>
                <p className="public-info-card__value">{t(`menuPage.visits.${key}.body`)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button to="/contact">{t('menuPage.visits.cta')}</Button>
          </div>
        </Container>
      </section>

      <section className="public-section public-section--surface">
        <Container className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="public-section__title">{t('menuPage.shop.title')}</h2>
            <p className="public-section__lead">{t('menuPage.shop.body')}</p>
          </div>
          <p className="text-sm leading-relaxed text-charcoal/75">
            {t('menuPage.shop.note')}{' '}
            <Link to="/contact" className="font-medium text-cider hover:underline">
              {t('menuPage.shop.link')}
            </Link>
          </p>
        </Container>
      </section>

      <section className="public-section">
        <Container className="text-center">
          <h2 className="public-section__title">{t('menuPage.book.title')}</h2>
          <p className="public-section__lead mx-auto">{t('menuPage.book.body')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/reserve">{t('menuPage.book.primary')}</Button>
            <Button to="/contact" variant="secondary">
              {t('menuPage.book.secondary')}
            </Button>
          </div>
        </Container>
      </section>
    </article>
  );
}
