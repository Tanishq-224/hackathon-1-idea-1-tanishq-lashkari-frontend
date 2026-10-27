import type { BookingStatus } from '../../booking/types/booking';

/**
 * @description Maps booking status to badge CSS modifier token.
 * @param {BookingStatus} status - Booking lifecycle state.
 * @returns {string} Modifier suffix for staff-dashboard badge classes.
 */
export function bookingStatusModifier(status: BookingStatus): string {
  if (status === 'confirmed') {
    return 'confirmed';
  }
  if (status === 'cancelled') {
    return 'cancelled';
  }
  return 'pending';
}
