// src/app/blog/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Rss, Search, BookOpenCheck, Brain, Loader2, ArrowRight } from '@/lib/icons';
import type { BlogPost } from '@/types/blog';
import { cn } from '@/lib/utils';
import { blogService } from '@/services/blogService';
import { EditableImage } from '@/components/common/EditableImage';
import { useToast } from '@/hooks/use-toast';

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


const BlogPostCard = ({ post, onPostUpdate }: { post: BlogPost; onPostUpdate: (updatedPost: BlogPost) => void; }) => {
  const { toast } = useToast();
  
  const calculateReadingTime = (content: string): string => {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(Boolean).length;
    const wpm = 225;
    const minutes = Math.ceil(words / wpm);
    return `${minutes} min. leestijd`;
  };

  const handleImageSave = async (newUrl: string) => {
    const updatedPost = { ...post, featuredImageUrl: newUrl };
    await blogService.updatePost(updatedPost);
    onPostUpdate(updatedPost); // Notify parent to update state
    toast({ title: 'Afbeelding opgeslagen!' });
  };


  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <EditableImage
          wrapperClassName="relative w-full aspect-[16/9]"
          src={post.featuredImageUrl}
          alt={post.title}
          fill
          style={{ objectFit: 'cover' }}
          data-ai-hint={post.featuredImageHint}
          onSave={handleImageSave}
          uploadPath="images/blog"
        />
      <CardHeader>
        <div className="flex flex-wrap gap-2 mb-2">
          {post.tags.map(tag => (
            <Badge key={tag} variant="outline" className={cn("text-xs", getTagClasses(tag))}>{tag}</Badge>
          ))}
        </div>
        <CardTitle className="text-xl font-semibold">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-2" title={`Auteur: ${post.authorName}`}>
          <Rss className="h-4 w-4" />
          <span>{post.authorName}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
              <BookOpenCheck className="h-4 w-4" />
              <span>{calculateReadingTime(post.content)}</span>
          </div>
          {post.linkedQuizId && (
              <div className="flex items-center gap-1 text-primary font-semibold">
                  <Brain className="h-4 w-4" />
              </div>
          )}
           <Button asChild variant="link" className="p-0 h-auto text-primary text-xs">
              <Link href={`/blog/${post.slug}`} className="flex items-center gap-1">
                  Lees meer
                  <ArrowRight className="h-3.5 w-3.5" />
              </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        const posts = await blogService.getAllPosts();
        setAllPosts(posts);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
        setError("Er is een fout opgetreden bij het laden van blogposts.");
        setAllPosts([]); // Clear posts on error
      } finally {
        setIsLoading(false);
        }
    }
    fetchPosts();
 }, []);
  
  const handlePostUpdate = (updatedPost: BlogPost) => {
    setAllPosts(prevPosts => 
        prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p)
    );
  };

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
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : (
            <>
              {error && (
                <div className="text-center text-red-500 mt-4">{error}</div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndPublishedPosts.map(post => (
                  <BlogPostCard key={post.id} post={post} onPostUpdate={handlePostUpdate} />
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
