// src/components/admin/quiz-management/QuizEditForm.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2, ArrowLeft, Save, Brain, HelpCircle, FileText, Bot, ImageUp, Search, Settings, Download, Info, BarChart3, Star } from '@/lib/icons';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import type { QuizAudience, QuizCategory, QuizStatusAdmin, AnalysisDetailLevel, QuizAdmin } from '@/types/quiz-admin';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY, type SubscriptionPlan } from '@/types/subscription';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle as AlertTitleUi } from "@/components/ui/alert";
import { ImageUploader } from '@/components/common/ImageUploader';
import { audienceOptions, categoryOptions } from '@/types/quiz-admin';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const quizFormSchema = z.object({
  title: z.string().min(5, "Titel moet minimaal 5 tekens bevatten."),
  description: z.string().min(10, "Beschrijving moet minimaal 10 tekens bevatten."),
  audience: z.string({ required_error: "Selecteer een doelgroep." }),
  category: z.string({ required_error: "Selecteer een categorie." }).min(1, "Selecteer een categorie."),
  status: z.enum(['concept', 'published']),
  questions: z.array(z.object({
    text: z.string().min(5, "Vraagtekst is te kort."),
    example: z.string().optional(),
    weight: z.coerce.number().min(0).max(5).optional(),
  })).min(1, "Voeg minimaal één vraag toe."),
  subtestConfigs: z.array(z.object({
    subtestId: z.string().min(1, "Subtest ID is verplicht."),
    threshold: z.coerce.number().min(0).max(4, "Drempelwaarde moet tussen 0 en 4 zijn."),
  })).optional(),
  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  thumbnailUrl: z.string().url("Ongeldige URL.").optional().or(z.literal('')),
  settings: z.object({
    accessibility: z.object({
      isPublic: z.boolean().optional(),
      allowedPlans: z.array(z.string()).optional(),
    }).optional(),
    showRecommendedTools: z.boolean().optional(),
    analysisDetailLevel: z.enum(['beknopt', 'standaard', 'uitgebreid']).optional(),
    analysisInstructions: z.string().optional(),
    resultPresentation: z.object({
        showToParent: z.boolean().optional(),
        format: z.enum(['visual_report', 'text_summary', 'score_only']).optional(),
        showChart: z.boolean().optional(),
        showParentalCta: z.boolean().optional(),
    }).optional(),
  }).optional(),
});

export type QuizFormData = z.infer<typeof quizFormSchema>;

interface QuizEditFormProps {
  quizData: QuizAdmin;
  onSave: (data: QuizAdmin) => void;
}

export function QuizEditForm({ quizData, onSave }: QuizEditFormProps) {
  const [allSubscriptionPlans, setAllSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const { toast } = useToast();
  
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: "",
      description: "",
      audience: undefined,
      category: "",
      status: "concept",
      questions: [],
      subtestConfigs: [],
      slug: "",
      metaTitle: "",
      metaDescription: "",
      thumbnailUrl: "",
      settings: {
        accessibility: { isPublic: false, allowedPlans: [] },
        showRecommendedTools: true,
        analysisDetailLevel: 'standaard',
        analysisInstructions: "",
        resultPresentation: {
          showToParent: true,
          format: 'visual_report',
          showChart: true,
          showParentalCta: false,
        }
      }
    }
  });
  
  const watchedIsPublic = form.watch('settings.accessibility.isPublic');
  const watchedAudience = form.watch('audience');
  const isParentAudienceSelected = typeof watchedAudience === 'string' && watchedAudience.toLowerCase().includes('ouder');

  useEffect(() => {
    const storedPlansRaw = localStorage.getItem(LOCAL_STORAGE_SUBSCRIPTION_PLANS_KEY);
    if (storedPlansRaw) {
    }
    
    if (quizData) {
        form.reset({
          title: quizData.title || '',
          description: quizData.description || '',
          audience: quizData.audience,
          category: quizData.category || '',
          status: quizData.status || 'concept',
          questions: (quizData.questions || []).map(q => ({...q, text: q.text || "", example: q.example || "", weight: q.weight ?? 1})),
          slug: quizData.slug || '',
          metaTitle: quizData.metaTitle || '',
          metaDescription: quizData.metaDescription || '',
          thumbnailUrl: quizData.thumbnailUrl || '',
          settings: {
            accessibility: {
              isPublic: quizData.settings?.accessibility?.isPublic ?? false,
              allowedPlans: quizData.settings?.accessibility?.allowedPlans ?? []
            },
            showRecommendedTools: quizData.settings?.showRecommendedTools ?? true,
            analysisDetailLevel: quizData.settings?.analysisDetailLevel ?? 'standaard',
            analysisInstructions: quizData.settings?.analysisInstructions ?? '',
            resultPresentation: {
                showToParent: quizData.settings?.resultPresentation?.showToParent ?? true,
                format: quizData.settings?.resultPresentation?.format ?? 'visual_report',
                showChart: quizData.settings?.resultPresentation?.showChart ?? true,
                showParentalCta: quizData.settings?.resultPresentation?.showParentalCta ?? false,
            }
          },
          subtestConfigs: quizData.subtestConfigs || [],
        });
    }
  }, [quizData, form]);

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "questions" });
  const { fields: subtestFields, append: appendSubtest, remove: removeSubtest } = useFieldArray({ control: form.control, name: "subtestConfigs" });

  const onSubmit = (data: QuizFormData) => {
    const updatedQuiz: QuizAdmin = {
      ...quizData,
      ...data,
      audience: data.audience as QuizAdmin['audience'],
      category: data.category as QuizAdmin['category'],
      lastUpdatedAt: new Date().toISOString(),
      settings: {
        ...quizData.settings,
        ...data.settings,
        accessibility: {
          isPublic: data.settings?.accessibility?.isPublic ?? false,
          allowedPlans: data.settings?.accessibility?.allowedPlans ?? []
        },
        resultPresentation: {
          showToParent: data.settings?.resultPresentation?.showToParent ?? true,
          format: data.settings?.resultPresentation?.format ?? 'visual_report',
          showChart: data.settings?.resultPresentation?.showChart ?? true,
          showParentalCta: data.settings?.resultPresentation?.showParentalCta ?? false,
        }
      }
    };
    onSave(updatedQuiz);
  };
  
  const handleDownloadCsv = () => {
    if (!quizData) return;
    const headers = ['quiz_id', 'quiz_title', 'quiz_description', 'audience', 'category', 'status', 'slug', 'question_number', 'question_id', 'question_text', 'question_example', 'question_weight'];
    const escapeCsvField = (field: any): string => {
      if (field === null || field === undefined) return '""';
      const stringField = String(field);
      if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        const escapedString = stringField.replace(/"/g, '""');
        return `"${escapedString}"`;
      }
      return `"${stringField}"`;
    };
    const csvRows = quizData.questions.map((question, index) => {
      const rowData = [quizData.id, quizData.title, quizData.description, Array.isArray(quizData.audience) ? quizData.audience.join('; ') : quizData.audience, quizData.category, quizData.status, quizData.slug || '', index + 1, question.id || `q_${index + 1}`, question.text, question.example || '', question.weight || 1];
      return rowData.map(escapeCsvField).join(',');
    });
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) URL.revokeObjectURL(link.href);
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${quizData.slug || 'quiz-export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download Gestart", description: `De data voor "${quizData.title}" wordt gedownload als CSV.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <FileText className="h-8 w-8 text-primary" />
                Quiz Bewerken
            </h1>
            <p className="text-muted-foreground">Pas hier de details van de quiz aan.</p>
        </div>
        <Button variant="outline" asChild>
            <Link href="/dashboard/admin/quiz-management">
                <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Overzicht
            </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Accordion type="multiple" className="w-full space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline">Algemene Informatie</AccordionTrigger>
                <AccordionContent className="p-4 border-t space-y-4">
                 <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Quiz Titel</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Omschrijving</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                 
                <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Doelgroep</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-1 md:grid-cols-2 gap-2"
                        >
                          {audienceOptions.map((item) => (
                            <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={item.id} id={`audience-edit-${item.id}`}/>
                              </FormControl>
                              <FormLabel htmlFor={`audience-edit-${item.id}`} className="font-normal cursor-pointer flex-1">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Categorie</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecteer een categorie" /></SelectTrigger></FormControl><SelectContent>{categoryOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="concept">Concept</SelectItem><SelectItem value="published">Gepubliceerd</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline">Vragen</AccordionTrigger>
                <AccordionContent className="p-4 border-t space-y-4">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="p-4 bg-muted/50">
                            <Label>Vraag {index + 1}</Label>
                            <FormField control={form.control} name={`questions.${index}.text`} render={({ field }) => (<FormItem className="mt-1"><FormControl><Textarea placeholder="Vraagtekst" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name={`questions.${index}.example`} render={({ field }) => (<FormItem className="mt-2"><FormControl><Input placeholder="Optioneel voorbeeld" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name={`questions.${index}.weight`} render={({ field }) => (<FormItem className="mt-2"><FormLabel className="text-xs">Weging (1-5)</FormLabel><FormControl><Input type="number" min="0" max="5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} className="mt-2"><Trash2 className="h-4 w-4 mr-1" /> Verwijder Vraag</Button>
                        </Card>
                    ))}
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => append({ text: '', example: '', weight: 1 })}><PlusCircle className="h-4 w-4 mr-2"/> Vraag Toevoegen</Button>
                    </div>
                </AccordionContent>
            </AccordionItem>
            
             <AccordionItem value="item-settings" className="border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline">Instellingen</AccordionTrigger>
                <AccordionContent className="p-4 border-t space-y-6">
                     <Card className="bg-muted/50">
                        <CardHeader><CardTitle className="text-base">Resultaat & Follow-up</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="settings.resultPresentation.format"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Resultaat Presentatie</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="visual_report">Visueel rapport met tips (standaard)</SelectItem>
                                                <SelectItem value="text_summary">Alleen tekst samenvatting</SelectItem>
                                                <SelectItem value="score_only">Alleen scores</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {!isParentAudienceSelected && (
                              <FormField control={form.control} name="settings.resultPresentation.showToParent" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 bg-background shadow-sm"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Toon resultaten aan ouder</FormLabel><FormDescription>Indien aangevinkt, kunnen ouders (met toestemming van kind) de resultaten inzien.</FormDescription></div></FormItem>)} />
                            )}
                            
                            <FormField
                                control={form.control}
                                name="settings.resultPresentation.showChart"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-background">
                                        <div className="space-y-0.5">
                                            <FormLabel>Toon visuele grafiek</FormLabel>
                                            <FormDescription className="text-xs">Toont een spinnenweb-grafiek (bij 3+ scores) of een schaal (bij 1-2 scores).</FormDescription>
                                        </div>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )}
                            />
                            {isParentAudienceSelected && (
                                <FormField
                                    control={form.control}
                                    name="settings.resultPresentation.showParentalCta"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-background">
                                            <div className="space-y-0.5">
                                                <FormLabel className="flex items-center gap-2">
                                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-400"/>
                                                    Toon 'Gezins Gids' Promotie
                                                </FormLabel>
                                                <FormDescription>Voeg een sales pitch toe aan het rapport voor ouders.</FormDescription>
                                            </div>
                                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                        </FormItem>
                                    )}
                                />
                            )}
                             <FormField control={form.control} name="settings.showRecommendedTools" render={({ field }) => ( <FormItem className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-background"> <div className="space-y-0.5"><FormLabel>Toon Aanbevolen Tools</FormLabel><FormDescription>Toon een sectie met aanbevolen tools na het voltooien van deze quiz.</FormDescription></div> <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl> </FormItem> )}/>

                        </CardContent>
                     </Card>
                     
                    <Card className="bg-muted/50"><CardHeader><CardTitle className="text-base">Quiz Toegankelijkheid</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                           <FormField control={form.control} name="settings.accessibility.isPublic" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-3 bg-background"><div className="space-y-0.5"><Label htmlFor="isPublicSwitchEdit" className="font-semibold cursor-pointer">Publiek Toegankelijk (voor Blog/Anoniem)</Label><p className="text-xs text-muted-foreground">Indien ingeschakeld, is deze quiz voor iedereen toegankelijk, ongeacht abonnement.</p></div><FormControl><Switch id="isPublicSwitchEdit" checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                            <Separator/>
                            <div className={cn("space-y-2 transition-opacity", watchedIsPublic && "opacity-50 pointer-events-none")}>
                                <Label className={cn(!watchedIsPublic && "text-foreground")}>Selecteer welke abonnementen toegang hebben (als niet publiek):</Label>
                                <FormField
                                    control={form.control}
                                    name="settings.accessibility.allowedPlans"
                                    render={() => (
                                        <FormItem>
                                            {allSubscriptionPlans.length > 0 ? (
                                                allSubscriptionPlans.map(plan => (
                                                    <FormField
                                                        key={plan.id}
                                                        control={form.control}
                                                        name="settings.accessibility.allowedPlans"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-row items-center space-x-2">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(plan.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            const currentPlans = field.value || [];
                                                                            return checked
                                                                                ? field.onChange([...currentPlans, plan.id])
                                                                                : field.onChange(currentPlans.filter(value => value !== plan.id));
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-sm font-normal">{plan.name}</FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))
                                            ) : (
                                                <p className="text-xs text-muted-foreground">Geen actieve abonnementen gevonden. Configureer deze eerst in Abonnementenbeheer.</p>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-base">AI Analyse Instellingen</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="settings.analysisDetailLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Detailniveau AI Analyse</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecteer detailniveau" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="beknopt">Beknopt</SelectItem>
                                  <SelectItem value="standaard">Standaard</SelectItem>
                                  <SelectItem value="uitgebreid">Uitgebreid</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription className="text-xs">
                                Stelt in hoe diepgaand het AI-rapport is. Beknopt is een korte samenvatting, Standaard is gebalanceerd, en Uitgebreid geeft een diepe analyse met meer voorbeelden.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="settings.analysisInstructions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Extra Instructies voor AI (optioneel)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Bijv. 'Focus op concrete tips voor op school'..." {...field} />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Geef de AI specifieke instructies om het rapport nog relevanter te maken. De AI zal proberen deze instructies mee te nemen in de analyse.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline">Publicatie Instellingen</AccordionTrigger>
                <AccordionContent className="p-4 border-t space-y-4">
                    <FormField control={form.control} name="slug" render={({ field }) => (<FormItem><FormLabel>URL Slug</FormLabel><FormControl><Input placeholder="bijv. basis-zelfreflectie-15-18" {...field} /></FormControl><FormDescription className="text-xs">De unieke naam in de URL, bijv. /quiz/[slug].</FormDescription><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="metaTitle" render={({ field }) => (<FormItem><FormLabel>Paginatitel (voor browser tab)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="metaDescription" render={({ field }) => (<FormItem><FormLabel>Korte omschrijving (voor zoekmachines/delen)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline">Quiz Afbeelding</AccordionTrigger>
                <AccordionContent className="p-4 border-t space-y-4">
                    <FormField
                      control={form.control}
                      name="thumbnailUrl"
                      render={({ field }) => (
                        <FormItem>
                          <ImageUploader
                            onUploadComplete={(url) => field.onChange(url)}
                            initialImageUrl={field.value}
                            uploadPath="images/quizzes"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-download" className="border rounded-lg bg-card shadow-sm">
              <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline">Download Quiz Data</AccordionTrigger>
              <AccordionContent className="p-4 border-t space-y-4">
                  <p className="text-sm text-muted-foreground">
                      Download alle quizdata, inclusief metadata en alle vragen, als een CSV-bestand. Dit bestand kan eenvoudig worden geopend in Excel, Google Sheets of andere spreadsheet-software voor verdere analyse.
                  </p>
                  <Button type="button" variant="outline" onClick={handleDownloadCsv}>
                      <Download className="mr-2 h-4 w-4" /> Download als CSV
                  </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Wijzigingen Opslaan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
