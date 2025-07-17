// src/components/admin/user-management/UserDeleteAlertDialog.tsx
"use client";

import type { User } from '@/types/user';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface UserDeleteAlertDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  dialogTitle: string;
  dialogDescription: React.ReactNode;
  confirmButtonText: string;
  confirmButtonVariant?: 'default' | 'destructive';
  onConfirm: () => void; // Changed from onConfirmDelete to generic onConfirm
}

export function UserDeleteAlertDialog({ 
  isOpen, 
  onOpenChange, 
  dialogTitle,
  dialogDescription,
  confirmButtonText,
  confirmButtonVariant = 'destructive',
  onConfirm 
}: UserDeleteAlertDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialogDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Annuleren</Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} asChild>
            <Button variant={confirmButtonVariant}>{confirmButtonText}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
