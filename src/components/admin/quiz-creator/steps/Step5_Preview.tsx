
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
  ListChecks, Smartphone, Tablet, Monitor, Sparkles, ChevronDown, Check, ArrowRight, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { QuizAdmin, QuizAudience, QuizCategory, QuizAdminQuestion } from '@/types/quiz-admin';

type DeviceType = 'desktop' | 'mobile' | 'tablet';

export const Step5_Preview = () => {
    const { quizData, resetQuizCreator } = useQuizCreator();
    const router = useRouter();
    const { toast } = useToast();
    const [previewDevice, setPreviewDevice] = useState<DeviceType>('desktop');
    const [previewQuestionIndex, setPreviewQuestionIndex] = useState(0);
    const [previewSelectedOption, setPreviewSelectedOption] = useState<string | undefined>(undefined);

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

    const checklistItems = [
      { label: "Quiz titel en beschrijving ingevuld", valid: !!quizData.title && !!quizData.description },
      { label: "Doelgroep en focus opties geconfigureerd", valid: !!quizData.audienceType && !!quizData.targetAgeGroup },
      { label: `Minimaal ${quizData.creationType === 'adaptive' ? 15 : 3} vragen`, valid: (quizData.questions?.length ?? 0) >= (quizData.creationType === 'adaptive' ? 15 : 3) },
      { label: "Resultaat types en follow-up ingesteld", valid: !!quizData.settings?.resultPresentation?.format },
    ];
    
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">5. Preview & Publiceer</h2>
            <p className="text-muted-foreground mb-6">Controleer alle details en publiceer je quiz. Na publicatie kun je de quiz nog steeds aanpassen.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left side: Preview */}
                <div className="lg:col-span-1">
                    <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/>Live Quiz Preview</h3>
                    <div className="border bg-muted/20 p-2 rounded-lg">
                        <div className="flex justify-center mb-2">
                             <Button variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'} size="sm" onClick={() => setPreviewDevice('desktop')}><Monitor className="mr-2 h-4 w-4"/> Desktop</Button>
                             <Button variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'} size="sm" onClick={() => setPreviewDevice('mobile')}><Smartphone className="mr-2 h-4 w-4"/> Mobiel</Button>
                             <Button variant={previewDevice === 'tablet' ? 'secondary' : 'ghost'} size="sm" onClick={() => setPreviewDevice('tablet')}><Tablet className="mr-2 h-4 w-4"/> Tablet</Button>
                        </div>
                        <div className={cn("mx-auto transition-all duration-300", 
                            previewDevice === 'desktop' && 'w-full',
                            previewDevice === 'mobile' && 'w-[375px] h-[720px] border-8 border-slate-800 rounded-[40px] shadow-2xl',
                            previewDevice === 'tablet' && 'w-[768px]'
                        )}>
                            <Card className={cn("overflow-hidden flex flex-col", previewDevice === 'mobile' ? 'rounded-[32px] h-full' : 'h-[720px]')}>
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
                                                <Label className="flex items-center gap-3 border p-3 rounded-md bg-white hover:bg-slate-100 cursor-pointer has-[input:checked]:border-primary has-[input:checked]:bg-primary/5"><RadioGroupItem value="a" id="a"/> Antwoord A (voorbeeld)</Label>
                                                <Label className="flex items-center gap-3 border p-3 rounded-md bg-white hover:bg-slate-100 cursor-pointer has-[input:checked]:border-primary"><RadioGroupItem value="b" id="b"/> Antwoord B (voorbeeld)</Label>
                                                <Label className="flex items-center gap-3 border p-3 rounded-md bg-white hover:bg-slate-100 cursor-pointer has-[input:checked]:border-primary"><RadioGroupItem value="c" id="c"/> Antwoord C (voorbeeld)</Label>
                                                <Label className="flex items-center gap-3 border p-3 rounded-md bg-white hover:bg-slate-100 cursor-pointer has-[input:checked]:border-primary"><RadioGroupItem value="d" id="d"/> Antwoord D (voorbeeld)</Label>
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
                </div>

                {/* Right side: Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary"/>Publicatie Checklist</CardTitle></CardHeader>
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
                        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary"/>Voorspelde Performance</CardTitle></CardHeader>
                        <CardContent>
                            <Label className="text-xs text-muted-foreground">Verwachte Voltooiing</Label>
                            <div className="flex items-baseline gap-2 mb-1"><span className="text-4xl font-bold text-primary">87%</span></div>
                            <Progress value={87} className="h-2"/>
                            <p className="text-xs text-muted-foreground mt-1">Bovengemiddeld voor deze doelgroep</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5 text-primary"/>Launch Opties</CardTitle></CardHeader>
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

