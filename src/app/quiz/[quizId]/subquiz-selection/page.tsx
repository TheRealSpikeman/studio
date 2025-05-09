// This page will be client-rendered due to user interactions and router usage.
"use client"; 

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizProgressBar } from '@/components/quiz/quiz-progress-bar';
import { ArrowRight, CheckSquare, ListChecks } from 'lucide-react';
import { SiteLogo } from '@/components/common/site-logo';
import Link from 'next/link';


// Dummy data - in a real app, this would be determined by answers to basisvragen
interface SubQuizInfo {
  id: string;
  title: string;
  description: string;
  relevant: boolean; // Determined by AI/logic based on basisvragen
}

const allSubQuizzes: SubQuizInfo[] = [
  { id: 'adhd-deep-dive', title: 'ADHD Verdieping', description: 'Specifieke vragen over aandacht, impulsiviteit en hyperactiviteit.', relevant: true },
  { id: 'asd-social-communication', title: 'Autisme & Sociale Communicatie', description: 'Verkenning van sociale interactie en communicatiepatronen.', relevant: true },
  { id: 'sensory-profile', title: 'Sensorisch Profiel', description: 'Analyse van je reacties op zintuiglijke prikkels.', relevant: false },
  { id: 'executive-functioning', title: 'Executieve Functies', description: 'Quiz over planning, organisatie en zelfregulatie.', relevant: true },
];

const quizTitles: { [key: string]: string } = {
    'neuroprofile-101': 'Basis Neuroprofiel Quiz',
     // ... add other main quiz titles if subquiz selection is generic
};

export default function SubQuizSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const mainQuizId = params.quizId as string; 

  // Filter relevant subquizzes - this logic would be more complex
  const relevantSubQuizzes = allSubQuizzes.filter(sq => sq.relevant);
  const mainQuizTitle = quizTitles[mainQuizId] || "Quiz";

  const handleStartSubQuiz = (subQuizId: string) => {
    // Navigate to the specific subquiz page (which would be similar to TakeQuizPage)
    // For now, we'll assume subquizzes are also identified by their ID under the /quiz/ route.
    // e.g. router.push(`/quiz/${subQuizId}`);
    // For this example, we'll just log it and move to results
    console.log(`Starting subquiz: ${subQuizId} for main quiz: ${mainQuizId}`);
    router.push(`/quiz/${mainQuizId}/results?subquiz=${subQuizId}`); 
  };

  const handleSkipToResults = () => {
    router.push(`/quiz/${mainQuizId}/results`);
  };
  
  const totalSteps = 3; // Basis, Subquiz, Resultaten
  const currentGlobalStep = 2; // Subquiz selectie

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-16 md:pt-24">
       <div className="absolute top-8 left-8">
            <SiteLogo />
      </div>
      <div className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{mainQuizTitle} - Subquiz Keuze</h1>
        <QuizProgressBar currentStep={currentGlobalStep} totalSteps={totalSteps} stepNames={["Basis", "Subquiz", "Resultaten"]} />
      </div>

      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ListChecks className="h-7 w-7 text-primary" />
            Kies een verdiepende subquiz
          </CardTitle>
          <CardDescription>
            Op basis van je antwoorden raden we de volgende subquiz(zen) aan. Je kunt er een kiezen of direct doorgaan naar je basisresultaten.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {relevantSubQuizzes.length > 0 ? (
            relevantSubQuizzes.map(subQuiz => (
              <Card key={subQuiz.id} className="bg-muted/30 hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{subQuiz.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{subQuiz.description}</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleStartSubQuiz(subQuiz.id)} className="w-full">
                    Start {subQuiz.title} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center">Geen specifieke subquizzen aanbevolen op basis van je antwoorden.</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button onClick={handleSkipToResults} variant="secondary" className="w-full">
            <CheckSquare className="mr-2 h-4 w-4" />
            Direct naar resultaten (basisprofiel)
          </Button>
           <Button variant="outline" className="w-full" asChild>
              <Link href={`/quiz/${mainQuizId}`}>Terug naar basisvragen</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
