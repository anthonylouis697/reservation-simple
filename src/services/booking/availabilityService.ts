
import { supabase } from '@/integrations/supabase/client';
import { combineDateTime } from './dateUtils';
import { Json } from '@/integrations/supabase/types';

// Type definitions for availability
export interface TimeSlot {
  start: string;
  end: string;
}

export interface DaySchedule {
  isActive: boolean;
  timeSlots: TimeSlot[];
}

export interface BlockedTime {
  date: string;
  fullDay: boolean;
  timeSlots: TimeSlot[];  // Used only when fullDay is false
}

export interface SpecialDate {
  date: string;
  scheduleId: number;
  isActive: boolean;
  timeSlots: TimeSlot[];
}

export interface ScheduleSet {
  id: number;
  name: string;
  regularSchedule: {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
  };
}

export interface AvailabilitySettings {
  businessId: string;
  scheduleSets: ScheduleSet[];
  activeScheduleId: number;
  specialDates: SpecialDate[];
  blockedDates: BlockedTime[];
  bufferTimeMinutes: number;
  advanceBookingDays: number;
  minAdvanceHours: number;
}

// Default availability settings
export const defaultAvailabilitySettings: AvailabilitySettings = {
  businessId: '',
  activeScheduleId: 1,
  scheduleSets: [
    {
      id: 1,
      name: "Horaires standard",
      regularSchedule: {
        monday: { isActive: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
        tuesday: { isActive: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
        wednesday: { isActive: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
        thursday: { isActive: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
        friday: { isActive: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
        saturday: { isActive: false, timeSlots: [] },
        sunday: { isActive: false, timeSlots: [] },
      }
    }
  ],
  specialDates: [],
  blockedDates: [],
  bufferTimeMinutes: 15,
  advanceBookingDays: 30,
  minAdvanceHours: 24
};

// Function to get availability settings for a business
export const getAvailabilitySettings = async (businessId: string): Promise<AvailabilitySettings> => {
  try {
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
    
    // Type assertion to avoid TypeScript errors
    const rawData = data as any;
    
    // Parse the data from the database
    const scheduleSets = rawData.schedule_sets ? 
      (typeof rawData.schedule_sets === 'string' ? 
        JSON.parse(rawData.schedule_sets) : rawData.schedule_sets)
      : defaultAvailabilitySettings.scheduleSets;
    
    const specialDates = rawData.special_dates ? 
      (typeof rawData.special_dates === 'string' ? 
        JSON.parse(rawData.special_dates) : rawData.special_dates)
      : [];
    
    const blockedDates = rawData.blocked_dates ? 
      (typeof rawData.blocked_dates === 'string' ? 
        JSON.parse(rawData.blocked_dates) : rawData.blocked_dates)
      : [];
    
    const settings: AvailabilitySettings = {
      businessId,
      activeScheduleId: rawData.active_schedule_id || 1,
      scheduleSets: scheduleSets,
      specialDates: specialDates,
      blockedDates: blockedDates,
      bufferTimeMinutes: rawData.buffer_time_minutes || 15,
      advanceBookingDays: rawData.advance_booking_days || 30,
      minAdvanceHours: rawData.min_advance_hours || 24
    };
    
    return settings;
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
    // Get the active schedule for regular_schedule field
    const activeSchedule = settings.scheduleSets.find(s => s.id === settings.activeScheduleId) || settings.scheduleSets[0];
    
    // Create a properly typed object for Supabase according to the database schema
    // Store the activeScheduleId and scheduleSets within the regular_schedule JSON object
    // since there's no dedicated column for them in the database
    const regularScheduleWithMeta = {
      ...activeSchedule.regularSchedule,
      _activeScheduleId: settings.activeScheduleId,
      _scheduleSets: settings.scheduleSets
    };
    
    const dbObject = {
      business_id: settings.businessId,
      regular_schedule: regularScheduleWithMeta as unknown as Json,
      special_dates: settings.specialDates as unknown as Json[],
      blocked_dates: settings.blockedDates as unknown as Json[],
      buffer_time_minutes: settings.bufferTimeMinutes,
      advance_booking_days: settings.advanceBookingDays,
      min_advance_hours: settings.minAdvanceHours
    };

    console.log("Saving availability settings:", dbObject);

    // Pass the properly typed object to upsert
    const { error } = await supabase
      .from('availability_settings')
      .upsert(dbObject, {
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

// Check if a date is blocked (fully or partially)
const isDateBlocked = (date: Date, blockedDates: BlockedTime[]): { isBlocked: boolean; fullDay: boolean; timeSlots: TimeSlot[] } => {
  const dateString = formatDate(date);
  const blockedDate = blockedDates.find(bd => bd.date === dateString);
  
  if (!blockedDate) {
    return { isBlocked: false, fullDay: false, timeSlots: [] };
  }
  
  return { 
    isBlocked: true, 
    fullDay: blockedDate.fullDay, 
    timeSlots: blockedDate.fullDay ? [] : blockedDate.timeSlots 
  };
};

// Find special schedule for a specific date
const findSpecialSchedule = (
  date: Date, 
  specialDates: SpecialDate[], 
  scheduleSets: ScheduleSet[]
): { found: boolean; schedule: DaySchedule | null; scheduleSetId: number } => {
  const dateString = formatDate(date);
  const specialDate = specialDates.find(sd => sd.date === dateString);
  
  if (specialDate) {
    if (specialDate.isActive) {
      return { 
        found: true, 
        schedule: { 
          isActive: specialDate.isActive, 
          timeSlots: specialDate.timeSlots 
        },
        scheduleSetId: specialDate.scheduleId
      };
    } else {
      return { found: true, schedule: { isActive: false, timeSlots: [] }, scheduleSetId: specialDate.scheduleId };
    }
  }
  
  return { found: false, schedule: null, scheduleSetId: 0 };
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
    
    // Check for blocked dates
    const blockedInfo = isDateBlocked(date, settings.blockedDates);
    if (blockedInfo.isBlocked) {
      // If the date is fully blocked, not available
      if (blockedInfo.fullDay) return false;
      
      // Check if the requested time falls within blocked timeSlots
      const requestedStart = combineDateTime(date, time);
      const requestedEnd = new Date(requestedStart.getTime() + durationMinutes * 60 * 1000);
      
      for (const slot of blockedInfo.timeSlots) {
        const slotStart = combineDateTime(date, slot.start);
        const slotEnd = combineDateTime(date, slot.end);
        
        // If the requested time overlaps with a blocked time slot
        if (!(requestedEnd <= slotStart || requestedStart >= slotEnd)) {
          return false;
        }
      }
    }
    
    // Check for special dates or use regular schedule
    const { found, schedule, scheduleSetId } = findSpecialSchedule(date, settings.specialDates, settings.scheduleSets);
    
    // If this date has a special schedule
    let daySchedule: DaySchedule | null = null;
    if (found && schedule) {
      daySchedule = schedule;
    } else {
      // Use the active schedule set
      const activeScheduleId = settings.activeScheduleId;
      const activeScheduleSet = settings.scheduleSets.find(s => s.id === activeScheduleId);
      
      if (!activeScheduleSet) return false;
      
      // Get the day of week schedule
      const dayOfWeek = getDayName(date);
      daySchedule = activeScheduleSet.regularSchedule[dayOfWeek];
    }
    
    // If day is not active, it's not available
    if (!daySchedule || !daySchedule.isActive || daySchedule.timeSlots.length === 0) {
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
    
    // Check for blocked dates
    const blockedInfo = isDateBlocked(date, settings.blockedDates);
    if (blockedInfo.isBlocked && blockedInfo.fullDay) {
      return []; // Day entirely blocked
    }
    
    // Get the day schedule (regular or special)
    const { found, schedule, scheduleSetId } = findSpecialSchedule(date, settings.specialDates, settings.scheduleSets);
    
    // Set daySchedule based on whether a special schedule was found
    let daySchedule: DaySchedule | null = null;
    if (found && schedule) {
      daySchedule = schedule;
    } else {
      // Use the active schedule set
      const activeScheduleId = settings.activeScheduleId;
      const activeScheduleSet = settings.scheduleSets.find(s => s.id === activeScheduleId);
      
      if (!activeScheduleSet) return [];
      
      // Get the day of week schedule
      const dayOfWeek = getDayName(date);
      daySchedule = activeScheduleSet.regularSchedule[dayOfWeek];
    }
    
    // If day is not active, return empty array
    if (!daySchedule || !daySchedule.isActive || !daySchedule.timeSlots.length) {
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
        
        // Check if the time slot is not blocked
        let isBlocked = false;
        if (blockedInfo.isBlocked && !blockedInfo.fullDay) {
          const slotEndTime = new Date(currentTime + serviceDurationMs);
          
          for (const blockedSlot of blockedInfo.timeSlots) {
            const blockedStart = combineDateTime(date, blockedSlot.start);
            const blockedEnd = combineDateTime(date, blockedSlot.end);
            
            // Check if current slot overlaps with any blocked period
            if (!(slotEndTime <= blockedStart || new Date(currentTime) >= blockedEnd)) {
              isBlocked = true;
              break;
            }
          }
        }
        
        // If not blocked, add to available slots
        if (!isBlocked && Math.random() > 0.1) { // 10% random unavailability for demo
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

