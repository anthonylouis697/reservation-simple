
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

// Get service duration from database
const getServiceDuration = async (serviceId: string): Promise<number> => {
  try {
    const { data: serviceData, error } = await supabase
      .from('services')
      .select('duration')
      .eq('id', serviceId)
      .maybeSingle();
    
    if (error) {
      console.error("Error retrieving service duration:", error);
      return 60; // Default duration
    }
    
    return serviceData?.duration || 60;
  } catch (error) {
    console.error("Error retrieving service duration:", error);
    return 60; // Default duration
  }
};

// Create a reservation in Supabase database
const createDatabaseReservation = async (
  bookingId: string,
  businessId: string,
  clientId: string,
  serviceId: string,
  serviceName: string, // Added service name parameter
  startTime: Date,
  endTime: Date,
  status: 'confirmed' | 'cancelled' | 'pending'
): Promise<BookingResult | null> => {
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
      console.error("Error saving reservation to database:", error);
      return null;
    }
    
    return {
      id: bookingId,
      startTime: startTime,
      endTime: endTime,
      serviceId: serviceId,
      serviceName: serviceName, // Include service name
      clientName: '', // Client name will be populated elsewhere
      clientEmail: '', // Client email will be populated elsewhere
      status: status
    };
  } catch (error) {
    console.error("Error saving reservation to database:", error);
    return null;
  }
};

// Create booking in local storage (fallback mechanism)
const createLocalBooking = (
  bookingId: string,
  businessId: string,
  clientId: string,
  serviceId: string,
  serviceName: string, // Added service name parameter
  startTime: Date,
  endTime: Date,
  status: 'confirmed' | 'cancelled' | 'pending',
  clientInfo: ClientInfo
): BookingResult => {
  const bookingToSave = {
    id: bookingId,
    businessId,
    clientId,
    serviceId,
    serviceName, // Include service name
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    status,
    clientName: `${clientInfo.firstName} ${clientInfo.lastName}`,
    clientEmail: clientInfo.email,
    clientPhone: clientInfo.phone,
    clientNotes: clientInfo.notes
  };
  
  saveBookingToLocalStorage(bookingToSave);
  
  return {
    id: bookingId,
    startTime,
    endTime,
    serviceId,
    serviceName, // Include service name
    clientName: `${clientInfo.firstName} ${clientInfo.lastName}`,
    clientEmail: clientInfo.email,
    status
  };
};

// Function to create a booking
export const createBooking = async (bookingData: BookingData): Promise<BookingResult> => {
  try {
    const { businessId, serviceId, serviceName, date, time, clientInfo } = bookingData;
    
    const startTime = combineDateTime(date, time);
    
    // Get the service duration (in minutes)
    const duration = await getServiceDuration(serviceId);
    
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    
    // Create client if it doesn't exist
    let clientId;
    
    try {
      clientId = await getOrCreateClient(clientInfo, businessId);
    } catch (error) {
      console.error("Error working with client:", error);
      throw new Error("Failed to create or retrieve client information");
    }
    
    // Create the reservation
    const bookingId = uuidv4();
    const status = 'confirmed' as const;
    
    // Attempt to save the reservation to the database
    const dbResult = await createDatabaseReservation(
      bookingId,
      businessId,
      clientId,
      serviceId,
      serviceName, // Pass service name
      startTime,
      endTime,
      status
    );
    
    if (dbResult) {
      // Update with client information
      return {
        ...dbResult,
        clientName: `${clientInfo.firstName} ${clientInfo.lastName}`,
        clientEmail: clientInfo.email,
        serviceName: serviceName // Ensure service name is included
      };
    }
    
    // Database save failed, use localStorage as fallback
    console.log("Using localStorage fallback for booking storage");
    return createLocalBooking(
      bookingId,
      businessId,
      clientId,
      serviceId,
      serviceName, // Pass service name
      startTime,
      endTime,
      status,
      clientInfo
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error("Unable to create booking");
  }
};

// Map database reservation to Booking object
const mapDbReservationToBooking = (res: DbReservation): Booking => {
  const client = res.clients || {};
  const startTime = new Date(res.start_time);
  const status = (res.status === 'confirmed' || res.status === 'cancelled' || res.status === 'pending') 
    ? res.status as 'confirmed' | 'cancelled' | 'pending'
    : 'pending';
  
  return {
    id: res.id,
    business_id: '', // This will be filled in later
    service_id: res.service_id,
    service_name: res.service_name || '',
    client_first_name: client.first_name || '',
    client_last_name: client.last_name || '',
    client_email: client.email || '',
    client_phone: client.phone || '',
    start_time: res.start_time,
    end_time: res.end_time,
    status: status,
    created_at: new Date().toISOString(),
    // Adding client property for compatibility
    client: {
      name: `${client.first_name || ''} ${client.last_name || ''}`.trim(),
      email: client.email || '',
      phone: client.phone || undefined,
      notes: client.notes || undefined
    },
    // Adding calculated properties
    serviceId: res.service_id,
    date: startTime,
    time: `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`
  };
};

// Fetch bookings from the database
const fetchBookingsFromDatabase = async (businessId?: string): Promise<Booking[]> => {
  try {
    let query = supabase
      .from('reservations')
      .select(`
        id,
        business_id,
        service_id,
        start_time,
        end_time,
        status,
        clients (
          first_name,
          last_name,
          email,
          phone,
          notes
        )
      `);
      
    if (businessId) {
      query = query.eq('business_id', businessId);
    }
    
    const { data: reservations, error } = await query.order('start_time', { ascending: false });

    if (error) {
      console.error("Error retrieving reservations:", error);
      throw error;
    }

    if (reservations && reservations.length > 0) {
      return reservations.map((res: any) => {
        const booking = mapDbReservationToBooking(res);
        // Ensure business_id is set
        booking.business_id = res.business_id;
        // Add service_name if not present
        if (!booking.service_name) {
          booking.service_name = "Service";
        }
        return booking;
      });
    }
    
    return [];
  } catch (error) {
    console.error("Error retrieving reservations:", error);
    throw error;
  }
};

// Function to get all bookings
export const getAllBookings = async (businessId?: string): Promise<Booking[]> => {
  try {
    // Try to retrieve reservations from the database
    const dbBookings = await fetchBookingsFromDatabase(businessId);
    if (dbBookings.length > 0) {
      return dbBookings;
    }

    // If no reservations are found in the database, try localStorage
    return getBookingsFromLocalStorage();
  } catch (error) {
    console.error("Error retrieving reservations:", error);
    // On error, try to retrieve from localStorage
    return getBookingsFromLocalStorage();
  }
};

// Update booking status in the database
const updateBookingStatusInDatabase = async (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'pending'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (error) {
      console.error("Error updating status in database:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating status in database:", error);
    return false;
  }
};

// Function to update booking status
export const updateBookingStatus = async (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'pending'): Promise<boolean> => {
  try {
    // Try to update the status in the database
    const dbUpdateSuccess = await updateBookingStatusInDatabase(bookingId, newStatus);
    
    if (dbUpdateSuccess) {
      return true;
    }

    // If database update fails, try with localStorage
    return updateBookingStatusInLocalStorage(bookingId, newStatus);
  } catch (error) {
    console.error("Error updating status:", error);
    // On error, try localStorage
    return updateBookingStatusInLocalStorage(bookingId, newStatus);
  }
};

// Delete booking from database
const deleteBookingFromDatabase = async (bookingId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', bookingId);

    if (error) {
      console.error("Error deleting reservation from database:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting reservation from database:", error);
    return false;
  }
};

// Function to delete a booking
export const deleteBooking = async (bookingId: string): Promise<boolean> => {
  try {
    // Try to delete the reservation from the database
    const dbDeleteSuccess = await deleteBookingFromDatabase(bookingId);
    
    if (dbDeleteSuccess) {
      return true;
    }

    // If deletion in database fails, try with localStorage
    return deleteBookingFromLocalStorage(bookingId);
  } catch (error) {
    console.error("Error deleting reservation:", error);
    // On error, try localStorage
    return deleteBookingFromLocalStorage(bookingId);
  }
};
