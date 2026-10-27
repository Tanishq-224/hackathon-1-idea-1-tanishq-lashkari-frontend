import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { siteContact } from '../../../lib/siteContact';
import './BookingEditorialCta.css';

/**
 * @description Reference-style editorial CTA for the reservation page (normal scale).
 * @returns {JSX.Element} Booking help CTA block.
 */
export function BookingEditorialCta() {
  const { t } = useTranslation();

  return (
    <section className="booking-editorial-cta" aria-labelledby="booking-editorial-cta-heading">
      <a href={`mailto:${siteContact.email}`} className="booking-editorial-cta__email">
        {t('bookingPage.cta.email', siteContact.email)}
      </a>

      <h2 id="booking-editorial-cta-heading" className="booking-editorial-cta__title">
        <span className="booking-editorial-cta__line">
          <span className="booking-editorial-cta__muted">
            {t('bookingPage.cta.line1Muted', 'Send us')}
          </span>
          <span className="booking-editorial-cta__solid">
            {t('bookingPage.cta.line1Solid', ' your request, and')}
          </span>
        </span>
        <span className="booking-editorial-cta__line">
          <span className="booking-editorial-cta__accent">
            {t('bookingPage.cta.line2Accent', "we'll confirm")}
          </span>
          <span className="booking-editorial-cta__solid">
            {t('bookingPage.cta.line2Solid', ' your')}
          </span>
          <span className="booking-editorial-cta__muted">
            {t('bookingPage.cta.line2Muted', ' table')}
          </span>
        </span>
        <span className="booking-editorial-cta__line booking-editorial-cta__solid">
          {t('bookingPage.cta.line3Solid', 'as soon as we can.')}
        </span>
      </h2>

      <div className="booking-editorial-cta__actions">
        <Link to="/contact" className="booking-editorial-cta__btn">
          {t('bookingPage.cta.button', 'Contact us')}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
