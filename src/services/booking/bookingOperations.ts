
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { BookingData, BookingResult, Booking, DbReservation } from './types';
import { getOrCreateClient, ClientInfo } from './clientService';
import { combineDateTime } from './dateUtils';
import { 
  saveBookingToLocalStorage, 
  getBookingsFromLocalStorage, 
  updateBookingStatusInLocalStorage, 
  deleteBookingFromLocalStorage 
} from './localStorageService';

// Function to create a booking
export const createBooking = async (bookingData: BookingData): Promise<BookingResult> => {
  try {
    const { businessId, serviceId, date, time, client } = bookingData;
    
    const startTime = combineDateTime(date, time);
    
    // Get the service duration (in minutes)
    let duration = 60; // Default duration
    
    try {
      const { data: serviceData } = await supabase
        .from('services')
        .select('duration')
        .eq('id', serviceId)
        .maybeSingle();
      
      if (serviceData) {
        duration = serviceData.duration;
      }
    } catch (error) {
      console.error("Error retrieving service:", error);
    }
    
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    
    // Create client if it doesn't exist
    let clientId;
    
    try {
      clientId = await getOrCreateClient(client, businessId);
    } catch (error) {
      console.error("Error working with client:", error);
      throw error;
    }
    
    // Create the reservation
    const bookingId = uuidv4();
    const status = 'confirmed' as const;
    
    // In a real environment, save the reservation to the database
    try {
      const { data: reservation, error } = await supabase
        .from('reservations')
        .insert({
          id: bookingId,
          business_id: businessId,
          client_id: clientId,
          service_id: serviceId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: status
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error saving reservation:", error);
        throw error;
      }
      
      return {
        id: bookingId,
        startTime: startTime,
        endTime: endTime,
        serviceId: serviceId,
        clientName: client.name,
        clientEmail: client.email,
        status: status
      };
    } catch (error) {
      console.error("Error saving reservation:", error);
      
      // In development mode, simulate a successful reservation
      // Store reservations in localStorage to simulate a database
      const bookingToSave = {
        id: bookingId,
        businessId,
        clientId,
        serviceId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
        clientNotes: client.notes
      };
      
      saveBookingToLocalStorage(bookingToSave);
      
      return {
        id: bookingId,
        startTime,
        endTime,
        serviceId,
        clientName: client.name,
        clientEmail: client.email,
        status
      };
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error("Unable to create booking");
  }
};

// Function to get all bookings
export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    // Try to retrieve reservations from the database
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select(`
        id,
        start_time,
        end_time,
        status,
        service_id,
        clients (
          first_name,
          last_name,
          email,
          phone,
          notes
        )
      `)
      .order('start_time', { ascending: false });

    if (error) {
      console.error("Error retrieving reservations:", error);
      throw error;
    }

    if (reservations && reservations.length > 0) {
      // Transform data to match the Booking interface
      return reservations.map((res: DbReservation) => {
        const client = res.clients || {};
        const startTime = new Date(res.start_time);
        const status = (res.status === 'confirmed' || res.status === 'cancelled' || res.status === 'pending') 
          ? res.status as 'confirmed' | 'cancelled' | 'pending'
          : 'pending';
        
        return {
          id: res.id,
          date: startTime,
          time: `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`,
          status: status,
          serviceId: res.service_id,
          client: {
            name: `${client.first_name || ''} ${client.last_name || ''}`.trim(),
            email: client.email || '',
            phone: client.phone || undefined,
            notes: client.notes || undefined
          }
        };
      });
    }

    // If no reservations are found in the database, try localStorage
    return getBookingsFromLocalStorage();
  } catch (error) {
    console.error("Error retrieving reservations:", error);
    // On error, try to retrieve from localStorage
    return getBookingsFromLocalStorage();
  }
};

// Function to update booking status
export const updateBookingStatus = async (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'pending'): Promise<boolean> => {
  try {
    // Try to update the status in the database
    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (error) {
      console.error("Error updating status:", error);
      // If update in database fails, try with localStorage
      return updateBookingStatusInLocalStorage(bookingId, newStatus);
    }

    return true;
  } catch (error) {
    console.error("Error updating status:", error);
    // On error, try localStorage
    return updateBookingStatusInLocalStorage(bookingId, newStatus);
  }
};

// Function to delete a booking
export const deleteBooking = async (bookingId: string): Promise<boolean> => {
  try {
    // Try to delete the reservation from the database
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', bookingId);

    if (error) {
      console.error("Error deleting reservation:", error);
      // If deletion in database fails, try with localStorage
      return deleteBookingFromLocalStorage(bookingId);
    }

    return true;
  } catch (error) {
    console.error("Error deleting reservation:", error);
    // On error, try localStorage
    return deleteBookingFromLocalStorage(bookingId);
  }
};
