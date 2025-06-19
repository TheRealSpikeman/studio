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
import { PlusCircle, Trash2, ArrowLeft, Save, Eye, ListChecks, Settings, Info, Weight, ImageUp, BotIcon } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { QuizAudience, QuizCategory, QuizStatusAdmin, AnalysisDetailLevel } from '@/types/quiz-admin';
import React from "react"; // Import React for useRef

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

// Subtest IDs should align with QuizCategory values for subtests
const subtestProfileOptions = [
  { id: 'ADD', label: 'ADD Profiel' },
  { id: 'ADHD', label: 'ADHD Profiel' },
  { id: 'HSP', label: 'HSP Profiel' },
  { id: 'ASS', label: 'ASS Profiel' },
  { id: 'AngstDepressie', label: 'Angst/Depressie Profiel' },
];

const analysisDetailOptions: { id: AnalysisDetailLevel; label: string }[] = [
    { id: 'beknopt', label: 'Beknopt (korte samenvatting)' },
    { id: 'standaard', label: 'Standaard (aanbevolen)' },
    { id: 'uitgebreid', label: 'Uitgebreid (diepgaande analyse)' },
];

const quizFormSchema = z.object({
  title: z.string().min(3, { message: "Titel moet minimaal 3 tekens bevatten." }),
  description: z.string().min(10, { message: "Beschrijving moet minimaal 10 tekens bevatten." }),
  audience: z.array(z.string() as z.ZodType<QuizAudience[]>).min(1, { message: "Selecteer minimaal één doelgroep." }),
  category: z.string({ required_error: "Selecteer een categorie." }) as z.ZodType<QuizCategory>,
  status: z.enum(['concept', 'published'] as [QuizStatusAdmin, ...QuizStatusAdmin[]], { required_error: "Selecteer een status." }),
  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  thumbnailUrl: z.string().url({ message: "Ongeldige URL voor thumbnail." }).optional().or(z.literal('')),
  uploadedImage: z.any().optional(), // For file upload
  questions: z.array(
    z.object({
      text: z.string().min(5, { message: "Vraagtekst is te kort." }),
      example: z.string().optional(),
      weight: z.coerce.number().min(1, {message: "Gewicht moet minimaal 1 zijn."}).max(5, {message: "Gewicht mag maximaal 5 zijn."}).optional(),
    })
  ).min(1, {message: "Voeg minimaal één vraag toe."}),
  subtestConfigs: z.array(
    z.object({
      subtestId: z.string({ required_error: "Selecteer een subtest profiel." }),
      threshold: z.coerce.number().min(0).max(4, {message: "Drempelwaarde tussen 0-4."}),
    })
  ).optional(),
  analysisDetailLevel: z.enum(['beknopt', 'standaard', 'uitgebreid'] as [AnalysisDetailLevel, ...AnalysisDetailLevel[]]).optional(),
  analysisInstructions: z.string().optional(),
});

export type QuizFormData = z.infer<typeof quizFormSchema>; // Exporting for EditQuizPage

interface QuizFormPageProps {
  quizData?: QuizFormData & { id?: string }; 
}

export default function NewQuizPage({ quizData }: QuizFormPageProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditMode = !!quizData?.id;
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(quizData?.thumbnailUrl || null);

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: quizData ? {
        ...quizData,
        questions: quizData.questions.map(q => ({ ...q, weight: q.weight ?? 1})), 
        subtestConfigs: quizData.subtestConfigs || [], 
        analysisDetailLevel: quizData.analysisDetailLevel || 'standaard',
        analysisInstructions: quizData.analysisInstructions || '',
    } : {
      title: "",
      description: "",
      audience: [],
      category: undefined,
      status: 'concept',
      slug: "",
      metaTitle: "",
      metaDescription: "",
      thumbnailUrl: "",
      questions: [{ text: "", example: "", weight: 1 }],
      subtestConfigs: [],
      analysisDetailLevel: 'standaard',
      analysisInstructions: "",
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("uploadedImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue("thumbnailUrl", ""); // Clear URL if file is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: QuizFormData) => {
    let finalThumbnailUrl = data.thumbnailUrl;

    if (data.uploadedImage) {
      console.log("Simulating image upload for:", data.uploadedImage.name);
      if (imagePreview && !data.thumbnailUrl) {
         finalThumbnailUrl = imagePreview; 
      }
    }
    
    const saveData = { ...data, thumbnailUrl: finalThumbnailUrl };
    delete saveData.uploadedImage; 

    console.log("Quiz data submitted for saving:", saveData);

    let toastTitle = "";
    let toastDescriptionAction = "";

    if (isEditMode) {
      toastTitle = "Quiz Bijgewerkt";
      toastDescriptionAction = saveData.status === 'published' ? 'succesvol bijgewerkt en gepubliceerd' : 'succesvol bijgewerkt en opgeslagen als concept';
    } else {
      toastTitle = saveData.status === 'published' ? "Quiz Gepubliceerd" : "Quiz Opgeslagen als Concept";
      toastDescriptionAction = saveData.status === 'published' ? 'succesvol aangemaakt en gepubliceerd' : 'succesvol aangemaakt als concept';
    }
    
    if (quizData?.id?.startsWith('ai-') || (!isEditMode && data.title.toLowerCase().includes("ai gegenereerd"))) {
        const quizIdToUse = quizData?.id || `ai-${Date.now()}`;
        try {
            const quizForStorage = {
                ...quizData, 
                ...saveData, 
                id: quizIdToUse,
                lastUpdatedAt: new Date().toISOString(),
                createdAt: quizData?.createdAt || new Date().toISOString(),
                questions: saveData.questions.map(q => ({...q, weight: q.weight ?? 1})),
            };
            localStorage.setItem(`ai-quiz-${quizIdToUse}`, JSON.stringify(quizForStorage));
            console.log(`AI Quiz ${quizIdToUse} ${isEditMode ? 'updated' : 'saved'} in localStorage`);
        } catch (error) {
            console.error("Error saving/updating AI quiz in localStorage:", error);
        }
    }

    toast({
      title: toastTitle,
      description: `De quiz "${saveData.title}" is ${toastDescriptionAction} (simulatie).`,
    });
    router.push('/dashboard/admin/quiz-management');
  };

  const currentCategory = form.watch("category");
  const currentStatus = form.watch("status");

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                <CardTitle className="flex items-center gap-2"><ImageUp className="h-5 w-5 text-primary"/>Quiz Afbeelding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="thumbnailUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Thumbnail URL (optioneel)</FormLabel>
                            <FormControl><Input placeholder="https://example.com/image.jpg" {...field} onChange={(e) => { field.onChange(e); if (e.target.value) {setImagePreview(e.target.value); form.setValue("uploadedImage", null);}}} /></FormControl>
                            <FormDescription>Plak een URL of upload hieronder een afbeelding.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="uploadedImage"
                    render={({ field }) => ( 
                        <FormItem>
                            <FormLabel>Of upload een afbeelding</FormLabel>
                            <FormControl>
                                <Input 
                                    type="file" 
                                    accept="image/*" 
                                    ref={imageInputRef}
                                    onChange={handleImageChange}
                                    className="pt-1.5"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {imagePreview && (
                    <div className="mt-2">
                        <FormLabel>Voorbeeld:</FormLabel>
                        <img src={imagePreview} alt="Quiz thumbnail preview" className="mt-1 max-h-40 rounded-md border" />
                    </div>
                )}
            </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary"/>Vragen</CardTitle>
            <CardDescription>Voeg hier de vragen voor de quiz toe. Antwoordopties zijn standaard (Nooit, Soms, Vaak, Altijd). Stel een gewicht in voor de scoring.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {questionFields.map((field, index) => (
              <Card key={field.id} className="p-4 bg-muted/50">
                <FormLabel className="font-semibold">Vraag {index + 1}</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-2">
                  <FormField
                    control={form.control}
                    name={`questions.${index}.text`}
                    render={({ field: fld }) => (
                      <FormItem className="md:col-span-4">
                        <FormLabel className="text-xs">Vraagtekst</FormLabel>
                        <FormControl><Textarea placeholder="Typ hier de vraag..." {...fld} rows={2} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`questions.${index}.weight`}
                    render={({ field: fld }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel className="text-xs flex items-center gap-1"><Weight className="h-3 w-3"/>Gewicht</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="5" 
                            placeholder="1-5" 
                            {...fld}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`questions.${index}.example`}
                    render={({ field: fld }) => (
                      <FormItem className="md:col-span-6"> 
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
            <Button type="button" variant="outline" onClick={() => appendQuestion({ text: "", example: "", weight: 1 })}>
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
            <CardTitle className="flex items-center gap-2"><BotIcon className="h-5 w-5 text-primary"/>AI Analyse Instellingen (Optioneel)</CardTitle>
            <CardDescription>
              Configureer hier hoe de AI de resultaten van deze quiz moet analyseren voor de gebruiker. Deze instellingen worden gebruikt door de "generateQuizAnalysis" flow.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  <FormDescription>Geef hier extra context of focuspunten mee voor de AI bij het genereren van de analyse voor deze quiz. Als dit veld gevuld is, heeft het voorrang boven de standaard logica van het gekozen detailniveau.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary"/>Meta & SEO (Optioneel)</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Slug (URL)</FormLabel><FormControl><Input placeholder="bijv. basis-neuroprofiel-12-14" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="metaTitle" render={({ field }) => (<FormItem><FormLabel>Meta Titel</FormLabel><FormControl><Input placeholder="Titel voor zoekmachines" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="metaDescription" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Meta Beschrijving</FormLabel><FormControl><Textarea placeholder="Korte beschrijving voor zoekmachines" {...field} rows={2} /></FormControl><FormMessage /></FormItem>)} />
          </CardContent>
        </Card>

        <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t">
          <Button type="button" variant="outline" disabled>
            <Eye className="mr-2 h-4 w-4" /> Voorbeeld Bekijken (binnenkort)
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => {
              form.setValue("status", "concept"); 
              form.handleSubmit(onSubmit)();
            }}
            disabled={form.formState.isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" /> Opslaan als Concept
          </Button>
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
             onClick={() => {
                if (!isEditMode && form.getValues("status") !== "published") {
                    form.setValue("status", "published");
                }
            }}
          >
            <Save className="mr-2 h-4 w-4" /> 
            {isEditMode && currentStatus === 'published' ? 'Quiz Bijwerken & Publiceren' : 
             isEditMode && currentStatus === 'concept' ? 'Concept Bijwerken' :
             !isEditMode && form.getValues("status") === 'published' ? 'Publiceren' : 
             !isEditMode && form.getValues("status") === 'concept' ? 'Publiceren' : 
             'Publiceren'
            }
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

