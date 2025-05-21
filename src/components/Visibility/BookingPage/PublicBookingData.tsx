
import { useState, useEffect } from 'react';
import { Service, Category } from '@/types/service';
import { getPublicServices, getPublicCategories } from '@/services/publicBookingService';
import { initialServices, initialCategories } from '@/mock/serviceData';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PublicBookingDataContextType {
  services: Service[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

interface PublicBookingDataProviderProps {
  children: React.ReactNode;
}

// Hook personnalisé pour accéder aux données de réservation publique
export const usePublicBookingData = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessSlug } = useParams<{ businessSlug: string }>();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        if (!businessSlug) {
          throw new Error("Identifiant d'entreprise manquant");
        }
        
        // Trouver l'entreprise par son slug
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('id')
          .eq('slug', businessSlug)
          .single();
          
        if (businessError || !businessData) {
          console.error("Erreur de recherche d'entreprise:", businessError);
          throw new Error("Impossible de trouver cette entreprise");
        }
        
        const businessId = businessData.id;
        console.log("ID d'entreprise trouvé:", businessId);
        
        // Récupérer les services et catégories
        const [fetchedServices, fetchedCategories] = await Promise.all([
          getPublicServices(businessId),
          getPublicCategories(businessId)
        ]);
        
        console.log("Services récupérés:", fetchedServices.length);
        console.log("Catégories récupérées:", fetchedCategories.length);
        
        // Si aucun service trouvé, utiliser les données fictives
        if (fetchedServices.length === 0) {
          console.log("Aucun service trouvé, utilisation des données fictives");
          setServices(initialServices);
        } else {
          setServices(fetchedServices);
        }
        
        // Si aucune catégorie trouvée, utiliser les données fictives
        if (fetchedCategories.length === 0) {
          console.log("Aucune catégorie trouvée, utilisation des données fictives");
          setCategories(initialCategories);
        } else {
          setCategories(fetchedCategories);
        }
        
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError(error instanceof Error ? error.message : "Une erreur est survenue");
        
        // En cas d'erreur, on utilise les données fictives
        setServices(initialServices);
        setCategories(initialCategories);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [businessSlug]);
  
  return { services, categories, isLoading, error };
};

// Composant Provider pour le contexte de données de réservation
export const PublicBookingDataProvider = ({ children }: PublicBookingDataProviderProps) => {
  const data = usePublicBookingData();
  
  return (
    <div className="booking-data-context">
      {children}
    </div>
  );
};
