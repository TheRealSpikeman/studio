// src/app/dashboard/admin/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Briefcase, Euro, CalendarClock, LineChart, PieChart, BarChart } from 'lucide-react';

// Dummy data for KPIs - replace with actual data fetching
const kpiData = {
  totalStudents: 1250,
  totalTutors: 75,
  totalRevenue: 45000, // Example in EUR
  sessionsToday: 32,
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard Overzicht</h1>
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
            <CalendarClock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.sessionsToday}</div>
            <p className="text-xs text-muted-foreground">10 gepland, 22 voltooid</p>
          </CardContent>
        </Card>
      </section>

      {/* Charts Section - Placeholders */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Leeftijdsverdeling Leerlingen
            </CardTitle>
            <CardDescription>Demografisch overzicht van de leerlingen op het platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground italic">Grafiek placeholder: Leeftijdsverdeling</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}