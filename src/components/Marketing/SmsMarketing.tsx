
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, UserCheck, Plus, Users, ArrowRight, Calendar } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export const SmsMarketing = () => {
  const [smsContent, setSmsContent] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [activeCampaignTab, setActiveCampaignTab] = useState('new');
  
  // Simuler les clients pour la sélection
  const totalClients = 387;
  const selectedClients = 0;
  
  // Simuler les campagnes passées
  const pastCampaigns = [
    { id: 1, name: 'Rappel de rendez-vous Décembre', date: '01/12/2023', recipients: 245, opened: 198 },
    { id: 2, name: 'Promotion de Noël', date: '15/12/2023', recipients: 387, opened: 301 },
    { id: 3, name: 'Bonne année 2024', date: '02/01/2024', recipients: 380, opened: 335 },
    { id: 4, name: 'Nouveaux services de printemps', date: '15/03/2024', recipients: 392, opened: 289 }
  ];
  
  const handleSmsContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setSmsContent(content);
    setCharacterCount(content.length);
  };
  
  const messageLimit = 160;
  const numberOfMessages = Math.ceil(characterCount / messageLimit);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Nouvelle campagne SMS
            </CardTitle>
            <CardDescription>
              Créez et envoyez une campagne SMS à vos clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Nom de la campagne</Label>
              <Input id="campaign-name" placeholder="ex: Promotion de printemps" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sms-content">Contenu du message</Label>
              <Textarea 
                id="sms-content" 
                placeholder="Saisissez votre message..." 
                className="min-h-[150px]"
                value={smsContent}
                onChange={handleSmsContentChange}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{characterCount} caractères</span>
                <span>{numberOfMessages} message{numberOfMessages > 1 ? 's' : ''} ({numberOfMessages * 0.07}€)</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Destinataires</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1">
                  <UserCheck className="h-3.5 w-3.5 mr-1" />
                  <span>{selectedClients} sélectionné{selectedClients > 1 ? 's' : ''}</span>
                </Badge>
                <Button variant="outline" size="sm" className="gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>Sélectionner ({totalClients})</span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Programmation</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Programmer l'envoi</span>
                </Button>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button disabled={characterCount === 0} className="gap-2">
                <Send className="h-4 w-4" />
                <span>Envoyer le message</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Historique des campagnes</CardTitle>
            <CardDescription>Vos dernières campagnes SMS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pastCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/40 transition-colors">
                <div className="space-y-1">
                  <p className="font-medium">{campaign.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <span>{campaign.date}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-sm font-medium">{campaign.opened} / {campaign.recipients}</div>
                  <div className="text-xs text-muted-foreground">ouvertures</div>
                </div>
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Voir tout l'historique
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Statistiques SMS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-md text-center">
                <div className="text-2xl font-bold text-indigo-600">78%</div>
                <div className="text-sm text-muted-foreground">Taux d'ouverture</div>
              </div>
              <div className="p-4 border rounded-md text-center">
                <div className="text-2xl font-bold text-indigo-600">12%</div>
                <div className="text-sm text-muted-foreground">Taux de clic</div>
              </div>
              <div className="p-4 border rounded-md text-center">
                <div className="text-2xl font-bold text-indigo-600">1481</div>
                <div className="text-sm text-muted-foreground">SMS envoyés</div>
              </div>
              <div className="p-4 border rounded-md text-center">
                <div className="text-2xl font-bold text-indigo-600">387</div>
                <div className="text-sm text-muted-foreground">Contacts SMS</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
