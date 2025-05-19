
import { MainNavigation } from "@/components/MainNavigation";

export function MobileFooter() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 shadow-lg">
      <div className="px-2 py-1">
        <MainNavigation mobile />
      </div>
    </div>
  );
}
