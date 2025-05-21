
// Re-export everything from the individual modules
export { checkAvailability, getAvailableTimeSlots } from './availabilityService';
export { getOrCreateClient, type ClientInfo } from './clientService';
export { combineDateTime } from './dateUtils';
export { createBooking, getAllBookings, updateBookingStatus, deleteBooking } from './bookingOperations';
export type { BookingData, BookingResult, Booking } from './types';
