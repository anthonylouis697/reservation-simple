import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Plus, X, Calendar as CalendarIcon, CalendarX } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  AvailabilitySettings as AvailabilitySettingsType, 
  DaySchedule, 
  TimeSlot, 
  ScheduleSet,
  BlockedTime,
  SpecialDate 
} from '@/services/booking/availabilityService';

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

interface AvailabilitySettingsProps {
  initialSettings?: AvailabilitySettingsType;
  onChange?: (settings: AvailabilitySettingsType) => void;
}

const AvailabilitySettings = ({ initialSettings, onChange }: AvailabilitySettingsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("weekly");
  const [blockedDates, setBlockedDates] = useState<BlockedTime[]>([]);
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [scheduleSets, setScheduleSets] = useState<ScheduleSet[]>([]);
  const [activeScheduleId, setActiveScheduleId] = useState<number>(1);
  const [newScheduleName, setNewScheduleName] = useState<string>("");
  const [availabilityBuffer, setAvailabilityBuffer] = useState(15);
  const [advanceBookingLimit, setAdvanceBookingLimit] = useState(30);
  const [openNewScheduleDialog, setOpenNewScheduleDialog] = useState(false);
  const [blockDateDialog, setBlockDateDialog] = useState(false);
  const [blockingFullDay, setBlockingFullDay] = useState(true);
  const [blockTimeSlots, setBlockTimeSlots] = useState<TimeSlot[]>([{ start: "09:00", end: "17:00" }]);
  const [specialDateDialog, setSpecialDateDialog] = useState(false);
  const [specialDateScheduleId, setSpecialDateScheduleId] = useState<number>(1);
  const [specialDateIsActive, setSpecialDateIsActive] = useState(true);
  const [specialDateTimeSlots, setSpecialDateTimeSlots] = useState<TimeSlot[]>([{ start: "09:00", end: "17:00" }]);
  
  // Initialize from props if provided
  useEffect(() => {
    if (initialSettings) {
      setBlockedDates(initialSettings.blockedDates);
      setSpecialDates(initialSettings.specialDates);
      setScheduleSets(initialSettings.scheduleSets);
      setActiveScheduleId(initialSettings.activeScheduleId);
      setAvailabilityBuffer(initialSettings.bufferTimeMinutes);
      setAdvanceBookingLimit(initialSettings.advanceBookingDays);
    }
  }, [initialSettings]);

  // When settings change, notify parent component
  useEffect(() => {
    if (!onChange) return;
    
    const currentSettings: AvailabilitySettingsType = {
      businessId: initialSettings?.businessId || '',
      activeScheduleId: activeScheduleId,
      scheduleSets: scheduleSets,
      specialDates: specialDates,
      blockedDates: blockedDates,
      bufferTimeMinutes: availabilityBuffer,
      advanceBookingDays: advanceBookingLimit,
      minAdvanceHours: initialSettings?.minAdvanceHours || 24
    };
    
    onChange(currentSettings);
  }, [scheduleSets, activeScheduleId, specialDates, blockedDates, availabilityBuffer, advanceBookingLimit, initialSettings, onChange]);

  const getActiveSchedule = (): ScheduleSet | undefined => {
    return scheduleSets.find(s => s.id === activeScheduleId);
  };

  const handleToggleDay = (day: WeekDay, scheduleId?: number) => {
    const targetScheduleId = scheduleId || activeScheduleId;
    
    setScheduleSets(prev => 
      prev.map(schedule => {
        if (schedule.id === targetScheduleId) {
          return {
            ...schedule,
            regularSchedule: {
              ...schedule.regularSchedule,
              [day]: {
                ...schedule.regularSchedule[day],
                isActive: !schedule.regularSchedule[day].isActive
              }
            }
          };
        }
        return schedule;
      })
    );
  };

  const handleAddTimeSlot = (day: WeekDay, scheduleId?: number) => {
    const targetScheduleId = scheduleId || activeScheduleId;
    
    setScheduleSets(prev => 
      prev.map(schedule => {
        if (schedule.id === targetScheduleId) {
          return {
            ...schedule,
            regularSchedule: {
              ...schedule.regularSchedule,
              [day]: {
                ...schedule.regularSchedule[day],
                timeSlots: [
                  ...schedule.regularSchedule[day].timeSlots,
                  { start: "09:00", end: "17:00" }
                ]
              }
            }
          };
        }
        return schedule;
      })
    );
  };

  const handleRemoveTimeSlot = (day: WeekDay, index: number, scheduleId?: number) => {
    const targetScheduleId = scheduleId || activeScheduleId;
    
    setScheduleSets(prev => 
      prev.map(schedule => {
        if (schedule.id === targetScheduleId) {
          return {
            ...schedule,
            regularSchedule: {
              ...schedule.regularSchedule,
              [day]: {
                ...schedule.regularSchedule[day],
                timeSlots: schedule.regularSchedule[day].timeSlots.filter((_, i) => i !== index)
              }
            }
          };
        }
        return schedule;
      })
    );
  };

  const handleTimeChange = (day: WeekDay, index: number, field: "start" | "end", value: string, scheduleId?: number) => {
    const targetScheduleId = scheduleId || activeScheduleId;
    
    setScheduleSets(prev => 
      prev.map(schedule => {
        if (schedule.id === targetScheduleId) {
          return {
            ...schedule,
            regularSchedule: {
              ...schedule.regularSchedule,
              [day]: {
                ...schedule.regularSchedule[day],
                timeSlots: schedule.regularSchedule[day].timeSlots.map((slot, i) => 
                  i === index 
                    ? { ...slot, [field]: value }
                    : slot
                )
              }
            }
          };
        }
        return schedule;
      })
    );
  };

  const handleAddBlockedTime = () => {
    if (!selectedDate) return;
    
    const newBlockedDate: BlockedTime = {
      date: selectedDate.toISOString().split('T')[0],
      fullDay: blockingFullDay,
      timeSlots: blockingFullDay ? [] : [...blockTimeSlots]
    };
    
    // Remove any existing blocked date for the same date
    const filteredDates = blockedDates.filter(bd => bd.date !== newBlockedDate.date);
    
    setBlockedDates([...filteredDates, newBlockedDate]);
    setBlockDateDialog(false);
    toast.success("Date bloquée avec succès");
  };
  
  const handleAddSpecialDate = () => {
    if (!selectedDate) return;
    
    const newSpecialDate: SpecialDate = {
      date: selectedDate.toISOString().split('T')[0],
      scheduleId: specialDateScheduleId,
      isActive: specialDateIsActive,
      timeSlots: specialDateIsActive ? [...specialDateTimeSlots] : []
    };
    
    // Remove any existing special date for the same date
    const filteredDates = specialDates.filter(sd => sd.date !== newSpecialDate.date);
    
    setSpecialDates([...filteredDates, newSpecialDate]);
    setSpecialDateDialog(false);
    toast.success("Exception de date ajoutée avec succès");
  };
  
  const handleRemoveBlockedDate = (date: string) => {
    setBlockedDates(prev => prev.filter(bd => bd.date !== date));
    toast.success("Date débloquée");
  };
  
  const handleRemoveSpecialDate = (date: string) => {
    setSpecialDates(prev => prev.filter(sd => sd.date !== date));
    toast.success("Exception de date supprimée");
  };
  
  const handleAddScheduleSet = () => {
    if (!newScheduleName.trim()) {
      toast.error("Veuillez saisir un nom pour le nouveau jeu d'horaires");
      return;
    }
    
    const newId = Math.max(0, ...scheduleSets.map(s => s.id)) + 1;
    
    const newSchedule: ScheduleSet = {
      id: newId,
      name: newScheduleName.trim(),
      regularSchedule: {
        monday: { isActive: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
        tuesday: { isActive: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
        wednesday: { isActive: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
        thursday: { isActive: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
        friday: { isActive: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
        saturday: { isActive: false, timeSlots: [] },
        sunday: { isActive: false, timeSlots: [] },
      }
    };
    
    setScheduleSets(prev => [...prev, newSchedule]);
    setOpenNewScheduleDialog(false);
    setNewScheduleName("");
    toast.success("Nouveau jeu d'horaires créé");
  };
  
  const handleRemoveScheduleSet = (id: number) => {
    // Don't allow removing the last schedule set
    if (scheduleSets.length <= 1) {
      toast.error("Vous ne pouvez pas supprimer le dernier jeu d'horaires");
      return;
    }
    
    // If removing active schedule, switch to another one
    if (id === activeScheduleId) {
      const otherSchedule = scheduleSets.find(s => s.id !== id);
      if (otherSchedule) {
        setActiveScheduleId(otherSchedule.id);
      }
    }
    
    setScheduleSets(prev => prev.filter(s => s.id !== id));
    
    // Also remove any special dates that reference this schedule
    setSpecialDates(prev => prev.filter(sd => sd.scheduleId !== id));
    
    toast.success("Jeu d'horaires supprimé");
  };
  
  const handleChangeActiveSchedule = (id: number) => {
    setActiveScheduleId(id);
    toast.success("Jeu d'horaires actif modifié");
  };
  
  const handleBlockTimeSlotAdd = () => {
    setBlockTimeSlots(prev => [...prev, { start: "09:00", end: "17:00" }]);
  };
  
  const handleBlockTimeSlotRemove = (index: number) => {
    setBlockTimeSlots(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleBlockTimeSlotChange = (index: number, field: "start" | "end", value: string) => {
    setBlockTimeSlots(prev => 
      prev.map((slot, i) => i === index ? { ...slot, [field]: value } : slot)
    );
  };
  
  const handleSpecialTimeSlotAdd = () => {
    setSpecialDateTimeSlots(prev => [...prev, { start: "09:00", end: "17:00" }]);
  };
  
  const handleSpecialTimeSlotRemove = (index: number) => {
    setSpecialDateTimeSlots(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSpecialTimeSlotChange = (index: number, field: "start" | "end", value: string) => {
    setSpecialDateTimeSlots(prev => 
      prev.map((slot, i) => i === index ? { ...slot, [field]: value } : slot)
    );
  };
  
  const getDayHighlightClass = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    // Check if date is blocked
    const isBlocked = blockedDates.some(bd => bd.date === dateString);
    if (isBlocked) return "bg-red-100";
    
    // Check if date has special schedule
    const hasSpecial = specialDates.some(sd => sd.date === dateString);
    if (hasSpecial) return "bg-blue-100";
    
    return "";
  };
  
  // Check if there are any dates with exceptions or blocks
  const hasSpecialDay = (date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return blockedDates.some(bd => bd.date === dateString) || 
           specialDates.some(sd => sd.date === dateString);
  };
  
  const activeSchedule = getActiveSchedule();
  
  // Reset blocking time slots when the blocking type changes
  useEffect(() => {
    if (blockingFullDay) {
      setBlockTimeSlots([{ start: "09:00", end: "17:00" }]);
    }
  }, [blockingFullDay]);
  
  // Reset special date time slots when the special date active status changes
  useEffect(() => {
    if (!specialDateIsActive) {
      setSpecialDateTimeSlots([{ start: "09:00", end: "17:00" }]);
    }
  }, [specialDateIsActive]);
  
  // When selected date changes, reset dialog values
  useEffect(() => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      
      // Check if date is already blocked
      const existingBlock = blockedDates.find(bd => bd.date === dateString);
      if (existingBlock) {
        setBlockingFullDay(existingBlock.fullDay);
        setBlockTimeSlots(existingBlock.fullDay ? [{ start: "09:00", end: "17:00" }] : [...existingBlock.timeSlots]);
      } else {
        setBlockingFullDay(true);
        setBlockTimeSlots([{ start: "09:00", end: "17:00" }]);
      }
      
      // Check if date has special schedule
      const existingSpecial = specialDates.find(sd => sd.date === dateString);
      if (existingSpecial) {
        setSpecialDateScheduleId(existingSpecial.scheduleId);
        setSpecialDateIsActive(existingSpecial.isActive);
        setSpecialDateTimeSlots(existingSpecial.isActive ? [...existingSpecial.timeSlots] : [{ start: "09:00", end: "17:00" }]);
      } else {
        setSpecialDateScheduleId(activeScheduleId);
        setSpecialDateIsActive(true);
        setSpecialDateTimeSlots([{ start: "09:00", end: "17:00" }]);
      }
    }
  }, [selectedDate, blockedDates, specialDates, activeScheduleId]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>Horaires réguliers</span>
          </TabsTrigger>
          <TabsTrigger value="exceptions" className="flex items-center gap-2">
            <CalendarX className="h-4 w-4" />
            <span>Exceptions</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Paramètres</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet des horaires hebdomadaires */}
        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-between items-center">
                <CardTitle>Jeux d'horaires</CardTitle>
                <Dialog open={openNewScheduleDialog} onOpenChange={setOpenNewScheduleDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Nouveau jeu
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Créer un nouveau jeu d'horaires</DialogTitle>
                      <DialogDescription>
                        Ajoutez un nouveau jeu d'horaires pour des besoins différents (ex: horaires d'été/hiver).
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nom du jeu d'horaires</Label>
                        <Input 
                          id="name" 
                          placeholder="Ex: Horaires d'été" 
                          value={newScheduleName}
                          onChange={(e) => setNewScheduleName(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenNewScheduleDialog(false)}>Annuler</Button>
                      <Button onClick={handleAddScheduleSet}>Créer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                Définissez différents jeux d'horaires et sélectionnez celui que vous souhaitez utiliser par défaut.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduleSets.map((schedule) => (
                  <Card key={schedule.id} className={`border ${schedule.id === activeScheduleId ? 'border-primary' : ''}`}>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{schedule.name}</CardTitle>
                        <div className="flex space-x-2">
                          {schedule.id !== activeScheduleId && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleChangeActiveSchedule(schedule.id)}
                            >
                              Activer
                            </Button>
                          )}
                          {scheduleSets.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleRemoveScheduleSet(schedule.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      {schedule.id === activeScheduleId && (
                        <CardDescription>Jeu d'horaires actif</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={`schedule-${schedule.id}`}>
                          <AccordionTrigger>Voir les horaires</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 mt-4">
                              {Object.entries(schedule.regularSchedule).map(([day, daySchedule]) => (
                                <div key={day} className="border rounded-lg p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        checked={daySchedule.isActive}
                                        onCheckedChange={() => handleToggleDay(day as WeekDay, schedule.id)}
                                      />
                                      <Label className="font-medium">{dayLabels[day as WeekDay]}</Label>
                                    </div>
                                    {daySchedule.isActive && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAddTimeSlot(day as WeekDay, schedule.id)}
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
                                            onValueChange={(value) => handleTimeChange(day as WeekDay, index, "start", value, schedule.id)}
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
                                            onValueChange={(value) => handleTimeChange(day as WeekDay, index, "end", value, schedule.id)}
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
                                            onClick={() => handleRemoveTimeSlot(day as WeekDay, index, schedule.id)}
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
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet des exceptions et jours bloqués */}
        <TabsContent value="exceptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarX className="h-5 w-5 text-muted-foreground" />
                Gérer les exceptions
              </CardTitle>
              <CardDescription>
                Bloquez des dates spécifiques ou définissez des horaires personnalisés pour certains jours.
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
                        special: (date) => hasSpecialDay(date),
                      }}
                      modifiersClassNames={{
                        special: "!font-bold !border !border-primary",
                      }}
                      styles={{
                        day_today: { 
                          backgroundColor: "hsl(var(--accent))", 
                          color: "hsl(var(--accent-foreground))" 
                        },
                        day_selected: { 
                          backgroundColor: "hsl(var(--primary))", 
                          color: "white", 
                          fontWeight: "bold" 
                        },
                        day: { 
                          backgroundColor: "transparent" 
                        }
                      }}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div className="mt-4 flex flex-col sm:flex-row gap-4">
                    <Dialog open={blockDateDialog} onOpenChange={setBlockDateDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
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
                    
                    <Dialog open={specialDateDialog} onOpenChange={setSpecialDateDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Horaires spéciaux
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
                          <div className="grid gap-2">
                            <Label htmlFor="schedule">Jeu d'horaires à utiliser</Label>
                            <Select
                              value={specialDateScheduleId.toString()}
                              onValueChange={(value) => setSpecialDateScheduleId(parseInt(value))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner un jeu d'horaires" />
                              </SelectTrigger>
                              <SelectContent>
                                {scheduleSets.map((schedule) => (
                                  <SelectItem 
                                    key={schedule.id} 
                                    value={schedule.id.toString()}
                                  >
                                    {schedule.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
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
                
                <div className="flex-1 space-y-6">
                  {/* Liste des dates bloquées */}
                  <div>
                    <h3 className="font-medium mb-2">Dates bloquées</h3>
                    {blockedDates.length > 0 ? (
                      <div className="space-y-2">
                        {blockedDates.map((blockDate, index) => (
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
                  
                  {/* Liste des dates avec horaires spéciaux */}
                  <div>
                    <h3 className="font-medium mb-2">Dates avec horaires spéciaux</h3>
                    {specialDates.length > 0 ? (
                      <div className="space-y-2">
                        {specialDates.map((specialDate, index) => {
                          const schedule = scheduleSets.find(s => s.id === specialDate.scheduleId);
                          return (
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
                                  {schedule ? `Jeu d'horaires: ${schedule.name}` : 'Jeu inconnu'}
                                  <div>
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
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveSpecialDate(specialDate.date)}
                              >
                                <X className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Aucune date avec horaires spéciaux. Cliquez sur "Horaires spéciaux" pour en ajouter.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet des paramètres avancés */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres avancés</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux de disponibilité et de réservation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="buffer">Tampon entre rendez-vous</Label>
                    <Select 
                      value={availabilityBuffer.toString()} 
                      onValueChange={(val) => setAvailabilityBuffer(Number(val))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Sélectionnez un temps" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Aucun tampon</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Temps minimum entre deux réservations
                    </p>
                  </div>
                  
                  <div className="w-full md:w-1/2">
                    <Label htmlFor="advanceLimit">Réservation à l'avance</Label>
                    <Select 
                      value={advanceBookingLimit.toString()} 
                      onValueChange={(val) => setAdvanceBookingLimit(Number(val))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Sélectionnez une limite" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">1 semaine</SelectItem>
                        <SelectItem value="14">2 semaines</SelectItem>
                        <SelectItem value="30">1 mois</SelectItem>
                        <SelectItem value="60">2 mois</SelectItem>
                        <SelectItem value="90">3 mois</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Délai maximum pour prendre rendez-vous à l'avance
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AvailabilitySettings;
