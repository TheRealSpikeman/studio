
'use client';

import React, { useState } from 'react';
import { useQuizCreator } from '@/contexts/QuizCreatorContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  FileText, Star, Rocket, CheckCircle2, AlertCircle, BarChart3,
  ListChecks, Smartphone, Tablet, Monitor, Sparkles, ChevronDown, Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { QuizAdmin, QuizAudience, QuizCategory, QuizAdminQuestion } from '@/types/quiz-admin';

type DeviceType = 'desktop' | 'mobile' | 'tablet';

// Re-defining allCategories here to avoid circular dependencies if moved to context
const allCategories = [
    { id: 'emoties_gevoelens', title: 'Emoties & Gevoelens' },
    { id: 'vriendschappen_sociaal', title: 'Vriendschappen & Sociaal' },
    { id: 'leren_school', title: 'Leren & School' },
    { id: 'prikkels_omgeving', title: 'Prikkels & Omgeving' },
    { id: 'wie_ben_ik', title: 'Wie ben ik?' },
    { id: 'dromen_toekomst', title: 'Dromen & Toekomst' }
];

export const Step5_Preview = () => {
    const { quizData, resetQuizCreator } = useQuizCreator();
    const router = useRouter();
    const { toast } = useToast();
    const [previewDevice, setPreviewDevice] = useState<DeviceType>('desktop');

    const handlePublish = () => {
        // Construct audience
        let audience: QuizAudience[];
        switch (quizData.audienceType) {
            case 'teen':
                audience = [`Tiener (${quizData.targetAgeGroup} jr, voor zichzelf)`];
                break;
            case 'parent':
                audience = [`Ouder (over kind ${quizData.targetAgeGroup} jr)`];
                break;
            case 'adult':
                if (quizData.targetAgeGroup === 'all') {
                    audience = ['Algemeen (alle leeftijden, voor zichzelf)'];
                } else {
                    audience = [`Volwassene (18+, voor zichzelf)`];
                }
                break;
            default:
                audience = ['Algemeen (alle leeftijden, voor zichzelf)'];
        }

        const newQuiz: QuizAdmin = {
            id: `ai-quiz-${Date.now()}`,
            title: quizData.title || (quizData.creationType === 'adaptive' ? `Adaptieve Onboarding Quiz (${quizData.targetAgeGroup} jr)` : "Naamloze Quiz"),
            description: quizData.description || "Geen beschrijving.",
            audience: audience,
            category: (quizData.mainCategory as QuizCategory) || 'Thema',
            status: 'concept', // Start as concept for final review
            questions: (quizData.questions || []).map((q, index): QuizAdminQuestion => ({
                id: q.id || `q-${index}`,
                text: q.text || '',
                example: q.example,
                weight: q.weight || 1,
            })),
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
        
        toast({
            title: "Quiz Opgeslagen als Concept!",
            description: `"${newQuiz.title}" is opgeslagen. Je kunt het nu vinden in het Quiz Beheer overzicht.`,
        });

        resetQuizCreator();
        router.push('/dashboard/admin/quiz-management');
    };

    const checklistItems = [
      { 
        label: "Quiz titel en beschrijving ingevuld", 
        valid: !!quizData.title && !!quizData.description 
      },
      { 
        label: "Doelgroep en focus opties geconfigureerd", 
        valid: !!quizData.audienceType && !!quizData.targetAgeGroup 
      },
      { 
        label: `Minimaal ${quizData.creationType === 'adaptive' ? 15 : 3} vragen`,
        valid: quizData.creationType === 'adaptive' ? (quizData.questions?.length ?? 0) >= 15 : (quizData.questions?.length ?? 0) >= 3,
      },
      { 
        label: "Resultaat types en follow-up ingesteld", 
        valid: !!quizData.settings?.resultPresentation?.format 
      },
    ];

    if (quizData.settings?.contentModeration?.required) {
      checklistItems.push({ 
        label: "Content moderatie review pending", 
        valid: false, 
        isWarning: true 
      });
    }
    
    const finalReviewData = {
      "Doelgroep": quizData.targetAgeGroup ? `${quizData.targetAgeGroup} jaar` : 'N/A',
      "Focus": quizData.focusFlags?.filter(f => f !== 'general').map(f => f.replace('-friendly', '').replace('-focus', '').replace(/(^\w)/, c => c.toUpperCase())).join(' + ') || 'Algemeen',
      "Categorie": allCategories.find(c => c.id === quizData.mainCategory)?.title || quizData.mainCategory || 'N/A',
      "Toegang": quizData.settings?.accessibility?.accessLevel === 'free' ? 'Gratis voor alle gebruikers' : 'Alleen Premium',
      "Coach Matching": quizData.settings?.coachIntegration?.enabled ? 'Aan' : 'Uit',
    };
    
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-2">5. Preview & Publiceer</h2>
            <p className="text-muted-foreground mb-6">Controleer alle details en publiceer je quiz. Na publicatie kun je de quiz nog steeds aanpassen.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left side: Preview */}
                <div className="lg:col-span-3">
                    <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/>Live Quiz Preview</h3>
                    <div className="border bg-muted/20 p-2 rounded-lg">
                        <div className="flex justify-center mb-2">
                             <Button variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'} size="sm" onClick={() => setPreviewDevice('desktop')}>
                                <Monitor className="mr-2 h-4 w-4"/> Desktop
                             </Button>
                             <Button variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'} size="sm" onClick={() => setPreviewDevice('mobile')}>
                                 <Smartphone className="mr-2 h-4 w-4"/> Mobiel
                             </Button>
                             <Button variant={previewDevice === 'tablet' ? 'secondary' : 'ghost'} size="sm" onClick={() => setPreviewDevice('tablet')}>
                                <Tablet className="mr-2 h-4 w-4"/> Tablet
                             </Button>
                        </div>
                        <div className={cn("mx-auto transition-all duration-300", 
                            previewDevice === 'desktop' && 'w-full',
                            previewDevice === 'mobile' && 'w-[375px] h-[667px] border-8 border-slate-800 rounded-[40px] shadow-2xl',
                            previewDevice === 'tablet' && 'w-[768px]'
                        )}>
                            <Card className={cn(
                                "overflow-hidden",
                                previewDevice === 'mobile' ? 'rounded-[32px] h-full flex flex-col' : 'flex flex-col'
                            )}>
                                <div className="bg-gradient-to-br from-primary to-accent text-primary-foreground p-4 text-center">
                                    <h4 className="font-bold text-xl flex items-center justify-center gap-2">
                                        <Sparkles className="h-5 w-5"/> 
                                        {quizData.title || (quizData.creationType === 'adaptive' ? `Adaptieve Onboarding Quiz (${quizData.targetAgeGroup} jr)` : "Voorbeeld Titel")}
                                    </h4>
                                    <p className="text-xs opacity-90 mt-1">
                                      {quizData.description || (quizData.creationType === 'adaptive' ? `Een adaptieve quiz die zich aanpast aan de gebruiker om een eerste neurodiversiteitsprofiel op te stellen.` : "Een korte beschrijving van de quiz komt hier.")}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 justify-center mt-2 text-xs">
                                        {quizData.estimatedDuration && <Badge variant="secondary">🕒 {quizData.estimatedDuration}</Badge>}
                                        {quizData.targetAgeGroup && <Badge variant="secondary">👥 {quizData.targetAgeGroup} jaar</Badge>}
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 overflow-y-auto flex-grow">
                                    <div className="mb-4">
                                        <p className="font-semibold mb-2 flex items-center gap-2">
                                            <span className="text-primary">•</span> 
                                            {(quizData.questions && quizData.questions[0]?.text) || "Als je iets nieuws leert, vind je het dan fijn als iemand je stap voor stap uitlegt hoe het moet?"}
                                        </p>
                                        <RadioGroup className="space-y-2">
                                            <Label className="flex items-center gap-2 border p-3 rounded-md bg-white hover:bg-slate-100 cursor-pointer"><RadioGroupItem value="a" id="a"/> Ik ga naar een rustige plek om na te denken</Label>
                                            <Label className="flex items-center gap-2 border p-3 rounded-md bg-white hover:bg-slate-100 cursor-pointer"><RadioGroupItem value="b" id="b"/> Ik praat erover met iemand die ik vertrouw</Label>
                                            <Label className="flex items-center gap-2 border p-3 rounded-md bg-white hover:bg-slate-100 cursor-pointer"><RadioGroupItem value="c" id="c"/> Ik doe iets fysieks om de energie kwijt te raken</Label>
                                            <Label className="flex items-center gap-2 border p-3 rounded-md bg-white hover:bg-slate-100 cursor-pointer"><RadioGroupItem value="d" id="d"/> Ik wacht tot het gevoel vanzelf minder wordt</Label>
                                        </RadioGroup>
                                    </div>
                                    <div className="text-sm text-muted-foreground flex justify-between items-center p-3 border rounded-md bg-white">
                                        <span>Welke omgeving helpt jou het beste om je emoties te verwerken?</span>
                                        <ChevronDown className="h-5 w-5"/>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Right side: Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary"/>Publicatie Checklist</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                          {checklistItems.map(item => (
                            <div key={item.label} className="flex items-center text-sm">
                                {item.valid ? (
                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0"/>
                                ) : item.isWarning ? (
                                    <AlertCircle className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0"/>
                                ) : (
                                    <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground/50 flex-shrink-0"/>
                                )}
                                <span className={cn(
                                    item.isWarning && "text-orange-600", 
                                    !item.valid && !item.isWarning && "text-muted-foreground line-through"
                                )}>{item.label}</span>
                            </div>
                          ))}
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary"/>Voorspelde Performance</CardTitle></CardHeader>
                        <CardContent>
                            <Label className="text-xs text-muted-foreground">Verwachte Voltooiing</Label>
                            <div className="flex items-baseline gap-2 mb-1">
                               <span className="text-4xl font-bold text-primary">87%</span> 
                            </div>
                            <Progress value={87} className="h-2"/>
                            <p className="text-xs text-muted-foreground mt-1">Bovengemiddeld voor deze doelgroep</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5 text-primary"/>Launch Opties</CardTitle></CardHeader>
                        <CardContent>
                           <RadioGroup defaultValue="direct" className="space-y-2">
                              <Label className="flex items-center gap-2 border p-3 rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5 cursor-pointer">
                                <RadioGroupItem value="direct" id="direct" />
                                <div>
                                  <p className="font-medium">Direct Live</p>
                                  <p className="text-xs text-muted-foreground">Quiz wordt direct beschikbaar voor gebruikers.</p>
                                </div>
                              </Label>
                              <Label className="flex items-center gap-2 border p-3 rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/5 cursor-pointer">
                                <RadioGroupItem value="scheduled" id="scheduled"/>
                                <div>
                                  <p className="font-medium">Geplande Launch</p>
                                  <p className="text-xs text-muted-foreground">Kies wanneer de quiz live gaat.</p>
                                </div>
                              </Label>
                           </RadioGroup>
                           <Button onClick={handlePublish} className="w-full mt-4 bg-green-600 hover:bg-green-700">
                             <Rocket className="mr-2 h-4 w-4"/>Publiceer Quiz
                           </Button>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary"/>Finale Review</CardTitle></CardHeader>
                        <CardContent className="text-sm space-y-1">
                          {Object.entries(finalReviewData).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                                <span className="text-muted-foreground">{key}:</span>
                                <span className="font-medium text-right">{value}</span>
                            </div>
                          ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
