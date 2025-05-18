
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SettingsLayoutProps {
  children: ReactNode;
}

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <Button asChild variant="ghost" size="sm" className="mr-6">
              <Link to="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au tableau de bord
              </Link>
            </Button>
          </div>
        </header>
        <main className="container flex-1 py-6 md:py-10">{children}</main>
      </div>
    </div>
  );
};

export default SettingsLayout;
