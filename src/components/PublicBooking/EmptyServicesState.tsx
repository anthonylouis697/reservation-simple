
import React from 'react';
import { CalendarX } from 'lucide-react';
import { useParams } from 'react-router-dom';

const EmptyServicesState = () => {
  const { businessSlug } = useParams<{ businessSlug?: string }>();
  
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-amber-50 text-amber-500 p-4 rounded-full mb-6">
        <CalendarX className="h-12 w-12" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-center">Aucun service disponible</h2>
      <p className="text-gray-600 text-center max-w-md mb-6">
        Cette entreprise n'a pas encore configuré de services disponibles à la réservation.
        Veuillez d'abord créer des services dans la section "Services" de votre tableau de bord.
      </p>
      <div className="text-sm text-gray-500 text-center">
        Identifiant entreprise: <span className="font-mono">{businessSlug}</span>
      </div>
    </div>
  );
};

export default EmptyServicesState;
