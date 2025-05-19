
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Star } from 'lucide-react';

interface PremiumPlatformCardProps {
  name: string;
  description: string;
  features: string[];
  icon?: React.ReactNode;
  commission: string;
  monthlyFee?: string;
  onConnect: () => void;
  popular?: boolean;
}

const PremiumPlatformCard = ({
  name,
  description,
  features,
  icon,
  commission,
  monthlyFee,
  onConnect,
  popular = false
}: PremiumPlatformCardProps) => {
  return (
    <Card className={`overflow-hidden ${popular ? 'border-primary border-2' : ''}`}>
      {popular && (
        <div className="bg-primary text-primary-foreground text-xs font-medium text-center py-1.5">
          RECOMMANDÉ
        </div>
      )}
      
      <CardHeader className={popular ? 'bg-primary/5' : ''}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            {icon && <div className="mr-2">{icon}</div>}
            {name}
          </CardTitle>
          {popular && <Star className="h-5 w-5 text-amber-400 fill-amber-400" />}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Commission</div>
            <div className="text-xl font-bold">{commission}</div>
          </div>
          {monthlyFee && (
            <div className="ml-6">
              <div className="text-sm text-muted-foreground">Frais mensuels</div>
              <div className="text-xl font-bold">{monthlyFee}</div>
            </div>
          )}
        </div>
        
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="text-sm flex">
              <span className="text-primary mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onConnect}
          variant={popular ? "default" : "outline"}
        >
          Se connecter
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PremiumPlatformCard;
