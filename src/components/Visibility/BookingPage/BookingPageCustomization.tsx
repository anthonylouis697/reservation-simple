
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Paintbrush } from 'lucide-react';

import { CustomizeTab } from './tabs/CustomizeTab';
import { PreviewPanel } from './preview/PreviewPanel';

export function BookingPageCustomization() {
  return (
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
        <div className="space-y-6 animate-in fade-in-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomizeTab />
            <PreviewPanel />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
