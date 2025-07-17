// src/app/quiz/[quizId]/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SiteLogo } from '@/components/common/site-logo';
import { QuestionDisplay, type QuizQuestion } from '@/components/quiz/question-display';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowRight, Loader2, Sparkles, Target, Clock, ShieldCheck, HelpCircle, ArrowLeft, Brain, FileText, GitBranch, Lightbulb } from 'lucide-react';
import type { QuizAdmin, GenerateQuizAnalysisInput, GenerateQuizAnalysisOutput, QuizFocus } from '@/types/quiz-admin';
import { getQuizById } from '@/services/quizService';
import type { QuizResult } from '@/types/dashboard';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { TeenQuizProgressBar } from '@/components/quiz/teen-quiz-progress-bar';
import { getCategoryLabel } from '@/types/quiz-admin';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { storageService } from '@/services/storageService'; 

// A professional, dynamic intro step for ANY quiz
function GenericQuizIntroStep({ quiz, onStart, childsName, onChildsNameChange }: { quiz: QuizAdmin; onStart: () => void; childsName: string; onChildsNameChange: (name: string) => void; }) {
  const { user } = useAuth();
  const isForParent = typeof quiz.audience === 'string' && quiz.audience.toLowerCase().includes('ouder');
  const title = quiz.title;
  const description = isForParent ? (quiz.descriptionForParent || quiz.description) : quiz.description;
  const buttonText = isForParent ? 'Start Vragenlijst' : 'Start de Quiz';
  
  const backLink = useMemo(() => {
    if (isForParent) return '/for-parents/quizzes';
    if (user && user.role === 'leerling') return '/dashboard/leerling/quizzes';
    return '/quizzes';
  }, [isForParent, user]);

  const infoItems = [
    { icon: HelpCircle, text: `${quiz.questions.length} vragen` },
    { icon: Clock, text: `Duur: ${quiz.settings?.estimatedDuration || '5-10 min'}` },
    { icon: Target, text: `Categorie: ${getCategoryLabel(quiz.category)}` },
    { icon: ShieldCheck, text: `Antwoorden zijn privé & veilig` },
  ];

  return (
    <Card className="w-full max-w-3xl text-center shadow-xl border-border/50">
      <CardHeader className="pt-8 sm:pt-10 px-6">
        <Sparkles className="mx-auto h-12 w-12 text-primary mb-3" />
        <CardTitle className="text-2xl font-bold text-foreground">
          {title}
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground mt-1 max-w-2xl mx-auto">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 sm:px-8 space-y-4 pt-4">
        {isForParent && (
            <div className="max-w-sm mx-auto text-left pt-2">
                <Label htmlFor="childsName">Voornaam van uw kind (optioneel)</Label>
                <Input
                    id="childsName"
                    value={childsName}
                    onChange={(e) => onChildsNameChange(e.target.value)}
                    placeholder="Voornaam (bijv. 'Sofie')"
                />
                <p className="text-xs text-muted-foreground mt-1">Voor een persoonlijker rapport.</p>
            </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-sm pt-2">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
              <item.icon className="h-6 w-6 text-primary flex-shrink-0" />
              <p className="text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center pt-4 pb-6 px-6 gap-3">
        <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href={backLink}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar overzicht
            </Link>
        </Button>
        <Button size="lg" onClick={onStart} className="shadow-md w-full sm:w-auto">
          {buttonText}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

const teenLoadingSteps = [
    { icon: Brain, text: "De AI analyseert jouw antwoorden..." },
    { icon: GitBranch, text: "Verbanden worden gelegd tussen je antwoorden..." },
    { icon: Target, text: "Jouw unieke profiel wordt in kaart gebracht..." },
    { icon: Lightbulb, text: "Persoonlijke tips worden voor je geformuleerd..." },
    { icon: FileText, text: "Het volledige rapport wordt voor je samengesteld..." },
    { icon: ShieldCheck, text: "Rapport wordt gecontroleerd op kwaliteit en accuraatheid..." },
    { icon: Sparkles, text: "De finishing touch! Bijna klaar..." }
];

const parentLoadingSteps = [
    { icon: Brain, text: "De AI analyseert uw observaties..." },
    { icon: GitBranch, text: "Verbanden worden gelegd tussen uw antwoorden..." },
    { icon: Target, text: "Het profiel van uw kind wordt in kaart gebracht..." },
    { icon: Lightbulb, text: "Tips voor u als ouder worden geformuleerd..." },
    { icon: FileText, text: "Het volledige rapport wordt voor u samengesteld..." },
    { icon: ShieldCheck, text: "Rapport wordt gecontroleerd op kwaliteit en accuraatheid..." },
    { icon: Sparkles, text: "De finishing touch! Bijna klaar..." }
];

const focusFlagMap: Record<QuizFocus, GenerateQuizAnalysisInput['quizFocus'][number]> = {
    'general': 'algemeen',
    'adhd-friendly': 'adhd-vriendelijk',
    'autism-friendly': 'autisme-vriendelijk',
    'hsp-friendly': 'hsp-vriendelijk',
    'dyslexia-friendly': 'dyslexie-vriendelijk',
    'high-giftedness': 'hoogbegaafdheid',
    'executive-functions': 'executieve-functies',
    'sensory-processing': 'sensorische-verwerking',
    'emotion-regulation': 'emotieregulatie',
};


export default function GenericQuizPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = params.quizId as string;
    const { user } = useAuth();
    const { toast } = useToast();
    const [childsName, setChildsName] = useState('');

    const [quiz, setQuiz] = useState<QuizAdmin | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState<'intro' | 'questions'>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | undefined)[]>([]);
    const [currentLoadingStep, setCurrentLoadingStep] = useState(0);

    useEffect(() => {
        if (quizId) {
            const fetchQuiz = async () => {
                const quizData = await getQuizById(quizId);
                if (quizData) {
                    setQuiz(quizData);
                    setAnswers(new Array(quizData.questions.length).fill(undefined));
                }
                setIsLoading(false);
            };
            fetchQuiz();
        } else {
            setIsLoading(false);
        }
    }, [quizId]);

     useEffect(() => {
        if (isSubmitting) {
            const interval = setInterval(() => {
                setCurrentLoadingStep(prev => (prev + 1) % teenLoadingSteps.length); 
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [isSubmitting]);

    const handleStartQuiz = () => {
        setStep('questions');
    };
    
    const handleNext = async (selectedOptionValue: string) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = parseInt(selectedOptionValue, 10);
        setAnswers(newAnswers);

        if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            if(quiz) {
                setIsSubmitting(true);
                const finalAnswers = newAnswers;
                 const answeredQuestions = quiz.questions.map((q, index) => {
                    const answerValue = finalAnswers[index];
                    const answerOption = [
                        { value: '1', label: 'Nooit of zelden' },
                        { value: '2', label: 'Soms' },
                        { value: '3', label: 'Vaak' },
                        { value: '4', label: 'Bijna altijd' },
                      ].find(opt => parseInt(opt.value, 10) === answerValue);
                    return { question: q.text, answer: answerOption ? `${answerOption.label} (${answerValue})` : `Score ${answerValue}` };
                });

                const validScores = finalAnswers.filter(a => typeof a === 'number') as number[];
                const averageScore = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;
                
                const scoreKey = quiz.category === 'Thema' ? quiz.title : (quiz.category || 'general');
                const finalScores = { [scoreKey]: averageScore };
                const quizAudience = quiz.audience;

                const mappedFocusFlags = quiz.focusFlags 
                  ? quiz.focusFlags.map(flag => focusFlagMap[flag] || 'algemeen')
                  : [];

                const analysisInput: GenerateQuizAnalysisInput = {
                    quizTitle: quiz.title,
                    quizAudience: quizAudience,
                    childName: childsName,
                    ageGroup: "Onbekend", 
                    finalScores: finalScores,
                    answeredQuestions: answeredQuestions,
                    analysisDetailLevel: quiz.settings?.analysisDetailLevel || 'standaard',
                    showChart: quiz.settings?.resultPresentation?.showChart ?? true,
                    showParentalCta: quiz.settings?.resultPresentation?.showParentalCta ?? false,
                    quizFocus: mappedFocusFlags,
                    primaryCategories: quiz.category ? [quiz.category as any] : [],
                    quizType: quiz.category === 'Basis' ? 'adaptive' : quiz.id.startsWith('ai-') ? 'ai-generated' : 'template'
                };
                
                 try {
                    const response = await fetch('/api/analyze-quiz', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(analysisInput),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.details || 'API request failed');
                    }
                    
                    const analysisResult: GenerateQuizAnalysisOutput = await response.json();
                    
                    const newQuizResultData: Omit<QuizResult, 'id'> = {
                        userId: user?.id,
                        userName: user?.name,
                        quizId: quiz.id,
                        title: childsName ? `${quiz.title} (${childsName})` : quiz.title,
                        audience: quizAudience,
                        dateCompleted: new Date().toISOString(),
                        score: `Gem. score: ${averageScore.toFixed(1)}/4`,
                        isShared: false,
                        reportData: {
                            summary: `Je hebt de quiz '${quiz.title}' voltooid.`,
                            aiAnalysis: analysisResult.analysis,
                            answers: answeredQuestions,
                            scores: finalScores,
                            settings: {
                                showChart: quiz.settings?.resultPresentation?.showChart ?? true,
                            }
                        }
                    };
                    
                    storageService.setTempQuizResult({ id: `temp-${Date.now()}`, ...newQuizResultData });

                    if (user) {
                        // This would be replaced with a call to a result service
                    }
                    
                    router.push(`/dashboard/results`);
                } catch (error) {
                    console.error("Failed to run quiz analysis via API:", error);
                    toast({
                        title: "Analyse Mislukt",
                        description: "Kon het rapport niet genereren. Probeer het later opnieuw.",
                        variant: "destructive",
                    });
                    setIsSubmitting(false);
                }
            }
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else {
            setStep('intro');
        }
    };

    const isForParent = quiz?.audience?.toLowerCase().includes('ouder');
    const activeLoadingSteps = isForParent ? parentLoadingSteps : teenLoadingSteps;
    
    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Quiz laden...</div>;
    }
    
    if (isSubmitting) {
        const LoadingIcon = activeLoadingSteps[currentLoadingStep].icon;
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-10 md:pt-16 pb-16">
                <div className="absolute top-4 left-4 md:top-8 md:left-8">
                    <SiteLogo />
                </div>
                <Card className="w-full max-w-lg shadow-xl text-center">
                    <CardHeader className="pt-8 px-6">
                        <CardTitle className="text-2xl font-bold">Rapport wordt gegenereerd...</CardTitle>
                        <CardDescription>Een ogenblik geduld, we stellen je persoonlijke rapport samen.</CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-[200px] flex flex-col items-center justify-center space-y-4">
                        <div className="relative h-24 w-24">
                            <Loader2 className="absolute inset-0 h-24 w-24 text-primary/10 animate-[spin_4s_linear_infinite]" />
                            <LoadingIcon className="absolute inset-0 m-auto h-12 w-12 text-primary" />
                        </div>
                        <p className="text-muted-foreground font-semibold animate-pulse">{activeLoadingSteps[currentLoadingStep].text}</p>
                        <p className="text-xs text-muted-foreground">Dit kan enkele seconden duren.</p>
                    </CardContent>
                    <CardFooter className="flex justify-center pb-8">
                        <p className="text-sm text-muted-foreground italic">Een goed inzicht is het wachten waard!</p>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="flex h-screen flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader>
                        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
                        <CardTitle className="text-2xl">Quiz niet gevonden</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Sorry, we konden de opgevraagde quiz niet vinden. Controleer de link of ga terug.</p>
                        <Button asChild className="mt-6"><Link href="/dashboard/leerling/quizzes">Terug naar Quizzen</Link></Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (quiz.questions.length === 0) {
        return (
             <div className="flex h-screen flex-col items-center justify-center p-4">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader>
                        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
                        <CardTitle className="text-2xl">Lege Quiz</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Deze quiz bevat nog geen vragen. De beheerder moet eerst vragen toevoegen.</p>
                        <Button asChild className="mt-6"><Link href="/dashboard/leerling/quizzes">Terug naar Quizzen</Link></Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentQuestionData = quiz.questions[currentQuestionIndex];
    const quizQuestion: QuizQuestion = {
        id: `q-${currentQuestionIndex}`,
        text: currentQuestionData.text,
        options: [
            { id: 'opt-1', text: 'Nooit of zelden', value: '1' },
            { id: 'opt-2', text: 'Soms', value: '2' },
            { id: 'opt-3', text: 'Vaak', value: '3' },
            { id: 'opt-4', text: 'Bijna altijd', value: '4' },
          ],
    };

    const stepNames = ["Start", "Vragen", "Resultaat"];
    const currentStepNumber = step === 'intro' ? 1 : 2;

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-10 md:pt-16 pb-16">
            <div className="absolute top-4 left-4 md:top-8 md:left-8">
                <SiteLogo />
            </div>

            <div className="flex flex-col items-center justify-center flex-1 w-full">
                {step === 'intro' ? (
                    <GenericQuizIntroStep quiz={quiz} onStart={handleStartQuiz} childsName={childsName} onChildsNameChange={setChildsName}/>
                ) : (
                    <div className="w-full max-w-2xl">
                        <div className="text-center mb-6">
                            <h1 className="text-xl font-bold text-foreground mb-4">{childsName ? `${quiz.title} voor ${childsName}` : quiz.title}</h1>
                            <TeenQuizProgressBar
                                currentStep={currentStepNumber}
                                stepNames={stepNames}
                                progressWithinStep={currentStepNumber === 2 ? ((currentQuestionIndex) / (quiz.questions.length || 1)) * 100 : 0}
                            />
                        </div>
                        <QuestionDisplay
                            key={`q-${currentQuestionIndex}`}
                            question={quizQuestion}
                            questionNumber={currentQuestionIndex + 1}
                            totalQuestions={quiz.questions.length}
                            onNext={handleNext}
                            onBack={handleBack}
                            isFirstQuestion={currentQuestionIndex === 0}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
