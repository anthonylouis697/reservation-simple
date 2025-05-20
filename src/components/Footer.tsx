
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300" id="contact">
      <div className="max-w-7xl mx-auto pt-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12">
          {/* Brand and description */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-white text-2xl font-bold">Reservatoo</Link>
            <p className="mt-4 text-gray-400">
              Simplifiez la gestion de vos rendez-vous. Optimisez votre temps. Développez votre activité avec la plateforme de réservation la plus intuitive du marché.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Produit</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/#features" className="text-gray-400 hover:text-white transition-colors">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link to="/#industries" className="text-gray-400 hover:text-white transition-colors">
                  Secteurs d'activité
                </Link>
              </li>
              <li>
                <Link to="/#testimonials" className="text-gray-400 hover:text-white transition-colors">
                  Témoignages
                </Link>
              </li>
              <li>
                <Link to="/#pricing" className="text-gray-400 hover:text-white transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-400 hover:text-white transition-colors">
                  Essai gratuit
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company info */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Entreprise</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-white transition-colors">
                  Carrières
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-400 hover:text-white transition-colors">
                  Partenaires
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-gray-400 hover:text-white transition-colors">
                  Presse
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Légal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Politique de cookies
                </Link>
              </li>
              <li>
                <Link to="/gdpr" className="text-gray-400 hover:text-white transition-colors">
                  Conformité RGPD
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-gray-400 hover:text-white transition-colors">
                  Sécurité
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact section */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" />
                <span>contact@reservatoo.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-indigo-400 mr-2 mt-0.5" />
                <span>12 Rue de l'Innovation, 75001 Paris, France</span>
              </li>
            </ul>
            <div className="mt-6">
              <Button variant="outline" className="border-indigo-500 text-indigo-400 hover:bg-indigo-900 hover:text-indigo-300">
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="py-8 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Recevez nos actualités</h3>
              <p className="text-gray-400">
                Inscrivez-vous à notre newsletter pour recevoir nos dernières nouvelles et mises à jour.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                className="flex-grow px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-400">
            &copy; {currentYear} Reservatoo. Tous droits réservés.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/changelog" className="text-gray-400 hover:text-white transition-colors text-sm">
              Changelog
            </Link>
            <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors text-sm">
              Plan du site
            </Link>
            <Link to="/resources" className="text-gray-400 hover:text-white transition-colors text-sm">
              Ressources
            </Link>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              France 🇫🇷
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
