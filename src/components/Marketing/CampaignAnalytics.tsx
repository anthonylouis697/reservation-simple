import { 
  Bar, 
  BarChart as RechartsBarChart, 
  Line, 
  LineChart as RechartsLineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowUpRight, Clock, Star, User } from 'lucide-react';

interface CampaignAnalyticsProps {
  data: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({ data }) => {
  const engagementData = [
    { name: 'Ouvertures', value: 1200 },
    { name: 'Clics', value: 800 },
    { name: 'Désinscriptions', value: 150 },
    { name: 'Non ouverts', value: 300 },
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Aperçu des performances</CardTitle>
          <CardDescription>Analyse des performances de vos campagnes marketing</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="space-y-4">
            <TabsList>
              <TabsTrigger value="email">Campagnes Email</TabsTrigger>
              <TabsTrigger value="sms">Campagnes SMS</TabsTrigger>
            </TabsList>
            <TabsContent value="email" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Taux d'ouverture</CardTitle>
                    <CardDescription>Pourcentage d'emails ouverts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">68%</div>
                    <div className="text-sm text-muted-foreground">
                      <ArrowUpRight className="inline-block h-4 w-4 mr-1" />
                      +12% par rapport à la semaine dernière
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Taux de clics</CardTitle>
                    <CardDescription>Pourcentage de clics sur les liens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">12%</div>
                    <div className="text-sm text-muted-foreground">
                      <ArrowRight className="inline-block h-4 w-4 mr-1" />
                      Stable par rapport à la semaine dernière
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Engagement des utilisateurs</CardTitle>
                  <CardDescription>Répartition de l'engagement des utilisateurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={engagementData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {engagementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Tendances des envois</CardTitle>
                  <CardDescription>Nombre d'emails envoyés par jour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid stroke="#f5f5f5" />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="emails" stroke="#8884d8" name="Emails envoyés" />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sms">
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertTitle>Fonctionnalité à venir!</AlertTitle>
                <AlertDescription>
                  L'analyse des campagnes SMS sera bientôt disponible.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Segmentation de la clientèle</CardTitle>
            <CardDescription>Comprendre vos clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Clients actifs</span>
                </div>
                <Badge variant="secondary">
                  <span className="mr-1">75%</span>
                  <ArrowUpRight className="inline-block h-3 w-3" />
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Clients fidèles</span>
                </div>
                <Badge variant="secondary">
                  <span className="mr-1">40%</span>
                  <ArrowUpRight className="inline-block h-3 w-3" />
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Nouveaux clients</span>
                </div>
                <Badge variant="secondary">
                  <span className="mr-1">10%</span>
                  <ArrowUpRight className="inline-block h-3 w-3" />
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recommandations</CardTitle>
            <CardDescription>Conseils pour améliorer vos campagnes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div>
                  <Badge variant="outline">A/B Testing</Badge>
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">Testez différents objets d'email</p>
                  <p className="text-sm text-muted-foreground">
                    Variez vos objets d'email pour identifier ce qui attire le plus l'attention.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div>
                  <Badge variant="outline">Personnalisation</Badge>
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">Personnalisez vos messages</p>
                  <p className="text-sm text-muted-foreground">
                    Utilisez le nom de vos clients pour créer un lien plus personnel.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div>
                  <Badge variant="outline">Segmentation</Badge>
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">Segmentez vos listes</p>
                  <p className="text-sm text-muted-foreground">
                    Envoyez des messages ciblés en fonction des intérêts de vos clients.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
