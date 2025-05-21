
// Re-export everything from the booking module
export { 
  createBooking, 
  getAllBookings, 
  updateBookingStatus, 
  deleteBooking,
  checkAvailability,
  getAvailableTimeSlots,
  combineDateTime,
  type ClientInfo,
  type BookingData,
  type BookingResult,
  type Booking
} from './booking';
