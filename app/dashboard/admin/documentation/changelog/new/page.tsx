// app/dashboard/admin/documentation/changelog/new/page.tsx
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';

import { generateChangelogDraft, submitChangelogEntry } from '../../../../../actions/changelogActions';
import type { GenerateChangelogDraftResult } from '../../../../../actions/changelogActions';

// Define the type for the form data explicitly
type ChangelogFormData = {
    title: string;
    description: string;
    details: string[];
    tags: string[];
};

export default function NewChangelogPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<ChangelogFormData | null>(null);
    const [diff, setDiff] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    
    const { toast } = useToast();
    const router = useRouter();

    const handleGenerateDraft = async () => {
        setIsLoading(true);
        setError(undefined);
        setFormData(null);
        setDiff(undefined);
        
        const result = await generateChangelogDraft();

        if (result.success && result.draft) {
            setFormData(result.draft);
            setDiff(result.diff);
            toast({ title: "Concept gegenereerd!", description: "De AI heeft een concept voor je klaargezet.", variant: 'success' });
        } else {
            setError(result.error || 'Er is een onbekende fout opgetreden.');
            setDiff(result.diff);
            toast({ title: "Fout bij genereren", description: result.error, variant: 'destructive' });
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        
        setIsSubmitting(true);
        const result = await submitChangelogEntry(formData);
        setIsSubmitting(false);

        if (result.success) {
            toast({ title: "Publicatie Gelukt!", description: "De nieuwe changelog entry is succesvol opgeslagen.", variant: 'success' });
            router.push('/dashboard/admin/documentation/changelog');
        } else {
            toast({ title: "Publicatie Mislukt", description: result.error, variant: 'destructive' });
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wand2 className="text-primary" /> AI-Ondersteunde Changelog Generator
                    </CardTitle>
                    <CardDescription>
                        Genereer automatisch een concept voor een nieuwe changelog entry op basis van de meest recente codewijzigingen.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleGenerateDraft} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyseren...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" /> Genereer Concept
                            </>
                        )}
                    </Button>
                    {error && !formData && (
                        <div className="mt-4 text-red-500 bg-red-100 p-3 rounded-md">
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {formData && (
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Bewerk en Publiceer Concept</CardTitle>
                            <CardDescription>
                                Pas de door de AI gegenereerde tekst aan en voeg de entry toe aan de publieke changelog.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Titel</Label>
                                <Input 
                                    id="title" 
                                    value={formData.title} 
                                    onChange={e => setFormData({ ...formData, title: e.target.value })} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Beschrijving</Label>
                                <Textarea 
                                    id="description" 
                                    value={formData.description} 
                                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="details">Details (één per regel)</Label>
                                <Textarea 
                                    id="details" 
                                    value={formData.details.join('\n')} 
                                    onChange={e => setFormData({ 
                                        ...formData, 
                                        details: e.target.value.split('\n') 
                                    })} 
                                    rows={5} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags (komma-gescheiden)</Label>
                                <Input 
                                    id="tags" 
                                    value={formData.tags.join(', ')} 
                                    onChange={e => setFormData({ 
                                        ...formData, 
                                        tags: e.target.value.split(',').map(t => t.trim()) 
                                    })} 
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.tags?.map(tag => tag && (
                                        <Badge key={tag}>{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publiceren...
                                    </>
                                ) : (
                                    "Publiceer Entry"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            )}
            
            {diff && (
                <Card>
                    <CardHeader>
                        <CardTitle>Gedetecteerde Wijzigingen (Diff)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto text-xs">
                            <code>{diff}</code>
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}