
import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift, CreditCard, Plus, ArrowUpRight, Calendar, Euro, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

// Mock data for gift cards
const mockGiftCards = [
  {
    id: 1,
    code: 'NOEL2025',
    amount: 50,
    status: 'Actif',
    createdAt: '05/06/2025',
    expiresAt: '05/12/2025',
    redemptions: 0
  },
  {
    id: 2,
    code: 'ANNIV2025',
    amount: 25,
    status: 'Actif',
    createdAt: '10/06/2025',
    expiresAt: '10/08/2025',
    redemptions: 2
  },
  {
    id: 3,
    code: 'MERCI100',
    amount: 100,
    status: 'Utilisé',
    createdAt: '01/06/2025',
    expiresAt: '01/09/2025',
    redemptions: 1
  },
  {
    id: 4,
    code: 'BIENVENUE',
    amount: 30,
    status: 'Expiré',
    createdAt: '01/01/2025',
    expiresAt: '01/05/2025',
    redemptions: 0
  }
];

// Helper to get the appropriate status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Actif':
      return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
    case 'Utilisé':
      return <Badge className="bg-blue-500 hover:bg-blue-600">Utilisé</Badge>;
    case 'Expiré':
      return <Badge variant="outline" className="text-gray-500 border-gray-300">Expiré</Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-100 text-gray-500 hover:bg-gray-200">Inconnu</Badge>;
  }
};

const GiftCards = () => {
  const [activeTab, setActiveTab] = useState('manage');
  const [amount, setAmount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleCreateGiftCard = () => {
    if (!amount) {
      toast({
        title: "Erreur",
        description: "Veuillez indiquer un montant",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Carte cadeau créée",
      description: `Une nouvelle carte cadeau de ${amount}€ a été créée avec succès.`,
    });
    
    // Reset form
    setAmount('');
    setExpiryDate('');
  };
  
  const handleGoBack = () => {
    navigate('/dashboard');
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Tableau de bord</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/gift-cards">Cartes cadeaux</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleGoBack} className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Cartes cadeaux</h1>
                <p className="text-muted-foreground">
                  Créez et gérez vos cartes cadeaux pour fidéliser votre clientèle
                </p>
              </div>
            </div>
            <Button onClick={() => setActiveTab('create')} className="text-xs md:text-sm whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle carte cadeau
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="manage">Cartes cadeaux</TabsTrigger>
            <TabsTrigger value="create">Créer une carte</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage" className="space-y-4 pt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Date d'expiration</TableHead>
                    <TableHead>Utilisations</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockGiftCards.map((giftCard) => (
                    <TableRow key={giftCard.id}>
                      <TableCell className="font-medium">{giftCard.code}</TableCell>
                      <TableCell>{giftCard.amount}€</TableCell>
                      <TableCell>{getStatusBadge(giftCard.status)}</TableCell>
                      <TableCell>{giftCard.createdAt}</TableCell>
                      <TableCell>{giftCard.expiresAt}</TableCell>
                      <TableCell>{giftCard.redemptions}</TableCell>
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
          
          <TabsContent value="create" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Créer une carte cadeau</CardTitle>
                <CardDescription>
                  Créez une nouvelle carte cadeau pour vos clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Montant</Label>
                  <div className="flex">
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="0.00" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      className="rounded-r-none"
                    />
                    <div className="bg-muted flex items-center px-3 rounded-r-md border border-l-0">
                      <Euro className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="birthday">Anniversaire</SelectItem>
                      <SelectItem value="thank_you">Remerciement</SelectItem>
                      <SelectItem value="christmas">Noël</SelectItem>
                      <SelectItem value="generic">Générique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiry">Date d'expiration</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="expiry" 
                      type="date" 
                      value={expiryDate} 
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="restrictions">Restrictions</Label>
                  <Select defaultValue="none">
                    <SelectTrigger id="restrictions">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune restriction</SelectItem>
                      <SelectItem value="new_clients">Nouveaux clients uniquement</SelectItem>
                      <SelectItem value="specific_service">Service spécifique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto" onClick={handleCreateGiftCard}>
                  <Gift className="mr-2 h-4 w-4" />
                  Créer la carte cadeau
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default GiftCards;
