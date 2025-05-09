// src/app/quiz/teen-neurodiversity-quiz/page.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteLogo } from '@/components/common/site-logo';
import Link from 'next/link';
import { ArrowRight, CheckSquare, RefreshCw, Info, AlertTriangle, Sparkles, UserPlus, LogIn } from 'lucide-react';
import { TeenQuizProgressBar } from '@/components/quiz/teen-quiz-progress-bar';
import { TeenQuestion } from '@/components/quiz/teen-question';
import {
  baseQuestionsTeen12_14,
  baseQuestionsTeen15_18,
  subTestsTeen12_14,
  subTestsTeen15_18,
  subtestDescriptionsTeen,
  thresholdsTeen12_14,
  thresholdsTeen15_18,
  neurotypeDescriptionsTeen,
  NeurotypeDescription,
  answerOptions,
  calculateAverage,
  QuizOption, // Ensure QuizOption is exported if TeenQuestion needs it directly from here
} from '@/lib/quiz-data/teen-neurodiversity-quiz';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";


type QuizStep = 'intro' | 'baseQuestions' | 'subtestConfirmation' | 'subtestQuestions' | 'results';
type AgeGroup = '12-14' | '15-18' | null;

interface Scores {
  [key: string]: number;
}

export default function TeenNeurodiversityQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(null);
  
  const [currentStep, setCurrentStep] = useState<QuizStep>('intro');
  const [baseAnswers, setBaseAnswers] = useState<(number | undefined)[]>([]);
  const [subtestAnswers, setSubtestAnswers] = useState<Record<string, (number | undefined)[]>>({});
  const [relevantSubtests, setRelevantSubtests] = useState<string[]>([]);
  const [finalScores, setFinalScores] = useState<Scores>({});
  const [showUnansweredWarning, setShowUnansweredWarning] = useState(false);

  const [currentBaseQuestions, setCurrentBaseQuestions] = useState<string[]>([]);
  const [currentSubTests, setCurrentSubTests] = useState<Record<string, string[]>>({});
  const [currentThresholds, setCurrentThresholds] = useState<Record<string, number>>({});

  useEffect(() => {
    const group = searchParams.get('ageGroup') as AgeGroup;
    if (group === '12-14' || group === '15-18') {
      setAgeGroup(group);
      if (group === '12-14') {
        setCurrentBaseQuestions(baseQuestionsTeen12_14);
        setCurrentSubTests(subTestsTeen12_14);
        setCurrentThresholds(thresholdsTeen12_14);
        setBaseAnswers(new Array(baseQuestionsTeen12_14.length).fill(undefined));
      } else {
        setCurrentBaseQuestions(baseQuestionsTeen15_18);
        setCurrentSubTests(subTestsTeen15_18);
        setCurrentThresholds(thresholdsTeen15_18);
        setBaseAnswers(new Array(baseQuestionsTeen15_18.length).fill(undefined));
      }
    } else {
      // Default or handle error - e.g., redirect or show selection
      // For now, defaulting to 15-18 if no valid group, or redirect
      router.push('/quizzes'); // Redirect if no valid age group
    }
  }, [searchParams, router]);

  const answeredBaseQuestionsCount = useMemo(() => baseAnswers.filter(ans => ans !== undefined).length, [baseAnswers]);

  const handleBaseAnswerChange = (index: number, value: string) => {
    const newAnswers = [...baseAnswers];
    newAnswers[index] = parseInt(value, 10);
    setBaseAnswers(newAnswers);
  };

  const handleSubtestAnswerChange = (subtestKey: string, questionIndex: number, value: string) => {
    setSubtestAnswers(prev => {
      const currentSubtestAns = prev[subtestKey] ? [...prev[subtestKey]] : new Array(currentSubTests[subtestKey]?.length || 0).fill(undefined);
      currentSubtestAns[questionIndex] = parseInt(value, 10);
      return { ...prev, [subtestKey]: currentSubtestAns };
    });
  };
  
  const calculateRelevantSubtests = (): string[] => {
    if (currentBaseQuestions.length === 0 || Object.keys(currentThresholds).length === 0) return [];
    
    const scores: Scores = {};
    // This mapping needs to be robust based on how baseQuestions are structured for each age group
    // Assuming first 3 questions map to ADD, next 3 to ADHD etc. for 15-18.
    // For 12-14, questions are fewer, so slicing indices need care.
    // For simplicity, assuming baseQuestions are always structured consistently for category mapping.
    // Example:
    // ADD: baseAnswers.slice(0, X)
    // ADHD: baseAnswers.slice(X, Y)
    // This needs careful alignment with question design for each age group.

    // Simplified/Placeholder logic for category scores from base answers
    // This should be adapted based on the actual structure of baseQuestions per age group
    if (ageGroup === '15-18') {
        scores.ADD = calculateAverage(baseAnswers.slice(0, 3));
        scores.ADHD = calculateAverage(baseAnswers.slice(3, 6));
        scores.HSP = calculateAverage(baseAnswers.slice(6, 9));
        scores.ASS = calculateAverage(baseAnswers.slice(9, 12));
        scores.AngstDepressie = calculateAverage(baseAnswers.slice(12, 15));
    } else if (ageGroup === '12-14') {
        // Example mapping for 12-14 (12 questions)
        scores.ADD = calculateAverage(baseAnswers.slice(0, 2)); // e.g., first 2 for ADD
        scores.ADHD = calculateAverage(baseAnswers.slice(2, 4)); // next 2 for ADHD
        scores.HSP = calculateAverage(baseAnswers.slice(4, 6));
        scores.ASS = calculateAverage(baseAnswers.slice(6, 8));
        scores.AngstDepressie = calculateAverage(baseAnswers.slice(8, 10));
        // The last 2 questions (10,11) might need special mapping or contribute to existing categories
    }
    
    return Object.keys(scores).filter(key => currentThresholds[key] && scores[key] >= currentThresholds[key] && !isNaN(scores[key]));
  };

  const calculateFinalScores = (currentRelevantSubtests: string[]): Scores => {
    if (Object.keys(currentThresholds).length === 0) return {};
    const scores: Scores = {};
    
    let baseScoresCalc: Scores = {};
     if (ageGroup === '15-18') {
        baseScoresCalc.ADD = calculateAverage(baseAnswers.slice(0, 3));
        baseScoresCalc.ADHD = calculateAverage(baseAnswers.slice(3, 6));
        baseScoresCalc.HSP = calculateAverage(baseAnswers.slice(6, 9));
        baseScoresCalc.ASS = calculateAverage(baseAnswers.slice(9, 12));
        baseScoresCalc.AngstDepressie = calculateAverage(baseAnswers.slice(12, 15));
    } else if (ageGroup === '12-14') {
        baseScoresCalc.ADD = calculateAverage(baseAnswers.slice(0, 2));
        baseScoresCalc.ADHD = calculateAverage(baseAnswers.slice(2, 4));
        baseScoresCalc.HSP = calculateAverage(baseAnswers.slice(4, 6));
        baseScoresCalc.ASS = calculateAverage(baseAnswers.slice(6, 8));
        baseScoresCalc.AngstDepressie = calculateAverage(baseAnswers.slice(8, 10));
    }


    Object.keys(currentThresholds).forEach(key => {
      if (currentRelevantSubtests.includes(key) && subtestAnswers[key] && subtestAnswers[key]?.filter(ans => ans !== undefined).length > 0) {
        scores[key] = calculateAverage(subtestAnswers[key]);
      } else {
         scores[key] = baseScoresCalc[key] || 0;
      }
       scores[key] = Math.round(scores[key] * 100) / 100; 
    });
    return scores;
  };
  
  const proceedToBaseNext = () => {
    const relSubtests = calculateRelevantSubtests();
    setRelevantSubtests(relSubtests);
    if (relSubtests.length === 0) {
      setFinalScores(calculateFinalScores([]));
      setCurrentStep('results');
    } else {
      const initialSubAnswers: Record<string, (number | undefined)[]> = {};
      relSubtests.forEach(key => {
        initialSubAnswers[key] = new Array(currentSubTests[key]?.length || 0).fill(undefined);
      });
      setSubtestAnswers(initialSubAnswers);
      setCurrentStep('subtestConfirmation');
    }
  };

  const handleBaseNext = () => {
    if (currentBaseQuestions.length > 0 && answeredBaseQuestionsCount < currentBaseQuestions.length) {
      setShowUnansweredWarning(true);
      return;
    }
    proceedToBaseNext();
  };
  
  const handleRestart = () => {
    setCurrentStep('intro');
    if (ageGroup === '12-14') {
      setBaseAnswers(new Array(baseQuestionsTeen12_14.length).fill(undefined));
    } else if (ageGroup === '15-18') {
      setBaseAnswers(new Array(baseQuestionsTeen15_18.length).fill(undefined));
    } else {
       setBaseAnswers([]);
    }
    setSubtestAnswers({});
    setRelevantSubtests([]);
    setFinalScores({});
  };

  const generateSummaryText = (scores: Scores, shownSubtests: string[]): string => {
    const profilesToShow = Object.keys(scores).filter(key => neurotypeDescriptionsTeen[key] && currentThresholds[key] && scores[key] >= currentThresholds[key]);
    
    if (profilesToShow.length === 0) {
      return "Op basis van je antwoorden zie je geen opvallend sterke kenmerken van de verschillende neurodiversiteitsprofielen. Dit betekent niet dat je geen enkele eigenschap hebt - iedereen heeft in meer of mindere mate kenmerken die passen bij verschillende profielen.";
    }
    
    if (profilesToShow.length === 1) {
      const profileKey = profilesToShow[0];
      const profile = neurotypeDescriptionsTeen[profileKey];
      return `Je antwoorden laten zien dat je vooral eigenschappen herkent die passen bij ${profile.title}. ${profile.detail} Denk eraan dat deze quiz geen diagnostisch instrument is maar je wel inzicht kan geven in je sterke punten en uitdagingen. Dit rapport is afgestemd op ${ageGroup} jarigen.`;
    }
    
    const profileTitles = profilesToShow.map(d => neurotypeDescriptionsTeen[d].title);
    const lastProfileTitle = profileTitles.pop();
    
    return `Je antwoorden laten zien dat je eigenschappen herkent die passen bij meerdere profielen: ${profileTitles.join(', ')} en ${lastProfileTitle}. Deze combinatie is uniek en toont je persoonlijke neurodiversiteitsprofiel. De tips in dit rapport kunnen je helpen om je sterke punten te gebruiken en met je uitdagingen om te gaan. Dit rapport is afgestemd op ${ageGroup} jarigen.`;
  };
  
  const progressStepNames = ["Basisvragen", "Verdieping", "Resultaten"];
  let progressCurrentStepNumber = 1;
  if (currentStep === 'subtestConfirmation' || currentStep === 'subtestQuestions') progressCurrentStepNumber = 2;
  if (currentStep === 'results') progressCurrentStepNumber = 3;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  if (!ageGroup || currentBaseQuestions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <SiteLogo />
        <p className="mt-4">Quiz informatie laden...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-10 md:pt-16">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <SiteLogo />
      </div>

      <div className="w-full max-w-3xl">
        {ageGroup && (
            <Alert variant="default" className="mb-6 bg-primary/10 border-primary/30 text-primary">
                 <Info className="h-5 w-5 !text-primary" />
                <AlertTitleUi className="font-semibold">Quiz voor {ageGroup} jaar</AlertTitleUi>
                <AlertDescUi>
                    Deze vragen en tips zijn speciaal afgestemd op jouw leeftijdscategorie.
                </AlertDescUi>
            </Alert>
        )}

        {currentStep !== 'intro' && (
          <TeenQuizProgressBar currentStep={progressCurrentStepNumber} stepNames={progressStepNames} />
        )}

        {currentStep === 'intro' && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Welkom bij de Neurodiversiteit Quiz ({ageGroup} jaar)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Deze test geeft inzicht in eigenschappen zoals ADD, ADHD, HSP, ASS en Angst/Depressie. Er zijn {currentBaseQuestions.length} basisvragen; op basis van je antwoorden kun je één of meerdere subtests doen voor verdieping.
              </p>
              <p className="text-muted-foreground">
                Je ontvangt een persoonlijk rapport met uitleg, herkenbare voorbeelden en tips. Er zijn geen foute antwoorden; kijk wat bij jou past.
              </p>
              <div className="rounded-md border border-primary/50 bg-primary/10 p-4 text-left shadow">
                <h3 className="mb-2 flex items-center text-lg font-semibold text-primary"><Info className="mr-2 h-5 w-5" />Over neurodiversiteit</h3>
                <p className="text-sm text-foreground">
                  Neurodiversiteit verwijst naar de natuurlijke variatie in hoe mensen denken, leren en hun omgeving ervaren. Elke persoon heeft een uniek neurotype. De test helpt je ontdekken welke eigenschappen bij jou het sterkst aanwezig zijn.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button size="lg" onClick={() => setCurrentStep('baseQuestions')} className="shadow-md">
                Start de test <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 'baseQuestions' && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Basisvragen ({ageGroup} jaar)</CardTitle>
              <CardDescription>
                Deze eerste {currentBaseQuestions.length} vragen helpen om te bepalen welke eigenschappen bij jou het sterkst aanwezig zijn. Kies bij elke vraag het antwoord dat het beste bij jou past.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentBaseQuestions.map((q, index) => (
                <TeenQuestion
                  key={index}
                  questionText={q}
                  questionIndex={index}
                  options={answerOptions}
                  selectedValue={baseAnswers[index]?.toString()}
                  onValueChange={(value) => handleBaseAnswerChange(index, value)}
                />
              ))}
              <p className="mt-4 text-sm italic text-muted-foreground text-center">
                Vraag {answeredBaseQuestionsCount} van {currentBaseQuestions.length} beantwoord
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
               <AlertDialog open={showUnansweredWarning} onOpenChange={setShowUnansweredWarning}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Niet alle vragen beantwoord</AlertDialogTitle>
                    <AlertDialogDescription>
                      Je hebt nog niet alle basisvragen beantwoord. Voor het meest accurate resultaat raden we aan alle vragen in te vullen. Wil je toch doorgaan?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuleren</AlertDialogCancel>
                    <AlertDialogAction onClick={proceedToBaseNext}>Toch doorgaan</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={handleBaseNext}>
                Volgende <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 'subtestConfirmation' && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Verdiepende vragen ({ageGroup} jaar)</CardTitle>
              <CardDescription>
                Op basis van je antwoorden willen we je graag meer vragen stellen over specifieke gebieden.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {relevantSubtests.length === 1 ? (
                <>
                  <p>Op basis van je antwoorden lijkt het zinvol om verder te kijken naar <strong>{neurotypeDescriptionsTeen[relevantSubtests[0]].title}</strong>.</p>
                  <p className="text-sm text-muted-foreground">{subtestDescriptionsTeen[relevantSubtests[0]]}</p>
                  <p>We stellen je graag nog {currentSubTests[relevantSubtests[0]]?.length || 0} verdiepende vragen voor meer inzicht.</p>
                </>
              ) : (
                <>
                  <p>Op basis van je antwoorden lijkt het zinvol om verder te kijken naar de volgende gebieden:</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {relevantSubtests.map(key => (
                      <li key={key}>
                        <strong>{neurotypeDescriptionsTeen[key].title}</strong>: <span className="text-sm text-muted-foreground">{subtestDescriptionsTeen[key]}</span>
                      </li>
                    ))}
                  </ul>
                  <p>Voor elk relevant gebied stellen we je {currentSubTests[relevantSubtests[0]]?.length || 0} verdiepende vragen voor meer inzicht.</p>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-end gap-2">
              <Button variant="secondary" onClick={() => { setFinalScores(calculateFinalScores([])); setCurrentStep('results'); }}>
                Direct naar resultaten <CheckSquare className="ml-2 h-4 w-4" />
              </Button>
              <Button onClick={() => setCurrentStep('subtestQuestions')}>
                Doorgaan naar verdiepende vragen <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {currentStep === 'subtestQuestions' && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Vervolgvragen ({ageGroup} jaar)</CardTitle>
              <CardDescription>
                 Deze vragen helpen om een beter beeld te krijgen van de gebieden die bij jou het sterkst naar voren komen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {relevantSubtests.map(subtestKey => (
                <div key={subtestKey} className="mb-6">
                  <h3 className="mb-3 text-xl font-semibold text-primary">{neurotypeDescriptionsTeen[subtestKey].title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{subtestDescriptionsTeen[subtestKey]}</p>
                  {currentSubTests[subtestKey]?.map((q, index) => (
                    <TeenQuestion
                      key={`${subtestKey}-${index}`}
                      questionText={q}
                      questionIndex={index}
                      options={answerOptions}
                      selectedValue={subtestAnswers[subtestKey]?.[index]?.toString()}
                      onValueChange={(value) => handleSubtestAnswerChange(subtestKey, index, value)}
                    />
                  ))}
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => { setFinalScores(calculateFinalScores(relevantSubtests)); setCurrentStep('results'); }}>
                Bekijk resultaten <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 'results' && (
          <div className="space-y-6">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">Jouw Persoonlijke Rapport ({ageGroup} jaar)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-primary/30 bg-primary/5 p-4">
                    <h3 className="mb-2 text-xl font-semibold text-primary">Jouw Neurodiversiteitsprofiel Samenvatting</h3>
                    <p className="text-foreground">{generateSummaryText(finalScores, relevantSubtests)}</p>
                </div>
                
                {Object.keys(finalScores).filter(key => neurotypeDescriptionsTeen[key] && currentThresholds[key] && finalScores[key] >= currentThresholds[key]).length > 0 && (
                    <div className="rounded-md border border-accent/30 bg-accent/5 p-4 text-sm">
                        <h3 className="mb-2 flex items-center text-lg font-semibold text-accent"><Info className="mr-2 h-5 w-5" />Wat betekent dit voor jou?</h3>
                        <p>De scores hieronder geven aan waar jouw neurodiversiteitskenmerken het sterkst naar voren komen. 
                        Hoe hoger de score (schaal 1-4), hoe meer je de eigenschappen van dit profiel herkent in jezelf.</p>
                        <p className="mt-1">Neurodiversiteit is een spectrum. De meeste mensen hebben kenmerken van meerdere profielen. 
                        Dit rapport is bedoeld om je inzicht te geven en handvatten te bieden, niet als vervanging voor professioneel advies.</p>
                    </div>
                )}

                {Object.keys(neurotypeDescriptionsTeen)
                  .filter(key => finalScores[key] >= (currentThresholds[key] || 0) || (relevantSubtests.length === 0 && finalScores[key] > 0) ) 
                  .sort((a,b) => finalScores[b] - finalScores[a]) 
                  .map(key => {
                    const profile = neurotypeDescriptionsTeen[key];
                    const score = finalScores[key];
                    if (!profile) return null;

                    return (
                      <Card key={key} className="overflow-hidden shadow-md">
                        <CardHeader className="bg-muted/30">
                          <CardTitle className="text-2xl" style={{color: profile.color || 'hsl(var(--primary))'}}>
                            {profile.title} 
                            <span className="ml-2 text-lg font-normal text-muted-foreground">(Score: {score?.toFixed(2) || 'N/A'})</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                          <p><em>Eigenschappen:</em> {profile.eigenschappen}</p>
                          <p>{profile.detail}</p>
                          <p className="text-sm text-muted-foreground">{profile.uitleg}</p>
                          
                          <div>
                            <h4 className="mb-1 text-md font-semibold">Sterke punten:</h4>
                            <ul className="list-disc space-y-0.5 pl-5 text-sm">
                              {profile.sterktepunten.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                          </div>

                          <div>
                            <h4 className="mb-2 text-md font-semibold">Tips en strategieën (voor {ageGroup} jaar):</h4>
                            <div className="space-y-2 text-sm">
                              <div className="rounded-md bg-green-50 p-3 border border-green-200"><strong className="text-green-700">Op school/studie:</strong> {profile.tips.school}</div>
                              <div className="rounded-md bg-blue-50 p-3 border border-blue-200"><strong className="text-blue-700">Thuis:</strong> {profile.tips.thuis}</div>
                              <div className="rounded-md bg-purple-50 p-3 border border-purple-200"><strong className="text-purple-700">In sociale situaties:</strong> {profile.tips.sociaal}</div>
                              <div className="rounded-md bg-yellow-50 p-3 border border-yellow-200"><strong className="text-yellow-700">Op werk/stage:</strong> {profile.tips.werk}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                })}
                
                <div className="mt-6 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm">
                    <h3 className="mb-2 flex items-center text-lg font-semibold text-destructive"><AlertTriangle className="mr-2 h-5 w-5" />Disclaimer</h3>
                    <p>Deze quiz geeft inzicht in neurodiversiteitskenmerken, maar is geen diagnostisch instrument. Voor een formele diagnose of professioneel advies, raadpleeg een zorgverlener of psycholoog.</p>
                </div>

              </CardContent>
            </Card>

            <Card className="w-full shadow-xl mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-primary">
                    <Sparkles className="h-6 w-6" />
                    Wil je nog dieper duiken & dagelijkse ondersteuning?
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground mb-4">
                    Dit rapport is een geweldige start! Met een MindNavigator account krijg je toegang tot:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4 pl-5">
                    <li>Dagelijkse, gepersonaliseerde coaching tips & routines</li>
                    <li>Mogelijkheid om alle verdiepende subquizzen te doen</li>
                    <li>Je voortgang opslaan en bijhouden</li>
                    <li>Downloadbare PDF rapportages</li>
                </ul>
                <p className="text-center text-lg font-semibold text-primary mb-4">
                    Vanaf slechts €2,50 per maand!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild className="flex-1" size="lg">
                    <Link href="/#pricing">
                        Bekijk abonnementen & maak account
                    </Link>
                    </Button>
                </div>
                </CardContent>
            </Card>
             
             <Card className="w-full shadow-xl mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                   Sla je resultaten op (zonder coaching)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Wil je alleen dit resultaat opslaan en je voortgang bijhouden zonder direct te abonneren op coaching? Maak een gratis account aan.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="flex-1">
                    <Link href="/signup">
                      <UserPlus className="mr-2 h-4 w-4" /> Registreer gratis
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" /> Inloggen
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <CardFooter className="flex flex-col items-center gap-4 pt-6">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4" />Doe de quiz opnieuw</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Quiz opnieuw starten?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Weet je zeker dat je de quiz opnieuw wilt starten? Alle antwoorden worden gewist.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRestart}>Opnieuw starten</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                 <Button variant="link" asChild>
                    <Link href="/quizzes">Terug naar quiz overzicht</Link>
                </Button>
            </CardFooter>
          </div>
        )}
      </div>
    </div>
  );
}
