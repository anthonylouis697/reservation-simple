
import React, { useEffect, useState } from 'react';
import { format, isToday, isAfter, addDays, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader } from 'lucide-react';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { getAvailabilitySettings, AvailabilitySettings, getDayName } from '@/services/booking/availabilityService';

interface DateSelectionProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  businessId: string;
  customTexts: BookingCustomTexts;
  getButtonStyle: () => { className: string; style: { backgroundColor: string; borderColor: string } };
}

// Export the component
const DateSelection = ({
  selectedDate,
  onSelectDate,
  businessId,
  customTexts,
  getButtonStyle
}: DateSelectionProps) => {
  const [availabilitySettings, setAvailabilitySettings] = useState<AvailabilitySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load availability settings
  useEffect(() => {
    const loadAvailability = async () => {
      if (!businessId) return;
      
      try {
        setIsLoading(true);
        const settings = await getAvailabilitySettings(businessId);
        setAvailabilitySettings(settings);
      } catch (error) {
        console.error('Error loading availability settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAvailability();
  }, [businessId]);
  
  // Function to check if a date should be disabled based on availability settings
  const isDateDisabled = (date: Date) => {
    if (!availabilitySettings) return false;
    
    // Don't allow past dates
    if (!isAfter(date, new Date())) return true;
    
    // Don't allow dates too far in the future
    if (isAfter(date, addDays(new Date(), availabilitySettings.advanceBookingDays))) {
      return true;
    }
    
    // Check for blocked dates
    const dateString = format(date, 'yyyy-MM-dd');
    const isFullyBlocked = availabilitySettings.blockedDates.some(
      blocked => blocked.date === dateString && blocked.fullDay
    );
    if (isFullyBlocked) return true;
    
    // Check day of week against regular schedule
    const dayOfWeek = getDayName(date);
    const activeScheduleId = availabilitySettings.activeScheduleId;
    const activeSchedule = availabilitySettings.scheduleSets.find(
      set => set.id === activeScheduleId
    );
    
    if (!activeSchedule) return true;
    
    // Check if the day is active in the regular schedule
    const isActiveDay = activeSchedule.regularSchedule[dayOfWeek].isActive;
    if (!isActiveDay) return true;
    
    // Check if there are any time slots for this day
    const hasTimeSlots = activeSchedule.regularSchedule[dayOfWeek].timeSlots.length > 0;
    if (!hasTimeSlots) return true;
    
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">
          {customTexts.dateSelectionTitle || "Sélection de la date"}
        </h2>
        <p className="text-gray-600 mt-2">
          {customTexts.dateSelectionDescription || "Choisissez une date pour votre rendez-vous"}
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="flex flex-col items-center">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-gray-600">Chargement du calendrier...</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            disabled={isDateDisabled}
            locale={fr}
            className="border rounded-md p-3"
            classNames={{
              day_today: "bg-accent text-accent-foreground"
            }}
            // Fix: Remove the styles prop with day_selected and use classNames instead
            classNames={{
              day_today: "bg-accent text-accent-foreground",
              day_selected: cn("bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground")
            }}
            fromDate={new Date()}
            toDate={addMonths(new Date(), 3)}
            initialFocus
          />
        </div>
      )}
      
      {selectedDate && (
        <div className="text-center mt-6">
          <div 
            className="inline-block py-2 px-4 rounded-md"
            style={getButtonStyle().style}
          >
            <div className="flex items-center gap-2 text-white">
              <CalendarIcon className="h-4 w-4" />
              <span className="font-medium">
                {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelection;
