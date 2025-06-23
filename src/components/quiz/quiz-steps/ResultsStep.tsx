// src/components/quiz/quiz-steps/ResultsStep.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, AlertTriangle, RefreshCw, LayoutDashboard, Brain, User, ThumbsUp, Info, HelpCircle, Sparkles, MessageSquareHeart, Edit2Icon, Lightbulb, Compass, ShieldAlert, Zap, Users as UsersIcon, ExternalLink, Rocket, AlertCircle } from 'lucide-react';
import Link from 'next/link';

import { generateQuizAnalysis } from '@/ai/flows/generate-quiz-analysis-flow';
import { neurotypeDescriptionsTeen, answerOptions } from '@/lib/quiz-data/teen-neurodiversity-quiz';
import type { Tool } from '@/lib/quiz-data/tools-data';
import { allTools } from '@/lib/quiz-data/tools-data';
import { cn } from '@/lib/utils';

// Types (should be in a shared file eventually)
type Scores = Record<string, number>;
type ToolScores = { attention: number; energy: number; prikkels: number; sociaal: number; stemming: number; };
interface ParsedProfileScore { profileName: string; score: string; comment: string; subScores?: ParsedProfileScore[]; }
interface AiAnalysisSection { title: string; content: string | ParsedProfileScore[]; isList?: boolean; icon?: React.ElementType; }
const mainSectionIcons: Record<string, React.ElementType> = { "Jouw Profiel In Vogelvlucht": User, "Sterke Kanten": ThumbsUp, "Aandachtspunten": AlertCircle, "Tips voor Jou": Lightbulb };

// Helper Functions
const sanitizeAiText = (text: string): string => {
  if (typeof text !== 'string') return '';
  return text.replace(/(\*\*|__)(.*?)\1/g, '$2').replace(/(\*|_)(.*?)\1/g, '$2');
};

const parseAiAnalysis = (analysisText: string): AiAnalysisSection[] => {
  // (Full function copied from old QuizPageContent.tsx)
    if (!analysisText || typeof analysisText !== 'string') return [];
    let cleanedText = sanitizeAiText(analysisText).replace(/^##\s+/gm, '').replace(/^#\s+/gm, '');
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
                sections.push({ title: "Overige Informatie", content: cleanedContentBefore, isList: false, icon: Info });
            }
        }
        const currentSectionTitle = header;
        const contentStartIndex = match.index + match[0].length;
        let contentEndIndex = textToProcess.length;
        for (const nextKnownHeader of knownHeaders) {
            if (nextKnownHeader === header) continue;
            const nextKnownHeaderRegex = new RegExp(`^${nextKnownHeader.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s*\\n)?`, 'im');
            const nextMatch = nextKnownHeaderRegex.exec(textToProcess.substring(contentStartIndex));
            if (nextMatch) { contentEndIndex = contentStartIndex + nextMatch.index; break; }
        }
        let currentContent = sanitizeAiText(textToProcess.substring(contentStartIndex, contentEndIndex).trim());
        textToProcess = textToProcess.substring(contentEndIndex);
        lastKnownHeaderEndIndex = contentEndIndex;
        currentContent = currentContent.split('\n').filter(line => line.trim() !== '*' && line.trim() !== '-' && line.trim() !== '##').join('\n').replace(/^##\s*/gm, '').trim();

        const isExpectedListSection = ["Sterke Kanten", "Aandachtspunten", "Tips voor Jou"].includes(currentSectionTitle);
        let IconComponent = mainSectionIcons[currentSectionTitle] || HelpCircle;

        if (currentSectionTitle === "Jouw Profiel In Vogelvlucht") {
            const profileScores: ParsedProfileScore[] = [];
            let generalOverviewContent = "";
            currentContent.split('\n').forEach(line => {
                line = sanitizeAiText(line.replace(/^- |^\* /,'').trim());
                if (!line) return;
                const scoreMatch = line.match(/([^:(]+)(?:\s*\(Score:\s*([\d.]+)\))?:\s*(.+)/i) || line.match(/([^:]+):\s*([\d.]+)\s*(?:\((.+)\))?/i);
                if (scoreMatch && (scoreMatch[2] || scoreMatch[3])) { 
                    let commentText = scoreMatch[3] ? sanitizeAiText(scoreMatch[3].trim()) : "";
                    if (!commentText && !scoreMatch[2] && scoreMatch[0].includes(':')) {
                        commentText = sanitizeAiText(scoreMatch[0].substring(scoreMatch[0].indexOf(':') + 1).trim());
                    }
                    profileScores.push({ profileName: sanitizeAiText(scoreMatch[1].trim()), score: scoreMatch[2] ? sanitizeAiText(scoreMatch[2].trim()) : "", comment: commentText });
                } else { if (line.trim() && !line.trim().match(/^[-*]\s*$/) && line.length > 3) generalOverviewContent += (generalOverviewContent ? '\n' : '') + line; }
            });
            const sectionContent: ParsedProfileScore[] = [];
            if (generalOverviewContent.trim()) sectionContent.push({ profileName: "Algemeen Overzicht", score: "", comment: generalOverviewContent.trim() });
            const groupedScores = profileScores.map(ps => {
                if (!ps.score && ps.comment.match(/^\(([\d.]+)\)\s*(.*)/)) {
                    const commentScoreMatch = ps.comment.match(/^\(([\d.]+)\)\s*(.*)/);
                    if (commentScoreMatch) {
                      ps.score = sanitizeAiText(commentScoreMatch[1]);
                      ps.comment = sanitizeAiText(commentScoreMatch[2].trim());
                    }
                }
                return { ...ps, profileName: sanitizeAiText(ps.profileName), score: sanitizeAiText(ps.score), comment: sanitizeAiText(ps.comment) };
            });
            if (groupedScores.length > 0) sectionContent.push({ profileName: "Score Inzichten per Thema", score: "", comment: "", subScores: groupedScores });
            if (sectionContent.length > 0) sections.push({ title: currentSectionTitle, content: sectionContent, icon: IconComponent });
            else if (currentContent.trim() && !generalOverviewContent.trim()) sections.push({ title: currentSectionTitle, content: currentContent.trim(), isList: isExpectedListSection, icon: IconComponent });
        } else if (isExpectedListSection) {
            if (currentContent.trim()) sections.push({ title: currentSectionTitle, content: currentContent.trim(), isList: true, icon: IconComponent });
        } else if (currentContent.trim()) { sections.push({ title: currentSectionTitle, content: currentContent.trim(), isList: false, icon: IconComponent }); }
        }
    }
    if (textToProcess.trim()) {
        const cleanedRemainingText = sanitizeAiText(textToProcess.replace(/^##\s*/gm, '').trim());
        if (cleanedRemainingText) {
            const existingOtherInfo = sections.find(s => s.title === "Overige Informatie");
            if (existingOtherInfo && typeof existingOtherInfo.content === 'string') existingOtherInfo.content += '\n' + cleanedRemainingText.split('\n').map(line => line.replace(/^- |^\* /,'').trim()).filter(Boolean).join('\n');
            else if (!existingOtherInfo) sections.push({ title: "Overige Informatie", content: cleanedRemainingText.split('\n').map(line => line.replace(/^- |^\* /,'').trim()).filter(Boolean).join('\n'), isList: false, icon: Info });
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
  const recommendations: { high: Set<string>, medium: Set<string>, low: Set<string> } = { high: new Set(), medium: new Set(), low: new Set() };
  const addTools = (toolIds: string[], priority: 'high' | 'medium' | 'low') => {
    toolIds.forEach(id => {
      if (!recommendations.high.has(id) && !recommendations.medium.has(id)) { recommendations[priority].add(id); } 
      else if (priority === 'medium' && !recommendations.high.has(id)) { recommendations.medium.add(id); }
      else if (priority === 'high') { recommendations.high.add(id); }
    });
  };

  const attentionCat = getCategoryForScore(scores.attention, [2, 5, 8]);
  if (attentionCat === 'high') { addTools(['focus-timer-pro', 'concentratie-games'], 'high'); addTools(['distraction-blocker', 'study-planner'], 'medium'); addTools(['bewegings-breaks'], 'low'); }
  else if (attentionCat === 'medium') { addTools(['focus-timer-pro'], 'high'); addTools(['study-planner', 'concentratie-games'], 'medium'); addTools(['distraction-blocker'], 'low'); }
  else { addTools(['study-planner'], 'medium'); addTools(['focus-timer-pro', 'concentratie-games'], 'low'); }

  const energyCat = getCategoryForScore(scores.energy, [2, 5, 8]);
  if (energyCat === 'high') { addTools(['bewegings-breaks', 'impulse-pause'], 'high'); addTools(['fidget-simulator', 'energie-monitor'], 'medium'); addTools(['ademhalings-gids'], 'low'); }
  else if (energyCat === 'medium') { addTools(['bewegings-breaks'], 'high'); addTools(['energie-monitor', 'fidget-simulator'], 'medium'); addTools(['impulse-pause'], 'low'); }
  else { addTools(['energie-monitor'], 'medium'); }

  const prikkelsCat = getCategoryForScore(scores.prikkels, [2, 5, 8]);
  if (prikkelsCat === 'high') { addTools(['sensory-calm-space', 'overprikkel-alarm'], 'high'); addTools(['ademhalings-gids', 'progressive-relaxatie'], 'medium'); addTools(['empathie-balancer'], 'low'); }
  else if (prikkelsCat === 'medium') { addTools(['sensory-calm-space'], 'high'); addTools(['ademhalings-gids'], 'medium'); addTools(['overprikkel-alarm'], 'low'); }
  else { addTools(['sensory-calm-space'], 'low'); }

  const sociaalCat = getCategoryForScore(scores.sociaal, [2, 5, 8]);
  if (sociaalCat === 'high') { addTools(['deep-dive-planner', 'interest-sharing'], 'high'); addTools(['hobby-organizer', 'sociale-scripts'], 'medium'); addTools(['creative-outlet'], 'low'); }
  else if (sociaalCat === 'medium') { addTools(['sociale-scripts'], 'high'); addTools(['vriendschap-tracker', 'conflict-navigator'], 'medium'); }
  else { addTools(['vriendschap-tracker'], 'medium'); addTools(['sociale-scripts'], 'low'); }

  const stemmingCat = getCategoryForScore(scores.stemming, [2, 5, 8]);
  if (stemmingCat === 'high') { addTools(['mood-tracker', 'emotie-gids'], 'high'); addTools(['zorgen-dagboek', 'ademhalings-gids'], 'medium'); addTools(['sensory-calm-space'], 'low'); }
  else if (stemmingCat === 'medium') { addTools(['mood-tracker'], 'high'); addTools(['emotie-gids', 'gratitude-journal'], 'medium'); addTools(['zorgen-dagboek'], 'low'); }
  else { addTools(['gratitude-journal'], 'medium'); addTools(['mood-tracker'], 'low'); }

  if (sociaalCat === 'high' && prikkelsCat === 'low') { addTools(['creative-outlet'], 'medium'); addTools(['deep-dive-planner'], 'high'); }
  if (prikkelsCat === 'high' && stemmingCat === 'high' && attentionCat === 'high') {
    const rustTools = ['sensory-calm-space', 'ademhalings-gids', 'mood-tracker'].filter(id => recommendations.high.has(id));
    recommendations.high = new Set(rustTools.slice(0, 2));
  } else if (recommendations.high.size > 4) { recommendations.high = new Set(Array.from(recommendations.high).slice(0, 4)); }
  if (recommendations.high.size === 0 && recommendations.medium.size > 0) {
    const top2Medium = Array.from(recommendations.medium).slice(0, 2);
    top2Medium.forEach(id => { recommendations.high.add(id); recommendations.medium.delete(id); });
  }

  const findToolById = (id: string): Tool | undefined => allTools.find(tool => tool.id === id);
  return { high: Array.from(recommendations.high).map(findToolById).filter((t): t is Tool => !!t), medium: Array.from(recommendations.medium).map(findToolById).filter((t): t is Tool => !!t), low: Array.from(recommendations.low).map(findToolById).filter((t): t is Tool => !!t) };
};

// Main Component
interface ResultsStepProps {
  finalScores: Scores;
  baseAnswers: (number | undefined)[];
  subtestAnswers: Record<string, (number | undefined)[]>;
  ageGroup: '12-14' | '15-18' | null;
  relevantSubtests: string[];
  onRestart: () => void;
  currentBaseQuestions: string[];
  currentSubTests: Record<string, string[]>;
}

export const ResultsStep = ({ finalScores, baseAnswers, subtestAnswers, ageGroup, relevantSubtests, onRestart, currentBaseQuestions, currentSubTests }: ResultsStepProps) => {
  const [quizAnalysis, setQuizAnalysis] = useState<string | null>(null);
  const [parsedAiAnalysis, setParsedAiAnalysis] = useState<AiAnalysisSection[]>([]);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(true);
  const [recommendedTools, setRecommendedTools] = useState<{ high: Tool[], medium: Tool[], low: Tool[] }>({ high: [], medium: [], low: [] });

  const fetchAndSetAnalysis = useCallback(async () => {
    setIsAnalysisLoading(true);
    try {
      const answeredQuestions: Array<{ question: string; answer: string; profileKey?: string}> = [];
      currentBaseQuestions.forEach((qText, index) => {
        const answerValue = baseAnswers[index];
        if (answerValue !== undefined) {
          const answerOption = answerOptions.find(opt => parseInt(opt.value, 10) === answerValue);
          let profileKeyForQuestion: string | undefined = undefined;
          if (ageGroup === '15-18') { if (index < 3) profileKeyForQuestion = 'ADD'; else if (index < 6) profileKeyForQuestion = 'ADHD'; else if (index < 9) profileKeyForQuestion = 'HSP'; else if (index < 12) profileKeyForQuestion = 'ASS'; else if (index < 15) profileKeyForQuestion = 'AngstDepressie'; } 
          else if (ageGroup === '12-14') { if (index < 2) profileKeyForQuestion = 'ADD'; else if (index < 4) profileKeyForQuestion = 'ADHD'; else if (index < 6) profileKeyForQuestion = 'HSP'; else if (index < 8) profileKeyForQuestion = 'ASS'; else if (index < 10) profileKeyForQuestion = 'AngstDepressie'; }
          answeredQuestions.push({ question: qText, answer: answerOption ? `${answerOption.label} (${answerValue})` : `Score ${answerValue}`, profileKey: profileKeyForQuestion });
        }
      });
      Object.entries(subtestAnswers).forEach(([subtestKey, answers]) => {
        const questionsForSubtest = currentSubTests[subtestKey] || [];
        answers.forEach((ansVal, qIdx) => {
          if (ansVal !== undefined) {
            const answerOption = answerOptions.find(opt => parseInt(opt.value, 10) === ansVal);
            answeredQuestions.push({ question: `${neurotypeDescriptionsTeen[subtestKey]?.title || subtestKey} - ${questionsForSubtest[qIdx]}`, answer: answerOption ? `${answerOption.label} (${ansVal})` : `Score ${ansVal}`, profileKey: subtestKey });
          }
        });
      });
      const analysisInput = { quizTitle: `Neurodiversiteit Zelfreflectie Quiz (${ageGroup} jaar)`, ageGroup: ageGroup || '15-18', finalScores, answeredQuestions, analysisDetailLevel: 'standaard' as const };
      const result = await generateQuizAnalysis(analysisInput);
      setQuizAnalysis(result.analysis);
      setParsedAiAnalysis(parseAiAnalysis(result.analysis));
      if (typeof window !== 'undefined' && result.analysis) {
        localStorage.setItem('mindnavigator_onboardingAnalysis', result.analysis);
        localStorage.setItem('mindnavigator_onboardingUser', JSON.stringify({ name: "Alex", ageGroup }));
        localStorage.setItem('journey_quiz_completed_v1', 'true');
      }
    } catch (error) {
      console.error("Failed to generate quiz analysis:", error);
      const errorMsg = "Er is iets misgegaan bij het laden van de diepgaande analyse. Probeer de pagina later opnieuw te laden of neem contact op als het probleem aanhoudt.";
      setQuizAnalysis(errorMsg);
      setParsedAiAnalysis([{ title: "Fout", content: errorMsg, icon: AlertTriangle }]);
    } finally {
      setIsAnalysisLoading(false);
    }
  }, [finalScores, ageGroup, baseAnswers, subtestAnswers, currentBaseQuestions, currentSubTests]);

  useEffect(() => {
    const toolScores: ToolScores = { attention: (finalScores.ADD || 0) * 2, energy: (finalScores.ADHD || 0) * 2, prikkels: (finalScores.HSP || 0) * 2, sociaal: (finalScores.ASS || 0) * 2, stemming: (finalScores.AngstDepressie || 0) * 2 };
    setRecommendedTools(calculateToolRecommendations(toolScores));
    fetchAndSetAnalysis();
  }, [finalScores, fetchAndSetAnalysis]);

  const generateSummaryText = (scores: Scores): string => {
    const profilesToShow = Object.keys(scores).filter(key => neurotypeDescriptionsTeen[key] && scores[key] >= (neurotypeDescriptionsTeen[key].threshold || 2.5));
    if (profilesToShow.length === 0) return "Op basis van je antwoorden kom je op dit moment niet opvallend naar voren voor een specifiek neurodivergent profiel. Bekijk de AI analyse hieronder voor een persoonlijker inzicht.";
    if (profilesToShow.length === 1) return `Je antwoorden wijzen erop dat je kenmerken herkent die vaak geassocieerd worden met ${neurotypeDescriptionsTeen[profilesToShow[0]].title}. De AI analyse hieronder geeft meer context.`;
    const profileTitles = profilesToShow.map(d => neurotypeDescriptionsTeen[d].title);
    return `Je antwoorden wijzen erop dat je kenmerken herkent die passen bij meerdere profielen, namelijk ${profileTitles.slice(0, -1).join(', ')} en ${profileTitles.slice(-1)}. De AI analyse hieronder geeft meer context.`;
  };

  return (
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
              <p className="text-foreground leading-relaxed text-base">{generateSummaryText(finalScores)}</p>
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
                          case "Jouw Profiel In Vogelvlucht": sectionContainerClasses = cn(sectionContainerClasses, "bg-blue-50 border-blue-500"); titleClasses = cn(titleClasses, "text-blue-700"); break;
                          case "Sterke Kanten": sectionContainerClasses = cn(sectionContainerClasses, "bg-green-50 border-green-500"); titleClasses = cn(titleClasses, "text-green-700"); break;
                          case "Aandachtspunten": sectionContainerClasses = cn(sectionContainerClasses, "bg-orange-50 border-orange-500"); titleClasses = cn(titleClasses, "text-orange-700"); break;
                          case "Tips voor Jou": sectionContainerClasses = cn(sectionContainerClasses, "bg-yellow-50 border-yellow-500"); titleClasses = cn(titleClasses, "text-yellow-700"); break;
                          default: sectionContainerClasses = cn(sectionContainerClasses, "bg-gray-50 border-gray-300");
                      }
                      return (
                          <div key={index} className={sectionContainerClasses}>
                              <h2 className={titleClasses}><IconComponent className="h-6 w-6" />{section.title}</h2>
                              {typeof section.content === 'string' && section.isList ? (<ul className={listClasses}>{section.content.split('\n').map((item, i) => { const cleanedItem = item.trim().replace(/^- |^\* /,''); if (!cleanedItem) return null; if (section.title === "Tips voor Jou") { const tipParts = cleanedItem.split(':'); const tipTitle = tipParts.length > 1 ? tipParts[0].trim() : ''; const tipDescription = tipParts.length > 1 ? tipParts.slice(1).join(':').trim() : cleanedItem; return (<li key={i} className="list-none ml-[-1.25rem]"><div className={tipContainerClasses}><h4 className={tipTitleClasses}>{tipTitle}</h4><p className="text-gray-700">{tipDescription}</p></div></li>); } return <li key={i}>{cleanedItem}</li>; })}</ul>) 
                              : typeof section.content === 'string' && !section.isList ? (<p className="text-base text-gray-800 leading-relaxed">{section.content}</p>) 
                              : (Array.isArray(section.content) && section.content.map((item, itemIdx) => { if (item.profileName === "Algemeen Overzicht") return <div key={itemIdx} className="mb-4"><p className="text-base text-gray-800 leading-relaxed">{item.comment}</p></div>; else if (item.profileName === "Score Inzichten per Thema" && Array.isArray(item.subScores)) return (<div key={itemIdx} className="mt-4"><h3 className="text-lg font-semibold text-gray-800 mb-2">Thema Inzichten</h3><div className="space-y-3">{item.subScores.map((subScore, subIdx) => (<div key={subIdx} className="p-3 bg-gray-50/70 rounded-md border"><h4 className="font-semibold text-gray-700">{sanitizeAiText(subScore.profileName)}</h4><p className="text-sm text-muted-foreground">{sanitizeAiText(subScore.comment)}</p></div>))}</div></div>); return null; }))}
                          </div>
                      );
                  })
              ) : (<p className="text-muted-foreground text-center py-5 text-base">Geen AI analyse beschikbaar op dit moment.</p>)}
            </div>
          </div>
        </CardContent>
      </Card>
      {recommendedTools.high.length > 0 && (
        <Card className="shadow-xl rounded-lg bg-card text-card-foreground">
          <CardHeader><h2 className="text-teal-600 text-[1.75rem] font-semibold flex items-center gap-3"><Rocket className="h-8 w-8" /> Aanbevolen Tools voor Jou</h2><CardDescription>Op basis van jouw antwoorden, zijn dit de tools die jou het beste kunnen helpen op dit moment.</CardDescription></CardHeader>
          <CardContent>
              <Accordion type="multiple" className="w-full space-y-4">
                  {recommendedTools.high.map((tool) => (
                      <AccordionItem key={tool.id} value={tool.id} className="bg-primary/5 border border-primary/20 rounded-lg">
                          <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline data-[state=open]:text-primary"><div className="flex items-center gap-3"><tool.icon className="h-6 w-6 text-primary"/>{tool.title}</div></AccordionTrigger>
                          <AccordionContent className="p-4 pt-0"><p className="text-muted-foreground mb-3">{tool.description}</p><h4 className="font-semibold text-primary mb-1">Waarom is dit voor jou?</h4><p className="text-sm text-muted-foreground">{tool.reasoning.high}</p><h4 className="font-semibold text-primary mt-2 mb-1">Hoe te gebruiken?</h4><p className="text-sm text-muted-foreground">{tool.usage.when}</p><Button size="sm" className="mt-3">Ga naar Tool <ArrowRight className="ml-2 h-4 w-4"/></Button></AccordionContent>
                      </AccordionItem>
                  ))}
              </Accordion>
          </CardContent>
        </Card>
      )}
      <Alert variant="destructive" className="mt-10 text-base rounded-lg shadow-sm">
          <AlertTriangle className="h-5 w-5" /><AlertTitle className="font-semibold text-[1.125rem]">Belangrijk: Dit is Geen Diagnose</AlertTitle>
          <AlertDescription className="leading-relaxed text-base">Dit overzicht is bedoeld voor zelfreflectie en is nadrukkelijk <strong>geen</strong> formele (medische) diagnose. Heb je vragen of zorgen over je welzijn? Bespreek dit dan met je ouders, een vertrouwenspersoon of je huisarts. MindNavigator is niet aansprakelijk voor beslissingen die op basis van dit overzicht worden genomen. Voor meer info, bezoek onze <Link href="/neurodiversiteit" className="text-primary hover:underline font-semibold">informatiepagina <ExternalLink className="inline h-4 w-4"/> </Link>.</AlertDescription>
      </Alert>
      <CardFooter className="flex flex-col items-center gap-4 pt-10 pb-8">
        <Button size="lg" asChild className="w-full sm:w-auto"><Link href="/dashboard"><LayoutDashboard className="mr-2 h-5 w-5" />Ga naar mijn Dashboard</Link></Button>
        <Button variant="link" onClick={onRestart} className="text-muted-foreground"><RefreshCw className="mr-2 h-4 w-4" />Doe de quiz opnieuw</Button>
      </CardFooter>
    </div>
  );
};
