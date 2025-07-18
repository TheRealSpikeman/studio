// src/app/dashboard/admin/blog/new/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Bot, Save, Loader2, Rss, AlertTriangle, Lightbulb, Link2, Brain, Link as LinkIcon } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';
import { generateBlogTopic } from '@/ai/flows/generate-blog-topic-flow';
import type { BlogPost } from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';
import { initialAiPersonas } from '@/ai/personas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { QuizAdmin } from '@/types/quiz-admin';
import { Label } from '@/components/ui/label';
import { blogService } from '@/services/blogService';
import { storageService } from '@/services/storageService';

const ImageUploader = dynamic(
  () => import('@/components/common/ImageUploader').then(mod => mod.ImageUploader),
  { 
    ssr: false,
    loading: () => <div className="space-y-2 pt-4 border-t mt-4"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-40 w-full rounded-md" /></div>
  }
);

const SESSION_STORAGE_LINKING_KEY = 'linking_context_blog';

const blogPostFormSchema = z.object({
  title: z.string().min(10, 'Titel moet minimaal 10 tekens zijn.'),
  slug: z.string().min(3, 'Slug moet minimaal 3 tekens zijn.').regex(/^[a-z0-9-]+$/, "Slug mag alleen kleine letters, cijfers en streepjes bevatten."),
  excerpt: z.string().min(20, 'Samenvatting moet minimaal 20 tekens zijn.'),
  content: z.string().min(100, 'Content moet minimaal 100 tekens zijn.'),
  tags: z.string().min(1, 'Voer minimaal één tag in (komma-gescheiden).'),
  featuredImageUrl: z.string().url('Upload een geldige afbeelding om de URL te verkrijgen.').optional().or(z.literal('')),
  featuredImageHint: z.string().min(3, 'Image hint moet minimaal 3 tekens zijn.'),
  status: z.enum(['draft', 'published']),
  linkedQuizId: z.string().optional(),
  targetAudience: z.string().min(1, 'Selecteer een doelgroep.'),
});

type BlogPostFormData = z.infer<typeof blogPostFormSchema>;

export default function NewBlogPostPage() {
  const { user, isLoading: isAuthLoading } = useAuth(); // Get auth state
  const router = useRouter();
  const { toast } = useToast();
  
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiPersona, setAiPersona] = useState<string>(initialAiPersonas[0].id);
  const [aiTargetAudience, setAiTargetAudience] = useState<string>('Ouders'); 
  const [aiError, setAiError] = useState<string | null>(null);
  const [allQuizzes, setAllQuizzes] = useState<QuizAdmin[]>([]);
  const [contentGenerated, setContentGenerated] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: '', slug: '', excerpt: '', content: '', tags: '', featuredImageUrl: '', featuredImageHint: '', status: 'draft', linkedQuizId: '', targetAudience: 'Ouders',
    },
  });

  useEffect(() => {
    const titleValue = form.watch('title');
    if (titleValue) {
      const newSlug = titleValue
        .toLowerCase()
        .replace(/\s+/g, '-') 
        .replace(/[^\w-]+/g, '') 
        .replace(/--+/g, '-')
        .replace(/^-+/, '') 
        .replace(/-+$/, '');
      form.setValue('slug', newSlug, { shouldValidate: true });
    }
  }, [form.watch('title'), form]);

  useEffect(() => {
    async function loadQuizzes() {
        const quizzes = await storageService.getAllQuizzes();
        setAllQuizzes(quizzes);
    }
    loadQuizzes();
  }, []);

  const handleSuggestTopic = async () => {
    const selectedPersona = initialAiPersonas.find(p => p.id === aiPersona);
    if (!selectedPersona) return;
    setIsAiGenerating(true);
    toast({ title: "Onderwerp wordt bedacht...", description: `De AI stelt nu een blogonderwerp voor de doelgroep "${aiTargetAudience}".` });
    try {
      const existingPosts: BlogPost[] = await blogService.getAllPosts();
      const existingTopics = existingPosts.map(p => p.title);

      const result = await generateBlogTopic({
        personaDescription: selectedPersona.description,
        targetAudience: aiTargetAudience,
        existingTopics: existingTopics,
      });
      setAiTopic(result.topic);
    } catch(error: any) {
      console.error(error);
      toast({ title: "Fout", description: `Kon geen onderwerp suggereren: ${error.message}`, variant: "destructive" });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!aiTopic) {
      toast({ title: "Onderwerp vereist", description: "Voer een onderwerp in of laat er een suggereren.", variant: "destructive" });
      return;
    }
    const selectedPersona = initialAiPersonas.find(p => p.id === aiPersona);
    if (!selectedPersona) return;
    
    setAiError(null);
    setIsAiGenerating(true);
    setContentGenerated(false);
    toast({ title: "AI is aan het werk...", description: "Blogpost content wordt gegenereerd." });
    try {
      const result = await generateBlogPost({
        topic: aiTopic,
        personaDescription: selectedPersona.description,
        targetAudience: aiTargetAudience,
      });
      form.reset({
        ...form.getValues(),
        title: result.title,
        excerpt: result.excerpt,
        content: result.content,
        tags: result.tags.join(', '),
        featuredImageHint: result.featuredImageHint,
        targetAudience: aiTargetAudience,
      });
      setContentGenerated(true);
      toast({ title: "Content gegenereerd!", description: "Alle velden zijn ingevuld door de AI." });
    } catch (error: any) {
      console.error("AI content generation failed:", error);
      const errorMessage = `Fout: ${error.message || "Onbekende fout."}\n\nDetails: ${error.stack || 'Geen stack trace beschikbaar.'}`;
      setAiError(errorMessage);
      toast({ title: "Genereren mislukt", description: "Zie de foutmelding op de pagina voor details.", variant: "destructive" });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const saveNewPost = async (data: BlogPostFormData): Promise<string | null> => {
    setIsSaving(true);
    
    if (!user) {
        toast({ title: "Fout bij opslaan", description: "Gebruiker niet ingelogd of authenticatie is nog niet geladen. Probeer het opnieuw.", variant: "destructive" });
        setIsSaving(false);
        return null;
    }

    const selectedPersona = initialAiPersonas.find(p => p.id === aiPersona);
    if (!selectedPersona) {
        toast({ title: "Fout", description: "Geselecteerde AI persona niet gevonden.", variant: "destructive" });
        setIsSaving(false);
        return null;
    }

    const newPostBase = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      authorId: user.id,
      authorName: selectedPersona.name, // Use persona name
      personaId: aiPersona,
      targetAudience: data.targetAudience,
      featuredImageUrl: data.featuredImageUrl || 'https://placehold.co/1200x630.png',
      featuredImageHint: data.featuredImageHint,
      status: data.status,
      tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    
    const newPostData = {
        ...newPostBase,
        ...(data.status === 'published' && { publishedAt: new Date().toISOString() }),
    };

    try {
       const newId = await blogService.createPost(newPostData as Omit<BlogPost, 'id'>);
       return newId;
    } catch(e: any) {
       toast({ title: "Fout bij opslaan", description: e.message || "Kon de post niet opslaan in de database.", variant: "destructive" });
       return null;
    } finally {
       setIsSaving(false);
    }
  };

  const onSubmitAndGoToEdit = async (data: BlogPostFormData) => {
    const newPostId = await saveNewPost(data);
    if (newPostId) {
        toast({
            title: "Artikel opgeslagen!",
            description: `"${data.title}" is aangemaakt. U wordt nu doorgestuurd om verder te bewerken en een quiz te koppelen.`
        });
        router.replace(`/dashboard/admin/blog/edit/${newPostId}?showQuiz=true`);
    }
  };
  
  const handleSaveAndNavigate = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
        toast({ title: "Formulier onvolledig", description: "Vul alle verplichte velden in.", variant: "destructive" });
        return;
    }
    const data = form.getValues();
    const newPostId = await saveNewPost(data);
    if (newPostId) {
        const savedPost = await blogService.getPostById(newPostId);
        if (savedPost) {
            toast({ title: "Artikel opgeslagen!", description: `U wordt nu doorgestuurd naar het artikel.` });
            router.push(`/blog/${savedPost.slug}`);
        }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Rss className="h-8 w-8 text-primary" />
          Nieuw Blogartikel
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Terug naar overzicht</Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm">1</span> Onderwerp Bepalen</CardTitle>
          <CardDescription>Kies een schrijfstijl (persona) en doelgroep, laat dan de AI een onderwerp voorstellen, of voer zelf een idee in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ai-persona">AI Schrijfstijl (Persona)</Label>
              <Select value={aiPersona} onValueChange={setAiPersona}>
                <SelectTrigger id="ai-persona"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {initialAiPersonas.map(persona => (
                    <SelectItem key={persona.id} value={persona.id}>{persona.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="target-audience">Doelgroep</Label>
                <Select value={aiTargetAudience} onValueChange={setAiTargetAudience}>
                    <SelectTrigger id="target-audience"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Ouders">Ouders</SelectItem>
                        <SelectItem value="Tieners (12-15 jaar)">Tieners (12-15 jaar)</SelectItem>
                        <SelectItem value="Tieners (16-18 jaar)">Tieners (16-18 jaar)</SelectItem>
                        <SelectItem value="Professionals (coaches/tutors)">Professionals (coaches/tutors)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
          <div className="space-y-2 pt-4">
              <Label htmlFor="ai-topic">Onderwerp / Idee</Label>
              <div className="flex gap-2">
                  <Input id="ai-topic" placeholder="Help, mijn tiener is altijd moe!" value={aiTopic} onChange={e => setAiTopic(e.target.value)} />
                  <Button variant="outline" type="button" onClick={handleSuggestTopic} disabled={isAiGenerating}><Lightbulb className="mr-2 h-4 w-4"/>Suggereer Onderwerp</Button>
              </div>
          </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm">2</span> Content Genereren</CardTitle>
          <CardDescription>Klik op de knop om de volledige blogpost te laten schrijven op basis van het gekozen onderwerp en doelgroep.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateContent} disabled={isAiGenerating || !aiTopic}>
            {isAiGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
            Genereer Blog Content
          </Button>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitAndGoToEdit)} className="space-y-6">
            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-sm">3</span> Bewerken &amp; Opslaan</CardTitle>
                  <CardDescription>Pas de gegenereerde content aan, upload een afbeelding en sla het artikel op.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!contentGenerated && <p className="text-sm text-muted-foreground italic text-center py-4">De velden hieronder worden ingevuld nadat de content is gegenereerd in stap 2.</p>}
                  
                  <div className={!contentGenerated ? 'opacity-40 pointer-events-none' : ''}>
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem><FormLabel>Titel</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="slug" render={({ field }) => (
                        <FormItem className="mt-4"><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>Dit wordt automatisch gegenereerd op basis van de titel.</FormDescription><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="targetAudience" render={({ field }) => (<FormItem className="hidden"><FormControl><Input {...field}/></FormControl></FormItem>)}/>
                    <FormField control={form.control} name="excerpt" render={({ field }) => (
                        <FormItem className="mt-4"><FormLabel>Samenvatting (excerpt)</FormLabel><FormControl><Textarea {...field} rows={2} placeholder="Schrijf een korte, pakkende samenvatting voor de overzichtspagina." /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="content" render={({ field }) => (
                        <FormItem className="mt-4"><FormLabel>Content (HTML)</FormLabel><FormControl><Textarea placeholder="De AI genereert hier HTML-content..." className="font-mono text-xs" rows={15} {...field}/></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="tags" render={({ field }) => (
                        <FormItem className="mt-4"><FormLabel>Tags (komma-gescheiden)</FormLabel><FormControl><Input {...field} placeholder="Focus, Ouders, Neurodiversiteit" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="featuredImageHint" render={({ field }) => (
                        <FormItem className="mt-4"><FormLabel>Afbeelding Trefwoorden</FormLabel><FormControl><Input {...field} placeholder="bv. brain connection, teenager studying" /></FormControl><FormDescription>1-2 trefwoorden die de sfeer van het artikel beschrijven.</FormDescription><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem className="mt-4"><FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="draft">Concept</SelectItem><SelectItem value="published">Gepubliceerd</SelectItem></SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                    <FormField
                      control={form.control}
                      name="featuredImageUrl"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Uitgelichte Afbeelding</FormLabel>
                          <FormControl>
                            <ImageUploader
                              onUploadComplete={field.onChange}
                              initialImageUrl={field.value}
                              uploadPath="images/blog"
                              aspectRatio="aspect-[16/9]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                 <CardFooter className="flex justify-between items-center">
                    <Button type="submit" variant="outline" disabled={isSaving || !contentGenerated || !form.formState.isValid || isAuthLoading}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <LinkIcon className="mr-2 h-4 w-4" /> Opslaan & Quiz Koppelen
                    </Button>
                    <Button type="button" onClick={handleSaveAndNavigate} disabled={isSaving || !contentGenerated || !form.formState.isValid || isAuthLoading}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" /> Artikel Opslaan & Bekijken
                    </Button>
                </CardFooter>
            </Card>
        </form>
      </Form>
    </div>
  );
}
