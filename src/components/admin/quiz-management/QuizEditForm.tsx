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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2, ArrowLeft, Save, Brain, HelpCircle, FileText, Bot, ImageIcon, Search, Settings, Download } from 'lucide-react';
import Link from 'next/link';
import type { QuizAudience, QuizCategory, QuizStatusAdmin, AnalysisDetailLevel } from '@/types/quiz-admin';
import { Dialog, DialogContent, DialogDescription as DialogDesc, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { ImageUploader } from '@/components/common/ImageUploader';

// Re-defining options here for self-containment
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

const quizFormSchema = z.object({
  title: z.string().min(5, "Titel moet minimaal 5 tekens bevatten."),
  description: z.string().min(10, "Beschrijving moet minimaal 10 tekens bevatten."),
  audience: z.array(z.string()).min(1, "Selecteer minimaal één doelgroep."),
  category: z.string({ required_error: "Selecteer een categorie." }),
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
  analysisDetailLevel: z.enum(['beknopt', 'standaard', 'uitgebreid']).optional(),
  analysisInstructions: z.string().optional(),
  showRecommendedTools: z.boolean().optional(),
});

export type QuizFormData = z.infer<typeof quizFormSchema>;

interface QuizEditFormProps {
  quizData: QuizFormData & { id: string, createdAt?: string, slug?: string };
  onSave: (data: QuizFormData) => void;
}

export function QuizEditForm({ quizData, onSave }: QuizEditFormProps) {
  
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: quizData,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });
  
  const { fields: subtestFields, append: appendSubtest, remove: removeSubtest } = useFieldArray({
    control: form.control,
    name: "subtestConfigs",
  });

  useEffect(() => {
    form.reset(quizData);
  }, [quizData, form]);

  const onSubmit = (data: QuizFormData) => {
    onSave(data);
  };

  const handleDownloadJson = () => {
    const data = form.getValues();
    try {
      const quizJson = JSON.stringify(data, null, 2);
      const blob = new Blob([quizJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.slug || quizData.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export quiz:", error);
    }
  };
  
  const isAiGenerated = quizData.id.startsWith('ai-');

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
          <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full space-y-4">

            <AccordionItem value="item-1" className="border rounded-lg bg-card shadow-sm">
              <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline">Algemene Informatie</AccordionTrigger>
              <AccordionContent className="p-4 border-t space-y-4">
                 <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Quiz Titel</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Omschrijving</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField
                  control={form.control}
                  name="audience"
                  render={() => (
                    <FormItem>
                      <FormLabel>Doelgroep(en)</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {audienceOptions.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="audience"
                            render={({ field }) => {
                              return (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.id])
                                          : field.onChange(
                                              (field.value || []).filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
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

             <AccordionItem value="item-3" className="border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline">Subtest Configuratie</AccordionTrigger>
                <AccordionContent className="p-4 border-t space-y-4">
                     <p className="text-sm text-muted-foreground">Voeg hier de ID's van subtests (bijv. 'ADD') en de drempelwaarde van de hoofdquizscore toe om deze te triggeren.</p>
                     {subtestFields.map((field, index) => (
                        <Card key={field.id} className="p-4 bg-muted/50 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                            <FormField control={form.control} name={`subtestConfigs.${index}.subtestId`} render={({ field }) => (<FormItem><FormLabel>Subtest ID</FormLabel><FormControl><Input placeholder="bijv. ADD, HSP" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name={`subtestConfigs.${index}.threshold`} render={({ field }) => (<FormItem><FormLabel>Drempelwaarde (0-4)</FormLabel><FormControl><Input type="number" step="0.1" min="0" max="4" placeholder="bijv. 2.5" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <Button type="button" variant="destructive" size="sm" onClick={() => removeSubtest(index)} className="w-full md:w-auto"><Trash2 className="h-4 w-4 mr-1" /> Verwijder</Button>
                        </Card>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendSubtest({ subtestId: '', threshold: 2.5 })}><PlusCircle className="h-4 w-4 mr-2"/> Subtest Regel Toevoegen</Button>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline">Resultaatpagina Instellingen</AccordionTrigger>
                <AccordionContent className="p-4 border-t space-y-4">
                    <FormField
                        control={form.control}
                        name="showRecommendedTools"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel>Toon Aanbevolen Tools</FormLabel>
                                    <FormDescription>
                                        Toon een sectie met aanbevolen tools na het voltooien van deze quiz.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
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
                   <ImageUploader
                        uploadPath="images/quizzes/"
                        onUploadComplete={(url) => form.setValue('thumbnailUrl', url, { shouldValidate: true })}
                        initialImageUrl={quizData.thumbnailUrl}
                        label="Quiz Thumbnail"
                        description="Upload een afbeelding die de quiz representeert (bijv. 400x200 pixels)."
                   />
                   <FormField
                        control={form.control}
                        name="thumbnailUrl"
                        render={({ field }) => (
                            <FormItem className="hidden">
                                <FormControl>
                                    <Input {...field} readOnly value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6" className="border rounded-lg bg-card shadow-sm">
                <AccordionTrigger className="p-4 font-semibold text-lg hover:no-underline">AI Analyse Instellingen</AccordionTrigger>
                <AccordionContent className="p-4 border-t space-y-4">
                    <FormField control={form.control} name="analysisDetailLevel" render={({ field }) => (<FormItem><FormLabel>Detailniveau AI Analyse</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecteer detailniveau" /></SelectTrigger></FormControl><SelectContent><SelectItem value="beknopt">Beknopt</SelectItem><SelectItem value="standaard">Standaard</SelectItem><SelectItem value="uitgebreid">Uitgebreid</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="analysisInstructions" render={({ field }) => (<FormItem><FormLabel>Extra Instructies voor AI (optioneel)</FormLabel><FormControl><Textarea placeholder="Bijv. 'Focus op concrete tips voor op school' of 'Houd de toon extra luchtig'." {...field} /></FormControl><FormMessage /></FormItem>)} />
                </AccordionContent>
            </AccordionItem>

          </Accordion>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleDownloadJson}>
                <Download className="mr-2 h-4 w-4" /> Download JSON
            </Button>
            <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Wijzigingen Opslaan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
