
import { useState, useEffect } from 'react';
import { Service } from '@/types/service';

interface TimeSlotManagerProps {
  selectedDate: Date | undefined;
  selectedService: Service | null;
  onTimesChange: (times: string[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

export const useTimeSlots = ({ 
  selectedDate, 
  selectedService, 
  onTimesChange, 
  onLoadingChange 
}: TimeSlotManagerProps) => {
  
  useEffect(() => {
    const generateTimeSlots = async () => {
      if (!selectedDate || !selectedService) {
        onTimesChange([]);
        return;
      }
      
      onLoadingChange(true);
      
      try {
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Générer des créneaux toutes les 30 minutes de 8h à 18h
        const times = [];
        const startHour = 8;
        const endHour = 18;
        
        for (let hour = startHour; hour < endHour; hour++) {
          times.push(`${hour.toString().padStart(2, '0')}:00`);
          times.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        
        onTimesChange(times);
      } catch (error) {
        console.error('Erreur lors de la génération des créneaux:', error);
        onTimesChange([]);
      } finally {
        onLoadingChange(false);
      }
    };
    
    generateTimeSlots();
  }, [selectedDate, selectedService, onTimesChange, onLoadingChange]);
};
