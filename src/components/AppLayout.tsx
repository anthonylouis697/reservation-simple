
import { ReactNode, useState } from "react";
import { QuickHelp } from "@/components/QuickHelp";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileFooter } from "@/components/MobileFooter";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Sidebar for desktop */}
        <DesktopSidebar />
        
        {/* Main content */}
        <main className="flex-grow overflow-auto pb-20 md:pb-6">
          {/* Mobile header */}
          <MobileHeader />
          
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
    </TooltipProvider>
  );
}
