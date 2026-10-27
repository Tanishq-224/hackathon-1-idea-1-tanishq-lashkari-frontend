/**
 * @file bookingApi.ts
 * @description Frontend API client for Iturrieta bookings (persistent backend).
 */

import { apiFetch } from '../../../lib/api/httpClient';
import type {
  BookingRecord,
  CreateBookingInput,
  DiningArea,
  DiningAreaId,
  TableStatus,
  TableWithAvailability,
} from '../types/booking';

type ApiTable = {
  id: string;
  areaId: string;
  capacity: number;
  label?: string;
  status: TableStatus;
};

/**
 * @description Fetches all available dining areas from API.
 * @returns {Promise<DiningArea[]>} List of dining areas.
 */
export async function fetchDiningAreas(): Promise<DiningArea[]> {
  return apiFetch<DiningArea[]>('/booking/areas');
}

/**
 * @description Fetches table availability for a specific area, date, time and party size.
 * @param {DiningAreaId} areaId - Selected dining area.
 * @param {string} date - Date in YYYY-MM-DD format.
 * @param {string} time - Time in HH:mm format.
 * @param {number} guests - Number of guests.
 * @param {string | null} selectedTableId - ID of currently selected table if any.
 * @returns {Promise<TableWithAvailability[]>} Table status list.
 */
export async function fetchTableAvailability(
  areaId: DiningAreaId,
  date: string,
  time: string,
  guests: number,
  selectedTableId: string | null = null,
): Promise<TableWithAvailability[]> {
  const params = new URLSearchParams({
    areaId,
    date,
    time,
    guests: String(guests),
  });
  const rows = await apiFetch<ApiTable[]>(`/booking/availability?${params.toString()}`);
  return rows.map((table) => ({
    id: table.id,
    areaId: table.areaId as DiningAreaId,
    capacity: table.capacity,
    label: table.label,
    status:
      selectedTableId && table.id === selectedTableId
        ? ('selected' as TableStatus)
        : table.status,
  }));
}

/**
 * @description Submits a new booking request to the API.
 * @param {CreateBookingInput} input - Booking form values.
 * @returns {Promise<BookingRecord>} Created booking record.
 */
export async function submitBooking(input: CreateBookingInput): Promise<BookingRecord> {
  return apiFetch<BookingRecord>('/booking/reservations', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * @description Looks up a booking by reference and email.
 * @param {string} reference - Booking reference.
 * @param {string} email - Guest email.
 * @returns {Promise<BookingRecord>} Booking record.
 */
export async function lookupBookingApi(reference: string, email: string): Promise<BookingRecord> {
  return apiFetch<BookingRecord>('/booking/lookup', {
    method: 'POST',
    body: JSON.stringify({ reference, email }),
  });
}

/**
 * @description Cancels a booking via API.
 * @param {string} reference - Booking reference.
 * @param {string} email - Guest email.
 * @returns {Promise<BookingRecord>} Updated booking.
 */
export async function cancelBookingApi(reference: string, email: string): Promise<BookingRecord> {
  return apiFetch<BookingRecord>('/booking/cancel', {
    method: 'POST',
    body: JSON.stringify({ reference, email }),
  });
}
