import type { BookingRecord, BookingStatus } from '../../booking/types/booking';

/** @description Lunch or dinner service window for staff operations. */
export type ServiceShift = {
  id: string;
  label: string;
  service: 'lunch' | 'dinner';
  startTime: string;
  endTime: string;
  lastBookingTime: string;
  active: boolean;
};

/** @description Calendar day blocked from public booking. */
export type ClosedDay = { date: string; reason: string };

/** @description Aggregate booking counts for dashboard stats. */
export type StaffBookingStats = {
  pending: number;
  confirmed: number;
  cancelled: number;
  total: number;
};

/** @description Staff dashboard section route keys. */
export type StaffDashboardSection = 'bookings' | 'shifts' | 'floor' | 'profile';

export type { BookingRecord, BookingStatus };
