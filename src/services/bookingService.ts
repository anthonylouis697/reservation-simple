
import { supabase } from '@/integrations/supabase/client';
import { format, parse, add } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getAvailableTimeSlots } from '@/services/booking/availabilityService';

// Interfaces
export interface ClientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface BookingData {
  businessId: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  time: string;
  clientInfo: ClientInfo;
  notes?: string;
}

export interface BookingResult {
  id: string;
  startTime: string;
  endTime: string;
  serviceName: string;
  clientName: string;
}

// Function to check if a time slot is available
export const checkAvailability = async (
  businessId: string,
  date: Date,
  time: string,
  duration: number
): Promise<boolean> => {
  try {
    console.log(`Checking availability for business ${businessId} on ${date.toISOString()} at ${time} for ${duration} minutes`);
    
    // Convert date and time to datetime
    const dateStr = format(date, 'yyyy-MM-dd');
    const startTime = parse(`${dateStr} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
    const endTime = add(startTime, { minutes: duration });
    
    // Format for query
    const startTimeStr = startTime.toISOString();
    const endTimeStr = endTime.toISOString();
    
    // Log the query parameters
    console.log(`Checking for overlapping bookings between ${startTimeStr} and ${endTimeStr}`);
    
    // Query existing reservations that might overlap
    const { data, error } = await supabase
      .from('reservations')
      .select('id, start_time, end_time')
      .eq('business_id', businessId)
      .or(`start_time.lt.${endTimeStr},end_time.gt.${startTimeStr}`)
      .neq('status', 'cancelled');
    
    if (error) {
      console.error('Error checking availability:', error);
      return false;
    }
    
    console.log(`Found ${data?.length || 0} potentially overlapping bookings`);
    
    // If no overlapping bookings, the slot is available
    return !data || data.length === 0;
  } catch (error) {
    console.error('Error in checkAvailability:', error);
    return false;
  }
};

// Function to create a booking
export const createBooking = async (bookingData: BookingData): Promise<BookingResult> => {
  try {
    console.log('Creating booking with data:', bookingData);
    
    // Convert date and time to datetime
    const dateStr = format(bookingData.date, 'yyyy-MM-dd');
    const startTime = parse(`${dateStr} ${bookingData.time}`, 'yyyy-MM-dd HH:mm', new Date());
    
    // Get service duration
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .select('duration')
      .eq('id', bookingData.serviceId)
      .single();
    
    if (serviceError || !serviceData) {
      console.error('Error fetching service:', serviceError);
      throw new Error('Service not found');
    }
    
    // Calculate end time based on service duration
    const duration = serviceData.duration || 60; // Default to 60 min if not specified
    const endTime = add(startTime, { minutes: duration });
    
    // Format times
    const startTimeStr = startTime.toISOString();
    const endTimeStr = endTime.toISOString();
    
    console.log(`Booking from ${startTimeStr} to ${endTimeStr} (duration: ${duration}min)`);
    
    // Create reservation record
    const { data, error } = await supabase
      .from('reservations')
      .insert([{
        business_id: bookingData.businessId,
        service_id: bookingData.serviceId,
        service_name: bookingData.serviceName,
        start_time: startTimeStr,
        end_time: endTimeStr,
        client_first_name: bookingData.clientInfo.firstName,
        client_last_name: bookingData.clientInfo.lastName,
        client_email: bookingData.clientInfo.email,
        client_phone: bookingData.clientInfo.phone || null,
        notes: bookingData.notes || null,
        status: 'confirmed'
      }])
      .select('id, start_time, end_time, service_name, client_first_name, client_last_name')
      .single();
    
    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
    
    console.log('Booking created successfully:', data);
    
    // Return booking result
    return {
      id: data.id,
      startTime: data.start_time,
      endTime: data.end_time,
      serviceName: data.service_name,
      clientName: `${data.client_first_name} ${data.client_last_name}`
    };
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error;
  }
};

// Function to get available time slots
export const getBookableTimeSlots = async (
  businessId: string,
  serviceId: string,
  date: Date
): Promise<string[]> => {
  try {
    console.log(`Getting bookable time slots for business ${businessId}, service ${serviceId} on ${date.toISOString()}`);
    
    // Get service information (mainly for duration)
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .select('duration')
      .eq('id', serviceId)
      .single();
    
    if (serviceError || !serviceData) {
      console.error('Error fetching service:', serviceError);
      return [];
    }
    
    const duration = serviceData.duration || 60;
    console.log(`Service duration: ${duration} minutes`);
    
    // Get available time slots based on business availability settings
    const timeSlots = await getAvailableTimeSlots(businessId, date, duration);
    console.log(`Retrieved ${timeSlots.length} available time slots from availability service`);
    
    return timeSlots;
  } catch (error) {
    console.error('Error in getBookableTimeSlots:', error);
    return [];
  }
};
