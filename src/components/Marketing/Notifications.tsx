
import { useState } from 'react';
import NotificationTemplates from '@/components/Settings/NotificationTemplates';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, MessageSquare } from 'lucide-react';

export const Notifications = () => {
  const [activeTab, setActiveTab] = useState('templates');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-7 w-7" />
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez et personnalisez vos notifications pour vos clients et votre équipe
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-2">
        <Card className="w-full md:w-[calc(33%-0.5rem)] p-0">
          <div className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center bg-primary/10 rounded-full">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
                  8 modèles
                </Badge>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="w-full md:w-[calc(33%-0.5rem)] p-0">
          <div className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center bg-primary/10 rounded-full">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">SMS</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                  4 modèles
                </Badge>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="w-full md:w-[calc(33%-0.5rem)] p-0">
          <div className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center bg-primary/10 rounded-full">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">WhatsApp</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Badge variant="outline" className="text-gray-600 bg-gray-50 border-gray-200">
                  2 modèles
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="history">Historique d'envoi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-4 mt-4">
          <NotificationTemplates />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>Configurez les paramètres généraux des notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cette section est en cours de développement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique d'envoi</CardTitle>
              <CardDescription>Consultez l'historique des notifications envoyées</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cette section est en cours de développement.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
