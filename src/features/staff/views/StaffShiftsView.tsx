import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BookingDatePicker } from '../../booking/components/BookingDatePicker';
import { useStaffDashboard } from '../context/StaffDashboardContext';
import { getTodayIsoDate } from '../lib/staffDateUtils';

/**
 * @description Staff shifts and closed-day management (live venue config).
 * @returns {JSX.Element} Shifts section.
 */
export function StaffShiftsView() {
  const { t } = useTranslation();
  const { shifts, closedDays } = useStaffDashboard();
  const [closedDate, setClosedDate] = useState('');
  const [closedReason, setClosedReason] = useState('');

  /**
   * @description Toggles shift availability (persist API pending).
   * @param {string} _shiftId - Shift identifier.
   * @param {boolean} _active - Whether shift accepts bookings.
   * @returns {void}
   */
  function handleShiftToggle(_shiftId: string, _active: boolean): void {
    // Shift writes will connect to admin API in a follow-up milestone.
  }

  /**
   * @description Handles closed-day form submit (persist API pending).
   * @param {React.FormEvent<HTMLFormElement>} event - Form event.
   * @returns {void}
   */
  function handleClosedDaySubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setClosedDate('');
    setClosedReason('');
  }

  return (
    <div className="staff-dashboard__page">
      <header className="staff-dashboard__page-head">
        <h1 className="staff-dashboard__page-title">{t('staff.dashboard.tabs.shifts')}</h1>
        <p className="staff-dashboard__page-lead">{t('staff.dashboard.shiftsPageLead')}</p>
      </header>

      <div className="staff-dashboard__panel-grid">
        <section className="staff-dashboard__panel">
          <h2 className="staff-dashboard__section-title">{t('staff.dashboard.shiftsTitle')}</h2>
          <p className="staff-dashboard__section-lead">{t('staff.dashboard.shiftsLead')}</p>
          {shifts.length === 0 ? (
            <p className="staff-dashboard__empty-state">{t('staff.dashboard.noShifts')}</p>
          ) : (
            <ul className="staff-shift-list">
              {shifts.map((shift) => (
                <li key={shift.id} className="staff-shift-list__item">
                  <div>
                    <p className="staff-shift-list__label">{shift.label}</p>
                    <p className="staff-shift-list__times">
                      {shift.startTime} – {shift.endTime} ·{' '}
                      {t('staff.dashboard.lastBooking', { time: shift.lastBookingTime })}
                    </p>
                  </div>
                  <label className="staff-shift-list__toggle">
                    <input
                      type="checkbox"
                      checked={shift.active}
                      onChange={(event) => handleShiftToggle(shift.id, event.target.checked)}
                    />
                    <span>
                      {shift.active
                        ? t('staff.dashboard.shiftOpen')
                        : t('staff.dashboard.shiftClosed')}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="staff-dashboard__panel">
          <h2 className="staff-dashboard__section-title">{t('staff.dashboard.closedDaysTitle')}</h2>
          <p className="staff-dashboard__section-lead">{t('staff.dashboard.closedDaysLead')}</p>
          <form className="staff-closed-form" onSubmit={handleClosedDaySubmit}>
            <BookingDatePicker
              label={t('staff.dashboard.closedDateLabel')}
              ariaLabel={t('staff.dashboard.closedDateLabel')}
              value={closedDate}
              min={getTodayIsoDate()}
              onChange={setClosedDate}
            />
            <label className="staff-closed-form__reason">
              <span>{t('staff.dashboard.closedReasonLabel')}</span>
              <input
                type="text"
                className="staff-dashboard__input"
                placeholder={t('staff.dashboard.closedReasonPlaceholder')}
                value={closedReason}
                onChange={(event) => setClosedReason(event.target.value)}
              />
            </label>
            <button type="submit" className="staff-dashboard__primary-btn" disabled={!closedDate}>
              {t('staff.dashboard.addClosedDay')}
            </button>
          </form>
          <ul className="staff-closed-list">
            {closedDays.length === 0 ? (
              <li className="staff-dashboard__empty-state">{t('staff.dashboard.noClosedDays')}</li>
            ) : (
              closedDays.map((day) => (
                <li key={day.date} className="staff-closed-list__item">
                  <strong>{day.date}</strong>
                  <span>{day.reason || t('staff.dashboard.closedDefaultReason')}</span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
