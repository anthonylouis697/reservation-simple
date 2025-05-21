import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Plus, X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AvailabilitySettings as AvailabilitySettingsType, DaySchedule, TimeSlot } from '@/services/booking/availabilityService';

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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [blockoutDates, setBlockoutDates] = useState<Date[]>([]);
  const [scheduleType, setScheduleType] = useState<"weekly" | "custom">("weekly");
  const [availabilityBuffer, setAvailabilityBuffer] = useState(15);
  const [advanceBookingLimit, setAdvanceBookingLimit] = useState(30);
  
  const [weekSchedule, setWeekSchedule] = useState<Record<WeekDay, DaySchedule>>({
    monday: { isActive: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { isActive: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    wednesday: { isActive: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    thursday: { isActive: true, timeSlots: [{ start: "09:00", end: "17:00" }] },
    friday: { isActive: true, timeSlots: [{ start: "09:00", end: "15:00" }] },
    saturday: { isActive: false, timeSlots: [] },
    sunday: { isActive: false, timeSlots: [] },
  });

  // Initialize from props if provided
  useEffect(() => {
    if (initialSettings) {
      setWeekSchedule(initialSettings.regularSchedule);
      setBlockoutDates(initialSettings.blockedDates.map(dateStr => new Date(dateStr)));
      setAvailabilityBuffer(initialSettings.bufferTimeMinutes);
      setAdvanceBookingLimit(initialSettings.advanceBookingDays);
    }
  }, [initialSettings]);

  // When settings change, notify parent component
  useEffect(() => {
    if (!onChange) return;
    
    const currentSettings: AvailabilitySettingsType = {
      businessId: initialSettings?.businessId || '',
      regularSchedule: weekSchedule,
      specialDates: initialSettings?.specialDates || [],
      blockedDates: blockoutDates.map(date => date.toISOString().split('T')[0]),
      bufferTimeMinutes: availabilityBuffer,
      advanceBookingDays: advanceBookingLimit,
      minAdvanceHours: initialSettings?.minAdvanceHours || 24
    };
    
    onChange(currentSettings);
  }, [weekSchedule, blockoutDates, availabilityBuffer, advanceBookingLimit, initialSettings, onChange]);

  const handleToggleDay = (day: WeekDay) => {
    setWeekSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isActive: !prev[day].isActive
      }
    }));
  };

  const handleAddTimeSlot = (day: WeekDay) => {
    setWeekSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: [
          ...prev[day].timeSlots,
          { start: "09:00", end: "17:00" }
        ]
      }
    }));
  };

  const handleRemoveTimeSlot = (day: WeekDay, index: number) => {
    setWeekSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.filter((_, i) => i !== index)
      }
    }));
  };

  const handleTimeChange = (day: WeekDay, index: number, field: "start" | "end", value: string) => {
    setWeekSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        timeSlots: prev[day].timeSlots.map((slot, i) => 
          i === index 
            ? { ...slot, [field]: value }
            : slot
        )
      }
    }));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    
    // Check if the date is already in blockout dates
    const exists = blockoutDates.some(date => 
      date.toDateString() === selectedDate.toDateString()
    );
    
    if (exists) {
      // Remove the date
      setBlockoutDates(prev => 
        prev.filter(date => date.toDateString() !== selectedDate.toDateString())
      );
    } else {
      // Add the date
      setBlockoutDates(prev => [...prev, selectedDate]);
    }
  };

  const handleSaveAvailability = () => {
    toast.success("Paramètres de disponibilité enregistrés");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Horaires de disponibilité</CardTitle>
          <CardDescription>
            Définissez vos horaires de travail réguliers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <Label>Type d'horaire</Label>
                <ToggleGroup
                  type="single"
                  defaultValue="weekly"
                  onValueChange={(value) => value && setScheduleType(value as "weekly" | "custom")}
                  className="mt-2 w-full justify-start"
                >
                  <ToggleGroupItem value="weekly" className="flex-1">Hebdomadaire</ToggleGroupItem>
                  <ToggleGroupItem value="custom" className="flex-1">Personnalisé</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div className="w-full md:w-1/3">
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
              </div>
              
              <div className="w-full md:w-1/3">
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
              </div>
            </div>

            {scheduleType === "weekly" && (
              <div className="space-y-4">
                {Object.entries(weekSchedule).map(([day, schedule]) => (
                  <div key={day} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={schedule.isActive}
                          onCheckedChange={() => handleToggleDay(day as WeekDay)}
                        />
                        <Label className="font-medium">{dayLabels[day as WeekDay]}</Label>
                      </div>
                      {schedule.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTimeSlot(day as WeekDay)}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Ajouter une plage
                        </Button>
                      )}
                    </div>
                    
                    {schedule.isActive && schedule.timeSlots.length > 0 && (
                      <div className="mt-3 space-y-3">
                        {schedule.timeSlots.map((slot, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Select
                              value={slot.start}
                              onValueChange={(value) => handleTimeChange(day as WeekDay, index, "start", value)}
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
                              onValueChange={(value) => handleTimeChange(day as WeekDay, index, "end", value)}
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
                              onClick={() => handleRemoveTimeSlot(day as WeekDay, index)}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {schedule.isActive && schedule.timeSlots.length === 0 && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Aucune plage horaire définie pour ce jour.
                      </p>
                    )}
                    
                    {!schedule.isActive && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Ce jour n'est pas disponible pour les réservations.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {scheduleType === "custom" && (
              <p className="text-sm text-muted-foreground">
                Le mode d'horaire personnalisé vous permet de définir des plages horaires spécifiques pour des jours particuliers.
                Cette fonctionnalité sera bientôt disponible.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dates bloquées</CardTitle>
          <CardDescription>
            Marquez les jours où vous n'êtes pas disponible pour des réservations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Calendar
                mode="multiple"
                selected={blockoutDates}
                onSelect={(value) => handleDateSelect(value?.[value.length - 1])}
                className="rounded-md border"
              />
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="font-medium">Dates bloquées sélectionnées</h3>
              {blockoutDates.length > 0 ? (
                <div className="space-y-2">
                  {blockoutDates.map((date, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <span>{date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setBlockoutDates(prev => prev.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucune date bloquée sélectionnée. Cliquez sur une date dans le calendrier pour la bloquer.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilitySettings;
