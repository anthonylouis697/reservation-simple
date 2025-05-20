
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsLayout from "@/components/Settings/SettingsLayout";
import BusinessSettings from "@/components/Settings/BusinessSettings";
import AvailabilitySettings from "@/components/Settings/AvailabilitySettings";
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("business");
  
  return (
    <SettingsLayout>
      <div className="flex flex-col space-y-6 pb-16">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez vos paramètres et préférences de compte Reservatoo.
          </p>
        </div>
        
        {/* Banner promoting Visibility Boost module */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="font-medium">Boost de Visibilité</h3>
                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">Nouveau</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Augmentez vos revenus en vous connectant aux meilleures plateformes du marché
              </p>
            </div>
          </div>
          <Link to="/visibility-boost" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
            Découvrir
          </Link>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-2 gap-4">
            <TabsTrigger value="business">Entreprise</TabsTrigger>
            <TabsTrigger value="availability">Disponibilité</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="business" className="space-y-4">
              <BusinessSettings />
            </TabsContent>
            
            <TabsContent value="availability" className="space-y-4">
              <AvailabilitySettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </SettingsLayout>
  );
};

export default Settings;
