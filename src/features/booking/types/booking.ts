/** @description Meal service window for a booking request. */
export type BookingSlot = 'lunch' | 'dinner';

/** @description Lifecycle state stored until staff confirms via phone. */
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

/** @description Guest booking record persisted locally until API exists. */
export type BookingRecord = {
  reference: string;
  date: string;
  slot: BookingSlot;
  guests: number;
  busGuests: number;
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
