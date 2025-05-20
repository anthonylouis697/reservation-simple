
import { useNavigate } from "react-router-dom";
import { QuickAction } from "./QuickAction";
import { getQuickActions } from "./quickActionData";

export const QuickActions = () => {
  const navigate = useNavigate();
  const actions = getQuickActions(navigate);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {actions.map((action, i) => (
        <QuickAction key={i} {...action} />
      ))}
    </div>
  );
};
