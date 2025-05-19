
import { Calendar, UserPlus, Settings, BarChart3, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  color: string;
}

const QuickAction = ({ icon, label, description, onClick, color }: QuickActionProps) => (
  <Button 
    variant="ghost" 
    className={`h-auto p-4 w-full flex flex-col items-center text-center border bg-white hover:bg-muted/20 transition-colors`}
    onClick={onClick}
  >
    <div className={`rounded-full ${color} p-3 mb-2`}>
      {icon}
    </div>
    <h3 className="font-medium">{label}</h3>
    <p className="text-xs text-muted-foreground mt-1">{description}</p>
  </Button>
);

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <Calendar className="h-5 w-5 text-blue-600" />,
      label: "Nouveau rendez-vous",
      description: "Créer un nouveau rendez-vous",
      onClick: () => navigate("/calendar"),
      color: "bg-blue-100"
    },
    {
      icon: <UserPlus className="h-5 w-5 text-green-600" />,
      label: "Nouveau client",
      description: "Ajouter un client à votre base",
      onClick: () => navigate("/clients"),
      color: "bg-green-100"
    },
    {
      icon: <Tag className="h-5 w-5 text-purple-600" />,
      label: "Nouveau service",
      description: "Créer ou modifier vos services",
      onClick: () => navigate("/settings?tab=services"),
      color: "bg-purple-100"
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-amber-600" />,
      label: "Statistiques",
      description: "Voir vos données d'activité",
      onClick: () => navigate("/statistics"),
      color: "bg-amber-100"
    },
    {
      icon: <Settings className="h-5 w-5 text-indigo-600" />,
      label: "Paramètres",
      description: "Configurer votre compte",
      onClick: () => navigate("/settings"),
      color: "bg-indigo-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {actions.map((action, i) => (
        <QuickAction key={i} {...action} />
      ))}
    </div>
  );
};
