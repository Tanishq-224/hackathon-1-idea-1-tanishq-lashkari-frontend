import type {
  DiningArea,
  DiningAreaId,
  RestaurantTable,
  TableStatus,
  TableWithAvailability,
} from '../types/booking';

/**
 * @description Configured dining areas at Iturrieta Sagardotegia.
 * Isolated development fixtures reflecting actual cider house spaces.
 */
export const AREAS_FIXTURE: readonly DiningArea[] = [
  {
    id: 'restaurant',
    name: 'Restaurant (Indoor)',
    description: 'Traditional dining area',
    imageSrc: '/images/hero-cider-house-interior.jpg',
    imageAlt: 'Interior of Iturrieta traditional dining hall with wooden tables and cider barrels',
    tableCount: 12,
    capacityRange: '2 - 8 seats',
  },
  {
    id: 'open-space',
    name: 'Open Space',
    description: 'Outdoor seating with nature',
    imageSrc: '/images/hero-outdoor-terrace.jpg',
    imageAlt: 'Outdoor dining area surrounded by green orchard and fresh air',
    tableCount: 8,
    capacityRange: '2 - 6 seats',
  },
  {
    id: 'roof-terrace',
    name: 'Roof / Terrace',
    description: 'Open air with scenic views',
    imageSrc: '/images/banner-location-mountains.jpg',
    imageAlt: 'Scenic elevated terrace looking over the Aramaio valley and mountains',
    tableCount: 5,
    capacityRange: '2 - 8 seats',
  },
];

/**
 * @description Configured tables for each dining area.
 * Development fixture representing restaurant floor tables with realistic seating capacities.
 */
export const TABLES_FIXTURE: readonly RestaurantTable[] = [
  // Restaurant (Indoor) — 12 tables
  { id: 'R-1', areaId: 'restaurant', capacity: 2 },
  { id: 'R-2', areaId: 'restaurant', capacity: 4 },
  { id: 'R-3', areaId: 'restaurant', capacity: 4 },
  { id: 'R-4', areaId: 'restaurant', capacity: 6 },
  { id: 'R-5', areaId: 'restaurant', capacity: 6 },
  { id: 'R-6', areaId: 'restaurant', capacity: 8 },
  { id: 'R-7', areaId: 'restaurant', capacity: 4 },
  { id: 'R-8', areaId: 'restaurant', capacity: 4 },
  { id: 'R-9', areaId: 'restaurant', capacity: 6 },
  { id: 'R-10', areaId: 'restaurant', capacity: 8 },
  { id: 'R-11', areaId: 'restaurant', capacity: 2 },
  { id: 'R-12', areaId: 'restaurant', capacity: 4 },

  // Open Space — 8 tables
  { id: 'O-1', areaId: 'open-space', capacity: 2 },
  { id: 'O-2', areaId: 'open-space', capacity: 4 },
  { id: 'O-3', areaId: 'open-space', capacity: 4 },
  { id: 'O-4', areaId: 'open-space', capacity: 4 },
  { id: 'O-5', areaId: 'open-space', capacity: 6 },
  { id: 'O-6', areaId: 'open-space', capacity: 6 },
  { id: 'O-7', areaId: 'open-space', capacity: 2 },
  { id: 'O-8', areaId: 'open-space', capacity: 4 },

  // Roof / Terrace — 5 tables
  { id: 'RT-1', areaId: 'roof-terrace', capacity: 2 },
  { id: 'RT-2', areaId: 'roof-terrace', capacity: 4 },
  { id: 'RT-3', areaId: 'roof-terrace', capacity: 4 },
  { id: 'RT-4', areaId: 'roof-terrace', capacity: 6 },
  { id: 'RT-5', areaId: 'roof-terrace', capacity: 8 },
];

/** @description Standard available booking time slots (lunch & dinner). */
export const AVAILABLE_TIME_SLOTS = [
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '20:00',
  '20:30',
  '21:00',
] as const;

/**
 * @description Computes a deterministic hash from a string to generate stable mock statuses.
 * @param {string} seed - Input string.
 * @returns {number} Non-negative hash code.
 */
function deterministicHash(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * @description Computes table availability for a specific area, date, time and guest count.
 * Uses isolated development fixtures with deterministic availability modeling.
 *
 * PROPOSED BACKEND CONTRACT FOR MILESTONE 2:
 * -------------------------------------------------------------
 * GET /api/v1/booking/availability
 * Query params: ?date=YYYY-MM-DD&time=HH:mm&guests=N&areaId=restaurant
 * Response: {
 *   data: Array<{
 *     id: string;
 *     areaId: string;
 *     capacity: number;
 *     status: 'available' | 'booked' | 'unavailable';
 *   }>
 * }
 * -------------------------------------------------------------
 *
 * @param {DiningAreaId} areaId - Selected dining area.
 * @param {string} date - ISO date string (YYYY-MM-DD).
 * @param {string} time - Time string (HH:mm).
 * @param {number} guests - Number of guests.
 * @param {string | null} selectedTableId - Currently selected table ID.
 * @param {Set<string>} locallyBookedTableIds - Table IDs booked locally in this slot.
 * @returns {TableWithAvailability[]} Computed table availability list.
 */
export function getTableAvailabilityFixture(
  areaId: DiningAreaId,
  date: string,
  time: string,
  guests: number,
  selectedTableId: string | null = null,
  locallyBookedTableIds: Set<string> = new Set(),
): TableWithAvailability[] {
  const tablesForArea = TABLES_FIXTURE.filter((table) => table.areaId === areaId);

  return tablesForArea.map((table) => {
    // If user currently has this table selected
    if (selectedTableId && table.id === selectedTableId) {
      return { ...table, status: 'selected' as TableStatus };
    }

    // Capacity check: if party size exceeds table capacity, table cannot accommodate
    if (guests > table.capacity) {
      return { ...table, status: 'unavailable' as TableStatus };
    }

    // Check if table is booked in local storage for this date & time
    if (locallyBookedTableIds.has(table.id)) {
      return { ...table, status: 'booked' as TableStatus };
    }

    // Deterministic fixture mock pattern to mirror reference screenshot:
    // e.g. R-3 and R-8 booked, R-5 unavailable if guests > 6 or fixture booked
    const hash = deterministicHash(`${date}_${time}_${table.id}`);
    const isBookedSample = hash % 5 === 1; // ~20% tables booked
    const isUnavailableSample = hash % 13 === 0; // ~7% maintenance/unavailable

    if (isBookedSample) {
      return { ...table, status: 'booked' as TableStatus };
    }

    if (isUnavailableSample) {
      return { ...table, status: 'unavailable' as TableStatus };
    }

    return { ...table, status: 'available' as TableStatus };
  });
}
