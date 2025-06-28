// src/app/dashboard/admin/settings/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings } from '@/lib/icons';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export default function AdminGeneralSettingsPage() {
  const [platformName, setPlatformName] = useState("MindNavigator");

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Algemene Instellingen
        </h1>
        <p className="text-muted-foreground">
          Beheer hier de basisconfiguratie van het platform.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Basisconfiguratie</CardTitle>
          <CardDescription>Algemene instellingen die van invloed zijn op het hele platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="platformName">Platform Naam</Label>
            <Input id="platformName" value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="maintenanceMode" className="text-base">Onderhoudsmodus</Label>
              <p className="text-sm text-muted-foreground">
                Schakel onderhoudsmodus in om tijdelijk toegang tot het platform te beperken.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-amber-600 border-amber-400">Binnenkort</Badge>
              <Switch id="maintenanceMode" disabled />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled>Opslaan</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
