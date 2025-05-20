
import { Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const VisibilityBoostPromo = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-primary/30 bg-gradient-to-b from-white to-primary/5">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
          <CardTitle>Boost de Visibilité</CardTitle>
        </div>
        <CardDescription>
          Augmentez vos revenus en vous connectant aux plateformes partenaires
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-600 font-semibold">+35%</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Augmentez vos réservations</p>
              <p className="text-xs text-muted-foreground">Les utilisateurs rapportent en moyenne 35% de clients en plus</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          onClick={() => navigate('/visibility-boost')}
        >
          Découvrir <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
