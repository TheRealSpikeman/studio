// src/components/common/MediaLibraryDialog.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { storage } from '@/lib/firebase';
import { ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertTriangle, FolderOpen, Trash2 } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface MediaLibraryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectImage: (url: string) => void;
  path: string; // The initial path to open
}

interface MediaFile {
  url: string;
  name: string;
}

const BROWSABLE_FOLDERS = ['images', 'images/quizzes', 'images/blog', 'images/avatars', 'images/website'];
const ITEMS_PER_PAGE = 12; // 2 rows of 6

export function MediaLibraryDialog({ isOpen, onOpenChange, onSelectImage, path }: MediaLibraryDialogProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState(path);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageToDelete, setImageToDelete] = useState<MediaFile | null>(null);

  // When the dialog opens, reset the current path to the initial path provided.
  useEffect(() => {
    if (isOpen) {
      setCurrentPath(path);
    }
  }, [isOpen, path]);

  const fetchImages = useCallback(async (folderPath: string) => {
    setIsLoading(true);
    setError(null);
    setImages([]);
    setCurrentPage(1); // Reset page on new folder selection
    try {
      if (!storage) {
        throw new Error("Firebase Storage is niet geconfigureerd.");
      }
      const folderRef = ref(storage, folderPath);
      const res = await listAll(folderRef);
      const urlPromises = res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return { url, name: itemRef.name };
      });
      const fetchedImages = await Promise.all(urlPromises);
      setImages(fetchedImages.reverse()); // Show newest first
    } catch (e: any) {
      console.error(`Fout bij het laden van mediabibliotheek voor pad ${folderPath}:`, e);
      setError(`Kon afbeeldingen niet laden uit ${folderPath}. Controleer de storage permissies.`);
      toast({
        title: "Laden Mislukt",
        description: e.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch images when the dialog opens or when the current path changes.
  useEffect(() => {
    if (isOpen) {
      fetchImages(currentPath);
    }
  }, [isOpen, currentPath, fetchImages]);


  const handleImageSelect = (url: string) => {
    onSelectImage(url);
    onOpenChange(false);
  };
  
  const handleDeleteClick = (image: MediaFile, e: React.MouseEvent) => {
    e.stopPropagation(); // Voorkom dat de afbeelding ook wordt geselecteerd
    setImageToDelete(image);
  };

  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;
    try {
      const imageRef = ref(storage, imageToDelete.url);
      await deleteObject(imageRef);
      
      setImages(prev => prev.filter(img => img.url !== imageToDelete.url));
      
      toast({
        title: "Afbeelding Verwijderd",
        description: `"${imageToDelete.name}" is permanent verwijderd.`
      });
    } catch (e: any) {
        console.error("Fout bij verwijderen afbeelding:", e);
        toast({
            title: "Verwijderen Mislukt",
            description: e.message,
            variant: "destructive"
        });
    } finally {
        setImageToDelete(null);
    }
  };


  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);
  const paginatedImages = useMemo(() => {
    return images.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
  }, [images, currentPage]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Mediabibliotheek</DialogTitle>
            <DialogDescription>
              Selecteer een reeds geüploade afbeelding. Huidige map: <code className="bg-muted px-1 py-0.5 rounded text-xs">{currentPath}</code>
            </DialogDescription>
          </DialogHeader>

          {/* Folder browser section */}
          <div className="flex-shrink-0 pt-4 space-y-2 border-t">
            <Label className="text-sm font-medium text-muted-foreground">Blader door mappen:</Label>
            <div className="flex flex-wrap gap-2">
              {BROWSABLE_FOLDERS.sort().map(folder => (
                  <Button
                      key={folder}
                      variant={currentPath === folder ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPath(folder)}
                  >
                      {folder}
                  </Button>
              ))}
            </div>
          </div>
          
          {/* Main content area */}
          <div className="py-4 min-h-[220px] overflow-y-auto flex-1">
            {isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-md" />
                ))}
              </div>
            )}
            {error && (
              <div className="text-center text-destructive flex flex-col items-center justify-center h-48">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p>{error}</p>
              </div>
            )}
            {!isLoading && !error && images.length === 0 && (
              <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-48">
                <FolderOpen className="h-8 w-8 mb-2" />
                <p>Geen afbeeldingen gevonden in deze map.</p>
              </div>
            )}
            {!isLoading && !error && paginatedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {paginatedImages.map((image) => (
                  <div key={image.url} className="relative aspect-square group">
                    <button
                      onClick={() => handleImageSelect(image.url)}
                      className="w-full h-full rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        sizes="(max-width: 768px) 33vw, 16vw"
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs text-center p-1">Selecteer</span>
                      </div>
                    </button>
                     <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        onClick={(e) => handleDeleteClick(image, e)}
                        aria-label={`Verwijder ${image.name}`}
                     >
                        <Trash2 className="h-3 w-3" />
                     </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination controls */}
          <DialogFooter className="pt-4 border-t flex-shrink-0">
            <div className="flex items-center justify-center gap-4 w-full">
                {totalPages > 1 ? (
                    <>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                        Vorige
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Pagina {currentPage} van {totalPages}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages}>
                        Volgende
                    </Button>
                    </>
                ) : (
                    <span className="text-sm text-muted-foreground">
                        {images.length} afbeelding{images.length !== 1 ? 'en' : ''}
                    </span>
                )}
            </div>
            <DialogClose asChild>
                <Button variant="secondary" className="absolute right-6 bottom-6">Sluiten</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Afbeelding Verwijderen?</AlertDialogTitle>
            <AlertDialogDescription>
              Weet u zeker dat u de afbeelding "<strong>{imageToDelete?.name}</strong>" permanent wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
                Ja, verwijder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
