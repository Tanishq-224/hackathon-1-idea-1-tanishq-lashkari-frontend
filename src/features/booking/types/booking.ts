/** @description Meal service window for a booking request. */
export type BookingSlot = 'lunch' | 'dinner';

/** @description Lifecycle state stored until staff confirms via phone. */
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

/** @description Supported dining areas at Iturrieta Sagardotegia. */
export type DiningAreaId = 'restaurant' | 'open-space' | 'roof-terrace';

/** @description Dining area configuration. */
export interface DiningArea {
  id: DiningAreaId;
  name: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  tableCount: number;
  capacityRange: string;
}

/** @description Availability state for a table given a specific date, time, and guest count. */
export type TableStatus = 'available' | 'selected' | 'booked' | 'unavailable';

/** @description Structural restaurant table definition. */
export interface RestaurantTable {
  id: string; // e.g. 'R-1', 'O-2', 'RT-3'
  areaId: DiningAreaId;
  capacity: number;
  label?: string;
}

/** @description Table with computed availability status. */
export interface TableWithAvailability extends RestaurantTable {
  status: TableStatus;
}

/** @description Active selection state across the reservation flow. */
export interface BookingSelection {
  date: string;
  time: string;
  guests: number;
  areaId: DiningAreaId;
  tableId: string | null;
}

/** @description Guest booking record persisted locally until API exists. */
export type BookingRecord = {
  reference: string;
  date: string;
  slot: BookingSlot;
  time?: string;
  guests: number;
  busGuests: number;
  areaId?: DiningAreaId;
  tableId?: string;
  tableName?: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
};

/** @description Payload required to create a new booking request. */
export type CreateBookingInput = Omit<
  BookingRecord,
  'reference' | 'status' | 'createdAt'
>;

