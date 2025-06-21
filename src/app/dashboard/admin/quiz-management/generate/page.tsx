// src/app/dashboard/admin/quiz-management/generate/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateAiQuiz } from '@/ai/flows/generate-ai-quiz-flow'; 
import type { QuizAdmin, QuizAudience, QuizCategory, AnalysisDetailLevel } from '@/types/quiz-admin';
import { ArrowLeft, Bot, Loader2, Wand2, ListChecks, Settings, Info, ImageUp } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const audienceOptions: { id: QuizAudience; label: string }[] = [
  { id: 'Tiener (12-14 jr, voor zichzelf)', label: 'Tiener (12-14 jr, voor zichzelf)' },
  { id: 'Tiener (15-18 jr, voor zichzelf)', label: 'Tiener (15-18 jr, voor zichzelf)' },
  { id: 'Volwassene (18+, voor zichzelf)', label: 'Volwassene (18+, voor zichzelf)' },
  { id: 'Algemeen (alle leeftijden, voor zichzelf)', label: 'Algemeen (alle leeftijden, voor zichzelf)' },
  { id: 'Ouder (over kind 6-11 jr)', label: 'Ouder (over kind 6-11 jr)' },
  { id: 'Ouder (over kind 12-14 jr)', label: 'Ouder (over kind 12-14 jr)' },
  { id: 'Ouder (over kind 15-18 jr)', label: 'Ouder (over kind 15-18 jr)' },
];

const categoryOptions: { id: QuizCategory; label: string }[] = [
  { id: 'Basis', label: 'Basis Zelfreflectie (Kind/Tiener)' },
  { id: 'Thema', label: 'Thematische Quiz (Kind/Tiener)' },
  { id: 'Ouder Observatie', label: 'Ouder Observatie (Ken je Kind)' },
  { id: 'ADD', label: 'Subtest: ADD Kenmerken' },
  { id: 'ADHD', label: 'Subtest: ADHD Kenmerken' },
  { id: 'HSP', label: 'Subtest: HSP Kenmerken' },
  { id: 'ASS', label: 'Subtest: ASS Kenmerken' },
  { id: 'AngstDepressie', label: 'Subtest: Angst/Depressie Kenmerken' },
];

const numQuestionsOptions = [
  { id: 5, label: '5 vragen' },
  { id: 10, label: '10 vragen' },
  { id: 15, label: '15 vragen' },
  { id: 20, label: '20 vragen' },
];

const difficultyOptions = [
    { id: 'laag', label: 'Laag' },
    { id: 'gemiddeld', label: 'Gemiddeld' },
    { id: 'hoog', label: 'Hoog' },
];

const quizPurposeOptions: { id: 'onboarding' | 'deep_dive' | 'reflection' | 'goal_setting' | 'general'; label: string }[] = [
    { id: 'general', label: 'Algemeen (standaard)' },
    { id: 'onboarding', label: 'Onboarding (eerste kennismaking)' },
    { id: 'deep_dive', label: 'Verdieping (na basis quiz)' },
    { id: 'reflection', label: 'Reflectie (periodieke check-in)' },
    { id: 'goal_setting', label: 'Doelen Stellen (actiegericht)' },
];

const analysisDetailOptions: { id: AnalysisDetailLevel; label: string }[] = [
    { id: 'beknopt', label: 'Beknopt (korte samenvatting)' },
    { id: 'standaard', label: 'Standaard (aanbevolen)' },
    { id: 'uitgebreid', label: 'Uitgebreid (diepgaande analyse)' },
];

const aiQuizFormSchema = z.object({
  title: z.string().min(3, { message: "Titel moet minimaal 3 tekens bevatten." }),
  description: z.string().optional(),
  audience: z.string({ required_error: "Selecteer een doelgroep." }) as z.ZodType<QuizAudience>,
  category: z.string({ required_error: "Selecteer een domein/categorie." }) as z.ZodType<QuizCategory>,
  numQuestions: z.coerce.number().min(1, { message: "Selecteer het aantal vragen." }),
  difficulty: z.string({ required_error: "Selecteer een moeilijkheidsgraad."}),
  quizPurpose: z.enum(['onboarding', 'deep_dive', 'reflection', 'goal_setting', 'general']).optional(),
  analysisDetailLevel: z.enum(['beknopt', 'standaard', 'uitgebreid'] as [AnalysisDetailLevel, ...AnalysisDetailLevel[]]).optional(),
  analysisInstructions: z.string().optional(),
});
type AiQuizFormData = z.infer<typeof aiQuizFormSchema>;

export default function GenerateAiQuizPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);

    const form = useForm<AiQuizFormData>({
        resolver: zodResolver(aiQuizFormSchema),
        defaultValues: {
          title: "",
          description: "",
          audience: undefined,
          category: undefined,
          numQuestions: 10,
          difficulty: "gemiddeld",
          quizPurpose: "general",
          analysisDetailLevel: 'standaard',
          analysisInstructions: '',
        },
    });

    const handleGenerate = async (data: AiQuizFormData) => {
        setIsGenerating(true);
        toast({ title: "Quiz genereren met AI...", description: `Onderwerp: ${data.title}. Een ogenblik geduld.` });
        
        try {
          const { title, description, audience, category, numQuestions, difficulty, quizPurpose, analysisDetailLevel, analysisInstructions } = data;

          const aiInputForGeneration = {
            topic: title,
            audience,
            category,
            numQuestions,
            difficulty,
            quizPurpose,
          };
          
          const aiResult = await generateAiQuiz(aiInputForGeneration);
    
          if (!aiResult || !aiResult.questions || aiResult.questions.length === 0) throw new Error("AI heeft geen vragen geretourneerd.");
          
          const newQuiz: QuizAdmin = {
            id: `ai-${Date.now()}`,
            title: `${title} (AI gegenereerd)`,
            description: description || `AI gegenereerde quiz over ${title} voor ${audience}. Pas de titel en beschrijving eventueel aan.`,
            audience: [audience],
            category: category,
            status: 'concept',
            questions: aiResult.questions.map((q, i) => ({ id: `q-ai-${i}`, text: q.text, example: q.example, weight: q.weight ?? 1 })),
            lastUpdatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            slug: `ai-${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-5)}`,
            analysisDetailLevel: analysisDetailLevel,
            analysisInstructions: analysisInstructions,
          };

          localStorage.setItem(`ai-quiz-${newQuiz.id}`, JSON.stringify(newQuiz));
          
          toast({ title: "AI Quiz gegenereerd!", description: `De quiz "${newQuiz.title}" is aangemaakt als concept. U kunt deze nu bewerken.`, variant: "default" });
          router.push(`/dashboard/admin/quiz-management/edit/${newQuiz.id}`);
    
        } catch (error) {
          console.error("Error generating AI quiz:", error);
          toast({ title: "Fout bij AI Quiz Generatie", description: (error as Error).message || "Er is iets misgegaan. Probeer het later opnieuw.", variant: "destructive" });
        } finally {
          setIsGenerating(false);
        }
    };
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                    <Bot className="h-8 w-8 text-primary" />
                    Quiz Genereren (AI)
                </h1>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/admin/quiz-management/new">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar opties
                    </Link>
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-8">
                  <Accordion type="multiple" className="w-full space-y-4">
                    <AccordionItem value="item-1" className="border rounded-lg shadow-sm bg-card">
                      <AccordionTrigger className="p-6 hover:no-underline text-lg font-semibold">
                          <div className="flex items-center gap-3"><Info className="h-5 w-5 text-primary"/>Algemene Informatie & Generatie-instructies</div>
                      </AccordionTrigger>
                      <AccordionContent className="p-6 pt-0 space-y-6">
                        <p className="text-sm text-muted-foreground pt-4">Geef de AI instructies om een nieuwe quiz te genereren. Na generatie wordt de quiz als concept opgeslagen en kunt u deze direct bewerken.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Quiz Titel (wordt onderwerp voor AI)</FormLabel><FormControl><Input placeholder="Bijv. Sociale Vaardigheden, Examenvrees, Faalangst" {...field} /></FormControl><FormMessage /></FormItem>)} />
                           <FormField control={form.control} name="description" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Beschrijving (voor na generatie)</FormLabel><FormControl><Textarea placeholder="Korte omschrijving van de quiz en het doel..." {...field} rows={2} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="audience" render={({ field }) => (<FormItem><FormLabel>Doelgroep</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Kies doelgroep" /></SelectTrigger></FormControl><SelectContent>{audienceOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Categorie</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Kies domein" /></SelectTrigger></FormControl><SelectContent>{categoryOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Input value="Concept (automatisch)" disabled />
                            <FormDescription className="text-xs">AI-gegenereerde quizzen worden altijd als concept opgeslagen voor review.</FormDescription>
                          </FormItem>
                        </div>

                        <Separator className="my-6" />
                        
                        <h3 className="text-md font-semibold text-foreground">Generatie-instructies</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField control={form.control} name="numQuestions" render={({ field }) => (<FormItem><FormLabel>Aantal Vragen</FormLabel><Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={String(field.value)}><FormControl><SelectTrigger><SelectValue placeholder="Kies aantal" /></SelectTrigger></FormControl><SelectContent>{numQuestionsOptions.map(opt => <SelectItem key={opt.id} value={String(opt.id)}>{opt.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="difficulty" render={({ field }) => (<FormItem><FormLabel>Moeilijkheid / Weging</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Kies moeilijkheid" /></SelectTrigger></FormControl><SelectContent>{difficultyOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}</SelectContent></Select><FormDescription className="text-xs">Beïnvloedt de weging van de vragen.</FormDescription><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name="quizPurpose" render={({ field }) => (<FormItem><FormLabel>Quiz Doel</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value || 'general'}><FormControl><SelectTrigger><SelectValue placeholder="Kies doel/moment" /></SelectTrigger></FormControl><SelectContent>{quizPurposeOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}</SelectContent></Select><FormDescription className="text-xs">Geeft AI extra context.</FormDescription><FormMessage /></FormItem>)} />
                        </div>

                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2" className="border rounded-lg shadow-sm bg-card">
                       <AccordionTrigger className="p-6 hover:no-underline text-lg font-semibold">
                          <div className="flex items-center gap-3"><Settings className="h-5 w-5 text-primary"/>AI Analyse Instellingen (Optioneel)</div>
                      </AccordionTrigger>
                      <AccordionContent className="p-6 pt-0 space-y-4">
                        <p className="text-sm text-muted-foreground pt-4">Configureer hier hoe de AI de resultaten van de gegenereerde quiz moet analyseren voor de gebruiker.</p>
                        <FormField
                        control={form.control}
                        name="analysisDetailLevel"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Detailniveau AI Analyse</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || 'standaard'}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecteer detailniveau" /></SelectTrigger></FormControl>
                                <SelectContent>
                                {analysisDetailOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormDescription>Kies hoe uitgebreid de AI-analyse moet zijn.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="analysisInstructions"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Specifieke AI Analyse Instructies</FormLabel>
                            <FormControl><Textarea placeholder="Bijv. 'Focus in de analyse extra op de impact van sociale situaties.' of 'Gebruik een zeer bemoedigende toon.' Laat leeg voor standaard instructies." {...field} rows={4} /></FormControl>
                            <FormDescription>Geef hier extra context of focuspunten mee voor de AI bij het genereren van de analyse.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-afbeelding" disabled className="border rounded-lg shadow-sm bg-card opacity-60">
                        <AccordionTrigger className="p-6 hover:no-underline text-lg font-semibold cursor-not-allowed" disabled>
                            <div className="flex items-center gap-3"><ImageUp className="h-5 w-5 text-primary"/>Quiz Afbeelding (beschikbaar na generatie)</div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="px-6 pb-6 text-sm text-muted-foreground pt-4">U kunt een afbeelding toevoegen op de bewerkpagina nadat de quiz is gegenereerd.</p>
                        </AccordionContent>
                    </AccordionItem>

                     <AccordionItem value="item-publicatie" disabled className="border rounded-lg shadow-sm bg-card opacity-60">
                        <AccordionTrigger className="p-6 hover:no-underline text-lg font-semibold cursor-not-allowed" disabled>
                            <div className="flex items-center gap-3"><Settings className="h-5 w-5 text-primary"/>Publicatie Instellingen (beschikbaar na generatie)</div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <p className="px-6 pb-6 text-sm text-muted-foreground pt-4">URL (slug), Meta Titel en andere publicatie-opties kunt u instellen op de bewerkpagina.</p>
                        </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="flex justify-start pt-4 border-t">
                      <Button type="submit" disabled={isGenerating} size="lg">
                          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                          {isGenerating ? "Bezig met genereren..." : "Genereer Quiz & Bewerk"}
                      </Button>
                  </div>
                </form>
            </Form>
        </div>
    );
}
