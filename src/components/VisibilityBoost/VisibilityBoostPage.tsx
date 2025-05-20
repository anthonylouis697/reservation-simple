
import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import PremiumPlatformCard from "@/components/VisibilityBoost/PremiumPlatformCard";
import { VisibilityNavigation, useVisibilityNavigation } from "@/components/Visibility/VisibilityNavigation";
import { Star } from "lucide-react";

export default function VisibilityBoostPage() {
  const { currentTab } = useVisibilityNavigation();

  const handleConnect = () => {
    // Handle connection logic here
    console.log("Connecting to platform...");
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Boost de visibilité - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Visibilité et Croissance</h1>
          <p className="text-muted-foreground mt-1">
            Développez votre présence en ligne et augmentez vos revenus
          </p>
        </div>

        {/* Use our shared navigation component */}
        <VisibilityNavigation currentTab={currentTab} />

        <div>
          <h2 className="text-xl font-semibold mb-4">Boost de visibilité</h2>
          <p className="text-muted-foreground mb-6">
            Augmentez votre visibilité et trouvez de nouveaux clients grâce à nos partenaires premium
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumPlatformCard 
              name="LaFourchette"
              description="Leader de la réservation de restaurants en ligne en Europe"
              features={[
                "Accès à des millions d'utilisateurs actifs",
                "Intégration du système de réservation",
                "Page établissement détaillée",
                "Support dédié aux restaurants"
              ]}
              icon={<Star className="h-5 w-5 text-amber-400" />}
              commission="5% par réservation"
              onConnect={handleConnect}
              popular={true}
            />
            
            <PremiumPlatformCard 
              name="TheFork Manager"
              description="Solution complète de gestion de restaurant"
              features={[
                "Outil de gestion complet",
                "Système de réservation intégré",
                "Promotion auprès des clients",
                "Analyses et rapports détaillés"
              ]}
              icon={<Star className="h-5 w-5" />}
              commission="3% par réservation"
              monthlyFee="39€/mois"
              onConnect={handleConnect}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
