
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Clock, X, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  AvailabilitySettings, 
  SpecialDate, 
  TimeSlot, 
  createTimeSlot 
} from '@/services/booking/availabilityService';

interface SpecialDatesProps {
  settings: AvailabilitySettings;
  onSettingsChange: (settings: AvailabilitySettings) => void;
}

const SpecialDates: React.FC<SpecialDatesProps> = ({ settings, onSettingsChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [specialDateDialog, setSpecialDateDialog] = useState(false);
  const [specialDateIsActive, setSpecialDateIsActive] = useState(true);
  const [specialDateTimeSlots, setSpecialDateTimeSlots] = useState<TimeSlot[]>([createTimeSlot("09:00", "17:00")]);
  
  // Format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Check if a date has special schedule
  const hasSpecialSchedule = (date: Date): boolean => {
    const dateString = formatDate(date);
    return settings.specialDates.some(sd => sd.date === dateString);
  };

  const handleAddSpecialDate = () => {
    if (!selectedDate) return;
    
    const dateString = formatDate(selectedDate);
    const newSpecialDate: SpecialDate = {
      date: dateString,
      scheduleId: settings.activeScheduleId,
      isActive: specialDateIsActive,
      timeSlots: specialDateIsActive ? [...specialDateTimeSlots] : []
    };
    
    // Remove any existing special date for the same date
    const filteredDates = settings.specialDates.filter(sd => sd.date !== dateString);
    
    // Update settings
    const newSettings = {
      ...settings,
      specialDates: [...filteredDates, newSpecialDate]
    };
    
    onSettingsChange(newSettings);
    setSpecialDateDialog(false);
    toast.success("Horaires spéciaux ajoutés avec succès");
  };
  
  const handleRemoveSpecialDate = (date: string) => {
    const newSettings = {
      ...settings,
      specialDates: settings.specialDates.filter(sd => sd.date !== date)
    };
    
    onSettingsChange(newSettings);
    toast.success("Horaires spéciaux supprimés");
  };
  
  const handleSpecialTimeSlotAdd = () => {
    setSpecialDateTimeSlots(prev => [...prev, createTimeSlot("09:00", "17:00")]);
  };
  
  const handleSpecialTimeSlotRemove = (index: number) => {
    setSpecialDateTimeSlots(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSpecialTimeSlotChange = (index: number, field: "start" | "end", value: string) => {
    setSpecialDateTimeSlots(prev => {
      const newSlots = [...prev];
      if (field === "start") {
        newSlots[index] = {
          ...newSlots[index],
          start: value,
          startTime: value
        };
      } else {
        newSlots[index] = {
          ...newSlots[index],
          end: value,
          endTime: value
        };
      }
      return newSlots;
    });
  };
  
  // When selected date changes, reset dialog values or load existing values
  useEffect(() => {
    if (selectedDate) {
      const dateString = formatDate(selectedDate);
      const existingSpecial = settings.specialDates.find(sd => sd.date === dateString);
      
      if (existingSpecial) {
        setSpecialDateIsActive(existingSpecial.isActive);
        if (existingSpecial.isActive && existingSpecial.timeSlots.length > 0) {
          setSpecialDateTimeSlots([...existingSpecial.timeSlots]);
        } else {
          setSpecialDateTimeSlots([createTimeSlot("09:00", "17:00")]);
        }
      } else {
        setSpecialDateIsActive(true);
        setSpecialDateTimeSlots([createTimeSlot("09:00", "17:00")]);
      }
    }
  }, [selectedDate, settings.specialDates]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Horaires spéciaux</CardTitle>
        <CardDescription>
          Définissez des horaires spécifiques pour certains jours qui diffèrent de votre planning habituel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="rounded-md border">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                  special: (date) => hasSpecialSchedule(date),
                }}
                modifiersClassNames={{
                  special: "bg-blue-100 text-blue-500 font-bold",
                }}
                className="rounded-md border"
              />
            </div>
            
            <div className="mt-4">
              <Dialog open={specialDateDialog} onOpenChange={setSpecialDateDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Définir horaires spéciaux
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Horaires spéciaux</DialogTitle>
                    <DialogDescription>
                      {selectedDate && (
                        <span className="font-medium">
                          {selectedDate.toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </span>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={specialDateIsActive}
                        onCheckedChange={setSpecialDateIsActive}
                        id="day-active"
                      />
                      <Label htmlFor="day-active">Jour disponible pour les réservations</Label>
                    </div>
                    
                    {specialDateIsActive && (
                      <div className="space-y-4 mt-2">
                        <Label>Plages horaires disponibles ce jour</Label>
                        {specialDateTimeSlots.map((slot, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Select
                              value={slot.start}
                              onValueChange={(value) => handleSpecialTimeSlotChange(index, "start", value)}
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
                              onValueChange={(value) => handleSpecialTimeSlotChange(index, "end", value)}
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
                              onClick={() => handleSpecialTimeSlotRemove(index)}
                              disabled={specialDateTimeSlots.length <= 1}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSpecialTimeSlotAdd}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Ajouter une plage
                        </Button>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSpecialDateDialog(false)}>Annuler</Button>
                    <Button onClick={handleAddSpecialDate}>Confirmer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium mb-3">Dates avec horaires spéciaux</h3>
            {settings.specialDates.length > 0 ? (
              <div className="space-y-2">
                {settings.specialDates.map((specialDate, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <span className="font-medium">
                        {new Date(specialDate.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        {specialDate.isActive ? (
                          <>
                            {specialDate.timeSlots.map((slot, i) => (
                              <div key={i}>
                                {slot.start} - {slot.end}
                              </div>
                            ))}
                          </>
                        ) : (
                          "Jour non disponible"
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSpecialDate(specialDate.date)}
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun horaire spécial défini. Sélectionnez une date et cliquez sur "Définir horaires spéciaux".
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpecialDates;
