
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  sidebarContent: ReactNode;
  mainContent: ReactNode;
}

export const DashboardLayout = ({ sidebarContent, mainContent }: DashboardLayoutProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {mainContent}
      </div>
      <div className="space-y-6">
        {sidebarContent}
      </div>
    </div>
  );
};
