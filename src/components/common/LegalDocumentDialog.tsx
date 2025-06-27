// src/components/common/LegalDocumentDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface LegalDocumentDialogProps {
  triggerNode: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export function LegalDocumentDialog({ triggerNode, title, children }: LegalDocumentDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerNode}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl">{title}</DialogTitle>
        </DialogHeader>
        {/* This div is now the scrollable container */}
        <div className="flex-1 overflow-y-auto pr-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
             {children}
          </div>
        </div>
        <DialogFooter className="pt-4 border-t flex-shrink-0">
          <DialogClose asChild>
            <Button type="button">Sluiten</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
