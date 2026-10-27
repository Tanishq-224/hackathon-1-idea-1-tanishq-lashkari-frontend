/**
 * @file bookingApi.ts
 * @description Frontend API client abstraction layer for Iturrieta Sagardotegia bookings.
 *
 * ARCHITECTURAL NOTICE (Milestone 1):
 * -----------------------------------------------------------------------------------
 * The Express backend currently exposes only baseline health endpoints.
 * This client provides a typed, isolated interface bridging the React UI with development
 * fixtures and browser storage, without pretending that real-time server APIs are already live.
 *
 * PROPOSED BACKEND API CONTRACT FOR MILESTONE 2:
 * -----------------------------------------------------------------------------------
 * 1. GET /api/v1/booking/areas
 *    Returns: { success: true, data: DiningArea[] }
 *
 * 2. GET /api/v1/booking/availability
 *    Query: ?date=YYYY-MM-DD&time=HH:mm&guests=number&areaId=string
 *    Returns: { success: true, data: TableWithAvailability[] }
 *
 * 3. POST /api/v1/booking/reservations
 *    Body: {
 *      date: string;
 *      time: string;
 *      slot: 'lunch' | 'dinner';
 *      areaId: string;
 *      tableId: string;
 *      guests: number;
 *      name: string;
 *      email: string;
 *      phone: string;
 *      notes?: string;
 *    }
 *    Returns: { success: true, data: BookingRecord }
 *    Errors: 409 Conflict if table already reserved for that slot
 * -----------------------------------------------------------------------------------
 */

import type {
  BookingRecord,
  CreateBookingInput,
  DiningArea,
  DiningAreaId,
  TableWithAvailability,
} from '../types/booking';
import { createBooking, getBookedTableIds } from './bookingStorage';
import {
  AREAS_FIXTURE,
  getTableAvailabilityFixture,
} from './fixtures';

/**
 * @description Fetches all available dining areas.
 * @returns {Promise<DiningArea[]>} List of dining areas.
 */
export async function fetchDiningAreas(): Promise<DiningArea[]> {
  // Simulates standard async request latency
  await new Promise((resolve) => setTimeout(resolve, 80));
  return [...AREAS_FIXTURE];
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
  // Simulates short network roundtrip
  await new Promise((resolve) => setTimeout(resolve, 120));

  const locallyBooked = getBookedTableIds(date, time);
  return getTableAvailabilityFixture(
    areaId,
    date,
    time,
    guests,
    selectedTableId,
    locallyBooked,
  );
}

/**
 * @description Submits a new booking request.
 * Persists locally and handles conflict validation.
 * @param {CreateBookingInput} input - Booking form values.
 * @returns {Promise<BookingRecord>} Created booking record.
 */
export async function submitBooking(
  input: CreateBookingInput,
): Promise<BookingRecord> {
  // Simulates submission latency
  await new Promise((resolve) => setTimeout(resolve, 350));

  // Conflict validation: check if table was already booked for this slot
  if (input.tableId && input.date && input.time) {
    const booked = getBookedTableIds(input.date, input.time);
    if (booked.has(input.tableId)) {
      throw new Error('This table was just reserved. Please select another table.');
    }
  }

  return createBooking(input);
}
