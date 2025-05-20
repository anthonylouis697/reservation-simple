
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
    setIsSubmitted(true);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-2 text-center">
        <CardTitle>Réinitialisation du mot de passe</CardTitle>
        <CardDescription>
          {isSubmitted 
            ? "Un email a été envoyé avec les instructions pour réinitialiser votre mot de passe."
            : "Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" className="w-full">Envoyer les instructions</Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Vérifiez votre boîte mail pour le lien de réinitialisation.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
              Retour à la connexion
            </Button>
          </div>
        )}
      </CardContent>
      {!isSubmitted && (
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate('/login')}>
            Retour à la connexion
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ResetPasswordForm;
