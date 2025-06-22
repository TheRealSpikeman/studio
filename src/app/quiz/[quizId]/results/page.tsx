// This page will be client-rendered if it needs to access searchParams for subquiz info
"use client";

import { useParams, useSearchParams, useRouter } from 'next/navigation'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizProgressBar } from '@/components/quiz/quiz-progress-bar';
import { Download, RefreshCw, Award, Lightbulb, Target, UserPlus, LogIn, Sparkles, AlertTriangle, ExternalLink } from 'lucide-react'; 
import { SiteLogo } from '@/components/common/site-logo';
import Link from 'next/link';
import { generateQuizSummary } from '@/ai/flows/generate-quiz-summary';
import { generateCoachingInsights } from '@/ai/flows/generate-coaching-insights';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { jsPDF, TextOptionsLight } from 'jspdf';
import { neurotypeDescriptionsTeen, thresholdsTeen } from '@/lib/quiz-data/teen-neurodiversity-quiz'; 
import type { NeurotypeDescription, QuizOption } from '@/lib/quiz-data/teen-neurodiversity-quiz';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";


interface ProfileSection {
  title: string;
  score?: number; 
  explanation: string;
  strengths: string[];
  tips: string[];
}

const dummyResults = {
  summary: "Je basisprofiel suggereert een creatieve en innovatieve denker met een sterke neiging tot detailgerichtheid. Je kunt soms uitdagingen ervaren met het starten van taken.",
  profileSections: [
    { 
      title: "Creatief Denken", 
      explanation: "Je hebt een natuurlijk vermogen om buiten de gebaande paden te denken en originele oplossingen te vinden.",
      strengths: ["Innovatief", "Probleemoplossend", "Verbeeldingskracht"],
      tips: ["Reserveer tijd voor brainstormsessies.", "Zoek inspiratie in diverse bronnen.", "Werk samen met anderen om ideeën te verrijken."]
    },
    { 
      title: "Detailgerichtheid", 
      explanation: "Je hebt oog voor detail en streeft naar nauwkeurigheid in je werk.",
      strengths: ["Accuraat", "Grondig", "Kwaliteitsbewust"],
      tips: ["Gebruik checklists om niets over het hoofd te zien.", "Neem de tijd voor taken die precisie vereisen.", "Vraag feedback om blinde vlekken te identificeren."]
    },
  ],
  coachingInsights: "Focus op het opdelen van grote taken in kleinere, behapbare stappen. Vier kleine successen om momentum op te bouwen."
};

const quizTitles: { [key: string]: string } = {
    'neuroprofile-101': 'Basis Zelfreflectie Tool',
    'adhd-focus-201': 'Aandacht & Focus Verdieping', // Aangepast
    'teen-neurodiversity-quiz': 'Zelfreflectie Tool (12-18 jaar)', // Aangepast
};


export default function QuizResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter(); 
  const quizId = params.quizId as string;
  const subQuizId = searchParams.get('subquiz'); 
  const { toast } = useToast();

  const [summary, setSummary] = useState("Laden van samenvatting...");
  const [coaching, setCoaching] = useState("Laden van coaching inzichten...");
  const [isLoading, setIsLoading] = useState(true);
  
  const quizTitle = quizTitles[quizId] || quizId.replace(/-/g, ' ') || "Zelfreflectie Tool";


  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const storedResultsRaw = localStorage.getItem(`quizResult_${quizId}`);
        if (!storedResultsRaw) {
          throw new Error("Quizresultaten niet gevonden. Doe de quiz eerst.");
        }
        const storedResults = JSON.parse(storedResultsRaw);
        
        const summaryOutput = await generateQuizSummary({ quizResults: JSON.stringify(storedResults) });
        setSummary(summaryOutput.summary);

        const coachingInput = {
          onboardingAnalysisText: summaryOutput.summary,
          userName: "Gebruiker"
        };
        const coachingOutput = await generateCoachingInsights(coachingInput);
        const coachingText = `${coachingOutput.dailyAffirmation}\n\n**Tip:** ${coachingOutput.dailyCoachingTip}\n\n**Kleine taak:** ${coachingOutput.microTaskSuggestion}`;
        setCoaching(coachingText);

      } catch (error) {
        console.error("Error fetching AI results:", error);
        const errorMessage = error instanceof Error ? error.message : "Onbekende fout.";
        setSummary(`Kon samenvatting niet laden. ${errorMessage}`);
        setCoaching("Kon coaching inzichten niet laden.");
        toast({ title: "Fout", description: `Kon resultaten niet laden: ${errorMessage}`, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }

    if (quizId === 'teen-neurodiversity-quiz') {
        setSummary("Je resultaten worden hieronder weergegeven. Dit is een samenvatting van je Zelfreflectie Tool. Je volledige persoonlijke overzicht vind je op de vorige pagina, of download het als PDF.");
        setCoaching("Specifieke coaching inzichten voor de Zelfreflectie Tool (12-18 jaar) vind je in je uitgebreide persoonlijke overzicht.");
        setIsLoading(false); 
    } else {
       fetchData();
    }
  }, [quizId, subQuizId, toast]);


  const resultsToDisplay = isLoading ? { summary, profileSections: [], coachingInsights: coaching } : {
      summary: summary, 
      profileSections: dummyResults.profileSections, 
      coachingInsights: coaching, 
  };

  const handleRestartQuiz = () => {
    router.push(quizId === 'teen-neurodiversity-quiz' ? `/quiz/teen-neurodiversity-quiz` : `/quiz/${quizId}`);
  };

  const handlePdfDownloadClick = () => {
     toast({
        title: "PDF Download (Voorbeeld)",
        description: `Deze functie is nog in ontwikkeling. Je overzicht voor "${quizTitle}" zou hier gedownload worden.`,
      });
  };

  const totalSteps = 3; 
  const currentGlobalStep = 3; 

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-16 md:pt-24 pb-16">
      <div className="absolute top-8 left-8">
            <SiteLogo />
      </div>
      <div className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{quizTitle} - Resultaten</h1>
        <QuizProgressBar currentStep={currentGlobalStep} totalSteps={totalSteps} stepNames={["Basis", "Verdieping", "Resultaten"]} />
      </div>

      <Card className="w-full max-w-3xl shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Award className="h-7 w-7 text-primary" />
            Jouw Persoonlijke Samenvatting
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
            </div>
          ) : (
             <p className="text-muted-foreground">{resultsToDisplay.summary}</p>
          )}
          {subQuizId && <p className="mt-2 text-sm text-accent">Resultaten inclusief verdiepende module: {subQuizId}</p>}
        </CardContent>
      </Card>
      
      {quizId !== 'teen-neurodiversity-quiz' && resultsToDisplay.profileSections.map((section, index) => (
        <Card key={index} className="w-full max-w-3xl shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="h-6 w-6 text-primary" />
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">{section.explanation}</p>
            <div className="mb-3">
              <h4 className="font-semibold mb-1">Sterke punten:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {section.strengths.map((strength, i) => <li key={i}>{strength}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Tips:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {section.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}

       <Card className="w-full max-w-3xl shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Lightbulb className="h-7 w-7 text-accent" />
            Coaching Inzichten
          </CardTitle>
        </CardHeader>
        <CardContent>
           {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
            </div>
          ) : (
           <p className="text-muted-foreground whitespace-pre-wrap">{resultsToDisplay.coachingInsights}</p>
          )}
        </CardContent>
      </Card>

      <Alert variant="destructive" className="w-full max-w-3xl shadow-xl mb-8">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitleUi className="font-semibold text-lg">Belangrijk: Dit is Geen Diagnose</AlertTitleUi>
          <AlertDescUi className="leading-relaxed">
              De resultaten van dit zelfreflectie-instrument zijn bedoeld om inzicht te geven en zelfreflectie te stimuleren. Ze vormen <strong className="font-bold">geen</strong> formele medische of psychologische diagnose.
              Als je vragen of zorgen hebt over je welzijn, of als je overweegt professionele hulp te zoeken, bespreek dit dan met een gekwalificeerde zorgverlener (zoals je huisarts, een psycholoog, of een mentor op school).
              Voor meer informatie over neurodiversiteit en waar je terecht kunt, bezoek onze <Link href="/neurodiversiteit" className="text-primary hover:underline font-semibold">informatiepagina <ExternalLink className="inline h-4 w-4"/> </Link>.
              MindNavigator is niet aansprakelijk voor beslissingen die op basis van dit overzicht worden genomen.
          </AlertDescUi>
      </Alert>

      <Card className="w-full max-w-3xl shadow-xl mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-primary">
            <Sparkles className="h-6 w-6" />
            Ontgrendel je volledige potentieel!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Je hebt een eerste blik op je profiel gekregen. Wil je dieper graven met verdiepende modules en dagelijkse, persoonlijke coaching ontvangen?
          </p>
          <p className="text-lg font-semibold mb-1">Krijg toegang tot premium functies:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4 pl-5">
            <li>Alle verdiepende zelfreflectie modules</li>
            <li>Dagelijkse coaching tips &amp; routines</li>
            <li>Uitgebreide PDF overzichten</li>
            <li>Voortgangstracking en meer!</li>
          </ul>
          <p className="text-center text-xl font-bold text-primary mb-4">
            Vanaf slechts €2,50 per maand!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1" size="lg">
              <Link href="/#pricing">
                Bekijk abonnementen
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-3xl shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-6 w-6 text-primary" />
            Sla je resultaten op &amp; meer!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Maak een gratis account aan om je resultaten op te slaan, je voortgang bij te houden en later makkelijk te upgraden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <Link href="/signup">
                <UserPlus className="mr-2 h-4 w-4" />
                Registreer gratis
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Inloggen
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-4">
        <Button onClick={handleRestartQuiz} variant="outline" className="flex-1">
          <RefreshCw className="mr-2 h-4 w-4" />
          Doe een andere zelfreflectie-instrument
        </Button>
         <Button onClick={handlePdfDownloadClick} variant="outline" className="flex-1" disabled={quizId === 'teen-neurodiversity-quiz'}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF Samenvatting
        </Button>
      </div>
       <Button variant="link" asChild className="mt-8">
          <Link href="/quizzes">Terug naar overzicht zelfreflectie-instrumenten</Link>
        </Button>
    </div>
  );
}
