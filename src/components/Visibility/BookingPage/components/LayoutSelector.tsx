
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useBookingPage } from '../BookingPageContext';
import { Layers, ListOrdered } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function LayoutSelector() {
  const { layoutType, setLayoutType } = useBookingPage();

  const handleLayoutChange = (value: string) => {
    setLayoutType(value as "stepped" | "allinone");
    toast.success(`Modèle "${value === 'stepped' ? 'Par étapes' : 'Tout-en-un'}" sélectionné`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Modèle d'affichage</Label>
        <Badge variant="outline" className="text-xs font-normal">
          Choisissez comment présenter vos étapes de réservation
        </Badge>
      </div>

      <RadioGroup
        value={layoutType}
        onValueChange={handleLayoutChange}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <label 
          htmlFor="stepped"
          className={cn(
            "flex flex-col border rounded-lg p-4 cursor-pointer transition-all",
            layoutType === 'stepped' ? "ring-2 ring-primary ring-offset-2" : "hover:bg-accent/30"
          )}
        >
          <RadioGroupItem value="stepped" id="stepped" className="sr-only" />
          <div className="mb-3 flex items-center justify-center h-24 bg-muted/50 rounded">
            <div className="flex space-x-2">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex flex-col items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                    step === 1 ? "bg-primary text-white border-primary" : ""
                  )}>
                    {step}
                  </div>
                  <div className="w-12 h-1 mt-2 bg-muted"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-medium">Par étapes</span>
              <p className="text-sm text-muted-foreground mt-1">Progression séquentielle</p>
            </div>
            <ListOrdered className={cn("h-5 w-5", layoutType === 'stepped' ? "text-primary" : "text-muted-foreground")} />
          </div>
        </label>

        <label 
          htmlFor="allinone"
          className={cn(
            "flex flex-col border rounded-lg p-4 cursor-pointer transition-all",
            layoutType === 'allinone' ? "ring-2 ring-primary ring-offset-2" : "hover:bg-accent/30"
          )}
        >
          <RadioGroupItem value="allinone" id="allinone" className="sr-only" />
          <div className="mb-3 flex items-center justify-center h-24 bg-muted/50 rounded">
            <div className="w-4/5 space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-medium">Tout-en-un</span>
              <p className="text-sm text-muted-foreground mt-1">Formulaire complet visible</p>
            </div>
            <Layers className={cn("h-5 w-5", layoutType === 'allinone' ? "text-primary" : "text-muted-foreground")} />
          </div>
        </label>
      </RadioGroup>
    </div>
  );
}
