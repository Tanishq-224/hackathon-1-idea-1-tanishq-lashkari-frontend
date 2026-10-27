import { Filter } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { BookingSelectOption } from '../../booking/components/BookingListSelect';
import { BookingListSelect } from '../../booking/components/BookingListSelect';
import type { BookingSlot, BookingStatus } from '../../booking/types/booking';
import { StaffBookingCard } from '../components/StaffBookingCard';
import { useStaffDashboard } from '../context/StaffDashboardContext';

/**
 * @description Staff reservations queue with live API data and approval actions.
 * @returns {JSX.Element} Bookings section.
 */
export function StaffBookingsView() {
  const { t } = useTranslation();
  const { bookings, stats, statusFilter, setStatusFilter, updateBookingStatus } =
    useStaffDashboard();
  const [busyReference, setBusyReference] = useState<string | null>(null);
  const [slotFilter, setSlotFilter] = useState<BookingSlot | 'all'>('all');

  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      if (slotFilter !== 'all' && item.slot !== slotFilter) {
        return false;
      }
      return true;
    });
  }, [bookings, statusFilter, slotFilter]);

  const filterOptions = useMemo((): BookingSelectOption[] => {
    return [
      { value: 'all', label: t('staff.dashboard.filterAll') },
      { value: 'pending', label: t('staff.dashboard.status.pending') },
      { value: 'confirmed', label: t('staff.dashboard.status.confirmed') },
      { value: 'cancelled', label: t('staff.dashboard.status.cancelled') },
    ];
  }, [t]);

  const filterLabel =
    filterOptions.find((option) => option.value === statusFilter)?.label ??
    t('staff.dashboard.filterAll');

  const slotOptions = useMemo((): BookingSelectOption[] => {
    return [
      { value: 'all', label: t('staff.dashboard.filterAllServices') },
      { value: 'lunch', label: t('staff.dashboard.slot.lunch') },
      { value: 'dinner', label: t('staff.dashboard.slot.dinner') },
    ];
  }, [t]);

  const slotLabel =
    slotOptions.find((option) => option.value === slotFilter)?.label ??
    t('staff.dashboard.filterAllServices');

  /**
   * @description Confirms a pending reservation.
   * @param {string} reference - Booking reference.
   * @returns {Promise<void>}
   */
  async function handleApprove(reference: string): Promise<void> {
    setBusyReference(reference);
    try {
      await updateBookingStatus(reference, 'confirmed');
    } finally {
      setBusyReference(null);
    }
  }

  /**
   * @description Staff-approved cancellation for active bookings.
   * @param {string} reference - Booking reference.
   * @returns {Promise<void>}
   */
  async function handleApproveCancellation(reference: string): Promise<void> {
    const ok = window.confirm(t('staff.dashboard.confirmCancelPrompt'));
    if (!ok) {
      return;
    }
    setBusyReference(reference);
    try {
      await updateBookingStatus(reference, 'cancelled');
    } finally {
      setBusyReference(null);
    }
  }

  return (
    <div className="staff-dashboard__page">
      <header className="staff-dashboard__page-head">
        <h1 className="staff-dashboard__page-title">{t('staff.dashboard.bookingsTitle')}</h1>
        <p className="staff-dashboard__page-lead">{t('staff.dashboard.bookingsLead')}</p>
      </header>

      <div className="staff-dashboard__kpi-row">
        <div className="staff-dashboard__kpi staff-dashboard__kpi--pending">
          <span className="staff-dashboard__kpi-label">{t('staff.dashboard.stats.pending')}</span>
          <span className="staff-dashboard__kpi-value">{stats.pending}</span>
        </div>
        <div className="staff-dashboard__kpi staff-dashboard__kpi--confirmed">
          <span className="staff-dashboard__kpi-label">{t('staff.dashboard.stats.confirmed')}</span>
          <span className="staff-dashboard__kpi-value">{stats.confirmed}</span>
        </div>
        <div className="staff-dashboard__kpi staff-dashboard__kpi--cancelled">
          <span className="staff-dashboard__kpi-label">{t('staff.dashboard.stats.cancelled')}</span>
          <span className="staff-dashboard__kpi-value">{stats.cancelled}</span>
        </div>
        <div className="staff-dashboard__kpi">
          <span className="staff-dashboard__kpi-label">{t('staff.dashboard.stats.total')}</span>
          <span className="staff-dashboard__kpi-value">{stats.total}</span>
        </div>
      </div>

      <div className="staff-dashboard__toolbar">
        <BookingListSelect
          label={t('staff.dashboard.filterStatus')}
          ariaLabel={t('staff.dashboard.filterStatus')}
          value={statusFilter}
          displayValue={filterLabel}
          icon={Filter}
          options={filterOptions}
          onChange={(value) => setStatusFilter(value as BookingStatus | 'all')}
        />
        <BookingListSelect
          label={t('staff.dashboard.filterService')}
          ariaLabel={t('staff.dashboard.filterService')}
          value={slotFilter}
          displayValue={slotLabel}
          icon={Filter}
          options={slotOptions}
          onChange={(value) => setSlotFilter(value as BookingSlot | 'all')}
        />
        <p className="staff-dashboard__toolbar-hint">
          {t('staff.dashboard.queueCount', { count: filteredBookings.length })}
        </p>
      </div>

      <section className="staff-dashboard__panel staff-dashboard__panel--flush" aria-live="polite">
        {filteredBookings.length === 0 ? (
          <p className="staff-dashboard__empty-state">{t('staff.dashboard.noBookings')}</p>
        ) : (
          <ul className="staff-booking-list">
            {filteredBookings.map((booking) => (
              <li key={booking.reference}>
                <StaffBookingCard
                  booking={booking}
                  busyReference={busyReference}
                  onApprove={(ref) => void handleApprove(ref)}
                  onApproveCancellation={(ref) => void handleApproveCancellation(ref)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
