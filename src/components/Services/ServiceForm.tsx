
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, X, Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Service, VariableDurationOption } from "@/types/service";

interface ServiceFormProps {
  initialData?: Service;
  onSubmit: (data: Service) => void;
  onCancel: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const ServiceForm = ({ initialData, onSubmit, onCancel }: ServiceFormProps) => {
  const [formData, setFormData] = useState<Service>({
    id: initialData?.id || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    duration: initialData?.duration || 30,
    price: initialData?.price || 0,
    location: initialData?.location || "",
    capacity: initialData?.capacity || 1,
    category: initialData?.category || "",
    bufferTimeBefore: initialData?.bufferTimeBefore || 0,
    bufferTimeAfter: initialData?.bufferTimeAfter || 0,
    assignedEmployees: initialData?.assignedEmployees || [],
    isRecurring: initialData?.isRecurring || false,
    recurringFrequency: initialData?.recurringFrequency || "weekly",
    recurringExceptions: initialData?.recurringExceptions || [],
    isActive: initialData?.isActive ?? true,
    variableDurationOptions: initialData?.variableDurationOptions || [],
  });

  const [isVariableDuration, setIsVariableDuration] = useState(false);
  const [showExceptionDialog, setShowExceptionDialog] = useState(false);
  const [exceptionDate, setExceptionDate] = useState<Date | undefined>(new Date());

  // Determine if this service has variable duration options
  useEffect(() => {
    setIsVariableDuration((formData.variableDurationOptions?.length || 0) > 0);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addVariableDurationOption = () => {
    const newOptions = [...(formData.variableDurationOptions || [])];
    newOptions.push({
      id: generateId(),
      name: `Option ${newOptions.length + 1}`,
      duration: formData.duration,
      price: formData.price,
    });
    
    setFormData({
      ...formData,
      variableDurationOptions: newOptions,
    });
    
    setIsVariableDuration(true);
  };

  const updateDurationOption = (id: string, field: keyof VariableDurationOption, value: string | number) => {
    const newOptions = formData.variableDurationOptions?.map(option => 
      option.id === id 
        ? { ...option, [field]: typeof value === 'string' && field !== 'name' ? Number(value) : value } 
        : option
    );

    setFormData({
      ...formData,
      variableDurationOptions: newOptions,
    });
  };

  const removeDurationOption = (id: string) => {
    const newOptions = formData.variableDurationOptions?.filter(option => option.id !== id);
    
    setFormData({
      ...formData,
      variableDurationOptions: newOptions,
    });
    
    if (newOptions?.length === 0) {
      setIsVariableDuration(false);
    }
  };

  const addException = () => {
    if (exceptionDate) {
      const dateStr = exceptionDate.toISOString().split('T')[0];
      if (!formData.recurringExceptions?.includes(dateStr)) {
        setFormData({
          ...formData,
          recurringExceptions: [...(formData.recurringExceptions || []), dateStr],
        });
      }
      setShowExceptionDialog(false);
    }
  };

  const removeException = (date: string) => {
    setFormData({
      ...formData,
      recurringExceptions: formData.recurringExceptions?.filter(d => d !== date),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If variable duration is disabled but we have options, remove them
    const finalFormData = isVariableDuration 
      ? formData 
      : { ...formData, variableDurationOptions: [] };
      
    onSubmit(finalFormData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? "Modifier le service" : "Ajouter un service"}</CardTitle>
          <CardDescription>
            {initialData 
              ? "Modifiez les détails du service existant." 
              : "Créez un nouveau service pour votre catalogue."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du service *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Consultation standard"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Ex: Consultations"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez ce service pour vos clients..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {!isVariableDuration && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée (minutes) *</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min={1}
                      value={formData.duration}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (€) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min={0}
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacité *</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min={0}
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="0 = illimité"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lieu *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: Cabinet principal"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bufferTimeBefore">Temps tampon avant (minutes)</Label>
                <Input
                  id="bufferTimeBefore"
                  name="bufferTimeBefore"
                  type="number"
                  min={0}
                  value={formData.bufferTimeBefore}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bufferTimeAfter">Temps tampon après (minutes)</Label>
                <Input
                  id="bufferTimeAfter"
                  name="bufferTimeAfter"
                  type="number"
                  min={0}
                  value={formData.bufferTimeAfter}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isRecurring" 
                  checked={formData.isRecurring}
                  onCheckedChange={handleSwitchChange("isRecurring")}
                />
                <Label htmlFor="isRecurring">Service récurrent</Label>
              </div>
              
              {formData.isRecurring && (
                <div className="pl-10 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recurringFrequency">Fréquence</Label>
                    <Select 
                      value={formData.recurringFrequency} 
                      onValueChange={handleSelectChange("recurringFrequency")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez la fréquence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuel</SelectItem>
                        <SelectItem value="yearly">Annuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Exceptions</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowExceptionDialog(true)}
                      >
                        Ajouter une exception
                      </Button>
                    </div>
                    {formData.recurringExceptions && formData.recurringExceptions.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.recurringExceptions.map((date) => (
                          <Badge key={date} variant="secondary" className="flex items-center gap-1">
                            {format(new Date(date), "dd/MM/yyyy")}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeException(date)}
                            />
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Aucune exception ajoutée
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="variableDuration" 
                  checked={isVariableDuration}
                  onCheckedChange={setIsVariableDuration}
                />
                <Label htmlFor="variableDuration">Durées et prix variables</Label>
              </div>
              
              {isVariableDuration && (
                <div className="pl-10 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Options de durée</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={addVariableDurationOption}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Ajouter une option
                      </Button>
                    </div>
                    
                    {formData.variableDurationOptions && formData.variableDurationOptions.length > 0 ? (
                      <div className="space-y-3">
                        {formData.variableDurationOptions.map((option) => (
                          <div key={option.id} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-md">
                            <div className="grow">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                  <Label htmlFor={`name-${option.id}`} className="text-xs mb-1 block">Nom</Label>
                                  <Input
                                    id={`name-${option.id}`}
                                    value={option.name}
                                    onChange={(e) => updateDurationOption(option.id, 'name', e.target.value)}
                                    placeholder="Nom de l'option"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`duration-${option.id}`} className="text-xs mb-1 block">Durée (min)</Label>
                                  <Input
                                    id={`duration-${option.id}`}
                                    type="number"
                                    min={1}
                                    value={option.duration}
                                    onChange={(e) => updateDurationOption(option.id, 'duration', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`price-${option.id}`} className="text-xs mb-1 block">Prix (€)</Label>
                                  <Input
                                    id={`price-${option.id}`}
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={option.price}
                                    onChange={(e) => updateDurationOption(option.id, 'price', e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              className="p-1 h-auto text-destructive"
                              onClick={() => removeDurationOption(option.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div 
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary/50"
                        onClick={addVariableDurationOption}
                      >
                        <PlusCircle className="h-6 w-6 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Cliquez pour ajouter une option de durée
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="isActive" 
                  checked={formData.isActive}
                  onCheckedChange={handleSwitchChange("isActive")}
                />
                <Label htmlFor="isActive">Service actif</Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {initialData ? "Mettre à jour" : "Créer"} le service
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showExceptionDialog} onOpenChange={setShowExceptionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter une exception</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Calendar
              mode="single"
              selected={exceptionDate}
              onSelect={setExceptionDate}
              className="rounded-md border"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExceptionDialog(false)}>Annuler</Button>
            <Button onClick={addException}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};
