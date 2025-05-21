
export const LoadingState = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Chargement des réservations...</p>
      </div>
    </div>
  );
};
