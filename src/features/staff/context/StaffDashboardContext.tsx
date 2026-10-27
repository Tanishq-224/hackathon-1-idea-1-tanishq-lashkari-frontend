import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { meRequest, type AuthUser } from '../../../lib/api/authApi';
import { apiFetch } from '../../../lib/api/httpClient';
import type { BookingRecord, BookingStatus } from '../../booking/types/booking';
import type { ClosedDay, ServiceShift, StaffBookingStats } from '../lib/staffDashboardTypes';

type StaffDashboardContextValue = {
  session: AuthUser | null;
  bookings: BookingRecord[];
  stats: StaffBookingStats;
  shifts: ServiceShift[];
  closedDays: ClosedDay[];
  statusFilter: BookingStatus | 'all';
  setStatusFilter: (value: BookingStatus | 'all') => void;
  refreshDashboard: () => Promise<void>;
  updateBookingStatus: (reference: string, status: BookingStatus) => Promise<void>;
};

const StaffDashboardContext = createContext<StaffDashboardContextValue | null>(null);

type StaffDashboardProviderProps = {
  /** @description Dashboard section trees. */
  children: ReactNode;
};

/**
 * @description Loads staff dashboard data and exposes mutations to child views.
 * @param {StaffDashboardProviderProps} props - Provider props.
 * @returns {JSX.Element} Context provider.
 */
export function StaffDashboardProvider({ children }: StaffDashboardProviderProps) {
  const [session, setSession] = useState<AuthUser | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [shifts, setShifts] = useState<ServiceShift[]>([]);
  const [closedDays, setClosedDays] = useState<ClosedDay[]>([]);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [stats, setStats] = useState<StaffBookingStats>({
    pending: 0,
    confirmed: 0,
    cancellationRequested: 0,
    cancelled: 0,
    total: 0,
  });

  const refreshDashboard = useCallback(async () => {
    const query = statusFilter === 'all' ? '' : `?status=${encodeURIComponent(statusFilter)}`;
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
      cancellationRequested: statRow.cancellationRequested ?? 0,
      cancelled: statRow.cancelled ?? 0,
      total: statRow.total ?? 0,
    });
    setShifts(ops.shifts);
    setClosedDays(ops.closedDays);
    setSession(profile.user);
  }, [statusFilter]);

  useEffect(() => {
    void refreshDashboard();
  }, [refreshDashboard]);

  /**
   * @description PATCH booking status then reload dashboard rows.
   * @param {string} reference - Booking reference code.
   * @param {BookingStatus} status - Target lifecycle state.
   * @returns {Promise<void>}
   */
  const updateBookingStatus = useCallback(
    async (reference: string, status: BookingStatus) => {
      await apiFetch<BookingRecord>(`/booking/staff/reservations/${reference}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await refreshDashboard();
    },
    [refreshDashboard],
  );

  const value = useMemo(
    () => ({
      session,
      bookings,
      stats,
      shifts,
      closedDays,
      statusFilter,
      setStatusFilter,
      refreshDashboard,
      updateBookingStatus,
    }),
    [
      session,
      bookings,
      stats,
      shifts,
      closedDays,
      statusFilter,
      refreshDashboard,
      updateBookingStatus,
    ],
  );

  return (
    <StaffDashboardContext.Provider value={value}>{children}</StaffDashboardContext.Provider>
  );
}

/**
 * @description Access staff dashboard shared state.
 * @returns {StaffDashboardContextValue} Dashboard context value.
 * @throws {Error} When used outside {@link StaffDashboardProvider}.
 */
export function useStaffDashboard(): StaffDashboardContextValue {
  const ctx = useContext(StaffDashboardContext);
  if (!ctx) {
    throw new Error('useStaffDashboard must be used within StaffDashboardProvider');
  }
  return ctx;
}
