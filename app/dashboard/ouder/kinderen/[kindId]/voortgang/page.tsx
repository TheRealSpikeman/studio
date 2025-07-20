// src/app/dashboard/ouder/kinderen/[kindId]/voortgang/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BarChart3, MessageSquareText, Activity, Target, ShieldCheck, ShieldAlert, FileText, BookOpen, Brain, ChevronDown, Bot, Loader2, Info } from 'lucide-react';
import { FormattedDateCell } from '@/components/admin/user-management/FormattedDateCell';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { compareParentChildInsights, type CompareParentChildInput } from '../../../../../ai/flows/compare-parent-child-insights-flow';
import type { QuizResult, TutorFeedback, ActivityPoint, Goal, ChildProgressData } from '@/types';


const dummyProgressData: Record<string, ChildProgressData> = {
  'child1': {
    id: 'child1',
    name: 'Sofie de Tester',
    avatarUrl: 'https://picsum.photos/seed/sofiechild/80/80',
    ageGroup: '12-14',
    recentQuizzes: [
      { 
        id: 'neuro1', 
        title: 'Basis Neuroprofiel (12-14 jr)', 
        dateCompleted: new Date(Date.now() - 5 * 86400000).toISOString(), 
        score: 'HSP & Focus',
        reportData: {
          summary: 'Sofie laat een sterk ontwikkeld empathisch vermogen zien en een goed oog voor detail. Concentratie bij routineuze taken is een aandachtspunt.', 
          answers: [
              { question: "Hoe voel je je meestal in sociale situaties?", answer: "Afhankelijk van de situatie" },
              { question: "Hoe ga je om met onverwachte veranderingen?", answer: "Ik vind het lastig, maar pas me aan." },
              { question: "Wat doe je als je overprikkeld raakt?", answer: "Ik zoek een rustig plekje op." }
          ],
        },
        isShared: true, 
        reportLink: '#' 
      },
      { 
        id: 'focus1', 
        title: 'Focus & Planning Quiz', 
        dateCompleted: new Date(Date.now() - 12 * 86400000).toISOString(), 
        score: 'Gemiddeld',
        reportData: {
          summary: 'Resultaten wijzen op een behoefte aan meer structuur in planning. Tips voor Pomodoro techniek gegeven.',
          answers: [
              { question: "Hoe vaak stel je huiswerk uit?", answer: "Soms" },
              { question: "Gebruik je een agenda of planner?", answer: "Niet altijd consequent" }
          ],
        },
        isShared: true,
      },
    ],
    tutorFeedback: [
      { feedbackId: 'fb1', date: new Date(Date.now() - 3 * 86400000).toISOString(), tutorName: 'Mevr. Jansen', lessonSubject: 'Wiskunde A', comment: 'Sofie was vandaag erg betrokken en stelde goede vragen over algebra. We hebben de basis van vergelijkingen oplossen doorgenomen. Huiswerk: oefeningen 1 t/m 5.' },
      { feedbackId: 'fb2', date: new Date(Date.now() - 10 * 86400000).toISOString(), tutorName: 'Dhr. Pietersen', lessonSubject: 'Engels Grammatica', comment: 'De onregelmatige werkwoorden blijven lastig. Extra oefening met de lijst is aanbevolen. Goed gewerkt aan de uitspraak.' },
    ],
    activityData: [
      { month: 'Jan', completedLessons: 3, completedQuizzes: 1 },
      { month: 'Feb', completedLessons: 4, completedQuizzes: 2 },
      { month: 'Maa', completedLessons: 2, completedQuizzes: 1 },
    ],
    goals: [
        { goalId: 'goal1', description: 'Alle wiskunde huiswerk op tijd af hebben deze maand.', status: 'in_progress' }
    ]
  },
  'child2': {
    id: 'child2',
    name: 'Max de Tester',
    avatarUrl: 'https://picsum.photos/seed/maxchild/80/80',
    ageGroup: '15-18',
    recentQuizzes: [
      { 
        id: 'neuro2', 
        title: 'Basis Neuroprofiel (15-18 jr)', 
        dateCompleted: new Date(Date.now() - 8 * 86400000).toISOString(), 
        score: 'ADHD Kenmerken',
        reportData: {
          summary: 'Max is een creatieve denker en komt snel tot oplossingen. Het vasthouden van aandacht bij langere uitleg kan een uitdaging zijn.',
          answers: [
               { question: "Hoe ga je om met deadlines?", answer: "Ik werk het beste onder druk, dus vaak op het laatste moment." },
          ]
        },
        isShared: false,
      },
    ],
    tutorFeedback: [
      { feedbackId: 'fb3', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), tutorName: 'Mevr. de Wit', lessonSubject: 'Nederlands', comment: 'Tekstanalyse van gedichten ging goed. Max kan zijn argumenten goed onderbouwen. Focus volgende keer op synoniemen.' },
    ],
    activityData: [
      { month: 'Jan', completedLessons: 2, completedQuizzes: 0 },
      { month: 'Feb', completedLessons: 1, completedQuizzes: 1 },
      { month: 'Maa', completedLessons: 3, completedQuizzes: 0 },
    ],
  },
};


export default function KindVoortgangPage() {
  const params = useParams();
  const router = useRouter();
  const kindId = params.kindId as string;
  const { toast } = useToast();
  const [childData, setChildData] = useState<ChildProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vergelijkendAdvies, setVergelijkendAdvies] = useState<string | null>(null);
  const [isLoadingVergelijkendAdvies, setIsLoadingVergelijkendAdvies] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let dataToSet: ChildProgressData | null = null;
    try {
      const data = dummyProgressData[kindId];
      if (data) {
        dataToSet = data;
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setChildData(dataToSet);
    setIsLoading(false);
  }, [kindId]);

  const getInitials = (name?: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';

  const handleGenereerVergelijkendAdvies = async () => {
    if (!childData) return;
    
    const parentDataRaw = localStorage.getItem(`parentObservation_${childData.id}`);
    const parentObservations = parentDataRaw ? JSON.parse(parentDataRaw) : [];
    const sharedChildQuiz = childData.recentQuizzes.find(q => q.isShared && q.reportData.answers && q.reportData.answers.length > 0);

    if (parentObservations.length === 0 || !sharedChildQuiz) {
        toast({
            title: "Onvoldoende gegevens",
            description: "Zorg ervoor dat de 'Ken je Kind' quiz is voltooid en de resultaten van minimaal één kind-zelfreflectie gedeeld zijn.",
            variant: "destructive"
        });
        return;
    }

    setIsLoadingVergelijkendAdvies(true);
    setVergelijkendAdvies(null);

    try {
      const input: CompareParentChildInput = {
        childName: childData.name,
        childAgeGroup: childData.ageGroup || "onbekend",
        parentObservations: parentObservations,
        childSelfReflection: sharedChildQuiz.reportData.answers || [],
      };
      const result = await compareParentChildInsights(input);
      setVergelijkendAdvies(result.parentingAdvice);
    } catch (error) {
      console.error("Error generating comparative advice:", error);
      setVergelijkendAdvies("Kon het vergelijkend advies niet genereren. Probeer het later opnieuw.");
      toast({ title: "Fout", description: "Kon advies niet genereren.", variant: "destructive" });
    } finally {
      setIsLoadingVergelijkendAdvies(false);
    }
  };

  const renderComparativeAnalysisContent = () => {
    if (!childData) return null;

    const parentDataRaw = localStorage.getItem(`parentObservation_${childData.id}`);
    const hasParentObservation = parentDataRaw && JSON.parse(parentDataRaw).length > 0;
    const hasChildReflection = childData.recentQuizzes.some(q => q.isShared && q.reportData.answers && q.reportData.answers.length > 0);
    
    if (hasParentObservation && hasChildReflection) {
      return (
        <div className="space-y-4">
          <Button onClick={handleGenereerVergelijkendAdvies} disabled={isLoadingVergelijkendAdvies}>
            {isLoadingVergelijkendAdvies && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Genereer Advies
          </Button>
          {isLoadingVergelijkendAdvies && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Advies wordt gegenereerd...</p>
            </div>
          )}
          {vergelijkendAdvies && (
            <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/30 p-4 rounded-md border">
              <div dangerouslySetInnerHTML={{ __html: vergelijkendAdvies.replace(/
/g, '<br />').replace(/## (.*?)(<br \/>|$)/g, '<h3>$1</h3>').replace(/\* (.*?)(<br \/>|$)/g, '<li>$1</li>') }} />
            </div>
          )}
        </div>
      );
    }

    let alertTitle = "";
    let alertDescription = "";
    let alertLink: string | null = null;
    let alertLinkText = "Start de vragenlijst (voor u als ouder)";

    if (!hasParentObservation && !hasChildReflection) {
      alertTitle = "Start de Analyse";
      alertDescription = `Om een vergelijkende analyse te maken, vult u de "Ken je Kind" vragenlijst in en vraagt u ${childData.name} om de zelfreflectie te voltooien en te delen.`;
      alertLink = `/quiz/ouder-symptomen-check?kindId=${childData.id}`;
    } else if (hasParentObservation && !hasChildReflection) {
      alertTitle = `Wachten op Zelfreflectie van ${childData.name}`;
      alertDescription = `U heeft uw observaties ingevuld. Zodra ${childData.name} de zelfreflectie heeft voltooid en de resultaten heeft gedeeld, kunt u hier de analyse genereren.`;
    } else if (!hasParentObservation && hasChildReflection) {
      alertTitle = "Actie Vereist: Vul uw Observaties in";
      alertDescription = `${childData.name} heeft de zelfreflectie voltooid! Vul nu de "Ken je Kind" vragenlijst in om de analyse te ontgrendelen.`;
      alertLink = `/quiz/ouder-symptomen-check?kindId=${childData.id}`;
    }

    return (
      <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700">
        <Bot className="h-5 w-5 !text-blue-600"/>
        <AlertTitleUi className="text-blue-700 font-semibold">{alertTitle}</AlertTitleUi>
        <AlertDescUi className="text-blue-600">
          {alertDescription}
          {alertLink && (
            <>
              <br />
              <Button asChild variant="link" className="p-0 h-auto mt-1 text-blue-700 hover:text-blue-800">
                <Link href={alertLink}>
                  {alertLinkText}
                </Link>
              </Button>
            </>
          )}
        </AlertDescUi>
      </Alert>
    );
  };


  if (isLoading) {
    return <div className="p-8 text-center">Voortgangsgegevens laden...</div>;
  }

  if (!childData) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Gegevens niet gevonden</h1>
        <p className="text-muted-foreground mb-6">De voortgangsgegevens voor dit kind konden niet worden geladen.</p>
        <Button asChild variant="outline"><Link href="/dashboard/ouder/kinderen"><ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Mijn Kinderen</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={childData.avatarUrl} alt={childData.name} data-ai-hint="child person" />
            <AvatarFallback className="text-2xl">{getInitials(childData.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Voortgang van {childData.name}</h1>
            <p className="text-muted-foreground">Een overzicht van recente activiteiten en inzichten.</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/ouder/kinderen">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Mijn Kinderen
          </Link>
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["comparative-analysis-section", "quiz-results-section", "tutor-feedback-section"]} className="w-full space-y-6">
        
        <AccordionItem value="comparative-analysis-section" className="border-0">
          <Card className="shadow-lg">
            <AccordionTrigger className="hover:no-underline w-full rounded-t-lg data-[state=closed]:rounded-b-lg [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-primary [&[data-state=open]>svg]:rotate-180 p-6">
              <div className="flex-1 text-left">
                <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6 text-primary"/>Vergelijkende Analyse & Advies (AI)</CardTitle>
                <CardDescription>AI-gegenereerd advies op basis van uw observaties en de zelfreflectie van {childData.name}.</CardDescription>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-4 pt-6">
                {renderComparativeAnalysisContent()}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="quiz-results-section" className="border-0">
          <Card className="shadow-lg">
            <AccordionTrigger className="hover:no-underline w-full rounded-t-lg data-[state=closed]:rounded-b-lg [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-primary [&[data-state=open]>svg]:rotate-180 p-6">
              <div className="flex-1 text-left">
                <CardTitle className="flex items-center gap-2"><FileText className="h-6 w-6 text-primary"/>Recente Quizresultaten</CardTitle>
                <CardDescription>Een samenvatting van de laatst gemaakte quizzen.</CardDescription>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-4 pt-6">
                {childData.recentQuizzes.length > 0 ? childData.recentQuizzes.map(quiz => (
                  <Card key={quiz.id} className="p-4 bg-muted/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-primary">{quiz.title}</h4>
                        <p className="text-xs text-muted-foreground">Voltooid op: <FormattedDateCell isoDateString={quiz.dateCompleted} dateFormatPattern="P" /></p>
                      </div>
                      <Badge variant={quiz.isShared ? 'default' : 'secondary'} className={quiz.isShared ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-300"}>
                        {quiz.isShared ? <ShieldCheck className="mr-1.5 h-3.5 w-3.5"/> : <ShieldAlert className="mr-1.5 h-3.5 w-3.5"/>}
                        {quiz.isShared ? 'Gedeeld' : 'Niet Gedeeld'}
                      </Badge>
                    </div>
                    {quiz.isShared ? (
                      <p className="text-sm text-foreground/80 mt-2">{quiz.reportData.summary}</p>
                    ) : (
                      <Alert variant="default" className="mt-2 p-3 text-xs bg-yellow-50/80 border-yellow-200">
                          <ShieldAlert className="h-4 w-4 !text-yellow-600"/>
                          <AlertDescUi className="!text-yellow-700 pl-1">
                              De details van deze quiz zijn niet met u gedeeld door {childData.name}.
                          </AlertDescUi>
                      </Alert>
                    )}
                    {quiz.isShared && quiz.reportLink && (
                      <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                        <Link href={quiz.reportLink} target="_blank">Bekijk volledig rapport (voorbeeld)</Link>
                      </Button>
                    )}
                  </Card>
                )) : (
                  <p className="text-muted-foreground text-center py-3">Nog geen quizresultaten beschikbaar.</p>
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="tutor-feedback-section" className="border-0">
          <Card className="shadow-lg">
            <AccordionTrigger className="hover:no-underline w-full rounded-t-lg data-[state=closed]:rounded-b-lg [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-primary [&[data-state=open]>svg]:rotate-180 p-6">
               <div className="flex-1 text-left">
                <CardTitle className="flex items-center gap-2"><MessageSquareText className="h-6 w-6 text-primary"/>Feedback van Tutors</CardTitle>
                <CardDescription>Belangrijke opmerkingen en feedback uit recente bijlessen.</CardDescription>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="space-y-4 pt-6">
                {childData.tutorFeedback.length > 0 ? childData.tutorFeedback.map(fb => (
                  <Card key={fb.feedbackId} className="p-4 bg-muted/30">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold">{fb.lessonSubject} (met {fb.tutorName})</h4>
                      <p className="text-xs text-muted-foreground"><FormattedDateCell isoDateString={fb.date} dateFormatPattern="P" /></p>
                    </div>
                    <p className="text-sm text-foreground/80">{fb.comment}</p>
                  </Card>
                )) : (
                  <p className="text-muted-foreground text-center py-3">Nog geen feedback van tutors ontvangen.</p>
                )}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Activity className="h-6 w-6 text-primary"/>Activiteitenoverzicht</CardTitle>
          <CardDescription>Een visueel overzicht van voltooide lessen en quizzen.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-60 bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground italic">Grafiek: Voltooide lessen/quizzen per periode (binnenkort beschikbaar)</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="h-6 w-6 text-primary"/>Doelen (binnenkort)</CardTitle>
          <CardDescription>Bekijk en stel hier leerdoelen in voor {childData.name}.</CardDescription>
        </CardHeader>
        <CardContent>
            {childData.goals && childData.goals.length > 0 ? childData.goals.map(goal => (
                 <div key={goal.goalId} className="p-3 border rounded-md mb-2 bg-blue-50/70">
                    <p className="font-medium text-blue-700">{goal.description}</p>
                    <Badge variant="outline" className="mt-1 text-xs border-blue-300 text-blue-600">Status: {goal.status.replace('_', ' ')}</Badge>
                 </div>
            )) : (
                 <p className="text-muted-foreground text-center py-3">Nog geen doelen ingesteld. Deze functionaliteit is binnenkort beschikbaar.</p>
            )}
        </CardContent>
      </Card>

    </div>
  );
}
