
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  AlertCircle, 
  ArrowUpDown, 
  Calendar, 
  Check, 
  Copy, 
  Edit, 
  FileBarChart, 
  Fingerprint, 
  MoreHorizontal, 
  Pencil, 
  Plus, 
  RefreshCw, 
  Search, 
  Tag, 
  Trash, 
  User
} from 'lucide-react';
import { toast } from 'sonner';

// Données fictives pour les codes promo
const promotionCodes = [
  {
    id: 1,
    code: 'BIENVENUE25',
    discount: 25,
    discountType: 'percentage',
    usageLimit: 1000,
    used: 523,
    startDate: '2025-04-01',
    endDate: '2025-05-30',
    status: 'active',
    minOrder: 0,
    applicableTo: 'all',
  },
  {
    id: 2,
    code: 'ÉTÉ2025',
    discount: 15,
    discountType: 'percentage',
    usageLimit: 500,
    used: 125,
    startDate: '2025-05-15',
    endDate: '2025-08-31',
    status: 'active',
    minOrder: 50,
    applicableTo: 'services',
  },
  {
    id: 3,
    code: 'FIDÉLITÉ10',
    discount: 10,
    discountType: 'percentage',
    usageLimit: 0, // illimité
    used: 457,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'active',
    minOrder: 0,
    applicableTo: 'all',
  },
  {
    id: 4,
    code: 'REMISE5',
    discount: 5,
    discountType: 'fixed',
    usageLimit: 200,
    used: 84,
    startDate: '2025-05-01',
    endDate: '2025-05-31',
    status: 'active',
    minOrder: 0,
    applicableTo: 'products',
  },
  {
    id: 5,
    code: 'ANNIV2025',
    discount: 20,
    discountType: 'percentage',
    usageLimit: 300,
    used: 0,
    startDate: '2025-06-15',
    endDate: '2025-06-30',
    status: 'scheduled',
    minOrder: 0,
    applicableTo: 'all',
  },
  {
    id: 6,
    code: 'NOEL2024',
    discount: 10,
    discountType: 'percentage',
    usageLimit: 500,
    used: 500, // épuisé
    startDate: '2024-12-01',
    endDate: '2024-12-25',
    status: 'expired',
    minOrder: 0,
    applicableTo: 'all',
  },
];

export const PromotionCodes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  }>({
    key: 'id',
    direction: 'ascending'
  });

  // Générer un code promo aléatoire
  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setGeneratedCode(result);
  };

  // Trier les codes promo
  const sortedPromotionCodes = [...promotionCodes].sort((a, b) => {
    if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Fonction pour changer le critère de tri
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filtrer les codes promo en fonction du terme de recherche
  const filteredPromotionCodes = sortedPromotionCodes.filter(code => {
    return code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
           code.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
           code.applicableTo.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Gérer les actions sur les codes promo
  const handleCodeAction = (action: string, code: typeof promotionCodes[0]) => {
    switch(action) {
      case 'edit':
        toast.info(`Édition du code promo "${code.code}"`, {
          description: "Ouvre l'éditeur de codes promo"
        });
        break;
      case 'copy':
        navigator.clipboard.writeText(code.code);
        toast.success(`Code "${code.code}" copié dans le presse-papier`, {
          description: "Vous pouvez maintenant le coller où vous voulez."
        });
        break;
      case 'deactivate':
        toast.success(`Code "${code.code}" désactivé`, {
          description: "Le code ne peut plus être utilisé."
        });
        break;
      case 'delete':
        toast.success(`Code "${code.code}" supprimé`, {
          description: "Le code a été supprimé avec succès."
        });
        break;
      default:
        break;
    }
  };

  // Obtenir la classe de badge en fonction du statut
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Programmé</Badge>;
      case 'expired':
        return <Badge variant="secondary" className="text-gray-500">Expiré</Badge>;
      case 'deactivated':
        return <Badge variant="outline" className="text-red-500">Désactivé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un code promo..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={codeDialogOpen} onOpenChange={setCodeDialogOpen}>
          <DialogTrigger asChild>
            <Button className="whitespace-nowrap">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau code promo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un nouveau code promo</DialogTitle>
              <DialogDescription>
                Définissez les paramètres de votre code promotionnel
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code promo</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="code"
                    placeholder="Code promo"
                    value={generatedCode}
                    onChange={(e) => setGeneratedCode(e.target.value)}
                    className="flex-grow"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={generateRandomCode}
                    title="Générer un code aléatoire"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">Remise</Label>
                  <div className="flex items-center">
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      placeholder="Montant"
                      className="flex-grow"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount-type">Type de remise</Label>
                  <Select defaultValue="percentage">
                    <SelectTrigger>
                      <SelectValue placeholder="Type de remise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                      <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Date de début</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      id="start-date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Date de fin</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      id="end-date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="usage-limit">Limite d'utilisation</Label>
                <Input
                  id="usage-limit"
                  type="number"
                  min="0"
                  placeholder="0 pour illimité"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="min-order">Montant minimum de commande</Label>
                <Input
                  id="min-order"
                  type="number"
                  min="0"
                  placeholder="0 pour aucun minimum"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="applicable-to">Applicable à</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Applicable à" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les services</SelectItem>
                    <SelectItem value="services">Services spécifiques</SelectItem>
                    <SelectItem value="products">Produits seulement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="active" />
                <Label htmlFor="active">Activer ce code immédiatement</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCodeDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={() => {
                  toast.success("Code promo créé avec succès", {
                    description: "Le nouveau code est maintenant disponible."
                  });
                  setCodeDialogOpen(false);
                }}
              >
                Créer le code
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Codes promotionnels</CardTitle>
          <CardDescription>
            Gérez vos codes promo et leurs conditions d'utilisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead 
                  className="cursor-pointer hover:text-primary"
                  onClick={() => requestSort('code')}
                >
                  <div className="flex items-center">
                    Code
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="hidden md:table-cell cursor-pointer hover:text-primary"
                  onClick={() => requestSort('discount')}
                >
                  <div className="flex items-center">
                    Remise
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="hidden md:table-cell cursor-pointer hover:text-primary"
                  onClick={() => requestSort('endDate')}
                >
                  <div className="flex items-center">
                    Expire le
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <div className="flex items-center">
                    Utilisation
                  </div>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  <div className="flex items-center">
                    Status
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromotionCodes.length > 0 ? (
                filteredPromotionCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>
                      <div className="font-mono font-medium">{code.code}</div>
                      <div className="text-xs text-muted-foreground md:hidden">
                        {code.discountType === 'percentage' ? `${code.discount}%` : `${code.discount}€`}
                      </div>
                      <div className="text-xs text-muted-foreground md:hidden">
                        {getStatusBadge(code.status)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {code.discountType === 'percentage' ? `${code.discount}%` : `${code.discount}€`}
                      {code.minOrder > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Min. {code.minOrder}€
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(code.endDate).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {code.usageLimit > 0 ? (
                        <div className="flex items-center">
                          <div className="text-sm">{code.used}/{code.usageLimit}</div>
                          <div className="ml-2 bg-gray-200 rounded-full h-1.5 w-16">
                            <div
                              className="bg-primary rounded-full h-1.5"
                              style={{ width: `${Math.min(100, (code.used / code.usageLimit) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="text-sm">{code.used}/∞</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {getStatusBadge(code.status)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Options</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleCodeAction('edit', code)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCodeAction('copy', code)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copier le code
                          </DropdownMenuItem>
                          {code.status === 'active' && (
                            <DropdownMenuItem onClick={() => handleCodeAction('deactivate', code)}>
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Désactiver
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleCodeAction('delete', code)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucun code promo trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Affichage de {filteredPromotionCodes.length} codes promo
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                toast.info("Générer un rapport de performance des codes promo", {
                  description: "Le rapport est en cours de préparation."
                });
              }}
            >
              <FileBarChart className="mr-2 h-4 w-4" />
              Rapport
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Conseils d'utilisation des codes promo</CardTitle>
          <CardDescription>
            Comment optimiser votre stratégie de codes promotionnels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Codes à durée limitée</h3>
                <p className="text-sm text-muted-foreground">
                  Créez un sentiment d'urgence en limitant la durée de validité de vos codes.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Codes personnalisés</h3>
                <p className="text-sm text-muted-foreground">
                  Offrez des codes spécifiques à certains segments de votre clientèle.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Fingerprint className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Codes uniques</h3>
                <p className="text-sm text-muted-foreground">
                  Utilisez des codes à usage unique pour des promotions exclusives.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <FileBarChart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Suivez les performances</h3>
                <p className="text-sm text-muted-foreground">
                  Analysez le taux d'utilisation pour optimiser vos futures promotions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
