
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Paintbrush } from 'lucide-react';
import { toast } from 'sonner';

import { CustomizeTab } from './tabs/CustomizeTab';
import { StepsTab } from './tabs/StepsTab';
import { ShareTab } from './tabs/ShareTab';
import { PreviewPanel } from './preview/PreviewPanel';
import { BookingPageProvider } from './BookingPageContext';

export function BookingPageCustomization() {
  const [selectedTab, setSelectedTab] = useState('customize');
  
  // Save changes handler
  const handleSave = () => {
    toast.success("Configuration sauvegardée avec succès");
  };
  
  return (
    <BookingPageProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-primary" />
            Personnalisation de la page
          </CardTitle>
          <CardDescription>
            Créez une expérience de réservation unique adaptée à votre image de marque
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="customize">Personnaliser</TabsTrigger>
              <TabsTrigger value="steps">Étapes & Textes</TabsTrigger>
              <TabsTrigger value="share">Partager</TabsTrigger>
            </TabsList>
            
            <TabsContent value="customize" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CustomizeTab />
                <PreviewPanel />
              </div>
            </TabsContent>
            
            <TabsContent value="steps" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StepsTab />
                <PreviewPanel />
              </div>
            </TabsContent>
            
            <TabsContent value="share" className="space-y-6">
              <ShareTab />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-6">
            <Button onClick={handleSave}>Enregistrer les modifications</Button>
          </div>
        </CardContent>
      </Card>
    </BookingPageProvider>
  );
}
