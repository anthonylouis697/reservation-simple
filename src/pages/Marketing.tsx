
import { useState } from 'react';
import { AppLayout } from "@/components/AppLayout";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Notifications from '@/components/Marketing/Notifications';
import { PromotionCodes } from '@/components/Marketing/PromotionCodes';
import { SmsMarketing } from '@/components/Marketing/SmsMarketing';
import { GiftCards } from '@/components/Marketing/GiftCards';

const Marketing = () => {
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <AppLayout>
      <Helmet>
        <title>Marketing - Reservatoo</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Marketing</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos campagnes marketing et fidélisez vos clients
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="promotions">Codes promo</TabsTrigger>
            <TabsTrigger value="sms">Campagnes SMS</TabsTrigger>
            <TabsTrigger value="gift-cards">Cartes cadeaux</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications">
            <Notifications />
          </TabsContent>
          
          <TabsContent value="promotions">
            <PromotionCodes />
          </TabsContent>
          
          <TabsContent value="sms">
            <SmsMarketing />
          </TabsContent>
          
          <TabsContent value="gift-cards">
            <GiftCards />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Marketing;
