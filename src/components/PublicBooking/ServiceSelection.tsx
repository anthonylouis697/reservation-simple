
import React from 'react';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';
import { Service } from '@/types/service';
import { CheckCircle, Clock, PiggyBank, Star, Sparkles } from 'lucide-react';

export interface ServiceSelectionProps {
  customTexts: BookingCustomTexts;
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
  getButtonStyle: () => { className: string; style: { backgroundColor: string; borderColor: string } };
  primaryColor: string;
  services?: Service[];
}

const ServiceSelection = ({
  customTexts = defaultCustomTexts,
  selectedService,
  setSelectedService,
  getButtonStyle,
  primaryColor,
  services = []
}: ServiceSelectionProps) => {
  const safeCustomTexts = customTexts || defaultCustomTexts;
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {safeCustomTexts.serviceSelectionTitle || "Services disponibles"}
        </h2>
        <p className="text-gray-600 mt-3 text-lg">
          {safeCustomTexts.serviceSelectionDescription || "Choisissez un service pour continuer"}
        </p>
      </div>
      
      <div className="grid gap-6 mt-8">
        {services.map((service, index) => (
          <div 
            key={service.id} 
            onClick={() => setSelectedService(service)}
            className={`
              relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105
              ${selectedService?.id === service.id 
                ? 'shadow-2xl ring-4 ring-opacity-50' 
                : 'shadow-lg hover:shadow-xl border border-gray-100'
              }
              bg-gradient-to-br from-white to-gray-50
            `}
            style={{ 
              borderColor: selectedService?.id === service.id ? primaryColor : '#e5e7eb',
              ringColor: selectedService?.id === service.id ? primaryColor : 'transparent',
              animationDelay: `${index * 100}ms`
            }}
          >
            {selectedService?.id === service.id && (
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 animate-pulse"></div>
            )}
            
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                  <h3 className="font-bold text-xl text-gray-800">{service.name}</h3>
                  {index === 0 && (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                      ⭐ POPULAIRE
                    </span>
                  )}
                </div>
                
                {service.description && (
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">{service.description}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
                  <div className="flex items-center text-gray-700">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <Clock size={16} className="text-blue-600" />
                    </div>
                    <span className="font-medium">{service.duration} min</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <PiggyBank size={16} className="text-green-600" />
                    </div>
                    <span className="font-bold text-lg">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(service.price)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">(4.9)</span>
                  </div>
                </div>
              </div>
              
              <div className="ml-6 flex flex-col items-center">
                {selectedService?.id === service.id ? (
                  <div className="relative">
                    <CheckCircle 
                      style={{ color: primaryColor }} 
                      className="h-8 w-8"
                    />
                    <div className="absolute -inset-1 bg-current rounded-full opacity-20 animate-ping"></div>
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full border-3 border-gray-300 hover:border-gray-400 transition-colors"></div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {services.length === 0 && (
          <div className="text-center p-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">Aucun service disponible pour le moment</p>
            <p className="text-gray-400 text-sm mt-2">Revenez bientôt pour découvrir nos services !</p>
          </div>
        )}
      </div>
      
      {selectedService && (
        <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
          <div className="flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-semibold">
              Service sélectionné: {selectedService.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
