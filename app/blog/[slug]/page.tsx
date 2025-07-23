// src/app/blog/[slug]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Rss, Calendar, User, Facebook, Twitter, Linkedin, Copy, ArrowLeft, AlertTriangle, ArrowRight, Brain, Loader2, Users as UsersIcon } from '@/lib/icons';
import type { BlogPost } from '@/types/blog';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { blogService } from '@/services/blogService';
import DOMPurify from 'isomorphic-dompurify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { EditableImage } from '@/components/common/EditableImage';

// This function will assign a color class based on the tag text
const getTagClasses = (tag: string): string => {
  const lowerTag = tag.toLowerCase();
  switch (lowerTag) {
    case 'focus': case 'hyperfocus': case 'concentratie': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'ouders': case 'opvoeding': return 'bg-green-100 text-green-800 border-green-200';
    case 'neurodiversiteit': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'inspiratie': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'schermtijd': return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'kinderen': return 'bg-sky-100 text-sky-800 border-sky-200';
    case 'balans': return 'bg-rose-100 text-rose-800 border-rose-200';
    case 'concept': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'adhd': case 'autisme': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'uitstelgedrag': case 'strategieën': case 'gamen': case 'huiswerk': case 'tips': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'vriendschap': case 'tieners': case 'adolescenten': case 'puberteit': return 'bg-pink-100 text-pink-800 border-pink-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const ShareButtons = ({ title, url }: { title: string, url: string }) => {
  const { toast } = useToast();
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const copyToClipboard = async () => {
    try {
      // Try the modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers or blocked API
        const textArea = document.createElement('textarea');
        textArea.value = url;
        // Avoid scrolling to bottom
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      toast({ title: "Link gekopieerd!", description: "Je kunt de link nu plakken." });
    } catch (err) {
      toast({ title: "Kopiëren mislukt", description: "Kon de link niet naar het klembord kopiëren.", variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-semibold mr-2">Deel dit artikel:</span>
      <Button variant="outline" size="sm" asChild>
        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`} target="_blank" rel="noopener noreferrer">
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer">
          <Twitter className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
          <Facebook className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="outline" size="sm" onClick={copyToClipboard}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPost() {
      if (slug) {
          setIsLoading(true);
          const foundPost = await blogService.getPostBySlug(slug);
          setPost(foundPost);
          setIsLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  const handleImageSave = async (newUrl: string) => {
    if (!post) return;
    const updatedPost = { ...post, featuredImageUrl: newUrl };
    await blogService.updatePost(updatedPost);
    setPost(updatedPost); // Update the local state to show the change immediately
    toast({ title: 'Afbeelding opgeslagen!' });
  };


  if (isLoading) {
    // Loading state
    return (
       <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 container mx-auto max-w-3xl py-12 md:py-20 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </main>
          <Footer />
       </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
             <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-6" />
            <h1 className="text-3xl font-bold">Blogpost niet gevonden</h1>
            <p className="text-muted-foreground mt-2">Sorry, we konden dit artikel niet vinden.</p>
            <Button asChild className="mt-6">
              <Link href="/blog">Terug naar de blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Sanitize the HTML content from the post before rendering.
  const sanitizedContent = DOMPurify.sanitize(post.content);

  // Logic for the quiz CTA card
  const isQuizForParent = post.linkedQuizAudience?.toLowerCase().includes('ouder');
  const ctaTitle = isQuizForParent ? "Relevante Vragenlijst voor Ouders" : "Doe de Relevante Zelfreflectie Tool";
  const ctaIcon = isQuizForParent ? UsersIcon : Brain;
  const ctaDescription = isQuizForParent
    ? `Dit artikel gaat hand in hand met de vragenlijst: "${post.linkedQuizTitle}". Krijg als ouder meer inzicht door de vragenlijst nu in te vullen.`
    : `Dit artikel gaat hand in hand met de quiz: "${post.linkedQuizTitle}". Krijg persoonlijk inzicht door de quiz nu te doen.`;
  const ctaButtonText = isQuizForParent ? `Start de "${post.linkedQuizTitle}" vragenlijst` : `Start de "${post.linkedQuizTitle}" quiz`;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20">
        <div className="container mx-auto max-w-3xl">
          <article>
            <header className="mb-8">
                <Button variant="outline" size="sm" asChild className="mb-4">
                  <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Terug naar blog overzicht
                  </Link>
                </Button>
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className={cn("text-xs", getTagClasses(tag))}>{tag}</Badge>
                  ))}
                </div>
                <h1 className="text-4xl font-bold text-foreground leading-tight mb-4">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.authorName}</span>
                    </div>
                    {post.publishedAt && (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(parseISO(post.publishedAt), 'd MMMM yyyy', { locale: nl })}</span>
                        </div>
                    )}
                    {post.linkedQuizId && (
                      <Badge asChild className="cursor-pointer hover:bg-primary/20 transition-colors bg-primary/10 border-primary/30">
                        <Link href={`/quiz/${post.linkedQuizId}`} className="flex items-center gap-2 font-semibold text-primary">
                            <Brain className="h-4 w-4" />
                            <span>Interactieve Quiz Beschikbaar</span>
                        </Link>
                      </Badge>
                    )}
                </div>
            </header>
            
            <EditableImage
              wrapperClassName="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-lg mb-8"
              src={post.featuredImageUrl}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint={post.featuredImageHint}
              priority
              onSave={handleImageSave}
              uploadPath="images/blog"
            />
            
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-headings:font-semibold prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {post.linkedQuizId && post.linkedQuizTitle && (
              <Card className="mt-12 bg-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
 {isQuizForParent ? <UsersIcon className="h-6 w-6" /> : <Brain className="h-6 w-6" />}
                    {ctaTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {ctaDescription}
                  </p>
                   <Button asChild>
                    <Link href={`/quiz/${post.linkedQuizId}`}>
                      {ctaButtonText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="mt-12 pt-8 border-t">
              <ShareButtons title={post.title} url={typeof window !== 'undefined' ? window.location.href : ''} />
            </div>

          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
