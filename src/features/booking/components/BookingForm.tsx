import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../../../components/ui/Button';
import { createBooking } from '../lib/bookingStorage';
import type { BookingRecord, BookingSlot } from '../types/booking';

type BookingFormProps = {
  /** @description Called after a booking is stored successfully. */
  onCreated: (record: BookingRecord) => void;
};

/**
 * @description Collects table booking requests (stored locally until backend is wired).
 * @param {BookingFormProps} props - Success callback.
 * @returns {JSX.Element} Booking form.
 */
export function BookingForm({ onCreated }: BookingFormProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  /**
   * @description Validates and persists the booking request.
   * @param {FormEvent<HTMLFormElement>} event - Submit event.
   * @returns {void}
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setError(null);
    const data = new FormData(event.currentTarget);
    const date = String(data.get('date') ?? '');
    const slot = String(data.get('slot') ?? 'lunch') as BookingSlot;
    const guests = Number(data.get('guests'));
    const busGuests = Number(data.get('busGuests') ?? 0);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const notes = String(data.get('notes') ?? '').trim();

    if (!date || !name || !email || !phone || !guests || guests < 1) {
      setError(t('bookingPage.form.errorRequired'));
      return;
    }

    const record = createBooking({
      date,
      slot,
      guests,
      busGuests: Number.isFinite(busGuests) ? busGuests : 0,
      name,
      email,
      phone,
      notes,
    });
    onCreated(record);
    event.currentTarget.reset();
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <div className="booking-field">
        <label htmlFor="booking-date">{t('bookingPage.form.date')}</label>
        <input id="booking-date" name="date" type="date" required />
      </div>
      <div className="booking-field">
        <label htmlFor="booking-slot">{t('bookingPage.form.slot')}</label>
        <select id="booking-slot" name="slot" defaultValue="lunch">
          <option value="lunch">{t('bookingPage.form.slotLunch')}</option>
          <option value="dinner">{t('bookingPage.form.slotDinner')}</option>
        </select>
      </div>
      <div className="booking-field">
        <label htmlFor="booking-guests">{t('bookingPage.form.guests')}</label>
        <input
          id="booking-guests"
          name="guests"
          type="number"
          min={1}
          max={80}
          defaultValue={2}
          required
        />
      </div>
      <div className="booking-field">
        <label htmlFor="booking-bus">{t('bookingPage.form.busGuests')}</label>
        <input id="booking-bus" name="busGuests" type="number" min={0} max={80} defaultValue={0} />
      </div>
      <div className="booking-field">
        <label htmlFor="booking-name">{t('bookingPage.form.name')}</label>
        <input id="booking-name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="booking-field">
        <label htmlFor="booking-email">{t('bookingPage.form.email')}</label>
        <input id="booking-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="booking-field">
        <label htmlFor="booking-phone">{t('bookingPage.form.phone')}</label>
        <input id="booking-phone" name="phone" type="tel" autoComplete="tel" required />
      </div>
      <div className="booking-field booking-form__full">
        <label htmlFor="booking-notes">{t('bookingPage.form.notes')}</label>
        <textarea id="booking-notes" name="notes" rows={4} />
      </div>
      {error ? (
        <p className="booking-form__full text-sm text-cider" role="alert">
          {error}
        </p>
      ) : null}
      <div className="booking-form__full">
        <Button type="submit">{t('bookingPage.form.submit')}</Button>
        <p className="booking-notice">{t('bookingPage.form.notice')}</p>
      </div>
    </form>
  );
}
