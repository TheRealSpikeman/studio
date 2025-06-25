
// src/app/for-parents/voorbeeld-analyse-rapport/page.tsx
"use client";

import React, { Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    ArrowLeft, Download, Bot
} from 'lucide-react';

function VoorbeeldAnalyseRapportPageContent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/5 to-background py-12 md:py-16 lg:py-20">
        <div className="container mx-auto max-w-3xl">
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" asChild>
              <Link href="/for-parents/vergelijkende-analyse">
                <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar uitleg
              </Link>
            </Button>
            <Button asChild>
              <Link href="/report/comparative-analysis" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" /> Open Rapport & Sla op als PDF
              </Link>
            </Button>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="text-center pb-8">
              <Bot className="mx-auto h-16 w-16 text-primary mb-4" />
              <CardTitle className="text-3xl font-bold text-foreground">
                Voorbeeld Vergelijkende Analyse
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Een voorproefje van het rapport dat u kunt genereren.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <p className="text-center text-muted-foreground">Klik op 'Open Rapport & Sla op als PDF' hierboven om een printvriendelijke versie te openen. U kunt deze vervolgens opslaan als PDF via de print-dialoog van uw browser (Ctrl+P of Cmd+P).</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function VoorbeeldAnalyseRapportPageWrapper() {
  return (
    <Suspense fallback={<div>Rapport laden...</div>}>
      <VoorbeeldAnalyseRapportPageContent />
    </Suspense>
  );
}
