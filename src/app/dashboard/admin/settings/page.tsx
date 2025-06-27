// src/app/dashboard/admin/settings/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Users, Shield, Bell, Mail, KeyRound, PlusCircle, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const CORE_ROLES = ['Admin', 'Coach', 'Leerling', 'Tutor', 'Ouder'];

const platformPermissions = [
  { id: 'view_dashboard', label: 'Dashboard bekijken', description: 'Toegang tot het algemene gebruikersdashboard.' },
  { id: 'take_quizzes', label: 'Quizzen maken', description: 'Mogelijkheid om quizzen te starten en te voltooien.' },
  { id: 'view_results', label: 'Eigen resultaten bekijken', description: 'Toegang tot persoonlijke quizresultaten en rapporten.' },
  { id: 'access_coaching', label: 'Toegang tot Coaching Hub', description: 'Gebruik van dagelijkse coaching, dagboek, etc.' },
  { id: 'manage_users', label: 'Gebruikers beheren (Admin)', description: 'Aanmaken, bewerken, verwijderen van alle gebruikers.' },
  { id: 'manage_quizzes_admin', label: 'Quiz content beheren (Admin)', description: 'Maken en aanpassen van alle quizzen.' },
  { id: 'manage_site_content', label: 'Website content beheren (Admin)', description: 'Aanpassen van statische pagina\'s via CMS.' },
  { id: 'view_platform_analytics', label: 'Platform analytics bekijken (Admin)', description: 'Toegang tot algemene site statistieken.' },
  { id: 'manage_tutor_profile', label: 'Eigen tutorprofiel beheren (Tutor)', description: 'Bijwerken van vakken, tarief, beschikbaarheid.' },
  { id: 'manage_coach_profile', label: 'Eigen coachprofiel beheren (Coach)', description: 'Bijwerken van specialisaties, tarief, beschikbaarheid.' }, 
  { id: 'view_student_progress', label: 'Voortgang leerlingen/cliënten bekijken (Tutor/Coach/Ouder)', description: 'Inzicht in de resultaten van gekoppelde leerlingen/cliënten.' },
  { id: 'manage_children_profiles', label: 'Kinderprofielen beheren (Ouder)', description: 'Aanmaken, bewerken van gekoppelde kinderaccounts.' },
  { id: 'manage_children_lessons', label: 'Lessen kinderen beheren (Ouder)', description: 'Plannen en goedkeuren van lessen voor kinderen.' },
  { id: 'manage_family_subscription', label: 'Familie abonnement beheren (Ouder)', description: 'Beheren van betalingen voor gekoppelde kinderen.' },
];

const initialPermissionsState: Record<string, Record<string, boolean>> = {
  'view_dashboard': { 'Admin': true, 'Coach': true, 'Leerling': true, 'Tutor': true, 'Ouder': true },
  'take_quizzes': { 'Admin': false, 'Coach': false, 'Leerling': true, 'Tutor': false, 'Ouder': false }, 
  'view_results': { 'Admin': false, 'Coach': false, 'Leerling': true, 'Tutor': false, 'Ouder': false }, 
  'access_coaching': { 'Admin': true, 'Coach': true, 'Leerling': true, 'Tutor': true, 'Ouder': false }, 
  'manage_users': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'manage_quizzes_admin': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'manage_site_content': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'view_platform_analytics': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'manage_tutor_profile': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': true, 'Ouder': false },
  'manage_coach_profile': { 'Admin': true, 'Coach': true, 'Leerling': false, 'Tutor': false, 'Ouder': false }, 
  'view_student_progress': { 'Admin': true, 'Coach': true, 'Leerling': false, 'Tutor': true, 'Ouder': true }, 
  'manage_children_profiles': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': true },
  'manage_children_lessons': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': true },
  'manage_family_subscription': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': true },
};

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [platformName, setPlatformName] = useState("MindNavigator");

  const [roles, setRoles] = useState<string[]>(CORE_ROLES);
  const [permissions, setPermissions] = useState(initialPermissionsState);
  const [newRoleName, setNewRoleName] = useState('');

  const handleAddRole = () => {
    const trimmedName = newRoleName.trim();
    if (!trimmedName) {
      toast({ title: "Fout", description: "Rolnaam mag niet leeg zijn.", variant: "destructive" });
      return;
    }
    if (roles.some(role => role.toLowerCase() === trimmedName.toLowerCase())) {
      toast({ title: "Fout", description: "Deze rol bestaat al.", variant: "destructive" });
      return;
    }
    setRoles(prev => [...prev, trimmedName]);
    setNewRoleName('');
    toast({ title: "Rol Toegevoegd", description: `De rol "${trimmedName}" is toegevoegd.` });
  };

  const handleRemoveRole = (roleToRemove: string) => {
    if (CORE_ROLES.includes(roleToRemove)) {
      toast({ title: "Actie niet toegestaan", description: `De kernrol "${roleToRemove}" kan niet worden verwijderd.`, variant: "destructive" });
      return;
    }
    setRoles(prev => prev.filter(role => role !== roleToRemove));
    toast({ title: "Rol Verwijderd", description: `De rol "${roleToRemove}" is verwijderd.` });
  };
  
  const handlePermissionChange = (permissionId: string, role: string, isChecked: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [permissionId]: {
        ...prev[permissionId],
        [role]: isChecked
      }
    }));
  };

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
        </TabsContent>

        <TabsContent value="roles">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Rollen &amp; Permissies Beheer</CardTitle>
              <CardDescription>Definieer wat verschillende gebruikersrollen kunnen zien en doen.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                <Label htmlFor="new-role-name">Nieuwe Rol Toevoegen</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    id="new-role-name"
                    placeholder="Bijv. Content Manager"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRole(); }}}
                  />
                  <Button type="button" onClick={handleAddRole}><PlusCircle className="mr-2 h-4 w-4" /> Toevoegen</Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Permissie / Feature</TableHead>
                      {roles.map(role => (
                        <TableHead key={role} className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            {role}
                            {!CORE_ROLES.includes(role) && (
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveRole(role)}>
                                <Trash2 className="h-3 w-3 text-destructive" />
                                <span className="sr-only">Verwijder rol {role}</span>
                              </Button>
                            )}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {platformPermissions.map(permission => (
                      <TableRow key={permission.id}>
                        <TableCell>
                          <p className="font-medium">{permission.label}</p>
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        </TableCell>
                        {roles.map(role => (
                          <TableCell key={`${permission.id}-${role}`} className="text-center">
                            <Checkbox 
                              checked={permissions[permission.id]?.[role] || false}
                              onCheckedChange={(checked) => handlePermissionChange(permission.id, role, !!checked)}
                              aria-label={`Permissie ${permission.label} voor rol ${role}`}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
             <CardFooter className="border-t pt-6">
              <Button disabled>Permissies Opslaan (binnenkort)</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
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
        </TabsContent>
        
        <TabsContent value="security">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
