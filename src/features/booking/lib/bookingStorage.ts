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

/**
 * @description Retrieves table IDs that have an active (non-cancelled) booking on a given date and time.
 * @param {string} date - Booking date (YYYY-MM-DD).
 * @param {string} [time] - Optional booking time (HH:mm).
 * @returns {Set<string>} Set of booked table IDs.
 */
/**
 * @description Returns every booking stored locally (newest first).
 * @returns {BookingRecord[]} All booking records.
 */
export function listBookings(): BookingRecord[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/**
 * @description Updates booking status by reference (staff dashboard).
 * @param {string} reference - Booking reference code.
 * @param {BookingRecord['status']} status - New lifecycle status.
 * @returns {BookingRecord | null} Updated record or null if missing.
 */
export function updateBookingStatus(
  reference: string,
  status: BookingRecord['status'],
): BookingRecord | null {
  const all = readAll();
  const index = all.findIndex(
    (item) => item.reference === reference.trim().toUpperCase(),
  );
  if (index < 0) {
    return null;
  }
  const updated: BookingRecord = { ...all[index], status };
  all[index] = updated;
  writeAll(all);
  return updated;
}

/**
 * @description Seeds demo bookings when storage is empty (staff dashboard preview).
 * @returns {void}
 */
export function seedDemoBookingsIfEmpty(): void {
  if (readAll().length > 0) {
    return;
  }
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const fmt = (date: Date) => date.toISOString().slice(0, 10);

  const demos: BookingRecord[] = [
    {
      reference: 'ITU-DEMO01',
      date: fmt(today),
      slot: 'lunch',
      time: '13:30',
      guests: 4,
      busGuests: 0,
      areaId: 'restaurant',
      tableId: 'R-2',
      tableName: 'R-2',
      name: 'Ane Mendizabal',
      email: 'ane@example.com',
      phone: '+34 600 111 222',
      notes: 'Txotx experience',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      reference: 'ITU-DEMO02',
      date: fmt(today),
      slot: 'dinner',
      time: '21:00',
      guests: 6,
      busGuests: 12,
      areaId: 'open-space',
      tableId: 'O-5',
      tableName: 'O-5',
      name: 'Jon Etxeberria',
      email: 'jon@example.com',
      phone: '+34 600 333 444',
      notes: 'Company dinner',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600_000).toISOString(),
    },
    {
      reference: 'ITU-DEMO03',
      date: fmt(tomorrow),
      slot: 'lunch',
      time: '14:00',
      guests: 2,
      busGuests: 0,
      areaId: 'roof-terrace',
      tableId: 'RT-1',
      tableName: 'RT-1',
      name: 'Maite Agirre',
      email: 'maite@example.com',
      phone: '+34 600 555 666',
      notes: '',
      status: 'cancelled',
      createdAt: new Date(Date.now() - 86400_000).toISOString(),
    },
  ];
  writeAll(demos);
}

export function getBookedTableIds(date: string, time?: string): Set<string> {
  const all = readAll();
  const bookedIds = new Set<string>();

  for (const item of all) {
    if (item.status === 'cancelled') {
      continue;
    }
    if (item.date !== date) {
      continue;
    }
    if (time && item.time && item.time !== time) {
      continue;
    }
    if (item.tableId) {
      bookedIds.add(item.tableId);
    }
  }

  return bookedIds;
}
