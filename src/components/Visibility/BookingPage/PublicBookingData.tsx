
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Service, Category } from '@/types/service';
import { getPublicServices, getPublicCategories } from '@/services/publicBookingService';
import { initialServices, initialCategories } from '@/mock/serviceData';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export interface PublicBookingDataContextType {
  services: Service[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

interface PublicBookingDataProviderProps {
  children: ReactNode;
}

// Create context with default values
const defaultContextValue: PublicBookingDataContextType = {
  services: [],
  categories: [],
  isLoading: false,
  error: null
};

const PublicBookingDataContext = createContext<PublicBookingDataContextType>(defaultContextValue);

// Custom hook to access public booking data
export const usePublicBookingData = (): PublicBookingDataContextType => {
  const context = useContext(PublicBookingDataContext);
  if (!context) {
    console.warn("usePublicBookingData must be used within a PublicBookingDataProvider");
    return defaultContextValue;
  }
  return context;
};

// Provider component for booking data context
export const PublicBookingDataProvider = ({ children }: PublicBookingDataProviderProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { businessSlug } = useParams<{ businessSlug?: string }>();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!businessSlug) {
          console.log("No business slug provided, using mock data");
          setServices(initialServices);
          setCategories(initialCategories);
          setIsLoading(false);
          return;
        }
        
        // Find business by slug
        console.log("Finding business with slug:", businessSlug);
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('id')
          .eq('slug', businessSlug)
          .maybeSingle();
          
        if (businessError) {
          console.error("Business lookup error:", businessError);
          setError("Could not find this business");
          setServices(initialServices);
          setCategories(initialCategories);
          setIsLoading(false);
          return;
        }

        if (!businessData) {
          console.log("No business found with slug:", businessSlug);
          setError("Business not found");
          // Use mock data if no business found
          setServices(initialServices);
          setCategories(initialCategories);
          setIsLoading(false);
          return;
        }
        
        const businessId = businessData.id;
        console.log("Business ID found:", businessId);
        
        // Get services and categories
        try {
          const [fetchedServices, fetchedCategories] = await Promise.all([
            getPublicServices(businessId),
            getPublicCategories(businessId)
          ]);
          
          console.log("Services fetched:", fetchedServices?.length || 0);
          console.log("Categories fetched:", fetchedCategories?.length || 0);
          
          // Use validated data if found, otherwise use mock data
          setServices(Array.isArray(fetchedServices) && fetchedServices.length > 0 
            ? fetchedServices 
            : initialServices);
            
          setCategories(Array.isArray(fetchedCategories) && fetchedCategories.length > 0 
            ? fetchedCategories 
            : initialCategories);
        } catch (fetchError) {
          console.error("Error fetching services/categories:", fetchError);
          // Fall back to mock data on error
          setServices(initialServices);
          setCategories(initialCategories);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
        
        // Use mock data on error
        setServices(initialServices);
        setCategories(initialCategories);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [businessSlug]);
  
  // Ensure values are always arrays
  const safeServices = Array.isArray(services) ? services : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  
  const contextValue: PublicBookingDataContextType = {
    services: safeServices,
    categories: safeCategories,
    isLoading,
    error
  };

  return (
    <PublicBookingDataContext.Provider value={contextValue}>
      {children}
    </PublicBookingDataContext.Provider>
  );
};
