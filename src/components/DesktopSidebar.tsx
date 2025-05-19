
import { MainNavigation } from "@/components/MainNavigation";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";

interface DesktopSidebarProps {
  userData: {
    name: string;
    email: string;
    initials: string;
    role: string;
    subscription: {
      plan: string;
      status: string;
      renewalDate: string;
    };
  };
}

export function DesktopSidebar({ userData }: DesktopSidebarProps) {
  return (
    <aside className="bg-white w-64 border-r border-gray-200 hidden md:flex flex-col">
      <div className="p-6">
        <h2 className="text-indigo-600 text-xl font-bold">Reservatoo</h2>
      </div>
      <div className="flex-grow py-6 px-4">
        <MainNavigation />
      </div>
      <div className="p-4 border-t border-gray-200">
        <UserProfileDropdown user={userData} />
      </div>
    </aside>
  );
}
