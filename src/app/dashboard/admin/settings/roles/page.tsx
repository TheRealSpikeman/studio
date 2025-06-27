// src/app/dashboard/admin/settings/roles/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, PlusCircle, Trash2, RotateCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import { useState, Fragment } from 'react';
import { useToast } from '@/hooks/use-toast';

// Re-using the same constants and state logic from the previous implementation
const CORE_ROLES = ['Admin', 'Coach', 'Leerling', 'Tutor', 'Ouder'];

const platformPermissions = [
  { id: 'view_dashboard', label: 'Dashboard bekijken', description: 'Toegang tot het eigen rol-specifieke dashboard.', section: 'Algemeen' },
  { id: 'manage_own_profile', label: 'Eigen profiel beheren', description: 'Persoonlijke gegevens en wachtwoord aanpassen.' },
  { id: 'take_quizzes', label: 'Zelfreflectie tools gebruiken', description: 'Quizzen en assessments starten en voltooien.', section: 'Leerling' },
  { id: 'view_own_results', label: 'Eigen resultaten & voortgang inzien', description: 'Toegang tot persoonlijke rapporten en analyses.' },
  { id: 'access_coaching_hub', label: 'Toegang tot Coaching Hub', description: 'Gebruik van dagboek, dagelijkse tips en aanbevolen tools.' },
  { id: 'use_community_forum', label: 'Community Forum gebruiken', description: 'Berichten lezen en plaatsen in de community.' },
  { id: 'manage_children', label: 'Kinderen beheren', description: 'Kinderprofielen aanmaken, bewerken en uitnodigen.', section: 'Ouder' },
  { id: 'view_child_progress', label: 'Voortgang kinderen inzien', description: 'Inzichten en rapporten van gekoppelde kinderen bekijken (met toestemming).' },
  { id: 'manage_subscriptions', label: 'Abonnementen & facturatie beheren', description: 'Familieabonnement en betalingen beheren.' },
  { id: 'manage_lessons_for_child', label: 'Lessen voor kind plannen/beheren', description: 'Sessies met tutors/coaches plannen, verzetten en annuleren.' },
  { id: 'find_professionals', label: 'Professionals zoeken & koppelen', description: 'Tutors en coaches zoeken en aan kinderen koppelen.' },
  { id: 'communicate_with_professionals', label: 'Communiceren met professionals', description: 'Berichten sturen naar gekoppelde tutors en coaches.' },
  { id: 'manage_professional_profile', label: 'Eigen professioneel profiel beheren', description: 'Beschikbaarheid, tarieven en specialisaties aanpassen.', section: 'Professionals' },
  { id: 'view_client_data', label: 'Data van gekoppelde cliënten inzien', description: 'Toegang tot de gegevens van leerlingen/cliënten die toestemming hebben gegeven.' },
  { id: 'manage_own_sessions', label: 'Eigen sessies/lessen beheren', description: 'Sessies accepteren, afronden en verslagen schrijven.' },
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
  'view_dashboard': { 'Admin': true, 'Coach': true, 'Leerling': true, 'Tutor': true, 'Ouder': true },
  'manage_own_profile': { 'Admin': true, 'Coach': true, 'Leerling': true, 'Tutor': true, 'Ouder': true },
  'take_quizzes': { 'Admin': false, 'Coach': false, 'Leerling': true, 'Tutor': false, 'Ouder': false },
  'view_own_results': { 'Admin': false, 'Coach': false, 'Leerling': true, 'Tutor': false, 'Ouder': false },
  'access_coaching_hub': { 'Admin': false, 'Coach': false, 'Leerling': true, 'Tutor': false, 'Ouder': false },
  'use_community_forum': { 'Admin': false, 'Coach': false, 'Leerling': true, 'Tutor': false, 'Ouder': false },
  'manage_children': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': true },
  'view_child_progress': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': true },
  'manage_subscriptions': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': true },
  'manage_lessons_for_child': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': true },
  'find_professionals': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': true },
  'communicate_with_professionals': { 'Admin': false, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': true },
  'manage_professional_profile': { 'Admin': true, 'Coach': true, 'Leerling': false, 'Tutor': true, 'Ouder': false },
  'view_client_data': { 'Admin': true, 'Coach': true, 'Leerling': false, 'Tutor': true, 'Ouder': false },
  'manage_own_sessions': { 'Admin': true, 'Coach': true, 'Leerling': false, 'Tutor': true, 'Ouder': false },
  'manage_all_users': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'manage_all_quizzes': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'manage_all_content': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'manage_platform_features': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'manage_platform_tools': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'manage_platform_subscriptions': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'view_all_analytics': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
  'view_platform_finances': { 'Admin': true, 'Coach': false, 'Leerling': false, 'Tutor': false, 'Ouder': false },
};

export default function RolesAndPermissionsPage() {
  const { toast } = useToast();
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
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Rollen &amp; Permissies
        </h1>
        <p className="text-muted-foreground">
          Definieer wat verschillende gebruikersrollen kunnen zien en doen.
        </p>
      </section>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Rollen &amp; Permissies Beheer</CardTitle>
          <CardDescription>Voeg rollen toe en wijs permissies toe om de toegang tot het platform te beheren.</CardDescription>
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
          
          <div className="relative max-h-[600px] overflow-y-auto border rounded-lg">
            <table className="w-full caption-bottom text-sm relative">
              <TableHeader className="sticky top-0 z-10 bg-card shadow-sm">
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
                {platformPermissions.map((permission, pIndex) => {
                  const showSectionHeader = permission.section && permission.section !== lastSection;
                  if(showSectionHeader) {
                    lastSection = permission.section;
                  }
                  return (
                    <Fragment key={pIndex}>
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
                    </Fragment>
                  );
                })}
              </TableBody>
            </table>
          </div>
        </CardContent>
         <CardFooter className="border-t pt-6 flex justify-between">
          <Button type="button" variant="outline" onClick={handleRestoreDefaults}>
            <RotateCcw className="mr-2 h-4 w-4" /> Herstel Standaard
          </Button>
          <Button disabled>Permissies Opslaan (binnenkort)</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
