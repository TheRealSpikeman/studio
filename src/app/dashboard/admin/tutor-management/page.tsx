// src/app/dashboard/admin/tutor-management/page.tsx
"use client";

import type { User, UserRole, UserStatus } from '@/types/user';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Briefcase, CheckCircle, XCircle, UserX, Settings } from 'lucide-react';
import { UserEditDialog } from '@/components/admin/user-management/UserEditDialog';
import { UserDeleteAlertDialog } from '@/components/admin/user-management/UserDeleteAlertDialog';
import { TutorManagementTable } from '@/components/admin/tutor-management/TutorManagementTable';
import { useToast } from '@/hooks/use-toast';

const DUMMY_TUTORS: User[] = [
  { 
    id: 't1', name: 'Dr. Anna Visser', email: 'anna.visser@example.com', status: 'actief', role: 'tutor', 
    lastLogin: new Date(Date.now() - 86400000 * 1).toISOString(), createdAt: new Date(Date.now() - 86400000 * 90).toISOString(), 
    avatarUrl: 'https://picsum.photos/seed/annavisser/40/40', 
    tutorDetails: { subjects: ['Wiskunde', 'Natuurkunde'], hourlyRate: 35, bio: "Ervaren docent met passie voor exacte vakken.", availability: "Ma, Wo, Vr avond", totalRevenue: 1250, averageRating: 4.8 }
  },
  { 
    id: 't2', name: 'Mark de Wit', email: 'mark.dewit@example.com', status: 'pending_approval', role: 'tutor', 
    lastLogin: new Date(Date.now() - 86400000 * 3).toISOString(), createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), 
    tutorDetails: { subjects: ['Engels'], hourlyRate: 25, bio: "Native speaker, focus op spreekvaardigheid.", availability: "Weekend" }
  },
  { 
    id: 't3', name: 'Sofia El Amrani', email: 'sofia.elamrani@example.com', status: 'actief', role: 'tutor', 
    lastLogin: new Date(Date.now() - 86400000 * 2).toISOString(), createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), 
    avatarUrl: 'https://picsum.photos/seed/sofiaelamrani/40/40',
    tutorDetails: { subjects: ['Nederlands', 'Geschiedenis'], hourlyRate: 30, bio: "Geduldig en helpt met structuur.", availability: "Di, Do middag/avond", totalRevenue: 870, averageRating: 4.5 }
  },
   { 
    id: 't4', name: 'Ben Scholten', email: 'ben.scholten@example.com', status: 'pending_onboarding', role: 'tutor', 
    lastLogin: new Date().toISOString(), createdAt: new Date().toISOString(), 
    tutorDetails: { bio: "Nieuwe aanmelding, wacht op afronden profiel."}
  },
  { 
    id: 't5', name: 'Carla Dammers', email: 'carla.dammers@example.com', status: 'rejected', role: 'tutor', 
    lastLogin: new Date(Date.now() - 86400000 * 10).toISOString(), createdAt: new Date(Date.now() - 86400000 * 12).toISOString(), 
    tutorDetails: { bio: "Aanmelding afgewezen, VOG niet correct."}
  },
];

const ITEMS_PER_PAGE = 10;

export default function TutorManagementPage() {
  const [tutors, setTutors] = useState<User[]>(DUMMY_TUTORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Or "Deactivate" modal
  const [selectedTutor, setSelectedTutor] = useState<User | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const filteredTutors = useMemo(() => {
    return tutors.filter(tutor => {
      const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (tutor.tutorDetails?.subjects && tutor.tutorDetails.subjects.join(' ').toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || tutor.status === statusFilter;
      return matchesSearch && matchesStatus && tutor.role === 'tutor';
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

  const handleDeactivateTutor = (tutor: User) => { // Placeholder for deactivation
    setSelectedTutor(tutor);
    // For now, using delete dialog as a stand-in for a "deactivate" or "reject" confirmation
    setIsDeleteModalOpen(true); 
    // Actual implementation might involve a status change to 'geblokkeerd' or 'rejected'
  };

  const confirmDeactivateTutor = () => {
    if (selectedTutor) {
      // Simulate deactivation/rejection by changing status or filtering out
      // In a real app, this would be an API call to update status
      setTutors(prevTutors => prevTutors.map(t => 
        t.id === selectedTutor.id ? { ...t, status: 'geblokkeerd' as UserStatus } : t
      ));
      toast({ title: "Tutor Gedeactiveerd", description: `Tutor ${selectedTutor.name} is gedeactiveerd (simulatie).` });
    }
    setIsDeleteModalOpen(false);
    setSelectedTutor(null);
  };

  const handleSaveTutor = (tutorData: User) => {
    // Conceptual: If role is 'tutor' and status was 'pending_approval' and now 'actief', send approval email.
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
      setTutors(prevTutors => prevTutors.map(t => t.id === selectedTutor.id ? { ...t, ...tutorData } : t));
      toast({ title: "Tutor bijgewerkt", description: `Gegevens voor ${tutorData.name} zijn succesvol bijgewerkt.` });
    }
    setIsEditModalOpen(false);
    setSelectedTutor(null);
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
            {/* "Nieuwe Tutor Toevoegen" might be different from general user creation, often tutors apply. */}
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

          <TutorManagementTable
            tutors={paginatedTutors}
            onEditTutor={handleEditTutor}
            onDeactivateTutor={handleDeactivateTutor}
            // Other actions like 'Reset Password' can be added to dropdown in TutorManagementTable
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
        user={selectedTutor}
        isAddingNewUser={false} // Tutors apply, admins typically don't add them from scratch here
        onSave={handleSaveTutor}
      />

      <UserDeleteAlertDialog
        isOpen={isDeleteModalOpen} // Re-using for "Deactivate" for now
        onOpenChange={setIsDeleteModalOpen}
        user={selectedTutor}
        onConfirmDelete={confirmDeactivateTutor} // This function should reflect the actual action (e.g., deactivate)
      />
    </div>
  );
}
```