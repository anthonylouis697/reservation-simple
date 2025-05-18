
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Calendar,
  CheckCircle,
  XCircle,
  MessageSquare,
  Webhook,
  Cog
} from "lucide-react";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const IntegrationCard = ({
  title,
  description,
  icon,
  isConnected,
  onConnect,
  onDisconnect,
}: IntegrationCardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/10">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        {isConnected ? (
          <div className="flex items-center text-emerald-500 gap-1">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs">Connecté</span>
          </div>
        ) : (
          <div className="flex items-center text-muted-foreground gap-1">
            <XCircle className="h-4 w-4" />
            <span className="text-xs">Non connecté</span>
          </div>
        )}
      </div>
    </CardHeader>
    <CardContent>
      {isConnected ? (
        <Button variant="outline" onClick={onDisconnect} className="w-full">
          Déconnecter
        </Button>
      ) : (
        <Button onClick={onConnect} className="w-full">
          Connecter
        </Button>
      )}
    </CardContent>
  </Card>
);

const IntegrationSettings = () => {
  const [googleConnected, setGoogleConnected] = useState(false);
  const [microsoftConnected, setMicrosoftConnected] = useState(false);
  const [slackConnected, setSlackConnected] = useState(false);
  const [zapierConnected, setZapierConnected] = useState(false);
  const [zapierWebhook, setZapierWebhook] = useState("");
  const [customApiKey, setCustomApiKey] = useState("");

  const handleGoogleConnect = () => {
    setGoogleConnected(true);
    toast.success("Connecté à Google Calendar");
  };

  const handleMicrosoftConnect = () => {
    setMicrosoftConnected(true);
    toast.success("Connecté à Microsoft Outlook");
  };

  const handleSlackConnect = () => {
    setSlackConnected(true);
    toast.success("Connecté à Slack");
  };

  const handleZapierConnect = () => {
    if (!zapierWebhook.trim()) {
      toast.error("Veuillez entrer une URL de webhook Zapier valide");
      return;
    }
    
    setZapierConnected(true);
    toast.success("Connecté à Zapier");
  };

  const handleSaveApiKey = () => {
    if (!customApiKey.trim()) {
      toast.error("Veuillez entrer une clé API valide");
      return;
    }
    
    toast.success("Clé API enregistrée avec succès");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Intégrations de calendrier</CardTitle>
          <CardDescription>
            Connectez votre calendrier pour synchroniser vos réservations.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IntegrationCard
            title="Google Calendar"
            description="Synchronisez vos réservations avec Google Calendar."
            icon={<Calendar className="h-6 w-6 text-primary" />}
            isConnected={googleConnected}
            onConnect={handleGoogleConnect}
            onDisconnect={() => setGoogleConnected(false)}
          />
          <IntegrationCard
            title="Microsoft Outlook"
            description="Synchronisez vos réservations avec Outlook."
            icon={<Calendar className="h-6 w-6 text-primary" />}
            isConnected={microsoftConnected}
            onConnect={handleMicrosoftConnect}
            onDisconnect={() => setMicrosoftConnected(false)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Intégrations de notification</CardTitle>
          <CardDescription>
            Connectez vos outils de notification pour des alertes en temps réel.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IntegrationCard
            title="Slack"
            description="Recevez des notifications de réservation dans Slack."
            icon={<MessageSquare className="h-6 w-6 text-primary" />}
            isConnected={slackConnected}
            onConnect={handleSlackConnect}
            onDisconnect={() => setSlackConnected(false)}
          />
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/10">
                    <Webhook className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Zapier</CardTitle>
                    <CardDescription>Automatisez des tâches avec Zapier.</CardDescription>
                  </div>
                </div>
                {zapierConnected ? (
                  <div className="flex items-center text-emerald-500 gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs">Connecté</span>
                  </div>
                ) : (
                  <div className="flex items-center text-muted-foreground gap-1">
                    <XCircle className="h-4 w-4" />
                    <span className="text-xs">Non connecté</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="zapier-webhook">URL Webhook Zapier</Label>
                  <Input
                    id="zapier-webhook"
                    value={zapierWebhook}
                    onChange={(e) => setZapierWebhook(e.target.value)}
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    className="mt-2"
                  />
                </div>
                {zapierConnected ? (
                  <Button variant="outline" onClick={() => setZapierConnected(false)} className="w-full">
                    Déconnecter
                  </Button>
                ) : (
                  <Button onClick={handleZapierConnect} className="w-full">
                    Connecter
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API personnalisée</CardTitle>
          <CardDescription>
            Configurez une intégration avec votre propre API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-key">Clé API</Label>
              <Input
                id="api-key"
                type="password"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="Votre clé API"
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Cette clé API est utilisée pour l'authentification avec votre système externe.
              </p>
            </div>
            <Button onClick={handleSaveApiKey}>Enregistrer la clé API</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationSettings;
