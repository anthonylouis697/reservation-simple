
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
  const { user } = useAuth();
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
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const businessList = data as Business[];
      setBusinesses(businessList);
      
      // Si on n'a pas encore de business courante, on prend la première
      if (!currentBusiness && businessList.length > 0) {
        setCurrentBusiness(businessList[0]);
      }
      // Si la business courante n'est plus dans la liste, on remet à null
      else if (currentBusiness && !businessList.some(b => b.id === currentBusiness.id)) {
        setCurrentBusiness(businessList.length > 0 ? businessList[0] : null);
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des entreprises:', error);
      toast.error('Impossible de charger vos entreprises');
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les entreprises au démarrage et quand l'utilisateur change
  useEffect(() => {
    refreshBusinesses();
  }, [user]);

  const createBusiness = async (
    businessData: Omit<Business, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Business | null> => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer une entreprise');
      return null;
    }

    try {
      const newBusiness = {
        ...businessData,
        owner_id: user.id,
      };

      const { data, error } = await supabase
        .from('businesses')
        .insert(newBusiness)
        .select()
        .single();

      if (error) throw error;

      const createdBusiness = data as Business;
      
      // Mettre à jour la liste des entreprises
      await refreshBusinesses();
      
      // Définir la nouvelle entreprise comme courante
      setCurrentBusiness(createdBusiness);

      toast.success('Entreprise créée avec succès !');
      return createdBusiness;
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'entreprise:', error);
      
      if (error.code === '23505') {
        toast.error('Cette URL personnalisée est déjà utilisée. Veuillez en choisir une autre.');
      } else {
        toast.error("Une erreur est survenue lors de la création de l'entreprise");
      }
      
      return null;
    }
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
      
      // Mettre à jour la liste des entreprises
      await refreshBusinesses();
      
      // Mettre à jour l'entreprise courante si c'est celle qui est modifiée
      if (currentBusiness && currentBusiness.id === id) {
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
    if (!user) {
      toast.error('Vous devez être connecté pour supprimer une entreprise');
      return false;
    }

    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Mettre à jour la liste des entreprises
      await refreshBusinesses();
      
      toast.success('Entreprise supprimée avec succès !');
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'entreprise:', error);
      toast.error("Une erreur est survenue lors de la suppression de l'entreprise");
      return false;
    }
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
