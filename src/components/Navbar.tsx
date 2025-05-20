
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogIn } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';

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

  // Features submenu items
  const featuresItems = [
    {
      title: "Calendrier intelligent",
      description: "Interface intuitive avec synchronisation multi-plateforme",
      href: "/#features",
      icon: "⏰"
    },
    {
      title: "Réservations 24/7",
      description: "Disponibilité permanente pour vos clients",
      href: "/#features",
      icon: "🔄"
    },
    {
      title: "Gestion des clients",
      description: "Base de données complète pour suivre vos relations",
      href: "/#features",
      icon: "👥"
    },
    {
      title: "Paiements en ligne",
      description: "Intégration simple avec les plateformes de paiement",
      href: "/#features",
      icon: "💳"
    }
  ];

  // Industries submenu items
  const industriesItems = [
    {
      title: "Beauté & Bien-être",
      description: "Pour salons, spas et thérapeutes",
      href: "/#industries",
      icon: "✨"
    },
    {
      title: "Santé",
      description: "Pour cliniques, médecins et professionnels de santé",
      href: "/#industries",
      icon: "🏥"
    },
    {
      title: "Services professionnels",
      description: "Pour consultants, coachs et experts",
      href: "/#industries",
      icon: "💼"
    },
    {
      title: "Éducation & Formation",
      description: "Pour formateurs, écoles et centres de formation",
      href: "/#industries",
      icon: "🎓"
    }
  ];
  
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
            
            <div className="hidden lg:ml-10 lg:flex lg:items-center lg:space-x-2">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">Fonctionnalités</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
                        {featuresItems.map((item) => (
                          <li key={item.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <div className="text-xl mb-1">{item.icon}</div>
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">Industries</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
                        {industriesItems.map((item) => (
                          <li key={item.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <div className="text-xl mb-1">{item.icon}</div>
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/#pricing" className={navigationMenuTriggerStyle()}>
                      Tarifs
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/#testimonials" className={navigationMenuTriggerStyle()}>
                      Témoignages
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/#contact" className={navigationMenuTriggerStyle()}>
                      Contact
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          
          <div className="hidden lg:ml-6 lg:flex lg:items-center lg:space-x-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Mon espace
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => signOut()}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50">
                    Connexion
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all">
                    Essayer gratuitement
                  </Button>
                </Link>
              </>
            )}
          </div>
          
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg absolute w-full">
          <div className="pt-2 pb-3 space-y-1 max-h-[70vh] overflow-y-auto">
            <div className="px-4 py-2">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Fonctionnalités
              </div>
              {featuresItems.map((item) => (
                <Link 
                  key={item.title}
                  to={item.href} 
                  className="flex items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.title}
                </Link>
              ))}
            </div>
            
            <div className="px-4 py-2">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Industries
              </div>
              {industriesItems.map((item) => (
                <Link 
                  key={item.title}
                  to={item.href} 
                  className="flex items-center pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.title}
                </Link>
              ))}
            </div>
            
            <Link 
              to="/#pricing" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Tarifs
            </Link>
            
            <Link 
              to="/#testimonials" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Témoignages
            </Link>
            
            <Link 
              to="/#contact" 
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200 flex flex-col space-y-2 px-4">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Mon espace
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut();
                  }}
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Connexion</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Essayer gratuitement</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
