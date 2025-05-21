
import React from 'react';
import { Building2 } from 'lucide-react';
import { useBusiness } from '@/contexts/BusinessContext';

export function BusinessSelector() {
  const { currentBusiness, isLoading } = useBusiness();

  if (isLoading) {
    return <div className="flex items-center space-x-2">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      <span>Chargement...</span>
    </div>;
  }

  return (
    <div className="flex items-center">
      {currentBusiness ? (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100">
          <Building2 className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{currentBusiness.name}</span>
        </div>
      ) : (
        <div className="text-muted-foreground">Aucune entreprise trouvée</div>
      )}
    </div>
  );
}
