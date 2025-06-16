// src/app/dashboard/ouder/page.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Users, Settings, BookOpenCheck, DollarSign, Contact } from 'lucide-react'; // Added Contact and DollarSign
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OuderDashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Ouder Dashboard</h1>
        <p className="text-muted-foreground">
          Welkom! Beheer hier de profielen, lessen en abonnementen van uw kinderen.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Contact className="h-5 w-5 text-primary"/>Mijn Kinderen</CardTitle>
            <CardDescription>Bekijk en beheer de profielen en voortgang van uw kinderen.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Voeg kinderen toe, bewerk hun gegevens en volg hun quizresultaten en coachingstrajecten.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>Beheer Kinderen (binnenkort)</Button>
          </CardFooter>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpenCheck className="h-5 w-5 text-primary"/>Lessen Plannen & Beheren</CardTitle>
            <CardDescription>Plan en beheer de bijlessen voor uw kinderen.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Zoek en boek sessies bij gekwalificeerde tutors, bekijk de leshistorie en geef feedback.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>Plan Lessen (binnenkort)</Button>
          </CardFooter>
        </Card>
         <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary"/>Abonnementen & Betaling</CardTitle>
            <CardDescription>Beheer de abonnementen voor de coaching-hub en bijlessen.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Bekijk actieve abonnementen, betaalgeschiedenis en pas betaalmethoden aan.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>Beheer Abonnementen (binnenkort)</Button>
          </CardFooter>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary"/>Accountinstellingen</CardTitle>
            <CardDescription>Beheer uw eigen accountgegevens.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Update uw profiel, wijzig uw wachtwoord en beheer communicatievoorkeuren.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full"><Link href="/dashboard/profile">Mijn Instellingen</Link></Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
