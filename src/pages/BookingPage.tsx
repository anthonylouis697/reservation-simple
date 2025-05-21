
import { useState } from "react";
import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import { VisibilityNavigation, useVisibilityNavigation } from "@/components/Visibility/VisibilityNavigation";
import { BookingPageCustomization } from "@/components/Visibility/BookingPage/BookingPageCustomization";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, Copy, ExternalLink, Save } from "lucide-react";
import { toast } from "sonner";
import { useBookingPage } from "@/components/Visibility/BookingPage/BookingPageContext";
import { BookingPageProvider } from "@/components/Visibility/BookingPage/BookingPageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function BookingPage() {
  const { currentTab } = useVisibilityNavigation();
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, businessId } = useAuth();

  // Composant pour le contenu principal
  const PageContent = () => {
    const { 
      customUrl = "", 
      saveBookingPageSettings, 
      primaryColor = "#9b87f5", 
      selectedTemplate = "standard", 
      buttonCorners = "rounded", 
      layoutType = "stepped", 
      businessName = "Votre entreprise"
    } = useBookingPage();
    
    // URL de la page de réservation publique
    const publicBookingUrl = `${window.location.origin}/booking/${customUrl || "votre-nom"}`;
    
    // Fonction pour copier l'URL dans le presse-papier
    const handleCopyUrl = () => {
      navigator.clipboard.writeText(publicBookingUrl).then(() => {
        setCopied(true);
        toast.success("URL copiée dans le presse-papier");
        setTimeout(() => setCopied(false), 2000);
      });
    };

    // Fonction pour ouvrir la page de réservation dans un nouvel onglet
    const handleOpenPreview = () => {
      window.open(`/booking/${customUrl || "votre-nom"}`, '_blank');
    };

    // Fonction pour sauvegarder les paramètres
    const handleSaveSettings = async () => {
      setIsSaving(true);
      try {
        await saveBookingPageSettings();
        toast.success("Paramètres de la page de réservation enregistrés avec succès");
      } catch (error) {
        toast.error("Une erreur est survenue lors de l'enregistrement des paramètres");
        console.error("Error saving booking page settings:", error);
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Page de réservation</h1>
            <p className="text-muted-foreground mt-1">
              Personnalisez votre page de réservation et augmentez votre visibilité en ligne
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowPreviewDialog(true)}
            >
              Partager
            </Button>
            <Button onClick={handleOpenPreview}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Prévisualiser
            </Button>
            <Button 
              variant="default"
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <>Enregistrement...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </div>

        <VisibilityNavigation currentTab={currentTab} />
        
        <BookingPageCustomization />

        <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle>Partager votre page de réservation</DialogTitle>
            <DialogDescription>
              Partagez ce lien avec vos clients pour qu'ils puissent réserver en ligne.
            </DialogDescription>
            <div className="flex items-center space-x-2 mt-4">
              <div className="grid flex-1 gap-2">
                <Input
                  readOnly
                  value={publicBookingUrl}
                  className="w-full"
                />
              </div>
              <Button size="icon" onClick={handleCopyUrl}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Fermer</Button>
              </DialogClose>
              <Button onClick={handleOpenPreview}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Ouvrir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return (
    <BookingPageProvider>
      <AppLayout>
        <Helmet>
          <title>Personnalisation - Page de réservation - Reservatoo</title>
        </Helmet>

        <PageContent />
      </AppLayout>
    </BookingPageProvider>
  );
}
