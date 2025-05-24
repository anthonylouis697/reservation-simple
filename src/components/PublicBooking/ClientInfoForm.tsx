
import React from 'react';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';
import { Service } from '@/types/service';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ClientInfoFormProps {
  customTexts: BookingCustomTexts;
  clientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes: string;
  };
  setClientInfo: (clientInfo: any) => void;
  selectedService: Service | null;
  selectedDate: Date | undefined;
  selectedTime: string | null;
}

const ClientInfoForm = ({
  customTexts = defaultCustomTexts,
  clientInfo,
  setClientInfo,
  selectedService,
  selectedDate,
  selectedTime
}: ClientInfoFormProps) => {
  // Ensure customTexts is never undefined
  const safeCustomTexts = customTexts || defaultCustomTexts;
  
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setClientInfo({
      ...clientInfo,
      [field]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {safeCustomTexts.clientInfoTitle || "Vos informations"}
        </h2>
        <p className="text-gray-600 mt-2">
          {safeCustomTexts.clientInfoDescription || "Complétez vos informations pour finaliser la réservation"}
        </p>
      </div>
      
      {/* Récapitulatif de la réservation */}
      {selectedService && selectedDate && selectedTime && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Récapitulatif de votre réservation</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Service:</span> {selectedService.name}</p>
            <p><span className="font-medium">Date:</span> {selectedDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <p><span className="font-medium">Heure:</span> {selectedTime}</p>
            <p><span className="font-medium">Durée:</span> {selectedService.duration} minutes</p>
            <p><span className="font-medium">Prix:</span> {selectedService.price}€</p>
          </div>
        </div>
      )}
      
      {/* Formulaire d'informations client */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            type="text"
            value={clientInfo.firstName}
            onChange={handleInputChange('firstName')}
            placeholder="Votre prénom"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            type="text"
            value={clientInfo.lastName}
            onChange={handleInputChange('lastName')}
            placeholder="Votre nom"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={clientInfo.email}
            onChange={handleInputChange('email')}
            placeholder="votre@email.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            value={clientInfo.phone}
            onChange={handleInputChange('phone')}
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes complémentaires</Label>
        <Textarea
          id="notes"
          value={clientInfo.notes}
          onChange={handleInputChange('notes')}
          placeholder="Ajoutez des informations complémentaires si nécessaire..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default ClientInfoForm;
