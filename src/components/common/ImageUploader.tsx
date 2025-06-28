// src/components/common/ImageUploader.tsx
'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { UploadCloud, Copy, CheckCircle, AlertTriangle } from '@/lib/icons';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  initialImageUrl?: string | null;
}

export function ImageUploader({ onUploadComplete, initialImageUrl }: ImageUploaderProps) {
  const { isFirebaseConfigured } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(initialImageUrl || null);

  const handleFileSelect = () => {
    if (!isFirebaseConfigured) {
      toast({ title: 'Firebase niet geconfigureerd', description: 'Kan geen afbeelding uploaden.', variant: 'destructive' });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Selecteer alstublieft een afbeeldingsbestand.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Bestand is te groot. Maximaal 5MB toegestaan.');
        return;
      }
      setError(null);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      handleUpload(file);
      
      // Clean up the object URL after the component unmounts or a new file is selected
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `blog-images/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (uploadError) => {
        console.error('Upload Error:', uploadError);
        setError('Upload mislukt. Probeer het opnieuw.');
        setIsUploading(false);
        setPreviewUrl(initialImageUrl || null);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setDownloadUrl(url);
          onUploadComplete(url);
          setIsUploading(false);
          toast({ title: 'Upload Voltooid!', description: 'De afbeelding is succesvol geüpload.' });
        } catch (getUrlError) {
          console.error('Get URL Error:', getUrlError);
          setError('Kon de afbeeldings-URL niet ophalen.');
          setIsUploading(false);
        }
      }
    );
  };
  
  const handleCopyToClipboard = () => {
    if (downloadUrl) {
      navigator.clipboard.writeText(downloadUrl);
      toast({ title: 'URL Gekopieerd!', description: 'De afbeeldingslink is naar het klembord gekopieerd.' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uitgelichte Afbeelding</CardTitle>
        <CardDescription>Upload hier de hoofdafbeelding voor je blogpost.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="w-full aspect-[16/9] relative rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/50 overflow-hidden cursor-pointer"
          onClick={handleFileSelect}
        >
          {previewUrl ? (
            <Image src={previewUrl} alt="Preview" fill style={{ objectFit: 'cover' }} />
          ) : (
            <div className="text-center text-muted-foreground">
              <UploadCloud className="mx-auto h-12 w-12" />
              <p>Klik om te selecteren of sleep een afbeelding hierheen</p>
              <p className="text-xs">PNG, JPG, GIF tot 5MB</p>
            </div>
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

        {isUploading && (
          <div className="space-y-1">
            <Progress value={uploadProgress} />
            <p className="text-xs text-muted-foreground text-center">{Math.round(uploadProgress)}% geüpload...</p>
          </div>
        )}

        {error && (
          <div className="text-sm text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {downloadUrl && !isUploading && (
          <div className="space-y-2">
            <Label htmlFor="image-url">Geüploade URL</Label>
            <div className="flex items-center gap-2">
              <Input id="image-url" value={downloadUrl} readOnly />
              <Button type="button" variant="outline" size="icon" onClick={handleCopyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Upload voltooid. De URL is automatisch ingevuld in het formulier.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
