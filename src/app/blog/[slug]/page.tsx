
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

const LOCAL_STORAGE_KEY = 'mindnavigator_blog_posts';

function markdownToHtml(markdown: string): string {
  if (typeof markdown !== 'string') return '';

  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    // Unordered list items
    .replace(/^\s*\*\s+(.*$)/gim, '<li>$1</li>');

  // Group consecutive list items into a single <ul>
  html = html.replace(/<\/li>\n<li>/g, '</li><li>'); 
  html = html.replace(/(<li>(.*?)<\/li>)/gs, '<ul>$1</ul>'); 
  html = html.replace(/<\/ul>\n<ul>/g, ''); // Clean up multiple <ul> tags

  // Paragraphs and line breaks
  html = html.split(/\n\s*\n/).map(block => {
    if (block.trim().startsWith('<h') || block.trim().startsWith('<ul')) {
      return block; // Pass through existing HTML blocks
    }
    if (block.trim() === '') {
      return '';
    }
    // For paragraphs, convert single newlines to <br>
    const pContent = block.trim().replace(/\n/g, '<br />');
    return `<p>${pContent}</p>`;
  }).join('');

  // Inline styling after block-level elements are set
  html = html
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Add styling classes
  html = html
    .replace(/<h2>/g, '<h2 class="text-2xl font-bold mt-8 mb-4 border-b pb-2">')
    .replace(/<h3>/g, '<h3 class="text-xl font-semibold mt-6 mb-3">')
    .replace(/<ul>/g, '<ul class="list-disc list-inside space-y-2 mb-4">')
    .replace(/<p>/g, '<p class="mb-4 leading-relaxed">');

  return html;
}

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
    // In a real app, this would be fetched from a DB. For demo, we use localStorage.
    setIsLoading(true);
    try {
      const storedPostsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const allPosts = storedPostsRaw ? JSON.parse(storedPostsRaw) : initialBlogPosts;
      const foundPost = allPosts.find((p: BlogPost) => p.slug === slug && p.status === 'published');
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
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
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
