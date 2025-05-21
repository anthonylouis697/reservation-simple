
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
      // In our simplified model, we only fetch the single business for this user
      if (businessId) {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', businessId)
          .single();

        if (error) throw error;

        if (data) {
          setBusinesses([data]);
          setCurrentBusiness(data);
        } else {
          setBusinesses([]);
          setCurrentBusiness(null);
        }
      } else {
        setBusinesses([]);
        setCurrentBusiness(null);
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement de l\'entreprise:', error);
      toast.error('Impossible de charger votre entreprise');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger l'entreprise au démarrage et quand l'utilisateur ou le businessId change
  useEffect(() => {
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
      setBusinesses([updatedBusiness]);
      setCurrentBusiness(updatedBusiness);

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
