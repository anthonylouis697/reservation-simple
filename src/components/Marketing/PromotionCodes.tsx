
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Tag, 
  Plus, 
  Trash, 
  Calendar, 
  Percent, 
  Users, 
  Edit
} from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Données factices de codes promo
const demoPromoCodes = [
  { id: 1, code: 'BIENVENUE20', discount: '20%', minPurchase: '0€', used: 24, limit: 100, status: 'active', expires: '31/12/2025' },
  { id: 2, code: 'ETE2024', discount: '15%', minPurchase: '50€', used: 47, limit: 200, status: 'active', expires: '31/08/2024' },
  { id: 3, code: 'FIDELE10', discount: '10%', minPurchase: '0€', used: 132, limit: 500, status: 'active', expires: '31/12/2024' },
  { id: 4, code: 'NOEL2023', discount: '25%', minPurchase: '100€', used: 89, limit: 100, status: 'expired', expires: '25/12/2023' }
];

export const PromotionCodes = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [open, setOpen] = useState(false);
  
  // Filtrer les codes promo selon l'onglet sélectionné
  const filteredCodes = activeTab === 'all' 
    ? demoPromoCodes 
    : demoPromoCodes.filter(code => code.status === activeTab);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-full md:w-64">
            <Input 
              placeholder="Rechercher un code promo..." 
              className="w-full"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les codes</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="expired">Expirés</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              <span>Nouveau code promo</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer un nouveau code promo</DialogTitle>
              <DialogDescription>
                Définissez les détails de votre nouveau code promotionnel
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Input
                  id="code"
                  placeholder="ex: SUMMER2024"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discount" className="text-right">
                  Réduction
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="discount"
                    placeholder="ex: 10"
                    className="w-24"
                  />
                  <Select defaultValue="percent">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Pourcentage</SelectItem>
                      <SelectItem value="amount">Montant fixe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expires" className="text-right">
                  Date d'expiration
                </Label>
                <Input
                  id="expires"
                  type="date"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="limit" className="text-right">
                  Limite d'utilisation
                </Label>
                <Input
                  id="limit"
                  type="number"
                  min="0"
                  placeholder="Illimité si vide"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setOpen(false)}>
                Créer le code
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="px-6 py-4">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">Tous les codes ({demoPromoCodes.length})</TabsTrigger>
              <TabsTrigger value="active">Actifs ({demoPromoCodes.filter(c => c.status === 'active').length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Réduction</TableHead>
                <TableHead className="hidden md:table-cell">Utilisations</TableHead>
                <TableHead className="hidden md:table-cell">Expire le</TableHead>
                <TableHead className="hidden md:table-cell">Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCodes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-medium">{code.code}</TableCell>
                  <TableCell>{code.discount}</TableCell>
                  <TableCell className="hidden md:table-cell">{code.used} / {code.limit}</TableCell>
                  <TableCell className="hidden md:table-cell">{code.expires}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={code.status === 'active' ? 'default' : 'secondary'}>
                      {code.status === 'active' ? 'Actif' : 'Expiré'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500">
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
