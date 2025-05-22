
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Service } from '@/types/service';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';
import { Clock } from 'lucide-react';
import { getAvailableTimeSlots } from '@/services/booking/availabilityService';

interface TimeSelectionProps {
  customTexts: BookingCustomTexts;
  isLoadingTimes: boolean;
  availableTimes: string[];
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
  selectedService: Service | null;
  selectedDate: Date | undefined;
  getButtonStyle: () => { className: string; style: { backgroundColor: string; borderColor: string } };
  businessId?: string;
}

const TimeSelection = ({
  customTexts = defaultCustomTexts,
  isLoadingTimes,
  availableTimes = [],
  selectedTime,
  setSelectedTime,
  selectedService,
  selectedDate,
  getButtonStyle,
  businessId
}: TimeSelectionProps) => {
  const [timeSlots, setTimeSlots] = useState<string[]>(availableTimes);
  const [loading, setLoading] = useState(isLoadingTimes);

  // Ensure customTexts has safe defaults
  const safeCustomTexts = customTexts || defaultCustomTexts;
  const selectTimeLabel = safeCustomTexts.selectTimeLabel || "Sélectionnez un horaire";

  // Load time slots from API when selectedDate or selectedService changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate || !selectedService || !businessId) {
        return;
      }

      setLoading(true);
      try {
        const availableSlots = await getAvailableTimeSlots(
          businessId,
          selectedDate,
          selectedService.duration
        );
        setTimeSlots(availableSlots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };

    // Use provided availableTimes if present, otherwise fetch from API
    if (availableTimes && availableTimes.length > 0) {
      setTimeSlots(availableTimes);
      setLoading(false);
    } else if (businessId) {
      fetchTimeSlots();
    } else {
      // Fallback to generate mock times for demo purposes
      setTimeSlots(generateTimeSlotsForDate(selectedDate));
      setLoading(false);
    }
  }, [selectedDate, selectedService, businessId, availableTimes]);

  // Generate time slots based on the day
  const generateTimeSlotsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = date.getDay();
    
    // Base time slots
    const baseSlots = [
      "09:00", "09:30", "10:00", "10:30", 
      "11:00", "11:30", "14:00", "14:30",
      "15:00", "15:30", "16:00", "16:30", 
      "17:00", "17:30"
    ];
    
    // Simulate different availabilities based on day of week
    if (dayOfWeek === 0) { // Sunday - limited hours
      return ["10:00", "10:30", "11:00", "11:30"];
    } else if (dayOfWeek === 6) { // Saturday
      return baseSlots.filter((_, index) => index % 2 === 0); // Every other slot
    } else if (dayOfWeek === 5) { // Friday
      return [...baseSlots, "18:00", "18:30"]; // Extended hours
    } else if (dayOfWeek === 3) { // Wednesday
      return baseSlots.filter(slot => !slot.startsWith("09")); // No early morning
    }
    
    return baseSlots;
  };

  // Organize time slots by time of day
  const organizeTimeSlots = (slots: string[]) => {
    const morning: string[] = [];
    const afternoon: string[] = [];
    const evening: string[] = [];
    
    slots.forEach(time => {
      const hour = parseInt(time.split(':')[0]);
      if (hour < 12) {
        morning.push(time);
      } else if (hour < 17) {
        afternoon.push(time);
      } else {
        evening.push(time);
      }
    });
    
    return { morning, afternoon, evening };
  };
  
  const { morning, afternoon, evening } = organizeTimeSlots(timeSlots);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">
          {selectTimeLabel}
        </h2>
        
        {selectedService && selectedDate && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md inline-block">
            <p className="font-medium">{selectedService.name}</p>
            <p className="text-sm text-gray-500">
              {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </p>
            <p className="text-sm text-gray-500">
              {selectedService.duration} min - {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(selectedService.price)}
            </p>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Matin */}
          {morning.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Matin</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {morning.map((time) => (
                  <button
                    key={`morning-${time}`}
                    className={`py-2 px-1 border rounded-md text-center transition-colors ${
                      selectedTime === time
                        ? "border-primary text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={
                      selectedTime === time
                        ? getButtonStyle().style
                        : {}
                    }
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Après-midi */}
          {afternoon.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Après-midi</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {afternoon.map((time) => (
                  <button
                    key={`afternoon-${time}`}
                    className={`py-2 px-1 border rounded-md text-center transition-colors ${
                      selectedTime === time
                        ? "border-primary text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={
                      selectedTime === time
                        ? getButtonStyle().style
                        : {}
                    }
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Soir */}
          {evening.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Soirée</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {evening.map((time) => (
                  <button
                    key={`evening-${time}`}
                    className={`py-2 px-1 border rounded-md text-center transition-colors ${
                      selectedTime === time
                        ? "border-primary text-white"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={
                      selectedTime === time
                        ? getButtonStyle().style
                        : {}
                    }
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {!loading && timeSlots.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun horaire disponible pour cette date</p>
          <p className="text-sm text-gray-500 mt-2">Veuillez sélectionner une autre date</p>
        </div>
      )}
    </div>
  );
};

export default TimeSelection;
