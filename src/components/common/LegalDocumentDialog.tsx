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
import { ScrollArea } from "@/components/ui/scroll-area"
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
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          {/* Added padding to the inner div to prevent text from touching the scrollbar */}
          <div className="pr-4">
            {children}
          </div>
        </ScrollArea>
        <DialogFooter className="mt-4 pt-4 border-t">
          <DialogClose asChild>
            <Button type="button">Sluiten</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
