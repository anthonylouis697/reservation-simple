
import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import { VisibilityNavigation, useVisibilityNavigation } from "@/components/Visibility/VisibilityNavigation";
import { BookingPageCustomization } from "@/components/Visibility/BookingPage/BookingPageCustomization";

export default function BookingPage() {
  const { currentTab } = useVisibilityNavigation();

  return (
    <AppLayout>
      <Helmet>
        <title>Personnalisation - Page de réservation - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Page de réservation</h1>
          <p className="text-muted-foreground mt-1">
            Personnalisez votre page de réservation et augmentez votre visibilité en ligne
          </p>
        </div>

        <VisibilityNavigation currentTab={currentTab} />
        
        <BookingPageCustomization />
      </div>
    </AppLayout>
  );
}
