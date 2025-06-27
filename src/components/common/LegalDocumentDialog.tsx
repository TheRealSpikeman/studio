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
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl">{title}</DialogTitle>
        </DialogHeader>
        {/* The key is min-h-0 which allows the flex item to shrink below its content size */}
        <ScrollArea className="flex-grow min-h-0">
          <div className="pr-4">
            {children}
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4 border-t flex-shrink-0">
          <DialogClose asChild>
            <Button type="button">Sluiten</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
