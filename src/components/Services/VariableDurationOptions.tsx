
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
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
  onChange,
}: VariableDurationOptionsProps) => {
  console.log("VariableDurationOptions: Component rendering", { options, defaultDuration, defaultPrice });
  
  const [showOptions, setShowOptions] = useState(() => {
    const show = options && options.length > 0;
    console.log("VariableDurationOptions: Initial showOptions", show);
    return show;
  });

  const addOption = () => {
    console.log("VariableDurationOptions: Adding option", { currentOptions: options });
    const optionsArray = options || [];
    const newOption: VariableDurationOption = {
      id: generateId(),
      name: `Option ${optionsArray.length + 1}`,
      duration: defaultDuration,
      price: defaultPrice,
    };
    console.log("VariableDurationOptions: New option created", newOption);
    const newOptions = [...optionsArray, newOption];
    console.log("VariableDurationOptions: New options array", newOptions);
    onChange(newOptions);
    setShowOptions(true);
  };

  const updateOption = (id: string, field: keyof VariableDurationOption, value: string | number) => {
    console.log("VariableDurationOptions: Updating option", { id, field, value });
    const optionsArray = options || [];
    const updatedOptions = optionsArray.map(option =>
      option.id === id ? { ...option, [field]: value } : option
    );
    console.log("VariableDurationOptions: Updated options", updatedOptions);
    onChange(updatedOptions);
  };

  const removeOption = (id: string) => {
    console.log("VariableDurationOptions: Removing option", { id, currentOptions: options });
    const optionsArray = options || [];
    const updatedOptions = optionsArray.filter(option => option.id !== id);
    console.log("VariableDurationOptions: After removal", updatedOptions);
    onChange(updatedOptions);
    if (updatedOptions.length === 0) {
      setShowOptions(false);
    }
  };

  const toggleOptions = () => {
    console.log("VariableDurationOptions: Toggling options", { showOptions, optionsLength: options?.length });
    if (!showOptions && (!options || options.length === 0)) {
      addOption();
    } else {
      setShowOptions(!showOptions);
    }
  };

  const safeOptions = options || [];
  console.log("VariableDurationOptions: Safe options", safeOptions);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Options de durée et prix variables</Label>
        <Button
          type="button"
          variant={showOptions ? "outline" : "default"}
          size="sm"
          onClick={toggleOptions}
        >
          {showOptions ? "Masquer" : "Ajouter des options"}
        </Button>
      </div>

      {showOptions && (
        <div className="space-y-3">
          {safeOptions.map((option, index) => (
            <Card key={option.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  Option {index + 1}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(option.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`name-${option.id}`} className="text-xs">
                      Nom de l'option
                    </Label>
                    <Input
                      id={`name-${option.id}`}
                      value={option.name}
                      onChange={(e) => updateOption(option.id, 'name', e.target.value)}
                      placeholder="Ex: Standard"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`duration-${option.id}`} className="text-xs">
                      Durée (min)
                    </Label>
                    <Input
                      id={`duration-${option.id}`}
                      type="number"
                      min={1}
                      value={option.duration}
                      onChange={(e) => updateOption(option.id, 'duration', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`price-${option.id}`} className="text-xs">
                      Prix (€)
                    </Label>
                    <Input
                      id={`price-${option.id}`}
                      type="number"
                      min={0}
                      step="0.01"
                      value={option.price}
                      onChange={(e) => updateOption(option.id, 'price', Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addOption}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une option
          </Button>
        </div>
      )}
    </div>
  );
};
