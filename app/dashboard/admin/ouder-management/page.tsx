// src/app/dashboard/admin/ouder-management/page.tsx
"use client";

import type { User, UserRole, UserStatus } from '@/types';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, PlusCircle, Users, Loader2 } from '@/lib/icons';
import { UserEditDialog } from '@/components/admin/user-management/UserEditDialog';
import { UserDeleteAlertDialog } from '@/components/admin/user-management/UserDeleteAlertDialog';
import { useToast } from '@/hooks/use-toast';
import { storageService } from '@/services/storageService';
import { OuderManagementTable } from '@/components/admin/ouder-management/OuderManagementTable';

const ITEMS_PER_PAGE = 10;

export default function OuderManagementPage() {
  const [ouders, setOuders] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | User['status']>('all');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOuder, setSelectedOuder] = useState<User | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const fetchOuders = useCallback(async () => {
    setIsLoading(true);
    const allUsers = await storageService.getUsers();
    setOuders(allUsers.filter(u => u.role === 'ouder'));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchOuders();
  }, [fetchOuders]);

  const filteredOuders = useMemo(() => {
    return ouders.filter(ouder => {
      const matchesSearch = ouder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ouder.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ouder.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [ouders, searchTerm, statusFilter]);

  const paginatedOuders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOuders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOuders, currentPage]);

  const totalPages = Math.ceil(filteredOuders.length / ITEMS_PER_PAGE);

  const handleViewOuderDetails = (ouder: User) => {
    setSelectedOuder(ouder);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteOuder = (ouder: User) => {
    setSelectedOuder(ouder);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteOuder = async () => {
    if (selectedOuder) {
      await storageService.deleteUser(selectedOuder.id);
      toast({ title: "Ouder verwijderd", description: `Ouder ${selectedOuder.name} is verwijderd.` });
      setSelectedOuder(null);
      await fetchOuders();
    }
    setIsDeleteModalOpen(false);
  };
  
  const handleSaveOuder = async (updatedOuderData: User) => {
    if (selectedOuder) {
        const updatedUser = { ...selectedOuder, ...updatedOuderData };
        await storageService.updateUser(updatedUser);
        toast({ title: "Ouder bijgewerkt", description: `Gegevens voor ${updatedOuderData.name} zijn opgeslagen.` });
    }
    setIsEditModalOpen(false);
    setSelectedOuder(null);
    await fetchOuders();
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6" />
                Ouderbeheer
              </CardTitle>
              <CardDescription>
                Totaal {filteredOuders.length} ouders gevonden. Beheer profielen en gekoppelde kinderen.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Zoek op naam of e-mail..."
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {setStatusFilter(value as 'all' | User['status']); setCurrentPage(1);}}>
              <SelectTrigger>
                <SelectValue placeholder="Filter op status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Statussen</SelectItem>
                <SelectItem value="actief">Actief</SelectItem>
                <SelectItem value="niet geverifieerd">Niet Geverifieerd</SelectItem>
                <SelectItem value="gedeactiveerd">Geblokkeerd</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <OuderManagementTable
              ouders={paginatedOuders}
              onEditOuder={handleViewOuderDetails} 
              onDeleteOuder={handleDeleteOuder}
            />
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Vorige</Button>
              <span className="text-sm text-muted-foreground">Pagina {currentPage} van {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Volgende</Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <UserEditDialog
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={selectedOuder}
        isAddingNewUser={false} 
        onSave={handleSaveOuder}
      />
      
      <UserDeleteAlertDialog
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        dialogTitle="Ouder Verwijderen?"
        dialogDescription={
          <>
            Weet u zeker dat u ouder <strong>{selectedOuder?.name}</strong> ({selectedOuder?.email}) definitief wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt. Gekoppelde kinderaccounts blijven bestaan maar de koppeling wordt verbroken.
          </>
        }
        confirmButtonText="Ja, verwijder ouder"
        onConfirm={confirmDeleteOuder}
      />
    </div>
  );
}
