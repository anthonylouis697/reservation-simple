
import React from 'react';

const BusinessNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Entreprise introuvable</h2>
        <p className="text-gray-600 mb-6">
          Nous n'avons pas trouvé d'entreprise correspondant à cette adresse. 
          Veuillez vérifier l'URL ou contacter l'entreprise pour plus d'informations.
        </p>
      </div>
    </div>
  );
};

export default BusinessNotFound;
