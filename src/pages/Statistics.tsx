
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  FileSpreadsheet,
  ChartBarStacked, 
  ChartBar, 
  ChartPie, 
  ChartLine,
  Users,
  Calendar,
  CreditCard,
  Tag
} from "lucide-react";

// Exemple de données pour les revenus
const revenueData = [
  { name: "Jan", revenue: 2200 },
  { name: "Fév", revenue: 2800 },
  { name: "Mar", revenue: 3200 },
  { name: "Avr", revenue: 4000 },
  { name: "Mai", revenue: 3800 },
  { name: "Juin", revenue: 4200 },
  { name: "Juil", revenue: 4800 },
  { name: "Aoû", revenue: 5200 },
  { name: "Sep", revenue: 5800 },
  { name: "Oct", revenue: 6200 },
  { name: "Nov", revenue: 5800 },
  { name: "Déc", revenue: 7000 },
];

// Exemple de données pour le nombre de rendez-vous
const appointmentData = [
  { name: "Jan", appointments: 42 },
  { name: "Fév", appointments: 58 },
  { name: "Mar", appointments: 65 },
  { name: "Avr", appointments: 81 },
  { name: "Mai", appointments: 76 },
  { name: "Juin", appointments: 94 },
  { name: "Juil", appointments: 102 },
  { name: "Aoû", appointments: 115 },
  { name: "Sep", appointments: 124 },
  { name: "Oct", appointments: 136 },
  { name: "Nov", appointments: 128 },
  { name: "Déc", appointments: 145 },
];

// Exemple de données pour les services les plus populaires
const servicesData = [
  { name: "Consultation", value: 40 },
  { name: "Massage", value: 30 },
  { name: "Coaching", value: 20 },
  { name: "Formation", value: 10 },
];

// Exemple de données pour les sources de clients
const clientSourcesData = [
  { name: "Direct", value: 45 },
  { name: "Visibilité Boost", value: 25 },
  { name: "Parrainage", value: 18 },
  { name: "Réseaux sociaux", value: 12 },
];

// Couleurs pour les graphiques en camembert
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

// Top clients
const topClientsData = [
  { id: 1, name: "Marie Dupont", appointments: 12, revenue: "960 €", lastVisit: "15/05/2025" },
  { id: 2, name: "Jean Martin", appointments: 9, revenue: "720 €", lastVisit: "10/05/2025" },
  { id: 3, name: "Sophie Lambert", appointments: 8, revenue: "640 €", lastVisit: "08/05/2025" },
  { id: 4, name: "Thomas Petit", appointments: 7, revenue: "560 €", lastVisit: "05/05/2025" },
  { id: 5, name: "Claire Dubois", appointments: 6, revenue: "480 €", lastVisit: "01/05/2025" },
];

const Statistics = () => {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [compareEnabled, setCompareEnabled] = useState(false);
  
  // État pour simuler le chargement des données
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simuler le chargement des données
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [period]);
  
  // Cette fonction serait remplacée par une vraie fonction de téléchargement de rapport
  const downloadReport = () => {
    console.log("Téléchargement du rapport pour la période:", period);
    // Dans une vraie implémentation, cela générerait et téléchargerait un CSV ou PDF
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-500">Analysez les performances de votre activité</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Tabs value={period} onValueChange={(v) => setPeriod(v as "week" | "month" | "year")}>
            <TabsList>
              <TabsTrigger value="week">Semaine</TabsTrigger>
              <TabsTrigger value="month">Mois</TabsTrigger>
              <TabsTrigger value="year">Année</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" className="flex items-center gap-2" onClick={downloadReport}>
            <FileSpreadsheet className="h-4 w-4" />
            <span>Exporter</span>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        // État de chargement
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-36 bg-gray-100 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-36 bg-gray-100 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Contenu des statistiques
        <>
          {/* KPIs principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-indigo-600" />
                  Revenus
                </CardTitle>
                <CardDescription>Total {period === "week" ? "cette semaine" : period === "month" ? "ce mois" : "cette année"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{period === "week" ? "1 250 €" : period === "month" ? "5 800 €" : "60 000 €"}</div>
                <div className="flex items-center mt-2 text-xs">
                  <div className="text-green-600 flex items-center">
                    +12% <span className="ml-1">vs période précédente</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  Rendez-vous
                </CardTitle>
                <CardDescription>Total {period === "week" ? "cette semaine" : period === "month" ? "ce mois" : "cette année"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{period === "week" ? "25" : period === "month" ? "124" : "1 120"}</div>
                <div className="flex items-center mt-2 text-xs">
                  <div className="text-green-600 flex items-center">
                    +8% <span className="ml-1">vs période précédente</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-600" />
                  Nouveaux clients
                </CardTitle>
                <CardDescription>Total {period === "week" ? "cette semaine" : period === "month" ? "ce mois" : "cette année"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{period === "week" ? "4" : period === "month" ? "18" : "215"}</div>
                <div className="flex items-center mt-2 text-xs">
                  <div className="text-green-600 flex items-center">
                    +15% <span className="ml-1">vs période précédente</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4 text-indigo-600" />
                  Services réservés
                </CardTitle>
                <CardDescription>Total {period === "week" ? "cette semaine" : period === "month" ? "ce mois" : "cette année"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{period === "week" ? "30" : period === "month" ? "142" : "1 450"}</div>
                <div className="flex items-center mt-2 text-xs">
                  <div className="text-green-600 flex items-center">
                    +10% <span className="ml-1">vs période précédente</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Graphique d'évolution des revenus */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ChartBar className="h-5 w-5 text-indigo-600" />
                      Évolution des revenus
                    </CardTitle>
                    <CardDescription>Vue {period === "week" ? "journalière" : period === "month" ? "hebdomadaire" : "mensuelle"}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} €`, "Revenus"]}
                        contentStyle={{ 
                          backgroundColor: "white", 
                          border: "1px solid #e2e8f0"
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenus" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Graphique des rendez-vous */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartLine className="h-5 w-5 text-indigo-600" />
                  Nombre de rendez-vous
                </CardTitle>
                <CardDescription>Évolution sur l'année</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={appointmentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="appointments" name="Rendez-vous" stroke="#82ca9d" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Graphique des meilleurs services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartPie className="h-5 w-5 text-indigo-600" />
                  Services les plus populaires
                </CardTitle>
                <CardDescription>Répartition des réservations par service</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={servicesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {servicesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sources de clients et meilleurs clients */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Sources de clients
                </CardTitle>
                <CardDescription>Comment vos clients vous trouvent</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientSourcesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {clientSourcesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBarStacked className="h-5 w-5 text-indigo-600" />
                  Meilleurs clients
                </CardTitle>
                <CardDescription>Classés par nombre de rendez-vous</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Rendez-vous</TableHead>
                      <TableHead>Revenus</TableHead>
                      <TableHead>Dernière visite</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topClientsData.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.appointments}</TableCell>
                        <TableCell>{client.revenue}</TableCell>
                        <TableCell>{client.lastVisit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default Statistics;
