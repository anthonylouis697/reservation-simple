
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useBusiness } from "@/contexts/BusinessContext";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle 
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AvailabilitySettings,
  TimeSlot,
  DaySchedule,
  SpecialDate,
  getAvailabilitySettings,
  saveAvailabilitySettings,
  defaultAvailabilitySettings
} from "@/services/booking/availabilityService";

// Days of the week
const daysOfWeek = [
  { id: "monday", label: "Lundi" },
  { id: "tuesday", label: "Mardi" },
  { id: "wednesday", label: "Mercredi" },
  { id: "thursday", label: "Jeudi" },
  { id: "friday", label: "Vendredi" },
  { id: "saturday", label: "Samedi" },
  { id: "sunday", label: "Dimanche" },
];

export default function AvailabilityPage() {
  const navigate = useNavigate();
  const { currentBusiness } = useBusiness();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("regular");
  const [availabilitySettings, setAvailabilitySettings] = useState<AvailabilitySettings>({
    ...defaultAvailabilitySettings,
    businessId: currentBusiness?.id || ''
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [specialDateToAdd, setSpecialDateToAdd] = useState<Date | undefined>(undefined);
  const [specialDateAccordionOpen, setSpecialDateAccordionOpen] = useState<string[]>([]);

  useEffect(() => {
    if (currentBusiness) {
      loadAvailabilitySettings();
    } else {
      setIsLoading(false);
    }
  }, [currentBusiness]);

  const loadAvailabilitySettings = async () => {
    if (!currentBusiness) return;
    
    setIsLoading(true);
    try {
      const settings = await getAvailabilitySettings(currentBusiness.id);
      setAvailabilitySettings(settings);
    } catch (error) {
      console.error('Error loading availability settings:', error);
      toast.error('Impossible de charger vos disponibilités');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateToString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleDayToggle = (day: string) => {
    setAvailabilitySettings(prev => ({
      ...prev,
      regularSchedule: {
        ...prev.regularSchedule,
        [day]: {
          ...prev.regularSchedule[day as keyof typeof prev.regularSchedule],
          isActive: !prev.regularSchedule[day as keyof typeof prev.regularSchedule].isActive
        }
      }
    }));
  };

  const handleAddTimeSlot = (day: string) => {
    setAvailabilitySettings(prev => ({
      ...prev,
      regularSchedule: {
        ...prev.regularSchedule,
        [day]: {
          ...prev.regularSchedule[day as keyof typeof prev.regularSchedule],
          timeSlots: [
            ...prev.regularSchedule[day as keyof typeof prev.regularSchedule].timeSlots,
            { start: "09:00", end: "17:00" }
          ]
        }
      }
    }));
  };

  const handleRemoveTimeSlot = (day: string, index: number) => {
    setAvailabilitySettings(prev => ({
      ...prev,
      regularSchedule: {
        ...prev.regularSchedule,
        [day]: {
          ...prev.regularSchedule[day as keyof typeof prev.regularSchedule],
          timeSlots: prev.regularSchedule[day as keyof typeof prev.regularSchedule].timeSlots.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const handleTimeChange = (day: string, index: number, field: keyof TimeSlot, value: string) => {
    setAvailabilitySettings(prev => ({
      ...prev,
      regularSchedule: {
        ...prev.regularSchedule,
        [day]: {
          ...prev.regularSchedule[day as keyof typeof prev.regularSchedule],
          timeSlots: prev.regularSchedule[day as keyof typeof prev.regularSchedule].timeSlots.map(
            (slot, i) => i === index ? { ...slot, [field]: value } : slot
          )
        }
      }
    }));
  };

  const handleAdvancedOptionChange = (field: keyof Pick<AvailabilitySettings, 'bufferTimeMinutes' | 'advanceBookingDays' | 'minAdvanceHours'>, value: string) => {
    setAvailabilitySettings(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  };

  const handleAddSpecialDate = () => {
    if (!specialDateToAdd) return;
    
    const dateString = formatDateToString(specialDateToAdd);
    
    // Check if date already exists
    const exists = availabilitySettings.specialDates.some(sd => sd.date === dateString);
    
    if (exists) {
      toast.error('Cette date spéciale existe déjà');
      return;
    }
    
    // Get day of week for this date to use its schedule as a template
    const dayOfWeek = daysOfWeek[specialDateToAdd.getDay()].id;
    const daySchedule = availabilitySettings.regularSchedule[dayOfWeek as keyof typeof availabilitySettings.regularSchedule];
    
    const newSpecialDate: SpecialDate = {
      date: dateString,
      isActive: true,
      timeSlots: daySchedule.timeSlots.length > 0 
        ? [...daySchedule.timeSlots]
        : [{ start: "09:00", end: "17:00" }]
    };
    
    setAvailabilitySettings(prev => ({
      ...prev,
      specialDates: [...prev.specialDates, newSpecialDate]
    }));
    
    setSpecialDateToAdd(undefined);
    
    // Open the accordion for this new special date
    setSpecialDateAccordionOpen(prev => [...prev, dateString]);
  };

  const handleRemoveSpecialDate = (dateString: string) => {
    setAvailabilitySettings(prev => ({
      ...prev,
      specialDates: prev.specialDates.filter(sd => sd.date !== dateString)
    }));
    
    // Close the accordion for this removed date
    setSpecialDateAccordionOpen(prev => prev.filter(item => item !== dateString));
  };

  const handleToggleSpecialDate = (dateString: string) => {
    setAvailabilitySettings(prev => ({
      ...prev,
      specialDates: prev.specialDates.map(sd => 
        sd.date === dateString
          ? { ...sd, isActive: !sd.isActive }
          : sd
      )
    }));
  };

  const handleAddSpecialTimeSlot = (dateString: string) => {
    setAvailabilitySettings(prev => ({
      ...prev,
      specialDates: prev.specialDates.map(sd => 
        sd.date === dateString
          ? {
              ...sd,
              timeSlots: [...sd.timeSlots, { start: "09:00", end: "17:00" }]
            }
          : sd
      )
    }));
  };

  const handleRemoveSpecialTimeSlot = (dateString: string, index: number) => {
    setAvailabilitySettings(prev => ({
      ...prev,
      specialDates: prev.specialDates.map(sd => 
        sd.date === dateString
          ? {
              ...sd,
              timeSlots: sd.timeSlots.filter((_, i) => i !== index)
            }
          : sd
      )
    }));
  };

  const handleSpecialTimeChange = (dateString: string, index: number, field: keyof TimeSlot, value: string) => {
    setAvailabilitySettings(prev => ({
      ...prev,
      specialDates: prev.specialDates.map(sd => 
        sd.date === dateString
          ? {
              ...sd,
              timeSlots: sd.timeSlots.map((slot, i) =>
                i === index ? { ...slot, [field]: value } : slot
              )
            }
          : sd
      )
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateString = formatDateToString(date);
    
    // Check if date is already in blockedDates
    const isBlocked = availabilitySettings.blockedDates.includes(dateString);
    
    if (isBlocked) {
      // Remove date from blockedDates
      setAvailabilitySettings(prev => ({
        ...prev,
        blockedDates: prev.blockedDates.filter(d => d !== dateString)
      }));
    } else {
      // Add date to blockedDates
      setAvailabilitySettings(prev => ({
        ...prev,
        blockedDates: [...prev.blockedDates, dateString]
      }));
    }
  };

  const handleSave = async () => {
    if (!currentBusiness) {
      toast.error('Aucune entreprise sélectionnée');
      return;
    }
    
    setIsSaving(true);
    try {
      const success = await saveAvailabilitySettings({
        ...availabilitySettings,
        businessId: currentBusiness.id
      });
      
      if (success) {
        toast.success('Disponibilités mises à jour avec succès');
      } else {
        toast.error('Erreur lors de la sauvegarde des disponibilités');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Échec de la mise à jour des disponibilités');
    } finally {
      setIsSaving(false);
    }
  };

  const renderDaySchedule = (day: string, daySchedule: DaySchedule) => {
    return (
      <div key={day} className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={daySchedule.isActive}
              onCheckedChange={() => handleDayToggle(day)}
              id={`day-${day}`}
            />
            <Label htmlFor={`day-${day}`} className="font-medium">
              {daysOfWeek.find(d => d.id === day)?.label}
            </Label>
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
  };

  const renderSpecialDateItem = (specialDate: SpecialDate) => {
    // Parse the date string to a Date object for display
    const date = new Date(specialDate.date);
    const formattedDate = date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return (
      <AccordionItem key={specialDate.date} value={specialDate.date}>
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-4 w-4" />
            <span className="font-medium">{formattedDate}</span>
            {!specialDate.isActive && (
              <span className="ml-2 text-sm text-muted-foreground">(Indisponible)</span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={specialDate.isActive}
                  onCheckedChange={() => handleToggleSpecialDate(specialDate.date)}
                  id={`special-date-${specialDate.date}`}
                />
                <Label htmlFor={`special-date-${specialDate.date}`}>
                  Jour disponible
                </Label>
              </div>
              
              <div className="flex gap-2">
                {specialDate.isActive && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddSpecialTimeSlot(specialDate.date)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Ajouter une plage
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveSpecialDate(specialDate.date)}
                >
                  <X className="h-4 w-4 mr-1" /> Supprimer la date
                </Button>
              </div>
            </div>
            
            {specialDate.isActive && specialDate.timeSlots.length > 0 && (
              <div className="space-y-3 mt-2">
                {specialDate.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Select
                      value={slot.start}
                      onValueChange={(value) => handleSpecialTimeChange(specialDate.date, index, "start", value)}
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
                      onValueChange={(value) => handleSpecialTimeChange(specialDate.date, index, "end", value)}
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
                      onClick={() => handleRemoveSpecialTimeSlot(specialDate.date, index)}
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {specialDate.isActive && specialDate.timeSlots.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucune plage horaire définie pour cette date.
              </p>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Disponibilité - Reservatoo</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Disponibilité</h1>
            <p className="text-muted-foreground">Définissez vos horaires de travail et disponibilités</p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="regular">Horaires réguliers</TabsTrigger>
                <TabsTrigger value="special">Dates spéciales</TabsTrigger>
                <TabsTrigger value="blocked">Jours bloqués</TabsTrigger>
              </TabsList>
              
              {/* Horaires réguliers */}
              <TabsContent value="regular">
                <Card>
                  <CardHeader>
                    <CardTitle>Horaires réguliers</CardTitle>
                    <CardDescription>
                      Définissez vos horaires habituels de travail pour chaque jour de la semaine
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {daysOfWeek.map((day) => renderDaySchedule(
                        day.id, 
                        availabilitySettings.regularSchedule[day.id as keyof typeof availabilitySettings.regularSchedule]
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Options avancées</CardTitle>
                    <CardDescription>
                      Paramètres supplémentaires pour affiner vos disponibilités
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="buffer-time">
                          Temps tampon entre rendez-vous (minutes)
                        </Label>
                        <Input 
                          id="buffer-time" 
                          type="number" 
                          min="0"
                          value={availabilitySettings.bufferTimeMinutes}
                          onChange={(e) => handleAdvancedOptionChange('bufferTimeMinutes', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="min-advance">
                          Délai minimum de réservation (heures)
                        </Label>
                        <Input 
                          id="min-advance" 
                          type="number" 
                          min="0"
                          value={availabilitySettings.minAdvanceHours}
                          onChange={(e) => handleAdvancedOptionChange('minAdvanceHours', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max-advance">
                          Délai maximum de réservation (jours)
                        </Label>
                        <Input 
                          id="max-advance" 
                          type="number" 
                          min="1"
                          value={availabilitySettings.advanceBookingDays}
                          onChange={(e) => handleAdvancedOptionChange('advanceBookingDays', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Dates spéciales */}
              <TabsContent value="special">
                <Card>
                  <CardHeader>
                    <CardTitle>Dates spéciales</CardTitle>
                    <CardDescription>
                      Définissez des horaires spécifiques pour certaines dates (vacances, événements, etc.)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <Label htmlFor="special-date" className="mb-2 block">Ajouter une date spéciale</Label>
                          <Calendar
                            mode="single"
                            selected={specialDateToAdd}
                            onSelect={setSpecialDateToAdd}
                            className="rounded-md border"
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="mb-2">
                            <Label className="mb-2 block">Date sélectionnée</Label>
                            {specialDateToAdd ? (
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {specialDateToAdd.toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                                <Button 
                                  className="mt-4" 
                                  onClick={handleAddSpecialDate}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Ajouter cette date
                                </Button>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Sélectionnez une date dans le calendrier
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Dates spéciales configurées</h3>
                        
                        {availabilitySettings.specialDates.length > 0 ? (
                          <Accordion 
                            type="multiple" 
                            value={specialDateAccordionOpen} 
                            onValueChange={setSpecialDateAccordionOpen}
                            className="space-y-2"
                          >
                            {availabilitySettings.specialDates
                              .sort((a, b) => a.date.localeCompare(b.date))
                              .map(renderSpecialDateItem)}
                          </Accordion>
                        ) : (
                          <div className="text-center py-8">
                            <CalendarIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">
                              Vous n'avez pas encore configuré de dates spéciales
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Utilisez le calendrier pour ajouter vos premières dates spéciales
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Jours bloqués */}
              <TabsContent value="blocked">
                <Card>
                  <CardHeader>
                    <CardTitle>Jours bloqués</CardTitle>
                    <CardDescription>
                      Marquez les jours où vous n'êtes pas disponible pour des réservations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <Calendar
                          mode="multiple"
                          selected={availabilitySettings.blockedDates
                            .map(dateStr => new Date(dateStr))
                            .filter(date => !isNaN(date.getTime()))}
                          onSelect={(value) => handleDateSelect(value?.[value.length - 1])}
                          className="rounded-md border"
                          disabled={(date) => {
                            // Disable dates that are configured as special dates
                            const dateString = formatDateToString(date);
                            return availabilitySettings.specialDates.some(sd => sd.date === dateString);
                          }}
                        />
                      </div>
                      <div className="flex-1 space-y-4">
                        <h3 className="font-medium">Dates bloquées sélectionnées</h3>
                        {availabilitySettings.blockedDates.length > 0 ? (
                          <div className="space-y-2">
                            {availabilitySettings.blockedDates
                              .sort()
                              .map((dateStr, index) => {
                                const date = new Date(dateStr);
                                return (
                                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                                    <span>
                                      {!isNaN(date.getTime()) 
                                        ? date.toLocaleDateString('fr-FR', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                          })
                                        : dateStr}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDateSelect(date)}
                                    >
                                      <X className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">
                              Aucune date bloquée sélectionnée
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Cliquez sur une date dans le calendrier pour la bloquer
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !currentBusiness}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
