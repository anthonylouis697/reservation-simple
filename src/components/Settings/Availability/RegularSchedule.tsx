
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Clock, Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AvailabilitySettings, TimeSlot, createTimeSlot } from '@/services/booking/availabilityService';

type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

const dayLabels: Record<WeekDay, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche"
};

// Define the correct day order
const orderedDays: WeekDay[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

interface RegularScheduleProps {
  settings: AvailabilitySettings;
  onSettingsChange: (settings: AvailabilitySettings) => void;
}

const RegularSchedule: React.FC<RegularScheduleProps> = ({ settings, onSettingsChange }) => {
  const activeSchedule = settings.scheduleSets.find(s => s.id === settings.activeScheduleId) || settings.scheduleSets[0];
  
  const handleToggleDay = (day: WeekDay) => {
    const newSettings = { ...settings };
    const schedule = newSettings.scheduleSets.find(s => s.id === settings.activeScheduleId);
    
    if (schedule) {
      schedule.regularSchedule[day] = {
        ...schedule.regularSchedule[day],
        isActive: !schedule.regularSchedule[day].isActive
      };
      
      onSettingsChange(newSettings);
    }
  };
  
  const handleAddTimeSlot = (day: WeekDay) => {
    const newSettings = { ...settings };
    const schedule = newSettings.scheduleSets.find(s => s.id === settings.activeScheduleId);
    
    if (schedule) {
      schedule.regularSchedule[day] = {
        ...schedule.regularSchedule[day],
        timeSlots: [
          ...schedule.regularSchedule[day].timeSlots,
          createTimeSlot("09:00", "17:00")
        ]
      };
      
      onSettingsChange(newSettings);
    }
  };

  const handleRemoveTimeSlot = (day: WeekDay, index: number) => {
    const newSettings = { ...settings };
    const schedule = newSettings.scheduleSets.find(s => s.id === settings.activeScheduleId);
    
    if (schedule) {
      schedule.regularSchedule[day] = {
        ...schedule.regularSchedule[day],
        timeSlots: schedule.regularSchedule[day].timeSlots.filter((_, i) => i !== index)
      };
      
      onSettingsChange(newSettings);
    }
  };
  
  const handleTimeChange = (day: WeekDay, index: number, field: "start" | "end", value: string) => {
    const newSettings = JSON.parse(JSON.stringify(settings)) as AvailabilitySettings;
    const schedule = newSettings.scheduleSets.find(s => s.id === settings.activeScheduleId);
    
    if (schedule) {
      const updatedTimeSlots = [...schedule.regularSchedule[day].timeSlots];
      if (field === "start") {
        updatedTimeSlots[index] = { 
          ...updatedTimeSlots[index], 
          start: value,
          startTime: value
        };
      } else {
        updatedTimeSlots[index] = { 
          ...updatedTimeSlots[index], 
          end: value,
          endTime: value
        };
      }
      
      schedule.regularSchedule[day] = {
        ...schedule.regularSchedule[day],
        timeSlots: updatedTimeSlots
      };
      
      onSettingsChange(newSettings);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horaires hebdomadaires</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Use the orderedDays array to render days in correct order */}
          {orderedDays.map((day) => {
            const daySchedule = activeSchedule.regularSchedule[day];
            return (
              <div key={day} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={daySchedule.isActive}
                      onCheckedChange={() => handleToggleDay(day as WeekDay)}
                      id={`day-${day}`}
                    />
                    <Label htmlFor={`day-${day}`} className="font-medium">{dayLabels[day]}</Label>
                  </div>
                  
                  {daySchedule.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddTimeSlot(day)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Ajouter une plage
                    </Button>
                  )}
                </div>
                
                {daySchedule.isActive && daySchedule.timeSlots.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {daySchedule.timeSlots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Select
                          value={slot.start}
                          onValueChange={(value) => handleTimeChange(day, index, "start", value)}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue>{slot.start}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, "0");
                              return [
                                <SelectItem key={`${hour}:00`} value={`${hour}:00`}>{`${hour}:00`}</SelectItem>,
                                <SelectItem key={`${hour}:30`} value={`${hour}:30`}>{`${hour}:30`}</SelectItem>
                              ];
                            }).flat()}
                          </SelectContent>
                        </Select>
                        <span>-</span>
                        <Select
                          value={slot.end}
                          onValueChange={(value) => handleTimeChange(day, index, "end", value)}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue>{slot.end}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, "0");
                              return [
                                <SelectItem key={`${hour}:00`} value={`${hour}:00`}>{`${hour}:00`}</SelectItem>,
                                <SelectItem key={`${hour}:30`} value={`${hour}:30`}>{`${hour}:30`}</SelectItem>
                              ];
                            }).flat()}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTimeSlot(day, index)}
                          disabled={daySchedule.timeSlots.length <= 1}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                {daySchedule.isActive && daySchedule.timeSlots.length === 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Aucune plage horaire définie pour ce jour.
                  </p>
                )}
                
                {!daySchedule.isActive && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Ce jour n'est pas disponible pour les réservations.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegularSchedule;
