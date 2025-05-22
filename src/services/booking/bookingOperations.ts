
import { supabase } from '@/integrations/supabase/client';
import { BookingData, BookingResult, Booking, DbClient, DbReservation } from './types';
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
      serviceName: bookingData.serviceName || 'Service',
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
      // Safely access client data with default empty object
      const clientData: DbClient = (booking.clients || {}) as DbClient;
      
      // Format the booking data
      const result: Booking = {
        id: booking.id,
        business_id: booking.business_id,
        service_id: booking.service_id,
        service_name: booking.service_name || 'Service',
        client_id: booking.client_id,
        client_first_name: clientData.first_name || '',
        client_last_name: clientData.last_name || '',
        client_email: clientData.email || '',
        client_phone: clientData.phone || '',
        start_time: booking.start_time,
        end_time: booking.end_time,
        notes: booking.notes || null,
        status: booking.status,
        created_at: booking.created_at,
        
        // Add the client field for compatibility
        client: {
          name: `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim(),
          email: clientData.email || '',
          phone: clientData.phone || '',
          notes: clientData.notes || ''
        }
      };
      
      // Add date and time fields for convenience
      if (booking.start_time) {
        const startDateTime = new Date(booking.start_time);
        result.date = startDateTime;
        result.time = startDateTime.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      // Add serviceId field for compatibility
      result.serviceId = booking.service_id;
      
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
      // Safe access for clients
      const clientData = booking.clients || {};
      
      return {
        id: booking.id,
        business_id: booking.business_id,
        service_id: booking.service_id,
        service_name: booking.service_name || 'Service',
        client_id: booking.client_id,
        client_first_name: clientData.first_name || '',
        client_last_name: clientData.last_name || '',
        client_email: clientData.email || '',
        client_phone: clientData.phone || '',
        start_time: booking.start_time,
        end_time: booking.end_time,
        notes: booking.notes || '',
        status: booking.status,
        created_at: booking.created_at,
        date: new Date(booking.start_time),
        time: new Date(booking.start_time).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        serviceId: booking.service_id,
        client: {
          name: `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim(),
          email: clientData.email || '',
          phone: clientData.phone || '',
          notes: clientData.notes || ''
        }
      };
    });
  } catch (error) {
    console.error('Error in getUpcomingBookings:', error);
    return [];
  }
};
