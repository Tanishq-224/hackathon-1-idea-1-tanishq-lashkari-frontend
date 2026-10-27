import { ArrowRight, Clock, Users } from 'lucide-react';
import { type FormEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AVAILABLE_TIME_SLOTS } from '../lib/bookingTimeSlots';
import { BOOKING_GUEST_COUNTS } from '../lib/guestCountOptions';
import { BookingDatePicker } from './BookingDatePicker';
import type { BookingSelectOption } from './BookingListSelect';
import { BookingListSelect } from './BookingListSelect';
import './BookingFields.css';

type BookingDateTimeSelectorProps = {
  date: string;
  time: string;
  guests: number;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onGuestsChange: (guests: number) => void;
  onCheckAvailability: () => void;
};

/**
 * @description Section B component allowing the guest to select preferred date,
 * service time-slot, and party size, and check live table availability.
 *
 * @param {BookingDateTimeSelectorProps} props - Current selections and handlers.
 * @returns {JSX.Element} Date, time, and guest selector panel.
 */
export function BookingDateTimeSelector({
  date,
  time,
  guests,
  onDateChange,
  onTimeChange,
  onGuestsChange,
  onCheckAvailability,
}: BookingDateTimeSelectorProps) {
  const { t } = useTranslation();
  const [validationError, setValidationError] = useState<string | null>(null);

  const todayIso = new Date().toISOString().split('T')[0];

  const timeOptions = useMemo((): BookingSelectOption[] => {
    const lunchLabel = t('bookingPage.slots.lunch', 'Lunch (13:00 - 15:00)');
    const dinnerLabel = t('bookingPage.slots.dinner', 'Dinner (20:00 - 21:00)');

    return AVAILABLE_TIME_SLOTS.map((slot) => {
      const isLunch =
        slot.startsWith('13') || slot.startsWith('14') || slot.startsWith('15');
      return {
        value: slot,
        label: slot,
        group: isLunch ? lunchLabel : dinnerLabel,
      };
    });
  }, [t]);

  const guestOptions = useMemo((): BookingSelectOption[] => {
    return BOOKING_GUEST_COUNTS.map((num) => ({
      value: String(num),
      label:
        num === 1
          ? t('bookingPage.form.guestSingular', '1 Guest')
          : t('bookingPage.form.guestsCount', '{{count}} Guests', { count: num }),
    }));
  }, [t]);

  /**
   * @description Validates selections and triggers availability check.
   * @param {FormEvent} event - Form submit event.
   * @returns {void}
   */
  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    setValidationError(null);

    if (!date) {
      setValidationError(t('bookingPage.form.dateRequired', 'Please select a date.'));
      return;
    }
    if (date < todayIso) {
      setValidationError(
        t('bookingPage.form.dateInPast', 'Please select a date today or in the future.'),
      );
      return;
    }
    if (!time) {
      setValidationError(t('bookingPage.form.timeRequired', 'Please select a dining time.'));
      return;
    }
    if (!guests || guests < 1) {
      setValidationError(t('bookingPage.form.guestsRequired', 'Please select at least 1 guest.'));
      return;
    }

    onCheckAvailability();
  };

  return (
    <section aria-labelledby="select-date-heading" className="booking-page__card">
      <div className="mb-6">
        <h2
          id="select-date-heading"
          className="font-display text-xl font-bold tracking-tight text-charcoal sm:text-2xl"
        >
          {t('bookingPage.section1.title', '1. Select Date, Time & Guests')}
        </h2>
        <p className="mt-1 text-sm text-charcoal/70">
          {t(
            'bookingPage.section1.subtitle',
            'Choose your preferred date, time and number of guests to see available tables.',
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
          <BookingDatePicker
            label={t('bookingPage.form.date', 'Preferred date')}
            ariaLabel={t('bookingPage.form.date', 'Preferred date')}
            value={date}
            min={todayIso}
            onChange={(next) => {
              setValidationError(null);
              onDateChange(next);
            }}
          />

          <BookingListSelect
            label={t('bookingPage.form.time', 'Dining time')}
            ariaLabel={t('bookingPage.form.time', 'Dining time')}
            value={time}
            displayValue={time}
            icon={Clock}
            options={timeOptions}
            onChange={(next) => {
              setValidationError(null);
              onTimeChange(next);
            }}
          />

          <BookingListSelect
            label={t('bookingPage.form.guests', 'Guests')}
            ariaLabel={t('bookingPage.form.guests', 'Guests')}
            value={String(guests)}
            displayValue={t('bookingPage.form.guestsCount', '{{count}} Guests', {
              count: guests,
            })}
            icon={Users}
            options={guestOptions}
            onChange={(next) => {
              setValidationError(null);
              onGuestsChange(Number(next));
            }}
          />

          <div className="lg:pt-6">
            <button type="submit" className="booking-check-btn">
              <span>{t('bookingPage.section1.checkAvailability', 'Check Availability')}</span>
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        {validationError ? (
          <p className="mt-3 text-xs font-medium text-rose-600" role="alert">
            {validationError}
          </p>
        ) : null}
      </form>
    </section>
  );
}
