
import { supabase } from '@/integrations/supabase/client';
import { combineDateTime } from './dateUtils';
import { BookingData, BookingResult, Booking } from './types';
import { ClientInfo } from './clientService';

// Re-export types
export type { BookingData, BookingResult, Booking, ClientInfo };
export * from './clientService';
export { combineDateTime } from './dateUtils';

// Creates a new booking
export const createBooking = async (bookingData: BookingData): Promise<BookingResult> => {
  const startTime = combineDateTime(bookingData.date, bookingData.time);
  
  // Calculate end time based on service duration
  const duration = bookingData.serviceDuration || 60;
  const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
  
  try {
    // Get client information
    const clientFirstName = bookingData.clientInfo.firstName;
    const clientLastName = bookingData.clientInfo.lastName;
    const clientEmail = bookingData.clientInfo.email;
    const clientPhone = bookingData.clientInfo.phone || '';
    
    // In a real app, this would save to a database
    const { data, error } = await supabase.from('reservations').insert({
      business_id: bookingData.businessId,
      service_id: bookingData.serviceId,
      service_name: bookingData.serviceName,
      client_first_name: clientFirstName,
      client_last_name: clientLastName,
      client_email: clientEmail,
      client_phone: clientPhone,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      notes: bookingData.notes,
      status: 'pending'
    }).select().single();
    
    if (error) throw error;
    
    if (!data) {
      throw new Error('Failed to create booking: No data returned');
    }
    
    // Return booking result
    return {
      id: data.id,
      startTime: new Date(data.start_time),
      endTime: new Date(data.end_time),
      serviceId: data.service_id,
      serviceName: bookingData.serviceName, // Use the serviceName from bookingData
      clientName: `${clientFirstName} ${clientLastName}`,
      clientEmail: clientEmail,
      status: data.status as 'confirmed' | 'cancelled' | 'pending'
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
};

// Gets all bookings for a business
export const getAllBookings = async (businessId: string): Promise<Booking[]> => {
  try {
    // Make sure we have the right fields in our query
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        business_id,
        service_id,
        service_name,
        client_id,
        client_first_name,
        client_last_name,
        client_email,
        client_phone,
        start_time,
        end_time,
        notes,
        status,
        created_at,
        updated_at
      `)
      .eq('business_id', businessId)
      .order('start_time', { ascending: true });
      
    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      console.log("No bookings found or invalid data format");
      return [];
    }
    
    // Process the raw bookings
    const processedBookings: Booking[] = data.map(booking => {
      // Create a booking object with proper fields and fallback values
      const result: Booking = {
        id: booking.id || "",
        business_id: booking.business_id || "",
        service_id: booking.service_id || "",
        service_name: booking.service_name || "Service",
        client_id: booking.client_id,
        client_first_name: booking.client_first_name || "",
        client_last_name: booking.client_last_name || "",
        client_email: booking.client_email || "",
        client_phone: booking.client_phone || "",
        start_time: booking.start_time || new Date().toISOString(),
        end_time: booking.end_time || new Date().toISOString(),
        notes: booking.notes || null,
        status: booking.status || "pending",
        created_at: booking.created_at || new Date().toISOString(),
        // Adding client property for compatibility
        client: {
          name: `${booking.client_first_name || ''} ${booking.client_last_name || ''}`.trim() || "Client",
          email: booking.client_email || '',
          phone: booking.client_phone || '',
          notes: booking.notes || ''
        }
      };
      
      // Add date and time fields from start_time
      if (booking.start_time) {
        const startTime = new Date(booking.start_time);
        result.date = startTime;
        result.time = startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      }
      
      // Add serviceId field for compatibility
      result.serviceId = booking.service_id;
      
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
