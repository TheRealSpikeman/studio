// src/app/dashboard/admin/user-management/page.tsx
"use client";

import type { User, UserRole, UserStatus } from '@/types/user';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, PlusCircle, Users, CheckCircle, XCircle } from 'lucide-react';
import { UserManagementTable } from '@/components/admin/user-management/UserManagementTable';
import { UserEditDialog } from '@/components/admin/user-management/UserEditDialog';
import { UserDeleteAlertDialog } from '@/components/admin/user-management/UserDeleteAlertDialog';
import { useToast } from '@/hooks/use-toast';

const DUMMY_USERS: User[] = [
  { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', status: 'actief', role: 'admin', lastLogin: new Date(Date.now() - 86400000 * 2).toISOString(), createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), avatarUrl: 'https://picsum.photos/seed/alice/40/40', coaching: { startDate: new Date(Date.now() - 86400000 * 10).toISOString(), interval: 7, currentDayInFlow: 3 } },
  { id: '2', name: 'Bob De Bouwer', email: 'bob@example.com', status: 'niet geverifieerd', role: 'deelnemer', lastLogin: new Date(Date.now() - 86400000 * 5).toISOString(), createdAt: new Date(Date.now() - 86400000 * 20).toISOString(), avatarUrl: 'https://picsum.photos/seed/bob/40/40' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', status: 'geblokkeerd', role: 'coach', lastLogin: new Date(Date.now() - 86400000 * 1).toISOString(), createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), avatarUrl: 'https://picsum.photos/seed/charlie/40/40', coaching: { startDate: new Date(Date.now() - 86400000 * 5).toISOString(), interval: 1, currentDayInFlow: 5 } },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', status: 'actief', role: 'deelnemer', lastLogin: new Date(Date.now() - 86400000 * 12).toISOString(), createdAt: new Date(Date.now() - 86400000 * 60).toISOString(), avatarUrl: 'https://picsum.photos/seed/diana/40/40' },
  { id: '5', name: 'Edward Scissorhands', email: 'edward@example.com', status: 'actief', role: 'coach', lastLogin: new Date(Date.now() - 86400000 * 3).toISOString(), createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: '6', name: 'Fiona Tutor', email: 'fiona.tutor@example.com', status: 'pending_approval', role: 'tutor', lastLogin: new Date().toISOString(), createdAt: new Date().toISOString(), avatarUrl: 'https://picsum.photos/seed/fiona/40/40' },
  { id: '7', name: 'George TutorApp', email: 'george.app@example.com', status: 'pending_approval', role: 'tutor', lastLogin: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: '8', name: 'Hannah Onboarding', email: 'hannah.onboard@example.com', status: 'pending_onboarding', role: 'tutor', lastLogin: new Date().toISOString(), createdAt: new Date().toISOString() },
];

const ITEMS_PER_PAGE = 10;

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(DUMMY_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddingNewUser, setIsAddingNewUser] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

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
      setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
      toast({ title: "Gebruiker verwijderd", description: `Gebruiker ${selectedUser.name} is verwijderd.` });
    }
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = (userData: User) => {
    // Conceptual: If role is 'tutor' and status was 'pending_approval' and now 'actief', send approval email.
    const originalUser = users.find(u => u.id === selectedUser?.id);
    if (originalUser?.role === 'tutor' && originalUser?.status === 'pending_approval' && userData.status === 'actief') {
      console.log(`Tutor ${userData.email} approved. Sending approval email.`);
      toast({ title: "Tutor Goedgekeurd", description: `Tutor ${userData.name} is goedgekeurd en geactiveerd.`, className: "bg-green-100 text-green-700 border-green-300"});
    }
    // Conceptual: If role is 'tutor' and status was 'pending_approval' and now 'rejected', send rejection email.
     if (originalUser?.role === 'tutor' && originalUser?.status === 'pending_approval' && userData.status === 'rejected') {
      console.log(`Tutor ${userData.email} rejected. Sending rejection email.`);
      toast({ title: "Tutor Afgewezen", description: `Tutor ${userData.name} is afgewezen.`, variant: "destructive"});
    }


    if (isAddingNewUser) {
      setUsers(prevUsers => [...prevUsers, { ...userData, id: (Math.random() * 10000).toString(), createdAt: new Date().toISOString(), lastLogin: new Date().toISOString() }]);
      toast({ title: "Gebruiker toegevoegd", description: `Gebruiker ${userData.name} is succesvol toegevoegd.` });
    } else if (selectedUser) {
      setUsers(prevUsers => prevUsers.map(user => user.id === selectedUser.id ? { ...user, ...userData } : user));
      toast({ title: "Gebruiker bijgewerkt", description: `Gebruiker ${userData.name} is succesvol bijgewerkt.` });
    }
    setIsEditModalOpen(false);
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
                Totaal {filteredUsers.length} gebruikers gevonden.
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
                <SelectItem value="deelnemer">Deelnemer</SelectItem>
                <SelectItem value="tutor">Tutor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <UserManagementTable
            users={paginatedUsers}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />

          {totalPages > 1 && (
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

      <UserDeleteAlertDialog
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        user={selectedUser}
        onConfirmDelete={confirmDeleteUser}
      />
    </div>
  );
}
