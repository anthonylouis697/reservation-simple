
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { BookingPageProvider } from '@/components/Visibility/BookingPage/BookingPageContext';
import { supabase } from '@/integrations/supabase/client';

// Import refactored components
import LoadingScreen from '@/components/PublicBooking/LoadingScreen';
import BusinessNotFound from '@/components/PublicBooking/BusinessNotFound';
import BookingContent from '@/components/PublicBooking/BookingContent';

const PublicBooking = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [businessFound, setBusinessFound] = useState(true);
  
  useEffect(() => {
    const checkBusiness = async () => {
      try {
        // Vérifier si l'entreprise existe
        if (businessSlug) {
          const { data, error } = await supabase
            .from('businesses')
            .select('id')
            .eq('slug', businessSlug)
            .single();
            
          if (error || !data) {
            console.error("Entreprise introuvable:", error);
            setBusinessFound(false);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'entreprise:", error);
        setBusinessFound(false);
      } finally {
        // Simuler un temps de chargement pour les données
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };
    
    checkBusiness();
  }, [businessSlug]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!businessFound) {
    return <BusinessNotFound />;
  }

  return (
    <BookingPageProvider>
      <div className="min-h-screen bg-gray-50">
        <Helmet>
          <title>Réservation en ligne</title>
        </Helmet>
        <BookingContent />
      </div>
    </BookingPageProvider>
  );
};

export default PublicBooking;
