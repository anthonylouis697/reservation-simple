
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

export interface VisibilityTab {
  id: string;
  title: string;
  href: string;
}

interface VisibilityNavigationProps {
  currentTab: string;
}

export const visibilityTabs: VisibilityTab[] = [
  {
    id: "main",
    title: "Vue d'ensemble",
    href: "/visibility"
  },
  {
    id: "booking-page",
    title: "Personnalisation",
    href: "/visibility/booking-page"
  },
  {
    id: "additional-services",
    title: "Boost de visibilité",
    href: "/visibility/additional-services"
  }
];

export function VisibilityNavigation({ currentTab }: VisibilityNavigationProps) {
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    const tab = visibilityTabs.find(tab => tab.id === value);
    if (tab) {
      navigate(tab.href);
    }
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <TabsList className="w-full justify-start mb-6 overflow-x-auto">
        {visibilityTabs.map(tab => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export function useVisibilityNavigation() {
  const location = useLocation();
  
  const getCurrentTab = () => {
    if (location.pathname === "/visibility") return "main";
    if (location.pathname.includes("/booking-page")) return "booking-page";
    if (location.pathname.includes("/additional-services")) return "additional-services";
    return "main";
  };

  return { currentTab: getCurrentTab() };
}
