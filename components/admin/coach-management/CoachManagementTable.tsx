// src/components/admin/coach-management/CoachManagementTable.tsx
"use client";

import type { User, UserStatus } from '@/types/user';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, Edit, UserX, MoreVertical, CheckCircle, AlertTriangle, KeyRound, MessageSquareWarning, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormattedDateCell } from '../user-management/FormattedDateCell';

interface CoachManagementTableProps {
  coaches: User[];
  onEditCoach: (coach: User) => void;
  onDeactivateCoach: (coach: User) => void;
}

const getStatusBadgeVariant = (status: UserStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'actief': return 'default'; 
    case 'pending_approval': return 'secondary'; 
    case 'pending_onboarding': return 'secondary'; 
    case 'geblokkeerd': return 'outline';
    case 'rejected': return 'destructive'; 
    default: return 'outline';
  }
};

const getStatusBadgeClasses = (status: UserStatus): string => {
  switch (status) {
    case 'actief': return 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200';
    case 'pending_approval': return 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200';
    case 'pending_onboarding': return 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200';
    case 'geblokkeerd': return 'bg-gray-200 text-gray-700 border-gray-400 hover:bg-gray-300';
    case 'rejected': return 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200';
    default: return '';
  }
};

const formatStatusText = (status: UserStatus): string => {
    const text = status.replace(/_/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export function CoachManagementTable({ coaches, onEditCoach, onDeactivateCoach }: CoachManagementTableProps) {
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';
  }

  const formatCurrency = (amount?: number) => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Naam</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Specialisaties</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Uurtarief</TableHead>
            <TableHead>Laatste Login</TableHead>
            <TableHead className="text-right w-[80px]">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coaches.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Geen coaches gevonden.
              </TableCell>
            </TableRow>
          )}
          {coaches.map((coach) => (
            <TableRow key={coach.id}>
              <TableCell>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={coach.avatarUrl} alt={coach.name} data-ai-hint="coach person" />
                  <AvatarFallback>{getInitials(coach.name)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{coach.name}</TableCell>
              <TableCell>{coach.email}</TableCell>
              <TableCell className="text-xs max-w-[150px] truncate">
                {coach.coachDetails?.specializations?.join(', ') || 'N/A'}
              </TableCell>
              <TableCell>
                <Badge 
                    variant={getStatusBadgeVariant(coach.status)}
                    className={cn(getStatusBadgeClasses(coach.status))}
                >
                    {formatStatusText(coach.status)}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(coach.coachDetails?.hourlyRate)}</TableCell>
              <TableCell>
                <FormattedDateCell isoDateString={coach.lastLogin} dateFormatPattern="P" />
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
                    <DropdownMenuItem onClick={() => onEditCoach(coach)}>
                      <Eye className="mr-2 h-4 w-4" /> Bekijk/Bewerk Profiel
                    </DropdownMenuItem>
                    {coach.status === 'pending_approval' && (
                        <>
                            <DropdownMenuItem onClick={() => onEditCoach(coach)} className="text-green-600 focus:text-green-700 focus:bg-green-100">
                                <CheckCircle className="mr-2 h-4 w-4" /> Goedkeuren
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEditCoach(coach)} className="text-red-600 focus:text-red-700 focus:bg-red-100">
                                <XCircle className="mr-2 h-4 w-4" /> Afwijzen
                            </DropdownMenuItem>
                        </>
                    )}
                     {coach.status === 'actief' && (
                        <DropdownMenuItem onClick={() => onDeactivateCoach(coach)} className="text-orange-600 focus:text-orange-700 focus:bg-orange-100">
                            <UserX className="mr-2 h-4 w-4" /> Deactiveren
                        </DropdownMenuItem>
                     )}
                     {coach.status === 'geblokkeerd' && (
                        <DropdownMenuItem onClick={() => onEditCoach(coach)} className="text-blue-600 focus:text-blue-700 focus:bg-blue-100">
                           <CheckCircle className="mr-2 h-4 w-4" /> Heractiveren
                        </DropdownMenuItem>
                     )}
                     <DropdownMenuItem disabled>
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
