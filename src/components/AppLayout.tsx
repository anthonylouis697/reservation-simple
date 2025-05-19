
import { ReactNode, useState } from "react";
import { QuickHelp } from "@/components/QuickHelp";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileFooter } from "@/components/MobileFooter";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // Mocked user data - in a real app this would come from auth context
  const user = {
    name: "Thomas Martin",
    email: "thomas@example.com",
    initials: "TM",
    role: "Propriétaire",
    subscription: {
      plan: "Premium",
      status: "active",
      renewalDate: "15/06/2025"
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar for desktop */}
      <DesktopSidebar userData={user} />
      
      {/* Main content */}
      <main className="flex-grow overflow-auto pb-20 md:pb-6">
        {/* Mobile header */}
        <MobileHeader 
          onHelpClick={() => setIsHelpOpen(true)}
          userData={user}
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
