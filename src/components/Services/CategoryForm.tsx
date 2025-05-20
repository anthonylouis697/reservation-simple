
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
import { ImageIcon, X, Upload } from "lucide-react";

interface CategoryFormProps {
  initialData?: Category;
  categories: Category[];
  onSubmit: (data: Category) => void;
  onCancel: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

const SAMPLE_IMAGES = [
  "/placeholder.svg",
  "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=300&fit=crop"
];

export const CategoryForm = ({ initialData, categories, onSubmit, onCancel }: CategoryFormProps) => {
  const [formData, setFormData] = useState<Category>({
    id: initialData?.id || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    parentId: initialData?.parentId || undefined,
    isActive: initialData?.isActive ?? true,
    color: initialData?.color || "#8B5CF6", // Default to purple
    icon: initialData?.icon || "",
    imageUrl: initialData?.imageUrl || "",
    order: initialData?.order || 0,
  });

  const [showImagePicker, setShowImagePicker] = useState(false);

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

  const selectImage = (imageUrl: string) => {
    setFormData({
      ...formData,
      imageUrl
    });
    setShowImagePicker(false);
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      imageUrl: ""
    });
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
            {/* Image de la catégorie */}
            <div className="space-y-2">
              <Label>Image de la catégorie</Label>
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 rounded-md overflow-hidden flex items-center justify-center bg-secondary">
                  {formData.imageUrl ? (
                    <>
                      <img 
                        src={formData.imageUrl} 
                        alt="Aperçu de l'image de catégorie" 
                        className="h-full w-full object-cover"
                      />
                      <Button 
                        variant="destructive" 
                        size="icon"
                        className="absolute top-0 right-0 h-6 w-6 rounded-full"
                        type="button"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowImagePicker(prev => !prev)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {formData.imageUrl ? "Changer l'image" : "Ajouter une image"}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    L'image aidera les clients à identifier rapidement cette catégorie
                  </span>
                </div>
              </div>

              {showImagePicker && (
                <div className="mt-4 border rounded-md p-4">
                  <h3 className="font-medium mb-3">Choisissez une image</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {SAMPLE_IMAGES.map((img, index) => (
                      <div 
                        key={index} 
                        className={`h-16 w-16 rounded-md overflow-hidden cursor-pointer border-2 hover:opacity-80 transition-opacity ${
                          formData.imageUrl === img ? 'border-primary' : 'border-transparent'
                        }`}
                        onClick={() => selectImage(img)}
                      >
                        <img src={img} alt={`Option ${index + 1}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Vous pouvez aussi saisir une URL d'image
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowImagePicker(false)}
                      type="button"
                    >
                      Fermer
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Input
                      name="imageUrl"
                      value={formData.imageUrl || ""}
                      onChange={handleChange}
                      placeholder="URL de l'image (ex: https://example.com/image.jpg)"
                    />
                  </div>
                </div>
              )}
            </div>
            
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
