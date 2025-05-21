
import { BookingResult, Booking } from './types';
import { ClientInfo } from './clientService';

// Store a booking in localStorage (fallback when database operations fail)
export const saveBookingToLocalStorage = (booking: {
  id: string;
  businessId: string;
  clientId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientNotes?: string;
}): void => {
  const storedBookings = localStorage.getItem('bookings');
  const bookings = storedBookings ? JSON.parse(storedBookings) : [];
  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
};

// Get bookings from localStorage (fallback when database retrieval fails)
export const getBookingsFromLocalStorage = (): Booking[] => {
  const storedBookings = localStorage.getItem('bookings');
  if (!storedBookings) return [];

  const parsedBookings = JSON.parse(storedBookings);
  return parsedBookings.map((booking: any) => {
    const startTime = new Date(booking.startTime);
    const bookingStatus = booking.status === 'confirmed' || booking.status === 'cancelled' || booking.status === 'pending' 
      ? booking.status 
      : 'pending';
    
    return {
      id: booking.id,
      date: startTime,
      time: `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`,
      status: bookingStatus as 'confirmed' | 'cancelled' | 'pending',
      serviceId: booking.serviceId,
      client: {
        name: booking.clientName || '',
        email: booking.clientEmail || '',
        phone: booking.clientPhone || undefined,
        notes: booking.clientNotes || undefined
      }
    };
  });
};

// Update a booking in localStorage
export const updateBookingStatusInLocalStorage = (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'pending'): boolean => {
  const storedBookings = localStorage.getItem('bookings');
  if (!storedBookings) return false;

  const bookings = JSON.parse(storedBookings);
  const updatedBookings = bookings.map((booking: any) => {
    if (booking.id === bookingId) {
      return { ...booking, status: newStatus };
    }
    return booking;
  });
  
  localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  return true;
};

// Delete a booking from localStorage
export const deleteBookingFromLocalStorage = (bookingId: string): boolean => {
  const storedBookings = localStorage.getItem('bookings');
  if (!storedBookings) return false;

  const bookings = JSON.parse(storedBookings);
  const filteredBookings = bookings.filter((booking: any) => booking.id !== bookingId);
  
  localStorage.setItem('bookings', JSON.stringify(filteredBookings));
  return true;
};
