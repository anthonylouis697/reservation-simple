
import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Building2 } from 'lucide-react';
import { useBusiness } from '@/contexts/BusinessContext';
import { toast } from 'sonner';

export function BusinessSelector() {
  const { businesses, currentBusiness, setCurrentBusiness, createBusiness } = useBusiness();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectChange = (value: string) => {
    if (value === 'create-new') {
      setIsDialogOpen(true);
      return;
    }
    
    const selected = businesses.find(business => business.id === value);
    if (selected) {
      setCurrentBusiness(selected);
    }
  };
  
  const handleCreateBusiness = async () => {
    if (!formData.name || !formData.slug) {
      toast.error('Le nom et l\'URL personnalisée sont requis');
      return;
    }
    
    // Validation simple du slug (URL personnalisée)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(formData.slug)) {
      toast.error('L\'URL personnalisée ne peut contenir que des lettres minuscules, des chiffres et des tirets');
      return;
    }
    
    setIsLoading(true);
    const result = await createBusiness({
      name: formData.name,
      slug: formData.slug,
      description: formData.description || null,
      logo_url: null,
      phone: null,
      email: null,
      address: null,
      city: null,
      postal_code: null,
      country: null
    });
    
    setIsLoading(false);
    
    if (result) {
      setIsDialogOpen(false);
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        slug: '',
        description: '',
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Si c'est le nom qui change et que le slug est vide, on génère un slug automatiquement
    if (name === 'name' && !formData.slug) {
      const autoSlug = value.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Supprime les accents
        .replace(/[^a-z0-9\s-]/g, '') // Garde uniquement les lettres, chiffres, espaces et tirets
        .replace(/\s+/g, '-') // Remplace les espaces par des tirets
        .replace(/-+/g, '-') // Remplace les tirets multiples par un seul
        .trim(); // Supprime les espaces au début et à la fin
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: autoSlug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="flex items-center">
      {businesses.length > 0 ? (
        <Select 
          value={currentBusiness?.id || ''} 
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className="w-[200px]">
            <div className="flex items-center gap-2 truncate">
              <Building2 className="h-4 w-4" />
              <SelectValue placeholder="Choisir une entreprise" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {businesses.map(business => (
              <SelectItem key={business.id} value={business.id}>
                {business.name}
              </SelectItem>
            ))}
            <SelectItem value="create-new" className="text-primary">
              <div className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Créer une nouvelle entreprise</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Créer votre première entreprise</span>
        </Button>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle entreprise</DialogTitle>
            <DialogDescription>
              Configurez les informations de base de votre entreprise. Vous pourrez compléter votre profil plus tard.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'entreprise</Label>
              <Input
                id="name"
                name="name"
                placeholder="Mon entreprise"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">URL personnalisée</Label>
              <div className="flex items-center space-x-2">
                <div className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input text-muted-foreground text-sm">
                  reservatoo.com/
                </div>
                <Input
                  id="slug"
                  name="slug"
                  className="rounded-l-none flex-1"
                  placeholder="mon-entreprise"
                  value={formData.slug}
                  onChange={handleInputChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Cette URL sera utilisée pour votre page de réservation publique.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Décrivez votre entreprise en quelques mots..."
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateBusiness} disabled={isLoading}>
              {isLoading ? "Création en cours..." : "Créer l'entreprise"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
