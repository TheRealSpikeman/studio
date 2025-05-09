// src/app/dashboard/homework-assistance/tutors/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users2, CalendarClock, Search, Filter } from 'lucide-react';
import Link from 'next/link';

// Dummy data for tutors - replace with actual data fetching
const dummyTutors = [
  { id: 'tutor1', name: 'Mevr. Jansen', subject: 'Wiskunde', experience: '5 jaar ervaring, gespecialiseerd in examenvoorbereiding.', rating: 4.8, avatarUrl: 'https://picsum.photos/seed/tutorJansen/100/100' },
  { id: 'tutor2', name: 'Dhr. Pietersen', subject: 'Nederlands', experience: 'Docent Nederlands met passie voor literatuur en grammatica.', rating: 4.5, avatarUrl: 'https://picsum.photos/seed/tutorPietersen/100/100' },
  { id: 'tutor3', name: 'Dr. El Amrani', subject: 'Engels & Biologie', experience: 'Gepromoveerd bioloog, geeft ook bijles Engels.', rating: 4.9, avatarUrl: 'https://picsum.photos/seed/tutorElAmrani/100/100' },
];

export default function TutorBookingPage() {
  // State for filters, selected tutor, booking steps etc. would go here
  // For now, it's a placeholder.

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Users2 className="h-8 w-8 text-primary" />
                1-op-1 Begeleiding
                </h1>
                <p className="text-muted-foreground">
                Boek hier een persoonlijke sessie met een van onze gecertificeerde tutors.
                </p>
            </div>
             <Button variant="outline" asChild>
                <Link href="/dashboard/homework-assistance">
                    Terug naar Huiswerk Tools
                </Link>
            </Button>
        </div>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            Vind jouw perfecte tutor
          </CardTitle>
          <CardDescription>
            Filter op vak, beschikbaarheid en meer om de juiste match te vinden. (Deze functionaliteit is in ontwikkeling)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1" disabled>
              <Filter className="mr-2 h-4 w-4" /> Filter op Vak (binnenkort)
            </Button>
            <Button variant="outline" className="flex-1" disabled>
              <CalendarClock className="mr-2 h-4 w-4" /> Filter op Beschikbaarheid (binnenkort)
            </Button>
          </div>
          
          <div className="space-y-6">
            {dummyTutors.map(tutor => (
              <Card key={tutor.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 hover:shadow-md transition-shadow">
                <img src={tutor.avatarUrl} alt={tutor.name} className="w-20 h-20 rounded-full object-cover" data-ai-hint="tutor person" />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-primary">{tutor.name}</h3>
                  <p className="text-sm font-medium text-muted-foreground">Vak: {tutor.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1">{tutor.experience}</p>
                  <p className="text-xs text-muted-foreground">Beoordeling: {tutor.rating}/5 ★</p>
                </div>
                <Button className="w-full sm:w-auto" disabled>
                  Bekijk Profiel & Boek (binnenkort)
                </Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

       <Card className="shadow-md">
        <CardHeader>
            <CardTitle>Hoe het werkt (Binnenkort)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground">
            <p>1. <strong>Kies een vak:</strong> Selecteer het vak waarvoor je hulp nodig hebt.</p>
            <p>2. <strong>Selecteer een tutor:</strong> Bekijk profielen en kies een tutor die bij je past.</p>
            <p>3. <strong>Plan je sessie:</strong> Kies een datum en tijd uit de beschikbaarheid van de tutor.</p>
            <p>4. <strong>Bevestig & Betaal:</strong> Rond de boeking af (ouderlijke toestemming vereist indien &lt;18).</p>
            <p>5. <strong>Start je sessie:</strong> Ontmoet je tutor online via onze beveiligde video-omgeving.</p>
        </CardContent>
       </Card>
    </div>
  );
}
