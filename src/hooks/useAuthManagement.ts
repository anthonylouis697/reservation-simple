
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
        throw error;
      }

      if (!data.session) {
        toast.success('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
        navigate('/login');
      } else {
        // User was created and immediately signed in
        toast.success('Inscription réussie !');
        
        // Create default business if needed
        if (data.user) {
          await createDefaultBusiness(data.user.id, options?.first_name, options?.last_name);
        }
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      // Handle specific errors
      if (error.message?.includes('User already registered')) {
        toast.error('Cet email est déjà utilisé. Veuillez vous connecter.');
      } else {
        toast.error(error.message || 'Une erreur est survenue lors de l\'inscription.');
      }
      console.error('Sign up error:', error);
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
      // Redirection handled by the auth state listener
    } catch (error: any) {
      // Handle specific error messages
      if (error.message?.includes('Email not confirmed')) {
        toast.error('Veuillez confirmer votre email avant de vous connecter.');
      } else if (error.message?.includes('Invalid login credentials')) {
        toast.error('Email ou mot de passe incorrect.');
      } else {
        toast.error(error.message || 'Une erreur est survenue lors de la connexion.');
      }
      console.error('Sign in error:', error);
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
