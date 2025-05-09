// src/app/dashboard/tutor/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, BookOpen, Users, Settings, DollarSign, FileText } from 'lucide-react';

export default function TutorDashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Tutor Dashboard</h1>
        <p className="text-muted-foreground">
          Beheer hier je beschikbaarheid, geplande lessen, leerlingen en profiel.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-primary" />
              Beschikbaarheid Beheren
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Stel je werkuren en uurtarief in.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Beheer Beschikbaarheid (binnenkort)
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Geplande Online Lessen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Bekijk je agenda met geboekte sessies.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Bekijk Lessen (binnenkort)
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Leerlingvoortgang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Houd notities en voortgang per leerling bij.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Bekijk Leerlingen (binnenkort)
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              Profiel & Documenten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Update je CV, VOG en betaalgegevens.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Beheer Profiel (binnenkort)
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-primary" />
              Verdiensten & Uitbetalingen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Bekijk je factuurhistorie en verdiende bedragen.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Bekijk Verdiensten (binnenkort)
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Mijn Beoordelingen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Lees feedback van leerlingen die je hebt geholpen.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Bekijk Beoordelingen (binnenkort)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
