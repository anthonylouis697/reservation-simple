
import { Button } from '@/components/ui/button';

interface SignOutButtonProps {
  signOut: () => void;
}

export function SignOutButton({ signOut }: SignOutButtonProps) {
  return (
    <Button 
      variant="ghost"
      className="w-full justify-start text-left text-red-500 hover:text-red-600 hover:bg-red-50"
      onClick={() => signOut()}
    >
      Déconnexion
    </Button>
  );
}
