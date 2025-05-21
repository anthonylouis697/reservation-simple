
import React from 'react';
import { Building2, AlertCircle } from 'lucide-react';
import { useBusiness } from '@/contexts/BusinessContext';

export function BusinessSelector() {
  const { currentBusiness, isLoading, businesses } = useBusiness();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span>Chargement...</span>
      </div>
    );
  }

  // Si aucune entreprise n'est disponible
  if (!businesses || businesses.length === 0 || !currentBusiness) {
    return (
      <div className="flex items-center text-amber-500">
        <AlertCircle className="h-4 w-4 mr-2" />
        <span>Aucune entreprise</span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100">
        <Building2 className="h-4 w-4 text-gray-500" />
        <span className="font-medium">{currentBusiness.name}</span>
      </div>
    </div>
  );
}
