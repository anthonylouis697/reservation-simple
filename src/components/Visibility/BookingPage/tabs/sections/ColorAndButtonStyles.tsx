
import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { HexColorPicker } from 'react-colorful';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useBookingPage } from '../../BookingPageContext';
import { cn } from '@/lib/utils';

export function ColorAndButtonStyles() {
  const { 
    primaryColor,
    setPrimaryColor,
    buttonCorners,
    setButtonCorners,
    saveBookingPageSettings
  } = useBookingPage();
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState(primaryColor);
  
  // Update temp color when primary color changes
  useEffect(() => {
    setTempColor(primaryColor);
  }, [primaryColor]);

  // Fonction pour enregistrer la couleur
  const handleColorChange = async (color: string) => {
    setPrimaryColor(color);
    setShowColorPicker(false);
    
    try {
      await saveBookingPageSettings();
      toast.success("Couleur principale mise à jour", {
        duration: 2000,
        position: "bottom-right"
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la couleur", error);
      toast.error("Erreur lors de l'enregistrement de la couleur");
    }
  };

  // Fonction pour enregistrer le style des boutons
  const handleButtonStyleChange = async (value: 'squared' | 'rounded' | 'pill') => {
    setButtonCorners(value);
    
    try {
      await saveBookingPageSettings();
      toast.success(`Style de bouton "${value}" appliqué`, {
        duration: 2000,
        position: "bottom-right"
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du style de bouton", error);
      toast.error("Erreur lors de l'enregistrement du style de bouton");
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Couleur principale</Label>
            <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full h-10 border-2 flex justify-between"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-5 h-5 rounded" 
                      style={{ backgroundColor: primaryColor }}
                    />
                    <span>{primaryColor}</span>
                  </div>
                  <span>Modifier</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3">
                <HexColorPicker 
                  color={tempColor} 
                  onChange={setTempColor}
                />
                <div className="flex gap-2 mt-2">
                  <Input 
                    value={tempColor} 
                    onChange={(e) => setTempColor(e.target.value)}
                    className="h-8"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleColorChange(tempColor)}
                    className="h-8"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-4">
            <Label className="text-base font-medium">Style des boutons</Label>
            <RadioGroup 
              value={buttonCorners} 
              onValueChange={(value) => handleButtonStyleChange(value as 'squared' | 'rounded' | 'pill')}
              className="flex gap-2"
            >
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <label
                  htmlFor="squared"
                  className={cn(
                    "border-2 w-full h-10 rounded-none flex items-center justify-center cursor-pointer",
                    buttonCorners === 'squared' ? "border-primary" : "border-gray-200"
                  )}
                >
                  <RadioGroupItem 
                    value="squared" 
                    id="squared" 
                    className="sr-only" 
                  />
                  {buttonCorners === 'squared' && <Check className="h-4 w-4 text-primary" />}
                </label>
                <Label htmlFor="squared" className="text-xs cursor-pointer">Carré</Label>
              </div>
              
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <label
                  htmlFor="rounded"
                  className={cn(
                    "border-2 w-full h-10 rounded-md flex items-center justify-center cursor-pointer",
                    buttonCorners === 'rounded' ? "border-primary" : "border-gray-200"
                  )}
                >
                  <RadioGroupItem 
                    value="rounded" 
                    id="rounded" 
                    className="sr-only" 
                  />
                  {buttonCorners === 'rounded' && <Check className="h-4 w-4 text-primary" />}
                </label>
                <Label htmlFor="rounded" className="text-xs cursor-pointer">Arrondi</Label>
              </div>
              
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <label
                  htmlFor="pill"
                  className={cn(
                    "border-2 w-full h-10 rounded-full flex items-center justify-center cursor-pointer",
                    buttonCorners === 'pill' ? "border-primary" : "border-gray-200"
                  )}
                >
                  <RadioGroupItem 
                    value="pill" 
                    id="pill" 
                    className="sr-only" 
                  />
                  {buttonCorners === 'pill' && <Check className="h-4 w-4 text-primary" />}
                </label>
                <Label htmlFor="pill" className="text-xs cursor-pointer">Pill</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
