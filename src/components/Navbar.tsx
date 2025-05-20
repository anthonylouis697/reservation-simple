
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import DesktopNavigation from '@/components/navigation/DesktopNavigation';
import MobileNavigation from '@/components/navigation/MobileNavigation';
import AuthButtons from '@/components/navigation/AuthButtons';

interface NavbarProps {
  showDashboardLink?: boolean;
}

const Navbar = ({ showDashboardLink = false }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-md py-2" 
          : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className={cn(
                "font-bold text-xl transition-colors duration-300",
                isScrolled ? "text-indigo-600" : "text-indigo-500"
              )}>Reservatoo</span>
            </Link>
            
            <DesktopNavigation onMenuItemClick={() => setIsMenuOpen(false)} />
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden lg:block">
            <AuthButtons user={user} signOut={signOut} />
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        user={user} 
        signOut={signOut} 
      />
    </nav>
  );
};

export default Navbar;
