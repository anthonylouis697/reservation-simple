
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Settings } from "lucide-react";
import { Service, VariableDurationOption, Category } from "@/types/service";
import { ImageUploader } from "./ImageUploader";
import { VariableDurationOptions } from "./VariableDurationOptions";

interface ServiceFormProps {
  initialData?: Service;
  categories: Category[];
  onSubmit: (data: Service) => void;
  onCancel: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const ServiceForm = ({ initialData, categories, onSubmit, onCancel }: ServiceFormProps) => {
  const [formData, setFormData] = useState<Service>(() => {
    const defaultData = {
      id: initialData?.id || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      duration: initialData?.duration || 30,
      price: initialData?.price || 0,
      capacity: initialData?.capacity || 1,
      categoryId: initialData?.categoryId,
      bufferTimeBefore: initialData?.bufferTimeBefore || 0,
      bufferTimeAfter: initialData?.bufferTimeAfter || 0,
      isActive: initialData?.isActive ?? true,
      variableDurationOptions: initialData?.variableDurationOptions || [],
      imageUrl: initialData?.imageUrl,
    };
    return defaultData;
  });

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      [name]: value === "none" && name === "categoryId" ? undefined : value,
    });
  };

  const handleImageChange = (imageUrl: string | undefined) => {
    setFormData({
      ...formData,
      imageUrl,
    });
  };

  const handleVariableOptionsChange = (options: VariableDurationOption[]) => {
    setFormData({
      ...formData,
      variableDurationOptions: options,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Générer un ID si ce n'est pas un service existant
    const serviceData = {
      ...formData,
      id: formData.id || generateId(),
      variableDurationOptions: formData.variableDurationOptions || []
    };
    
    onSubmit(serviceData);
  };

  const organizeCategories = () => {
    const activeCategories = categories?.filter(cat => cat.isActive) || [];
    
    return (
      <>
        <SelectItem value="none">Aucune catégorie</SelectItem>
        {activeCategories.map(category => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </>
    );
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
          {/* Section principale */}
          <div className="space-y-4">
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
              <Label htmlFor="categoryId">Catégorie</Label>
              <Select 
                value={formData.categoryId || "none"} 
                onValueChange={handleSelectChange("categoryId")}
                disabled={!categories || categories.length === 0}
              >
                <SelectTrigger className={(!categories || categories.length === 0) ? "opacity-50" : ""}>
                  <SelectValue placeholder={
                    (!categories || categories.length === 0)
                      ? "Aucune catégorie disponible" 
                      : "Sélectionnez une catégorie"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {organizeCategories()}
                </SelectContent>
              </Select>
              {(!categories || categories.length === 0) && (
                <p className="text-xs text-muted-foreground">
                  Créez d'abord des catégories dans l'onglet Catégories
                </p>
              )}
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

            <ImageUploader 
              imageUrl={formData.imageUrl}
              onImageChange={handleImageChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="flex items-center space-x-2">
              <Switch 
                id="isActive" 
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange("isActive")}
              />
              <Label htmlFor="isActive">Service actif</Label>
            </div>
          </div>

          {/* Options avancées */}
          <Collapsible open={showAdvancedOptions} onOpenChange={setShowAdvancedOptions}>
            <CollapsibleTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Plus de paramètres
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <VariableDurationOptions
                options={formData.variableDurationOptions || []}
                defaultDuration={formData.duration}
                defaultPrice={formData.price}
                onChange={handleVariableOptionsChange}
              />
            </CollapsibleContent>
          </Collapsible>
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
