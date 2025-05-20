
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Paintbrush, ListIcon, Share, ArrowUp, Check } from 'lucide-react';
import { toast } from 'sonner';

import { CustomizeTab } from './tabs/CustomizeTab';
import { StepsTab } from './tabs/StepsTab';
import { ShareTab } from './tabs/ShareTab';
import { PreviewPanel } from './preview/PreviewPanel';
import { BookingPageProvider } from './BookingPageContext';

export function BookingPageCustomization() {
  const [selectedTab, setSelectedTab] = useState('customize');
  const [saved, setSaved] = useState(true);
  
  // Save changes handler
  const handleSave = () => {
    toast.success("Configuration sauvegardée avec succès");
    setSaved(true);
  };
  
  // Reset saved state when tab changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSaved(false);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [selectedTab]);
  
  return (
    <BookingPageProvider>
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Paintbrush className="h-5 w-5 text-primary" />
            Personnalisation de votre page de réservation
          </CardTitle>
          <CardDescription>
            Créez une expérience de réservation unique adaptée à votre image de marque
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="customize" className="flex items-center gap-2">
                <Paintbrush className="h-4 w-4" />
                <span>Personnaliser</span>
              </TabsTrigger>
              <TabsTrigger value="steps" className="flex items-center gap-2">
                <ListIcon className="h-4 w-4" />
                <span>Étapes & Textes</span>
              </TabsTrigger>
              <TabsTrigger value="share" className="flex items-center gap-2">
                <Share className="h-4 w-4" />
                <span>Partager</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="customize" className="space-y-6 animate-in fade-in-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CustomizeTab />
                <PreviewPanel />
              </div>
            </TabsContent>
            
            <TabsContent value="steps" className="space-y-6 animate-in fade-in-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StepsTab />
                <PreviewPanel />
              </div>
            </TabsContent>
            
            <TabsContent value="share" className="space-y-6 animate-in fade-in-50">
              <ShareTab />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-muted-foreground">
              {saved ? (
                <span className="flex items-center gap-1 text-green-600">
                  <Check className="h-4 w-4" />
                  Toutes les modifications sont sauvegardées
                </span>
              ) : (
                <span>Des modifications sont en attente de sauvegarde</span>
              )}
            </div>
            <Button onClick={handleSave} className="gap-2">
              <ArrowUp className="h-4 w-4" />
              Enregistrer toutes les modifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </BookingPageProvider>
  );
}
