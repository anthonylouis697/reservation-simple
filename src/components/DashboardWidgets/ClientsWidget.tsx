
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRoundPlus, TrendingUp, TrendingDown, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ClientsWidget = () => {
  const navigate = useNavigate();
  
  // Stats mock data
  const totalClients = 28;
  const newClientsThisMonth = 4;
  const retentionRate = 85;
  const previousMonth = {
    clients: 24,
    retention: 78
  };

  // Calculate changes
  const clientsChange = (totalClients - previousMonth.clients) / previousMonth.clients * 100;
  const retentionChange = retentionRate - previousMonth.retention;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Clients</span>
          <div className="bg-blue-100 p-2 rounded-full">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold">{totalClients}</span>
            <div className={`flex items-center text-xs ${clientsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {clientsChange >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(clientsChange).toFixed(1)}%
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Total des clients</p>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Taux de fidélisation</span>
            <span className="text-sm font-medium">{retentionRate}%</span>
          </div>
          <Progress value={retentionRate} className="h-2" />
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${retentionChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {retentionChange >= 0 ? '+' : ''}{retentionChange}% depuis le mois dernier
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-muted/20 rounded-md">
          <div>
            <p className="font-medium">{newClientsThisMonth}</p>
            <p className="text-xs text-muted-foreground">Nouveaux ce mois</p>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-primary"
            onClick={() => navigate("/clients/new")}
          >
            <UserRoundPlus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate("/clients")}
        >
          Voir tous les clients
        </Button>
      </CardFooter>
    </Card>
  );
};
