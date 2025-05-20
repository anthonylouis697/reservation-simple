
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const socialNetworks = [
  {
    name: "Facebook",
    icon: "/facebook-icon.png",
    description: "Ajoutez un bouton de réservation sur votre page Facebook",
    link: "https://www.facebook.com/business/help/327029232278948"
  },
  {
    name: "Instagram",
    icon: "/instagram-icon.png",
    description: "Ajoutez un bouton de réservation à votre bio Instagram",
    link: "https://help.instagram.com/1791090447643166"
  },
  {
    name: "Google",
    icon: "/google-icon.png",
    description: "Activez les réservations sur votre fiche Google My Business",
    link: "https://support.google.com/business/answer/6218037"
  }
];

interface SocialNetworkSectionProps {
  bookingUrl: string;
}

export function SocialNetworkSection({ bookingUrl }: SocialNetworkSectionProps) {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Lien copié!",
      description: "Le lien a été copié dans le presse-papier.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {socialNetworks.map((network, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  {network.name.charAt(0)}
                </span>
                {network.name}
              </CardTitle>
              <CardDescription>{network.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => window.open(network.link, '_blank')}>
                Instructions
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Partagez sur les réseaux sociaux</CardTitle>
          <CardDescription>
            Informez vos suiveurs que vous utilisez Reservatoo pour les rendez-vous
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm">Message suggéré:</p>
              <p className="italic mt-2 text-sm">
                Réservez votre prochain rendez-vous en ligne sur ma page Reservatoo ! Plus besoin d'appeler, choisissez simplement l'horaire qui vous convient. Cliquez ici : {bookingUrl}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => handleCopy(`Réservez votre prochain rendez-vous en ligne sur ma page Reservatoo ! Plus besoin d'appeler, choisissez simplement l'horaire qui vous convient. Cliquez ici : ${bookingUrl}`)}>
                <Copy className="h-4 w-4 mr-2" />
                Copier le message
              </Button>
              
              <Button>
                <Share className="h-4 w-4 mr-2" />
                Partager maintenant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
