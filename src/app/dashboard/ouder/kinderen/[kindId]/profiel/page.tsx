
// src/app/dashboard/ouder/kinderen/[kindId]/profiel/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, Cake, School, GraduationCap, Target, Users as UsersIcon, Share2, Edit, Link2, Info, ShieldAlert, AlertTriangle, HelpCircle, CheckSquare, BookOpen } from 'lucide-react';
import { allHomeworkSubjects } from '@/lib/quiz-data/subject-data';
import type { User as UserType } from '@/types/user'; 

interface Child extends Pick<UserType, 'id' | 'name' | 'ageGroup' | 'avatarUrl' | 'hulpvraagType' > {
  firstName: string;
  lastName: string;
  age?: number;
  childEmail?: string;
  schoolType?: string;
  className?: string;
  helpSubjects?: string[];
  subscriptionStatus: 'actief' | 'geen' | 'verlopen' | 'uitgenodigd';
  lastActivity?: string;
  leerdoelen?: string;
  voorkeurTutor?: string;
  deelResultatenMetTutor?: boolean;
  linkedTutorIds?: string[];
}

const dummyChildren: Child[] = [
   {
    id: 'child1',
    firstName: 'Sofie',
    lastName: 'de Tester',
    name: 'Sofie de Tester',
    age: 13,
    ageGroup: '12-14',
    avatarUrl: 'https://picsum.photos/seed/sofiechild/80/80',
    subscriptionStatus: 'actief',
    lastActivity: 'Quiz "Basis Neuroprofiel" voltooid',
    childEmail: 'sofie.tester@example.com',
    schoolType: 'HAVO',
    className: '2B',
    helpSubjects: ['wiskunde', 'nederlands'],
    hulpvraagType: ['tutor'],
    leerdoelen: 'Geselecteerd: Beter leren plannen voor toetsen, Omgaan met faalangst. Overig: Kind heeft moeite met beginnen aan taken.',
    voorkeurTutor: 'Geselecteerde voorkeuren: Ervaring met HSP, Geduldig. Overig: Iemand met ervaring met visueel ingestelde leerlingen.',
    deelResultatenMetTutor: true,
    linkedTutorIds: ['tutor1'],
  },
  {
    id: 'child2',
    firstName: 'Max',
    lastName: 'de Tester',
    name: 'Max de Tester',
    age: 16,
    ageGroup: '15-18',
    avatarUrl: 'https://picsum.photos/seed/maxchild/80/80',
    subscriptionStatus: 'actief',
    lastActivity: 'Laatste les: Engels (1 dag geleden)',
    childEmail: 'max.tester@example.com',
    schoolType: 'VWO',
    helpSubjects: ['engels', 'geschiedenis'],
    hulpvraagType: ['tutor', 'coach'],
    leerdoelen: 'Geselecteerd: Concentratie verbeteren tijdens de les. Overig: Verbeteren van spreekvaardigheid Engels en essay schrijven.',
    voorkeurTutor: 'Geselecteerde voorkeuren: Man. Overig: Tutor die ook kan helpen met motivatie.',
    deelResultatenMetTutor: false,
    linkedTutorIds: [],
  },
  {
    id: 'child3',
    firstName: 'Lisa',
    lastName: 'Voorbeeld',
    name: 'Lisa Voorbeeld',
    age: 12,
    ageGroup: '12-14',
    subscriptionStatus: 'uitgenodigd',
    lastActivity: 'Coaching tip van gisteren bekeken',
    childEmail: 'lisa.voorbeeld@example.com',
    helpSubjects: [],
    hulpvraagType: ['coach'],
    leerdoelen: 'Geselecteerd: Zelfvertrouwen vergroten.',
    voorkeurTutor: 'Geselecteerde voorkeuren: Vrouw, Ervaring met faalangst.',
    deelResultatenMetTutor: true,
    linkedTutorIds: ['tutor2', 'tutor3'],
  },
];

const getSubscriptionBadgeVariant = (status: Child['subscriptionStatus']): "default" | "secondary" | "destructive" | "outline" => {
  if (status === 'actief') return 'default';
  if (status === 'geen') return 'secondary';
  if (status === 'uitgenodigd') return 'outline';
  return 'destructive'; 
};
const getSubscriptionBadgeClasses = (status: Child['subscriptionStatus']): string => {
  if (status === 'actief') return 'bg-green-100 text-green-700 border-green-300';
  if (status === 'geen') return 'bg-gray-100 text-gray-700 border-gray-300';
  if (status === 'uitgenodigd') return 'bg-blue-100 text-blue-700 border-blue-300';
  return 'bg-red-100 text-red-700 border-red-300'; 
};

const parseMultiPartString = (str: string | undefined): { geselecteerd: string; overig: string } => {
  if (!str) return { geselecteerd: 'Niet opgegeven.', overig: '' };
  const geselecteerdMatch = str.match(/Geselecteerd:\s*(.*?)(?=\s*\.\s*Overig:|$)/i);
  const overigMatch = str.match(/Overig:\s*(.*)/i);
  return {
    geselecteerd: geselecteerdMatch ? geselecteerdMatch[1].trim() : (overigMatch ? '' : str),
    overig: overigMatch ? overigMatch[1].trim() : '',
  };
};

const formatHulpvraagType = (types?: ('tutor' | 'coach')[]): string => {
  if (!types || types.length === 0) return 'Niet gespecificeerd';
  return types.map(type => {
    if (type === 'tutor') return 'Hulp bij huiswerk (Tutor)';
    if (type === 'coach') return '1-op-1 coaching (Coach)';
    return type;
  }).join(', ');
};

export default function KindProfielPage() {
  const params = useParams();
  const router = useRouter();
  const kindId = params.kindId as string;
  const [childData, setChildData] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const allChildren: Child[] = JSON.parse(localStorage.getItem('ouderDashboard_kinderen') || JSON.stringify(dummyChildren));
    const data = allChildren.find(c => c.id === kindId);
    if (data) {
      setChildData(data);
    } else {
      console.error("Kind data niet gevonden voor ID:", kindId);
    }
    setIsLoading(false);
  }, [kindId]);

  const getInitials = (name?: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';
  const getSubjectName = (subjectId: string) => allHomeworkSubjects.find(s => s.id === subjectId)?.name || subjectId;
  
  const leerdoelenParsed = parseMultiPartString(childData?.leerdoelen);
  const tutorVoorkeurenParsed = parseMultiPartString(childData?.voorkeurTutor);

  if (isLoading) {
    return <div className="p-8 text-center">Profielgegevens laden...</div>;
  }

  if (!childData) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Profiel niet gevonden</h1>
        <p className="text-muted-foreground mb-6">De profielgegevens voor dit kind konden niet worden geladen.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/ouder/kinderen">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Mijn Kinderen
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-lg bg-card shadow">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={childData.avatarUrl} alt={childData.name} data-ai-hint="child person" />
            <AvatarFallback className="text-3xl bg-muted">{getInitials(childData.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{childData.name}</h1>
            <p className="text-muted-foreground">Profieloverzicht en instellingen.</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/ouder/kinderen">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Mijn Kinderen
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1: Persoonlijke Gegevens */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><User className="h-6 w-6 text-primary"/>Persoonlijke Gegevens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><strong className="font-medium text-foreground/80">Volledige Naam:</strong> <span className="text-foreground">{childData.firstName} {childData.lastName}</span></div>
              <div><strong className="font-medium text-foreground/80">Leeftijd:</strong> <span className="text-foreground">{childData.age ? `${childData.age} jaar` : (childData.ageGroup || 'N.v.t.')}</span></div>
              <div><strong className="font-medium text-foreground/80">E-mail Kind:</strong> <span className="text-foreground">{childData.childEmail || 'Niet opgegeven'}</span></div>
              <div><strong className="font-medium text-foreground/80">Account Status:</strong> <Badge variant={getSubscriptionBadgeVariant(childData.subscriptionStatus)} className={getSubscriptionBadgeClasses(childData.subscriptionStatus)}>{childData.subscriptionStatus.charAt(0).toUpperCase() + childData.subscriptionStatus.slice(1)}</Badge></div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom 2: School & Hulpvraag */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><School className="h-6 w-6 text-primary"/>School &amp; Hulpvraag</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-foreground/90 mb-1">Schoolinformatie</h4>
                <p><strong className="font-medium text-foreground/80">Schooltype:</strong> <span className="text-foreground">{childData.schoolType || 'Niet opgegeven'}</span></p>
                <p><strong className="font-medium text-foreground/80">Klas:</strong> <span className="text-foreground">{childData.className || 'Niet opgegeven'}</span></p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90 mb-1">Type Hulpvraag</h4>
                 <p><strong className="font-medium text-foreground/80">Geselecteerd:</strong> <span className="text-foreground">{formatHulpvraagType(childData.hulpvraagType)}</span></p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90 mb-1 flex items-center gap-1"><BookOpen className="h-4 w-4"/>Hulp bij Vakken</h4>
                {childData.helpSubjects && childData.helpSubjects.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 pl-2 text-foreground">
                    {childData.helpSubjects.map(id => <li key={id}>{getSubjectName(id)}</li>)}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">Geen specifieke hulpvakken opgegeven.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom 3: Leerdoelen, Voorkeuren, Privacy */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Target className="h-6 w-6 text-primary"/>Leerdoelen &amp; Aandachtspunten</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {leerdoelenParsed.geselecteerd && (
                <p><strong className="font-medium text-foreground/80">Geselecteerd:</strong> <span className="text-muted-foreground">{leerdoelenParsed.geselecteerd}</span></p>
              )}
              {leerdoelenParsed.overig && (
                <p><strong className="font-medium text-foreground/80">Overig:</strong> <span className="text-muted-foreground whitespace-pre-line">{leerdoelenParsed.overig}</span></p>
              )}
              {!leerdoelenParsed.geselecteerd && !leerdoelenParsed.overig && (
                <p className="text-muted-foreground">Niet opgegeven.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><UsersIcon className="h-6 w-6 text-primary"/>Voorkeuren Begeleider</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {tutorVoorkeurenParsed.geselecteerd && (
                <p><strong className="font-medium text-foreground/80">Geselecteerd:</strong> <span className="text-muted-foreground">{tutorVoorkeurenParsed.geselecteerd}</span></p>
              )}
              {tutorVoorkeurenParsed.overig && (
                <p><strong className="font-medium text-foreground/80">Overig:</strong> <span className="text-muted-foreground whitespace-pre-line">{tutorVoorkeurenParsed.overig}</span></p>
              )}
               {!tutorVoorkeurenParsed.geselecteerd && !tutorVoorkeurenParsed.overig && (
                <p className="text-muted-foreground">Geen specifieke voorkeuren opgegeven.</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Share2 className="h-6 w-6 text-primary"/>Privacy &amp; Delen</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-foreground/80">Quizresultaten delen met begeleiders:</p>
                <Badge variant={childData.deelResultatenMetTutor ? "default" : "secondary"} className={childData.deelResultatenMetTutor ? 'bg-green-100 text-green-700 border-green-300' : ''}>
                  {childData.deelResultatenMetTutor ? 'Ja' : 'Nee'}
                </Badge>
              </div>
               <Button variant="outline" size="sm" disabled>
                  <Edit className="mr-2 h-3.5 w-3.5" /> Deelinstellingen Wijzigen (binnenkort)
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end mt-6 pt-6 border-t">
        <Button size="lg" disabled>
            <Edit className="mr-2 h-4 w-4" /> Kindprofiel Bewerken (binnenkort)
        </Button>
      </div>
    </div>
  );
}

