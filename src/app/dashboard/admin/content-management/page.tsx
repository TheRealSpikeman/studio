// src/app/dashboard/admin/content-management/page.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileEdit, PlusCircle, FileText } from 'lucide-react';
import Link from 'next/link';

export default function ContentManagementPage() {
  // In a real CMS, you would fetch and display a list of pages here.
  const dummyPages = [
    { id: '1', title: 'Over Ons (voorbeeld)', slug: 'about', lastModified: '2024-05-10' },
    { id: '2', title: 'Contactpagina (voorbeeld)', slug: 'contact', lastModified: '2024-05-09' },
    { id: '3', title: 'Onze Missie (voorbeeld dynamisch)', slug: 'onze-missie', lastModified: '2024-05-15' },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <FileEdit className="h-6 w-6 text-primary" />
                Content Management
              </CardTitle>
              <CardDescription>
                Beheer hier eenvoudige content pagina's van de website.
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/admin/content-management/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Pagina Toevoegen
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary"/>
            Bestaande Pagina's (Voorbeeld)
          </h3>
          {dummyPages.length > 0 ? (
            <ul className="space-y-3">
              {dummyPages.map((page) => (
                <li key={page.id} className="p-3 border rounded-md flex justify-between items-center hover:bg-muted/50">
                  <div>
                    <Link href={`/p/${page.slug}`} className="font-medium text-primary hover:underline" target="_blank">
                      {page.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">Slug: /p/{page.slug} | Laatst gewijzigd: {page.lastModified}</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Bewerken (binnenkort)
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Nog geen pagina's aangemaakt.</p>
          )}
          <p className="mt-6 text-sm text-muted-foreground italic">
            Deze sectie is een startpunt. Een volledig CMS met bewerkfunctionaliteit, versies, en meer kan hier in de toekomst worden geïntegreerd.
            Pagina's die hier worden toegevoegd, zullen beschikbaar zijn via de URL structuur `/p/[slug]`.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
