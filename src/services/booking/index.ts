import { supabase } from '@/integrations/supabase/client';
import { combineDateTime } from './dateUtils';
import { BookingData, BookingResult, Booking, DbReservationWithClient } from './types';
import { ClientInfo } from './clientService';
import { getOrCreateClient } from './clientService';

// Re-export types
export type { BookingData, BookingResult, Booking, ClientInfo };
export * from './clientService';
export { combineDateTime } from './dateUtils';

// Creates a new booking with improved error handling
export const createBooking = async (bookingData: BookingData): Promise<BookingResult> => {
  console.log("Création d'une réservation avec les données:", bookingData);
  
  try {
    // Get or create client first
    const clientInfo = bookingData.clientInfo;
    let clientId;
    
    try {
      clientId = await getOrCreateClient(bookingData.businessId, clientInfo);
      console.log("ID client récupéré/créé:", clientId);
    } catch (clientError) {
      console.error("Erreur lors de la création/récupération du client:", clientError);
      // Continue without client ID if there's an error
    }
    
    // Calculate times
    const startTime = combineDateTime(bookingData.date, bookingData.time);
    const duration = bookingData.serviceDuration || 60;
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    
    console.log("Horaires calculés:", { 
      startTime: startTime.toISOString(), 
      endTime: endTime.toISOString() 
    });
    
    // Prepare reservation data
    const reservationData = {
      business_id: bookingData.businessId,
      service_id: bookingData.serviceId,
      service_name: bookingData.serviceName,
      client_id: clientId,
      client_first_name: clientInfo.firstName,
      client_last_name: clientInfo.lastName,
      client_email: clientInfo.email,
      client_phone: clientInfo.phone || null,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      notes: bookingData.notes || null,
      status: 'confirmed'
    };
    
    console.log("Données de réservation à insérer:", reservationData);
    
    // Insert reservation
    const { data, error } = await supabase
      .from('reservations')
      .insert(reservationData)
      .select()
      .single();
    
    if (error) {
      console.error("Erreur Supabase lors de la création de réservation:", error);
      throw error;
    }
    
    if (!data) {
      console.error("Aucune donnée retournée après la création de la réservation");
      throw new Error('Échec de la création de la réservation: Aucune donnée retournée');
    }
    
    console.log("Réservation créée avec succès:", data);
    
    // Return booking result with proper data
    return {
      id: data.id,
      startTime: new Date(data.start_time),
      endTime: new Date(data.end_time),
      serviceId: data.service_id,
      serviceName: data.service_name || bookingData.serviceName,
      clientName: `${clientInfo.firstName} ${clientInfo.lastName}`,
      clientEmail: clientInfo.email,
      status: data.status as 'confirmed' | 'cancelled' | 'pending'
    };
  } catch (error) {
    console.error('Erreur complète lors de la création de la réservation:', error);
    throw new Error(`Échec de la création de la réservation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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
      // Cast booking to our updated type
      const bookingData = booking as unknown as DbReservationWithClient;
      
      // Create a booking object with proper fields and fallback values
      const result: Booking = {
        id: bookingData.id || "",
        business_id: bookingData.business_id || "",
        service_id: bookingData.service_id || "",
        service_name: bookingData.service_name || "Service",
        client_id: bookingData.client_id,
        client_first_name: bookingData.client_first_name || "",
        client_last_name: bookingData.client_last_name || "",
        client_email: bookingData.client_email || "",
        client_phone: bookingData.client_phone || "",
        start_time: bookingData.start_time || new Date().toISOString(),
        end_time: bookingData.end_time || new Date().toISOString(),
        notes: bookingData.notes || null,
        status: bookingData.status || "pending",
        created_at: bookingData.created_at || new Date().toISOString(),
        // Adding client property for compatibility
        client: {
          name: `${bookingData.client_first_name || ''} ${bookingData.client_last_name || ''}`.trim() || "Client",
          email: bookingData.client_email || '',
          phone: bookingData.client_phone || '',
          notes: bookingData.notes || ''
        }
      };
      
      // Add date and time fields from start_time
      if (bookingData.start_time) {
        const startTime = new Date(bookingData.start_time);
        result.date = startTime;
        result.time = startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      }
      
      // Add serviceId field for compatibility
      result.serviceId = bookingData.service_id;
      
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
