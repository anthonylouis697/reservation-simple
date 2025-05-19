
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Book, 
  Search, 
  Calendar,
  Settings,
  Users,
  Star,
  Info 
} from 'lucide-react';

const helpCategories = [
  {
    title: "Démarrage",
    description: "Premiers pas avec BookWise",
    icon: Info,
    articles: ["Guide de démarrage rapide", "Configuration du compte", "Premiers rendez-vous"]
  },
  {
    title: "Calendrier",
    description: "Gestion des rendez-vous et disponibilités",
    icon: Calendar,
    articles: ["Configurer vos disponibilités", "Créer et modifier des rendez-vous", "Gérer les annulations"]
  },
  {
    title: "Clients",
    description: "Gestion de votre base de clients",
    icon: Users,
    articles: ["Ajouter de nouveaux clients", "Exporter vos données clients", "Communication avec les clients"]
  },
  {
    title: "Paramètres",
    description: "Personnaliser votre compte",
    icon: Settings,
    articles: ["Options de profil", "Configuration des services", "Options de paiement"]
  },
  {
    title: "Boost de Visibilité",
    description: "Augmenter vos réservations",
    icon: Star,
    articles: ["Comment ça fonctionne", "Plateformes disponibles", "Optimiser vos annonces"]
  },
];

const popularArticles = [
  "Comment configurer mon calendrier de disponibilité ?",
  "Comment personnaliser ma page de réservation ?",
  "Comment connecter mon compte à d'autres plateformes ?",
  "Comment gérer les annulations et remboursements ?",
  "Comment ajouter plusieurs services à mon profil ?"
];

const HelpCenter = () => {
  return (
    <AppLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Centre d'aide</h1>
          <p className="text-muted-foreground">
            Trouvez des réponses à vos questions ou contactez notre équipe de support.
          </p>
        </div>
        
        <div className="max-w-2xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            className="pl-10 py-6 text-lg" 
            placeholder="Rechercher dans l'aide..." 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {helpCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{category.title}</CardTitle>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.articles.map((article, idx) => (
                    <li key={idx} className="text-sm">
                      <Button variant="link" className="p-0 h-auto text-left justify-start text-primary">
                        {article}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Articles populaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularArticles.map((article, index) => (
              <div key={index} className="flex space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <Book className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{article}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 bg-muted/30 rounded-lg p-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold">Besoin d'aide supplémentaire ?</h2>
          <p className="mt-2 mb-6 text-muted-foreground">
            Notre équipe de support est disponible pour répondre à vos questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="flex-1">
              Contacter le support
            </Button>
            <Button variant="outline" className="flex-1">
              Consulter notre documentation
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HelpCenter;
