// src/app/blog/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Rss, Search, Calendar, User, BookOpenCheck } from '@/lib/icons';
import type { BlogPost } from '@/types/blog';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { initialBlogPosts } from '@/lib/data/blog-data';

const LOCAL_STORAGE_KEY = 'mindnavigator_blog_posts';

const BlogPostCard = ({ post }: { post: BlogPost }) => {
  const calculateReadingTime = (content: string): string => {
    // Strip HTML tags and count words
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(Boolean).length;
    const wpm = 225; // Average reading speed
    const minutes = Math.ceil(words / wpm);
    return `${minutes} min. leestijd`;
  };

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src={post.featuredImageUrl}
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint={post.featuredImageHint}
          />
        </div>
      </Link>
      <CardHeader>
        <div className="flex flex-wrap gap-1 mb-2">
          {post.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
        <CardTitle className="text-xl font-semibold">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{post.authorName}</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpenCheck className="h-4 w-4" />
          <span>{calculateReadingTime(post.content)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPosts) {
        setAllPosts(JSON.parse(storedPosts));
      } else {
        setAllPosts(initialBlogPosts);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialBlogPosts));
      }
    } catch (error) {
      console.error("Error loading blog posts:", error);
      setAllPosts(initialBlogPosts);
    }
    setIsLoading(false);
  }, []);

  const filteredAndPublishedPosts = allPosts.filter(
    post =>
      post.status === 'published' &&
      (searchTerm === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 md:mb-16">
            <Rss className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold text-foreground">MindNavigator Blog</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Inzichten, tips en verhalen over neurodiversiteit voor jongeren en ouders.
            </p>
          </div>
          <div className="mb-8 max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Zoek in blogposts..."
                className="pl-10 h-12"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {isLoading ? (
            <p>Blogposts laden...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndPublishedPosts.map(post => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
              {filteredAndPublishedPosts.length === 0 && (
                <p className="text-center text-muted-foreground mt-10">Geen blogposts gevonden die voldoen aan uw zoekopdracht.</p>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
