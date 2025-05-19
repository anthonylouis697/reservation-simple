
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Plus, Calendar, Users, ArrowUpRight, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockCampaigns = [
  {
    id: 1,
    name: 'Promotion de printemps',
    status: 'Programmé',
    date: '15/06/2025',
    audience: '142 contacts',
    openRate: null
  },
  {
    id: 2,
    name: 'Rappel rendez-vous',
    status: 'Actif',
    date: '10/06/2025',
    audience: '87 contacts',
    openRate: '76%'
  },
  {
    id: 3,
    name: 'Anniversaires clients',
    status: 'Terminé',
    date: '03/06/2025',
    audience: '34 contacts',
    openRate: '92%'
  },
  {
    id: 4,
    name: 'Offre fidélité',
    status: 'Brouillon',
    date: '-',
    audience: '205 contacts (estimé)',
    openRate: null
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Actif':
      return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
    case 'Terminé':
      return <Badge variant="outline" className="text-gray-500 border-gray-300">Terminé</Badge>;
    case 'Programmé':
      return <Badge className="bg-blue-500 hover:bg-blue-600">Programmé</Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-100 text-gray-500 hover:bg-gray-200">Brouillon</Badge>;
  }
};

export const SmsMarketing = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [smsText, setSmsText] = useState('');
  const { toast } = useToast();
  
  const handleCreateCampaign = () => {
    toast({
      title: "Nouvelle campagne SMS",
      description: "Le formulaire de création de campagne SMS s'ouvrira bientôt.",
    });
  };
  
  const handleSendTest = () => {
    if (!smsText.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un message",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "SMS de test envoyé",
      description: "Le SMS de test a été envoyé avec succès.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="campaigns">Campagnes SMS</TabsTrigger>
          <TabsTrigger value="new-message">Nouveau message</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Campagnes SMS</h2>
              <p className="text-muted-foreground">Gérez vos envois de SMS promotionnels et notifications</p>
            </div>
            <Button onClick={handleCreateCampaign}>
              <Plus className="mr-2 h-4 w-4" /> Nouvelle campagne
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom de la campagne</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Taux d'ouverture</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>{campaign.date}</TableCell>
                    <TableCell>{campaign.audience}</TableCell>
                    <TableCell>{campaign.openRate || '-'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="new-message" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Créer un nouveau SMS</CardTitle>
              <CardDescription>
                Composez et envoyez un message SMS à vos clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipients">Destinataires</Label>
                <div className="flex gap-2">
                  <Input id="recipients" placeholder="Entrez un numéro de téléphone" />
                  <Button variant="outline" className="shrink-0">
                    <Users className="h-4 w-4 mr-2" />
                    Sélectionner
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="sms-content">Contenu du message</Label>
                  <span className="text-xs text-muted-foreground">
                    {smsText.length}/160 caractères
                  </span>
                </div>
                <Textarea 
                  id="sms-content" 
                  placeholder="Tapez votre message ici..." 
                  className="h-32"
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Programmer l'envoi</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Choisir une date
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSmsText('')}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSendTest}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Tester
                </Button>
                <Button onClick={() => alert('Fonctionnalité à venir')}>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
