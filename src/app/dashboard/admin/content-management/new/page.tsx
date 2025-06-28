// src/app/dashboard/admin/content-management/new/page.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilePlus, ArrowLeft, Save } from '@/lib/icons';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { WysiwygEditor } from '@/components/common/WysiwygEditor';

export default function NewContentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // Now stores HTML

  const handleSave = () => {
    console.log("Nieuwe pagina opslaan (simulatie):", { slug, title, content });
    localStorage.setItem(`cms_page_${slug}`, JSON.stringify({ title, content, slug }));

    toast({
      title: "Pagina Opgeslagen (Simulatie)",
      description: `De pagina "${title}" met slug "/p/${slug}" is aangemaakt (lokaal opgeslagen).`,
    });
    router.push(`/p/${slug}`);
  };

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <FilePlus className="h-8 w-8 text-primary" />
          Nieuwe Content Pagina
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/content-management">
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Overzicht
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pagina Details</CardTitle>
          <CardDescription>Vul de details voor de nieuwe content pagina in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="pageSlug">Slug (URL-pad)</Label>
            <Input 
              id="pageSlug" 
              placeholder="bijv. over-ons-team (wordt /p/over-ons-team)" 
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              De unieke identifier voor de URL. Gebruik alleen kleine letters, cijfers en koppeltekens.
            </p>
          </div>
          <div>
            <Label htmlFor="pageTitle">Paginatitel</Label>
            <Input 
              id="pageTitle" 
              placeholder="Bijv. Ons Geweldige Team" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="pageContent">Pagina Inhoud</Label>
            <WysiwygEditor 
                value={content}
                onChange={setContent}
                placeholder="Typ hier de inhoud van de pagina..."
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={!slug || !title || !content}>
            <Save className="mr-2 h-4 w-4" /> Pagina Opslaan (Simulatie)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
