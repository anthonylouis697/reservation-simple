
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppLayout } from "@/components/AppLayout";
import { User, Users, CreditCard, Key } from "lucide-react";

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const location = useLocation();
  const path = location.pathname.split("/").pop() || "profile";
  
  const tabs = [
    { value: "profile", label: "Profil", icon: <User className="h-4 w-4 mr-2" />, href: "/account" },
    { value: "team", label: "Équipe", icon: <Users className="h-4 w-4 mr-2" />, href: "/account/team" },
    { value: "billing", label: "Facturation", icon: <CreditCard className="h-4 w-4 mr-2" />, href: "/account/billing" },
    { value: "security", label: "Sécurité", icon: <Key className="h-4 w-4 mr-2" />, href: "/account/security" }
  ];
  
  // Map path to tab value (default to profile)
  const activeTab = path === "account" ? "profile" : path;
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Tableau de bord</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/account">Compte</BreadcrumbLink>
            </BreadcrumbItem>
            {path !== "account" && path !== "profile" && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/account/${activeTab}`}>
                    {tabs.find(tab => tab.value === activeTab)?.label || ""}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compte</h1>
          <p className="text-muted-foreground">
            Gérez votre compte et vos préférences
          </p>
        </div>
        
        <Tabs value={activeTab} className="w-full">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 gap-2">
            {tabs.map(tab => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value} 
                className="flex items-center"
                asChild
              >
                <Link to={tab.href}>
                  {tab.icon}
                  {tab.label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="mt-6">
            {children}
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
}
