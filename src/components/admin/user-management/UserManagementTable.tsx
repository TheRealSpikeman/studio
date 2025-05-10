// src/components/admin/user-management/UserManagementTable.tsx
"use client";

import type { User, UserStatus, UserRole } from '@/types/user';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface UserManagementTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const getStatusBadgeVariant = (status: UserStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'actief': return 'default';
    case 'niet geverifieerd': return 'secondary';
    case 'geblokkeerd': return 'destructive';
    case 'pending_onboarding': return 'outline'; // Neutral for pending
    case 'pending_approval': return 'secondary'; // Use secondary for pending approval like "niet geverifieerd"
    case 'rejected': return 'destructive'; // Use destructive for rejected
    default: return 'outline';
  }
};

const getStatusBadgeClasses = (status: UserStatus): string => {
  switch (status) {
    case 'actief': return 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200';
    case 'niet geverifieerd': return 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200';
    case 'geblokkeerd': return 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200';
    case 'pending_onboarding': return 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200';
    case 'pending_approval': return 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200'; // Orange for pending approval
    case 'rejected': return 'bg-red-200 text-red-800 border-red-400 hover:bg-red-300'; // Slightly different red for rejected
    default: return '';
  }
}

const getRoleBadgeVariant = (role: UserRole): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case 'admin': return 'default'; 
      case 'coach': return 'secondary';
      case 'deelnemer': return 'outline';
      case 'tutor': return 'default'; // Using default for Tutor, can be changed.
      default: return 'outline';
    }
  };

const getRoleBadgeClasses = (role: UserRole): string => {
    switch (role) {
      case 'admin': return 'bg-primary/20 text-primary border-primary/40 hover:bg-primary/30';
      case 'coach': return 'bg-accent/20 text-accent border-accent/40 hover:bg-accent/30';
      case 'tutor': return 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200'; // Purple for Tutor
      default: return ''; // Default outline styling from Badge component
    }
}


export function UserManagementTable({ users, onEditUser, onDeleteUser }: UserManagementTableProps) {
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';
  }

  const formatStatusText = (status: UserStatus): string => {
    const text = status.replace(/_/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
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
            <TableHead>Laatste Login</TableHead>
            <TableHead>Aangemaakt Op</TableHead>
            <TableHead className="text-right w-[80px]">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
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
              <TableCell className="font-medium">{user.name}</TableCell>
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
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{format(new Date(user.lastLogin), 'Pp', { locale: nl })}</TableCell>
              <TableCell>{format(new Date(user.createdAt), 'P', { locale: nl })}</TableCell>
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
                    {/* Edit and Delete can be conditional based on user status/role if needed */}
                    <DropdownMenuItem onClick={() => onEditUser(user)}>
                      <Edit className="mr-2 h-4 w-4" /> Bewerken
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
