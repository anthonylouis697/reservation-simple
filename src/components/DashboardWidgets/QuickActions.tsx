
import { useNavigate } from 'react-router-dom';
import { QuickAction } from './QuickAction';
import { getQuickActions, resetMockData } from './quickActionData';
import { useBusiness } from '@/contexts/BusinessContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

export const QuickActions = () => {
  const navigate = useNavigate();
  const { currentBusiness } = useBusiness();
  const actions = getQuickActions(navigate, currentBusiness?.id);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Fonction pour réinitialiser les données
  const handleResetData = async () => {
    if (!currentBusiness) return;
    setIsResetting(true);
    try {
      await resetMockData(currentBusiness.id);
      setShowResetDialog(false);
      window.location.reload(); // Recharger la page pour voir les données mises à jour
    } catch (error) {
      console.error("Erreur lors de la réinitialisation des données:", error);
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <TooltipProvider>
      <div className="relative">
        {/* Bandeau d'information pour les nouveaux utilisateurs */}
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6 rounded shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Mode démo actif</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Vous voyez actuellement des données de démonstration. Pour commencer à utiliser l'application avec vos propres données, 
                  vous pouvez <button 
                    onClick={() => setShowResetDialog(true)}
                    className="font-medium underline text-blue-800 hover:text-blue-900">
                    supprimer toutes les données fictives
                  </button>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {actions.map((action, index) => (
            <QuickAction 
              key={index}
              icon={action.icon} 
              label={action.label} 
              description={action.description} 
              onClick={action.onClick}
              color={action.color}
            />
          ))}
        </div>

        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Trash2 className="h-5 w-5 text-red-500 mr-2" />
                Supprimer les données de démonstration
              </DialogTitle>
              <DialogDescription>
                Cette action supprimera toutes les données fictives (services, catégories, clients, réservations) et vous permettra de commencer à utiliser l'application avec vos propres données.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-3 my-2 text-sm">
              Cette action est irréversible. Souhaitez-vous vraiment supprimer toutes les données fictives ?
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResetDialog(false)} disabled={isResetting}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleResetData} disabled={isResetting}>
                {isResetting ? "Suppression en cours..." : "Supprimer les données"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};
