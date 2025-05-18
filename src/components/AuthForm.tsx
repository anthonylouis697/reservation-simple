
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Apple, Facebook, CalendarDays } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'signup';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simuler l'appel API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success(
        type === 'login'
          ? 'Connexion réussie !'
          : 'Inscription réussie !'
      );
      
      navigate('/dashboard');
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      // Simuler l'appel API Google
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Connexion avec Google réussie !');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Échec de la connexion avec Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setIsLoading(true);
    try {
      // Simuler l'appel API Apple
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Connexion avec Apple réussie !');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Échec de la connexion avec Apple');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setIsLoading(true);
    try {
      // Simuler l'appel API Facebook
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Connexion avec Facebook réussie !');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Échec de la connexion avec Facebook');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center">
          <CalendarDays className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl">
          {type === 'login' ? 'Connexion à BookWise' : 'Créer un compte BookWise'}
        </CardTitle>
        <CardDescription>
          {type === 'login' 
            ? 'Connectez-vous à votre compte pour gérer vos rendez-vous' 
            : 'Créez un compte pour commencer à utiliser BookWise'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={handleGoogleAuth}
              disabled={isLoading}
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
              Continuer avec Google
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={handleAppleAuth}
              disabled={isLoading}
            >
              <Apple className="h-5 w-5" />
              Continuer avec Apple
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={handleFacebookAuth}
              disabled={isLoading}
            >
              <Facebook className="h-5 w-5" fill="currentColor" />
              Continuer avec Facebook
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                ou avec un email
              </span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name"
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="votre@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                {type === 'login' && (
                  <a href="#" className="text-xs text-primary hover:underline">
                    Mot de passe oublié?
                  </a>
                )}
              </div>
              <Input 
                id="password"
                type="password" 
                placeholder={type === 'login' ? '••••••••' : 'Choisissez un mot de passe'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? 'Chargement...' 
                : type === 'login' 
                  ? 'Se connecter' 
                  : 'Créer un compte'
              }
            </Button>
          </form>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          {type === 'login' 
            ? 'Vous n\'avez pas de compte? ' 
            : 'Vous avez déjà un compte? '
          }
          <a 
            href={type === 'login' ? '/signup' : '/login'} 
            className="text-primary hover:underline"
          >
            {type === 'login' ? 'S\'inscrire' : 'Se connecter'}
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
