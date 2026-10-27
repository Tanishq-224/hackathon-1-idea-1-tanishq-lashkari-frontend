import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { logoutRequest, meRequest, type AuthUser } from '../../lib/api/authApi';
import { apiFetch } from '../../lib/api/httpClient';
import type { BookingRecord, BookingStatus } from '../booking/types/booking';
import { AREAS_FIXTURE, TABLES_FIXTURE } from '../booking/lib/fixtures';

type ServiceShift = {
  id: string;
  label: string;
  service: 'lunch' | 'dinner';
  startTime: string;
  endTime: string;
  lastBookingTime: string;
  active: boolean;
};

type ClosedDay = { date: string; reason: string };
import './StaffDashboardPage.css';

type DashboardTab = 'bookings' | 'shifts' | 'floor';

/**
 * @description Maps booking status to badge class suffix.
 * @param {BookingStatus} status - Booking lifecycle state.
 * @returns {string} Modifier token.
 */
function statusModifier(status: BookingStatus): string {
  if (status === 'confirmed') {
    return 'confirmed';
  }
  if (status === 'cancelled') {
    return 'cancelled';
  }
  return 'pending';
}

/**
 * @description Staff operations dashboard for bookings, shifts, and floor overview.
 * @returns {JSX.Element} Dashboard page.
 */
export function StaffDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [session, setSession] = useState<AuthUser | null>(null);
  const [tab, setTab] = useState<DashboardTab>('bookings');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [shifts, setShifts] = useState<ServiceShift[]>([]);
  const [closedDays, setClosedDays] = useState<ClosedDay[]>([]);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [closedDate, setClosedDate] = useState('');
  const [closedReason, setClosedReason] = useState('');

  const [stats, setStats] = useState({ pending: 0, confirmed: 0, cancelled: 0, total: 0 });

  const refreshBookings = useCallback(async () => {
    const query =
      statusFilter === 'all' ? '' : `?status=${encodeURIComponent(statusFilter)}`;
    const [rows, statRow, ops, profile] = await Promise.all([
      apiFetch<BookingRecord[]>(`/booking/staff/reservations${query}`),
      apiFetch<Record<string, number>>('/booking/staff/stats'),
      apiFetch<{ shifts: ServiceShift[]; closedDays: ClosedDay[] }>('/booking/staff/operations'),
      meRequest(),
    ]);
    setBookings(rows);
    setStats({
      pending: statRow.pending ?? 0,
      confirmed: statRow.confirmed ?? 0,
      cancelled: statRow.cancelled ?? 0,
      total: statRow.total ?? 0,
    });
    setShifts(ops.shifts);
    setClosedDays(ops.closedDays);
    setSession(profile.user);
  }, [statusFilter]);

  useEffect(() => {
    void refreshBookings();
  }, [refreshBookings]);

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'all') {
      return bookings;
    }
    return bookings.filter((item) => item.status === statusFilter);
  }, [bookings, statusFilter]);

  /**
   * @description Signs the staff member out and returns to login.
   * @returns {void}
   */
  async function handleLogout() {
    await logoutRequest();
    navigate('/staff/login', { replace: true });
  }

  /**
   * @description Updates a booking row status from staff actions.
   * @param {string} reference - Booking reference.
   * @param {BookingStatus} status - Target status.
   * @returns {void}
   */
  async function handleStatusChange(reference: string, status: BookingStatus) {
    await apiFetch<BookingRecord>(`/booking/staff/reservations/${reference}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    await refreshBookings();
  }

  /**
   * @description Toggles shift availability for new bookings.
   * @param {string} shiftId - Shift id.
   * @param {boolean} active - Whether shift is open.
   * @returns {void}
   */
  function handleShiftToggle(_shiftId: string, _active: boolean) {
    // Shift writes will connect to admin API in a follow-up milestone.
  }

  /**
   * @description Adds a closed day from the shifts panel form.
   * @param {React.FormEvent<HTMLFormElement>} event - Form submit.
   * @returns {void}
   */
  function handleClosedDaySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Closed-day writes will connect to admin API in a follow-up milestone.
    setClosedDate('');
    setClosedReason('');
  }

  return (
    <div className="staff-dashboard min-h-dvh bg-ivory">
      <header className="staff-dashboard__header">
        <div className="staff-dashboard__header-inner">
          <div>
            <p className="staff-dashboard__eyebrow">{t('staff.dashboard.eyebrow')}</p>
            <h1 className="font-display text-2xl font-semibold text-charcoal md:text-3xl">
              {t('staff.dashboard.title')}
            </h1>
            {session ? (
              <p className="mt-1 text-sm text-charcoal/65">
                {t('staff.dashboard.signedInAs', { name: session.name })}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/reserve" className="staff-dashboard__ghost-btn">
              {t('staff.dashboard.publicBooking')}
            </Link>
            <button type="button" className="staff-dashboard__ghost-btn" onClick={handleLogout}>
              {t('staff.auth.signOut')}
            </button>
          </div>
        </div>
      </header>

      <main className="staff-dashboard__main">
        <div className="staff-dashboard__stats">
          <article className="staff-dashboard__stat">
            <p className="staff-dashboard__stat-label">{t('staff.dashboard.stats.pending')}</p>
            <p className="staff-dashboard__stat-value">{stats.pending}</p>
          </article>
          <article className="staff-dashboard__stat">
            <p className="staff-dashboard__stat-label">{t('staff.dashboard.stats.confirmed')}</p>
            <p className="staff-dashboard__stat-value">{stats.confirmed}</p>
          </article>
          <article className="staff-dashboard__stat">
            <p className="staff-dashboard__stat-label">{t('staff.dashboard.stats.cancelled')}</p>
            <p className="staff-dashboard__stat-value">{stats.cancelled}</p>
          </article>
          <article className="staff-dashboard__stat">
            <p className="staff-dashboard__stat-label">{t('staff.dashboard.stats.total')}</p>
            <p className="staff-dashboard__stat-value">{stats.total}</p>
          </article>
        </div>

        <div className="staff-dashboard__tabs" role="tablist" aria-label={t('staff.dashboard.tabsLabel')}>
          {(['bookings', 'shifts', 'floor'] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={tab === key ? 'staff-dashboard__tab staff-dashboard__tab--active' : 'staff-dashboard__tab'}
              onClick={() => setTab(key)}
            >
              {t(`staff.dashboard.tabs.${key}`)}
            </button>
          ))}
        </div>

        {tab === 'bookings' ? (
          <section className="staff-dashboard__panel" aria-labelledby="staff-bookings-heading">
            <div className="staff-dashboard__panel-head">
              <h2 id="staff-bookings-heading" className="font-display text-xl font-semibold">
                {t('staff.dashboard.bookingsTitle')}
              </h2>
              <label className="text-sm text-charcoal/70">
                {t('staff.dashboard.filterStatus')}
                <select
                  className="staff-dashboard__select ml-2"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as BookingStatus | 'all')
                  }
                >
                  <option value="all">{t('staff.dashboard.filterAll')}</option>
                  <option value="pending">{t('staff.dashboard.status.pending')}</option>
                  <option value="confirmed">{t('staff.dashboard.status.confirmed')}</option>
                  <option value="cancelled">{t('staff.dashboard.status.cancelled')}</option>
                </select>
              </label>
            </div>

            <div className="staff-dashboard__table-wrap">
              <table className="staff-dashboard__table">
                <thead>
                  <tr>
                    <th scope="col">{t('staff.dashboard.table.reference')}</th>
                    <th scope="col">{t('staff.dashboard.table.guest')}</th>
                    <th scope="col">{t('staff.dashboard.table.when')}</th>
                    <th scope="col">{t('staff.dashboard.table.table')}</th>
                    <th scope="col">{t('staff.dashboard.table.status')}</th>
                    <th scope="col">{t('staff.dashboard.table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="staff-dashboard__empty">
                        {t('staff.dashboard.noBookings')}
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.reference}>
                        <td>{booking.reference}</td>
                        <td>
                          <strong>{booking.name}</strong>
                          <br />
                          <span className="text-xs text-charcoal/65">{booking.email}</span>
                        </td>
                        <td>
                          {booking.date}
                          {booking.time ? ` · ${booking.time}` : ''}
                          <br />
                          <span className="text-xs text-charcoal/65">
                            {booking.guests} {t('staff.dashboard.guests')}
                          </span>
                        </td>
                        <td>
                          {booking.tableId ?? '—'}
                          {booking.areaId ? (
                            <>
                              <br />
                              <span className="text-xs text-charcoal/65">{booking.areaId}</span>
                            </>
                          ) : null}
                        </td>
                        <td>
                          <span
                            className={`staff-dashboard__badge staff-dashboard__badge--${statusModifier(booking.status)}`}
                          >
                            {t(`staff.dashboard.status.${booking.status}`)}
                          </span>
                        </td>
                        <td>
                          <div className="staff-dashboard__actions">
                            {booking.status !== 'confirmed' ? (
                              <button
                                type="button"
                                className="staff-dashboard__action staff-dashboard__action--confirm"
                                onClick={() => handleStatusChange(booking.reference, 'confirmed')}
                              >
                                {t('staff.dashboard.confirm')}
                              </button>
                            ) : null}
                            {booking.status !== 'cancelled' ? (
                              <button
                                type="button"
                                className="staff-dashboard__action staff-dashboard__action--cancel"
                                onClick={() => handleStatusChange(booking.reference, 'cancelled')}
                              >
                                {t('staff.dashboard.cancel')}
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {tab === 'shifts' ? (
          <section className="staff-dashboard__panel staff-dashboard__panel--grid">
            <div>
              <h2 className="font-display text-xl font-semibold">{t('staff.dashboard.shiftsTitle')}</h2>
              <p className="mt-2 text-sm text-charcoal/70">{t('staff.dashboard.shiftsLead')}</p>
              <ul className="mt-6 space-y-4">
                {shifts.map((shift) => (
                  <li key={shift.id} className="staff-dashboard__shift-card">
                    <div>
                      <p className="font-medium">{shift.label}</p>
                      <p className="mt-1 text-sm text-charcoal/70">
                        {shift.startTime} – {shift.endTime} ·{' '}
                        {t('staff.dashboard.lastBooking', { time: shift.lastBookingTime })}
                      </p>
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={shift.active}
                        onChange={(event) => handleShiftToggle(shift.id, event.target.checked)}
                      />
                      {shift.active
                        ? t('staff.dashboard.shiftOpen')
                        : t('staff.dashboard.shiftClosed')}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">{t('staff.dashboard.closedDaysTitle')}</h2>
              <p className="mt-2 text-sm text-charcoal/70">{t('staff.dashboard.closedDaysLead')}</p>
              <form className="mt-4 space-y-3" onSubmit={handleClosedDaySubmit}>
                <input
                  type="date"
                  className="staff-dashboard__input"
                  value={closedDate}
                  onChange={(event) => setClosedDate(event.target.value)}
                  required
                />
                <input
                  type="text"
                  className="staff-dashboard__input"
                  placeholder={t('staff.dashboard.closedReasonPlaceholder')}
                  value={closedReason}
                  onChange={(event) => setClosedReason(event.target.value)}
                />
                <button type="submit" className="staff-dashboard__primary-btn">
                  {t('staff.dashboard.addClosedDay')}
                </button>
              </form>
              <ul className="mt-6 space-y-2 text-sm">
                {closedDays.length === 0 ? (
                  <li className="text-charcoal/60">{t('staff.dashboard.noClosedDays')}</li>
                ) : (
                  closedDays.map((day) => (
                    <li key={day.date} className="staff-dashboard__closed-row">
                      <strong>{day.date}</strong> — {day.reason}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </section>
        ) : null}

        {tab === 'floor' ? (
          <section className="staff-dashboard__panel">
            <h2 className="font-display text-xl font-semibold">{t('staff.dashboard.floorTitle')}</h2>
            <p className="mt-2 max-w-2xl text-sm text-charcoal/70">{t('staff.dashboard.floorLead')}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {AREAS_FIXTURE.map((area) => {
                const tables = TABLES_FIXTURE.filter((table) => table.areaId === area.id);
                const bookedToday = bookings.filter(
                  (item) =>
                    item.areaId === area.id &&
                    item.status !== 'cancelled' &&
                    item.date === new Date().toISOString().slice(0, 10),
                ).length;
                return (
                  <article key={area.id} className="staff-dashboard__area-card">
                    <h3 className="font-display text-lg font-semibold">{area.name}</h3>
                    <p className="mt-2 text-sm text-charcoal/70">{area.description}</p>
                    <dl className="mt-4 space-y-1 text-sm">
                      <div className="flex justify-between gap-3">
                        <dt>{t('staff.dashboard.floorTables')}</dt>
                        <dd>{tables.length}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt>{t('staff.dashboard.floorBookedToday')}</dt>
                        <dd>{bookedToday}</dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
