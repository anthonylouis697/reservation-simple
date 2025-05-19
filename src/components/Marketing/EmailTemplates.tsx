
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export const EmailTemplates = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center p-12 border rounded-md bg-muted/20">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-2xl font-medium">Templates d'Emails</h3>
          <p className="text-muted-foreground mt-2">
            Cette fonctionnalité est en cours de développement.
          </p>
        </div>
      </div>
    </div>
  );
};
