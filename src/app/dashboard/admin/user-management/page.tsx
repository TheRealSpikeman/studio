// src/app/dashboard/admin/user-management/page.tsx
"use client";

import type { User, UserRole, UserStatus } from '@/types';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, PlusCircle, Users, Loader2 } from 'lucide-react';
import { UserManagementTable } from '@/components/admin/user-management/UserManagementTable';
import { UserEditDialog } from '@/components/admin/user-management/UserEditDialog';
import { UserDeleteAlertDialog } from '@/components/admin/user-management/UserDeleteAlertDialog';
import { useToast } from '@/hooks/use-toast';
import { DUMMY_USERS } from '@/lib/data/dummy-data';


const ITEMS_PER_PAGE = 10;

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddingNewUser, setIsAddingNewUser] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    // Load users from dummy data instead of Firestore
    setUsers(DUMMY_USERS);
    setIsLoading(false);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAddingNewUser(true);
    setIsEditModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsAddingNewUser(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      toast({ title: "Gebruiker verwijderd", description: `Gebruiker ${selectedUser.name} is verwijderd.` });
      setSelectedUser(null);
    }
    setIsDeleteModalOpen(false);
  };

  const handleSaveUser = (userData: User) => {
    setIsEditModalOpen(false);

    if (isAddingNewUser) {
      const newUserWithId: User = { 
        ...userData, 
        id: `new-${Date.now()}`, 
        createdAt: new Date().toISOString(), 
        lastLogin: new Date().toISOString() 
      };
      setUsers(prev => [newUserWithId, ...prev]);
      toast({ title: "Gebruiker toegevoegd", description: `Gebruiker ${userData.name} is succesvol toegevoegd.` });
    } else if (selectedUser) {
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...user, ...userData, id: selectedUser.id } : u));
      toast({ title: "Gebruiker bijgewerkt", description: `Gebruiker ${userData.name} is succesvol bijgewerkt.` });
    }
    setSelectedUser(null);
    setIsAddingNewUser(false);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6" />
                Gebruikersbeheer
              </CardTitle>
              <CardDescription>
                {isLoading ? "Gebruikers laden..." : `Totaal ${filteredUsers.length} gebruikers gevonden.`}
              </CardDescription>
            </div>
            <Button onClick={handleAddUser} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe gebruiker toevoegen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Zoek op naam of e-mail..."
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {setStatusFilter(value as UserStatus | 'all'); setCurrentPage(1);}}>
              <SelectTrigger>
                <SelectValue placeholder="Filter op status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Statussen</SelectItem>
                <SelectItem value="actief">Actief</SelectItem>
                <SelectItem value="niet geverifieerd">Niet Geverifieerd</SelectItem>
                <SelectItem value="geblokkeerd">Geblokkeerd</SelectItem>
                <SelectItem value="pending_onboarding">Wacht op Onboarding (Tutor)</SelectItem>
                <SelectItem value="pending_approval">Wacht op Goedkeuring (Tutor)</SelectItem>
                <SelectItem value="rejected">Afgewezen (Tutor)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={(value) => {setRoleFilter(value as UserRole | 'all'); setCurrentPage(1);}}>
              <SelectTrigger>
                <SelectValue placeholder="Filter op rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Rollen</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="coach">Coach</SelectItem>
                <SelectItem value="leerling">Leerling</SelectItem>
                <SelectItem value="tutor">Tutor</SelectItem>
                <SelectItem value="ouder">Ouder</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <UserManagementTable
              users={paginatedUsers}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {totalPages > 1 && !isLoading && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
              >
                Vorige
              </Button>
              <span className="text-sm text-muted-foreground">
                Pagina {currentPage} van {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages}
              >
                Volgende
              </Button>
            </div>
          )}

        </CardContent>
      </Card>

      <UserEditDialog
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={selectedUser}
        isAddingNewUser={isAddingNewUser}
        onSave={handleSaveUser}
      />

      {selectedUser && (
        <UserDeleteAlertDialog
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          dialogTitle="Gebruiker Verwijderen?"
          dialogDescription={
            <>
              Weet u zeker dat u gebruiker <strong>{selectedUser.name}</strong> ({selectedUser.email}) definitief wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
            </>
          }
          confirmButtonText="Ja, verwijder gebruiker"
          onConfirm={confirmDeleteUser}
        />
      )}
    </div>
  );
}
