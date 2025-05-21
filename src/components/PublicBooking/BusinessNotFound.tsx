
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

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
          <p>Raisons possibles :</p>
          <ul className="list-disc list-inside mt-2 text-left">
            <li>L'URL est mal orthographiée</li>
            <li>L'entreprise a changé son identifiant</li>
            <li>L'entreprise n'est plus active</li>
            <li>L'entreprise n'a pas encore configuré sa page de réservation</li>
          </ul>
        </div>
        
        <div className="mt-8 space-y-3">
          <button onClick={() => window.location.reload()} className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 underline">
            <ArrowLeft className="h-4 w-4" /> Actualiser la page
          </button>
          
          <Link to="/" className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 underline">
            <Home className="h-4 w-4" /> Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessNotFound;
