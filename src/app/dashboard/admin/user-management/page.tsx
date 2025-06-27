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
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';


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

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      if (!db) {
        throw new Error("Firestore is not initialized.");
      }
      const usersCol = collection(db, "users");
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Fout bij laden",
        description: "Kon de gebruikers niet ophalen uit de database.",
        variant: "destructive",
      });
      setUsers([]); // Fallback to empty list on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [toast]); // Dependency on toast is fine.

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

  const confirmDeleteUser = async () => {
    if (selectedUser && db) {
      try {
        await deleteDoc(doc(db, "users", selectedUser.id));
        toast({ title: "Gebruiker verwijderd", description: `Gebruiker ${selectedUser.name} is verwijderd.` });
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error("Error deleting user:", error);
        toast({ title: "Fout", description: "Kon gebruiker niet verwijderen.", variant: "destructive" });
      }
    }
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (userData: User) => {
    if (!db) {
      toast({ title: "Fout", description: "Database niet beschikbaar.", variant: "destructive" });
      return;
    }

    setIsEditModalOpen(false);

    if (isAddingNewUser) {
      // Note: This only creates the Firestore document.
      // Creating the actual Auth user would require a backend function or different flow.
      // For this prototype, we'll assume an ID can be created this way for management.
      const newId = `managed-${Date.now()}`;
      const newUserWithId: User = { 
        ...userData, 
        id: newId, 
        createdAt: new Date().toISOString(), 
        lastLogin: new Date().toISOString() 
      };
      
      try {
        await setDoc(doc(db, "users", newUserWithId.id), newUserWithId);
        toast({ title: "Gebruiker toegevoegd", description: `Gebruiker ${userData.name} is succesvol toegevoegd.` });
        fetchUsers();
      } catch (error) {
        console.error("Error adding user:", error);
        toast({ title: "Fout", description: "Kon gebruiker niet toevoegen.", variant: "destructive" });
      }
    } else if (selectedUser) {
      try {
        const userDocRef = doc(db, "users", selectedUser.id);
        await updateDoc(userDocRef, { ...userData });
        toast({ title: "Gebruiker bijgewerkt", description: `Gebruiker ${userData.name} is succesvol bijgewerkt.` });
        fetchUsers();
      } catch (error) {
        console.error("Error updating user:", error);
        toast({ title: "Fout", description: "Kon gebruiker niet bijwerken.", variant: "destructive" });
      }
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
