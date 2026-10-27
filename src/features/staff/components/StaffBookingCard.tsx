import { Calendar, Mail, Phone, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { TableGraphic } from '../../booking/components/TableGraphic';
import type { BookingRecord } from '../../booking/types/booking';
import { bookingStatusModifier } from '../lib/bookingStatusModifier';

type StaffBookingCardProps = {
  /** @description Reservation row from staff API. */
  booking: BookingRecord;
  /** @description Confirms a pending reservation. */
  onApprove: (reference: string) => void;
  /** @description Marks reservation as cancelled (staff-approved). */
  onApproveCancellation: (reference: string) => void;
  /** @description Whether an action is in flight for this reference. */
  busyReference: string | null;
};

/**
 * @description Single reservation card with table visual and staff actions.
 * @param {StaffBookingCardProps} props - Card props.
 * @returns {JSX.Element} Booking card.
 */
export function StaffBookingCard({
  booking,
  onApprove,
  onApproveCancellation,
  busyReference,
}: StaffBookingCardProps) {
  const { t, i18n } = useTranslation();
  const isBusy = busyReference === booking.reference;

  const whenLabel = (() => {
    try {
      const [y, m, d] = booking.date.split('-').map(Number);
      const datePart = new Date(y, m - 1, d).toLocaleDateString(i18n.language, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
      return booking.time ? `${datePart} · ${booking.time}` : datePart;
    } catch {
      return `${booking.date} ${booking.time ?? ''}`.trim();
    }
  })();

  const tableStatus =
    booking.status === 'cancelled'
      ? 'unavailable'
      : booking.status === 'confirmed'
        ? 'booked'
        : 'available';

  return (
    <article className="staff-booking-card">
      <div className="staff-booking-card__main">
        <div className="staff-booking-card__table-visual" aria-hidden>
          <TableGraphic status={tableStatus} capacity={booking.guests} className="h-8 w-10" />
        </div>
        <div className="staff-booking-card__body">
          <div className="staff-booking-card__head">
            <div>
              <p className="staff-booking-card__ref">{booking.reference}</p>
              <p className="staff-booking-card__guest">{booking.name}</p>
            </div>
            <div className="staff-booking-card__badges">
              <span className="staff-booking-card__slot">
                {t(`staff.dashboard.slot.${booking.slot}`)}
              </span>
              <span
                className={`staff-dashboard__badge staff-dashboard__badge--${bookingStatusModifier(booking.status)}`}
              >
                {t(`staff.dashboard.status.${booking.status}`)}
              </span>
            </div>
          </div>
          <ul className="staff-booking-card__meta">
            <li>
              <Calendar className="size-3.5 shrink-0" aria-hidden />
              {whenLabel}
            </li>
            <li>
              <Users className="size-3.5 shrink-0" aria-hidden />
              {t('staff.dashboard.guestsCount', { count: booking.guests })}
              {booking.tableId ? ` · ${booking.tableId}` : ''}
            </li>
            <li>
              <Mail className="size-3.5 shrink-0" aria-hidden />
              {booking.email}
            </li>
            {booking.phone ? (
              <li>
                <Phone className="size-3.5 shrink-0" aria-hidden />
                {booking.phone}
              </li>
            ) : null}
          </ul>
          {booking.notes ? (
            <p className="staff-booking-card__notes">{booking.notes}</p>
          ) : null}
        </div>
      </div>
      <div className="staff-booking-card__actions">
        {booking.status === 'pending' ? (
          <button
            type="button"
            className="staff-dashboard__btn staff-dashboard__btn--approve"
            disabled={isBusy}
            onClick={() => onApprove(booking.reference)}
          >
            {t('staff.dashboard.approveReservation')}
          </button>
        ) : null}
        {booking.status !== 'cancelled' ? (
          <button
            type="button"
            className="staff-dashboard__btn staff-dashboard__btn--cancel"
            disabled={isBusy}
            onClick={() => onApproveCancellation(booking.reference)}
          >
            {t('staff.dashboard.approveCancellation')}
          </button>
        ) : null}
      </div>
    </article>
  );
}
