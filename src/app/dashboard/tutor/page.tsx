// src/app/dashboard/tutor/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, BookOpen, Users, Settings, DollarSign, FileText, AlertTriangle } from 'lucide-react';

// Simulate user data and role for redirection logic
// In a real app, this would come from an authentication context
const MOCKED_CURRENT_TUTOR = {
  isLoggedIn: true, // Assume logged in to reach this page
  role: 'tutor' as 'tutor' | 'admin', // Role must be tutor or admin
  status: 'actief' as 'pending_onboarding' | 'pending_approval' | 'actief' | 'rejected', // Current status of the tutor
  // status: 'pending_onboarding' as 'pending_onboarding' | 'pending_approval' | 'actief' | 'rejected', // Test onboarding
  // status: 'pending_approval' as 'pending_onboarding' | 'pending_approval' | 'actief' | 'rejected', // Test pending
};


export default function TutorDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!MOCKED_CURRENT_TUTOR.isLoggedIn || MOCKED_CURRENT_TUTOR.role !== 'tutor') {
      // router.push('/login'); // Or appropriate access denied page
      return;
    }

    if (MOCKED_CURRENT_TUTOR.status === 'pending_onboarding' || MOCKED_CURRENT_TUTOR.status === 'pending_approval') {
      router.replace('/dashboard/tutor/onboarding');
    }
  }, [router]);

  if (MOCKED_CURRENT_TUTOR.status === 'pending_onboarding' || MOCKED_CURRENT_TUTOR.status === 'pending_approval') {
    // Show a loading/redirecting state or null while redirect happens
    return (
        <div className="flex min-h-[calc(100vh-theme(space.16))] flex-col items-center justify-center p-8">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Profiel Laden...</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Een ogenblik geduld, we controleren je profielstatus.</p>
                </CardContent>
            </Card>
        </div>
    );
  }
  
  if (MOCKED_CURRENT_TUTOR.status === 'rejected') {
     return (
        <div className="flex min-h-[calc(100vh-theme(space.16))] flex-col items-center justify-center p-8 text-center">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
                    <CardTitle className="text-2xl text-destructive">Aanmelding Afgewezen</CardTitle>
                    <CardDescription>
                        Bedankt voor je interesse om tutor te worden. Helaas kunnen we je aanmelding op dit moment niet goedkeuren.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Neem contact op met <a href="mailto:support@mindnavigator.nl" className="text-primary hover:underline">support@mindnavigator.nl</a> voor meer informatie.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => router.push('/')} className="w-full">Terug naar home</Button>
                </CardFooter>
            </Card>
        </div>
    );
  }


  // Render actual dashboard content if status is 'actief'
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
