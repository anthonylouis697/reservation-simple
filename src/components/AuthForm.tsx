
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface AuthFormProps {
  type: 'login' | 'signup';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call to authenticate or register the user
      
      if (type === 'login') {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace BookWise!",
        });
      } else {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès!",
        });
      }
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{type === 'login' ? 'Connexion' : 'Créer un compte'}</CardTitle>
        <CardDescription>
          {type === 'login' 
            ? 'Connectez-vous à votre compte BookWise' 
            : 'Créez un compte pour commencer à utiliser BookWise'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input 
                id="name"
                type="text" 
                placeholder="Votre nom complet" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
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
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              {type === 'login' && (
                <a href="#" className="text-xs text-indigo-600 hover:text-indigo-500">
                  Mot de passe oublié?
                </a>
              )}
            </div>
            <Input 
              id="password"
              type="password" 
              placeholder={type === 'login' ? 'Votre mot de passe' : 'Choisissez un mot de passe'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          {type === 'login' 
            ? 'Vous n\'avez pas de compte? ' 
            : 'Vous avez déjà un compte? '
          }
          <a 
            href={type === 'login' ? '/signup' : '/login'} 
            className="text-indigo-600 hover:text-indigo-500"
          >
            {type === 'login' ? 'S\'inscrire' : 'Se connecter'}
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
