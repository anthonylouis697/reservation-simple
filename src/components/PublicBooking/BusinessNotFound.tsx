
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const BusinessNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-16 w-16 text-amber-500" />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Entreprise introuvable</h2>
        
        <p className="text-gray-600 mb-6">
          Nous n'avons pas trouvé d'entreprise correspondant à cette adresse. 
          Veuillez vérifier l'URL ou contacter l'entreprise pour plus d'informations.
        </p>
        
        <div className="text-sm text-gray-500 mt-8">
          <p>Possibles raisons:</p>
          <ul className="list-disc list-inside mt-2 text-left">
            <li>L'URL est mal orthographiée</li>
            <li>L'entreprise a changé son identifiant</li>
            <li>L'entreprise n'est plus active</li>
          </ul>
        </div>
        
        <div className="mt-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessNotFound;
