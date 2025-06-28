// src/app/dashboard/admin/blog/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash2, PlusCircle, Rss, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import type { BlogPost } from '@/types/blog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { initialBlogPosts } from '@/lib/data/blog-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


const LOCAL_STORAGE_KEY = 'mindnavigator_blog_posts';

export default function BlogManagementPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        // Load initial data if nothing is in localStorage
        setPosts(initialBlogPosts);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialBlogPosts));
      }
    } catch (error) {
      console.error("Error loading blog posts from localStorage:", error);
      setPosts(initialBlogPosts); // Fallback to initial data
    }
    setIsLoading(false);
  }, []);

  const handleDelete = () => {
    if (postToDelete) {
      const updatedPosts = posts.filter(p => p.id !== postToDelete.id);
      setPosts(updatedPosts);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPosts));
      toast({ title: "Blogpost verwijderd", description: `"${postToDelete.title}" is verwijderd.` });
      setPostToDelete(null);
    }
  };

  if (isLoading) {
    return <div>Blogposts laden...</div>;
  }

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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Acties voor {post.title}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/admin/blog/edit/${post.id}`}>
                              <Edit className="mr-2 h-4 w-4" /> Bewerken
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="mr-2 h-4 w-4" /> Bekijk op site
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setPostToDelete(post)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Verwijderen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
