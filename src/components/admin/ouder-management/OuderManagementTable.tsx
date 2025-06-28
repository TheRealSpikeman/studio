// src/components/admin/ouder-management/OuderManagementTable.tsx
"use client";

import type { User, UserStatus } from '@/types/user';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormattedDateCell } from '../user-management/FormattedDateCell';

interface OuderManagementTableProps {
  ouders: User[];
  onEditOuder: (ouder: User) => void;
  onDeleteOuder: (ouder: User) => void;
}

const getStatusBadgeVariant = (status: UserStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'actief': return 'default'; 
    case 'niet geverifieerd': return 'secondary'; 
    case 'geblokkeerd': return 'outline';
    default: return 'outline';
  }
};

const getStatusBadgeClasses = (status: UserStatus): string => {
  switch (status) {
    case 'actief': return 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200';
    case 'niet geverifieerd': return 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200';
    case 'geblokkeerd': return 'bg-gray-200 text-gray-700 border-gray-400 hover:bg-gray-300';
    default: return '';
  }
};

const formatStatusText = (status: UserStatus): string => {
    const text = status.replace(/_/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export function OuderManagementTable({ ouders, onEditOuder, onDeleteOuder }: OuderManagementTableProps) {
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'NN';
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
            <TableHead>Aantal Kinderen</TableHead>
            <TableHead>Laatste Login</TableHead>
            <TableHead className="text-right w-[80px]">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ouders.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Geen ouders gevonden.
              </TableCell>
            </TableRow>
          )}
          {ouders.map((ouder) => (
            <TableRow key={ouder.id}>
              <TableCell>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={ouder.avatarUrl} alt={ouder.name} data-ai-hint="parent avatar" />
                  <AvatarFallback>{getInitials(ouder.name)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{ouder.name}</TableCell>
              <TableCell>{ouder.email}</TableCell>
              <TableCell>
                <Badge 
                    variant={getStatusBadgeVariant(ouder.status)}
                    className={cn(getStatusBadgeClasses(ouder.status))}
                >
                    {formatStatusText(ouder.status)}
                </Badge>
              </TableCell>
              <TableCell>{ouder.children?.length || 0}</TableCell>
              <TableCell>
                <FormattedDateCell isoDateString={ouder.lastLogin} dateFormatPattern="P" />
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
                    <DropdownMenuItem onClick={() => onEditOuder(ouder)}>
                      <Eye className="mr-2 h-4 w-4" /> Bekijk/Bewerk Profiel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteOuder(ouder)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className="mr-2 h-4 w-4" /> Verwijder
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