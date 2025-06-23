// src/app/quiz/teen-neurodiversity-quiz/QuizPageContent.tsx
"use client"; 

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteLogo } from '@/components/common/site-logo';
import Link from 'next/link';
import { ArrowRight, CheckSquare, RefreshCw, Info, AlertTriangle, Sparkles, UserPlus, LogIn, Brain, Zap, User, ThumbsUp, Compass, ShieldAlert, Lightbulb, Target, Users as UsersIcon, Edit, ListChecks, MessageSquareHeart, HelpCircle, FileText, Edit2Icon, ExternalLink, Clock, ShieldCheck, PauseCircle, Loader2, MessageCircle, AlertCircle, LayoutDashboard } from 'lucide-react';
import { TeenQuizProgressBar } from '@/components/quiz/teen-quiz-progress-bar';
import { QuestionDisplay } from '@/components/quiz/question-display';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Tool, ToolCategory } from '@/lib/quiz-data/tools-data';
import { allTools } from '@/lib/quiz-data/tools-data';

type QuizStep = 'intro' | 'baseQuestions' | 'subtestConfirmation' | 'subtestQuestions' | 'results';
type AgeGroup = '12-14' | '15-18' | null;

interface Scores {
  [key: string]: number;
}
interface ToolScores {
  attention: number;
  energy: number;
  prikkels: number;
  sociaal: number;
  stemming: number;
}

const mainSectionIcons: Record<string, React.ElementType> = {
  "Jouw Profiel In Vogelvlucht": User,
  "Sterke Kanten": ThumbsUp,
  "Aandachtspunten": AlertCircle,
  "Tips voor Jou": Lightbulb
};

interface ParsedProfileScore {
  profileName: string;
  score: string;
  comment: string;
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
              icon: Info
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
      let IconComponent = mainSectionIcons[currentSectionTitle];

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
            
            profileScores.push({
              profileName: profileName,
              score: scoreValue,
              comment: commentText,
            });
          } else {
            if (line.trim() && !line.trim().match(/^[-*]\s*$/) && line.length > 3) { 
                 generalOverviewContent += (generalOverviewContent ? '\n' : '') + line;
            }
          }
        });

        const sectionContent: ParsedProfileScore[] = [];
        if (generalOverviewContent.trim()) {
           sectionContent.push({ profileName: "Algemeen Overzicht", score: "", comment: generalOverviewContent.trim() });
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
              icon: Info
            });
        }
     }
  }
  return sections.filter(s => s.content && (typeof s.content === 'string' ? s.content.trim() !== "" : s.content.length > 0));
};

const getCategoryForScore = (score: number, thresholds: [number, number, number]): 'low' | 'medium' | 'high' => {
  if (score <= thresholds[0]) return 'low';
  if (score <= thresholds[1]) return 'medium';
  return 'high';
}

const calculateToolRecommendations = (scores: ToolScores): { high: Tool[], medium: Tool[], low: Tool[] } => {
  const recommendations: { high: Set<string>, medium: Set<string>, low: Set<string> } = {
    high: new Set(),
    medium: new Set(),
    low: new Set(),
  };

  const addTools = (toolIds: string[], priority: 'high' | 'medium' | 'low') => {
    toolIds.forEach(id => {
      // Avoid adding a tool to a lower priority if it's already in a higher one
      if (!recommendations.high.has(id) && !recommendations.medium.has(id)) {
        recommendations[priority].add(id);
      } else if (priority === 'medium' && !recommendations.high.has(id)) {
        recommendations.medium.add(id);
      } else if (priority === 'high') {
         recommendations.high.add(id);
      }
    });
  };

  // Logic based on the provided matrix
  // Aandacht & Focus
  const attentionCat = getCategoryForScore(scores.attention, [2, 5, 8]);
  if (attentionCat === 'high') { // 6-8 -> Laag
    addTools(['focus-timer-pro', 'concentratie-games'], 'high');
    addTools(['distraction-blocker', 'study-planner'], 'medium');
    addTools(['bewegings-breaks'], 'low');
  } else if (attentionCat === 'medium') { // 3-5 -> Gemiddeld
    addTools(['focus-timer-pro'], 'high');
    addTools(['study-planner', 'concentratie-games'], 'medium');
    addTools(['distraction-blocker'], 'low');
  } else { // 0-2 -> Hoog
    addTools(['study-planner'], 'medium');
    addTools(['focus-timer-pro', 'concentratie-games'], 'low');
  }

  // Energie & Impulsiviteit
  const energyCat = getCategoryForScore(scores.energy, [2, 5, 8]);
  if (energyCat === 'high') { // 6-8
    addTools(['bewegings-breaks', 'impulse-pause'], 'high');
    addTools(['fidget-simulator', 'energie-monitor'], 'medium');
    addTools(['ademhalings-gids'], 'low');
  } else if (energyCat === 'medium') { // 3-5
    addTools(['bewegings-breaks'], 'high');
    addTools(['energie-monitor', 'fidget-simulator'], 'medium');
    addTools(['impulse-pause'], 'low');
  } else { // 0-2
    addTools(['energie-monitor'], 'medium');
  }

  // Prikkelverwerking & Empathie
  const prikkelsCat = getCategoryForScore(scores.prikkels, [2, 5, 8]);
  if (prikkelsCat === 'high') { // 6-8
    addTools(['sensory-calm-space', 'overprikkel-alarm'], 'high');
    addTools(['ademhalings-gids', 'progressive-relaxatie'], 'medium');
    addTools(['empathie-balancer'], 'low');
  } else if (prikkelsCat === 'medium') { // 3-5
    addTools(['sensory-calm-space'], 'high');
    addTools(['ademhalings-gids'], 'medium');
    addTools(['overprikkel-alarm'], 'low');
  } else { // 0-2
    addTools(['sensory-calm-space'], 'low');
  }

  // Sociale & Sensorische Voorkeuren
  const sociaalCat = getCategoryForScore(scores.sociaal, [2, 5, 8]);
  if (sociaalCat === 'high') { // 6-8
    addTools(['deep-dive-planner', 'interest-sharing'], 'high');
    addTools(['hobby-organizer', 'sociale-scripts'], 'medium');
    addTools(['creative-outlet'], 'low');
  } else if (sociaalCat === 'medium') { // 3-5
    addTools(['sociale-scripts'], 'high');
    addTools(['vriendschap-tracker', 'conflict-navigator'], 'medium');
  } else { // 0-2
    addTools(['vriendschap-tracker'], 'medium');
    addTools(['sociale-scripts'], 'low');
  }

  // Stemmings- & Zorgpatronen
  const stemmingCat = getCategoryForScore(scores.stemming, [2, 5, 8]);
  if (stemmingCat === 'high') { // 6-8
    addTools(['mood-tracker', 'emotie-gids'], 'high');
    addTools(['zorgen-dagboek', 'ademhalings-gids'], 'medium');
    addTools(['sensory-calm-space'], 'low');
  } else if (stemmingCat === 'medium') { // 3-5
    addTools(['mood-tracker'], 'high');
    addTools(['emotie-gids', 'gratitude-journal'], 'medium');
    addTools(['zorgen-dagboek'], 'low');
  } else { // 0-2
    addTools(['gratitude-journal'], 'medium');
    addTools(['mood-tracker'], 'low');
  }

  // Combination Rules
  if (sociaalCat === 'high' && prikkelsCat === 'low') {
    addTools(['creative-outlet'], 'medium'); // Promoot naar medium ipv low
    addTools(['deep-dive-planner'], 'high');
  }

  if (prikkelsCat === 'high' && stemmingCat === 'high' && attentionCat === 'high') {
    // Overweldigd Profiel: beperk tot max 2 rust tools
    const rustTools = ['sensory-calm-space', 'ademhalings-gids', 'mood-tracker'].filter(id => recommendations.high.has(id));
    recommendations.high.clear();
    rustTools.slice(0, 2).forEach(id => recommendations.high.add(id));
  } else if (recommendations.high.size > 4) { // Veel aanbevolen tools (aangepast naar 4)
    const top4 = Array.from(recommendations.high).slice(0, 4);
    recommendations.high = new Set(top4);
  }

  if (recommendations.high.size === 0 && recommendations.medium.size > 0) {
    const top2Medium = Array.from(recommendations.medium).slice(0, 2);
    top2Medium.forEach(id => {
      recommendations.high.add(id);
      recommendations.medium.delete(id);
    });
  }

  const findToolById = (id: string): Tool | undefined => allTools.find(tool => tool.id === id);

  return {
    high: Array.from(recommendations.high).map(findToolById).filter((t): t is Tool => !!t),
    medium: Array.from(recommendations.medium).map(findToolById).filter((t): t is Tool => !!t),
    low: Array.from(recommendations.low).map(findToolById).filter((t): t is Tool => !!t),
  };
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
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [flatSubtestQuestions, setFlatSubtestQuestions] = useState<{ key: string; index: number; text: string; }[]>([]);
  const [currentFlatSubtestIndex, setCurrentFlatSubtestIndex] = useState(0);

  const [quizAnalysis, setQuizAnalysis] = useState<string | null>(null);
  const [parsedAiAnalysis, setParsedAiAnalysis] = useState<AiAnalysisSection[]>([]);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);
  const [recommendedTools, setRecommendedTools] = useState<{ high: Tool[], medium: Tool[], low: Tool[] }>({ high: [], medium: [], low: [] });


  const ageGroupFromQuery = searchParams.get('ageGroup') as AgeGroup;
  const backLink = `/quiz/teen-neurodiversity-quiz?ageGroup=${ageGroupFromQuery}`;

  useEffect(() => {
    if (ageGroupFromQuery === '12-14' || ageGroupFromQuery === '15-18') {
      setAgeGroup(ageGroupFromQuery);
    } else {
        // router.replace('/quizzes'); 
    }
  }, [ageGroupFromQuery, router]);

  const currentBaseQuestions = useMemo(() => {
    if (ageGroup === '12-14') return baseQuestionsTeen12_14;
    if (ageGroup === '15-18') return baseQuestionsTeen15_18;
    return [];
  }, [ageGroup]);

  const currentSubTests = useMemo(() => {
    if (ageGroup === '12-14') return subTestsTeen12_14;
    if (ageGroup === '15-18') return subTestsTeen15_18;
    return {};
  }, [ageGroup]);

  const currentThresholds = useMemo(() => {
    if (ageGroup === '12-14') return thresholdsTeen12_14;
    if (ageGroup === '15-18') return thresholdsTeen15_18;
    return {};
  }, [ageGroup]);

  // Initialize answers array when questions are loaded
  useEffect(() => {
    if (currentBaseQuestions.length > 0) {
      setBaseAnswers(new Array(currentBaseQuestions.length).fill(undefined));
    }
  }, [currentBaseQuestions]);


  const calculateRelevantSubtests = useCallback((answers: (number | undefined)[]): string[] => {
    if (currentBaseQuestions.length === 0 || Object.keys(currentThresholds).length === 0 || answers.some(a => a === undefined)) return [];

    const scores: Scores = {};
    if (ageGroup === '15-18') {
        scores.ADD = calculateAverage(answers.slice(0, 3));
        scores.ADHD = calculateAverage(answers.slice(3, 6));
        scores.HSP = calculateAverage(answers.slice(6, 9));
        scores.ASS = calculateAverage(answers.slice(9, 12));
        scores.AngstDepressie = calculateAverage(answers.slice(12, 15));
    } else if (ageGroup === '12-14') {
        scores.ADD = calculateAverage(answers.slice(0, 2));
        scores.ADHD = calculateAverage(answers.slice(2, 4));
        scores.HSP = calculateAverage(answers.slice(4, 6));
        scores.ASS = calculateAverage(answers.slice(6, 8));
        scores.AngstDepressie = calculateAverage(answers.slice(8, 10));
    }

    return Object.keys(scores).filter(key => currentThresholds[key] && scores[key] >= currentThresholds[key] && !isNaN(scores[key]));
  }, [ageGroup, currentBaseQuestions.length, currentThresholds]);


  const calculateFinalScores = useCallback((currentRelevantSubtests: string[], currentSubtestAnswers: Record<string, (number | undefined)[]>): Scores => {
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
      if (currentRelevantSubtests.includes(key) && currentSubtestAnswers[key] && currentSubtestAnswers[key]?.filter(ans => ans !== undefined).length > 0) {
        scores[key] = calculateAverage(currentSubtestAnswers[key]);
      } else {
         scores[key] = baseScoresCalc[key] || 0;
      }
       scores[key] = Math.round(scores[key] * 100) / 100; 
    });
    return scores;
  }, [ageGroup, baseAnswers, currentThresholds]);
  
  
  const proceedToBaseNext = useCallback((currentAnswers: (number | undefined)[]) => {
    const relSubtests = calculateRelevantSubtests(currentAnswers);
    setRelevantSubtests(relSubtests);
    if (relSubtests.length === 0) {
      setFinalScores(calculateFinalScores([], {}));
      setCurrentStep('results');
    } else {
      const flattenedQuestions = relSubtests.flatMap(key =>
        (currentSubTests[key] || []).map((qText, qIndex) => ({
          key: key,
          index: qIndex,
          text: qText,
        }))
      );
      setFlatSubtestQuestions(flattenedQuestions);
      setCurrentFlatSubtestIndex(0);

      const initialSubAnswers: Record<string, (number | undefined)[]> = {};
      relSubtests.forEach(key => {
        initialSubAnswers[key] = new Array(currentSubTests[key]?.length || 0).fill(undefined);
      });
      setSubtestAnswers(initialSubAnswers);
      setCurrentStep('subtestConfirmation');
    }
  }, [calculateRelevantSubtests, calculateFinalScores, currentSubTests]);

  const handleBaseQuestionAnswer = useCallback((selectedOptionValue: string) => {
    const newAnswers = [...baseAnswers];
    newAnswers[currentQuestionIndex] = parseInt(selectedOptionValue, 10);
    setBaseAnswers(newAnswers);

    if (currentQuestionIndex < currentBaseQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      proceedToBaseNext(newAnswers);
    }
  }, [baseAnswers, currentQuestionIndex, currentBaseQuestions.length, proceedToBaseNext]);

  const handleSubtestQuestionAnswer = useCallback((selectedOptionValue: string) => {
    const currentQuestion = flatSubtestQuestions[currentFlatSubtestIndex];
    if (!currentQuestion) return;
    
    const { key, index } = currentQuestion;

    setSubtestAnswers(prev => {
        const newAnswers = { ...prev };
        if (!newAnswers[key]) {
          newAnswers[key] = new Array(currentSubTests[key]?.length || 0).fill(undefined);
        }
        const newSubtestAnswers = [...newAnswers[key]];
        newSubtestAnswers[index] = parseInt(selectedOptionValue, 10);
        newAnswers[key] = newSubtestAnswers;

        if (currentFlatSubtestIndex >= flatSubtestQuestions.length - 1) {
            setFinalScores(calculateFinalScores(relevantSubtests, newAnswers));
            setCurrentStep('results');
        }

        return newAnswers;
    });

    if (currentFlatSubtestIndex < flatSubtestQuestions.length - 1) {
      setCurrentFlatSubtestIndex(prev => prev + 1);
    }
  }, [flatSubtestQuestions, currentFlatSubtestIndex, currentSubTests, calculateFinalScores, relevantSubtests]);

  
  useEffect(() => {
    if (currentStep === 'results' && ageGroup && Object.keys(finalScores).length > 0) {
       // Tool recommendation logic
      const toolScores: ToolScores = {
        attention: (finalScores.ADD || 0) * 2, // Scale to 0-8 range
        energy: (finalScores.ADHD || 0) * 2,
        prikkels: (finalScores.HSP || 0) * 2,
        sociaal: (finalScores.ASS || 0) * 2,
        stemming: (finalScores.AngstDepressie || 0) * 2,
      };
      const recommendations = calculateToolRecommendations(toolScores);
      setRecommendedTools(recommendations);
      
      if (!quizAnalysis && !isAnalysisLoading) {
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
                quizTitle: `Neurodiversiteit Zelfreflectie Quiz (${ageGroup} jaar)`,
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
                localStorage.setItem('journey_quiz_completed_v1', 'true');
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
    }
  }, [currentStep, finalScores, ageGroup, baseAnswers, subtestAnswers, currentBaseQuestions, currentSubTests, quizAnalysis, isAnalysisLoading]);
  
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
    setCurrentQuestionIndex(0);
    setFlatSubtestQuestions([]);
    setCurrentFlatSubtestIndex(0);
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
  }, [currentStep, currentQuestionIndex, currentFlatSubtestIndex]);

  if (!ageGroup || currentBaseQuestions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <SiteLogo />
        <p className="mt-4">Quiz informatie laden...</p>
        <p className="text-xs text-muted-foreground">Zorg dat je een leeftijdsgroep hebt gekozen via de <Link href="/dashboard/leerling/quizzes" className="text-primary hover:underline">quizzen pagina</Link>.</p>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-10 md:pt-16 pb-16">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <SiteLogo />
      </div>

      <div className="w-full max-w-3xl"> 

          {currentStep !== 'intro' && currentStep !== 'results' && (
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Zelfreflectie Quiz ({ageGroup} jaar)</h1>
                <TeenQuizProgressBar currentStep={progressCurrentStepNumber} stepNames={progressStepNames} />
            </div>
          )}

          {currentStep === 'intro' && (
            <Card className="w-full max-w-3xl text-center shadow-xl border-border/50">
                <CardHeader className="pt-10 px-6">
                <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-3xl font-bold text-foreground">
                    Jouw Reis naar Zelfinzicht Start Hier!
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Deze zelfreflectie-quiz helpt je ontdekken wat jouw unieke denk- en leerstijl is. Er zijn geen foute antwoorden, alleen jouw ervaring telt.
                </CardDescription>
                </CardHeader>
                <CardContent className="px-6 sm:px-8 space-y-6 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left text-sm">
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border">
                          <User className="h-7 w-7 text-primary flex-shrink-0" />
                          <div>
                              <strong className="text-foreground">Voor wie?</strong>
                              <p className="text-muted-foreground">Speciaal voor jongeren van {ageGroup} jaar.</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border">
                          <Target className="h-7 w-7 text-primary flex-shrink-0" />
                          <div>
                              <strong className="text-foreground">Doel</strong>
                              <p className="text-muted-foreground">Zelfinzicht krijgen, geen 'goed' of 'fout'.</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border">
                          <Clock className="h-7 w-7 text-primary flex-shrink-0" />
                          <div>
                              <strong className="text-foreground">Duur</strong>
                              <p className="text-muted-foreground">Ongeveer 10-15 minuten.</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border">
                          <ShieldCheck className="h-7 w-7 text-primary flex-shrink-0" />
                          <div>
                              <strong className="text-foreground">Privacy</strong>
                              <p className="text-muted-foreground">Je antwoorden zijn privé en worden veilig opgeslagen.</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border">
                          <PauseCircle className="h-7 w-7 text-primary flex-shrink-0" />
                          <div>
                              <strong className="text-foreground">Pauzeren</strong>
                              <p className="text-muted-foreground">Je kunt de quiz altijd later afmaken.</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border">
                          <UsersIcon className="h-7 w-7 text-primary flex-shrink-0" />
                          <div>
                              <strong className="text-foreground">Delen</strong>
                              <p className="text-muted-foreground">Jij bepaalt of je ouders je resultaten zien. Delen is nodig voor een vergelijkende analyse.</p>
                          </div>
                      </div>
                  </div>
                <p className="text-base text-foreground/90">
                    We stellen je zo'n {currentBaseQuestions.length} vragen over hoe jij dingen ervaart. Op basis van je antwoorden, krijg je misschien wat extra vragen om je profiel nog duidelijker te maken. Aan het eind ontvang je een persoonlijk overzicht met tips die bij jou passen.
                </p>
                <p className="text-sm text-muted-foreground">
                    Wil je eerst meer weten over verschillende denkstijlen? Bezoek onze{' '}
                    <Link href={`/features/coaching-en-tools?from=${encodeURIComponent(backLink)}`} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">info pagina over denkstijlen</Link>.
                </p>
                </CardContent>
                <CardFooter className="flex justify-center pt-6 pb-8">
                <Button size="lg" onClick={() => setCurrentStep('baseQuestions')} className="shadow-md">
                    Start de Zelfreflectie
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                </CardFooter>
            </Card>
          )}

          {currentStep === 'baseQuestions' && (
            <QuestionDisplay
              key={`base-q-${currentQuestionIndex}`}
              question={{
                  id: `base-q-${currentQuestionIndex}`,
                  text: currentBaseQuestions[currentQuestionIndex],
                  options: answerOptions.map(opt => ({ id: `base-opt-${opt.value}`, text: opt.label, value: opt.value }))
              }}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={currentBaseQuestions.length}
              onNext={handleBaseQuestionAnswer}
              onBack={() => setCurrentQuestionIndex(prev => prev - 1)}
              isFirstQuestion={currentQuestionIndex === 0}
            />
          )}

          {currentStep === 'subtestConfirmation' && (
             <Card className="w-full max-w-2xl shadow-xl rounded-lg">
                <CardHeader className="text-center pt-8 px-6">
                    <CardTitle className="text-[1.75rem] font-bold text-accent">Klaar voor de volgende stap?</CardTitle>
                    <CardDescription className="pt-1 text-foreground/80 leading-relaxed text-base">
                        Op basis van je antwoorden gaan we dieper in op een paar thema's die bij jou passen. Dit helpt je nog meer te ontdekken!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-2 px-6">
                    <div className="space-y-4">
                        {relevantSubtests.map(key => {
                            const Icon = mainSectionIcons[neurotypeDescriptionsTeen[key].title] || Brain;
                            return (
                                <Card key={key} className="bg-muted/50 border p-4 flex items-center gap-4">
                                    <Icon className="h-8 w-8 text-primary flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-foreground">{neurotypeDescriptionsTeen[key].title}</h4>
                                        <p className="text-sm text-muted-foreground">{subtestDescriptionsTeen[key]}</p>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                    <div className="my-6 p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg">
                        <p className="font-semibold text-primary">Een noot van Dr. Florentine Sage:</p>
                        <blockquote className="mt-1 italic text-muted-foreground">
                            "We gaan nu wat dieper in op de thema's die bij jou naar voren kwamen. Onthoud: we zoeken niet naar wat 'fout' is, maar naar wat jou uniek maakt. Jouw antwoorden helpen ons een completer beeld te krijgen van jouw superkrachten en uitdagingen. Wees eerlijk, er zijn geen foute antwoorden!"
                        </blockquote>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-6 pb-8 px-6">
                    <Button variant="secondary" onClick={() => { setFinalScores(calculateFinalScores([], {})); setCurrentStep('results'); }}>
                        Sla over & bekijk basisinzichten
                    </Button>
                    <Button onClick={() => setCurrentStep('subtestQuestions')} className="w-full sm:w-auto">
                        Ja, stel me de verdiepende vragen! <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
          )}

          {currentStep === 'subtestQuestions' && (
             <QuestionDisplay
              key={`sub-q-${currentFlatSubtestIndex}`}
              question={{
                  id: `sub-q-${currentFlatSubtestIndex}`,
                  text: flatSubtestQuestions[currentFlatSubtestIndex].text,
                  options: answerOptions.map(opt => ({ id: `sub-opt-${opt.value}`, text: opt.label, value: opt.value }))
              }}
              questionNumber={currentFlatSubtestIndex + 1}
              totalQuestions={flatSubtestQuestions.length}
              onNext={handleSubtestQuestionAnswer}
              onBack={() => setCurrentFlatSubtestIndex(prev => prev - 1)}
              isFirstQuestion={currentFlatSubtestIndex === 0}
            />
          )}

         {currentStep === 'results' && (
            <div className="space-y-8 max-w-[800px] mx-auto">
              <Card className="shadow-xl rounded-lg bg-card text-card-foreground">
                <CardHeader className="text-center pt-8 px-6">
                  <p className="text-primary font-semibold mb-2">Een bericht van Dr. Florentine Sage</p>
                  <CardTitle className="text-teal-700 text-[1.75rem] font-bold">Jouw Persoonlijke Overzicht ({ageGroup} jaar)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-10 pt-4 px-6 pb-6 text-base leading-relaxed">
                  <div className="p-6 rounded-lg shadow-sm">
                    <p className="text-base text-gray-700 leading-relaxed text-center">
                        Hoi! Wat goed dat je de Zelfreflectie Tool hebt ingevuld. Hieronder vind je een overzicht van wat jouw antwoorden ons vertellen. Zie dit als een startpunt om jezelf beter te leren kennen. Het is een spiegel, geen label. Klaar om je unieke handleiding te ontdekken?
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 p-6 rounded-lg shadow-sm border-l-4 border-primary">
                      <h2 className="mb-2 text-primary text-[1.5rem] font-semibold">In het kort: Jouw Kenmerken</h2>
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
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Persoonlijke analyse wordt geladen...</span>
                        </div>
                    ) : parsedAiAnalysis.length > 0 ? (
                       parsedAiAnalysis.map((section, index) => {
                        const IconComponent = mainSectionIcons[section.title] || HelpCircle;

                        let sectionContainerClasses = "rounded-lg p-6 shadow-sm border-l-4";
                        let titleClasses = "text-2xl font-bold mb-4 flex items-center gap-3"; 
                        let listClasses = "list-disc space-y-2 pl-5 text-base text-gray-800 leading-relaxed";
                        let tipContainerClasses = "p-3 bg-gray-50 rounded-lg";
                        let tipTitleClasses = "font-semibold text-gray-900";

                        switch(section.title) {
                            case "Jouw Profiel In Vogelvlucht":
                                sectionContainerClasses = cn(sectionContainerClasses, "bg-blue-50 border-blue-500");
                                titleClasses = cn(titleClasses, "text-blue-700");
                                break;
                            case "Sterke Kanten":
                                sectionContainerClasses = cn(sectionContainerClasses, "bg-green-50 border-green-500");
                                titleClasses = cn(titleClasses, "text-green-700");
                                break;
                            case "Aandachtspunten":
                                sectionContainerClasses = cn(sectionContainerClasses, "bg-orange-50 border-orange-500");
                                titleClasses = cn(titleClasses, "text-orange-700");
                                break;
                            case "Tips voor Jou":
                                sectionContainerClasses = cn(sectionContainerClasses, "bg-yellow-50 border-yellow-500");
                                titleClasses = cn(titleClasses, "text-yellow-700");
                                break;
                            default:
                                sectionContainerClasses = cn(sectionContainerClasses, "bg-gray-50 border-gray-300");
                        }

                        return (
                          <div key={index} className={sectionContainerClasses}>
                            <h2 className={titleClasses}>
                              <IconComponent className="h-6 w-6" />
                              {section.title}
                            </h2>
                            {typeof section.content === 'string' && section.isList ? (
                                <ul className={listClasses}>
                                    {section.content.split('\n').map((item, i) => {
                                        const cleanedItem = item.trim().replace(/^- |^\* /,'');
                                        if (!cleanedItem) return null;
                                        
                                        if (section.title === "Tips voor Jou") {
                                            const tipParts = cleanedItem.split(':');
                                            const tipTitle = tipParts.length > 1 ? tipParts[0].trim() : '';
                                            const tipDescription = tipParts.length > 1 ? tipParts.slice(1).join(':').trim() : cleanedItem;
                                            return (
                                                <li key={i} className="list-none ml-[-1.25rem]">
                                                  <div className={tipContainerClasses}>
                                                    <h4 className={tipTitleClasses}>{tipTitle}</h4>
                                                    <p className="text-gray-700">{tipDescription}</p>
                                                  </div>
                                                </li>
                                            );
                                        }

                                        return <li key={i}>{cleanedItem}</li>;
                                    })}
                                </ul>
                            ) : typeof section.content === 'string' && !section.isList ? (
                                  <p className="text-base text-gray-800 leading-relaxed">{section.content}</p>
                            ) : ( 
                               Array.isArray(section.content) && section.content.map((item, itemIdx) => {
                                if (item.profileName === "Algemeen Overzicht") {
                                  return (
                                    <div key={itemIdx} className="mb-4">
                                      <p className="text-base text-gray-800 leading-relaxed">{item.comment}</p>
                                    </div>
                                  );
                                } else if (item.profileName === "Score Inzichten per Thema" && Array.isArray(item.subScores)) {
                                    return (
                                      <div key={itemIdx} className="mt-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Thema Inzichten</h3>
                                        <div className="space-y-3">
                                          {item.subScores.map((subScore: ParsedProfileScore, subIdx: number) => (
                                                <div key={subIdx} className="p-3 bg-gray-50/70 rounded-md border">
                                                    <h4 className="font-semibold text-gray-700">{sanitizeAiText(subScore.profileName)}</h4>
                                                    <p className="text-sm text-muted-foreground">{sanitizeAiText(subScore.comment)}</p>
                                                </div>
                                            ))}
                                        </div>
                                      </div>
                                    );
                                }
                                return null;
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
                </CardContent>
              </Card>

              {recommendedTools.high.length > 0 && (
                <Card className="shadow-xl rounded-lg bg-card text-card-foreground">
                  <CardHeader>
                      <h2 className="text-teal-600 text-[1.75rem] font-semibold flex items-center gap-3">
                        <Rocket className="h-8 w-8" /> Aanbevolen Tools voor Jou
                      </h2>
                      <CardDescription>Op basis van jouw antwoorden, zijn dit de tools die jou het beste kunnen helpen op dit moment.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Accordion type="multiple" className="w-full space-y-4">
                          {recommendedTools.high.map((tool, index) => (
                              <AccordionItem key={tool.id} value={tool.id} className="bg-primary/5 border border-primary/20 rounded-lg">
                                  <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline data-[state=open]:text-primary">
                                      <div className="flex items-center gap-3">
                                          <tool.icon className="h-6 w-6 text-primary"/>
                                          {tool.title}
                                      </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="p-4 pt-0">
                                      <p className="text-muted-foreground mb-3">{tool.description}</p>
                                      <h4 className="font-semibold text-primary mb-1">Waarom is dit voor jou?</h4>
                                      <p className="text-sm text-muted-foreground">{tool.reasoning.high}</p>
                                      <h4 className="font-semibold text-primary mt-2 mb-1">Hoe te gebruiken?</h4>
                                      <p className="text-sm text-muted-foreground">{tool.usage.when}</p>
                                      <Button size="sm" className="mt-3">Ga naar Tool <ArrowRight className="ml-2 h-4 w-4"/></Button>
                                  </AccordionContent>
                              </AccordionItem>
                          ))}
                      </Accordion>
                  </CardContent>
                </Card>
              )}


              <Alert variant="destructive" className="mt-10 text-base rounded-lg shadow-sm">
                  <AlertTriangle className="h-5 w-5" />
                  <AlertTitleUi className="font-semibold text-[1.125rem]">Belangrijk: Dit is Geen Diagnose</AlertTitleUi>
                  <AlertDescUi className="leading-relaxed text-base">
                      Dit overzicht is bedoeld voor zelfreflectie en is nadrukkelijk <strong>geen</strong> formele (medische) diagnose. Heb je vragen of zorgen over je welzijn? Bespreek dit dan met je ouders, een vertrouwenspersoon of je huisarts. MindNavigator is niet aansprakelijk voor beslissingen die op basis van dit overzicht worden genomen. Voor meer info, bezoek onze <Link href="/neurodiversiteit" className="text-primary hover:underline font-semibold">informatiepagina <ExternalLink className="inline h-4 w-4"/> </Link>.
                  </AlertDescUi>
              </Alert>
              
               <CardFooter className="flex flex-col items-center gap-4 pt-10 pb-8">
                    <Button size="lg" asChild className="w-full sm:w-auto">
                        <Link href="/dashboard">
                            <LayoutDashboard className="mr-2 h-5 w-5" />
                            Ga naar mijn Dashboard
                        </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="link" className="text-muted-foreground"><RefreshCw className="mr-2 h-4 w-4" />Doe de quiz opnieuw</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-lg shadow-lg">
                            <AlertDialogHeader>
                            <AlertDialogTitle className="text-accent font-bold text-[1.25rem]">Quiz opnieuw starten?</AlertDialogTitle>
                            <AlertDialogDescription className="text-foreground/80 leading-relaxed text-base">
                                Weet je zeker dat je de quiz opnieuw wilt starten? Alle antwoorden worden gewist.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Annuleren</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRestart}>Opnieuw starten</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </div>
          )}
        </div>
    </div>
  );
}
