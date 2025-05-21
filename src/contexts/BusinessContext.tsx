
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

interface BusinessContextType {
  businesses: Business[];
  isLoading: boolean;
  currentBusiness: Business | null;
  setCurrentBusiness: (business: Business | null) => void;
  refreshBusinesses: () => Promise<void>;
  createBusiness: (data: Omit<Business, 'id' | 'created_at' | 'updated_at'>) => Promise<Business | null>;
  updateBusiness: (id: string, data: Partial<Omit<Business, 'id' | 'created_at' | 'updated_at'>>) => Promise<Business | null>;
  deleteBusiness: (id: string) => Promise<boolean>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, businessId } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshBusinesses = async () => {
    if (!user) {
      setBusinesses([]);
      setCurrentBusiness(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Check if we have a businessId from auth context
      if (businessId) {
        // Try to fetch the specific business by ID
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', businessId);

        if (error) throw error;

        if (data && data.length > 0) {
          // We found the business, set it as current and add to businesses array
          setBusinesses(data);
          setCurrentBusiness(data[0]);
        } else {
          // No business found with this ID
          console.warn(`No business found with ID: ${businessId}`);
          setBusinesses([]);
          setCurrentBusiness(null);
        }
      } else if (user.id) {
        // If no businessId in auth context, fetch all businesses for this user
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', user.id);

        if (error) throw error;

        if (data && data.length > 0) {
          // We found businesses, set the first one as current
          setBusinesses(data);
          setCurrentBusiness(data[0]);
          console.log('Loaded businesses:', data.length, 'Current:', data[0].name);
        } else {
          // No businesses found for this user
          console.warn(`No businesses found for user: ${user.id}`);
          setBusinesses([]);
          setCurrentBusiness(null);
        }
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement de l\'entreprise:', error);
      toast.error('Impossible de charger votre entreprise');
      setBusinesses([]);
      setCurrentBusiness(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger l'entreprise au démarrage et quand l'utilisateur ou le businessId change
  useEffect(() => {
    console.log('Business context effect triggered - User:', user?.id, 'BusinessId:', businessId);
    refreshBusinesses();
  }, [user, businessId]);

  const createBusiness = async (
    businessData: Omit<Business, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Business | null> => {
    // In our simplified model, we don't allow creating multiple businesses
    toast.error('Dans cette version, chaque utilisateur ne peut avoir qu\'une seule entreprise.');
    return null;
  };

  const updateBusiness = async (
    id: string, 
    businessData: Partial<Omit<Business, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Business | null> => {
    if (!user) {
      toast.error('Vous devez être connecté pour mettre à jour une entreprise');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('businesses')
        .update(businessData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedBusiness = data as Business;
      
      // Mettre à jour l'entreprise dans le contexte
      setBusinesses(businesses.map(b => b.id === id ? updatedBusiness : b));
      if (currentBusiness?.id === id) {
        setCurrentBusiness(updatedBusiness);
      }

      toast.success('Entreprise mise à jour avec succès !');
      return updatedBusiness;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de l\'entreprise:', error);
      
      if (error.code === '23505') {
        toast.error('Cette URL personnalisée est déjà utilisée. Veuillez en choisir une autre.');
      } else {
        toast.error("Une erreur est survenue lors de la mise à jour de l'entreprise");
      }
      
      return null;
    }
  };

  const deleteBusiness = async (id: string): Promise<boolean> => {
    // In our simplified model, we don't allow deleting the only business
    toast.error('Dans cette version, vous ne pouvez pas supprimer votre entreprise.');
    return false;
  };

  const value = {
    businesses,
    isLoading,
    currentBusiness,
    setCurrentBusiness,
    refreshBusinesses,
    createBusiness,
    updateBusiness,
    deleteBusiness
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness doit être utilisé à l\'intérieur d\'un BusinessProvider');
  }
  return context;
};
