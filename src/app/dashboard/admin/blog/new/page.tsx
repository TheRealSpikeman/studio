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
import { ArrowLeft, Bot, Save, Loader2, Rss, AlertTriangle } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';
import type { BlogPost } from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { aiPersonas } from '@/ai/personas';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const LOCAL_STORAGE_KEY = 'mindnavigator_blog_posts';

const blogPostFormSchema = z.object({
  title: z.string().min(10, 'Titel moet minimaal 10 tekens zijn.'),
  slug: z.string().min(3, 'Slug moet minimaal 3 tekens zijn.').regex(/^[a-z0-9-]+$/, "Slug mag alleen kleine letters, cijfers en streepjes bevatten."),
  excerpt: z.string().min(20, 'Samenvatting moet minimaal 20 tekens zijn.'),
  content: z.string().min(100, 'Content moet minimaal 100 tekens zijn.'),
  tags: z.string().min(1, 'Voer minimaal één tag in (komma-gescheiden).'),
  featuredImageHint: z.string().min(3, 'Image hint moet minimaal 3 tekens zijn.'),
  status: z.enum(['draft', 'published']),
});

type BlogPostFormData = z.infer<typeof blogPostFormSchema>;

export default function NewBlogPostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiPersona, setAiPersona] = useState<string>(aiPersonas[0].id);
  const [aiError, setAiError] = useState<string | null>(null);

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: '', slug: '', excerpt: '', content: '', tags: '', featuredImageHint: '', status: 'draft',
    },
  });

  const titleValue = form.watch('title');
  useEffect(() => {
    if (titleValue) {
      const newSlug = titleValue
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
      form.setValue('slug', newSlug, { shouldValidate: true });
    }
  }, [titleValue, form]);


  const handleGenerateContent = async () => {
    if (!aiTopic) {
      toast({ title: "Onderwerp vereist", description: "Voer een onderwerp of idee in om content te genereren.", variant: "destructive" });
      return;
    }

    const selectedPersona = aiPersonas.find(p => p.id === aiPersona);
    if (!selectedPersona) {
      toast({ title: "Persona niet gevonden", description: "Selecteer een geldige AI persona.", variant: "destructive" });
      return;
    }
    
    setAiError(null); // Clear previous errors
    setIsAiGenerating(true);
    toast({ title: "AI is aan het werk...", description: "Blogpost content wordt gegenereerd." });
    try {
      const result = await generateBlogPost({
        topic: aiTopic,
        personaDescription: selectedPersona.description,
      });

      // Set the fields the AI provides
      form.setValue('title', result.title);
      form.setValue('excerpt', result.excerpt);
      form.setValue('content', result.content);
      form.setValue('tags', result.tags.join(', '));
      form.setValue('featuredImageHint', result.featuredImageHint);
      
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

  const onSubmit = (data: BlogPostFormData) => {
    setIsSaving(true);
    
    const { tags: tagsString, ...restOfData } = data;

    const newPost: BlogPost = {
      ...restOfData,
      id: `blog-${Date.now()}`,
      authorId: user?.id || 'unknown',
      authorName: user?.name || 'MindNavigator Team',
      createdAt: new Date().toISOString(),
      publishedAt: data.status === 'published' ? new Date().toISOString() : undefined,
      tags: tagsString.split(',').map(tag => tag.trim()).filter(Boolean),
      featuredImageUrl: `https://placehold.co/1200x630.png`,
    };
    
    try {
        const storedPostsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
        const storedPosts: BlogPost[] = storedPostsRaw ? JSON.parse(storedPostsRaw) : [];
        const updatedPosts = [newPost, ...storedPosts];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPosts));
        
        toast({ title: "Artikel opgeslagen!", description: `"${data.title}" is opgeslagen als ${data.status}.` });
        router.push('/dashboard/admin/blog');
    } catch (error) {
        console.error("Failed to save blog post to localStorage", error);
        toast({ title: "Opslaan mislukt", description: "Kon het artikel niet lokaal opslaan.", variant: "destructive"});
    } finally {
        setIsSaving(false);
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
          <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> Genereer met AI</CardTitle>
          <CardDescription>Start met een idee en laat de AI een conceptartikel voor je schrijven. Vul daarna de overige details zelf aan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="ai-topic">Onderwerp / Idee*</label>
              <Input id="ai-topic" placeholder="bv. Help, mijn tiener is altijd moe!" value={aiTopic} onChange={e => setAiTopic(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="ai-persona">AI Schrijfstijl (Persona)</label>
              <Select value={aiPersona} onValueChange={setAiPersona}>
                <SelectTrigger id="ai-persona"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {aiPersonas.map(persona => (
                    <SelectItem key={persona.id} value={persona.id}>{persona.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        {aiError && (
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Fout bij Genereren</AlertTitle>
              <AlertDescription>
                <pre className="text-xs whitespace-pre-wrap font-mono">{aiError}</pre>
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
        <CardFooter>
          <Button onClick={handleGenerateContent} disabled={isAiGenerating}>
            {isAiGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
            Genereer Content
          </Button>
        </CardFooter>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Artikel Details</CardTitle>
              <CardDescription>Bewerk de gegenereerde content en vul de overige velden handmatig in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Titel</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>Dit wordt automatisch gegenereerd op basis van de titel.</FormDescription><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="excerpt" render={({ field }) => (
                <FormItem><FormLabel>Samenvatting (excerpt)</FormLabel><FormControl><Textarea {...field} rows={2} placeholder="Schrijf een korte, pakkende samenvatting voor de overzichtspagina." /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem><FormLabel>Content (Markdown)</FormLabel><FormControl><Textarea {...field} rows={15} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem><FormLabel>Tags (komma-gescheiden)</FormLabel><FormControl><Input {...field} placeholder="Focus, Ouders, Neurodiversiteit" /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="featuredImageHint" render={({ field }) => (
                <FormItem>
                  <FormLabel>Afbeelding Trefwoorden</FormLabel>
                  <FormControl><Input {...field} placeholder="bv. brain connection, teenager studying" /></FormControl>
                  <FormDescription>1-2 trefwoorden die de sfeer van het artikel beschrijven.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="draft">Concept</SelectItem><SelectItem value="published">Gepubliceerd</SelectItem></SelectContent>
                  </Select><FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Artikel Opslaan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
