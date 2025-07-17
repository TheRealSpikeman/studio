// src/app/maintenance/page.tsx
import { SiteLogo } from '@/components/common/site-logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-8 left-8">
        <SiteLogo />
      </div>
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Wrench className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl font-bold">We zijn zo terug!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            MindNavigator is momenteel in onderhoud om de ervaring voor u te verbeteren.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/90">
            We werken hard om alles zo snel mogelijk weer online te krijgen. Probeer het over een paar minuten opnieuw.
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Bedankt voor uw geduld!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
