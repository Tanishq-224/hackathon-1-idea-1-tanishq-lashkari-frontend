import type { BookingRecord, CreateBookingInput } from '../types/booking';

const STORAGE_KEY = 'iturrieta-bookings';

/**
 * @description Reads all stored bookings from localStorage.
 * @returns {BookingRecord[]} Parsed booking list.
 */
function readAll(): BookingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as BookingRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * @description Persists the booking list to localStorage.
 * @param {BookingRecord[]} records - Bookings to store.
 * @returns {void}
 */
function writeAll(records: BookingRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/**
 * @description Builds a human-friendly booking reference code.
 * @returns {string} Reference such as ITU-A1B2C3.
 */
function createReference(): string {
  const token = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ITU-${token}`;
}

/**
 * @description Saves a new pending booking locally.
 * @param {CreateBookingInput} input - Guest form values.
 * @returns {BookingRecord} Stored booking with reference.
 */
export function createBooking(input: CreateBookingInput): BookingRecord {
  const record: BookingRecord = {
    ...input,
    reference: createReference(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  const next = [...readAll(), record];
  writeAll(next);
  return record;
}

/**
 * @description Finds a booking by reference and email (case-insensitive email).
 * @param {string} reference - Booking reference code.
 * @param {string} email - Guest email used when booking.
 * @returns {BookingRecord | null} Matching record or null.
 */
export function findBooking(reference: string, email: string): BookingRecord | null {
  const normalizedRef = reference.trim().toUpperCase();
  const normalizedEmail = email.trim().toLowerCase();
  return (
    readAll().find(
      (item) =>
        item.reference === normalizedRef &&
        item.email.toLowerCase() === normalizedEmail,
    ) ?? null
  );
}

/**
 * @description Marks a booking as cancelled when the guest requests it.
 * @param {string} reference - Booking reference code.
 * @param {string} email - Guest email used when booking.
 * @returns {BookingRecord | null} Updated record or null if not found.
 */
export function cancelBooking(
  reference: string,
  email: string,
): BookingRecord | null {
  const all = readAll();
  const index = all.findIndex(
    (item) =>
      item.reference === reference.trim().toUpperCase() &&
      item.email.trim().toLowerCase() === email.trim().toLowerCase(),
  );
  if (index < 0) {
    return null;
  }
  const updated: BookingRecord = { ...all[index], status: 'cancelled' };
  all[index] = updated;
  writeAll(all);
  return updated;
}
