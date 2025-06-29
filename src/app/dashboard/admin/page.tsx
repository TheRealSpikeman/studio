// src/app/dashboard/admin/page.tsx
"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Briefcase, Euro, Clock, LineChart, PieChart as PieChartIcon, BarChart } from '@/lib/icons';
import { DUMMY_USERS } from '@/lib/data/dummy-data';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Chart component logic integrated here
const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', '#a3e635', '#60a5fa'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    if (percent < 0.05) return null; // Don't render labels for tiny slices
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};


export default function AdminDashboardPage() {
  
  const kpiData = useMemo(() => {
    const students = DUMMY_USERS.filter(u => u.role === 'leerling');
    const tutors = DUMMY_USERS.filter(u => u.role === 'tutor');
    
    const totalRevenue = tutors.reduce((sum, tutor) => {
      const revenue = tutor.tutorDetails?.totalRevenue ?? 0;
      return sum + revenue;
    }, 0);

    const ageCounts = students.reduce((acc, student) => {
      const group = student.ageGroup || 'Onbekend';
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ageDistributionData = Object.entries(ageCounts).map(([name, value]) => ({
      name: name === 'Onbekend' ? name : `${name} jaar`,
      value,
    }));

    return {
      totalStudents: students.length,
      totalTutors: tutors.length,
      totalRevenue: totalRevenue,
      sessionsToday: 32, // This remains static for now
      ageDistributionData,
    };
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Admin Dashboard Overzicht</h1>
        <p className="text-muted-foreground">
          Een overzicht van de belangrijkste statistieken en activiteiten op het platform.
        </p>
      </section>

      {/* KPI Cards Section */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
            <p className="text-xs text-muted-foreground">10 gepland, 22 voltooid</p>
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
            <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground italic">Grafiek placeholder: Sessies per Dag</p>
            </div>
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
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={kpiData.ageDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                    >
                        {kpiData.ageDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                        }}
                    />
                    <Legend iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <BarChart className="h-5 w-5 text-primary" />
                Omzet per Tutor/Vak
            </CardTitle>
            <CardDescription>Top presterende tutors en meest populaire vakken.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground italic">Grafiek placeholder: Omzet per Tutor/Vak</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
