// src/app/dashboard/admin/blog/tags/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Adjust the import path as needed
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Save, Loader2, ArrowLeft, ListChecks, Star } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { blogTagConfig, type BlogTagCategories } from '@/config/blog-tags'; // Adjust the import path as needed
import { updateBlogTagConfigFile } from '@/app/actions/blogActions';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils';

export default function BlogTagManagementPage() {
  const { toast } = useToast();
  const [tags, setTags] = useState<BlogTagCategories>(blogTagConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [selectedCategoryForNewTag, setSelectedCategoryForNewTag] = useState('');

  useEffect(() => {
    if (Object.keys(tags).length > 0 && !selectedCategoryForNewTag) {
        setSelectedCategoryForNewTag(Object.keys(tags)[0]);
    }
  }, [tags, selectedCategoryForNewTag]);

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !tags[newCategoryName.trim()]) {
      setTags(prev => ({ ...prev, [newCategoryName.trim()]: [] }));
      setNewCategoryName('');
      toast({ title: "Categorie Toegevoegd", description: `"${newCategoryName.trim()}" is toegevoegd.` });
    } else {
      toast({ title: "Fout", description: "Categorie bestaat al of naam is leeg.", variant: "destructive" });
    }
  };

  const handleAddTag = () => {
    if (newTagName.trim() && selectedCategoryForNewTag) {
      if (tags[selectedCategoryForNewTag].includes(newTagName.trim())) {
        toast({ title: "Tag bestaat al", description: "Deze tag zit al in deze categorie.", variant: "destructive" });
        return;
      }
      setTags(prev => ({
        ...prev,
        [selectedCategoryForNewTag]: [...prev[selectedCategoryForNewTag], newTagName.trim()],
      }));
      setNewTagName('');
    } else {
       toast({ title: "Invoer ongeldig", description: "Tag naam is leeg of geen categorie geselecteerd.", variant: "destructive" });
    }
  };
  
  const handleRemoveTag = (category: string, tagToRemove: string) => {
    setTags(prev => ({
      ...prev,
      [category]: prev[category].filter(tag => tag !== tagToRemove),
    }));
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    const { [categoryToRemove]: _, ...rest } = tags;
    setTags(rest);
    toast({ title: "Categorie Verwijderd", description: `Categorie "${categoryToRemove}" en bijbehorende tags zijn verwijderd.` });
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateBlogTagConfigFile(tags);
    if (result.success) {
      toast({ title: "Configuratie Opgeslagen!", description: "De wijzigingen zijn direct zichtbaar voor de AI-assistent." });
    } else {
      toast({ title: "Fout!", description: `Kon configuratie niet opslaan: ${result.error}`, variant: "destructive" });
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <ListChecks className="h-8 w-8 text-primary" />
                Beheer Blog Tags
            </h1>
            <Button variant="outline" asChild>
                <Link href="/dashboard/admin/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar Blogbeheer
                </Link>
            </Button>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Bestaande Tags per Categorie</CardTitle>
                <CardDescription>
                    Dit is de centrale lijst met goedgekeurde tags die de AI mag gebruiken. Categorieën met een <Star className="inline-block h-4 w-4 text-amber-500" /> zijn essentieel voor een goede vindbaarheid en filtering.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {Object.entries(tags).map(([category, tagList]) => {
                    const isRequiredCategory = category === "Hoofdonderwerpen" || category === "Doelgroep";
                    return (
                        <div key={category} className={cn("p-4 border rounded-md", isRequiredCategory ? "bg-primary/10 border-primary/20" : "bg-muted/30")}>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className={cn("font-semibold text-lg flex items-center gap-2", isRequiredCategory ? "text-primary" : "text-foreground")}>
                                     {isRequiredCategory && <Star className="h-4 w-4 text-amber-500 fill-amber-400" />}
                                    {category}
                                </h3>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleRemoveCategory(category)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tagList.map(tag => (
                                    <div key={tag} className="flex items-center gap-1 bg-background border pl-2 pr-1 py-0.5 rounded-full">
                                        <span className="text-sm">{tag}</span>
                                        <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full text-muted-foreground hover:text-destructive" onClick={() => handleRemoveTag(category, tag)}><Trash2 className="h-3 w-3" /></Button>
                                    </div>
                                ))}
                                {tagList.length === 0 && <p className="text-xs text-muted-foreground italic">Geen tags in deze categorie.</p>}
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                 <CardHeader><CardTitle>Nieuwe Tag Toevoegen</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                     <div>
                         <Label htmlFor="select-category">Aan Categorie</Label>
                         <Select value={selectedCategoryForNewTag} onValueChange={setSelectedCategoryForNewTag}>
                            <SelectTrigger id="select-category"><SelectValue placeholder="Kies een categorie..."/></SelectTrigger>
                            <SelectContent>{Object.keys(tags).map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                         </Select>
                     </div>
                     <div>
                         <Label htmlFor="new-tag-name">Tag Naam (één woord, kleine letters)</Label>
                         <Input id="new-tag-name" value={newTagName} onChange={e => setNewTagName(e.target.value.toLowerCase().trim())} placeholder="bijv. planning" />
                     </div>
                     <Button onClick={handleAddTag}><Plus className="mr-2 h-4 w-4"/> Voeg Tag Toe</Button>
                 </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Nieuwe Categorie Toevoegen</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="new-category-name">Categorie Naam</Label>
                        <Input id="new-category-name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="bijv. Nieuwe Onderwerpen"/>
                    </div>
                    <Button onClick={handleAddCategory}><Plus className="mr-2 h-4 w-4"/> Voeg Categorie Toe</Button>
                </CardContent>
            </Card>
        </div>
        
        <div className="flex justify-end pt-4 border-t">
            <Button size="lg" onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                <Save className="mr-2 h-4 w-4"/> Configuratie Opslaan
            </Button>
        </div>
    </div>
  );
}
