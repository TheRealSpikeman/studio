
'use client';

import React, { useState } from 'react';
import { useQuizCreator } from '@/contexts/QuizCreatorContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  FileText, Star, Rocket, CheckCircle2, AlertCircle, BarChart3,
  ListChecks, Smartphone, Monitor, Sparkles, ArrowRight, ArrowLeft, Bot, RefreshCw, Loader2
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { QuizAdmin, QuizAudience, QuizCategory, QuizAdminQuestion } from '@/types/quiz-admin';
import { answerOptions } from '@/lib/quiz-data/teen-neurodiversity-quiz';
import { verifyQuizQuestions } from '@/ai/flows/verify-quiz-questions-flow';
import type { VerifyQuizQuestionsOutput } from '@/ai/flows/verify-quiz-questions-flow';

type DeviceType = 'desktop' | 'mobile';

export const Step5_Preview = () => {
    const { quizData, resetQuizCreator } = useQuizCreator();
    const router = useRouter();
    const { toast } = useToast();
    const [previewDevice, setPreviewDevice] = useState<DeviceType>('desktop');
    const [previewQuestionIndex, setPreviewQuestionIndex] = useState(0);
    const [previewSelectedOption, setPreviewSelectedOption] = useState<string | undefined>(undefined);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<VerifyQuizQuestionsOutput | null>(null);

    const questions = quizData.questions || [];
    const currentPreviewQuestion = questions[previewQuestionIndex];

    const handlePreviewNext = () => {
        if (previewQuestionIndex < questions.length - 1) {
            setPreviewQuestionIndex(prev => prev + 1);
            setPreviewSelectedOption(undefined);
        } else {
            setPreviewQuestionIndex(0);
            setPreviewSelectedOption(undefined);
            toast({ title: "Preview Einde", description: "Je hebt het einde van de preview bereikt en bent terug bij het begin." });
        }
    };

    const handlePreviewBack = () => {
        if (previewQuestionIndex > 0) {
            setPreviewQuestionIndex(prev => prev - 1);
            setPreviewSelectedOption(undefined);
        }
    };

    const handlePublish = () => {
        let audience: QuizAudience[];
        switch (quizData.audienceType) {
            case 'teen': audience = [`Tiener (${quizData.targetAgeGroup} jr, voor zichzelf)`]; break;
            case 'parent': audience = [`Ouder (over kind ${quizData.targetAgeGroup} jr)`]; break;
            case 'adult': audience = quizData.targetAgeGroup === 'all' ? ['Algemeen (alle leeftijden, voor zichzelf)'] : [`Volwassene (18+, voor zichzelf)`]; break;
            default: audience = ['Algemeen (alle leeftijden, voor zichzelf)'];
        }

        const newQuiz: QuizAdmin = {
            id: `ai-quiz-${Date.now()}`,
            title: quizData.title || "Naamloze Quiz",
            description: quizData.description || "Geen beschrijving.",
            audience: audience,
            category: (quizData.mainCategory as QuizCategory) || 'Thema',
            status: 'concept',
            questions: (quizData.questions || []).map((q, index) => ({ id: q.id || `q-${index}`, text: q.text || '', example: q.example, weight: q.weight || 1 })),
            createdAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString(),
            slug: quizData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `quiz-${Date.now()}`,
        };
        
        try {
            localStorage.setItem(newQuiz.id, JSON.stringify(newQuiz));
        } catch (e) {
            toast({ title: "Fout bij opslaan", description: "Kon de quiz niet lokaal opslaan.", variant: "destructive" });
            return;
        }
        
        toast({ title: "Quiz Opgeslagen als Concept!", description: `"${newQuiz.title}" is opgeslagen. Je kunt het nu vinden in het Quiz Beheer overzicht.` });
        resetQuizCreator();
        router.push('/dashboard/admin/quiz-management');
    };

    const handleVerification = async () => {
        if (!quizData.title || !quizData.audienceType || !quizData.targetAgeGroup || !quizData.mainCategory || !quizData.questions || quizData.questions.length === 0) {
          toast({
            title: "Onvoldoende data",
            description: "Zorg ervoor dat titel, doelgroep, categorie en vragen zijn ingevuld voor verificatie.",
            variant: "destructive",
          });
          return;
        }
    
        setIsVerifying(true);
        setVerificationResult(null);
    
        try {
          let audience: string;
          switch (quizData.audienceType) {
            case 'teen':
              audience = `Tiener (${quizData.targetAgeGroup} jr, voor zichzelf)`;
              break;
            case 'parent':
              audience = `Ouder (over kind ${quizData.targetAgeGroup} jr)`;
              break;
            case 'adult':
            default:
              audience = `Volwassene (18+, voor zichzelf)`;
          }
    
          const input = {
            quizTitle: quizData.title,
            quizAudience: audience,
            quizCategory: quizData.mainCategory,
            questions: (quizData.questions as QuizAdminQuestion[]).filter(q => q.text).map(q => ({
              text: q.text,
              example: q.example,
            })),
          };
    
          const result = await verifyQuizQuestions(input);
          setVerificationResult(result);
        } catch (error) {
          console.error("AI verification failed:", error);
          toast({
            title: "Verificatie Mislukt",
            description: "De AI kon de verificatie niet voltooien. Probeer het later opnieuw.",
            variant: "destructive",
          });
        } finally {
          setIsVerifying(false);
        }
    };


    const checklistItems = [
      { label: "Quiz titel en beschrijving ingevuld", valid: !!quizData.title && !!quizData.description },
      { label: "Doelgroep en focus opties geconfigureerd", valid: !!quizData.audienceType && !!quizData.targetAgeGroup },
      { label: `Minimaal ${quizData.creationType === 'adaptive' ? 15 : 3} vragen`, valid: (quizData.questions?.length ?? 0) >= (quizData.creationType === 'adaptive' ? 15 : 3) },
      { label: "Resultaat types en follow-up ingesteld", valid: !!quizData.settings?.resultPresentation?.format },
    ];

    const getStatusBadgeVariant = (status?: string): "default" | "secondary" | "destructive" => {
        switch (status) {
          case 'Goedgekeurd':
            return 'default';
          case 'Goedgekeurd met suggesties':
            return 'secondary';
          case 'Revisie nodig':
            return 'destructive';
          default:
            return 'default';
        }
    };

    const getStatusBadgeClasses = (status?: string): string => {
        switch (status) {
          case 'Goedgekeurd':
            return 'bg-green-100 text-green-700 border-green-300';
          case 'Goedgekeurd met suggesties':
            return 'bg-yellow-100 text-yellow-700 border-yellow-300';
          case 'Revisie nodig':
            return 'bg-red-100 text-red-700 border-red-300';
          default:
            return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };
    
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">5. Preview & Publiceer</h2>
            <p className="text-muted-foreground mb-6">Controleer alle details en publiceer je quiz. Na publicatie kun je de quiz nog steeds aanpassen.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left side: Preview */}
                <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/>Live Quiz Preview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="border bg-muted/20 p-2 rounded-lg">
                            <div className="flex justify-center mb-2">
                                <Button variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'} size="sm" onClick={() => setPreviewDevice('desktop')}><Monitor className="mr-2 h-4 w-4"/> Desktop</Button>
                                <Button variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'} size="sm" onClick={() => setPreviewDevice('mobile')}><Smartphone className="mr-2 h-4 w-4"/> Mobiel</Button>
                            </div>
                            <div className={cn("mx-auto transition-all duration-300", 
                                previewDevice === 'desktop' && 'w-full',
                                previewDevice === 'mobile' && 'w-[375px] h-[620px] border-8 border-slate-800 rounded-[40px] shadow-2xl'
                            )}>
                                <Card className={cn("overflow-hidden flex flex-col h-[620px]", previewDevice === 'mobile' && 'rounded-[32px] h-full')}>
                                    <div className="bg-gradient-to-br from-primary to-accent text-primary-foreground p-4 text-center">
                                        <h4 className="font-bold text-xl flex items-center justify-center gap-2"><Sparkles className="h-5 w-5"/>{quizData.title || "Voorbeeld Titel"}</h4>
                                        <p className="text-xs opacity-90 mt-1">{quizData.description || "Een korte beschrijving van de quiz komt hier."}</p>
                                        <Progress value={((previewQuestionIndex + 1) / (questions.length || 1)) * 100} className="w-full h-1 mt-2 bg-white/20" />
                                        <p className="text-xs opacity-90 mt-1">Vraag {previewQuestionIndex + 1} van {questions.length || 0}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 overflow-y-auto flex-grow">
                                        {questions.length > 0 && currentPreviewQuestion ? (
                                            <>
                                                <p className="font-semibold text-lg mb-4 text-foreground">{currentPreviewQuestion.text}</p>
                                                <RadioGroup value={previewSelectedOption} onValueChange={setPreviewSelectedOption} className="space-y-3">
                                                    {answerOptions.map((option) => (
                                                        <Label key={option.value} htmlFor={`preview-option-${option.value}`} className="flex items-center gap-3 border p-3 rounded-md bg-white hover:bg-slate-100 cursor-pointer has-[input:checked]:border-primary has-[input:checked]:bg-primary/5">
                                                            <RadioGroupItem value={option.value} id={`preview-option-${option.value}`}/> 
                                                            {option.label}
                                                        </Label>
                                                    ))}
                                                </RadioGroup>
                                            </>
                                        ) : (
                                            <p className="text-muted-foreground text-center py-10">Geen vragen om weer te geven. Voeg vragen toe in stap 3.</p>
                                        )}
                                    </div>
                                    {questions.length > 0 && (
                                        <CardFooter className="flex justify-between border-t p-3 bg-slate-50">
                                            <Button variant="outline" onClick={handlePreviewBack} disabled={previewQuestionIndex === 0}><ArrowLeft className="mr-2 h-4 w-4"/>Vorige</Button>
                                            <Button onClick={handlePreviewNext} disabled={!previewSelectedOption}>{previewQuestionIndex === questions.length - 1 ? "Voltooi preview" : "Volgende"}<ArrowRight className="ml-2 h-4 w-4"/></Button>
                                        </CardFooter>
                                    )}
                                </Card>
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                </div>

                {/* Right side: Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                                <Bot className="h-5 w-5 text-primary" />
                                AI Verificatie (Psycholoog)
                            </CardTitle>
                            <CardDescription>
                                Laat de AI de vragen controleren op duidelijkheid, toon en geschiktheid.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isVerifying ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Verificatie bezig...</span>
                                </div>
                            ) : verificationResult ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">Status:</span>
                                        <Badge variant={getStatusBadgeVariant(verificationResult.overallStatus)} className={getStatusBadgeClasses(verificationResult.overallStatus)}>
                                            {verificationResult.overallStatus}
                                        </Badge>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={handleVerification}><RefreshCw className="mr-2 h-4 w-4"/>Opnieuw</Button>
                                    </div>
                                    
                                    <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md border">{verificationResult.overallFeedback}</p>

                                    {verificationResult.suggestions && verificationResult.suggestions.length > 0 && (
                                        <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger>Bekijk {verificationResult.suggestions.length} suggestie(s)</AccordionTrigger>
                                            <AccordionContent className="space-y-3">
                                                {verificationResult.suggestions.map((s, i) => (
                                                    <div key={i} className="text-xs p-2 border bg-background rounded-md">
                                                        <p><strong>Vraag {s.questionIndex + 1}:</strong> <span className="italic">"{s.originalText}"</span></p>
                                                        <p><strong>Probleem:</strong> {s.issue}</p>
                                                        <p><strong>Suggestie:</strong> <span className="text-green-600 font-medium">"{s.suggestedRevision}"</span></p>
                                                    </div>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                        </Accordion>
                                    )}
                                </div>
                            ) : (
                                <Button onClick={handleVerification}>
                                    <Bot className="mr-2 h-4 w-4" /> Start AI Verificatie
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                          <CardTitle className="text-lg font-medium flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary"/>Publicatie Checklist</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {checklistItems.map(item => (
                            <div key={item.label} className="flex items-center text-sm">
                                {item.valid ? <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0"/> : <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground/50 flex-shrink-0"/>}
                                <span className={!item.valid ? "text-muted-foreground line-through" : ""}>{item.label}</span>
                            </div>
                          ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                          <CardTitle className="text-lg font-medium flex items-center gap-2"><Rocket className="h-5 w-5 text-primary"/>Launch Opties</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <RadioGroup defaultValue="direct" className="space-y-2">
                              <Label className="flex items-center gap-2 border p-3 rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5 cursor-pointer"><RadioGroupItem value="direct" id="direct"/><div><p className="font-medium">Direct Live</p><p className="text-xs text-muted-foreground">Quiz wordt direct beschikbaar voor gebruikers.</p></div></Label>
                              <Label className="flex items-center gap-2 border p-3 rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5 cursor-pointer"><RadioGroupItem value="scheduled" id="scheduled"/><div><p className="font-medium">Geplande Launch</p><p className="text-xs text-muted-foreground">Kies wanneer de quiz live gaat.</p></div></Label>
                           </RadioGroup>
                           <Button onClick={handlePublish} className="w-full mt-4 bg-green-600 hover:bg-green-700"><Rocket className="mr-2 h-4 w-4"/>Publiceer Quiz</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
