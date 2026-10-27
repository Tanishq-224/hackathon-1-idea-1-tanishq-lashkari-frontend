import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../../../components/ui/Button';
import { cancelBooking, findBooking } from '../lib/bookingStorage';
import type { BookingRecord } from '../types/booking';

/**
 * @description Lets guests look up a booking by reference + email and request cancellation.
 * @returns {JSX.Element} Manage booking panel.
 */
export function ManageBookingPanel() {
  const { t } = useTranslation();
  const [record, setRecord] = useState<BookingRecord | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * @description Loads a booking from local storage.
   * @param {FormEvent<HTMLFormElement>} event - Submit event.
   * @returns {void}
   */
  const handleLookup = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const data = new FormData(event.currentTarget);
    const reference = String(data.get('reference') ?? '');
    const email = String(data.get('email') ?? '');
    const found = findBooking(reference, email);
    if (!found) {
      setRecord(null);
      setError(t('bookingPage.manage.notFound'));
      return;
    }
    setRecord(found);
  };

  /**
   * @description Cancels the currently loaded booking.
   * @returns {void}
   */
  const handleCancel = (): void => {
    if (!record) {
      return;
    }
    const updated = cancelBooking(record.reference, record.email);
    if (!updated) {
      setError(t('bookingPage.manage.notFound'));
      return;
    }
    setRecord(updated);
    setMessage(t('bookingPage.manage.cancelled'));
  };

  return (
    <div>
      <form className="booking-form" onSubmit={handleLookup}>
        <div className="booking-field booking-form__full">
          <label htmlFor="manage-reference">{t('bookingPage.manage.reference')}</label>
          <input
            id="manage-reference"
            name="reference"
            type="text"
            placeholder="ITU-ABC123"
            autoComplete="off"
            required
          />
        </div>
        <div className="booking-field booking-form__full">
          <label htmlFor="manage-email">{t('bookingPage.manage.email')}</label>
          <input id="manage-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="booking-form__full">
          <Button type="submit" variant="secondary">
            {t('bookingPage.manage.lookup')}
          </Button>
        </div>
      </form>

      {error ? (
        <p className="mt-4 text-sm text-cider" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-4 text-sm text-olive" role="status">
          {message}
        </p>
      ) : null}

      {record ? (
        <div className="booking-success mt-6">
          <p className="text-sm font-semibold text-charcoal">
            {t('bookingPage.manage.foundTitle')}
          </p>
          <p className="booking-success__ref">{record.reference}</p>
          <dl className="booking-detail-grid">
            <dt>{t('bookingPage.manage.status')}</dt>
            <dd>{t(`bookingPage.status.${record.status}`)}</dd>
            <dt>{t('bookingPage.manage.date')}</dt>
            <dd>{record.date}</dd>
            <dt>{t('bookingPage.manage.slot')}</dt>
            <dd>{t(`bookingPage.slots.${record.slot}`)}</dd>
            <dt>{t('bookingPage.manage.guests')}</dt>
            <dd>{record.guests}</dd>
            {record.busGuests > 0 ? (
              <>
                <dt>{t('bookingPage.manage.busGuests')}</dt>
                <dd>{record.busGuests}</dd>
              </>
            ) : null}
          </dl>
          {record.status !== 'cancelled' ? (
            <div className="mt-4">
              <Button type="button" variant="secondary" onClick={handleCancel}>
                {t('bookingPage.manage.cancelRequest')}
              </Button>
            </div>
          ) : null}
          <p className="booking-notice">{t('bookingPage.manage.phoneNote')}</p>
        </div>
      ) : null}
    </div>
  );
}
