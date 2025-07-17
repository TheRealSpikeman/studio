// src/components/common/ImageUploader.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { UploadCloud, AlertTriangle, Trash2, Library, ImageUp } from '@/lib/icons';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { MediaLibraryDialog } from './MediaLibraryDialog';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  initialImageUrl?: string | null;
  aspectRatio?: string;
  label?: string;
  description?: string;
  uploadPath?: string;
}

export function ImageUploader({
  onUploadComplete,
  initialImageUrl,
  aspectRatio = 'aspect-[16/9]',
  label = 'Uitgelichte Afbeelding',
  description,
  uploadPath = 'images',
}: ImageUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(initialImageUrl || null);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);

  useEffect(() => {
    setCurrentImageUrl(initialImageUrl || null);
  }, [initialImageUrl]);
  
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!storage) {
      toast({ title: 'Firebase Storage niet beschikbaar', description: 'Check je Firebase configuratie.', variant: 'destructive' });
      return;
    }

    if (!file.type.startsWith('image/')) { setError('Selecteer een afbeeldingsbestand.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Bestand te groot. Max 5MB.'); return; }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const fullPath = `${uploadPath}/${fileName}`;
    const storageRef = ref(storage, fullPath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => { setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100); },
      (uploadError) => {
        console.error('Upload Error:', uploadError);
        setError(`Upload mislukt: ${uploadError.message}`);
        setIsUploading(false);
        toast({ title: "Upload Mislukt", description: `Fout: ${uploadError.code}`, variant: "destructive" });
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setCurrentImageUrl(url);
          onUploadComplete(url);
          toast({ title: 'Upload Gelukt!', description: 'Afbeelding succesvol geüpload.' });
        } catch (getUrlError) {
          setError('Kon URL niet ophalen.');
        } finally {
          setIsUploading(false);
        }
      }
    );
  }, [onUploadComplete, toast, uploadPath]);
  
  const handleTriggerUpload = () => { fileInputRef.current?.click(); };
  const handleRemoveImage = () => {
    setCurrentImageUrl(null); onUploadComplete('');
    if (fileInputRef.current) { fileInputRef.current.value = ''; }
    toast({ title: 'Afbeelding verwijderd' });
  };
  
  const handleImageSelectFromLibrary = (url: string) => {
    setCurrentImageUrl(url);
    onUploadComplete(url);
    setIsMediaLibraryOpen(false);
    toast({ title: "Afbeelding geselecteerd", description: "De afbeelding uit de bibliotheek is ingesteld." });
  };

  return (
    <>
      <div className="space-y-2">
        <div className="space-y-1">
          <Label>{label}</Label>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        
        <div className={cn("group relative w-full rounded-lg border-2 border-dashed border-border bg-muted/30 overflow-hidden", aspectRatio)}>
          {currentImageUrl ? (
              <Image src={currentImageUrl} alt="Preview" fill style={{ objectFit: 'cover' }} className="transition-transform duration-300 group-hover:scale-105" />
          ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
                  <ImageUp className="h-10 w-10 text-primary/80 mb-2" />
                  <p className="text-sm font-semibold text-foreground">Sleep afbeelding hier, of kies een optie</p>
              </div>
          )}

           {/* Hover Overlay with Buttons */}
           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 gap-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="button" variant="secondary" onClick={handleTriggerUpload} disabled={isUploading}>
                    <UploadCloud className="mr-2 h-4 w-4" /> {currentImageUrl ? 'Vervang...' : 'Upload...'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsMediaLibraryOpen(true)} disabled={isUploading}>
                    <Library className="mr-2 h-4 w-4" /> Bibliotheek
                </Button>
                {currentImageUrl && (
                  <Button type="button" variant="destructive" size="sm" onClick={handleRemoveImage} disabled={isUploading}>
                      <Trash2 className="mr-2 h-4 w-4" /> Verwijder
                  </Button>
                )}
              </div>
            </div>
        </div>

        {isUploading && (<div className="space-y-1 pt-2"><Progress value={uploadProgress} className="h-2" /><p className="text-xs text-muted-foreground text-center">{Math.round(uploadProgress)}%</p></div>)}
        {error && (<p className="text-sm text-destructive flex items-center gap-2 pt-2"><AlertTriangle className="h-4 w-4" /> {error}</p>)}

        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" disabled={isUploading} />
      </div>

      <MediaLibraryDialog
        isOpen={isMediaLibraryOpen}
        onOpenChange={setIsMediaLibraryOpen}
        onSelectImage={handleImageSelectFromLibrary}
        path={uploadPath}
      />
    </>
  );
}
