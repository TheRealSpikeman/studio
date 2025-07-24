// src/app/dashboard/ouder/zoek-professional/page.tsx
"use client";

import { useState, useEffect, Suspense, type FC } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, User, Link as LinkIcon, Search, Filter, Star, Info, UserCheck, MessageSquare, FileText, GraduationCap, Users, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { allHomeworkSubjects } from '@/lib/quiz-data/subject-data';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import type { User as UserType } from '@/types/user';

// --- DATA & TYPES ---

interface ChildFromParentDashboard extends Pick<UserType, 'id' | 'name' | 'avatarUrl' | 'helpSubjects' | 'hulpvraagType'> {
  active: boolean;
  leerdoelen?: string;
  voorkeurTutor?: string;
}

interface Review {
  reviewerName: string; rating: number; comment: string; date: string;
}

interface Professional {
  id: string; name: string; type: 'tutor' | 'coach'; avatarUrl?: string; specializations: string[];
  experienceYears: number; hourlyRate?: number; shortBio: string; fullBio: string;
  education?: string; teachingPhilosophy?: string; cvUrl?: string; rating: number;
  availableSlots?: string[]; reviewsCount?: number; reviews?: Review[];
}

const dummyChildren: ChildFromParentDashboard[] = [
  { id: 'child1', name: 'Sofie de Tester', active: true, avatarUrl: 'https://picsum.photos/seed/sofiechild/40/40', helpSubjects: ['wiskunde', 'nederlands'], hulpvraagType: ['tutor'], leerdoelen: 'Beter leren plannen, Omgaan met faalangst', voorkeurTutor: 'Ervaring met HSP, Geduldig' },
  { id: 'child2', name: 'Max de Tester', active: true, avatarUrl: 'https://picsum.photos/seed/maxchild/40/40', helpSubjects: ['engels', 'geschiedenis'], hulpvraagType: ['tutor', 'coach'], leerdoelen: 'Concentratie verbeteren', voorkeurTutor: 'Man, ervaring met motivatie' },
  { id: 'child3', name: 'Lisa Voorbeeld (inactief)', active: false, helpSubjects: [], hulpvraagType: ['coach'] },
];

const dummyProfessionalsData: Professional[] = [
  { 
    id: 'tutor1', name: 'Mevr. A. Jansen', type: 'tutor', avatarUrl: 'https://picsum.photos/seed/tutorJansen/80/80', 
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
    id: 'tutor2', name: 'Dhr. B. de Vries', type: 'tutor', avatarUrl: 'https://picsum.photos/seed/tutorDeVries/80/80', 
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
];

const LOCAL_STORAGE_LINKED_PROFESSIONALS_KEY = 'linkedProfessionalsByChild';

// --- HELPER FUNCTIONS ---
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';
const formatHulpvraagTypeForDisplay = (types?: ('tutor' | 'coach')[]): string => {
  if (!types || types.length === 0) return 'Nog niet gespecificeerd.';
  return types.map(type => (type === 'tutor' ? 'Hulp bij huiswerk (Tutor)' : '1-op-1 coaching (Coach)')).join(' en ');
};

// --- REFACTORED COMPONENTS ---

interface ProfessionalCardProps {
  professional: Professional;
  isLinked: boolean;
  onViewProfile: (prof: Professional) => void;
  onKoppel: (prof: Professional) => void;
}

const ProfessionalCard: FC<ProfessionalCardProps> = ({ professional, isLinked, onViewProfile, onKoppel }) => (
  <Card className={`flex flex-col ${isLinked ? 'border-2 border-green-500 ring-2 ring-green-500/30' : 'hover:shadow-md'}`}>
    <CardHeader className="items-center text-center">
      <Avatar className="h-20 w-20 mb-2"><AvatarImage src={professional.avatarUrl} alt={professional.name} data-ai-hint="professional person" /><AvatarFallback>{getInitials(professional.name)}</AvatarFallback></Avatar>
      <CardTitle className="text-lg">{professional.name}</CardTitle>
      <Badge variant={professional.type === 'tutor' ? 'secondary' : 'outline'} className="text-xs">{professional.type === 'tutor' ? 'Tutor' : 'Coach'}</Badge>
      <div className="flex items-center gap-0.5 text-yellow-500 mt-1">
        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(professional.rating) ? 'fill-current' : (i < professional.rating ? 'fill-current opacity-50' : 'text-muted-foreground/30 fill-current')}`} />)}
        <span className="text-xs text-muted-foreground ml-1">({professional.reviewsCount || 0})</span>
      </div>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground text-center space-y-1 flex-grow">
      <p><strong>{professional.type === 'tutor' ? 'Vakken:' : 'Expertise:'}</strong> {professional.specializations.map(id => professional.type === 'tutor' ? (allHomeworkSubjects.find(s=>s.id===id)?.name || id) : id).join(', ')}</p>
      <p><strong>Ervaring:</strong> {professional.experienceYears} jaar</p>
      {professional.type === 'tutor' && professional.hourlyRate && <p><strong>Tarief:</strong> €{professional.hourlyRate}/uur</p>}
      <p className="text-xs pt-1 italic">"{professional.shortBio}"</p>
      {professional.availableSlots && professional.availableSlots.length > 0 && (
        <div className="pt-2">
          <p className="text-xs font-medium">Direct beschikbaar (voorbeeld):</p>
          {professional.availableSlots.slice(0, 2).map(slot => <Badge key={slot} variant="outline" className="mr-1 mt-1 text-xs">{slot}</Badge>)}
        </div>
      )}
    </CardContent>
    <CardFooter className="flex-col gap-2 pt-3">
      <Button variant="outline" size="sm" className="w-full" onClick={() => onViewProfile(professional)}><Info className="mr-2 h-4 w-4" />Bekijk Profiel & Reviews</Button>
      <Button variant="outline" size="sm" className="w-full" disabled><MessageSquare className="mr-2 h-4 w-4" /> Stuur bericht (binnenkort)</Button>
      <Button size="sm" className="w-full" onClick={() => onKoppel(professional)} disabled={isLinked}><UserCheck className="mr-2 h-4 w-4" /> {isLinked ? 'Reeds Gekoppeld' : `Koppel ${professional.type === 'tutor' ? 'Tutor' : 'Coach'}`}</Button>
    </CardFooter>
  </Card>
);

interface ProfessionalDetailModalProps {
  professional: Professional | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onKoppel: (prof: Professional) => void;
  isLinked: boolean;
  selectedChildName?: string;
}

const ProfessionalDetailModal: FC<ProfessionalDetailModalProps> = ({ professional, isOpen, onOpenChange, onKoppel, isLinked, selectedChildName }) => {
  if (!professional) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="text-center border-b pb-4">
          <Avatar className="h-24 w-24 mx-auto mb-3"><AvatarImage src={professional.avatarUrl} alt={professional.name} data-ai-hint="professional person" /><AvatarFallback className="text-3xl">{getInitials(professional.name)}</AvatarFallback></Avatar>
          <DialogTitle className="text-2xl font-bold">{professional.name}</DialogTitle>
          <Badge variant={professional.type === 'tutor' ? 'secondary' : 'outline'} className="text-xs mx-auto w-fit">{professional.type === 'tutor' ? 'Gecertificeerd Tutor' : 'Gecertificeerd Coach'}</Badge>
          <div className="flex items-center justify-center gap-0.5 text-yellow-500 mt-1">
            {Array.from({ length: 5 }).map((_, i) => <Star key={`fs-modal-${i}`} className={`h-5 w-5 ${i < Math.floor(professional.rating) ? 'fill-current' : (i < professional.rating ? 'fill-current opacity-50' : 'text-muted-foreground/30 fill-current')}`} />)}
            <span className="text-sm text-muted-foreground ml-1.5">({professional.reviewsCount || 0} reviews)</span>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-grow px-1 py-2"><div className="space-y-6 px-4 py-2">
          <section><h3 className="font-semibold text-lg text-primary mb-1">Over Mij</h3><p className="text-sm text-muted-foreground whitespace-pre-line">{professional.fullBio || professional.shortBio}</p></section>
          <Separator />
          <section><h3 className="font-semibold text-lg text-primary mb-2">Details</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p><strong className="text-foreground">{professional.type === 'tutor' ? 'Vakken:' : 'Expertise:'}</strong> {professional.specializations.map(id => professional.type === 'tutor' ? (allHomeworkSubjects.find(s=>s.id===id)?.name || id) : id).join(', ')}</p>
            <p><strong className="text-foreground">Ervaring:</strong> {professional.experienceYears} jaar</p>
            {professional.type === 'tutor' && professional.hourlyRate && <p><strong className="text-foreground">Tarief:</strong> €{professional.hourlyRate}/uur</p>}
            {professional.education && <p className="sm:col-span-2"><strong className="text-foreground">Opleiding:</strong> {professional.education}</p>}
            {professional.teachingPhilosophy && <p className="sm:col-span-2"><strong className="text-foreground">{professional.type === 'tutor' ? 'Lesfilosofie:' : 'Coaching aanpak:'}</strong> "{professional.teachingPhilosophy}"</p>}
          </div></section>
          <Separator />
          <section><h3 className="font-semibold text-lg text-primary mb-2">Reviews</h3>
            {professional.reviews && professional.reviews.length > 0 ? (<div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {professional.reviews.map((review, idx) => (<Card key={idx} className="p-3 bg-muted/50 text-xs"><div className="flex justify-between items-center mb-0.5"><p className="font-semibold text-foreground">{review.reviewerName}</p><div className="flex items-center gap-0.5 text-yellow-500">{Array.from({length: 5}).map((_, rIdx) => <Star key={`rev-s-${idx}-${rIdx}`} className={`h-3.5 w-3.5 ${rIdx < review.rating ? 'fill-current' : 'text-muted-foreground/30 fill-current'}`}/>)}</div></div><p className="italic text-muted-foreground">"{review.comment}"</p><p className="text-right text-muted-foreground/80 mt-1"><FormattedDateCell isoDateString={review.date} dateFormatPattern="P" /></p></Card>))}
            </div>) : <p className="text-sm text-muted-foreground">Nog geen reviews.</p>}
          </section>
        </div></ScrollArea>
        <DialogFooter className="pt-4 border-t flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Sluiten</Button>
          <Button variant="secondary" disabled className="w-full sm:w-auto"><MessageSquare className="mr-2 h-4 w-4"/>Start Gesprek (binnenkort)</Button>
          <Button onClick={() => onKoppel(professional)} className="w-full sm:w-auto" disabled={isLinked}><UserCheck className="mr-2 h-4 w-4"/>{isLinked ? 'Reeds Gekoppeld' : `Koppel aan ${selectedChildName || 'kind'}`}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


// --- MAIN PAGE COMPONENT ---

function ZoekProfessionalContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const initialKindId = searchParams?.get('kindId');
  const [selectedChildId, setSelectedChildId] = useState<string | undefined>(initialKindId || undefined);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [selectedProfessionalForModal, setSelectedProfessionalForModal] = useState<Professional | null>(null);
  const [isProfessionalDetailModalOpen, setIsProfessionalDetailModalOpen] = useState(false);
  const [linkedProfessionalsMap, setLinkedProfessionalsMap] = useState<Record<string, string[]>>({});
  const [vakFilter, setVakFilter] = useState<string>('all');
  const [ervaringFilter, setErvaringFilter] = useState<string>('all');
  
  const selectedChildDetails = selectedChildId ? dummyChildren.find(c => c.id === selectedChildId) : null;

  useEffect(() => {
    try { localStorage.setItem(LOCAL_STORAGE_LINKED_PROFESSIONALS_KEY, JSON.stringify(linkedProfessionalsMap)); } catch (error) { console.error("Error saving linked professionals map to localStorage:", error); }
  }, [linkedProfessionalsMap]);

  useEffect(() => {
    if (initialKindId && !activeChildren.find(c => c.id === initialKindId)) {
        toast({ title: "Kind niet gevonden", description: "Het geselecteerde kind is niet actief of bestaat niet.", variant: "destructive"});
        setSelectedChildId(undefined); 
    }
    const professionalsSource = dummyProfessionalsData.filter(p => p.type === 'tutor');
    let tempFiltered = professionalsSource;
    if (vakFilter === 'all' && selectedChildDetails?.helpSubjects?.length) {
      tempFiltered = tempFiltered.filter(prof => selectedChildDetails.helpSubjects!.some(childSub => prof.specializations.includes(childSub)));
    } else if (vakFilter !== 'all') {
      tempFiltered = tempFiltered.filter(p => p.specializations.includes(vakFilter));
    }
    if (ervaringFilter !== 'all') {
        const [minExp, maxExpStr] = ervaringFilter.split('-');
        const min = parseInt(minExp); const max = maxExpStr === '+' ? Infinity : parseInt(maxExpStr);
        tempFiltered = tempFiltered.filter(p => p.experienceYears >= min && (maxExpStr === '+' || p.experienceYears <= max));
    }
    setFilteredProfessionals(tempFiltered);
  }, [vakFilter, ervaringFilter, selectedChildDetails, initialKindId, activeChildren, toast]);
  
  const handleKoppelProfessional = (professionalToLink: Professional) => {
    if (!selectedChildId) { toast({ title: "Selecteer een kind", description: "Kies eerst een kind om een professional aan te koppelen.", variant: "destructive"}); return; }
    setLinkedProfessionalsMap(prevMap => {
      const currentLinked = prevMap[selectedChildId] || [];
      if (currentLinked.includes(professionalToLink.id)) { toast({ title: "Al Gekoppeld", description: `${professionalToLink.name} is al gekoppeld aan ${selectedChildDetails?.name}.` }); return prevMap; }
      const updatedMap = { ...prevMap, [selectedChildId]: [...currentLinked, professionalToLink.id] };
      toast({ title: `${professionalToLink.type === 'tutor' ? 'Tutor' : 'Coach'} Gekoppeld!`, description: `${professionalToLink.name} is succesvol gekoppeld.`, action: <Button variant="link" size="sm" asChild><Link href="/dashboard/ouder/gekoppelde-professionals">Bekijk</Link></Button> });
      return updatedMap;
    });
    setIsProfessionalDetailModalOpen(false);
  };
  
  const handleViewProfile = (professional: Professional) => { setSelectedProfessionalForModal(professional); setIsProfessionalDetailModalOpen(true); };
  const isProfessionalLinkedToSelectedChild = (profId: string): boolean => !!(selectedChildId && linkedProfessionalsMap[selectedChildId]?.includes(profId));
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h1 className="text-3xl font-bold text-foreground flex items-center gap-2"><LinkIcon className="h-8 w-8 text-primary" />Zoek Begeleiding</h1><p className="text-muted-foreground">Selecteer een kind en vind een geschikte tutor of coach.</p></div>
        <Button variant="outline" asChild><Link href="/dashboard/ouder"><ArrowLeft className="mr-2 h-4 w-4" /> Terug</Link></Button>
      </div>
      <Card className="shadow-lg"><CardHeader><CardTitle>1. Selecteer Kind</CardTitle></CardHeader>
        <CardContent><div className="max-w-md">
          <Label htmlFor="select-kind">Voor welk kind zoek je begeleiding?</Label>
          <Select value={selectedChildId} onValueChange={setSelectedChildId}><SelectTrigger id="select-kind" className="mt-1"><SelectValue placeholder="Kies een kind" /></SelectTrigger>
            <SelectContent>{activeChildren.map(child => (<SelectItem key={child.id} value={child.id}><div className="flex items-center gap-2"><Avatar className="h-6 w-6 text-xs"><AvatarImage src={child.avatarUrl} alt={child.name} data-ai-hint="child person" /><AvatarFallback>{getInitials(child.name)}</AvatarFallback></Avatar>{child.name}</div></SelectItem>))}
             {activeChildren.length === 0 && (<SelectItem value="no-active-children" disabled>Geen actieve kinderen gevonden</SelectItem>)}</SelectContent>
          </Select></div>
          {selectedChildDetails && (<Card className="mt-4 p-4 bg-primary/5 border-primary/20">
              <CardTitle className="text-md font-semibold text-primary flex items-center gap-2"><User className="h-5 w-5"/>{selectedChildDetails.name} - Voorkeuren & Hulpvragen</CardTitle>
              <p className="text-xs text-muted-foreground"><strong>Type hulpvraag:</strong> {formatHulpvraagTypeForDisplay(selectedChildDetails.hulpvraagType)} <br/><strong>Vakken:</strong> {selectedChildDetails.helpSubjects?.map(sId => allHomeworkSubjects.find(s => s.id === sId)?.name || sId).join(', ') || 'N.v.t.'} <br/><strong>Leerdoelen:</strong> {selectedChildDetails.leerdoelen || 'N.v.t.'} <br/><strong>Voorkeur Begeleider:</strong> {selectedChildDetails.voorkeurTutor || 'N.v.t.'}</p>
              <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1" asChild><Link href={`/dashboard/ouder/kinderen/${selectedChildDetails.id}/profiel`}>Bewerk profiel</Link></Button>
          </Card>)}
        </CardContent>
      </Card>

      {selectedChildId && (
        <section className="mt-8 space-y-6"><div className="flex items-center gap-2"><Search className="h-5 w-5 text-primary"/><h2 className="text-xl font-semibold text-foreground">Vind Beschikbare Professionals</h2></div>
          <p className="text-muted-foreground">Filter op vak en ervaring om de beste match te vinden. (Momenteel worden alleen tutors getoond).</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label htmlFor="vak-filter">Filter op Vak</Label><Select value={vakFilter} onValueChange={setVakFilter}><SelectTrigger id="vak-filter"><SelectValue placeholder="Alle passende vakken"/></SelectTrigger><SelectContent><SelectItem value="all">Alle Passende Vakken</SelectItem>{allHomeworkSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div><div><Label htmlFor="ervaring-filter">Filter op Ervaring</Label><Select value={ervaringFilter} onValueChange={setErvaringFilter}><SelectTrigger id="ervaring-filter"><SelectValue placeholder="Alle ervaring"/></SelectTrigger><SelectContent><SelectItem value="all">Alle Ervaringsniveaus</SelectItem><SelectItem value="0-2">0-2 jaar</SelectItem><SelectItem value="3-5">3-5 jaar</SelectItem><SelectItem value="5+">5+ jaar</SelectItem></SelectContent></Select></div></div>
          {filteredProfessionals.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {filteredProfessionals.map(prof => <ProfessionalCard key={prof.id} professional={prof} isLinked={isProfessionalLinkedToSelectedChild(prof.id)} onViewProfile={handleViewProfile} onKoppel={handleKoppelProfessional} />)}
          </div>) : (<p className="text-muted-foreground text-center py-6">Geen professionals gevonden die voldoen aan de criteria.</p>)}
        </section>
      )}

      <Card className="shadow-md bg-blue-50 border-blue-200"><CardHeader><CardTitle className="text-blue-700 text-md flex items-center gap-2"><Info className="h-5 w-5"/>Hoe werkt het koppelen?</CardTitle></CardHeader><CardContent className="text-sm text-blue-600 space-y-1"><p>1. Selecteer het kind voor wie u begeleiding zoekt.</p><p>2. De lijst met professionals wordt gefilterd op basis van de "Hulp nodig bij" vakken (voor tutors) of relevante expertise.</p><p>3. Klik op "Bekijk Profiel & Reviews" voor meer details.</p><p>4. Klik op "Koppel..." om de professional direct aan uw kind te koppelen. De professional ontvangt een notificatie.</p><p>5. Na koppeling kunt u lessen/sessies plannen via de "Mijn Begeleiders" pagina.</p></CardContent></Card>
      
      <ProfessionalDetailModal professional={selectedProfessionalForModal} isOpen={isProfessionalDetailModalOpen} onOpenChange={setIsProfessionalDetailModalOpen} onKoppel={handleKoppelProfessional} isLinked={isProfessionalLinkedToSelectedChild(selectedProfessionalForModal?.id || '')} selectedChildName={selectedChildDetails?.name} />
    </div>
  );
}

export default function ZoekProfessionalPageWrapper() {
  return (
    <Suspense fallback={<div>Pagina laden...</div>}>
      <ZoekProfessionalContent />
    </Suspense>
  );
}
