
import { Apple, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SocialLoginButtonsProps {
  isLoading: boolean;
}

export const SocialLoginButtons = ({ isLoading }: SocialLoginButtonsProps) => {
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);

  const handleSocialAuth = async (provider: 'google' | 'apple' | 'facebook') => {
    setIsSocialLoading(provider);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            prompt: 'select_account' // Pour Google: forcer l'affichage du sélecteur de compte
          }
        }
      });

      if (error) {
        // Check specifically for the "provider not enabled" error
        if (error.message.includes('provider is not enabled')) {
          toast.error(`Le fournisseur ${provider} n'est pas activé. Veuillez utiliser une autre méthode de connexion ou contacter l'administrateur.`);
        } else {
          toast.error(`Échec de la connexion avec ${provider}: ${error.message}`);
        }
        console.error(`Authentication error with ${provider}:`, error);
        setIsSocialLoading(null);
        return;
      }

      // Success is handled by the redirect
    } catch (error: any) {
      toast.error(`Échec de la connexion avec ${provider}: ${error.message}`);
      console.error(`Unexpected error with ${provider}:`, error);
      setIsSocialLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center justify-center gap-2"
        onClick={() => handleSocialAuth('google')}
        disabled={isLoading || isSocialLoading !== null}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {isSocialLoading === 'google' ? 'Chargement...' : 'Continuer avec Google'}
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center justify-center gap-2"
        onClick={() => handleSocialAuth('apple')}
        disabled={isLoading || isSocialLoading !== null}
      >
        <Apple className="h-5 w-5" />
        {isSocialLoading === 'apple' ? 'Chargement...' : 'Continuer avec Apple'}
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        className="flex items-center justify-center gap-2"
        onClick={() => handleSocialAuth('facebook')}
        disabled={isLoading || isSocialLoading !== null}
      >
        <Facebook className="h-5 w-5" fill="currentColor" />
        {isSocialLoading === 'facebook' ? 'Chargement...' : 'Continuer avec Facebook'}
      </Button>
    </div>
  );
};
