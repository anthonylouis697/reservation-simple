
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { DashboardLoading } from '@/components/Dashboard/DashboardLoading';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { currentBusiness, isLoading: businessLoading, refreshBusinesses } = useBusiness();
  const navigate = useNavigate();
  
  // Rediriger vers la page calendrier au lieu du tableau de bord
  useEffect(() => {
    if (!authLoading && !businessLoading && user) {
      navigate('/calendar');
    }
  }, [user, authLoading, businessLoading, navigate]);
  
  // If still loading, display loading indicator
  if (authLoading || businessLoading) {
    return <DashboardLoading />;
  }

  // If no business found, display a message
  if (!currentBusiness) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="bg-amber-100 text-amber-800 p-3 rounded-full mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Aucune entreprise trouvée</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Il semble que vous n'ayez pas encore d'entreprise configurée. 
            Veuillez contacter l'administrateur ou rafraîchir la page.
          </p>
          <Button onClick={() => refreshBusinesses()}>
            Rafraîchir la page
          </Button>
        </div>
      </AppLayout>
    );
  }
  
  return <DashboardLoading />;
};

export default Dashboard;
