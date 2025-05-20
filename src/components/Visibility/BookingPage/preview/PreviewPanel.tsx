
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, ImageIcon, Type } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useBookingPage } from '../BookingPageContext';

export function PreviewPanel() {
  const { 
    primaryColor,
    businessName,
    welcomeMessage,
    logo,
    buttonCorners,
    bookingButtonText,
    showConfirmation,
    confirmationMessage,
    steps
  } = useBookingPage();
  
  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Type className="h-4 w-4" /> 
          Aperçu en direct
        </CardTitle>
        <CardDescription>
          Visualisez votre page de réservation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          {/* En-tête de la prévisualisation */}
          <div 
            className="py-4 px-4 flex items-center justify-between"
            style={{ backgroundColor: primaryColor, color: '#fff' }}
          >
            <div className="flex items-center gap-2">
              {logo && (
                <div className="h-8 w-8 rounded-full bg-white p-1">
                  <img src={logo} alt="Logo" className="h-full w-full object-contain" />
                </div>
              )}
              <span className="font-bold">{businessName}</span>
            </div>
          </div>

          {/* Corps de la prévisualisation */}
          <div className="p-4 space-y-4" style={{ backgroundColor: '#fff' }}>
            <h3 className="text-center font-medium text-lg mb-4">{welcomeMessage}</h3>
            
            {/* Étapes actives dans l'ordre défini par l'utilisateur */}
            {steps.filter(step => step.enabled).map((step) => (
              <div key={step.id} className="mb-6">
                {step.id === 'service' && (
                  <div className="space-y-2">
                    <Label className="font-medium flex items-center gap-2">
                      {step.icon}
                      Sélectionnez un service
                    </Label>
                    <div className="p-3 border border-primary/20 rounded shadow-sm bg-white cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Consultation standard</h4>
                          <div className="text-sm text-muted-foreground">30 min - 50€</div>
                        </div>
                        <Check className="h-5 w-5" style={{ color: primaryColor }} />
                      </div>
                    </div>
                    <div className="p-3 border rounded shadow-sm hover:border-primary/20 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Consultation approfondie</h4>
                          <div className="text-sm text-muted-foreground">60 min - 90€</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {step.id === 'date' && (
                  <div className="space-y-2">
                    <Label className="font-medium flex items-center gap-2">
                      {step.icon}
                      Sélectionnez une date
                    </Label>
                    <div className="border rounded-md p-3 text-center">
                      Sélectionnez une date dans le calendrier
                    </div>
                  </div>
                )}
                
                {step.id === 'time' && (
                  <div className="space-y-2">
                    <Label className="font-medium flex items-center gap-2">
                      {step.icon}
                      Choisissez un horaire
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        className={
                          buttonCorners === 'squared' ? 'rounded-none' : 
                          buttonCorners === 'pill' ? 'rounded-full' : ''
                        }
                        style={{ 
                          backgroundColor: primaryColor, 
                          color: 'white',
                          border: 'none'
                        }}
                      >
                        9:00
                      </Button>
                      <Button
                        variant="outline"
                        className={
                          buttonCorners === 'squared' ? 'rounded-none' : 
                          buttonCorners === 'pill' ? 'rounded-full' : ''
                        }
                      >
                        10:00
                      </Button>
                      <Button
                        variant="outline"
                        className={
                          buttonCorners === 'squared' ? 'rounded-none' : 
                          buttonCorners === 'pill' ? 'rounded-full' : ''
                        }
                      >
                        11:00
                      </Button>
                    </div>
                  </div>
                )}
                
                {step.id === 'info' && (
                  <div className="space-y-2">
                    <Label className="font-medium flex items-center gap-2">
                      {step.icon}
                      Vos informations
                    </Label>
                    <div className="space-y-3">
                      <Input placeholder="Nom complet" className="bg-white" />
                      <Input placeholder="Email" className="bg-white" />
                      <Input placeholder="Téléphone" className="bg-white" />
                    </div>
                  </div>
                )}
                
                {step.id === 'payment' && (
                  <div className="space-y-2">
                    <Label className="font-medium flex items-center gap-2">
                      {step.icon}
                      Paiement
                    </Label>
                    <div className="p-3 border rounded">
                      <p className="text-sm text-muted-foreground">Options de paiement</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-8 w-12 bg-slate-100 rounded flex items-center justify-center text-xs">Visa</div>
                        <div className="h-8 w-12 bg-slate-100 rounded flex items-center justify-center text-xs">MC</div>
                        <div className="h-8 w-12 bg-slate-100 rounded flex items-center justify-center text-xs">PayPal</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <Button 
              className={`w-full mt-4 ${
                buttonCorners === 'squared' ? 'rounded-none' : 
                buttonCorners === 'pill' ? 'rounded-full' : ''
              }`}
              style={{ backgroundColor: primaryColor, color: 'white', border: 'none' }}
            >
              {bookingButtonText}
            </Button>
            
            {showConfirmation && (
              <div className="mt-4 p-3 border border-green-200 rounded bg-green-50 text-green-700 text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <p>Aperçu du message de confirmation:<br />{confirmationMessage}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center mt-3">
          <Button variant="outline" size="sm" onClick={() => window.open('/preview-booking', '_blank')}>
            Voir en plein écran
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
