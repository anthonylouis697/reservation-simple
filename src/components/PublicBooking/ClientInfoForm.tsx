
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Service } from '@/types/service';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';

interface ClientInfoFormProps {
  customTexts: BookingCustomTexts;
  clientName: string;
  setClientName: (name: string) => void;
  clientEmail: string;
  setClientEmail: (email: string) => void;
  clientPhone: string;
  setClientPhone: (phone: string) => void;
  clientNotes: string;
  setClientNotes: (notes: string) => void;
  selectedService: Service | null;
  selectedDate: Date | undefined;
  selectedTime: string | null;
}

const ClientInfoForm = ({
  customTexts,
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  clientPhone,
  setClientPhone,
  clientNotes,
  setClientNotes,
  selectedService,
  selectedDate,
  selectedTime
}: ClientInfoFormProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">
          {customTexts.clientInfoTitle || "Vos informations"}
        </h2>
        <p className="text-gray-600 mt-2">
          {customTexts.clientInfoDescription || "Veuillez fournir vos coordonnées"}
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet *
          </label>
          <input
            id="name"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
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
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
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
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
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
            value={clientNotes}
            onChange={(e) => setClientNotes(e.target.value)}
            placeholder="Informations supplémentaires à nous communiquer..."
          />
        </div>
      </form>
    </div>
  );
};

export default ClientInfoForm;
