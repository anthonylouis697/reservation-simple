
import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentSettings from '@/components/Settings/PaymentSettings';

const Payments = () => {
  const navigate = useNavigate();
  
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
                <BreadcrumbLink href="/payments">Paiements</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleGoBack} className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Paiements</h1>
                <p className="text-muted-foreground">
                  Gérez vos paiements, méthodes de paiement et factures
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="settings" className="w-full">
          <TabsList>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="invoices">Factures</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4 pt-4">
            <PaymentSettings />
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-4 pt-4">
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium">Historique des transactions</h3>
              <p className="text-muted-foreground mt-2">
                Cette fonctionnalité sera disponible prochainement.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="invoices" className="space-y-4 pt-4">
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium">Gestion des factures</h3>
              <p className="text-muted-foreground mt-2">
                Cette fonctionnalité sera disponible prochainement.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Payments;
