// src/components/common/ImageUploader.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { UploadCloud, AlertTriangle, Trash2 } from '@/lib/icons';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  initialImageUrl?: string | null;
  aspectRatio?: string;
  label?: string;
  description?: string;
}

export function ImageUploader({
  onUploadComplete,
  initialImageUrl,
  aspectRatio = 'aspect-[16/9]',
  label = 'Uitgelichte Afbeelding',
  description,
}: ImageUploaderProps) {
  const { isFirebaseConfigured } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(initialImageUrl || null);

  useEffect(() => {
    setCurrentImageUrl(initialImageUrl || null);
  }, [initialImageUrl]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isFirebaseConfigured || !storage) {
        toast({ title: 'Firebase Storage niet geconfigureerd', description: 'Kan geen afbeelding uploaden.', variant: 'destructive' });
        return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Selecteer alstublieft een afbeeldingsbestand.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Bestand is te groot. Maximaal 5MB toegestaan.');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (uploadError) => {
        console.error('Upload Error:', uploadError);
        setError('Upload mislukt. Probeer het opnieuw.');
        setIsUploading(false);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setCurrentImageUrl(url);
          onUploadComplete(url);
          toast({ title: 'Upload Voltooid!', description: 'De afbeelding is succesvol geüpload.' });
        } catch (getUrlError) {
          console.error('Get URL Error:', getUrlError);
          setError('Kon de afbeeldings-URL niet ophalen.');
        } finally {
          setIsUploading(false);
        }
      }
    );
  }, [isFirebaseConfigured, onUploadComplete, toast]);
  
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setCurrentImageUrl(null);
    onUploadComplete('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    toast({ title: 'Afbeelding verwijderd', description: 'De afbeelding is losgekoppeld.' });
  };

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label>{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      
      <div 
        className={cn(
          "w-full relative rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/50 overflow-hidden cursor-pointer",
          aspectRatio
        )}
        onClick={handleTriggerUpload}
      >
        {currentImageUrl ? (
          <Image src={currentImageUrl} alt="Preview" fill style={{ objectFit: 'cover' }} />
        ) : (
          <div className="text-center text-muted-foreground p-4">
            <UploadCloud className="mx-auto h-10 w-10" />
            <p className="mt-2 text-sm font-medium">Klik of sleep om te uploaden</p>
            <p className="text-xs">PNG, JPG, GIF (max 5MB)</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <Button type="button" variant="outline" size="sm" onClick={handleTriggerUpload} disabled={isUploading}>
          <UploadCloud className="mr-2 h-4 w-4" /> {currentImageUrl ? 'Vervang Afbeelding' : 'Kies Afbeelding'}
        </Button>
        {currentImageUrl && (
          <Button type="button" variant="ghost" size="sm" onClick={handleRemoveImage} disabled={isUploading} className="text-destructive hover:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Verwijder
          </Button>
        )}
      </div>

      {isUploading && (
        <div className="space-y-1">
          <Progress value={uploadProgress} />
          <p className="text-xs text-muted-foreground text-center">{Math.round(uploadProgress)}%</p>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" /> {error}
        </p>
      )}

       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}
