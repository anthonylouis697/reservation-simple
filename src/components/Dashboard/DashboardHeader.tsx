
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  actionRoute?: string;
}

export const DashboardHeader = ({ 
  title, 
  subtitle, 
  actionLabel = "+ Nouveau rendez-vous", 
  actionRoute = "/calendar" 
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500">{subtitle}</p>
      </div>
      {actionLabel && actionRoute && (
        <Button className="mt-4 md:mt-0" onClick={() => navigate(actionRoute)}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
