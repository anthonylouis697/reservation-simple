
import React from 'react';
import { Service } from '@/types/service';
import { BookingCustomTexts } from '@/components/Visibility/BookingPage/types';

interface ServiceSelectionProps {
  customTexts: BookingCustomTexts;
  activeCategories: { id: string; name: string }[];
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  filteredServices: Service[];
  selectedService: Service | null;
  setSelectedService: (service: Service) => void;
  getButtonStyle: () => { className: string; style: { backgroundColor: string; borderColor: string } };
  primaryColor: string;
}

const ServiceSelection = ({
  customTexts,
  activeCategories,
  selectedCategory,
  setSelectedCategory,
  filteredServices,
  selectedService,
  setSelectedService,
  getButtonStyle,
  primaryColor
}: ServiceSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">
          {customTexts.serviceSelectionTitle || "Sélection du service"}
        </h2>
        <p className="text-gray-600 mt-2">
          {customTexts.serviceSelectionDescription || "Choisissez le service qui vous convient"}
        </p>
      </div>

      {/* Categories filter */}
      {activeCategories && activeCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === null
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            style={
              selectedCategory === null
                ? { backgroundColor: primaryColor, borderColor: primaryColor }
                : {}
            }
            onClick={() => setSelectedCategory(null)}
          >
            Tous
          </button>
          {activeCategories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              style={
                selectedCategory === category.id
                  ? { backgroundColor: primaryColor, borderColor: primaryColor }
                  : {}
              }
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Services grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices && filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedService && selectedService.id === service.id
                  ? "border-primary ring-1 ring-primary"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              style={
                selectedService && selectedService.id === service.id
                  ? { borderColor: primaryColor, boxShadow: `0 0 0 1px ${primaryColor}` }
                  : {}
              }
              onClick={() => setSelectedService(service)}
            >
              <div className="flex justify-between">
                <h3 className="font-medium">{service.name}</h3>
                <div className="font-semibold">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(service.price)}
                </div>
              </div>
              {service.description && (
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
              )}
              <div className="text-sm text-gray-500 mt-2">
                {service.duration} min
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-8">
            <p className="text-gray-500">Aucun service disponible</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceSelection;
