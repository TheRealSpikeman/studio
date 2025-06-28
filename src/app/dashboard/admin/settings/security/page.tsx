// src/app/dashboard/admin/settings/security/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Shield, KeyRound } from '@/lib/icons';
import { Badge } from '@/components/ui/badge';

export default function AdminSecurityPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Beveiliging
        </h1>
        <p className="text-muted-foreground">
          Beheer hier API-sleutels, integraties en beveiligingsprotocollen.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Beveiligingsinstellingen <Badge variant="outline" className="text-amber-600 border-amber-400">Binnenkort</Badge></CardTitle>
          <CardDescription>Beheer API-sleutels, integraties en beveiligingsprotocollen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="apiKeys">API Sleutels</Label>
                <Button variant="outline" className="w-full mt-1" disabled><KeyRound className="mr-2 h-4 w-4" />Beheer API Sleutels</Button>
            </div>
             <div>
                <Label htmlFor="auditLog">Audit Log</Label>
                <Button variant="outline" className="w-full mt-1" disabled>Bekijk Audit Log</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
