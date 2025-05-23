
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BusinessNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Entreprise introuvable
          </h1>
          
          <p className="text-gray-600 mb-6">
            Nous n'avons pas trouvé d'entreprise correspondant à cette adresse. 
            Veuillez vérifier l'URL ou contacter l'entreprise pour plus d'informations.
          </p>
          
          <div className="space-y-3 text-sm text-left w-full mb-6">
            <h3 className="font-medium text-gray-800">Raisons possibles :</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>L'URL est mal orthographiée</li>
              <li>L'entreprise a changé son identifiant</li>
              <li>L'entreprise n'est plus active</li>
              <li>L'entreprise n'a pas encore configuré sa page de réservation</li>
            </ul>
          </div>
          
          <Button 
            className="w-full"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessNotFound;
