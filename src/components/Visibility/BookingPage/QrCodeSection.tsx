
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

export function QrCodeSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          <CardTitle>QR Code de réservation</CardTitle>
        </div>
        <CardDescription>
          Générez un QR code pour votre page de réservation à utiliser sur vos supports imprimés
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="w-48 h-48 bg-white p-4 rounded-md shadow-sm flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <QrCode className="w-24 h-24 mx-auto mb-2" />
            <p className="text-xs">Votre QR Code</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          <Button>
            Télécharger PNG
          </Button>
          
          <Button variant="outline">
            Télécharger SVG
          </Button>
          
          <Button variant="outline">
            Télécharger PDF
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground max-w-md">
          <p>Placez ce QR code sur vos cartes de visite, flyers, affiches ou dans votre établissement pour permettre à vos clients de prendre rendez-vous facilement.</p>
        </div>
      </CardContent>
    </Card>
  );
}
