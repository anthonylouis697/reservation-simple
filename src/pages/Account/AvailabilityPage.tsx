
import { useState } from "react";
import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

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
  const [isSaving, setIsSaving] = useState(false);
  const [availabilitySettings, setAvailabilitySettings] = useState({
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    workingHours: {
      start: "09:00",
      end: "18:00",
    },
    breakTime: {
      enabled: true,
      start: "12:00",
      end: "13:00",
    },
    advancedOptions: {
      bufferBefore: 0,
      bufferAfter: 15,
      minAdvanceBooking: 24,
      maxAdvanceBooking: 60,
    }
  });

  const handleDayChange = (day: string) => {
    const currentDays = availabilitySettings.workingDays;
    if (currentDays.includes(day)) {
      setAvailabilitySettings({
        ...availabilitySettings,
        workingDays: currentDays.filter(d => d !== day)
      });
    } else {
      setAvailabilitySettings({
        ...availabilitySettings,
        workingDays: [...currentDays, day]
      });
    }
  };

  const handleTimeChange = (field: string, subField: string, value: string) => {
    setAvailabilitySettings({
      ...availabilitySettings,
      [field]: {
        ...availabilitySettings[field as keyof typeof availabilitySettings],
        [subField]: value
      }
    });
  };

  const handleAdvancedOptionChange = (field: string, value: string | number) => {
    setAvailabilitySettings({
      ...availabilitySettings,
      advancedOptions: {
        ...availabilitySettings.advancedOptions,
        [field]: typeof value === "string" ? parseInt(value) || 0 : value
      }
    });
  };

  const handleBreakToggle = (checked: boolean) => {
    setAvailabilitySettings({
      ...availabilitySettings,
      breakTime: {
        ...availabilitySettings.breakTime,
        enabled: checked
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simuler un délai pour le chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ici, vous implémenteriez la sauvegarde des données dans Supabase
      // const { error } = await supabase.from('availability').upsert(...);
      
      toast.success('Disponibilités mises à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Échec de la mise à jour des disponibilités');
    } finally {
      setIsSaving(false);
    }
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
        
        <Card>
          <CardHeader>
            <CardTitle>Jours travaillés</CardTitle>
            <CardDescription>Sélectionnez les jours où vous acceptez les rendez-vous</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {daysOfWeek.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`day-${day.id}`} 
                    checked={availabilitySettings.workingDays.includes(day.id)}
                    onCheckedChange={() => handleDayChange(day.id)}
                  />
                  <Label htmlFor={`day-${day.id}`}>{day.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Heures de travail</CardTitle>
            <CardDescription>Définissez vos horaires quotidiens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="start-time">Heure de début</Label>
                <Input 
                  id="start-time" 
                  type="time" 
                  value={availabilitySettings.workingHours.start} 
                  onChange={(e) => handleTimeChange('workingHours', 'start', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">Heure de fin</Label>
                <Input 
                  id="end-time" 
                  type="time" 
                  value={availabilitySettings.workingHours.end}
                  onChange={(e) => handleTimeChange('workingHours', 'end', e.target.value)}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="break-time"
                  checked={availabilitySettings.breakTime.enabled}
                  onCheckedChange={handleBreakToggle}
                />
                <Label htmlFor="break-time">Inclure une pause déjeuner</Label>
              </div>
              
              {availabilitySettings.breakTime.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6">
                  <div className="space-y-2">
                    <Label htmlFor="break-start">Début de la pause</Label>
                    <Input 
                      id="break-start" 
                      type="time" 
                      value={availabilitySettings.breakTime.start}
                      onChange={(e) => handleTimeChange('breakTime', 'start', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="break-end">Fin de la pause</Label>
                    <Input 
                      id="break-end" 
                      type="time" 
                      value={availabilitySettings.breakTime.end}
                      onChange={(e) => handleTimeChange('breakTime', 'end', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Options avancées</CardTitle>
            <CardDescription>Paramètres supplémentaires pour affiner vos disponibilités</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="buffer-before">
                  Temps tampon avant rendez-vous (minutes)
                </Label>
                <Input 
                  id="buffer-before" 
                  type="number" 
                  min="0"
                  value={availabilitySettings.advancedOptions.bufferBefore}
                  onChange={(e) => handleAdvancedOptionChange('bufferBefore', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buffer-after">
                  Temps tampon après rendez-vous (minutes)
                </Label>
                <Input 
                  id="buffer-after" 
                  type="number" 
                  min="0"
                  value={availabilitySettings.advancedOptions.bufferAfter}
                  onChange={(e) => handleAdvancedOptionChange('bufferAfter', e.target.value)}
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
                  value={availabilitySettings.advancedOptions.minAdvanceBooking}
                  onChange={(e) => handleAdvancedOptionChange('minAdvanceBooking', e.target.value)}
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
                  value={availabilitySettings.advancedOptions.maxAdvanceBooking}
                  onChange={(e) => handleAdvancedOptionChange('maxAdvanceBooking', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="ml-auto" 
              onClick={handleSave} 
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
