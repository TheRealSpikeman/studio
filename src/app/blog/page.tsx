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
import { Rss, Search, ArrowRight, Calendar, User } from 'lucide-react';
import type { BlogPost } from '@/types/blog';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

// Dummy Data - In a real app, this would be fetched from Firestore
const dummyBlogPosts: BlogPost[] = [
  {
    id: '1', slug: 'hoe-help-ik-mijn-tiener-focussen', title: 'Hoe help ik mijn tiener focussen in een wereld vol afleiding?',
    excerpt: 'In de digitale wereld van vandaag is focus een superkracht. Ontdek 5 concrete, direct toepasbare tips om uw tiener te helpen de concentratie te verbeteren en schoolwerk effectiever aan te pakken.',
    content: 'Volledige markdown content hier...', authorId: 'admin1', authorName: 'Dr. Florentine Sage',
    featuredImageUrl: 'https://placehold.co/600x400.png', featuredImageHint: 'teenager studying focused',
    status: 'published', tags: ['Focus', 'Ouders', 'Studietips'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '2', slug: 'de-kracht-van-neurodiversiteit', title: 'De Kracht van Anders Denken: Waarom Neurodiversiteit een Voordeel is',
    excerpt: 'Neurodiversiteit is meer dan een label; het is een unieke manier van de wereld zien. We duiken in de sterke kanten die vaak gepaard gaan met ADHD, autisme en hoogsensitiviteit.',
    content: 'Volledige markdown content hier...', authorId: 'admin2', authorName: 'Team MindNavigator',
    featuredImageUrl: 'https://placehold.co/600x400.png', featuredImageHint: 'diverse brains connection',
    status: 'published', tags: ['Neurodiversiteit', 'Inspiratie'],
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: '3', slug: 'open-gesprek-over-mentale-gezondheid', title: 'Het open gesprek over mentale gezondheid: 3 tips voor ouders',
    excerpt: 'Praten over gevoelens kan lastig zijn. Met deze 3 tips opent u op een laagdrempelige manier het gesprek met uw tiener over hun mentale welzijn en eventuele zorgen.',
    content: 'Volledige markdown content hier...', authorId: 'admin1', authorName: 'Dr. Florentine Sage',
    featuredImageUrl: 'https://placehold.co/600x400.png', featuredImageHint: 'parent child conversation',
    status: 'published', tags: ['Communicatie', 'Ouders', 'Mentale Gezondheid'],
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
];

const BlogPostCard = ({ post }: { post: BlogPost }) => {
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
          <Calendar className="h-4 w-4" />
          {post.publishedAt && <span>{format(parseISO(post.publishedAt), 'd MMM yyyy', { locale: nl })}</span>}
        </div>
      </CardFooter>
    </Card>
  );
};

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(dummyBlogPosts);

  useEffect(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = dummyBlogPosts.filter(
      post =>
        post.title.toLowerCase().includes(lowerCaseSearch) ||
        post.excerpt.toLowerCase().includes(lowerCaseSearch) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearch))
    );
    setFilteredPosts(filtered);
  }, [searchTerm]);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <p className="text-center text-muted-foreground mt-10">Geen blogposts gevonden die voldoen aan uw zoekopdracht.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
