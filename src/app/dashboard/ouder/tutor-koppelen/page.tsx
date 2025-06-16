
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
import { ArrowLeft, User, Link2, Search, Filter, Star, BookOpen, Info, UserCheck, MessageSquare, FileText, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { allHomeworkSubjects } from '@/lib/quiz-data/subject-data';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';

// Dummy data for children - in a real app, this would come from user's profile
const dummyChildren = [
  { id: 'child1', name: 'Sofie de Tester', active: true, avatarUrl: 'https://picsum.photos/seed/sofiechild/40/40', helpSubjects: ['wiskunde', 'nederlands'], leerdoelen: 'Beter leren plannen, Omgaan met faalangst', voorkeurTutor: 'Ervaring met HSP, Geduldig' },
  { id: 'child2', name: 'Max de Tester', active: true, avatarUrl: 'https://picsum.photos/seed/maxchild/40/40', helpSubjects: ['engels', 'geschiedenis'], leerdoelen: 'Concentratie verbeteren', voorkeurTutor: 'Man, ervaring met motivatie' },
  { id: 'child3', name: 'Lisa Voorbeeld (inactief)', active: false, helpSubjects: [] },
];

interface Review {
  reviewerName: string;
  rating: number;
  comment: string;
  date: string; // ISO Date string
}

interface Tutor {
  id: string;
  name: string;
  avatarUrl?: string;
  specializations: string[]; 
  experienceYears: number;
  hourlyRate: number;
  shortBio: string;
  fullBio: string;
  education?: string;
  teachingPhilosophy?: string;
  cvUrl?: string; 
  rating: number;
  availableSlots?: string[]; 
  reviewsCount?: number;
  reviews?: Review[];
}

const dummyTutors: Tutor[] = [
  { 
    id: 'tutor1', name: 'Mevr. A. Jansen', avatarUrl: 'https://picsum.photos/seed/tutorJansen/80/80', 
    specializations: ['wiskunde', 'natuurkunde'], experienceYears: 5, hourlyRate: 35, 
    shortBio: 'Geduldige wiskundedocent met focus op examenvoorbereiding.', 
    fullBio: 'Als ervaren wiskunde- en natuurkundedocent help ik leerlingen al meer dan 5 jaar om complexe concepten te begrijpen en zelfvertrouwen op te bouwen. Ik ben gespecialiseerd in examenvoorbereiding (VMBO-T t/m VWO) en werk graag met leerlingen die extra structuur of een andere uitleg nodig hebben. Mijn aanpak is geduldig, positief en gericht op het ontdekken van de eigen kracht van de leerling.',
    education: "Master Didactiek der Exacte Vakken, Universiteit van Amsterdam",
    teachingPhilosophy: "Iedere leerling kan slagen met de juiste begeleiding en motivatie. Ik focus op begrip in plaats van stampen.",
    cvUrl: "/placeholder-cv-jansen.pdf",
    rating: 4.8, reviewsCount: 23, 
    availableSlots: ['Ma 16:00-18:00', 'Wo 14:00-17:00'],
    reviews: [
        { reviewerName: "Ouder van Bram (15jr)", rating: 5, comment: "Mevr. Jansen heeft onze zoon enorm geholpen met zijn wiskunde. Hij gaat nu met veel meer zelfvertrouwen naar de toetsen!", date: new Date(Date.now() - 10 * 86400000).toISOString() },
        { reviewerName: "Anoniem (Leerling, 17jr)", rating: 4, comment: "Goede uitleg, soms wel wat snel. Maar ze is geduldig als je het nog niet snapt.", date: new Date(Date.now() - 25 * 86400000).toISOString() },
    ]
  },
  { 
    id: 'tutor2', name: 'Dhr. B. de Vries', avatarUrl: 'https://picsum.photos/seed/tutorDeVries/80/80', 
    specializations: ['nederlands', 'engels'], experienceYears: 8, hourlyRate: 40, 
    shortBio: 'Ervaren taaldocent, helpt met grammatica, spelling en schrijfvaardigheid.', 
    fullBio: 'Met 8 jaar ervaring als docent Nederlands en Engels (eerstegraads bevoegdheid) ondersteun ik leerlingen bij alle aspecten van taal: van grammatica en spelling tot tekstbegrip en schrijfvaardigheid. Ik heb ervaring met diverse leerstijlen en niveaus.',
    education: "Lerarenopleiding Nederlands & Engels (1e graads), Hogeschool Utrecht",
    teachingPhilosophy: "Taal is een sleutel tot de wereld. Ik help leerlingen die sleutel met plezier en vertrouwen te gebruiken.",
    rating: 4.9, reviewsCount: 31, 
    availableSlots: ['Di 10:00-12:00', 'Do 15:00-18:00'],
    reviews: [
        { reviewerName: "Familie El Idrissi", rating: 5, comment: "Dhr. de Vries is een topper! Onze dochter haar cijfers voor Engels zijn flink omhoog gegaan.", date: new Date(Date.now() - 5 * 86400000).toISOString() },
    ]
  },
  { 
    id: 'tutor3', name: 'Dr. C. El Amrani', avatarUrl: 'https://picsum.photos/seed/tutorElAmrani/80/80', 
    specializations: ['biologie', 'scheikunde'], experienceYears: 3, hourlyRate: 38, 
    shortBio: 'Bioloog met passie voor exacte vakken en wetenschappelijk denken.',
    fullBio: 'Als gepromoveerd bioloog deel ik mijn passie voor de exacte vakken graag met leerlingen. Ik bied ondersteuning voor biologie en scheikunde op alle middelbare schoolniveaus, met een focus op het ontwikkelen van analytisch en wetenschappelijk denken.',
    rating: 4.6, reviewsCount: 15, 
    availableSlots: ['Vr 13:00-16:00'] 
  },
  { 
    id: 'tutor4', name: 'Mw. D. Pieters', avatarUrl: 'https://picsum.photos/seed/tutorPieters/80/80', 
    specializations: ['geschiedenis', 'aardrijkskunde', 'maatschappijleer'], experienceYears: 6, hourlyRate: 32, 
    shortBio: 'Enthousiaste docent die context en overzicht biedt.',
    fullBio: 'Geschiedenis en aardrijkskunde zijn meer dan feiten; het gaat om het begrijpen van de wereld om ons heen. Ik help leerlingen verbanden te zien en kritisch te denken over maatschappelijke thema\'s.',
    rating: 4.7, reviewsCount: 19 
  },
  { 
    id: 'tutor5', name: 'Dhr. E. Willems', avatarUrl: 'https://picsum.photos/seed/tutorWillems/80/80', 
    specializations: ['wiskunde', 'engels'], experienceYears: 2, hourlyRate: 30, 
    shortBio: 'Jonge, energieke tutor, goed met basis wiskunde en Engels.',
    fullBio: 'Recent afgestudeerd en vol frisse energie om leerlingen te helpen met de basis van wiskunde en Engels. Ik sluit goed aan bij de belevingswereld van jongeren.',
    rating: 4.5, reviewsCount: 10 
  },
];

const LOCAL_STORAGE_LINKED_TUTORS_KEY = 'linkedTutorsByChild'; // Key voor localStorage

function KoppelTutorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const initialKindId = searchParams.get('kindId');
  const [selectedChildId, setSelectedChildId] = useState<string | undefined>(initialKindId || undefined);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>(dummyTutors);
  const [selectedTutorForModal, setSelectedTutorForModal] = useState<Tutor | null>(null);
  const [isTutorDetailModalOpen, setIsTutorDetailModalOpen] = useState(false);
  const [linkedTutorsMap, setLinkedTutorsMap] = useState<Record<string, string[]>>({}); // kindId: [tutorId1, tutorId2]

  const [vakFilter, setVakFilter] = useState<string>('all');
  const [ervaringFilter, setErvaringFilter] = useState<string>('all');
  
  const activeChildren = dummyChildren.filter(c => c.active);
  const selectedChildDetails = selectedChildId ? dummyChildren.find(c => c.id === selectedChildId) : null;

  // Load linked tutors from localStorage
  useEffect(() => {
    try {
      const storedMap = localStorage.getItem(LOCAL_STORAGE_LINKED_TUTORS_KEY);
      if (storedMap) {
        setLinkedTutorsMap(JSON.parse(storedMap));
      }
    } catch (error) {
      console.error("Error loading linked tutors map from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    if (initialKindId && !activeChildren.find(c => c.id === initialKindId)) {
        toast({ title: "Kind niet gevonden", description: "Het geselecteerde kind is niet actief of bestaat niet.", variant: "destructive"});
        setSelectedChildId(undefined); 
    }
  }, [initialKindId, activeChildren, toast]);

  useEffect(() => {
    let tutorsSource = dummyTutors;
    let tempFilteredTutors = tutorsSource;

    if (vakFilter === 'all' && selectedChildDetails && selectedChildDetails.helpSubjects && selectedChildDetails.helpSubjects.length > 0) {
      tempFilteredTutors = tempFilteredTutors.filter(tutor =>
        selectedChildDetails.helpSubjects!.some(childSub => tutor.specializations.includes(childSub))
      );
    } else if (vakFilter !== 'all') {
      tempFilteredTutors = tempFilteredTutors.filter(t => t.specializations.includes(vakFilter));
    }

    if (ervaringFilter !== 'all') {
        const [minExp, maxExpStr] = ervaringFilter.split('-');
        const min = parseInt(minExp);
        const max = maxExpStr === '+' ? Infinity : parseInt(maxExpStr);
        tempFilteredTutors = tempFilteredTutors.filter(t => t.experienceYears >= min && (maxExpStr === '+' || t.experienceYears <= max));
    }
    setFilteredTutors(tempFilteredTutors);
  }, [vakFilter, ervaringFilter, selectedChildDetails]);
  
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  const handleKoppelTutor = (tutorToLink: Tutor) => {
    if (!selectedChildId) {
        toast({ title: "Selecteer een kind", description: "Kies eerst een kind om een tutor aan te koppelen.", variant: "destructive"});
        return;
    }
    const child = dummyChildren.find(c => c.id === selectedChildId);
    
    setLinkedTutorsMap(prevMap => {
      const currentLinkedForChild = prevMap[selectedChildId] || [];
      if (currentLinkedForChild.includes(tutorToLink.id)) {
        toast({ title: "Al Gekoppeld", description: `${tutorToLink.name} is al gekoppeld aan ${child?.name}.`, variant: "default" });
        return prevMap; // No change
      }
      const updatedMap = {
        ...prevMap,
        [selectedChildId]: [...currentLinkedForChild, tutorToLink.id],
      };
      localStorage.setItem(LOCAL_STORAGE_LINKED_TUTORS_KEY, JSON.stringify(updatedMap));
      toast({
        title: "Tutor Gekoppeld!",
        description: `${tutorToLink.name} is succesvol gekoppeld aan ${child?.name}. U kunt nu lessen plannen via "Gekoppelde Tutors" of "Les Plannen".`,
        action: (
          <Button variant="link" size="sm" asChild>
            <Link href="/dashboard/ouder/gekoppelde-tutors">Bekijk Gekoppelde Tutors</Link>
          </Button>
        )
      });
      return updatedMap;
    });
    setIsTutorDetailModalOpen(false);
  };

  const handleViewProfile = (tutor: Tutor) => {
    setSelectedTutorForModal(tutor);
    setIsTutorDetailModalOpen(true);
  };

  const isTutorLinkedToSelectedChild = (tutorId: string): boolean => {
    if (!selectedChildId) return false;
    return !!(linkedTutorsMap[selectedChildId] && linkedTutorsMap[selectedChildId].includes(tutorId));
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Link2 className="h-8 w-8 text-primary" />
            Tutor Zoeken & Koppelen
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
                    {selectedChildDetails.name} - Voorkeuren & Hulpvragen
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
            <p className="text-muted-foreground">Filter op vak en ervaring om de beste match te vinden. De lijst toont automatisch tutors die passen bij de "Hulp nodig bij" vakken van {selectedChildDetails?.name || 'het geselecteerde kind'}, tenzij u een specifiek vak filtert.</p>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vak-filter">Filter op Specifiek Vak</Label>
                <Select value={vakFilter} onValueChange={setVakFilter}>
                    <SelectTrigger id="vak-filter"><SelectValue placeholder="Alle passende vakken"/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Alle Passende Vakken (o.b.v. kind)</SelectItem>
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
                  <Card key={tutor.id} className={`flex flex-col ${isTutorLinkedToSelectedChild(tutor.id) ? 'border-2 border-green-500 ring-2 ring-green-500/30' : (selectedTutorForModal?.id === tutor.id ? 'border-2 border-primary ring-2 ring-primary/30' : 'hover:shadow-md')}`}>
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
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleViewProfile(tutor)}>
                            <Info className="mr-2 h-4 w-4"/>Bekijk Profiel & Reviews
                        </Button>
                        <Button variant="outline" size="sm" className="w-full" disabled>
                            <MessageSquare className="mr-2 h-4 w-4"/> Stuur bericht (binnenkort)
                        </Button>
                        <Button 
                            size="sm" 
                            className="w-full" 
                            onClick={() => handleKoppelTutor(tutor)}
                            disabled={isTutorLinkedToSelectedChild(tutor.id)}
                        >
                            <UserCheck className="mr-2 h-4 w-4"/> 
                            {isTutorLinkedToSelectedChild(tutor.id) ? 'Reeds Gekoppeld' : 'Koppel deze Tutor'}
                        </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">Geen tutors gevonden die voldoen aan de criteria. Probeer andere filters of pas de "Hulp nodig bij" vakken van {selectedChildDetails?.name} aan.</p>
            )}
        </section>
      )}
       <Card className="shadow-md bg-blue-50 border-blue-200">
          <CardHeader>
              <CardTitle className="text-blue-700 text-md flex items-center gap-2"><Info className="h-5 w-5"/>Hoe werkt het koppelen?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-600 space-y-1">
              <p>1. Selecteer het kind voor wie u een tutor zoekt.</p>
              <p>2. De lijst met tutors wordt automatisch gefilterd op basis van de vakken waar uw kind hulp bij nodig heeft (uit hun profiel). U kunt dit verder verfijnen met de filters.</p>
              <p>3. Klik op "Bekijk Profiel & Reviews" voor meer details over een tutor.</p>
              <p>4. Klik op "Koppel deze Tutor" om de tutor direct aan uw kind te koppelen. De tutor ontvangt een notificatie.</p>
              <p>5. (Binnenkort) Stuur eerst een bericht om kennis te maken of vragen te stellen voordat u koppelt.</p>
              <p>6. Na koppeling kunt u lessen plannen via de "Les Plannen" pagina of via het "Gekoppelde Tutors" overzicht.</p>
          </CardContent>
      </Card>

      <Dialog open={isTutorDetailModalOpen} onOpenChange={setIsTutorDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            {selectedTutorForModal && (
                <>
                    <DialogHeader className="text-center border-b pb-4">
                        <Avatar className="h-24 w-24 mx-auto mb-3">
                            <AvatarImage src={selectedTutorForModal.avatarUrl} alt={selectedTutorForModal.name} data-ai-hint="tutor person" />
                            <AvatarFallback className="text-3xl">{getInitials(selectedTutorForModal.name)}</AvatarFallback>
                        </Avatar>
                        <DialogTitle className="text-2xl font-bold">{selectedTutorForModal.name}</DialogTitle>
                        <div className="flex items-center justify-center gap-0.5 text-yellow-500">
                            {Array.from({length: Math.floor(selectedTutorForModal.rating)}).map((_, i) => <Star key={`fs-modal-${i}`} className="h-5 w-5 fill-current"/>)}
                            {selectedTutorForModal.rating % 1 !== 0 && <Star key="hs-modal" className="h-5 w-5 fill-current opacity-50"/>}
                            {Array.from({length: 5 - Math.ceil(selectedTutorForModal.rating)}).map((_, i) => <Star key={`es-modal-${i}`} className="h-5 w-5 text-muted-foreground/30 fill-current"/>)}
                            <span className="text-sm text-muted-foreground ml-1.5">({selectedTutorForModal.reviewsCount || 0} reviews)</span>
                        </div>
                    </DialogHeader>
                    <ScrollArea className="flex-grow px-1 py-2">
                        <div className="space-y-6 px-4 py-2">
                            <section>
                                <h3 className="font-semibold text-lg text-primary mb-1">Over Mij</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedTutorForModal.fullBio || selectedTutorForModal.shortBio}</p>
                            </section>
                            <Separator/>
                             <section>
                                <h3 className="font-semibold text-lg text-primary mb-2">Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <p><strong className="text-foreground">Specialisaties:</strong> {selectedTutorForModal.specializations.map(id => allHomeworkSubjects.find(s=>s.id===id)?.name || id).join(', ')}</p>
                                    <p><strong className="text-foreground">Ervaring:</strong> {selectedTutorForModal.experienceYears} jaar</p>
                                    <p><strong className="text-foreground">Tarief:</strong> €{selectedTutorForModal.hourlyRate}/uur</p>
                                    {selectedTutorForModal.education && <p className="sm:col-span-2"><strong className="text-foreground">Opleiding:</strong> {selectedTutorForModal.education}</p>}
                                    {selectedTutorForModal.teachingPhilosophy && <p className="sm:col-span-2"><strong className="text-foreground">Lesfilosofie:</strong> "{selectedTutorForModal.teachingPhilosophy}"</p>}
                                    {selectedTutorForModal.cvUrl && (
                                        <div className="sm:col-span-2">
                                            <strong className="text-foreground">CV:</strong> 
                                            <Button variant="link" size="sm" asChild className="p-0 h-auto ml-1"><a href={selectedTutorForModal.cvUrl} target="_blank" rel="noopener noreferrer">Bekijk CV (PDF)</a></Button>
                                        </div>
                                    )}
                                </div>
                            </section>
                            <Separator/>
                            <section>
                                <h3 className="font-semibold text-lg text-primary mb-2">Reviews</h3>
                                {selectedTutorForModal.reviews && selectedTutorForModal.reviews.length > 0 ? (
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                        {selectedTutorForModal.reviews.map((review, idx) => (
                                            <Card key={idx} className="p-3 bg-muted/50 text-xs">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <p className="font-semibold text-foreground">{review.reviewerName}</p>
                                                    <div className="flex items-center gap-0.5 text-yellow-500">
                                                        {Array.from({length: review.rating}).map((_, rIdx) => <Star key={`rev-s-${idx}-${rIdx}`} className="h-3.5 w-3.5 fill-current"/>)}
                                                        {Array.from({length: 5 - review.rating}).map((_, rIdx) => <Star key={`rev-es-${idx}-${rIdx}`} className="h-3.5 w-3.5 text-muted-foreground/30 fill-current"/>)}
                                                    </div>
                                                </div>
                                                <p className="italic text-muted-foreground">"{review.comment}"</p>
                                                <p className="text-right text-muted-foreground/80 mt-1"><FormattedDateCell isoDateString={review.date} dateFormatPattern="P" /></p>
                                            </Card>
                                        ))}
                                    </div>
                                ) : <p className="text-sm text-muted-foreground">Nog geen reviews.</p>}
                            </section>
                        </div>
                    </ScrollArea>
                    <DialogFooter className="pt-4 border-t flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => setIsTutorDetailModalOpen(false)} className="w-full sm:w-auto">Sluiten</Button>
                        <Button variant="secondary" disabled className="w-full sm:w-auto"><MessageSquare className="mr-2 h-4 w-4"/>Start Gesprek (binnenkort)</Button>
                        <Button 
                            onClick={() => handleKoppelTutor(selectedTutorForModal)} 
                            className="w-full sm:w-auto"
                            disabled={isTutorLinkedToSelectedChild(selectedTutorForModal.id)}
                        >
                            <UserCheck className="mr-2 h-4 w-4"/> 
                            {isTutorLinkedToSelectedChild(selectedTutorForModal.id) ? 'Reeds Gekoppeld' : `Koppel aan ${selectedChildDetails?.name || 'kind'}`}
                        </Button>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>

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
