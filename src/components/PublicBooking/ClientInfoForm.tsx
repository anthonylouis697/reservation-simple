
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Service } from '@/types/service';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';

interface ClientInfoFormProps {
  customTexts: BookingCustomTexts;
  clientName?: string;
  setClientName?: (name: string) => void;
  clientEmail?: string;
  setClientEmail?: (email: string) => void;
  clientPhone?: string;
  setClientPhone?: (phone: string) => void;
  clientNotes?: string;
  setClientNotes?: (notes: string) => void;
  selectedService: Service | null;
  selectedDate: Date | undefined;
  selectedTime: string | null;
  // Add these properties to fix the type errors
  clientInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes: string;
  };
  setClientInfo?: (clientInfo: any) => void;
}

const ClientInfoForm = ({
  customTexts,
  clientName = '',
  setClientName = () => {},
  clientEmail = '',
  setClientEmail = () => {},
  clientPhone = '',
  setClientPhone = () => {},
  clientNotes = '',
  setClientNotes = () => {},
  selectedService,
  selectedDate,
  selectedTime,
  // Add support for the new props
  clientInfo,
  setClientInfo = () => {}
}: ClientInfoFormProps) => {
  // Ensure customTexts is never undefined
  const safeCustomTexts = customTexts || defaultCustomTexts;
  
  // Handle the new clientInfo prop approach
  const handleInputChange = (field: string, value: string) => {
    if (clientInfo && setClientInfo) {
      setClientInfo({ ...clientInfo, [field]: value });
    } else {
      // Fall back to individual setters
      switch (field) {
        case 'firstName':
          setClientName(value);
          break;
        case 'email':
          setClientEmail(value);
          break;
        case 'phone':
          setClientPhone(value);
          break;
        case 'notes':
          setClientNotes(value);
          break;
      }
    }
  };
  
  // Get values from either approach
  const firstName = clientInfo?.firstName || clientName;
  const lastName = clientInfo?.lastName || '';
  const email = clientInfo?.email || clientEmail;
  const phone = clientInfo?.phone || clientPhone;
  const notes = clientInfo?.notes || clientNotes;
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">
          {safeCustomTexts.clientInfoTitle || "Vos informations"}
        </h2>
        <p className="text-gray-600 mt-2">
          {safeCustomTexts.clientInfoDescription || "Veuillez fournir vos coordonnées"}
        </p>
        
        {selectedService && selectedDate && selectedTime && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md inline-block">
            <p className="font-medium">{selectedService.name}</p>
            <p className="text-sm text-gray-500">
              {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })} à {selectedTime}
            </p>
            <p className="text-sm text-gray-500">
              {selectedService.duration} min - {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(selectedService.price)}
            </p>
          </div>
        )}
      </div>
      
      <form className="space-y-4 max-w-md mx-auto">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            Prénom *
          </label>
          <input
            id="firstName"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Votre prénom"
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <input
            id="lastName"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Votre nom"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="votre.email@exemple.com"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            id="phone"
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="06 XX XX XX XX"
          />
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes additionnelles
          </label>
          <textarea
            id="notes"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Informations supplémentaires à nous communiquer..."
          />
        </div>
      </form>
    </div>
  );
};

export default ClientInfoForm;
