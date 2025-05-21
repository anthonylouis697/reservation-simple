
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
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
  children: ReactNode;
}

// Créer le contexte
const PublicBookingDataContext = createContext<PublicBookingDataContextType | undefined>(undefined);

// Hook personnalisé pour accéder aux données de réservation publique
export const usePublicBookingData = () => {
  const context = useContext(PublicBookingDataContext);
  if (!context) {
    throw new Error("usePublicBookingData doit être utilisé à l'intérieur d'un PublicBookingDataProvider");
  }
  return context;
};

// Composant Provider pour le contexte de données de réservation
export const PublicBookingDataProvider = ({ children }: PublicBookingDataProviderProps) => {
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
          .maybeSingle();
          
        if (businessError) {
          console.error("Erreur de recherche d'entreprise:", businessError);
          throw new Error("Impossible de trouver cette entreprise");
        }

        if (!businessData) {
          console.error("Aucune entreprise trouvée avec ce slug:", businessSlug);
          // Utiliser les données fictives si aucune entreprise n'est trouvée
          setServices(initialServices);
          setCategories(initialCategories);
          return;
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
  
  const contextValue: PublicBookingDataContextType = {
    services,
    categories,
    isLoading,
    error
  };

  return (
    <PublicBookingDataContext.Provider value={contextValue}>
      {children}
    </PublicBookingDataContext.Provider>
  );
};
