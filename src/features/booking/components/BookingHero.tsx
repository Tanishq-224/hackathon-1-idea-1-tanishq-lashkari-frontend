import { Calendar, Users, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Container } from '../../../components/ui/Container';
import { cn } from '../../../lib/cn';
import './BookingHero.css';

export type BookingHeroTab = 'book' | 'manage';

type BookingHeroProps = {
  activeTab: BookingHeroTab;
  onTabChange: (tab: BookingHeroTab) => void;
};

/**
 * @description Premium editorial hero for the reservation page with mood photography and mode toggle.
 * @param {BookingHeroProps} props - Active tab and tab change handler.
 * @returns {JSX.Element} Booking hero header.
 */
export function BookingHero({ activeTab, onTabChange }: BookingHeroProps) {
  const { t } = useTranslation();

  return (
    <header className="booking-hero">
      <div className="booking-hero__media" aria-hidden="true">
        <img
          src="/images/booking-hero-dining-table.jpg"
          alt=""
          className="booking-hero__image"
          loading="eager"
          decoding="async"
        />
        <div className="booking-hero__scrim" />
      </div>

      <Container className="booking-hero__inner">
        <nav
          aria-label={t('bookingPage.hero.breadcrumbLabel', 'Breadcrumb')}
          className="booking-hero__crumb"
        >
          <Link to="/">{t('nav.home', 'Home')}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">
            {t('bookingPage.hero.breadcrumbCurrent', 'Reservations')}
          </span>
        </nav>

        <p className="booking-hero__eyebrow">
          {t('bookingPage.hero.eyebrow', 'Erreserbak · Bookings')}
        </p>

        <div className="booking-hero__title-row">
          <span className="booking-hero__title-line" aria-hidden="true" />
          <h1 className="booking-hero__title">
            {t('bookingPage.hero.title', 'Book Your Table')}
          </h1>
          <span className="booking-hero__title-line" aria-hidden="true" />
        </div>

        <p className="booking-hero__lead">
          {t(
            'bookingPage.hero.lead',
            'Reserve your place at the long table — natural cider, fire-grilled plates, and the warmth of the sagardotegia.',
          )}
        </p>

        <div className="booking-hero__badges">
          <span className="booking-hero__badge">
            <span className="booking-hero__badge-icon">
              <Calendar className="size-3.5" aria-hidden="true" />
            </span>
            {t('bookingPage.hero.badgeRealtime', 'Real-time Availability')}
          </span>
          <span className="booking-hero__badge">
            <span className="booking-hero__badge-icon">
              <Users className="size-3.5" aria-hidden="true" />
            </span>
            {t('bookingPage.hero.badgeSelectTable', 'Select Your Favourite Table')}
          </span>
          <span className="booking-hero__badge">
            <span className="booking-hero__badge-icon">
              <Zap className="size-3.5" aria-hidden="true" />
            </span>
            {t('bookingPage.hero.badgeInstant', 'Instant Confirmation')}
          </span>
        </div>

        <div
          className="booking-hero__mode"
          role="tablist"
          aria-label={t('bookingPage.tabs.label', 'Booking actions')}
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'book'}
            className={cn(
              'booking-hero__mode-tab',
              activeTab === 'book'
                ? 'booking-hero__mode-tab--active'
                : 'booking-hero__mode-tab--idle',
            )}
            onClick={() => onTabChange('book')}
          >
            {t('bookingPage.tabs.book', 'Book a table')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'manage'}
            className={cn(
              'booking-hero__mode-tab',
              activeTab === 'manage'
                ? 'booking-hero__mode-tab--active'
                : 'booking-hero__mode-tab--idle',
            )}
            onClick={() => onTabChange('manage')}
          >
            {t('bookingPage.tabs.manage', 'Manage your booking')}
          </button>
        </div>
      </Container>

      <span className="sr-only">
        {t(
          'bookingPage.hero.imageAlt',
          'Candlelit cider house table with wine glasses and seasonal plates',
        )}
      </span>
    </header>
  );
}
