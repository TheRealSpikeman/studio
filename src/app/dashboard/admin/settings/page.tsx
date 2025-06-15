
// src/app/dashboard/admin/settings/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Users, Shield, Bell, Mail, KeyRound } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';

export default function AdminSettingsPage() {
  // Dummy state for example purposes
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [platformName, setPlatformName] = useState("MindNavigator");

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">Platform Instellingen</h1>
        <p className="text-muted-foreground">
          Beheer algemene platforminstellingen, e-mail templates, rollen en permissies.
        </p>
      </section>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <TabsTrigger value="general"><Settings className="mr-2 h-4 w-4" />Algemeen</TabsTrigger>
          <TabsTrigger value="roles"><Users className="mr-2 h-4 w-4" />Rollen &amp; Permissies</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" />Notificaties</TabsTrigger>
          <TabsTrigger value="security"><Shield className="mr-2 h-4 w-4" />Beveiliging</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Algemene Instellingen</CardTitle>
              <CardDescription>Basisconfiguratie van het platform.</CardDescription>
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
                <Switch id="maintenanceMode" disabled />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled>Opslaan</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Rollen &amp; Permissies Beheer</CardTitle>
              <CardDescription>Definieer wat verschillende gebruikersrollen kunnen zien en doen.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground italic">Interface voor rollenbeheer (placeholder)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Notificatie &amp; E-mail Templates</CardTitle>
              <CardDescription>Beheer de inhoud van automatische e-mails en notificaties.</CardDescription>
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
                <Button variant="outline" disabled><Mail className="mr-2 h-4 w-4" /> Beheer E-mail Templates</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Beveiligingsinstellingen</CardTitle>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

