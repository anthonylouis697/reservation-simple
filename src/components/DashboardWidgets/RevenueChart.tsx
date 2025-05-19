
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for the revenue chart
const weeklyData = [
  { name: "Lun", revenue: 420 },
  { name: "Mar", revenue: 380 },
  { name: "Mer", revenue: 250 },
  { name: "Jeu", revenue: 310 },
  { name: "Ven", revenue: 590 },
  { name: "Sam", revenue: 720 },
  { name: "Dim", revenue: 0 }
];

const monthlyData = [
  { name: "Sem 1", revenue: 1420 },
  { name: "Sem 2", revenue: 1880 },
  { name: "Sem 3", revenue: 1250 },
  { name: "Sem 4", revenue: 1710 }
];

export const RevenueChart = () => {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const data = period === "week" ? weeklyData : monthlyData;

  const formatRevenue = (value: number) => {
    return `${value} €`;
  };

  const totalRevenue = data.reduce((sum, day) => sum + day.revenue, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenus</CardTitle>
            <CardDescription>Aperçu de vos revenus récents</CardDescription>
          </div>
          <Tabs defaultValue="week" value={period} onValueChange={(v) => setPeriod(v as "week" | "month")}>
            <TabsList>
              <TabsTrigger value="week">Semaine</TabsTrigger>
              <TabsTrigger value="month">Mois</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">{formatRevenue(totalRevenue)}</div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <Tooltip 
                formatter={(value) => [`${value} €`, "Revenus"]}
                contentStyle={{ 
                  backgroundColor: "white", 
                  border: "1px solid #e2e8f0"
                }}
              />
              <Bar 
                dataKey="revenue" 
                fill="rgba(99, 102, 241, 0.8)" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
