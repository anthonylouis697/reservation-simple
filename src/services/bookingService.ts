
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

export interface ClientInfo {
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface BookingData {
  businessId: string;
  serviceId: string;
  date: Date;
  time: string;
  client: ClientInfo;
}

export interface BookingResult {
  id: string;
  startTime: Date;
  endTime: Date;
  serviceId: string;
  clientName: string;
  clientEmail: string;
  status: 'confirmed' | 'cancelled' | 'pending';
}

// Interface for the booking data as returned from database operations
export interface Booking {
  id: string;
  client: ClientInfo;
  serviceId: string;
  date: Date;
  time: string;
  status: 'confirmed' | 'cancelled' | 'pending';
}

// Fonction pour convertir une date et une heure en objet Date
const combineDateTime = (date: Date, timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
};

// Vérifier si un créneau horaire est disponible
export const checkAvailability = async (date: Date, time: string, durationMinutes: number): Promise<boolean> => {
  try {
    // Dans un environnement de production, vérifier la disponibilité dans la base de données
    // Dans cet exemple, nous allons simuler la disponibilité
    const requestedStart = combineDateTime(date, time);
    const requestedEnd = new Date(requestedStart.getTime() + durationMinutes * 60 * 1000);
    
    // Récupérer les réservations existantes pour cette plage horaire
    // À implémenter : requête à la base de données
    
    // Pour l'instant, nous simulons que 90% des créneaux sont disponibles
    return Math.random() > 0.1; // 90% de chance que le créneau soit disponible
  } catch (error) {
    console.error("Erreur lors de la vérification de la disponibilité:", error);
    return false;
  }
};

// Fonction pour créer une réservation
export const createBooking = async (bookingData: BookingData): Promise<BookingResult> => {
  try {
    const { businessId, serviceId, date, time, client } = bookingData;
    
    const startTime = combineDateTime(date, time);
    
    // Récupérer la durée du service (en minutes)
    let duration = 60; // Durée par défaut
    
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
      console.error("Erreur lors de la récupération du service:", error);
    }
    
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    
    // Créer un client s'il n'existe pas
    let clientId;
    
    // Vérifier si le client existe déjà
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('email', client.email)
      .eq('business_id', businessId)
      .maybeSingle();
    
    if (existingClient) {
      clientId = existingClient.id;
    } else {
      // Créer un nouveau client
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          business_id: businessId,
          first_name: client.name.split(' ')[0],
          last_name: client.name.split(' ').slice(1).join(' '),
          email: client.email,
          phone: client.phone,
          notes: client.notes
        })
        .select('id')
        .single();
      
      if (clientError) {
        console.error("Erreur lors de la création du client:", clientError);
        throw clientError;
      }
      
      clientId = newClient.id;
    }
    
    // Créer la réservation
    const bookingId = uuidv4();
    const status = 'confirmed';
    
    // Dans un environnement réel, enregistrer la réservation dans la base de données
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
        console.error("Erreur lors de l'enregistrement de la réservation:", error);
        throw error;
      }
      
      return {
        id: bookingId,
        startTime: startTime,
        endTime: endTime,
        serviceId: serviceId,
        clientName: client.name,
        clientEmail: client.email,
        status: status as 'confirmed'
      };
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la réservation:", error);
      
      // En mode de développement, simuler une réservation réussie
      // Stocker les réservations dans le localStorage pour simuler une base de données
      const storedBookings = localStorage.getItem('bookings');
      const bookings = storedBookings ? JSON.parse(storedBookings) : [];
      
      const newBooking = {
        id: bookingId,
        businessId,
        clientId,
        serviceId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status,
        clientName: client.name,
        clientEmail: client.email
      };
      
      bookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      
      return {
        id: bookingId,
        startTime,
        endTime,
        serviceId,
        clientName: client.name,
        clientEmail: client.email,
        status: 'confirmed'
      };
    }
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    throw new Error("Impossible de créer la réservation");
  }
};

// Fonction pour récupérer toutes les réservations
export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    // Tenter de récupérer les réservations depuis la base de données
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
      console.error("Erreur lors de la récupération des réservations:", error);
      throw error;
    }

    if (reservations && reservations.length > 0) {
      // Transformer les données pour correspondre à l'interface Booking
      return reservations.map(res => {
        const client = res.clients || {};
        const startTime = new Date(res.start_time);
        
        return {
          id: res.id,
          date: startTime,
          time: `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`,
          status: res.status || 'pending',
          serviceId: res.service_id,
          client: {
            name: `${client.first_name || ''} ${client.last_name || ''}`.trim(),
            email: client.email || '',
            phone: client.phone,
            notes: client.notes
          }
        };
      });
    }

    // Si aucune réservation n'est trouvée dans la base de données ou en cas d'erreur,
    // essayer de récupérer depuis le localStorage
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      const parsedBookings = JSON.parse(storedBookings);
      return parsedBookings.map((booking: any) => {
        const startTime = new Date(booking.startTime);
        return {
          id: booking.id,
          date: startTime,
          time: `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`,
          status: booking.status || 'confirmed',
          serviceId: booking.serviceId,
          client: {
            name: booking.clientName || '',
            email: booking.clientEmail || '',
            phone: booking.clientPhone || '',
            notes: booking.clientNotes || ''
          }
        };
      });
    }

    // Si aucune donnée n'est trouvée, retourner un tableau vide
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    // En cas d'erreur, essayer de récupérer depuis le localStorage
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      const parsedBookings = JSON.parse(storedBookings);
      return parsedBookings.map((booking: any) => {
        const startTime = new Date(booking.startTime);
        return {
          id: booking.id,
          date: startTime,
          time: `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`,
          status: booking.status || 'confirmed',
          serviceId: booking.serviceId,
          client: {
            name: booking.clientName || '',
            email: booking.clientEmail || '',
            phone: booking.clientPhone || '',
            notes: booking.clientNotes || ''
          }
        };
      });
    }
    return [];
  }
};

// Fonction pour mettre à jour le statut d'une réservation
export const updateBookingStatus = async (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'pending'): Promise<boolean> => {
  try {
    // Tenter de mettre à jour le statut dans la base de données
    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      
      // Si l'update dans la base de données échoue, essayer avec le localStorage
      const storedBookings = localStorage.getItem('bookings');
      if (storedBookings) {
        const bookings = JSON.parse(storedBookings);
        const updatedBookings = bookings.map((booking: any) => {
          if (booking.id === bookingId) {
            return { ...booking, status: newStatus };
          }
          return booking;
        });
        
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        return true;
      }
      
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    
    // En cas d'erreur, essayer avec le localStorage
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      const bookings = JSON.parse(storedBookings);
      const updatedBookings = bookings.map((booking: any) => {
        if (booking.id === bookingId) {
          return { ...booking, status: newStatus };
        }
        return booking;
      });
      
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      return true;
    }
    
    return false;
  }
};

// Fonction pour supprimer une réservation
export const deleteBooking = async (bookingId: string): Promise<boolean> => {
  try {
    // Tenter de supprimer la réservation de la base de données
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', bookingId);

    if (error) {
      console.error("Erreur lors de la suppression de la réservation:", error);
      
      // Si la suppression dans la base de données échoue, essayer avec le localStorage
      const storedBookings = localStorage.getItem('bookings');
      if (storedBookings) {
        const bookings = JSON.parse(storedBookings);
        const filteredBookings = bookings.filter((booking: any) => booking.id !== bookingId);
        
        localStorage.setItem('bookings', JSON.stringify(filteredBookings));
        return true;
      }
      
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation:", error);
    
    // En cas d'erreur, essayer avec le localStorage
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      const bookings = JSON.parse(storedBookings);
      const filteredBookings = bookings.filter((booking: any) => booking.id !== bookingId);
      
      localStorage.setItem('bookings', JSON.stringify(filteredBookings));
      return true;
    }
    
    return false;
  }
};
