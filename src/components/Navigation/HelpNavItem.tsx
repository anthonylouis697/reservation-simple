
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpNavItemProps {
  mobile?: boolean;
}

export function HelpNavItem({ mobile = false }: HelpNavItemProps) {
  const navigate = useNavigate();
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left mt-auto"
            onClick={() => navigate("/help")}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Aide</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="flex flex-col">
            <span className="font-medium">Centre d'aide</span>
            <span className="text-xs text-muted-foreground">Trouvez des réponses à vos questions</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
