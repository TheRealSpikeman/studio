
"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, Cake, School, GraduationCap, Target, Users as UsersIcon, Share2, Edit, Link2, Info, ShieldAlert, AlertTriangle, HelpCircle, CheckSquare, BookOpen, ImageUp, Trash2, Save, MessageSquare, MessageCircle, MapPin } from 'lucide-react';
import { allHomeworkSubjects, type SubjectOption } from '@/lib/quiz-data/subject-data';
import type { User as UserType, AgeGroup } from '@/types/user';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image'; 
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form"; 
import { useForm } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod"; 
import * as z from "zod"; 
import { cn } from '@/lib/utils';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import type { SubscriptionPlan } from '@/types/subscription';

// --- TYPE DEFINITIES & CONSTANTEN ---

interface Child extends Pick<UserType, 'id' | 'name' | 'ageGroup' | 'avatarUrl' | 'hulpvraagType' > {
  firstName: string;
  lastName: string;
  age?: number; 
  childEmail?: string;
  schoolType?: string;
  otherSchoolType?: string;
  className?: string;
  helpSubjects?: string[];
  subscriptionStatus: 'actief' | 'geen' | 'verlopen' | 'uitgenodigd';
  planId?: SubscriptionPlan['id'];
  planName?: string; 
  lastActivity?: string;
  leerdoelen?: string; 
  voorkeurTutor?: string; 
  deelResultatenMetTutor?: boolean;
  linkedTutorIds?: string[];
}

const ageGroupOptions: {value: AgeGroup, label: string}[] = [
    {value: '12-14', label: '12-14 jaar'},
    {value: '15-18', label: '15-18 jaar'},
    {value: 'adult', label: 'Volwassene (18+)'} 
];

const editableChildFormSchema = z.object({
    firstName: z.string().min(2, { message: "Voornaam moet minimaal 2 tekens bevatten." }),
    lastName: z.string().min(2, { message: "Achternaam moet minimaal 2 tekens bevatten." }),
    ageGroup: z.enum(['12-14', '15-18', 'adult']),
    childEmail: z.string().email({ message: "Voer een geldig e-mailadres in." }).optional().or(z.literal('')),
    schoolType: z.string().optional(),
    otherSchoolType: z.string().optional(),
    className: z.string().optional(),
    helpSubjects: z.array(z.string()).optional(),
    hulpvraagType: z.array(z.enum(['tutor', 'coach'])).optional(),
    selectedLeerdoelen: z.array(z.string()).optional(),
    otherLeerdoelen: z.string().max(250, "Toelichting mag maximaal 250 tekens bevatten.").optional(),
    selectedTutorPreferences: z.array(z.string()).optional(),
    otherTutorPreference: z.string().max(250, "Toelichting mag maximaal 250 tekens bevatten.").optional(),
    avatarUrl: z.string().url({ message: "Ongeldige URL." }).nullable().optional(),
}).refine(data => {
  if (data.schoolType === "Anders" && (!data.otherSchoolType || data.otherSchoolType.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Specificatie voor 'Ander schooltype' is vereist.",
  path: ["otherSchoolType"], 
});

type EditableChildData = z.infer<typeof editableChildFormSchema>;

const dummyChildren: Child[] = [
   {
    id: 'child1', firstName: 'Sofie', lastName: 'de Tester', name: 'Sofie de Tester', age: 13, ageGroup: '12-14',
    avatarUrl: 'https://picsum.photos/seed/sofiechild/80/80', subscriptionStatus: 'actief', planId: 'family_guide_monthly', 
    planName: 'Gezins Gids - Maandelijks', lastActivity: 'Quiz "Basis Neuroprofiel" voltooid', childEmail: 'sofie.tester@example.com',
    schoolType: 'HAVO', className: '2B', helpSubjects: ['wiskunde', 'nederlands'], hulpvraagType: ['tutor', 'coach'],
    leerdoelen: 'Geselecteerd: Beter leren plannen voor toetsen, Omgaan met faalangst. Overig: Kind heeft moeite met beginnen aan taken.',
    voorkeurTutor: 'Geselecteerde voorkeuren: Ervaring met faalangst, Geduldig. Overig: Iemand met ervaring met visueel ingestelde leerlingen.',
    deelResultatenMetTutor: true, linkedTutorIds: ['tutor1'],
  },
  {
    id: 'child2', firstName: 'Max', lastName: 'de Tester', name: 'Max de Tester', age: 16, ageGroup: '15-18',
    avatarUrl: 'https://picsum.photos/seed/maxchild/80/80', subscriptionStatus: 'actief', planId: 'family_guide_monthly', 
    planName: 'Gezins Gids - Maandelijks', lastActivity: 'Laatste les: Engels (1 dag geleden)', childEmail: 'max.tester@example.com',
    schoolType: 'VWO', helpSubjects: ['engels', 'geschiedenis'], hulpvraagType: ['tutor', 'coach'],
    leerdoelen: 'Geselecteerd: Concentratie verbeteren tijdens de les. Overig: Verbeteren van spreekvaardigheid Engels en essay schrijven.',
    voorkeurTutor: 'Geselecteerde voorkeuren: Man. Overig: Tutor die ook kan helpen met motivatie.',
    deelResultatenMetTutor: false, linkedTutorIds: [],
  },
  {
    id: 'child3', firstName: 'Lisa', lastName: 'Voorbeeld', name: 'Lisa Voorbeeld', age: 12, ageGroup: '12-14',
    subscriptionStatus: 'geen', planId: undefined, planName: undefined, lastActivity: 'Coaching tip van gisteren bekeken',
    childEmail: 'lisa.voorbeeld@example.com', schoolType: 'Anders', otherSchoolType: 'Internationale School', 
    helpSubjects: [], hulpvraagType: ['coach'], leerdoelen: 'Geselecteerd: Zelfvertrouwen vergroten.',
    voorkeurTutor: 'Geselecteerde voorkeuren: Vrouw, Ervaring met faalangst.', deelResultatenMetTutor: true,
    linkedTutorIds: ['tutor2', 'tutor3'],
  },
];

const predefinedLeerdoelen = [
  { id: 'plannen', label: "Beter leren plannen voor toetsen" }, { id: 'faalangst', label: "Omgaan met faalangst" },
  { id: 'concentratie', label: "Concentratie verbeteren tijdens de les" }, { id: 'zelfvertrouwen', label: "Zelfvertrouwen vergroten" },
  { id: 'motivatie', label: "Motivatie vinden/behouden" }, { id: 'structuur', label: "Structuur aanbrengen in huiswerk" },
];
const predefinedTutorPreferences = [
  { id: 'ervaring-add-adhd', label: "Ervaring met ADD/ADHD" }, { id: 'ervaring-ass', label: "Ervaring met ASS" },
  { id: 'ervaring-hsp', label: "Ervaring met HSP" }, { id: 'ervaring-faalangst', label: "Ervaring met faalangst" },
  { id: 'man', label: "Man" }, { id: 'vrouw', label: "Vrouw" }, { id: 'geduldig', label: "Geduldig" },
  { id: 'streng-doch-rechtvaardig', label: "Streng doch rechtvaardig" }, { id: 'resultaatgericht', label: "Resultaatgericht" },
  { id: 'uitleg-beelddenkers', label: "Kan goed uitleggen aan beelddenkers" }, { id: 'flexibel-avond', label: "Flexibel (ook 's avonds)" },
  { id: 'flexibel-weekend', label: "Flexibel (ook weekend)" },
];
const allHulpvraagOptions: { id: 'tutor' | 'coach'; label: string }[] = [ { id: 'tutor', label: "Hulp bij huiswerk (Tutor)" }, { id: 'coach', label: "1-op-1 coaching (Coach)" } ];
const schoolTypes = ["VMBO-T", "HAVO", "VWO", "Gymnasium", "Praktijkonderwijs", "Speciaal Onderwijs", "Anders", "Niet opgegeven"];
const predefinedAvatarsForProfile = [
  { id: 'child_avatar1', src: 'https://placehold.co/80x80.png?text=C1', alt: 'Avatar Patroon 1', hint: 'abstract pattern' },
  { id: 'child_avatar2', src: 'https://placehold.co/80x80.png?text=C2', alt: 'Avatar Natuur', hint: 'nature element' },
  { id: 'child_avatar3', src: 'https://placehold.co/80x80.png?text=C3', alt: 'Avatar Dier', hint: 'animal cute' },
  { id: 'child_avatar4', src: 'https://placehold.co/80x80.png?text=C4', alt: 'Avatar Ruimte', hint: 'space cosmic' },
];

// --- HELPER FUNCTIES ---

const getSubscriptionBadgeVariant = (status: Child['subscriptionStatus']): "default" | "secondary" | "destructive" | "outline" => {
  if (status === 'actief') return 'default'; if (status === 'geen') return 'secondary';
  if (status === 'uitgenodigd') return 'outline'; return 'destructive'; 
};
const getSubscriptionBadgeClasses = (status: Child['subscriptionStatus']): string => {
  if (status === 'actief') return 'bg-green-100 text-green-700 border-green-300';
  if (status === 'geen') return 'bg-gray-100 text-gray-700 border-gray-300';
  if (status === 'uitgenodigd') return 'bg-blue-100 text-blue-700 border-blue-300';
  return 'bg-red-100 text-red-700 border-red-300'; 
};
const parseMultiPartString = (str: string | undefined): { selected: string[]; other: string } => {
  if (!str) return { selected: [], other: '' };
  const geselecteerdMatch = str.match(/Geselecteerd:\s*(.*?)(?=\s*\.\s*Overig:|$)/i);
  const overigMatch = str.match(/Overig:\s*(.*)/i);
  const selectedItems = geselecteerdMatch ? geselecteerdMatch[1].trim().split(',').map(s => s.trim()).filter(Boolean) : [];
  const otherText = overigMatch ? overigMatch[1].trim() : (geselecteerdMatch && !str.includes("Overig:") ? '' : (!geselecteerdMatch ? str : ''));
  return { selected: selectedItems, other: otherText };
};
const isTutorServiceCoveredByPlan = (planId?: Child['planId']): boolean => {
  if (!planId) return false; return planId.includes('family_guide') || planId.includes('premium_family');
};
const isCoachServiceCoveredByPlan = (planId?: Child['planId']): boolean => {
  if (!planId) return false; return planId.includes('family_guide') || planId.includes('premium_family') || planId.includes('coaching_tools');
};
const getInitials = (name?: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

// --- WEERGAVE COMPONENT ---
const KindProfielView = ({ childData, onStartEdit }: { childData: Child; onStartEdit: () => void }) => {
  const getSubjectName = (subjectId: string) => allHomeworkSubjects.find(s => s.id === subjectId)?.name || subjectId;
  const leerdoelenParsed = parseMultiPartString(childData?.leerdoelen);
  const tutorVoorkeurenParsed = parseMultiPartString(childData?.voorkeurTutor);
  const tutorServiceActiveForChild = childData?.hulpvraagType?.includes('tutor');
  const coachServiceActiveForChild = childData?.hulpvraagType?.includes('coach');
  const tutorServiceCovered = isTutorServiceCoveredByPlan(childData.planId);
  const coachServiceCovered = isCoachServiceCoveredByPlan(childData.planId);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-lg bg-card shadow">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={childData.avatarUrl || undefined} alt={childData.name} data-ai-hint="child person" />
            <AvatarFallback className="text-3xl bg-muted">{getInitials(childData.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{childData.name}</h1>
            <p className="text-muted-foreground">Profieloverzicht en instellingen.</p>
          </div>
        </div>
        <Button onClick={onStartEdit}>
          <Edit className="mr-2 h-4 w-4"/> Profiel Bewerken
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><User className="h-6 w-6 text-primary"/>Persoonlijke Gegevens</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div><strong className="font-medium text-foreground/80">Volledige Naam:</strong> <span className="text-foreground">{childData.name}</span></div>
                <div><strong className="font-medium text-foreground/80">Leeftijdsgroep:</strong> <span className="text-foreground">{childData.ageGroup || 'N.v.t.'}</span></div>
                <div><strong className="font-medium text-foreground/80">E-mail Kind:</strong> <span className="text-foreground">{childData.childEmail || 'Niet opgegeven'}</span></div>
                <div>
                    <strong className="font-medium text-foreground/80">Abonnement Status:</strong> <Badge variant={getSubscriptionBadgeVariant(childData.subscriptionStatus)} className={getSubscriptionBadgeClasses(childData.subscriptionStatus)}>{childData.subscriptionStatus.charAt(0).toUpperCase() + childData.subscriptionStatus.slice(1)}</Badge>
                    {childData.planName && <span className="text-xs text-muted-foreground"> ({childData.planName})</span>}
                    {!childData.planName && childData.subscriptionStatus === 'geen' && <span className="text-xs text-muted-foreground"> (Nog geen abonnement)</span>}
                </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
              <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><School className="h-6 w-6 text-primary"/>Schoolinformatie</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                  <p><strong className="font-medium text-foreground/80">Schooltype:</strong> <span className="text-foreground">{childData.schoolType === "Anders" ? `Anders: ${childData.otherSchoolType || 'Niet gespecificeerd'}` : (childData.schoolType || 'Niet opgegeven')}</span></p>
                  <p><strong className="font-medium text-foreground/80">Klas:</strong> <span className="text-foreground">{childData.className || 'Niet opgegeven'}</span></p>
              </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Share2 className="h-6 w-6 text-primary"/>Privacy &amp; Delen</CardTitle></CardHeader>
            <CardContent className="text-sm">
                <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground/80">Quizresultaten delen met begeleiders:</p>
                    <Badge variant={childData.deelResultatenMetTutor ? "default" : "secondary"} className={childData.deelResultatenMetTutor ? 'bg-green-100 text-green-700 border-green-300' : ''}>
                    {childData.deelResultatenMetTutor ? 'Ja' : 'Nee'}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Hiermee kunnen begeleiders de ondersteuning beter afstemmen. U en uw kind behouden controle.</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><GraduationCap className="h-6 w-6 text-primary"/>Hulp bij Huiswerk (Tutor)</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">Status:</p>
                  <Badge variant={tutorServiceActiveForChild ? "default" : "secondary"} className={tutorServiceActiveForChild ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-700 border-gray-300"}>
                      {tutorServiceActiveForChild ? 'Actief' : 'Niet Actief'}
                  </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm flex-grow">
              {tutorServiceActiveForChild && !tutorServiceCovered && (
                  <Alert variant="default" className="bg-orange-50 border-orange-300 text-orange-700 mb-3">
                      <AlertTriangle className="h-5 w-5 !text-orange-600" />
                      <AlertTitleUi className="text-orange-700 font-semibold">Abonnement Vereist</AlertTitleUi>
                      <AlertDescUi>Het huidige abonnement '{childData.planName || 'Nog geen abonnement'}' dekt geen tutorbegeleiding. Om een tutor te koppelen is een upgrade naar 'Gezins Gids' of 'Premium' nodig.<Button variant="link" asChild className="p-0 h-auto ml-1 text-orange-700 hover:text-orange-800"><Link href="/dashboard/ouder/abonnementen">Upgrade nu</Link></Button></AlertDescUi>
                  </Alert>
              )}
              {tutorServiceActiveForChild ? (
                <>
                  <div><h4 className="font-semibold text-foreground/90 mb-1 mt-2 flex items-center gap-1"><BookOpen className="h-4 w-4"/>Hulp bij Vakken</h4>{childData.helpSubjects && childData.helpSubjects.length > 0 ? (<ul className="list-disc list-inside space-y-1 pl-2 text-muted-foreground">{childData.helpSubjects.map(id => <li key={id}>{getSubjectName(id)}</li>)}</ul>) : (<p className="text-muted-foreground">Geen specifieke hulpvakken opgegeven.</p>)}</div>
                  <div className="mt-2"><h4 className="font-semibold text-foreground/90 mb-1 flex items-center gap-1"><Target className="h-4 w-4"/>Leerdoelen & Aandachtspunten</h4>{leerdoelenParsed.selected.length > 0 && (<div><p className="font-medium text-foreground/80">Geselecteerd:</p><ul className="list-disc list-inside space-y-0.5 pl-2 text-muted-foreground">{leerdoelenParsed.selected.map((doel, idx) => <li key={idx}>{doel}</li>)}</ul></div>)}{leerdoelenParsed.other && (<p className="mt-1"><strong className="font-medium text-foreground/80">Overig:</strong> <span className="text-muted-foreground whitespace-pre-line">{leerdoelenParsed.other}</span></p>)}{(leerdoelenParsed.selected.length === 0 && !leerdoelenParsed.other) && (<p className="text-muted-foreground">Niet opgegeven.</p>)}</div>
                </>
              ) : (<p className="text-muted-foreground text-sm">Hulp bij huiswerk is niet geactiveerd voor {childData.firstName}. U kunt dit aanzetten via "Profiel Bewerken".</p>)}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><MessageSquare className="h-6 w-6 text-primary"/>1-op-1 Coaching (Coach)</CardTitle>
              <div className="flex items-center gap-2 mt-1"><p className="text-sm text-muted-foreground">Status:</p><Badge variant={coachServiceActiveForChild ? "default" : "secondary"} className={coachServiceActiveForChild ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-700 border-gray-300"}>{coachServiceActiveForChild ? 'Actief' : 'Niet Actief'}</Badge></div>
            </CardHeader>
            <CardContent className="text-sm space-y-3 flex-grow">
              {coachServiceActiveForChild && !coachServiceCovered && (<Alert variant="default" className="bg-orange-50 border-orange-300 text-orange-700 mb-3"><AlertTriangle className="h-5 w-5 !text-orange-600" /><AlertTitleUi className="text-orange-700 font-semibold">Abonnement Vereist</AlertTitleUi><AlertDescUi>Het huidige abonnement '{childData.planName || 'Gratis Start'}' dekt geen 1-op-1 coaching.<Button variant="link" asChild className="p-0 h-auto ml-1 text-orange-700 hover:text-orange-800"><Link href="/dashboard/ouder/abonnementen">Upgrade nu</Link></Button></AlertDescUi></Alert>)}
              {coachServiceActiveForChild ? (<div className="mt-2"><h4 className="font-semibold text-foreground/90 mb-1 flex items-center gap-1"><UsersIcon className="h-4 w-4"/>Voorkeuren Coach</h4>{tutorVoorkeurenParsed.selected.length > 0 && (<div><p className="font-medium text-foreground/80">Geselecteerd:</p><ul className="list-disc list-inside space-y-0.5 pl-2 text-muted-foreground">{tutorVoorkeurenParsed.selected.map((pref, index) => (<li key={index}>{pref}</li>))}</ul></div>)}{tutorVoorkeurenParsed.other && (<p className="mt-1"><strong className="font-medium text-foreground/80">Overig:</strong> <span className="text-muted-foreground whitespace-pre-line">{tutorVoorkeurenParsed.other}</span></p>)}{(tutorVoorkeurenParsed.selected.length === 0 && !tutorVoorkeurenParsed.other) && (<p className="text-muted-foreground">Geen specifieke voorkeuren opgegeven.</p>)}</div>
              ) : (<p className="text-muted-foreground text-sm">1-op-1 coaching is niet geactiveerd voor {childData.firstName}. U kunt dit aanzetten via "Profiel Bewerken".</p>)}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

// --- BEWERK FORMULIER COMPONENT ---
const KindProfielEditForm = ({ initialData, onSave, onCancel }: { initialData: Child; onSave: (data: EditableChildData) => void; onCancel: () => void; }) => {
  const form = useForm<EditableChildData>({ resolver: zodResolver(editableChildFormSchema), defaultValues: {} });
  const { reset, control, handleSubmit, watch, setValue } = form;
  const watchedSchoolType = watch("schoolType");
  const watchedHulpvraagType = watch("hulpvraagType");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const displayedName = `${watch('firstName') || ''} ${watch('lastName') || ''}`.trim();
  const displayedAvatar = watch('avatarUrl');
  const selectedTutorHulp = watchedHulpvraagType?.includes('tutor');
  const selectedCoachHulp = watchedHulpvraagType?.includes('coach');
  const tutorServiceCovered = isTutorServiceCoveredByPlan(initialData.planId);
  const coachServiceCovered = isCoachServiceCoveredByPlan(initialData.planId);

  useEffect(() => {
    const parsedLeerdoelen = parseMultiPartString(initialData.leerdoelen);
    const parsedVoorkeuren = parseMultiPartString(initialData.voorkeurTutor);
    reset({
      firstName: initialData.firstName, lastName: initialData.lastName, ageGroup: initialData.ageGroup || '12-14',
      childEmail: initialData.childEmail || '', schoolType: initialData.schoolType || '', otherSchoolType: initialData.otherSchoolType || '',
      className: initialData.className || '', helpSubjects: initialData.helpSubjects || [], hulpvraagType: initialData.hulpvraagType || [],
      selectedLeerdoelen: parsedLeerdoelen.selected, otherLeerdoelen: parsedLeerdoelen.other,
      selectedTutorPreferences: parsedVoorkeuren.selected, otherTutorPreference: parsedVoorkeuren.other,
      avatarUrl: initialData.avatarUrl || null,
    });
  }, [initialData, reset]);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setValue('avatarUrl', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSave)} className="space-y-0">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-lg bg-card shadow">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20"><AvatarImage src={displayedAvatar || undefined} alt={displayedName} data-ai-hint="child person" /><AvatarFallback className="text-3xl bg-muted">{getInitials(displayedName)}</AvatarFallback></Avatar>
                <div><h1 className="text-3xl font-bold text-foreground">{displayedName || "Kind Profiel Bewerken"}</h1><p className="text-muted-foreground">Pas hier de gegevens aan.</p></div>
            </div>
            <div className="flex gap-2"><Button type="submit"><Save className="mr-2 h-4 w-4"/> Opslaan</Button><Button variant="outline" type="button" onClick={onCancel}>Annuleren</Button></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg"><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><User className="h-6 w-6 text-primary"/>Persoonlijke Gegevens</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                  <FormField control={control} name="firstName" render={({ field }) => (<FormItem><div><FormLabel htmlFor="firstNameEdit">Voornaam</FormLabel><Input id="firstNameEdit" {...field} /></div><FormMessage/></FormItem>)} />
                  <FormField control={control} name="lastName" render={({ field }) => (<FormItem><div><FormLabel htmlFor="lastNameEdit">Achternaam</FormLabel><Input id="lastNameEdit" {...field} /></div><FormMessage/></FormItem>)} />
                  <FormField control={control} name="ageGroup" render={({ field }) => (<FormItem><FormLabel htmlFor="ageGroupEdit">Leeftijdsgroep</FormLabel><Select onValueChange={field.onChange} value={field.value}><SelectTrigger id="ageGroupEdit" className="pl-10 relative"><Cake className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><SelectValue /></SelectTrigger><SelectContent>{ageGroupOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select><FormMessage/></FormItem>)} />
                  <FormField control={control} name="childEmail" render={({ field }) => (<FormItem><div><FormLabel htmlFor="childEmailEdit">E-mail Kind</FormLabel><Input id="childEmailEdit" type="email" {...field} /></div><FormMessage/></FormItem>)} />
                  <FormField control={control} name="avatarUrl" render={({ field }) => (<FormItem><FormLabel htmlFor="avatarUrlEdit">Avatar URL (optioneel)</FormLabel><Input id="avatarUrlEdit" {...field} value={field.value || ''} placeholder="https://..."/><FormMessage/></FormItem>)} />
                  <div className="space-y-2"><Label>Of kies een standaard avatar:</Label><div className="flex flex-wrap gap-2">{predefinedAvatarsForProfile.map(avatar => (<button key={avatar.id} type="button" onClick={() => setValue('avatarUrl', avatar.src)} className={`rounded-md overflow-hidden border-2 transition-all hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary w-16 h-16 ${displayedAvatar === avatar.src ? 'border-primary ring-2 ring-primary scale-105' : 'border-transparent'}`}><Image src={avatar.src} alt={avatar.alt} width={64} height={64} data-ai-hint={avatar.hint} className="object-cover"/></button>))}</div>
                      <Input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarUpload} className="hidden"/>
                      <Button type="button" onClick={() => avatarInputRef.current?.click()} variant="outline" size="sm"><ImageUp className="mr-2 h-4 w-4"/>Upload Eigen Foto</Button>
                      {displayedAvatar && <Button type="button" onClick={() => setValue('avatarUrl', null)} variant="ghost" size="sm" className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Verwijder Huidige Foto</Button>}
                  </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg"><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><School className="h-6 w-6 text-primary"/>Schoolinformatie</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                  <FormField control={control} name="schoolType" render={({ field }) => (<FormItem><FormLabel htmlFor="schoolTypeEdit">Schooltype</FormLabel><Select onValueChange={field.onChange} value={field.value}><SelectTrigger id="schoolTypeEdit" className="pl-10 relative"><School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><SelectValue placeholder="Kies schooltype" /></SelectTrigger><SelectContent>{schoolTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select><FormMessage/></FormItem>)} />
                  {watchedSchoolType === "Anders" && (<FormField control={form.control} name="otherSchoolType" render={({ field }) => (<FormItem className="mt-2"><FormLabel htmlFor="otherSchoolTypeEdit">Specificatie ander schooltype</FormLabel><Input id="otherSchoolTypeEdit" {...field} placeholder="Bijv. Thuisonderwijs" /><FormMessage /></FormItem>)} />)}
                  <FormField control={control} name="className" render={({ field }) => (<FormItem><div><FormLabel htmlFor="classNameEdit">Klas</FormLabel><Input id="classNameEdit" {...field} /></div><FormMessage/></FormItem>)} />
              </CardContent>
            </Card>
            <Card className="shadow-lg"><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Share2 className="h-6 w-6 text-primary"/>Privacy &amp; Delen</CardTitle></CardHeader>
              <CardContent className="text-sm"><p className="text-sm text-muted-foreground mt-2">Het delen van quizresultaten wordt nu beheerd op de <Link href="/dashboard/ouder/privacy-instellingen" className="text-primary hover:underline">Privacy & Delen</Link> pagina voor gedetailleerder beheer per kind en per begeleider.</p></CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg flex flex-col h-full"><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><GraduationCap className="h-6 w-6 text-primary"/>Hulp bij Huiswerk (Tutor)</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm flex-grow">
                <p className="text-xs text-muted-foreground mb-3 -mt-2">Help ons de beste tutor te vinden. Selecteer de vakken en leerdoelen.</p>
                <FormField control={form.control} name="hulpvraagType" render={({ field }) => (<FormItem className="flex items-center space-x-2 mb-4"><Checkbox id="hulpvraag-tutor-edit" checked={field.value?.includes('tutor')} onCheckedChange={(checked) => { const newVal = field.value || []; return checked ? field.onChange([...newVal, 'tutor']) : field.onChange(newVal.filter(v => v !== 'tutor')); }} /><FormLabel htmlFor="hulpvraag-tutor-edit" className="font-semibold">Hulp bij huiswerk (Tutor) actief?</FormLabel><FormMessage/></FormItem>)} />
                {selectedTutorHulp && !tutorServiceCovered && (<Alert variant="default" className="bg-orange-50 border-orange-300 text-orange-700 mb-3"><AlertTriangle className="h-5 w-5 !text-orange-600" /><AlertTitleUi className="text-orange-700 font-semibold">Abonnement Vereist</AlertTitleUi><AlertDescUi>Het huidige abonnement '{initialData.planName || 'Gratis Start'}' dekt geen tutorbegeleiding. U kunt deze voorkeuren wel instellen, maar om een tutor te koppelen is een upgrade naar 'Gezins Gids' of 'Premium' nodig.<Button variant="link" asChild className="p-0 h-auto ml-1 text-orange-700 hover:text-orange-800"><Link href="/dashboard/ouder/abonnementen">Upgrade nu</Link></Button></AlertDescUi></Alert>)}
                {selectedTutorHulp && (<><FormField control={control} name="helpSubjects" render={() => (<FormItem><FormLabel className="font-semibold text-foreground/90 mb-1 block">Hulp bij Vakken</FormLabel><p className="text-xs text-muted-foreground !mt-0 !mb-2">Selecteer de vakken waarvoor ondersteuning gewenst is.</p><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">{allHomeworkSubjects.map(subject => (<FormField key={subject.id} control={control} name="helpSubjects" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2"><FormControl><Checkbox checked={field.value?.includes(subject.id)} onCheckedChange={(checked) => { const newVal = field.value || []; return checked ? field.onChange([...newVal, subject.id]) : field.onChange(newVal.filter(v => v !== subject.id));}}/></FormControl><FormLabel htmlFor={`subject-${subject.id}-edit`} className="font-normal">{subject.name}</FormLabel></FormItem>)} />))}</div><FormMessage/></FormItem>)} /><div className="mt-4"><FormLabel className="font-semibold text-foreground/90 mb-1 block">Leerdoelen & Aandachtspunten</FormLabel><p className="text-xs text-muted-foreground !mt-0 !mb-2">Kies de 2-3 belangrijkste leerdoelen.</p><FormField control={control} name="selectedLeerdoelen" render={() => (<FormItem><div className="grid grid-cols-1 md:grid-cols-2 gap-2">{predefinedLeerdoelen.map(doel => (<FormField key={doel.id} control={control} name="selectedLeerdoelen" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2"><FormControl><Checkbox checked={field.value?.includes(doel.label)} onCheckedChange={(checked) => { const newVal = field.value || []; return checked ? field.onChange([...newVal, doel.label]) : field.onChange(newVal.filter(v => v !== doel.label)); }}/></FormControl><FormLabel htmlFor={`leerdoel-${doel.id}-edit`} className="font-normal">{doel.label}</FormLabel></FormItem>)} />))}</div><FormMessage/></FormItem>)} /></div><FormField control={control} name="otherLeerdoelen" render={({ field }) => (<FormItem className="mt-4"><FormLabel htmlFor="otherLeerdoelenEdit">Andere leerdoelen/toelichting</FormLabel><Textarea id="otherLeerdoelenEdit" {...field} rows={3} /><FormMessage/></FormItem>)} /></>)}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg flex flex-col h-full"><CardHeader><CardTitle className="flex items-center gap-2 text-xl"><MessageSquare className="h-6 w-6 text-primary"/>1-op-1 Coaching (Coach)</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-4 flex-grow">
                  <p className="text-xs text-muted-foreground mb-3 -mt-2">Geef hier de voorkeuren aan als u op zoek bent naar een 1-op-1 coach.</p>
                  <FormField control={form.control} name="hulpvraagType" render={({ field }) => (<FormItem className="flex items-center space-x-2 mb-4"><Checkbox id="hulpvraag-coach-edit" checked={field.value?.includes('coach')} onCheckedChange={(checked) => { const newVal = field.value || []; return checked ? field.onChange([...newVal, 'coach']) : field.onChange(newVal.filter(v => v !== 'coach')); }} /><FormLabel htmlFor="hulpvraag-coach-edit" className="font-semibold">1-op-1 coaching actief?</FormLabel><FormMessage/></FormItem>)} />
                  {selectedCoachHulp && !coachServiceCovered && (<Alert variant="default" className="bg-orange-50 border-orange-300 text-orange-700 mb-3"><AlertTriangle className="h-5 w-5 !text-orange-600" /><AlertTitleUi className="text-orange-700 font-semibold">Abonnement Vereist</AlertTitleUi><AlertDescUi>Het huidige abonnement '{initialData.planName || 'Gratis Start'}' dekt geen 1-op-1 coaching.<Button variant="link" asChild className="p-0 h-auto ml-1 text-orange-700 hover:text-orange-800"><Link href="/dashboard/ouder/abonnementen">Upgrade nu</Link></Button></AlertDescUi></Alert>)}
                  {selectedCoachHulp && (<><div><FormLabel className="font-semibold text-foreground/90 mb-1 block">Voorkeuren Coach</FormLabel><p className="text-xs text-muted-foreground !mt-0 !mb-2">Selecteer de belangrijkste voorkeuren voor een coach.</p><FormField control={control} name="selectedTutorPreferences" render={() => (<FormItem><div className="grid grid-cols-1 md:grid-cols-2 gap-2">{predefinedTutorPreferences.map(pref => (<FormField key={pref.id} control={control} name="selectedTutorPreferences" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-2"><FormControl><Checkbox checked={field.value?.includes(pref.label)} onCheckedChange={(checked) => { const newVal = field.value || []; return checked ? field.onChange([...newVal, pref.label]) : field.onChange(newVal.filter(v => v !== pref.label)); }}/></FormControl><FormLabel htmlFor={`coachpref-${pref.id}-edit`} className="font-normal">{pref.label}</FormLabel></FormItem>)} />))}</div><FormMessage/></FormItem>)} /></div><FormField control={control} name="otherTutorPreference" render={({ field }) => (<FormItem className="mt-4"><FormLabel htmlFor="otherTutorPreferenceEdit">Andere voorkeuren coach/toelichting</FormLabel><Textarea id="otherTutorPreferenceEdit" {...field} rows={2} /><FormMessage/></FormItem>)} /></>)}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
};

// --- HOOFDPAGINA COMPONENT ---
export default function KindProfielPage() {
  const params = useParams();
  const { toast } = useToast();
  const kindId = params.kindId as string;
  const [childData, setChildData] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let dataToSet: Child | null = null;
    try {
      const storedChildrenRaw = localStorage.getItem('ouderDashboard_kinderen');
      const allChildren: Child[] = storedChildrenRaw ? JSON.parse(storedChildrenRaw) : dummyChildren;
      dataToSet = allChildren.find(c => c.id === kindId) || null;
    } catch (error) {
      console.error("Error parsing children from localStorage, falling back to dummy:", error);
      dataToSet = dummyChildren.find(c => c.id === kindId) || null;
    }
    setChildData(dataToSet);
    setIsLoading(false);
  }, [kindId]);

  const handleSaveProfile = (data: EditableChildData) => {
    if (!childData) return;
    let leerdoelenString = "";
    if (data.selectedLeerdoelen && data.selectedLeerdoelen.length > 0) leerdoelenString += `Geselecteerd: ${data.selectedLeerdoelen.join(', ')}. `;
    if (data.otherLeerdoelen) leerdoelenString += `Overig: ${data.otherLeerdoelen}`;
    let tutorPreferencesString = "";
    if (data.selectedTutorPreferences && data.selectedTutorPreferences.length > 0) tutorPreferencesString += `Geselecteerde voorkeuren: ${data.selectedTutorPreferences.join(', ')}. `;
    if (data.otherTutorPreference) tutorPreferencesString += `Overig: ${data.otherTutorPreference}`;
    
    // Create the updated child data without the 'deelResultatenMetTutor' property
    const updatedChildData: Omit<Child, 'deelResultatenMetTutor'> & { deelResultatenMetTutor?: boolean } = {
        ...childData,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        ageGroup: data.ageGroup,
        childEmail: data.childEmail,
        schoolType: data.schoolType,
        otherSchoolType: data.schoolType === "Anders" ? data.otherSchoolType : undefined,
        className: data.className,
        helpSubjects: data.helpSubjects,
        hulpvraagType: data.hulpvraagType,
        leerdoelen: leerdoelenString.trim() || undefined,
        voorkeurTutor: tutorPreferencesString.trim() || undefined,
        avatarUrl: data.avatarUrl || childData.avatarUrl,
        age: childData.age,
    };
    
    // Remove the property before setting state and saving
    delete updatedChildData.deelResultatenMetTutor;

    setChildData(updatedChildData as Child);

    try {
      const storedChildrenRaw = localStorage.getItem('ouderDashboard_kinderen');
      let allChildrenStored: Child[] = storedChildrenRaw ? JSON.parse(storedChildrenRaw) : dummyChildren;
      const updatedAllChildren = allChildrenStored.map(c => {
        if (c.id === kindId) {
          const finalDataForStorage = { ...updatedChildData };
          delete finalDataForStorage.deelResultatenMetTutor; // Ensure it's not saved
          return finalDataForStorage as Child;
        }
        return c;
      });
      localStorage.setItem('ouderDashboard_kinderen', JSON.stringify(updatedAllChildren));
    } catch (e) { console.error("Error updating localStorage", e); }
    toast({ title: "Profiel Opgeslagen", description: `Gegevens voor ${updatedChildData.name} zijn bijgewerkt.` });
    setIsEditing(false);
  };

  if (isLoading) return <div className="p-8 text-center">Profielgegevens laden...</div>;
  if (!childData) return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center p-4">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-2xl font-bold text-destructive mb-2">Profiel Niet Gevonden</h1>
      <p className="text-muted-foreground mb-6">De gegevens voor dit kind konden niet worden geladen.</p>
      <Button asChild variant="outline"><Link href="/dashboard/ouder/kinderen"><ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Mijn Kinderen</Link></Button>
    </div>
  );

  return (
    <div className="space-y-8">
      {isEditing ? (
        <KindProfielEditForm initialData={childData} onSave={handleSaveProfile} onCancel={() => setIsEditing(false)} />
      ) : (
        <KindProfielView childData={childData} onStartEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
