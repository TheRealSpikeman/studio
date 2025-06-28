// src/app/blog/[slug]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Rss, Calendar, User, Facebook, Twitter, Linkedin, Copy, ArrowLeft, AlertTriangle } from '@/lib/icons';
import type { BlogPost } from '@/types/blog';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { initialBlogPosts } from '@/lib/data/blog-data';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

const LOCAL_STORAGE_KEY = 'mindnavigator_blog_posts';

const ShareButtons = ({ title, url }: { title: string, url: string }) => {
  const { toast } = useToast();
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: "Link gekopieerd!", description: "Je kunt de link nu plakken." });
    }, (err) => {
      toast({ title: "Kopiëren mislukt", description: "Kon de link niet naar het klembord kopiëren.", variant: "destructive" });
    });
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
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedPostsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const allPosts = storedPostsRaw ? JSON.parse(storedPostsRaw) : initialBlogPosts;
      const foundPost = allPosts.find((p: BlogPost) => p.slug === slug);
      setPost(foundPost || null);
    } catch (error) {
      console.error("Error loading blog post from localStorage:", error);
      setPost(null);
    }
    setIsLoading(false);
  }, [slug]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Laden...</div>;
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

  // Check if content is likely markdown or already HTML to support both formats.
  let htmlContent = post.content;
  const isLikelyHtml = /<[a-z][\s\S]*>/i.test(post.content);
  if (!isLikelyHtml) {
    // It looks like markdown, so parse it.
    htmlContent = marked.parse(post.content) as string;
  }
  
  // Sanitize the final HTML content before rendering.
  const sanitizedContent = DOMPurify.sanitize(htmlContent);

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
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <h1 className="text-4xl font-bold text-foreground leading-tight mb-4">{post.title}</h1>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
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
                </div>
            </header>
            
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-lg mb-8">
              <Image
                src={post.featuredImageUrl}
                alt={post.title}
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint={post.featuredImageHint}
                priority
              />
            </div>
            
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-headings:font-semibold prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

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
