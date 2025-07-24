// src/components/admin/tutor-management/TutorManagementTable.tsx
"use client";

import type { User, UserStatus } from '@/types/user';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, Edit, UserX, MoreVertical, CheckCircle, AlertTriangle, KeyRound, MessageSquareWarning, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormattedDateCell } from '../user-management/FormattedDateCell'; // Reusing from general user management

interface TutorManagementTableProps {
  tutors: User[];
  onEditTutor: (tutor: User) => void;
  onDeactivateTutor: (tutor: User) => void;
  // Add other action handlers as needed, e.g., onResetPassword, onApproveTutor
}

const getStatusBadgeVariant = (status: UserStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'actief': return 'default'; 
    case 'pending_approval': return 'secondary'; 
    case 'pending_onboarding': return 'secondary'; 
    case 'geblokkeerd': return 'outline'; // Changed to outline for neutral gray
    case 'rejected': return 'destructive'; 
    default: return 'outline';
  }
};

const getStatusBadgeClasses = (status: UserStatus): string => {
  switch (status) {
    case 'actief': return 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200';
    case 'pending_approval': return 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200';
    case 'pending_onboarding': return 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200';
    case 'geblokkeerd': return 'bg-gray-200 text-gray-700 border-gray-400 hover:bg-gray-300'; // Neutral gray
    case 'rejected': return 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200';
    default: return '';
  }
};

const formatStatusText = (status: UserStatus): string => {
    const text = status.replace(/_/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export function TutorManagementTable({ tutors, onEditTutor, onDeactivateTutor }: TutorManagementTableProps) {
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';
  }

  const formatCurrency = (amount?: number) => {
    if (typeof amount !== 'number') return 'N/A';
  }

  const formatRating = (rating?: number) => {
    if (typeof rating !== 'number') return 'N/A';
    return `${rating.toFixed(1)} ★`;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Naam</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Vakken</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Uurtarief</TableHead>
            <TableHead>Tot. Omzet</TableHead>
            <TableHead>Beoordeling</TableHead>
            <TableHead>Laatste Login</TableHead>
            <TableHead className="text-right w-[80px]">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tutors.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                Geen tutors gevonden.
              </TableCell>
            </TableRow>
          )}
          {tutors.map((tutor) => (
            <TableRow key={tutor.id}>
              <TableCell>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={tutor.avatarUrl} alt={tutor.name} data-ai-hint="tutor person" />
                  <AvatarFallback>{getInitials(tutor.name)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{tutor.name}</TableCell>
              <TableCell>{tutor.email}</TableCell>
              <TableCell className="text-xs max-w-[150px] truncate">
                {tutor.tutorDetails?.subjects?.join(', ') || 'N/A'}
              </TableCell>
              <TableCell>
                <Badge 
                    variant={getStatusBadgeVariant(tutor.status)}
                    className={cn(getStatusBadgeClasses(tutor.status))}
                >
                    {formatStatusText(tutor.status)}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(tutor.tutorDetails?.hourlyRate)}</TableCell>
              <TableCell>{formatCurrency(tutor.tutorDetails?.totalRevenue)}</TableCell>
              <TableCell>{formatRating(tutor.tutorDetails?.averageRating)}</TableCell>
              <TableCell>
                <FormattedDateCell isoDateString={tutor.lastLogin} dateFormatPattern="P" />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Acties</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditTutor(tutor)}>
                      <Eye className="mr-2 h-4 w-4" /> Bekijk/Bewerk Profiel
                    </DropdownMenuItem>
                    {tutor.status === 'pending_approval' && (
                        <>
                            <DropdownMenuItem onClick={() => onEditTutor(tutor)} className="text-green-600 focus:text-green-700 focus:bg-green-100">
                                <CheckCircle className="mr-2 h-4 w-4" /> Goedkeuren
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEditTutor(tutor)} className="text-red-600 focus:text-red-700 focus:bg-red-100">
                                <XCircle className="mr-2 h-4 w-4" /> Afwijzen
                            </DropdownMenuItem>
                        </>
                    )}
                     {tutor.status === 'actief' && (
                        <DropdownMenuItem onClick={() => onDeactivateTutor(tutor)} className="text-orange-600 focus:text-orange-700 focus:bg-orange-100">
                            <UserX className="mr-2 h-4 w-4" /> Deactiveren
                        </DropdownMenuItem>
                     )}
                     {tutor.status === 'geblokkeerd' && (
                        <DropdownMenuItem onClick={() => onEditTutor(tutor)} className="text-blue-600 focus:text-blue-700 focus:bg-blue-100">
                           <CheckCircle className="mr-2 h-4 w-4" /> Heractiveren
                        </DropdownMenuItem>
                     )}
                     <DropdownMenuItem disabled> {/* Placeholder for future action */}
                        <KeyRound className="mr-2 h-4 w-4" /> Wachtwoord Resetten 
                     </DropdownMenuItem>
                     <DropdownMenuItem disabled className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <MessageSquareWarning className="mr-2 h-4 w-4" /> Verwijder Data (GDPR)
                     </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
