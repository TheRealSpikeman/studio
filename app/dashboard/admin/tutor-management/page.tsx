// src/app/dashboard/admin/tutor-management/page.tsx
"use client";

import type { User, UserRole, UserStatus } from '@/types';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Briefcase, Loader2 } from '@/lib/icons';
import { UserEditDialog } from '@/components/admin/user-management/UserEditDialog';
import { UserDeleteAlertDialog } from '@/components/admin/user-management/UserDeleteAlertDialog';
import { TutorManagementTable } from '@/components/admin/tutor-management/TutorManagementTable';
import { useToast } from '@/hooks/use-toast';
import { getUsersByRole, updateUser } from "./_actions";

const ITEMS_PER_PAGE = 10;

export default function TutorManagementPage() {
  const [tutors, setTutors] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<User | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const fetchTutors = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedTutors = await getUsersByRole('tutor');
      setTutors(fetchedTutors);
    } catch (error) {
      toast({
        title: "Fout bij ophalen van tutors",
        description: "Er is een fout opgetreden bij het ophalen van de tutor-gegevens.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  const filteredTutors = useMemo(() => {
    return tutors.filter(tutor => {
      const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (tutor.tutorDetails?.subjects && tutor.tutorDetails.subjects.join(' ').toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || tutor.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tutors, searchTerm, statusFilter]);

  const paginatedTutors = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTutors.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTutors, currentPage]);

  const totalPages = Math.ceil(filteredTutors.length / ITEMS_PER_PAGE);

  const handleEditTutor = (tutor: User) => {
    setSelectedTutor(tutor);
    setIsEditModalOpen(true);
  };

  const handleDeactivateTutorClick = (tutor: User) => { 
    setSelectedTutor(tutor);
    setIsConfirmModalOpen(true); 
  };

  const confirmDeactivateTutor = async () => {
    if (selectedTutor) {
      await updateUser(selectedTutor.id, { status: 'geblokkeerd' as UserStatus });
      toast({ title: "Tutor Gedeactiveerd", description: `Tutor ${selectedTutor.name} is gedeactiveerd.` });
      await fetchTutors();
    }
    setIsConfirmModalOpen(false);
    setSelectedTutor(null);
  };

  const handleSaveTutor = async (tutorData: User) => {
    const originalTutor = tutors.find(u => u.id === selectedTutor?.id);
    if (originalTutor?.role === 'tutor' && originalTutor?.status === 'pending_approval' && tutorData.status === 'actief') {
      console.log(`Tutor ${tutorData.email} approved. Sending approval email.`);
      toast({ title: "Tutor Goedgekeurd", description: `Tutor ${tutorData.name} is goedgekeurd en geactiveerd.`, className: "bg-green-100 text-green-700 border-green-300"});
    }
     if (originalTutor?.role === 'tutor' && originalTutor?.status === 'pending_approval' && tutorData.status === 'rejected') {
      console.log(`Tutor ${tutorData.email} rejected. Sending rejection email.`);
      toast({ title: "Tutor Afgewezen", description: `Tutor ${tutorData.name} is afgewezen.`, variant: "destructive"});
    }

    if (selectedTutor) {
      await updateUser(selectedTutor.id, tutorData);
      toast({ title: "Tutor bijgewerkt", description: `Gegevens voor ${tutorData.name} zijn succesvol bijgewerkt.` });
    }
    setIsEditModalOpen(false);
    setSelectedTutor(null);
    await fetchTutors();
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Briefcase className="h-6 w-6" />
                Tutorbeheer
              </CardTitle>
              <CardDescription>
                Beheer tutor profielen, goedkeuringen, en prestaties. Totaal {filteredTutors.length} tutors gevonden.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Zoek op naam, e-mail of vak..."
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
                <SelectItem value="pending_onboarding">Wacht op Onboarding</SelectItem>
                <SelectItem value="pending_approval">Wacht op Goedkeuring</SelectItem>
                <SelectItem value="geblokkeerd">Geblokkeerd/Inactief</SelectItem>
                <SelectItem value="rejected">Afgewezen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <TutorManagementTable
              tutors={paginatedTutors}
              onEditTutor={handleEditTutor}
              onDeactivateTutor={handleDeactivateTutorClick}
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
        user={selectedTutor}
        isAddingNewUser={false} 
        onSave={handleSaveTutor}
      />

      {selectedTutor && (
        <UserDeleteAlertDialog
            isOpen={isConfirmModalOpen}
            onOpenChange={setIsConfirmModalOpen}
            dialogTitle="Tutor Deactiveren?"
            dialogDescription={
                <>
                Weet u zeker dat u tutor <strong>{selectedTutor.name}</strong> ({selectedTutor.email}) wilt deactiveren? 
                De tutor zal niet langer kunnen inloggen of lessen kunnen geven.
                </>
            }
            confirmButtonText="Ja, deactiveer tutor"
            confirmButtonVariant="destructive"
            onConfirm={confirmDeactivateTutor}
        />
      )}
    </div>
  );
}
