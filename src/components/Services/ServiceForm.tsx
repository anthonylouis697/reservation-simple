
import { useState } from "react";
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
import { Service } from "@/types/service";

interface ServiceFormProps {
  initialData?: Service;
  onSubmit: (data: Service) => void;
  onCancel: () => void;
}

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
    isActive: initialData?.isActive ?? true,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
    </form>
  );
};
