
"use client";

import { Button } from '@/components/ui/button';
import { SiteLogo } from '@/components/common/site-logo';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function OuderSymptomenCheckPage() {
  // Placeholder content - Quiz logic will be added later
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pt-16 md:pt-24 pb-16">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <Card className="w-full max-w-2xl text-center shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">Symptomen Check (voor Ouders)</CardTitle>
          <CardDescription>
            Deze quiz is momenteel in ontwikkeling. Hier beantwoordt u binnenkort 15 vragen over het gedrag en de kenmerken van uw kind om een eerste indicatie te krijgen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">Kom binnenkort terug om deze quiz te doen!</p>
          <Button asChild variant="outline">
            <Link href="/">Terug naar Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
