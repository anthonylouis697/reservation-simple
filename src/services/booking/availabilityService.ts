
import { supabase } from '@/integrations/supabase/client';
import { combineDateTime } from './dateUtils';

// Type definitions for availability
export interface TimeSlot {
  start: string;
  end: string;
}

export interface DaySchedule {
  isActive: boolean;
  timeSlots: TimeSlot[];
}

export interface SpecialDate {
  date: string;
  isActive: boolean;
  timeSlots: TimeSlot[];
}

export interface AvailabilitySettings {
  businessId: string;
  regularSchedule: {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
  };
  specialDates: SpecialDate[];
  blockedDates: string[];
  bufferTimeMinutes: number;
  advanceBookingDays: number;
  minAdvanceHours: number;
}

// Default availability settings
export const defaultAvailabilitySettings: AvailabilitySettings = {
  businessId: '',
  regularSchedule: {
    monday: { isActive: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    tuesday: { isActive: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    wednesday: { isActive: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    thursday: { isActive: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    friday: { isActive: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
    saturday: { isActive: false, timeSlots: [] },
    sunday: { isActive: false, timeSlots: [] },
  },
  specialDates: [],
  blockedDates: [],
  bufferTimeMinutes: 15,
  advanceBookingDays: 30,
  minAdvanceHours: 24
};

// Function to get availability settings for a business
export const getAvailabilitySettings = async (businessId: string): Promise<AvailabilitySettings> => {
  try {
    // Use a raw query approach to avoid TypeScript errors while the migration is being integrated
    const { data, error } = await supabase
      .from('availability_settings')
      .select('*')
      .eq('business_id', businessId)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      return {
        ...defaultAvailabilitySettings,
        businessId
      };
    }
    
    // Manually map the database fields to our TypeScript interface
    return {
      businessId,
      regularSchedule: data.regular_schedule || defaultAvailabilitySettings.regularSchedule,
      specialDates: data.special_dates || [],
      blockedDates: data.blocked_dates || [],
      bufferTimeMinutes: data.buffer_time_minutes || 15,
      advanceBookingDays: data.advance_booking_days || 30,
      minAdvanceHours: data.min_advance_hours || 24
    } as AvailabilitySettings;
  } catch (error) {
    console.error("Error fetching availability settings:", error);
    return {
      ...defaultAvailabilitySettings,
      businessId
    };
  }
};

// Function to save availability settings
export const saveAvailabilitySettings = async (settings: AvailabilitySettings): Promise<boolean> => {
  try {
    // Use explicit typing to avoid TypeScript errors
    const { error } = await supabase
      .from('availability_settings')
      .upsert({
        business_id: settings.businessId,
        regular_schedule: settings.regularSchedule,
        special_dates: settings.specialDates,
        blocked_dates: settings.blockedDates,
        buffer_time_minutes: settings.bufferTimeMinutes,
        advance_booking_days: settings.advanceBookingDays,
        min_advance_hours: settings.minAdvanceHours
      }, {
        onConflict: 'business_id'
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error saving availability settings:", error);
    return false;
  }
};

// Helper function to get day name from date
const getDayName = (date: Date): 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()] as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
};

// Format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Check if a date is in the blocked dates list
const isDateBlocked = (date: Date, blockedDates: string[]): boolean => {
  const dateString = formatDate(date);
  return blockedDates.includes(dateString);
};

// Find special schedule for a specific date
const findSpecialSchedule = (date: Date, specialDates: SpecialDate[]): DaySchedule | null => {
  const dateString = formatDate(date);
  const specialDate = specialDates.find(sd => sd.date === dateString);
  
  if (specialDate) {
    return {
      isActive: specialDate.isActive,
      timeSlots: specialDate.timeSlots
    };
  }
  
  return null;
};

// Check if a time slot is available based on the schedule
export const checkAvailability = async (
  businessId: string, 
  date: Date, 
  time: string, 
  durationMinutes: number
): Promise<boolean> => {
  try {
    // Get business availability settings
    const settings = await getAvailabilitySettings(businessId);
    
    // Check if date is blocked
    if (isDateBlocked(date, settings.blockedDates)) {
      return false;
    }
    
    // Get the day schedule (regular or special)
    const specialSchedule = findSpecialSchedule(date, settings.specialDates);
    const dayOfWeek = getDayName(date);
    const daySchedule = specialSchedule || settings.regularSchedule[dayOfWeek];
    
    // If day is not active, it's not available
    if (!daySchedule.isActive) {
      return false;
    }
    
    // Check if requested time is within any of the day's time slots
    const requestedStart = combineDateTime(date, time);
    const requestedEnd = new Date(requestedStart.getTime() + durationMinutes * 60 * 1000);
    
    // Check if time is within any of the available slots
    let isWithinTimeSlot = false;
    
    for (const slot of daySchedule.timeSlots) {
      const slotStart = combineDateTime(date, slot.start);
      const slotEnd = combineDateTime(date, slot.end);
      
      // Time slot is available if request starts after slot start and ends before slot end
      if (requestedStart >= slotStart && requestedEnd <= slotEnd) {
        isWithinTimeSlot = true;
        break;
      }
    }
    
    if (!isWithinTimeSlot) {
      return false;
    }
    
    // In a real system, we'd also check for existing reservations here
    // For demo purposes, we'll simulate that 90% of slots are available
    return Math.random() > 0.1;
  } catch (error) {
    console.error("Error checking availability:", error);
    return false;
  }
};

// Get available time slots for a specific date
export const getAvailableTimeSlots = async (
  businessId: string, 
  date: Date, 
  serviceDuration: number
): Promise<string[]> => {
  try {
    // Get business availability settings
    const settings = await getAvailabilitySettings(businessId);
    
    // Check if date is blocked
    if (isDateBlocked(date, settings.blockedDates)) {
      return [];
    }
    
    // Get the day schedule (regular or special)
    const specialSchedule = findSpecialSchedule(date, settings.specialDates);
    const dayOfWeek = getDayName(date);
    const daySchedule = specialSchedule || settings.regularSchedule[dayOfWeek];
    
    // If day is not active, return empty array
    if (!daySchedule.isActive || !daySchedule.timeSlots.length) {
      return [];
    }
    
    const availableSlots: string[] = [];
    const serviceDurationMs = serviceDuration * 60 * 1000;
    const bufferTimeMs = settings.bufferTimeMinutes * 60 * 1000;
    
    // For each time slot in the day's schedule
    for (const slot of daySchedule.timeSlots) {
      const slotStart = combineDateTime(date, slot.start);
      const slotEnd = combineDateTime(date, slot.end);
      
      // Generate time slots every 15/30 minutes depending on service duration
      const slotInterval = Math.min(30, Math.max(15, Math.floor(serviceDuration / 2))) * 60 * 1000;
      
      // Start time
      let currentTime = slotStart.getTime();
      
      // Generate all possible time slots within the time range
      while (currentTime + serviceDurationMs <= slotEnd.getTime()) {
        const timeString = new Date(currentTime).toTimeString().substring(0, 5);
        
        // In a real system, we'd check if this time conflicts with existing reservations
        // For now, we'll just add all slots (with 10% random unavailability for demo)
        if (Math.random() > 0.1) {
          availableSlots.push(timeString);
        }
        
        // Move to next time slot
        currentTime += slotInterval;
      }
    }
    
    return availableSlots;
  } catch (error) {
    console.error("Error getting available time slots:", error);
    return [];
  }
};
