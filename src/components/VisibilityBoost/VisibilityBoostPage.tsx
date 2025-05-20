import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import PremiumPlatformCard from "@/components/VisibilityBoost/PremiumPlatformCard";
import { VisibilityNavigation, useVisibilityNavigation } from "@/components/Visibility/VisibilityNavigation";

export default function VisibilityBoostPage() {
  const { currentTab } = useVisibilityNavigation();

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
          
          <PremiumPlatformCard />
        </div>
      </div>
    </AppLayout>
  );
}
