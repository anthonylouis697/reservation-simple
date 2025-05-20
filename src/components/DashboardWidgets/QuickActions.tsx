
import { useNavigate } from 'react-router-dom';
import { QuickAction } from './QuickAction';
import { getQuickActions } from './quickActionData';
import { useBusiness } from '@/contexts/BusinessContext';
import { TooltipProvider } from '@/components/ui/tooltip';

export const QuickActions = () => {
  const navigate = useNavigate();
  const { currentBusiness } = useBusiness();
  const actions = getQuickActions(navigate, currentBusiness?.id);
  
  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {actions.map((action, index) => (
          <QuickAction 
            key={index}
            icon={action.icon} 
            label={action.label} 
            description={action.description} 
            onClick={action.onClick}
            color={action.color}
          />
        ))}
      </div>
    </TooltipProvider>
  );
};
