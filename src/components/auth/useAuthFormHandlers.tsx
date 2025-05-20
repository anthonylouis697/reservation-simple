
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAuthFormHandlers = (type: 'login' | 'signup') => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simuler l'appel API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (type === 'signup') {
        // Pour les nouveaux comptes, réinitialiser le statut d'onboarding
        localStorage.removeItem('hasCompletedOnboarding');
        localStorage.removeItem('hasSetupAccount');
        
        toast.success("Inscription réussie ! Bienvenue sur BookWise.");
        // Rediriger vers la page de bienvenue pour les nouveaux comptes
        navigate('/welcome');
      } else {
        toast.success("Connexion réussie !");
        // Rediriger les utilisateurs existants vers le tableau de bord
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: string) => {
    setIsLoading(true);
    try {
      // Simuler l'appel API d'authentification sociale
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (type === 'signup') {
        // Pour les nouveaux comptes, réinitialiser le statut d'onboarding
        localStorage.removeItem('hasCompletedOnboarding');
        localStorage.removeItem('hasSetupAccount');
        
        toast.success(`Inscription avec ${provider} réussie !`);
        navigate('/welcome');
      } else {
        toast.success(`Connexion avec ${provider} réussie !`);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(`Échec de la connexion avec ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit,
    handleSocialAuth
  };
};
