const SHIFTS_KEY = 'iturrieta-service-shifts';
const CLOSED_KEY = 'iturrieta-closed-days';

/** @description Lunch or dinner service window for floor planning. */
export type ServiceShift = {
  id: string;
  label: string;
  service: 'lunch' | 'dinner';
  startTime: string;
  endTime: string;
  lastBookingTime: string;
  active: boolean;
};

/** @description Date the cider house is closed to bookings. */
export type ClosedDay = {
  date: string;
  reason: string;
};

const DEFAULT_SHIFTS: ServiceShift[] = [
  {
    id: 'lunch-weekend',
    label: 'Lunch (Thu–Sun)',
    service: 'lunch',
    startTime: '13:00',
    endTime: '16:00',
    lastBookingTime: '14:30',
    active: true,
  },
  {
    id: 'dinner-arranged',
    label: 'Dinner (by arrangement)',
    service: 'dinner',
    startTime: '20:00',
    endTime: '23:30',
    lastBookingTime: '21:00',
    active: true,
  },
];

/**
 * @description Loads service shifts, seeding defaults when empty.
 * @returns {ServiceShift[]} Shift configuration.
 */
export function listServiceShifts(): ServiceShift[] {
  try {
    const raw = localStorage.getItem(SHIFTS_KEY);
    if (!raw) {
      localStorage.setItem(SHIFTS_KEY, JSON.stringify(DEFAULT_SHIFTS));
      return [...DEFAULT_SHIFTS];
    }
    const parsed = JSON.parse(raw) as ServiceShift[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...DEFAULT_SHIFTS];
  } catch {
    return [...DEFAULT_SHIFTS];
  }
}

/**
 * @description Toggles whether a shift accepts new bookings.
 * @param {string} shiftId - Shift identifier.
 * @param {boolean} active - New active flag.
 * @returns {ServiceShift[]} Updated shift list.
 */
export function setShiftActive(shiftId: string, active: boolean): ServiceShift[] {
  const next = listServiceShifts().map((shift) =>
    shift.id === shiftId ? { ...shift, active } : shift,
  );
  localStorage.setItem(SHIFTS_KEY, JSON.stringify(next));
  return next;
}

/**
 * @description Reads closed-day overrides.
 * @returns {ClosedDay[]} Closed dates.
 */
export function listClosedDays(): ClosedDay[] {
  try {
    const raw = localStorage.getItem(CLOSED_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as ClosedDay[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * @description Adds or replaces a closed day entry.
 * @param {ClosedDay} entry - Date and reason.
 * @returns {ClosedDay[]} Updated list.
 */
export function upsertClosedDay(entry: ClosedDay): ClosedDay[] {
  const filtered = listClosedDays().filter((day) => day.date !== entry.date);
  const next = [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(CLOSED_KEY, JSON.stringify(next));
  return next;
}
