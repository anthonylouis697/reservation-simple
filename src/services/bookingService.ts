
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface BookingData {
  serviceId: string;
  date: Date;
  time: string;
  client: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
  };
}

export interface Booking extends BookingData {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

// Fonction pour charger les réservations existantes
export const loadBookings = (): Booking[] => {
  try {
    const savedBookings = localStorage.getItem('bookings');
    return savedBookings ? JSON.parse(savedBookings) : [];
  } catch (error) {
    console.error('Error loading bookings:', error);
    return [];
  }
};

// Fonction pour sauvegarder les réservations
const saveBookings = (bookings: Booking[]): void => {
  try {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  } catch (error) {
    console.error('Error saving bookings:', error);
    throw error;
  }
};

// Fonction pour créer une nouvelle réservation
export const createBooking = async (bookingData: BookingData): Promise<Booking> => {
  return new Promise((resolve, reject) => {
    try {
      // Générer un ID unique pour la réservation
      const id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Créer l'objet de réservation
      const newBooking: Booking = {
        ...bookingData,
        id,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      // Charger les réservations existantes et ajouter la nouvelle
      const existingBookings = loadBookings();
      const updatedBookings = [...existingBookings, newBooking];
      
      // Sauvegarder les réservations mises à jour
      saveBookings(updatedBookings);
      
      // Simuler un délai réseau
      setTimeout(() => {
        resolve(newBooking);
      }, 1000);
    } catch (error) {
      console.error('Error creating booking:', error);
      reject(error);
    }
  });
};

// Fonction pour vérifier si un créneau horaire est disponible
export const checkAvailability = async (
  date: Date, 
  time: string, 
  serviceDuration: number
): Promise<boolean> => {
  return new Promise((resolve) => {
    // Charger les réservations existantes
    const existingBookings = loadBookings();
    
    // Formatter la date pour la comparaison
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Vérifier si ce créneau est déjà réservé
    const isBooked = existingBookings.some((booking) => {
      const bookingDate = format(new Date(booking.date), 'yyyy-MM-dd');
      return bookingDate === formattedDate && booking.time === time && booking.status !== 'cancelled';
    });
    
    // Simuler un délai réseau
    setTimeout(() => {
      // 80% de chance d'être disponible pour les créneaux non réservés
      resolve(!isBooked && Math.random() > 0.2);
    }, 300);
  });
};

// Fonction pour obtenir toutes les réservations
export const getAllBookings = async (): Promise<Booking[]> => {
  return new Promise((resolve) => {
    // Charger les réservations existantes
    const existingBookings = loadBookings();
    
    // Simuler un délai réseau
    setTimeout(() => {
      resolve(existingBookings);
    }, 500);
  });
};

// Fonction pour mettre à jour le statut d'une réservation
export const updateBookingStatus = async (
  bookingId: string, 
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<Booking | null> => {
  return new Promise((resolve, reject) => {
    try {
      // Charger les réservations existantes
      const existingBookings = loadBookings();
      
      // Trouver la réservation à mettre à jour
      const bookingIndex = existingBookings.findIndex(booking => booking.id === bookingId);
      
      if (bookingIndex === -1) {
        toast.error("Réservation introuvable");
        resolve(null);
        return;
      }
      
      // Mettre à jour le statut
      existingBookings[bookingIndex] = {
        ...existingBookings[bookingIndex],
        status
      };
      
      // Sauvegarder les réservations mises à jour
      saveBookings(existingBookings);
      
      // Simuler un délai réseau
      setTimeout(() => {
        resolve(existingBookings[bookingIndex]);
      }, 500);
    } catch (error) {
      console.error('Error updating booking status:', error);
      reject(error);
    }
  });
};

// Fonction pour supprimer une réservation
export const deleteBooking = async (bookingId: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      // Charger les réservations existantes
      const existingBookings = loadBookings();
      
      // Filtrer la réservation à supprimer
      const updatedBookings = existingBookings.filter(booking => booking.id !== bookingId);
      
      if (updatedBookings.length === existingBookings.length) {
        toast.error("Réservation introuvable");
        resolve(false);
        return;
      }
      
      // Sauvegarder les réservations mises à jour
      saveBookings(updatedBookings);
      
      // Simuler un délai réseau
      setTimeout(() => {
        resolve(true);
      }, 500);
    } catch (error) {
      console.error('Error deleting booking:', error);
      reject(error);
    }
  });
};
