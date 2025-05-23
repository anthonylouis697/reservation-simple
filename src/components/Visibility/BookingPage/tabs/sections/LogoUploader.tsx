
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBookingPage } from '../../BookingPageContext';

export function LogoUploader() {
  const { 
    logo,
    setLogo,
    saveBookingPageSettings
  } = useBookingPage();
  
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Handle logo upload with improved error handling
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Vérification du type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez choisir une image valide');
      return;
    }
    
    // Vérification de la taille du fichier (max 1MB)
    if (file.size > 1024 * 1024) {
      toast.error('La taille de l\'image ne doit pas dépasser 1MB');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Utilisation de FileReader pour convertir l'image en base64
      const reader = new FileReader();
      
      reader.onload = async () => {
        const logoData = reader.result as string;
        
        try {
          // Mettre à jour le logo dans le state
          await setLogo(logoData);
          
          // Enregistrer les changements
          await saveBookingPageSettings();
          
          toast.success('Logo téléchargé et enregistré avec succès', {
            duration: 2000,
          });
        } catch (error) {
          console.error("Erreur lors de l'enregistrement du logo", error);
          toast.error("Erreur lors de l'enregistrement du logo");
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        toast.error("Erreur lors de la lecture du fichier");
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier", error);
      toast.error("Erreur lors du téléchargement du logo");
      setIsUploading(false);
    }
  };
  
  // Reset logo
  const handleResetLogo = async () => {
    setIsDeleting(true);
    
    try {
      await setLogo(null);
      
      // Enregistrer les changements
      await saveBookingPageSettings();
      toast.success('Logo supprimé avec succès', {
        duration: 2000,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du logo", error);
      toast.error("Erreur lors de la suppression du logo");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Label className="text-base font-medium mb-4 block">Logo de votre entreprise</Label>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div 
            className="w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50"
          >
            {logo ? (
              <img 
                src={logo} 
                alt="Logo" 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          
          <div className="space-y-2 flex-1">
            <Label 
              htmlFor="logo-upload" 
              className={`block w-full cursor-pointer text-center py-2 px-4 border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="flex items-center justify-center gap-2">
                <Upload className="h-4 w-4" />
                {isUploading ? "Téléchargement..." : logo ? "Changer le logo" : "Télécharger un logo"}
              </span>
              <Input 
                id="logo-upload" 
                type="file" 
                className="sr-only" 
                onChange={handleLogoUpload}
                accept="image/*"
                disabled={isUploading}
              />
            </Label>
            
            {logo && (
              <Button 
                variant="outline"
                onClick={handleResetLogo}
                className="w-full"
                disabled={isDeleting}
              >
                {isDeleting ? "Suppression..." : "Supprimer le logo"}
              </Button>
            )}
            
            <p className="text-xs text-muted-foreground text-center">
              Format recommandé : PNG ou JPG, dimensions carrées, max 1MB
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
