import { useTranslation } from 'react-i18next';

import {
  StaggerFade,
  StaggerFadeItem,
} from '../../components/animations/StaggerFade';
import { PublicPageHero } from '../../components/layout/PublicPageHero';
import { Container } from '../../components/ui/Container';
import { siteContact } from '../../lib/siteContact';
import { ContactParallaxBand } from './components/ContactParallaxBand';

const hourKeys = ['thu', 'fri', 'sat', 'sun', 'dinners', 'weekdays', 'christmas'] as const;
const routeKeys = ['vitoria', 'donostia', 'bilbao'] as const;
const busKeys = ['lunch', 'dinner', 'minimum', 'debagoiena'] as const;

/**
 * @description Contact, directions, hours, and bus information (iturrieta.eus reference).
 * @returns {JSX.Element} Contact page.
 */
export function ContactPage() {
  const { t } = useTranslation();

  return (
    <article className="public-page">
      <PublicPageHero
        parallax
        imageSrc="/images/hero-farmhouse-valley.png"
        imageAlt={t('contactPage.hero.imageAlt')}
        eyebrow={t('contactPage.hero.eyebrow')}
        title={t('contactPage.hero.title')}
        lead={t('contactPage.hero.lead')}
        breadcrumbLabel={t('contactPage.hero.breadcrumbLabel')}
        breadcrumbHome={t('nav.home')}
        breadcrumbCurrent={t('contactPage.hero.breadcrumbCurrent')}
      />

      <section className="public-section">
        <Container>
          <StaggerFade>
            <StaggerFadeItem>
              <div className="public-card-grid public-card-grid--3">
                <div className="public-info-card">
                  <p className="public-info-card__label">{t('contactPage.cards.address')}</p>
                  <p className="public-info-card__value">
                    {siteContact.addressLine1}
                    <br />
                    {siteContact.addressLine2}
                  </p>
                </div>
                <div className="public-info-card">
                  <p className="public-info-card__label">{t('contactPage.cards.bookings')}</p>
                  <p className="public-info-card__value">
                    <a href={`tel:${siteContact.phoneTel}`}>{siteContact.phoneDisplay}</a>
                    <br />
                    <span className="text-sm text-charcoal/65">{siteContact.phoneTel}</span>
                  </p>
                </div>
                <div className="public-info-card">
                  <p className="public-info-card__label">{t('contactPage.cards.email')}</p>
                  <p className="public-info-card__value">
                    <a href={`mailto:${siteContact.email}`}>{siteContact.email}</a>
                    <br />
                    <a href={siteContact.instagramUrl} target="_blank" rel="noreferrer">
                      {siteContact.instagramHandle}
                    </a>
                  </p>
                </div>
              </div>
            </StaggerFadeItem>
          </StaggerFade>
        </Container>
      </section>

      <ContactParallaxBand
        src="/images/contact-parallax-spread.png"
        alt={t('contactPage.parallax.spreadAlt')}
        captionKey="contactPage.parallax.spreadCaption"
      />

      <section className="public-section public-section--surface">
        <Container>
          <h2 className="public-section__title">{t('contactPage.phone.title')}</h2>
          <p className="public-section__lead">{t('contactPage.phone.body')}</p>
          <div className="public-cta-row">
            <a
              href={`tel:${siteContact.phoneTel}`}
              className="inline-flex min-h-11 items-center rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-surface"
            >
              {t('contactPage.phone.call')}
            </a>
            <a
              href={siteContact.whatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center rounded-full border border-olive/40 px-5 py-2.5 text-sm font-medium text-charcoal"
            >
              {t('contactPage.phone.whatsapp')}
            </a>
            <a
              href="/reserve"
              className="inline-flex min-h-11 items-center rounded-full border border-olive/40 px-5 py-2.5 text-sm font-medium text-charcoal"
            >
              {t('contactPage.phone.bookOnline')}
            </a>
          </div>
          <p className="mt-4 text-sm text-charcoal/70">{t('contactPage.phone.hoursNote')}</p>
          <p className="mt-2 text-sm text-charcoal/70">{t('contactPage.phone.holiday')}</p>
          <p className="mt-2 text-sm text-charcoal/70">
            {t('contactPage.phone.emailAlt', { email: siteContact.email })}
          </p>
        </Container>
      </section>

      <section className="public-section">
        <Container>
          <h2 className="public-section__title">{t('contactPage.bus.title')}</h2>
          <p className="public-section__lead">{t('contactPage.bus.lead')}</p>
          <ul className="mt-6 space-y-3 text-charcoal/85">
            {busKeys.map((key) => (
              <li key={key} className="leading-relaxed">
                {t(`contactPage.bus.${key}`)}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-charcoal/65">{t('contactPage.bus.policy')}</p>
        </Container>
      </section>

      <ContactParallaxBand
        src="/images/banner-location-mountains.jpg"
        alt={t('contactPage.parallax.valleyAlt')}
        captionKey="contactPage.parallax.valleyCaption"
      />

      <section className="public-section public-section--surface">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="public-section__title">{t('contactPage.directions.title')}</h2>
            <p className="public-section__lead">{t('contactPage.directions.lead')}</p>
            <p className="mt-3 text-sm text-charcoal/75">
              {t('contactPage.directions.coords', { coords: siteContact.coordinates })}
            </p>
            <p className="mt-3 text-sm text-charcoal/75">{t('contactPage.directions.warning')}</p>
          </div>
          <ol className="public-route-list">
            {routeKeys.map((key) => (
              <li key={key}>
                <strong>{t(`contactPage.directions.${key}.title`)}</strong>
                <p className="mt-1">{t(`contactPage.directions.${key}.body`)}</p>
                <a
                  href={siteContact.googleMaps[key]}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm font-medium text-cider hover:underline"
                >
                  {t('contactPage.directions.mapsLink')}
                </a>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="public-section">
        <Container>
          <h2 className="public-section__title">{t('contactPage.hours.title')}</h2>
          <p className="public-section__lead">{t('contactPage.hours.lead')}</p>
          <table className="public-hours-table mt-8">
            <tbody>
              {hourKeys.map((key) => (
                <tr key={key}>
                  <th scope="row">{t(`contactPage.hours.rows.${key}.day`)}</th>
                  <td>{t(`contactPage.hours.rows.${key}.time`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-sm text-charcoal/70">{t('contactPage.hours.note')}</p>
        </Container>
      </section>
    </article>
  );
}
