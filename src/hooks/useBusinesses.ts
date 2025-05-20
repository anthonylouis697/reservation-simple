
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Business {
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

interface BusinessInput {
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export const useBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Charger les entreprises de l'utilisateur
  useEffect(() => {
    if (!user) {
      setBusinesses([]);
      setIsLoading(false);
      return;
    }

    const loadBusinesses = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setBusinesses(data || []);
      } catch (err: any) {
        console.error('Erreur lors du chargement des entreprises:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinesses();
  }, [user]);

  // Créer une nouvelle entreprise
  const createBusiness = async (businessData: BusinessInput): Promise<Business | null> => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer une entreprise.');
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
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      // Mettre à jour la liste des entreprises
      setBusinesses(prev => [data, ...prev]);

      toast.success('Entreprise créée avec succès !');
      return data;
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'entreprise:', error);
      
      if (error.code === '23505') {
        toast.error('Cette URL personnalisée est déjà utilisée. Veuillez en choisir une autre.');
      } else {
        toast.error(error.message || 'Une erreur est survenue lors de la création de l\'entreprise.');
      }
      
      return null;
    }
  };

  // Mettre à jour une entreprise
  const updateBusiness = async (id: string, businessData: Partial<BusinessInput>): Promise<Business | null> => {
    if (!user) {
      toast.error('Vous devez être connecté pour mettre à jour une entreprise.');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('businesses')
        .update(businessData)
        .eq('id', id)
        .eq('owner_id', user.id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      // Mettre à jour la liste des entreprises
      setBusinesses(prev => prev.map(business => business.id === id ? data : business));

      toast.success('Entreprise mise à jour avec succès !');
      return data;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de l\'entreprise:', error);
      
      if (error.code === '23505') {
        toast.error('Cette URL personnalisée est déjà utilisée. Veuillez en choisir une autre.');
      } else {
        toast.error(error.message || 'Une erreur est survenue lors de la mise à jour de l\'entreprise.');
      }
      
      return null;
    }
  };

  // Supprimer une entreprise
  const deleteBusiness = async (id: string): Promise<boolean> => {
    if (!user) {
      toast.error('Vous devez être connecté pour supprimer une entreprise.');
      return false;
    }

    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id)
        .eq('owner_id', user.id);

      if (error) {
        throw error;
      }

      // Mettre à jour la liste des entreprises
      setBusinesses(prev => prev.filter(business => business.id !== id));

      toast.success('Entreprise supprimée avec succès !');
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'entreprise:', error);
      toast.error(error.message || 'Une erreur est survenue lors de la suppression de l\'entreprise.');
      return false;
    }
  };

  return {
    businesses,
    isLoading,
    error,
    createBusiness,
    updateBusiness,
    deleteBusiness
  };
};
