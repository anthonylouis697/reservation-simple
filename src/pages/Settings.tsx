
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsLayout from "@/components/Settings/SettingsLayout";
import ProfileSettings from "@/components/Settings/ProfileSettings";
import BusinessSettings from "@/components/Settings/BusinessSettings";
import ServiceSettings from "@/components/Settings/ServiceSettings";
import AvailabilitySettings from "@/components/Settings/AvailabilitySettings";
import NotificationSettings from "@/components/Settings/NotificationSettings";
import IntegrationSettings from "@/components/Settings/IntegrationSettings";
import PaymentSettings from "@/components/Settings/PaymentSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  
  return (
    <SettingsLayout>
      <div className="flex flex-col space-y-6 pb-16">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez vos paramètres et préférences de compte BookWise.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="business">Entreprise</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="availability">Disponibilité</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Intégrations</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="profile" className="space-y-4">
              <ProfileSettings />
            </TabsContent>
            
            <TabsContent value="business" className="space-y-4">
              <BusinessSettings />
            </TabsContent>
            
            <TabsContent value="services" className="space-y-4">
              <ServiceSettings />
            </TabsContent>
            
            <TabsContent value="availability" className="space-y-4">
              <AvailabilitySettings />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <NotificationSettings />
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-4">
              <IntegrationSettings />
            </TabsContent>
            
            <TabsContent value="payments" className="space-y-4">
              <PaymentSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </SettingsLayout>
  );
};

export default Settings;
