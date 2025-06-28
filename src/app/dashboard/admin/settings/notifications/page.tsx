// src/app/dashboard/admin/settings/notifications/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail } from '@/lib/icons';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export default function AdminNotificationsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            Notificaties
        </h1>
        <p className="text-muted-foreground">
          Beheer hier de e-mailnotificaties en templates van het platform.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Notificatie &amp; E-mail Templates <Badge variant="outline" className="text-amber-600 border-amber-400">Binnenkort</Badge></CardTitle>
          <CardDescription>
            Overzicht van typen automatische e-mails. Het daadwerkelijke beheer van templates en verzending zal waarschijnlijk via een gespecialiseerde externe dienst (bijv. SendGrid, Hubspot) verlopen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="adminNotifications" className="text-base">Admin Notificaties</Label>
                    <p className="text-sm text-muted-foreground">
                        Ontvang e-mails voor belangrijke platformgebeurtenissen (nieuwe aanmeldingen, etc.).
                    </p>
                </div>
                <Switch id="adminNotifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>
            <Button variant="outline" disabled><Mail className="mr-2 h-4 w-4" /> Beheer E-mail Templates (Concept)</Button>
             <p className="text-xs text-muted-foreground italic">
              Voorbeelden van e-mails die verstuurd moeten worden: registratiebevestiging, wachtwoord reset, ouderlijke goedkeuring, lesbevestigingen, notificatie voltooid assessment, etc.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
