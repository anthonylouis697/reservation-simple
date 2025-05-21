
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BookingPageProvider } from '@/components/Visibility/BookingPage/BookingPageContext';
import { PublicBookingDataProvider } from '@/components/Visibility/BookingPage/PublicBookingData';
import { supabase } from '@/integrations/supabase/client';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import refactored components
import LoadingScreen from '@/components/PublicBooking/LoadingScreen';
import BusinessNotFound from '@/components/PublicBooking/BusinessNotFound';
import BookingContent from '@/components/PublicBooking/BookingContent';

const PublicBooking = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [businessFound, setBusinessFound] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  useEffect(() => {
    const checkBusiness = async () => {
      try {
        // Check if businessSlug exists
        if (!businessSlug) {
          console.error("Missing business slug in URL");
          setBusinessFound(false);
          setIsLoading(false);
          return;
        }
        
        console.log("Looking for business with slug:", businessSlug);
        
        // Query the database for the business with extended timeout
        const { data, error } = await supabase
          .from('businesses')
          .select('id, slug, name')
          .eq('slug', businessSlug)
          .maybeSingle();
          
        if (error) {
          console.error("Error finding business:", error);
          setBusinessFound(false);
        } else if (!data) {
          console.error("Business not found for slug:", businessSlug);
          setBusinessFound(false);
        } else {
          console.log("Business found:", data);
          setBusinessId(data.id);
          setBusinessFound(true);
        }
      } catch (error) {
        console.error("Error checking business:", error);
        setBusinessFound(false);
      } finally {
        // Add a small delay to simulate loading
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    
    checkBusiness();
  }, [businessSlug]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!businessFound || !businessId) {
    return <BusinessNotFound />;
  }

  return (
    <ErrorBoundary>
      <BookingPageProvider>
        <PublicBookingDataProvider>
          <div className="min-h-screen bg-gray-50">
            <Helmet>
              <title>Réservation en ligne</title>
            </Helmet>
            <BookingContent businessId={businessId} />
          </div>
        </PublicBookingDataProvider>
      </BookingPageProvider>
    </ErrorBoundary>
  );
};

export default PublicBooking;
