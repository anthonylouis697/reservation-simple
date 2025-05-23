
import { supabase } from '@/integrations/supabase/client';
import { format, parse, addMinutes, isWithinInterval, isBefore, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Json } from '@/integrations/supabase/types';

// Type definitions
export interface TimeSlot {
  startTime: string;
  endTime: string;
  // For backward compatibility with existing components using start/end
  start?: string;
  end?: string;
}

export interface DaySchedule {
  isActive: boolean;
  timeSlots: TimeSlot[];
}

export interface RegularSchedule {
  lundi: DaySchedule;
  mardi: DaySchedule;
  mercredi: DaySchedule;
  jeudi: DaySchedule;
  vendredi: DaySchedule;
  samedi: DaySchedule;
  dimanche: DaySchedule;
  [key: string]: DaySchedule;
}

export interface BlockedTime {
  date: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  fullDay: boolean;
  timeSlots?: TimeSlot[]; // Added to support components using timeSlots
}

export interface SpecialDate {
  date: string;
  isActive: boolean;
  startTime?: string;
  endTime?: string;
  timeSlots: TimeSlot[];
  scheduleId?: string; // Added to support components using scheduleId
}

export interface ScheduleSet {
  id: string;
  name: string;
  isDefault: boolean;
  regularSchedule: RegularSchedule;
}

export interface AvailabilitySettings {
  id: string;
  businessId: string;
  minAdvanceHours: number;
  advanceBookingDays: number;
  bufferTimeMinutes: number;
  regularSchedule: RegularSchedule;
  blockedDates: BlockedTime[];
  specialDates: SpecialDate[];
  scheduleSets: ScheduleSet[];
  activeScheduleId: string;
}

// Helper function to get the day name
export const getDayName = (date: Date): string => {
  return format(date, 'EEEE', { locale: fr }).toLowerCase();
};

// Fetch availability settings
export const getAvailabilitySettings = async (businessId: string): Promise<AvailabilitySettings> => {
  try {
    const { data, error } = await supabase
      .from('availability_settings')
      .select('*')
      .eq('business_id', businessId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching availability settings:', error);
      throw error;
    }
    
    if (!data) {
      // Return default settings if none exist
      return createDefaultAvailabilitySettings(businessId);
    }
    
    // Transform the data from DB format to our app format
    const settings = {
      id: data.id,
      businessId: data.business_id,
      minAdvanceHours: data.min_advance_hours || 24,
      advanceBookingDays: data.advance_booking_days || 30,
      bufferTimeMinutes: data.buffer_time_minutes || 15,
      blockedDates: parseJsonArray(data.blocked_dates) as BlockedTime[],
      specialDates: parseJsonArray(data.special_dates) as SpecialDate[],
      regularSchedule: parseRegularSchedule(data.regular_schedule),
      scheduleSets: [], // Not implemented yet
      activeScheduleId: 'default'
    };
    
    // Ensure all time slots have both startTime/endTime and start/end properties for backward compatibility
    settings.scheduleSets = [{
      id: 'default',
      name: 'Default Schedule',
      isDefault: true,
      regularSchedule: settings.regularSchedule
    }];
    
    // Normalize time slots in blocked dates
    settings.blockedDates.forEach(blockedDate => {
      if (blockedDate.timeSlots) {
        blockedDate.timeSlots = blockedDate.timeSlots.map(ts => normalizeTimeSlot(ts));
      }
    });
    
    // Normalize time slots in special dates
    settings.specialDates.forEach(specialDate => {
      if (specialDate.timeSlots) {
        specialDate.timeSlots = specialDate.timeSlots.map(ts => normalizeTimeSlot(ts));
      }
    });
    
    // Normalize time slots in regular schedule
    Object.keys(settings.regularSchedule).forEach(day => {
      settings.regularSchedule[day].timeSlots = settings.regularSchedule[day].timeSlots.map(ts => normalizeTimeSlot(ts));
    });
    
    return settings;
  } catch (error) {
    console.error('Error in getAvailabilitySettings:', error);
    // Return default settings on error
    return createDefaultAvailabilitySettings(businessId);
  }
};

// Helper function to normalize time slot properties
const normalizeTimeSlot = (timeSlot: any): TimeSlot => {
  const result: TimeSlot = {
    startTime: timeSlot.startTime || timeSlot.start || '09:00',
    endTime: timeSlot.endTime || timeSlot.end || '17:00',
  };
  
  // Add legacy properties for backward compatibility
  result.start = result.startTime;
  result.end = result.endTime;
  
  return result;
};

// Save availability settings
export const saveAvailabilitySettings = async (settings: AvailabilitySettings): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('availability_settings')
      .upsert({
        id: settings.id,
        business_id: settings.businessId,
        min_advance_hours: settings.minAdvanceHours,
        advance_booking_days: settings.advanceBookingDays,
        buffer_time_minutes: settings.bufferTimeMinutes,
        blocked_dates: settings.blockedDates,
        special_dates: settings.specialDates,
        regular_schedule: settings.regularSchedule
      })
      .select();
      
    if (error) {
      console.error('Error saving availability settings:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveAvailabilitySettings:', error);
    return false;
  }
};

// Create default availability settings
const createDefaultAvailabilitySettings = (businessId: string): AvailabilitySettings => {
  const defaultSchedule: RegularSchedule = {
    lundi: { isActive: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', start: '09:00', end: '17:00' }] },
    mardi: { isActive: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', start: '09:00', end: '17:00' }] },
    mercredi: { isActive: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', start: '09:00', end: '17:00' }] },
    jeudi: { isActive: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', start: '09:00', end: '17:00' }] },
    vendredi: { isActive: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', start: '09:00', end: '17:00' }] },
    samedi: { isActive: false, timeSlots: [] },
    dimanche: { isActive: false, timeSlots: [] }
  };
  
  return {
    id: 'new',
    businessId,
    minAdvanceHours: 24,
    advanceBookingDays: 30,
    bufferTimeMinutes: 15,
    blockedDates: [],
    specialDates: [],
    regularSchedule: defaultSchedule,
    scheduleSets: [{
      id: 'default',
      name: 'Default Schedule',
      isDefault: true,
      regularSchedule: defaultSchedule
    }],
    activeScheduleId: 'default'
  };
};

// Helper to safely parse JSON arrays
const parseJsonArray = (jsonData: Json | null): any[] => {
  if (!jsonData) return [];
  
  try {
    if (Array.isArray(jsonData)) {
      return jsonData;
    }
    if (typeof jsonData === 'string') {
      return JSON.parse(jsonData);
    }
    return [];
  } catch (e) {
    console.error('Error parsing JSON array:', e);
    return [];
  }
};

// Parse regular schedule from database format
const parseRegularSchedule = (scheduleData: Json | null): RegularSchedule => {
  if (!scheduleData) {
    return createDefaultSchedule();
  }
  
  try {
    let schedule: RegularSchedule;
    if (typeof scheduleData === 'string') {
      schedule = JSON.parse(scheduleData) as RegularSchedule;
    } else if (typeof scheduleData === 'object' && scheduleData !== null) {
      schedule = scheduleData as RegularSchedule;
    } else {
      return createDefaultSchedule();
    }
    
    // Make sure all time slots have both startTime/endTime and start/end properties
    Object.keys(schedule).forEach(day => {
      if (schedule[day] && Array.isArray(schedule[day].timeSlots)) {
        schedule[day].timeSlots = schedule[day].timeSlots.map(ts => normalizeTimeSlot(ts));
      }
    });
    
    return schedule;
  } catch (e) {
    console.error('Error parsing regular schedule:', e);
    return createDefaultSchedule();
  }
};

// Create default schedule
const createDefaultSchedule = (): RegularSchedule => {
  return {
    lundi: { isActive: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', start: '09:00', end: '17:00' }] },
    mardi: { isActive: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', start: '09:00', end: '17:00' }] },
    mercredi: { isActive: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', start: '09:00', end: '17:00' }] },
    jeudi: { isActive: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', start: '09:00', end: '17:00' }] },
    vendredi: { isActive: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', start: '09:00', end: '17:00' }] },
    samedi: { isActive: false, timeSlots: [] },
    dimanche: { isActive: false, timeSlots: [] }
  };
};

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
        if (typeof blockedDate === 'object' && blockedDate !== null) {
          return blockedDate.date === dateStr;
        }
        return false;
      });
      
      if (isBlocked) {
        return []; // Aucun créneau disponible pour les dates bloquées
      }
      
      // Vérifier si la date a des horaires spéciaux
      const specialDates = Array.isArray(availabilitySettings.special_dates) ? 
        availabilitySettings.special_dates : [];
      
      const specialDate = specialDates.find((specialDate: any) => {
        if (typeof specialDate === 'object' && specialDate !== null) {
          return specialDate.date === dateStr;
        }
        return false;
      });
      
      if (specialDate && typeof specialDate === 'object' && specialDate !== null) {
        let startTime = '09:00';
        let endTime = '18:00';
        
        if (specialDate.start_time && typeof specialDate.start_time === 'string') {
          startTime = specialDate.start_time;
        }
        
        if (specialDate.end_time && typeof specialDate.end_time === 'string') {
          endTime = specialDate.end_time;
        }
        
        const startHour = parseInt(startTime.split(':')[0] || '9');
        const endHour = parseInt(endTime.split(':')[0] || '18');
        
        const slots = generateTimeSlots(startHour, endHour, defaultInterval);
        return filterAvailableSlots(businessId, date, slots, duration);
      }
      
      // Utiliser l'horaire régulier pour le jour de la semaine
      const regularSchedule = availabilitySettings.regular_schedule || {};
      
      if (typeof regularSchedule === 'object' && regularSchedule !== null) {
        const daySchedule = regularSchedule[dayOfWeek];
        
        if (daySchedule && typeof daySchedule === 'object' && !daySchedule.is_closed) {
          let startTime = '09:00';
          let endTime = '18:00';
          
          if (daySchedule.start_time && typeof daySchedule.start_time === 'string') {
            startTime = daySchedule.start_time;
          }
          
          if (daySchedule.end_time && typeof daySchedule.end_time === 'string') {
            endTime = daySchedule.end_time;
          }
          
          const startHour = parseInt(startTime.split(':')[0]);
          const endHour = parseInt(endTime.split(':')[0]);
          
          const slots = generateTimeSlots(startHour, endHour, defaultInterval);
          return filterAvailableSlots(businessId, date, slots, duration);
        }
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
