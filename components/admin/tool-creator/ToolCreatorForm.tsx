
// src/components/admin/tool-creator/ToolCreatorForm.tsx
"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from 'react';

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, Bot, Loader2, Trash2, AlertTriangle, Wrench, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Tool } from '@/lib/quiz-data/tools-data';
import { allToolCategories, allToolIcons } from '@/lib/quiz-data/tools-data';
import { generateToolDetails } from '@/ai/flows/generate-tool-details-flow';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from '@/components/ui/switch';
import { createToolComponentFile, checkToolComponentExists } from '@/actions/toolActions';
import Link from 'next/link';
import { ToolPreviewer } from "./ToolPreviewer";

const toolFormSchema = z.object({
  id: z.string().min(3, "ID moet minimaal 3 tekens zijn.").regex(/^[a-z0-9-]+$/, "ID mag alleen kleine letters, cijfers en streepjes bevatten."),
  title: z.string().min(5, "Titel is te kort."),
  description: z.string().min(10, "Omschrijving is te kort."),
  icon: z.string({ required_error: "Selecteer een icoon." }),
  category: z.string({ required_error: "Selecteer een categorie." }),
  status: z.enum(['online', 'offline']).optional(),
  reasoning: z.object({
    high: z.string().min(10, "Reden voor hoge score is te kort."),
    medium: z.string().min(10, "Reden voor gemiddelde score is te kort."),
    low: z.string().min(10, "Reden voor lage score is te kort."),
  }),
  usage: z.object({
    when: z.string().min(10, "Wanneer-uitleg is te kort."),
    benefit: z.string().min(10, "Voordeel-uitleg is te kort."),
  }),
});

export type ToolFormData = z.infer<typeof toolFormSchema>;

interface ToolCreatorFormProps {
  onSave: (data: ToolFormData) => void;
  initialData?: Tool;
  isNewTool: boolean;
  onDelete?: () => void;
}

const LOCAL_STORAGE_TOOLS_KEY = 'mindnavigator_tools_v1';

export function ToolCreatorForm({ onSave, initialData, isNewTool, onDelete }: ToolCreatorFormProps) {
  const { toast } = useToast();
  const [toolIdea, setToolIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeletingDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [livePreviewToolId, setLivePreviewToolId] = useState<string | null>(null);
  
  const form = useForm<ToolFormData>({
    resolver: zodResolver(toolFormSchema),
    defaultValues: initialData || {
      id: "", title: "", description: "", status: 'online', reasoning: { high: "", medium: "", low: "" }, usage: { when: "", benefit: "" },
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      checkToolComponentExists(initialData.id).then(exists => {
          if (exists) {
              setLivePreviewToolId(initialData.id);
          }
      });
    }
  }, [initialData, form]);

  const handleGenerateWithAI = async () => {
    if (!toolIdea.trim()) {
      toast({ title: "Oeps!", description: "Voer eerst een idee in voor de tool.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    setLivePreviewToolId(null);
    toast({ title: "AI is aan het werk...", description: "De details voor je tool worden nu gegenereerd." });
    
    try {
      const storedToolsRaw = localStorage.getItem(LOCAL_STORAGE_TOOLS_KEY);
      const existingTools: {id: string}[] = (storedToolsRaw && storedToolsRaw !== 'undefined') ? JSON.parse(storedToolsRaw) : [];
      const existingIds = existingTools.map(t => t.id);

      const result = await generateToolDetails({ toolIdea, existingIds });
      
      form.reset({
        ...result,
        status: 'online', 
        reasoning: { ...result.reasoning },
        usage: { ...result.usage }
      });

      toast({ title: "Details Gegenereerd!", description: `De AI heeft alle velden voor "${result.title}" ingevuld.` });
    } catch (error) {
      console.error("AI tool generation failed:", error);
      toast({ title: "Genereren Mislukt", description: "De AI kon de details niet genereren. Probeer een andere omschrijving.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateToolComponent = async () => {
    const currentToolData = form.getValues();
    if (!currentToolData.id || !currentToolData.title || !currentToolData.description) {
      toast({ title: "Fout", description: "Sla de tool eerst op met een ID, titel en beschrijving.", variant: "destructive"});
      return;
    };
    
    setIsGenerating(true);
    setLivePreviewToolId(null); // Reset preview to show loading state
    toast({
        title: "Tool generatie gestart...",
        description: `De AI begint nu met het bouwen van de component voor: ${currentToolData.title}. Dit kan even duren.`
    });
    
    const result = await createToolComponentFile(
      currentToolData.id,
      currentToolData.title,
      currentToolData.description
    );

    if (result.success && result.filePath) {
      // Set the tool ID to trigger the previewer component
      setLivePreviewToolId(currentToolData.id);
      toast({
        title: "Component Bestand Aangemaakt!",
        description: `Het bestand is succesvol aangemaakt. De live preview wordt hieronder geladen.`,
        action: (
          <Button variant="outline" size="sm" asChild>
            <Link href={result.filePath} target="_blank">Bekijk Tool <ExternalLink className="ml-2 h-4 w-4"/></Link>
          </Button>
        )
      });
    } else {
       toast({
        title: "Fout bij aanmaken bestand",
        description: result.error || "Kon de component niet automatisch aanmaken.",
        variant: "destructive",
      });
    }

    setIsGenerating(false);
  };
  
  return (
    <>
      <Form {...form}>
        <form id="tool-creator-form" onSubmit={form.handleSubmit(onSave)} className="space-y-6">
            
            {isNewTool && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-primary"><Bot className="h-5 w-5"/>Genereer met AI</CardTitle>
                    <CardDescription>Beschrijf je tool idee in het kort en laat de AI een voorstel doen voor alle velden.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 px-6 pb-6 space-y-2">
                      <Label htmlFor="tool-idea">Idee voor de tool</Label>
                      <div className="flex gap-2">
                          <Input 
                              id="tool-idea"
                              placeholder="Bijv. een tool die helpt met ademhalingsoefeningen" 
                              value={toolIdea}
                              onChange={(e) => setToolIdea(e.target.value)}
                          />
                          <Button type="button" onClick={handleGenerateWithAI} disabled={isGenerating}>
                              {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Genereer
                          </Button>
                      </div>
                  </CardContent>
              </Card>
            )}
            
            <Card>
                <CardHeader>
                    <CardTitle>Tool Eigenschappen</CardTitle>
                    <CardDescription>
                        Beheer hier de metadata van de tool, zoals de titel, het icoon en de beschrijving die gebruikers zien.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 space-y-6">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/30">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Tool Status</FormLabel>
                                    <FormDescription>
                                        Zet de tool online (zichtbaar voor gebruikers) of offline (verborgen).
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value === 'online'}
                                        onCheckedChange={(checked) => field.onChange(checked ? 'online' : 'offline')}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="id" render={({ field }) => (
                            <FormItem><FormLabel>Uniek ID</FormLabel><FormControl><Input placeholder="bijv. focus-timer-pro" {...field} disabled={!isNewTool} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Titel</FormLabel><FormControl><Input placeholder="Titel van de tool" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>

                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Korte Omschrijving</FormLabel><FormControl><Textarea placeholder="Wat doet deze tool?" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="icon" render={({ field }) => (
                            <FormItem><FormLabel>Icoon</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Kies een icoon"/></SelectTrigger></FormControl><SelectContent>{allToolIcons.map(icon => <SelectItem key={icon.name} value={icon.name}><div className="flex items-center gap-2"><icon.component className="h-4 w-4"/>{icon.name}</div></SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem><FormLabel>Categorie</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Kies een categorie"/></SelectTrigger></FormControl><SelectContent>{allToolCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                    </div>
                </CardContent>
            </Card>
            
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-primary" />
                        Component Automatisering
                    </CardTitle>
                    <CardDescription>
                        Genereer of hergenereer automatisch het React component voor deze tool.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button type="button" onClick={handleGenerateToolComponent} disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Bot className="mr-2 h-4 w-4" />}
                        {livePreviewToolId ? 'Hergenereer Tool Component' : 'Genereer Tool Component'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                        Klik hier om automatisch een <code>.tsx</code> bestand te laten aanmaken/overschrijven in <code>src/components/tools/</code>.
                    </p>
                </CardContent>
            </Card>

            {livePreviewToolId && (
              <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Wrench className="h-5 w-5" /> Live Component Preview
                    </CardTitle>
                    <CardDescription>
                        Dit is een live weergave van het gegenereerde component. Open in een nieuw tabblad:
                         <Button variant="link" asChild className="p-0 pl-1 h-auto -mb-1"><Link href={`/dashboard/tools/${livePreviewToolId}`} target="_blank">{`/tools/${livePreviewToolId}`}<ExternalLink className="h-3 w-3 ml-1"/></Link></Button>.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <ToolPreviewer toolId={livePreviewToolId} />
                </CardContent>
              </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Aanbevelingslogica</CardTitle>
                    <CardDescription>Leg uit waarom deze tool wordt aanbevolen bij verschillende quiz-scores.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                    <FormField control={form.control} name="reasoning.high" render={({ field }) => (
                        <FormItem><FormLabel>Reden bij Hoge Score</FormLabel><FormControl><Textarea placeholder="Waarom is dit een goede tool bij een hoge score op een profiel?" {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="reasoning.medium" render={({ field }) => (
                        <FormItem><FormLabel>Reden bij Gemiddelde Score</FormLabel><FormControl><Textarea placeholder="Waarom is dit een goede tool bij een gemiddelde score?" {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="reasoning.low" render={({ field }) => (
                        <FormItem><FormLabel>Reden bij Lage Score</FormLabel><FormControl><Textarea placeholder="Waarom kan dit nuttig zijn bij een lage score?" {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Gebruikersuitleg</CardTitle>
                    <CardDescription>Geef korte, duidelijke instructies voor de eindgebruiker.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                    <FormField control={form.control} name="usage.when" render={({ field }) => (
                        <FormItem><FormLabel>Wanneer te gebruiken?</FormLabel><FormControl><Textarea placeholder="Beschrijf de ideale situatie om deze tool te gebruiken." {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="usage.benefit" render={({ field }) => (
                        <FormItem><FormLabel>Wat is het voordeel?</FormLabel><FormControl><Textarea placeholder="Beschrijf het concrete voordeel voor de gebruiker." {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </CardContent>
            </Card>
        </form>
      </Form>
      
      <div className="mt-8 pt-6 border-t flex justify-between items-start">
        <div>
          {!isNewTool && onDelete && (
            <div>
              <h3 className="text-destructive font-semibold text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5"/>
                Gevaarlijke Zone
              </h3>
              <p className="text-muted-foreground text-sm mt-1 mb-3">Deze actie kan niet ongedaan worden gemaakt.</p>
              <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4"/> Verwijder deze tool
              </Button>
            </div>
          )}
        </div>

        <Button type="submit" form="tool-creator-form">
          <Save className="mr-2 h-4 w-4"/>
          {isNewTool ? 'Tool Eigenschappen Creëren' : 'Eigenschappen Opslaan'}
        </Button>
      </div>

      <AlertDialog open={isDeletingDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Dit zal de tool "{initialData?.title}" permanent verwijderen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">Ja, verwijder</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
