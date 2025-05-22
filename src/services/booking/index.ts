
import { supabase } from '@/integrations/supabase/client';
import { combineDateTime } from './dateUtils';
import { BookingData, BookingResult, Booking } from './types';
import { ClientInfo, getOrCreateClient } from './clientService';

// Re-export types
export type { BookingData, BookingResult, Booking, ClientInfo };
export * from './clientService';
export { combineDateTime } from './dateUtils';

// Creates a new booking
export const createBooking = async (bookingData: BookingData): Promise<BookingResult> => {
  const startTime = combineDateTime(bookingData.date, bookingData.time);
  
  // Calculate end time based on service duration (mock duration for now)
  const duration = 60; // Mock service duration in minutes
  const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
  
  try {
    // In a real app, this would save to a database
    const { data, error } = await supabase.from('reservations').insert({
      business_id: bookingData.businessId,
      service_id: bookingData.serviceId,
      client_first_name: bookingData.clientInfo.firstName,
      client_last_name: bookingData.clientInfo.lastName,
      client_email: bookingData.clientInfo.email,
      client_phone: bookingData.clientInfo.phone,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      notes: bookingData.notes,
      status: 'pending',
      service_name: bookingData.serviceName
    }).select().single();
    
    if (error) throw error;
    
    // Return booking result
    return {
      id: data.id,
      startTime: new Date(data.start_time),
      endTime: new Date(data.end_time),
      serviceId: data.service_id,
      serviceName: bookingData.serviceName,
      clientName: `${data.client_first_name} ${data.client_last_name}`,
      clientEmail: data.client_email,
      status: data.status
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
};

// Gets all bookings for a business
export const getAllBookings = async (businessId: string): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*, clients(*)')
      .eq('business_id', businessId)
      .order('start_time', { ascending: true });
      
    if (error) throw error;
    
    // Process the raw bookings to add derived fields
    const processedBookings: Booking[] = (data || []).map(booking => {
      // Add client field for compatibility
      const result: Booking = {
        ...booking,
        service_name: booking.service_name || "Service", // Ensure service_name is present
        client_first_name: booking.client_first_name || "",
        client_last_name: booking.client_last_name || "",
        client_email: booking.client_email || "",
        client_phone: booking.client_phone || "",
        serviceId: booking.service_id,
        client: {
          name: `${booking.client_first_name || ''} ${booking.client_last_name || ''}`.trim(),
          email: booking.client_email || '',
          phone: booking.client_phone || undefined
        }
      };
      
      // Add date and time fields from start_time
      if (booking.start_time) {
        const startTime = new Date(booking.start_time);
        result.date = startTime;
        result.time = startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      }
      
      return result;
    });
    
    return processedBookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

// Update booking status
export const updateBookingStatus = async (id: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating booking status:', error);
    return false;
  }
};

// Delete booking
export const deleteBooking = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting booking:', error);
    return false;
  }
};

// Re-export availability functions
export { 
  checkAvailability,
  getAvailableTimeSlots 
} from './availabilityService';
