
import React from 'react';

interface EmptyServicesStateProps {
  businessName: string;
}

const EmptyServicesState = ({ businessName }: EmptyServicesStateProps) => {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{businessName}</h1>
          <div className="w-16 h-1 bg-gray-300 mx-auto mb-8 rounded"></div>
        </div>
        
        <div className="mt-12 text-center py-12 border rounded-lg bg-white">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-xl font-medium mb-2">Aucun service disponible</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Ce professionnel n'a pas encore ajouté de services à son calendrier de réservation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyServicesState;
