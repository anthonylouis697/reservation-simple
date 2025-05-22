
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBusiness } from "@/contexts/BusinessContext";
import { ExternalLink, Copy, Link } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const BookingLinkCard = () => {
  const { currentBusiness } = useBusiness();
  const [copied, setCopied] = useState(false);
  
  // If no business is found, show a message
  if (!currentBusiness) {
    return null;
  }

  const businessSlug = currentBusiness.slug || "";
  const bookingUrl = businessSlug ? `${window.location.origin}/booking/${businessSlug}` : "";

  const handleCopyUrl = () => {
    if (!bookingUrl) {
      toast.error("Veuillez d'abord configurer le slug de votre entreprise");
      return;
    }
    navigator.clipboard.writeText(bookingUrl).then(() => {
      setCopied(true);
      toast.success("URL copiée dans le presse-papier");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleOpenPreview = () => {
    if (!bookingUrl) {
      toast.error("Veuillez d'abord configurer le slug de votre entreprise");
      return;
    }
    window.open(bookingUrl, '_blank');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Link className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Votre page de réservation</CardTitle>
        </div>
        <CardDescription>
          Partagez ce lien avec vos clients pour qu'ils puissent réserver en ligne
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!businessSlug ? (
          <div className="p-3 bg-muted rounded-md flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">Configurez d'abord le slug de votre entreprise</div>
          </div>
        ) : (
          <div className="p-3 bg-muted rounded-md flex items-center justify-between mb-4">
            <div className="font-mono text-sm truncate">{bookingUrl}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopyUrl}
              className="ml-2 flex-shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="flex gap-2 justify-end">
          <Button 
            onClick={handleOpenPreview} 
            className="w-full"
            disabled={!businessSlug}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Ouvrir la page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
