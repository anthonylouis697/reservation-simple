
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import Screenshots from '@/components/Screenshots';
import Industries from '@/components/Industries';
import WhyChooseUs from '@/components/WhyChooseUs';

const Index = () => {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  // Log pour le débogage
  useEffect(() => {
    console.log("Index page rendered, auth state:", { user: !!user, isLoading });
  }, [user, isLoading]);

  // Scroll vers la section demandée si le hash est présent
  useEffect(() => {
    console.log("Index page hash check:", location.hash);
    
    if (location.hash) {
      // Petit délai pour assurer que le composant est monté
      setTimeout(() => {
        const sectionId = location.hash.substring(1);
        console.log("Trying to scroll to section:", sectionId);
        
        const element = document.getElementById(sectionId);
        if (element) {
          console.log("Element found, scrolling to:", sectionId);
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.log("Element not found:", sectionId);
        }
      }, 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showDashboardLink={!!user} />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Industries />
        <Screenshots />
        <WhyChooseUs />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
