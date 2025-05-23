
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import { VariableDurationOption } from "@/types/service";

interface VariableDurationOptionsProps {
  options: VariableDurationOption[];
  defaultDuration: number;
  defaultPrice: number;
  onChange: (options: VariableDurationOption[]) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const VariableDurationOptions = ({ 
  options, 
  defaultDuration, 
  defaultPrice, 
  onChange 
}: VariableDurationOptionsProps) => {
  const [hasVariableOptions, setHasVariableOptions] = useState(options.length > 0);

  const addOption = () => {
    const newOption: VariableDurationOption = {
      id: generateId(),
      name: `Option ${options.length + 1}`,
      duration: defaultDuration,
      price: defaultPrice,
    };
    
    const newOptions = [...options, newOption];
    onChange(newOptions);
    setHasVariableOptions(true);
  };

  const updateOption = (id: string, field: keyof VariableDurationOption, value: string | number) => {
    const newOptions = options.map(option => 
      option.id === id 
        ? { ...option, [field]: typeof value === 'string' && field !== 'name' ? Number(value) : value } 
        : option
    );
    onChange(newOptions);
  };

  const removeOption = (id: string) => {
    const newOptions = options.filter(option => option.id !== id);
    onChange(newOptions);
    
    if (newOptions.length === 0) {
      setHasVariableOptions(false);
    }
  };

  const toggleVariableOptions = (enabled: boolean) => {
    setHasVariableOptions(enabled);
    if (!enabled) {
      onChange([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch 
          id="variableOptions" 
          checked={hasVariableOptions}
          onCheckedChange={toggleVariableOptions}
        />
        <Label htmlFor="variableOptions">Durées et prix variables</Label>
      </div>
      
      {hasVariableOptions && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Options de durée</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addOption}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une option
            </Button>
          </div>
          
          {options.length > 0 ? (
            <div className="space-y-3">
              {options.map((option) => (
                <Card key={option.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="grow">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor={`name-${option.id}`} className="text-xs mb-1 block">Nom</Label>
                          <Input
                            id={`name-${option.id}`}
                            value={option.name}
                            onChange={(e) => updateOption(option.id, 'name', e.target.value)}
                            placeholder="Nom de l'option"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`duration-${option.id}`} className="text-xs mb-1 block">Durée (min)</Label>
                          <Input
                            id={`duration-${option.id}`}
                            type="number"
                            min={1}
                            value={option.duration}
                            onChange={(e) => updateOption(option.id, 'duration', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`price-${option.id}`} className="text-xs mb-1 block">Prix (€)</Label>
                          <Input
                            id={`price-${option.id}`}
                            type="number"
                            min={0}
                            step="0.01"
                            value={option.price}
                            onChange={(e) => updateOption(option.id, 'price', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      className="p-1 h-auto text-destructive"
                      onClick={() => removeOption(option.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card 
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed cursor-pointer hover:border-primary/50"
              onClick={addOption}
            >
              <PlusCircle className="h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Cliquez pour ajouter une option de durée
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
