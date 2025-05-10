// src/app/dashboard/admin/student-management/page.tsx
"use client";

import type { User } from '@/types/user';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, Search, Eye } from 'lucide-react';
import { UserManagementTable } from '@/components/admin/user-management/UserManagementTable'; // Can be adapted or replaced
import { useToast } from '@/hooks/use-toast';

// Dummy student data for now
const DUMMY_STUDENTS: User[] = [
  { id: 's1', name: 'Eva Deelnemer', email: 'eva@example.com', status: 'actief', role: 'deelnemer', lastLogin: new Date(Date.now() - 86400000 * 3).toISOString(), createdAt: new Date(Date.now() - 86400000 * 40).toISOString(), avatarUrl: 'https://picsum.photos/seed/eva/40/40' },
  { id: 's2', name: 'Frank Student', email: 'frank@example.com', status: 'actief', role: 'deelnemer', lastLogin: new Date(Date.now() - 86400000 * 1).toISOString(), createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 's3', name: 'Grace Leerling', email: 'grace@example.com', status: 'niet geverifieerd', role: 'deelnemer', lastLogin: new Date(Date.now() - 86400000 * 15).toISOString(), createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), avatarUrl: 'https://picsum.photos/seed/grace/40/40' },
];

const ITEMS_PER_PAGE = 10;

export default function StudentManagementPage() {
  const [students, setStudents] = useState<User[]>(DUMMY_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | User['status']>('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      return matchesSearch && matchesStatus && student.role === 'deelnemer';
    });
  }, [students, searchTerm, statusFilter]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  const handleViewStudentDetails = (student: User) => {
    // Placeholder for viewing student details, e.g., navigate to a student profile page or open a dialog
    toast({ title: "Student Details Bekijken", description: `Details voor ${student.name} (nog niet geïmplementeerd).` });
    console.log("View student details:", student);
  };
  
  // Dummy action, real delete/edit would not be here or be very restricted
  const handleDummyAction = (student: User) => {
     toast({ title: "Actie op Student", description: `Actie voor ${student.name} (nog niet geïmplementeerd).` });
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                Leerlingenoverzicht
              </CardTitle>
              <CardDescription>
                Totaal {filteredStudents.length} leerlingen (gebruikers met rol 'deelnemer') gevonden.
              </CardDescription>
            </div>
            {/* Add "Nieuwe Leerling Toevoegen" if needed, but typically students register themselves */}
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
                <SelectItem value="geblokkeerd">Geblokkeerd</SelectItem>
                {/* Add other relevant statuses if any */}
              </SelectContent>
            </Select>
          </div>

          {/* For now, reusing UserManagementTable. Ideally, a dedicated StudentTable with relevant columns/actions */}
          <UserManagementTable
            users={paginatedStudents}
            onEditUser={handleViewStudentDetails} // Re-purpose onEditUser for viewing details
            onDeleteUser={handleDummyAction} // Re-purpose onDeleteUser for a dummy action or disable
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
      
      {/* If a dialog is needed for student details:
      <StudentDetailDialog 
        isOpen={isDetailModalOpen} 
        onOpenChange={setIsDetailModalOpen} 
        student={selectedStudent} 
      /> 
      */}
    </div>
  );
}
