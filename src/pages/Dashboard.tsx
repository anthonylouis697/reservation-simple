import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { OnboardingGuide } from '@/components/OnboardingGuide';
import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { QuickActions } from '@/components/DashboardWidgets/QuickActions';
import { RevenueChart } from '@/components/DashboardWidgets/RevenueChart';
import { ClientsWidget } from '@/components/DashboardWidgets/ClientsWidget';
import { ServicesWidget } from '@/components/DashboardWidgets/ServicesWidget';
import { UpcomingEvents } from '@/components/DashboardWidgets/UpcomingEvents';
import { DashboardHeader } from '@/components/Dashboard/DashboardHeader';
import { DashboardLayout } from '@/components/Dashboard/DashboardLayout';
import { CalendarSidebar } from '@/components/Dashboard/CalendarSidebar';
import { AppointmentsSection } from '@/components/Dashboard/AppointmentsSection';
import { SetupGuide } from '@/components/Dashboard/SetupGuide';
import { VisibilityBoostPromo } from '@/components/Dashboard/VisibilityBoostPromo';
import { DashboardLoading } from '@/components/Dashboard/DashboardLoading';
import { BookingLinkCard } from '@/components/Dashboard/BookingLinkCard';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { currentBusiness, isLoading: businessLoading, refreshBusinesses } = useBusiness();
  const [isReady, setIsReady] = useState(false);
  
  // Vérifier que l'utilisateur et l'entreprise sont bien chargés
  useEffect(() => {
    if (!authLoading && user) {
      console.log("Dashboard: User loaded successfully", user.email);
      setIsReady(true);
    }
  }, [user, authLoading]);
  
  // If still loading, display loading indicator
  if (authLoading || businessLoading || !isReady) {
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
  
  // The main content of the dashboard
  const mainContent = (
    <>
      <BookingLinkCard />
      <RevenueChart />
      <AppointmentsSection />
      <UpcomingEvents />
      <SetupGuide />
    </>
  );
  
  // The sidebar content
  const sidebarContent = (
    <>
      <CalendarSidebar />
      <ClientsWidget />
      <ServicesWidget />
      <VisibilityBoostPromo />
    </>
  );
  
  return (
    <AppLayout>
      {/* Onboarding pour les nouveaux utilisateurs */}
      <OnboardingGuide />
      
      {/* Dashboard header */}
      <DashboardHeader 
        title="Tableau de bord" 
        subtitle="Bienvenue sur votre espace BookWise"
      />
      
      {/* Quick actions */}
      <section className="mb-6">
        <QuickActions />
      </section>
      
      {/* Dashboard content */}
      <DashboardLayout 
        mainContent={mainContent}
        sidebarContent={sidebarContent}
      />
    </AppLayout>
  );
};

export default Dashboard;
