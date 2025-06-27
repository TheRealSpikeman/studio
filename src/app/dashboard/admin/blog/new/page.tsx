// src/app/dashboard/admin/blog/new/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Bot, Save, Loader2, Rss } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { generateBlogPost } from '@/ai/flows/generate-blog-post-flow';
import type { BlogPost } from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { aiPersonas } from '@/ai/personas';

const blogPostFormSchema = z.object({
  title: z.string().min(10, 'Titel moet minimaal 10 tekens zijn.'),
  slug: z.string().min(3, 'Slug moet minimaal 3 tekens zijn.').regex(/^[a-z0-9-]+$/, "Slug mag alleen kleine letters, cijfers en streepjes bevatten."),
  excerpt: z.string().min(20, 'Samenvatting moet minimaal 20 tekens zijn.'),
  content: z.string().min(100, 'Content moet minimaal 100 tekens zijn.'),
  tags: z.string().min(1, 'Voer minimaal één tag in (komma-gescheiden).'),
  featuredImageUrl: z.string().url('Voer een geldige URL in.').optional().or(z.literal('')),
  featuredImageHint: z.string().optional(),
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
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiAudience, setAiAudience] = useState<'parents' | 'teens' | 'professionals'>('parents');
  const [aiTone, setAiTone] = useState<'informatief' | 'inspirerend' | 'praktisch' | 'empathisch'>('empathisch');
  const [aiPersona, setAiPersona] = useState<string>(aiPersonas[0].id);

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: '', slug: '', excerpt: '', content: '', tags: '',
      featuredImageUrl: '', featuredImageHint: '', status: 'draft',
    },
  });

  const handleGenerateContent = async () => {
    if (!aiTopic) {
      toast({ title: "Onderwerp vereist", description: "Voer een onderwerp in om content te genereren.", variant: "destructive" });
      return;
    }

    const selectedPersona = aiPersonas.find(p => p.id === aiPersona);
    if (!selectedPersona) {
      toast({ title: "Persona niet gevonden", description: "Selecteer een geldige AI persona.", variant: "destructive" });
      return;
    }

    setIsAiGenerating(true);
    toast({ title: "AI is aan het werk...", description: "Blogpost content wordt gegenereerd." });
    try {
      const result = await generateBlogPost({
        topic: aiTopic,
        keywords: aiKeywords,
        targetAudience: aiAudience,
        tone: aiTone,
        personaDescription: selectedPersona.description,
      });
      form.setValue('title', result.title);
      form.setValue('slug', result.slug);
      form.setValue('excerpt', result.excerpt);
      form.setValue('content', result.content);
      form.setValue('tags', result.tags.join(', '));
      form.setValue('featuredImageHint', result.featuredImageHint);
      form.setValue('featuredImageUrl', `https://placehold.co/1200x630.png`);
      toast({ title: "Content gegenereerd!", description: "De velden zijn ingevuld met AI-content. U kunt deze nu bewerken." });
    } catch (error) {
      console.error("AI content generation failed:", error);
      toast({ title: "Genereren mislukt", description: "De AI kon de content niet genereren.", variant: "destructive" });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const onSubmit = (data: BlogPostFormData) => {
    setIsSaving(true);
    const newPost: BlogPost = {
      id: `blog-${Date.now()}`,
      authorId: user?.id || 'unknown',
      authorName: user?.name || 'MindNavigator Team',
      createdAt: new Date().toISOString(),
      publishedAt: data.status === 'published' ? new Date().toISOString() : undefined,
      tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      featuredImageUrl: data.featuredImageUrl || `https://placehold.co/1200x630.png`,
      featuredImageHint: data.featuredImageHint || '',
      ...data,
    };
    console.log("Saving blog post (simulated):", newPost);
    // In a real app, you would save this to Firestore.
    // For this prototype, we'll just log and redirect.
    toast({ title: "Artikel opgeslagen!", description: `"${data.title}" is opgeslagen als ${data.status}.` });
    router.push('/dashboard/admin/blog');
    setIsSaving(false);
  };

  const generatedImageUrl = form.watch('featuredImageUrl');
  const generatedImageHint = form.watch('featuredImageHint');

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
          <CardDescription>Start met een idee en laat de AI een conceptartikel voor je schrijven.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="ai-topic">Onderwerp*</label>
            <Input id="ai-topic" placeholder="bv. 5 manieren om je tiener te helpen focussen" value={aiTopic} onChange={e => setAiTopic(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label htmlFor="ai-audience">Doelgroep</label>
              <Select value={aiAudience} onValueChange={(v) => setAiAudience(v as any)}>
                <SelectTrigger id="ai-audience"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="parents">Ouders</SelectItem>
                  <SelectItem value="teens">Tieners</SelectItem>
                  <SelectItem value="professionals">Professionals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="ai-tone">Toon</label>
              <Select value={aiTone} onValueChange={(v) => setAiTone(v as any)}>
                <SelectTrigger id="ai-tone"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="informatief">Informatief</SelectItem>
                  <SelectItem value="inspirerend">Inspirerend</SelectItem>
                  <SelectItem value="praktisch">Praktisch</SelectItem>
                  <SelectItem value="empathisch">Empathisch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="ai-keywords">Keywords (optioneel)</label>
              <Input id="ai-keywords" placeholder="focus, huiswerk, adhd" value={aiKeywords} onChange={e => setAiKeywords(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="ai-persona">AI Persona</label>
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
              <CardDescription>Bewerk de gegenereerde content of vul de velden handmatig in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Titel</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="excerpt" render={({ field }) => (
                <FormItem><FormLabel>Samenvatting (excerpt)</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem><FormLabel>Content (Markdown)</FormLabel><FormControl><Textarea {...field} rows={15} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem><FormLabel>Tags (komma-gescheiden)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
          
          <Card>
            <CardHeader><CardTitle>Uitgelichte Afbeelding</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="featuredImageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Afbeelding URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="featuredImageHint" render={({ field }) => (
                  <FormItem><FormLabel>AI Afbeelding Hint</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormDescription>Dit wordt door de AI ingevuld en kan gebruikt worden om een passende afbeelding te vinden.</FormDescription><FormMessage /></FormItem>
                )} />
                {generatedImageUrl && (
                    <div>
                        <Label>Preview</Label>
                        <div className="mt-2 w-full aspect-[16/9] relative rounded-md overflow-hidden border">
                            <Image src={generatedImageUrl} alt="Preview" fill style={{objectFit: 'cover'}} data-ai-hint={generatedImageHint || ''}/>
                        </div>
                    </div>
                )}
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
