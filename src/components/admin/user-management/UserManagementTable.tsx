// src/components/admin/user-management/UserManagementTable.tsx
"use client";

import type { User, UserStatus, UserRole } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormattedDateCell } from './FormattedDateCell';

interface UserManagementTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  showAgeGroupColumn?: boolean;
}

const getStatusBadgeVariant = (status: UserStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'actief': return 'default';
    case 'niet geverifieerd': return 'secondary';
    case 'wacht_op_ouder_goedkeuring': return 'secondary';
    case 'geblokkeerd': return 'outline'; // Changed to outline or secondary for less aggressive color
    case 'pending_onboarding': return 'secondary';
    case 'pending_approval': return 'secondary';
    case 'rejected': return 'destructive';
    default: return 'outline';
  }
};

const getStatusBadgeClasses = (status: UserStatus): string => {
  switch (status) {
    case 'actief': return 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200';
    case 'niet geverifieerd': return 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200';
    case 'wacht_op_ouder_goedkeuring': return 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200';
    case 'geblokkeerd': return 'bg-gray-200 text-gray-700 border-gray-400 hover:bg-gray-300'; // Neutral gray
    case 'pending_onboarding': return 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200';
    case 'pending_approval': return 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200';
    case 'rejected': return 'bg-red-200 text-red-800 border-red-400 hover:bg-red-300';
    default: return '';
  }
}

const getRoleBadgeVariant = (role: UserRole): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case 'admin': return 'default';
      case 'coach': return 'default';
      case 'leerling': return 'outline';
      case 'tutor': return 'default';
      case 'ouder': return 'secondary';
      default: return 'outline';
    }
  };

const getRoleBadgeClasses = (role: UserRole): string => {
    switch (role) {
      case 'admin': return 'bg-primary/20 text-primary border-primary/40 hover:bg-primary/30';
      case 'coach': return 'bg-cyan-100 text-cyan-700 border-cyan-300 hover:bg-cyan-200';
      case 'leerling': return 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200';
      case 'tutor': return 'bg-violet-100 text-violet-700 border-violet-300 hover:bg-violet-200'; 
      case 'ouder': return 'bg-indigo-100 text-indigo-700 border-indigo-300 hover:bg-indigo-200';
      default: return ''; 
    }
}


export function UserManagementTable({ users, onEditUser, onDeleteUser, showAgeGroupColumn = false }: UserManagementTableProps) {

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';
  }

  const formatStatusText = (status: UserStatus): string => {
    const text = status.replace(/_/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  const formatRoleText = (role: UserRole): string => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  }


  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Naam</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rol</TableHead>
            {showAgeGroupColumn && <TableHead>Leeftijdsgroep</TableHead>}
            <TableHead>Laatste Login</TableHead>
            <TableHead>Aangemaakt Op</TableHead>
            <TableHead className="text-right w-[80px]">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={showAgeGroupColumn ? 9 : 8} className="h-24 text-center">
                Geen gebruikers gevonden.
              </TableCell>
            </TableRow>
          )}
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person avatar" />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{user.name} {user.parentId && <span className="text-xs text-muted-foreground">(Kind van {user.parentId})</span>}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                    variant={getStatusBadgeVariant(user.status)}
                    className={cn(getStatusBadgeClasses(user.status))}
                >
                    {formatStatusText(user.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                    variant={getRoleBadgeVariant(user.role)}
                    className={cn(getRoleBadgeClasses(user.role))}
                >
                    {formatRoleText(user.role)}
                </Badge>
              </TableCell>
              {showAgeGroupColumn && (
                <TableCell>{user.ageGroup ? `${user.ageGroup} jaar` : '-'} </TableCell>
              )}
              <TableCell>
                <FormattedDateCell isoDateString={user.lastLogin} dateFormatPattern="Pp" />
              </TableCell>
              <TableCell>
                <FormattedDateCell isoDateString={user.createdAt} dateFormatPattern="P" />
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
                    <DropdownMenuItem onClick={() => onEditUser(user)}>
                      <Eye className="mr-2 h-4 w-4" /> Bekijken / Bewerken
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteUser(user)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className="mr-2 h-4 w-4" /> Verwijderen
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
