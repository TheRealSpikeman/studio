// src/app/dashboard/admin/page.tsx
"use client";

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Briefcase, Euro, Clock, LineChart, PieChart as PieChartIcon, BarChart as BarChartIcon, Activity } from '@/lib/icons';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

// --- CHART COMPONENTS (DEFINED IN-FILE FOR DYNAMIC IMPORT) ---

// Helper types for chart data
interface SessionsData { date: string; voltooid: number; gepland: number; }
interface AgeData { name: string; value: number; }
interface RevenueData { name: string; omzet: number; }

// 1. Age Distribution Chart Component
const AGE_CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const AgeDistributionChartComponent = ({ data }: { data: AgeData[] }) => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={AGE_CHART_COLORS[index % AGE_CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }} />
        <Legend iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
);

// 2. Sessions Chart Component
const sessionsChartConfig = {
  voltooid: { label: "Voltooid", color: "hsl(var(--primary))" },
  gepland: { label: "Gepland", color: "hsl(var(--secondary))" },
} satisfies ChartConfig;
const SessionsChartComponent = ({ data }: { data: SessionsData[] }) => (
    <ChartContainer config={sessionsChartConfig} className="h-[300px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 5)} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <Bar dataKey="voltooid" fill="var(--color-voltooid)" radius={4} />
        <Bar dataKey="gepland" fill="var(--color-gepland)" radius={4} />
        <ChartLegend content={<ChartLegendContent payload={[]} />} />
      </BarChart>
    </ChartContainer>
);

// 3. Revenue by Tutor Chart Component
const revenueByTutorChartConfig = {
  omzet: { label: "Omzet", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;
const RevenueByTutorChartComponent = ({ data }: { data: RevenueData[] }) => (
    <ChartContainer config={revenueByTutorChartConfig} className="h-[300px] w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
        <CartesianGrid horizontal={false} />
        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} tick={{ fontSize: 12 }} />
        <XAxis dataKey="omzet" type="number" hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" formatter={(value) => `€${Number(value).toLocaleString('nl-NL')}`}/>} />
        <Bar dataKey="omzet" fill="var(--color-omzet)" radius={4}>
          <LabelList dataKey="omzet" position="right" offset={8} className="fill-foreground text-sm" formatter={(value: any) => `€${value.toLocaleString('nl-NL')}`} />
        </Bar>
      </BarChart>
    </ChartContainer>
);

// --- DYNAMIC IMPORTS OF THE ABOVE COMPONENTS ---

const ChartSkeleton = () => <Skeleton className="h-[300px] w-full" />;

const AgeDistributionChart = dynamic(() => Promise.resolve(AgeDistributionChartComponent), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
const SessionsChart = dynamic(() => Promise.resolve(SessionsChartComponent), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});
const RevenueByTutorChart = dynamic(() => Promise.resolve(RevenueByTutorChartComponent), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});


// --- MAIN DASHBOARD PAGE COMPONENT ---
export default function AdminDashboardPage() {
  
  // NOTE: This component previously contained a large amount of hardcoded data.
  // This has been removed to reduce the project's disk space and fix startup issues.
  // In a real application, the `kpiData` would be fetched from a service that
  // reads from a database. For now, we'll use placeholder values.
  const kpiData = {
      totalStudents: 125,
      totalTutors: 25,
      totalUsers: 150,
      activeUsers: 88,
      totalRevenue: 75230.50,
      sessionsToday: 5,
      ageDistributionData: [
          { name: '12-14 jaar', value: 40 },
          { name: '15-18 jaar', value: 60 }
      ],
      sessionsPerDayData: [
          { date: '17/06', voltooid: 5, gepland: 2 },
          { date: '18/06', voltooid: 7, gepland: 3 },
      ],
      topTutorsByRevenue: [
          { name: 'Anna', omzet: 1250 },
          { name: 'Mark', omzet: 980 },
          { name: 'Sofia', omzet: 870 },
      ]
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Admin Dashboard Overzicht</h1>
        <p className="text-muted-foreground">
          Een overzicht van de belangrijkste statistieken en activiteiten op het platform.
        </p>
      </section>

      {/* KPI Cards Section */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Aantal Leerlingen</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalStudents.toLocaleString('nl-NL')}</div>
            <p className="text-xs text-muted-foreground">+5% sinds vorige maand</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Aantal Tutors</CardTitle>
            <Briefcase className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalTutors.toLocaleString('nl-NL')}</div>
            <p className="text-xs text-muted-foreground">+2 nieuwe deze week</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Aantal Gebruikers</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalUsers.toLocaleString('nl-NL')}</div>
            <p className="text-xs text-muted-foreground">Alle rollen gecombineerd</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Gebruikers (30d)</CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Gebruikers die recent hebben ingelogd</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Omzet (laatste 30d)</CardTitle>
            <Euro className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{kpiData.totalRevenue.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">+12% sinds vorige maand</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessies Vandaag</CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.sessionsToday}</div>
            <p className="text-xs text-muted-foreground">Sessies die vandaag plaatsvinden.</p>
          </CardContent>
        </Card>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <LineChart className="h-5 w-5 text-primary" />
                Sessies per Dag (laatste 30d)
            </CardTitle>
            <CardDescription>Trend van het aantal geplande en voltooide sessies.</CardDescription>
          </CardHeader>
          <CardContent>
            <SessionsChart data={kpiData.sessionsPerDayData} />
          </CardContent>
        </Card>
         <Card className="shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Leeftijdsverdeling Leerlingen
            </CardTitle>
            <CardDescription>Demografisch overzicht van de leerlingen op het platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <AgeDistributionChart data={kpiData.ageDistributionData} />
          </CardContent>
        </Card>
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <BarChartIcon className="h-5 w-5 text-primary" />
                Omzet per Tutor (laatste 30d)
            </CardTitle>
            <CardDescription>Top 5 presterende tutors op basis van omzet.</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueByTutorChart data={kpiData.topTutorsByRevenue} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
