
"use client";

import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function OuderSymptomenCheckResultsPage() {
  // Placeholder content - Results logic will be added later
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-16 md:pt-24 pb-16">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <Card className="w-full max-w-2xl text-center shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">Resultaten Symptomen Check (Ouders)</CardTitle>
          <CardDescription>
            De resultatenpagina voor deze quiz is momenteel in ontwikkeling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Hier zult u binnenkort een samenvatting zien van uw observaties en suggesties voor vervolgstappen.
          </p>
          <Button asChild variant="outline">
            <Link href="/quiz/ouder-symptomen-check">Terug naar Quiz</Link>
          </Button>
           <Button asChild className="ml-2">
            <Link href="/">Naar Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
