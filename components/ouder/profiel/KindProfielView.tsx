// src/components/ouder/profiel/KindProfielView.tsx
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, Mail, Cake, School, GraduationCap, Target, Users as UsersIcon, Share2, Edit, AlertTriangle, MessageSquare, BookOpenCheck } from '@/lib/icons';
import { allHomeworkSubjects } from '@/lib/quiz-data/subject-data';
import type { Child } from '@/types/dashboard';
import { isTutorServiceCoveredByPlan, isCoachServiceCoveredByPlan } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Helper function to parse strings like "Geselecteerd: item1, item2. Overig: text"
const parseMultiPartString = (str: string | undefined): { selected: string[]; other: string } => {
  if (!str) return { selected: [], other: '' };
  const geselecteerdMatch = str.match(/Geselecteerd:\s*(.*?)(?=\s*\.\s*Overig:|$)/i);
  const overigMatch = str.match(/Overig:\s*(.*)/i);
  const selectedItems = geselecteerdMatch ? geselecteerdMatch[1].trim().split(',').map(s => s.trim()).filter(Boolean) : [];
  const otherText = overigMatch ? overigMatch[1].trim() : (geselecteerdMatch && !str.includes("Overig:") ? '' : (!geselecteerdMatch ? str : ''));
  return { selected: selectedItems, other: otherText };
};

const getInitials = (name?: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

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

export const KindProfielView = ({ childData, onStartEdit }: { childData: Child; onStartEdit: () => void }) => {
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
                    <strong className="font-medium text-foreground/80">Abonnement Status:</strong> <Badge variant={getSubscriptionBadgeVariant(childData.subscriptionStatus)} className={cn("capitalize", getSubscriptionBadgeClasses(childData.subscriptionStatus))}>{childData.subscriptionStatus.charAt(0).toUpperCase() + childData.subscriptionStatus.slice(1)}</Badge>
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
                      <AlertTitle className="text-orange-700 font-semibold">Abonnement Vereist</AlertTitle>
                      <AlertDescription>Het huidige abonnement '{childData.planName || 'Nog geen abonnement'}' dekt geen tutorbegeleiding. Om een tutor te koppelen is een upgrade naar 'Gezins Gids' of 'Premium' nodig.<Button variant="link" asChild className="p-0 h-auto ml-1 text-orange-700 hover:text-orange-800"><Link href="/dashboard/ouder/abonnementen">Upgrade nu</Link></Button></AlertDescription>
                  </Alert>
              )}
              {tutorServiceActiveForChild ? (
                <>
                  <div><h4 className="font-semibold text-foreground/90 mb-1 mt-2 flex items-center gap-1"><BookOpenCheck className="h-4 w-4"/>Hulp bij Vakken</h4>{childData.helpSubjects && childData.helpSubjects.length > 0 ? (<ul className="list-disc list-inside space-y-1 pl-2 text-muted-foreground">{childData.helpSubjects.map(id => <li key={id}>{getSubjectName(id)}</li>)}</ul>) : (<p className="text-muted-foreground">Geen specifieke hulpvakken opgegeven.</p>)}</div>
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
              {coachServiceActiveForChild && !coachServiceCovered && (<Alert variant="default" className="bg-orange-50 border-orange-300 text-orange-700 mb-3"><AlertTriangle className="h-5 w-5 !text-orange-600" /><AlertTitle className="text-orange-700 font-semibold">Abonnement Vereist</AlertTitle><AlertDescription>Het huidige abonnement '{childData.planName || 'Gratis Start'}' dekt geen 1-op-1 coaching.<Button variant="link" asChild className="p-0 h-auto ml-1 text-orange-700 hover:text-orange-800"><Link href="/dashboard/ouder/abonnementen">Upgrade nu</Link></Button></AlertDescription></Alert>)}
              {coachServiceActiveForChild ? (<div className="mt-2"><h4 className="font-semibold text-foreground/90 mb-1 flex items-center gap-1"><UsersIcon className="h-4 w-4"/>Voorkeuren Coach</h4>{tutorVoorkeurenParsed.selected.length > 0 && (<div><p className="font-medium text-foreground/80">Geselecteerd:</p><ul className="list-disc list-inside space-y-0.5 pl-2 text-muted-foreground">{tutorVoorkeurenParsed.selected.map((pref, index) => (<li key={index}>{pref}</li>))}</ul></div>)}{tutorVoorkeurenParsed.other && (<p className="mt-1"><strong className="font-medium text-foreground/80">Overig:</strong> <span className="text-muted-foreground whitespace-pre-line">{tutorVoorkeurenParsed.other}</span></p>)}{(tutorVoorkeurenParsed.selected.length === 0 && !tutorVoorkeurenParsed.other) && (<p className="text-muted-foreground">Geen specifieke voorkeuren opgegeven.</p>)}</div>
              ) : (<p className="text-muted-foreground text-sm">1-op-1 coaching is niet geactiveerd voor {childData.firstName}. U kunt dit aanzetten via "Profiel Bewerken".</p>)}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
