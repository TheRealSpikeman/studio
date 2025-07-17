
// src/app/dashboard/admin/tool-management/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Wrench, Search, RefreshCw } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_TOOLS, type Tool } from '@/lib/quiz-data/tools-data';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { ToolTable } from '@/components/admin/tool-management/ToolTable'; // Import the new component

const LOCAL_STORAGE_TOOLS_KEY = 'mindnavigator_tools_v1';

export default function ToolManagementPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);

  useEffect(() => {
    try {
      const storedToolsRaw = localStorage.getItem(LOCAL_STORAGE_TOOLS_KEY);
      if (storedToolsRaw && storedToolsRaw !== 'undefined') {
        const parsedTools: Tool[] = JSON.parse(storedToolsRaw);
        // Migration step: ensure all tools have a status
        const migratedTools = parsedTools.map(tool => ({
            ...tool,
            status: tool.status || 'online' // Default to 'online' if status is missing
        }));
        setTools(migratedTools);
      } else {
        // If there's nothing in storage, initialize with defaults
        setTools(DEFAULT_TOOLS);
        localStorage.setItem(LOCAL_STORAGE_TOOLS_KEY, JSON.stringify(DEFAULT_TOOLS));
      }
    } catch (error) {
      console.error("Error loading tools from localStorage.", error);
      setTools([]);
    }
    setIsLoading(false);
  }, []);

  const handleDeleteTool = () => {
    if (!toolToDelete) return;

    const updatedTools = tools.filter(tool => tool.id !== toolToDelete.id);
    setTools(updatedTools);
    localStorage.setItem(LOCAL_STORAGE_TOOLS_KEY, JSON.stringify(updatedTools));
    toast({
      title: "Tool verwijderd",
      description: `De tool "${toolToDelete.title}" is succesvol verwijderd.`,
    });
    setToolToDelete(null);
  };

  const handleRestoreDefaults = () => {
    const currentTools = [...tools];
    const defaultToolsToAdd = DEFAULT_TOOLS.filter(
        defaultTool => !currentTools.some(currentTool => currentTool.id === defaultTool.id)
    );

    if (defaultToolsToAdd.length === 0) {
        toast({ title: "Geen actie nodig", description: "Alle standaard tools zijn al aanwezig in uw lijst." });
        return;
    }

    const mergedTools = [...currentTools, ...defaultToolsToAdd].sort((a,b) => a.title.localeCompare(b.title));
    setTools(mergedTools);
    localStorage.setItem(LOCAL_STORAGE_TOOLS_KEY, JSON.stringify(mergedTools));
    toast({ title: "Standaard Tools Hersteld", description: `${defaultToolsToAdd.length} standaard tool(s) zijn toegevoegd aan de lijst.` });
  };

  const filteredTools = useMemo(() => tools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  ), [tools, searchTerm]);

  if (isLoading) {
    return <div className="p-8 text-center">Tools laden...</div>;
  }

  return (
    <>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Wrench className="h-6 w-6 text-primary" />
                  Toolbeheer
                </CardTitle>
                <CardDescription>
                  Beheer hier de tools die aanbevolen worden aan gebruikers.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                 <Button onClick={handleRestoreDefaults} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" /> Herstel Standaard Tools
                </Button>
                <Button asChild>
                    <Link href="/dashboard/admin/tool-management/new">
                    <PlusCircle className="mr-2 h-4 w-4" /> Nieuwe Tool Toevoegen
                    </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Zoek tool..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <ToolTable
              tools={filteredTools}
              onDelete={setToolToDelete}
            />
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!toolToDelete} onOpenChange={(isOpen) => !isOpen && setToolToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Dit zal de tool "{toolToDelete?.title}" permanent verwijderen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTool}
              className="bg-destructive hover:bg-destructive/90"
            >
              Ja, verwijder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
