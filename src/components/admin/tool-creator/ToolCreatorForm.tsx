// src/components/admin/tool-creator/ToolCreatorForm.tsx
"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, Bot, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Tool } from '@/lib/quiz-data/tools-data';
import { allToolCategories, allToolIcons, getToolIconComponent } from '@/lib/quiz-data/tools-data';
import { generateToolDetails } from '@/ai/flows/generate-tool-details-flow';
import { Separator } from "@/components/ui/separator";

const toolFormSchema = z.object({
  id: z.string().min(3, "ID moet minimaal 3 tekens zijn.").regex(/^[a-z0-9-]+$/, "ID mag alleen kleine letters, cijfers en streepjes bevatten."),
  title: z.string().min(5, "Titel is te kort."),
  description: z.string().min(10, "Omschrijving is te kort."),
  icon: z.string({ required_error: "Selecteer een icoon." }),
  category: z.string({ required_error: "Selecteer een categorie." }),
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

type ToolFormData = z.infer<typeof toolFormSchema>;

const LOCAL_STORAGE_TOOLS_KEY = 'mindnavigator_tools_v1';

export function ToolCreatorForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [toolIdea, setToolIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const form = useForm<ToolFormData>({
    resolver: zodResolver(toolFormSchema),
    defaultValues: {
      id: "", title: "", description: "", reasoning: { high: "", medium: "", low: "" }, usage: { when: "", benefit: "" },
    },
  });

  const handleGenerateWithAI = async () => {
    if (!toolIdea.trim()) {
      toast({ title: "Oeps!", description: "Voer eerst een idee in voor de tool.", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    toast({ title: "AI is aan het werk...", description: "De details voor je tool worden nu gegenereerd." });
    
    try {
      const storedToolsRaw = localStorage.getItem(LOCAL_STORAGE_TOOLS_KEY);
      const existingTools: {id: string}[] = storedToolsRaw ? JSON.parse(storedToolsRaw) : [];
      const existingIds = existingTools.map(t => t.id);

      const result = await generateToolDetails({ toolIdea, existingIds });
      
      form.reset({
        ...result,
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


  const onSubmit = (data: ToolFormData) => {
    const IconComponent = getToolIconComponent(data.icon);
    if (!IconComponent) {
        toast({ title: "Fout", description: "Ongeldig icoon geselecteerd.", variant: "destructive" });
        return;
    }
    
    // We can't actually store a React component in JSON. So for localStorage, we'll store the icon name.
    const toolForStorage = {
        ...data,
        icon: data.icon, // Keep the string name for storage
    };

    try {
        const storedToolsRaw = localStorage.getItem(LOCAL_STORAGE_TOOLS_KEY);
        const existingTools = storedToolsRaw ? JSON.parse(storedToolsRaw) : [];
        
        if (existingTools.some((t: any) => t.id === toolForStorage.id)) {
             toast({ title: "Fout", description: `Een tool met ID "${toolForStorage.id}" bestaat al.`, variant: "destructive" });
             return;
        }

        const updatedTools = [...existingTools, toolForStorage];
        localStorage.setItem(LOCAL_STORAGE_TOOLS_KEY, JSON.stringify(updatedTools));

        toast({ title: "Tool opgeslagen!", description: `De tool "${data.title}" is succesvol opgeslagen.` });
        router.push('/dashboard/admin/tool-management');
    } catch (error) {
        console.error("Error saving tool to localStorage", error);
        toast({ title: "Fout", description: "Kon de tool niet opslaan.", variant: "destructive" });
    }
  };

  return (
    <Card>
        <CardContent className="pt-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    <Card className="p-4 bg-primary/5 border-primary/20">
                        <CardHeader className="p-0 pb-3">
                            <CardTitle className="text-lg flex items-center gap-2 text-primary"><Bot className="h-5 w-5"/>Genereer met AI</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-2">
                             <Label htmlFor="tool-idea">Beschrijf je tool idee in het kort</Label>
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

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="id" render={({ field }) => (
                            <FormItem><FormLabel>Uniek ID</FormLabel><FormControl><Input placeholder="bijv. focus-timer-pro" {...field} /></FormControl><FormMessage /></FormItem>
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

                    <Card className="p-4 bg-muted/50">
                        <CardTitle className="text-lg mb-2">Aanbevelingslogica</CardTitle>
                        <div className="space-y-4">
                           <FormField control={form.control} name="reasoning.high" render={({ field }) => (
                               <FormItem><FormLabel>Reden bij Hoge Score</FormLabel><FormControl><Textarea placeholder="Waarom is dit een goede tool bij een hoge score op een profiel?" {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                           )}/>
                            <FormField control={form.control} name="reasoning.medium" render={({ field }) => (
                               <FormItem><FormLabel>Reden bij Gemiddelde Score</FormLabel><FormControl><Textarea placeholder="Waarom is dit een goede tool bij een gemiddelde score?" {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                           )}/>
                            <FormField control={form.control} name="reasoning.low" render={({ field }) => (
                               <FormItem><FormLabel>Reden bij Lage Score</FormLabel><FormControl><Textarea placeholder="Waarom kan dit nuttig zijn bij een lage score?" {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                           )}/>
                        </div>
                    </Card>

                     <Card className="p-4 bg-muted/50">
                        <CardTitle className="text-lg mb-2">Gebruikersuitleg</CardTitle>
                        <div className="space-y-4">
                           <FormField control={form.control} name="usage.when" render={({ field }) => (
                               <FormItem><FormLabel>Wanneer te gebruiken?</FormLabel><FormControl><Textarea placeholder="Beschrijf de ideale situatie om deze tool te gebruiken." {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                           )}/>
                            <FormField control={form.control} name="usage.benefit" render={({ field }) => (
                               <FormItem><FormLabel>Wat is het voordeel?</FormLabel><FormControl><Textarea placeholder="Beschrijf het concrete voordeel voor de gebruiker." {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                           )}/>
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit"><Save className="mr-2 h-4 w-4"/> Tool Opslaan</Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
  );
}
