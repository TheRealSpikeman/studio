// src/app/dashboard/admin/blog/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash2, PlusCircle, Rss } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import type { BlogPost } from '@/types/blog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';

// Dummy Data - In a real app, this would be fetched from Firestore
const dummyBlogPosts: BlogPost[] = [
  {
    id: '1', slug: 'hoe-help-ik-mijn-tiener-focussen', title: 'Hoe help ik mijn tiener focussen?',
    excerpt: 'Ontdek 5 concrete, direct toepasbare tips...',
    content: '...', authorId: 'admin1', authorName: 'Dr. Florentine Sage',
    featuredImageUrl: 'https://placehold.co/600x400.png', featuredImageHint: 'teenager studying focused',
    status: 'published', tags: ['Focus', 'Ouders'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '2', slug: 'de-kracht-van-neurodiversiteit', title: 'De Kracht van Anders Denken',
    excerpt: 'Waarom neurodiversiteit een voordeel is.',
    content: '...', authorId: 'admin2', authorName: 'Team MindNavigator',
    featuredImageUrl: 'https://placehold.co/600x400.png', featuredImageHint: 'diverse brains connection',
    status: 'published', tags: ['Neurodiversiteit', 'Inspiratie'],
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: '3', slug: 'volgende-artikel', title: 'Volgende Artikel (Concept)',
    excerpt: 'Dit is een concept en nog niet zichtbaar voor publiek.',
    content: '...', authorId: 'admin1', authorName: 'Dr. Florentine Sage',
    featuredImageUrl: 'https://placehold.co/600x400.png', featuredImageHint: 'writing desk notes',
    status: 'draft', tags: ['Concept'],
    createdAt: new Date().toISOString(),
  },
];

export default function BlogManagementPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>(dummyBlogPosts);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  const handleDelete = () => {
    if (postToDelete) {
      setPosts(posts.filter(p => p.id !== postToDelete.id));
      toast({ title: "Blogpost verwijderd", description: `"${postToDelete.title}" is verwijderd.` });
      setPostToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Rss className="h-6 w-6 text-primary" />
                  Blogbeheer
                </CardTitle>
                <CardDescription>
                  Beheer, bewerk en publiceer hier alle blogartikelen.
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/dashboard/admin/blog/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> Nieuw Artikel
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Publicatiedatum</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
                        {post.status === 'published' ? 'Gepubliceerd' : 'Concept'}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.authorName}</TableCell>
                    <TableCell>
                      {post.publishedAt ? format(parseISO(post.publishedAt), 'dd-MM-yyyy', { locale: nl }) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => alert('Bewerken nog niet geïmplementeerd')}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setPostToDelete(post)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Dit zal het artikel "{postToDelete?.title}" permanent verwijderen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Ja, verwijder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
