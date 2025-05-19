import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Check, Copy, Facebook, Instagram, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea";

const IntegrationSettings = () => {
  const handleCopyClick = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Intégrations</h3>
        <p className="text-sm text-muted-foreground">
          Connectez vos services favoris pour améliorer votre expérience de réservation
        </p>
      </div>

      <Tabs defaultValue="payment" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="payment">Paiement</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
          <TabsTrigger value="tools">Outils</TabsTrigger>
        </TabsList>

        <TabsContent value="payment" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Passerelles de paiement</CardTitle>
              <CardDescription>
                Configurez vos méthodes de paiement pour accepter les paiements de vos clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Stripe</p>
                      <p className="text-sm text-muted-foreground">
                        Acceptez les paiements par carte bancaire et Apple Pay
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>

                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-[#0070BA]/10 p-2">
                      <svg className="h-6 w-6 text-[#0070BA]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a1.006 1.006 0 0 1-.995-1.007V3.66a1 1 0 0 1 1.002-.996h4.586a1.033 1.033 0 0 1 .997 1.007v16.67a1.01 1.01 0 0 1-.984.997ZM21.538 12.497c-.57.98-1.64 1.15-2.535 1.15h-.31v3.89c0 .12-.02.23-.07.33-.17.36-.49.51-.85.51-.38 0-.71-.15-.87-.51a.936.936 0 0 1-.07-.33v-3.89h-.31c-.88 0-1.97-.17-2.54-1.15a2.035 2.035 0 0 1-.17-1.65c.3-.86 1.12-1.42 2.25-1.49h.26v-1.87c-.34-.05-.62-.08-.87-.14-.79-.19-1.35-.49-1.74-.94-.55-.67-.6-1.63-.55-2.28.09-1.03.6-1.93 1.41-2.5.63-.42 1.36-.63 2.32-.63 1.77 0 3.58.76 3.77 3.11.06.91-.17 2.28-1.17 3.33l.33.27.74.61.74-.61.33-.27c-1-1.05-1.23-2.42-1.17-3.33.19-2.35 2-3.11 3.77-3.11.96 0 1.69.21 2.32.63.81.57 1.32 1.47 1.41 2.5.05.65 0 1.61-.55 2.28-.39.45-.95.75-1.74.94-.25.06-.53.09-.87.14v1.87h.26c1.13.07 1.95.63 2.25 1.49.13.36.21.93-.17 1.65Z"/>
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">
                        Acceptez les paiements via PayPal
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration des paiements</CardTitle>
              <CardDescription>
                Paramétrez vos options de paiement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dépôt de garantie</Label>
                  <p className="text-sm text-muted-foreground">
                    Demander un dépôt lors de la réservation
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Paiement intégral</Label>
                  <p className="text-sm text-muted-foreground">
                    Exiger le paiement complet lors de la réservation
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Factures automatiques</Label>
                  <p className="text-sm text-muted-foreground">
                    Générer et envoyer des factures automatiquement
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Synchronisation de calendrier</CardTitle>
              <CardDescription>
                Synchronisez vos rendez-vous avec votre calendrier préféré
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-[#4285F4]/10 p-2">
                      <svg className="h-6 w-6 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.43 11.022h-9.394v3.695h5.367c-.483 2.382-2.329 3.695-5.367 3.695-3.296 0-6.1-2.698-6.1-6.304s2.804-6.304 6.1-6.304c1.457 0 2.755.483 3.812 1.288l2.804-2.698C16.456 2.698 13.731 1.57 11.67 1.57 6.304 1.57 2 5.874 2 11.108s4.304 9.538 9.67 9.538c4.946 0 9.412-3.556 9.412-9.538 0-.322 0-.644-.081-1.127l.429.04z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Google Calendar</p>
                      <p className="text-sm text-muted-foreground">
                        Synchronisez avec votre Google Calendar
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>

                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-[#0078D4]/10 p-2">
                      <svg className="h-6 w-6 text-[#0078D4]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.88 12.04c0 1.28-.63 2.55-1.69 3.35-.51.39-1.14.61-1.77.61-.33 0-.66-.06-.98-.17-.13-.04-.58-.17-.74-.22L0 16.99v-1.14l.84-.37a.506.506 0 0 0 .28-.46v-6.2c0-.23-.13-.42-.28-.46L0 8.91V5.76l.84.37a.5.5 0 0 0 .21.03c.21 0 .42-.06.65-.11.23-.05.5-.1.84-.1 1.69 0 3.19.99 3.95 2.49l.27.57.64-.37c.61-.35 1.3-.54 2.04-.54 1.44 0 2.32.61 2.77 1.31l.14.22h3.55l.15-.23c.42-.65 1.5-1.3 3.09-1.3.59 0 1.16.09 1.67.24l.71.2V5.76l-.78-.23C20.27 5.36 19.6 5.3 19 5.3c-2.18 0-3.7.85-4.29 1.61l-.8.08h-3.33l-.9-.07c-.36-.31-1.05-.84-2.48-.84-.79 0-1.37.15-1.8.29L4.3 6.78v5.26h3.58zm13.62-1.61v.02c-.16.65-.88 1.48-2.16 1.48-.86 0-1.47-.29-1.74-.55l-.03-.03a.766.766 0 0 1-.22-.58c0-.39.18-.55.38-.65.21-.1.51-.2.95-.2h2.82M7.3 7.87c-.19.15-.5.22-.61.62-.11.4-.04.65.08.85.13.2.38.45.91.45s.91-.3.91-.92c0-.28-.07-.54-.2-.73-.13-.19-.29-.29-.54-.29-.32 0-.45.15-.55.02"/>
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Outlook Calendar</p>
                      <p className="text-sm text-muted-foreground">
                        Synchronisez avec votre Outlook Calendar
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>

                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-black/10 p-2">
                      <svg className="h-6 w-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.983 0a12.206 12.206 0 0 0-8.51 3.653A11.8 11.8 0 0 0 0 12.207 11.779 11.779 0 0 0 11.8 24h.214A12.111 12.111 0 0 0 24 11.791 11.766 11.766 0 0 0 11.983 0ZM10.5 16.542a1.476 1.476 0 0 1 1.449-1.53h.027a1.527 1.527 0 0 1 1.523 1.47 1.475 1.475 0 0 1-1.449 1.53h-.027a1.529 1.529 0 0 1-1.523-1.47ZM11 12.5v-6a1 1 0 0 1 2 0v6a1 1 0 1 1-2 0Z"/>
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">iCloud Calendar</p>
                      <p className="text-sm text-muted-foreground">
                        Synchronisez avec votre iCloud Calendar
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="relative">
                    <span>Connecter</span>
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      Bientôt
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Options de calendrier</CardTitle>
              <CardDescription>
                Paramètres avancés de synchronisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Synchronisation bidirectionnelle</Label>
                  <p className="text-sm text-muted-foreground">
                    Synchroniser les rendez-vous dans les deux sens
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications de calendrier</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajouter des notifications aux événements du calendrier
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="rounded-md bg-amber-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Attention</h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>
                        La synchronisation avec iCloud Calendar nécessite des autorisations supplémentaires et sera disponible prochainement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Réseaux sociaux</CardTitle>
              <CardDescription>
                Connectez vos comptes de réseaux sociaux pour faciliter le partage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-[#1877F2]/10 p-2">
                      <Facebook className="h-6 w-6 text-[#1877F2]" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Facebook</p>
                      <p className="text-sm text-muted-foreground">
                        Partagez vos services et recevez des réservations via Facebook
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>

                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-gradient-to-tr from-[#fa7e1e] via-[#d62976] to-[#962fbf]/10 p-2">
                      <Instagram className="h-6 w-6 text-gradient-to-tr from-[#fa7e1e] via-[#d62976] to-[#962fbf]" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Instagram</p>
                      <p className="text-sm text-muted-foreground">
                        Ajoutez un lien de réservation à votre biographie Instagram
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>

                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-[#4285F4]/10 p-2">
                      <svg className="h-6 w-6 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12.713l-11.985-9.713h23.971l-11.986 9.713zm-5.425-1.822l-6.575-5.329v12.501l6.575-7.172zm10.85 0l6.575 7.172v-12.501l-6.575 5.329zm-1.557 1.261l-3.868 3.135-3.868-3.135-8.11 8.848h23.956l-8.11-8.848z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Google My Business</p>
                      <p className="text-sm text-muted-foreground">
                        Ajoutez un bouton de réservation à votre profil GMB
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liens de partage</CardTitle>
              <CardDescription>
                Obtenez des liens pour partager facilement votre page de réservation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="booking-link" className="text-sm font-medium">Lien de réservation</Label>
                <div className="mt-2 flex">
                  <Input 
                    id="booking-link"
                    readOnly 
                    value="https://bookwise.app/r/johndoe" 
                    className="rounded-r-none"
                  />
                  <Button 
                    onClick={() => handleCopyClick("https://bookwise.app/r/johndoe", "Lien copié !")}
                    className="rounded-l-none px-3"
                    variant="secondary"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="embed-code" className="text-sm font-medium">Code d'intégration</Label>
                <div className="mt-2">
                  <div className="relative">
                    <Textarea
                      id="embed-code"
                      readOnly
                      rows={3}
                      className="font-mono text-xs"
                      value={`<iframe src="https://bookwise.app/embed/johndoe" width="100%" height="600" frameborder="0"></iframe>`}
                    />
                    <Button 
                      onClick={() => handleCopyClick(
                        `<iframe src="https://bookwise.app/embed/johndoe" width="100%" height="600" frameborder="0"></iframe>`,
                        "Code d'intégration copié !"
                      )}
                      size="sm"
                      variant="ghost"
                      className="absolute top-1 right-1"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Copiez et collez ce code sur votre site web pour intégrer votre formulaire de réservation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tools" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Outils marketing</CardTitle>
              <CardDescription>
                Intégrez des outils marketing pour améliorer votre visibilité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-[#00C4B4]/10 p-2">
                      <svg className="h-6 w-6 text-[#00C4B4]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.125 0H4.875C2.1875 0 0 2.1875 0 4.875v14.25C0 21.8125 2.1875 24 4.875 24h14.25C21.8125 24 24 21.8125 24 19.125V4.875C24 2.1875 21.8125 0 19.125 0zM15 18.75H4.875c-1.125 0-2.125-.375-2.875-1.125v-7.5c.75.75 1.875 1.125 2.875 1.125h8.25c2 0 3.75 1.75 3.75 3.75.125 2-1.625 3.75-3.625 3.75zm4.125 0c-1.125 0-2.125-.375-2.875-1.125.5-.75.75-1.625.75-2.625 0-3.125-2.625-5.75-5.75-5.75H5c-.375 0-.75-.375-.75-.75v-.75h2.625c1.125 0 2.125-.375 2.875-1.125.75-.75 1.125-1.75 1.125-2.875V3h8.25c1.125 0 2.125.375 2.875 1.125v14.25c-.75.625-1.75 1-2.875 1v-.625zm.75-16.5c-.75-.75-1.75-1.125-2.875-1.125h-1.5v-.375c0-1.5-1.25-2.75-2.75-2.75S9.75 5.25 9.75 6.75v.375h-.375c-1.125 0-2.125-.375-2.875-1.125-.75-.75 1.125-1.75-1.125-2.875v.375h-.375C2.5 11.5 0 14 0 17v.375c0 3.125 2.5 5.625 5.625 5.625H18c3.125 0 5.625-2.5 5.625-5.625V6.75c0-1.125-.375-2.125-1.125-2.875C22.5 3.875 21.5 3.5 20.375 3.5v-.375c.125-.375.125-.375-.5-.875z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Mailchimp</p>
                      <p className="text-sm text-muted-foreground">
                        Automatisez vos campagnes email marketing
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>

                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-[#5D3EDE]/10 p-2">
                      <svg className="h-6 w-6 text-[#5D3EDE]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="m12.7848 14.5454c1.5908 1.5909 1.5908 4.1477 0 5.7386-.7739.774-1.8626 1.1611-2.9514 1.0796-1.2832-.0815-2.4644-.5671-3.4002-1.5029-.815-.815-1.3006-1.8628-1.5045-2.9514-.204-1.0887.2447-2.1774 1.0187-2.9514 1.5908-1.5909 4.1476-1.5909 5.7385 0l1.0989-1.099c-2.1774-2.1774-5.7386-2.1774-7.916 0-1.0478 1.0478-1.5909 2.4645-1.4684 3.9228.204 2.0959 1.4275 4.0868 3.3187 5.1755.4856.2855.9712.4895 1.4684.6325 1.6724.48551.3353.6325 1.9938c.2856.4856.5671.9712.9712 1.3821l.653 1.9938c.4856.285.9712.5671 1.3821.9712l1.1-1.0968z"/>
                        <path d="m2.5514 9.5685c-.77387.7739-1.1611 1.8625-1.07964 2.9514.08147 1.2833.56712 2.4645 1.50291 3.4002.81501.815 1.86252 1.3006 2.95141 1.5045 1.08888.204 2.17775-.2447 2.95162-1.0187 1.5909-1.5908 1.5909-4.1476 0-5.7385l1.099-1.0989c2.1774 2.1774 2.1774 5.7386 0 7.916-1.0478 1.0478-2.46453 1.5909-3.92283 1.4684-2.09592-.204-4.08683-1.4275-5.17571-3.3187-.28552-.4856-.48551-.9712-.63248-1.4684-.48551-1.6724-.24463-3.3853.7328-4.8536.97142-1.4684 2.46454-2.4645 4.0868-2.7052 1.6723-.28552 3.30386.24462 4.5668 1.5044.63248.6325 1.09894 1.3821 1.38213 2.2125l-1.99368.653c-.2856-.4856-.5671-.9712-.9712-1.3821l1.0968-1.1c-1.5908-1.5909-4.1476-1.5909-5.7385 0z"/>
                        <path d="m22.5 6c0 1.6772-1.3228 3-3 3-1.6772 0-3-1.3228-3-3 0-1.67721 1.3228-3 3-3 1.6772 0 3 1.32279 3 3z"/>
                        <path d="m9 3c0 1.65685-1.34315 3-3 3s-3-1.34315-3-3 1.34315-3 3-3 3 1.34315 3 3z"/>
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Zapier</p>
                      <p className="text-sm text-muted-foreground">
                        Connectez vos applications préférées via des automatisations
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>

                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-[#4A154B]/10 p-2">
                      <svg className="h-6 w-6 text-[#4A154B]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.879 10.121v-3.12c0-.583-.474-1.057-1.057-1.057s-1.057.474-1.057 1.057v3.12c0 .583.474 1.057 1.057 1.057s1.057-.474 1.057-1.057v-3.12c0-.583-.474-1.057-1.057-1.057zm-3.509-1.259v.585c0 1.16.954 2.114 2.114 2.114h.585v-.585c0-1.16-.954-2.114-2.114-2.114h-.585zm8.868 2.889v.585h.585c1.16 0 2.114-.954 2.114-2.114v-.585h-.585c-1.16 0-2.114.954-2.114 2.114zm2.114-5.885c.583 0 1.057-.474 1.057-1.057s-.474-1.057-1.057-1.057h-3.12c-.583 0-1.057.474-1.057 1.057s.474 1.057 1.057 1.057h3.12zm-4.177-.639c0-.583-.474-1.057-1.057-1.057s-1.057.474-1.057 1.057v.585h.585c.842 0 1.529-.685 1.529-1.529v-.113zm-1.057 9.394c-.583 0-1.057.474-1.057 1.057v3.12c0 .583.474 1.057 1.057 1.057s1.057-.474 1.057-1.057v-3.12c0-.583-.474-1.057-1.057-1.057zm-1.057-3.971h-.585v.585c0 1.16.954 2.114 2.114 2.114h.585v-.585c0-1.16-.954-2.114-2.114-2.114zm-3.393 7.364h3.12c.583 0 1.057-.474 1.057-1.057s-.474-1.057-1.057-1.057h-3.12c-.583 0-1.057.474-1.057 1.057s.474 1.057 1.057 1.057zm-1.529-4.177c0 .842.685 1.529 1.529 1.529h.113c0-.583-.474-1.057-1.057-1.057s-1.057.474-1.057 1.057v.585h.585c1.16 0 2.114-.954 2.114-2.114v-.585h-.585c-1.16 0-2.114.954-2.114 2.114v-.472c0-.038 0-.076-.001-.114.001.038.001.076.001.114v.472z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Slack</p>
                      <p className="text-sm text-muted-foreground">
                        Recevez des notifications de réservation sur Slack
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Outils d'analyse</CardTitle>
              <CardDescription>
                Suivez et analysez les performances de votre page de réservation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Google Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Suivez les visiteurs et les conversions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ga-id">ID Google Analytics</Label>
                <Input id="ga-id" placeholder="UA-XXXXXXXXX-X" defaultValue="UA-123456789-1" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button className="ml-auto" variant="default">
                <Check className="mr-2 h-4 w-4" />
                Sauvegarder
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationSettings;
