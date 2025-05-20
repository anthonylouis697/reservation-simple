
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";

// Setup steps data
const setupSteps = [
  { title: "Profil complété", completed: true },
  { title: "Services configurés", completed: true },
  { title: "Disponibilités définies", completed: true },
  { title: "Page de réservation personnalisée", completed: false },
  { title: "Intégration de paiement", completed: false },
];

export const SetupGuide = () => {
  const navigate = useNavigate();
  const profileCompletion = 65; // hardcoded for now, could be passed as prop
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guide de mise en route</CardTitle>
        <CardDescription>Complétez ces étapes pour configurer votre compte</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {setupSteps.map((step, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {step.completed ? '✓' : (index + 1)}
                </div>
                <span className={`ml-3 ${step.completed ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                  {step.title}
                </span>
              </div>
              {!step.completed && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/settings')}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Configurer
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30">
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Profil complété à {profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="h-2" />
        </div>
      </CardFooter>
    </Card>
  );
};
