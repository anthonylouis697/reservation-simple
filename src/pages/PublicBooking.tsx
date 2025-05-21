
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BookingPageProvider } from '@/components/Visibility/BookingPage/BookingPageContext';
import { PublicBookingDataProvider } from '@/components/Visibility/BookingPage/PublicBookingData';
import { BusinessProvider, useBusiness } from '@/contexts/BusinessContext';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import refactored components
import LoadingScreen from '@/components/PublicBooking/LoadingScreen';
import BusinessNotFound from '@/components/PublicBooking/BusinessNotFound';
import BookingContent from '@/components/PublicBooking/BookingContent';

// Composant pour la gestion de la recherche d'entreprise
const BusinessFinder = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [businessFound, setBusinessFound] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const { findBusinessBySlug } = useBusiness();
  
  useEffect(() => {
    const checkBusiness = async () => {
      try {
        // Vérifie si businessSlug existe
        if (!businessSlug) {
          console.error("Missing business slug in URL");
          setBusinessFound(false);
          setIsLoading(false);
          return;
        }
        
        console.log("Looking for business with slug:", businessSlug);
        
        // Utilise la nouvelle fonction du contexte pour chercher l'entreprise
        const business = await findBusinessBySlug(businessSlug);
        
        if (!business) {
          console.error("Business not found for slug:", businessSlug);
          setBusinessFound(false);
          setBusinessId(null);
        } else {
          console.log("Business found:", business);
          setBusinessId(business.id);
          setBusinessFound(true);
        }
      } catch (error) {
        console.error("Error checking business:", error);
        setBusinessFound(false);
        setBusinessId(null);
      } finally {
        // Ajoute un petit délai pour simuler le chargement
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    
    checkBusiness();
  }, [businessSlug, findBusinessBySlug]);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!businessFound || !businessId) {
    return <BusinessNotFound />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Réservation en ligne</title>
      </Helmet>
      {businessId && <BookingContent businessId={businessId} />}
    </div>
  );
};

// Composant principal avec le fournisseur de contexte
const PublicBooking = () => {
  return (
    <ErrorBoundary>
      <BusinessProvider>
        <BookingPageProvider>
          <PublicBookingDataProvider>
            <BusinessFinder />
          </PublicBookingDataProvider>
        </BookingPageProvider>
      </BusinessProvider>
    </ErrorBoundary>
  );
};

export default PublicBooking;
