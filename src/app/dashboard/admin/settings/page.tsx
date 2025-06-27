// src/app/dashboard/admin/settings/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Users, Shield, Bell, Mail, KeyRound, PlusCircle, Trash2, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const CORE_ROLES = ['Admin', 'Coach', 'Leerling', 'Tutor', 'Ouder'];

// New, more comprehensive permissions list
const platformPermissions = [
  // Algemeen
  { id: 'view_dashboard', label: 'Dashboard bekijken', description: 'Toegang tot het eigen rol-specifieke dashboard.', section: 'Algemeen' },
  { id: 'manage_own_profile', label: 'Eigen profiel beheren', description: 'Persoonlijke gegevens en wachtwoord aanpassen.' },

  // Leerling
  { id: 'take_quizzes', label: 'Zelfreflectie tools gebruiken', description: 'Quizzen en assessments starten en voltooien.', section: 'Leerling' },
  { id: 'view_own_results', label: 'Eigen resultaten & voortgang inzien', description: 'Toegang tot persoonlijke rapporten en analyses.' },
  { id: 'access_coaching_hub', label: 'Toegang tot Coaching Hub', description: 'Gebruik van dagboek, dagelijkse tips en aanbevolen tools.' },
  { id: 'use_community_forum', label: 'Community Forum gebruiken', description: 'Berichten lezen en plaatsen in de community.' },

  // Ouder
  { id: 'manage_children', label: 'Kinderen beheren', description: 'Kinderprofielen aanmaken, bewerken en uitnodigen.', section: 'Ouder' },
  { id: 'view_child_progress', label: 'Voortgang kinderen inzien', description: 'Inzichten en rapporten van gekoppelde kinderen bekijken (met toestemming).' },
  { id: 'manage_subscriptions', label: 'Abonnementen & facturatie beheren', description: 'Familieabonnement en betalingen beheren.' },
  { id: 'manage_lessons_for_child', label: 'Lessen voor kind plannen/beheren', description: 'Sessies met tutors/coaches plannen, verzetten en annuleren.' },
  { id: 'find_professionals', label: 'Professionals zoeken & koppelen', description: 'Tutors en coaches zoeken en aan kinderen koppelen.' },
  { id: 'communicate_with_professionals', label: 'Communiceren met professionals', description: 'Berichten sturen naar gekoppelde tutors en coaches.' },

  // Professionals (Tutor/Coach)
  { id: 'manage_professional_profile', label: 'Eigen professioneel profiel beheren', description: 'Beschikbaarheid, tarieven en specialisaties aanpassen.', section: 'Professionals' },
  { id: 'view_client_data', label: 'Data van gekoppelde cliënten inzien', description: 'Toegang tot de gegevens van leerlingen/cliënten die toestemming hebben gegeven.' },
  { id: 'manage_own_sessions', label: 'Eigen sessies/lessen beheren', description: 'Sessies accepteren, afronden en verslagen schrijven.' },

  // Admin
  { id: 'manage_all_users', label: '[A] Alle gebruikers beheren', description: 'Alle gebruikersaccounts inzien, bewerken en verwijderen.', section: 'Admin' },
  { id: 'manage_all_quizzes', label: '[A] Alle quizzen beheren', description: 'Quizzen aanmaken, aanpassen, en de vragenbank beheren.' },
  { id: 'manage_all_content', label: '[A] Alle website content beheren', description: 'Statische pagina\'s en algemene teksten aanpassen.' },
  { id: 'manage_platform_features', label: '[A] Platform features beheren', description: 'Features en functionaliteiten aan/uit zetten.' },
  { id: 'manage_platform_tools', label: '[A] Platform tools beheren', description: 'Aanmaken en beheren van tools zoals de Focus Timer.' },
  { id: 'manage_platform_subscriptions', label: '[A] Platform abonnementen beheren', description: 'Abonnementen, prijzen en features configureren.' },
  { id: 'view_all_analytics', label: '[A] Alle platform analytics bekijken', description: 'Toegang tot alle statistieken en rapportages.' },
  { id: 'view_platform_finances', label: '[A] Financiën platform bekijken', description: 'Inzicht in omzet, betalingen en uitbetalingen.' },
];

const initialPermissionsState: Record<string, Record<string, boolean>> = {
  // General
  'view_dashboard': { 'Admin': true, 'Coach': true, 'Leerling': true, 'Tutor': true, 'Ouder': true },
  'manage_own_profile': { 'Admin': true, 'Coach': true, 'Leerling': true, 'Tutor': true, 'Ouder': true },
  // Leerling
  'take_quizzes': { 'Admin': false, 'Coach': false, 'Leerling': true, 'Tutor': false, 'Ouder': false },
  'view_own_results': { 'Admin': false, 'Coach': false, 'Leerling': true, 'Tutor': false, 'Ouder': false },
  'access_coaching_hub': { 'Admin': false, 'Coach': false, 'Leerling': true, 'Tutor': false, 'Ouder': false },
  'use_community_forum': { 'Admin': false, 'Coach': false, 'Leerling': true, 'Tutor': false, 'Ouder': false },
  // Ouder
  'manage_children': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': true },
  'view_child_progress': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': true },
  'manage_subscriptions': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': true },
  'manage_lessons_for_child': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': true },
  'find_professionals': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': true },
  'communicate_with_professionals': { 'Admin': false, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': true },
  // Professionals
  'manage_professional_profile': { 'Admin': true, 'Coach': true, 'Leerling': false, 'Tutor': true, 'Ouder': false },
  'view_client_data': { 'Admin': true, 'Coach': true, 'Leerling': false, 'Tutor': true, 'Ouder': false },
  'manage_own_sessions': { 'Admin': true, 'Coach': true, 'Leerling': false, 'Tutor': true, 'Ouder': false },
  // Admin
  'manage_all_users': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'manage_all_quizzes': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'manage_all_content': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'manage_platform_features': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'manage_platform_tools': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'manage_platform_subscriptions': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'view_all_analytics': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'view_platform_finances': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
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

  const handleRestoreDefaults = () => {
    setPermissions(initialPermissionsState);
    toast({
      title: "Standaard Permissies Hersteld",
      description: "De permissies zijn teruggezet naar de aanbevolen standaardinstellingen."
    });
  };

  let lastSection: string | undefined = undefined;

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
                    {platformPermissions.map((permission) => {
                      const showSectionHeader = permission.section && permission.section !== lastSection;
                      if(showSectionHeader) {
                        lastSection = permission.section;
                      }
                      return (
                        <>
                          {showSectionHeader && (
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                              <TableCell colSpan={roles.length + 1} className="py-2 px-4">
                                <h4 className="font-semibold text-foreground">{permission.section}</h4>
                              </TableCell>
                            </TableRow>
                          )}
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
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
             <CardFooter className="border-t pt-6 flex justify-between">
              <Button type="button" variant="outline" onClick={handleRestoreDefaults}>
                <RotateCcw className="mr-2 h-4 w-4" /> Herstel Standaard
              </Button>
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
