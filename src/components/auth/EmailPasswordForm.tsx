
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

interface EmailPasswordFormProps {
  type: 'login' | 'signup';
}

export const EmailPasswordForm = ({ type }: EmailPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as any)?.from || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (type === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, { first_name: firstName, last_name: lastName });
        // No need to navigate here - this will be handled by AuthContext
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // Error handling is already in signIn/signUp functions
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {type === 'signup' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input 
              id="firstName"
              type="text" 
              placeholder="Votre prénom" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input 
              id="lastName"
              type="text" 
              placeholder="Votre nom" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </>
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
            <Link to="/reset-password" className="text-xs text-primary hover:underline">
              Mot de passe oublié?
            </Link>
          )}
        </div>
        <Input 
          id="password"
          type="password" 
          placeholder={type === 'login' ? '••••••••' : 'Choisissez un mot de passe fort'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={6}
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
  );
};
