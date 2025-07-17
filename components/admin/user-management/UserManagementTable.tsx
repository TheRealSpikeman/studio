// components/admin/user-management/UserManagementTable.tsx
"use client";

import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { User, UserStatus } from "@/types/user";
import { format } from 'date-fns';

interface UserManagementTableProps {
  users: User[];
}

const getStatusVariant = (status: UserStatus): BadgeProps['variant'] => {
  switch (status) {
    case 'actief': return 'success';
    case 'niet geverifieerd':
    case 'pending_onboarding':
    case 'pending_approval':
    case 'wacht_op_ouder_goedkeuring': return 'warning';
    case 'geblokkeerd':
    case 'rejected': return 'destructive';
    default: return 'secondary';
  }
};

export const UserManagementTable = ({ users }: UserManagementTableProps) => {
  const router = useRouter();

  const handleEdit = (userId: string) => {
    router.push(`/dashboard/admin/user-management/edit/${userId}`);
  };

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      console.log(`Simulating delete for user: ${userId}`);
      // In a real app: await deleteUserAction(userId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alle Gebruikers</CardTitle>
        <CardDescription>
          Een overzicht van alle gebruikers in het systeem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gebruiker</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Lid Sinds</TableHead>
              <TableHead>Laatst Actief</TableHead>
              <TableHead className="text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-semibold">{user.name}</span>
                    {user.email && <span className="text-sm text-muted-foreground">{user.email}</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), 'dd-MM-yyyy')}
                </TableCell>
                <TableCell>
                  {format(new Date(user.lastLogin), 'dd-MM-yyyy HH:mm')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                        Bewerken
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-red-600">
                        Verwijderen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
