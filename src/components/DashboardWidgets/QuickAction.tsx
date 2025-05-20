
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export interface QuickActionProps {
  icon: ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  color: string;
}

export const QuickAction = ({ icon, label, description, onClick, color }: QuickActionProps) => (
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
