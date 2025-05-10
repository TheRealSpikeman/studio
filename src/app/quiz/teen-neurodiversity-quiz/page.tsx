// src/app/quiz/teen-neurodiversity-quiz/page.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteLogo } from '@/components/common/site-logo';
import Link from 'next/link';
import { ArrowRight, CheckSquare, RefreshCw, Info, AlertTriangle, Sparkles, UserPlus, LogIn, Brain, Zap, User, ThumbsUp, Compass, ShieldAlert, Lightbulb, HelpCircle, ChevronRight, Users, Search, ListChecks, Check, MessageSquareHeart, Edit } from 'lucide-react';
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
  QuizOption,
} from '@/lib/quiz-data/teen-neurodiversity-quiz';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription as AlertDescUi, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import { generateQuizAnalysis } from '@/ai/flows/generate-quiz-analysis-flow';
import { cn } from '@/lib/utils';
import React from 'react';


type QuizStep = 'intro' | 'baseQuestions' | 'subtestConfirmation' | 'subtestQuestions' | 'results';
type AgeGroup = '12-14' | '15-18' | null;

interface Scores {
  [key: string]: number;
}

const neurotypeIcons: Record<string, React.ElementType> = {
  ADD: Brain,
  ADHD: Zap,
  HSP: Sparkles,
  ASS: Compass,
  AngstDepressie: ShieldAlert,
  'Jouw Profiel In Vogelvlucht': Users,
  'Sterke Kanten': ThumbsUp,
  'Aandachtspunten': Edit,
  'Tips voor Jou': Lightbulb,
  'Overige Informatie': Info,
  'Default': HelpCircle,
  'Algemeen Overzicht': MessageSquareHeart,
};

const tipIcons = [Lightbulb, CheckSquare, Sparkles, Brain, ThumbsUp, Zap, Compass, ShieldAlert, Users, Info];


interface ParsedProfileScore {
  profileName: string;
  score: string;
  comment: string;
  icon?: React.ElementType;
}

interface AiAnalysisSection {
  title: string;
  content: string | ParsedProfileScore[];
  isList?: boolean;
  icon?: React.ElementType;
}

const parseAiAnalysis = (analysisText: string): AiAnalysisSection[] => {
  if (!analysisText || typeof analysisText !== 'string') return [];

  let cleanedText = analysisText.replace(/\*\*(.*?)\*\*/g, '$1');
  cleanedText = cleanedText.replace(/^(##\s*)/gm, '');

  const sections: AiAnalysisSection[] = [];
  const knownHeaders = ["Jouw Profiel In Vogelvlucht", "Sterke Kanten", "Aandachtspunten", "Tips voor Jou"];

  let textToProcess = cleanedText;
  let lastKnownHeaderEndIndex = 0;

  for (const header of knownHeaders) {
    const headerRegex = new RegExp(`^${header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s*\\n)?`, 'im');
    const match = headerRegex.exec(textToProcess);

    if (match) {
      const contentBeforeThisHeader = textToProcess.substring(0, match.index).trim();
      if (contentBeforeThisHeader && lastKnownHeaderEndIndex === 0 && !sections.find(s => s.title === "Overige Informatie")) {
        sections.push({
          title: "Overige Informatie",
          content: contentBeforeThisHeader.split('\n').map(line => line.replace(/^- |^\* /,'').trim()).filter(Boolean).join('\n'),
          isList: false,
          icon: neurotypeIcons["Overige Informatie"] || Info
        });
      }

      const currentSectionTitle = header;
      const contentStartIndex = match.index + match[0].length;

      let contentEndIndex = textToProcess.length;
      for (const nextKnownHeader of knownHeaders) {
        if (nextKnownHeader === header) continue;
        const nextKnownHeaderRegex = new RegExp(`^${nextKnownHeader.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s*\\n)?`, 'im');
        const nextMatch = nextKnownHeaderRegex.exec(textToProcess.substring(contentStartIndex));
        if (nextMatch) {
          contentEndIndex = contentStartIndex + nextMatch.index;
          break;
        }
      }

      let currentContent = textToProcess.substring(contentStartIndex, contentEndIndex).trim();
      textToProcess = textToProcess.substring(contentEndIndex);
      lastKnownHeaderEndIndex = contentEndIndex;

      const isListSection = ["Sterke Kanten", "Aandachtspunten", "Tips voor Jou"].includes(currentSectionTitle);
      const IconComponent = neurotypeIcons[currentSectionTitle] || HelpCircle;

      if (currentSectionTitle === "Jouw Profiel In Vogelvlucht") {
        const profileScores: ParsedProfileScore[] = [];
        let generalOverviewContent = "";
        currentContent.split('\n').forEach(line => {
          line = line.replace(/^- |^\* /,'').trim();
          if (!line) return;
          const scoreMatch = line.match(/([^:]+):\s*([\d.]+)\s*(?:\((.+)\))?/i);
          if (scoreMatch) {
            const profileName = scoreMatch[1].trim();
            const profileKey = Object.keys(neurotypeIcons).find(key =>
              profileName.toLowerCase().includes(key.toLowerCase()) ||
              (neurotypeDescriptionsTeen[key] && neurotypeDescriptionsTeen[key].title.toLowerCase().includes(profileName.toLowerCase()))
            ) || 'Default';
            profileScores.push({
              profileName: profileName,
              score: scoreMatch[2].trim(),
              comment: scoreMatch[3] ? scoreMatch[3].trim() : "Analyse volgt.",
              icon: neurotypeIcons[profileKey] || HelpCircle
            });
          } else {
            generalOverviewContent += (generalOverviewContent ? '\n' : '') + line;
          }
        });
        
        const sectionContent: ParsedProfileScore[] = [];
        if (generalOverviewContent) {
           sectionContent.push({ profileName: "Algemeen Overzicht", score: "", comment: generalOverviewContent, icon: neurotypeIcons["Algemeen Overzicht"] || MessageSquareHeart });
        }
        sectionContent.push(...profileScores);

        if (sectionContent.length > 0) {
            sections.push({ title: currentSectionTitle, content: sectionContent, icon: IconComponent });
        } else if (currentContent && !generalOverviewContent) {
             sections.push({ title: currentSectionTitle, content: currentContent, isList: isListSection, icon: IconComponent });
        }

      } else if (currentContent) {
        sections.push({ title: currentSectionTitle, content: currentContent, isList: isListSection, icon: IconComponent });
      }
    }
  }

  if (textToProcess.trim()) {
     if (!sections.find(s => s.title === "Overige Informatie")) {
        sections.push({
          title: "Overige Informatie",
          content: textToProcess.split('\n').map(line => line.replace(/^- |^\* /,'').trim()).filter(Boolean).join('\n'),
          isList: false,
          icon: neurotypeIcons["Overige Informatie"] || Info
        });
     } else {
        const existingOtherInfo = sections.find(s => s.title === "Overige Informatie");
        if (existingOtherInfo && typeof existingOtherInfo.content === 'string') {
            existingOtherInfo.content += '\n' + textToProcess.split('\n').map(line => line.replace(/^- |^\* /,'').trim()).filter(Boolean).join('\n');
        }
     }
  }
  return sections.filter(s => s.content && (typeof s.content === 'string' ? s.content.trim() !== "" : s.content.length > 0));
};


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

  const [quizAnalysis, setQuizAnalysis] = useState<string | null>(null);
  const [parsedAiAnalysis, setParsedAiAnalysis] = useState<AiAnalysisSection[]>([]);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);


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
      router.push('/quizzes');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (currentStep === 'results' && ageGroup && Object.keys(finalScores).length > 0 && !quizAnalysis && !isAnalysisLoading) {
      const fetchAnalysis = async () => {
        setIsAnalysisLoading(true);
        setParsedAiAnalysis([]);
        try {
          const answeredQuestions: Array<{ question: string; answer: string; profileKey?: string}> = [];

          currentBaseQuestions.forEach((qText, index) => {
            const answerValue = baseAnswers[index];
            if (answerValue !== undefined) {
              const answerOption = answerOptions.find(opt => parseInt(opt.value, 10) === answerValue);
              let profileKeyForQuestion: string | undefined = undefined;
              if (ageGroup === '15-18') {
                if (index < 3) profileKeyForQuestion = 'ADD';
                else if (index < 6) profileKeyForQuestion = 'ADHD';
                else if (index < 9) profileKeyForQuestion = 'HSP';
                else if (index < 12) profileKeyForQuestion = 'ASS';
                else if (index < 15) profileKeyForQuestion = 'AngstDepressie';
              } else if (ageGroup === '12-14') {
                 if (index < 2) profileKeyForQuestion = 'ADD';
                 else if (index < 4) profileKeyForQuestion = 'ADHD';
                 else if (index < 6) profileKeyForQuestion = 'HSP';
                 else if (index < 8) profileKeyForQuestion = 'ASS';
                 else if (index < 10) profileKeyForQuestion = 'AngstDepressie';
              }

              answeredQuestions.push({
                question: qText,
                answer: answerOption ? `${answerOption.label} (${answerValue})` : `Score ${answerValue}`,
                profileKey: profileKeyForQuestion,
              });
            }
          });

          Object.entries(subtestAnswers).forEach(([subtestKey, answers]) => {
            const questionsForSubtest = currentSubTests[subtestKey] || [];
            answers.forEach((ansVal, qIdx) => {
              if (ansVal !== undefined) {
                const answerOption = answerOptions.find(opt => parseInt(opt.value, 10) === ansVal);
                answeredQuestions.push({
                  question: `${neurotypeDescriptionsTeen[subtestKey]?.title || subtestKey} - ${questionsForSubtest[qIdx]}`,
                  answer: answerOption ? `${answerOption.label} (${ansVal})` : `Score ${ansVal}`,
                  profileKey: subtestKey
                });
              }
            });
          });

          const analysisInput = {
            quizTitle: `Neurodiversiteit Quiz (${ageGroup} jaar)`,
            ageGroup: ageGroup,
            finalScores: finalScores,
            answeredQuestions: answeredQuestions
          };
          const result = await generateQuizAnalysis(analysisInput);
          setQuizAnalysis(result.analysis);
          setParsedAiAnalysis(parseAiAnalysis(result.analysis));
        } catch (error) {
          console.error("Failed to generate quiz analysis:", error);
          const errorMsg = "Er is iets misgegaan bij het laden van de diepgaande analyse. Probeer de pagina later opnieuw te laden of neem contact op als het probleem aanhoudt.";
          setQuizAnalysis(errorMsg);
          setParsedAiAnalysis([{title: "Fout", content: errorMsg, icon: AlertTriangle}]);
        } finally {
          setIsAnalysisLoading(false);
        }
      };
      fetchAnalysis();
    }
  }, [currentStep, finalScores, ageGroup, baseAnswers, subtestAnswers, currentBaseQuestions, currentSubTests, quizAnalysis, isAnalysisLoading]);


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
    if (ageGroup === '15-18') {
        scores.ADD = calculateAverage(baseAnswers.slice(0, 3));
        scores.ADHD = calculateAverage(baseAnswers.slice(3, 6));
        scores.HSP = calculateAverage(baseAnswers.slice(6, 9));
        scores.ASS = calculateAverage(baseAnswers.slice(9, 12));
        scores.AngstDepressie = calculateAverage(baseAnswers.slice(12, 15));
    } else if (ageGroup === '12-14') {
        scores.ADD = calculateAverage(baseAnswers.slice(0, 2));
        scores.ADHD = calculateAverage(baseAnswers.slice(2, 4));
        scores.HSP = calculateAverage(baseAnswers.slice(4, 6));
        scores.ASS = calculateAverage(baseAnswers.slice(6, 8));
        scores.AngstDepressie = calculateAverage(baseAnswers.slice(8, 10));
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
    setQuizAnalysis(null);
    setParsedAiAnalysis([]);
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
    <React.Fragment>
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-10 md:pt-16 pb-16">
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
            <CardHeader className="pt-8">
              <CardTitle className="text-3xl font-bold text-center">Welkom bij de Neurodiversiteit Quiz ({ageGroup} jaar)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center pt-4">
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
            <CardFooter className="flex justify-center pt-6 pb-8">
              <Button size="lg" onClick={() => setCurrentStep('baseQuestions')} className="shadow-md">
                Start de test <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 'baseQuestions' && (
          <Card className="shadow-xl">
            <CardHeader className="pt-8">
              <CardTitle className="text-2xl">Basisvragen ({ageGroup} jaar)</CardTitle>
              <CardDescription className="pt-1">
                Deze eerste {currentBaseQuestions.length} vragen helpen om te bepalen welke eigenschappen bij jou het sterkst aanwezig zijn. Kies bij elke vraag het antwoord dat het beste bij jou past.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
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
            <CardFooter className="flex justify-end pt-6 pb-8">
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
            <CardHeader className="pt-8">
              <CardTitle className="text-2xl">Verdiepende vragen ({ageGroup} jaar)</CardTitle>
              <CardDescription className="pt-1">
                Op basis van je antwoorden willen we je graag meer vragen stellen over specifieke gebieden.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
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
            <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-6 pb-8">
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
            <CardHeader className="pt-8">
              <CardTitle className="text-2xl">Vervolgvragen ({ageGroup} jaar)</CardTitle>
              <CardDescription className="pt-1">
                 Deze vragen helpen om een beter beeld te krijgen van de gebieden die bij jou het sterkst naar voren komen.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
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
            <CardFooter className="flex justify-end pt-6 pb-8">
              <Button onClick={() => { setFinalScores(calculateFinalScores(relevantSubtests)); setCurrentStep('results'); }}>
                Bekijk resultaten <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 'results' && (
          <div className="space-y-6">
            <Card className="shadow-xl">
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-3xl font-bold">Jouw Persoonlijke Rapport ({ageGroup} jaar)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <Card className="shadow-md">
                  <CardHeader className="py-5 px-6">
                    <h2 className="text-2xl font-semibold flex items-center gap-3">
                      <User className="h-7 w-7 text-primary" />
                      Jouw Neuroprofiel in Vogelvlucht
                    </h2>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-6">
                    {Object.keys(finalScores)
                      .filter(key => neurotypeDescriptionsTeen[key])
                      .sort((a,b) => finalScores[b] - finalScores[a])
                      .map(key => {
                        const profile = neurotypeDescriptionsTeen[key];
                        const score = finalScores[key];
                        const IconComponent = neurotypeIcons[key] || Brain;
                        const isProminent = score >= (currentThresholds[key] || 0);

                        return (
                          <Card key={key} className={cn("p-4 shadow-sm", isProminent ? "border-primary/60 bg-primary/5" : "bg-muted/40")}>
                            <div className="flex items-start gap-3 mb-1.5">
                              <IconComponent className={cn("h-8 w-8 mt-0.5", isProminent ? "text-primary" : "text-muted-foreground")} />
                              <div>
                                <h3 className={cn("text-lg font-semibold", isProminent ? "text-primary" : "text-foreground")}>{profile.title}</h3>
                                <p className="text-sm text-muted-foreground">Score: <span className="font-medium">{score?.toFixed(2) || 'N/A'}</span></p>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{profile.eigenschappen}</p>
                          </Card>
                        );
                    })}
                  </CardContent>
                </Card>

                <Alert variant="default" className="bg-blue-50/70 border-blue-400 border-l-4 rounded-r-md shadow-sm">
                   <Info className="h-5 w-5 text-blue-600" />
                  <AlertTitleUi className="font-semibold text-lg text-blue-700">Wat Betekenen Deze Scores?</AlertTitleUi>
                  <AlertDescUi className="leading-relaxed text-blue-800/90">
                    De scores (schaal 1-4) geven aan hoe sterk je de kenmerken van een profiel herkent.
                    <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                      <li><strong>Score 3.0 - 4.0:</strong> Kenmerken zijn duidelijk herkenbaar.</li>
                      <li><strong>Score 2.0 - 2.9:</strong> Kenmerken zijn soms herkenbaar.</li>
                      <li><strong>Score 1.0 - 1.9:</strong> Kenmerken zijn minder herkenbaar.</li>
                    </ul>
                    Een hogere score is niet beter of slechter, het geeft inzicht.
                  </AlertDescUi>
                </Alert>

                <div className="rounded-md border border-primary/30 bg-primary/5 p-6 shadow-sm">
                    <h2 className="mb-2 text-2xl font-semibold text-primary">Jouw Neurodiversiteitsprofiel Samenvatting</h2>
                    <p className="text-foreground leading-relaxed">{generateSummaryText(finalScores, relevantSubtests)}</p>
                </div>

                {Object.keys(finalScores).filter(key => neurotypeDescriptionsTeen[key] && currentThresholds[key] && finalScores[key] >= currentThresholds[key]).length > 0 && (
                    <Alert variant="default" className="bg-accent/5 border-accent/30 text-accent-foreground">
                        <ListChecks className="h-5 w-5 text-accent" />
                        <AlertTitleUi className="font-semibold text-lg text-accent">Algemene Toelichting</AlertTitleUi>
                        <AlertDescUi className="text-sm leading-relaxed">
                        De scores hieronder geven aan waar jouw neurodiversiteitskenmerken het sterkst naar voren komen.
                        Hoe hoger de score (schaal 1-4), hoe meer je de eigenschappen van dit profiel herkent in jezelf.
                        <br />
                        Neurodiversiteit is een spectrum. De meeste mensen hebben kenmerken van meerdere profielen.
                        Dit rapport is bedoeld om je inzicht te geven en handvatten te bieden, niet als vervanging voor professioneel advies.
                        </AlertDescUi>
                    </Alert>
                )}

                {Object.keys(neurotypeDescriptionsTeen)
                  .filter(key => finalScores[key] >= (currentThresholds[key] || 0) || (relevantSubtests.length === 0 && finalScores[key] > 0) )
                  .sort((a,b) => finalScores[b] - finalScores[a])
                  .map(key => {
                    const profile = neurotypeDescriptionsTeen[key];
                    const score = finalScores[key];
                    if (!profile) return null;
                    const IconForProfile = neurotypeIcons[key] || Brain;

                    return (
                      <Card key={key} className="overflow-hidden shadow-md my-6" style={{borderLeft: `6px solid ${profile.color || 'hsl(var(--primary))'}`}}>
                        <CardHeader className="bg-muted/30 py-4 px-5">
                          <h2 className="text-2xl font-semibold flex items-center gap-3" style={{color: profile.color || 'hsl(var(--primary))'}}>
                            <IconForProfile className="h-7 w-7" />
                            {profile.title}
                            <span className="ml-auto text-lg font-normal text-muted-foreground">(Score: {score?.toFixed(2) || 'N/A'})</span>
                          </h2>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-5 px-5 pb-6">
                          <div>
                            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider mb-1">Kenmerken</h3>
                            <p className="italic leading-relaxed">{profile.eigenschappen}</p>
                          </div>
                          <div>
                            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider mb-1">Korte Uitleg</h3>
                            <p className="leading-relaxed">{profile.detail}</p>
                          </div>
                          <div>
                            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider mb-1">Meer Over {profile.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{profile.uitleg}</p>
                          </div>

                          <div>
                            <h3 className="mb-2 text-lg font-semibold flex items-center gap-2"><ThumbsUp className="h-5 w-5 text-green-600"/>Jouw Sterke Punten:</h3>
                            <ul className="list-disc space-y-1 pl-6 text-sm leading-relaxed">
                              {profile.sterktepunten.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                          </div>

                          <div>
                            <h3 className="mb-3 text-lg font-semibold flex items-center gap-2"><Lightbulb className="h-5 w-5 text-yellow-500"/>Tips en Strategieën (voor {ageGroup} jaar):</h3>
                            <div className="space-y-4 text-sm">
                              <div className="rounded-md bg-green-50 p-4 border border-green-200 shadow-sm"><strong className="text-green-700 block mb-1.5 text-base">✏️ Op school/studie:</strong> <p className="leading-relaxed">{profile.tips.school}</p></div>
                              <div className="rounded-md bg-blue-50 p-4 border border-blue-200 shadow-sm"><strong className="text-blue-700 block mb-1.5 text-base">🏡 Thuis:</strong> <p className="leading-relaxed">{profile.tips.thuis}</p></div>
                              <div className="rounded-md bg-purple-50 p-4 border border-purple-200 shadow-sm"><strong className="text-purple-700 block mb-1.5 text-base">💬 In sociale situaties:</strong> <p className="leading-relaxed">{profile.tips.sociaal}</p></div>
                              <div className="rounded-md bg-orange-50 p-4 border border-orange-200 shadow-sm"><strong className="text-orange-700 block mb-1.5 text-base">💼 Op werk/stage:</strong> <p className="leading-relaxed">{profile.tips.werk}</p></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                })}

                 <Card className="shadow-xl mt-8 bg-primary/5 border-primary/20">
                    <CardHeader className="py-5 px-6">
                      <h2 className="text-2xl font-semibold flex items-center gap-3 text-primary">
                        <Brain className="h-7 w-7" /> Diepgaande Analyse door AI
                      </h2>
                    </CardHeader>
                    <CardContent className="space-y-4 px-6 pb-6">
                    {isAnalysisLoading ? (
                        <div className="space-y-3 animate-pulse pt-2">
                            <div className="h-5 bg-muted rounded w-3/4"></div><div className="h-5 bg-muted rounded w-1/2"></div><div className="h-5 bg-muted rounded w-5/6"></div>
                            <div className="h-5 bg-muted rounded w-2/3 mt-4"></div><div className="h-5 bg-muted rounded w-full"></div>
                        </div>
                    ) : parsedAiAnalysis.length > 0 ? (
                       parsedAiAnalysis.map((section, index) => {
                        let IconToShow = section.icon || HelpCircle;
                        let titleClasses = "text-xl font-semibold text-foreground mb-3 flex items-center gap-2";
                        let contentClasses = "text-muted-foreground leading-relaxed whitespace-pre-wrap";
                        let listClasses = "list-disc space-y-2 pl-7 text-muted-foreground leading-relaxed";
                        let cardClasses = "py-3 px-1";

                        if (section.title === "Aandachtspunten") {
                           cardClasses = cn(cardClasses, "bg-orange-50/70 border-l-4 border-orange-400 px-4 py-4 rounded-r-md shadow-sm");
                           titleClasses = cn(titleClasses, "text-orange-600");
                           IconToShow = neurotypeIcons["Aandachtspunten"] || Edit;
                        } else if (section.title === "Jouw Profiel In Vogelvlucht") {
                           cardClasses = cn(cardClasses, "bg-blue-50/70 border-l-4 border-blue-400 px-4 py-4 rounded-r-md shadow-sm");
                           titleClasses = cn(titleClasses, "text-blue-600");
                           IconToShow = neurotypeIcons["Jouw Profiel In Vogelvlucht"] || Users;
                        } else if (section.title === "Sterke Kanten") {
                           cardClasses = cn(cardClasses, "bg-green-50/70 border-l-4 border-green-400 px-4 py-4 rounded-r-md shadow-sm");
                           titleClasses = cn(titleClasses, "text-green-600");
                           IconToShow = neurotypeIcons["Sterke Kanten"] || ThumbsUp;
                        } else if (section.title === "Tips voor Jou") {
                           cardClasses = cn(cardClasses, "bg-yellow-50/70 border-l-4 border-yellow-400 px-4 py-4 rounded-r-md shadow-sm");
                           titleClasses = cn(titleClasses, "text-yellow-700");
                           IconToShow = neurotypeIcons["Tips voor Jou"] || Lightbulb;
                        }


                        return (
                          <div key={index} className={cn(cardClasses, index > 0 && "border-t mt-4 pt-4")}>
                            <h3 className={titleClasses}>
                              {IconToShow && <IconToShow className={cn(
                                "h-6 w-6",
                                section.title === "Aandachtspunten" ? "text-orange-500" :
                                section.title === "Jouw Profiel In Vogelvlucht" ? "text-blue-500" :
                                section.title === "Sterke Kanten" ? "text-green-500" :
                                section.title === "Tips voor Jou" ? "text-yellow-600" :
                                "text-primary"
                               )} />}
                              {section.title}
                            </h3>
                            {typeof section.content === 'string' ? (
                              section.isList ? (
                                  <ul className={listClasses}>
                                      {section.content.split('\n').map((item, i) => item.trim() && <li key={i} className="mb-1.5 flex items-start"><ChevronRight className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-inherit"/><span>{item.trim().replace(/^- |^\* /,'')}</span></li>)}
                                  </ul>
                              ) : (
                                  <p className={contentClasses}>{section.content}</p>
                              )
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(section.content as ParsedProfileScore[]).map((item, itemIdx) => (
                                  <Card key={itemIdx} className="p-4 bg-background shadow">
                                    <div className="flex items-center gap-2 mb-1.5">
                                      {item.icon && <item.icon className="h-5 w-5 text-primary" />}
                                      <p className="font-semibold text-primary text-lg">{item.profileName}{item.score && ` (Score: ${item.score})`}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{item.comment}</p>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                       })
                    ) : (
                        <p className="text-muted-foreground">Geen AI analyse beschikbaar op dit moment.</p>
                    )}
                    </CardContent>
                  </Card>


                <Alert variant="destructive" className="mt-8 text-sm">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitleUi className="font-semibold text-lg">Disclaimer</AlertTitleUi>
                    <AlertDescUi className="leading-relaxed">
                        Deze quiz geeft inzicht in neurodiversiteitskenmerken, maar is geen diagnostisch instrument.
                        Voor een formele diagnose of professioneel advies, raadpleeg een zorgverlener of psycholoog.
                        MindNavigator is niet aansprakelijk voor beslissingen genomen op basis van dit rapport.
                    </AlertDescUi>
                </Alert>

                 <div className="mt-10 p-6 bg-primary/10 border-l-4 border-primary rounded-md shadow-md">
                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2 mb-3">
                        <Sparkles className="h-6 w-6" />
                        Jouw Reis Gaat Verder!
                    </h3>
                    <p className="text-foreground leading-relaxed">
                        Iedereen heeft unieke sterke kanten en uitdagingen. Dit rapport is een startpunt om jezelf beter te leren kennen. Onthoud dat je niet alleen bent op deze ontdekkingsreis. Er zijn altijd manieren om te groeien en je welzijn te verbeteren.
                    </p>
                </div>

              </CardContent>
            </Card>

            <Card className="w-full shadow-xl mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                <CardHeader className="py-5 px-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3 text-primary">
                    <Sparkles className="h-7 w-7" />
                    Ontgrendel je volledige potentieel!
                </h2>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                    Je hebt een eerste blik op je profiel gekregen. Wil je dieper graven met verdiepende subquizzen en dagelijkse, persoonlijke coaching ontvangen?
                </p>
                <p className="text-lg font-semibold mb-2 text-foreground">Krijg toegang tot premium functies:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1.5 mb-5 pl-5 leading-relaxed">
                    <li>Alle verdiepende subquizzen</li>
                    <li>Dagelijkse coaching tips & routines</li>
                    <li>Uitgebreide PDF rapportages</li>
                    <li>Voortgangstracking en meer!</li>
                </ul>
                <p className="text-center text-xl font-bold text-primary mb-5">
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
              <CardHeader className="py-5 px-6">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
                   Sla je resultaten op (zonder coaching)
                </h2>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">
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

            <CardFooter className="flex flex-col items-center gap-4 pt-8 pb-8">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="lg"><RefreshCw className="mr-2 h-4 w-4" />Doe de quiz opnieuw</Button>
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
                 <Button variant="link" asChild className="mt-2">
                    <Link href="/quizzes">Terug naar quiz overzicht</Link>
                </Button>
            </CardFooter>
          </div>
        )}
      </div>
    </div>
    </React.Fragment>
  );
}
