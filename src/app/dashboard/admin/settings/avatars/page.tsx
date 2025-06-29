// src/app/dashboard/admin/settings/avatars/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ImageUp, Trash2, PlusCircle, Save, Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ImageUploader } from '@/components/common/ImageUploader';

interface PredefinedAvatar {
  id: string;
  src: string;
  alt: string;
  hint: string;
}

const defaultPredefinedAvatars: PredefinedAvatar[] = [
  { id: 'avatar1', src: 'https://placehold.co/80x80.png?text=A1', alt: 'Abstract Geometrisch', hint: 'abstract geometric' },
  { id: 'avatar2', src: 'https://placehold.co/80x80.png?text=A2', alt: 'Natuur', hint: 'nature landscape' },
  { id: 'avatar3', src: 'https://placehold.co/80x80.png?text=A3', alt: 'Dier', hint: 'animal portrait' },
  { id: 'avatar4', src: 'https://placehold.co/80x80.png?text=A4', alt: 'Ruimte', hint: 'space galaxy' },
  { id: 'avatar5', src: 'https://placehold.co/80x80.png?text=A5', alt: 'Stad', hint: 'city skyline' },
  { id: 'avatar6', src: 'https://placehold.co/80x80.png?text=A6', alt: 'Eten', hint: 'food delicious' },
];

const LOCAL_STORAGE_AVATARS_KEY = 'mindnavigator_predefined_avatars';

export default function AvatarManagementPage() {
  const [avatars, setAvatars] = useState<PredefinedAvatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAvatar, setNewAvatar] = useState({ src: '', alt: '', hint: '' });
  const { toast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_AVATARS_KEY);
      if (stored) {
        setAvatars(JSON.parse(stored));
      } else {
        setAvatars(defaultPredefinedAvatars);
      }
    } catch (e) {
      console.error(e);
      setAvatars(defaultPredefinedAvatars);
    }
    setIsLoading(false);
  }, []);

  const saveAvatars = (newAvatars: PredefinedAvatar[]) => {
    setAvatars(newAvatars);
    localStorage.setItem(LOCAL_STORAGE_AVATARS_KEY, JSON.stringify(newAvatars));
  };

  const handleAddAvatar = () => {
    if (!newAvatar.src || !newAvatar.alt || !newAvatar.hint) {
      toast({ title: "Fout", description: "Alle velden zijn verplicht.", variant: "destructive" });
      return;
    }
    const newAvatars = [...avatars, { ...newAvatar, id: `avatar-${Date.now()}` }];
    saveAvatars(newAvatars);
    setNewAvatar({ src: '', alt: '', hint: '' }); // Reset form
    toast({ title: "Avatar Toegevoegd", description: "De nieuwe standaard avatar is opgeslagen." });
  };

  const handleRemoveAvatar = (id: string) => {
    const newAvatars = avatars.filter(a => a.id !== id);
    saveAvatars(newAvatars);
    toast({ title: "Avatar Verwijderd", description: "De avatar is verwijderd uit de standaard selectie." });
  };
  
  if (isLoading) {
    return <div className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Laden...</span></div>;
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <ImageUp className="h-8 w-8 text-primary" />
                Beheer Standaard Avatars
            </h1>
            <Button variant="outline" asChild>
                <Link href="/dashboard/admin/settings">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Instellingen
                </Link>
            </Button>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Huidige Selectie</CardTitle>
          <CardDescription>Beheer hier de avatars die leerlingen en ouders kunnen kiezen voor hun profiel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {avatars.map(avatar => (
              <div key={avatar.id} className="relative group">
                <Image src={avatar.src} alt={avatar.alt} width={80} height={80} className="rounded-md object-cover aspect-square" data-ai-hint={avatar.hint} />
                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveAvatar(avatar.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
                <div className="text-xs text-muted-foreground truncate mt-1" title={avatar.alt}>{avatar.alt}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><PlusCircle className="h-5 w-5"/>Nieuwe Avatar Toevoegen</CardTitle>
          <CardDescription>Upload een nieuwe afbeelding. Vul daarna de details in en voeg de avatar toe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <ImageUploader 
             onUploadComplete={(url) => setNewAvatar(p => ({ ...p, src: url }))}
             uploadPath="images/avatars/"
             aspectRatio="aspect-square"
             label="1. Avatar Afbeelding"
             description="Upload een vierkante afbeelding. De URL wordt automatisch ingevuld."
           />
           
           <div className="space-y-4 pt-4 border-t">
              <h4 className="text-sm font-semibold">2. Avatar Details</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="new-avatar-alt">Alt Tekst</Label>
                        <Input id="new-avatar-alt" value={newAvatar.alt} onChange={(e) => setNewAvatar(p => ({...p, alt: e.target.value}))} placeholder="Korte omschrijving"/>
                    </div>
                    <div>
                        <Label htmlFor="new-avatar-hint">AI Hint</Label>
                        <Input id="new-avatar-hint" value={newAvatar.hint} onChange={(e) => setNewAvatar(p => ({...p, hint: e.target.value}))} placeholder="Trefwoorden voor AI"/>
                    </div>
               </div>
           </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddAvatar} disabled={!newAvatar.src || !newAvatar.alt || !newAvatar.hint}>
            <Save className="mr-2 h-4 w-4"/>
            Voeg Avatar toe aan lijst
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
