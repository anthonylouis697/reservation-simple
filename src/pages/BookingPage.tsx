
import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { VisibilityNavigation, useVisibilityNavigation } from "@/components/Visibility/VisibilityNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Copy, Eye, Image as ImageIcon, Layout, Link as LinkIcon, QrCode, Share2, Text } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function BookingPage() {
  const { currentTab } = useVisibilityNavigation();
  const [activeTab, setActiveTab] = useState("customize");
  const [customUrl] = useState("votre-nom");
  const bookingUrl = `https://reservatoo.com/book/${customUrl}`;
  
  // Customization state
  const [selectedTemplate, setSelectedTemplate] = useState("standard");
  const [primaryColor, setPrimaryColor] = useState("#9b87f5");
  const [businessName, setBusinessName] = useState("Votre Entreprise");
  const [welcomeMessage, setWelcomeMessage] = useState("Bienvenue sur notre page de réservation");
  const [logo, setLogo] = useState<string | null>(null);
  const [showConfirmationEmail, setShowConfirmationEmail] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Templates options
  const templates = [
    { id: "standard", name: "Standard", description: "Design classique professionnel" },
    { id: "minimal", name: "Minimaliste", description: "Design épuré et moderne" },
    { id: "bold", name: "Contrasté", description: "Design avec accents prononcés" },
  ];
  
  // Color presets
  const colorPresets = [
    "#9b87f5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"
  ];
  
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
    toast.success("Personnalisation enregistrée");
    // Ici vous implémenteriez la logique pour sauvegarder ces paramètres
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    toast.success("Lien copié dans le presse-papier");
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <AppLayout>
      <Helmet>
        <title>Page de réservation - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Visibilité et Croissance</h1>
          <p className="text-muted-foreground mt-1">
            Développez votre présence en ligne et augmentez vos revenus
          </p>
        </div>

        <VisibilityNavigation currentTab={currentTab} />
          
        <div>
          <h2 className="text-xl font-semibold mb-4">Page de réservation</h2>
          <p className="text-muted-foreground mb-6">
            Personnalisez et partagez facilement votre page de réservation
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="customize" className="flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Personnaliser
                </TabsTrigger>
                <TabsTrigger value="share" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Partager
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Text className="h-4 w-4" />
                  Textes & Options
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="customize" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Choisir un modèle</CardTitle>
                    <CardDescription>
                      Sélectionnez un modèle qui convient à votre activité
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {templates.map(template => (
                        <div 
                          key={template.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedTemplate === template.id 
                              ? "ring-2 ring-primary ring-offset-1" 
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div className="h-24 mb-4 rounded bg-muted flex items-center justify-center">
                            <Layout className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {template.description}
                          </p>
                          {selectedTemplate === template.id && (
                            <Badge variant="outline" className="mt-2 bg-primary/10 text-primary">
                              Sélectionné
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Couleurs et style</CardTitle>
                    <CardDescription>
                      Personnalisez l'apparence de votre page de réservation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="primary-color">Couleur principale</Label>
                        <div className="flex gap-3 items-center">
                          <div className="flex flex-wrap gap-2">
                            {colorPresets.map(color => (
                              <button
                                key={color}
                                className={`w-8 h-8 rounded-full border ${
                                  primaryColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => setPrimaryColor(color)}
                                aria-label={`Couleur ${color}`}
                              />
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2">
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
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="logo">Logo</Label>
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 h-16 w-16 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                            {logo ? (
                              <img src={logo} alt="Logo aperçu" className="max-h-full max-w-full" />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="space-y-1">
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
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Textes et labels</CardTitle>
                    <CardDescription>
                      Personnalisez les textes qui s'affichent sur votre page de réservation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
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
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="confirmation-email" className="text-base">Email de confirmation</Label>
                            <p className="text-sm text-muted-foreground">
                              Envoyer un email de confirmation après la réservation
                            </p>
                          </div>
                          <Switch
                            id="confirmation-email"
                            checked={showConfirmationEmail}
                            onCheckedChange={setShowConfirmationEmail}
                          />
                        </div>
                        
                        {showConfirmationEmail && (
                          <div className="space-y-2 pl-6 border-l-2 border-muted ml-2">
                            <div className="space-y-1">
                              <Label htmlFor="email-subject">Objet de l'email</Label>
                              <Input 
                                id="email-subject" 
                                defaultValue="Confirmation de votre réservation" 
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="email-template">Modèle d'email</Label>
                              <Select defaultValue="default">
                                <SelectTrigger id="email-template">
                                  <SelectValue placeholder="Choisir un modèle" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="default">Modèle par défaut</SelectItem>
                                  <SelectItem value="minimal">Modèle minimal</SelectItem>
                                  <SelectItem value="branded">Modèle personnalisé</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground mt-1">
                                Vous pouvez personnaliser les modèles d'emails dans les paramètres de notification.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Options avancées</CardTitle>
                    <CardDescription>
                      Configurez des options supplémentaires pour votre page de réservation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">URL personnalisée</Label>
                          <p className="text-sm text-muted-foreground">
                            Personnalisez l'URL de votre page de réservation
                          </p>
                        </div>
                        <div className="max-w-[200px]">
                          <Input defaultValue={customUrl} className="text-right" />
                        </div>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Redirection après réservation</Label>
                          <p className="text-sm text-muted-foreground">
                            Page où rediriger après une réservation réussie
                          </p>
                        </div>
                        <div className="max-w-[200px]">
                          <Select defaultValue="thank-you">
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir une page" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="thank-you">Page de remerciement</SelectItem>
                              <SelectItem value="homepage">Page d'accueil</SelectItem>
                              <SelectItem value="custom">URL personnalisée</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="share" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Partager votre page de réservation</CardTitle>
                    <CardDescription>
                      Utilisez ces outils pour partager votre page avec vos clients
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="booking-link">Votre lien de réservation</Label>
                        <div className="flex items-center">
                          <Input
                            id="booking-link"
                            value={bookingUrl}
                            readOnly
                            className="rounded-r-none"
                          />
                          <Button
                            onClick={handleCopyLink}
                            className="rounded-l-none"
                            variant="outline"
                          >
                            {copied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <LinkIcon className="h-4 w-4 mr-2 text-primary" />
                              Lien direct
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs">
                            <p>Partagez ce lien par email ou messagerie</p>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button variant="secondary" size="sm" className="w-full" onClick={handleCopyLink}>
                              Copier le lien
                            </Button>
                          </CardFooter>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <QrCode className="h-4 w-4 mr-2 text-primary" />
                              Code QR
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs">
                            <p>Imprimez pour un affichage physique</p>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button variant="secondary" size="sm" className="w-full" onClick={() => toast.success("QR Code téléchargé")}>
                              Télécharger
                            </Button>
                          </CardFooter>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <Share2 className="h-4 w-4 mr-2 text-primary" />
                              Réseaux sociaux
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-xs">
                            <p>Partagez sur vos réseaux sociaux</p>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button variant="secondary" size="sm" className="w-full" onClick={() => setActiveTab("social")}>
                              Options de partage
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave}>Enregistrer les modifications</Button>
            </div>
          </div>
          
          <div className="col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" /> 
                  Aperçu
                </CardTitle>
                <CardDescription>
                  Visualisez votre page de réservation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div 
                    className="h-12 flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {businessName}
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full border flex items-center justify-center bg-white mb-2">
                        {logo ? (
                          <img src={logo} alt="Logo" className="max-h-full max-w-full rounded-full" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      
                      <p className="text-sm text-center">
                        {welcomeMessage}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Sélectionnez un service</Label>
                      <div className="border rounded p-2 text-sm cursor-pointer hover:bg-accent">
                        Service exemple
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Sélectionnez une date</Label>
                      <div className="border rounded p-2 text-sm text-center">
                        [Calendrier]
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Sélectionnez un horaire</Label>
                      <div className="flex flex-wrap gap-1 text-xs">
                        <div 
                          className="py-1 px-2 rounded text-white cursor-pointer"
                          style={{ backgroundColor: primaryColor }}
                        >
                          10:00
                        </div>
                        <div className="py-1 px-2 border rounded cursor-pointer">
                          11:00
                        </div>
                        <div className="py-1 px-2 border rounded cursor-pointer">
                          14:00
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full text-xs h-8 mt-2" 
                      style={{ backgroundColor: primaryColor }}
                    >
                      Confirmer
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Aperçu simplifié. L'apparence réelle peut varier.
                </p>
                
                <div className="flex justify-center mt-4">
                  <Button variant="outline" size="sm" className="text-xs">
                    Voir en plein écran
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
