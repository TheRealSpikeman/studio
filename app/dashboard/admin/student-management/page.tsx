// src/app/dashboard/admin/student-management/page.tsx
"use client";

import type { User, AgeGroup } from '@/types';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, Search, Loader2 } from '@/lib/icons';
import { UserManagementTable } from '@/components/admin/user-management/UserManagementTable';
import { UserEditDialog } from '@/components/admin/user-management/UserEditDialog'; // To edit/view details
import { UserDeleteAlertDialog } from '@/components/admin/user-management/UserDeleteAlertDialog'; // For delete action
import { useToast } from '@/hooks/use-toast';
import { storageService } from '@/services/storageService';

const ITEMS_PER_PAGE = 10;

export default function StudentManagementPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | User['status']>('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState<'all' | AgeGroup>('all');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    const allUsers = await storageService.getUsers();
    setStudents(allUsers.filter(u => u.role === 'leerling'));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      const matchesAgeGroup = ageGroupFilter === 'all' || student.ageGroup === ageGroupFilter;
      return matchesSearch && matchesStatus && matchesAgeGroup;
    });
  }, [students, searchTerm, statusFilter, ageGroupFilter]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  const handleViewStudentDetails = (student: User) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteStudent = (student: User) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteStudent = async () => {
    if (selectedStudent) {
      await storageService.deleteUser(selectedStudent.id);
      toast({ title: "Leerling verwijderd", description: `Leerling ${selectedStudent.name} is verwijderd.` });
      setSelectedStudent(null);
      await fetchStudents();
    }
    setIsDeleteModalOpen(false);
  };
  
  const handleSaveStudent = async (updatedStudentData: User) => {
    if (selectedStudent) {
        const updatedUser = { ...selectedStudent, ...updatedStudentData };
        await storageService.updateUser(updatedUser);
        toast({ title: "Leerling bijgewerkt", description: `Gegevens voor ${updatedStudentData.name} zijn opgeslagen.` });
    }
    setIsEditModalOpen(false);
    setSelectedStudent(null);
    await fetchStudents();
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                Leerlingenbeheer
              </CardTitle>
              <CardDescription>
                Totaal {filteredStudents.length} leerlingen gevonden. Beheer profielen, statussen en bekijk activiteit.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative md:col-span-1">
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
            <Select value={ageGroupFilter} onValueChange={(value) => {setAgeGroupFilter(value as 'all' | AgeGroup); setCurrentPage(1);}}>
              <SelectTrigger>
                <SelectValue placeholder="Filter op leeftijdsgroep" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Leeftijdsgroepen</SelectItem>
                <SelectItem value="12-15">12-15 jaar</SelectItem>
                <SelectItem value="16-18">16-18 jaar</SelectItem>
                <SelectItem value="18+">Volwassene (18+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <UserManagementTable
              users={paginatedStudents}
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
        user={selectedStudent}
        isAddingNewUser={false} // This page doesn't add new students, assumes they register
        onSave={handleSaveStudent}
      />
      
      <UserDeleteAlertDialog
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        dialogTitle="Leerling Verwijderen?"
        dialogDescription={
          <>
            Weet u zeker dat u leerling <strong>{selectedStudent?.name}</strong> ({selectedStudent?.email}) definitief wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
          </>
        }
        confirmButtonText="Ja, verwijder leerling"
        onConfirm={confirmDeleteStudent}
      />
    </div>
  );
}
