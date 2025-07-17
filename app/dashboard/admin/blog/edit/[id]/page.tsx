// src/app/dashboard/admin/blog/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Save, Loader2, Edit, AlertTriangle, Link as LinkIcon, Brain } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import type { BlogPost } from '@/types/blog';
import { useAuth } from '@/contexts/AuthContext';
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
    loading: () => <div className="space-y-2 pt-4 border-t mt-4"><Skeleton className="h-4 w-1/4" /><Skeleton className="aspect-[16/9] w-full rounded-md" /></div>
  }
);

const SESSION_STORAGE_LINKING_KEY = 'linking_context_blog';

const blogPostFormSchema = z.object({
  title: z.string().min(10, 'Titel moet minimaal 10 tekens zijn.'),
  slug: z.string().min(3, 'Slug moet minimaal 3 tekens zijn.').regex(/^[a-z0-9-]+$/, "Slug mag alleen kleine letters, cijfers en streepjes bevatten."),
  excerpt: z.string().min(20, 'Samenvatting moet minimaal 20 tekens zijn.'),
  content: z.string().min(100, 'Content moet minimaal 100 tekens zijn.'),
  tags: z.string().min(1, 'Voer minimaal één tag in (komma-gescheiden).'),
  featuredImageUrl: z.string().url('Voer een geldige URL in.').optional().or(z.literal('')),
  featuredImageHint: z.string().min(3, 'Image hint moet minimaal 3 tekens zijn.'),
  status: z.enum(['draft', 'published']),
  linkedQuizId: z.string().optional(),
  targetAudience: z.string().min(1, 'Selecteer een doelgroep.'),
});

type BlogPostFormData = z.infer<typeof blogPostFormSchema>;

export default function EditBlogPostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const postId = params.id as string;
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postData, setPostData] = useState<BlogPost | null>(null);
  const [allQuizzes, setAllQuizzes] = useState<QuizAdmin[]>([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [showQuizLinker, setShowQuizLinker] = useState(false);

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostFormSchema),
  });

  const titleValue = form.watch('title');
  useEffect(() => {
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
  }, [titleValue, form]);
  
  useEffect(() => {
    async function loadData() {
        setIsLoading(true);
        const [foundPost, loadedQuizzes] = await Promise.all([
            blogService.getPostById(postId),
            storageService.getAllQuizzes()
        ]);
        
        if (foundPost) {
            setPostData(foundPost);
            form.reset({
                ...foundPost,
                tags: foundPost.tags.join(', '),
                linkedQuizId: foundPost.linkedQuizId || 'NONE',
                targetAudience: foundPost.targetAudience || 'Ouders',
            });
            
            const showQuiz = searchParams.get('showQuiz');
            if (showQuiz === 'true' || foundPost.linkedQuizId) {
                setShowQuizLinker(true);
            }
        }
    
        setAllQuizzes(loadedQuizzes.sort((a,b) => a.title.localeCompare(b.title)));
    
        setIsLoading(false);
    }
    loadData();
  }, [postId, form, searchParams]);
  
  const savePostData = async (data: BlogPostFormData): Promise<BlogPost | null> => {
    if (!postData) return null;
    setIsSaving(true);
    try {
        const linkedQuiz = data.linkedQuizId && data.linkedQuizId !== 'NONE'
            ? allQuizzes.find(q => q.id === data.linkedQuizId)
            : undefined;

        // Build the base update object, omitting undefined values
        const baseUpdateData = {
            ...postData,
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
            featuredImageUrl: data.featuredImageUrl || postData.featuredImageUrl,
            featuredImageHint: data.featuredImageHint,
            status: data.status,
            targetAudience: data.targetAudience,
            ...(data.status === 'published' && !postData.publishedAt && { publishedAt: new Date().toISOString() }),
            ...(linkedQuiz
                ? {
                    linkedQuizId: linkedQuiz.id,
                    linkedQuizTitle: linkedQuiz.title,
                    linkedQuizAudience: linkedQuiz.audience,
                  }
                : {
                    linkedQuizId: undefined,
                    linkedQuizTitle: undefined,
                    linkedQuizAudience: undefined,
                  }),
        };

        // Clean up any explicitly 'undefined' fields before saving to Firestore
        const finalUpdateData: any = Object.fromEntries(
            Object.entries(baseUpdateData).filter(([_, v]) => v !== undefined)
        );

        // Preserve existing publishedAt if status is already published
        if (data.status === 'published' && postData.publishedAt) {
          finalUpdateData.publishedAt = postData.publishedAt;
        }

        await blogService.updatePost(finalUpdateData as BlogPost);
        setPostData(finalUpdateData as BlogPost); 
        return finalUpdateData as BlogPost;

    } catch (e) {
        console.error("Error saving post:", e);
        toast({ title: "Opslaan mislukt", description: (e as Error).message, variant: "destructive" });
        return null;
    } finally {
        setIsSaving(false);
    }
  };

  const handleSaveAndNavigate = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({ title: "Formulier onvolledig", description: "Controleer alle velden voordat u opslaat.", variant: "destructive" });
      return;
    }
    const data = form.getValues();
    const savedPost = await savePostData(data);
    if (savedPost) {
      toast({ title: "Artikel Opgeslagen!", description: `Wijzigingen voor "${data.title}" zijn opgeslagen.` });
      router.push(`/blog/${savedPost.slug}`);
    }
  };

  const handleSaveAndShowQuizLinker = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({ title: "Formulier onvolledig", description: "Controleer alle velden voordat u opslaat.", variant: "destructive" });
      return;
    }
    const data = form.getValues();
    const savedPost = await savePostData(data);
    if (savedPost) {
      toast({ title: "Artikel Opgeslagen!", description: "Je kunt nu een quiz koppelen." });
      setShowQuizLinker(true);
    }
  };

  const handleSaveQuizLink = async () => {
    const data = form.getValues();
    const savedPost = await savePostData(data);
    if (savedPost) {
      toast({ title: "Quiz succesvol gekoppeld!", description: `Navigeren naar de blogpost...` });
      router.push(`/blog/${savedPost.slug}`);
    }
  };


  const handleCreateQuizFromBlog = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({ title: "Blog niet compleet", description: "Sla de wijzigingen op en vul titel, content, etc. in voordat u een quiz genereert.", variant: "destructive" });
      return;
    }

    setIsGeneratingQuiz(true);
    toast({ title: 'Quizvoorstel wordt gemaakt...', description: 'De AI analyseert uw artikel om een relevante quiz voor te stellen.' });

    const blogTitle = form.getValues('title');
    const blogContent = form.getValues('content');
    const targetAudience = form.getValues('targetAudience');

    let audienceType: 'teen' | 'parent' | 'adult' = 'parent';
    let targetAgeGroup: '12-14' | '15-18' | '18+' | 'all' = '15-18'; // Default

    if (targetAudience.includes('Tieners (12-14 jaar)')) {
        audienceType = 'teen';
        targetAgeGroup = '12-14';
    } else if (targetAudience.includes('Tieners (15-18 jaar)')) {
        audienceType = 'teen';
        targetAgeGroup = '15-18';
    }

    sessionStorage.setItem(SESSION_STORAGE_LINKING_KEY, JSON.stringify({ id: postId, title: blogTitle }));
    
    try {
        const response = await fetch('/api/propose-quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                blogTitle,
                blogContent,
                targetAudience,
                authorAudienceType: audienceType,
                authorTargetAgeGroup: targetAgeGroup,
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || 'API request to propose quiz failed');
        }

        const result = await response.json();

        if (result.success && result.data) {
            sessionStorage.setItem('quizCreatorDraft_v1', JSON.stringify(result.data));
            router.push('/dashboard/admin/quiz-management/create');
        } else {
            throw new Error(result.error || 'Could not generate quiz proposal from blog.');
        }

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({ title: 'Fout', description: message, variant: 'destructive' });
        sessionStorage.removeItem(SESSION_STORAGE_LINKING_KEY);
    } finally {
        setIsGeneratingQuiz(false);
    }
  };
  
  if (isLoading) {
    return <div className="p-8 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
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
        <form className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Artikel Details</CardTitle>
              <CardDescription>Pas hier de gegevens van het artikel aan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Titel</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="targetAudience" render={({ field }) => (
                <FormItem>
                  <FormLabel>Doelgroep</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Kies een doelgroep..." /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Ouders">Ouders</SelectItem>
                      <SelectItem value="Tieners (12-14 jaar)">Tieners (12-14 jaar)</SelectItem>
                      <SelectItem value="Tieners (15-18 jaar)">Tieners (15-18 jaar)</SelectItem>
                      <SelectItem value="Professionals (coaches/tutors)">Professionals (coaches/tutors)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="excerpt" render={({ field }) => (
                <FormItem><FormLabel>Samenvatting (excerpt)</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (HTML)</FormLabel>
                    <FormControl>
                        <Textarea
                            className="font-mono text-xs"
                            rows={15}
                            {...field}
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
                  </Select><FormMessage /></FormItem>
              )} />

              <FormField
                control={form.control}
                name="featuredImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploader
                        label="Uitgelichte Afbeelding"
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
            </CardContent>
             <CardFooter className="flex justify-between items-center">
                <Button type="button" onClick={handleSaveAndShowQuizLinker} variant="outline" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <LinkIcon className="mr-2 h-4 w-4" /> Opslaan en Quiz toevoegen
                </Button>
                <Button type="button" onClick={handleSaveAndNavigate} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Artikel Opslaan
                </Button>
            </CardFooter>
          </Card>
          
          {showQuizLinker && (
             <Card>
                <CardHeader>
                  <CardTitle>Koppel een Quiz</CardTitle>
                  <CardDescription>Koppel een relevante quiz aan dit artikel, of genereer een nieuwe met AI.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="pt-4 border-t">
                      <Label>Gekoppelde Quiz</Label>
                      <div className="flex gap-2 items-center mt-1">
                          <div className="flex-1">
                            <FormField control={form.control} name="linkedQuizId" render={({ field }) => (
                                <FormItem className="w-full">
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Selecteer een quiz..."/></SelectTrigger></FormControl>
                                    <SelectContent>
                                      <SelectItem value="NONE">Geen quiz gekoppeld</SelectItem>
                                      {allQuizzes.map(quiz => (
                                          <SelectItem key={quiz.id} value={quiz.id}>{quiz.title}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                            )} />
                          </div>
                          <Button
                              type="button"
                              variant="outline"
                              onClick={handleCreateQuizFromBlog}
                              disabled={isGeneratingQuiz}
                          >
                              {isGeneratingQuiz ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Brain className="mr-2 h-4 w-4"/>}
                              Genereer Quiz
                          </Button>
                      </div>
                      {form.watch('linkedQuizId') && form.watch('linkedQuizId') !== 'NONE' && (
                        <div className="mt-4 flex justify-end">
                            <Button type="button" onClick={handleSaveQuizLink} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                <Save className="mr-2 h-4 w-4" /> Koppeling Opslaan
                            </Button>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
          )}

        </form>
      </Form>
    </div>
  );
}
