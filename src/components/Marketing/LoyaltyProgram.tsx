
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Award,
  Calendar,
  Check,
  ChevronRight,
  CreditCard,
  Edit,
  Gift,
  HelpCircle,
  Info,
  MoreHorizontal,
  Percent,
  Plus,
  Search,
  Settings,
  Star,
  Tag,
  User,
  Users
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface LoyaltySettings {
  enabled: boolean;
  programName: string;
  pointsPerEuro: number;
  pointsPerVisit: number;
  expiryDays: number;
  welcomePoints: number;
  birthdayPoints: number;
  referralPoints: number;
}

interface LoyaltyTier {
  id: string;
  name: string;
  threshold: number; // Points needed
  color: string;
  benefits: string[];
  members: number;
}

interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'service' | 'product' | 'gift' | 'other';
  value: string;
  usedCount: number;
  isActive: boolean;
}

interface TopMember {
  id: string;
  name: string;
  points: number;
  tier: string;
  spent: number;
  visits: number;
  joinedAt: Date;
}

export const LoyaltyProgram = () => {
  // Loyalty program main settings
  const [settings, setSettings] = useState<LoyaltySettings>({
    enabled: true,
    programName: "BookWise Fidélité",
    pointsPerEuro: 10,
    pointsPerVisit: 50,
    expiryDays: 365,
    welcomePoints: 200,
    birthdayPoints: 500,
    referralPoints: 300
  });
  
  // Tabs and dialogs
  const [activeTab, setActiveTab] = useState("overview");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAddTier, setShowAddTier] = useState(false);
  const [showAddReward, setShowAddReward] = useState(false);
  const [showMemberDetails, setShowMemberDetails] = useState<string | null>(null);
  
  // Search queries
  const [membersSearchQuery, setMembersSearchQuery] = useState('');
  const [rewardsSearchQuery, setRewardsSearchQuery] = useState('');
  
  // Loyalty tiers
  const [tiers, setTiers] = useState<LoyaltyTier[]>([
    {
      id: '1',
      name: 'Bronze',
      threshold: 0,
      color: 'bg-amber-700',
      benefits: [
        '1 point par euro dépensé',
        'Promotions exclusives'
      ],
      members: 450
    },
    {
      id: '2',
      name: 'Argent',
      threshold: 1000,
      color: 'bg-gray-400',
      benefits: [
        '1.2 points par euro dépensé',
        'Promotions exclusives',
        'Accès prioritaire aux nouveaux services'
      ],
      members: 280
    },
    {
      id: '3',
      name: 'Or',
      threshold: 3000,
      color: 'bg-amber-400',
      benefits: [
        '1.5 points par euro dépensé',
        'Promotions exclusives',
        'Accès prioritaire aux nouveaux services',
        'Cadeau d\'anniversaire'
      ],
      members: 165
    },
    {
      id: '4',
      name: 'Platine',
      threshold: 8000,
      color: 'bg-indigo-400',
      benefits: [
        '2 points par euro dépensé',
        'Promotions exclusives',
        'Accès prioritaire aux nouveaux services',
        'Cadeau d\'anniversaire',
        'Service client dédié'
      ],
      members: 45
    }
  ]);
  
  const [selectedTier, setSelectedTier] = useState<LoyaltyTier | null>(null);
  const [newTier, setNewTier] = useState<Partial<LoyaltyTier>>({
    name: '',
    threshold: 0,
    color: 'bg-amber-700',
    benefits: []
  });
  
  // Loyalty rewards
  const [rewards, setRewards] = useState<LoyaltyReward[]>([
    {
      id: '1',
      name: 'Réduction de 10€',
      description: 'Bon de réduction de 10€ sur votre prochaine réservation',
      pointsCost: 1000,
      type: 'discount',
      value: '10€',
      usedCount: 124,
      isActive: true
    },
    {
      id: '2',
      name: 'Service offert',
      description: 'Un service au choix parmi notre sélection',
      pointsCost: 2500,
      type: 'service',
      value: 'Service au choix',
      usedCount: 67,
      isActive: true
    },
    {
      id: '3',
      name: 'Produit exclusif',
      description: 'Un produit exclusif de notre gamme premium',
      pointsCost: 4000,
      type: 'product',
      value: 'Produit premium',
      usedCount: 32,
      isActive: true
    },
    {
      id: '4',
      name: 'Carte cadeau 50€',
      description: 'Carte cadeau d\'une valeur de 50€',
      pointsCost: 5000,
      type: 'gift',
      value: '50€',
      usedCount: 18,
      isActive: true
    },
    {
      id: '5',
      name: 'Séance VIP',
      description: 'Une séance VIP avec notre spécialiste senior',
      pointsCost: 8000,
      type: 'service',
      value: 'Séance spécialiste',
      usedCount: 9,
      isActive: true
    }
  ]);
  
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);
  const [newReward, setNewReward] = useState<Partial<LoyaltyReward>>({
    name: '',
    description: '',
    pointsCost: 1000,
    type: 'discount',
    value: '',
    isActive: true
  });
  
  // Top members
  const [topMembers, setTopMembers] = useState<TopMember[]>([
    {
      id: '1',
      name: 'Marie Dupont',
      points: 12450,
      tier: 'Platine',
      spent: 4850,
      visits: 24,
      joinedAt: new Date('2024-02-15')
    },
    {
      id: '2',
      name: 'Thomas Martin',
      points: 9800,
      tier: 'Platine',
      spent: 3950,
      visits: 19,
      joinedAt: new Date('2023-11-20')
    },
    {
      id: '3',
      name: 'Sophie Lambert',
      points: 7200,
      tier: 'Or',
      spent: 3100,
      visits: 16,
      joinedAt: new Date('2024-01-05')
    },
    {
      id: '4',
      name: 'Jean Moreau',
      points: 5600,
      tier: 'Or',
      spent: 2400,
      visits: 14,
      joinedAt: new Date('2024-03-12')
    },
    {
      id: '5',
      name: 'Camille Bernard',
      points: 4300,
      tier: 'Argent',
      spent: 1850,
      visits: 11,
      joinedAt: new Date('2024-04-22')
    }
  ]);
  
  // Handlers for tiers
  const handleAddTier = () => {
    if (!newTier.name || newTier.threshold === undefined) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (selectedTier) {
      // Update existing tier
      const updatedTiers = tiers.map(tier => 
        tier.id === selectedTier.id 
          ? {
              ...tier,
              name: newTier.name || tier.name,
              threshold: newTier.threshold ?? tier.threshold,
              color: newTier.color || tier.color,
              benefits: newTier.benefits || tier.benefits
            } 
          : tier
      );
      setTiers(updatedTiers);
      toast.success("Niveau de fidélité modifié avec succès");
    } else {
      // Create new tier
      const createdTier: LoyaltyTier = {
        id: `${Date.now()}`,
        name: newTier.name!,
        threshold: newTier.threshold!,
        color: newTier.color || 'bg-amber-700',
        benefits: newTier.benefits || [],
        members: 0
      };
      
      setTiers([...tiers, createdTier]);
      toast.success("Niveau de fidélité créé avec succès");
    }
    
    resetTierForm();
  };
  
  const resetTierForm = () => {
    setShowAddTier(false);
    setSelectedTier(null);
    setNewTier({
      name: '',
      threshold: 0,
      color: 'bg-amber-700',
      benefits: []
    });
  };
  
  const handleEditTier = (tier: LoyaltyTier) => {
    setSelectedTier(tier);
    setNewTier({
      name: tier.name,
      threshold: tier.threshold,
      color: tier.color,
      benefits: [...tier.benefits]
    });
    setShowAddTier(true);
  };
  
  const handleDeleteTier = (id: string) => {
    setTiers(tiers.filter(tier => tier.id !== id));
    toast.success("Niveau de fidélité supprimé avec succès");
  };
  
  // Handlers for rewards
  const handleAddReward = () => {
    if (!newReward.name || !newReward.description || newReward.pointsCost === undefined) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (selectedReward) {
      // Update existing reward
      const updatedRewards = rewards.map(reward => 
        reward.id === selectedReward.id 
          ? {
              ...reward,
              name: newReward.name || reward.name,
              description: newReward.description || reward.description,
              pointsCost: newReward.pointsCost ?? reward.pointsCost,
              type: newReward.type || reward.type,
              value: newReward.value || reward.value,
              isActive: newReward.isActive !== undefined ? newReward.isActive : reward.isActive
            } 
          : reward
      );
      setRewards(updatedRewards);
      toast.success("Récompense modifiée avec succès");
    } else {
      // Create new reward
      const createdReward: LoyaltyReward = {
        id: `${Date.now()}`,
        name: newReward.name!,
        description: newReward.description!,
        pointsCost: newReward.pointsCost!,
        type: newReward.type || 'discount',
        value: newReward.value || '',
        usedCount: 0,
        isActive: newReward.isActive !== undefined ? newReward.isActive : true
      };
      
      setRewards([...rewards, createdReward]);
      toast.success("Récompense créée avec succès");
    }
    
    resetRewardForm();
  };
  
  const resetRewardForm = () => {
    setShowAddReward(false);
    setSelectedReward(null);
    setNewReward({
      name: '',
      description: '',
      pointsCost: 1000,
      type: 'discount',
      value: '',
      isActive: true
    });
  };
  
  const handleEditReward = (reward: LoyaltyReward) => {
    setSelectedReward(reward);
    setNewReward({
      name: reward.name,
      description: reward.description,
      pointsCost: reward.pointsCost,
      type: reward.type,
      value: reward.value,
      isActive: reward.isActive
    });
    setShowAddReward(true);
  };
  
  const handleDeleteReward = (id: string) => {
    setRewards(rewards.filter(reward => reward.id !== id));
    toast.success("Récompense supprimée avec succès");
  };
  
  const handleToggleReward = (id: string, isActive: boolean) => {
    setRewards(rewards.map(reward => 
      reward.id === id ? { ...reward, isActive } : reward
    ));
    
    toast.success(`Récompense ${isActive ? 'activée' : 'désactivée'} avec succès`);
  };
  
  // Update settings
  const handleUpdateSettings = () => {
    toast.success("Paramètres de fidélité mis à jour");
    setIsSettingsOpen(false);
  };
  
  // Helper function to add a benefit
  const handleAddBenefit = (benefit: string) => {
    if (!benefit.trim()) return;
    
    setNewTier({
      ...newTier,
      benefits: [...(newTier.benefits || []), benefit]
    });
  };
  
  // Helper function to remove a benefit
  const handleRemoveBenefit = (index: number) => {
    setNewTier({
      ...newTier,
      benefits: (newTier.benefits || []).filter((_, i) => i !== index)
    });
  };
  
  // Filter members by search query
  const filteredMembers = topMembers.filter(member => {
    return member.name.toLowerCase().includes(membersSearchQuery.toLowerCase());
  });
  
  // Filter rewards by search query
  const filteredRewards = rewards.filter(reward => {
    return reward.name.toLowerCase().includes(rewardsSearchQuery.toLowerCase()) ||
           reward.description.toLowerCase().includes(rewardsSearchQuery.toLowerCase());
  });
  
  // Get reward type badge
  const getRewardTypeBadge = (type: LoyaltyReward['type']) => {
    switch (type) {
      case 'discount':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Réduction</Badge>;
      case 'service':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Service</Badge>;
      case 'product':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Produit</Badge>;
      case 'gift':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Cadeau</Badge>;
      case 'other':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Autre</Badge>;
      default:
        return null;
    }
  };
  
  // Get tier badge with color
  const getTierBadge = (tierName: string) => {
    const tier = tiers.find(t => t.name === tierName);
    if (!tier) return <Badge>-</Badge>;
    
    return (
      <Badge className={`${tier.color} text-white border-0`}>
        {tier.name}
      </Badge>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Program enable/disable switch */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{settings.programName}</h2>
          <p className="text-sm text-muted-foreground">
            Programme de fidélité et récompenses pour vos clients
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="program-active" 
            checked={settings.enabled} 
            onCheckedChange={(checked) => setSettings({...settings, enabled: checked})}
          />
          <Label htmlFor="program-active">
            {settings.enabled ? "Actif" : "Inactif"}
          </Label>
        </div>
      </div>
      
      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Membres totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tiers.reduce((sum, tier) => sum + tier.members, 0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(tiers.reduce((sum, tier) => sum + tier.members, 0) * 0.85)} membres actifs
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Points distribués</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">296,450</div>
            <p className="text-xs text-muted-foreground mt-1">
              Mois en cours: +24,850
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Points utilisés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">153,200</div>
            <p className="text-xs text-green-600 mt-1">
              Taux d'utilisation: 51.7%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valeur générée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18,450€</div>
            <p className="text-xs text-green-600 mt-1">
              +12% vs dernier mois
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Settings button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
          <Settings className="mr-2 h-4 w-4" />
          Paramètres du programme
        </Button>
      </div>
      
      {/* Main tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="rewards">Récompenses</TabsTrigger>
          <TabsTrigger value="members">Membres</TabsTrigger>
        </TabsList>
        
        {/* Overview tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Tiers card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Niveaux de fidélité</CardTitle>
                  <CardDescription>
                    Définissez différents paliers pour récompenser la fidélité de vos clients
                  </CardDescription>
                </div>
                <Button onClick={() => {
                  resetTierForm();
                  setShowAddTier(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" /> Nouveau niveau
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {tiers.map((tier, index) => (
                  <div key={tier.id} className="border rounded-md overflow-hidden">
                    <div className={`h-2 w-full ${tier.color}`}></div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full ${tier.color} flex items-center justify-center text-white mr-3`}>
                            {tier.threshold === 0 ? (
                              <Users className="h-5 w-5" />
                            ) : (
                              <Star className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">{tier.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {tier.threshold === 0 ? (
                                "Niveau de départ"
                              ) : (
                                <>À partir de <span className="font-medium">{tier.threshold.toLocaleString()}</span> points</>
                              )}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            
                            <DropdownMenuItem onClick={() => handleEditTier(tier)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Modifier</span>
                            </DropdownMenuItem>
                            
                            {tier.threshold !== 0 && (
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={() => handleDeleteTier(tier.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="15"
                                  height="15"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-2 h-4 w-4"
                                >
                                  <path d="M18 6 6 18" />
                                  <path d="m6 6 12 12" />
                                </svg>
                                <span>Supprimer</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Avantages</h4>
                        <ul className="space-y-2">
                          {tier.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center text-sm">
                              <Check className="h-4 w-4 text-green-500 mr-2" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span>Membres dans ce niveau</span>
                          <span className="font-medium">{tier.members}</span>
                        </div>
                        
                        {index < tiers.length - 1 && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progression vers {tiers[index + 1].name}</span>
                              <span>{Math.round((tier.members * 0.15) / tier.members * 100)}%</span>
                            </div>
                            <Progress value={Math.round((tier.members * 0.15) / tier.members * 100)} className="h-1" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Program stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Répartition des membres</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {tiers.map(tier => {
                    const totalMembers = tiers.reduce((sum, t) => sum + t.members, 0);
                    const percentage = Math.round((tier.members / totalMembers) * 100);
                    
                    return (
                      <div key={tier.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${tier.color} mr-2`}></div>
                            <span>{tier.name}</span>
                          </div>
                          <span>{tier.members} membres ({percentage}%)</span>
                        </div>
                        <Progress value={percentage} className={`h-2 ${tier.color}`} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statistiques du programme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <div className="text-sm font-medium">Dépense moyenne</div>
                          <div className="text-2xl font-bold">86€</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Par membre fidèle</div>
                          <div className="text-xs text-green-600">+15% vs non-membres</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <div className="text-sm font-medium">Fréquence des visites</div>
                          <div className="text-2xl font-bold">3.2 visites</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Par trimestre</div>
                          <div className="text-xs text-green-600">+24% vs non-membres</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <div className="text-sm font-medium">Taux de rétention</div>
                          <div className="text-2xl font-bold">78%</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Des membres fidèles</div>
                          <div className="text-xs text-green-600">+32% vs non-membres</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Program tips */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base">Conseils pour optimiser votre programme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Communiquez sur votre programme</h4>
                    <p className="text-sm text-muted-foreground">
                      Assurez-vous que tous vos clients connaissent l'existence de votre programme de fidélité.
                      Envoyez des emails, mentionnez-le lors des rendez-vous, et affichez des informations en vitrine.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Récompenses attractives et atteignables</h4>
                    <p className="text-sm text-muted-foreground">
                      Proposez des récompenses à différents niveaux de points pour que tous les clients puissent
                      en profiter. Les récompenses doivent être suffisamment attractives pour motiver les clients.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Occasions spéciales et boosts de points</h4>
                    <p className="text-sm text-muted-foreground">
                      Créez des événements spéciaux avec multiplication des points (ex: double points le mardi)
                      pour stimuler les visites pendant les périodes creuses.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Rewards tab */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une récompense..."
                className="pl-8"
                value={rewardsSearchQuery}
                onChange={(e) => setRewardsSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => {
              resetRewardForm();
              setShowAddReward(true);
            }}>
              <Plus className="h-4 w-4 mr-2" /> Nouvelle récompense
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Récompenses disponibles</CardTitle>
              <CardDescription>
                Récompenses que vos clients peuvent échanger contre des points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Récompense</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Valeur</TableHead>
                    <TableHead>Coût en points</TableHead>
                    <TableHead>Échangées</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRewards.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="text-muted-foreground">Aucune récompense trouvée</div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRewards.map((reward) => (
                      <TableRow key={reward.id}>
                        <TableCell>
                          <div className="font-medium">{reward.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                            {reward.description}
                          </div>
                        </TableCell>
                        <TableCell>{getRewardTypeBadge(reward.type)}</TableCell>
                        <TableCell>{reward.value}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {reward.pointsCost.toLocaleString()}
                            <Star className="ml-1 h-3 w-3 text-amber-500" />
                          </div>
                        </TableCell>
                        <TableCell>{reward.usedCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={reward.isActive} 
                              onCheckedChange={(checked) => handleToggleReward(reward.id, checked)}
                            />
                            <span className="text-sm text-muted-foreground">
                              {reward.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              
                              <DropdownMenuItem onClick={() => handleEditReward(reward)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Modifier</span>
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteReward(reward.id)}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="15"
                                  height="15"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-2 h-4 w-4"
                                >
                                  <path d="M18 6 6 18" />
                                  <path d="m6 6 12 12" />
                                </svg>
                                <span>Supprimer</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Recent redemptions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Échanges récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md divide-y">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Tag className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Réduction de 10€</div>
                        <div className="text-sm text-muted-foreground">
                          Échangé par Sophie D. le {format(new Date().setDate(new Date().getDate() - 2), 'dd/MM/yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="font-medium mr-2">1000</div>
                      <Star className="h-4 w-4 text-amber-500" />
                    </div>
                  </div>
                  
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Gift className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Service offert</div>
                        <div className="text-sm text-muted-foreground">
                          Échangé par Thomas M. le {format(new Date().setDate(new Date().getDate() - 4), 'dd/MM/yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="font-medium mr-2">2500</div>
                      <Star className="h-4 w-4 text-amber-500" />
                    </div>
                  </div>
                  
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <Gift className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">Produit exclusif</div>
                        <div className="text-sm text-muted-foreground">
                          Échangé par Marie D. le {format(new Date().setDate(new Date().getDate() - 5), 'dd/MM/yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="font-medium mr-2">4000</div>
                      <Star className="h-4 w-4 text-amber-500" />
                    </div>
                  </div>
                  
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Tag className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Réduction de 10€</div>
                        <div className="text-sm text-muted-foreground">
                          Échangé par Jean M. le {format(new Date().setDate(new Date().getDate() - 8), 'dd/MM/yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="font-medium mr-2">1000</div>
                      <Star className="h-4 w-4 text-amber-500" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button variant="outline" className="w-full md:w-auto">
                    Voir tous les échanges
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Promotion ideas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Idées de promotions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <Calendar className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Points doublés certains jours</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Proposez des jours spéciaux où les clients gagnent deux fois plus de points pour stimuler les réservations lors des périodes creuses.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Programme de parrainage</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Récompensez vos clients qui parrainent de nouveaux clients avec des points bonus.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Gift className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Surprise d'anniversaire</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Offrez automatiquement des points ou une récompense spéciale pour l'anniversaire de vos clients.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <Percent className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Challenge saisonnier</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Créez des défis saisonniers avec des récompenses spéciales (ex: visiter 3 fois en été).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Members tab */}
        <TabsContent value="members" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un membre..."
                className="pl-8"
                value={membersSearchQuery}
                onChange={(e) => setMembersSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrer par niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                {tiers.map(tier => (
                  <SelectItem key={tier.id} value={tier.id}>{tier.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Membres du programme</CardTitle>
              <CardDescription>
                Consultez et gérez les membres de votre programme de fidélité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Total dépensé</TableHead>
                    <TableHead>Visites</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="text-muted-foreground">Aucun membre trouvé</div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{getTierBadge(member.tier)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="font-medium">{member.points.toLocaleString()}</div>
                            <Star className="ml-1 h-3 w-3 text-amber-500" />
                          </div>
                        </TableCell>
                        <TableCell>{member.spent}€</TableCell>
                        <TableCell>{member.visits}</TableCell>
                        <TableCell>{format(member.joinedAt, 'dd/MM/yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowMemberDetails(member.id)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="text-muted-foreground">
                  Affichage de {filteredMembers.length} sur {filteredMembers.length} membres
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>Précédent</Button>
                  <Button variant="outline" size="sm">1</Button>
                  <Button variant="outline" size="sm" disabled>Suivant</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Member Import/Export Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Importation & Exportation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Importer des membres</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Importez des membres à partir d'un fichier CSV ou Excel
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline">Télécharger le modèle</Button>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Importer
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Exporter les données</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Exportez vos données de fidélité dans différents formats
                  </p>
                  <Select defaultValue="csv">
                    <SelectTrigger className="mb-2">
                      <SelectValue placeholder="Choisir le format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full">Exporter</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tips Card */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Comment engager vos membres</AlertTitle>
            <AlertDescription className="space-y-2 text-sm">
              <p>
                Utilisez des notifications personnalisées pour informer vos clients sur leur solde de points et les récompenses disponibles.
              </p>
              <p>
                Proposez des points bonus pour les actions spécifiques comme remplir leur profil, laisser un avis, ou visiter pendant les heures creuses.
              </p>
              <p>
                Célébrez les moments importants comme les anniversaires d'inscription ou le passage à un niveau supérieur avec des récompenses spéciales.
              </p>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
      
      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Paramètres du programme</DialogTitle>
            <DialogDescription>
              Configurez votre programme de fidélité
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="program-active-settings">Programme actif</Label>
              <Switch 
                id="program-active-settings" 
                checked={settings.enabled} 
                onCheckedChange={(checked) => setSettings({...settings, enabled: checked})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="program-name">Nom du programme</Label>
              <Input
                id="program-name"
                value={settings.programName}
                onChange={(e) => setSettings({...settings, programName: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="points-per-euro">Points par euro</Label>
                <Input
                  id="points-per-euro"
                  type="number"
                  value={settings.pointsPerEuro.toString()}
                  onChange={(e) => setSettings({...settings, pointsPerEuro: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="points-per-visit">Points par visite</Label>
                <Input
                  id="points-per-visit"
                  type="number"
                  value={settings.pointsPerVisit.toString()}
                  onChange={(e) => setSettings({...settings, pointsPerVisit: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="expiry-days">Expiration des points (jours)</Label>
              <Input
                id="expiry-days"
                type="number"
                value={settings.expiryDays.toString()}
                onChange={(e) => setSettings({...settings, expiryDays: parseInt(e.target.value) || 0})}
              />
              <p className="text-xs text-muted-foreground">
                0 = Les points n'expirent jamais
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="welcome-points">Points de bienvenue</Label>
                <Input
                  id="welcome-points"
                  type="number"
                  value={settings.welcomePoints.toString()}
                  onChange={(e) => setSettings({...settings, welcomePoints: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="birthday-points">Points d'anniversaire</Label>
                <Input
                  id="birthday-points"
                  type="number"
                  value={settings.birthdayPoints.toString()}
                  onChange={(e) => setSettings({...settings, birthdayPoints: parseInt(e.target.value) || 0})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="referral-points">Points de parrainage</Label>
                <Input
                  id="referral-points"
                  type="number"
                  value={settings.referralPoints.toString()}
                  onChange={(e) => setSettings({...settings, referralPoints: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateSettings}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Tier Dialog */}
      <Dialog open={showAddTier} onOpenChange={setShowAddTier}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTier ? "Modifier le niveau" : "Ajouter un niveau"}</DialogTitle>
            <DialogDescription>
              {selectedTier ? "Modifiez les détails du niveau de fidélité" : "Créez un nouveau niveau de fidélité"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tier-name">Nom du niveau</Label>
              <Input
                id="tier-name"
                value={newTier.name}
                onChange={(e) => setNewTier({...newTier, name: e.target.value})}
                placeholder="ex: Platine"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="threshold">Seuil de points</Label>
              <Input
                id="threshold"
                type="number"
                value={newTier.threshold?.toString() || '0'}
                onChange={(e) => setNewTier({...newTier, threshold: parseInt(e.target.value) || 0})}
                placeholder="ex: 5000"
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                Nombre de points requis pour atteindre ce niveau
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label>Couleur</Label>
              <div className="flex flex-wrap gap-2">
                {['bg-amber-700', 'bg-gray-400', 'bg-amber-400', 'bg-indigo-400', 'bg-purple-400', 'bg-green-400', 'bg-red-400'].map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full ${color} ${newTier.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                    onClick={() => setNewTier({...newTier, color})}
                    type="button"
                  />
                ))}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Avantages</Label>
              <div className="flex gap-2">
                <Input
                  id="new-benefit"
                  placeholder="ex: 1.5 points par euro dépensé"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => handleAddBenefit((document.getElementById('new-benefit') as HTMLInputElement).value)}
                >
                  Ajouter
                </Button>
              </div>
              
              <div className="border rounded-md p-2 min-h-[100px]">
                {(newTier.benefits || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">Aucun avantage ajouté</p>
                ) : (
                  <ul className="space-y-2">
                    {(newTier.benefits || []).map((benefit, index) => (
                      <li key={index} className="flex items-center justify-between text-sm bg-muted/40 p-2 rounded-sm">
                        <span>{benefit}</span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveBenefit(index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetTierForm}>
              Annuler
            </Button>
            <Button onClick={handleAddTier} disabled={!newTier.name}>
              {selectedTier ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Reward Dialog */}
      <Dialog open={showAddReward} onOpenChange={setShowAddReward}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedReward ? "Modifier la récompense" : "Ajouter une récompense"}</DialogTitle>
            <DialogDescription>
              {selectedReward ? "Modifiez les détails de la récompense" : "Créez une nouvelle récompense pour vos clients fidèles"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reward-name">Nom de la récompense</Label>
              <Input
                id="reward-name"
                value={newReward.name}
                onChange={(e) => setNewReward({...newReward, name: e.target.value})}
                placeholder="ex: Réduction de 10€"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newReward.description}
                onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                placeholder="ex: Bon de réduction de 10€ sur votre prochaine réservation"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type de récompense</Label>
                <Select 
                  value={newReward.type}
                  onValueChange={(value: LoyaltyReward['type']) => setNewReward({...newReward, type: value})}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Choisir un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount">Réduction</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="product">Produit</SelectItem>
                    <SelectItem value="gift">Cadeau</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="value">Valeur</Label>
                <Input
                  id="value"
                  value={newReward.value}
                  onChange={(e) => setNewReward({...newReward, value: e.target.value})}
                  placeholder="ex: 10€"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="points-cost">Coût en points</Label>
              <Input
                id="points-cost"
                type="number"
                value={newReward.pointsCost?.toString() || ''}
                onChange={(e) => setNewReward({...newReward, pointsCost: parseInt(e.target.value) || 0})}
                placeholder="ex: 1000"
                min="0"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="active" 
                checked={newReward.isActive} 
                onCheckedChange={(checked) => setNewReward({...newReward, isActive: checked})}
              />
              <Label htmlFor="active">Activer cette récompense</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetRewardForm}>
              Annuler
            </Button>
            <Button 
              onClick={handleAddReward} 
              disabled={!newReward.name || !newReward.description || newReward.pointsCost === undefined}
            >
              {selectedReward ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Member Details Dialog */}
      <Dialog open={!!showMemberDetails} onOpenChange={() => setShowMemberDetails(null)}>
        <DialogContent className="max-w-3xl">
          {showMemberDetails && (
            <>
              <DialogHeader>
                <DialogTitle>{topMembers.find(m => m.id === showMemberDetails)?.name}</DialogTitle>
                <DialogDescription>
                  Détails du membre et historique de fidélité
                </DialogDescription>
              </DialogHeader>
              <div className="grid md:grid-cols-3 gap-6 py-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Informations</h3>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-md">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {topMembers.find(m => m.id === showMemberDetails)?.name}
                          </div>
                          <div className="flex items-center mt-1">
                            {getTierBadge(topMembers.find(m => m.id === showMemberDetails)?.tier || '')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Points</span>
                          <div className="flex items-center">
                            <span className="font-medium">
                              {topMembers.find(m => m.id === showMemberDetails)?.points.toLocaleString()}
                            </span>
                            <Star className="ml-1 h-3 w-3 text-amber-500" />
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dépensé</span>
                          <span className="font-medium">
                            {topMembers.find(m => m.id === showMemberDetails)?.spent}€
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Visites</span>
                          <span className="font-medium">
                            {topMembers.find(m => m.id === showMemberDetails)?.visits}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Inscription</span>
                          <span className="font-medium">
                            {format(topMembers.find(m => m.id === showMemberDetails)?.joinedAt || new Date(), 'dd/MM/yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Actions</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <Gift className="mr-2 h-4 w-4" />
                          Ajouter des points
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier le niveau
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Envoyer un message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium mb-2">Historique d'activité</h3>
                  <div className="border rounded-md divide-y">
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Plus className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Points gagnés</div>
                          <div className="text-xs text-muted-foreground">
                            Rendez-vous - Massage relaxant
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-green-600">
                          <span className="font-medium">+250</span>
                          <Star className="ml-1 h-3 w-3" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Il y a 3 jours
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                          <Gift className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium">Récompense échangée</div>
                          <div className="text-xs text-muted-foreground">
                            Réduction de 10€
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-amber-600">
                          <span className="font-medium">-1000</span>
                          <Star className="ml-1 h-3 w-3" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Il y a 2 semaines
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Plus className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Points gagnés</div>
                          <div className="text-xs text-muted-foreground">
                            Rendez-vous - Soin du visage
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-green-600">
                          <span className="font-medium">+450</span>
                          <Star className="ml-1 h-3 w-3" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Il y a 3 semaines
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Award className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">Nouveau niveau atteint</div>
                          <div className="text-xs text-muted-foreground">
                            Niveau Or
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-blue-600">
                          <Check className="h-4 w-4" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Il y a 1 mois
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <Gift className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium">Points de parrainage</div>
                          <div className="text-xs text-muted-foreground">
                            Parrainage de Julie D.
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-green-600">
                          <span className="font-medium">+300</span>
                          <Star className="ml-1 h-3 w-3" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Il y a 2 mois
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <Button variant="outline">
                      Voir l'historique complet
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowMemberDetails(null)}>
                  Fermer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
