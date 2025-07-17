// src/components/common/EditableImage.tsx
'use client';

import Image from 'next/image';
import type { ImageProps } from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit } from '@/lib/icons';
import { ImageUploader } from './ImageUploader';
import { cn } from '@/lib/utils';

interface EditableImageProps extends ImageProps {
  onSave: (newUrl: string) => void | Promise<void>;
  uploadPath: string;
  wrapperClassName?: string;
}

export function EditableImage({ onSave, uploadPath, wrapperClassName, ...props }: EditableImageProps) {
  const { user } = useAuth();
  // Future-proof check: allow both admins and content managers to edit.
  const canEdit = user && ['admin', 'content_manager'].includes(user.role);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const handleUploadComplete = async (url: string) => {
    await onSave(url);
    setIsUploaderOpen(false);
  };

  if (!canEdit) {
    // For non-editors, render a normal Image component in a simple div
    return (
        <div className={wrapperClassName}>
            <Image {...props} />
        </div>
    );
  }

  return (
    <>
      <div className={cn("relative group", wrapperClassName)}>
        <Image {...props} />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <Button onClick={() => setIsUploaderOpen(true)} variant="secondary" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Vervang Afbeelding
          </Button>
        </div>
      </div>
      <Dialog open={isUploaderOpen} onOpenChange={setIsUploaderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Afbeelding Wijzigen</DialogTitle>
          </DialogHeader>
          <ImageUploader 
            onUploadComplete={handleUploadComplete} 
            uploadPath={uploadPath} 
            initialImageUrl={typeof props.src === 'string' ? props.src : undefined}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
