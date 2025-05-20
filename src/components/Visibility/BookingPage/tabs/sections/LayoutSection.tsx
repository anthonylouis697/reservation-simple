
import { Card, CardContent } from '@/components/ui/card';
import { LayoutSelector } from '../../components/LayoutSelector';

export function LayoutSection() {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <Card>
        <CardContent className="pt-6">
          <LayoutSelector />
        </CardContent>
      </Card>
    </div>
  );
}
