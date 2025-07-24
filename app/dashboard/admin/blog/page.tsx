// src/app/dashboard/admin/blog/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash2, PlusCircle, Rss, Eye, ListChecks, Brain, Loader2 } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import type { BlogPost } from '@/types/blog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { blogService } from '@/services/blogService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function BlogManagementPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    const allPosts = await blogService.getAllPosts();
    setPosts(allPosts);
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async () => {
    if (postToDelete) {
      await blogService.deletePost(postToDelete.id);
      await fetchPosts(); // Re-fetch after delete
      
      toast({ 
        title: "Blogpost verwijderd", 
        description: `"${postToDelete.title}" is verwijderd.` 
      });
      setPostToDelete(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
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
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                 <Button asChild variant="outline">
                  <Link href="/dashboard/admin/blog/tags">
                    <ListChecks className="mr-2 h-4 w-4" /> Beheer Tags
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/dashboard/admin/blog/new">
                    <PlusCircle className="mr-2 h-4 w-4" /> Nieuw Artikel
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Quiz</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Publicatiedatum</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 && <TableRow><TableCell colSpan={6} className="h-24 text-center">Nog geen blogartikelen. Voeg er een toe om te beginnen.</TableCell></TableRow>}
                {posts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <span>{post.title}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
                        {post.status === 'published' ? 'Gepubliceerd' : 'Concept'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {post.linkedQuizId && (
                        <Brain
                          className="h-5 w-5 text-primary mx-auto"
                        />
                      )}
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