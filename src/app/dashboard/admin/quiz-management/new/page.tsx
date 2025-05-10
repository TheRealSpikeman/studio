// src/app/dashboard/admin/quiz-management/new/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PlusCircle, Trash2, ArrowLeft, Save, Eye, ListChecks, Settings, Info } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { QuizAudience, QuizCategory, QuizStatusAdmin } from '@/types/quiz-admin';

const audienceOptions: { id: QuizAudience; label: string }[] = [
  { id: '12-14', label: '12-14 jaar' },
  { id: '15-18', label: '15-18 jaar' },
  { id: 'adult', label: 'Volwassene' },
  { id: 'all', label: 'Algemeen (alle leeftijden)' },
];

const categoryOptions: { id: QuizCategory; label: string }[] = [
  { id: 'Basis', label: 'Basis Quiz' },
  { id: 'ADD', label: 'ADD Subtest' },
  { id: 'ADHD', label: 'ADHD Subtest' },
  { id: 'HSP', label: 'HSP Subtest' },
  { id: 'ASS', label: 'ASS Subtest' },
  { id: 'AngstDepressie', label: 'Angst/Depressie Subtest' },
  { id: 'Thema', label: 'Thematische Quiz (bijv. Examenvrees)' },
];

// Subtest IDs should align with QuizCategory values for subtests
const subtestProfileOptions = [
  { id: 'ADD', label: 'ADD Profiel' },
  { id: 'ADHD', label: 'ADHD Profiel' },
  { id: 'HSP', label: 'HSP Profiel' },
  { id: 'ASS', label: 'ASS Profiel' },
  { id: 'AngstDepressie', label: 'Angst/Depressie Profiel' },
];

const quizFormSchema = z.object({
  title: z.string().min(3, { message: "Titel moet minimaal 3 tekens bevatten." }),
  description: z.string().min(10, { message: "Beschrijving moet minimaal 10 tekens bevatten." }),
  audience: z.array(z.string()).min(1, { message: "Selecteer minimaal één doelgroep." }),
  category: z.string({ required_error: "Selecteer een categorie." }),
  status: z.enum(['concept', 'published'] as [QuizStatusAdmin, ...QuizStatusAdmin[]], { required_error: "Selecteer een status." }),
  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  thumbnailUrl: z.string().url({ message: "Ongeldige URL voor thumbnail." }).optional().or(z.literal('')),
  questions: z.array(
    z.object({
      text: z.string().min(5, { message: "Vraagtekst is te kort." }),
      example: z.string().optional(),
    })
  ).min(1, {message: "Voeg minimaal één vraag toe."}),
  subtestConfigs: z.array(
    z.object({
      subtestId: z.string({ required_error: "Selecteer een subtest profiel." }),
      threshold: z.coerce.number().min(0).max(4, {message: "Drempelwaarde tussen 0-4."}),
    })
  ).optional(),
});

type QuizFormData = z.infer<typeof quizFormSchema>;

// This page is used for both creating new and editing existing quizzes.
// If `quizData` prop is provided, it's in edit mode.
interface QuizFormPageProps {
  quizData?: QuizFormData & { id?: string }; // For editing
}

export default function NewQuizPage({ quizData }: QuizFormPageProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditMode = !!quizData?.id;

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: quizData || {
      title: "",
      description: "",
      audience: [],
      category: undefined,
      status: 'concept',
      slug: "",
      metaTitle: "",
      metaDescription: "",
      thumbnailUrl: "",
      questions: [{ text: "", example: "" }],
      subtestConfigs: [],
    },
  });

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const { fields: subtestConfigFields, append: appendSubtestConfig, remove: removeSubtestConfig } = useFieldArray({
    control: form.control,
    name: "subtestConfigs",
  });

  const onSubmit = (data: QuizFormData) => {
    // TODO: Implement actual save logic (create or update quiz)
    console.log("Quiz data submitted:", data);
    toast({
      title: isEditMode ? "Quiz Bijgewerkt" : "Quiz Aangemaakt",
      description: `De quiz "${data.title}" is ${isEditMode ? 'succesvol bijgewerkt' : 'aangemaakt'} (simulatie).`,
    });
    router.push('/dashboard/admin/quiz-management');
  };

  const currentCategory = form.watch("category");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <ListChecks className="h-8 w-8 text-primary" />
                {isEditMode ? 'Quiz Bewerken' : 'Nieuwe Quiz Toevoegen'}
            </h1>
            <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/admin/quiz-management">
                <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Overzicht
                </Link>
            </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary"/>Algemene Informatie</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Titel</FormLabel>
                  <FormControl><Input placeholder="Bijv. Basis Neuroprofiel (12-14 jr)" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Beschrijving</FormLabel>
                  <FormControl><Textarea placeholder="Korte omschrijving van de quiz en het doel..." {...field} rows={3} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="audience"
                render={() => (
                    <FormItem className="space-y-2">
                    <FormLabel>Doelgroep(en)</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                    {audienceOptions.map((item) => (
                        <FormField
                        key={item.id}
                        control={form.control}
                        name="audience"
                        render={({ field }) => {
                            return (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                                <FormLabel className="text-sm font-normal cursor-pointer">
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
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categorie</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecteer een categorie" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {categoryOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecteer status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="concept">Concept</SelectItem>
                      <SelectItem value="published">Gepubliceerd</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary"/>Vragen</CardTitle>
            <CardDescription>Voeg hier de vragen voor de quiz toe. Antwoordopties zijn standaard (Nooit, Soms, Vaak, Altijd).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {questionFields.map((field, index) => (
              <Card key={field.id} className="p-4 bg-muted/50">
                <FormLabel className="font-semibold">Vraag {index + 1}</FormLabel>
                <div className="grid grid-cols-1 gap-4 mt-2">
                  <FormField
                    control={form.control}
                    name={`questions.${index}.text`}
                    render={({ field: fld }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Vraagtekst</FormLabel>
                        <FormControl><Textarea placeholder="Typ hier de vraag..." {...fld} rows={2} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`questions.${index}.example`}
                    render={({ field: fld }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Voorbeeld/Toelichting (optioneel)</FormLabel>
                        <FormControl><Input placeholder="Bijv. 'Denk aan situaties op school of thuis.'" {...fld} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeQuestion(index)} className="mt-3">
                  <Trash2 className="mr-1 h-3 w-3" /> Vraag {index + 1} Verwijderen
                </Button>
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={() => appendQuestion({ text: "", example: "" })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Vraag Toevoegen
            </Button>
             {form.formState.errors.questions && typeof form.formState.errors.questions === 'object' && !Array.isArray(form.formState.errors.questions) && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.questions.message}</p>
            )}
          </CardContent>
        </Card>
        
        {currentCategory === 'Basis' && (
           <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary"/>Subtest Configuratie</CardTitle>
                <CardDescription>Voor Basis Quizzen: geef aan welke subtests getriggerd moeten worden en bij welke drempelwaarde (gemiddelde score op relevante basisvragen, schaal 1-4).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {subtestConfigFields.map((field, index) => (
                <Card key={field.id} className="p-4 bg-muted/50">
                    <FormLabel className="font-semibold">Subtest Trigger {index + 1}</FormLabel>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                    <FormField
                        control={form.control}
                        name={`subtestConfigs.${index}.subtestId`}
                        render={({ field: fld }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Profiel</FormLabel>
                            <Select onValueChange={fld.onChange} defaultValue={fld.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Kies profiel" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {subtestProfileOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`subtestConfigs.${index}.threshold`}
                        render={({ field: fld }) => (
                        <FormItem>
                            <FormLabel className="text-xs">Drempelwaarde (0-4)</FormLabel>
                            <FormControl><Input type="number" step="0.1" min="0" max="4" placeholder="Bijv. 2.5" {...fld} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeSubtestConfig(index)} className="mt-3">
                    <Trash2 className="mr-1 h-3 w-3" /> Trigger {index + 1} Verwijderen
                    </Button>
                </Card>
                ))}
                <Button type="button" variant="outline" onClick={() => appendSubtestConfig({ subtestId: "", threshold: 2.5 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Subtest Trigger Toevoegen
                </Button>
            </CardContent>
            </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary"/>Meta & SEO (Optioneel)</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Slug (URL)</FormLabel><FormControl><Input placeholder="bijv. basis-neuroprofiel-12-14" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="metaTitle" render={({ field }) => (<FormItem><FormLabel>Meta Titel</FormLabel><FormControl><Input placeholder="Titel voor zoekmachines" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="metaDescription" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Meta Beschrijving</FormLabel><FormControl><Textarea placeholder="Korte beschrijving voor zoekmachines" {...field} rows={2} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="thumbnailUrl" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Thumbnail URL</FormLabel><FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t">
          <Button type="button" variant="outline" disabled>
            <Eye className="mr-2 h-4 w-4" /> Voorbeeld Bekijken (binnenkort)
          </Button>
          <Button type="submit" variant="secondary" onClick={() => {form.setValue("status", "concept"); form.handleSubmit(onSubmit)()}}>
            <Save className="mr-2 h-4 w-4" /> Opslaan als Concept
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" /> {isEditMode ? 'Quiz Bijwerken' : 'Publiceren'}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
