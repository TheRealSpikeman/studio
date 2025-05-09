// src/components/admin/user-management/UserDeleteAlertDialog.tsx
"use client";

import type { User } from '@/types/user';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface UserDeleteAlertDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: User | null;
  onConfirmDelete: () => void;
}

export function UserDeleteAlertDialog({ isOpen, onOpenChange, user, onConfirmDelete }: UserDeleteAlertDialogProps) {
  if (!user) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Gebruiker Verwijderen</AlertDialogTitle>
          <AlertDialogDescription>
            Weet je zeker dat je gebruiker <strong>{user.name}</strong> ({user.email}) wilt verwijderen? Deze actie is onomkeerbaar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Annuleren</Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmDelete} asChild>
            <Button variant="destructive">Verwijderen</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
