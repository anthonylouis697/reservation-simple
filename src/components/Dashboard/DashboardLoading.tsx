
import { AppLayout } from '@/components/AppLayout';

export const DashboardLoading = () => {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500">Chargement de votre tableau de bord...</p>
      </div>
    </AppLayout>
  );
};
