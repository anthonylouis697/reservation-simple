
import { Eye } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function PreviewHeader() {
  return (
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <Eye className="h-4 w-4 text-primary" />
        Aperçu
      </CardTitle>
      <CardDescription>
        Visualisez votre page de réservation
      </CardDescription>
    </CardHeader>
  );
}
