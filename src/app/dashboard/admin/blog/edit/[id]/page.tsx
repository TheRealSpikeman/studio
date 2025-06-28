// src/app/dashboard/admin/blog/edit/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Loader2, Edit, AlertTriangle, Bold, Italic, Heading2, Heading3, List } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import type { BlogPost } from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const LOCAL_STORAGE_KEY = 'mindnavigator_blog_posts';

const blogPostFormSchema = z.object({
  title: z.string().min(10, 'Titel moet minimaal 10 tekens zijn.'),
  slug: z.string().min(3, 'Slug moet minimaal 3 tekens zijn.').regex(/^[a-z0-9-]+$/, "Slug mag alleen kleine letters, cijfers en streepjes bevatten."),
  excerpt: z.string().min(20, 'Samenvatting moet minimaal 20 tekens zijn.'),
  content: z.string().min(100, 'Content moet minimaal 100 tekens zijn.'),
  tags: z.string().min(1, 'Voer minimaal één tag in (komma-gescheiden).'),
  featuredImageUrl: z.string().url('Voer een geldige URL in.').optional().or(z.literal('')),
  featuredImageHint: z.string().min(3, 'Image hint moet minimaal 3 tekens zijn.'),
  status: z.enum(['draft', 'published']),
});

type BlogPostFormData = z.infer<typeof blogPostFormSchema>;

export default function EditBlogPostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const postId = params.id as string;
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postData, setPostData] = useState<BlogPost | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
  });

  useEffect(() => {
    try {
      const storedPostsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPostsRaw) {
        const storedPosts: BlogPost[] = JSON.parse(storedPostsRaw);
        const foundPost = storedPosts.find(p => p.id === postId);
        if (foundPost) {
          setPostData(foundPost);
          form.reset({
            ...foundPost,
            tags: foundPost.tags.join(', '),
          });
        }
      }
    } catch (error) {
      console.error("Error loading blog post from localStorage:", error);
    }
    setIsLoading(false);
  }, [postId, form]);

  const insertMarkdown = (syntax: 'bold' | 'italic' | 'h2' | 'h3' | 'ul') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = form.getValues('content');
    const selectedText = value.substring(start, end);
    let newText;
    let cursorPosition;

    switch (syntax) {
      case 'bold': newText = `**${selectedText || 'tekst'}**`; cursorPosition = start + 2; break;
      case 'italic': newText = `*${selectedText || 'tekst'}*`; cursorPosition = start + 1; break;
      case 'h2': newText = `\n## ${selectedText || 'Kop'}\n`; cursorPosition = start + 4; break;
      case 'h3': newText = `\n### ${selectedText || 'Subkop'}\n`; cursorPosition = start + 5; break;
      case 'ul': newText = `\n* Item 1\n* Item 2`; cursorPosition = start + newText.length; break;
      default: newText = ''; cursorPosition = start;
    }

    const updatedValue = value.substring(0, start) + newText + value.substring(end);
    form.setValue('content', updatedValue, { shouldValidate: true });

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = selectedText ? (start + newText.length) : cursorPosition;
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
    }, 0);
  };

  const MarkdownToolbar = () => (
    <div className="flex items-center gap-1 border border-b-0 border-input rounded-t-md p-2 bg-muted/50">
      <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown('bold')} title="Vetgedrukt"><Bold className="h-4 w-4" /></Button>
      <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown('italic')} title="Cursief"><Italic className="h-4 w-4" /></Button>
      <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown('h2')} title="Kop 2"><Heading2 className="h-4 w-4" /></Button>
      <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown('h3')} title="Kop 3"><Heading3 className="h-4 w-4" /></Button>
      <Button type="button" variant="outline" size="sm" onClick={() => insertMarkdown('ul')} title="Lijst"><List className="h-4 w-4" /></Button>
    </div>
  );

  const onSubmit = (data: BlogPostFormData) => {
    if (!postData) return;
    setIsSaving(true);
    
    const { tags: tagsString, ...restOfData } = data;

    const updatedPost: BlogPost = {
      ...postData,
      ...restOfData,
      tags: tagsString.split(',').map(tag => tag.trim()).filter(Boolean),
      publishedAt: data.status === 'published' && !postData.publishedAt ? new Date().toISOString() : postData.publishedAt,
    };
    
    try {
      const storedPostsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const storedPosts: BlogPost[] = storedPostsRaw ? JSON.parse(storedPostsRaw) : [];
      const updatedPosts = storedPosts.map(p => (p.id === postId ? updatedPost : p));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPosts));

      toast({ title: "Artikel bijgewerkt!", description: `"${data.title}" is succesvol bijgewerkt.` });
      router.push('/dashboard/admin/blog');
    } catch (error) {
      console.error("Failed to save blog post to localStorage", error);
      toast({ title: "Opslaan mislukt", description: "Kon het artikel niet lokaal opslaan.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const generatedImageUrl = form.watch('featuredImageUrl');

  if (isLoading) {
    return <div className="p-8">Laden...</div>;
  }
  
  if (!postData) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold">Blogpost niet gevonden</h2>
        <p className="text-muted-foreground">Kon de post met ID "{postId}" niet vinden.</p>
        <Button asChild className="mt-4"><Link href="/dashboard/admin/blog">Terug naar overzicht</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Edit className="h-8 w-8 text-primary" />
          Artikel Bewerken
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Terug naar overzicht</Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Artikel Details</CardTitle>
              <CardDescription>Bewerk hier de gegevens van het artikel.</CardDescription>
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
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (Markdown)</FormLabel>
                    <MarkdownToolbar />
                    <FormControl>
                      <Textarea
                        {...field}
                        ref={(e) => {
                          field.ref(e);
                          contentRef.current = e;
                        }}
                        rows={15}
                        className="rounded-t-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="tags" render={({ field }) => (
                <FormItem><FormLabel>Tags (komma-gescheiden)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="featuredImageHint" render={({ field }) => (
                <FormItem>
                  <FormLabel>Afbeelding Trefwoorden</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
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
          
          <Card>
            <CardHeader><CardTitle>Uitgelichte Afbeelding</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="featuredImageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Afbeelding URL</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                )} />
                {generatedImageUrl && (
                    <div>
                        <Label>Preview</Label>
                        <div className="mt-2 w-full aspect-[16/9] relative rounded-md overflow-hidden border">
                            <Image src={generatedImageUrl} alt="Preview" fill style={{objectFit: 'cover'}} data-ai-hint={postData.featuredImageHint || ''}/>
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Wijzigingen Opslaan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
