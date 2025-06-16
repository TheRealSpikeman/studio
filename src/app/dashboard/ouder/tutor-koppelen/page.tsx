// src/app/dashboard/ouder/tutor-koppelen/page.tsx
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, User, Link2, Search, Filter, Star, BookOpen, Info, UserCheck, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { allHomeworkSubjects } from '@/lib/quiz-data/subject-data';

// Dummy data for children - in a real app, this would come from user's profile
const dummyChildren = [
  { id: 'child1', name: 'Sofie de Tester', active: true, avatarUrl: 'https://picsum.photos/seed/sofiechild/40/40', helpSubjects: ['wiskunde', 'nederlands'], leerdoelen: 'Beter leren plannen, Omgaan met faalangst', voorkeurTutor: 'Ervaring met HSP, Geduldig' },
  { id: 'child2', name: 'Max de Tester', active: true, avatarUrl: 'https://picsum.photos/seed/maxchild/40/40', helpSubjects: ['engels'], leerdoelen: 'Concentratie verbeteren', voorkeurTutor: 'Man, ervaring met motivatie' },
  { id: 'child3', name: 'Lisa Voorbeeld (inactief)', active: false, helpSubjects: [] }, // Example of inactive child
];

interface Tutor {
  id: string;
  name: string;
  avatarUrl?: string;
  specializations: string[]; // Array of subject IDs or names
  experienceYears: number;
  hourlyRate: number;
  shortBio: string;
  rating: number;
  availableSlots?: string[]; // e.g., "Ma 14:00-16:00", "Wo ochtend"
  reviewsCount?: number;
}

const dummyTutors: Tutor[] = [
  { id: 'tutor1', name: 'Mevr. A. Jansen', avatarUrl: 'https://picsum.photos/seed/tutorJansen/80/80', specializations: ['wiskunde', 'natuurkunde'], experienceYears: 5, hourlyRate: 35, shortBio: 'Geduldige wiskundedocent met focus op examenvoorbereiding.', rating: 4.8, reviewsCount: 23, availableSlots: ['Ma 16:00-18:00', 'Wo 14:00-17:00'] },
  { id: 'tutor2', name: 'Dhr. B. de Vries', avatarUrl: 'https://picsum.photos/seed/tutorDeVries/80/80', specializations: ['nederlands', 'engels'], experienceYears: 8, hourlyRate: 40, shortBio: 'Ervaren taaldocent, helpt met grammatica, spelling en schrijfvaardigheid.', rating: 4.9, reviewsCount: 31, availableSlots: ['Di 10:00-12:00', 'Do 15:00-18:00'] },
  { id: 'tutor3', name: 'Dr. C. El Amrani', avatarUrl: 'https://picsum.photos/seed/tutorElAmrani/80/80', specializations: ['biologie', 'scheikunde'], experienceYears: 3, hourlyRate: 38, shortBio: 'Bioloog met passie voor exacte vakken en wetenschappelijk denken.', rating: 4.6, reviewsCount: 15, availableSlots: ['Vr 13:00-16:00'] },
  { id: 'tutor4', name: 'Mw. D. Pieters', avatarUrl: 'https://picsum.photos/seed/tutorPieters/80/80', specializations: ['geschiedenis', 'aardrijkskunde', 'maatschappijleer'], experienceYears: 6, hourlyRate: 32, shortBio: 'Enthousiaste docent die context en overzicht biedt.', rating: 4.7, reviewsCount: 19 },
];

function KoppelTutorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const initialKindId = searchParams.get('kindId');
  const [selectedChildId, setSelectedChildId] = useState<string | undefined>(initialKindId || undefined);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>(dummyTutors);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  // Filter states
  const [vakFilter, setVakFilter] = useState<string>('all');
  const [ervaringFilter, setErvaringFilter] = useState<string>('all'); // e.g., '0-2', '3-5', '5+'
  
  const activeChildren = dummyChildren.filter(c => c.active);

  useEffect(() => {
    if (initialKindId && !activeChildren.find(c => c.id === initialKindId)) {
        toast({ title: "Kind niet gevonden", description: "Het geselecteerde kind is niet actief of bestaat niet.", variant: "destructive"});
        setSelectedChildId(undefined); // Reset if invalid initial child
    }
  }, [initialKindId, activeChildren, toast]);


  useEffect(() => {
    let tutors = dummyTutors;
    if (vakFilter !== 'all') {
      tutors = tutors.filter(t => t.specializations.includes(vakFilter));
    }
    if (ervaringFilter !== 'all') {
        const [minExp, maxExpStr] = ervaringFilter.split('-');
        const min = parseInt(minExp);
        const max = maxExpStr === '+' ? Infinity : parseInt(maxExpStr);
        tutors = tutors.filter(t => t.experienceYears >= min && (maxExpStr === '+' || t.experienceYears <= max));
    }
    setFilteredTutors(tutors);
  }, [vakFilter, ervaringFilter]);
  
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  const handleKoppelTutor = (tutor: Tutor) => {
    if (!selectedChildId) {
        toast({ title: "Selecteer een kind", description: "Kies eerst een kind om een tutor aan te koppelen.", variant: "destructive"});
        return;
    }
    const child = dummyChildren.find(c => c.id === selectedChildId);
    toast({
        title: "Tutor Gekoppeld (Simulatie)",
        description: `${tutor.name} is succesvol gekoppeld aan ${child?.name} voor ${tutor.specializations.join(', ')}. U kunt nu lessen plannen.`,
    });
    // In een echte app: API call om de koppeling op te slaan
    console.log(`Koppelen: Kind ${child?.name} (ID: ${selectedChildId}) aan Tutor ${tutor.name} (ID: ${tutor.id})`);
    setSelectedTutor(null); 
  };
  
  const selectedChildDetails = selectedChildId ? dummyChildren.find(c => c.id === selectedChildId) : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Link2 className="h-8 w-8 text-primary" />
            Kind aan Tutor Koppelen
          </h1>
          <p className="text-muted-foreground">
            Selecteer een kind en vind een geschikte tutor.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/ouder">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Ouder Dashboard
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>1. Selecteer Kind</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Label htmlFor="select-kind">Voor welk kind zoek je een tutor?</Label>
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger id="select-kind" className="mt-1">
                <SelectValue placeholder="Kies een kind" />
              </SelectTrigger>
              <SelectContent>
                {activeChildren.map(child => (
                  <SelectItem key={child.id} value={child.id}>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 text-xs">
                            <AvatarImage src={child.avatarUrl} alt={child.name} data-ai-hint="child person" />
                            <AvatarFallback>{getInitials(child.name)}</AvatarFallback>
                        </Avatar>
                        {child.name}
                    </div>
                  </SelectItem>
                ))}
                 {activeChildren.length === 0 && (
                    <SelectItem value="no-active-children" disabled>Geen actieve kinderen gevonden</SelectItem>
                 )}
              </SelectContent>
            </Select>
          </div>
          {selectedChildDetails && (
            <Card className="mt-4 p-4 bg-primary/5 border-primary/20">
                <CardTitle className="text-md font-semibold text-primary flex items-center gap-2 mb-1">
                    <User className="h-5 w-5"/>
                    {selectedChildDetails.name} - Voorkeuren
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                    <strong>Hulp nodig bij:</strong> {selectedChildDetails.helpSubjects?.join(', ') || 'N.v.t.'} <br/>
                    <strong>Leerdoelen:</strong> {selectedChildDetails.leerdoelen || 'N.v.t.'} <br/>
                    <strong>Tutor voorkeur:</strong> {selectedChildDetails.voorkeurTutor || 'N.v.t.'}
                </p>
                <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1" asChild>
                  <Link href={`/dashboard/ouder/kinderen`}>Bewerk profiel & voorkeuren</Link>
                </Button>
            </Card>
          )}
        </CardContent>
      </Card>

      {selectedChildId && (
        <section className="mt-8 space-y-6">
            <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary"/>
                <h2 className="text-xl font-semibold text-foreground">Vind Beschikbare Tutors</h2>
            </div>
            <p className="text-muted-foreground">Filter op vak en ervaring om de beste match te vinden.</p>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vak-filter">Filter op Vak</Label>
                <Select value={vakFilter} onValueChange={setVakFilter}>
                    <SelectTrigger id="vak-filter"><SelectValue placeholder="Alle vakken"/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Alle Vakken</SelectItem>
                        {allHomeworkSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ervaring-filter">Filter op Ervaring</Label>
                <Select value={ervaringFilter} onValueChange={setErvaringFilter}>
                    <SelectTrigger id="ervaring-filter"><SelectValue placeholder="Alle ervaring"/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Alle Ervaringsniveaus</SelectItem>
                        <SelectItem value="0-2">0-2 jaar</SelectItem>
                        <SelectItem value="3-5">3-5 jaar</SelectItem>
                        <SelectItem value="5+">5+ jaar</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>

            {filteredTutors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                {filteredTutors.map(tutor => (
                  <Card key={tutor.id} className={`flex flex-col ${selectedTutor?.id === tutor.id ? 'border-2 border-primary ring-2 ring-primary/30' : 'hover:shadow-md'}`}>
                    <CardHeader className="items-center text-center">
                        <Avatar className="h-20 w-20 mb-2">
                            <AvatarImage src={tutor.avatarUrl} alt={tutor.name} data-ai-hint="tutor person" />
                            <AvatarFallback>{getInitials(tutor.name)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg">{tutor.name}</CardTitle>
                        <div className="flex items-center gap-0.5 text-yellow-500">
                            {Array.from({length: Math.floor(tutor.rating)}).map((_, i) => <Star key={`fs-${i}`} className="h-4 w-4 fill-current"/>)}
                            {tutor.rating % 1 !== 0 && <Star key="hs" className="h-4 w-4 fill-current opacity-50"/>}
                            {Array.from({length: 5 - Math.ceil(tutor.rating)}).map((_, i) => <Star key={`es-${i}`} className="h-4 w-4 text-muted-foreground/30 fill-current"/>)}
                            <span className="text-xs text-muted-foreground ml-1">({tutor.reviewsCount || 0})</span>
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground text-center space-y-1 flex-grow">
                      <p><strong>Specialisaties:</strong> {tutor.specializations.map(id => allHomeworkSubjects.find(s=>s.id===id)?.name || id).join(', ')}</p>
                      <p><strong>Ervaring:</strong> {tutor.experienceYears} jaar</p>
                      <p><strong>Tarief:</strong> €{tutor.hourlyRate}/uur</p>
                      <p className="text-xs pt-1 italic">"{tutor.shortBio}"</p>
                      {tutor.availableSlots && tutor.availableSlots.length > 0 && (
                        <div className="pt-2">
                            <p className="text-xs font-medium">Direct beschikbaar (voorbeeld):</p>
                            {tutor.availableSlots.slice(0,2).map(slot => <Badge key={slot} variant="outline" className="mr-1 mt-1 text-xs">{slot}</Badge>)}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex-col gap-2 pt-3">
                        <Button variant="outline" size="sm" className="w-full" disabled>
                            <MessageSquare className="mr-2 h-4 w-4"/> Stuur bericht (binnenkort)
                        </Button>
                        <Button size="sm" className="w-full" onClick={() => handleKoppelTutor(tutor)}>
                            <UserCheck className="mr-2 h-4 w-4"/> Koppelen aan {selectedChildDetails?.name}
                        </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">Geen tutors gevonden die voldoen aan de criteria. Probeer andere filters.</p>
            )}
        </section>
      )}
       <Card className="shadow-md bg-blue-50 border-blue-200">
          <CardHeader>
              <CardTitle className="text-blue-700 text-md flex items-center gap-2"><Info className="h-5 w-5"/>Hoe werkt het koppelen?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-600 space-y-1">
              <p>1. Selecteer het kind voor wie u een tutor zoekt.</p>
              <p>2. Gebruik de filters om de lijst met tutors te verfijnen op basis van vak en ervaring.</p>
              <p>3. Bekijk de profielen van de tutors. Let op specialisaties, ervaring, tarief en beschikbaarheid.</p>
              <p>4. Klik op "Koppelen aan [Kindnaam]" om de tutor direct aan uw kind te koppelen. De tutor ontvangt een notificatie.</p>
              <p>5. (Binnenkort) Stuur eerst een bericht om kennis te maken of vragen te stellen voordat u koppelt.</p>
              <p>6. Na koppeling kunt u lessen plannen via de "Les Plannen" pagina.</p>
          </CardContent>
      </Card>
    </div>
  );
}

export default function KoppelTutorPage() {
  return (
    <Suspense fallback={<div>Pagina laden...</div>}>
      <KoppelTutorContent />
    </Suspense>
  );
}

