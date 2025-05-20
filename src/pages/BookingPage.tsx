
import { Helmet } from "react-helmet";
import { AppLayout } from "@/components/AppLayout";
import { VisibilityNavigation, useVisibilityNavigation } from "@/components/Visibility/VisibilityNavigation";
import { BookingPageCustomization } from "@/components/Visibility/BookingPage/BookingPageCustomization";

export default function BookingPage() {
  const { currentTab } = useVisibilityNavigation();

  return (
    <AppLayout>
      <Helmet>
        <title>Page de réservation - Reservatoo</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Visibilité et Croissance</h1>
          <p className="text-muted-foreground mt-1">
            Développez votre présence en ligne et augmentez vos revenus
          </p>
        </div>

        <VisibilityNavigation currentTab={currentTab} />
        
        <BookingPageCustomization />
      </div>
    </AppLayout>
  );
}
