
import { useState } from "react";
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, ExternalLink, Link, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function LinkShareSection() {
  const { toast } = useToast();
  const [customUrl, setCustomUrl] = useState("votre-nom");
  const bookingUrl = `https://reservatoo.com/book/${customUrl}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Lien copié!",
      description: "Le lien a été copié dans le presse-papier.",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link className="h-5 w-5 text-primary" />
            <CardTitle>Votre lien de réservation</CardTitle>
          </div>
          <CardDescription>
            Personnalisez et partagez votre lien de réservation direct
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Personnalisez votre URL</label>
            <div className="flex items-center">
              <span className="bg-muted px-3 py-2 rounded-l-md text-muted-foreground">
                https://reservatoo.com/book/
              </span>
              <Input 
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                className="rounded-l-none" 
              />
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-md flex items-center justify-between">
            <div className="font-mono text-sm truncate">{bookingUrl}</div>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(bookingUrl)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => handleCopy(bookingUrl)}>
              <Copy className="h-4 w-4 mr-2" />
              Copier le lien
            </Button>
            
            <Button variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Partager
            </Button>
            
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ouvrir
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Intégrez à votre site web</CardTitle>
          <CardDescription>
            Ajoutez un bouton de réservation sur votre site web existant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground mb-2">Code HTML à copier:</p>
              <pre className="text-xs overflow-x-auto p-2 bg-primary-foreground rounded">
                {`<a href="${bookingUrl}" target="_blank" style="display:inline-block;background:#7c3aed;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-family:sans-serif;font-weight:bold;">Prendre rendez-vous</a>`}
              </pre>
            </div>
            
            <Button variant="outline" onClick={() => handleCopy(`<a href="${bookingUrl}" target="_blank" style="display:inline-block;background:#7c3aed;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-family:sans-serif;font-weight:bold;">Prendre rendez-vous</a>`)}>
              <Copy className="h-4 w-4 mr-2" />
              Copier le code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
