
import { supabase } from '@/integrations/supabase/client';
import { format, parse, addMinutes, isWithinInterval, isBefore, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';

// Vérifie si un créneau est disponible
export const checkAvailability = async (
  businessId: string,
  date: Date,
  time: string,
  duration: number
): Promise<boolean> => {
  try {
    // Conversion de la date et l'heure en datetime
    const dateStr = format(date, 'yyyy-MM-dd');
    const startTime = parse(`${dateStr} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
    const endTime = addMinutes(startTime, duration);
    
    // Formatage pour la requête
    const startTimeStr = startTime.toISOString();
    const endTimeStr = endTime.toISOString();
    
    // Récupération des réservations existantes qui pourraient chevaucher
    const { data, error } = await supabase
      .from('reservations')
      .select('start_time, end_time')
      .eq('business_id', businessId)
      .or(`start_time.lt.${endTimeStr},end_time.gt.${startTimeStr}`)
      .neq('status', 'cancelled');
    
    if (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error);
      return false;
    }
    
    // Si aucune réservation ne chevauche, le créneau est disponible
    return !data || data.length === 0;
  } catch (error) {
    console.error('Erreur lors de la vérification de disponibilité:', error);
    return false;
  }
};

// Fonction qui génère des créneaux horaires disponibles
const generateTimeSlots = (
  startHour: number,
  endHour: number, 
  interval: number = 30
): string[] => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      slots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return slots;
};

// Récupère les créneaux horaires disponibles pour une date et une durée
export const getAvailableTimeSlots = async (
  businessId: string,
  date: Date,
  duration: number = 60
): Promise<string[]> => {
  try {
    // Récupération des paramètres de disponibilité
    const { data: availabilitySettings, error: settingsError } = await supabase
      .from('availability_settings')
      .select('regular_schedule, blocked_dates, special_dates')
      .eq('business_id', businessId)
      .maybeSingle();
    
    if (settingsError) {
      console.error('Erreur lors de la récupération des paramètres de disponibilité:', settingsError);
      // Utiliser des valeurs par défaut en cas d'erreur
      return generateTimeSlots(9, 18, 30);
    }
    
    // Créneaux par défaut (9h à 18h)
    let defaultStartHour = 9;
    let defaultEndHour = 18;
    let defaultInterval = 30; // minutes
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayOfWeek = format(date, 'EEEE', { locale: fr }).toLowerCase();
    
    // Si des paramètres de disponibilité existent
    if (availabilitySettings) {
      // Vérifier si la date est bloquée
      const blockedDates = Array.isArray(availabilitySettings.blocked_dates) ? 
        availabilitySettings.blocked_dates : [];
      
      const isBlocked = blockedDates.some((blockedDate: any) => {
        if (typeof blockedDate === 'string') {
          return blockedDate === dateStr;
        }
        return blockedDate?.date === dateStr;
      });
      
      if (isBlocked) {
        return []; // Aucun créneau disponible pour les dates bloquées
      }
      
      // Vérifier si la date a des horaires spéciaux
      const specialDates = Array.isArray(availabilitySettings.special_dates) ? 
        availabilitySettings.special_dates : [];
      
      const specialDate = specialDates.find((specialDate: any) => {
        if (typeof specialDate === 'object') {
          return specialDate?.date === dateStr;
        }
        return false;
      });
      
      if (specialDate) {
        const slots = generateTimeSlots(
          parseInt(specialDate.start_time?.split(':')[0] || '9'),
          parseInt(specialDate.end_time?.split(':')[0] || '18'),
          defaultInterval
        );
        return filterAvailableSlots(businessId, date, slots, duration);
      }
      
      // Utiliser l'horaire régulier pour le jour de la semaine
      const regularSchedule = availabilitySettings.regular_schedule || {};
      const daySchedule = regularSchedule[dayOfWeek];
      
      if (daySchedule && !daySchedule.is_closed) {
        const startTime = daySchedule.start_time || '09:00';
        const endTime = daySchedule.end_time || '18:00';
        
        const startHour = parseInt(startTime.split(':')[0]);
        const endHour = parseInt(endTime.split(':')[0]);
        
        const slots = generateTimeSlots(startHour, endHour, defaultInterval);
        return filterAvailableSlots(businessId, date, slots, duration);
      }
    }
    
    // Utilisation des créneaux par défaut
    const defaultSlots = generateTimeSlots(defaultStartHour, defaultEndHour, defaultInterval);
    return filterAvailableSlots(businessId, date, defaultSlots, duration);
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux disponibles:', error);
    // En cas d'erreur, retourner des créneaux par défaut
    return generateTimeSlots(9, 18, 30);
  }
};

// Filtre les créneaux en fonction des réservations existantes
const filterAvailableSlots = async (
  businessId: string,
  date: Date,
  slots: string[],
  duration: number
): Promise<string[]> => {
  try {
    const dateStr = format(date, 'yyyy-MM-dd');
    const now = new Date();
    
    // Filtrer d'abord les créneaux passés pour la date actuelle
    const filteredSlots = slots.filter(timeSlot => {
      const slotDateTime = parse(`${dateStr} ${timeSlot}`, 'yyyy-MM-dd HH:mm', new Date());
      return isAfter(slotDateTime, now) || format(date, 'yyyy-MM-dd') !== format(now, 'yyyy-MM-dd');
    });
    
    // Récupérer les réservations existantes pour cette date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const { data: existingBookings, error } = await supabase
      .from('reservations')
      .select('start_time, end_time')
      .eq('business_id', businessId)
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString())
      .neq('status', 'cancelled');
    
    if (error) {
      console.error('Erreur lors de la récupération des réservations existantes:', error);
      return filteredSlots;
    }
    
    // Retirer les créneaux qui chevauchent des réservations existantes
    const availableSlots = filteredSlots.filter(timeSlot => {
      const startDateTime = parse(`${dateStr} ${timeSlot}`, 'yyyy-MM-dd HH:mm', new Date());
      const endDateTime = addMinutes(startDateTime, duration);
      
      // Vérifier le chevauchement avec les réservations existantes
      return !existingBookings.some(booking => {
        const bookingStart = new Date(booking.start_time);
        const bookingEnd = new Date(booking.end_time);
        
        // Vérifie si les intervalles se chevauchent
        return (
          (isWithinInterval(startDateTime, { start: bookingStart, end: bookingEnd }) ||
           isWithinInterval(endDateTime, { start: bookingStart, end: bookingEnd }) ||
           (isBefore(startDateTime, bookingStart) && isAfter(endDateTime, bookingEnd)))
        );
      });
    });
    
    return availableSlots;
  } catch (error) {
    console.error('Erreur lors du filtrage des créneaux disponibles:', error);
    return slots;
  }
};
