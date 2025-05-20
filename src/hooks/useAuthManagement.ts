import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createDefaultBusiness } from '@/utils/auth/businessUtils';

export const useAuthManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  /**
   * Signs up a new user
   */
  const signUp = async (email: string, password: string, options?: { first_name?: string; last_name?: string }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: options?.first_name || '',
            last_name: options?.last_name || ''
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        // Si l'erreur est liée à une limite de taux d'emails, on affiche un message spécifique
        if (error.message?.includes('email rate limit exceeded')) {
          toast.error('Trop de tentatives d\'inscription. Veuillez réessayer plus tard ou utiliser un autre email.');
          throw new Error('Trop de tentatives. Réessayez plus tard ou utilisez un autre email.');
        }
        throw error;
      }

      // Si pas de session, cela signifie que l'utilisateur doit vérifier son email
      if (!data.session) {
        toast.success('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
        navigate('/login');
      } else {
        // L'utilisateur est créé et connecté immédiatement
        toast.success('Inscription réussie !');
        
        // Créer une entreprise par défaut si nécessaire
        if (data.user) {
          await createDefaultBusiness(data.user.id, options?.first_name, options?.last_name);
        }
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      // Gérer les erreurs spécifiques
      if (error.message?.includes('User already registered')) {
        toast.error('Cet email est déjà utilisé. Veuillez vous connecter.');
      } else if (error.message?.includes('email rate limit exceeded')) {
        toast.error('Trop de tentatives d\'inscription. Veuillez réessayer plus tard ou utiliser un autre email.');
      } else {
        toast.error(error.message || 'Une erreur est survenue lors de l\'inscription.');
      }
      console.error('Sign up error:', error);
      throw error; // Propagation de l'erreur pour gestion dans le composant
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signs in an existing user
   */
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast.success('Connexion réussie !');
      // Redirection gérée par l'écouteur d'état d'authentification
    } catch (error: any) {
      // Gérer les messages d'erreur spécifiques
      if (error.message?.includes('Email not confirmed')) {
        toast.error('Veuillez confirmer votre email avant de vous connecter.');
      } else if (error.message?.includes('Invalid login credentials')) {
        toast.error('Email ou mot de passe incorrect.');
      } else {
        toast.error(error.message || 'Une erreur est survenue lors de la connexion.');
      }
      console.error('Sign in error:', error);
      throw error; // Propagation de l'erreur pour gestion dans le composant
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signs out the current user
   */
  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      toast.success('Déconnexion réussie.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue lors de la déconnexion.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resets the password for a user
   */
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        throw error;
      }
      
      toast.success('Instructions envoyées par email.');
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue.');
    }
  };

  return {
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword
  };
};
