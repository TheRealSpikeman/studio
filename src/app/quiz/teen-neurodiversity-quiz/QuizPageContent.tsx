// src/app/quiz/teen-neurodiversity-quiz/QuizPageContent.tsx
"use client"; 

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteLogo } from '@/components/common/site-logo';
import Link from 'next/link';
import { ArrowRight, CheckSquare, RefreshCw, Info, AlertTriangle, Sparkles, UserPlus, LogIn, Brain, Zap, User, ThumbsUp, Compass, ShieldAlert, Lightbulb, Target, Users as UsersIcon, Edit, ListChecks, MessageSquareHeart, HelpCircle, FileText, Edit2Icon, ExternalLink } from 'lucide-react';
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
  'Jouw Profiel In Vogelvlucht': UsersIcon,
  'Sterke Kanten': ThumbsUp,
  'Aandachtspunten': Edit2Icon,
  'Tips voor Jou': Lightbulb,
  'Overige Informatie': Info,
  'Default': HelpCircle,
  'Algemeen Overzicht': MessageSquareHeart,
};

const tipIcons: React.ElementType[] = [FileText, Lightbulb, CheckSquare, Sparkles, Brain, ThumbsUp, Zap, Compass, ShieldAlert, UsersIcon, Info];


interface ParsedProfileScore {
  profileName: string;
  score: string;
  comment: string;
  icon?: React.ElementType;
  subScores?: ParsedProfileScore[]; 
}

interface AiAnalysisSection {
  title: string;
  content: string | ParsedProfileScore[];
  isList?: boolean;
  icon?: React.ElementType;
}

const sanitizeAiText = (text: string): string => {
  if (typeof text !== 'string') return '';
  return text.replace(/(\*\*|__)(.*?)\1/g, '$2').replace(/(\*|_)(.*?)\1/g, '$2');
};

const parseAiAnalysis = (analysisText: string): AiAnalysisSection[] => {
  if (!analysisText || typeof analysisText !== 'string') return [];

  let cleanedText = sanitizeAiText(analysisText);
  cleanedText = cleanedText.replace(/^##\s+/gm, ''); 
  cleanedText = cleanedText.replace(/^#\s+/gm, ''); 


  const sections: AiAnalysisSection[] = [];
  const knownHeaders = ["Jouw Profiel In Vogelvlucht", "Sterke Kanten", "Aandachtspunten", "Tips voor Jou"];

  let textToProcess = cleanedText;
  let lastKnownHeaderEndIndex = 0;

  for (const header of knownHeaders) {
    const headerRegex = new RegExp(`^${header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s*\\n)?`, 'im');
    const match = headerRegex.exec(textToProcess);

    if (match) {
      const contentBeforeThisHeader = sanitizeAiText(textToProcess.substring(0, match.index).trim());
      if (contentBeforeThisHeader && lastKnownHeaderEndIndex === 0 && !sections.find(s => s.title === "Overige Informatie")) {
         const cleanedContentBefore = contentBeforeThisHeader.split('\n').map(line => line.replace(/^- |^\* /,'').trim()).filter(Boolean).join('\n');
        if (cleanedContentBefore) {
            sections.push({
              title: "Overige Informatie",
              content: cleanedContentBefore,
              isList: false,
              icon: neurotypeIcons["Overige Informatie"] || Info
            });
        }
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

      let currentContent = sanitizeAiText(textToProcess.substring(contentStartIndex, contentEndIndex).trim());
      textToProcess = textToProcess.substring(contentEndIndex);
      lastKnownHeaderEndIndex = contentEndIndex;

      currentContent = currentContent.split('\n').filter(line => line.trim() !== '*' && line.trim() !== '-' && line.trim() !== '##').join('\n');
      currentContent = currentContent.replace(/^##\s*/gm, '').trim();


      const isExpectedListSection = ["Sterke Kanten", "Aandachtspunten", "Tips voor Jou"].includes(currentSectionTitle);
      let IconComponent = neurotypeIcons[currentSectionTitle] || HelpCircle;

      if (currentSectionTitle === "Jouw Profiel In Vogelvlucht") {
        const profileScores: ParsedProfileScore[] = [];
        let generalOverviewContent = "";
        currentContent.split('\n').forEach(line => {
          line = sanitizeAiText(line.replace(/^- |^\* /,'').trim());
          if (!line) return;
          const scoreMatch = line.match(/([^:(]+)(?:\s*\(Score:\s*([\d.]+)\))?:\s*(.+)/i) || line.match(/([^:]+):\s*([\d.]+)\s*(?:\((.+)\))?/i);

          if (scoreMatch && (scoreMatch[2] || scoreMatch[3])) { 
            const profileName = sanitizeAiText(scoreMatch[1].trim());
            const scoreValue = scoreMatch[2] ? sanitizeAiText(scoreMatch[2].trim()) : "";
            let commentText = scoreMatch[3] ? sanitizeAiText(scoreMatch[3].trim()) : "";

            if (!commentText && !scoreValue && scoreMatch[0].includes(':')) {
                commentText = sanitizeAiText(scoreMatch[0].substring(scoreMatch[0].indexOf(':') + 1).trim());
            }

            const profileKey = Object.keys(neurotypeIcons).find(key =>
              profileName.toLowerCase().includes(key.toLowerCase()) ||
              (neurotypeDescriptionsTeen[key] && neurotypeDescriptionsTeen[key].title.toLowerCase().includes(profileName.toLowerCase()))
            ) || 'Default';
             let currentProfileIcon = neurotypeIcons[profileKey] || Brain;
             if (profileKey === 'Default' && IconComponent === HelpCircle) currentProfileIcon = Brain;

            profileScores.push({
              profileName: profileName,
              score: scoreValue,
              comment: commentText,
              icon: currentProfileIcon
            });
          } else {
            if (line.trim() && !line.trim().match(/^[-*]\s*$/) && line.length > 3) { 
                 generalOverviewContent += (generalOverviewContent ? '\n' : '') + line;
            }
          }
        });

        const sectionContent: ParsedProfileScore[] = [];
        if (generalOverviewContent.trim()) {
           sectionContent.push({ profileName: "Algemeen Overzicht", score: "", comment: generalOverviewContent.trim(), icon: neurotypeIcons["Algemeen Overzicht"] || MessageSquareHeart });
        }

        const groupedScores: ParsedProfileScore[] = [];
        profileScores.forEach(ps => {
            const commentScoreMatch = ps.comment.match(/^\(([\d.]+)\)\s*(.*)/);
            if (!ps.score && commentScoreMatch) {
                ps.score = sanitizeAiText(commentScoreMatch[1]);
                ps.comment = sanitizeAiText(commentScoreMatch[2].trim());
            }
            groupedScores.push({
              ...ps,
              profileName: sanitizeAiText(ps.profileName),
              score: sanitizeAiText(ps.score),
              comment: sanitizeAiText(ps.comment),
            });
        });

        if (groupedScores.length > 0) {
            sectionContent.push({
                profileName: "Score Inzichten per Thema",
                score: "",
                comment: "",
                icon: UsersIcon,
                subScores: groupedScores
            });
        }

        if (sectionContent.length > 0) {
            sections.push({ title: currentSectionTitle, content: sectionContent, icon: IconComponent });
        } else if (currentContent.trim() && !generalOverviewContent.trim()) {
             sections.push({ title: currentSectionTitle, content: currentContent.trim(), isList: isExpectedListSection, icon: IconComponent });
        }
      } else if (isExpectedListSection) {
         if (currentContent.trim()) {
            sections.push({ title: currentSectionTitle, content: currentContent.trim(), isList: true, icon: IconComponent });
        }
      } else if (currentContent.trim()) {
        sections.push({ title: currentSectionTitle, content: currentContent.trim(), isList: false, icon: IconComponent });
      }
    }
  }

  if (textToProcess.trim()) {
     const cleanedRemainingText = sanitizeAiText(textToProcess.replace(/^##\s*/gm, '').trim());
     if (cleanedRemainingText) {
        const existingOtherInfo = sections.find(s => s.title === "Overige Informatie");
        if (existingOtherInfo && typeof existingOtherInfo.content === 'string') {
            existingOtherInfo.content += '\n' + cleanedRemainingText.split('\n').map(line => line.replace(/^- |^\* /,'').trim()).filter(Boolean).join('\n');
        } else if (!existingOtherInfo) {
           sections.push({
              title: "Overige Informatie",
              content: cleanedRemainingText.split('\n').map(line => line.replace(/^- |^\* /,'').trim()).filter(Boolean).join('\n'),
              isList: false,
              icon: neurotypeIcons["Overige Informatie"] || Info
            });
        }
     }
  }
  return sections.filter(s => s.content && (typeof s.content === 'string' ? s.content.trim() !== "" : s.content.length > 0));
};

export default function QuizPageContent() { 
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

  const ageGroupFromQuery = searchParams.get('ageGroup') as AgeGroup;

  useEffect(() => {
    if (ageGroupFromQuery === '12-14' || ageGroupFromQuery === '15-18') {
      setAgeGroup(ageGroupFromQuery);
      if (ageGroupFromQuery === '12-14') {
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
        // router.replace('/quizzes'); 
    }
  }, [ageGroupFromQuery, router]);

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
            quizTitle: `Neurodiversiteit Zelfreflectie Tool (${ageGroup} jaar)`,
            ageGroup: ageGroup,
            finalScores: finalScores,
            answeredQuestions: answeredQuestions,
            analysisDetailLevel: 'standaard' // Default, kan later per quiz ingesteld worden
          };
          const result = await generateQuizAnalysis(analysisInput);
          setQuizAnalysis(result.analysis);
          setParsedAiAnalysis(parseAiAnalysis(result.analysis));

          // Opslaan in localStorage voor Coaching Hub
          if (typeof window !== 'undefined' && result.analysis) {
            localStorage.setItem('mindnavigator_onboardingAnalysis', result.analysis);
            localStorage.setItem('mindnavigator_onboardingUser', JSON.stringify({name: "Alex", ageGroup: ageGroup})); // Dummy naam
          }

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
      return "Op basis van je antwoorden kom je op dit moment niet opvallend naar voren voor een specifiek neurodivergent profiel. Iedereen is uniek en het is mogelijk dat je een mix van eigenschappen hebt die niet sterk wijzen op één enkel profiel. Dit is volkomen normaal. Bekijk de AI analyse hieronder voor een persoonlijker inzicht.";
    }

    if (profilesToShow.length === 1) {
      const profileKey = profilesToShow[0];
      const profile = neurotypeDescriptionsTeen[profileKey];
      return `Je antwoorden wijzen erop dat je kenmerken herkent die vaak geassocieerd worden met ${profile.title}. Dit kan betekenen dat je de wereld op een bepaalde manier ervaart die past bij dit profiel. ${profile.detail} Dit rapport is afgestemd op ${ageGroup} jarigen. De AI analyse hieronder geeft meer context.`;
    }

    const profileTitles = profilesToShow.map(d => neurotypeDescriptionsTeen[d].title);
    const lastProfileTitle = profileTitles.pop();

    return `Je antwoorden wijzen erop dat je kenmerken herkent die passen bij meerdere profielen, namelijk ${profileTitles.join(', ')} en ${lastProfileTitle}. Deze combinatie is uniek en vormt jouw persoonlijke neurodiversiteitsprofiel. Dit rapport is afgestemd op ${ageGroup} jarigen. De AI analyse hieronder geeft meer context.`;
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
        <p className="text-xs text-muted-foreground">Zorg dat je een leeftijdsgroep hebt gekozen via de <Link href="/quizzes" className="text-primary hover:underline">quizzen pagina</Link>.</p>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-10 md:pt-16 pb-16">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <SiteLogo />
      </div>

      <div className="w-full max-w-3xl"> 
          {ageGroup && (
              <Alert variant="default" className="mb-6 bg-primary/10 border-primary/30 text-primary shadow-sm">
                  <Info className="h-5 w-5 !text-primary" />
                  <AlertTitleUi className="font-semibold text-accent text-[1.25rem]">Zelfreflectie Tool voor {ageGroup} jaar</AlertTitleUi>
                  <AlertDescUi className="text-foreground/80 text-base leading-relaxed">
                      Deze vragen en inzichten zijn speciaal voor jouw leeftijdscategorie om je te helpen jezelf beter te begrijpen.
                  </AlertDescUi>
              </Alert>
          )}

          {currentStep !== 'intro' && (
            <TeenQuizProgressBar currentStep={progressCurrentStepNumber} stepNames={progressStepNames} />
          )}

          {currentStep === 'intro' && (
            <Card className="shadow-xl rounded-lg">
              <CardHeader className="pt-8">
                <CardTitle className="text-3xl font-bold text-center text-accent">Welkom bij de Zelfreflectie Tool ({ageGroup} jaar)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center pt-4 px-6 leading-relaxed">
                <p className="text-foreground/90 text-base">
                  Deze tool helpt je inzicht te krijgen in eigenschappen die samenhangen met o.a. ADD, ADHD, HSP, ASS en Angst/Depressie. Er zijn {currentBaseQuestions.length} basisvragen; op basis van je antwoorden kun je één of meerdere verdiepende modules doen.
                </p>
                <p className="text-foreground/90 text-base">
                  Je ontvangt een persoonlijk overzicht met uitleg, herkenbare voorbeelden en tips. Er zijn geen foute antwoorden; kijk wat bij jou past.
                </p>
                <div className="rounded-md border border-accent/50 bg-accent/10 p-4 text-left shadow-sm">
                  <h3 className="mb-2 flex items-center text-[1.25rem] font-semibold text-accent"><Info className="mr-2 h-5 w-5" />Over neurodiversiteit</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Neurodiversiteit betekent dat ieders brein uniek is. Deze tool helpt je ontdekken welke eigenschappen bij jou het sterkst aanwezig zijn. <Link href='/neurodiversiteit' className='text-primary hover:underline font-medium'>Meer weten over neurodiversiteit en de verschillende eigenschappen?</Link>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pt-6 pb-8">
                <Button size="lg" onClick={() => setCurrentStep('baseQuestions')} className="shadow-md">
                  Start de Zelfreflectie <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 'baseQuestions' && (
            <Card className="shadow-xl rounded-lg">
              <CardHeader className="pt-8 px-6">
                <CardTitle className="text-[1.5rem] font-semibold text-accent">Basisvragen ({ageGroup} jaar)</CardTitle>
                <CardDescription className="pt-1 text-foreground/80 leading-relaxed text-base">
                  Deze eerste {currentBaseQuestions.length} vragen helpen om te bepalen welke eigenschappen bij jou het sterkst aanwezig zijn. Kies bij elke vraag het antwoord dat het beste bij jou past.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 px-6">
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
              <CardFooter className="flex justify-end pt-6 pb-8 px-6">
                <AlertDialog open={showUnansweredWarning} onOpenChange={setShowUnansweredWarning}>
                  <AlertDialogContent className="rounded-lg shadow-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-accent font-bold text-[1.25rem]">Niet alle vragen beantwoord</AlertDialogTitle>
                      <AlertDialogDescription className="text-foreground/80 leading-relaxed text-base">
                        Je hebt nog niet alle basisvragen beantwoord. Voor het meest complete beeld raden we aan alle vragen in te vullen. Wil je toch doorgaan?
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
            <Card className="shadow-xl rounded-lg">
              <CardHeader className="pt-8 px-6">
                <CardTitle className="text-[1.5rem] font-semibold text-accent">Verdiepende vragen ({ageGroup} jaar)</CardTitle>
                <CardDescription className="pt-1 text-foreground/80 leading-relaxed text-base">
                  Op basis van je antwoorden raden we je aan om je verder te verdiepen in de volgende thema's.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2 px-6 leading-relaxed">
                {relevantSubtests.length === 1 ? (
                  <>
                    <p className="text-foreground/90 text-base">Op basis van je antwoorden lijkt het zinvol om verder te kijken naar <strong>{neurotypeDescriptionsTeen[relevantSubtests[0]].title}</strong>.</p>
                    <p className="text-sm text-muted-foreground">{subtestDescriptionsTeen[relevantSubtests[0]]}</p>
                    <p className="text-foreground/90 text-base">We stellen je graag nog {currentSubTests[relevantSubtests[0]]?.length || 0} verdiepende vragen voor meer inzicht.</p>
                  </>
                ) : (
                  <>
                    <p className="text-foreground/90 text-base">Op basis van je antwoorden lijkt het zinvol om verder te kijken naar de volgende gebieden:</p>
                    <ul className="list-disc space-y-1.5 pl-5 text-foreground/90 text-base">
                      {relevantSubtests.map(key => (
                        <li key={key}>
                          <strong>{neurotypeDescriptionsTeen[key].title}</strong>: <span className="text-sm text-muted-foreground">{subtestDescriptionsTeen[key]}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-foreground/90 text-base">Voor elk relevant gebied stellen we je {currentSubTests[relevantSubtests[0]]?.length || 0} verdiepende vragen voor meer inzicht.</p>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-6 pb-8 px-6">
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
            <Card className="shadow-xl rounded-lg">
              <CardHeader className="pt-8 px-6">
                <CardTitle className="text-[1.5rem] font-semibold text-accent">Vervolgvragen ({ageGroup} jaar)</CardTitle>
                <CardDescription className="pt-1 text-foreground/80 leading-relaxed text-base">
                  Deze vragen helpen om een beter beeld te krijgen van de gebieden die bij jou het sterkst naar voren komen.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 px-6">
                {relevantSubtests.map(subtestKey => (
                  <div key={subtestKey} className="mb-6 last:mb-0">
                    <h3 className="mb-3 text-[1.25rem] font-semibold text-accent">{neurotypeDescriptionsTeen[subtestKey].title}</h3>
                    <p className="mb-3 text-sm text-muted-foreground leading-relaxed">{subtestDescriptionsTeen[subtestKey]}</p>
                    <div className="my-6 p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg">
                        <p className="font-semibold text-primary">Een noot van Dr. Florentine Sage:</p>
                        <blockquote className="mt-1 italic text-muted-foreground">
                        "We gaan nu wat dieper in op de thema's die bij jou naar voren kwamen. Onthoud: we zoeken niet naar wat 'fout' is, maar naar wat jou uniek maakt. Jouw antwoorden helpen ons een completer beeld te krijgen van jouw superkrachten en uitdagingen. Wees eerlijk, er zijn geen foute antwoorden!"
                        </blockquote>
                    </div>
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
              <CardFooter className="flex justify-end pt-6 pb-8 px-6">
                <Button onClick={() => { setFinalScores(calculateFinalScores(relevantSubtests)); setCurrentStep('results'); }}>
                  Bekijk resultaten <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

         {currentStep === 'results' && (
            <div className="space-y-8 max-w-[800px] mx-auto">
              <Card className="shadow-xl rounded-lg bg-card text-card-foreground">
                <CardHeader className="text-center pt-8 px-6">
                  <CardTitle className="text-teal-700 text-[1.75rem] font-bold">Jouw Persoonlijke Overzicht ({ageGroup} jaar)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-10 pt-4 px-6 pb-6 text-base leading-relaxed">
                  
                  <div className="bg-[#F0FAF9] p-6 rounded-lg shadow-sm border-l-4 border-teal-500">
                    <h3 className="text-teal-700 text-[1.25rem] font-semibold mb-2 flex items-center gap-2"><Info className="h-5 w-5"/>Wat Betekenen Deze Scores?</h3>
                    <AlertDescUi className="leading-relaxed text-base text-gray-700">
                      De scores (schaal 1-4) geven aan hoe sterk je de kenmerken van een profiel herkent.
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-base">
                        <li><strong>Score 3.0 - 4.0:</strong> Kenmerken zijn duidelijk herkenbaar.</li>
                        <li><strong>Score 2.0 - 2.9:</strong> Kenmerken zijn soms herkenbaar.</li>
                        <li><strong>Score 1.0 - 1.9:</strong> Kenmerken zijn minder herkenbaar.</li>
                      </ul>
                      Een hogere score is niet beter of slechter, het geeft inzicht. Deze tool is voor zelfreflectie, niet voor diagnose.
                    </AlertDescUi>
                  </div>
                  
                  <div className="bg-primary/5 p-6 rounded-lg shadow-sm border-l-4 border-primary">
                      <h2 className="mb-2 text-primary text-[1.5rem] font-semibold">Jouw Eigenschappen Samengevat</h2>
                      <p className="text-foreground leading-relaxed text-base">{generateSummaryText(finalScores, relevantSubtests)}</p>
                  </div>
                  
                  <div className="bg-card rounded-lg mt-6">
                    <header className="p-0 pb-3 mb-6 border-b border-border">
                      <h2 className="text-teal-600 text-[1.75rem] font-semibold flex items-center gap-3">
                        <Brain className="h-8 w-8" /> Jouw Persoonlijke Inzichten (AI-gegenereerd)
                      </h2>
                    </header>
                    <div className="space-y-10">
                    {isAnalysisLoading ? (
                        <div className="space-y-3 animate-pulse pt-2">
                            <div className="h-5 bg-muted rounded w-3/4"></div><div className="h-5 bg-muted rounded w-1/2"></div><div className="h-5 bg-muted rounded w-5/6"></div>
                            <div className="h-5 bg-muted rounded w-2/3 mt-4"></div><div className="h-5 bg-muted rounded w-full"></div>
                        </div>
                    ) : parsedAiAnalysis.length > 0 ? (
                       parsedAiAnalysis.map((section, index) => {
                        let IconComponentForSection = section.icon || HelpCircle;
                        
                        let sectionContainerClasses = "rounded-lg p-6 shadow-sm";
                        let titleClasses = "text-[1.35rem] font-semibold mb-3 flex items-center gap-3"; 
                        let contentClasses = "text-base text-gray-700 leading-relaxed";
                        let listClasses = "list-disc space-y-1.5 pl-6 text-base text-gray-700 leading-relaxed";
                        let listItemClasses = "mb-3 flex items-start"; 

                        if (index > 0) sectionContainerClasses = cn(sectionContainerClasses, "mt-10");

                        if (section.title === "Jouw Profiel In Vogelvlucht") {
                          sectionContainerClasses = cn(sectionContainerClasses, "bg-blue-50/70"); 
                          titleClasses = cn(titleClasses, "text-blue-700");
                        } else if (section.title === "Sterke Kanten") {
                          sectionContainerClasses = cn(sectionContainerClasses, "bg-green-50/70"); 
                          titleClasses = cn(titleClasses, "text-green-700");
                           if(IconComponentForSection === HelpCircle) IconComponentForSection = ThumbsUp;
                        } else if (section.title === "Aandachtspunten") {
                          sectionContainerClasses = cn(sectionContainerClasses, "bg-orange-50/70"); 
                          titleClasses = cn(titleClasses, "text-orange-600");
                           if(IconComponentForSection === HelpCircle) IconComponentForSection = Edit2Icon;
                        } else if (section.title === "Tips voor Jou") {
                          sectionContainerClasses = cn(sectionContainerClasses, "bg-yellow-50/50"); 
                          titleClasses = cn(titleClasses, "text-yellow-700");
                           if(IconComponentForSection === HelpCircle) IconComponentForSection = Lightbulb;
                        } else { 
                          sectionContainerClasses = cn(sectionContainerClasses, "bg-gray-50/70"); 
                        }

                        return (
                          <div key={index} className={sectionContainerClasses}>
                            <h3 className={titleClasses}>
                              <IconComponentForSection className={cn("h-7 w-7 flex-shrink-0")} />
                              {section.title}
                            </h3>
                            {typeof section.content === 'string' && section.isList ? (
                                <ul className={cn(listClasses, "mt-2")}>
                                    {section.content.split('\n').map((item, i) => {
                                        const cleanedItem = item.trim().replace(/^- |^\* /,'');
                                        if (!cleanedItem) return null;

                                        let ListItemIconToUse: React.ElementType = CheckSquare;
                                        let currentItemIconColor = "text-gray-600";

                                        if (section.title === "Sterke Kanten") {
                                            ListItemIconToUse = ThumbsUp;
                                            currentItemIconColor = "text-green-600";
                                        } else if (section.title === "Aandachtspunten") {
                                            ListItemIconToUse = Edit2Icon;
                                            currentItemIconColor = "text-orange-600";
                                        } else if (section.title === "Tips voor Jou") {
                                            ListItemIconToUse = tipIcons[i % tipIcons.length] || Sparkles;
                                            currentItemIconColor = "text-yellow-600";
                                        }
                                        
                                        return (
                                            <li key={i} className={listItemClasses}>
                                                <ListItemIconToUse className={cn("h-6 w-6 mr-3 mt-1 flex-shrink-0", currentItemIconColor)}/>
                                                <span className="max-w-prose text-base">{cleanedItem}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : typeof section.content === 'string' && !section.isList ? (
                                  <p className={cn(contentClasses, "mt-1 mb-0 text-base")}>{section.content}</p>
                            ) : ( 
                               Array.isArray(section.content) && section.content.map((item, itemIdx) => {
                                const ItemIcon = item.icon || HelpCircle;
                                if (item.profileName === "Algemeen Overzicht") {
                                  return (
                                    <div key={itemIdx} className="mb-6 p-0 rounded-md">
                                      <div className="flex items-center gap-2 mb-2">
                                        <ItemIcon className="h-6 w-6 text-blue-700 flex-shrink-0" />
                                        <h4 className="text-[1.25rem] font-semibold text-blue-700">{item.profileName}</h4>
                                      </div>
                                      <p className={cn(contentClasses, "mb-0 text-base")}>{item.comment}</p>
                                    </div>
                                  );
                                } else if (item.profileName === "Score Inzichten per Thema" && Array.isArray(item.subScores)) {
                                    return (
                                      <div key={itemIdx} className="mb-0 mt-8">
                                        <div className="flex items-center gap-3 mb-4">
                                          <ItemIcon className="h-7 w-7 text-teal-700 flex-shrink-0" />
                                          <h4 className="text-[1.35rem] font-semibold text-teal-700">{item.profileName}</h4>
                                        </div>
                                        <div className="space-y-0">
                                          {item.subScores.map((subScore: ParsedProfileScore, subIdx: number) => {
                                            const themeKey = Object.keys(neurotypeIcons).find(key =>
                                                subScore.profileName.toLowerCase().includes(key.toLowerCase()) ||
                                                (neurotypeDescriptionsTeen[key] && neurotypeDescriptionsTeen[key].title.toLowerCase().includes(subScore.profileName.toLowerCase()))
                                            ) || 'Default';
                                            const ThemeIcon = neurotypeIcons[themeKey] || Brain;
                                            return (
                                                <div key={subIdx} className="score-card p-6 rounded-lg bg-gray-50 shadow-sm mb-7">
                                                    <h4 className="text-lg font-semibold text-teal-700 flex items-center gap-2 mb-2">
                                                        <ThemeIcon className="h-6 w-6" />
                                                        {sanitizeAiText(subScore.profileName)}
                                                        {sanitizeAiText(subScore.score) && <span className="text-teal-600 font-bold">&ndash; Score: {sanitizeAiText(subScore.score)}</span>}
                                                    </h4>
                                                    <p className="text-base leading-relaxed text-gray-700 mb-3">{sanitizeAiText(subScore.comment)}</p>
                                                </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                }
                                return ( 
                                    <div key={itemIdx} className="bg-background/50 p-4 rounded-md mb-4">
                                      <div className="flex items-start gap-3 mb-1">
                                        <ItemIcon className="h-6 w-6 text-teal-700 flex-shrink-0 mt-0.5" />
                                        <div>
                                          <p className="text-[1.25rem] font-semibold text-teal-700">{item.profileName}</p>
                                          {item.score && <p className="text-sm text-teal-600">Score: {item.score}</p>}
                                        </div>
                                      </div>
                                      <p className={cn(contentClasses, "text-[1rem] mb-0")}>{item.comment}</p>
                                    </div>
                                  );
                              })
                            )}
                          </div>
                        );
                       })
                    ) : (
                        <p className="text-muted-foreground text-center py-5 text-base">Geen AI analyse beschikbaar op dit moment.</p>
                    )}
                    </div>
                  </div>

                  <Alert variant="destructive" className="mt-10 text-base rounded-lg shadow-sm">
                      <AlertTriangle className="h-5 w-5" />
                      <AlertTitleUi className="font-semibold text-[1.125rem]">Belangrijk: Dit is Geen Diagnose</AlertTitleUi>
                      <AlertDescUi className="leading-relaxed text-base">
                          Deze zelfreflectie tool en het resulterende overzicht zijn bedoeld om je meer inzicht te geven in jezelf en mogelijke neurodivergente kenmerken. Het is nadrukkelijk <strong className="font-bold">geen</strong> formele (medische) diagnose.
                          <br/><br/>
                          Als je vragen of zorgen hebt over je welzijn, of als je overweegt professionele hulp te zoeken, bespreek dit dan met je ouders, een vertrouwenspersoon op school, je huisarts, of een andere gekwalificeerde zorgverlener. Zij kunnen je verder helpen. Voor meer informatie over neurodiversiteit en waar je terecht kunt, bezoek onze <Link href="/neurodiversiteit" className="text-primary hover:underline font-semibold">informatiepagina <ExternalLink className="inline h-4 w-4"/> </Link>.
                          <br/><br/>
                          MindNavigator is niet aansprakelijk voor beslissingen genomen op basis van dit overzicht. Onze tool dient ter zelfreflectie en educatie.
                      </AlertDescUi>
                  </Alert>

                  <div className="mt-10 p-6 bg-primary/10 rounded-lg shadow-md border-l-4 border-primary">
                      <h3 className="text-[1.35rem] font-semibold text-primary flex items-center gap-3 mb-3">
                          <Sparkles className="h-7 w-7" />
                          Jouw Reis Gaat Verder!
                      </h3>
                      <p className="text-foreground leading-relaxed text-base">
                          Iedereen heeft unieke sterke kanten en uitdagingen. Dit overzicht is een startpunt om jezelf beter te leren kennen. Onthoud dat je niet alleen bent op deze ontdekkingsreis. Er zijn altijd manieren om te groeien en je welzijn te verbeteren.
                      </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full shadow-xl mt-10 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 rounded-lg">
                  <CardHeader className="py-6 px-6">
                  <h2 className="text-[1.5rem] font-bold flex items-center gap-3 text-primary">
                      <Sparkles className="h-7 w-7" />
                      Ontgrendel je volledige potentieel!
                  </h2>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                  <p className="text-muted-foreground mb-4 leading-relaxed text-base">
                      Je hebt een eerste blik op je profiel gekregen. Wil je dieper graven met meer zelfreflectie tools en dagelijkse, persoonlijke coaching ontvangen?
                  </p>
                  <p className="text-lg font-semibold mb-2 text-foreground">Krijg toegang tot premium functies:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1.5 mb-5 pl-5 leading-relaxed text-base">
                      <li>Alle verdiepende zelfreflectie modules</li>
                      <li>Dagelijkse coaching tips & routines</li>
                      <li>Uitgebreide PDF overzichten</li>
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

              <Card className="w-full shadow-xl mt-10 rounded-lg">
                <CardHeader className="py-6 px-6">
                  <h2 className="text-[1.35rem] font-bold flex items-center gap-2 text-foreground">
                    Sla je overzicht op (zonder coaching)
                  </h2>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-muted-foreground mb-4 leading-relaxed text-base">
                    Wil je alleen dit overzicht opslaan en je voortgang bijhouden zonder direct te abonneren op coaching? Maak een gratis account aan.
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

              <CardFooter className="flex flex-col items-center gap-4 pt-10 pb-8">
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="outline" size="lg" className="shadow-sm"><RefreshCw className="mr-2 h-4 w-4" />Doe de zelfreflectie opnieuw</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-lg shadow-lg">
                          <AlertDialogHeader>
                          <AlertDialogTitle className="text-accent font-bold text-[1.25rem]">Zelfreflectie Tool opnieuw starten?</AlertDialogTitle>
                          <AlertDialogDescription className="text-foreground/80 leading-relaxed text-base">
                              Weet je zeker dat je de tool opnieuw wilt starten? Alle antwoorden worden gewist.
                          </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                          <AlertDialogCancel>Annuleren</AlertDialogCancel>
                          <AlertDialogAction onClick={handleRestart}>Opnieuw starten</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
                  <Button variant="link" asChild className="mt-2">
                      <Link href="/quizzes">Terug naar overzicht zelfreflectie tools</Link>
                  </Button>
              </CardFooter>
            </div>
          )}
        </div>
    </div>
  );
}
