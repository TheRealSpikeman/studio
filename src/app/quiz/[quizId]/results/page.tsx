// This page will be client-rendered if it needs to access searchParams for subquiz info
"use client";

import { useParams, useSearchParams, useRouter } from 'next/navigation'; // Added useRouter
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizProgressBar } from '@/components/quiz/quiz-progress-bar';
import { Download, RefreshCw, Award, Lightbulb, Target, UserPlus, LogIn } from 'lucide-react'; // Added UserPlus, LogIn
import { SiteLogo } from '@/components/common/site-logo';
import Link from 'next/link';
import { generateQuizSummary, generateCoachingInsights } from '@/ai/flows'; 
import { useEffect, useState } from 'react';

// Dummy data - replace with actual data fetching and AI generation
interface ProfileSection {
  title: string;
  score?: number; // Optional score display
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
    'neuroprofile-101': 'Basis Neuroprofiel Quiz',
    'adhd-focus-201': 'ADHD & Focus Verdieping',
     // ... add other quiz titles
};


export default function QuizResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialized useRouter
  const quizId = params.quizId as string;
  const subQuizId = searchParams.get('subquiz'); 

  const [summary, setSummary] = useState("Laden van samenvatting...");
  const [coaching, setCoaching] = useState("Laden van coaching inzichten...");
  const [isLoading, setIsLoading] = useState(true);
  
  const quizTitle = quizTitles[quizId] || "Quiz";

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const quizResultsForAI = { question1: "answerA", question2: "answerB" }; 
        
        const summaryOutput = await generateQuizSummary({ quizResults: quizResultsForAI });
        setSummary(summaryOutput.summary);

        const coachingInput = {
          quizResults: JSON.stringify(quizResultsForAI),
          profileDescription: "Gebruiker heeft zojuist een neurodiversiteitsquiz voltooid."
        };
        const coachingOutput = await generateCoachingInsights(coachingInput);
        setCoaching(coachingOutput.coachingInsights);

      } catch (error) {
        console.error("Error fetching AI results:", error);
        setSummary("Kon samenvatting niet laden. Probeer het later opnieuw.");
        setCoaching("Kon coaching inzichten niet laden.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [quizId, subQuizId]);


  const resultsToDisplay = isLoading ? { summary, profileSections: [], coachingInsights: coaching } : dummyResults;

  const handleRestartQuiz = () => {
    router.push(`/quiz/${quizId}`);
  };

  const totalSteps = 3; 
  const currentGlobalStep = 3; 

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-16 md:pt-24">
      <div className="absolute top-8 left-8">
            <SiteLogo />
      </div>
      <div className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{quizTitle} - Resultaten</h1>
        <QuizProgressBar currentStep={currentGlobalStep} totalSteps={totalSteps} stepNames={["Basis", "Subquiz", "Resultaten"]} />
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
          {subQuizId && <p className="mt-2 text-sm text-accent">Resultaten inclusief subquiz: {subQuizId}</p>}
        </CardContent>
      </Card>
      
      {resultsToDisplay.profileSections.map((section, index) => (
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
           <p className="text-muted-foreground">{resultsToDisplay.coachingInsights}</p>
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-3xl shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-6 w-6 text-primary" />
            Sla je resultaten op!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Wil je je resultaten opslaan, je voortgang bijhouden en toegang krijgen tot meer functies?
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
          Herstart Quiz
        </Button>
      </div>
       <Button variant="link" asChild className="mt-8">
          <Link href="/quizzes">Terug naar quiz overzicht</Link>
        </Button>
    </div>
  );
}
