
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VisualsSection } from './sections/VisualsSection';
import { ContentSection } from './sections/ContentSection';
import { LayoutSection } from './sections/LayoutSection';

export function CustomizeTab() {
  const [activeCustomizeTab, setActiveCustomizeTab] = useState('visuals');

  return (
    <div className="space-y-6">
      <Tabs
        value={activeCustomizeTab}
        onValueChange={setActiveCustomizeTab}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="visuals">
            Apparence
          </TabsTrigger>
          <TabsTrigger value="content">
            Contenu
          </TabsTrigger>
          <TabsTrigger value="layout">
            Structure
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="visuals">
          <VisualsSection />
        </TabsContent>
        
        <TabsContent value="content">
          <ContentSection />
        </TabsContent>
        
        <TabsContent value="layout">
          <LayoutSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
