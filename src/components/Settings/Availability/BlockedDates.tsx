
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { X, CalendarX, Clock } from 'lucide-react';
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
import { AvailabilitySettings, BlockedTime, TimeSlot } from '@/services/booking/availabilityService';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface BlockedDatesProps {
  settings: AvailabilitySettings;
  onSettingsChange: (settings: AvailabilitySettings) => void;
}

const BlockedDates: React.FC<BlockedDatesProps> = ({ settings, onSettingsChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [blockDateDialog, setBlockDateDialog] = useState(false);
  const [blockingFullDay, setBlockingFullDay] = useState(true);
  const [blockTimeSlots, setBlockTimeSlots] = useState<TimeSlot[]>([{ start: "09:00", end: "17:00" }]);
  
  // Format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Check if a date is blocked
  const isDateBlocked = (date: Date): boolean => {
    const dateString = formatDate(date);
    return settings.blockedDates.some(bd => bd.date === dateString);
  };

  const handleAddBlockedTime = () => {
    if (!selectedDate) return;
    
    const dateString = formatDate(selectedDate);
    const newBlockedDate: BlockedTime = {
      date: dateString,
      fullDay: blockingFullDay,
      timeSlots: blockingFullDay ? [] : JSON.parse(JSON.stringify(blockTimeSlots))
    };
    
    // Remove any existing blocked date for the same date
    const filteredDates = settings.blockedDates.filter(bd => bd.date !== dateString);
    
    // Update settings
    const newSettings = {
      ...settings,
      blockedDates: [...filteredDates, newBlockedDate]
    };
    
    onSettingsChange(newSettings);
    setBlockDateDialog(false);
    toast.success("Date bloquée avec succès");
  };
  
  const handleRemoveBlockedDate = (date: string) => {
    const newSettings = {
      ...settings,
      blockedDates: settings.blockedDates.filter(bd => bd.date !== date)
    };
    
    onSettingsChange(newSettings);
    toast.success("Date débloquée");
  };
  
  const handleBlockTimeSlotAdd = () => {
    setBlockTimeSlots(prev => [...prev, { start: "09:00", end: "17:00" }]);
  };
  
  const handleBlockTimeSlotRemove = (index: number) => {
    setBlockTimeSlots(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleBlockTimeSlotChange = (index: number, field: "start" | "end", value: string) => {
    setBlockTimeSlots(prev => {
      const newSlots = [...prev];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return newSlots;
    });
  };
  
  // When selected date changes, reset dialog values or load existing values
  React.useEffect(() => {
    if (selectedDate) {
      const dateString = formatDate(selectedDate);
      const existingBlock = settings.blockedDates.find(bd => bd.date === dateString);
      
      if (existingBlock) {
        setBlockingFullDay(existingBlock.fullDay);
        setBlockTimeSlots(existingBlock.fullDay ? [{ start: "09:00", end: "17:00" }] : [...existingBlock.timeSlots]);
      } else {
        setBlockingFullDay(true);
        setBlockTimeSlots([{ start: "09:00", end: "17:00" }]);
      }
    }
  }, [selectedDate, settings.blockedDates]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jours bloqués</CardTitle>
        <CardDescription>
          Bloquez des dates spécifiques où vous ne serez pas disponible.
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
                  blocked: (date) => isDateBlocked(date),
                }}
                modifiersClassNames={{
                  blocked: "bg-red-100 text-red-500 font-bold",
                }}
                className="rounded-md border"
              />
            </div>
            
            <div className="mt-4">
              <Dialog open={blockDateDialog} onOpenChange={setBlockDateDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <CalendarX className="h-4 w-4 mr-2" />
                    Bloquer une date
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Bloquer une date</DialogTitle>
                    <DialogDescription>
                      {selectedDate && (
                        <span className="font-medium">
                          {selectedDate.toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={blockingFullDay}
                        onCheckedChange={setBlockingFullDay}
                        id="full-day"
                      />
                      <Label htmlFor="full-day">Bloquer toute la journée</Label>
                    </div>
                    
                    {!blockingFullDay && (
                      <div className="space-y-4 mt-2">
                        <Label>Plages horaires à bloquer</Label>
                        {blockTimeSlots.map((slot, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Select
                              value={slot.start}
                              onValueChange={(value) => handleBlockTimeSlotChange(index, "start", value)}
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
                              onValueChange={(value) => handleBlockTimeSlotChange(index, "end", value)}
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
                              onClick={() => handleBlockTimeSlotRemove(index)}
                              disabled={blockTimeSlots.length <= 1}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBlockTimeSlotAdd}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Ajouter une plage
                        </Button>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setBlockDateDialog(false)}>Annuler</Button>
                    <Button onClick={handleAddBlockedTime}>Confirmer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium mb-3">Dates bloquées</h3>
            {settings.blockedDates.length > 0 ? (
              <div className="space-y-2">
                {settings.blockedDates.map((blockDate, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <span className="font-medium">
                        {new Date(blockDate.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        {blockDate.fullDay ? (
                          "Journée entière"
                        ) : (
                          <>
                            {blockDate.timeSlots.map((slot, i) => (
                              <div key={i}>
                                {slot.start} - {slot.end}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBlockedDate(blockDate.date)}
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucune date bloquée. Cliquez sur "Bloquer une date" pour en ajouter.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockedDates;
