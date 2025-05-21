
import React from 'react';

const EmptyServicesState = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Aucun service disponible</h2>
        <p className="text-gray-600 mb-6">
          Cette entreprise n'a pas encore configuré ses services de réservation. 
          Veuillez réessayer ultérieurement ou contacter directement l'entreprise.
        </p>
      </div>
    </div>
  );
};

export default EmptyServicesState;
