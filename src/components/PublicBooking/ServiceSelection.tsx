
import React from 'react';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';
import { Service } from '@/types/service';
import { CheckCircle, Clock, PiggyBank } from 'lucide-react';

export interface ServiceSelectionProps {
  customTexts: BookingCustomTexts;
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
  getButtonStyle: () => { className: string; style: { backgroundColor: string; borderColor: string } };
  primaryColor: string;
  services?: Service[]; // Make services optional to fix the type error
}

const ServiceSelection = ({
  customTexts = defaultCustomTexts,
  selectedService,
  setSelectedService,
  getButtonStyle,
  primaryColor,
  services = [] // Provide default empty array for services
}: ServiceSelectionProps) => {
  // Ensure customTexts is never undefined
  const safeCustomTexts = customTexts || defaultCustomTexts;
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {safeCustomTexts.serviceSelectionTitle || "Services disponibles"}
        </h2>
        <p className="text-gray-600 mt-2">
          {safeCustomTexts.serviceSelectionDescription || "Choisissez un service pour continuer"}
        </p>
      </div>
      
      <div className="grid gap-4 mt-6">
        {services.map((service) => (
          <div 
            key={service.id} 
            onClick={() => setSelectedService(service)}
            className={`
              p-4 rounded-lg cursor-pointer transition-all
              ${selectedService?.id === service.id 
                ? 'border-2 shadow-md' 
                : 'border hover:border-gray-300 hover:shadow-sm'
              }
            `}
            style={{ 
              borderColor: selectedService?.id === service.id ? primaryColor : '#e5e7eb',
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-lg">{service.name}</h3>
                {service.description && (
                  <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock size={16} className="mr-1" />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <PiggyBank size={16} className="mr-1" />
                    <span>
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(service.price)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="ml-4">
                {selectedService?.id === service.id ? (
                  <CheckCircle 
                    style={{ color: primaryColor }} 
                    className="h-6 w-6"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {services.length === 0 && (
          <div className="text-center p-8 border rounded-lg bg-gray-50">
            <p className="text-gray-500">Aucun service disponible pour le moment</p>
          </div>
        )}
      </div>
      
      {selectedService && (
        <p className="text-center mt-6 text-green-600 font-medium">
          Service sélectionné: {selectedService.name}
        </p>
      )}
    </div>
  );
};

export default ServiceSelection;
