
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/types/service";

interface CategoryFormProps {
  initialData?: Category;
  categories: Category[];
  onSubmit: (data: Category) => void;
  onCancel: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const CategoryForm = ({ initialData, categories, onSubmit, onCancel }: CategoryFormProps) => {
  const [formData, setFormData] = useState<Category>({
    id: initialData?.id || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    parentId: initialData?.parentId || undefined,
    isActive: initialData?.isActive ?? true,
    color: initialData?.color || "#8B5CF6", // Default to purple
    icon: initialData?.icon || "",
    order: initialData?.order || 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
      [name]: value === "none" ? undefined : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate an ID if this is a new category
    if (!formData.id) {
      formData.id = generateId();
    }
      
    onSubmit(formData);
  };

  // Filter out the current category and its children to prevent circular references
  const availableParentCategories = categories.filter(
    category => category.id !== formData.id && 
      // Prevent setting a child as a parent
      !hasChildRelationship(categories, category.id, formData.id)
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? "Modifier la catégorie" : "Ajouter une catégorie"}</CardTitle>
          <CardDescription>
            {initialData 
              ? "Modifiez les détails de la catégorie existante." 
              : "Créez une nouvelle catégorie pour organiser vos services."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la catégorie *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Soins du visage"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Décrivez cette catégorie de services..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Catégorie parente</Label>
              <Select 
                value={formData.parentId || "none"} 
                onValueChange={handleSelectChange("parentId")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Aucune catégorie parente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune catégorie parente</SelectItem>
                  {availableParentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color || "#8B5CF6"}
                  onChange={handleChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  id="colorText"
                  name="color"
                  value={formData.color || "#8B5CF6"}
                  onChange={handleChange}
                  placeholder="#8B5CF6"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="isActive" 
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange("isActive")}
              />
              <Label htmlFor="isActive">Catégorie active</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {initialData ? "Mettre à jour" : "Créer"} la catégorie
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

// Helper function to check if a potential parent has a child relationship with the current category
function hasChildRelationship(categories: Category[], potentialParentId: string, currentCategoryId: string): boolean {
  // If the potential parent is already a child of the current category, return true
  const directChild = categories.find(c => c.id === potentialParentId && c.parentId === currentCategoryId);
  if (directChild) return true;

  // Check for indirect child relationships (descendants)
  const childrenOfCurrent = categories.filter(c => c.parentId === currentCategoryId);
  return childrenOfCurrent.some(child => hasChildRelationship(categories, potentialParentId, child.id));
}
