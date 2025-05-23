
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AvailabilitySettings as AvailabilitySettingsType, 
  DaySchedule,
  TimeSlot, 
  ScheduleSet, 
  BlockedTime, 
  SpecialDate,
  createTimeSlot,
  getAvailabilitySettings,
  saveAvailabilitySettings
} from '@/services/booking/availabilityService';

import { toast } from 'sonner';
import { useBusiness } from '@/contexts/BusinessContext';

const AvailabilitySettings = () => {
  const { currentBusiness } = useBusiness();
  const [settings, setSettings] = useState<AvailabilitySettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [minAdvanceHours, setMinAdvanceHours] = useState(24);
  const [advanceBookingDays, setAdvanceBookingDays] = useState(30);
  const [bufferTimeMinutes, setBufferTimeMinutes] = useState(15);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const defaultTimeSlot = createTimeSlot("09:00", "17:00");

  // Add a time slot dialog state
  const [showAddTimeSlotDialog, setShowAddTimeSlotDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [newTimeSlots, setNewTimeSlots] = useState<TimeSlot[]>([
    createTimeSlot("09:00", "17:00")
  ]);

  // Fetch settings on component mount
  const fetchSettings = async () => {
    if (!currentBusiness?.id) return;
    
    try {
      setLoading(true);
      const availabilitySettings = await getAvailabilitySettings(currentBusiness.id);
      
      // Initialize state with fetched settings
      setSettings(availabilitySettings);
      setMinAdvanceHours(availabilitySettings.minAdvanceHours);
      setAdvanceBookingDays(availabilitySettings.advanceBookingDays);
      setBufferTimeMinutes(availabilitySettings.bufferTimeMinutes);
      
      setUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to fetch availability settings:", error);
      toast.error("Impossible de charger les paramètres de disponibilité");
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const handleSaveSettings = async () => {
    if (!settings || !currentBusiness?.id) return;
    
    try {
      setSaving(true);
      
      // Update settings with current state values
      const updatedSettings: AvailabilitySettingsType = {
        ...settings,
        minAdvanceHours: minAdvanceHours,
        advanceBookingDays: advanceBookingDays,
        bufferTimeMinutes: bufferTimeMinutes
      };
      
      // Save to database
      const success = await saveAvailabilitySettings(updatedSettings);
      
      if (success) {
        toast.success("Paramètres enregistrés avec succès");
        setUnsavedChanges(false);
      } else {
        toast.error("Erreur lors de l'enregistrement des paramètres");
      }
    } catch (error) {
      console.error("Failed to save availability settings:", error);
      toast.error("Erreur lors de l'enregistrement des paramètres");
    } finally {
      setSaving(false);
    }
  };

  // Function to handle input changes
  const handleInputChange = (field: 'minAdvanceHours' | 'advanceBookingDays' | 'bufferTimeMinutes', value: string) => {
    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue)) return;
    
    switch (field) {
      case 'minAdvanceHours':
        setMinAdvanceHours(numValue);
        break;
      case 'advanceBookingDays':
        setAdvanceBookingDays(numValue);
        break;
      case 'bufferTimeMinutes':
        setBufferTimeMinutes(numValue);
        break;
    }
    
    setUnsavedChanges(true);
  };

  // Toggle day availability
  const handleToggleDayAvailability = (day: string) => {
    if (!settings) return;
    
    const updatedSettings = { ...settings };
    const schedule = updatedSettings.scheduleSets.find(set => set.id === updatedSettings.activeScheduleId);
    
    if (schedule) {
      schedule.regularSchedule[day] = {
        ...schedule.regularSchedule[day],
        isActive: !schedule.regularSchedule[day].isActive
      };
      
      setSettings(updatedSettings);
      setUnsavedChanges(true);
    }
  };

  // Add time slot to a day
  const handleAddTimeSlot = (day: string) => {
    if (!settings) return;
    
    const updatedSettings = { ...settings };
    const schedule = updatedSettings.scheduleSets.find(set => set.id === updatedSettings.activeScheduleId);
    
    if (schedule) {
      schedule.regularSchedule[day] = {
        ...schedule.regularSchedule[day],
        timeSlots: [
          ...schedule.regularSchedule[day].timeSlots,
          createTimeSlot("09:00", "17:00")
        ]
      };
      
      setSettings(updatedSettings);
      setUnsavedChanges(true);
    }
  };

  // Remove time slot from a day
  const handleRemoveTimeSlot = (day: string, index: number) => {
    if (!settings) return;
    
    const updatedSettings = { ...settings };
    const schedule = updatedSettings.scheduleSets.find(set => set.id === updatedSettings.activeScheduleId);
    
    if (schedule && schedule.regularSchedule[day].timeSlots.length > 1) {
      const updatedSlots = [...schedule.regularSchedule[day].timeSlots];
      updatedSlots.splice(index, 1);
      
      schedule.regularSchedule[day] = {
        ...schedule.regularSchedule[day],
        timeSlots: updatedSlots
      };
      
      setSettings(updatedSettings);
      setUnsavedChanges(true);
    }
  };

  // Update time slot
  const handleUpdateTimeSlot = (day: string, index: number, field: 'startTime' | 'endTime', value: string) => {
    if (!settings) return;
    
    const updatedSettings = { ...settings };
    const schedule = updatedSettings.scheduleSets.find(set => set.id === updatedSettings.activeScheduleId);
    
    if (schedule) {
      const updatedSlots = [...schedule.regularSchedule[day].timeSlots];
      
      if (field === 'startTime') {
        updatedSlots[index] = {
          ...updatedSlots[index],
          startTime: value,
          start: value
        };
      } else {
        updatedSlots[index] = {
          ...updatedSlots[index],
          endTime: value,
          end: value
        };
      }
      
      schedule.regularSchedule[day] = {
        ...schedule.regularSchedule[day],
        timeSlots: updatedSlots
      };
      
      setSettings(updatedSettings);
      setUnsavedChanges(true);
    }
  };

  // Add new time slot to the list
  const handleAddNewTimeSlot = () => {
    setNewTimeSlots(prev => [...prev, createTimeSlot("09:00", "17:00")]);
  };

  // Remove time slot from the list
  const handleRemoveNewTimeSlot = (index: number) => {
    if (newTimeSlots.length <= 1) return;
    setNewTimeSlots(prev => prev.filter((_, i) => i !== index));
  };

  // Update new time slot field
  const handleUpdateNewTimeSlot = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setNewTimeSlots(prev => {
      const updated = [...prev];
      if (field === 'startTime') {
        updated[index] = {
          ...updated[index],
          startTime: value,
          start: value
        };
      } else {
        updated[index] = {
          ...updated[index],
          endTime: value,
          end: value
        };
      }
      return updated;
    });
  };

  // Add multiple time slots to a day
  const handleAddMultipleTimeSlots = () => {
    if (!settings || !selectedDay) return;
    
    const updatedSettings = { ...settings };
    const schedule = updatedSettings.scheduleSets.find(set => set.id === updatedSettings.activeScheduleId);
    
    if (schedule) {
      schedule.regularSchedule[selectedDay] = {
        ...schedule.regularSchedule[selectedDay],
        timeSlots: [
          ...schedule.regularSchedule[selectedDay].timeSlots,
          ...newTimeSlots.map(slot => createTimeSlot(slot.startTime, slot.endTime))
        ]
      };
      
      setSettings(updatedSettings);
      setUnsavedChanges(true);
      setShowAddTimeSlotDialog(false);
      setNewTimeSlots([createTimeSlot("09:00", "17:00")]);
    }
  };

  // Open add time slots dialog
  const openAddTimeSlotsDialog = (day: string) => {
    setSelectedDay(day);
    setNewTimeSlots([createTimeSlot("09:00", "17:00")]);
    setShowAddTimeSlotDialog(true);
  };

  // Add blocked date
  const handleAddBlockedDate = (date: Date, fullDay: boolean = true, timeSlots: TimeSlot[] = []) => {
    if (!settings) return;
    
    const dateString = date.toISOString().split('T')[0];
    const updatedSettings = { ...settings };
    
    // Check if date is already blocked
    const existingIndex = updatedSettings.blockedDates.findIndex(d => d.date === dateString);
    
    const newBlockedDate: BlockedTime = {
      date: dateString,
      fullDay: fullDay,
      timeSlots: fullDay ? [] : timeSlots.map(slot => createTimeSlot(slot.startTime, slot.endTime))
    };
    
    if (existingIndex >= 0) {
      updatedSettings.blockedDates[existingIndex] = newBlockedDate;
    } else {
      updatedSettings.blockedDates.push(newBlockedDate);
    }
    
    setSettings(updatedSettings);
    setUnsavedChanges(true);
  };

  // Add special date
  const handleAddSpecialDate = (date: Date, isActive: boolean = true, timeSlots: TimeSlot[] = []) => {
    if (!settings) return;
    
    const dateString = date.toISOString().split('T')[0];
    const updatedSettings = { ...settings };
    
    // Check if date already has special hours
    const existingIndex = updatedSettings.specialDates.findIndex(d => d.date === dateString);
    
    const newSpecialDate: SpecialDate = {
      date: dateString,
      isActive: isActive,
      timeSlots: isActive ? timeSlots.map(slot => createTimeSlot(slot.startTime, slot.endTime)) : [],
      scheduleId: updatedSettings.activeScheduleId
    };
    
    if (existingIndex >= 0) {
      updatedSettings.specialDates[existingIndex] = newSpecialDate;
    } else {
      updatedSettings.specialDates.push(newSpecialDate);
    }
    
    setSettings(updatedSettings);
    setUnsavedChanges(true);
  };

  // Generate time options for select dropdowns
  const generateTimeOptions = () => {
    const options = [];
    
    for (let hour = 0; hour < 24; hour++) {
      const formattedHour = hour.toString().padStart(2, '0');
      options.push(`${formattedHour}:00`);
      options.push(`${formattedHour}:30`);
    }
    
    return options;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!settings) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p>Aucun paramètre de disponibilité trouvé.</p>
            <Button 
              onClick={fetchSettings} 
              className="mt-2"
            >
              Rafraîchir
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeSchedule = settings.scheduleSets.find(set => set.id === settings.activeScheduleId);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de disponibilité</CardTitle>
          <CardDescription>
            Configurez vos préférences pour les réservations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-advance-hours">Délai minimum avant réservation (heures)</Label>
                <Input 
                  id="min-advance-hours" 
                  type="number"
                  min="0"
                  value={minAdvanceHours}
                  onChange={(e) => handleInputChange('minAdvanceHours', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Les clients doivent réserver au moins ce nombre d'heures à l'avance.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="advance-booking-days">Période de réservation (jours)</Label>
                <Input 
                  id="advance-booking-days" 
                  type="number"
                  min="1"
                  value={advanceBookingDays}
                  onChange={(e) => handleInputChange('advanceBookingDays', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Les clients peuvent réserver jusqu'à ce nombre de jours à l'avance.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buffer-time">Temps tampon entre rendez-vous (minutes)</Label>
                <Input 
                  id="buffer-time" 
                  type="number"
                  min="0"
                  step="5"
                  value={bufferTimeMinutes}
                  onChange={(e) => handleInputChange('bufferTimeMinutes', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Temps entre deux rendez-vous pour la préparation.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={!unsavedChanges || saving}
        >
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  );
};

export default AvailabilitySettings;
