
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { toast } from 'sonner';

const Welcome = () => {
  const { user } = useAuth();
  const { createBusiness } = useBusiness();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [businessData, setBusinessData] = useState({
    name: '',
    slug: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Si c'est le nom qui change et que le slug est vide, on génère un slug automatiquement
    if (name === 'name' && !businessData.slug) {
      const autoSlug = value.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      setBusinessData(prev => ({
        ...prev,
        [name]: value,
        slug: autoSlug
      }));
    } else {
      setBusinessData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCreateBusiness = async () => {
    if (!businessData.name || !businessData.slug) {
      toast.error('Le nom et l\'URL personnalisée sont requis');
      return;
    }
    
    // Validation simple du slug (URL personnalisée)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(businessData.slug)) {
      toast.error('L\'URL personnalisée ne peut contenir que des lettres minuscules, des chiffres et des tirets');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await createBusiness({
        name: businessData.name,
        slug: businessData.slug,
        description: businessData.description || null,
        logo_url: null,
        phone: null,
        email: null,
        address: null,
        city: null,
        postal_code: null,
        country: null
      });
      
      if (result) {
        toast.success('Votre entreprise a été créée avec succès !');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'entreprise:', error);
      toast.error('Une erreur est survenue lors de la création de l\'entreprise');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-2 text-center">
          <Building2 className="h-12 w-12 mx-auto text-primary" />
          <CardTitle className="text-2xl">Bienvenue sur Reservatoo !</CardTitle>
          <CardDescription>
            Commençons par créer votre première entreprise pour configurer votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Nom de votre entreprise</Label>
            <Input 
              id="business-name" 
              placeholder="Mon entreprise"
              name="name"
              value={businessData.name}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="business-slug">URL personnalisée</Label>
            <div className="flex items-center space-x-0">
              <div className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input text-muted-foreground text-sm">
                reservatoo.com/
              </div>
              <Input
                id="business-slug"
                className="rounded-l-none"
                placeholder="mon-entreprise"
                name="slug"
                value={businessData.slug}
                onChange={handleInputChange}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Cette URL sera utilisée pour votre page de réservation publique.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="business-description">Description (optionnelle)</Label>
            <Textarea
              id="business-description"
              placeholder="Décrivez votre entreprise en quelques mots..."
              rows={3}
              name="description"
              value={businessData.description}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleCreateBusiness}
            disabled={isLoading}
          >
            {isLoading ? (
              "Création en cours..."
            ) : (
              <>
                Créer mon entreprise 
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <Button 
            variant="link" 
            className="text-muted-foreground" 
            onClick={handleSkip}
          >
            Ignorer pour l'instant
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Welcome;
