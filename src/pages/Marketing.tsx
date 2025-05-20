
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Tag, Bell, Award, MessageCircle, Gift } from 'lucide-react';
import { PromotionCodes } from '@/components/Marketing/PromotionCodes';
import { LoyaltyProgram } from '@/components/Marketing/LoyaltyProgram';
import { SmsMarketing } from '@/components/Marketing/SmsMarketing';
import { Notifications } from '@/components/Marketing/Notifications';
import { GiftCards } from '@/components/Marketing/GiftCards';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const Marketing = () => {
  const [activeTab, setActiveTab] = useState('promotions');
  
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
                <BreadcrumbLink href="/marketing">Marketing</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Marketing</h1>
              <p className="text-muted-foreground">
                Gérez vos promotions, notifications et programme de fidélité
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="text-xs md:text-sm">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Exporter les données
              </Button>
              <Button className="text-xs md:text-sm whitespace-nowrap">
                Nouvelle promotion
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <div className="overflow-x-auto">
              <TabsList className="w-full md:w-auto h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="promotions"
                  className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Codes promo</span>
                  <span className="md:hidden">Promo</span>
                </TabsTrigger>
                <TabsTrigger
                  value="sms"
                  className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">SMS Marketing</span>
                  <span className="md:hidden">SMS</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Notifications</span>
                  <span className="md:hidden">Notif.</span>
                </TabsTrigger>
                <TabsTrigger
                  value="loyalty"
                  className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Award className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Programme de fidélité</span>
                  <span className="md:hidden">Fidélité</span>
                </TabsTrigger>
                <TabsTrigger
                  value="gift-cards"
                  className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Cartes cadeaux</span>
                  <span className="md:hidden">Cadeaux</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <div className="mt-6">
            <TabsContent value="promotions" className="space-y-6 m-0">
              <PromotionCodes />
            </TabsContent>
            <TabsContent value="sms" className="space-y-6 m-0">
              <SmsMarketing />
            </TabsContent>
            <TabsContent value="notifications" className="space-y-6 m-0">
              <Notifications />
            </TabsContent>
            <TabsContent value="loyalty" className="space-y-6 m-0">
              <LoyaltyProgram />
            </TabsContent>
            <TabsContent value="gift-cards" className="space-y-6 m-0">
              <GiftCards />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Marketing;
