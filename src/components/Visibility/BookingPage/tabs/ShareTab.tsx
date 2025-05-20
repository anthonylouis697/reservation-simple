
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Share2, Copy, Download, FileText, Mail, Printer } from 'lucide-react';
import { toast } from 'sonner';

export function ShareTab() {
  const handleCopyLink = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Partager votre page
        </CardTitle>
        <CardDescription>
          Utilisez ces outils pour partager votre page avec vos clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Options de partage */}
            <div className="space-y-6 flex-1">
              {/* Lien direct */}
              <div className="space-y-2">
                <Label htmlFor="booking-link" className="text-base">Lien de réservation</Label>
                <div className="flex">
                  <Input
                    id="booking-link"
                    value="https://reservatoo.com/votre-nom"
                    readOnly
                    className="rounded-r-none"
                  />
                  <Button
                    onClick={() => handleCopyLink("https://reservatoo.com/votre-nom", "Lien copié dans le presse-papier")}
                    className="rounded-l-none"
                    variant="outline"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Partagez ce lien par email ou messagerie
                </p>
              </div>
              
              {/* Code QR */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium mb-1">Code QR</h3>
                  <p className="text-sm text-muted-foreground">
                    Téléchargez le code QR pour l'afficher dans votre établissement
                  </p>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="border p-3 rounded bg-white">
                    <svg width="120" height="120" viewBox="0 0 100 100" style={{ width: '120px', height: '120px' }}>
                      <rect x="0" y="0" width="100" height="100" fill="white" />
                      <rect x="10" y="10" width="10" height="10" fill="black" />
                      <rect x="20" y="10" width="10" height="10" fill="black" />
                      <rect x="30" y="10" width="10" height="10" fill="black" />
                      <rect x="60" y="10" width="10" height="10" fill="black" />
                      <rect x="70" y="10" width="10" height="10" fill="black" />
                      <rect x="80" y="10" width="10" height="10" fill="black" />
                      <rect x="10" y="20" width="10" height="10" fill="black" />
                      <rect x="40" y="20" width="10" height="10" fill="black" />
                      <rect x="50" y="20" width="10" height="10" fill="black" />
                      <rect x="80" y="20" width="10" height="10" fill="black" />
                      <rect x="10" y="30" width="10" height="10" fill="black" />
                      <rect x="30" y="30" width="10" height="10" fill="black" />
                      <rect x="50" y="30" width="10" height="10" fill="black" />
                      <rect x="80" y="30" width="10" height="10" fill="black" />
                      <rect x="10" y="40" width="10" height="10" fill="black" />
                      <rect x="30" y="40" width="10" height="10" fill="black" />
                      <rect x="40" y="40" width="10" height="10" fill="black" />
                      <rect x="60" y="40" width="10" height="10" fill="black" />
                      <rect x="80" y="40" width="10" height="10" fill="black" />
                      <rect x="10" y="50" width="10" height="10" fill="black" />
                      <rect x="30" y="50" width="10" height="10" fill="black" />
                      <rect x="50" y="50" width="10" height="10" fill="black" />
                      <rect x="60" y="50" width="10" height="10" fill="black" />
                      <rect x="70" y="50" width="10" height="10" fill="black" />
                      <rect x="80" y="50" width="10" height="10" fill="black" />
                      <rect x="10" y="60" width="10" height="10" fill="black" />
                      <rect x="80" y="60" width="10" height="10" fill="black" />
                      <rect x="10" y="70" width="10" height="10" fill="black" />
                      <rect x="30" y="70" width="10" height="10" fill="black" />
                      <rect x="40" y="70" width="10" height="10" fill="black" />
                      <rect x="50" y="70" width="10" height="10" fill="black" />
                      <rect x="60" y="70" width="10" height="10" fill="black" />
                      <rect x="80" y="70" width="10" height="10" fill="black" />
                      <rect x="10" y="80" width="10" height="10" fill="black" />
                      <rect x="20" y="80" width="10" height="10" fill="black" />
                      <rect x="30" y="80" width="10" height="10" fill="black" />
                      <rect x="40" y="80" width="10" height="10" fill="black" />
                      <rect x="50" y="80" width="10" height="10" fill="black" />
                      <rect x="60" y="80" width="10" height="10" fill="black" />
                      <rect x="70" y="80" width="10" height="10" fill="black" />
                      <rect x="80" y="80" width="10" height="10" fill="black" />
                    </svg>
                  </div>
                  
                  <div className="space-y-2">
                    <Button onClick={() => toast.success("Code QR téléchargé")} variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger PNG
                    </Button>
                    <Button onClick={() => toast.success("Code QR téléchargé")} variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Télécharger PDF
                    </Button>
                    <Button onClick={() => toast.success("Code QR imprimé")} variant="outline" className="w-full">
                      <Printer className="h-4 w-4 mr-2" />
                      Imprimer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Réseaux sociaux */}
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-base font-medium mb-1">Réseaux sociaux</h3>
                <p className="text-sm text-muted-foreground">
                  Partagez votre page de réservation sur vos réseaux sociaux
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                  </svg>
                  Facebook
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <svg className="h-5 w-5 mr-2" fill="#1DA1F2" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  X / Twitter
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <svg className="h-5 w-5 mr-2" fill="#E1306C" viewBox="0 0 24 24">
                    <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.8995 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.224 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" />
                  </svg>
                  Instagram
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <svg className="h-5 w-5 mr-2" fill="#0A66C2" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <svg className="h-5 w-5 mr-2" fill="#25D366" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-1.016-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <Mail className="h-5 w-5 mr-2" />
                  Email
                </Button>
                
                <Button variant="outline" className="justify-start">
                  <Share2 className="h-5 w-5 mr-2" />
                  Autre...
                </Button>
              </div>
              
              <div className="mt-4">
                <h3 className="text-base font-medium mb-1">Widget pour votre site web</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Intégrez un bouton de réservation sur votre site web
                </p>
                
                <div className="border rounded-md p-3 bg-slate-50">
                  <Label htmlFor="widget-code" className="text-xs mb-1 block">
                    Code d'intégration
                  </Label>
                  <div className="relative">
                    <Textarea 
                      id="widget-code"
                      className="pr-8 font-mono text-xs h-24"
                      value={`<script src="https://reservatoo.com/widget.js" data-id="votre-id"></script>`}
                      readOnly
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => handleCopyLink(`<script src="https://reservatoo.com/widget.js" data-id="votre-id"></script>`, "Code copié dans le presse-papier")}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">
                      Collez ce code dans votre site web pour afficher un bouton de réservation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
