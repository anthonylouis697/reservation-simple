
import React, { useState } from 'react';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';
import { defaultCustomTexts } from '@/components/Visibility/BookingPage/constants/defaultData';
import { Service, Category } from '@/types/service';
import { usePublicBookingData } from '@/components/Visibility/BookingPage/PublicBookingData';
import ServiceSelection from './ServiceSelection';
import CategorySection from './CategorySection';
import { Sparkles } from 'lucide-react';

export interface EnhancedServiceSelectionProps {
  customTexts: BookingCustomTexts;
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
  getButtonStyle: () => { className: string; style: { backgroundColor: string; borderColor: string } };
  primaryColor: string;
  services?: Service[];
}

const EnhancedServiceSelection = ({
  customTexts = defaultCustomTexts,
  selectedService,
  setSelectedService,
  getButtonStyle,
  primaryColor,
  services = []
}: EnhancedServiceSelectionProps) => {
  const { categories = [] } = usePublicBookingData();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Filtrer les services par catégorie sélectionnée
  const filteredServices = selectedCategory 
    ? services.filter(service => service.categoryId === selectedCategory.id)
    : services;

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

      {/* Section Catégories */}
      <CategorySection
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        primaryColor={primaryColor}
      />

      {/* Section Services */}
      <ServiceSelection
        customTexts={safeCustomTexts}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        getButtonStyle={getButtonStyle}
        primaryColor={primaryColor}
        services={filteredServices}
      />

      {/* Affichage du nombre de services */}
      {selectedCategory && (
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} dans cette catégorie
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedServiceSelection;
