import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PublicPageHero } from '../../components/layout/PublicPageHero';
import { Container } from '../../components/ui/Container';
import { siteContact } from '../../lib/siteContact';
import { cn } from '../../lib/cn';
import { BookingForm } from './components/BookingForm';
import { ManageBookingPanel } from './components/ManageBookingPanel';
import type { BookingRecord } from './types/booking';

type BookingTab = 'book' | 'manage';

/**
 * @description Table booking requests and self-service booking management.
 * @returns {JSX.Element} Booking page.
 */
export function BookingPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<BookingTab>('book');
  const [created, setCreated] = useState<BookingRecord | null>(null);

  return (
    <article className="public-page">
      <PublicPageHero
        imageSrc="/images/hero-cider-house-interior.jpg"
        imageAlt={t('bookingPage.hero.imageAlt')}
        eyebrow={t('bookingPage.hero.eyebrow')}
        title={t('bookingPage.hero.title')}
        lead={t('bookingPage.hero.lead')}
        breadcrumbLabel={t('bookingPage.hero.breadcrumbLabel')}
        breadcrumbHome={t('nav.home')}
        breadcrumbCurrent={t('bookingPage.hero.breadcrumbCurrent')}
      />

      <section className="public-section">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          <div>
            <h2 className="public-section__title">{t('bookingPage.intro.title')}</h2>
            <p className="public-section__lead">{t('bookingPage.intro.body')}</p>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
              {t('bookingPage.intro.hours')}
            </p>
            <div className="public-cta-row">
              <a
                href={`tel:${siteContact.phoneTel}`}
                className="inline-flex min-h-11 items-center rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-surface"
              >
                {t('bookingPage.intro.call', { phone: siteContact.phoneDisplay })}
              </a>
              <a
                href={siteContact.whatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center rounded-full border border-olive/40 px-5 py-2.5 text-sm font-medium text-charcoal"
              >
                {t('bookingPage.intro.whatsapp')}
              </a>
            </div>
          </div>

          <div className="booking-panel">
            <div className="booking-tabs" role="tablist" aria-label={t('bookingPage.tabs.label')}>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'book'}
                className={cn('booking-tab', tab === 'book' && 'booking-tab--active')}
                onClick={() => {
                  setTab('book');
                  setCreated(null);
                }}
              >
                {t('bookingPage.tabs.book')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'manage'}
                className={cn('booking-tab', tab === 'manage' && 'booking-tab--active')}
                onClick={() => setTab('manage')}
              >
                {t('bookingPage.tabs.manage')}
              </button>
            </div>

            {tab === 'book' ? (
              <div role="tabpanel">
                {created ? (
                  <div className="booking-success">
                    <p className="font-semibold text-charcoal">
                      {t('bookingPage.form.successTitle')}
                    </p>
                    <p className="booking-success__ref">{created.reference}</p>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
                      {t('bookingPage.form.successBody')}
                    </p>
                    <button
                      type="button"
                      className="mt-4 text-sm font-medium text-cider underline"
                      onClick={() => setCreated(null)}
                    >
                      {t('bookingPage.form.newBooking')}
                    </button>
                  </div>
                ) : (
                  <BookingForm onCreated={setCreated} />
                )}
              </div>
            ) : (
              <div role="tabpanel">
                <ManageBookingPanel />
              </div>
            )}
          </div>
        </Container>
      </section>
    </article>
  );
}
