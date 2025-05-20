
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import Screenshots from '@/components/Screenshots';
import Industries from '@/components/Industries';
import WhyChooseUs from '@/components/WhyChooseUs';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Scroll to section on hash change
  useEffect(() => {
    console.log("Index page loaded, hash:", location.hash);
    
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
