
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sophie Martin',
    role: 'Propriétaire de salon de coiffure',
    content: 'Reservatoo a transformé ma façon de gérer les rendez-vous. Mes clients adorent pouvoir réserver en ligne à tout moment et j\'ai réduit les absences de 30% grâce aux rappels automatiques.',
    rating: 5,
    source: 'Google',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 2,
    name: 'Marc Dubois',
    role: 'Thérapeute',
    content: 'Interface claire et intuitive qui m\'a permis de gagner un temps précieux. Le support client est également très réactif. Je recommande vivement!',
    rating: 5,
    source: 'Trustpilot',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 3,
    name: 'Julie Lefebvre',
    role: 'Coach sportif',
    content: 'Depuis que j\'utilise Reservatoo, j\'ai augmenté mon taux de remplissage de 25%. La synchronisation avec mon calendrier personnel est un vrai plus.',
    rating: 4,
    source: 'Google',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    id: 4,
    name: 'Thomas Bernard',
    role: 'Dentiste',
    content: 'Excellent logiciel qui nous a permis de moderniser notre cabinet et d\'offrir une meilleure expérience à nos patients. L\'équipe est très à l\'écoute des besoins.',
    rating: 5,
    source: 'Trustpilot',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg'
  },
  {
    id: 5,
    name: 'Emma Moreau',
    role: 'Esthéticienne',
    content: 'Reservatoo est un outil indispensable pour mon institut de beauté. Les clients apprécient la simplicité de prise de rendez-vous et je peux me concentrer sur mon métier.',
    rating: 5,
    source: 'Google',
    avatar: 'https://randomuser.me/api/portraits/women/26.jpg'
  },
];

const Testimonials = () => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div id="testimonials" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Témoignages</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Ce que nos clients disent de nous
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Découvrez les avis de professionnels qui utilisent Reservatoo au quotidien
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex flex-col bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                
                {renderStars(testimonial.rating)}
                
                <div className="mt-4 flex-grow">
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                </div>
                
                <div className="mt-4 flex items-center">
                  {testimonial.source === 'Trustpilot' ? (
                    <div className="text-sm flex items-center">
                      <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="#00b67a">
                        <path d="M12 0l2.47 7.59h7.98l-6.53 4.73 2.47 7.59-6.39-4.62-6.39 4.62 2.47-7.59-6.53-4.73h7.98z"></path>
                      </svg>
                      <span className="font-medium">Trustpilot</span>
                    </div>
                  ) : (
                    <div className="text-sm flex items-center">
                      <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24">
                        <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" fill="#4285f4"></path>
                      </svg>
                      <span className="font-medium">Google</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
