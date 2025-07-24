// src/app/dashboard/admin/coach-management/page.tsx
"use client";

import type { User, UserRole, UserStatus } from '@/types';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, HeartHandshake, Loader2 } from '@/lib/icons';
import { UserEditDialog } from '@/components/admin/user-management/UserEditDialog';
import { UserDeleteAlertDialog } from '@/components/admin/user-management/UserDeleteAlertDialog';
import { CoachManagementTable } from '@/components/admin/coach-management/CoachManagementTable';
import { useToast } from '@/hooks/use-toast';
import { getUsersByRole, updateUser } from "./_actions";

const ITEMS_PER_PAGE = 10;

export default function CoachManagementPage() {
  const [coaches, setCoaches] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<User | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const fetchCoaches = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedCoaches = await getUsersByRole('coach');
      setCoaches(fetchedCoaches);
    } catch (error) {
      toast({
        title: "Fout bij ophalen van coaches",
        description: "Er is een fout opgetreden bij het ophalen van de coach-gegevens.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCoaches();
  }, [fetchCoaches]);

  const filteredCoaches = useMemo(() => {
    return coaches.filter(coach => {
      const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            coach.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (coach.coachDetails?.specializations && coach.coachDetails.specializations.join(' ').toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || coach.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [coaches, searchTerm, statusFilter]);

  const paginatedCoaches = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCoaches.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCoaches, currentPage]);

  const totalPages = Math.ceil(filteredCoaches.length / ITEMS_PER_PAGE);

  const handleEditCoach = (coach: User) => {
    setSelectedCoach(coach);
    setIsEditModalOpen(true);
  };

  const handleDeactivateCoachClick = (coach: User) => { 
    setSelectedCoach(coach);
    setIsConfirmModalOpen(true); 
  };

  const confirmDeactivateCoach = async () => {
    if (selectedCoach) {
      await updateUser(selectedCoach.id, { status: 'geblokkeerd' as UserStatus });
      toast({ title: "Coach Gedeactiveerd", description: `Coach ${selectedCoach.name} is gedeactiveerd.` });
      await fetchCoaches();
    }
    setIsConfirmModalOpen(false);
    setSelectedCoach(null);
  };

  const handleSaveCoach = async (coachData: User) => {
    const originalCoach = coaches.find(u => u.id === selectedCoach?.id);
    if (originalCoach?.role === 'coach' && originalCoach?.status === 'pending_approval' && coachData.status === 'actief') {
      console.log(`Coach ${coachData.email} approved. Sending approval email.`);
      toast({ title: "Coach Goedgekeurd", description: `Coach ${coachData.name} is goedgekeurd en geactiveerd.`, className: "bg-green-100 text-green-700 border-green-300"});
    }
     if (originalCoach?.role === 'coach' && originalCoach?.status === 'pending_approval' && coachData.status === 'rejected') {
      console.log(`Coach ${coachData.email} rejected. Sending rejection email.`);
      toast({ title: "Coach Afgewezen", description: `Coach ${coachData.name} is afgewezen.`, variant: "destructive"});
    }

    if (selectedCoach) {
      await updateUser(selectedCoach.id, coachData);
      toast({ title: "Coach bijgewerkt", description: `Gegevens voor ${coachData.name} zijn succesvol bijgewerkt.` });
    }
    setIsEditModalOpen(false);
    setSelectedCoach(null);
    await fetchCoaches();
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <HeartHandshake className="h-6 w-6" /> 
                Coachbeheer
              </CardTitle>
              <CardDescription>
                Beheer coach profielen, goedkeuringen, en prestaties. Totaal {filteredCoaches.length} coaches gevonden.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Zoek op naam, e-mail of specialisatie..."
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
                <SelectItem value="pending_approval">Wacht op Onboarding</SelectItem>
                <SelectItem value="pending_approval">Wacht op Goedkeuring</SelectItem>
                <SelectItem value="gedeactiveerd">Geblokkeerd/Inactief</SelectItem>
                <SelectItem value="rejected">Afgewezen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <CoachManagementTable
              coaches={paginatedCoaches}
              onEditCoach={handleEditCoach}
              onDeactivateCoach={handleDeactivateCoachClick}
            />
          )}

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
        user={selectedCoach}
        isAddingNewUser={false} 
        onSave={handleSaveCoach}
      />

      {selectedCoach && (
        <UserDeleteAlertDialog
            isOpen={isConfirmModalOpen}
            onOpenChange={setIsConfirmModalOpen}
            dialogTitle="Coach Deactiveren?"
            dialogDescription={
                <>
                Weet u zeker dat u coach <strong>{selectedCoach.name}</strong> ({selectedCoach.email}) wilt deactiveren? 
                De coach zal niet langer kunnen inloggen of sessies kunnen geven.
                </>
            }
            confirmButtonText="Ja, deactiveer coach"
            confirmButtonVariant="destructive"
            onConfirm={confirmDeactivateCoach}
        />
      )}
    </div>
  );
}
