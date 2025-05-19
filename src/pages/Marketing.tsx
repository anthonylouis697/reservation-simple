
import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Mail, MessageCircle, Tag, Bell, Users, Award, Gift } from 'lucide-react';
import { MarketingCampaigns } from '@/components/Marketing/MarketingCampaigns';
import { EmailTemplates } from '@/components/Marketing/EmailTemplates';
import { PromotionCodes } from '@/components/Marketing/PromotionCodes';
import { CustomerSegments } from '@/components/Marketing/CustomerSegments';
import { LoyaltyProgram } from '@/components/Marketing/LoyaltyProgram';
import { SmsMarketing } from '@/components/Marketing/SmsMarketing';
import { Notifications } from '@/components/Marketing/Notifications';
import { GiftCards } from '@/components/Marketing/GiftCards';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const Marketing = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  
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
                Gérez vos campagnes marketing, emails et promotions
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="text-xs md:text-sm">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Exporter les données
              </Button>
              <Button className="text-xs md:text-sm whitespace-nowrap">
                Nouvelle campagne
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <div className="overflow-x-auto">
              <TabsList className="w-full md:w-auto h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="campaigns"
                  className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Campagnes</span>
                  <span className="md:hidden">Camp.</span>
                </TabsTrigger>
                <TabsTrigger
                  value="email-templates"
                  className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Templates d'emails</span>
                  <span className="md:hidden">Templates</span>
                </TabsTrigger>
                <TabsTrigger
                  value="promotions"
                  className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Codes promo</span>
                  <span className="md:hidden">Promo</span>
                </TabsTrigger>
                <TabsTrigger
                  value="segments"
                  className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Users className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Segments clients</span>
                  <span className="md:hidden">Segments</span>
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
                  value="gift-cards"
                  className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Cartes Cadeaux</span>
                  <span className="md:hidden">Cadeaux</span>
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
              </TabsList>
            </div>
          </div>
          
          <div className="mt-6">
            <TabsContent value="campaigns" className="space-y-6 m-0">
              <MarketingCampaigns />
            </TabsContent>
            <TabsContent value="email-templates" className="space-y-6 m-0">
              <EmailTemplates />
            </TabsContent>
            <TabsContent value="promotions" className="space-y-6 m-0">
              <PromotionCodes />
            </TabsContent>
            <TabsContent value="segments" className="space-y-6 m-0">
              <CustomerSegments />
            </TabsContent>
            <TabsContent value="sms" className="space-y-6 m-0">
              <SmsMarketing />
            </TabsContent>
            <TabsContent value="gift-cards" className="space-y-6 m-0">
              <GiftCards />
            </TabsContent>
            <TabsContent value="notifications" className="space-y-6 m-0">
              <Notifications />
            </TabsContent>
            <TabsContent value="loyalty" className="space-y-6 m-0">
              <LoyaltyProgram />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Marketing;
