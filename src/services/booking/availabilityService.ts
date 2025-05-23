
import { supabase } from '@/integrations/supabase/client';
import { format, parse, addMinutes, isWithinInterval, isBefore, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Json } from '@/integrations/supabase/types';

// Type definitions
export interface TimeSlot {
  startTime: string;
  endTime: string;
  // For backward compatibility with existing components using start/end
  start: string;
  end: string;
}

export interface DaySchedule {
  isActive: boolean;
  timeSlots: TimeSlot[];
}

export interface RegularSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
  // Additional mappings for French day names
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
  timeSlots: TimeSlot[]; // Use array of TimeSlot to be consistent
}

export interface SpecialDate {
  date: string;
  isActive: boolean;
  startTime?: string;
  endTime?: string;
  timeSlots: TimeSlot[];
  scheduleId: string; // Required to match component usage
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

// Helper function to create a normalized TimeSlot
export const createTimeSlot = (startTime: string, endTime: string): TimeSlot => {
  return {
    startTime,
    endTime,
    start: startTime,
    end: endTime
  };
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
      blockedDates: parseJsonArray(data.blocked_dates).map(bd => normalizeBlockedDate(bd)),
      specialDates: parseJsonArray(data.special_dates).map(sd => normalizeSpecialDate(sd)),
      regularSchedule: parseRegularSchedule(data.regular_schedule),
      scheduleSets: [], // Will be set below
      activeScheduleId: 'default'
    };
    
    // Setup schedule sets
    settings.scheduleSets = [{
      id: 'default',
      name: 'Default Schedule',
      isDefault: true,
      regularSchedule: settings.regularSchedule
    }];
    
    return settings;
  } catch (error) {
    console.error('Error in getAvailabilitySettings:', error);
    // Return default settings on error
    return createDefaultAvailabilitySettings(businessId);
  }
};

// Normalize a blocked date
const normalizeBlockedDate = (blockedDate: any): BlockedTime => {
  // Handle different property formats
  const result: BlockedTime = {
    date: blockedDate.date || '',
    fullDay: blockedDate.fullDay !== false, // Default to true if not explicitly false
    timeSlots: []
  };
  
  // Handle timeSlots
  if (blockedDate.timeSlots && Array.isArray(blockedDate.timeSlots)) {
    result.timeSlots = blockedDate.timeSlots.map(normalizeTimeSlot);
  } else {
    result.timeSlots = [];
  }
  
  return result;
};

// Normalize a special date
const normalizeSpecialDate = (specialDate: any): SpecialDate => {
  // Handle different property formats
  const result: SpecialDate = {
    date: specialDate.date || '',
    isActive: specialDate.isActive !== false, // Default to true if not explicitly false
    timeSlots: [],
    scheduleId: specialDate.scheduleId || 'default'
  };
  
  // Handle timeSlots
  if (specialDate.timeSlots && Array.isArray(specialDate.timeSlots)) {
    result.timeSlots = specialDate.timeSlots.map(normalizeTimeSlot);
  } else {
    result.timeSlots = [];
  }
  
  return result;
};

// Helper function to normalize time slot properties
export const normalizeTimeSlot = (timeSlot: any): TimeSlot => {
  let startTime = '';
  let endTime = '';
  
  // Handle both property naming conventions
  if (typeof timeSlot === 'object' && timeSlot !== null) {
    startTime = timeSlot.startTime || timeSlot.start || '09:00';
    endTime = timeSlot.endTime || timeSlot.end || '17:00';
  } else {
    startTime = '09:00';
    endTime = '17:00';
  }
  
  return {
    startTime: startTime,
    endTime: endTime,
    start: startTime,
    end: endTime
  };
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
  const defaultTimeSlot = createTimeSlot('09:00', '17:00');
  
  const defaultSchedule: RegularSchedule = {
    monday: { isActive: true, timeSlots: [defaultTimeSlot] },
    tuesday: { isActive: true, timeSlots: [defaultTimeSlot] },
    wednesday: { isActive: true, timeSlots: [defaultTimeSlot] },
    thursday: { isActive: true, timeSlots: [defaultTimeSlot] },
    friday: { isActive: true, timeSlots: [defaultTimeSlot] },
    saturday: { isActive: false, timeSlots: [] },
    sunday: { isActive: false, timeSlots: [] },
    // Add French mappings
    lundi: { isActive: true, timeSlots: [defaultTimeSlot] },
    mardi: { isActive: true, timeSlots: [defaultTimeSlot] },
    mercredi: { isActive: true, timeSlots: [defaultTimeSlot] },
    jeudi: { isActive: true, timeSlots: [defaultTimeSlot] },
    vendredi: { isActive: true, timeSlots: [defaultTimeSlot] },
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
    
    // Make sure all days have proper data structure
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 
                 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    
    days.forEach(day => {
      if (!schedule[day]) {
        schedule[day] = { isActive: day.startsWith('s') ? false : true, timeSlots: [] };
      }
      
      if (!schedule[day].timeSlots) {
        schedule[day].timeSlots = [];
      }
      
      // Normalize all time slots
      schedule[day].timeSlots = schedule[day].timeSlots.map(normalizeTimeSlot);
    });
    
    return schedule;
  } catch (e) {
    console.error('Error parsing regular schedule:', e);
    return createDefaultSchedule();
  }
};

// Create default schedule
const createDefaultSchedule = (): RegularSchedule => {
  const defaultTimeSlot = createTimeSlot('09:00', '17:00');
  
  return {
    monday: { isActive: true, timeSlots: [defaultTimeSlot] },
    tuesday: { isActive: true, timeSlots: [defaultTimeSlot] },
    wednesday: { isActive: true, timeSlots: [defaultTimeSlot] },
    thursday: { isActive: true, timeSlots: [defaultTimeSlot] },
    friday: { isActive: true, timeSlots: [defaultTimeSlot] },
    saturday: { isActive: false, timeSlots: [] },
    sunday: { isActive: false, timeSlots: [] },
    // Add French mappings
    lundi: { isActive: true, timeSlots: [defaultTimeSlot] },
    mardi: { isActive: true, timeSlots: [defaultTimeSlot] },
    mercredi: { isActive: true, timeSlots: [defaultTimeSlot] },
    jeudi: { isActive: true, timeSlots: [defaultTimeSlot] },
    vendredi: { isActive: true, timeSlots: [defaultTimeSlot] },
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
    const availabilitySettings = await getAvailabilitySettings(businessId);
    
    // Créneaux par défaut (9h à 18h)
    const defaultStartHour = 9;
    const defaultEndHour = 18;
    const defaultInterval = 30; // minutes
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayOfWeek = format(date, 'EEEE', { locale: fr }).toLowerCase();
    
    // Vérifier si la date est bloquée
    const isBlocked = availabilitySettings.blockedDates.some(blockedDate => 
      blockedDate.date === dateStr && blockedDate.fullDay
    );
    
    if (isBlocked) {
      return []; // Aucun créneau disponible pour les dates bloquées
    }
    
    // Vérifier si la date a des horaires spéciaux
    const specialDate = availabilitySettings.specialDates.find(sd => sd.date === dateStr);
    
    if (specialDate) {
      if (!specialDate.isActive) {
        return []; // Jour non disponible
      }
      
      if (specialDate.timeSlots && specialDate.timeSlots.length > 0) {
        // Générer des créneaux pour chaque plage horaire
        let availableSlots: string[] = [];
        
        for (const slot of specialDate.timeSlots) {
          const startHour = parseInt(slot.startTime.split(':')[0] || '9');
          const endHour = parseInt(slot.endTime.split(':')[0] || '18');
          
          const slotsForRange = generateTimeSlots(startHour, endHour, defaultInterval);
          availableSlots = [...availableSlots, ...slotsForRange];
        }
        
        return filterAvailableSlots(businessId, date, availableSlots, duration);
      }
    }
    
    // Utiliser l'horaire régulier pour le jour de la semaine
    const daySchedule = availabilitySettings.regularSchedule[dayOfWeek];
    
    if (daySchedule) {
      if (!daySchedule.isActive) {
        return []; // Jour non disponible
      }
      
      if (daySchedule.timeSlots && daySchedule.timeSlots.length > 0) {
        // Générer des créneaux pour chaque plage horaire
        let availableSlots: string[] = [];
        
        for (const slot of daySchedule.timeSlots) {
          const startHour = parseInt(slot.startTime.split(':')[0] || '9');
          const endHour = parseInt(slot.endTime.split(':')[0] || '18');
          
          const slotsForRange = generateTimeSlots(startHour, endHour, defaultInterval);
          availableSlots = [...availableSlots, ...slotsForRange];
        }
        
        return filterAvailableSlots(businessId, date, availableSlots, duration);
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
