
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HomeMenuItemProps {
  mobile?: boolean;
}

export function HomeMenuItem({ mobile = false }: HomeMenuItemProps) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            mobile ? "flex flex-col items-center py-2 h-auto" : "w-full justify-start text-left"
          )}
          asChild
        >
          <Link to="/">
            <Home className={cn(
              mobile ? "mb-1" : "mr-2",
              "h-4 w-4"
            )} />
            <span className={cn(
              mobile && "text-xs font-medium"
            )}>Accueil</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent side={mobile ? "top" : "right"}>
        <div className="flex flex-col">
          <span className="font-medium">Site d'accueil</span>
          <span className="text-xs text-muted-foreground">Retourner à la page d'accueil</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
