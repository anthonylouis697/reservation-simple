
import { MainNavigation } from "@/components/MainNavigation";

export function MobileFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white py-2 lg:hidden">
      <MainNavigation mobile={true} />
    </div>
  );
}

export default MobileFooter;
