// app/dashboard/admin/role-management/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getRoles, createRole, deleteRole, type Role } from './_actions';
import { Loader2, PlusCircle, Trash2, Shield } from 'lucide-react';

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const { toast } = useToast();

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedRoles = await getRoles();
      setRoles(fetchedRoles);
    } catch (error) {
      toast({ title: "Fout", description: "Kon de rollen niet ophalen.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      toast({ title: "Validatie Fout", description: "Rolnaam mag niet leeg zijn.", variant: "destructive" });
      return;
    }
    try {
      await createRole({ name: newRoleName, description: newRoleDescription });
      toast({ title: "Succes", description: `Rol '${newRoleName}' is succesvol aangemaakt.` });
      setIsDialogOpen(false);
      setNewRoleName('');
      setNewRoleDescription('');
      fetchRoles(); // Refresh the list
    } catch (error) {
      toast({ title: "Fout bij aanmaken", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (confirm(`Weet u zeker dat u de rol '${role.name}' wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`)) {
      try {
        await deleteRole(role.id);
        toast({ title: "Succes", description: `Rol '${role.name}' is verwijderd.` });
        fetchRoles(); // Refresh the list
      } catch (error) {
        toast({ title: "Fout bij verwijderen", description: (error as Error).message, variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Rollenbeheer
              </CardTitle>
              <CardDescription>
                Voeg nieuwe gebruikersrollen toe of verwijder bestaande rollen.
              </CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Rol Toevoegen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rolnaam</TableHead>
                  <TableHead>Beschrijving</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRole(role)}
                        disabled={['admin', 'ouder', 'leerling'].includes(role.name)} // Prevent deletion of core roles
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nieuwe Rol Toevoegen</DialogTitle>
            <DialogDescription>
              Vul de details voor de nieuwe gebruikersrol in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Rolnaam</Label>
              <Input
                id="role-name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Bijv. content-manager"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">Beschrijving</Label>
              <Input
                id="role-description"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder="Bijv. Kan content beheren"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuleren</Button>
            <Button onClick={handleCreateRole}>Aanmaken</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
