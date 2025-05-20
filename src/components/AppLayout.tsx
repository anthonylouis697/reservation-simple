
import { ReactNode, useState } from "react";
import { QuickHelp } from "@/components/QuickHelp";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileFooter } from "@/components/MobileFooter";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { user, profile } = useAuth();
  
  // Créer un objet userData à partir des données d'authentification
  const userData = {
    name: profile?.first_name && profile?.last_name 
      ? `${profile.first_name} ${profile.last_name}` 
      : user?.email?.split('@')[0] || 'Utilisateur',
    email: user?.email || 'email@exemple.com',
    initials: profile?.first_name && profile?.last_name 
      ? `${profile.first_name[0]}${profile.last_name[0]}` 
      : user?.email?.substring(0, 2).toUpperCase() || 'U',
    role: profile?.role || 'Propriétaire',
    subscription: {
      plan: 'Premium',
      status: 'active',
      renewalDate: "15/06/2025"
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar for desktop */}
      <DesktopSidebar userData={userData} />
      
      {/* Main content */}
      <main className="flex-grow overflow-auto pb-20 md:pb-6">
        {/* Mobile header */}
        <MobileHeader 
          onHelpClick={() => setIsHelpOpen(true)}
          userData={userData}
        />
        
        {/* Page content */}
        <div className="max-w-7xl mx-auto p-6">
          {children}
        </div>
        
        {/* Bottom navigation for mobile */}
        <MobileFooter />
      </main>
      
      {/* Quick help panel */}
      <QuickHelp open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
