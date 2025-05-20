
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailPasswordFormProps {
  type: 'login' | 'signup';
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const EmailPasswordForm = ({ type, isLoading, onSubmit }: EmailPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(e);
    }} className="space-y-4">
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
  );
};
