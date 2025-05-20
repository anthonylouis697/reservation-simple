
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Paintbrush, Layout, ImageIcon } from 'lucide-react';
import { useBookingPage } from '../BookingPageContext';

export function CustomizeTab() {
  const { 
    templates, 
    selectedTemplate, 
    setSelectedTemplate,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    buttonCorners,
    setButtonCorners,
    logo,
    setLogo
  } = useBookingPage();
  
  const selectTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setPrimaryColor(template.colors.primary);
      setSecondaryColor(template.colors.secondary);
    }
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Couleurs prédéfinies pour faciliter la sélection
  const colorPresets = [
    "#9b87f5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"
  ];
  
  return (
    <div className="space-y-6">
      {/* Sélection de modèle */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Modèle de page
          </CardTitle>
          <CardDescription>
            Choisissez un modèle qui correspond à votre style
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => selectTemplate(template.id)}
                className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? "ring-2 ring-primary"
                    : "hover:border-primary/50"
                }`}
              >
                <div 
                  className="h-24 w-full"
                  style={{ backgroundColor: template.colors.primary }}
                >
                  <div className="h-full w-full flex items-center justify-center text-white font-medium">
                    {template.style === 'standard' && 'Standard'}
                    {template.style === 'minimal' && 'Minimal'}
                    {template.style === 'premium' && 'Premium'}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.description}
                  </p>
                  {selectedTemplate === template.id && (
                    <Badge variant="outline" className="mt-2 bg-primary/10 text-primary">
                      Sélectionné
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Couleurs et style */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Paintbrush className="h-4 w-4" />
            Couleurs et style
          </CardTitle>
          <CardDescription>
            Personnalisez l'apparence visuelle de votre page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary-color">Couleur principale</Label>
            <div className="flex gap-3 items-center">
              <div className="flex flex-wrap gap-2">
                {colorPresets.map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border ${
                      primaryColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setPrimaryColor(color)}
                    aria-label={`Couleur ${color}`}
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-2 ml-2">
                <Input 
                  type="color" 
                  id="primary-color" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)} 
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input 
                  type="text" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)} 
                  className="w-32"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondary-color">Couleur secondaire</Label>
            <div className="flex gap-3 items-center">
              <Input 
                type="color" 
                id="secondary-color" 
                value={secondaryColor} 
                onChange={(e) => setSecondaryColor(e.target.value)} 
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input 
                type="text" 
                value={secondaryColor} 
                onChange={(e) => setSecondaryColor(e.target.value)} 
                className="w-32"
              />
              <div 
                className="h-8 w-8 rounded-full border"
                style={{ backgroundColor: secondaryColor }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="button-style">Style des boutons</Label>
            <RadioGroup 
              value={buttonCorners} 
              onValueChange={(value) => setButtonCorners(value as 'squared' | 'rounded' | 'pill')}
              className="flex space-x-2 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="squared" id="squared" />
                <Label htmlFor="squared">Carrés</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rounded" id="rounded" />
                <Label htmlFor="rounded">Arrondis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pill" id="pill" />
                <Label htmlFor="pill">Pilule</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 h-16 w-16 border rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                {logo ? (
                  <img src={logo} alt="Logo aperçu" className="max-h-full max-w-full" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    Choisir une image
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Format recommandé: PNG ou JPEG. 1MB maximum.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
