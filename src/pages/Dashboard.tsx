
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

const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { currentBusiness, isLoading: businessLoading } = useBusiness();
  const [isReady, setIsReady] = useState(false);
  
  // Vérifier que l'utilisateur et l'entreprise sont bien chargés
  useEffect(() => {
    if (!authLoading && user) {
      console.log("Dashboard: User loaded successfully", user.email);
      setIsReady(true);
    }
  }, [user, authLoading]);
  
  // Si toujours en chargement, afficher un indicateur
  if (authLoading || businessLoading || !isReady) {
    return <DashboardLoading />;
  }
  
  // The main content of the dashboard
  const mainContent = (
    <>
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
