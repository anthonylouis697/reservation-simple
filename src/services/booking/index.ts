
import { supabase } from '@/integrations/supabase/client';
import { combineDateTime } from './dateUtils';

// Types for client information
export interface ClientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Types for booking data
export interface BookingData {
  serviceId: string;
  serviceName: string;
  date: Date;
  time: string;  
  clientInfo: ClientInfo;
  notes?: string;
  businessId: string;
}

// Type for booking result
export interface BookingResult {
  id: string;
  startTime: Date;
  endTime: Date;
  serviceName: string;
  clientName: string;
  status: string;
}

// Type for booking record
export interface Booking {
  id: string;
  business_id: string;
  service_id: string;
  service_name: string;
  client_id?: string | null;
  client_first_name: string;
  client_last_name: string;
  client_email: string;
  client_phone: string;
  start_time: string;
  end_time: string;
  notes?: string | null;
  status: string;
  created_at: string;
}

// Helper function to combine date and time
export const combineDateTime = (date: Date, timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
};

// Creates a new booking
export const createBooking = async (bookingData: BookingData): Promise<BookingResult> => {
  const startTime = combineDateTime(bookingData.date, bookingData.time);
  
  // Calculate end time based on service duration (mock duration for now)
  const duration = 60; // Mock service duration in minutes
  const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
  
  try {
    // In a real app, this would save to a database
    const { data, error } = await supabase.from('bookings').insert({
      business_id: bookingData.businessId,
      service_id: bookingData.serviceId,
      service_name: bookingData.serviceName,
      client_first_name: bookingData.clientInfo.firstName,
      client_last_name: bookingData.clientInfo.lastName,
      client_email: bookingData.clientInfo.email,
      client_phone: bookingData.clientInfo.phone,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      notes: bookingData.notes,
      status: 'pending'
    }).select().single();
    
    if (error) throw error;
    
    // Return booking result
    return {
      id: data.id,
      startTime: new Date(data.start_time),
      endTime: new Date(data.end_time),
      serviceName: data.service_name,
      clientName: `${data.client_first_name} ${data.client_last_name}`,
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
      .from('bookings')
      .select('*')
      .eq('business_id', businessId)
      .order('start_time', { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

// Update booking status
export const updateBookingStatus = async (id: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bookings')
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
      .from('bookings')
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
