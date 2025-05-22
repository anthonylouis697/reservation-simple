
import { supabase } from '@/integrations/supabase/client';
import { BookingData, BookingResult, Booking, DbClient, DbReservation, DbReservationWithClient } from './types';
import { getOrCreateClient, ClientInfo } from './clientService';
import { combineDateTime } from './dateUtils';

/**
 * Creates a booking in the database
 */
export const createBookingOperation = async (
  bookingData: BookingData
): Promise<BookingResult> => {
  try {
    console.log('[createBookingOperation] Creating booking:', bookingData);

    // Step 1: Get or create client
    const clientId = await getOrCreateClient(
      bookingData.businessId,
      bookingData.clientInfo
    );

    console.log('[createBookingOperation] Client ID:', clientId);

    // Step 2: Calculate timing
    const startTime = combineDateTime(bookingData.date, bookingData.time);
    let duration = 60; // Default duration in minutes

    // Get duration from service if available
    if (bookingData.serviceDuration) {
      duration = bookingData.serviceDuration;
    }

    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    // Step 3: Insert booking
    const { data, error } = await supabase.from('reservations').insert({
      business_id: bookingData.businessId,
      service_id: bookingData.serviceId,
      service_name: bookingData.serviceName || 'Service',
      client_id: clientId,
      client_first_name: bookingData.clientInfo.firstName,
      client_last_name: bookingData.clientInfo.lastName,
      client_email: bookingData.clientInfo.email,
      client_phone: bookingData.clientInfo.phone || null,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      notes: bookingData.notes || null,
      status: 'confirmed'
    }).select('*').single();

    if (error) {
      console.error('[createBookingOperation] Error creating booking:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from booking creation');
    }

    // Step 4: Return booking result
    const result: BookingResult = {
      id: data.id,
      startTime: new Date(data.start_time),
      endTime: new Date(data.end_time),
      serviceId: data.service_id,
      serviceName: data.service_name || bookingData.serviceName || 'Service',
      clientName: `${bookingData.clientInfo.firstName} ${bookingData.clientInfo.lastName}`,
      clientEmail: bookingData.clientInfo.email,
      status: data.status as 'confirmed' | 'cancelled' | 'pending'
    };

    console.log('[createBookingOperation] Booking created:', result);
    return result;

  } catch (error) {
    console.error('[createBookingOperation] Error:', error);
    throw error;
  }
};

/**
 * Gets all bookings for a business and optionally filters by status
 */
export const getBusinessBookings = async (
  businessId: string,
  status?: 'confirmed' | 'cancelled' | 'pending'
): Promise<Booking[]> => {
  try {
    let query = supabase
      .from('reservations')
      .select(`
        *,
        clients (
          id,
          first_name,
          last_name,
          email,
          phone,
          notes
        )
      `)
      .eq('business_id', businessId)
      .order('start_time', { ascending: true });

    // Add status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    const bookings: Booking[] = (data || []).map(booking => {
      // Cast booking to our type with correct structure
      const bookingData = booking as unknown as DbReservationWithClient;
      
      // Safely access client data with default empty object
      const clientData = ((bookingData.clients || {}) as DbClient);
      
      // Format the booking data
      const result: Booking = {
        id: bookingData.id,
        business_id: bookingData.business_id,
        service_id: bookingData.service_id,
        service_name: bookingData.service_name || 'Service',
        client_id: bookingData.client_id,
        client_first_name: bookingData.client_first_name || clientData.first_name || '',
        client_last_name: bookingData.client_last_name || clientData.last_name || '',
        client_email: bookingData.client_email || clientData.email || '',
        client_phone: bookingData.client_phone || clientData.phone || '',
        start_time: bookingData.start_time,
        end_time: bookingData.end_time,
        notes: bookingData.notes || null,
        status: bookingData.status,
        created_at: bookingData.created_at,
        
        // Add the client field for compatibility
        client: {
          name: ((clientData.first_name || bookingData.client_first_name || '') + ' ' + (clientData.last_name || bookingData.client_last_name || '')).trim() || 'Client',
          email: clientData.email || bookingData.client_email || '',
          phone: clientData.phone || bookingData.client_phone || '',
          notes: clientData.notes || bookingData.notes || ''
        }
      };
      
      // Add date and time fields for convenience
      if (bookingData.start_time) {
        const startDateTime = new Date(bookingData.start_time);
        result.date = startDateTime;
        result.time = startDateTime.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      // Add serviceId field for compatibility
      result.serviceId = bookingData.service_id;
      
      return result;
    });

    return bookings;
  } catch (error) {
    console.error('Error in getBusinessBookings:', error);
    return [];
  }
};

/**
 * Gets future bookings only
 */
export const getUpcomingBookings = async (businessId: string): Promise<Booking[]> => {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        clients (
          id,
          first_name,
          last_name,
          email,
          phone,
          notes
        )
      `)
      .eq('business_id', businessId)
      .gte('start_time', now)
      .eq('status', 'confirmed')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching upcoming bookings:', error);
      return [];
    }

    // Format the bookings - using the same structure as getBusinessBookings
    const bookings = data || [];
    
    return bookings.map(booking => {
      // Cast booking to our type with correct structure
      const bookingData = booking as unknown as DbReservationWithClient;
      
      // Safe access for clients with default values 
      const clientData = ((bookingData.clients || {}) as DbClient);
      
      return {
        id: bookingData.id,
        business_id: bookingData.business_id,
        service_id: bookingData.service_id,
        service_name: bookingData.service_name || 'Service',
        client_id: bookingData.client_id,
        client_first_name: bookingData.client_first_name || clientData.first_name || '',
        client_last_name: bookingData.client_last_name || clientData.last_name || '',
        client_email: bookingData.client_email || clientData.email || '',
        client_phone: bookingData.client_phone || clientData.phone || '',
        start_time: bookingData.start_time,
        end_time: bookingData.end_time,
        notes: bookingData.notes || '',
        status: bookingData.status,
        created_at: bookingData.created_at,
        date: new Date(bookingData.start_time),
        time: new Date(bookingData.start_time).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        serviceId: bookingData.service_id,
        client: {
          // Handle possible null/undefined values gracefully
          name: ((bookingData.client_first_name || clientData.first_name || '') + ' ' + (bookingData.client_last_name || clientData.last_name || '')).trim() || 'Client',
          email: bookingData.client_email || clientData.email || '',
          phone: bookingData.client_phone || clientData.phone || '',
          notes: bookingData.notes || clientData.notes || ''
        }
      };
    });
  } catch (error) {
    console.error('Error in getUpcomingBookings:', error);
    return [];
  }
};
