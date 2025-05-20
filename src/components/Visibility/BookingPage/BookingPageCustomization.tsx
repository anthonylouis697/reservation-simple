
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Paintbrush, Layout, Type, Image } from 'lucide-react';

export function BookingPageCustomization() {
  const [primaryColor, setPrimaryColor] = useState('#9b87f5');
  const [businessName, setBusinessName] = useState('Mon Entreprise');
  const [welcomeMessage, setWelcomeMessage] = useState('Bienvenue sur ma page de réservation');
  const [logo, setLogo] = useState<string | null>(null);
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = () => {
    console.log('Sauvegarde de la personnalisation:', { primaryColor, businessName, welcomeMessage, logo });
    // Ici, vous implémenteriez la logique pour sauvegarder ces paramètres
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paintbrush className="h-5 w-5 text-primary" />
          Personnalisation de la page
        </CardTitle>
        <CardDescription>
          Personnalisez l'apparence de votre page de réservation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appearance">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Couleur principale</Label>
              <div className="flex gap-3 items-center">
                <Input 
                  type="color" 
                  id="primary-color" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)} 
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input 
                  type="text" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)} 
                  className="w-32"
                />
                <div 
                  className="h-10 w-10 rounded-full border"
                  style={{ backgroundColor: primaryColor }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-16 w-16 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                  {logo ? (
                    <img src={logo} alt="Logo aperçu" className="max-h-full max-w-full" />
                  ) : (
                    <Image className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" asChild>
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      Choisir une image
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Format recommandé: PNG ou JPEG. 1MB maximum.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Style de la page</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="border rounded-md p-3 cursor-pointer hover:border-primary hover:bg-primary/5 flex flex-col items-center">
                  <Layout className="h-10 w-10 mb-2 text-primary" />
                  <span className="text-sm">Standard</span>
                </div>
                <div className="border rounded-md p-3 cursor-pointer hover:border-primary hover:bg-primary/5 flex flex-col items-center">
                  <Layout className="h-10 w-10 mb-2" />
                  <span className="text-sm">Minimal</span>
                </div>
                <div className="border rounded-md p-3 cursor-pointer hover:border-primary hover:bg-primary/5 flex flex-col items-center">
                  <Layout className="h-10 w-10 mb-2" />
                  <span className="text-sm">Premium</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="business-name">Nom de l'entreprise</Label>
              <Input 
                id="business-name" 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="welcome-message">Message de bienvenue</Label>
              <Textarea 
                id="welcome-message" 
                value={welcomeMessage} 
                onChange={(e) => setWelcomeMessage(e.target.value)} 
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Ce message apparaîtra en haut de votre page de réservation.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="border rounded-lg p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  {logo && (
                    <div className="h-12 w-12">
                      <img src={logo} alt="Logo" className="max-h-full max-w-full" />
                    </div>
                  )}
                  <h2 className="text-xl font-semibold">{businessName}</h2>
                </div>
                
                <p>{welcomeMessage}</p>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Simulateur de page de réservation</h3>
                  <div 
                    className="border rounded-md p-4 space-y-3"
                    style={{ '--tw-border-opacity': '1', borderColor: `${primaryColor}20` } as React.CSSProperties}
                  >
                    <div className="space-y-1.5">
                      <Label>Sélectionnez un service</Label>
                      <div 
                        className="p-3 border rounded-md cursor-pointer hover:bg-muted/40 transition-colors"
                        style={{ '--tw-border-opacity': '1', borderColor: `${primaryColor}50` } as React.CSSProperties}
                      >
                        Service exemple
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label>Sélectionnez une date</Label>
                      <div className="border rounded-md p-3 text-center">
                        [Calendrier]
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label>Sélectionnez un horaire</Label>
                      <div className="flex flex-wrap gap-2">
                        <div 
                          className="py-1.5 px-3 rounded-md text-white text-sm text-center cursor-pointer"
                          style={{ backgroundColor: primaryColor }}
                        >
                          10:00
                        </div>
                        <div className="py-1.5 px-3 border rounded-md text-sm text-center cursor-pointer">
                          11:00
                        </div>
                        <div className="py-1.5 px-3 border rounded-md text-sm text-center cursor-pointer">
                          14:00
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4" 
                      style={{ backgroundColor: primaryColor, color: 'white', border: 'none' }}
                    >
                      Confirmer la réservation
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave}>Enregistrer les modifications</Button>
        </div>
      </CardContent>
    </Card>
  );
}
