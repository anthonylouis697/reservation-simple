
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Facebook,
  Instagram,
  Link as LinkIcon,
  QrCode,
  Globe,
  Image as ImageIcon,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

const BookingCustomization = () => {
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [activeTab, setActiveTab] = useState("appearance");
  const [bookingLink, setBookingLink] = useState("https://bookwise.app/r/johndoe");
  const [copied, setCopied] = useState(false);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Lien copié dans le presse-papier');
  };
  
  const handleColorChange = (color: string) => {
    setPrimaryColor(color);
    // Dans une vraie app, cela mettrait à jour la couleur dans la base de données
    toast.success('Couleur principale mise à jour');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Personnalisation de la page de réservation</h1>
        <p className="text-muted-foreground">
          Personnalisez l'apparence et les options de partage de votre page de réservation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="appearance">Apparence</TabsTrigger>
              <TabsTrigger value="sharing">Partage</TabsTrigger>
              <TabsTrigger value="embed">Intégration</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="appearance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Couleurs</CardTitle>
                    <CardDescription>
                      Personnalisez les couleurs de votre page de réservation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="primaryColor">Couleur principale</Label>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex flex-wrap gap-2">
                            {["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"].map((color) => (
                              <button
                                key={color}
                                className={`w-8 h-8 rounded-full border ${
                                  primaryColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorChange(color)}
                                aria-label={`Couleur ${color}`}
                              />
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={primaryColor}
                              onChange={(e) => handleColorChange(e.target.value)}
                              id="primaryColor"
                              className="w-9 h-9 border rounded cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Nom de l'entreprise</Label>
                        <Input id="companyName" defaultValue="Entreprise ABC" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Décrivez votre entreprise en quelques mots"
                          defaultValue="Spécialiste en consultation et coaching pour particuliers et professionnels."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                    <CardDescription>
                      Ajoutez une image de profil et une bannière à votre page de réservation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Logo / Image de profil</Label>
                        <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Glissez-déposez ou sélectionnez un fichier</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG ou GIF jusqu'à 2 MB</p>
                          </div>
                          <Button variant="outline">
                            Télécharger une image
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Image de bannière</Label>
                        <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4 h-32">
                          <div className="flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Glissez-déposez ou sélectionnez un fichier</p>
                            <p className="text-xs text-muted-foreground">PNG ou JPG (1920x480px recommandé)</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Télécharger une image
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sharing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Partager votre page de réservation</CardTitle>
                    <CardDescription>
                      Partagez votre page de réservation avec vos clients
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bookingLink">Votre lien de réservation</Label>
                        <div className="flex items-center mt-2">
                          <Input
                            id="bookingLink"
                            value={bookingLink}
                            onChange={(e) => setBookingLink(e.target.value)}
                            readOnly
                            className="rounded-r-none"
                          />
                          <Button
                            onClick={handleCopyLink}
                            className="rounded-l-none px-3 h-10"
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
                      
                      <div className="space-y-2 pt-4">
                        <Label>Partager sur les réseaux sociaux</Label>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" className="gap-2">
                            <Facebook className="h-5 w-5" /> Facebook
                          </Button>
                          <Button variant="outline" className="gap-2">
                            <Instagram className="h-5 w-5" /> Instagram
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 pt-4">
                        <Label>Code QR</Label>
                        <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                          <div className="w-48 h-48 border flex items-center justify-center bg-white">
                            <QrCode className="h-32 w-32" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Scannez ce code QR pour accéder à votre page de réservation
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline">
                              Télécharger
                            </Button>
                            <Button variant="outline">
                              Imprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="embed" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Intégrer à votre site web</CardTitle>
                    <CardDescription>
                      Intégrez votre page de réservation directement sur votre site web
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="embedType">Type d'intégration</Label>
                        <Select defaultValue="inline">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type d'intégration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inline">Intégration inline</SelectItem>
                            <SelectItem value="popup">Popup (bouton de réservation)</SelectItem>
                            <SelectItem value="redirect">Lien de redirection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="embedCode">Code d'intégration</Label>
                        <div className="relative">
                          <Textarea
                            id="embedCode"
                            readOnly
                            rows={6}
                            className="font-mono text-sm"
                            value={`<iframe 
  src="${bookingLink}/embed" 
  style="width: 100%; height: 600px; border: none;"
  allow="camera; microphone; fullscreen; display-capture">
</iframe>`}
                          />
                          <Button
                            onClick={() => {
                              navigator.clipboard.writeText(`<iframe 
  src="${bookingLink}/embed" 
  style="width: 100%; height: 600px; border: none;"
  allow="camera; microphone; fullscreen; display-capture">
</iframe>`);
                              toast.success('Code d\'intégration copié');
                            }}
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Copiez ce code et collez-le sur votre site web pour afficher votre formulaire de réservation.
                        </p>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Intégrer à Google My Business</Label>
                          <p className="text-sm text-muted-foreground">
                            Connectez votre compte Google My Business pour ajouter un bouton de réservation à votre profil.
                          </p>
                        </div>
                        <Button variant="outline" className="gap-2">
                          <Globe className="h-4 w-4" /> Connecter Google My Business
                        </Button>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Intégrer à Facebook</Label>
                          <p className="text-sm text-muted-foreground">
                            Connectez votre page Facebook pour ajouter un bouton de réservation.
                          </p>
                        </div>
                        <Button variant="outline" className="gap-2">
                          <Facebook className="h-4 w-4" /> Connecter Facebook
                        </Button>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Intégrer à Instagram</Label>
                          <p className="text-sm text-muted-foreground">
                            Connectez votre compte Instagram pour ajouter un lien de réservation dans votre bio.
                          </p>
                        </div>
                        <Button variant="outline" className="gap-2">
                          <Instagram className="h-4 w-4" /> Connecter Instagram
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Aperçu</CardTitle>
              <CardDescription>
                Visualisez l'apparence de votre page de réservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div
                  className="h-12 flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: primaryColor }}
                >
                  Entreprise ABC
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center py-4">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <h3 className="text-center font-medium">Entreprise ABC</h3>
                    <p className="text-center text-sm text-muted-foreground">
                      Spécialiste en consultation et coaching pour particuliers et professionnels.
                    </p>
                    
                    <div className="space-y-2">
                      <Label className="text-xs">Sélectionnez un service</Label>
                      <div className="border rounded p-3 text-sm cursor-pointer hover:bg-accent">
                        Consultation initiale
                      </div>
                      <div className="border rounded p-3 text-sm cursor-pointer hover:bg-accent">
                        Coaching personnalisé
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4" 
                      style={{ backgroundColor: primaryColor }}
                    >
                      Continuer
                    </Button>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                Aperçu simplifié. L'apparence peut varier légèrement.
              </p>
              
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm">
                  Voir la page complète
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingCustomization;
