
import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, Share, QrCode, Copy, ExternalLink, Star, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BookingPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [customUrl, setCustomUrl] = useState("votre-nom");
  const bookingUrl = `https://reservatoo.com/book/${customUrl}`;

  // Tab navigation handling
  const getCurrentTab = () => {
    if (location.pathname.includes("/booking-page")) return "booking-page";
    if (location.pathname.includes("/social-integration")) return "social-integration";
    if (location.pathname.includes("/visibility-boost") || location.pathname === "/visibility-boost") return "visibility-boost";
    if (location.pathname.includes("/additional-services")) return "additional-services";
    return "main";
  };
  
  const visibilityOptions = [
    {
      title: "Vue d'ensemble",
      id: "main",
      href: "/visibility"
    },
    {
      title: "Page de réservation",
      id: "booking-page",
      href: "/visibility/booking-page"
    },
    {
      title: "Intégrations sociales",
      id: "social-integration",
      href: "/visibility/social-integration"
    },
    {
      title: "Boost de visibilité",
      id: "visibility-boost",
      href: "/visibility-boost"
    },
    {
      title: "Services additionnels",
      id: "additional-services",
      href: "/visibility/additional-services"
    }
  ];

  const handleTabChange = (value: string) => {
    const option = visibilityOptions.find(opt => opt.id === value);
    if (option) {
      navigate(option.href);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Lien copié!",
      description: "Le lien a été copié dans le presse-papier.",
    });
  };

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

        {/* Sub-navigation tabs */}
        <Tabs value={getCurrentTab()} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full justify-start mb-6 overflow-x-auto">
            {visibilityOptions.map(option => (
              <TabsTrigger key={option.id} value={option.id}>
                {option.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* These TabsContent sections are empty because they navigate to separate pages */}
          <TabsContent value="main"></TabsContent>
          <TabsContent value="social-integration"></TabsContent>
          <TabsContent value="visibility-boost"></TabsContent>
          <TabsContent value="additional-services"></TabsContent>
          
          <TabsContent value="booking-page">
            <div>
              <h2 className="text-xl font-semibold mb-4">Page de réservation</h2>
              <p className="text-muted-foreground mb-6">
                Partagez facilement votre page de réservation avec vos clients
              </p>
            </div>
            
            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="link">Lien</TabsTrigger>
                <TabsTrigger value="qrcode">QR Code</TabsTrigger>
                <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
              </TabsList>
              
              <TabsContent value="link" className="space-y-4 mt-4">
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
              </TabsContent>
              
              <TabsContent value="qrcode" className="space-y-4 mt-4">
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
              </TabsContent>
              
              <TabsContent value="social" className="space-y-4 mt-4">
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
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
